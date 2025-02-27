const { System } = await import(`${window.PATH_CORE}/System.js`)

export class RotationSystem extends System {
	constructor() {
		super()
	}

	init() {}

	update(entities, delta) {
		for (const entity of entities) {
			const movementComponent = entity.getComponent('Movement')
			const meshComponent = entity.getComponent('Mesh')

			// Get movement direction from velocity
			const moveDirection = movementComponent.inputVelocity.clone()
			moveDirection.y = 0 // ignore vertical direction

			// Calculate target rotation only if there's movement
			if (moveDirection.lengthSquared() > 0) {
				moveDirection.normalize() //prevent diagonal speed increase
				// Calculate the target Y rotation based on the direction of movement
				meshComponent.mesh.rotation.targetY = Math.atan2(moveDirection.x, moveDirection.z)
			}

			// Smooth rotation towards targetY
			if (meshComponent.mesh.rotation.targetY) {
				const rotationDifference = Math.atan2(
					Math.sin(meshComponent.mesh.rotation.targetY - meshComponent.mesh.rotation.y),
					Math.cos(meshComponent.mesh.rotation.targetY - meshComponent.mesh.rotation.y)
				)

				// Apply smooth rotation with max speed constraint
				const maxRotationChange = 8 * delta
				meshComponent.mesh.rotation.y += Math.max(-maxRotationChange, Math.min(maxRotationChange, rotationDifference))
			}
		}
	}
}
