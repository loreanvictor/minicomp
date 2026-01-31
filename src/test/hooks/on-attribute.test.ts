import { onAttribute } from '../../attribute'
import { define } from '../../define'
import { ATTRIBUTE_REMOVED } from '../../hooks'


describe('onAttribute', () => {
  test('is called when the attribute is changed.', () => {
    const cb = jest.fn()
    const cb2 = jest.fn()
    define('oaa-1', () => {
      onAttribute('foo', cb)
      onAttribute('foo2', cb2)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('oaa-1')
    document.body.appendChild(el)
    el.setAttribute('foo', 'bar')

    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenCalledWith('bar')

    expect(cb2).toHaveBeenCalledTimes(1)
    expect(cb2).toHaveBeenCalledWith(undefined)
  })

  test('it is called when an attribute is toggled.', () => {
    const cb = jest.fn()
    define('oaa-2-1', () => {
      onAttribute('foo', cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('oaa-2-1')
    el.setAttribute('foo', 'bar')
    document.body.appendChild(el)
    el.toggleAttribute('foo')
    expect(cb).toHaveBeenCalledWith(ATTRIBUTE_REMOVED)
    el.toggleAttribute('foo')
    expect(cb).toHaveBeenCalledWith('')

    el.setAttribute('foo', 'bar')
    cb.mockReset()
    expect(cb).not.toHaveBeenCalled()
    el.toggleAttribute('foo', true)
    expect(cb).toHaveBeenCalledWith('bar')
  })

  test('is called when the attribute is removed.', () => {
    const cb = jest.fn()
    define('oaa-2', () => {
      onAttribute('foo', cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('oaa-2')
    document.body.appendChild(el)
    el.setAttribute('foo', 'bar')
    el.removeAttribute('foo')
    expect(cb).toHaveBeenCalledWith('bar')
    expect(cb).toHaveBeenCalledWith(ATTRIBUTE_REMOVED)
  })

  test('it is called with the initial value of the attribute as well.', () => {
    const cb = jest.fn()
    document.body.innerHTML = '<oaa-3 foo="bar"></oaa-3>'
    define('oaa-3', () => {
      onAttribute('foo', cb)

      return '<div>Hi!</div>'
    })

    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenCalledWith('bar')
  })

  test('it is called with undefined for undefined initial attributes.', () => {
    const cb = jest.fn()
    define('oaa-4', () => {
      onAttribute('foo', cb)

      return '<div>Hi!</div>'
    })

    document.body.innerHTML = '<oaa-4></oaa-4>'
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenCalledWith(undefined)
  })
})
