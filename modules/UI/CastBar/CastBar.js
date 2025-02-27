const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

/* I don't think I want this, it's lame */

export class CastBar {
	constructor() {
		this.name = this.constructor.name

		this.castingBarTemplate = `
		<div id="casting-bar">
		  <div class="casting-bar-progress"></div>
		</div>
	  `

		$(canvas).after(this.castingBarTemplate)

		this.$castingBar = $('#casting-bar')
		this.$castingBarProgress = this.$castingBar.find('.casting-bar-progress')

		this.init()
	}

	static async create() {
		return new this()
	}

	async init() {
		await this.loadCSS()

		this.hide() // Initially hide the casting bar

		eventEmitter.on('startCastingAnimation', skill => {
			// Only show and start casting if castTime is greater than 0
			if (skill.castTime > 0) {
				this.show()
				this.startCasting(skill.castTime)
			}
		})

		eventEmitter.on('endCastingAnimation', () => {
			this.stopCasting()
			this.hide()
		})
	}

	async loadCSS() {
		const { loadCSSAsync } = await import(`${PATH_LIBRARY}/Eshku.async.core.js`)
		await loadCSSAsync(`${PATH_UI}/CastBar/CastBar.css`)
	}

	startCasting(castTime) {
		this.$castingBarProgress.stop(true, true) // Stop any previous animation
		this.$castingBarProgress.width(0) // Reset the progress bar
		this.$castingBarProgress.animate(
			{ width: '100%' },
			{
				duration: castTime * 1000, // Convert seconds to milliseconds
				easing: 'linear', // Use linear easing for a consistent casting speed
				complete: () => {
					// This callback function will be executed when the animation is complete
					this.stopCasting()
				},
			}
		)
	}

	stopCasting() {
		this.$castingBarProgress.stop(true, true) // Stop the animation
		this.$castingBarProgress.width(0) // Reset the progress bar width
	}

	hide() {
		this.$castingBar.hide()
	}

	show() {
		this.$castingBar.show()
	}
}
