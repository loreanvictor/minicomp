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

      // TODO: this perhaps should be removed?
      //       this happens because in some environments (e.g. jest + jsdom) the
      //       `attachInternals` method is not available. this is not merely a testing problem as well,
      //       as it might happen in SSR environments as well, where rehydration is not an issue but we
      //       still need to be able to render the component.
      //
      //       however I suspect this can be removed by testing via puppeteer instead of jsdom, at least
      //       for this case (and support of `attachInternals`, specifically for rehydrating closed shadow roots).
      /* istanbul ignore next */
      const internals = this.attachInternals ? this.attachInternals() : this
      this._shouldHydrate = !!internals.shadowRoot
      this._root = this._shouldHydrate ? internals.shadowRoot! : this.attachShadow({ mode: 'open' })
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
            this._root.appendChild(node.create())
          } else {
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
      super.setAttribute(name, value)
      this._attributeChanged && this._attributeChanged(name, value, this)
    }

    override removeAttribute(qualifiedName: string): void {
      super.removeAttribute(qualifiedName)
      this._attributeChanged && this._attributeChanged(qualifiedName, ATTRIBUTE_REMOVED, this)
    }

    setProperty(name: string, value: unknown) {
      super[name] = value
      this._props[name] = value
      this._propertyChanged && this._propertyChanged(name, value, this)
    }
  }
}
