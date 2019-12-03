require('dotenv').config();
console.log(process.env.WEBSOCKETS_API_KEY)

class Chat extends HTMLElement {
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open'})
        this.messageContainer = document.querySelector('#messageContainer').cloneNode(true).content
        this.messageWritingArea = document.querySelector('#messageWritingArea').cloneNode(true).content
        this.initArea = document.querySelector('#initArea').cloneNode(true).content

    }
}