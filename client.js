window.PATH_ROOT = await window.electronAPI.getRootDirectory()

window.PATH_ASSETS = `${window.PATH_ROOT}/assets`
window.PATH_MODULES = `${window.PATH_ROOT}/modules`
window.PATH_LIBRARY = `${window.PATH_ASSETS}/library`

window.PATH_COMPONENTS = `${window.PATH_MODULES}/components`
window.PATH_SYSTEMS = `${window.PATH_MODULES}/Systems`
window.PATH_MANAGERS = `${window.PATH_MODULES}/Managers`

window.PATH_ARCHETYPES = `${window.PATH_MODULES}/archetypes`
window.PATH_PREFABS = `${window.PATH_MODULES}/Prefabs`

window.PATH_NODE_MODULES = `${window.PATH_ROOT}/node_modules`

window.PATH_ICONS = `${window.PATH_ASSETS}/icons`

window.PATH_CORE = `${window.PATH_MODULES}/Core`

window.PATH_ENVIRONMENT = `${window.PATH_MODULES}/Environment`

window.PATH_UI = `${window.PATH_MODULES}/UI`

const { Debug } = await import(`${PATH_MODULES}/debug.js`)
const { setup } = await import(`${PATH_ROOT}/setup.js`)

const { entityManager } = await import(`${PATH_MANAGERS}/EntityManager.js`)

const GameLaunchOrder = async () => {
	await setup()

	const { systemManager } = await import(`${PATH_MANAGERS}/SystemManager.js`)

	const { camera } = await import(`${PATH_ROOT}/setup.js`)

	scene.registerBeforeRender(() => {
		const delta = scene.getEngine().getDeltaTime() / 1000
		camera.updatePosition()
	})

	engine.runRenderLoop(() => {
		const delta = scene.getEngine().getDeltaTime() / 1000

		systemManager.updateLoop('update', delta)

		scene.render()
	})
}

GameLaunchOrder()
