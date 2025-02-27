const { System } = await import(`${PATH_CORE}/System.js`)
const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

export class ImpulseSystem extends System {
	constructor() {
		super()
		this.setupEvents()
	}

	setupEvents() {
		eventEmitter.on('applyImpulse', (entity, impulse) => {
			this.addImpulse(entity, impulse)
		})
	}

	updateBeforePhysics(entities, delta) {
		for (const entity of entities) {
			this.calculateImpulseVelocity(entity)
		}
	}

	addImpulse(entity, impulse) {
		entity.getComponent('Movement').pendingImpulses.push(impulse)
	}

	calculateImpulseVelocity(entity) {
		//Apply any pending impulses
		const movementComponent = entity.getComponent('Movement')
		const impulseVelocity = BABYLON.Vector3.Zero()

		if (movementComponent.pendingImpulses.length > 0) {
			for (const impulse of movementComponent.pendingImpulses) {
				impulseVelocity.addInPlace(impulse)
			}
			// Clear the impulse queue after applying them.
			movementComponent.pendingImpulses = []
		}
		movementComponent.impulseVelocity.addInPlace(impulseVelocity)
	}
}
