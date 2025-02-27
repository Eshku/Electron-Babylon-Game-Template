export class LoadingScreen extends BABYLON.DefaultLoadingScreen {
  constructor(scene) {
    super()
    this.loadingUIText = 'Loading'

    this.scene = scene
    this.assetManager = new BABYLON.AssetsManager(scene)
    this.assetManager.useDefaultLoadingScreen = false

    this.loadingScreenTemplate = $(`
    <div id="loader_element">
    <div class="ring">
      <div class="text">Loading</div>
      <div class="point"></div>
    </div>
  </div>
  `)

    $(game_wrap).prepend(this.loadingScreenTemplate)

    this.displayLoadingUI()
  }

  static async create() {
    const { loadCSSAsync } = await import(`${PATH_LIBRARY}/Eshku.async.core.js`)

    await loadCSSAsync(`${PATH_MODULES}/UI/LoadingScreen/LoadingScreen.css`)

    return new this(scene)
  }

  displayLoadingUI() {
    $(loader_element).fadeInFlex()
    return this
  }

  hideLoadingUI() {
    $(loader_element).fadeOut(1000)
    return this
  }
}
