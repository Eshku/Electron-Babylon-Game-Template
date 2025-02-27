export class ThirdPersonCamera extends BABYLON.ArcRotateCamera {
	constructor(name, alpha, beta, radius, target) {
		super(name, alpha, beta, radius, target)

		this.fov = 1
		this.targetScreenOffset = new BABYLON.Vector2(-1.5, 0)

		this.radius = 8 // = range
		this.lowerRadiusLimit = 2
		this.upperRadiusLimit = 25

		this.panningSensibility = 0

		this.checkCollisions = false

		this.wheelPrecision = 50

		this.zoomSpeed = 3

		this.inertia = 0.5

		this.desiredRadius = 8
		this.desiredCameraPosition = v3(0, 0, 0)
		this.desiredCameraTarget = v3(0, 0, 0)

		this.positionOffset = v3(0, 1.5, 0)
		this.targetOffset = v3(0, 2, 0)

		this.cullingDistance = 500

		this.entityToFollow = null

		this.cameraEasingFactor = 1

		this.attachControl(canvas, true)
		this.init()
	}

	async init() {}

	attachCameraToEntity(entity) {
		this.entityToFollow = entity
	}

	updatePosition() {
		this.newPosition = this.entityToFollow.getComponent('Mesh').mesh.position

		this.desiredCameraPosition = this.newPosition.add(this.positionOffset)
		this.desiredCameraTarget = this.newPosition.add(this.targetOffset)

		this.cameraPositionDifference = this.desiredCameraPosition.subtract(this.position)
		this.cameraTargetDifference = this.desiredCameraTarget.subtract(this.target)

		this.position.addInPlace(this.cameraPositionDifference.scale(this.cameraEasingFactor))
		this.target.addInPlace(this.cameraTargetDifference.scale(this.cameraEasingFactor))
	}
}
