import {
  acceptHooks, ConnectedHook, DisconnectedHook, AdoptedHook, AttributeChangedHook, ATTRIBUTE_REMOVED, PropertyChangedHook
} from './hooks'


export type FunctionalComponent = (props: any) => Node | string
export type ClassBasedComponent = typeof HTMLElement
export type PropableElement = HTMLElement & { setProperty(name: string, value: unknown): void }


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
    private _propertyChanged?: PropertyChangedHook

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
      this._propertyChanged = hooks.onPropertyChanged

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

    setProperty(name: string, value: unknown) {
      super[name] = value
      this._propertyChanged && this._propertyChanged(name, value, this)
    }
  }
}
