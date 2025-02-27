const { createNoise2D } = await import(`${PATH_NODE_MODULES}/simplex-noise/dist/esm/simplex-noise.js`)

export class Terrain {
	constructor(options = {}) {
		this.terrainMesh = null

		this.biomeData = options.biomeData

		this.chunkSize = options.chunkSize || 256
		this.position = options.position

		// Terrain Dimensions
		this.width = this.chunkSize
		this.height = this.chunkSize

		// Mesh Resolution
		this.subdivisions = options.subdivisions || 50 // Number of subdivisions, higher means more detailed terrain

		// Heightmap Parameters
		this.maxHeight = options.maxHeight || 5 // Maximum height of the terrain
		this.minHeight = options.minHeight || 0 // Minimum height of the terrain
		this.octaveCount = options.octaveCount || 5 // Number of octaves, higher means more detail and variation
		this.persistence = options.persistence || 0.75 // Controls how much each octave contributes to the overall shape, lower values create smoother terrain
		this.lacunarity = options.lacunarity || 1.0 // Frequency multiplier per octave, higher values create more spread out noise
		this.scale = options.scale || 0.01 // Adjusts the overall noise scale, smaller values create larger noise features

		// Noise Parameters
		this.noise2D = createNoise2D()
		this.initialAmplitude = 1 // The initial strength of the noise

		this.createTerrainMesh()
		this.applyHeightmap()
		this.applyTexture()

		this.PhysicsAggregate = new BABYLON.PhysicsAggregate(this.terrainMesh, BABYLON.PhysicsShapeType.MESH, {
			mass: 0, // Static object
			friction: 1, // Maximum friction
			restitution: 0 // Low bounciness
		})
	}

	createTerrainMesh() {
		this.terrainMesh = BABYLON.MeshBuilder.CreateGround('ground', {
			width: this.width,
			height: this.height,
			subdivisions: this.subdivisions,
			updatable: true,
		})

		this.terrainMesh.material = new BABYLON.StandardMaterial('ground')
		this.terrainMesh.metadata = { isGround: true }
		this.terrainMesh.receiveShadows = true
		this.terrainMesh.checkCollisions = true

		this.terrainMesh.isPickable = true
		this.terrainMesh.material.backFaceCulling = true
		this.terrainMesh.position = this.position
	}

	applyHeightmap() {
		const positions = this.terrainMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)
		const indices = this.terrainMesh.getIndices()

		for (let i = 0; i < positions.length; i += 3) {
			const x = positions[i]
			const y = positions[i + 2]

			// Apply scale to the noise coordinates
			const nx = x * this.scale - 0.5
			const ny = y * this.scale - 0.5

			let elevationValue = 0 // The height value at a specific point
			let amplitude = this.initialAmplitude // Start with the initial amplitude
			let frequency = 1 // The initial frequency of the noise

			for (let octave = 0; octave < this.octaveCount; octave++) {
				elevationValue += this.noise2D(nx * frequency, ny * frequency) * amplitude // Add noise value for the current octave
				amplitude *= this.persistence // Decrease amplitude for each subsequent octave
				frequency *= this.lacunarity // Increase frequency for each subsequent octave
			}

			const scaledElevation = this.minHeight + (this.maxHeight - this.minHeight) * elevationValue // Scale the elevation to the desired range

			positions[i + 1] = scaledElevation // Set the height of the vertex
		}

		this.terrainMesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions)

		const normals = []
		BABYLON.VertexData.ComputeNormals(
			this.terrainMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind),
			this.terrainMesh.getIndices(),
			normals
		)
		this.terrainMesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals)
	}

	applyTexture() {
		this.resolution = `2k`
		this.texturePath = `${PATH_ASSETS}/textures/surface/sand/${this.resolution}/textures/`

		const sandMaterial = new BABYLON.PBRMaterial('sandMaterial')

		sandMaterial.roughness = 1
		sandMaterial.metallic = 0.5

		//this.entity.terrainMesh.alwaysSelectAsActiveMesh = true

		//sandMaterial.albedoColor = new BABYLON.Color3(0.8, 0.7, 0.6)
		//sandMaterial.ambientColor = new BABYLON.Color3(0.2, 0.2, 0.2)

		//sandMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0) // Default: No emission
		//sandMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2) // Default: Weak specular

		this.terrainMesh.material = sandMaterial

		//addDiffuseTexture

		this.diffuseTexture = new BABYLON.Texture(`${this.texturePath}/sand_01_diff_${this.resolution}.jpg`)
		this.terrainMesh.material.albedoTexture = this.diffuseTexture

		//addNormalTexture

		this.normalTexture = new BABYLON.Texture(`${this.texturePath}/sand_01_nor_gl_${this.resolution}.png`)
		this.terrainMesh.material.bumpTexture = this.normalTexture

		//addRoughnessTexture
		this.roughnessTexture = new BABYLON.Texture(`${this.texturePath}/sand_01_rough_${this.resolution}.jpg`)
		this.terrainMesh.material.roughnessTexture = this.roughnessTexture

		//addDisplacementTexture
		this.displacementTexture = new BABYLON.Texture(`${this.texturePath}/sand_01_disp_${this.resolution}.png`)
		this.terrainMesh.material.displacementTexture = this.displacementTexture
		//this.terrainMesh.material.useParallax = false // Or this.terrainMesh.material.useParallaxOcclusion = true;
		//this.terrainMesh.material.parallaxScaleBias = 0.05 // Adjust this value for the displacement strength

		// Add a tessellation submesh (crucial for good displacement, super heavy shit)
		/* 		const tessellationSubMesh = new BABYLON.SubMesh(
			0,
			0,
			this.entity.terrainMesh.getTotalVertices(),
			0,
			this.entity.terrainMesh.getTotalIndices(),
			this.entity.terrainMesh
		)

		this.terrainMesh.material.tessellationMode = BABYLON.Material.TESSELLATION_PNTRIANGLES // Or another mode
		this.entity.terrainMesh.subMeshes.push(tessellationSubMesh) */
	}
}

export const terrain = new Terrain({ position: BABYLON.Vector3.Zero() })
