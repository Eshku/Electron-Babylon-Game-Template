const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Stackable extends Component {
	constructor(maxStackSize = 1) {
		super()
		this.maxStackSize = maxStackSize
		this.currentAmount = 0
	}
}
