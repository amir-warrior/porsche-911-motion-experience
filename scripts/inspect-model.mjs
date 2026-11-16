// Prints world-space bounds of the model and a few landmark parts (dev helper).
import { NodeIO } from '@gltf-transform/core'
import { getBounds } from '@gltf-transform/core'

const io = new NodeIO()
const doc = await io.read(process.argv[2])
const scene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0]
const fmt = (v) => v.map((n) => n.toFixed(3)).join(', ')
const b = getBounds(scene)
console.log('scene min', fmt(b.min), 'max', fmt(b.max))
for (const node of doc.getRoot().listNodes()) {
  const name = node.getName()
  if (/^(headlights|tailights|spoiler|FL|FR|RL|RR|Shadow|mirrors|grill)/.test(name)) {
    const nb = getBounds(node)
    const c = nb.min.map((v, i) => (v + nb.max[i]) / 2)
    console.log(name.padEnd(16), 'center', fmt(c))
  }
}
