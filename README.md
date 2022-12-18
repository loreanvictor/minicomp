<img src="logo-dark.svg#gh-dark-mode-only" height="96px"/>
<img src="logo-light.svg#gh-light-mode-only" height="96px"/>

Minimalistic library for defining [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) using functions and _hooks_:

```js
import { define, onConnected } from 'minicomp'

define('say-hi', ({ to }) => {
  onConnected(() => console.log('CONNECTED!'))
  return `<div>Hellow <span>${to}</span></div>`
})
```
```html
<say-hi to="World"></say-hi>
```

This enables creating custom hooks, enabling a compositional approach to creating more complicated Web Components:

```js
// define a custom hook for creating a timer that is stopped
// whenever the element is not connected to the DOM.

import { onConnected, onDisconnected } from 'minicomp'

export const useInterval = (ms, callback) => {
  let interval
  let counter = 0

  onConnected(() => interval = setInterval(() => callback(++counter), ms))
  onDisconnected(() => clearInterval(interval))
}
```
```js
// now use the custom hook:

import { template, use } from 'htmplate'
import { define } from 'minicomp'

const tmpl$ = template`<div>Elapsed: <span>0</span> seconds</div>`

define('my-timer', () => {
  const host$ = use(tmpl$)
  const span$ = host$.querySelector('span')
  
  useInterval(1000, c => span$.textContent = c)
  
  return host$
})
```
```html
<my-timer></my-timer>
```
👉 [Try it out!](https://codepen.io/lorean_victor/pen/vYroJwP)

<br>

## Installation

On [node](https://nodejs.org/en/):
```bash
npm i minicomp
```
In the browser:
```js
import { define } from 'https://esm.sh/minicomp'
```

<br>

## Usage

Define a custom element:

```js
import { define } from 'minicomp'

define('my-el', () => '<div>Hellow World!</div>')
```
```html
<my-el></my-el>
```

> ☝️ A component function can return an `HTMLElement` or a string representation of some DOM. You can simply not use a library, or use a combo of [htm](https://github.com/developit/htm) and [vhtml](https://github.com/developit/vhtml) (see [this](https://github.com/developit/htm#other-uses)), or use template elements (e.g. via [htmplate](https://github.com/loreanvictor/htmplate)), etc.

<br>

Attributes are passed as a parameter:

```js
define('say-hi', ({ to }) => `<div>Hellow ${to}</div>`)
```

<br>

Use hooks to tap into [custom elements' life cycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks): 

```js
import { define, onConnected, onDisconnected } from 'minicomp'

define('my-el', () => {
  onConnected(() => console.log('CONNECTED!'))
  onDisconnected(() => console.log('DISCONNECTED'))
  
  return '<div>Hellow World!</div>'
})
```

<br>

### Provided Hooks

```ts
onConnected(hook: (node: HTMLElement) => void)
```
Is called when the element is connected to the DOM. Might get called multiple times (e.g. when the elemnt is moved).

<br>

```ts
onDisconnected(hook: (node: HTMLElement) => void)
```

Is called when the element is disconnected from the DOM. Might get called multiple times (e.g. when the element is moved).

<br>

```ts
onAttributeChanged(hook: (name: string, value: string, node: HTMLElement) => void)
```

Is called when `.setAttribute()` is called on the element, changing value of an attribute.

<br>

```ts
onAdopted(hook: (node: HTMLElement) => void)
```

_Invoked each time the custom element is moved to a new document._ (??)

<br>

```ts
onRendered(hook: (node: HTMLElement) => void)
```

Is called after the returned DOM is attached to the element's [shadow root](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

<br>

```ts
onCleanup(hook: () => void)
```

Is called after the element is removed from the document and not added back immediately.

<br>

### Rules for Hooks

Hooks MUST be called synchronously within the component function, before it returns its corresponding DOM. Besides that, there are no additional hooks rules, so use them freely (within a for loop, conditionally, etc.).

If you use hooks outside of a component function, they will simply have no effect.

<br>

### Custom Hooks

The hooks are building blocks to enable custom hooks:

```js
import { onCleanup } from 'minicomp'

export function useObservable(observable) {
  const subscription = observable.subscribe()
  onCleanup(() => subscription.unsubscribe())
}
```

<br>
