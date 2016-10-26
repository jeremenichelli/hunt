# hunt

[![Build Status](https://travis-ci.org/jeremenichelli/hunt.svg)](https://travis-ci.org/jeremenichelli/hunt)

Library to detect when DOM elements become visible and disappear on scroll


## Install

Download the library and include it in a script tag or install as an npm package.

```sh
npm install huntjs --save
```

## Use

Once you've included the script tag or require the module you need to simply pass an element or a list of them and an object to configure the actions and behaviors.

```js
hunt(document.getElementsByClassName('element'), {
    enter: function() {
        this.classList.add('visible');
    },
    out: function() {
        this.classList.remove('visible');
    }
});
```
You don't need to pass both <strong>in</strong> and <strong>out</strong>, you can pass either one of them or both, of course. You might have also noticed that inside those methods you make reference to element that has become visible using the reserved word <code>this</code> to apply any modification to it.

By default <strong>hunt</strong> will stop "hunting" or watching for the element once the <strong>out</strong> method has been executed to improve performance, but if you need these methods to be called every time the element appears and disappears from the viewport you can pass a <code>persist</code> option as <code>true</code>, but beware you can affect scrolling performance.

```js
hunt(document.getElementsByClassName('element'), {
    enter: function() {
        this.classList.add('visible');
    },
    out: function() {
        this.classList.remove('visible');
    },
    persist: true
});
```

In case you need actions to be executed under the hood, you can use the <code>offset</code> option.

```js
hunt(document.querySelector('.action--element'), {
    enter: function() {
        this.classList.add('visible');
    },
    persist: false,
    offset: 150
});
```

## Size

This library weighs only <strong>646 bytes</strong> minified and gzipped!
