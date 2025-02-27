const { dayLight } = await import(`${PATH_SYSTEMS}/Environment/DayNightCycle.js`)
const { systemManager } = await import(`${PATH_MANAGERS}/SystemManager.js`)

const light = systemManager.getSystem(`DayNightCycle`).dayLight
export const shadowGenerator = new BABYLON.ShadowGenerator(1024, light)

shadowGenerator.bias = 0.001
light.shadowOrthoScale = 0.5

shadowGenerator.useExponentialShadowMap = true
shadowGenerator.forceBackFacesOnly = false

shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH
shadowGenerator.filter = BABYLON.ShadowGenerator.PCFSoftFilter

shadowGenerator.enableSoftTransparentShadow = true
shadowGenerator.transparencyShadow = false
