const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Direction extends Component {
	constructor(direction = BABYLON.Vector3.Zero()) {
		super()
		this.direction = direction
	}
}
