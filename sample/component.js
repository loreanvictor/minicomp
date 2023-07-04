import { define, useDispatch } from '../src'
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

define('b-stuff', () => template`<div>Hellow <slot></slot></div>`)

define('c-thingy', () => {
  let count = 0
  const dispatch = useDispatch('evenclick')
  const click = () => ++count % 2 === 0 && dispatch(count)

  return template`<button onclick=${click}>Click ME!</button>`
})
