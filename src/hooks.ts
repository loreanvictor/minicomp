import { buildHooksContext } from 'haken'


export const ATTRIBUTE_REMOVED = Symbol()

export type ConnectedHook = (node: HTMLElement) => void
export type DisconnectedHook = (node: HTMLElement) => void
export type AdoptedHook = (node: HTMLElement) => void
export type RenderedHook = (node: HTMLElement, hydrated: boolean) => void
export type AttributeChangedHook = (name: string, value: string | typeof ATTRIBUTE_REMOVED, node: HTMLElement) => void
export type PropertyChangedHook = (name: string, value: unknown, node: HTMLElement) => void
export type Hook =
  | ConnectedHook
  | DisconnectedHook
  | AdoptedHook
  | AttributeChangedHook
  | PropertyChangedHook
  | RenderedHook

type Hooks = {
  onPropertyChanged: PropertyChangedHook
  onAttributeChanged: AttributeChangedHook
  onRendered: RenderedHook
  onAdopted: AdoptedHook
  onConnected: ConnectedHook
  onDisconnected: DisconnectedHook
}

type Meta = {
  currentNode: HTMLElement
}


const { acceptHooks: accept, hook, hooksMeta: meta } = buildHooksContext<Hooks, Meta>()

export const currentNode = () => meta().currentNode
export const ownerDocument = () => currentNode()?.ownerDocument

export const onConnected = hook('onConnected')
export const onDisconnected = hook('onDisconnected')
export const onAdopted = hook('onAdopted')
export const onRendered = hook('onRendered')
export const onAttributeChanged = hook('onAttributeChanged')
export const onPropertyChanged = hook('onPropertyChanged')

export const acceptHooks = accept
export const hooksMeta = meta
