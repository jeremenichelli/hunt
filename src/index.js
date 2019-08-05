import noop from './noop'
import throttle from './throttle'

/**
 * Constructor for element that should be hunted
 * @constructor Hunted
 * @param {Node} element
 * @param {Object} config
 */
class Hunted {
  constructor(element, config) {
    this.element = element

    // instantiate element as not visible
    this.visible = false

    // extend properties from config or fallback to prototype values
    for (var prop in config) {
      if (Object.hasOwnProperty.call(config, prop)) {
        this[prop] = config[prop]
      }
    }

    // replace options with dataset if present
    if (typeof element.dataset !== 'undefined') {
      if (typeof element.dataset.huntPersist !== 'undefined') {
        try {
          this.persist = JSON.parse(element.dataset.huntPersist)
        } catch (e) {}
      }
      if (typeof element.dataset.huntOffset !== 'undefined') {
        try {
          this.offset = JSON.parse(element.dataset.huntOffset)
        } catch (e) {}
      }
    }
  }
}

// protoype values
Hunted.prototype.offset = 0
Hunted.prototype.persist = false
Hunted.prototype.enter = noop
Hunted.prototype.leave = noop

/**
 * Creates and initializes observer
 * @constructor Hunt
 * @param {Node|NodeList|Array} target
 * @param {Object} options
 */
class Hunt {
  constructor(target, options) {
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

    // turn target to array
    if (target.nodeType === 1) {
      this.__huntedElements__ = [new Hunted(target, options)]
    } else {
      const targetArray = [].slice.call(target)
      this.__huntedElements__ = targetArray.map((t) => new Hunted(t, options))
    }

    // hoist viewport metrics
    this.__viewportHeight__ = window.innerHeight

    // connect observer and pass in throttle interval
    this.__connect__(options.throttleInterval)
  }

  /**
   * Assign throttled actions and add listeners
   * @param {Number} throttleInterval
   * @method __connect__
   * @memberof Hunt
   */
  __connect__(throttleInterval) {
    // throttle actions
    this.__throttledHuntElements__ = throttle(
      this.__huntElements__.bind(this),
      throttleInterval
    )
    this.__throttledUpdateMetrics__ = throttle(
      this.__updateMetrics__.bind(this),
      throttleInterval
    )

    // add listeners
    window.addEventListener('scroll', this.__throttledHuntElements__)
    window.addEventListener('resize', this.__throttledUpdateMetrics__)

    // run first check
    this.__huntElements__()
  }

  /**
   * Checks if hunted elements are visible and apply callbacks
   * @method __huntElements__
   * @memberof Hunt
   */
  __huntElements__() {
    let position = this.__huntedElements__.length

    while (position) {
      --position
      const hunted = this.__huntedElements__[position]
      const rect = hunted.element.getBoundingClientRect()
      const isOnViewport =
        rect.top - hunted.offset < this.__viewportHeight__ &&
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
          this.__huntedElements__.splice(position, 1)

          // end observer activity when there are no more elements
          if (this.__huntedElements__.length === 0) {
            this.disconnect()
          }
        }
      }

      /*
       * trigger (leave) event if element comes from a visible state
       * and it's out of the visible range its bottom or top limit
       */
      if (hunted.visible === true && isOnViewport === false) {
        hunted.leave.call(null, hunted.element)
        hunted.visible = false
        // when hunting should not persist remove element
        if (hunted.persist !== true) {
          this.__huntedElements__.splice(position, 1)

          // end observer activity when there are no more elements
          if (this.__huntedElements__.length === 0) {
            this.disconnect()
          }
        }
      }
    }
  }

  /**
   * Update viewport tracked height and runs a check
   * @method __updateMetrics__
   * @memberof Hunt
   */
  __updateMetrics__() {
    this.__viewportHeight__ = window.innerHeight
    this.__huntElements__()
  }

  /**
   * Remove listeners and stops observing elements
   * @method disconnect
   * @memberof Hunt
   */
  disconnect() {
    // remove listeners
    window.removeEventListener('scroll', this.__throttledHuntElements__)
    window.removeEventListener('resize', this.__throttledUpdateMetrics__)
  }

  /**
   * __huntElements__ public alias
   * @method trigger
   * @memberof Hunt
   */
  trigger() {
    this.__huntElements__()
  }
}

export default Hunt
