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
        newPromise.resolve(this._value)
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
