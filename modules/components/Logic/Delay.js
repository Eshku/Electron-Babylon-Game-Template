const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Delay extends Component {
	constructor(delay = 0) {
		super()
		this.delay = delay
	}
}
