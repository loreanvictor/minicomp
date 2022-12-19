import { onCleanup } from '../../cleanup'
import { define } from '../../define'


describe(onCleanup, () => {
  test('is called when the node is removed.', async () => {
    const cb = jest.fn()
    define('ocl-1', () => {
      onCleanup(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('ocl-1')
    document.body.appendChild(el)
    el.remove()
    await Promise.resolve()
    expect(cb).toHaveBeenCalledTimes(1)
  })

  test('hooks are called in order.', async () => {
    const a: number[] = []
    define('ocl-2', () => {
      onCleanup(() => a.push(1))
      onCleanup(() => a.push(2))

      return '<div>Hi!</div>'
    })

    const el = document.createElement('ocl-2')
    document.body.appendChild(el)
    el.remove()
    await Promise.resolve()
    expect(a).toEqual([1, 2])
  })

  test('not called when just moved.', async () => {
    const cb = jest.fn()
    define('ocl-3', () => {
      onCleanup(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('ocl-3')
    document.body.appendChild(el)
    el.remove()
    document.body.appendChild(el)
    await Promise.resolve()
    expect(cb).not.toHaveBeenCalled()
  })
})
