# hunt

[![Build Status](https://travis-ci.org/jeremenichelli/hunt.svg)](https://travis-ci.org/jeremenichelli/hunt)

Light-weight library to observe nodes entering and leaving the viewport.


## Install

Download the library and include it in a script tag or install as a package.

```sh
npm install huntjs --save
```


## Usage and basic config

Create an obsever passing an element or a collection of them and an **options** object.

In most cases you might just want to observe a collection of nodes and do something with them when they enter the screen. For this you will only need to pass a node or a node list, and an object with an `enter` callback.

```js
import Hunt from 'huntjs';

const lazyImages = document.querySelectorAll('.lazy__images');

let observer = new Hunt(lazyImages, {
  enter: (image) => image.src = image.dataset.src
});
```

**hunt** also tracks when elements leave the screen, you can pass a `leave` callback to the configuration object to do something when this happens.

```js
import Hunt from 'huntjs';

const someElements = document.querySelectorAll('.some__elements');

let observer = new Hunt(someElements, {
  leave: (element) => element.classList.remove('visible')
});
```

_Both callbacks will receive the element which triggered the action as argument._

After an element has entered and left the viewport, **hunt** will stop tracking its position and after all the observed elements have left the observer will get _disconnected_ to prevent unnecessary computation on the scroll event.

If you want to track the elements all the time you can use the `persist` option.

```js
import Hunt from 'huntjs';

const someElements = document.querySelectorAll('.some__elements');

let observer = new Hunt(someElements, {
  enter: (element) => element.classList.add('visible'),
  leave: (element) => element.classList.remove('visible'),
  persist: true
});
```


### All the options

**hunt** observers also accept other configurations that are rarely necessary but might become handy for your use case, heare are all lsited:

 - ` enter` **(function)** method that will be called when the element becomes visible.

 - `leave` **(function)** method that will be called when the element disappears from the viewport.

 - `persist` **(boolean)** once the element has entered and left the viewport, the observer stops _hunting_ it unless you set this option to `true`, once it's true, `enter` and `leave` methods awill be called each time an element state changes.

 - `offset` **(number)**, `enter` and `leave` methods will be called a number of pixels ahead of the element's state change, `0` being the default value.

 - `throttleInterval` **(number)** interval that _hunt_ events are throttled by in milliseconds. A lower number will mean elements are detected in view quicker, but may degrade performace. A higher value will mean elements are detected in view slower, but may improve performance. The default value is `100ms`. _We recommend not to modify this variable unless it is extremely necessary._


## Workflow and additional API

Each observer you create will _hunt_ for elements and fire the `enter` function when they appear and the `leave` function when elements have appeared and then disappeared from the viewport.

After both functions are called the observer will stop tracking the element's position unless the `persist` option is set to `true` or the `data-hunt-persist` is set to `"true"`.

You can always call `observer.disconnect()` at any time to stop all activity. Running an isolated check is also possible by calling `observer.trigger()`.


## Custom configuration over dataset

If you have exceptions for one or more elements, `data-hunt-offset` and `data-hunt-persist` attributes can be used. These custom values will override the ones you passed when creating the observer.

```html
<div class="some__element" data-hunt-persist="true" data-hunt-offset="500"></div>
```

These custom values will override the ones you passed when creating the observer.


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
