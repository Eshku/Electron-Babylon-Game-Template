const { System } = await import(`${window.PATH_CORE}/System.js`)

const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

// probably no need to do stuff every frame
// Maybe just once at the start of each frame based on physics info
// After that probably just make it react to changes and send info to animation system.

export class StateSystem extends System {
	constructor() {
		super()
	}

	updateBeforePhysics(entities, delta) {
		for (const entity of entities) {
			const stateComp = entity.getComponent('State')

			this.assignPrevPhysicsState(entity, delta)

			const newState = this.getEntityState(entity)


			/* if (!this.areStatesEqual(stateComp, newState)) { */
				Object.assign(stateComp, newState)

				eventEmitter.emit('stateChanged', entity, stateComp)
			/* } */
		}
	}

	getEntityState(entity) {
		const movement = entity.getComponent('Movement')
		const health = entity.getComponent('Health')
		const state = entity.getComponent('State')

		const controller = entity.getComponent('Controller')

		const { isGrounded, isFalling, isJumping, isAirborne } = this.assumeCurrentState(entity)

		return {
			isDead: health.health <= 0,
			isMoving:
				controller.controllerType === 'player'
					? controller.directionalKeys.some(key => controller.isKeyDown(key))
					: false, //only player for now

			isCasting: controller.isKeyDown('MainAttack'),
			isGrounded: isGrounded,
			isFalling: isFalling,
			isJumping: isJumping,
			isAirborne: isAirborne,
		}
	}

	assignPrevPhysicsState(entity, delta) {
		const characterController = entity.getComponent(`CharacterController`).characterController
		const movementComponent = entity.getComponent('Movement')

		const surfaceInfo = characterController.checkSupport(delta, BABYLON.Vector3.Down())

		movementComponent.prevSupportState = this.getEnumSupportState(surfaceInfo)
	}

	assumeCurrentState(entity) {
		const { prevSupportState, velocity } = entity.getComponent(`Movement`)
		let isGrounded = false
		let isFalling = false
		let isJumping = false
		let isAirborne = false

		switch (prevSupportState) {
			case 'SUPPORTED':
				isGrounded = true
				break
			case 'SLIDING':
				isGrounded = true
				break
			case 'UNSUPPORTED':
				isFalling = true
				break
			case 'UNKNOWN':
				console.warn('unknown state')
				break
		}

		if (velocity.y > 0.1) {
			isJumping = true //could be force, need better condition
			isFalling = false
		}

		if (velocity.y < 0) {
			isJumping = false
			isFalling = true
		}

		if (isGrounded) {
			isJumping = false
			isFalling = false
		}

		if (isFalling || isJumping) {
			isAirborne = true
		} else {
			isAirborne = false
		}

		return { isGrounded, isFalling, isJumping, isAirborne }
	}

	getEnumSupportState(surfaceInfo) {
		const supportedState = surfaceInfo.supportedState

		if (supportedState === BABYLON.CharacterSupportedState.UNSUPPORTED) {
			return 'UNSUPPORTED'
		} else if (supportedState === BABYLON.CharacterSupportedState.SLIDING) {
			return 'SLIDING'
		} else if (supportedState === BABYLON.CharacterSupportedState.SUPPORTED) {
			return 'SUPPORTED'
		} else {
			console.warn(`Unsupported State ${supportedState}`)
			return 'UNKNOWN'
		}
	}

/* 	areStatesEqual(prevState, newState) {
		for (const key in newState) {
			if (prevState[key] !== newState[key]) {

				return false
			}
		}
		return true
	} */
}
