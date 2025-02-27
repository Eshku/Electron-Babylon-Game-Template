const { Entity } = await import(`${PATH_CORE}/Entity.js`)
const { entityManager } = await import(`${PATH_MANAGERS}/EntityManager.js`)

const { EventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

export class FireballProjectile extends Entity {
	constructor(skillEntity) {
		super()
		this.entityType = 'Projectile'
		this.skillEntity = skillEntity
	}
	init() {
		const baseMesh = this.skillEntity.getComponent('Mesh').mesh
		const clonedMesh = baseMesh.clone(`FireballInstance ${this.id}`)

		clonedMesh.material = baseMesh.material.clone('FireballMaterialClone')


		this.compose({
			name: this.skillEntity.getComponent('Name').value,
			decay: this.skillEntity.getComponent('Decay').decayTime,
			damage: this.skillEntity.getComponent('Damage').value,
			size: this.skillEntity.getComponent('Size').value,
			speed: this.skillEntity.getComponent('Speed').speed,
			range: this.skillEntity.getComponent('Range').range,
			direction: { value: BABYLON.Vector3.Zero() },
			mesh: {
				mesh: clonedMesh,
				options: {
					material: clonedMesh.material,
					isVisible: 1,
					checkCollisions: false,
					isPickable: false,
					receiveShadows: false,
				},
			},
		})
		//mesh component cloning is dumb.
	}
}
