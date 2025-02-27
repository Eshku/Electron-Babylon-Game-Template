const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Parent extends Component {
	constructor(parentEntity) {
		super()
		this.parentEntity = parentEntity
	}
}
