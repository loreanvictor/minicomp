import { ComponentOptions, component, FunctionalComponent } from './component'


export type DefinitionOptions = ComponentOptions & ElementDefinitionOptions

export type DefinableCompoennt = {
  tag: string
  component: FunctionalComponent
  options?: DefinitionOptions
}


export function define(comp: DefinableCompoennt): void
export function define(tag: string, fn: FunctionalComponent, options?: DefinitionOptions): void
export function define(
  tag: string | DefinableCompoennt,
  fn?: FunctionalComponent,
  options?: DefinitionOptions
) {
  if (typeof tag === 'string') {
    (options?.window?.customElements ?? customElements)
      .define(tag, component(fn as FunctionalComponent, options), options)
  } else {
    ((fn as ComponentOptions)?.window?.customElements ?? customElements)
      .define(tag.tag, component(tag.component, tag.options), tag.options)
  }
}


export function definable(tag: string, fn: FunctionalComponent, options?: ComponentOptions): DefinableCompoennt {
  return { tag, component: fn, options }
}


export function using(options: DefinitionOptions) {
  return {
    define: (tag: string, fn: FunctionalComponent) => define(tag, fn, options),
    component: (fn: FunctionalComponent) => component(fn, options),
  }
}
