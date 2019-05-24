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

// Favor `args` over `called`


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

## Stubs

**Stubs are functions (they are *spies*) with *pre-programmed behavior***

Stubs:
- Are spies: Can observe function behavior (monitor)
- They are able to also control function behavior. Ex: what the function returns
- Hence, stubs give you control

Why stub?
1. To control flow (Ex: To mock a rare occurrence) 
2. To prevent undesirable behavior (Ex: Prevent payment)

```javascript
/* WAYS TO DEFINE A STUB */

/* 1. Anonymous stub */
const myStub = sinon.stub()

/* 2. Stub an existing function */
sinon.stub(someObj, 'itsMethodToStub')

/* 3. Stub all functions of an object */
// Only works for stubs (not spies)
sinon.stub(someObj)

// It is better to mock out individual functions. More control.
```

```javascript
/* WAYS TO USE STUBS */

/* 1. Fake the return value */
const pluralSight = sinon.stub().returns('PluralSight') // return any value (obj/arr/fn/etc.)

/* Fake return value based on params sent to function */
myStub.withArgs('string').returns('PluralSight')
myStub.withArgs('number').returns(1)
myStub('string') // 'PluralSight'
myStub('number') // 1
myStub('random') // undefined

/* Fake return value based on call number */
myStub.onCall(0).returns(true)
myStub.onCall(1).returns(false)
myStub.returns('maybe')
myStub() // true
myStub() // false
myStub() // 'maybe'
myStub() // 'maybe'

// Complex Example: Return true on the second call when the arg is 1, else false
myStub.withArgs(1).onCall(1).returns(true)
myStub.returns(false)
myStub() // false
myStub(2) // false
myStub(1) // false
myStub(1) // true


/* 2. Handling promises that are returned by original function */
const myStub = sinon.stub(someObj, 'methodReturningAPromise').resolve({ resolved: data })
// Can use the .resolves() method on a stub to fake a promise returning the resolved data
const myStub = sinon.stub(someObj, 'methodReturningAPromise').rejects({ resolved: data })
// Can use the .rejects() method on a stub to fake a promise returning the rejected response
.rejects() // Rejects with an error
.rejects(value) // Rejects with a value (i.e passed to catch function) MORE USEFUL.

// Complex examples:
myStub.withArgs({ id: 1 }).rejects({ err: 'Already exists' })
myStub.resolves(2)
// Rejects only if first param has prop id = 1, else resolves with 2


/* 3. Restoring a function that was stubbed */
// When we have to stub a function in multiple test cases, we get the following error:
// TypeError: Attempting to wrap a function that is already wrapped.
// The first stub wraps the function, and subsequent stubs try to wrap a stub function.
// That is not allowed.
// Therefore, we must restore a function to original state before wrapping it again.
sinon.stub(obj, 'someMethod') 
// ... 
obj.someMethod.restore()
// It's a good idea to clean up your stubs in `afterEach` of mocha test runner


/* 4. Additional returns: */
// A. Throw errors:
myStub.throws() // throws can take in a value (ex: an object) to pass on as error
// B. Call your own function instead of original:
myStub.callsFake(yourFunction) // yourFunction is called everytime the stubbed funcion is invoked
// Use sparingly
// C. Extend sinon stubs with .addBehavior()
sinon.addBehavior('functionName', someFunction)
myStub.functionName('arguments', 'to', 'someFunction')
```

**Spies versus Stubs:**

1. Spies monitor behavior (What is called, what is returned, what is passed, etc) - It does not alter the function.
2. Stubs perform whatever action you want for a particular function - alters it. Use when controlling the flow or preventing some undesirable behavior.
