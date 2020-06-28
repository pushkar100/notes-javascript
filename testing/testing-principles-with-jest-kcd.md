# Testing

[Frontend Masters: Testing Principles by KCD](https://frontendmasters.com/courses/testing-practices-principles)

## Types of bugs

1. Security errors

2. Integration errors

4. Memory leaks
5. Off by 1 errors
6. Race conditions
7. Null pointer exceptions (Regression errors)
8. Internalization errors
9. User Interface errors
10. Accessibility (A11y)
11. Business logic errors
12. Scaling 
13. Performance
14. i18n, and so on...

## How to prevent bugs?

1. Use static type checkers: Flow or Typescript (Cannot catch logic errors)
2. Linting: ESLint (Cannot catch logic errors)
3. Testing: Unit, Integration, E2E, Acceptance, Regression, Performance, Penetration, A11y, stress testing, etc

## What is a Javascript Test?

[Link to blog post](https://kentcdodds.com/blog/but-really-what-is-a-javascript-test)

**A test is code that throws an error when the actual result of something does not match the expected output.**

It is relatively easy to test "pure functions" as compared to those that depend on state (ex: components in React, DOM, etc)

**The part that says `actual !== expected` is called an "assertion."** 

One of the most important parts of testing frameworks (or assertion libraries) is how helpful their error messages are. 

Node has [an](https://nodejs.org/api/assert.html#assert_assert) [`assert`](https://nodejs.org/api/assert.html#assert_assert) [module](https://nodejs.org/api/assert.html#assert_assert)

## Format of a test function

```js
// Example of test function
test("<title>", () => {
  // arrange
  // act
  // assert
}
     
// An example of how test suite would run the above test:
expect(sum(3, 7)).toBe(10)
```

## Fundamentals of an assertion library 

```js
const sum = (a, b) => a - b
const subtract = (a, b) => a - b


test('Sum must add numbers', () => {
  expect(sum(3, 7)).toBe(10)
})

test('Subtract must subtract numbers', () => {
  expect(subtract(7, 3)).toBe(4)
})

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`)
      }
    },
  }
}

function test(title, callback) {
  try {
    callback()
    console.log(`👌PASSED: ${title}`)
  } catch (e) {
    console.log(`❌ERROR: ${title}`)
    console.error(e)
  }
}
```

- Test is something that throws an error if there is a *bug*. 

- A good test is one which helps you identify where that bug lives and how to fix it.

When you are picking a testing framework, think a lot about the error messages that people are going to see when tests error out and how the framework helps them fix it.

## Jest framework

1. Use `test(title, cb)` or `it(title, cb)` to write a single test
2. Use `describe(title, cb)` to encapsulate/wrap/categorize a bunch of similar tests (`cb` will contain `test`/`it`)
3. You may skip a test execution by adding `skip` property to it. For example, this snippet will skip the test titled "A test": `test.skip('A test', () => {})` 

**Expect:**

1. Primitives:

   1. `expect(actual).toBe(expect)` does a `===` or `Object.is`. Therefore, primitives will match but two different objects, even if they have the same props and values, will not match

2. Objects and arrays:

   1. `expect(actual).toEqual(expect)` will do a value check similar to `lodash.isEqual` so we can match two objects or arrays if they have the same key-value pairs or set of values, respectively
   2. `expect(actual).toMatchObject(expect)` will take the expected object and check if it is a "sub-object" of the actual object. That is, it does partial matching of key-value pairs. If object `actual` covers `expect` only then will the test pass
   3. `expect(actual).toHaveLength(expect)` checks for the length of an array. It can even be used on an object containing the `length` property

3. Function calls:

   1. `expect(fn).toHaveBeenCalled(<num>)` will check if the function `fn` was called
   2. `expect(fn).toHaveBeenCalledTimes(<num>)` will check if the `fn` was called `<num>` times
   3. `expect(fn).toHaveBeenCalledWith(<args>)` will check if the `fn` was called with the `<args>` set of arguments (comma separated)

4. Relational operations:

   1. `expect(actual).toBeGreaterThan(expected)`
   2. `expect(actual).toBeLessThan(expected)`

5. Truthy or falsy:

   1. `expect(actual).toBeTruthy()` checks if `actual` is a truthy value
   2. `expect(actual).toBeFalsy()` checks if `actual` is a falsy value

6. More detailed equals:

   1. `expect(actual).toEqual(value)` can be used to match values (similar to `toBe`)

   2. But, it can also be used to match complex objects with a "schema"

      ```js
      const bday = {
        day: 18,
        month: 10,
        year: 1988,
        meta: {
          display: 'Oct 18th, 1988'
        }
      }
      
      const schema = {
        day: expect.any(Number),
        month: expect.any(Number),
        year: expect.any(Number),
        meta: {
          display: expect.stringContaining('1988')
          // can also have 'arrayContaining', 'objectContaining', etc
        }
      }
      
      expect(bday).toEqual(schema)
      ```

## Mocks in Jest

Sometimes we don't want to call the original function but just mock it. For example, function that does an API call. In such cases we "mock" our function with input and output and use it to test another function that is supposed the call the original (unmocked) function

1. We can mock a function with **`jest.fn()`** (Ex: `const myFn = jest.fn()`)
2. We can call that function like any other normal function `myFn()`
3. The mock function has a property mock that contains data about itself `myFn.mock`
4. `myFn.mock.calls` contains information regarding the last time the mocked function was invoked
5. `myFn.mock.calls[<num>]` contains info about the `<num>`th function call (Ex: `const first = myFn.mock.calls[0]`)
6. `first[<num>]` will contain the `<num>`th argument to the call. Ex: `firstArg = first[0]`, `secArg = first[1]`

## An important principle of testing

When you are writing a test, the more it resembles the *way in which that piece of code is going to be used* by the consumer, the more confidence we have in our test! This is true for for any level of testing

The consumer need not always be an end user. For example, if you are writing a library or a utilities file, the consumer is the developer who uses your library - so the *test must be with respect to how the consumer is going to use your code*

## Process of testing (writing a test)

When you write a test, there is a chance that your assertions do not run. This is especially true for ***asynchronous code*** (such as waiting on an API) and ***conditionals***. Some or none of the assertions can run in this case (which does not throw an error) or the assertions that didn't execute were meant to catch bugs that still exist

*Option 1*

Jest provides a method `expect.assertions(<num>)` that you can place at the top of your `test` or `it` callback to mention how many assertions must execute. It will fail the test if the assertions executed does not match the number

It is tedious to write the method for every test and change it whenever the number of assertions change

***Option 2 (Recommended)***

Break your tests! 

This is a core philosophy of ***TDD (Test-Driven Development)***. When we break our tests, we know that the test *can* fail, and then proceed to make it pass. If we don't do this, we will not know in what cases our tests fail or if they fail at all!

How to break a test?

1. Break the assertions in the test and then aftet it fails, correct the assertions and check for a passed test

   Ex: If `expect(isPasswordAllowed('')).toBe(false)` is the correct assertion then initially you'd want to have the opposite with `.not` operator like so:`expect(isPasswordAllowed('')).not.toBe(false)`

2. Alternatively, you can break the source (code, not the test) first and check that the assertions fail! After confirming this, you can restore the source and wait for a passed test (Breaking the source can be simple as returning `true` instead of a condition - an example)

   Ex: `isPasswordAllowed() { return /*someChecks*/ }` will become `isPasswordAllowed() { return true || /* someChecks */ }` and your already listed assertions will make sure it fails

**Benefit of TDD**

- You write the test first (Before writing the code to be tested or before it is complete)
- Our test is guaranteed to fail initially in this scenario
- Now we will complete our code and we can see a passing test if all is fine!
- By having a test first, we never had to worry about *false positives*. That is, our tests passing all the time without executing all the assertions
- You just know that you are testing the right thing!

**Not using TDD?**

If you write the source first, you may not reveal the bug! Now you cannot verify that the bug was fixed since your tests are bound to pass the first time with a bug-free source

**How many assertions per test?**

*Answer*: As many as you think are needed. This is because in Jest the error mapping is very good! Even if you have 30 assertions for a test and one of them fails, it is able to pin point in which assertion did the test fail! For example, if 4th assertion among 10 assertions of a test failed, Jest will tell show us that it was the 4th one

In older testing frameworks, the error to assertion mapping was not very good so they had conventions such as "one assertion per test" but it is not needed now with newer and better testing frameworks like Jest

## Creating test factories

When we have to test multiple cases, our assertions (`expect` expressions) increase and this could be a readability issue. Also, we want to refactor the code so that we don't manually specify every test but generate the tests on the fly while using sensible names.

*Refactoring goals:*

- Organize similar tests. Solution: Use `describe` block
- Generate the tests and assertions on the fly. Use normal javascript refactoring for it
- Even though the tests are generated, make sure error messages are specific enough!

*Problem:*

```javascript
test('isPasswordAllowed only allows some passwords', () => {
  expect(isPasswordAllowed('')).toBe(false)
  expect(isPasswordAllowed('fffffffff')).toBe(false)
  expect(isPasswordAllowed('fad')).toBe(false)
  expect(isPasswordAllowed('abc@123.cc')).toBe(true)
})

// We have to manually specify each of the assertions - adding another assertion does not become very evident, visibly!
```

*Solution:*

```javascript
describe('Test isPasswordAllowed util', () => {
  // 1. Organizing our tests inside describe block.
  
  const allowedPasswords = ['abc@123.cc']
  const disallowedPasswords = ['', 'fad', 'fffffffff']

  // 2. Generating tests on the fly
  allowedPasswords.forEach((pwd) => {
    // 3. Keeping test messages specific (i.e displaying the password input)
    test(`"${pwd}" must be allowed`, () => {
      expect(isPasswordAllowed(pwd)).toBe(true)
    })
  })

  disallowedPasswords.forEach((pwd) => {
    test(`"${pwd}" must not be allowed`, () => {
      expect(isPasswordAllowed(pwd)).toBe(false)
    })
  })
})
```

**Therefore, creating test factories helps us *scale* our tests well and keep them organized!** (Important)

## Async tests

For testing asynchronous code such as promises and async/await, our `test` callback can be `async` and we can then `await` on the (promise returning) module that is being tested:

```javascript
test("example test on an async method", async () => {
  // ...
  const asyncModule = await someAsyncModule
  // ...
})
```

## Where should we place our tests?

There are two methods:

1. Place them as close to the file or module being tested as possible with a naming convention of `*.spec.js` or `*.test.js` (Works well for unit tests)
2. Place them in a `__tests__` folder (Works well for integration, e2e tests). We can have multiple `__tests__` folder

Both approaches are subjective. People choose either of them based on their opinions. 

Kent C Dodds prefers (1) which he refers to as [***colocation***](https://kentcdodds.com/blog/colocation)

## Monkey Patching and Mocking

**The need for mocking**

We need to test certain functions that have dependencies. An example of this would be a case where you are testing a higher level function such as a `greeting` method and it uses a utility method `getTime` to decide if the greeting should be a . We need not test the dependency i.e utility function but can mock it to return a pre-decided value

When we mock our utility method, we are confining our test to the function in focus. It helps our tests abstract away the correctness of dependent functionality (which is not what we are interested in)

APIs are generally mocked in functions that use them. For example, you may want to test a payment functionality but using the production payment SDK is not very wise. In such a case, mocking what the API returns and using that to test our functionality is a wise move

**Monkey Patching**

In this method, we do the following:

- Change the dependency of a function before invoking the function itself (mutation/reassignment)
- Execute the assertion on the function
- Reinstate the original dependency 

```javascript
// An example of mocking the utils.getWinner() method 
// which is a dependency of the function we want to test:
// thumbWar()

import thumbWar from '../thumb-war'
import * as utils from '../utils'

test('returns winner', () => {
  // 1. Save the original dependency (unmocked function)
  const originalGetWinner = utils.getWinner

  // 2. Mutate/reassign the dependency such that consumer will
  // it instead of the original
  utils.getWinner = (p1, p2) => p2

  // 3. Run the assertions
  const winner = thumbWar('Ken Wheeler', 'Kent C. Dodds')
  expect(['Ken Wheeler', 'Kent C. Dodds'].includes(winner)).toBe(true)

  // 4. Swap the modified dependency with the original one
  // so that we clean up after our test
  utils.getWinner = originalGetWinner
})
```

We can also have a `mock` property on the function that holds some metadata. This closely resembles how production testing frameworks, such as jest, will contain the mocked data

```javascript
utils.getWinner = (...args) => {
    utils.getWinner.mock.calls.push(args)
    return args[1]
}
utils.getWinner.mock = {
  calls: [],
}
// ...
expect(utils.getWinner.mock.calls).toHaveLength(2)
utils.getWinner.mock.calls.forEach((args) => {
    expect(args).toEqual(['Ken Wheeler', 'Kent C. Dodds'])
})
// ...
```

**Drawbacks with Monkey Patching**

- If the dependency function signature changes (ex: parameters change or are added), we need to update our monkey patch too! Tight coupling.
- If we are monkey patching exports of a module, in ES6 module it actually fails when we reassign that module (live binding only work with module bundlers (?))

Jest and other testing frameworks provide us a better mocking mechanism

**Spying on object properties with Jest**

We can achieve the same mocking result using **`spyOn`** provided by Jest. It is within the library and lets us mock properties of an object

We don't have to do any monkey patching ourselves, but use the tools for it provided by Jest

```javascript
const myObject = {foo: () => 'bar'}
jest.spyOn(myObject, 'foo')
myObject.foo.mockImplementation(() => 'not-bar')
myObject.foo() === 'not-bar' // true

// ...later:
myObject.foo.mockRestore()
myObject.foo() === 'bar' // true
```

When you do `jest.spyOn(myObject, 'foo')`, Jest _wraps_ the existing function in a function of its own. It will continue to call that underlying, original function (unless we mock it)

We mock the wrapped method using `mockImplementation`. This will give us the `mock` property with `calls` on the wrapped method. To restore the original function in the mock, use `mockRestore`

Full example:

```javascript
import thumbWar from '../thumb-war'
import * as utils from '../utils'

test('returns winner', () => {
  // replace these lines with a call to jest.spyOn and
  // call to mockImplementation on the mocked function (See hint #1)
  jest.spyOn(utils, 'getWinner')
  utils.getWinner.mockImplementation((p1, p2) => p2)

  const winner = thumbWar('Ken Wheeler', 'Kent C. Dodds')
  expect(winner).toBe('Kent C. Dodds')
  expect(utils.getWinner.mock.calls.length).toBe(2)
  utils.getWinner.mock.calls.forEach((args) => {
    expect(args).toEqual(['Ken Wheeler', 'Kent C. Dodds'])
  })

  // replace the next two lines with a restoration of the original function
  // (See hint #2)
  utils.getWinner.mockRestore()
})
```

**Drawbacks of `spyOn`**

Monkey patching and `spyOn` are insufficient because of the following reason: If you mock a function from an import namespace (Ex: `import * as utils from './utils'`) then it will not work with the ES6 spec for modules as they cannot be modified in a namespace import!

**Using `jest.mock`**

`jest.mock()` solves the namespace import problem for us. When we mock something (not spy on it), jest does two things:

- Creates a parallel module (first argument) for the module being mocked 
- Whatever is returned from the function (second argument) is treated as the export object of the parallel module

The benefit of this approach is that we _do not alter the original module and its exports_. Therefore, this will not cause any issues with the ES6 module spec. 

The actual mocking of the function (second argument) happens with `jest.fn()` so that we may access the mock object on it

```javascript
jest.mock('../utils', () => {
  return {
    getWinner: jest.fn((p1, p2) => p2), // jest.fn takes a callback that mocks the original
  }
})
```

Another point is that mocks are generally created separately instead of instantiating them for every test since they are essentially modules of their own.

**Q:** How is Jest able to do this? 

**A:** Jest takes control of the module system. Whenever you import something in a test, it checks if a mock for that test is available and if that is the case, replaces the import with the mock

We don't need `spyOn` when using a `jest.mock`

Modifying only certain properties using `require.requireActual` inside the `jest.mock` function:

```javascript
jest.mock('../utils', () => {
  const actualUtils = require.requireActual('../utils')
  return {
    ...actualUtils,
    getWinner: jest.fn((p1, p2) => p2),
  }
})
```

**Clearing the state of a mock**

When multiple tests use the same mock, the state of the mock is not cleared between tests. In such a case, we will run into issues if we are testing for things like how many times the mocked function was called, etc. 

In order to clear the state of a mock, we can invoke`utils.getWinner.mockClear` inside every test, before we make the assertions. However, this can be tedious and to only write it once, we should place it inside the `beforeEach` method that runs automatically prior to every test run

```javascript
beforeEach(() => {
	utils.getWinner.mockClear()
})
```

**Keeping mocks in a directory**

The above approach for mock creates it only for the test file inside which it is defined in. This is a drawback as the same mock cannot be shared between different test files (not following DRY)

In order to make shareable mocks, Jest provides us with **`__mocks__`** directory. It is a convention where you place all your mocked modules in. The rules are simple:

- Create a `__mocks__` directory within the same folder as the original module
- Inside the `__mocks__` folder, create a duplicate module of the original and export the functionality that you want to override

Jest will check the imports in the test, find its mock file and use it if it exists. Inside the file, you will place the same `jest.mock('/path/to/original/module')` without the second argument

```shell
Parent folder
|
|-- utils.js
|-- __mocks__
    |-- utils.js
|-- __tests__
```

```javascript
// __mocks__/utils.js:
export const getWinner = jest.fn((p1, p2) => p2)
```

```javascript
// Inside a test file:
jest.mock('../utils') 
// Jest does not receive mock function (2nd arg) so 
// it will search for the mock inside the corresponding __mocks__ directory
```

**Unmocking**

Inside a test file, we might want to use the original module. **`jest.unmock(./module/to/unmock)`** will do the trick

**Optimal mocking strategy**

Mock an entire module instead of monkey patching for many reasons, one of which we have seen earlier (modules)

**Minimize mocking**

Mocking isolates function from its dependency for the purpose of testing. However, our users do not mock code. Other developers and teams do not mock our code. Hence, we will also need contract testing apart from mocked tests to make sure functions and dependencies work together (**integration tests**)

Sometimes an API is not ready so you will mock it. When it does become ready, you will want to test its integration with your functionality

Mostly mocking will be required for lower level tests (unit tests) but probably not for higher tests. Also, if you are testing locally and not in a pipeline, you'd want to be completely offline (no dependency on network) and hence, mocking becomes important. _A pure unit test is one that mocks all dependencies and only tests the function in question_

## Test object factories

Objects of the same or similar kind will be needed in multiple tests. It might require us to set it up everytime we need to mock it. Hence, instead of repeating ourselves, we can create a *function* that returns the *object* we want to utilize.

We avoid duplication of code by creating a helper method

Example:

```javascript
function setup(/* args */) {
  // ...
  return {
    // methods
  }
}

// ...

const obj = setup() // & now we can mutate the object for the needs of the test
```

## Test Driven Development (TDD)

It's a mechanism to enhance your workflow. Steps that are followed in TDD:

1. RED
2. GREEN
3. REFACTOR (and then loop back to 1. RED)

**RED**

Write some code (test and source) that makes your test fail. Write as little as possible such that it can be quickly tested and it fails

**GREEN**

Once test has failed, write as little source code as possible (logic) in order to make the test pass

**REFACTOR**

Refactor either the source code or test or both to a nice state (principles). This should resemble something that is shippable. Now, this change must be tested via the RED-GREEN-REFACTOR cycle again. 

After refactoring, you break the test (source or test code) and then fix it and test to make sure it passes. If not futher refactoring is necessary, you ship the code

### Benefits of TDD

- Makes the code more reliable in the long run
- Ship code with less bugs (more confidence)
- We can commit the suite of tests into our code repo to give us continued confidence

The one drawback would be that _it takes a lot of time to write tests_. However, the short term cons are overshadowed by the long term gains of TDD

### Where should we use and not use TDD?

TDD is a pretty good place in ***units tests*** that deal with _smaller, pure functions_

TDD is not a very good approach when it comes to ***UI tests*** because it's a little bit harder and tricky. Especially if you aren't certain what you want things to look like, it's not a good idea to use TDD

### Readme Driven Development (RDD)

This might be an alternative to TDD. Useful when you have a clear vision of what you want the feature to look like:

- You document what you want first
- Then write the tests for it
- Finally, write the implementation (source)
