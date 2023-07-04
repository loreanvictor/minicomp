import { useDispatch } from '../../dispatch'
import { on } from '../../on'
import { define } from '../../define'


describe(useDispatch, () => {
  test('dispatches an event.', () => {
    define('dispatch-1', () => {
      const dispatch = useDispatch('test')
      on('click', () => dispatch('Hello!'))

      return '<div>Hi!</div>'
    })

    const element = document.createElement('dispatch-1')
    document.body.appendChild(element)

    const cb = jest.fn()

    element.addEventListener('test', cb)
    element.click()

    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ detail: 'Hello!' }))
  })

  test('accepts event listeners as attribute.', () => {
    define('dispatch-2', () => {
      const dispatch = useDispatch('test')
      on('click', () => dispatch('Hello!'))

      return '<div>Hi!</div>'
    })

    global.console.log = jest.fn()
    document.body.innerHTML = '<dispatch-2 ontest="console.log(event.detail)"></dispatch-2>'

    const element = document.querySelector('dispatch-2') as HTMLElement
    const cb = jest.fn()

    element.click()
    element.click()
    expect(cb).not.toHaveBeenCalled()
    expect(global.console.log).toHaveBeenCalledWith('Hello!')

    element.setAttribute('ontest', cb as any)
    element.click()

    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ detail: 'Hello!' }))
    expect(global.console.log).toHaveBeenCalledTimes(2)

    element.removeAttribute('ontest')
    element.click()

    expect(cb).toHaveBeenCalledTimes(1)
    expect(global.console.log).toHaveBeenCalledTimes(2)
  })
})
