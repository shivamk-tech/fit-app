/**
 * TurboModule spec for the native step counter.
 *
 * Android: implemented in android/app/src/main/java/com/fitrewards/stepcounter.
 * iOS: not implemented yet, so `TurboModuleRegistry.get` returns null there and
 * the JS tracker falls back to manual mode.
 */
import type { CodegenTypes, TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type StepUpdate = {
  /** Cumulative steps since device boot, straight from the hardware sensor. */
  sensorSteps: number;
  /** Wall-clock ms when the reading arrived. */
  timestamp: number;
};

export interface Spec extends TurboModule {
  /** True when the device has a hardware step counter. */
  isAvailable(): Promise<boolean>;
  /** Begin listening to the sensor. Safe to call repeatedly. */
  start(): void;
  /** Stop listening. */
  stop(): void;
  readonly onStepUpdate: CodegenTypes.EventEmitter<StepUpdate>;
}

export default TurboModuleRegistry.get<Spec>('StepCounter');
