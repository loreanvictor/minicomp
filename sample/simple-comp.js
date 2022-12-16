import { html } from 'htmplate'
import { define } from '../src'


define('say-hi', ({ name }) => html`<div>Hello ${name}</div>`)
