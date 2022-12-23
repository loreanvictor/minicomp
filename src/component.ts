import {
  acceptHooks, ConnectedHook, DisconnectedHook, AdoptedHook, AttributeChangedHook, ATTRIBUTE_REMOVED
} from './hooks'


export type FunctionalComponent = (props: any) => Node | string
export type ClassBasedComponent = { new (): HTMLElement }


export type ComponentOptions = {
  baseClass?: ClassBasedComponent
}


export function component(
  fn: FunctionalComponent,
  options?: ComponentOptions
): ClassBasedComponent {
  return class extends (options?.baseClass ?? HTMLElement) {
    private _connected?: ConnectedHook
    private _disconnected?: DisconnectedHook
    private _adopted?: AdoptedHook
    private _attributeChanged?: AttributeChangedHook

    constructor() {
      super()

      const props = {}
      for (const attr of this.attributes) {
        props[attr.name] = attr.value
      }

      const [node, hooks] = acceptHooks(() => fn(props), this)
      this._connected = hooks.onConnected
      this._disconnected = hooks.onDisconnected
      this._adopted = hooks.onAdopted
      this._attributeChanged = hooks.onAttributeChanged

      const root = this.attachShadow({ mode: 'open' })
      if (typeof node === 'string') {
        root.innerHTML = node
      } else {
        root.appendChild(node)
      }

      hooks.onRendered && hooks.onRendered(this)
    }

    connectedCallback() {
      this._connected && this._connected(this)
    }

    disconnectedCallback() {
      this._disconnected && this._disconnected(this)
    }

    adoptedCallback() {
      this._adopted && this._adopted(this)
    }

    override setAttribute(name: string, value: string): void {
      super.setAttribute(name, value)
      this._attributeChanged && this._attributeChanged(name, value, this)
    }

    override removeAttribute(qualifiedName: string): void {
      super.removeAttribute(qualifiedName)
      this._attributeChanged && this._attributeChanged(qualifiedName, ATTRIBUTE_REMOVED, this)
    }
  }
}
