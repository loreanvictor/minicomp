import { ATTRIBUTE_REMOVED, onAttributeChanged } from '../../hooks'
import { define } from '../../define'


describe('onAttributeChanged', () => {
  test('is called when an attribute is changed.', () => {
    const cb = jest.fn()
    define('oac-1', () => {
      onAttributeChanged(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('oac-1')
    document.body.appendChild(el)
    el.setAttribute('foo', 'bar')
    expect(cb).toHaveBeenCalledWith('foo', 'bar', el)
  })

  test('is called when an attribute is removed.', () => {
    const cb = jest.fn()
    define('oac-2', () => {
      onAttributeChanged(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('oac-2')
    document.body.appendChild(el)
    el.setAttribute('foo', 'bar')
    el.removeAttribute('foo')
    expect(cb).toHaveBeenCalledWith('foo', ATTRIBUTE_REMOVED, el)
  })

  test('is called when an attribute is changed to the same value.', () => {
    const cb = jest.fn()
    define('oac-3', () => {
      onAttributeChanged(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('oac-3')
    document.body.appendChild(el)
    el.setAttribute('foo', 'bar')
    el.setAttribute('foo', 'bar')
    expect(cb).toHaveBeenCalledTimes(2)
  })

  test('calls hooks in order.', () => {
    const a: number[] = []
    define('oac-4', () => {
      onAttributeChanged(() => a.push(1))
      onAttributeChanged(() => a.push(2))

      return '<div>Hi!</div>'
    })

    const el = document.createElement('oac-4')
    document.body.appendChild(el)
    el.setAttribute('foo', 'bar')
    expect(a).toEqual([1, 2])
  })
})
