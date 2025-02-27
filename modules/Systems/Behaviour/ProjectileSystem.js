const { System } = await import(`${PATH_CORE}/System.js`)
const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)
const { entityManager } = await import(`${PATH_MANAGERS}/EntityManager.js`)

const { camera } = await import(`${PATH_ROOT}/setup.js`)

export class ProjectileSystem extends System {
	constructor() {
		super()

		this.ray = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Down())
		this.enableDebugRay = false
		this.rayHelper = null
		this.debugRayLength = 200
	}

	init() {
		this.setupEventListeners()
	}

	setupEventListeners() {
		eventEmitter.on('createProjectile', skillEntity => this.createProjectile(skillEntity))
	}

	async createProjectile(skillEntity) {
		let projectile = await entityManager.createEntity(skillEntity.projectileClass, skillEntity)

		const { direction, castPosition } = this.getAimData(skillEntity.getComponent('Range').range)
		projectile.getComponent('Direction').value = direction

		const meshComp = projectile.getComponent('Mesh')
		meshComp.mesh.position.copyFrom(castPosition)

		this.applyParticleEmitter(projectile)
	}

	getAimData(skillRange) {
		const player = entityManager.getPlayer()
		if (!player) return { direction: BABYLON.Vector3.Zero(), castPosition: BABYLON.Vector3.Zero() }

		const meshComponent = player.getComponent('Mesh')
		const skeleton = player.getComponent('Skeleton').skeleton
		const rightHandBone = skeleton.bones.find(b => b.id === 'mixamorig:RightHand')
		const castPosition = rightHandBone.getAbsolutePosition(meshComponent.mesh)

		const screenCenter = new BABYLON.Vector2(canvas.width / 2, canvas.height / 2)
		const ray = scene.createPickingRay(screenCenter.x, screenCenter.y, BABYLON.Matrix.Identity(), camera)
		ray.length = skillRange

		const pickInfo = scene.pickWithRay(
			ray,
			mesh => mesh !== meshComponent.mesh && mesh.isPickable && !mesh.projectileEntity && mesh.checkCollisions
		)
		let direction =
			pickInfo && pickInfo.hit
				? pickInfo.pickedPoint.subtract(castPosition).normalize()
				: ray.origin.add(ray.direction.scale(skillRange)).subtract(castPosition).normalize()

		return { direction, castPosition }
	}

	applyParticleEmitter(projectile) {
		const meshComponent = projectile.getComponent('Mesh')
		const emitter = new BABYLON.GPUParticleSystem('projectileEmitter', 500)

		emitter.particleTexture = new BABYLON.Texture(`${PATH_ASSETS}/particles/fire_01.png`)
		emitter.emitter = meshComponent.mesh

		emitter.minSize = 0.1
		emitter.maxSize = 0.5
		emitter.minLifeTime = 0.1
		emitter.maxLifeTime = 0.2
		emitter.minEmitPower = 1
		emitter.maxEmitPower = 20
		emitter.emitRate = 500
		emitter.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD

		emitter.updateSpeed = 0.01

		emitter.addColorGradient(0.0, new BABYLON.Color4(0.8, 0.2, 0.0, 1))
		emitter.addColorGradient(0.2, new BABYLON.Color4(1.0, 0.4, 0.0, 1))
		emitter.addColorGradient(0.5, new BABYLON.Color4(1.0, 0.8, 0.2, 1))
		emitter.addColorGradient(0.8, new BABYLON.Color4(1.0, 0.2, 0.0, 0.5))
		emitter.addColorGradient(1.0, new BABYLON.Color4(0.5, 0.0, 0.0, 0))

		emitter.start()
		projectile.particleEmitter = emitter
	}

	update(entities, delta) {
		for (const projectile of entities) {
			const meshComponent = projectile.getComponent('Mesh')

			const projectileMesh = meshComponent.mesh
			const decayComponent = projectile.getComponent('Decay')
			const speed = projectile.getComponent('Speed').speed
			const direction = projectile.getComponent('Direction').value.clone().normalize()
			const velocity = direction.scale(speed)

			if (decayComponent.isDecaying) {
				this.updateDecay(projectile, delta)
			} else {
				if (!this.checkCollision(projectile, velocity, delta)) {
					this.moveProjectile(projectileMesh, velocity, delta)
				}
				this.checkRangeLimit(projectile, delta)
			}
		}
		if (this.enableDebugRay) this.drawDebugRay()
	}

	checkRangeLimit(projectile, delta) {
		const rangeComponent = projectile.getComponent('Range')
		const speedComponent = projectile.getComponent('Speed')
		if (!rangeComponent || !speedComponent) return

		rangeComponent.traveledDistance += speedComponent.value * delta
		if (rangeComponent.traveledDistance >= rangeComponent.value) {
			this.despawnProjectile(projectile)
		}
	}

	checkCollision(projectile, velocity, delta) {
		const projectileMesh = projectile.getComponent('Mesh').mesh

		this.ray.origin.copyFrom(projectileMesh.position)
		this.ray.direction = velocity.clone().normalize()
		this.ray.length = velocity.length() * delta

		const player = entityManager.getPlayer()
		const playerMesh = player.getComponent('Mesh').mesh

		const pickInfo = scene.pickWithRay(this.ray, mesh => {
			return mesh !== projectileMesh && mesh.checkCollisions && mesh.isPickable && mesh !== playerMesh
		})

		if (pickInfo && pickInfo.hit && !projectile.getComponent('Decay').isDecaying) {
			projectileMesh.position.copyFrom(pickInfo.pickedPoint)
			projectile.getComponent('Decay').isDecaying = true
			return true
		}
		return false
	}

	moveProjectile(projectileMesh, velocity, delta) {
		projectileMesh.position.addInPlace(velocity.scale(delta))
	}

	updateDecay(projectile, delta) {
		const decayComponent = projectile.getComponent('Decay')
		decayComponent.remainingDecayTime -= delta
		if (decayComponent.remainingDecayTime <= 0) {
			this.despawnProjectile(projectile)
		}
	}

	despawnProjectile(projectile) {
		const meshComponent = projectile.getComponent('Mesh')
		if (meshComponent && meshComponent.mesh) meshComponent.mesh.dispose()
		if (projectile.particleEmitter) {
			projectile.particleEmitter.stop()
			projectile.particleEmitter.dispose()
		}

		entityManager.destroyEntity(projectile)
	}

	drawDebugRay() {
		const { direction, castPosition } = this.getAimData(this.debugRayLength)
		const debugRay = new BABYLON.Ray(castPosition, direction, this.debugRayLength)
		const player = entityManager.getPlayer()

		if (!this.rayHelper) this.rayHelper = new BABYLON.RayHelper(debugRay)
		else this.rayHelper.ray = debugRay

		const screenCenter = new BABYLON.Vector2(canvas.width / 2, canvas.height / 2)
		const pickInfo = scene.pickWithRay(
			scene.createPickingRay(screenCenter.x, screenCenter.y, BABYLON.Matrix.Identity(), camera),
			mesh => mesh.isPickable && mesh !== player.getComponent('Mesh').mesh
		)
		const color = pickInfo && pickInfo.hit ? BABYLON.Color3.Green() : BABYLON.Color3.Red()
		this.rayHelper.show(scene, color)
	}
}
