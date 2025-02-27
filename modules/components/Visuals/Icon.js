const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Icon extends Component {
	constructor(path = '') {
		super()
		this.path = path
	}
}
