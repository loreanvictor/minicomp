import { polyfillDSD } from '../polyfill'

import { JSDOM } from 'jsdom'
import { re } from 'rehtm'

import { using }  from '../../define'
import { onHydrated } from '../../ssr-hooks'


describe(onHydrated, () => {
  test('is called when hydrated.', () => {
    const cb = jest.fn()

    const window = new JSDOM('<oh-1><template shadowrootmode="open"><div>Hellow</div></template></oh-1>').window as any
    polyfillDSD(window.document)

    const { template } = re(window.document)

    using({ window }).define('oh-1', () => {
      onHydrated(cb)

      return template`<div>Hi!</div>`
    })

    expect(cb).toHaveBeenCalledWith(window.document.querySelector('oh-1'))
  })

  test('is not called when not hydrated.', () => {
    const cb = jest.fn()

    const window = new JSDOM('<oh-2></oh-2>').window as any
    polyfillDSD(window.document)

    const { template } = re(window.document)

    using({ window }).define('oh-2', () => {
      onHydrated(cb)

      return template`<div>Hi!</div>`
    })

    expect(cb).not.toHaveBeenCalled()
  })
})
