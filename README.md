# Electron.js + Babylon.js Game template thing.

**Status:** Work in progress.
_not finished, not polished, kinda broken, probably going to stay this way for a while._
_Alot of things gonna change and break along the way_

What you see currently - lots of bad practices and lack of understanding how to do things.

## Tech Stack

- **Electron.js** - Desktop application framework.
- **Babylon.js** - 3D rendering engine.
- **Havoc** - Physics engine intergrated in babylon.js.
- **Plain JavaScript** - Because why not.
- **Jquery** - For DOM \ UI manipulation.
  _Temporary, for prototyping, in the end there should be no DOM elements for UI._
- **Mousetrap** - Library for key-combinations.
  _Probably should go later on too_

## How to install

1. **Clone the repository:**
2. **Install dependencies:** `npm install`
3. **Start development server:** `npm start`
4. **Build:** `npm run build`
   _currently only portable build_
5. **~** `To toggle cursor`

## License

[![CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY-NC-SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## Known Issues

- Different FPS settings makes physics inconsistent. Enabled default FPS limit (60) for now. Can be disabled in app.js.
- Physics aren't finished - player sliding, bouncing and floating too much...also STAIRS.
- Cast animations aren't Synced, animation system is pretty basic, there's nothing but blending.
- Needs better camera collision detection.
- need proper contol data organising.
- some event emitters were meant to be "local" to scope of entity, but I never made them local.
- File structure could be better.
- Not responsive, made on 1920x1080 resolution.
- probably some other things are broken too.

## Credits

### Code

- [Babylon.js](https://www.babylonjs.com/)
- [Electron.js](https://www.electronjs.org/)
- [Jquery](https://jquery.com/)
- [Mousetrap](https://craig.is/killing/mice)
- [simplex-noise](https://www.npmjs.com/package/simplex-noise)

### 3D models

- [Mixamo](https://www.mixamo.com/)

### Particles

- [Kenney.nl](https://kenney.nl/)

### Fonts

- Merriweather - [https://fonts.google.com/specimen/Merriweather](https://fonts.google.com/specimen/Merriweather)
