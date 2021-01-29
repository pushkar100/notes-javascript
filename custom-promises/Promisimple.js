const STATES = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
};

class Promisimple {
  constructor(executor) {
    this._state = STATES.PENDING;
    this._value = null;
    this._thenables = [];
    this._markFinalState = (state) => (value) => {
      if (this._state !== STATES.PENDING) return;
      this._state = state;
      this._value = value;
      this._dequeueThenables(state);
    };

    this.resolve = this._markFinalState(STATES.FULFILLED);
    this.reject = this._markFinalState(STATES.REJECTED);

    try {
      // Imitating a micro-task queue (async execution):
      setTimeout(() => executor(this.resolve, this.reject), 0)
    } catch (e) {
      this.reject();
    }
  }

  static resolve(value) {
    return new Promisimple((resolve) => resolve(value));
  }

  static reject(error) {
    return new Promisimple((_, reject) => reject(error));
  }

  then(thenable) {
    return this._queueThenable(thenable, STATES.FULFILLED)
  }

  catch(thenable) {
    return this._queueThenable(thenable, STATES.REJECTED)
  }
  
  _queueThenable(thenable, type) {
    const newPromise = new Promisimple(() => {});
    if (this._state !== STATES.PENDING) {
      this._executeThenable(thenable, newPromise)
    } else {
      this._thenables.push({
        type,
        thenable,
        newPromise,
      });
    }
    return newPromise;
  }

  _dequeueThenables(state) {
    this._thenables.forEach(({type, thenable, newPromise}) => {
      if (type === state) {
        this._executeThenable(thenable, newPromise);
      } else {
        state === STATES.FULFILLED
          ? newPromise.resolve(this._value)
          : newPromise.reject(this._value)
      }
    });
  }

  _executeThenable(thenable, newPromise) {
    try {
      const value = thenable(this._value);
      newPromise.resolve(value);
    } catch (e) {
      newPromise.reject(e);
    }
  }
}

/*
// Test 1: Simple then & catch with values (promise resolves)
const test = new Promisimple((resolve, reject) => {
  resolve(100)
});
test.then((value) => console.log('then', value))
test.catch((value) => console.log('catch', value))
// Expected output:
// then 100
*/

/*
// Test 2: Simple then & catch with values (promise rejects)
const test = new Promisimple((resolve, reject) => {
  reject(10)
});
test.then((value) => console.log('then', value))
test.catch((value) => console.log('catch', value))
// Expected output:
// catch 10
*/

/*
// Test 3: asynchronous resolve
const test = new Promisimple((resolve, reject) => {
  setTimeout(() => resolve(100), 1000)
});
test.then((value) => console.log('then', value))
test.catch((value) => console.log('catch', value))
// Expected output:
// then 100 (after 1 second)
*/

/*
// Test 3: asynchronous reject
const test = new Promisimple((resolve, reject) => {
  setTimeout(() => reject(10), 1000)
});
test.then((value) => console.log('then', value))
test.catch((value) => console.log('catch', value))
// Expected output:
// catch 10 (after 1 second)
*/

/*
// Test 3: chaining thens:
const test = new Promisimple((resolve, reject) => {
  setTimeout(() => resolve(100), 1000)
});
test
  .then((value) => console.log('then 1: ', value))
  .then((value) => {
    console.log('then 2: ', value);
    return 5;
  })
  .then((value) => console.log('then 3: ', value))
// Expected output:
// then 1: 100 (after 1 second)
// then 2: undefined
// then 3: 5
*/

/*
// Test 3: chaining catches:
const test = new Promisimple((resolve, reject) => {
  setTimeout(() => reject(10), 1000)
});
test
  .catch((value) => console.log('catch 1: ', value))
  .catch((value) => {
    console.log('catch 2: ', value);
    return 5;
  })
  .catch((value) => console.log('catch 3: ', value))
// Expected output:
// catch 1: 10 (after 1 second)
*/

/*
// Test 3: mixed chaining of thens & catches:
const test = new Promisimple((resolve, reject) => {
  setTimeout(() => resolve(100), 1000)
});
test
  .then((value) => console.log('then 1: ', value))
  .catch((value) => console.log('catch 1: ', value))
  .then((value) => {
    console.log('then 2: ', value);
    throw new Error('Some error')
  })
  .catch((value) => {
    console.log('catch 2: ', value)
    return 42
  })
  .then((value) => console.log('then 3: ', value))
  .catch((value) => console.log('catch 3: ', value))
// Expected output:
// then 1: 100 (after 1 second)
// then 2: undefined
// catch 2: Some error (An error object)
// then 3: 42
*/

