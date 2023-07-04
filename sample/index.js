import './component'


import { html } from 'rehtm'


document.body.innerHTML += '<c-thingy onevenclick="console.log(`clicked!`)"></c-thingy>'
document.body.appendChild(html`<c-thingy onevenclick=${() => console.log('clicked!')}></c-thingy>`)
