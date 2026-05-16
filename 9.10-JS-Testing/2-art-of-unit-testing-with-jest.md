# Unit Testing Basics

[Link to book](https://livebook.manning.com/book/the-art-of-unit-testing-third-edition)

- [Unit Testing Basics](#unit-testing-basics)
  * [What is a unit?](#what-is-a-unit-)
    + [How many unit tests per exit point?](#how-many-unit-tests-per-exit-point-)
    + [What is a Unit Test?](#what-is-a-unit-test-)
    + [How to test each type of exit point?](#how-to-test-each-type-of-exit-point-)
    + [What is a good unit test?](#what-is-a-good-unit-test-)
    + [Unit versus Integration Testing](#unit-versus-integration-testing)
    + [Regression testing](#regression-testing)
    + [Test Driven Development (TDD)](#test-driven-development--tdd-)
  * [Writing a Unit Test](#writing-a-unit-test)
    + [Jest testing framework](#jest-testing-framework)
    + [Files executed by Jest](#files-executed-by-jest)
    + [Jest provides globals](#jest-provides-globals)
    + [Jest watch commands](#jest-watch-commands)
    + [Benefits of a testing framework](#benefits-of-a-testing-framework)
    + [Three core parts of a test](#three-core-parts-of-a-test)
    + [Good way to test a unit when NOT using TDD](#good-way-to-test-a-unit-when-not-using-tdd)
    + [Naming convention for tests](#naming-convention-for-tests)
    + [Structuring tests using describe](#structuring-tests-using-describe)
    + [Setup & teardown of state](#setup---teardown-of-state)
      - [Too much refactoring of test code](#too-much-refactoring-of-test-code)
    + [Asserting strings](#asserting-strings)
    + [Asserting errors thrown](#asserting-errors-thrown)
    + [Running only certain tests](#running-only-certain-tests)
  * [Manual Stubbing](#manual-stubbing)
    + [Types of dependencies](#types-of-dependencies)
    + [Faking dependencies](#faking-dependencies)
    + [Approaches to stubbing](#approaches-to-stubbing)
      - [Stubbing with parameter injection](#stubbing-with-parameter-injection)
      - [Stubbing function injection](#stubbing-function-injection)
      - [Stubbing with factory functions](#stubbing-with-factory-functions)
      - [Constructor injection - OOP technique](#constructor-injection---oop-technique)
        * [Injecting an object instead of a function](#injecting-an-object-instead-of-a-function)
      - [Extracting a common interface](#extracting-a-common-interface)

## What is a unit?

A **unit** **of work** is the *sum of actions* that take place between the invocation of an **entry point** up until a noticeable end result through one or more **exit points**. The entry point is the thing we *trigger*

- Function body (including other functions it calls inside the body and other side-effects) is a unit of work
  - A unit of work can be a single function, multiple functions, even a whole module or a component. It should have an entry point that can be *triggered from outside*
  - One unit of work can be made up of *smaller unit*s. Ex: A `sum()` function can invoke another function like `totalSoFar()`. Hence, both are covered in our unit test when we test sum
- Function declaration and signature is an entry point (into the body)
- The resulting output or behaviors of the function are the exit points
  - Return value
  - State change
  - Invoking an external API, also known as a *dependency* (Ex: Calling a logger module method whenever the `sum()` function is invoked)
    - Usually, we test the ***usage*** of a dependency and not the correctness of the dependency itself. That is the responsibility of the dependency owner herself

### How many unit tests per exit point?

It is ideal to keep "one unit test per exit point"! An assertion (Ex: `expect` call) can be thought of as a test of an exit point.

The reason for this is that we can provide one readable name per unit test. If the test has one exit point then we know exactly what exit point is failing. If there are multiple exit points (assertions) then it becomes harder to debug the failure. Basically, more *readable*, *simpler*, & *easier to debug outcomes*.

When we have many assertions per unit test, we run into a confusion termed as "**Assertion roulette"**. That is, in order to check which of the assertions failed, we start by commenting out assertions to eliminate and find the failing assertion.

### What is a Unit Test?

With all the information we have listed so far, we can define unit test as:

> A unit test is a piece of code that invokes a unit of work and checks one specific exit point as an end result of that unit of work. If the assumptions on the end result turn out to be wrong, the unit test has failed.

### How to test each type of exit point?

1. *Return value based exit point:* Easy. Trigger an entry point, you get something back, and you check the value you got back
2. *State based exit point:* Medium. You trigger an entry point, you do another call to check something else (or re-trigger entry point), and you check if everything went according to plan
3. *Third party based exit point:* Hard. You not only have to trigger the entry point but might have to use things like mock objects in our tests so that we can replace the dependency system with one we can control and inspect.

Try to keep return based or state based unit tests and only perform third party based tests if truly required!

### What is a good unit test?

**Problem with bad tests:**

- Wasting time debugging
- Tests do not benefit anything
- Unreadable or unclear tests that might have to be deleted later
- Very difficult to maintain

**Therefore, a good unit test:**

1. Is written in using a **testing framework** so that it is fast and can be automated. This also helps re-run the tests easily either by you or another developer in the future. Testing frameworks help **automate** and write **easily repeatable tests** (aids with regression testing)
2. It is **trustworthy**: Once a test passes, you can trust your code to work as expected! You do not have to go into code to manually re-verify it
3. It is **readable**: When a test fails, we know exactly what sort of failure it was and which part of the code caused the failure
4. It is **maintainable**: If it takes a lot of time to understand, run, or change either production code or test code due to the existing tests, it is difficult to maintain such tests and are considered bad!
5. Runs **fast** (in a matter of seconds). Because we write a lot more unit tests than any other kind, it is cheap and gives us a **faster feedback** (loop is short). This feedback allows us to perform **regression testing** (checking for existing features that break when a new feature is introduce or a bug is fixed)

**Tips for writing good unit tests:**

- Unit tests do not have any shared state. Tests are usually **isolated**. Two or more unit tests should not depend on the same state such as a list of items - (*If not controlled with reset, beforeAll, beforeEach, afterEach, afterAll and so on*) - the tests affect one another and result is unpredictable
- Unit tests **do not depend on external code**.
  - For example, a database connection, a server response, etc are mocked. If there are problems with a real N/W or a DB, our tests do not break!
  - Timers are faked! We want our tests to run qucikly! Unit tests are cheap and can be run multiple times!
  - Date and time are also consistent (If running a test again uses a different date or time or a random number, it's essentially a new test!)
- Unit tests usually use **in-memory** tools to aid with assertions.
  - If you work with filesystem, network, etc, you can no longer keep the state consistent
  - Therefore, unit tests prefer "in-memory abstractions" such as JSDOM which is an in-memory DOM. We can also use a headless chrome browser. With databases, we can use in-memory alternatives of a production DB.

**Note:** Writing a first unit test for a unit of work (ex: a module) might take a lot of time (~30 mins as an example). However, subsequent runs and additions to the test suite must be really quick! This is expected when you start writing unit tests.

It is a good idea to run unit tests at every commit or file save because they are so cheap and you get a faster feedback (i.e you would have written less code before identifying that there is an error)

### Unit versus Integration Testing

In integration testing, you test more than one unit of work! This type of testing is important as well because individual components might work but they do not produce the desired output when combined together. The example is that of a car where the engine might be well tested and so are the tyres. However, we need to test that the tyres make the car move when the engine is switched on and put into gear. If it does not, then the test has failed! This type of test is an integration test

Integrations tests:

1. Uses a **real network**, **real DB** (but usually not a production one but a test DB for security & protection of production data), **real timer**, etc
2. Integration tests **run slower** and hence are not run very often (ex: not run on each commit but maybe on build/CI-CD since they are expensive)
3. Integration tests run the risk of **testing too many things at once**. A test failure makes it harder to debug the exact cause of the error!
4. They **do not provide regression testing** since they use real time, N/W and DBs. These factors make each test unique and repeating a previously passing test might make it fail this time!

Integration tests are still important because they provide greater benefit to the end user and hence we must have them in our set of tests! A user is more interested in things like clicking a button fetches and displays data in a tabular form (integration or even e2e test) than he is in knowing whether passing data to a table component displays that data (unit test)

### Regression testing

Regression testing is defined as re-running functional and non-functional tests to ensure that previously developed and tested software still performs after a change.

### Test Driven Development (TDD)

**When is it a good time to write tests?**

A growing number prefer writing unit tests incrementally, during the coding session, and before each piece of very small functionality is implemented. This approach is called test-first or test-driven development (TDD).

**What does TDD do?**

TDD helps in creating quality code, quality tests, and better designs for the code

**What does TDD not do?**

It does not ensure project success or tests that are robust & maintainable. This is ensured by writing good / great unit tests (a separate skill and not TDD) regardless of whether you are using TDD or not as an approach

**Traditional approach**

1. Write a function, a class, a module, or an app
2. Write tests (if you have time)
3. Run tests (if you have time)
4. Fix bugs (If you have time)

**TDD approach**

1. ***RED: Write a failing test to prove code or functionality is missing from the end product***
   1. This phase allows one to "think" about what the piece of code is expected to do and write tests for it. Therefore, TDD will ensure your code works as expected i.e it does not fail when it's not supposed to (instead of a test of correctness i.e it cannot test every allowed input)
   2. This phase will fail if the code does not exist as well! i.e compilation error. This too is an important test - to ensure that the module exists!
2. ***GREEN: Make the test pass by adding functionality to the production code that meets the expectations of your test***
   1. The fix must be as simple as possible. Don't touch the test. Make it pass by only altering production code
3. ***REFACTOR: Refactor your code***
   1. After making a test (*or even multiple tests*) pass, one can refactor the code.
   2. **Refactoring**: It means changing a piece of code without changing its behavior i.e functionality
   3. Therefore, refactoring involves knowlege of clean coding, SOLID, DRY, YAGNI principles & design patterns.
   4. If there is no need for refactoring, you may proceed to continue TDD by adding another test (or stopping)

The above TDD approach is known as the **RED-GREEN-REFACTOR** cycle

The RED & REFACTOR phases allow for some ***design thinking*** i.e how you would architect your code!

TDD does not ensure you write the most trustworthy, maintainable, and readable tests but it helps with ***incrementally developing code with confidence*** by writing the smallest tested sub tasks first1

**Note**: Learn *Refactoring* and *Clean Code / Patterns* as separate skills. Do not learn TDD and any of these two at the same time! These are separate skills and it's better to learn them one after another

## Writing a Unit Test

### Jest testing framework

Jest is an open source testing framework created by facebook, initially to help test React components. It is now used for all sorts of JS testing

Jest is an all-in-one framework: runs tests, mocks & spies, provides test coverage, and prints reports (unlike mocha)

**Requirements:**

1. `jest.config.js` file in the root of the folder is used for configuring Jest
2. Jest can also be configured in the `package.json` file by writing its config within the `"jest": {}` object
3. Install Jest as a dev dependency: `npm i -D jest`
4. **Execute Jest** with `npx jest` or `npm run test` where the "test" script is `"test": "jest"`

### Files executed by Jest

Jest executes two types of files:

1. `*.test.js` or `*.spec.js` files anywhere under the project root folder (recursively)
2. All files inside the `__tests__` folder (at the project root) are treated as test files, irrespective of their extension

You may prefer to use either of the two approaches - just be ***consistent***! You might like to co-locate your test & code files or you might want to separate the test and code folders. However, suffixing test files with `test.js` or `spec.js` allows us to keep the option to move around the test files if needed in the future.

### Jest provides globals

We don't need to require or import the test runner, hooks, assertions, and so on. Jest provides these by default. Some of them are:

- `describe`: Creates a context for many logically related tests in a test file
  - *Syntax*: `describe("context description for tests", () => { /* nested describe blocks or individual tests */ })`
- `test` or `it`: Runs an individual test 
  - *Syntax*: `test("test name or description", () => { /* test code */ })`
  - `it` reads better than `test` when you are manually reading the test description. Otherwise, there is no difference between `test` and `it` (they are *aliases*)
- `expect`: This is an in-built assertion library that Jest provides
  - Syntax: `expect(expressionToTest).matcher(expectedValue)`
  - Ex: `expect(5).toBe(4)` will fail
- `jest`: The library object itself is provided as a global
  - Ex: `jest.mock()`, `jest.fn()`, etc
- `beforeEach`, `afterEach`, `afterAll`, & `beforeAll`: These are hooks that let us setup or tear down code before/after each or all tests.

### Jest watch commands

It is tedious to run the Jest test command everytime when you are continuously developing your code & testing it.

Jest provides a `--watch` flag to monitor test files and automatically run files that have changed without reinitialising itself every time. You can just modify and save a test file and Jest will run it when it is in the watch mode!

In order to run all the tests (not just ones that changed) in the watch mode, use the `--watchAll` flag.

```shell
# watch (Package script: "test": "jest --watch")
$ npx jest --watch

# watch all (Package script: "test": "jest --watchAll")
$ npx jest --watchAll
```

### Benefits of a testing framework

- Provides **structure** (Whenever you want to add a test , you start out in the same way - as opposed to custom testing)
- **Repeatability**: It is easy to repeat tests easily which is very valuable for unit testing (& regression testing)
- **Confidence** & **time saving**: By making it easy to write tests, we can focus on every little piece of code and have the confidence that it works

### Three core parts of a test

Every test has 3 parts:

1. ***Arrange***: Setup scenario under test
2. ***Act***: Invoke entry point with inputs
3. ***Assert***: Check the exit point (ideally one exit point per test)

This is also known as the **AAA pattern**

Example:

```js
// ...
it('has an error message based on the rule.reason', () => {
  // Arrange
  const verifier = new PasswordVerifier1()
  const fakeRule = (input) => ({ passed: false, reason: 'fake reason' })
  verifier.addRule(fakeRule)

  // Act
  const errors = verifier.verify('any value')

  // Assert
  expect(errors[0]).toContain('fake reason')
})
// ...
```

We may also choose to separate Arrange, Act, and Assert set of statements from each other by placing a *blank line* between them for clarity

### Good way to test a unit when NOT using TDD

With TDD, you will always have a failing test first and then make it pass. This makes sure that our test is not passing by accident i.e for reasons not intended

When not using TDD, however, a test written after the code has been implemented can fall into this trap where we get **false positives** i.e test passes even when it is not supposed to! This means that the test code is incorrect. How do we catch it?

We catch it by *deliberately introducing a bug* in our production code (ex: commenting out lines), watch the test fail, and then remove the introduced bug to watch the test pass again. If the test passes the first time itself i.e after introducing a bug then there is something wrong with our test code

This approach is the best in a scenario where we cannot apply TDD!

Example:

```js
// Code file
const verifyPassword = (input, rules) => {
  const errors = []
  rules.forEach((rule) => {
    const result = rule(input)
    if (!result.passed) {
      // Commented out deliberately to make test fail!
      // errors.push(`error ${result.reason}`)
    }
  })
  return errors
}
module.exports = { verifyPassword }
```

```js
// Test file
it('returns errors', () => {
  const fakeRule = (input) => ({ passed: false, reason: 'fake reason' })
  const errors = verifyPassword('any value', [fakeRule])
  expect(errors[0]).toContain('fake reason')
})
```

### Naming convention for tests

A test has to be readable & clearly explain what it is testing. It should be so good that we need not even review the test code whenever a test fails. To achieve this goal, there is a naming pattern we can use!

The **U.S.E naming** pattern:

1. **Unit of work (context / subject)**: Usually the function, module, or component name
2. **Scenario or inputs to the unit**: The use case that we are testing
3. **Expectation (behavior of exit point)**: What we expect to happen when we assert inside the test

This 3 point description of a test is very readable and descriptive. 

Example:

```js
it('verifyPassword, with a failing rule, returns errors', () => { /* ... */ })
// verifyPassword: Unit of work (context)
// with a failing rule: Scenario or inputs to the unit
// returns errors: Expectation
```

### Structuring tests using describe

`describe()` wraps our tests and provides it ***context***. We can use it to group similar or related tests (and provide them with setup functionality)

`describe()` blocks can be nested. This helps further separate out the context, scenario, and expectations

Example:

```js
describe('verifyPassword', () => { // optional
  describe('with a failing rule', () => { // optional
    it('returns errors', () => {
      const fakeRule = (input) => ({ passed: false, reason: 'fake reason' })
      const errors = verifyPassword('any value', [fakeRule])
      expect(errors[0]).toContain('fake reason')
    })
  })
})
```

`describe()` also helps pretty prints the test report. 

**Drawbacks**

- Too much nesting with multiple `describe()` blocks inside one another can be difficult to read & debug
- Can remove duplication but affect readabilty when combined with `beforeEach` and other such hooks - needs to be a balance

### Setup & teardown of state

Sometimes, every related test requires the same setup to be done before it runs. Every test might also require a reset of state after it runs so as to not affect other tests. To setup & reset state inside every test might lead to a lot of ***duplication*** and hence, unmaintainable code.

Example:

```js
it('has an error message based on the rule.reason', () => {
  const verifier = new PasswordVerifier1()
  const fakeRule = (input) => ({ passed: false, reason: 'fake reason' })

  verifier.addRule(fakeRule)
  const errors = verifier.verify('any value')

  expect(errors[0]).toContain('fake reason')
})

it('has exactly one error', () => {
  const verifier = new PasswordVerifier1()
  const fakeRule = (input) => ({ passed: false, reason: 'fake reason' })

  verifier.addRule(fakeRule)
  const errors = verifier.verify('any value')

  expect(errors.length).toBe(1)
})
// ...
```

There is a lot of duplication in the above code snippet. 

* We can use `beforeEach` / `afterEach` or their less useful cousins, `beforeAll` & `afterAll` to setup and teardown state before/after each or all the tests run.
* These hooks are also **scoped** not only to the test file but also to a describe block if they are placed inside it!
* They are **registered in the order they appear** (i.e top to bottom)

Example:

```js
describe('v4 PasswordVerifier', () => {
  let verifier
  beforeEach(() => (verifier = new PasswordVerifier1()))
  
  describe('with a failing rule', () => {
    let fakeRule, errors
    beforeEach(() => {
      fakeRule = (input) => ({ passed: false, reason: 'fake reason' })
      verifier.addRule(fakeRule)
    })
    
    it('has an error message based on the rule.reason', () => {
      errors = verifier.verify('any value')

      expect(errors[0]).toContain('fake reason')
    })
    
    it('has exactly one error', () => {
      const errors = verifier.verify('any value')

      expect(errors.length).toBe(1)
    })
  })
})
```

#### Too much refactoring of test code

While nested describe blocks & the before/after hooks allow you to write minimally duplicated code, it can also lead to **"scroll fatigue"**. While it's easy for a report to be made to look nice with these elements, it becomes harder for a developer to check each unit test

Ideally, we would like to have the arrange, act, and assert (all) to be self contained inside a unit test (i.e `test` or `it ` block) because it makes it easier to read and understand what is the setup and how we are asserting it.

On the flip side, however, if the setup or act is too complex then it makes sense to abstract it into a hook or at the top because it's again a duplication and a readabilty issue!

Too much abstraction takes out the ability to write unit tests that contain all the core information leading us to scroll between the describe block top, beforeEach hooks, and the test itself. The information is not contained in the test alone! Context is missing inside the test.

Therefore, there needs to be a **balance** between *removing duplication* & *readabilty of a test* for a developer

**Alternate approach using factory methods**

Instead of putting everything inside a hook such as `beforeEach` we can write **setup utility functions (factory methods)** at the top (of either the file or the block) and provide them with **meaningful names**. In this way, we invoke these functions from inside a test so it preserves context due to the meaningful names but also removes complicated duplication from each test (keeping only the invocation as a duplication)

Note that while production code might require really good abstractions, testing code requires some amount of easily human readable context in each test and therefore, *slightly lesser abstraction than production code*

Example of setup functions:

```js
const makeVerifier = () => new PasswordVerifier1();
const passingRule = (input) => ({ passed: true, reason: '' });

const makeVerifierWithPassingRule = () => {
  const verifier = makeVerifier();
  verifier.addRule(passingRule);
  return verifier;
};

const makeVerifierWithFailedRule = (reason) => {
  const verifier = makeVerifier();
  const fakeRule = input => ({passed: false, reason: reason});
  verifier.addRule(fakeRule);
  return verifier;
};

describe('v8 PasswordVerifier', () => {
  describe('with a failing rule', () => {
    it('has an error message based on the rule.reason', () => {
      const verifier = makeVerifierWithFailedRule('fake reason');
      const errors = verifier.verify('any input');
      expect(errors[0]).toContain('fake reason');
    });
    it('has exactly one error', () => {
      const verifier = makeVerifierWithFailedRule('fake reason');
      const errors = verifier.verify('any input');
      expect(errors.length).toBe(1);
    });
  });
  describe('with a passing rule', () => {
    it('has no errors', () => {
      const verifier = makeVerifierWithPassingRule();
      const errors = verifier.verify('any input');
      expect(errors.length).toBe(0);
    });
  });
  describe('with a failing and a passing rule', () => {
    it('has one error', () => {
      const verifier = makeVerifierWithFailedRule('fake reason');
      verifier.addRule(passingRule);
      const errors = verifier.verify('any input');
      expect(errors.length).toBe(1);
    });
    it('error text belongs to failed rule', () => {
      const verifier = makeVerifierWithFailedRule('fake reason');
      verifier.addRule(passingRule);
      const errors = verifier.verify('any input');
      expect(errors[0]).toContain('fake reason');
    });
  });
});
```

In the above example, we have two factory methods with meaningful names, `makeVerifierWithPassingRule` and `makeVerifierWithFailedRule`.

Each test contains the arrangement (Ex: `const verifier = makeVerifierWithFailedRule('fake reason');`) which is readable and preserves the context. 

Each tests also has the act and assert parts making it a completely self-contained test from a readability perspective (no scroll fatigue)

Additionally, we have also structured our code with some describe blocks. Therefore, this test suite has achieved that fine balance between duplication and readability

This does not mean that `beforeEach` is useless. Sometimes, we must use it but keep in mind the *balance* and why we need it!

### Asserting strings

While testing primitives, we can test them using the equality matcher (`toBe`) which checks for strict equality. 

Example: `expect(true).toBe(true)`

While testing strings too we can use either `toBe` or something like `toMatch`. However, this is not a good idea! Strings are *visible to the user* as information and it can be considered a *part of the UI*. Anything that is UI is subject to change over time and exactly matching strings is not recommended!

We must **test only the core part of the string** that we want to be there! For example, a mesage can be "Entered invalid password" today and later it can be changed to "You have provided an invalid password". If we match the entire string in our test, it becomes very brittle and fails everytime the string is changed even for minor changes like adding or removing a space!

Therefore, make our tests **less brittle** by identifying the core part of the message (ex: "invalid passwor") and test only for that! Jest provides the **`toContain()`** matcher for this purpose!

Ex: `expect('Entered invalid password').toContain('invalid password')` 

We can also provide a ***regex*** to `toMatch` to do the same thing:

Ex:  `expect('Entered invalid password').toMatch(/invalid password/)` 

### Asserting errors thrown

The unit of work might have a flow where it is expected to throw an error! How do you test this?

We test it by using the **`toThrowError`** matcher. Inside it, we can specify an exact string or a regex for the error message. Other similar matchers exist for catching specific types of errors

Note that we must invoke the error throwing function from inside another function in our `expect` assertion

Example:

```js
expect(() => verifier.verify('any input')).toThrowError(/no rules configured/);
```

### Running only certain tests

Jest has no in-built categorisation of tests that help us run them separately. For example, run only unit or integration tests

However, jest provides us with a regex matcher (**`testRegex`** property) to match test paths & names. This can be used to run tests partially! We can use the `-c` jest-cli flag to run a specific file as the config file

```js
// jestintegration.config.js
var config = require('./jest.config')
config.testRegex = "integration\\.js$"
module.exports = config
```

 ```js
 // package.json "scripts" object
 {
   "test": "jest --watch",
   "testintegration": "jest -c jestintegration.config.js"
 }
 ```

```js
// jest.config.js
module.exports = {
  verbose: true,
}
```

```shell
# Run command to run integration tests only
npm run testi
# Runs on tests files with suffix "integration.js"
# Ex: player.integration.js
```

## Manual Stubbing

Not every testable unit is self-contained. It may call other code, especially 3rd party libraries or code maintained by other teams. In this case, we don't have control over how such code behaves. Such external things we rely on are called ***dependencies***. They make it harder to isolate and test our code that uses them

### Types of dependencies

- **Outgoing dependencies**: Represent an *exit point* (that is asserted). The philosophy is that of "fire and forget". You perform an action and check whether an external API is invoked, that's it, this is our assertion! Examples include calling a logger module function, saving data to a DB, notifying an API... these are all verbs: "sending", "invoking", "notifying", etc.
- **Incoming depdencies**: Dependencies that are *not* exit points and therefore not asserted but only used to setup the test. Example: DB query results, contents of a file on system, N/W response, etc. 

Some dependencies can be both incoming and outgoing. 

### Faking dependencies

To preserve ***consistency*** of a test i.e the same test with same data and state when it is run again without changing production or test code, should give the same output as it did during the previous run

In order to achieve consistency, we need to have **control** over the dependency. Without control, tests can be *"flaky"* i.e they might fail due to external factors such as server crash, DB failure, a real timer providing a different time everytime the test runs, etc

We achieve control over a dependency by substituting its code with a "**fake**" code that returns predictable output that we can use in our test to maintain consistency. It is also known as a **"test double"**. Examples include writing a getDay function that always returns Sunday, having a server response hardcoded, and so on. Fakes are light-weight and predictable implementations of the real dependency

**There are two types of fakes**

- **Stubs**: Fake the *incoming dependencies* (ones that are not asserted as an exit point). We can have as many stubs as we want in our test
- **Mocks**: Fake the *outgoing dependencies* (ones that are asserted as exit points). We usually have one mock per test since testing one exit point per test is a good idea

### Approaches to stubbing

We can use the test framework to stub a dependency **OR** we can:

- Not use a test framework functionality, and
- Manually refactor production code to be able to **inject a dependency**

**Dependency injection** is basically a fancy refactoring term that means sending a dependency through an interface! This interface can be a function parameter, an API of a class or module, etc. The point at which we inject the dependency is called the *injection point / seam*

Dependency injection allows us to perform **"inversion of control"** where the responsibility of creating the dependency internally is removed and is then provided externally to a unit of work. It is a good refactor and helps in writing more functional programming style "pure" code that is maintainable

Example:

```js
// passwordVerifier
const moment = require('moment')
const SUNDAY = 0,
  SATURDAY = 6

const verifyPassword = (input, rules) => {
  const dayOfWeek = moment().day()
  if ([SATURDAY, SUNDAY].includes(dayOfWeek)) {
    throw Error("It's the weekend!")
  }
  //more code goes here...
  //return list of errors found..
  return []
}

module.exports = {
  verifyPassword,
}
```

In the above code,

- We use `moment` as a date & time library (dependency)
- It throws an error if we try to verify password on a weekend (do not question why :D)

Therefore, 

* Testing this function is difficult
* How can we ensure that `moment` always returns the time we want. For example, our test for weekend will not run if we test it on a weekday and vice-versa (inconsistent)
* This is a good enough reason to stub out the dependency! There are many ways to do it manually!

#### Stubbing with parameter injection

Instead of creating a `moment` `dayOfWeek` inside the `verifyPassword` function, we can pass it the value as a parameter. In this way, the user of this code has the responsibilty to create such a day of the week but the `verifyPassword` function itself becomes isolated and easily testable!

```js
// module
// Notice that it does not require 'moment.js'
const SUNDAY = 0,
  SATURDAY = 6

const verifyPassword = (input, rules, dayOfWeek) => {
  if ([SATURDAY, SUNDAY].includes(dayOfWeek)) {
    throw Error("It's the weekend!")
  }
  //more code goes here...
  //return list of errors found..
  return []
}

module.exports = {
  verifyPassword,
}
```

```js
// test
const { verifyPassword } = require('../password-verifier-time-00')
const SUNDAY = 0,
  SATURDAY = 6,
  MONDAY = 2

describe('verifyPassword', () => {
  test('on weekends, throws exceptions', () => {
    expect(() => verifyPassword('anything', [], SUNDAY)).toThrowError(
      "It's the weekend!"
    )
  })
})
```

Our test can easily invoke `verifyPassword` with the same day all the time!

#### Stubbing function injection

Instead of passing a value, we can also pass in a function that gives you that value, as a parameter. This gives you the flexibility of faking the function itself instead of faking the value.

In production code too, this method of dependency injection is also useful because it allows for extensibility. We can create different functions that provide different types of dependencies

Example:

```js
// module
const SUNDAY = 0,
  SATURDAY = 6

const verifyPassword = (input, rules, getDayFn) => {
  if ([SATURDAY, SUNDAY].includes(getDayFn())) {
    throw Error("It's the weekend!")
  }
  //more code goes here...
  //return list of errors found..
  return []
}

module.exports = {
  verifyPassword,
}
```

```js
// test
const { verifyPassword } = require('../password-verifier-time-00')
const SUNDAY = 0,
  SATURDAY = 6,
  MONDAY = 2

describe('verifyPassword', () => {
  test('on weekends, throws exceptions', () => {
    const alwaysSunday = () => SUNDAY
    expect(() => verifyPassword('anything', [], alwaysSunday)).toThrowError(
      "It's the weekend!"
    )
  })
})
```

Using function injection is also a great way to *enable special behavior* such as simulating special cases or exceptions into your code under test.

#### Stubbing with factory functions

A factory function is essentially a *higher order function* that returns another function usually with some *context*. A very simple example of adding two numbers using an HOC is given below:

```js
function addTo(input1) {
  return function(input2) {
    return input1 + input2
  }
}

// addTo is the HOF
const addToFive = addTo(5)
addToFive(3) // 8
addToFive(5) // 10

// The HOF acts like a factory function!
```

The factory functions allow us to ***pre-configure context*** using closure mechanism and repeat it for multiple uses.

Therefore, instead of passing a data value or a function to our module function, we can convert the module function itself into an HOF:

```js
// module
const SUNDAY = 0,
  SATURDAY = 6

// The function returns another function which takes input
// But the returned function is pre-configured to use the rules & getDayFn supplied to the HOF
const makeVerifier = (rules, getDayFn) => (input) => {
  if ([SATURDAY, SUNDAY].includes(getDayFn())) {
    throw Error("It's the weekend!")
  }
  //more code goes here...
  //return list of errors found..
  return []
}

module.exports = {
  makeVerifier,
}
```

The ***benefits*** of using a factory function:

1. ***The HOF (factory) acts like the "Arrange" part of our test***
2. ***The returned function acts like the "Act" part of our test***

If you like this pattern, use it!

```js
// test
const { makeVerifier } = require('../password-verifier-time-00')
const SUNDAY = 0,
  SATURDAY = 6,
  MONDAY = 2

describe('makeVerifier', () => {
  test('on weekends, throws exceptions', () => {
    // Arrange:
    const alwaysSunday = () => SUNDAY
    const verifyPassword = makeVerifier([], alwaysSunday)

    // Act (& assert)
    expect(() => verifyPassword('anything')).toThrowError("It's the weekend!")
  })
})
```

#### Constructor injection - OOP technique

If you or the team are comfortable with Class or OOP based programming more than FP, you may wish to have a class with a constructor for implementing functionalities!

In this technique, a constructor can basically act as the HOF i.e pre-configure another method by preserving the context

- The **Arrange** part is now the constructor invocation with the `new` keyword
- The **Act** part is the method invocation
- The **added benefit** of this method is:
  - We can initialize our class only *once* for a suite of similar tests!
  - For this purpose, we can use a factory function in our test suite or describe block (this is different from a HOF / factory function stubbing! It is purely a separate utility function!)
  - Makes our test code *abstracted* but still *preserves context inside the test for readability*

```js
// module
const SUNDAY = 0,
  SATURDAY = 6

class PasswordVerifier {
  constructor(rules, getDayFn) {
    this.rules = rules
    this.getDayFn = getDayFn
  }

  verify(input) {
    if ([SATURDAY, SUNDAY].includes(this.getDayFn())) {
      throw Error("It's the weekend!")
    }
    //more code goes here...
    //return list of errors found..
    return []
  }
}

module.exports = {
  PasswordVerifier,
}
```

```js
const { PasswordVerifier } = require('../password-verifier-time-00')
const SUNDAY = 0,
  SATURDAY = 6,
  MONDAY = 2

describe('PasswordVerifier', () => {
  // The factory function utility method (not the same as HOF / factory fn. stub)
  const makeVerifier = (rules, dayFn) => new PasswordVerifier(rules, dayFn)

  test('on weekends, throws exceptions', () => {
    // Arrange:
    const alwaysSunday = () => SUNDAY
    const verifier = makeVerifier([], alwaysSunday)

    // Act (& assert)
    expect(() => verifier.verify('anything')).toThrowError(
      "It's the weekend!"
    )
  })

  test('on weekends, throws exceptions', () => {
    // Arrange:
    const alwaysMonday = () => MONDAY
    // The factory fn. utility makes it easier to arrange
    // & is readable (meaningful / declarative)
    // across many tests that require this arrangement
    const verifier = makeVerifier([], alwaysMonday)

    // Act (& assert)
    const result = verifier.verify('anything')
    expect(result.length).toBe(0)
  })
})
```

##### Injecting an object instead of a function

If you would like to pass in an object and not a function, you can do that too! The object will be faked! However, the structure of the object is matched with the expected object inside production code only at runtime of the test code (drawback)

***The benefit***:

- You get to abstract out the dependency creation allowing it to reused and better maintained!
- You can mock not just the functionality but also the module containing the dependency itself. This is as close as it can get to mocking a whole external module without using the framework's capabilities for the same
- It is generally a good refactor!

```js
// real-time-provider (A possible real implementation of a time provider)
import moment from 'moment'

const RealTimeProvider = () => {
  this.getDay = () => moment().day()
}

module.exports = {
  RealTimeProvider,
}
```

```js
// module
const SUNDAY = 0,
  SATURDAY = 6

class PasswordVerifier {
  constructor(rules, timeProvider) {
    this.rules = rules
    this.timeProvider = timeProvider
  }

  verify(input) {
    if ([SATURDAY, SUNDAY].includes(this.timeProvider.getDay())) {
      throw Error("It's the weekend!")
    }
    //more code goes here...
    //return list of errors found..
    return []
  }
}

module.exports = {
  PasswordVerifier,
}
```

```js
// test
const { PasswordVerifier } = require('../password-verifier-time-00')

const SUNDAY = 0,
  SATURDAY = 6,
  MONDAY = 2

function FakeTimeProvider(fakeDay) {
  this.getDay = function () {
    return fakeDay
  }
}

describe('PasswordVerifier', () => {
  test('class constructor: on weekends, throws exception', () => {
    // Arrange:
    const sundayTimeProvider = new FakeTimeProvider(SUNDAY)
    const verifier = new PasswordVerifier([], sundayTimeProvider)

    // Act & Assert
    expect(() => verifier.verify('anything')).toThrow("It's the weekend!")
  })
})
```

#### Extracting a common interface

If you want to pass in an object and maintain the structure of the fake object during testing so that it is caught at compile time itself, use **typescript** (i.e an interface)

Both the production and test code will implement (`implements`) the interface for the dependency and test fake for it, respectively. The errors or mismatches are caught immediately at build i.e compile time without waiting for tests to run!

There are many other good reasons to use Typescript as well, google them!
