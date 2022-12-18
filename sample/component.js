import { template, use } from 'htmplate'
import { observe, Timer, Subject } from 'quel'
import { define, onAttribute, onCleanup } from '../src'


const tmpl = template`<div>elapsed: <span>0</span></div>`

define('test-el', ({ start }) => {
  const host$ = use(tmpl)
  const span$ = host$.querySelector('span')

  const pad = start ? parseInt(start) : 0
  const timers = new Subject()

  observe($ => span$.textContent = ($($(timers)) ?? 0) + pad)

  onAttribute('rate', (value) => timers.set(new Timer(parseInt(value))))
  onCleanup(() => timers.get().stop())

  return host$
})
