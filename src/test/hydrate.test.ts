import { polyfillDSD } from './polyfill'

import { ref, template, html } from 'rehtm'
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
    expect(el.shadowRoot?.textContent).toBe('Server 2')
  })

  // TODO:: this should test proper serialization and rehydration
  //        this is due to JSDOM not supporting .getHTML() right now.
  //        issue created: https://github.com/jsdom/jsdom/issues/3955
  test.skip('components are serializable and re-hydratable', () => {
    define('hydrate-2', () => {
      return template`<p>Hello World</p>`
    })

    document.body.innerHTML = '<hydrate-2></hydrate-2>'
    expect(document.querySelector('hydrate-2')!.shadowRoot?.serializable).toBe(true)
  })

  test.only('should not duplicate content when hydratable content not provided.', () => {
    document.body.innerHTML = '<hydrate-3><template shadowrootmode="open"><div>Hellow!</div></template></hydrate-3>'
    polyfillDSD(document)

    define('hydrate-3', () => html`<div>Hellow!</div>`)

    const el = document.querySelector('hydrate-3')! as HTMLElement
    expect(el.shadowRoot?.textContent).toBe('Hellow!')
  })
})
