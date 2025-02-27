const { System } = await import(`${PATH_CORE}/System.js`)
const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

export class JumpSystem extends System {
	constructor() {
		super()
	}

	init() {}

	updateBeforePhysics(entities, delta) {
		for (const entity of entities) {
			const jumpComponent = entity.getComponent('Jump')
			const controller = entity.getComponent('Controller')
			const stateComponent = entity.getComponent('State')

			// Decrease cooldown timer
			jumpComponent.cooldownTimer = Math.max(0, jumpComponent.cooldownTimer - delta)

			// Check if jump is allowed
			jumpComponent.canJump =
				jumpComponent.cooldownTimer === 0 && stateComponent.isGrounded && controller.isKeyDown('jump')

			if (jumpComponent.canJump) {
				const jumpForce = jumpComponent.jumpForce
				eventEmitter.emit('applyImpulse', entity, new BABYLON.Vector3(0, jumpForce, 0))

				jumpComponent.cooldownTimer = jumpComponent.cooldown // Reset cooldown timer

			}
		}
	}
}
