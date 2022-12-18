import { define, onAttributeChanged } from '../src'


define('say-hi', ({ to }) => {
  onAttributeChanged((name, value, self) =>
    name === 'to' &&
    (self.shadowRoot.querySelector('span').textContent = value)
  )

  return `<div>Hellow <span>${to}</span></div>`
})
