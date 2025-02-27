const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Jump extends Component {
	constructor(options) {
		super()
		this.jumpForce = options.jumpForce || 10
		this.jumpCount = options.jumpCount || 1
		this.jumpsRemaining = this.jumpCount
		this.canJump = false
		this.cooldown = 0.3 //hack to prevent multiple jump triggers before player goes off the ground.
		this.cooldownTimer = 0
		this.attemptingToJump = false
	}

}
