const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Decay extends Component {
	constructor(decayTime = 1000) {
		super()
		this.decayTime = decayTime // Total decay time in milliseconds
		this.remainingDecayTime = decayTime // Remaining decay time
		this.isDecaying = false // Flag to indicate if decay is active
	}
}
