export type ConnectedHook = (node: Node) => void
export type DisconnectedHook = (node: Node) => void
export type AdoptedHook = (node: Node) => void
export type AttributeChangedHook = (name: string, value: string, node: Node) => void
export type Hook = ConnectedHook | DisconnectedHook | AdoptedHook | AttributeChangedHook


type Frame = {
  onDisconnected?: ConnectedHook
  onConnected?: DisconnectedHook
  onAdopted?: AdoptedHook
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
    current[prop] = current[prop] ? (((...args: Parameters<HookType>) => {
      (current[prop]! as any)(...args);
      (fn as any)(...args)
    }) as HookType) : fn
  }
}


export const onConnected = (fn: ConnectedHook) => hook('onConnected', fn)
export const onDisconnected = (fn: DisconnectedHook) => hook('onDisconnected', fn)
export const onAdopted = (fn: AdoptedHook) => hook('onAdopted', fn)
export const onAttributeChanged = (fn: AttributeChangedHook) => hook('onAttributeChanged', fn)
