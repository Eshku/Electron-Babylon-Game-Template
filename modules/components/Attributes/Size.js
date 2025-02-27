const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Size extends Component {
	constructor(value = 1) {
		super()
		this.value = value
	}
}
