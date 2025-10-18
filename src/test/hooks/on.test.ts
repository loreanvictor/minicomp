import { type } from 'ts-inference-check'

import { on } from '../../on'
import { define } from '../../define'


describe(on, () => {
  test('provides the proper inference.', () => {
    define('on-1', () => {
      on('click', event => {
        expect(type(event).is<PointerEvent>(true)).toBe(true)
      })

      on('keypress', event => {
        expect(type(event).is<KeyboardEvent>(true)).toBe(true)
      })

      return ''
    })
  })

  test('handles events.', () => {
    const cb = jest.fn()

    define('on-2', () => {
      on('click', event => {
        expect(event).toBeInstanceOf(MouseEvent)
        cb()
      })

      return '<button>Click me!</button>'
    })

    const el = document.createElement('on-2')
    document.body.appendChild(el)
    el.click()

    expect(cb).toHaveBeenCalledTimes(1)
  })

  test('runs hooks in order.', () => {
    const a: number[] = []

    define('on-3', () => {
      on('click', () => a.push(1))
      on('click', () => a.push(2))
      on('click', () => a.push(3))

      return '<button>Click me!</button>'
    })

    const el = document.createElement('on-3')
    document.body.appendChild(el)
    el.click()

    expect(a).toEqual([1, 2, 3])
  })
})
