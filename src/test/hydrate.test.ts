jest.mock('htm/mini', () => require('htm/mini/index.umd.js'))

import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any


import { ref, template } from 'rehtm'
import { define } from '../define'


const polyfillDSD = () => {
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


describe('hydration', () => {
  test('it re-hydrates existing DOM instead of re-rendering it.', () => {
    document.body.innerHTML = '<hydrate-1><template shadowrootmode="open"><button>Server <span>0</span></template></hydrate-1>'
    polyfillDSD()

    define('hydrate-1', () => {
      const span = ref()
      let count = 0

      return template`
        <button onclick=${() => span.current!.textContent = `${++count}`}>
          Client <span ref=${span}>0</span>
        </button>
      `
    })

    const el = document.querySelector('hydrate-1')! as HTMLElement
    el.shadowRoot!.querySelector('button')!.click()
    el.shadowRoot!.querySelector('button')!.click()
    expect(el.shadowRoot?.innerHTML).toBe('<button>Server <span>2</span></button>')
  })
})
