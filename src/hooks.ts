export const ATTRIBUTE_REMOVED = Symbol()

export type ConnectedHook = (node: HTMLElement) => void
export type DisconnectedHook = (node: HTMLElement) => void
export type AdoptedHook = (node: HTMLElement) => void
export type RenderedHook = (node: HTMLElement) => void
export type AttributeChangedHook = (name: string, value: string | typeof ATTRIBUTE_REMOVED, node: HTMLElement) => void
export type Hook = ConnectedHook | DisconnectedHook | AdoptedHook | AttributeChangedHook | RenderedHook


type Frame = {
  onDisconnected?: DisconnectedHook
  onConnected?: ConnectedHook
  onAdopted?: AdoptedHook
  onRendered?: RenderedHook
  onAttributeChanged?: AttributeChangedHook
}

const stack: Frame[] = []

export function acceptHooks<T>(fn: () => T): [T, Frame] {
  const ctx: Frame = {}
  stack.push(ctx)
  const result = fn()
  stack.pop()

  return [result, ctx]
}

function hook<Key extends keyof Frame, HookType extends NonNullable<Frame[Key]>>(prop: Key, fn: HookType) {
  const current = stack[stack.length - 1]

  if (current) {
    const currentHook = current[prop]
    current[prop] = currentHook ? (((...args: Parameters<HookType>) => {
      (currentHook as any)(...args);
      (fn as any)(...args)
    }) as HookType) : fn
  }
}


export const onConnected = (fn: ConnectedHook) => hook('onConnected', fn)
export const onDisconnected = (fn: DisconnectedHook) => hook('onDisconnected', fn)
export const onAdopted = (fn: AdoptedHook) => hook('onAdopted', fn)
export const onRendered = (fn: RenderedHook) => hook('onRendered', fn)
export const onAttributeChanged = (fn: AttributeChangedHook) => hook('onAttributeChanged', fn)
