import { onRendered } from './hooks'


export function onHydrated(hook: (node: HTMLElement) => void) {
  onRendered((node, hydrated) => {
    if (hydrated) {
      hook(node)
    }
  })
}


export function onFirstRender(hook: (node: HTMLElement) => void) {
  onRendered((node, hydrated) => {
    if (!hydrated) {
      hook(node)
    }
  })
}
