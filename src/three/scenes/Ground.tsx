import { ContactShadows } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { Color } from 'three'
import { ENVIRONMENTS } from '../../data/environments'
import { useSceneStore } from '../../hooks/useSceneStore'

/** Matte stage floor that fades into fog, plus soft contact shadows under the car. */
export const Ground = ({ receiveShadow }: { readonly receiveShadow: boolean }) => {
  const environment = useSceneStore((s) => s.environment)
  const color = useMemo(() => new Color(ENVIRONMENTS.studio.floor), [])
  const target = useMemo(() => new Color(ENVIRONMENTS[environment].floor), [environment])

  useFrame((_, dt) => {
    color.lerp(target, 1 - Math.exp(-2.4 * dt))
  })

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.002} receiveShadow={receiveShadow}>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial color={color} roughness={0.92} metalness={0} />
      </mesh>
      <ContactShadows position={[0, 0.001, 0]} scale={9} blur={2.6} far={2.2} opacity={0.85} resolution={512} frames={1} />
    </group>
  )
}
