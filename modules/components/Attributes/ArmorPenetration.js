const { Component } = await import(`${PATH_CORE}/Component.js`)

export class ArmorPenetration extends Component {
	constructor(value = 0, type = 'flat') {
		// or 'percentage'
		super()
		this.value = value
		this.type = type // How armor penetration is calculated
	}
}
