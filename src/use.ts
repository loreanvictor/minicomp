import { onConnected, onDisconnected } from './hooks'


export function use(effect: () => (void | (() => void))) {
  let dispose: void | (() => void)

  onConnected(() => dispose = effect())
  onDisconnected(() => dispose?.())
}
