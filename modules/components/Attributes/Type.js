const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Type extends Component {
	constructor(type = null) {
		super()
		this.type = type
	}
}
