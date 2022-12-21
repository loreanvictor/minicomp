<img src="logo-dark.svg#gh-dark-mode-only" height="108px"/>
<img src="logo-light.svg#gh-light-mode-only" height="108px"/>

[![tests](https://github.com/loreanvictor/minicomp/actions/workflows/test.yml/badge.svg)](https://github.com/loreanvictor/minicomp/actions/workflows/test.yml)
[![version](https://img.shields.io/npm/v/minicomp?logo=npm)](https://www.npmjs.com/package/minicomp)
![types](https://img.shields.io/npm/types/minicomp)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/minicomp?color=black&label=size)](https://bundlephobia.com/package/minicomp@latest)

Define [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) using functions and hooks:

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

[**minicomp**](.) is a simple wrapper over [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements), reducing code boilerplate and providing composability and extensibility of hooks. It does NOT use virtual DOM, does NOT handle reconcilliation, doesn't even care how you create or update the HTML elements used in your components.

<br>

# Installation

On [node](https://nodejs.org/en/):
```bash
npm i minicomp
```
In the browser:
```js
import { define } from 'https://esm.sh/minicomp'
```

<br>

# Usage

Define a custom element:

```js
import { define } from 'minicomp'

define('my-el', () => '<div>Hellow World!</div>')
```
```html
<my-el></my-el>
```

> ☝️ A component function can return a `Node` or a string representation of some DOM.

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

Use `using()` to define a component that extends another built-in element:

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

## Provided Hooks

```ts
onCleanup(hook: () => void)
```

Is called after the element is removed from the document and not added back immediately.

<br>

```ts
onAttribute(
  name: string,
  hook: (value: string | typeof ATTRIBUTE_REMOVED | undefined) => void
)
```
Is called with the initial value of the attribute (`undefined` if not passed initially) and whenever the value of the attribute changes (via `.setAttribute()`). Will be called with `ATTRIBUTE_REMOVED` symbol when the attribute is removed (via `.removeAttribute()`).

<br>

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
👉 [Try it out!](https://codepen.io/lorean_victor/pen/vYroJwP)

<br>

# Contribution

You need [node](https://nodejs.org/en/), [NPM](https://www.npmjs.com) to start and [git](https://git-scm.com) to start.

```bash
# clone the code
git clone git@github.com:loreanvictor/quel.git
```
```bash
# install stuff
npm i
```

Make sure all checks are successful on your PRs. This includes all tests passing, high code coverage, correct typings and abiding all [the linting rules](https://github.com/loreanvictor/quel/blob/main/.eslintrc). The code is typed with [TypeScript](https://www.typescriptlang.org), [Jest](https://jestjs.io) is used for testing and coverage reports, [ESLint](https://eslint.org) and [TypeScript ESLint](https://typescript-eslint.io) are used for linting. Subsequently, IDE integrations for TypeScript and ESLint would make your life much easier (for example, [VSCode](https://code.visualstudio.com) supports TypeScript out of the box and has [this nice ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)), but you could also use the following commands:

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
