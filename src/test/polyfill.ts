// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('htm/mini', () => require('htm/mini/index.umd.js'))

import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder as any
global.TextDecoder = TextDecoder as any

export const polyfillDSD = (document: Document) => {
  (function attachShadowRoots(root) {
    root.querySelectorAll('template[shadowrootmode]').forEach(tmpl => {
      const mode = tmpl.getAttribute('shadowrootmode')
      const shadowRoot = (tmpl.parentNode as any).attachShadow({ mode })
      shadowRoot.appendChild((tmpl as any).content)
      tmpl.remove()
      attachShadowRoots(shadowRoot)
    })
  })(document)
}
