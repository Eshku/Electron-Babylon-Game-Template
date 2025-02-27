const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Speed extends Component {
	constructor(speed = 1) {
		super()
		this.speed = speed
	}
}
