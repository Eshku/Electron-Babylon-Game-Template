export let player

export let crosshair

export let camera

export let hotbar

export let shadowGenerator

export const preload = async () => {}

export const setupSystems = async () => {
	const { systemManager } = await import(`${PATH_MANAGERS}/SystemManager.js`)

	await systemManager.init()
}

export const setupEnvironment = async () => {
	const { terrain } = await import(`${PATH_MODULES}/Environment/WorldGen/Terrain.js`)
}

export const setupUI = async () => {
	const { PlayerStatusPanel } = await import(`${PATH_UI}/PlayerStatusPanel/PlayerStatusPanel.js`)
	const { PlayerInterface } = await import(`${PATH_UI}/PlayerInterface/PlayerInterface.js`)
	const { ChatBox } = await import(`${PATH_UI}/ChatBox/ChatBox.js`)
	const { Hotbar } = await import(`${PATH_UI}/Hotbar/Hotbar.js`)

	const { FPSCounter } = await import(`${PATH_UI}/FPSCounter.js`)
	const { Crosshair } = await import(`${PATH_UI}/Crosshair.js`)

	FPSCounter.create(500)
	await PlayerStatusPanel.create()
	await PlayerInterface.create()
	await ChatBox.create()
	hotbar = await Hotbar.create()

	crosshair = Crosshair.create()
}

export const setupCamera = async () => {
	const { ThirdPersonCamera } = await import(`${PATH_MODULES}/camera.js`)

	camera = new ThirdPersonCamera(
		'Third Person Camera',
		-Math.PI / 2,
		Math.PI / 2,
		5,
		BABYLON.Vector3.Zero(),
		scene,
		true
	)

	camera.attachCameraToEntity(player)
}

export const setupPlayer = async () => {
	const { entityManager } = await import(`${PATH_MANAGERS}/EntityManager.js`)
	const { Player } = await import(`${PATH_PREFABS}/PlayableCharacters/Player.js`)

	player = await entityManager.spawnEntity(Player, BABYLON.Vector3.Zero()) //spawning doesn't work anymore.
}

export const setup = async () => {
	const { Debug } = await import(`${PATH_MODULES}/debug.js`)
	const { initGlobalSettings } = await import(`${PATH_MODULES}/settings.js`)
	const { LoadingScreen } = await import(`${PATH_UI}/LoadingScreen/LoadingScreen.js`)

	const { onLoad } = await import(`${PATH_MODULES}/onLoad.js`)

	await initGlobalSettings()

	Logger.start('Loading')

	await preload()

	let loadingScreen = await LoadingScreen.create()

	await setupEnvironment()
	await setupSystems()

	await setupPlayer()

	await setupCamera()

	await setupUI()
	Debug.setupCollisionTestEnvironment()
	//Debug.showDebugLayer()

	onLoad()

	loadingScreen.hideLoadingUI()
	Logger.end('Loading')
}
