const { Component } = await import(`${PATH_CORE}/Component.js`)

export class CharacterController extends Component {
	constructor({ position = v3(0, 25, 0), capsuleOptions, scene }) {
		super()

		this.characterController = new BABYLON.PhysicsCharacterController(position, capsuleOptions, scene)

		this.capsuleRadius = capsuleOptions.capsuleRadius
		this.capsuleHeight = capsuleOptions.capsuleHeight

		this.characterController.keepDistance = 0.05
		this.characterController.maxCastIterations = 10
		this.characterController.maxSlopeCosine = 0.1
		this.characterController.maxCharacterSpeedForSolver = 10
		this.characterController.characterStrength = 1e38
		this.characterController.characterMass = 0
		this.characterController.keepContactTolerance = 0.1
		this.characterController.staticFriction = 0
		this.characterController.dynamicFriction = 0.5
	}
}
