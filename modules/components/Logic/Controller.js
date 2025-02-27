const { Component } = await import(`${PATH_CORE}/Component.js`)

const { controls } = await import(`${PATH_MODULES}/controls.js`)

export class Controller extends Component {
	constructor(controllerType) {
		super()
		this.controllerType = controllerType

		this.keyMap = controls.keyMap
		this.directionalKeys = []

		if (this.controllerType === 'player') {
			this.directionalKeys = Object.keys(this.keyMap).filter(key => this.keyMap[key].class === 'direction')
		}
	}

	isKeyDown(keyName) {
		return this.keyMap[keyName] && this.keyMap[keyName].active
	}
}
