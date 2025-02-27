const { Component } = await import(`${PATH_CORE}/Component.js`)

export class State extends Component {
	constructor() {
		super()

		this.isMoving = false
		this.isJumping = false
		this.isDead = false
		this.isGrounded = false
		this.isAirborne = true
		this.isFalling = false
		this.isCasting = false
	}
}
