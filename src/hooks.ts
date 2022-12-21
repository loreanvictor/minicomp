export const ATTRIBUTE_REMOVED = Symbol()

export type ConnectedHook = (node: HTMLElement) => void
export type DisconnectedHook = (node: HTMLElement) => void
export type AdoptedHook = (node: HTMLElement) => void
export type RenderedHook = (node: HTMLElement) => void
export type AttributeChangedHook = (name: string, value: string | typeof ATTRIBUTE_REMOVED, node: HTMLElement) => void
export type Hook = ConnectedHook | DisconnectedHook | AdoptedHook | AttributeChangedHook | RenderedHook


type InternalFrame = {
  onDisconnected?: DisconnectedHook | DisconnectedHook[]
  onConnected?: ConnectedHook | ConnectedHook[]
  onAdopted?: AdoptedHook | AdoptedHook[]
  onRendered?: RenderedHook | RenderedHook[]
  onAttributeChanged?: AttributeChangedHook | AttributeChangedHook[]
}

export type RegisteredHooks = {
  onAttributeChanged?: AttributeChangedHook
  onRendered?: RenderedHook
  onAdopted?: AdoptedHook
  onConnected?: ConnectedHook
  onDisconnected?: DisconnectedHook
}

const stack: InternalFrame[] = []

function prepareFrame(frame: InternalFrame): RegisteredHooks {
  const result: RegisteredHooks = {}
  for (const key in frame) {
    const value = frame[key]
    if (value) {
      if (Array.isArray(value)) {
        result[key] = ((...args: any[]) => {
          for (const fn of value) {
            fn(...args)
          }
        }) as any
      } else {
        result[key] = value
      }
    }
  }

  return result
}

export function acceptHooks<T>(fn: () => T): [T, RegisteredHooks] {
  const ctx: InternalFrame = {}
  stack.push(ctx)
  const result = fn()
  stack.pop()

  return [result, prepareFrame(ctx)]
}

function hook<
  Key extends keyof RegisteredHooks,
  HookType extends NonNullable<RegisteredHooks[Key]>
>(prop: Key, fn: HookType) {
  const current = stack[stack.length - 1]

  if (current) {
    const currentHook = current[prop]
    if (currentHook) {
      if (Array.isArray(currentHook)) {
        currentHook.push(fn as any)
      } else {
        current[prop] = [currentHook, fn as any]
      }
    } else {
      current[prop] = fn
    }
  }
}


export const onConnected = (fn: ConnectedHook) => hook('onConnected', fn)
export const onDisconnected = (fn: DisconnectedHook) => hook('onDisconnected', fn)
export const onAdopted = (fn: AdoptedHook) => hook('onAdopted', fn)
export const onRendered = (fn: RenderedHook) => hook('onRendered', fn)
export const onAttributeChanged = (fn: AttributeChangedHook) => hook('onAttributeChanged', fn)
