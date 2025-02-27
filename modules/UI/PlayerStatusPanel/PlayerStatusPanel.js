export class PlayerStatusPanel {
  constructor() {
    this.playerStatusPanelTemplate = `
    <div id="player_status_panel">

        <div class="player_frame">
            <img src="${PATH_UI}/PlayerStatusPanel/PlayerImage.png" }" alt="Player">
        </div>
        
        <div class="status_bar">

          <div class="health_bar">
              <div class="health_bar_fill"></div>
          </div>

          <div class="status_effects">

          </div>

    </div>
    `

    $(canvas).after(this.playerStatusPanelTemplate)

    this.$playerStatusPanel = $('#player_status_panel')
    this.$playerIcon = this.$playerStatusPanel.find('.player_icon img')
    this.$healthBarFill = this.$playerStatusPanel.find('.health_bar_fill')
    this.$statusEffects = this.$playerStatusPanel.find('.status_effects')

    this.init()
  }

  static async create() {
    const { loadCSSAsync } = await import(`${PATH_LIBRARY}/Eshku.async.core.js`)
    await loadCSSAsync(`${PATH_UI}/PlayerStatusPanel/PlayerStatusPanel.css`)

    return new this()
  }

  async init() {
    this.updateHealthBar(100, 100) // Example: current health 100, max health 100
    this.addStatusEffect('Burning', 5) // Example: Add "Burning" effect for 5 seconds
  }

  updateHealthBar(currentHealth, maxHealth) {
    const healthPercentage = (currentHealth / maxHealth) * 100;

    // Set the width of the fill
    this.$healthBarFill.css('width', `${healthPercentage}%`);

    // Dynamically adjust the gradient to match the current health
    let gradient = '';
    if (healthPercentage > 50) {
        // Green to yellow to red (high health)
        const remainingGreen = ((healthPercentage - 50) / 50) * 100;
        gradient = `linear-gradient(to right, #ffeb3b 0%, #43a048 ${remainingGreen}%)`;
    } else if (healthPercentage > 0) {
        // Yellow to red (medium health)
        const remainingYellow = (healthPercentage / 50) * 100;
        gradient = `linear-gradient(to right, #b71c1c 0%, #ffeb3b ${remainingYellow}%)`;
    } else {
        // Only red (low health)
        gradient = `linear-gradient(to right, #b71c1c 100%)`;
    }

    // Apply the background gradient
    this.$healthBarFill.css('background', gradient);
}


  addStatusEffect(effectName, duration) {
    const $effect = $(`<div class="status_effect">${effectName}</div>`)
    this.$statusEffects.append($effect)
  }

  // Add more methods for updating other player status elements as needed
}
