const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Range extends Component {
	constructor(range = 100) {
		super()
		this.range = range
		this.traveledDistance = 0
	}
}
