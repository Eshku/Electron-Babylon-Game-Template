export class FPSCounter {
  constructor(updateInterval = 1000) {
    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')

    // Create the background rectangle
    this.background = new BABYLON.GUI.Rectangle()
    this.background.width = '120px'
    this.background.height = '40px'
    this.background.cornerRadius = 5
    this.background.thickness = 2
    this.background.color = 'black' // Set border color to black

    this.background.background = 'rgba(0, 0, 0, 0.5)'

    this.advancedTexture.addControl(this.background)

    // Create the FPS text block
    this.fpsText = new BABYLON.GUI.TextBlock()
    this.fpsText.name = 'FPSCounter'
    this.fpsText.color = 'lime'
    this.fpsText.fontSize = 20
    this.fpsText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    this.fpsText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER

    this.background.addControl(this.fpsText)

    this.updateInterval = updateInterval
  }

  static create(updateInterval) {
    return new this(updateInterval).setupTimerUpdate().positionTopRight()
  }

  setupTimerUpdate() {
    const fps = Math.round(BABYLON.Engine.LastCreatedEngine.getFps())
    this.fpsText.text = `FPS: ${fps}`
    setTimeout(() => this.setupTimerUpdate(), this.updateInterval)

    return this
  }
  positionTopLeft() {
    this.background.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this.background.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP

    this.background.paddingLeft = '10px'
    this.background.paddingTop = '10px'

    return this
  }

  positionTopRight() {
    this.background.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    this.background.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP

    this.background.paddingRight = '10px'
    this.background.paddingTop = '10px'

    return this
  }
}
