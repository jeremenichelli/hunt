import Hunt from '.'
import test from 'ava'
import clone from 'lodash.clone'

// mock window object
const window = {
  innerWidth: 0,
  innerHeight: 0,
  scrollX: 0,
  scrollY: 0,
  addEventListener() {},
  removeEventListener() {},
  requestAnimationFrame(f) {
    f()
  }
}

// const document = {
//   body: {
//     scrollHeight: 0,
//     scrollWidth: 0
//   }
// };

test.beforeEach(() => {
  global.window = clone(window)
  // global.document = clone(document);
})

test('creates instance', (t) => {
  const mockedElement = {
    nodeType: 1,
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      }
    }
  }
  const options = {}
  const observer = new Hunt(mockedElement, options)
  t.true(observer instanceof Hunt)
})
