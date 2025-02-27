const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Lifetime extends Component {
	constructor(duration = 1000) {
		super()
		this.duration = duration
		this.elapsedTime = 0
	}
}
