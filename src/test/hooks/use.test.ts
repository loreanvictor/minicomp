import { use } from '../../use'
import { define } from '../../define'


describe(use, () => {
  it('should allocate the resource on connection and dispose it on disconnection.', () => {
    const dispose = jest.fn()
    const allocate = jest.fn(() => dispose)

    define('use-1', () => {
      use(allocate)

      return '<div>Test</div>'
    })

    const el = document.createElement('use-1')
    expect(allocate).toHaveBeenCalledTimes(0)
    expect(dispose).toHaveBeenCalledTimes(0)

    document.body.appendChild(el)
    expect(allocate).toHaveBeenCalledTimes(1)
    expect(dispose).toHaveBeenCalledTimes(0)

    document.body.removeChild(el)
    expect(allocate).toHaveBeenCalledTimes(1)
    expect(dispose).toHaveBeenCalledTimes(1)

    document.body.appendChild(el)
    expect(allocate).toHaveBeenCalledTimes(2)
    expect(dispose).toHaveBeenCalledTimes(1)

    document.body.removeChild(el)
    expect(allocate).toHaveBeenCalledTimes(2)
    expect(dispose).toHaveBeenCalledTimes(2)
  })

  it('should also work without a cleanup function.', () => {
    const allocate = jest.fn(() => {})

    define('use-2', () => {
      use(allocate)

      return '<div>Test</div>'
    })

    const el = document.createElement('use-2')
    expect(allocate).toHaveBeenCalledTimes(0)

    document.body.appendChild(el)
    expect(allocate).toHaveBeenCalledTimes(1)

    document.body.removeChild(el)
    expect(allocate).toHaveBeenCalledTimes(1)

    document.body.appendChild(el)
    expect(allocate).toHaveBeenCalledTimes(2)

    document.body.removeChild(el)
    expect(allocate).toHaveBeenCalledTimes(2)
  })
})
