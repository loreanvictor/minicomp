import { polyfillDSD } from '../polyfill'

import { JSDOM } from 'jsdom'
import { re } from 'rehtm'

import { using }  from '../../define'
import { onFirstRender } from '../../ssr-hooks'


describe(onFirstRender, () => {
  test('is not called when hydrated.', () => {
    const cb = jest.fn()

    const window = new JSDOM('<ofr-1><template shadowrootmode="open"><div>Hellow</div></template></ofr-1>').window as any
    polyfillDSD(window.document)

    const { template } = re(window.document)

    using({ window }).define('ofr-1', () => {
      onFirstRender(cb)

      return template`<div>Hi!</div>`
    })

    expect(cb).not.toHaveBeenCalled()
  })

  test('is called when not hydrated.', () => {
    const cb = jest.fn()

    const window = new JSDOM('<ofr-2></ofr-2>').window as any
    polyfillDSD(window.document)

    const { template } = re(window.document)

    using({ window }).define('ofr-2', () => {
      onFirstRender(cb)

      return template`<div>Hi!</div>`
    })

    expect(cb).toHaveBeenCalledWith(window.document.querySelector('ofr-2'))
  })
})
