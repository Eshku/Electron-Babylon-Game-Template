export let crosshair

export class Crosshair {
  constructor() {
    this.guiTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('CrosshairUI')
    this.size = 15
    this.createCircle()
  }

  static create() {
    crosshair = new this()
    return crosshair
  }

  createCircle() {
    // Create an ellipse (which will act as the circle for the crosshair)
    this.circle = new BABYLON.GUI.Ellipse()
    this.circle.width = `${this.size}px`
    this.circle.height = `${this.size}px`
    this.circle.color = 'rgba(255, 255, 255, 0.25)'
    this.circle.thickness = 2 // Border thickness
    this.circle.background = 'transparent' // No fill color
    this.circle.isVisible = false

    this.circle.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    this.circle.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER

    // Add to GUI texture
    this.guiTexture.addControl(this.circle)
  }

  hide() {
    this.circle.isVisible = false
  }

  show() {
    this.circle.isVisible = true
  }
}
