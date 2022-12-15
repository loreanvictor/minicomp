import sleep from 'sleep-promise'
import { from, observe } from 'quel'

import './component'


const testEl$ = document.querySelector('test-el')
const moveClick = from(document.querySelector('#move'))
const removeClick = from(document.querySelector('#remove'))
const rate = from(document.querySelector('input'))
const debounced = async $ => {
  const r = $(rate) ?? 200
  await sleep(200)

  return r
}

observe(async $ => testEl$.setAttribute('rate', $(debounced)))

observe($ => {
  if($(moveClick)) {
    testEl$.remove()
    document.body.appendChild(testEl$)
  }
})

observe($ => $(removeClick) && testEl$.remove())
