const { System } = await import(`${PATH_CORE}/System.js`)

const { entityManager } = await import(`${PATH_MANAGERS}/EntityManager.js`)

const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

export class MovementSystem extends System {
	constructor() {
		super()
	}

	updateBeforePhysics(entities, delta) {
		for (const entity of entities) {
			const movementComponent = entity.getComponent('Movement')
			const stateComponent = entity.getComponent('State')

			const characterController = entity.getComponent(`CharacterController`).characterController

			const gravity = this.calculateFallSpeed(entity, delta)

			const surfaceInfo = characterController.checkSupport(delta, BABYLON.Vector3.Down())

			let totalVelocity = BABYLON.Vector3.Zero()

			totalVelocity.addInPlace(this.calculateinputVelocity(entity))

			totalVelocity.addInPlace(movementComponent.impulseVelocity.clone())
			totalVelocity.addInPlace(movementComponent.forceVelocity)

			totalVelocity.addInPlace(gravity.scale(delta))

			this.preventDrifting(entity, delta)

			const horizontalVelocity = new BABYLON.Vector3(totalVelocity.x, 0, totalVelocity.z)

			const verticalVelocity = new BABYLON.Vector3(0, totalVelocity.y, 0)

			let upWorld = gravity.normalizeToNew().scaleInPlace(-1.0)

			let outputVelocity = this.calculateDesiredVelocity(entity, delta, surfaceInfo, horizontalVelocity, upWorld)

			{
				//prevent sliding down the slope
				//TODO need to check surface angle to allow sliding down too steep slopes.
				if (stateComponent.isGrounded && verticalVelocity.y > 0) {
					outputVelocity.addInPlace(verticalVelocity)
				}
				if (!stateComponent.isGrounded && verticalVelocity.y < 0) {
					outputVelocity.addInPlace(verticalVelocity)
				}
			}

			this.resetProperties(entity)
			movementComponent.velocity.copyFrom(outputVelocity)
			characterController.setVelocity(outputVelocity)

			characterController.integrate(delta, surfaceInfo, verticalVelocity)
		}
	}

	updateAfterPhysics(entities, delta) {
		for (const entity of entities) {
			this.applyPositionToMesh(entity)
		}
	}

	resetProperties(entity) {
		//reset what needs to be reset after all calculations
		const movementComponent = entity.getComponent('Movement')

		movementComponent.impulseVelocity = BABYLON.Vector3.Zero()
	}

	calculateFallSpeed(entity, delta) {
		const movementComponent = entity.getComponent('Movement')
		const meshComponent = entity.getComponent('Mesh')
		const stateComponent = entity.getComponent('State')

		if (stateComponent.isGrounded) {
			movementComponent.currentFallSpeed = movementComponent.fallSpeed
		} else {
			movementComponent.currentFallSpeed > movementComponent.maxFallSpeed
				? (movementComponent.currentFallSpeed += movementComponent.fallSpeed * delta)
				: (movementComponent.currentFallSpeed = movementComponent.maxFallSpeed)
		}
		return new BABYLON.Vector3(0, movementComponent.currentFallSpeed, 0)
	}

	preventDrifting(entity, delta) {
		//partially working workaround.
		//Friction does not affect velocity kept by calculateMovement

		const stateComponent = entity.getComponent('State')
		const movementComponent = entity.getComponent('Movement')
		const characterController = entity.getComponent(`CharacterController`).characterController

		//TODO should also check forceVelocity
		if (
			stateComponent.isGrounded &&
			movementComponent.moveDirection.lengthSquared() < 0.01 &&
			movementComponent.impulseVelocity.lengthSquared() < 0.01
		) {
			// If grounded, no significant input, and no impulses, dampen velocity
			const currentVelocity = characterController.getVelocity()
			const dampeningFactor = 0.8 // how quickly velocity is reduced. Lower values = faster dampening.
			characterController.setVelocity(currentVelocity.scale(dampeningFactor))
		}
	}

	calculateinputVelocity(entity) {
		const movementComponent = entity.getComponent('Movement')
		// Replacing previous input velocity
		const inputVelocity = movementComponent.moveDirection.scale(movementComponent.speed)
		movementComponent.inputVelocity.copyFrom(inputVelocity)

		return inputVelocity
	}

	calculateDesiredVelocity(entity, delta, surfaceInfo, desiredVelocity, upWorld) {
		const stateComponent = entity.getComponent('State')
		const meshComponent = entity.getComponent(`Mesh`)
		const characterController = entity.getComponent(`CharacterController`).characterController

		let currentVelocity = characterController.getVelocity()

		const forwardWorld = meshComponent.mesh.getDirection(BABYLON.Axis.Z)

		let outputVelocity = characterController.calculateMovement(
			delta,
			forwardWorld,
			stateComponent.isGrounded ? surfaceInfo.averageSurfaceNormal : upWorld,
			currentVelocity,
			stateComponent.isGrounded ? surfaceInfo.averageSurfaceVelocity : BABYLON.Vector3.Zero(),
			desiredVelocity,
			upWorld
		)

		return outputVelocity
	}

	applyPositionToMesh(entity) {
		const meshComponent = entity.getComponent('Mesh')
		const characterController = entity.getComponent(`CharacterController`).characterController

		const controllerPosition = characterController.getPosition()
		meshComponent.mesh.position.copyFrom(controllerPosition.subtract(entity.playerMeshOffsetFromCenter))
	}
}
