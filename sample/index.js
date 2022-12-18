import sleep from 'sleep-promise'
import { from, observe } from 'quel'

import './component'
import './simple-comp'

const simple$ = document.querySelector('say-hi')

const testEl$ = document.querySelector('test-el')
const moveClick = from(document.querySelector('#move'))
const removeClick = from(document.querySelector('#remove'))
const rate = from(document.querySelector('input'))

observe(async $ => {
  await sleep(200)
  $(rate) && testEl$.setAttribute('rate',  parseInt($(rate)))
})

observe($ => {
  if($(moveClick)) {
    testEl$.remove()
    document.body.appendChild(testEl$)

    simple$.setAttribute('to', 'Jack')
  }
})

observe($ => $(removeClick) && testEl$.remove())
