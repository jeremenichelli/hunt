# hunt

[![Build Status](https://travis-ci.org/jeremenichelli/hunt.svg)](https://travis-ci.org/jeremenichelli/hunt)

Minimal library to observe nodes entering and leaving the viewport.


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
const lazyImages = document.querySelectorAll('img.lazy');

let observer = new Hunt(lazyImages, {
  enter: (image) => image.src = image.dataset.src
});
```

### Available options

`enter` **(function)** method called when the element becomes visible.

`leave` **(function)** method called when the element disappears from the viewport.

_Both callbacks will receive the element which triggered the action as argument._

`persist` **(boolean)** once the element has entered and left the viewport, the observer stops _hunting_ it unless you set this option to `true`. When this option is enabled `enter` and `leave` methods will be called each time an element state changes.

`offset` **(number)**, `enter` and `leave` methods will be called a number of pixels ahead of the element's state change, `0` being the default value.

`throttleInterval` **(number)** interval that _hunt_ events are throttled by in milliseconds. A lower number will mean elements are detected in view quicker, but may degrade performace. A higher value will mean elements are detected in view slower, but may improve performance. The default value is 100ms.

## Workflow

Each observer you create will _hunt_ for elements and fire the `enter` function when they appear and the `leave` function when elements have appeared and then disappeared from the viewport.

After both functions are called the observer will stop tracking the element's position unless the `persist` option is set to `true`.

You can always call `observer.disconnect()` at any time to stop all activity. Running an isolated check is also possible by calling `observer.trigger()`.


### Custom configuration over dataset

If you need exceptions over config for one or more elements, `data-hunt-offset` and `data-hunt-persist` attributes can be used. These custom values will override the ones you passed to the observer.

```html
<div class="action--element"
  data-hunt-persist="true"
  data-hunt-offset="500"></div>
```


## LICENSE

```
The MIT License (MIT)

Copyright (c) 2016 Jeremias Menichelli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
