import { template, use } from 'htmplate'
import { observe, Timer, Subject } from 'quel'
import { define, onAttributeChanged, onCleanup } from '../src'


const tmpl = template`<div>elapsed: <span>0</span></div>`

define('test-el', ({ start, rate }) => {
  const host$ = use(tmpl)
  const span$ = host$.querySelector('span')

  const pad = start ? parseInt(start) : 0
  const timers = new Subject()
  timers.set(new Timer(rate ? parseInt(rate) : 1000))

  observe($ => span$.textContent = ($($(timers)) ?? 0) + pad)

  onAttributeChanged((name, value) => {
    if (name === 'rate') {
      timers.set(new Timer(parseInt(value)))
    }
  })

  onCleanup(() => timers.get().stop())

  return host$
})
