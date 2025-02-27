export const addWindowEvents = async () => {
	const camera = (await import(`${PATH_ROOT}/setup.js`)).camera

	window.addEventListener('resize', event => {
		canvas.width = innerWidth
		canvas.height = innerHeight
		camera.aspectRatio = canvas.width / canvas.height
		engine.resize(true)
	})

	document.addEventListener('visibilitychange', () => {})
}

export const onLoad = () => {
	addWindowEvents()
}
