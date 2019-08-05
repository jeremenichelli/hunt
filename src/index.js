import noop from './noop'
import throttle from './throttle'

/**
 * Assign throttled actions and add listeners
 * @param {Number} throttleInterval
 * @method _connect
 */
var _connect = function(throttleInterval) {
  // throttle actions
  this._throttledHuntElements = throttle(
    this._huntElements.bind(this),
    throttleInterval
  )
  this._throttledUpdateMetrics = throttle(
    this._updateMetrics.bind(this),
    throttleInterval
  )

  // add listeners
  window.addEventListener('scroll', this._throttledHuntElements)
  window.addEventListener('resize', this._throttledUpdateMetrics)

  // run first check
  this._huntElements()
}

/**
 * Constructor for element that should be hunted
 * @constructor Hunted
 * @param {Node} element
 * @param {Object} config
 */
var Hunted = function(element, config) {
  this.element = element

  // instantiate element as not visible
  this.visible = false

  for (var prop in config) {
    if (Object.hasOwnProperty.call(config, prop)) {
      this[prop] = config[prop]
    }
  }

  if (typeof element.dataset !== 'undefined') {
    // replace options with dataset if present
    if (typeof element.dataset.huntPersist !== 'undefined') {
      try {
        this.persist = JSON.parse(element.dataset.huntPersist)
      } catch (e) {
        console.log('hunt: invalid data-hunt-persist value', e)
      }
    }

    if (typeof element.dataset.huntOffset !== 'undefined') {
      try {
        this.offset = JSON.parse(element.dataset.huntOffset)
      } catch (e) {
        console.log('hunt: invalid data-hunt-offset value', e)
      }
    }
  }
}

// by default offset is zero
Hunted.prototype.offset = 0

// by default trigger events only once
Hunted.prototype.persist = false

// fallback enter function to avoid sanity check
Hunted.prototype.enter = noop

// fallback leave function to avoid sanity check
Hunted.prototype.leave = noop

/**
 * Creates and initializes observer
 * @constructor HuntObserver
 * @param {Node|NodeList|Array} target
 * @param {Object} options
 */
var HuntObserver = function(target, options) {
  // sanity check for first argument
  const isValidTarget =
    (target && target.nodeType === 1) || typeof target.length === 'number'
  if (!isValidTarget) {
    throw new TypeError(
      'hunt: observer first argument should be a node or a list of nodes'
    )
  }

  // sanity check for second argument
  if (typeof options !== 'object') {
    throw new TypeError('hunt: observer second argument should be an object')
  }

  // treat single node as array
  if (target.nodeType === 1) {
    target = [target]
  }

  // track viewport height internally
  this._viewportHeight = window.innerHeight

  // add target to general hunted array
  this._huntedElements = []

  var i = 0
  var len = target.length

  for (; i < len; i++) {
    this._huntedElements.push(new Hunted(target[i], options))
  }

  // connect observer and pass in throttle interval
  _connect.call(this, options.throttleInterval)

  i = len = null

  // Return observer instance
  return this
}

/**
 * Checks if hunted elements are visible and apply callbacks
 * @method _huntElements
 */
HuntObserver.prototype._huntElements = function() {
  var len = this._huntedElements.length
  var hunted
  var rect
  var isOnViewport

  while (len) {
    --len

    hunted = this._huntedElements[len]
    rect = hunted.element.getBoundingClientRect()
    isOnViewport =
      rect.top - hunted.offset < this._viewportHeight &&
      rect.top >= -(rect.height + hunted.offset)

    /*
     * trigger (enter) event if element comes from a non visible state and the scrolled
     * viewport has reached the visible range of the element without exceeding it
     */
    if (hunted.visible === false && isOnViewport === true) {
      hunted.enter.call(null, hunted.element)
      hunted.visible = true

      // when the leave callback method is not set and hunting should not persist remove element
      if (hunted.leave === noop && hunted.persist !== true) {
        this._huntedElements.splice(len, 1)

        // end observer activity when there are no more elements
        if (this._huntedElements.length === 0) {
          this.disconnect()
        }
      }
    }

    /*
     * trigger (out) event if element comes from a visible state
     * and it's out of the visible range its bottom or top limit
     */
    if (hunted.visible === true && isOnViewport === false) {
      hunted.leave.call(null, hunted.element)
      hunted.visible = false

      // when hunting should not persist remove element
      if (hunted.persist !== true) {
        this._huntedElements.splice(len, 1)

        // end observer activity when there are no more elements
        if (this._huntedElements.length === 0) {
          this.disconnect()
        }
      }
    }
  }

  len = hunted = rect = isOnViewport = null
}

/**
 * _huntElements public alias
 * @method trigger
 */
HuntObserver.prototype.trigger = HuntObserver.prototype._huntElements

/**
 * Update viewport tracked height and runs a check
 * @method _updateMetrics
 */
HuntObserver.prototype._updateMetrics = function() {
  this._viewportHeight = window.innerHeight
  this._huntElements()
}

/**
 * Remove listeners
 * @method disconnect
 */
HuntObserver.prototype.disconnect = function() {
  // remove listeners
  window.removeEventListener('scroll', this._throttledHuntElements)
  window.removeEventListener('resize', this._throttledUpdateMetrics)
}

export default HuntObserver
