package com.fitrewards.stepcounter

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.fitrewards.specs.NativeStepCounterSpec

/**
 * Exposes Android's hardware TYPE_STEP_COUNTER to JS.
 *
 * The sensor reports cumulative steps since the last device boot. Converting
 * that into "steps today" is done on the JS side (see src/services/stepMath.ts)
 * so the logic is unit-testable and shared with iOS later.
 *
 * Requires android.permission.ACTIVITY_RECOGNITION on API 29+ (requested from JS).
 */
class StepCounterModule(reactContext: ReactApplicationContext) :
  NativeStepCounterSpec(reactContext), SensorEventListener {

  private val sensorManager: SensorManager =
    reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
  private val stepSensor: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
  private var listening = false

  override fun getName(): String = NAME

  override fun isAvailable(promise: Promise) {
    promise.resolve(stepSensor != null)
  }

  override fun start() {
    val sensor = stepSensor ?: return
    if (listening) return
    listening = sensorManager.registerListener(this, sensor, SensorManager.SENSOR_DELAY_NORMAL)
  }

  override fun stop() {
    if (!listening) return
    sensorManager.unregisterListener(this)
    listening = false
  }

  override fun onSensorChanged(event: SensorEvent) {
    if (event.sensor.type != Sensor.TYPE_STEP_COUNTER) return
    val payload = Arguments.createMap().apply {
      putDouble("sensorSteps", event.values[0].toDouble())
      putDouble("timestamp", System.currentTimeMillis().toDouble())
    }
    emitOnStepUpdate(payload)
  }

  override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit

  override fun invalidate() {
    stop()
    super.invalidate()
  }

  companion object {
    const val NAME = "StepCounter"
  }
}
