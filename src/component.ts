import {
  acceptHooks, ConnectedHook, DisconnectedHook, AdoptedHook, AttributeChangedHook, ATTRIBUTE_REMOVED, PropertyChangedHook, Meta
} from './hooks'
import { SSRTemplate, isSSRTemplate } from './ssr'


export type FunctionalComponent = (props: any) => Node | SSRTemplate | string
export type ClassBasedComponent = typeof HTMLElement
export type PropableElement = HTMLElement & { setProperty(name: string, value: unknown): void }


export type ComponentOptions = {
  window?: Window & typeof globalThis
  baseClass?: ClassBasedComponent
}


export function component(
  fn: FunctionalComponent,
  options?: ComponentOptions
): ClassBasedComponent {
  return class extends (options?.baseClass ?? (options?.window ?? window).HTMLElement) {
    private _connected?: ConnectedHook
    private _disconnected?: DisconnectedHook
    private _adopted?: AdoptedHook
    private _attributeChanged?: AttributeChangedHook
    private _propertyChanged?: PropertyChangedHook

    private _shouldHydrate = false
    private _initialized = false
    private _root: ShadowRoot

    public readonly controls = {}
    private _props = {}

    constructor() {
      super()

      const internals = this._attemptInternals()
      const existing = internals.shadowRoot || this.shadowRoot
      this._shouldHydrate = !!existing
      this._root = this._shouldHydrate ? existing! : this.attachShadow({
        mode: 'open',
        serializable: true
      })
    }

    /* istanbul ignore next */
    _attemptInternals() {
      try {
        return this.attachInternals ? this.attachInternals() : this
      } catch {
        return this
      }
    }

    connectedCallback() {
      if (!this._initialized) {
        this._initialized = true
        const props = {...this._props}
        for (const attr of this.attributes) {
          props[attr.name] = attr.value
        }

        const [node, { hooks }] = acceptHooks(
          () => fn(props),
          {
            currentNode: this,
            controls: this.controls
          } as Meta
        )
        this._connected = hooks.onConnected
        this._disconnected = hooks.onDisconnected
        this._adopted = hooks.onAdopted
        this._attributeChanged = hooks.onAttributeChanged
        this._propertyChanged = hooks.onPropertyChanged

        let hydrated = false

        if (isSSRTemplate(node) && this._shouldHydrate) {
          node.hydrateRoot(this._root)
          hydrated = true
        } else {
          if (typeof node === 'string') {
            this._root.innerHTML = node
          } else if (isSSRTemplate(node)) {
            this._root.innerHTML = ''
            this._root.appendChild(node.create())
          } else {
            this._root.innerHTML = ''
            this._root.appendChild(node)
          }
        }

        hooks.onRendered && hooks.onRendered(this, hydrated)
      }

      this._connected && this._connected(this)
    }

    disconnectedCallback() {
      this._disconnected && this._disconnected(this)
    }

    adoptedCallback() {
      this._adopted && this._adopted(this)
    }

    override setAttribute(name: string, value: string): void {
      if (name in this._props) {
        this.setProperty(name, value)
      } else {
        super.setAttribute(name, value)
        this._attributeChanged && this._attributeChanged(name, value, this)
      }
    }

    override toggleAttribute(name: string, force?: boolean): boolean {
      const result = super.toggleAttribute(name, force)
      this._attributeChanged && this._attributeChanged(
        name, result ? super.getAttribute(name)! : ATTRIBUTE_REMOVED, this
      )

      return result
    }

    override removeAttribute(qualifiedName: string): void {
      super.removeAttribute(qualifiedName)
      this._attributeChanged && this._attributeChanged(qualifiedName, ATTRIBUTE_REMOVED, this)
    }

    setProperty(name: string, value: unknown) {
      if (this.hasAttribute(name)) {
        this.removeAttribute(name)
      }

      super[name] = value
      this._props[name] = value
      this._propertyChanged && this._propertyChanged(name, value, this)
    }
  }
}
