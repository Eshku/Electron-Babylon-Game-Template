const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Target extends Component {
	constructor(targetTypes = []) {
		super()
		this.targetTypes = targetTypes // Array of strings (e.g., ["enemy", "ally", "terrain", "self"])
	}

	canTarget(type) {
		return this.targetTypes.includes(type)
	}
}
