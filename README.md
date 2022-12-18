# minicomp
Minimalistic library for defining [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) in a function-based manner:

```js
import { define } from 'minicomp'

define('say-hi', ({ to }) => `<div>Hellow ${to}</div>`)
```
```html
<say-hi to="World"></say-hi>
```

<br>

[**minicomp**](.) provides _hooks_ for tapping into [life cycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks):

```js
import { define, onConnected, onDisconnected } from 'minicomp'

define('say-hi', ({ to }) => {
  onConnected(() => console.log('CONNECTED!'))
  onDisconnected(() => console.log('DISCONNECTED!'))
  
  return `<div>Hellow <span>${to}</span></div>`
})
```

<br>

```js
import { template, use } from 'htmplate'
import { define } from 'minicomp'

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
