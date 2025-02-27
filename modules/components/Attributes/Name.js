const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Name extends Component {
	constructor(name = '') {
		super()
		this.value = name.charAt(0).toUpperCase() + name.slice(1)
	}
}
