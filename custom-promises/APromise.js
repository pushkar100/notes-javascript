/**
 * AUTHOR: Pushkar DK (www.pushkardk.com, www.github.com/pushkar100)
 * A custom promise implementation that follows the ADT of the ECMAScript Promise Specification.
 * 
 * Example usages:
 * 
 * var b = new APromise((res, rej) => setTimeout(() => rej(), 8000))
 * b.then(() => console.log('1'))
 * .then(() => console.log('2'))
 * .catch(() => console.log('c'))
 * .finally(() => { console.log('f'); throw Error() })
 * .then(() => console.log('4'))
 * .catch(() => console.log('c2'))
 * 
 * var a = new APromise(res => setTimeout(() => res(1), 8000))
 * var b = new APromise((res, rej) => setTimeout(() => res(2), 8500))
 * var c = new APromise(res => setTimeout(() => res(3), 9000))
 * APromise.all([a, b, c]).then(data => console.log('data', data)).catch(data => console.log('catch data', data))
 * 
 * var a = new APromise(res => setTimeout(() => res(1), 8000))
 * var b = new APromise((res, rej) => setTimeout(() => rej(2), 8500))
 * var c = new APromise(res => setTimeout(() => res(3), 9000))
 * APromise.allSettled([a, b, c]).then(data => console.log('data', data)).catch(data => console.log('catch data', data))
 *
 */
class APromise {
  constructor(callback) {
    // 0. Maintain states & callback types:
    const STATES = {
      PENDING: 'pending', 
      FULFILLED: 'fulfilled', 
      REJECTED: 'rejected'
    }
    this.$state = STATES.PENDING;
    this.$types = {
      then: 1,
      catch: 2,
      finally: 3
    }
    // 1. Maintain callback queues:
    this.queue = []
    // 2. Maintain the necessary methods:
    this.resolve = value => {
      // Mark as fulfilled:
      this.$state = STATES.FULFILLED
      // Execute all the callbacks (whatever is applicable):
      this._executeCallbacksFromQueue(this.queue, value, this.$types.then)
    }
    this.reject = value => {
      // Mark as rejected:
      this.$state = STATES.REJECTED
      // Execute all the callbacks (whatever is applicable):
      this._executeCallbacksFromQueue(this.queue, value, this.$types.catch)
    }
    
    // this.allSettled
    // 3. Execute the callback:
    if (typeof callback === 'function') {
      callback.apply(this, [this.resolve.bind(this), this.reject.bind(this)])
    }
  }

  // Prototype methods:
  then(cb) {
    const newPromise = new APromise(() => {});
    this._addCallbackToQueue(this.queue, { cb, newPromise, type: this.$types.then })
    return newPromise;
  }
  catch(cb) {
    const newPromise = new APromise(() => {});
    this._addCallbackToQueue(this.queue, { cb, newPromise, type: this.$types.catch })
    return newPromise;
  } 
  finally(cb) {
    const newPromise = new APromise(() => {});
    this._addCallbackToQueue(this.queue, { cb, newPromise, type: this.$types.finally })
    return newPromise;
  }

  // Static methods:
  static resolve(value) {
    return new APromise(resolve => setTimeout(() => resolve()), 0)
  }
  static reject(value) {
    return new APromise((resolve, reject) => setTimeout(() => reject()), 0)
  }
  static race(promisesIterable) {
    return new APromise((resolve, reject) => {
      promisesIterable.forEach(p => {
        p.then(data => resolve(data))
        p.catch(data => reject(data))
      })
    })
  }
  static all(promisesIterable) {
    // Check if iterbale is empty:
    if (!promisesIterable || !promisesIterable.length) {
      return new Promise(res => res())
    }
    // Check if iterable contains no promises:
    let allNonPromises = true
    promisesIterable.forEach(p => {
      allNonPromises = (p instanceof APromise) ? false : allNonPromises
    })
    if (allNonPromises) {
      return new Promise(res => res())
    }
    // Calculation:
    return new APromise((resolve, reject) => {
      const resolutions = []
      let resolvedCount = 0
      promisesIterable.forEach((p, i) => {
        p.catch(data => reject(data))
        p.then(data => {
          resolutions[i] = data
          resolvedCount += 1
          if (resolvedCount === promisesIterable.length) {
            resolve(resolutions)
          }
        })
      })
    });
  }
  static allSettled(promisesIterable) {
    return new APromise((resolve, reject) => {
      const settled = []
      const statuses = ['fulfilled', 'rejected']
      let settledCount = 0
      const resolveIfAllSettled = () => {
        if (settledCount === promisesIterable.length) {
          resolve(settled)
        }
      }
      promisesIterable.forEach((p, i) => {
        p.then(data => {
          settled[i] = { status: statuses[0], value: data }
          settledCount += 1
          resolveIfAllSettled()
        })
        p.catch(data => {
          settled[i] = { status: statuses[1], reason: data }
          settledCount += 1
          resolveIfAllSettled()
        })
      })
    })
  }

  // Private methods:
  _addCallbackToQueue(queue, queueItem) {
    if (typeof queueItem.cb === 'function') {
      queue.push(queueItem)
    } else {
      throw new Error(`Expected function, received ${typeof cb}`)
    }
  }
  _executeCallbacksFromQueue(queue, value, callbackType) {
    while(queue.length) {
      const firstItem = queue.shift()
      const { cb, newPromise, type } = firstItem
      try { 
        const matchesTypeOrIsFinally = callbackType === type || type === this.$types.finally
        if (matchesTypeOrIsFinally) {
          newPromise.resolve(cb(value))
        } else {
          // Skip by resolving/rejecting with previous value in chain:
          const isThen = callbackType === this.$types.then
          if (isThen) {
            newPromise.resolve(value)
          } else {
            newPromise.reject(value)
          }
        }
      } catch (e) {
        newPromise.reject(e)
      }
    }
  } 
}
