import { onPropertyChanged, onRendered } from './hooks'


export function onProperty<T = unknown>(name: string, fn: (value: T) => void) {
  onPropertyChanged((propName, value) => {
    if (propName === name) {
      fn(value as T)
    }
  })

  onRendered(node => {
    fn(node[name] as T)
  })
}
