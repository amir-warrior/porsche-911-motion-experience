// Converts the Sketchfab glTF (unlit, game-style colours) into a compact PBR GLB:
// - every primitive gets a physically based material named by its role
//   (paint, glass, tyre, wheel_rim, chrome, trim, plastic, caliper, headlight, taillight, badge, plate)
// - wheel parts get their own materials so the wheel finish can change independently
// - the baked fake shadow plane is removed (the site renders real contact shadows)
// - geometry is deduplicated and meshopt-compressed
// Usage: node scripts/optimize-model.mjs <input.gltf> <output.glb>
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions'
import { dedup, meshopt, prune, resample } from '@gltf-transform/functions'
import { MeshoptEncoder } from 'meshoptimizer'

const [input = 'assets-src/sketchfab-911/scene.gltf', output = 'public/models/911-turbo-s.glb'] = process.argv.slice(2)

/** role → PBR parameters (linear base colour). Paint is overridden at runtime. */
const ROLES = {
  paint: { color: [0.8, 0.8, 0.78], metal: 0.3, rough: 0.35 },
  glass: { color: [0.01, 0.012, 0.014], metal: 0.0, rough: 0.05 },
  tyre: { color: [0.018, 0.018, 0.018], metal: 0.0, rough: 0.88 },
  wheel_rim: { color: [0.045, 0.044, 0.04], metal: 0.9, rough: 0.35 },
  brake_disc: { color: [0.25, 0.25, 0.25], metal: 1.0, rough: 0.45 },
  caliper: { color: [0.55, 0.42, 0.02], metal: 0.2, rough: 0.4 },
  chrome: { color: [0.75, 0.75, 0.75], metal: 1.0, rough: 0.18 },
  trim: { color: [0.02, 0.02, 0.021], metal: 0.4, rough: 0.5 },
  plastic: { color: [0.008, 0.008, 0.008], metal: 0.0, rough: 0.7 },
  headlight: { color: [0.9, 0.9, 0.9], metal: 0.0, rough: 0.2, emissive: [1, 1, 1], strength: 2.2 },
  taillight: { color: [0.4, 0.01, 0.01], metal: 0.0, rough: 0.25, emissive: [1, 0.02, 0.02], strength: 1.6 },
  badge: { color: [0.7, 0.45, 0.08], metal: 1.0, rough: 0.3 },
  plate: { color: [1, 1, 1], metal: 0.0, rough: 0.6, keepTexture: true },
}

const isWheelGroup = (name) => /^(wheel\.|FL_|FR_|RL_|RR_)/.test(name)
const isTyreGroup = (name) => /^wheel\./.test(name)

/** Decide a role from the original material name and the part it belongs to. */
const roleFor = (materialName, group) => {
  const wheel = isWheelGroup(group)
  const tyreGroup = isTyreGroup(group)
  switch (materialName) {
    case 'Paint1':
    case 'Paint2':
    case 'Paint3':
      return 'paint'
    case 'Dark1':
      return tyreGroup ? 'tyre' : wheel ? 'plastic' : 'glass'
    case 'Dark2':
      return 'plastic'
    case 'Gray':
      return tyreGroup ? 'wheel_rim' : 'trim'
    case 'Chrome1':
      return tyreGroup ? 'wheel_rim' : wheel ? 'brake_disc' : 'chrome'
    case 'Chrome2':
      return wheel ? 'brake_disc' : 'chrome'
    case 'Caliper1':
    case 'Caliper2':
      return 'caliper'
    case 'headlights':
      return 'headlight'
    case 'tailights':
    case 'brakelight':
    case 'red1':
      return 'taillight'
    case 'logo1':
    case 'logo2':
      return 'badge'
    case 'plate':
      return 'plate'
    default:
      throw new Error('Unmapped material: ' + materialName)
  }
}

await MeshoptEncoder.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder })
const doc = await io.read(input)
const root = doc.getRoot()

// Build one material per role.
const materials = new Map()
const plateTexture = root.listMaterials().find((m) => m.getName() === 'plate')?.getBaseColorTexture() ?? null
for (const [role, spec] of Object.entries(ROLES)) {
  const mat = doc
    .createMaterial(role)
    .setBaseColorFactor([...spec.color, 1])
    .setMetallicFactor(spec.metal)
    .setRoughnessFactor(spec.rough)
  if (spec.emissive) mat.setEmissiveFactor(spec.emissive)
  if (spec.keepTexture && plateTexture) mat.setBaseColorTexture(plateTexture)
  materials.set(role, mat)
}

// Remove the baked shadow plane.
for (const node of root.listNodes()) if (node.getName().startsWith('Shadow')) node.dispose()

// Reassign materials, tracking the nearest meaningfully named ancestor.
const counts = {}
const visit = (node, group) => {
  const name = node.getName()
  const nextGroup = name && !/^Object_\d+$/.test(name) ? name : group
  const mesh = node.getMesh()
  if (mesh) {
    for (const prim of mesh.listPrimitives()) {
      const role = roleFor(prim.getMaterial()?.getName() ?? '', nextGroup)
      prim.setMaterial(materials.get(role))
      counts[role] = (counts[role] ?? 0) + 1
    }
  }
  node.listChildren().forEach((child) => visit(child, nextGroup))
}
root.listScenes().forEach((scene) => scene.listChildren().forEach((n) => visit(n, '')))

// Drop original unlit/emissive-strength extensions and unused resources.
root.listExtensionsUsed().forEach((ext) => {
  if (ext.extensionName !== EXTMeshoptCompression.EXTENSION_NAME) ext.dispose()
})
await doc.transform(prune(), dedup(), resample(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }))
await io.write(output, doc)
console.log('roles assigned:', JSON.stringify(counts))
console.log('written', output)
