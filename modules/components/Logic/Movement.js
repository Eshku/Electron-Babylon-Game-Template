const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Movement extends Component {
	constructor(movementStats) {
		super()

		this.inputVelocity = BABYLON.Vector3.Zero()

		this.velocity = BABYLON.Vector3.Zero()

		this.speed = movementStats.speed || 1

		this.fallSpeed = movementStats.fallSpeed || -40
		this.currentFallSpeed = movementStats.fallSpeed
		this.maxFallSpeed = movementStats.fallSpeed * 10

		this.forward = BABYLON.Vector3.Zero()
		this.backward = BABYLON.Vector3.Zero()
		this.left = BABYLON.Vector3.Zero()
		this.right = BABYLON.Vector3.Zero()

		this.moveDirection = BABYLON.Vector3.Zero()
		this.cameraDirection = BABYLON.Vector3.Zero()
		this.newCameraDirection = BABYLON.Vector3.Zero()

		this.rotationSpeed = 8

		this.activeForces = new Map()
		this.forceVelocity = BABYLON.Vector3.Zero()

		this.pendingImpulses = []
		this.impulseVelocity = BABYLON.Vector3.Zero()

		this.snap = false

		this.prevSupportState = 'UNSUPPORTED'
	}
}
