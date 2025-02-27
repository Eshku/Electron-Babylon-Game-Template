const { Component } = await import(`${PATH_CORE}/Component.js`)

export class PhysicsBody extends Component {
	constructor(mesh, shapeOptions = {}, massProps = {}, debug = false) {
		super()

		this.mesh = mesh
		this.body = null // Assigned during initialization
		this.debug = debug

		// Motion Type (Defaults to DYNAMIC)
		this.motionType = massProps.motionType || BABYLON.PhysicsMotionType.DYNAMIC

		// Mass Properties
		this.mass = massProps.mass || 1 // The mass of the physics body. Affects how forces impact its motion.
		this.inertia = massProps.inertia || BABYLON.Vector3.Zero() // Resistance to rotational changes.  A Vector3 representing inertia in x, y, and z directions.
		this.restitution = massProps.restitution || 0 // Bounciness.  0 = no bounce, 1 = perfectly elastic.
		this.friction = massProps.friction || 0.5 // Friction coefficient.  Higher values mean more friction.
		this.angularDamping = massProps.angularDamping || 0.5 // Resistance to angular velocity (spinning).  0 = no damping, 1 = maximum damping.
		this.linearDamping = massProps.linearDamping || 0.5 // Resistance to linear velocity (movement). 0 = no damping, 1 = maximum damping.

		this.shape = this.createShape(shapeOptions)
		this.createBody()
		this.body.shape = this.shape

		this.enableDebug()
	}

	createBody() {
		if (!this.mesh) {
			console.error('Mesh is required to create a PhysicsBody.')
			return
		}

		this.body = new BABYLON.PhysicsBody(
			this.mesh,
			this.motionType,
			false, //start asleep
			scene // Make sure 'scene' is defined in your scope
		)

		this.body.setMassProperties({
			mass: this.mass,
			inertia: this.inertia,
			restitution: this.restitution,
			friction: this.friction,
			angularDamping: this.angularDamping,
			linearDamping: this.linearDamping,
		})

		if (this.shape) {
			this.body.shape = this.shape
		} else {
			console.warn('No shape defined for PhysicsBody.')
		}
	}

	createShape(shapeOptions) {
		if (!shapeOptions || !shapeOptions.type) {
			return null
		}

		const shapeDefinitions = {
			BOX: ['sizeX', 'sizeY', 'sizeZ'],
			SPHERE: ['diameter'],
			CAPSULE: ['pointA', 'pointB', 'radius'],
		}

		const shapeType = shapeOptions.type.toUpperCase() // Ensure case-insensitive matching
		const parameters = shapeOptions.parameters || {}

		if (!shapeDefinitions[shapeType]) {
			console.error(`Unsupported shape type: ${shapeType}`)
			return null
		}

		const requiredParameters = shapeDefinitions[shapeType]
		const babylonParameters = {}

		for (const paramName of requiredParameters) {
			if (parameters.hasOwnProperty(paramName)) {
				babylonParameters[paramName] = parameters[paramName]
			} else {
				console.error(`Missing required parameter '${paramName}' for shape type '${shapeType}'.`)
				return null
			}
		}

		return new BABYLON.PhysicsShape(
			{
				type: BABYLON.PhysicsShapeType[shapeType],
				parameters: babylonParameters,
			},
			scene
		)
	}

	enableDebug(visibility = 0.1) {
		if (this.debug && scene && this.body) {
			const viewer = new BABYLON.Debug.PhysicsViewer(scene)
			const debugMesh = viewer.showBody(this.body)
			if (debugMesh) {
				debugMesh.visibility = visibility
			} else {
				console.warn('Failed to create physics debug mesh.')
			}
		}
	}
}
