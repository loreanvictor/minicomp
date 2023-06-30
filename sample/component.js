import { define } from '../src'
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
