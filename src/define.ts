import { ComponentOptions, component, FunctionalComponent } from './component'


export type DefinitionOptions = ComponentOptions & ElementDefinitionOptions

export type DefinableCompoent = {
  tag: string
  component: FunctionalComponent
  options?: DefinitionOptions
}


export function define(comp: DefinableCompoent, options?: DefinitionOptions): void
export function define(tag: string, fn: FunctionalComponent, options?: DefinitionOptions): void
export function define(
  tag: string | DefinableCompoent,
  fn?: FunctionalComponent | DefinitionOptions,
  options?: DefinitionOptions
) {
  if (typeof tag === 'string') {
    const registry = options?.window?.customElements ?? customElements
    registry.define(tag, component(fn as FunctionalComponent, options), options)
  } else {
    const opts: DefinitionOptions = {
      ...tag.options,
      ...fn,
    }
    const registry = opts.window?.customElements ?? customElements
    registry.define(tag.tag, component(tag.component, opts), tag.options)
  }
}


export function definable(tag: string, fn: FunctionalComponent, options?: ComponentOptions): DefinableCompoent {
  return { tag, component: fn, options }
}


export function using(options: DefinitionOptions) {
  function _define(comp: DefinableCompoent, opts?: DefinitionOptions): void
  function _define(tag: string, fn: FunctionalComponent, opts?: DefinitionOptions): void
  function _define(
    tag: string | DefinableCompoent,
    fn?: FunctionalComponent | DefinitionOptions,
    opts?: DefinitionOptions
  ) {
    if (typeof tag === 'string') {
      define(tag, fn as FunctionalComponent, { ...options, ...opts })
    } else {
      define(tag, { ...options, ...fn })
    }
  }

  return {
    define: _define,
    component: (fn: FunctionalComponent) => component(fn, options),
  }
}
