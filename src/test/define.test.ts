import { define, definable } from '../define'


describe(define, () => {
  test('defines a component.', () => {
    define('def-1', () => '<div>Hellow World!</div>')
    const el = document.createElement('def-1')
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('can also be used with a definable component.', () => {
    const comp = definable('def-2', () => '<div>Hellow World!</div>')
    define(comp)
    const el = document.createElement('def-2')
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('handles attributes.', () => {
    define('def-3', ({ name }: { name: string}) => `<div>Hellow ${name}</div>`)
    document.body.innerHTML = '<def-3 name="World!"></def-3>'
    const el = document.querySelector('def-3')!
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })

  test('supports direct DOM elements too.', () => {
    define('def-4', () => {
      const div = document.createElement('div')
      div.innerHTML = 'Hellow World!'

      return div
    })
    const el = document.createElement('def-4')
    expect(el.shadowRoot!.innerHTML).toBe('<div>Hellow World!</div>')
  })
})
