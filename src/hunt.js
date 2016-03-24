(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory();
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.hunt = factory();
    }
})(this, function() {
    'use strict';

    var huntedElements = [],
        viewport = window.innerHeight,
        ticking = false;

    // request animation frame and cancel animation frame vendors
    var rAF = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame;
    })();

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

        for (var prop in config) {
            if (config.hasOwnProperty(prop)) {
                this[prop] = config[prop];
            }
        }
    };

    // by default offset is zero
    Hunted.prototype.offset = 0;

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

        i = len = null;
    };

    /*
     * Updates viewport metrics
     * @method updateMetrics
     */
    var updateMetrics = function() {
        viewport = window.innerHeight;
    };


    /*
     * Checks if a hunted element is visible and schedules its
     * callback handling for consumption in a later pass. This
     * prevents layout thrashing.
     * @method queueElement
     */
    var queueElement = function( queue, hunted, index ) {
        var rect = hunted.element.getBoundingClientRect();

        /*
         * trigger (in) event if element comes from a non visible state and the scrolled viewport has
         * reached the visible range of the element without exceeding it
         */
        if (!hunted.visible
                && rect.top - hunted.offset < viewport
                && rect.top >= -(rect.height + hunted.offset)) {
            queue.unshift( function() {
                hunted.in.apply(hunted.element);
                hunted.visible = true;
                hunted = null;
            });
        }

        /*
         * trigger (out) event if element comes from a visible state and it's out of the visible
         * range its bottom or top limit
         */
        if (hunted.visible
                && (rect.top - hunted.offset > viewport
                || rect.top < -(rect.height + hunted.offset))) {
            queue.unshift( function() {
                hunted.out.apply(hunted.element);
                hunted.visible = false;

                // when hunting should not persist kick element out
                if (!hunted.persist) {
                    huntedElements.splice( index, 1 );
                }

                hunted = null;
            });
        }

        rect = null;
    };

    /*
     * Checks if hunted elements are visible
     * @method updateMetrics
     */
    var huntElements = function() {
        var len = huntedElements.length,
            queue = [];

        while ( --len !== -1 ) {
            queueElement( queue, huntedElements[ len ], len );
        }

        len = queue.length;
        while ( --len !== -1 ) {
            queue[ len ]();
        }

        // reset debounce tick
        ticking = false;

        queue = len = null;
    };

    /*
     * Delays hunting until next frame
     * @method debounceHunt
     */
    var debounceHunt = function() {
        if (!ticking) {
            rAF(huntElements);
        }
        ticking = true;
    };

    // on resize update viewport metrics
    window.addEventListener('resize', updateMetrics);

    // on scroll check for elements position and trigger methods
    window.addEventListener('scroll', debounceHunt);

    return add;
});
