const { Entity } = await import(`${PATH_CORE}/Entity.js`)
const { entityManager } = await import(`${PATH_MANAGERS}/EntityManager.js`)
const { EventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)
const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

const { Fireball } = await import(`${PATH_PREFABS}/Skills/Fireball.js`)

const { assetManager } = await import(`${PATH_MANAGERS}/AssetManager.js`)

export class Player extends Entity {
	constructor() {
		super()
		this.entityType = 'Player'
		this.eventEmitter = new EventEmitter()
	}

	async init() {
		const asset = await assetManager.loadAndCloneAssetAsync('Player', './assets/3d/', 'Player.gltf')

		const { ellipsoid, ellipsoidCenterOffsetFromBottom } = this.calculateEllipsoidData(asset.rootNodes[0])

		const capsuleRadius = 0.31
		const capsuleHeight = ellipsoid.y * 2 // Subtract radius from both ends
		const capsuleCenterOffsetFromPlayerPosition = ellipsoidCenterOffsetFromBottom.clone()
		const capsulePosition = asset.rootNodes[0].position.clone().addInPlace(capsuleCenterOffsetFromPlayerPosition)

		const capsuleBottom = asset.rootNodes[0].position.clone().add(new BABYLON.Vector3(0, capsuleRadius, 0)) // Add radius to bottom
		const capsuleTop = capsuleBottom.add(new BABYLON.Vector3(0, capsuleHeight, 0))

		this.playerMeshOffsetFromCenter = ellipsoidCenterOffsetFromBottom.clone()

		await this.compose({
			name: `Eshku`,
			health: 250,
			controller: 'player',
			mesh: {
				mesh: asset.rootNodes[0],
				options: {
					//checkCollisions: true,
					addShadowCaster: true,
					ellipsoid: new BABYLON.Vector3(ellipsoid.x, ellipsoid.y, ellipsoid.z),
					ellipsoidOffsetY: ellipsoidCenterOffsetFromBottom.y,
				},
			},
			characterController: {
				position: v3(0, 50, 0),
				capsuleOptions: { capsuleHeight: capsuleHeight, capsuleRadius: capsuleRadius },
				scene,
			},
			skeleton: asset.skeletons[0],
			animation: asset.animationGroups,
			movement: { speed: 10, fallSpeed: -25 },
			jump: { jumpForce: 20 },
			state: null,
		})

		let skillsToAssign = [
			await entityManager.createEntity(Fireball),
			await entityManager.createEntity(Fireball),
			await entityManager.createEntity(Fireball),
			await entityManager.createEntity(Fireball),
			await entityManager.createEntity(Fireball),
			await entityManager.createEntity(Fireball),
			await entityManager.createEntity(Fireball),
			await entityManager.createEntity(Fireball),
			await entityManager.createEntity(Fireball),
			await entityManager.createEntity(Fireball),
		]

		await this.addComponent(`Skills`, skillsToAssign)
	}

	//move this somewhere
	calculateEllipsoidData(rootNode) {
		const playerMesh = this.findFirstMeshWithGeometry(rootNode)

		const playerMeshPosition = playerMesh.position
		const playerMeshCenter = playerMesh.getBoundingInfo().boundingSphere.center
		const playerRadius = playerMesh.getBoundingInfo().boundingSphere.radius / 2 // should not be /2, but it is because math.

		const boundingBox = playerMesh.getBoundingInfo().boundingBox
		let ellipsoidHeight = boundingBox.extendSize.y // should be *2, but not, because math.
		let ellipsoidCenterOffsetFromBottom = playerMeshCenter.subtract(playerMeshPosition)

		let ellipsoid = new BABYLON.Vector3(playerRadius, ellipsoidHeight, playerRadius)
		ellipsoid = new BABYLON.Vector3(playerRadius, ellipsoidHeight, playerRadius)

		return { ellipsoid, ellipsoidCenterOffsetFromBottom }
	}

	findFirstMeshWithGeometry(rootNode) {
		if (rootNode instanceof BABYLON.Mesh && rootNode.getTotalVertices() > 0) return rootNode

		const children = rootNode.getChildren()
		for (const child of children) {
			const mesh = this.findFirstMeshWithGeometry(child)
			if (mesh) return mesh
		}

		//TODO merge if several meshes, could happen on model with multiple materials.

		return null
	}
}
