const { Entity } = await import(`${PATH_CORE}/Entity.js`)
const { entityManager } = await import(`${PATH_MANAGERS}/EntityManager.js`)

const { EventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

const { FireballProjectile } = await import(`${PATH_PREFABS}/Projectiles/FireballProjectile.js`)

export class Fireball extends Entity {
	constructor() {
		super()

		this.entityType = `Skill`
		this.projectileClass = FireballProjectile

		this.compose({
			name: 'Fireball',
			type: 'Projectile',
			icon: `${PATH_ICONS}/skills/64/fireball.png`,
			rarity: 'Epic',
			cooldown: 0.5,
			damage: 100,
			range: 200,
			speed: 100,
			status: [{ type: 'Burn', duration: 5, damage: 20 }],
			size: 0.1,
			decay: 5,
			delay: 0.5,
		})
	}

	async init() {
		const fireballMesh = BABYLON.MeshBuilder.CreateSphere('Fireball', {
			diameter: this.getComponent('Size').value,
			segments: 16,
		})

		const fireballMaterial = new BABYLON.StandardMaterial('fireMaterial', scene)
		fireballMaterial.diffuseColor = new BABYLON.Color3(1, 0.5, 0)
		fireballMaterial.emissiveColor = new BABYLON.Color3(1, 0.5, 0)

		this.addComponent('Mesh', {
			mesh: fireballMesh,
			options: {
				material: fireballMaterial,
				isPickable: false,
				checkCollisions: false,
				receiveShadows: false,
				isVisible: false,
			},
		})
	}
}
