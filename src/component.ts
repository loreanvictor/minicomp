import { acceptHooks, ConnectedHook, DisconnectedHook, AdoptedHook, AttributeChangedHook } from './hooks'


export type FunctionalComponent = (props: object) => Node | string
export type ClassBasedComponent = { new (): HTMLElement }


export function component(fn: FunctionalComponent): ClassBasedComponent {
  return class extends HTMLElement {
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

      const [node, hooks] = acceptHooks(() => fn(props))
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
  }
}
