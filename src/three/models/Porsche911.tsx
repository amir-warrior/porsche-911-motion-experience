import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Box3, Color, Mesh, MeshStandardMaterial, Vector3, type Object3D } from 'three'
import { findPaint, findWheel } from '../../data/paints'
import { useSceneStore } from '../../hooks/useSceneStore'
import {
  applyPaint,
  applyWheelFinish,
  classifyPart,
  createGlassMaterial,
  createPaintMaterial,
  EMISSIVE_INTENSITY,
} from '../materials/carMaterials'
import { MODEL_LENGTH, MODEL_URL, MODEL_YAW } from './modelConfig'

const COLOR_LAMBDA = 3

interface Parts {
  readonly paint: ReturnType<typeof createPaintMaterial>
  readonly glass: ReturnType<typeof createGlassMaterial>
  readonly wheels: readonly MeshStandardMaterial[]
}

/** Scale to MODEL_LENGTH, centre on X/Z and rest the wheels on y = 0. */
const normalize = (root: Object3D): void => {
  // Reset first so repeated calls (StrictMode, HMR) are idempotent.
  root.scale.setScalar(1)
  root.position.set(0, 0, 0)
  root.rotation.set(0, MODEL_YAW, 0)
  root.updateMatrixWorld(true)
  const box = new Box3().setFromObject(root)
  const size = box.getSize(new Vector3())
  const scale = MODEL_LENGTH / Math.max(size.x, size.z)
  root.scale.setScalar(scale)
  root.updateMatrixWorld(true)
  const scaled = new Box3().setFromObject(root)
  const center = scaled.getCenter(new Vector3())
  root.position.set(-center.x, -scaled.min.y, -center.z)
}

/** Pure: create the runtime materials and collect the wheel-rim materials. */
const createParts = (root: Object3D): Parts => {
  const wheels = new Set<MeshStandardMaterial>()
  root.traverse((node) => {
    if (!(node instanceof Mesh)) return
    const material = Array.isArray(node.material) ? node.material[0] : node.material
    if (material instanceof MeshStandardMaterial && classifyPart(material.name) === 'wheel_rim') wheels.add(material)
  })
  return { paint: createPaintMaterial(), glass: createGlassMaterial(), wheels: [...wheels] }
}

/**
 * Side effect (run in a layout effect, never during render): swap the baked
 * role materials for the runtime clearcoat paint and coated glass, light the
 * lamps and set shadow flags. Idempotent — roles are keyed by material name.
 */
const assignParts = (root: Object3D, parts: Parts, castShadow: boolean): void => {
  root.traverse((node) => {
    if (!(node instanceof Mesh)) return
    node.castShadow = castShadow
    node.receiveShadow = castShadow
    const material = Array.isArray(node.material) ? node.material[0] : node.material
    if (!(material instanceof MeshStandardMaterial)) return
    const role = classifyPart(material.name)
    if (role === 'paint') node.material = parts.paint
    else if (role === 'glass') node.material = parts.glass
    else if (role === 'headlight' || role === 'taillight') material.emissiveIntensity = EMISSIVE_INTENSITY[role] ?? 1
  })
}

export const Porsche911 = ({ shadows }: { readonly shadows: boolean }) => {
  const { scene } = useGLTF(MODEL_URL, false, true)
  const paintId = useSceneStore((s) => s.paintId)
  const wheelId = useSceneStore((s) => s.wheelId)

  const parts = useMemo(() => createParts(scene), [scene])
  const colorTarget = useMemo(() => new Color(), [])

  useLayoutEffect(() => normalize(scene), [scene])
  useLayoutEffect(() => assignParts(scene, parts, shadows), [scene, parts, shadows])

  const resprayed = useRef(false)
  useEffect(() => {
    applyPaint(parts.paint, findPaint(paintId), colorTarget)
    // First paint appears instantly; later selections ease in.
    if (!resprayed.current) parts.paint.color.copy(colorTarget)
    resprayed.current = true
  }, [parts, paintId, colorTarget])

  useEffect(() => {
    const finish = findWheel(wheelId)
    parts.wheels.forEach((mat) => applyWheelFinish(mat, finish))
  }, [parts, wheelId])

  // Paint colour eases towards the selection for a smooth respray.
  useFrame((_, dt) => {
    parts.paint.color.lerp(colorTarget, 1 - Math.exp(-COLOR_LAMBDA * dt))
  })

  useEffect(
    () => () => {
      parts.paint.dispose()
      parts.glass.dispose()
    },
    [parts],
  )

  return <primitive object={scene} />
}

useGLTF.preload(MODEL_URL, false, true)
