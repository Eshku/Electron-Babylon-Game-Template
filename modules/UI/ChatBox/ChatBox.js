export class ChatBox {
	constructor() {
		this.chatboxTemplate = $(`
    <div id="game_chatbox">
      <div class="chat_messages"></div>
      <input type="text" class="chat_input" maxlength="100" />
      <div class="chat_controls">
        <div class="font_control font_increase">+</div>
        <div class="font_control font_decrease">-</div>
      </div>
    </div>
  `)

		$(canvas).after(this.chatboxTemplate)

		this.$chatbox = $('#game_chatbox')

		this.$chatInput = this.$chatbox.find('.chat_input')
		this.$chatMessages = this.$chatbox.find('.chat_messages')

		this.$fontIncrease = this.$chatbox.find('.chat_controls .font_increase')
		this.$fontDecrease = this.$chatbox.find('.chat_controls .font_decrease')

		this.setupEventListeners()
		this.fontSizeControls()
		this.addSystemMessage('Welcome to chat!')
		this.assignNickname()
	}

	static async create() {
		const { loadCSSAsync } = await import(`${PATH_LIBRARY}/Eshku.async.core.js`)

		await loadCSSAsync(`${PATH_UI}/ChatBox/ChatBox.css`)

		return new this()
	}

	async assignNickname() {
		const { entityManager } = await import(`${PATH_MANAGERS}/EntityManager.js`)
		const player = entityManager.getPlayer()

		this.nickname = player.getComponent('Name').value
	}

	setupEventListeners() {
		/*     this.$chatbox.mousedown(event => {
      event.preventDefault()
      event.stopPropagation()
      this.$chatInput.focus()
    }) */

		this.$chatbox.blur(event => {
			event.preventDefault()
			event.stopPropagation()
			this.$chatInput.blur()
		})

		this.$chatInput.keydown(event => {
			if (event.key === 'Enter') {
				const message = this.$chatInput.val().trim()
				if (message !== '') {
					this.addMessage(message)
					this.$chatInput.val('')
				}
				this.deactivateChat(event)
			} else if (event.key === 'Escape') {
				this.deactivateChat(event)
			}
		})

		$(document).keydown(event => {
			if (event.key === 'Enter') {
				this.activateChat(event)
			}
		})

		return this
	}

	activateChat(event) {
		event.preventDefault()
		event.stopPropagation()
		this.$chatInput.focus()
	}

	deactivateChat(event) {
		event.preventDefault()
		event.stopPropagation()
		this.$chatInput.blur()
	}

	sanitizeMessage(message) {
		return (
			message
				// Escape HTML special characters
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#039;')
				// Remove control characters
				.replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
				// Normalize Unicode to a consistent representation
				.normalize('NFKC')
		)
	}

	userMessageWrap(message) {
		return `<div class="message"><span class="nickname">${this.nickname}:</span> <span class="message_content">${message}</span></div>`
	}

	systemMessageWrap(message) {
		return `<div class="message system_message"><span class="nickname">System:</span> <span class="message_content">${message}</span></div>`
	}

	addMessage(message) {
		message = this.sanitizeMessage(message)
		message = this.userMessageWrap(message)
		this.$chatMessages.append(message) /* .find(`.message:last`) */
		this.$chatMessages.scrollTop(this.$chatMessages[0].scrollHeight)
	}

	addSystemMessage(message) {
		message = this.sanitizeMessage(message)
		message = this.systemMessageWrap(message)
		this.$chatMessages.append(message)
		this.$chatMessages.scrollTop(this.$chatMessages[0].scrollHeight)
	}

	fontSizeControls() {
		this.$fontIncrease.click(() => {
			let currentSize = parseInt(this.$chatbox.css('--chatbox-font-size'))
			let newSize = Math.min(16, currentSize + 1) // Maximum font size of 16px
			this.$chatbox.css('--chatbox-font-size', newSize + 'px')
			this.$chatbox.css('--chatbox-line-height', newSize + 4 + 'px')
		})

		this.$fontDecrease.click(() => {
			let currentSize = parseInt(this.$chatbox.css('--chatbox-font-size'))
			let newSize = Math.max(10, currentSize - 1) // Minimum font size of 10px
			this.$chatbox.css('--chatbox-font-size', newSize + 'px')
			this.$chatbox.css('--chatbox-line-height', newSize + 4 + 'px')
		})

		return this
	}
}
