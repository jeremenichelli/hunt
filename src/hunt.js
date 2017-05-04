(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return factory();
    });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Hunt = factory();
  }
})(this, function() {
  'use strict';

  var THROTTLE_INTERVAL = 100;

  /**
   * Fallback function
   * @method noop
   */
  var noop = function() {};

  /**
   * Constructor for element that should be hunted
   * @constructor Hunted
   * @param {Node} element
   * @param {Object} config
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

    if (typeof element.dataset !== 'undefined') {
      // replace options with dataset if present
      if (typeof element.dataset.huntPersist !== 'undefined') {
        try {
          this.persist = JSON.parse(element.dataset.huntPersist);
        } catch (e) {
          console.log('Invalid data-hunt-persist value', e);
        }
      }

      if (typeof element.dataset.huntOffset !== 'undefined') {
        try {
          this.offset = JSON.parse(element.dataset.huntOffset);
        } catch (e) {
          console.log('Invalid data-hunt-offset value', e);
        }
      }
    }
  };

  // by default offset is zero
  Hunted.prototype.offset = 0;

  // by default trigger events only once
  Hunted.prototype.persist = false;

  // fallback enter function to avoid sanity check
  Hunted.prototype.enter = noop;

  // fallback out function to avoid sanity check
  Hunted.prototype.out = noop;

  /**
   * Creates and initializes observer
   * @constructor HuntObserver
   * @param {Node|Array} elements
   * @param {Object} options
   */
  var HuntObserver = function(elements, options) {
    // arguments sanity check
    if (elements instanceof Node === false
          && typeof elements.length !== 'number'
          || typeof options !== 'object') {
      throw new TypeError('Arguments must be an element or a list of them and an object');
    }

    // treat single node as array
    if (elements instanceof Node === true) {
      elements = [ elements ];
    }

    // track viewport height internally
    this._viewportHeight = window.innerHeight;

    // add elements to general hunted array
    this._huntedElements = [];

    var i = 0;
    var len = elements.length;

    for (; i < len; i++) {
      this._huntedElements.push(new Hunted(elements[i], options));
    }

    // connect observer
    _connect.call(this);

    i = len = null;

    // Return observer instance
    return this;
  };

  /**
   * Checks if hunted elements are visible and apply callbacks
   * @method _huntElements
   */
  HuntObserver.prototype._huntElements = function() {
    var len = this._huntedElements.length;
    var hunted;
    var rect;
    var isOnViewport;

    while (len) {
      --len;

      hunted = this._huntedElements[len];
      rect = hunted.element.getBoundingClientRect();
      isOnViewport = rect.top - hunted.offset < this._viewportHeight && rect.top >= -(rect.height + hunted.offset);

      /*
       * trigger (enter) event if element comes from a non visible state and the scrolled
       * viewport has reached the visible range of the element without exceeding it
       */
      if (!hunted.visible && isOnViewport) {
          hunted.enter.call(this, hunted.element);
          hunted.visible = true;
        }

      /*
       * trigger (out) event if element comes from a visible state
       * and it's out of the visible range its bottom or top limit
       */
      if (hunted.visible && !isOnViewport) {
        hunted.out.call(this, hunted.element);
        hunted.visible = false;

        // when hunting should not persist remove element
        if (!hunted.persist) {
          this._huntedElements.splice(len, 1);

          // end observer activity when there are no more elements
          if (this._huntedElements.length === 0) {
            this.disconnect();
          }
        }
      }
    }

    len = hunted = rect = isOnViewport = null;
  };

  /**
   * _huntElements public alias
   * @method trigger
   */
  HuntObserver.prototype.trigger = HuntObserver.prototype._huntElements;


  /**
   * Update viewport tracked height and runs a check
   * @method _updateMetrics
   */
  HuntObserver.prototype._updateMetrics = function() {
    this._viewportHeight = window.innerHeight;
    this._huntElements();
  };

  /**
   * Assign throttled actions and add listeners
   * @method _connect
   */
  var _connect = function() {
    // throttle actions
    this._throttledHuntElements = throttle(this._huntElements.bind(this));
    this._throttledUpdateMetrics = throttle(this._updateMetrics.bind(this));

    // add listeners
    window.addEventListener('scroll', this._throttledHuntElements);
    window.addEventListener('resize', this._throttledUpdateMetrics);

    // run first check
    this._huntElements();
  };

  /**
   * Remove listeners
   * @method disconnect
   */
  HuntObserver.prototype.disconnect = function() {
    // remove listeners
    window.removeEventListener('scroll', this._throttledHuntElements);
    window.removeEventListener('resize', this._throttledUpdateMetrics);
  };

  /**
   * Prevents unnecessary calls through time interval polling
   * @method throttle
   * @param {Function} fn
   * @returns {Function}
   */
  var throttle = function(fn) {
    var timer = null;

    return function throttledAction() {
      if (timer) {
        return;
      }
      timer = setTimeout(function () {
        fn.apply(this, arguments);
        timer = null;
      }, THROTTLE_INTERVAL);
    };
  };

  return HuntObserver;
});
