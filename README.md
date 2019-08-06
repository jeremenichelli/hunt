# hunt

[![Build Status](https://travis-ci.org/jeremenichelli/hunt.svg)](https://travis-ci.org/jeremenichelli/hunt)

👻 Minimal library to observe nodes entering and leaving the viewport.

_Be sure to also check the **Intersection Observer API**, a native solution which works in modern browsers, if you want to know more I wrote an [introduction article](//jeremenichelli.io/2016/04/quick-introduction-to-the-intersection-observer-api) explaining how it works._

## Install

```sh
# npm
npm i huntjs --save

# yarn
yarn add huntjs
```

Or include it as a script with `//unpkg.com/huntjs` as source.

## Usage

The package exposes an observer that receives a `Node`, `NodeList` or `Array` as a first argument and an object as a second argument with the desired set of options.

```js
import Hunt from 'huntjs';

// lazy loading images using dataset and hunt
const lazyImages = document.querySelectorAll('img.lazy');

let observer = new Hunt(lazyImages, {
  enter: (image) => image.src = image.dataset.src
});
```

_Check this example working [here](//jeremenichelli.github.io/hunt)_

By default the observer will stop _hunting_ elements when they enter and then leave the viewport.

## Config options

These are the properties you can set as a configuration:

 - `enter`, _function_ called when the element becomes visible.
 - `leave`, _function_ method called when the element leaves completely the viewport.

_Both callbacks will receive the element which triggered the action as argument._

 - `persist`, _boolean_ and `false` by default which indicates if the targets should still be observed after they entered and left the viewport. When this option is `true` enter and leave methods will be called each time an element state changes. Recommended for constant animations triggered by scroll events.
 - `offset`, _number_ that defines a number of pixels ahead of the element's state change, `0` being the default value. Good if you want to start loading an image before the user reaches to it.
 - `throttleInterval`, _number_ interval use for event throttling. A lower number will mean elements are detected in view quicker, but may degrade performace. A higher value will mean elements are detected in view slower, but may improve performance. The default value is `100`, is recommended not to modify this.

### Custom configuration over dataset

If you need exceptions over config for one or more elements, `data-hunt-offset` and `data-hunt-persist` attributes can be used. These custom values will override the ones you passed to the observer.

```html
<div
  class="observed--element"
  data-hunt-persist="true"
  data-hunt-offset="500"
>
</div>
```

_JSON.parse is used on these values at runtime, make sure to pass safe content._

## Contributing

To contribute [Node.js](//nodejs.org) and [yarn](//yarnpkg.com) are required.

Before commit make sure to follow [conventional commits](//www.conventionalcommits.org) specification and check all tests pass by running `yarn test`.
