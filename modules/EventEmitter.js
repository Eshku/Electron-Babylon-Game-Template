export class EventEmitter {
	constructor() {
		this.listeners = new Map()
		this.nextId = 1
	}

	on(event, callback) {
		if (!this.listeners.has(event)) this.listeners.set(event, new Map())

		const id = this.nextId++
		this.listeners.get(event).set(id, callback)
		return id
	}

	once(event, callback) {
		const id = this.on(event, (...args) => {
			callback(...args)
			this.off(id, event)
		})
	}

	emit(event, ...args) {
		const listeners = this.listeners.get(event)

		if (!listeners) return false

		for (const callback of listeners.values()) callback(...args)

		return true
	}

	off(id, event) {
		if (event) {
			const foundListeners = this.listeners.get(event)

			if (foundListeners) {
				foundListeners.delete(id)
				if (foundListeners.size === 0) {
					foundListeners.delete(event)
				}
			}
		} else {
			for (const foundListeners of this.listeners.values()) {
				if (foundListeners.delete(id)) {
					if (foundListeners.size === 0) {
						foundListeners.delete(event)
					}
					break
				}
			}
		}
	}

	offAll(event) {
		event ? this.listeners.delete(event) : this.listeners.clear()
	}
}

export const eventEmitter = new EventEmitter()
