import { onPropertyChanged } from '../../hooks'
import { define } from '../../define'
import { PropableElement } from '../../component'


describe(onPropertyChanged, () => {
  test('is called when a property is changed.', () => {
    const cb = jest.fn()
    define('opc-1', () => {
      onPropertyChanged(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('opc-1') as PropableElement
    el.setProperty('foo', 'bar')
    expect(cb).toHaveBeenCalledWith('foo', 'bar', el)
    expect(el['foo']).toBe('bar')
  })

  test('calls hooks in order.', () => {
    const a: number[] = []
    define('opc-2', () => {
      onPropertyChanged(() => a.push(1))
      onPropertyChanged(() => a.push(2))

      return '<div>Hi!</div>'
    })

    const el = document.createElement('opc-2') as PropableElement
    el.setProperty('foo', 'bar')
    expect(a).toEqual([1, 2])
  })
})
