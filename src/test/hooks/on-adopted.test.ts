import { onAdopted } from '../../hooks'
import { define } from '../../define'


describe(onAdopted, () => {
  test('is called when the node is adopted.', () => {
    const cb = jest.fn()
    define('oa-1', () => {
      onAdopted(cb)

      return '<div>Hi!</div>'
    })

    const el = document.createElement('oa-1');
    (el as any).adoptedCallback()
    expect(cb).toHaveBeenCalledWith(el)
  })
})
