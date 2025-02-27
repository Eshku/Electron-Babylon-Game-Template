const { System } = await import(`${PATH_CORE}/System.js`)
const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

const { Force } = await import(`${PATH_MODULES}/Physics/Force.js`)

//! might not work properly anymore.

export class ForceSystem extends System {
	constructor() {
		super()
		this.setupEvents()
	}

	setupEvents() {
		eventEmitter.on('applyForce', (entity, forceName, impulse, maxMagnitude, duration) => {
			this.addForce(entity, forceName, impulse, maxMagnitude, duration)
		})

		eventEmitter.on('deleteForce', (entity, forceName) => {
			this.deleteForce(entity, forceName)
		})
	}

	updateBeforePhysics(entities, delta) {
		for (const entity of entities) {
			this.calculateForceVelocity(entity, delta)
			this.cleanupExpiredForces(entity, delta)
		}
	}

	addForce(entity, forceName, impulse, maxMagnitude, duration) {
		const movementComponent = entity.getComponent('Movement')
		if (!movementComponent) return

		const force = new Force(forceName, impulse, maxMagnitude, duration)
		movementComponent.activeForces.set(forceName, force)
	}

	calculateForceVelocity(entity, delta) {
		let netForceVelocity = BABYLON.Vector3.Zero()

		const movementComponent = entity.getComponent('Movement')

		movementComponent.activeForces.forEach(forceData => {
			const { impulse, maxMagnitude } = forceData

			// Cap the force
			if (impulse.length() > maxMagnitude) {
				impulse.normalize()
				impulse.scaleInPlace(maxMagnitude)
			}

			// Accumulate forces
			let forceToAdd = impulse.scale(delta)
			netForceVelocity.addInPlace(forceToAdd)
		})

		movementComponent.forceVelocity.copyFrom(netForceVelocity)
	}

	cleanupExpiredForces(entity, delta) {
		const forcesToDelete = []

		const movementComponent = entity.getComponent('Movement')

		movementComponent.activeForces.forEach(forceData => {
			// Expire force by duration
			if (forceData.duration !== null) {
				forceData.duration -= delta
				if (forceData.duration <= 0) {
					forcesToDelete.push(forceData.name)
				}
			}

			//Expire force if too small
			if (forceData.impulse.length() < 0.0001) {
				forcesToDelete.push(forceData.name)
			}
		})

		forcesToDelete.forEach(forceName => {
			movementComponent.activeForces.delete(forceName)
		})
	}

	deleteForce(entity, forceName) {
		const movementComponent = entity.getComponent('Movement')
		if (!movementComponent) return
		movementComponent.activeForces.delete(forceName)
	}
}
