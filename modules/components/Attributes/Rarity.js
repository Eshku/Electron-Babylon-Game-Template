const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Rarity extends Component {
	constructor(value = 'common') {
		super()
		this.value = value // Store the rarity level ("common," "rare," "epic," "legendary".)
	}
}
