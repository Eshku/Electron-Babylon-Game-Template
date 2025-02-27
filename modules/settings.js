export const initGlobalSettings = async () => {
	const options = {
		adaptToDeviceRatio: true,
		antialias: true,
		audioEngineOptions: {},
		//powerPreference: 'high-performance',
		stencil: false,
	}

	/* 	const engine = await new BABYLON.Engine(window.canvas, options) //webGL
	window.engine = engine //webGL */

	window.engine = new BABYLON.WebGPUEngine(window.canvas, options)
	await engine.initAsync()

	window.scene = new BABYLON.Scene(engine)

	const havokInstance = await HavokPhysics()
	const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance)

	window.havokPlugin = havokPlugin

	//await scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), havokPlugin)
	await scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), havokPlugin)

	scene.getPhysicsEngine().setTimeStep(1 / engine.getFps())

	scene.useRightHandedSystem = true
	scene.collisionsEnabled = true
	scene.skipFrustumClipping = false

	//scene.fogMode = BABYLON.Scene.FOGMODE_EXP2
	//scene.fogDensity = 0.01
	//scene.fogColor = rgb(200, 200, 255)

	canvas.width = innerWidth
	canvas.height = innerHeight

	engine.resize(true)
}
