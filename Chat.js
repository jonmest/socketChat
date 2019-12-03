// require('dotenv').config();
// console.log(process.env.WEBSOCKETS_API_KEY)

class Chat extends HTMLElement {
    constructor () {
        super()
        this.shadow = this.attachShadow({ mode: 'open'})
        const styleLink = document.createElement('link')
        styleLink.href = 'https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css'
        styleLink.rel = 'stylesheet'
        this.shadow.append(styleLink)

        this.canvas = document.createElement('div')
        this.shadow.appendChild(this.canvas)

        this.messageContainer = document.querySelector('#messageContainer').cloneNode(true).content
        this.messageWritingArea = document.querySelector('#messageWritingArea').cloneNode(true).content
        this.initArea = document.querySelector('#initArea').cloneNode(true).content
        
        
        this.webSocket = new WebSocket('ws://vhost3.lnu.se:20080/socket/')
        this.channel = 'private'
        this.key = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'

    }

    connectedCallback () {
        this.getNickname()
        this.canvas.addEventListener('submittedNickname', this.initChat.bind(this))
        this.webSocket.addEventListener('message', event => {
            const message = JSON.parse(event.data)
            if (message.type === 'message') {
                console.log(message.data)

            }
        })
    }

    getNickname () {
        let nickname = null
        if (localStorage.getItem('nickname')) {
            nickname = localStorage.getItem('nickname')
            this.initChat(nickname)
        } else {
            this.canvas.appendChild(this.initArea)
            this.canvas.querySelector('form').addEventListener('submit', event => {
                event.preventDefault()
                const nickname = this.canvas.querySelector('input').value
                localStorage.setItem('nickname', nickname)
                this.initChat(nickname)
            })


        }

    }

    initChat (nickname) {
        this.canvas.removeEventListener('submit', this.nickameFormHandler)
        this.nickname = nickname

        this.canvas.innerHTML = ''
        this.canvas.appendChild(this.messageContainer)
        this.canvas.appendChild(this.messageWritingArea)

        this.canvas.querySelector('form').addEventListener('submit', this.sendMessage.bind(this))
    }

    sendMessage (event) {
        event.preventDefault()
        const message = this.canvas.querySelector('textarea').value
        const msg = {
            type: "message",
            data: message,
            username: this.nickname,
            channel: this.channel,
            key: this.key
        };

        //send the object to server
        this.webSocket.send(JSON.stringify(msg));
    }
}

customElements.define('chat-element', Chat)
