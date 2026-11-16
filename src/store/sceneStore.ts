import { DEFAULT_PAINT_ID, DEFAULT_WHEEL_ID } from '../data/paints'
import type { EnvironmentId } from '../data/environments'
import type { ShotId } from '../data/shots'
import { createStore } from './createStore'

export type StageMode = 'story' | 'explore'
export type WebGLStatus = 'pending' | 'ready' | 'failed' | 'unsupported'

export interface SceneState {
  readonly environment: EnvironmentId
  readonly paintId: string
  readonly wheelId: string
  /** story = camera follows scroll; explore = visitor owns the camera. */
  readonly mode: StageMode
  readonly activeHotspot: string | null
  /** Fixed camera composition requested by UI (studio presets); null = follow scroll. */
  readonly presetShot: ShotId | null
  /** Whether a section that shows the car is on screen (drives render loop). */
  readonly stageVisible: boolean
  readonly hotspotsVisible: boolean
  readonly webgl: WebGLStatus
  /** Intro sequence finished — UI may become interactive. */
  readonly introDone: boolean
}

export const initialSceneState: SceneState = {
  environment: 'studio',
  paintId: DEFAULT_PAINT_ID,
  wheelId: DEFAULT_WHEEL_ID,
  mode: 'story',
  activeHotspot: null,
  presetShot: null,
  stageVisible: true,
  hotspotsVisible: false,
  webgl: 'pending',
  introDone: false,
}

export const sceneStore = createStore<SceneState>(initialSceneState)

export const sceneActions = {
  setEnvironment: (environment: EnvironmentId) => sceneStore.setState({ environment }),
  setPaint: (paintId: string) => sceneStore.setState({ paintId }),
  setWheel: (wheelId: string) => sceneStore.setState({ wheelId }),
  setPreset: (presetShot: ShotId | null) => sceneStore.setState({ presetShot, mode: 'story' }),
  enterExplore: () => sceneStore.setState({ mode: 'explore', activeHotspot: null }),
  exitExplore: () => sceneStore.setState({ mode: 'story' }),
  focusHotspot: (activeHotspot: string | null) => sceneStore.setState({ activeHotspot }),
  setStageVisible: (stageVisible: boolean) => sceneStore.setState({ stageVisible }),
  setHotspotsVisible: (hotspotsVisible: boolean) =>
    sceneStore.setState((s) => ({ hotspotsVisible, activeHotspot: hotspotsVisible ? s.activeHotspot : null })),
  setWebGL: (webgl: WebGLStatus) => sceneStore.setState({ webgl }),
  finishIntro: () => sceneStore.setState({ introDone: true }),
} as const
