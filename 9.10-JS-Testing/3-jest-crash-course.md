# Jest Matchers, Async tests, & Mocking

[Coursera Link](https://www.coursera.org/learn/unit-testing-in-jest)

**Install Jest:**

- `npm i -D jest`

**Setup a basic config file (optional)**

- `npx jest --init`

- [Jest Matchers, Async tests, & Mocking](#jest-matchers--async-tests----mocking)
  * [Matchers](#matchers)
    + [Comparing numbers](#comparing-numbers)
    + [Comparing floating point numbers](#comparing-floating-point-numbers)
    + [Matching strings and arrays](#matching-strings-and-arrays)
    + [Match exceptions](#match-exceptions)
  * [Testing asynchronous code](#testing-asynchronous-code)
      - [Testing promises](#testing-promises)
    + [Testing promises using an async function](#testing-promises-using-an-async-function)
    + [Testing callbacks](#testing-callbacks)
  * [Mocking](#mocking)
      - [Mocking a function or a method of an object](#mocking-a-function-or-a-method-of-an-object)
      - [Spying on the mock](#spying-on-the-mock)
      - [Mock the return value](#mock-the-return-value)
      - [Mocking promise resolutions](#mocking-promise-resolutions)
      - [The mock property](#the-mock-property)
      - [Mocking implementations](#mocking-implementations)
      - [Mocking entire modules](#mocking-entire-modules)
    + [Timer mocks](#timer-mocks)
      - [Fast forwarding time](#fast-forwarding-time)
      - [Run only pending timers](#run-only-pending-timers)
      - [Advance Timers by Time](#advance-timers-by-time)
  * [Setup and Teardown](#setup-and-teardown)

## Matchers

1. **`toBe()`**: Use for testing equality of primitive values
   - `expect(6).toBe(6)` and the test passes
   - `expect(6).toBe(5)` and the test fails
   - `expect(true).toBe(false)` and the test fails
2. **`toEqual()`**: Use for testing equality of objects (deep equality check and not by reference)
   - `expect({ one: 1, two: 2 }).toBe({ one: 1, two: 2 })` will make the test fail (reference is different)
   - `expect({ one: 1, two: 2 }).toEqual({ one: 1, two: 2 })` will make the test pass
3. **`.not.`**: Use to contradict (opposite of) the matcher
   - `expect(6).not.toBe(6)` and the test fails
   - `expect(6).not.toBe(0)` and the test passes
4. **`toBeTruthy()`** & **`toBeFalsy()`**: Use when you want to test the truthiness or falsiness of a value, respectively
   - `expect(6).toBeTruthy()` and the test passes
   - `expect(null).toBeFalsy()` and the test passes
   - `expect({ one: 1 }).toBeTruthy()` and the test passes
   - `expect(1).toBeFalsy()` and the test fails
5. **`toBeUndefined()`**: Use it to match `undefined`
   - `expect(6).toBeUndefined()` and the test fails
   - `expect(undefined).toBeUndefined()` and the test passes
6. **`toBeDefined()`**: Use it to match any defined value
   - `expect(6).toBeDefined()` and the test passes
   - `expect(undefined).toBeDefined()` and the test fails
   - `expect(0).toBeDefined()` and the test passes
7. **`toBeNull()`**: Use it to match `null`
   - `expect(6).toBeNull()` and the test fails
   - `expect(null).toBeNull()` and the test passes

### Comparing numbers

8. **`toBeGreaterThan()`**
   - `expect(7).toBeGreaterThan(6)` and the test passes
   - `expect(7).toBeGreaterThan(7)` and the test fails
   - `expect(7).toBeGreaterThan(8)` and the test fails
9. **`toBeGreaterThanOrEqual()`**
   - `expect(7).toBeGreaterThanOrEqual(6)` and the test passes
   - `expect(7).toBeGreaterThanOrEqual(7)` and the test passes
   - `expect(7).toBeGreaterThanOrEqual(8)` and the test fails
10. **`toBeLessThan()`**
    - `expect(7).toBeLessThan(6)` and the test fails
    - `expect(7).toBeLessThan(7)` and the test fails
    - `expect(7).toBeLessThan(8)` and the test passes
11. **`toBeLessThanOrEqual()`**
    - `expect(7).toBeLessThanOrEqual(6)` and the test fails
    - `expect(7).toBeLessThanOrEqual(7)` and the test passes
    - `expect(7).toBeLessThanOrEqual(8)` and the test passes

### Comparing floating point numbers

Due to an error in the IEEE standard used, the floating point numbers have minor error margins when we perform arithmetic on them. Therefore, you cannot use `toBe()` for floating point numbers as this could result in a false negative for our testing purposes (i.e 0.1 + 0.2 might be 0.3000234 and `toBe()` will fail but it does not matter to us

12. **`toBeCloseTo()`**: Matches numbers that are close enough in value such that floating point discrepancies are not taken into account
    - `expect(0.1 + 0.2).toBeCloseTo(0.3)` and the test passes
    - `expect(0.1 + 0.2).toBeCloseTo(0.4)` and the test fails

### Matching strings and arrays

13. **`toMatch()`**: Matches a string. Can take either a string or a regular expression to test the string against
    - `expect('The sky is blue!').toMatch('blue')` and the test passes
    - `expect('The sky is blue!').toMatch('bloe')` and the test fails
    - `expect('The sky is blue!').toMatch(/blue/)` and the test passes
14. **`toContain()`**: Matches a string (substring) or matches an element of an array
    - `expect(['red', 'blue', 'orange']).toContain('blue')`and the test passes
    - `expect(['red', 'blue', 'orange']).toContain('violet')`and the test fails
    - `expect('The sky is blue!').toContain('blue')` and the test passes
    - `expect('The sky is blue!').toContain('bluge')` and the test fails
    - Alternate: 
      - **`toContainEqual()`**: Matches an element of an array with `==` (i.e only by value)
      - Use it to test any non-primitive values contained as an element of an array (i.e objects)
      - `expect([1, 2, { a: 5 }]).toContain({ a: 5 })` and the test passes

### Match exceptions 

When errors are thrown (either through a `throw` statement or a `try..catch` construct) inside a function, we can test for it in the following way

15. **`toThrow()`**: Checks if the executed function in expect throws an error. It can optionally take a string or a regular expression to match the error message as well!
    - `expect(() => { throw new Error() }).toThrow()` and the test passes
    - `expect(() => { throw new Error('Cannot find JDK') }).toThrow(/JDK/)` and the test passes
    - `expect(() => { throw new Error('Cannot find JDK') }).toThrow(/something/)` and the test fails
    - In older Jest versions, the erroring function was expected to be wrapped in another function before asserting. Like so:
      - `expect(() => { () => { throw new Error() } }).toThrow()` and the test passes

## Testing asynchronous code

#### Testing promises

We have to do two things:

* **Return** a promise from the test as well! This notifies Jest that it needs to wait for a Promise (asynchronous code)
  * If you don't return a promise, the test will pass without asserting anything (i.e without waiting for async stuff to happen) and that's a problem (*false positive*)
* Make our assertions inside the `then` / `catch` clauses

Additionally, to be really specific (and to avoid certain errors), you can mention the number of assertions you are going to make at the top of the test with **`expect.assertions(<number>)`**

Example:

```js
// Testing a successful promise:
const promise = () => Promise.resolve({ count: 50, title: 'number of hits' })

test('testing a promise resolve', () => {
    expect.assertions(2)
    return promise().then(data => {
        expect(data.count).toBe(50)
        expect(data.title).toMatch(/hits/)
    })
})
// The test will pass
```

```js
// Teting a failing promise:
const promise = () => Promise.reject({ message: 'Cannot find count' })

test('testing a promise reject', () => {
    expect.assertions(2)
    return promise().catch(error => {
        expect(error).toBeTruthy()
        expect(error.message).toContain('count')
    })
})
```

### Testing promises using an async function

We can also test promises by keeping marking our test callback as an **`async` function**. We *do not* need to return a promise in this case, asserting with expect statements is enough!

Example:

```js
// Success case:
const promise = () => Promise.resolve({ message: 'count is 50' })

test('testing a promise resolve', async () => {
    expect.assertions(1)

    const data = await promise()

    expect(data.message).toContain('count is 50')
})
```

```js
// Failure case:
const promise = () => Promise.reject({ message: 'system error' })

test('testing a promise reject', async () => {
    expect.assertions(1)

    try {
        const data = await promise()
    } catch(e) {
        expect(e.message).toContain('system error')
    }
})
```

### Testing callbacks

The old way of testing asynchronous code, especially callbacks, was to use the **`done` parameter** to the test function. If this parameter exists, then Jest waits for it to be invoked (`done()`)

- If `done` is not invoked, the test fails
- If any assertion fails, i.e throws, before `done` is invoked, the test fails
- If all the assertions pass and then `done` is also invoked, the test passes

You might use a fake or custom callback to test if callback was called!

```js
const foo = (cb) => setTimeout(() => cb(100), 50) 

test('testing asynchronous code', (done) => {
    const localcb = (data) => {
        expect(data).toBe(100)
        done()
    } 

    foo(localcb)
})
```

## Mocking

***Mocks are useful to "fake" an external dependency you cannot control (but must assert)***. You can spy on the dependency, change it's body, return value, resolved value, and so on!

#### Mocking a function or a method of an object

1. Use `jest.fn()` to mock any function!

2. Use `jest.fn(() => /* code */)` to mock any function and override it's body!

Example:

```js
const mockCallback = jest.fn(x => 42 + x);
mockCallback(4) // returns 46
```

#### Spying on the mock

1. `toHaveBeenCalled()` tests if the mocked function was called
2. `toHaveBeenCalledTimes(<number>)` tests if the number of times the mocked function was called matches the value passed in
3. `toHaveBeenCalledWith(<args>)` tests if the mock was called with the passed in arguments

Example:

```js
const mockCallback = jest.fn(x => 42 + x);
mockCallback(4) // returns 46

expect(mockCallback).toHaveBeenCalled()
expect(mockCallback).toHaveBeenCalledWith(4)

mockCallback(8) // returns 50

expect(mockCallback).toHaveBeenCalledTimes(2)
```

#### Mock the return value

1. `mockReturnValue(<return value>)` mocks the return value for every call henceforth
2. `mockReturnValueOnce(<return value>)` mocks the return value once 

We can *chain* them and keep declaring the return values that need to be mocked! There will be a mapping between the calls and the expected mocked return value for each

```js
const myMock = jest.fn();
console.log(myMock());
// > undefined

myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

console.log(myMock(), myMock(), myMock(), myMock());
// > 10, 'x', true, true
```

#### Mocking promise resolutions

1. `mockResolvedValue(<data>)`. For any function returning a promise, we can mock its resolved values!

```js
test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});
```

#### The mock property

```js
const mockCallback = jest.fn(x => 42 + x);
[0, 1].forEach(mockCallback);

// The mock function is called twice
expect(mockCallback.mock.calls.length).toBe(2);

// The first argument of the first call to the function was 0
expect(mockCallback.mock.calls[0][0]).toBe(0);

// The first argument of the second call to the function was 1
expect(mockCallback.mock.calls[1][0]).toBe(1);

// The return value of the first call to the function was 42
expect(mockCallback.mock.results[0].value).toBe(42);
```

```js
// The function was called exactly once
expect(someMockFunction.mock.calls.length).toBe(1);

// The first arg of the first call to the function was 'first arg'
expect(someMockFunction.mock.calls[0][0]).toBe('first arg');

// The second arg of the first call to the function was 'second arg'
expect(someMockFunction.mock.calls[0][1]).toBe('second arg');

// The return value of the first call to the function was 'return value'
expect(someMockFunction.mock.results[0].value).toBe('return value');

// This function was instantiated exactly twice
expect(someMockFunction.mock.instances.length).toBe(2);

// The object returned by the first instantiation of this function
// had a `name` property whose value was set to 'test'
expect(someMockFunction.mock.instances[0].name).toEqual('test');
```

**Note:** Clear a mocked function with **`mockedFn.mockClear()`**

#### Mocking implementations

Use `.mockImplementation` method which takes in a function as the implementation

```js
it("mock implementation", () => {
  const fakeAdd = jest.fn().mockImplementation((a, b) => 5)

  expect(fakeAdd(1, 1)).toBe(5)
  expect(fakeAdd).toHaveBeenCalledWith(1, 1)
})
```

Real world example:

```js
// Code
export const fetchUser = (id, process) => {
  return fetch(`http://localhost:4000/users/${id}`)
}
```

```js
// Test
 describe('mock API call', () => {
   const user = {
     name: 'Juntao'
   }
 
   it('mock fetch', () => {
     // given
     global.fetch = jest.fn().mockImplementation(() => Promise.resolve({user}))
     const process = jest.fn()

    // when
    fetchUser(111).then(x => console.log(x))
 
    // then
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/users/111')
  })
})
```

#### Mocking entire modules

1. **Mocking node modules (3rd party)**
   - Place the mock of the module in a **`__mocks__`** folder adjacent to the `node_modules` folder in the project
   - The module is ***automatically*** mocked inside a test file (opt-out) whenever the code that requires it executes!
   - **Note:** Create React App (CRA) has an issue and the `__mocks__` folder needs to be at the top level of `src` and not adjacent to `node_modules`!
2. **Mocking custom modules**
   - Place the mock of the module in a **`__mocks__`** folder adjacent to the module itself
   - The module needs to be **explicitly mocked** at the top of your test file in Jest (opt-in) with **`jest.mock('<module-name>')`**

Example:

```
project
|
__mocks__
| |
|	axios.js
|
node_modules
| |
| axios.js
|
src
	|
	helpers
	  |
	  timeUtils.js
	  |
	  __mocks__
	  	|
	  	timeUtils.js
```

**Note:** Create React App (CRA) has an issue where mocked modules "reset" (to the original) automatically after each test! (Because of a property `resetMocks: true` in its internal jest config)

**Note:** Clear mocks with **`jest.unmock('<module-name>')`**

### Timer mocks

The native timer functions (i.e., `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`) are less than ideal for a testing environment since they depend on real time to elapse. Jest can swap out timers with functions that allow you to control the passage of time

- Enable fake timers by calling **`jest.useFakeTimers()`**. This mocks out `setTimeout` and other timer functions with mock functions.
- If running multiple tests inside of one file or describe block, `jest.useFakeTimers();` can be called *before each test manually* or *with a setup function such as `beforeEach`.* Not doing so will result in the internal usage counter not being reset.

Example:

```js
// module
function timerGame(callback) {
  console.log('Ready....go!')
  setTimeout(() => {
    console.log("Time's up -- stop!")
    callback && callback()
  }, 1000)
}

module.exports = timerGame
```

```js
// test
const timerGame = require('./timerGame')

jest.useFakeTimers()

test('waits 1 second before ending the game', () => {
  timerGame()

  expect(setTimeout).toHaveBeenCalledTimes(1)
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000)
})
```

The above test will not actually wait 1 second like it is expected to happen with the production code since we have enabled the use of fake timers that mimic the passage of time without actually waiting for it to elapse. Great feature for unit tests!

#### Fast forwarding time

This is useful for checking the before & after time lapse scenarios! Enable fake timers and use **`jest.runAllTimers()`** to run all the timers (fast forward execution of code until all timers have elapsed)

```js
jest.useFakeTimers()

test('calls the callback after 1 second', () => {
  const callback = jest.fn()

  timerGame(callback)

  // At this point in time, the callback should not have been called yet
  expect(callback).not.toBeCalled()

  // Fast-forward until all timers have been executed
  jest.runAllTimers()

  // Now our callback should have been called!
  expect(callback).toBeCalled()
  expect(callback).toHaveBeenCalledTimes(1)
})
```

#### Run only pending timers

There are also scenarios where you might have a recursive timer -- that is a timer that sets a new timer in its own callback. For these, running all the timers would be an endless loop… so something like `jest.runAllTimers()` is not desirable. For these cases you might use `jest.runOnlyPendingTimers()`:

```js
// module
function infiniteTimerGame(callback) {
  console.log('Ready....go!');

  setTimeout(() => {
    console.log("Time's up! 10 seconds before the next game starts...");
    callback && callback();

    // Schedule the next game in 10 seconds
    setTimeout(() => {
      infiniteTimerGame(callback);
    }, 10000);
  }, 1000);
}

module.exports = infiniteTimerGame;
```

```js
// test
jest.useFakeTimers()

describe('infiniteTimerGame', () => {
  test('schedules a 10-second timer after 1 second', () => {
    const infiniteTimerGame = require('../infiniteTimerGame');
    const callback = jest.fn();

    infiniteTimerGame(callback);

    // At this point in time, there should have been a single call to
    // setTimeout to schedule the end of the game in 1 second.
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    // Fast forward and exhaust only currently pending timers
    // (but not any new timers that get created during that process)
    jest.runOnlyPendingTimers();

    // At this point, our 1-second timer should have fired it's callback
    expect(callback).toBeCalled();

    // And it should have created a new timer to start the game over in
    // 10 seconds
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
  });
});
```

#### Advance Timers by Time

**`jest.advanceTimersByTime(msToRun)`**: When this API is called, all timers are advanced by `msToRun` milliseconds. 

All pending "macro-tasks" that have been queued via `setTimeout()` or `setInterval()`, and would be executed during this time frame, will be executed

Additionally, if those macro-tasks schedule new macro-tasks that would be executed within the same time frame, those will be executed until there are no more macro-tasks remaining in the queue that should be run within `msToRun` milliseconds.

```js
// module
function timerGame(callback) {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log("Time's up -- stop!");
    callback && callback();
  }, 1000);
}

module.exports = timerGame;
```

```js
// test
jest.useFakeTimers()

it('calls the callback after 1 second via advanceTimersByTime', () => {
  const timerGame = require('../timerGame');
  const callback = jest.fn();

  timerGame(callback);

  // At this point in time, the callback should not have been called yet
  expect(callback).not.toBeCalled();

  // Fast-forward until all timers have been executed
  jest.advanceTimersByTime(1000);

  // Now our callback should have been called!
  expect(callback).toBeCalled();
  expect(callback).toHaveBeenCalledTimes(1);
});
```

**Note**: Lastly, it may occasionally be useful in some tests to be able to *clear all of the pending timer*s. For this, we have **`jest.clearAllTimers()`**

## Setup and Teardown

1. `beforeEach(() => { /* ... */ })`  runs the code before every test in the same scope i.e same test file or `describe` block
2. `beforeAll(() => { /* ... */ })`  runs the code before all tests in the same scope i.e same test file or `describe` block
3. `afterEach(() => { /* ... */ })`  runs the code after every test in the same scope i.e same test file or `describe` block
4. `afterAll(() => { /* ... */ })`  runs the code before every test in the same scope i.e same test file or `describe` block

Generally, the `before*` functions are used to **setup** code that needs to be used by all of the tests in that scope and `after*` functions are used to **cleanup / teardown** the setup once the tests in that scope execute!

These hooks are *registered in the order that they appear* in the test file!

*Setup examples:* Initialise DB, factory function setup, opening file system, etc

*Clean / teardown examples*: Close DB connection, closing file system connection, etc
