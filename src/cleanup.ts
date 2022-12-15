import { onDisconnected } from './hooks'


export function onCleanup(fn: () => void) {
  onDisconnected(node => {
    queueMicrotask(() => {
      if (!node.isConnected) {
        fn()
      }
    })
  })
}
