import { polyfillDSD } from './polyfill'

import { ref, template } from 'rehtm'
import { define } from '../define'


describe('hydration', () => {
  test('it re-hydrates existing DOM instead of re-rendering it.', () => {
    document.body.innerHTML = '<hydrate-1><template shadowrootmode="open"><button>Server <span>0</span></template></hydrate-1>'
    polyfillDSD(document)

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
