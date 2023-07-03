jest.mock('htm/mini', () => require('htm/mini/index.umd.js'))


import { JSDOM } from 'jsdom'
import { using, define, definable } from '../define'


describe(define, () => {
  test('defines defineables in ssr environment.', () => {
    const Comp = definable('ssr-1', () => '<div>Hellow World!</div>')

    const window = new JSDOM().window as any
    using({ window }).define(Comp)

    window.document.body.innerHTML = '<ssr-1></ssr-1>'
    const el = window.document.querySelector('ssr-1')
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })
})

