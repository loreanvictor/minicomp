import { define } from '../../define'
import { attachControls, Controllable } from '../../controls'


describe(attachControls, () => {
  test('attaches controls to the component.', () => {
    const cb = jest.fn()

    define('ac-1', () => {
      attachControls({ cb })

      return '<div>Hi!</div>'
    })

    document.body.innerHTML = '<ac-1></ac-1>'
    const el = document.querySelector('ac-1')! as Controllable<{ cb: typeof cb }>
    el.controls.cb('Jacko')

    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenCalledWith('Jacko')
  })
})
