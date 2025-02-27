const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Cooldown extends Component {
	constructor(cooldownTime = 0) {
		super()
		this.cooldown = cooldownTime // Total cooldown time
		this.remainingTime = 0 // Remaining cooldown time
		this.isOnCooldown = false // Cooldown status flag
	}
}
