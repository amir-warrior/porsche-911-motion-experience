import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Box3, Color, Mesh, MeshStandardMaterial, Vector3, type Object3D } from 'three'
import { findPaint, findWheel } from '../../data/paints'
import { useSceneStore } from '../../hooks/useSceneStore'
import { applyPaint, applyWheelFinish, classifyPart, createPaintMaterial } from '../materials/carMaterials'
import { MODEL_LENGTH, MODEL_URL, MODEL_YAW } from './modelConfig'

const COLOR_LAMBDA = 3

interface Parts {
  readonly paint: ReturnType<typeof createPaintMaterial>
  readonly wheels: MeshStandardMaterial[]
}

/** Scale to MODEL_LENGTH, centre on X/Z and rest the wheels on y = 0. */
const normalize = (root: Object3D): void => {
  root.rotation.y = MODEL_YAW
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

/** Swap body paint for one shared clearcoat material and collect wheel materials. */
const prepareParts = (root: Object3D, castShadow: boolean): Parts => {
  const paint = createPaintMaterial()
  const wheels: MeshStandardMaterial[] = []
  root.traverse((node) => {
    if (!(node instanceof Mesh)) return
    node.castShadow = castShadow
    node.receiveShadow = castShadow
    const material = Array.isArray(node.material) ? node.material[0] : node.material
    const kind = classifyPart(node.name, material?.name ?? '')
    if (kind === 'paint') {
      if (material instanceof MeshStandardMaterial && material.normalMap) paint.normalMap = material.normalMap
      node.material = paint
    } else if (kind === 'wheel' && material instanceof MeshStandardMaterial) {
      const own = material.clone()
      node.material = own
      wheels.push(own)
    } else if (kind === 'glass' && material instanceof MeshStandardMaterial) {
      material.envMapIntensity = 1.4
    }
  })
  return { paint, wheels }
}

export const Porsche911 = ({ shadows }: { readonly shadows: boolean }) => {
  const { scene } = useGLTF(MODEL_URL, false, true)
  const paintId = useSceneStore((s) => s.paintId)
  const wheelId = useSceneStore((s) => s.wheelId)

  const parts = useMemo(() => prepareParts(scene, shadows), [scene, shadows])
  const colorTarget = useMemo(() => new Color(), [])

  useLayoutEffect(() => normalize(scene), [scene])

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
      parts.wheels.forEach((m) => m.dispose())
    },
    [parts],
  )

  return <primitive object={scene} />
}

useGLTF.preload(MODEL_URL, false, true)
