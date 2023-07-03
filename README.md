<div align="right">

[![npm bundle size](https://img.shields.io/bundlephobia/minzip/minicomp?color=black&label=&style=flat-square)](https://bundlephobia.com/package/minicomp@latest)
![npm type definitions](https://img.shields.io/npm/types/minicomp?color=black&label=%20&style=flat-square)
[![version](https://img.shields.io/npm/v/minicomp?label=&color=black&style=flat-square)](https://www.npmjs.com/package/minicomp)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/loreanvictor/minicomp/coverage.yml?label=%20&style=flat-square)](https://github.com/loreanvictor/minicomp/actions/workflows/coverage.yml)

</div>

<img src="logo-dark.svg#gh-dark-mode-only" height="108px"/>
<img src="logo-light.svg#gh-light-mode-only" height="108px"/>

Define [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) using functions and hooks:

```javascript
import { define, onConnected } from 'minicomp'

define('say-hi', ({ to }) => {
  onConnected(() => console.log('CONNECTED!'))

  return `<div>Hellow <span>${to}</span></div>`
})
```
```html
<say-hi to="World"></say-hi>
```

<br>

- 🌱&emsp;Tiny wrapper over [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- ☕&emsp;[Minimalistic components](#usage)
- ⚡&emsp;[Composable hooks](#custom-hooks)
- 🧩&emsp;Interoperable: create and update your DOM however you want
- 🧬&emsp;[SSR support](#server-side-rendering) with isomorphic components (_experimental_)

<br>

# Contents

- [Contents](#contents)
- [Installation](#installation)
- [Usage](#usage)
  - [Provided Hooks](#provided-hooks)
    - [onCleanup](#oncleanup)
    - [onAttribute](#onattribute)
    - [onProperty](#onproperty)
    - [on](#on)
    - [onConnected](#onconnected)
    - [onDisconnected](#ondisconnected)
    - [onAttributeChanged](#onattributechanged)
    - [onPropertyChanged](#onpropertychanged)
    - [onRendered](#onrendered)
    - [currentNode](#currentnode)
    - [ownerDocument](#ownerdocument)
  - [Rules for Hooks](#rules-for-hooks)
  - [Custom Hooks](#custom-hooks)
  - [Server Side Rendering](#server-side-rendering)
    - [Global Window Object](#global-window-object)
- [Contribution](#contribution)

<br>

# Installation

On [node](https://nodejs.org/en/):
```bash
npm i minicomp
```
In the browser:
```javascript
import { define } from 'https://esm.sh/minicomp'
```

<br>

# Usage

👉 Define a custom element:

```javascript
import { define } from 'minicomp'

define('my-el', () => '<div>Hellow World!</div>')
```
```html
<my-el></my-el>
```

> ☝️ A component function can return a `Node` or a string representation of some DOM.

<br>

👉 Attributes are passed as a parameter:

```js
define('say-hi', ({ to }) => `<div>Hellow ${to}</div>`)
```

<br>

👉 Use hooks to tap into [custom elements' life cycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks): 

```js
import { define, onConnected, onDisconnected } from 'minicomp'

define('my-el', () => {
  onConnected(() => console.log('CONNECTED!'))
  onDisconnected(() => console.log('DISCONNECTED'))
  
  return '<div>Hellow World!</div>'
})
```

<br>

👉 Use `using()` to define a component that extends another built-in element:

```js
import { using } from 'minicomp'

using({
  baseClass: HTMLParagraphElement,
  extends: 'p',
}).define('my-el', () => {/*...*/})
```
```html
<p is="my-el"></p>
```

<br>

👉 Use `.setProperty()` method of defined elements to set their properties:
```js
define('my-el', () => {/*...*/})

const el = document.createElement('my-el')
el.setProperty('myProp', { whatever: 'you want' })
```

> ⚠️ Don't set properties manually, as then the proper hooks won't be invoked.

> In [TypeScript](https://www.typescriptlang.org), you can cast to `PropableElement` for proper type checking:
> ```ts
> import { PropableElement } from 'minicomp'
>
> const el = document.createElement('my-el') as PropableElement
> el.setProperty('myProp', { whatever: 'you want' })
> ```

<br>

## Provided Hooks

### onCleanup
```ts
onCleanup(hook: () => void)
```

Is called after the element is removed from the document and not added back immediately.

<br>

### onAttribute

```ts
onAttribute(
  name: string,
  hook: (value: string | typeof ATTRIBUTE_REMOVED | undefined) => void
)
```
Is called with the initial value of specified attribute (`undefined` if not passed initially) and whenever the value of specified attribute changes (via `.setAttribute()`). Will be called with `ATTRIBUTE_REMOVED` symbol when specified attribute is removed (via `.removeAttribute()`).

<br>

### onProperty

```ts
onProperty(name: string, hook: (value: unknown) => void)
```
```ts
onProperty<T>(name: string, hook: (value: T) => void)
```

Is called when specified property is set using `.setProperty()` method.

<br>

### on

```ts
on(name: string, hook: (event: Event) => void)
```
Adds an event listener to the custom element (via `.addEventListener()`). For example, `on('click', () => ...)` will add a click listener to the element.

<br>

### onConnected

```ts
onConnected(hook: (node: HTMLElement) => void)
```
Is called when the element is connected to the DOM. Might get called multiple times (e.g. when the elemnt is moved).

<br>

### onDisconnected

```ts
onDisconnected(hook: (node: HTMLElement) => void)
```

Is called when the element is disconnected from the DOM. Might get called multiple times (e.g. when the element is moved).

<br>

### onAttributeChanged

```ts
onAttributeChanged(
  hook: (
    name: string,
    value: string | typeof ATTRIBUTE_REMOVED,
    node: HTMLElement
  ) => void
)
```

Is called when `.setAttribute()` is called on the element, changing value of an attribute. Will pass `ATTRIBUTE_REMOVED` symbol when the attribute is removed (via `.removeAttribute()`).

<br>

### onPropertyChanged

```ts
onPropertyChanged(hook: (name: string, value: any, node: HTMLElement) => void)
```

Is called when `.setProperty()` method of the element is called.

<br>

### onRendered

```ts
onRendered(hook: (node: HTMLElement) => void)
```

Is called after the returned DOM is attached to the element's [shadow root](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

<br>

### currentNode

```ts
currentNode(): HTMLElement | undefined
```

Returns the current element being rendered, undefined if used out of a component function. Useful for custom hooks who need
to conduct an operation during rendering (for hooks that operate after rendering, use `.onRendered()`).

### ownerDocument

```ts
ownerDocument(): Document
```

Returns the document that the element is in. Useful for components (and hooks) that want to be operable in environments where there is no global document object (e.g. during SSR).

<br>

## Rules for Hooks

Hooks MUST be called synchronously within the component function, before it returns its corresponding DOM. Besides that, there are no additional hooks rules, so use them freely (within a for loop, conditionally, etc.).

If you use hooks outside of a component function, they will simply have no effect.

<br>

## Custom Hooks


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

<div align="right">

[**▷ TRY IT**](https://codepen.io/loreaTn_victor/pen/vYroJwP)

</div>

<br>

## Server Side Rendering

[**minicomp**](.) provides support for SSR and isomorphic components (hydrating pre-rendered content in general) via [declarative shadow DOM](https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md). On [browsers supporting the feature](https://caniuse.com/?search=declarative%20shadow%20dom), server rendered content will be rehydrated. On browsers that don't, it will fallback to client side rendering. You would also need a serializer supporting declarative shadow DOM, such as [Puppeteer](https://developer.chrome.com/docs/puppeteer/ssr/) or [Happy DOM](https://www.npmjs.com/package/happy-dom).

To enable SSR support on your component, return an `SSRTemplate` object instead of a string or a DOM element. Use libraries such as [**rehtm**](https://github.com/loreanvictor/rehtm#hydration) to easily create SSR templates:

```js
import { define } from 'minicomp'
import { ref, template } from 'rehtm'

define('a-button', () => {
  const span = ref()
  let count = 0
  
  return template`
    <button onclick=${() => span.current.textContent = ++count}>
      Client <span ref=${span} role="status">0</span>
    </button>
  `
})
```
 
<div align="right">

[**▷ TRY IT**](https://codepen.io/lorean_victor/pen/YzjYdJR)

</div>

<br>

You can also manually create SSR templates:

```js
define('my-comp', () => {
  const clicked = () => console.log('CLICKED!')
   
  return {
   
    // first time render,
    // lets make the DOM and hydrate it.
    //
    create: () => {
      const btn = document.createElement('button')
      btn.addEventListener('click', clicked)
       
      return btn
    },
     
    // pre-rendered content, lets just
    // rehydrate it:
    //
    hydrateRoot: root => {
      root.firstChild.addEventListener('click', clicked)
    }
  }
})
```

<br>

### Global Window Object

In some environments (for example, during server-side rendering), a global `window` object might not be present. Use `window` option of `using()` helper to create a component for a specific window instance:

```js
import { using, define } from 'minicomp'

using({ window: myWindow }).define('my-comp', () => {
  // ...
})
```

Or

```js
import { using, component } from 'minicomp'

const myComp = using({ window: myWindow }).component(() => {
  // ...
})

myWindow.customElements.define('my-comp', myComp)
```

<br>

If you need to use the document object in these components, use `ownerDocument()` helper:

```js
import { using, define, ownerDocument } from 'minicomp'

using({ window: myWindow }).define('my-comp', () => {
  const doc = ownerDocument()
  const btn = doc.createElement('button')

  // ...
})
```

<br>

It might be useful to describe components independent of the `window` object, and then define them on different
`window` instances. Use `definable` to separate component description from the `window` object:

```js
import { definable, ownerDocument } from 'minicomp'
import { re } from 'rehtm'

export default definable('say-hi', ({ to }) => {
  const { html } = re(ownerDocument())
  return html`<div>Hellow ${to}!</div>`
})
```
```js
import { using } from 'minicomp'
import SayHi from './say-hi'

const window = new Window()
using({ window }).define(SayHi)

window.document.body.innerHTML = '<say-hi to="Jack"></say-hi>'
```


<br>

# Contribution

You need [node](https://nodejs.org/en/), [NPM](https://www.npmjs.com) to start and [git](https://git-scm.com) to start.

```bash
# clone the code
git clone git@github.com:loreanvictor/minicomp.git
```
```bash
# install stuff
npm i
```

Make sure all checks are successful on your PRs. This includes all tests passing, high code coverage, correct typings and abiding all [the linting rules](https://github.com/loreanvictor/minicomp/blob/main/.eslintrc). The code is typed with [TypeScript](https://www.typescriptlang.org), [Jest](https://jestjs.io) is used for testing and coverage reports, [ESLint](https://eslint.org) and [TypeScript ESLint](https://typescript-eslint.io) are used for linting. Subsequently, IDE integrations for TypeScript and ESLint would make your life much easier (for example, [VSCode](https://code.visualstudio.com) supports TypeScript out of the box and has [this nice ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)), but you could also use the following commands:

```bash
# run tests
npm test
```
```bash
# check code coverage
npm run coverage
```
```bash
# run linter
npm run lint
```
```bash
# run type checker
npm run typecheck
```
