const { Component } = await import(`${PATH_CORE}/Component.js`)

export class Mesh extends Component {
	constructor(data) {
		super()

		this.mesh = data.mesh

		//! Cannot set diameter or segmets.

		if (!this.mesh) {
			console.error("Mesh component requires a 'mesh' property in the data object.")
			return
		}

		const options = data.options || {} // Handle options object, provide default if not present

		this.mesh.material = options.material || null

		this.mesh.position = options.position || BABYLON.Vector3.Zero()
		this.mesh.rotation = options.rotation || BABYLON.Vector3.Zero()
		this.mesh.scaling = options.scaling || BABYLON.Vector3.One()

		this.mesh.checkCollisions = options.checkCollisions ?? true

		this.mesh.isPickable = options.isPickable ?? true

		this.mesh.visibility = options.visibility ?? 1 // transparency?
		this.mesh.isVisible = Boolean(options.isVisible) ?? true

		this.mesh.shadowCaster = options.addShadowCaster ?? false
		this.mesh.receiveShadows = options.receiveShadows ?? false

		this.mesh.ellipsoid = options.ellipsoid || BABYLON.Vector3.Zero()
		this.mesh.ellipsoidOffset.y = options.ellipsoidOffsetY || 0
	}
	s
	async init() {
		if (this.mesh.shadowCaster) {
			const { shadowGenerator } = await import(`${PATH_ENVIRONMENT}/ShadowGenerator.js`)

			shadowGenerator.addShadowCaster(this.mesh)
		}
	}
}
