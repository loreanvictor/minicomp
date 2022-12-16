import { component, FunctionalComponent } from './component'


export type DefinableCompoennt = {
  tag: string
  component: FunctionalComponent
}


export function define(comp: DefinableCompoennt): void
export function define(tag: string, fn: FunctionalComponent): void
export function define(tag: string | DefinableCompoennt, fn?: FunctionalComponent) {
  if (typeof tag === 'string') {
    customElements.define(tag, component(fn!))
  } else {
    customElements.define(tag.tag, component(tag.component))
  }
}


export function definable(tag: string, fn: FunctionalComponent): DefinableCompoennt {
  return { tag, component: fn }
}
