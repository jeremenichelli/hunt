# hunt

[![Build Status](https://travis-ci.org/jeremenichelli/hunt.svg)](https://travis-ci.org/jeremenichelli/hunt)

Light-weight library to observe nodes entering and leaving the viewport.


## Install

Download the library and include it in a script tag or install as an npm package.

```sh
npm install huntjs --save
```

## Use

Create an obsever passing an element or a collection of them and an **options** object.

```js
import Hunt from 'huntjs';

// lazy loading images using dataset and hunt
const lazyImages = document.querySelector('img.lazy');

let observer = new Hunt(lazyImages, {
  enter: (image) => image.src = image.dataset.src,
  persist: false
});
```

### Available options

`enter`, **function**, method that will be called when the element becomes visible.

`out`, **function**, method that will be called when the element disappears from the viewport.

`persist`, **boolean**, by default when it has appear and disappeared the observer stops _hunting_ the element, if you set this option to `true` callbacks are going to be executed each time an element state changes.

`offset`, **number**, allows you to trigger `enter` and `out` methods a number of pixels before the elements becomes visible and after it has disappeared, `0` being the default.


### Workflow

Each observer you create will _hunt_ for elements and fire the `enter` function when they appear and the `out` function when elements have appeared and then disappeared from the visible viewport. Both callbacks receive the element as first and only argument.

After both functions are called the observer stops tracking the elements position on the viewport unless the `persist` option is set to `true`.

If for some reason you want to stop _hunting_ element you can call `observer.disconnect()` at any time. Running an isolated check is also possible calling `observer.trigger()`.


### Custom configuration over dataset

If you need exceptions over config for one or more elements, `data` attributes can be used.

```html
<div class="action--element"
  data-hunt-persist="true"
  data-hunt-offset="500"></div>
```

These custom values will override the ones you passed when creating the observer.
