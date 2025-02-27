const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Damage extends Component {
	constructor(damageValue = 0, damageType = 'physical') {
		super()
		this.value = damageValue
		this.type = damageType
	}
}
