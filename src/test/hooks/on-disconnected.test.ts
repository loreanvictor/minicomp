import { onDisconnected } from '../../hooks'
import { define } from '../../define'


describe(onDisconnected, () => {
  test('is called when the node is disconnected.', () => {
    const cb = jest.fn()
    define('od-1', () => {
      onDisconnected(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('od-1')
    document.body.appendChild(el)
    expect(cb).not.toHaveBeenCalled()
    document.body.removeChild(el)
    expect(cb).toHaveBeenCalledWith(el)
  })

  test('hooks are called in order.', () => {
    const a: number[] = []
    define('od-2', () => {
      onDisconnected(() => a.push(1))
      onDisconnected(() => a.push(2))

      return '<div>Hi!</div>'
    })

    const el = document.createElement('od-2')
    document.body.appendChild(el)
    document.body.removeChild(el)
    expect(a).toEqual([1, 2])
  })

  test('is called after redisconnection.', () => {
    const cb = jest.fn()
    define('od-3', () => {
      onDisconnected(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('od-3')
    document.body.appendChild(el)
    document.body.removeChild(el)
    expect(cb).toHaveBeenCalledTimes(1)
    document.body.appendChild(el)
    document.body.removeChild(el)
    expect(cb).toHaveBeenCalledTimes(2)
  })
})
