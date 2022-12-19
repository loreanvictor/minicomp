import { onRendered, onAttributeChanged, ATTRIBUTE_REMOVED } from './hooks'


export function onAttribute(name: string, fn: (value: string | typeof ATTRIBUTE_REMOVED | undefined) => void) {
  onAttributeChanged((attrName, value) => {
    if (attrName === name) {
      fn(value)
    }
  })

  onRendered(node => {
    fn(node.getAttribute(name) ?? undefined)
  })
}
