const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Crit extends Component {
	constructor(chance = 0, multiplier = 1.5) {
		super()
		this.chance = chance // 0.0 to 1.0 or in %
		this.multiplier = multiplier
	}
}
