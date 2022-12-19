import { onConnected } from '../../hooks'
import { define } from '../../define'


describe(onConnected, () => {
  test('is called when the node is connected.', () => {
    const cb = jest.fn()
    define('oc-1', () => {
      onConnected(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('oc-1')
    expect(cb).not.toHaveBeenCalled()
    document.body.appendChild(el)
    expect(cb).toHaveBeenCalledWith(el)
  })

  test('hooks are called in order.', () => {
    const a: number[] = []
    define('oc-2', () => {
      onConnected(() => a.push(1))
      onConnected(() => a.push(2))

      return '<div>Hi!</div>'
    })

    const el = document.createElement('oc-2')
    document.body.appendChild(el)
    expect(a).toEqual([1, 2])
  })

  test('is called after reconnection.', () => {
    const cb = jest.fn()
    define('oc-3', () => {
      onConnected(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('oc-3')
    document.body.appendChild(el)
    expect(cb).toHaveBeenCalledTimes(1)
    document.body.removeChild(el)
    document.body.appendChild(el)
    expect(cb).toHaveBeenCalledTimes(2)
  })
})
