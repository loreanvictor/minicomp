import { define } from '../../define'
import { ownerDocument } from '../../hooks'


describe(ownerDocument, () => {
  test('returns the owner document.', () => {
    let ref: Document | undefined

    define('owner-document-1', () => {
      ref = ownerDocument()

      return ''
    })

    const el = document.createElement('owner-document-1')
    document.body.appendChild(el)

    expect(ref).toBe(document)
  })
})
