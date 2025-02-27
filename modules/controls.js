const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

export class Controls {
	constructor() {
		this.name = this.constructor.name

		this.keyMap = {
			forward: {
				keys: ['w', 'shift+w'],
				active: false,
				description: 'Walk forward',
				type: 'hold',
				class: 'direction',
			},
			backward: {
				keys: ['s', 'shift+s'],
				active: false,
				description: 'Walk backward',
				type: 'hold',
				class: 'direction',
			},
			left: {
				keys: ['a', 'shift+a'],
				active: false,
				description: 'Walk left',
				type: 'hold',
				class: 'direction',
			},
			right: {
				keys: ['d', 'shift+d'],
				active: false,
				description: 'Walk right',
				type: 'hold',
				class: 'direction',
			},
			run: {
				keys: ['shift'],
				active: false,
				description: 'Run',
				type: 'hold',
			},
			jump: {
				keys: ['space', 'shift+space'],
				active: false,
				description: 'Jump',
				type: 'hold',
			},
			'Prevent Default': {
				keys: ['ctrl+r', 'ctrl+w'],
				active: false,
				description: 'Prevent Default',
				type: 'hold',
			},
			'Toggle cursor': {
				keys: ['`'],
				active: false,
				description: 'Toggle cursor',
				type: 'keyup',
				action: pointerLock, // Directly use the imported function
			},
			'Toggle Player Interface': {
				keys: ['i'],
				active: false,
				description: 'Toggle Player Interface',
				type: 'keyup',
				action: () => eventEmitter.emit('TogglePlayerInterface'),
			},
		}

		// Mouse button bindings (integrated into keyMap)
		this.keyMap.MainAttack = { active: false, description: 'Main Attack' }
		this.keyMap.AdditionalAttack = { active: false, description: 'Additional Attack' }

		this.keys = Object.keys(this.keyMap)

		this.init()
	}

	init() {
		this._assign_keys()

		this._assignMouseButtons()

		this._assignHotbarKeys()
	}

	_assign_keys() {
		this.keys.forEach(name => {
			if (this.keyMap[name].type === 'hold') {
				Mousetrap.bind(
					this.keyMap[name].keys,
					event => {
						this._preventDefault(event)
						this.keyMap[name].active = true
					},
					'keydown'
				)
				Mousetrap.bind(
					this.keyMap[name].keys,
					event => {
						this._preventDefault(event)
						this.keyMap[name].active = false
					},
					'keyup'
				)
			} else if (this.keyMap[name].type === 'keyup') {
				Mousetrap.bind(
					this.keyMap[name].keys,
					event => {
						event.preventDefault()
						event.stopPropagation()
						this.keyMap[name]?.action()
					},
					'keyup'
				)
			}
		})
	}

	_assignMouseButtons() {
		$(canvas).mouseup(event => {
			switch (event.which) {
				case 1: // Left mouse button
					this.keyMap.MainAttack.active = false
					eventEmitter.emit('MainAttackTriggered')
					break
				case 3: // Right mouse button
					this.keyMap.AdditionalAttack.active = false
					break
			}
		})

		$(canvas).mousedown(event => {
			switch (event.which) {
				case 1: // Left mouse button (Main Attack)
					this.keyMap.MainAttack.active = true
					break
				case 3: // Right mouse button (Additional Attack)
					this.keyMap.AdditionalAttack.active = true
					break
			}
		})
	}

	_assignHotbarKeys() {
		for (let i = 0; i < 10; i++) {
			const key = i === 9 ? '0' : (i + 1).toString()
			Mousetrap.bind(key, () => eventEmitter.emit('hotbarSlotSelected', i))
		}
	}

	_preventDefault(event) {
		event.preventDefault()
		event.stopPropagation()
	}
}

export const pointerLock = async event => {
	const { crosshair } = await import(`${PATH_ROOT}/setup.js`)
	if (document.pointerLockElement === null) {
		await canvas.requestPointerLock({
			unadjustedMovement: true,
		})
		crosshair.show()
	} else {
		document.exitPointerLock()
		crosshair.hide()
	}
}

export const controls = new Controls()
