import './polyfill'

import { JSDOM } from 'jsdom'
import { template, html } from 'rehtm'
import { using, define, definable } from '../define'


describe(define, () => {
  test('defines a component.', () => {
    define('def-1', () => '<div>Hellow World!</div>')
    const el = document.createElement('def-1')
    document.body.appendChild(el)
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('can also be used with a definable component.', () => {
    const comp = definable('def-2', () => '<div>Hellow World!</div>')
    define(comp)
    const el = document.createElement('def-2')
    document.body.appendChild(el)
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('handles attributes.', () => {
    document.body.innerHTML = '<def-3 name="World!"></def-3>'
    define('def-3', ({ name }: { name: string}) => `<div>Hellow ${name}</div>`)
    const el = document.querySelector('def-3')!
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('supports direct DOM elements too.', () => {
    define('def-4', () => {
      const div = document.createElement('div')
      div.innerHTML = 'Hellow World!'

      return div
    })
    const el = document.createElement('def-4')
    document.body.appendChild(el)
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('defines elements with other bases.', () => {
    using({
      baseClass: HTMLParagraphElement,
      extends: 'p'
    }).define('def-5', () => '<div>Hellow World!</div>')

    const el = document.createElement('p', { is: 'def-5' })
    document.body.appendChild(el)
    expect(el).toBeInstanceOf(HTMLParagraphElement)
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('works well with ssr templates', () => {
    define('def-6', () => template`<div>Hellow World!</div>`)

    const el = document.createElement('def-6')
    document.body.appendChild(el)
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('can define elements on other pages.', () => {
    const window = new JSDOM().window as unknown as  (Window & typeof globalThis)
    using({ window }).define('def-7', () => '<div>Hellow World!</div>')

    const el1 = document.createElement('def-7')
    document.body.appendChild(el1)
    expect(el1.shadowRoot).toBeFalsy()

    const el2 = window.document.createElement('def-7')
    window.document.body.appendChild(el2)
    expect(el2.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('can define custom elements on other pages using `component()`.', () => {
    const window = new JSDOM().window as unknown as  (Window & typeof globalThis)
    const comp = using({ window }).component(() => '<div>Hellow World!</div>')
    window.customElements.define('def-8', comp)

    const el1 = document.createElement('def-8')
    document.body.appendChild(el1)
    expect(el1.shadowRoot).toBeFalsy()

    const el2 = window.document.createElement('def-8')
    window.document.body.appendChild(el2)
    expect(el2.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('works well will `document.createElement()`.', () => {
    define('def-9', ({name}) => `<div>Hellow ${name}!</div>`)
    const el = document.createElement('def-9')
    el.setAttribute('name', 'World')
    document.body.appendChild(el)

    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('components can be initialized with props.', () => {
    define('def-10', ({ person }) => `<div>Hellow ${person.name}!</div>`)
    document.body.appendChild(html`<def-10 person=${{ name: 'World' }}></def-10>`)
    const el = document.querySelector('def-10')!

    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })
})
