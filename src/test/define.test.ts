import { define, definable } from '../define'


describe(define, () => {
  test('defines a component.', () => {
    define('def-1-component', () => '<div>Hellow World!</div>')
    const el = document.createElement('def-1-component')
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('can also be used with a definable component.', () => {
    const comp = definable('def-2-component', () => '<div>Hellow World!</div>')
    define(comp)
    const el = document.createElement('def-2-component')
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })
})
