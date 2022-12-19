import { onRendered } from '../../hooks'
import { define } from '../../define'


describe(onRendered, () => {
  test('is called when the node is rendered.', () => {
    const cb = jest.fn()
    define('or-1', () => {
      onRendered(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('or-1')
    expect(cb).toHaveBeenCalledWith(el)
  })

  test('hooks are called in order.', () => {
    const a: number[] = []
    define('or-2', () => {
      onRendered(() => a.push(1))
      onRendered(() => a.push(2))

      return '<div>Hi!</div>'
    })

    document.createElement('or-2')
    expect(a).toEqual([1, 2])
  })
})
