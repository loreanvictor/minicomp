import { polyfillDSD } from '../polyfill'

import { JSDOM } from 'jsdom'
import { re } from 'rehtm'

import { onRendered } from '../../hooks'
import { define, using } from '../../define'


describe('onRendered', () => {
  test('is called when the node is rendered.', () => {
    const cb = jest.fn()
    define('or-1', () => {
      onRendered(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('or-1')
    document.body.appendChild(el)
    expect(cb).toHaveBeenCalledWith(el, false)
  })

  test('hooks are called in order.', () => {
    const a: number[] = []
    define('or-2', () => {
      onRendered(() => a.push(1))
      onRendered(() => a.push(2))

      return '<div>Hi!</div>'
    })

    const el = document.createElement('or-2')
    document.body.appendChild(el)
    expect(a).toEqual([1, 2])
  })

  test('is called when the node is hydrated.', () => {
    const cb = jest.fn()
    const window = new JSDOM('<or-3><template shadowrootmode="open"><div>Hellow</div></template></or-3>').window as any
    polyfillDSD(window.document)

    const { template } = re(window.document)

    using({ window }).define('or-3', () => {
      onRendered(cb)

      return template`<div>Hi!</div>`
    })

    expect(cb).toHaveBeenCalledWith(window.document.querySelector('or-3'), true)
  })
})
