(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.hunt = factory(root);
    }
})(this, function() {
    'use strict';

    var huntedElements = [],
        viewport = window.innerHeight,
        scrollY = window.scrollY || window.pageYOffset,
        y = viewport + scrollY;

    /*
     * Constructor for element to be hunted
     * @constructor Hunted
     * @param {Node} element
     * @param {Object} options
     * @returns undefined
     */
    var Hunted = function(element, config) {
        this.element = element;

        // instantiate element as not visible
        this.visible = false;

        this.height = this.element.clientHeight;
        this.top = this.element.offsetTop;

        for (var prop in config) {
            if (config.hasOwnProperty(prop)) {
                this[prop] = config[prop];
            }
        }
    };

    // by default trigger events only once
    Hunted.prototype.persist = false;

    // fallback in function to avoid sanity check
    Hunted.prototype.in = function() {};

    // fallback out function to avoid sanity check
    Hunted.prototype.out = function() {};

    /*
     * Adds one or more elements to the hunted elements array
     * @method add
     * @param {Array|Node} elements
     * @param {Object} options
     * @returns undefined
     */
    var add = function(elements, options) {
        // sanity check of arguments
        if (elements instanceof Node === false
                && typeof elements.length !== 'number'
                || typeof options !== 'object') {
            throw new TypeError('You must pass an element or a collection of them and an options object');
        }

        // treat single node as array
        if (elements instanceof Node === true) {
            elements = [ elements ];
        }

        var i = 0,
            len = elements.length;

        // add elements to general hunted array
        for (; i < len; i++) {
            huntedElements.push(new Hunted(elements[i], options));
        }

        // check if some of the recently added elements is already visible
        huntElements();
    };

    /*
     * Updates viewport metrics
     * @method updateMetrics
     * @returns undefined
     */
    var updateMetrics = function() {
        viewport = window.innerHeight;
        scrollY = window.scrollY || window.pageYOffset;
    };

    /*
     * Checks if hunted elements are visible
     * @method updateMetrics
     * @returns undefined
     */
    var huntElements = function() {
        var len = huntedElements.length,
            hunted;

        if (len > 0) {
            scrollY = window.scrollY || window.pageYOffset;
            y = viewport + scrollY;

            while (len) {
                --len;

                hunted = huntedElements[len];

                if (!hunted.visible && y > hunted.top && y < hunted.top + hunted.height + viewport) {
                    hunted.in.apply(hunted.element);
                    hunted.visible = true;
                }

                if (hunted.visible && (y < hunted.top || y >= hunted.top + hunted.height + viewport)) {
                   hunted.out.apply(hunted.element);
                   hunted.visible = false;

                   if (!hunted.persist) {
                       // if hunting should not persist splice element
                       huntedElements.splice(len, 1);
                   }
                }
            }
        }

        hunted = len = null;
    };

    // on resize update viewport metrics
    window.addEventListener('resize', updateMetrics);

    // on scroll check for elements position and trigger methods
    window.addEventListener('scroll', huntElements);

    return add;
});
