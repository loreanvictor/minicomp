import { hooksMeta, Meta } from './hooks'


export type ControllableMeta = Meta & {
  controls: { [key: string]: (...args: unknown[]) => unknown }
}


export type Controllable<ControlType> = HTMLElement & {
  controls: ControlType
}


export function attachControls<ControlType>(
  controls: ControlType
) {
  const meta = hooksMeta() as ControllableMeta
  meta && Object.assign(meta.controls, controls)
}
