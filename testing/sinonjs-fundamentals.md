# SinonJS Fundamentals

## Spies

**Spy is a function that *observes* a specified function**

Some of the things that a spy can observe:
- Number of times it was called
- Parameters that were passed in
- Return values
- Exceptions thrown, etc.

Spies watch your function and tell us how and when it was used. It does not know what execution happens inside the functions. It can only observe it from outside.

```javascript
/* WAYS TO DEFINE SPIES: */

const sinon = require('sinon')

/* 1. Anonymous spy: */

// Can pass this spy around and gather intelligence
// Useful while interacting with functions that take callbacks
const mySpy = sinon.spy()

// Example:
function alert(message, callback) {
	callback(message)
}
alert('Some message', mySpy) // Can now verify if callback was called.

/* 2. Spying on existing functions */

// You want to test functionality that already exists:
// Has to be a method of an object.
// Syntax:
const spyOnMethod = sinon.spy(object, 'objectMethod')

// Example:
const Wishlist = {
	addItem: (item) => { return append(item) }, // Need to spy on this
	removeItem: (item) => { return reject(item) }
}
const addItemSpy = sinon.spy(Wishlist, 'addItem')
```

Using spies:
```javascript
/* WAYS TO USE SPIES: */

// Spies return objects with many properties that we can use to determine certain cases.

/* 1. Verifying that a function was called */

expect(mySpy.called).to.be.true // using expect
// OR
mySpy.called.should.be.true // using should


/* 2. Verifying multiple calls */

expect(mySpy.calledOnce).to.be.true
expect(mySpy.calledTwice).to.be.true
expect(mySpy.calledThrice).to.be.true
// OR
mySpy.calledOnce.should.be.true
mySpy.calledTwice.should.be.true
mySpy.calledThrice.should.be.true

// More than 3 times?

expect(mySpy.callCount).to.equal(4)
// OR
mySpy.callCount.should.equal(4)


/* 3. Examining parameters passed to a function */

// Matching arguments specified in the order that they are set on original function.
expect(mySpy.withArgs('someParamVal').calledOnce).to.be.true // Match 
// OR
mySpy.withArgs('someParamVal').calledOnce.should.be.true

// Match in other ways:
mySpy.calledWith('list', 'of', 'arguments') // Must include these args
mySpy.calledOnceWith('list', 'of', 'arguments') // Must be called once, & include these args
mySpy.calledWithExactly('list', 'of', 'arguments') // Must be called with exactly these args
mySpy.alwaysCalledWidth('list', 'of', 'arguments') // Must include at least these args
mySpy.neverCalledWidth('list', 'of', 'arguments') // Must not include these args, in any number of calls


/* 4. The `args` property */

// It is a 2D array.
// First dimension holds calls (each call to the function).
// Second dimension holds parameters (sent in each call).

// Ex:
const mySpy = sinon.spy(someObj, 'itsMethod')

someObj.itsMethod('hi', 'YYYY') // first call (index 0)
someObj.itsMethod('bye', 'zzzz') // second call (index 1)

expect(mySpy.args[0][1]).to.equal('YYYY')
// OR
expect(mySpy.getCall(0).args[1]).to.equal('YYYY') // using getCall()
// `args` on getCall will only accept argument index to that call.
// OR
mySpy.args[0][1].should.equal('YYYY')
// OR
mySpy.getCall(0).args[1].should.equal('YYYY')


/* 5. Catching errors thrown by a function */

try {
	/* Something involving mySpy function execution */
} catch() {}

expect(mySpy.threw()).to.be.true
// OR
mySpy.threw().should.be.true

// Other error checks:
mySpy.threw('ReferenceError') // Similarly: TypeError, etc.
mySpy.threw(anObject)
mySpy.alwaysThrew() // Can accept same params as threw(), checks for all calls
```


