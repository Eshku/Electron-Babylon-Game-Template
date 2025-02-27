const { eventEmitter } = await import(`${PATH_MODULES}/EventEmitter.js`)

export class PlayerInterface {
	constructor() {
		this.gearSlotTemplate = '<div class="item_slot gear_slot"></div>'
		this.inventorySlotTemplate = '<div class="item_slot inventory_slot"></div>'
		this.statSlotTemplate = '<div class="item"><span class="label"></span><span class="value"></span></div>'
		this.playerInterfaceTemplate = this.createPlayerInterfaceTemplate()
		this.playerInterface = $(this.playerInterfaceTemplate)
		$(canvas).after(this.playerInterface)
		this.inventory = this.playerInterface.find('.inventory')
		this.setupEventListeners()
	}

	createPlayerInterfaceTemplate() {
		const gearSlots = Array(7).fill(this.gearSlotTemplate).join('')
		const inventorySlots = Array(40).fill(this.inventorySlotTemplate).join('')
		const statSlots = Array(7).fill(this.statSlotTemplate).join('')
		return `
            <div id="player_interface">
                <div class="top_row">
                    <div class="heading">Player Interface</div>
                    <div class="close">X</div>
                </div>
                <div class="character">
                    <div class="gear_wrap">
                        <div class="heading">Gear</div>
                        <div class="gear_slots">
                            ${gearSlots}
                        </div>
                    </div>
                    <div class="inventory_wrap">
                        <div class="heading">Inventory</div>
                        <div class="inventory_slots">
                            ${inventorySlots}
                        </div>
                    </div>
                    <div class="stats_wrap">
                        <div class="heading">Stats</div>
                        <div class="stats_slots">
                            ${statSlots}
                        </div>
                    </div>
                </div>
            </div>
        `
	}

	setupEventListeners() {
		eventEmitter.on('TogglePlayerInterface', () => this.togglePlayerInterface())
		this.playerInterface.find('.close').click(() => this.togglePlayerInterface())

		let isDragging = false
		let offsetX, offsetY

		this.playerInterface.mousedown(e => {
			isDragging = true
			offsetX = e.clientX - this.playerInterface.offset().left
			offsetY = e.clientY - this.playerInterface.offset().top
		})

		$(document)
			.mousemove(e => {
				if (isDragging) {
					this.playerInterface.css({
						left: e.clientX - offsetX + 'px',
						right: 'unset',
						top: e.clientY - offsetY + 'px',
					})
				}
			})
			.mouseup(() => {
				isDragging = false
			})
	}

	togglePlayerInterface() {
		this.playerInterface.toggleClass('active')
	}

	static async create() {
		const { loadCSSAsync } = await import(`${PATH_LIBRARY}/Eshku.async.core.js`)
		await loadCSSAsync(`${PATH_UI}/PlayerInterface/PlayerInterface.css`)
		return new this()
	}
}
