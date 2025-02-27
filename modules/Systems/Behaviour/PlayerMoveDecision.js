const { System } = await import(`${window.PATH_CORE}/System.js`)

export class PlayerMoveDecision extends System {
	constructor() {
		super()
	}

	init() {}

	async updateBeforePhysics(entities, delta) {
		for (const entity of entities.values()) {
			const movementComponent = entity.getComponent('Movement')

			movementComponent.moveDirection.set(0, 0, 0)
			this.getMoveDirection(entity, movementComponent)
		}
	}

	getMoveDirection(entity, movementComponent) {
		this.getPlayerViewDirection(movementComponent)
		this.getPlayerInput(entity, movementComponent)

		// Normalize the move direction
		movementComponent.moveDirection = BABYLON.Vector3.Normalize(
			new BABYLON.Vector3(movementComponent.moveDirection.x, 0, movementComponent.moveDirection.z)
		)
	}

	async getPlayerViewDirection(movementComponent) {
		const camera = (await import(`${PATH_ROOT}/setup.js`)).camera
		const newCameraDirection = camera.getDirection(BABYLON.Vector3.Backward())

		if (!movementComponent.cameraDirection.equals(newCameraDirection)) {
			movementComponent.cameraDirection = newCameraDirection

			//! probably inverted because my model is
			movementComponent.forward.set(newCameraDirection.x, newCameraDirection.y, newCameraDirection.z)
			movementComponent.backward.set(-newCameraDirection.x, newCameraDirection.y, -newCameraDirection.z)
			movementComponent.left.set(newCameraDirection.z, newCameraDirection.y, -newCameraDirection.x)
			movementComponent.right.set(-newCameraDirection.z, newCameraDirection.y, newCameraDirection.x)
		}
	}

	getPlayerInput(entity, movementComponent) {
		const controller = entity.getComponent('Controller')

		// Handle input and apply direction
		for (const direction of controller.directionalKeys) {
			if (controller.isKeyDown(direction)) {
				movementComponent.moveDirection.addInPlace(movementComponent[direction])
			}
		}
	}
}
