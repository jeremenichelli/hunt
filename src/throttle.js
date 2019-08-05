const DEFAULT_THROTTLE_INTERVAL = 100

/**
 * Throttles method execution to prevent some performance bottlenecks
 * @param {Function} fn method to throttle
 * @param {Number} interval milliseconds for the method to be delayed
 */
function throttle(fn, interval = DEFAULT_THROTTLE_INTERVAL) {
  let inThrottle
  let lastFunc
  let lastRan

  return function() {
    if (inThrottle === true) {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= interval) {
          fn.apply(this, arguments)
          lastRan = Date.now()
        }
      }, interval - (Date.now() - lastRan))
    } else {
      fn.apply(this, arguments)
      lastRan = Date.now()
      inThrottle = true
    }
  }
}

export default throttle
