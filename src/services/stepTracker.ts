/**
 * Step tracker singleton.
 *
 * - Reads the hardware pedometer through the NativeStepCounter TurboModule
 *   (Android only for now).
 * - Falls back to "manual" mode on devices/emulators without a step sensor,
 *   where steps can be added with `addSteps()`.
 * - Converts raw sensor values into daily totals, pays out coins every
 *   STEPS_PER_REWARD steps (via the shared walletStore), and persists
 *   everything with AsyncStorage.
 * - Notifies subscribers (see useStepTracker) whenever the snapshot changes.
 */
import { PermissionsAndroid, Platform } from 'react-native';
import type { EventSubscription } from 'react-native';
import { COINS_PER_REWARD, STEPS_PER_REWARD } from '../config/rewards';
import NativeStepCounter from '../specs/NativeStepCounter';
import type {
  StepHistory,
  StepSnapshot,
  StepSource,
  StepState,
} from '../types/steps';
import {
  addManualSteps,
  applySensorReading,
  coinsForSteps,
  emptyStepState,
  localDateKey,
  progressToNextReward,
  settleRewards,
  stepsToNextReward,
} from './stepMath';
import {
  loadStepHistory,
  loadStepState,
  saveStepHistory,
  saveStepState,
} from './stepStorage';
import { walletStore } from './wallet';

type Listener = (snapshot: StepSnapshot) => void;

class StepTracker {
  private state: StepState = emptyStepState(localDateKey());
  private history: StepHistory = {};
  private source: StepSource = 'unavailable';
  private ready = false;
  private listeners = new Set<Listener>();
  private sensorSub: EventSubscription | null = null;
  private startPromise: Promise<void> | null = null;
  // Serialise persistence so rapid sensor events can't interleave writes.
  private persistQueue: Promise<void> = Promise.resolve();

  constructor() {
    // Re-emit whenever the wallet changes from any source (e.g. streak bonus).
    walletStore.subscribe(() => {
      if (this.ready) this.emit();
    });
  }

  /** Load persisted data and begin listening to the sensor. Idempotent. */
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
    this.rolloverIfNewDay();
    this.ready = true;

    await this.attachSensor();
    this.emit();
  }

  private async attachSensor() {
    if (!NativeStepCounter) {
      this.source = 'manual';
      return;
    }
    const available = await NativeStepCounter.isAvailable();
    if (!available) {
      this.source = 'manual';
      return;
    }
    const granted = await requestActivityPermission();
    if (!granted) {
      this.source = 'manual';
      return;
    }
    this.sensorSub = NativeStepCounter.onStepUpdate(({ sensorSteps }) => {
      this.handleSensor(sensorSteps);
    });
    NativeStepCounter.start();
    this.source = 'sensor';
  }

  stop() {
    this.sensorSub?.remove();
    this.sensorSub = null;
    NativeStepCounter?.stop();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  snapshot(): StepSnapshot {
    const todaySteps = this.state.steps;
    return {
      todaySteps,
      todayCoins: coinsForSteps(todaySteps),
      stepsToNextReward: stepsToNextReward(todaySteps),
      progressToNextReward: progressToNextReward(todaySteps),
      wallet: walletStore.snapshot(),
      history: { ...this.history, [this.state.date]: todaySteps },
      source: this.source,
      ready: this.ready,
    };
  }

  /** Manually add steps (simulator / devices without a pedometer). */
  addSteps(count: number) {
    this.rolloverIfNewDay();
    this.state = addManualSteps(this.state, count, localDateKey());
    this.afterStepChange();
  }

  private handleSensor(sensorSteps: number) {
    const today = localDateKey();
    if (this.state.date !== today) {
      this.archiveDay(this.state);
    }
    this.state = applySensorReading(this.state, sensorSteps, today);
    this.afterStepChange();
  }

  /** If the stored state is from a previous day, archive it and start fresh. */
  private rolloverIfNewDay() {
    const today = localDateKey();
    if (this.state.date === today) return;
    this.archiveDay(this.state);
    this.state = emptyStepState(today);
  }

  private archiveDay(state: StepState) {
    if (state.steps > 0) {
      this.history = { ...this.history, [state.date]: state.steps };
    }
  }

  private afterStepChange() {
    const { state, coinsEarned, unitsEarned } = settleRewards(this.state);
    this.state = state;
    if (coinsEarned > 0) {
      const stepsLabel = `${unitsEarned * STEPS_PER_REWARD}`;
      walletStore.credit(
        coinsEarned,
        unitsEarned === 1
          ? `Walked ${STEPS_PER_REWARD} steps`
          : `Walked ${stepsLabel} steps (${unitsEarned} × ${COINS_PER_REWARD} coins)`,
      );
    }
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
          'FitRewards uses your phone’s step sensor to count steps and reward you with coins.',
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
