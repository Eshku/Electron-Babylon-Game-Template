export const Debug = {
	PlayerEllipsoid: class PlayerEllipsoid {
		static async create() {
			const { player } = await import(`${PATH_ROOT}/setup.js`)

			const playerEllipsoid = player.getComponent('Mesh').mesh.ellipsoid

			this.ellipsoid = BABYLON.MeshBuilder.CreateSphere('debugEllipsoid', {
				diameterX: playerEllipsoid.x,
				diameterY: playerEllipsoid.y * 2,
				diameterZ: playerEllipsoid.z,
			})

			this.ellipsoid.position = new BABYLON.Vector3(player.x, player.y, player.z)

			this.ellipsoid.checkCollisions = false
			this.ellipsoid.isPickable = false
		}

		static async update() {
			const { player } = await import(`${PATH_ROOT}/setup.js`)

			const playerMesh = player.getComponent('Mesh').mesh

			if (!this.ellipsoid) await this.create()

			this.ellipsoid.position = new BABYLON.Vector3(
				playerMesh.position.x,
				playerMesh.position.y + playerMesh.ellipsoidOffset.y,
				playerMesh.position.z
			)
		}
	},

	showDebugLayer: () => {
		scene.debugLayer.show({
			logEnabled: true,
			overlay: true,
		})
	},

	ShowMeshBoundingBox: meshes => {
		meshes.forEach(item => {
			item.refreshBoundingInfo()
			item.showBoundingBox = true
		})
	},

	skeletonViewer: (skeleton, mesh, scene) => {
		let skeletonViewer = new BABYLON.Debug.SkeletonViewer(skeleton, mesh, scene)
		skeletonViewer.isEnabled = true
		skeletonViewer.color = BABYLON.Color3.Red()
	},

	setupCollisionTestEnvironment: () => {
		const arenaCenter = new BABYLON.Vector3(0, 30, 0) // Center of the arena

		// Ground
		const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene) // Bigger ground
		ground.checkCollisions = true
		ground.position = arenaCenter // Position at arena center
		ground.receiveShadows = true
		ground.PhysicsAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.MESH, {
			mass: 0, // Static object
			friction: 0.9, // Moar
			restitution: 0, // Low bounciness
		})

		// Big boxes
		for (let i = 0; i < 5; i++) {
			const bigBox = BABYLON.MeshBuilder.CreateBox('bigBox', { size: 5 }, scene)
			bigBox.position.set(Math.random() * 40 - 20, 2.5, Math.random() * 40 - 20) // Spread out more
			bigBox.position.addInPlace(arenaCenter) // Offset by arena center
			bigBox.checkCollisions = true
			bigBox.PhysicsAggregate = new BABYLON.PhysicsAggregate(bigBox, BABYLON.PhysicsShapeType.MESH)
		}

		// Smaller boxes
		const smallBoxMaterial = new BABYLON.StandardMaterial('smallBoxMaterial', scene)
		smallBoxMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0) // Green color to indicate interactable
		smallBoxMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2)
		for (let i = 0; i < 10; i++) {
			const smallBox = BABYLON.MeshBuilder.CreateBox('smallBox', { size: 1 }, scene)
			smallBox.position.set(Math.random() * 40 - 20, 0.5, Math.random() * 40 - 20) // Spread out
			smallBox.position.addInPlace(arenaCenter) // Offset
			smallBox.checkCollisions = true
			smallBox.material = smallBoxMaterial
			smallBox.PhysicsAggregate = new BABYLON.PhysicsAggregate(smallBox, BABYLON.PhysicsShapeType.MESH, {
				mass: 0.5, //make them movable
				friction: 0.5,
				restitution: 0.2, //little bounce
			})
		}

		// Small obstacles
		for (let i = 0; i < 20; i++) {
			const obstacle = BABYLON.MeshBuilder.CreateSphere('obstacle', { diameter: 0.2 }, scene)
			obstacle.position.set(Math.random() * 40 - 20, 0.1, Math.random() * 40 - 20) // Spread out
			obstacle.position.addInPlace(arenaCenter) // Offset
			obstacle.checkCollisions = true
			obstacle.PhysicsAggregate = new BABYLON.PhysicsAggregate(obstacle, BABYLON.PhysicsShapeType.MESH)
		}

		// Stairs
		const stairs = []
		for (let i = 0; i < 15; i++) {
			const stair = BABYLON.MeshBuilder.CreateBox('stair', { width: 1, height: 0.2, depth: 5 }, scene)
			stair.position.set(20 + i * 2, i * 0.2, 0)
			stair.position.addInPlace(arenaCenter)
			stair.checkCollisions = true
			stair.PhysicsAggregate = new BABYLON.PhysicsAggregate(stair, BABYLON.PhysicsShapeType.MESH)
			stairs.push(stair)
		}

		// Close Stairs
		const closeStairs = []
		for (let i = 0; i < 15; i++) {
			const stair = BABYLON.MeshBuilder.CreateBox('closeStair', { width: 1, height: 0.2, depth: 5 }, scene)
			stair.position.set(20 + i, i * 0.2, 20)
			stair.position.addInPlace(arenaCenter)
			stair.checkCollisions = true
			stair.PhysicsAggregate = new BABYLON.PhysicsAggregate(stair, BABYLON.PhysicsShapeType.MESH)
			closeStairs.push(stair)
		}

		// Ramp / Inclined Plane
		const ramp = BABYLON.MeshBuilder.CreateBox('ramp', { width: 5, height: 0.2, depth: 5 }, scene)
		ramp.position.set(-20, 0.1, -20)
		ramp.position.addInPlace(arenaCenter)
		ramp.rotation.x = Math.PI / 8
		ramp.checkCollisions = true
		ramp.PhysicsAggregate = new BABYLON.PhysicsAggregate(ramp, BABYLON.PhysicsShapeType.MESH)

		// Ramps with different angles
		const rampAngles = [Math.PI / 8, Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2] // Different angles
		const rampSpacing = 5 // Space between ramps

		for (let i = 0; i < rampAngles.length; i++) {
			const ramp = BABYLON.MeshBuilder.CreateBox('ramp', { width: 5, height: 0.2, depth: 5 }, scene)
			ramp.position.set(-20 + i * rampSpacing, 0.1, -20) // Position ramps in a row
			ramp.position.addInPlace(arenaCenter)
			ramp.rotation.x = rampAngles[i]

			ramp.checkCollisions = true
			ramp.PhysicsAggregate = new BABYLON.PhysicsAggregate(ramp, BABYLON.PhysicsShapeType.MESH)
		}
	},
}
