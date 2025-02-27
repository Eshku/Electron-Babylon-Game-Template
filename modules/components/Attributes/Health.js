const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Health extends Component {
	constructor(maxHealth) {
		super()
		this.health = maxHealth
		this.maxHealth = maxHealth
	}
}
