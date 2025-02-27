const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Skills extends Component {
	constructor(slots = Array(10).fill(null)) {
		super()
		this.slots = slots
	}

	getSkill(index) {
		return this.slots[index]
	}
}
