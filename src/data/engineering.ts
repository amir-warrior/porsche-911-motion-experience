import { TURBO_S } from './specs'

export type PartId = 'engine' | 'turbo' | 'pdk' | 'battery' | 'front' | 'rear'

export interface EngineeringStep {
  readonly index: string
  readonly title: string
  readonly body: string
  readonly figures: readonly { readonly value: string; readonly label: string }[]
  /** Schematic parts highlighted during this step. */
  readonly parts: readonly PartId[]
  /** Energy/torque paths drawn during this step. */
  readonly flows: readonly string[]
}

export const ENGINEERING_STEPS: readonly EngineeringStep[] = [
  {
    index: '01',
    title: '3.6-litre boxer',
    body: 'A six-cylinder boxer sits behind the rear axle, as in every 911. On its own, without hybrid assistance, it already produces:',
    figures: [
      { value: String(TURBO_S.enginePowerKw) + ' kW', label: String(TURBO_S.enginePowerPs) + ' PS' },
      { value: String(TURBO_S.engineTorqueNm) + ' Nm', label: 'Engine torque' },
    ],
    parts: ['engine'],
    flows: [],
  },
  {
    index: '02',
    title: 'Two eTurbos',
    body: 'Each turbocharger has an electric motor between compressor and turbine wheel that drives the shaft directly — which is why neither wastegates nor variable turbine geometry are needed.',
    figures: [{ value: String(TURBO_S.eTurboCount), label: 'Electric turbochargers' }],
    parts: ['engine', 'turbo'],
    flows: ['battery-turbo-l', 'battery-turbo-r'],
  },
  {
    index: '03',
    title: 'Motor in the PDK',
    body: 'An electric motor integrated into the dedicated, reinforced PDK adds torque from idle. Both systems draw on a compact high-voltage battery.',
    figures: [
      { value: String(TURBO_S.pdkMotorKw) + ' kW', label: String(TURBO_S.pdkMotorNm) + ' Nm at idle' },
      { value: String(TURBO_S.batteryVoltage) + ' V', label: String(TURBO_S.batteryGrossKwh) + ' kWh gross' },
    ],
    parts: ['pdk', 'battery'],
    flows: ['battery-pdk'],
  },
  {
    index: '04',
    title: 'All four wheels',
    body: 'Combined, the system delivers its peak to the road through all-wheel drive; a transfer box sends up to 500 Nm to the front axle.',
    figures: [
      { value: String(TURBO_S.systemPowerKw) + ' kW', label: String(TURBO_S.systemPowerPs) + ' PS system' },
      { value: String(TURBO_S.systemTorqueNm) + ' Nm', label: 'System torque' },
    ],
    parts: ['engine', 'pdk', 'front', 'rear'],
    flows: ['drive-rear', 'drive-front'],
  },
]
