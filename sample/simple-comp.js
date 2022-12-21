import { define, onAttributeChanged, on } from '../src'


define('say-hi', ({ to }) => {
  onAttributeChanged((name, value, self) =>
    name === 'to' &&
    (self.shadowRoot.querySelector('span').textContent = value)
  )

  on('click', () => console.log('CLICKED!'))

  return `<div>Hellow <span>${to}</span></div>`
})
