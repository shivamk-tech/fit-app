/**
 * Thin wrapper over react-native-health-connect for reading step totals.
 *
 * Health Connect is Android's on-device health store. The phone (Android 14+),
 * Google Fit, Samsung Health, Fitbit, watches etc. write steps into it, so a
 * read covers the whole day from midnight — even hours when FitRewards was
 * never opened.
 */
import { Linking, Platform } from 'react-native';
import {
  aggregateRecord,
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  requestPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import type { HealthConnectStatus } from '../types/steps';

const HEALTH_CONNECT_PACKAGE = 'com.google.android.apps.healthdata';
const STEPS_READ = { accessType: 'read', recordType: 'Steps' } as const;

let initialized = false;

/** Availability of Health Connect itself (ignores permissions). */
async function sdkStatus(): Promise<
  Exclude<HealthConnectStatus, 'permissionDenied' | 'connected'> | 'available'
> {
  if (Platform.OS !== 'android') return 'unsupported';
  try {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_AVAILABLE) return 'available';
    if (
      status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
    ) {
      return 'updateRequired';
    }
    return 'notInstalled';
  } catch {
    return 'notInstalled';
  }
}

async function hasStepsPermission(): Promise<boolean> {
  const granted = await getGrantedPermissions();
  return granted.some(
    p =>
      'recordType' in p && p.recordType === 'Steps' && p.accessType === 'read',
  );
}

/**
 * Initialise Health Connect and make sure we may read steps.
 * Shows the Health Connect permission sheet when `ask` is true and access
 * hasn't been granted yet.
 */
export async function connectHealthConnect(
  ask: boolean,
): Promise<HealthConnectStatus> {
  const status = await sdkStatus();
  if (status !== 'available') return status;
  try {
    if (!initialized) {
      initialized = await initialize();
      if (!initialized) return 'notInstalled';
    }
    if (await hasStepsPermission()) return 'connected';
    if (!ask) return 'permissionDenied';
    await requestPermission([STEPS_READ]);
    return (await hasStepsPermission()) ? 'connected' : 'permissionDenied';
  } catch {
    return 'permissionDenied';
  }
}

/** Total steps recorded between two instants (deduplicated across sources). */
export async function readStepTotal(start: Date, end: Date): Promise<number> {
  const result = await aggregateRecord({
    recordType: 'Steps',
    timeRangeFilter: {
      operator: 'between',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    },
  });
  return result.COUNT_TOTAL ?? 0;
}

/** Opens the Play Store page so the user can install or update Health Connect. */
export function openHealthConnectInStore() {
  Linking.openURL(`market://details?id=${HEALTH_CONNECT_PACKAGE}`).catch(() =>
    Linking.openURL(
      `https://play.google.com/store/apps/details?id=${HEALTH_CONNECT_PACKAGE}`,
    ),
  );
}
