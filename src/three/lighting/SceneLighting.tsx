// three.js objects (camera, fog, renderer) are mutated inside useFrame by design;
// .oxlintrc.json disables react/immutability for src/three/** for that reason.
import { Environment, Lightformer } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, Fog, type DirectionalLight, type SpotLight } from 'three'
import { ENVIRONMENTS, type EnvironmentPreset } from '../../data/environments'
import { useSceneStore } from '../../hooks/useSceneStore'
import { damp } from '../../utils/math'

const TRANSITION_LAMBDA = 2.4
const RIM_SCALE = 18

interface SceneLightingProps {
  readonly shadows: boolean
  readonly envResolution: number
}

/** Procedural environment for one preset, rendered once into a cube map. */
const PresetEnvironment = ({ preset, resolution }: { preset: EnvironmentPreset; resolution: number }) => (
  <Environment resolution={resolution} frames={1}>
    <color attach="background" args={[preset.background]} />
    {preset.lightformers.map((lf, i) => (
      <Lightformer
        key={i}
        form={lf.form}
        color={lf.color}
        intensity={lf.intensity}
        position={[...lf.position]}
        scale={[...lf.scale]}
        rotation={lf.rotation ? [...lf.rotation] : [0, 0, 0]}
      />
    ))}
  </Environment>
)

/**
 * Real lighting system behind the Light Studio. Switching preset regenerates
 * the environment map (reflections) and eases light colour/intensity/position,
 * fog and tone-mapping exposure towards the new mood. The canvas is transparent:
 * the page backdrop behind it carries the matching background colour.
 */
export const SceneLighting = ({ shadows, envResolution }: SceneLightingProps) => {
  const environmentId = useSceneStore((s) => s.environment)
  const preset = ENVIRONMENTS[environmentId]
  const scene = useThree((s) => s.scene)
  const gl = useThree((s) => s.gl)

  const key = useRef<DirectionalLight>(null)
  const rim = useRef<SpotLight>(null)
  const targets = useMemo(
    () => ({ fog: new Color(preset.fog.color), key: new Color(preset.key.color), rim: new Color(preset.rim.color) }),
    [preset],
  )
  const fog = useMemo(() => new Fog(ENVIRONMENTS.studio.fog.color, 9, 24), [])

  useLayoutEffect(() => {
    scene.fog = fog
    return () => {
      scene.fog = null
    }
  }, [scene, fog])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1)
    const t = 1 - Math.exp(-TRANSITION_LAMBDA * dt)
    fog.color.lerp(targets.fog, t)
    fog.near = damp(fog.near, preset.fog.near, TRANSITION_LAMBDA, dt)
    fog.far = damp(fog.far, preset.fog.far, TRANSITION_LAMBDA, dt)
    gl.toneMappingExposure = damp(gl.toneMappingExposure, preset.exposure, TRANSITION_LAMBDA, dt)

    const keyLight = key.current
    if (keyLight) {
      keyLight.color.lerp(targets.key, t)
      keyLight.intensity = damp(keyLight.intensity, preset.key.intensity, TRANSITION_LAMBDA, dt)
      const [x, y, z] = preset.key.position
      keyLight.position.set(
        damp(keyLight.position.x, x, TRANSITION_LAMBDA, dt),
        damp(keyLight.position.y, y, TRANSITION_LAMBDA, dt),
        damp(keyLight.position.z, z, TRANSITION_LAMBDA, dt),
      )
    }
    const rimLight = rim.current
    if (rimLight) {
      rimLight.color.lerp(targets.rim, t)
      rimLight.intensity = damp(rimLight.intensity, preset.rim.intensity * RIM_SCALE, TRANSITION_LAMBDA, dt)
    }
  })

  return (
    <>
      <PresetEnvironment key={preset.id} preset={preset} resolution={envResolution} />
      <ambientLight intensity={0.05} />
      <directionalLight
        ref={key}
        intensity={0}
        position={[4, 7, 3]}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />
      <spotLight ref={rim} position={[-2, 3.2, -6.5]} angle={0.6} penumbra={0.9} intensity={0} distance={18} decay={1.6} />
    </>
  )
}
