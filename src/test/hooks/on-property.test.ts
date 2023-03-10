import { onProperty } from '../../property'
import { define } from '../../define'
import { PropableElement } from '../../component'

describe(onProperty, () => {
  test('is called when a property is changed.', () => {
    const cb = jest.fn()
    const cb2 = jest.fn()
    define('op-1', () => {
      onProperty('foo', cb)
      onProperty('foo2', cb2)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('op-1') as PropableElement
    el.setProperty('foo', 'bar')

    expect(el['foo']).toBe('bar')

    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenCalledWith('bar')

    expect(cb2).not.toHaveBeenCalled()
  })
})
