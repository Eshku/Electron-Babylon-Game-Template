const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Description extends Component {
	constructor(text = '', variables = {}) {
		super()
		this.text = text
		this.variables = variables // Optional:  Variables for dynamic descriptions
	}
}
