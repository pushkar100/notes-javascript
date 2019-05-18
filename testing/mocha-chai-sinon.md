# Mocha, Chai, & Sinon Short Notes
[Mocha, Chai, and Sinon Cheatsheet](https://gist.github.com/yoavniran/1e3b0162e1545055429e#chai)
[BDD style assertions: expect/should](https://www.chaijs.com/api/bdd/)
[Chai as promised](https://www.chaijs.com/plugins/chai-as-promised/)
[Sinon JS](https://sinonjs.org/)

```javascript
// MOCHA

// Install: npm install mocha --save
// Install globally as well: npm install -g mocha

// Run mocha runs all tests (.js files) in test folder (not recursive): `mocha`
// Run mocha from a particular folder & recursively inside it: `mocha './tests/**/*.test.js'`

// NPM Script:
// test: "mocha './tests/**/*.test.js'"

// The basic nodejs assertion library:
var assert = require('assert')

// Simple setup:
describe('<description>', function() {
	it('<description>', function() {
		assert.equal(param1, param2);
	})
})

// Nested describes to get more specific:
describe('...', function() {
	describe('...', function() {
		it('...', function() {
			assert.equal(param1, param2);
		})
	}) 
})

// Testing asynchronous functionality:
describe('...', function(done) {
	describe('...', function() {
		it('...', function() {
			// An example callback:
			setTimeout(function() {
				assert.equal(param1, param2);
				done();
			});
		})
	}) 
})

// Hooks:
describe('...', function() {
	beforeEach(function() {
		// runs before each test in this block
	})
	/* Also: before(), after(), afterEach() */
	describe('...', function() {
		it('...', function() {
			assert.equal(param1, param2);
		})
	}) 
})

// Exclusive tests (running only some / Isolating tests):
describe('...', function() {
	describe('...', function() {
		it('...', function() {
			assert.equal(param1, param2);
		})
		it.only('...', function() {
			assert.equal(param1, param2);
		})
	}) 
})
describe.only('...', function() {
	it('...', function() {
		assert.equal(param1, param2);
	})
	it('...', function() {
		assert.equal(param1, param2);
	})
})  // Can have multiple onlys - runs only those, ignoring everything else.


// Pending tests:
// 1. No arguments to `it`:
describe.only('...', function() {
	it('...')
}) // It will result in 'pending task in output'
// You can list "TODO" tasks in this way

// 2. Someone has broken the build and certain tests are failing:
// You don't want to comment those tests out while you work on another 
// piece of code
describe.skip('...', function() {
	it('...', function() {

	})
})
describe.skip('...', function() {
	it('...', function() {

	})
	it.skip('...', function() {

	})
})

// Setting a custom timeout on a test: 
describe.only('...', function() {
	it('...', function() {
		this.timeout(10000) // in milliseconds
	})
})
// If your test is timing out before completion (say, API data fetch is taking too long),
// you can manually set the timeout (max wait time for test to complete).
```

```javascript
// CHAI

// Install: npm install chai --save

// Writing BDD style assertions with `expect`:
var expect = require('chai').expect;

// Truthy or falsy test with `expect`:
expect(expression).to.be.true;
expect(expression).to.be.false;

// Writing BDD style assertions with `should`:
var should = require('chai').should(); // Unlike `expect`, we have to invoke `should` while requiring it.
// Should adds itself to `Object.prototype`

// Usage examples:
// something.should.be...
// something.should.equal...
// something.should.have...

var isAuth = <someOperation>
isAuth.should.be.true;

// Testing objects:
// 1. Existence of a property:
obj.should.have.property('roles');
// 2. Property should equal a value:
obj.should.have.property('roles').equal('Manager');
// 3. Checking if two objects are the same (Same reference):
objA.should.equal(objB);
// 4. Checking if two objects are equal in terms of values (deep equal):
objA.should.deep.equal(objB);

// Testing `null`:
nullObj = null
expect(nullObj).should.not.exist;
// With `should` it throws an error because `null` is not an object:
nullObj.should.not.exist // !Error (x)
// To check the existence of an object with `should`, use the following:
should.not.exist(nullObj)
// Same for undefined.

// Working with promises:
// 1. The manual way:
doSomethingAsync().then(
    function (result) {
        result.should.equal("foo");
        done();
    },
    function (err) {
       done(err);
    }
);
// 2. Using chai-as-promised library: `npm install --save chai-as-promised`
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised) // middleware
chai.should() // appends `should`` to the end of chai (after middleware)
// Mocha will allow us to return the above assertion in our test:
return somePromise.should.eventually.be.true
return somePromise.should.eventually.be.false
return doSomethingAsync().should.eventually.equal("foo") // ... etc
// More info: https://www.chaijs.com/plugins/chai-as-promised/


// Refer: https://www.chaijs.com/api/bdd/ for more usage example of expect/should
```

```javascript
// SINON - for mocking (spies, stubs, mocks)
// `npm install sinon`
var sinon = require('sinon')

// (A) Spies:
sinon.spy() // Gives us a fake function
// We can use a spy to track execution.
// Whichever function we assign it to, will return an object w/ a set of properties:
// ex: notCalled, calledOnce, etc. - which we can use to test
renderResponse(req, res) {
	res.render('Hi')
}
// ... Inside a test (`it`): ...
// mocking inputs:
req = {}
res = {
	render: sinon.spy() // making a fake function to check if it gets called
}
renderResponse(req, res);
res.render.calledOnce.should.be.true // checking if it was called only once
// You can check other info with a spy (ex: the arguments passed on first call, etc)
// For example: `console.log(res.render);` to check all the available info (props)
res.render.firstCall.args[0].should.equal('Hi')

// Use sinon.spy() to watch a function:
// Use it to track execution: sinon.spy(<object>, '<a-method-of-obj>')
sinon.spy(obj, 'objMethod')
obj.objMethod.calledOnce.should.be.true

// Spies can:
// (1) Create dummy functions or 
// (2) Wrap existing functions, 
// and provide data on their execution.

// (B) Stubs
// Sometimes watching or creating dummy functions is not enough.
// We may want to replace a function.
// sinon.stub() replaces a function: We can control its behavior directly.
// sinon.stub(<object>, '<a-method-of-obj>').returns(<value>)
var isTrue = sinon.stub(obj, 'objMethod').returns(true)
isTrue.calledOnce.should.be.true

// Make the function throw an error:
var isTrue = sinon.stub(obj, 'objMethod').throws('ReferenceError') // Pass in type of error or no param

// Role of a stub: Let's get rid of the function altogether and let's have directly control
// over what it does and what it returns.

// (C) Mocks
// Combined behavior: Fake methods (like spies), pre-programmed behavior (like stubs), and pre-programmed expectations.
// Use it whenever you have pre-programmed expectations.
// We mock an 'object'!
renderResponse(req, res) {
	res.render('Hi')
}
// ... Test: ...
var req = {}
var res = {
	render: function() {}
}
var mock = sinon.mock(res)
mock.expects('render').once().withExactArgs('index') // We are setting expections on how this object is going to be consumed.
renderResponse(req, res)
mock.verify()

// Spy: Watching methods
// Stub: Replacing methods
// Mock: For easier expectations.
```
