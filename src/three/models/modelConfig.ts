/** Asset + orientation config for the vehicle model (tuned after inspecting the GLB). */
export const MODEL_URL = '/models/911-turbo-s.glb'

/**
 * Normalized length in scene units. All camera shots and hotspot anchors in
 * src/data are authored for this scale (nose towards +Z, wheels on y = 0).
 */
export const MODEL_LENGTH = 3.05

/** Extra yaw (radians) so the nose points to +Z after normalization. */
export const MODEL_YAW = 0
