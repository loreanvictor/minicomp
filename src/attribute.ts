import { onRendered, onAttributeChanged } from './hooks'


export function onAttribute(name: string, fn: (value: string) => void) {
  onAttributeChanged((attrName, value) => {
    if (attrName === name) {
      fn(value)
    }
  })

  onRendered(node => {
    fn(node.getAttribute(name)!)
  })
}
