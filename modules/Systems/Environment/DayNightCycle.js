const { System } = await import(`${window.PATH_CORE}/System.js`)

export class DayNightCycle extends System {
	constructor() {
		super()
		this.dayLight = null
		this.ambientLight = null
		this.moonLight = null

		this.dayDuration = 20 // Total duration of one day in mins
		this.totalElapsedTime = 200 // set initial sun position

		this.timeOfDay = 0

		//Constants pre-calculated
		this.twoPI = 2 * Math.PI
		this.halfPI = Math.PI / 2
		this.quarterPI = Math.PI / 4

		this.lerpSpeed = 5

		this.startTimeOfDay = this.quarterPI
		this.startTimeOfNight = Math.PI

		this.sunPosition = new BABYLON.Vector3()

		this.sunSpeed = this.twoPI / (this.dayDuration * 60) // Angular speed (radians per second *60 for mins)

		this.sunRadius = 600 // Radius of the circular path for the sun
		this.sunHeight = 200 // Height above the horizon for the sun

		this.maxDayIntensity = 0.35
		this.maxNightIntensity = 0.6
		this.intensityChangeSpeed = 0.1
	}

	async init() {
		this.initAmbientLight()
		this.initDayLight()
		this.initNightLight()
	}

	update(entities, delta) {
		this.totalElapsedTime += delta

		const targetTimeOfDay = (this.totalElapsedTime * this.sunSpeed) % this.twoPI

		this.timeOfDay = BABYLON.Scalar.Lerp(this.timeOfDay, targetTimeOfDay, delta * this.lerpSpeed)

		this.dayLight.position.set(
			this.sunRadius * Math.cos(this.timeOfDay),
			this.sunHeight * Math.sin(this.timeOfDay),
			this.sunRadius * Math.sin(this.timeOfDay)
		)

		this.dayLight.direction = this.dayLight.position.negate().normalize()

		this.daySkyMaterial.sunPosition = this.dayLight.position

		this.isDaytime() ? this.ChangeLightIntensity('day', delta) : this.ChangeLightIntensity('night', delta)
	}

	initAmbientLight() {
		this.ambientLight = new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(0, 1, 0))
		this.ambientLight.diffuse = rgb(255)
		this.ambientLight.specular = rgb(255)
		this.ambientLight.intensity = 0.1
	}

	initDayLight() {
		this.dayLight = new BABYLON.DirectionalLight('DirectionalLight', v3(1, -1, 1))
		this.dayLight.position = new BABYLON.Vector3(-300, 300, -300)
		this.dayLight.autoCalcShadowZBounds = true

		this.dayLight.diffuse = new BABYLON.Color3(1, 1, 1)
		this.dayLight.specular = new BABYLON.Color3(1, 1, 1)

		this.dayLight.intensity = 0.25

		this.initDaySky()
	}

	initDaySky() {
		this.daySkyMaterial = new BABYLON.SkyMaterial('daySkyMaterial')
		this.daySkyMaterial.backFaceCulling = false
		this.daySkyMaterial.turbidity = 1
		this.daySkyMaterial.luminance = 1
		this.daySkyMaterial.inclination = 0.5
		this.daySkyMaterial.azimuth = 0.25
		this.daySkyMaterial.rayleigh = 2
		this.daySkyMaterial.mieDirectionalG = 0.8
		this.daySkyMaterial.mieCoefficient = 0.005

		this.daySkyMaterial.useSunPosition = true
		this.daySkyMaterial.sunPosition = this.dayLight.position

		this.dayNightCycleBox = BABYLON.MeshBuilder.CreateBox('dayNightCycleBox', { size: 1000.0 })
		this.dayNightCycleBox.isPickable = false
		this.dayNightCycleBox.checkCollisions = false
		this.dayNightCycleBox.infiniteDistance = true
		this.dayNightCycleBox.material = this.daySkyMaterial
	}

	initNightLight() {
		this.moonLight = new BABYLON.DirectionalLight('DirectionalLight', v3(1, -1, 1))
		this.moonLight.position = new BABYLON.Vector3(-300, 300, -300)
		this.moonLight.autoCalcShadowZBounds = true

		this.moonLight.diffuse = new BABYLON.Color3(0.25, 0.25, 0.35)
		this.moonLight.specular = new BABYLON.Color3(0.25, 0.25, 0.35)

		this.moonLight.intensity = 0
	}

	ChangeLightIntensity(time, delta) {
		if (time === 'day') {
			this.dayLight.intensity = Math.min(
				this.dayLight.intensity + this.intensityChangeSpeed * delta,
				this.maxDayIntensity
			)
			this.moonLight.intensity = Math.max(this.moonLight.intensity - this.intensityChangeSpeed * delta, 0)
		} else if (time === 'night') {
			this.dayLight.intensity = Math.max(this.dayLight.intensity - this.intensityChangeSpeed * delta, 0)
			this.moonLight.intensity = Math.min(
				this.moonLight.intensity + this.intensityChangeSpeed * delta,
				this.maxNightIntensity
			)
		}
	}

	isDaytime() {
		return this.timeOfDay >= this.startTimeOfDay && this.timeOfDay < this.startTimeOfNight
	}
}
