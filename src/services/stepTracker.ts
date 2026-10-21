/**
 * Step tracker singleton.
 *
 * Step sources, in order of preference:
 *  1. Health Connect (Android) — reads the day's total from midnight, so steps
 *     walked before the app was opened still count. Re-read when the app
 *     comes to the foreground and every SYNC_INTERVAL_MS while it is open.
 *  2. The hardware step counter via the NativeStepCounter TurboModule —
 *     only counts from the first app open of the day.
 *  3. Manual mode — dev builds only (emulators have no step data); release
 *     builds show "unavailable" instead so coins can't be farmed.
 *
 * Reaching DAILY_STEP_GOAL unlocks DAILY_GOAL_COINS, which the user claims
 * (after a rewarded ad) via claimStepGoal(). Unclaimed coins expire when the
 * day ends. Everything is persisted with AsyncStorage, and subscribers (see
 * useStepTracker) are notified whenever the snapshot changes.
 */
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import type { EventSubscription, NativeEventSubscription } from 'react-native';
import { DAILY_GOAL_COINS, DAILY_STEP_GOAL } from '../config/rewards';
import NativeStepCounter from '../specs/NativeStepCounter';
import type {
  HealthConnectStatus,
  StepHistory,
  StepSnapshot,
  StepSource,
  StepState,
} from '../types/steps';
import { connectHealthConnect, readStepTotal } from './healthConnect';
import {
  addManualSteps,
  applyDayTotal,
  applySensorReading,
  emptyStepState,
  goalProgress,
  localDateKey,
  claimGoalReward,
  startOfLocalDay,
  stepsToGoal,
} from './stepMath';
import {
  loadStepHistory,
  loadStepState,
  saveStepHistory,
  saveStepState,
} from './stepStorage';
import { walletStore } from './wallet';

type Listener = (snapshot: StepSnapshot) => void;

const SYNC_INTERVAL_MS = 60_000;
const GOAL_REASON = `Daily step goal: ${DAILY_STEP_GOAL.toLocaleString(
  'en-IN',
)} steps`;

class StepTracker {
  private state: StepState = emptyStepState(localDateKey());
  private history: StepHistory = {};
  private source: StepSource = 'connecting';
  private healthConnect: HealthConnectStatus = 'unsupported';
  private lastSyncedAt: string | null = null;
  private ready = false;
  private listeners = new Set<Listener>();
  private sensorSub: EventSubscription | null = null;
  private appStateSub: NativeEventSubscription | null = null;
  private syncTimer: ReturnType<typeof setInterval> | null = null;
  private syncing: Promise<void> | null = null;
  private startPromise: Promise<void> | null = null;
  // Serialise persistence so rapid sensor events can't interleave writes.
  private persistQueue: Promise<void> = Promise.resolve();

  constructor() {
    // Re-emit whenever the wallet changes from any source (e.g. streak bonus).
    walletStore.subscribe(() => {
      if (this.ready) this.emit();
    });
  }

  /** Load persisted data and begin tracking. Idempotent. */
  start(): Promise<void> {
    if (!this.startPromise) {
      this.startPromise = this.init().catch(err => {
        this.startPromise = null;
        throw err;
      });
    }
    return this.startPromise;
  }

  private async init() {
    const [savedState, history] = await Promise.all([
      loadStepState(),
      loadStepHistory(),
      walletStore.load(),
    ]);
    this.history = history;
    this.state = savedState ?? emptyStepState(localDateKey());
    this.ready = true;
    this.emit();

    this.healthConnect = await connectHealthConnect(true);
    if (this.healthConnect === 'connected') {
      await this.useHealthConnect();
    } else {
      await this.rolloverIfNewDay();
      await this.attachSensor();
    }
    this.emit();
  }

  /**
   * Retry Health Connect after the user installs it or changes their mind
   * about the permission (shown as a button on the steps card).
   */
  async connectHealthConnect(): Promise<void> {
    this.healthConnect = await connectHealthConnect(true);
    if (this.healthConnect === 'connected' && this.source !== 'healthConnect') {
      this.stopSensor();
      await this.useHealthConnect();
    }
    this.emit();
  }

  // ── Health Connect ──────────────────────────────────────────────────────────

  private async useHealthConnect() {
    this.source = 'healthConnect';
    await this.syncHealthConnect();
    this.syncTimer = setInterval(
      () => this.syncHealthConnect(),
      SYNC_INTERVAL_MS,
    );
    this.appStateSub = AppState.addEventListener('change', next => {
      if (next === 'active') this.syncHealthConnect();
    });
  }

  /** Re-read today's total from Health Connect. Concurrent calls share one read. */
  syncHealthConnect(): Promise<void> {
    if (this.source !== 'healthConnect') return Promise.resolve();
    if (!this.syncing) {
      this.syncing = this.readHealthConnect().finally(() => {
        this.syncing = null;
      });
    }
    return this.syncing;
  }

  private async readHealthConnect() {
    try {
      const today = localDateKey();
      if (this.state.date !== today) {
        // The app was closed when the last day ended: read that day's full
        // total for the history. Its unclaimed reward has expired.
        const closed = this.state;
        const total = await readStepTotal(
          startOfLocalDay(closed.date),
          startOfLocalDay(today),
        );
        this.archiveDay(applyDayTotal(closed, total, closed.date));
        this.state = emptyStepState(today);
      }
      const total = await readStepTotal(startOfLocalDay(today), new Date());
      this.state = applyDayTotal(this.state, total, today);
      this.lastSyncedAt = new Date().toISOString();
      this.afterStepChange();
    } catch {
      // Permission revoked from Health Connect settings, or a transient error.
      // Re-check without prompting; keep showing the last known steps.
      this.healthConnect = await connectHealthConnect(false);
      this.emit();
    }
  }

  // ── Phone sensor / manual fallback ─────────────────────────────────────────

  private async attachSensor() {
    const fallback: StepSource = __DEV__ ? 'manual' : 'unavailable';
    if (!NativeStepCounter || !(await NativeStepCounter.isAvailable())) {
      this.source = fallback;
      return;
    }
    if (!(await requestActivityPermission())) {
      this.source = fallback;
      return;
    }
    this.sensorSub = NativeStepCounter.onStepUpdate(({ sensorSteps }) => {
      this.handleSensor(sensorSteps);
    });
    NativeStepCounter.start();
    this.source = 'sensor';
  }

  private stopSensor() {
    this.sensorSub?.remove();
    this.sensorSub = null;
    NativeStepCounter?.stop();
  }

  stop() {
    this.stopSensor();
    if (this.syncTimer) clearInterval(this.syncTimer);
    this.syncTimer = null;
    this.appStateSub?.remove();
    this.appStateSub = null;
  }

  private handleSensor(sensorSteps: number) {
    const today = localDateKey();
    if (this.state.date !== today) {
      this.archiveDay(this.state);
    }
    this.state = applySensorReading(this.state, sensorSteps, today);
    this.afterStepChange();
  }

  /** Manually add steps (dev builds on emulators without step data). */
  addSteps(count: number) {
    if (!__DEV__) return;
    if (this.state.date !== localDateKey()) {
      this.archiveDay(this.state);
    }
    this.state = addManualSteps(this.state, count, localDateKey());
    this.afterStepChange();
  }

  /** If the stored state is from a previous day, archive it and start fresh. */
  private async rolloverIfNewDay() {
    const today = localDateKey();
    if (this.state.date === today) return;
    this.archiveDay(this.state);
    this.state = emptyStepState(today);
    this.persist();
  }

  private archiveDay(state: StepState) {
    if (state.steps > 0) {
      this.history = { ...this.history, [state.date]: state.steps };
    }
  }

  // ── Rewards / persistence ──────────────────────────────────────────────────

  /**
   * Pay today's step-goal coins if the goal is reached and still unclaimed.
   * Call only after the rewarded ad (or when no ad was available).
   * Returns the coins paid (0 if nothing was claimable).
   */
  claimStepGoal(): number {
    if (this.state.date !== localDateKey()) return 0; // yesterday's expired
    const { state, coinsEarned } = claimGoalReward(this.state);
    if (coinsEarned === 0) return 0;
    this.state = state;
    walletStore.credit(coinsEarned, GOAL_REASON);
    this.persist();
    this.emit();
    return coinsEarned;
  }

  private afterStepChange() {
    this.persist();
    this.emit();
  }

  private persist() {
    const state = this.state;
    const history = this.history;
    this.persistQueue = this.persistQueue
      .then(async () => {
        await saveStepState(state);
        await saveStepHistory(history);
      })
      .catch(() => {
        /* storage failures must never crash the tracker */
      });
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  snapshot(): StepSnapshot {
    // A state left over from a previous day shows as 0 until it is rolled over.
    const isToday = this.state.date === localDateKey();
    const todaySteps = isToday ? this.state.steps : 0;
    return {
      todaySteps,
      todayCoins: isToday && this.state.goalRewarded ? DAILY_GOAL_COINS : 0,
      stepsToGoal: stepsToGoal(todaySteps),
      goalProgress: goalProgress(todaySteps),
      goalReached: todaySteps >= DAILY_STEP_GOAL,
      goalClaimable:
        isToday && todaySteps >= DAILY_STEP_GOAL && !this.state.goalRewarded,
      healthConnect: this.healthConnect,
      lastSyncedAt: this.lastSyncedAt,
      wallet: walletStore.snapshot(),
      history: {
        ...this.history,
        ...(isToday ? { [this.state.date]: todaySteps } : {}),
      },
      source: this.source,
      ready: this.ready,
    };
  }

  private emit() {
    const snap = this.snapshot();
    this.listeners.forEach(l => l(snap));
  }
}

async function requestActivityPermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || Platform.Version < 29) return true;
  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
      {
        title: 'Count your steps',
        message:
          'FitRewards uses your phone’s step sensor to count steps and reward you with FitCoins.',
        buttonPositive: 'Allow',
        buttonNegative: 'Not now',
      },
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

export const stepTracker = new StepTracker();
