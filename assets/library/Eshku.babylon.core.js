class Logger {
	static timers = new Map() // Store timers by label
	static warningColor = '#ffc107'
	static errorColor = '#dc3545'
	static timerColor = '#49d48f'
	static labelColor = '#39b376'

	static start(label) {
		if (this.timers.has(label)) {
			console.warn(`%cTimer "${label}" already exists. Overwriting.`, `color: ${this.warningColor}`)
		}
		this.timers.set(label, performance.now())
	}

	static end(label) {
		if (!this.timers.has(label)) {
			console.error(`%cTimer "${label}" not found.`, `color: ${this.errorColor}`)
			return
		}

		const startTime = this.timers.get(label)
		const endTime = performance.now()
		const duration = endTime - startTime

		console.log(`%c${label} - %c${this.formatTime(duration)}`, `color: ${this.labelColor}`, `color: ${this.timerColor}`)
		this.timers.delete(label)
	}

	static now(label = '') {
		console.log(`%c${label} ${this.formatTime(performance.now())}`, `color: ${this.timerColor}`)
	}

	static formatTime(timestamp) {
		const seconds = Math.floor(timestamp / 1000)
		const milliseconds = Math.floor(timestamp % 1000)
		return `${seconds}s ${milliseconds}ms`
	}
}

const log = value => console.log(value) //useless for v8, use snippets instead

const map = (value, in_min, in_max, out_min, out_max) =>
	((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min

const rgb = (...args) => {
	let [r, g, b, a] = args

	switch (args.length) {
		case 1:
			return new BABYLON.Color3(r / 255, r / 255, r / 255)
		case 2:
			log('use 1,3 or 4 arguments')
			return
		case 3:
			return new BABYLON.Color3(r / 255, g / 255, b / 255)
		case 4:
			return new BABYLON.Color3(r / 255, g / 255, b / 255, a)
	}
}

const v3 = (x, y, z) => new BABYLON.Vector3(x, y, z)

const degrees = degree => degree * (Math.PI / 180)

const getAllObjectProperties = object => {
	log(Object.getOwnPropertyNames(Object.getPrototypeOf(object)))
}
