# minicomp
Minimalistic library for defining Web Components

```js
import { template, use } from 'htmplate'
import { define, onCleanup } from 'minicomp'

const tmpl$ = template`<div>Elapsed: <span>0</span> seconds</div>`

define('my-counter', () => {
  const host$ = use(tmpl$)
  const span$ = host$.querySelector('span')

  let elapsed = 0
  const interval = setInterval(() => span$.textContent = ++elapsed, 1000)
  onCleanup(() => clearInterval(interval))

  return host$
})
```
```html
<my-counter></my-counter>
```
