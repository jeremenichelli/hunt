import Hunt from '.'
import test from 'ava'
import sinon from 'sinon'
import clone from 'lodash.clone'

// mock window object
const window = {
  innerHeight: 0,
  addEventListener() {},
  removeEventListener() {}
}

test.beforeEach(() => {
  global.window = clone(window)
})

test('calls enter and leave hooks correctly and persists', (t) => {
  // alter window dimensions
  global.window.innerHeight = 550

  // fake rects
  let rects = {
    x: 352,
    y: 1040,
    width: 350,
    height: 350,
    top: 1040,
    right: 702,
    bottom: 1390,
    left: 352
  }

  // mock element outside the viewport
  const mockedElement = {
    nodeType: 1,
    getBoundingClientRect() {
      return rects
    }
  }

  const enterSpy = sinon.spy()
  const leaveSpy = sinon.spy()
  const options = {
    enter: enterSpy,
    leave: leaveSpy,
    persist: true
  }

  const observer = new Hunt(mockedElement, options)
  t.is(enterSpy.callCount, 0)
  t.is(leaveSpy.callCount, 0)

  // modify rects for viewport visibility and trigger observer
  rects = {
    x: 352,
    y: 97,
    width: 350,
    height: 350,
    top: 97,
    right: 702,
    bottom: 447,
    left: 352
  }
  observer.trigger()

  t.is(enterSpy.callCount, 1)
  t.is(leaveSpy.callCount, 0)

  // modify rects for viewport leave and trigger observer
  rects = {
    x: 352,
    y: 1040,
    width: 350,
    height: 350,
    top: 1040,
    right: 702,
    bottom: 1390,
    left: 352
  }
  observer.trigger()

  t.is(enterSpy.callCount, 1)
  t.is(leaveSpy.callCount, 1)

  // modify rects for viewport visibility and trigger observer
  rects = {
    x: 352,
    y: 97,
    width: 350,
    height: 350,
    top: 97,
    right: 702,
    bottom: 447,
    left: 352
  }
  observer.trigger()

  t.is(enterSpy.callCount, 2)
  t.is(leaveSpy.callCount, 1)
})

test('disconnects when persist is false', (t) => {
  // alter window dimensions
  global.window.innerHeight = 550

  // fake rects
  let rects = {
    x: 352,
    y: 1040,
    width: 350,
    height: 350,
    top: 1040,
    right: 702,
    bottom: 1390,
    left: 352
  }

  // mock element outside the viewport
  const mockedElement = {
    nodeType: 1,
    getBoundingClientRect() {
      return rects
    }
  }

  const disconnectSpy = sinon.spy()
  const enterSpy = sinon.spy()
  const leaveSpy = sinon.spy()
  const options = {
    enter: enterSpy,
    leave: leaveSpy
  }

  const observer = new Hunt(mockedElement, options)
  observer.disconnect = disconnectSpy
  t.is(enterSpy.callCount, 0)
  t.is(leaveSpy.callCount, 0)
  t.is(disconnectSpy.callCount, 0)

  // modify rects for viewport visibility and trigger observer
  rects = {
    x: 352,
    y: 97,
    width: 350,
    height: 350,
    top: 97,
    right: 702,
    bottom: 447,
    left: 352
  }
  observer.trigger()

  t.is(enterSpy.callCount, 1)
  t.is(leaveSpy.callCount, 0)
  t.is(disconnectSpy.callCount, 0)

  // modify rects for viewport leave and trigger observer
  rects = {
    x: 352,
    y: 1040,
    width: 350,
    height: 350,
    top: 1040,
    right: 702,
    bottom: 1390,
    left: 352
  }
  observer.trigger()

  t.is(enterSpy.callCount, 1)
  t.is(leaveSpy.callCount, 1)
  t.is(disconnectSpy.callCount, 1)
})

test('accepts collection of elements', (t) => {
  // alter window dimensions
  global.window.innerHeight = 550

  // fake rects
  let firstElementRect = {
    x: 352,
    y: 1040,
    width: 350,
    height: 350,
    top: 1040,
    right: 702,
    bottom: 1390,
    left: 352
  }
  let secondElementRect = {
    x: 737,
    y: 1429,
    width: 350,
    height: 350,
    top: 1429,
    right: 1087,
    bottom: 1779,
    left: 737
  }

  // mock element outside the viewport
  const firstMockedElement = {
    getBoundingClientRect() {
      return firstElementRect
    }
  }
  const secondMockedElement = {
    getBoundingClientRect() {
      return secondElementRect
    }
  }

  const enterSpy = sinon.spy()
  const leaveSpy = sinon.spy()
  const options = {
    enter: enterSpy,
    leave: leaveSpy,
    persist: true
  }

  const observer = new Hunt([firstMockedElement, secondMockedElement], options)

  // modify rects for viewport visibility and trigger observer
  firstElementRect = {
    x: 352,
    y: -90,
    width: 350,
    height: 350,
    top: -90,
    right: 702,
    bottom: 259,
    left: 352
  }
  secondElementRect = {
    x: 737,
    y: 298,
    width: 350,
    height: 350,
    top: 298,
    right: 1087,
    bottom: 648,
    left: 737
  }
  observer.trigger()

  // hunt does reverse crawling on elements when they get to the viewport
  t.deepEqual(enterSpy.getCall(1).args[0], firstMockedElement)
  t.deepEqual(enterSpy.getCall(0).args[0], secondMockedElement)

  // modify rects for viewport leave and trigger observer
  firstElementRect = {
    x: 352,
    y: 1040,
    width: 350,
    height: 350,
    top: 1040,
    right: 702,
    bottom: 1390,
    left: 352
  }
  secondElementRect = {
    x: 737,
    y: 1429,
    width: 350,
    height: 350,
    top: 1429,
    right: 1087,
    bottom: 1779,
    left: 737
  }
  observer.trigger()

  // hunt does reverse crawling on elements when they get to the viewport
  t.deepEqual(leaveSpy.getCall(1).args[0], firstMockedElement)
  t.deepEqual(leaveSpy.getCall(0).args[0], secondMockedElement)
})

test('adds event listeners on instantiation and removes them on disconnect', (t) => {
  global.window.addEventListener = sinon.spy()
  global.window.removeEventListener = sinon.spy()

  // fake rects
  let rects = {
    x: 352,
    y: 1040,
    width: 350,
    height: 350,
    top: 1040,
    right: 702,
    bottom: 1390,
    left: 352
  }

  // mock element outside the viewport
  const mockedElement = {
    nodeType: 1,
    getBoundingClientRect() {
      return rects
    }
  }

  const observer = new Hunt(mockedElement, {})

  t.is(global.window.addEventListener.getCall(0).args[0], 'scroll')
  t.is(global.window.addEventListener.getCall(1).args[0], 'resize')

  observer.disconnect()

  t.is(global.window.removeEventListener.getCall(0).args[0], 'scroll')
  t.is(global.window.removeEventListener.getCall(1).args[0], 'resize')
})

test('throws when call with wrong arguments', (t) => {
  // called with an invalid target
  t.throws(
    () => new Hunt({}, {}),
    'hunt: observer first argument should be a node or a list of nodes'
  )

  // called with an invalid target
  t.throws(
    () => new Hunt({ nodeType: 1 }),
    'hunt: observer second argument should be an object'
  )
})
