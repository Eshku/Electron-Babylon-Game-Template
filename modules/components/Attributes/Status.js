const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Status extends Component {
	constructor(effects = []) {
		super()
		this.effects = effects // E.g., [{ type: 'burn', duration: 5, damage: 2 }]
	}
}
