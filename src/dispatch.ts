import { currentNode, ownerDocument } from './hooks'
import { onAttribute } from './attribute'


export function useDispatch<D = any>(name: string, options: EventInit = {}) {
  const window = ownerDocument()!.defaultView!
  const current = currentNode()!

  let listener: EventListener | undefined
  onAttribute('on' + name, (value) => {
    if (listener) {
      current.removeEventListener(name, listener)
      listener = undefined
    }

    if (typeof value === 'function') {
      listener = value
      current.addEventListener(name, value)
    } else if (typeof value === 'string') {
      listener = new Function('event', value) as EventListener
      current.addEventListener(name, listener)
    }
  })

  return (detail: D) => current.dispatchEvent(new window.CustomEvent(name, { ...options, detail }))
}
