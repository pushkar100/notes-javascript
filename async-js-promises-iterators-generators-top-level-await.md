# Asynchronous JavaScript

Book: Modern Asynchronous JavaScript (Faraz K Kelhini) (2021)  [Drive link](https://drive.google.com/file/d/1PjcqbvgpuVe-hNMDR_z2GBqmAa1pKe-l/view?usp=share_link)

- [Asynchronous JavaScript](#asynchronous-javascript)
  * [Is JS single-threaded?](#is-js-single-threaded-)
  * [Does async JS need to have multiple threads?](#does-async-js-need-to-have-multiple-threads-)
  * [Interactivity with events](#interactivity-with-events)
  * [Early examples of async code](#early-examples-of-async-code)
  * [Callbacks and their drawbacks](#callbacks-and-their-drawbacks)
  * [Promises](#promises)
  * [Fetch API](#fetch-api)
  * [The then method](#the-then-method)
  * [Quickly creating a settled promise](#quickly-creating-a-settled-promise)
  * [Two ways to handle rejection](#two-ways-to-handle-rejection)
    + [How catch method works](#how-catch-method-works)
  * [Executing promises one by one](#executing-promises-one-by-one)
  * [Executing promises concurrently](#executing-promises-concurrently)
  * [Creating custom iterators](#creating-custom-iterators)
    + [Need for custom iterators](#need-for-custom-iterators)
    + [Requirements](#requirements)
  * [Iterable vs iterator](#iterable-vs-iterator)
  * [Custom sync iterators](#custom-sync-iterators)
    + [Using for of loop to iterate quickly](#using-for-of-loop-to-iterate-quickly)
    + [The default iterator of a native object](#the-default-iterator-of-a-native-object)
  * [Custom async iterators](#custom-async-iterators)
    + [Building an async iterator](#building-an-async-iterator)
    + [Real world benefits of async iterators](#real-world-benefits-of-async-iterators)
    + [Using for await of loop to iterate quickly](#using-for-await-of-loop-to-iterate-quickly)
    + [Error handling with for await of loop](#error-handling-with-for-await-of-loop)
    + [Other examples of async iterators in the real world](#other-examples-of-async-iterators-in-the-real-world)
  * [Detecting if an object is iterable](#detecting-if-an-object-is-iterable)
  * [Generators](#generators)
    + [Custom sync generator](#custom-sync-generator)
      - [Using for of loop with a generator](#using-for-of-loop-with-a-generator)
    + [Custom async generator](#custom-async-generator)
    + [Real world example of async generator](#real-world-example-of-async-generator)
  * [Promise.all](#promiseall)
  * [Drawbacks of Promise.all](#drawbacks-of-promiseall)
  * [Promise.allSettled](#promiseallsettled)
  * [Promise.any](#promiseany)
  * [Promise.race](#promiserace)
    + [Using Promise.race to set a time limit on async tasks](#using-promiserace-to-set-a-time-limit-on-async-tasks)
    + [Using Promise.race to run a fixed number of async batch processes](#using-promiserace-to-run-a-fixed-number-of-async-batch-processes)
    + [Using Promise.race to run computationally intensive tasks](#using-promiserace-to-run-computationally-intensive-tasks)
  * [AbortController API to cancel pending async requests](#abortcontroller-api-to-cancel-pending-async-requests)
    + [Canceling event listeners with AbortController](#canceling-event-listeners-with-abortcontroller)
    + [Real world use cases of abort controller](#real-world-use-cases-of-abort-controller)
  * [Waiting for promises in another module using top level await](#waiting-for-promises-in-another-module-using-top-level-await)

## Is JS single-threaded?

Not really.

JS earlier used to be single threaded. The core JS still is. However, with the introduction of web workers, you can have multiple threads in a single web browser.

Other environments have similar APIs for multithreading.

## Does async JS need to have multiple threads?

No.

Async programming is about managing tasks in a single thread in such a way that you do not wait for a task to complete to start another.

Multithreading in JS is more about the number of workers you can spawn to do different tasks. Ex: Run computationally intensive process in the background.

## Interactivity with events

JS was built to add interactivity to websites. To enable this, it uses an events mechanism.

Pros:
* Adds interactivity
* Easy to listen to events on one element: Through handlers

Cons
* Cannot always register a handler before the event occurs
* Handling multiple events is difficult. Ex: Finding the loading status of a set of images (need to add a handler for each) and the order of the load is not easy

## Early examples of async code

* setTimeout(callback, time)
* Ajax calls (XMLHttpRequest)

## Callbacks and their drawbacks

JS has callbacks as a process to execute code from a function when something completes.

Drawbacks:
1. There can be nesting of callback functions:
	* Attempts to chain actions but is not manageable code
	* Not flexible enough. An inner callback is called by the outer one.

The above drawback is called "Callback hell"

```js
function firstFunction() {function foo() {
  // ...
  function bar() {
    // ...
    function baz() {
      // ...
    }
  }
}
```

We can make it slightly more maintainable by defining the functions separately ("Shallow") but the problem of chaining them still exists

```js
function foo() {
  // ...
  bar()
}

function bar() {
  // ...
  baz()
}

function baz() {
  // ...
}
```

Advantages:
2. Still useful when you want to execute a single function multiple times. Ex: Callback to the setInterval() method

## Promises

 Promises are good because:
 1. They can be easily chained. i.e No callback hell
 2. We can execute multiple promises in parallel, combine results, chain next set of actions based on resolved value, etc. Flexible

They do have a drawback:
1. A promise resolves / rejects (executes) only one. For repeat invocations, it is not the ideal use case. (Ex: callbacks for setInterval are better than promisifying them)

## Fetch API

Fetch API is the perfect example of a useful Promise to fetch data from files over the network.

Benefits:
1. Simpler API than the complex AJAX request
2. Returns a promise

```js
const promise = fetch('https://www.google.com')
```

## The then method

Promise provides a `.then()` method. 
It takes two optional parameters:
1. Function for success which receives the result / fulfillment object
2. Function for failure which receives the error object

* A promise in the pending state is termed as "Unsettled"
* A promise that is "settled" is either: fulfilled or rejected
* A settled promise can never go back to pending i.e promise executes only one
* A settled promise cannot switch between fulfilled and rejected states

```js
const promise = fetch('https://www.google.com')

promise.then(result => {
  // fulfilled
}, error => {
  // rejected
})
```

## Quickly creating a settled promise

We can use **static** methods:
1. `Promise.resolve(value)`
2. `Promise.reject(value)`

These methods provide us a way to use a pre-defined settlement status and value to a given promise.

```js
const resolvedPromise = Promise.resolve(10)

// Defining the error callback is useless. 
resolvedPromise.then(value => {
  console.log(value)
})
```

```js
const rejectedPromise = Promise.reject('Error!')

// Defining the success callback is useless. 
rejectedPromise.then(null, (error) => {
  console.log(error)
})
```

When is a pre-defined promise useful?
* When testing code and you need a settled promise with a particular status and value

## Two ways to handle rejection

1. `new Promise().then(resolveCallback, rejectCallback)`
2. `new Promise().then(resolveCallback).catch(rejectCallback)`

We can use a chained `catch()` handler to handle errors in the promise. When the interpreter encounters an *error in the promise*, it ***skips*** all the chained `then()` methods and executes the first `catch()` it finds.

```js
const promise = Promise.reject('Error!');

promise.then((value) => {
  // this won't be executed
  console.log('Hi!');
}).then((value) => {
  // this won't be executed either
  console.log('Hi again!')
}).catch((error) => {
  console.log(error);
});
```

### How catch method works

The `catch()` method and the `rejectCallback` of the `then()` method are ***NOT interchangeable***.

Only `catch()` can handle an error that occurs in the previously chained `then()` method.

> The rejection handler in the then() method cannot handle errors that occur in the fulfillment handler

Example:
```js
const promise = Promise.resolve(10);

promise.then((value) => {
  throw new Error();
}, error => {
  // This will not be executed
  console.log('rejectCallback')
}).catch((error) => {
  // This executes!
  console.log('catch')
  console.log(error);
});

// catch
// Error <object>
```
## Executing promises one by one

This is simple. You chain the promises.
This does ***not*** involve nesting like in callbacks

```js
new Promise().then(() => {
  // ...
  return new Promise().then(() => {}) 
  // Since we are explicitly returning a promise, 
  // we can chain a then() or catch() and expect to 
  // handle the settlement case of this new promise
  // Otherwise, the promise fulfills with undefined (no explicit return)
}).then(() => {
  // ...
}).catch(() => {
  // ...
})
```

## Executing promises concurrently

1. `Promise.race()` – lets you know as soon as one of the given promises either fulfills or rejects
2. `Promise.allSettled()` – lets you know when all of the given promises either fulfill or reject
3. `Promise.all()` – lets you know as soon as one of the given promises rejects or when all of them fulfill
4. `Promise.any()` – lets you know as soon as one of the given promises fulfills or when all of them reject

`Promise.race` & `Promise.all`: Since ES2015 (ES6)
`Promise.allSettled` & `Promise.any`: Since ES2020 and ES2021, resp.

Each of these take as input an array of promises (`[]`).

## Creating custom iterators

### Need for custom iterators

Iterating over a collection is one of the basic functionalities in a languages. In-built collections which are iterated upon are arrays, objects, Set, Map, etc. These are also synchronous

Why do we need custom iterators? 
Answer: We need them to process new types of collections.

The iteration can be of two types:
1. Synchronous. Ex: Processing customer order information stored in an in-memory list one by one.
2. Asynchronous. Ex: Process async data available via web APIs such as stock prices. We cannot keep operations sync only in such a case.

Iterators browser support: ES2015 (ES6+)

### Requirements

Support for the following:
1. Async functions
2. `for await...of` loops (Node 10+)
3. `async` and `await` keywords (Node 7.6+)

## Iterable vs iterator

**Iterable** 
An object which allows its values to be looped over a `for..of` loop.

How does it do so? 
The `for...of` makes use of a method of the iterable whose key is `Symbol.iterator`. 
This method should be able to generate any number of iterators.

Simple definition:
`iterable`  - any object that has  `[Symbol.iterator]`  function that returns an  `iterator`

**Iterator**
An object that’s used to obtain the values to be iterated.

Simple definition:
`iterator`  - any object that has  `next`  function to return the next "value" & "done" status

> Remember, to be classified as an iterable, an object must come with a Symbol.iterator property and specify the return value for each iteration.

## Custom sync iterators

Let us take an example to convert an object into an iterable (since it contains the [Symbol.iterator] method) to return an object with a next function which in turn return an object with `value` and `done` properties (iterator).

Syntax tip:
```js
[Symbol.iterator]() { // Makes object an iterable
	// ...
	
	return { // This is an iterator since it contains next()
	
		next() {
			// ...
			return {
				value, // Also known as the YIELDED VALUE
				done // Boolean to indicate there is nothing more to iterate
			}
		}
	}
}
```

Example:
```js
const myObj = {
  a: 10,
  b: 20,
  c: 30,
  [Symbol.iterator]() { // Makes myObj an iterable
    const collection = this; // Custom extra step: need reference to object in next()
    
    const keys = Object.keys(collection);
    let i = 0;
    
    // Returns an iterator
    return { 
      next() {
        return {
          value: collection[keys[i++]],
          done: i > keys.length
        }
      }
    }
  }
}

const myObjIterator = myObj[Symbol.iterator]();

console.log(myObjIterator.next());
console.log(myObjIterator.next());
console.log(myObjIterator.next());
console.log(myObjIterator.next());

// Output:
// {value: 10, done: false}
// {value: 20, done: false}
// {value: 30, done: false}
// {value: undefined, done: true}
```

### Using for of loop to iterate quickly

Using the `next()` method provides you with fine-grained control and it verbose.
* You can stop at every step i.e every time you invoke `next()`
* You can read the value and done results

If you want to ***quickly iterate*** over an object with a custom iterator, use `for...of`:

```js
for (let value of myObj) {
  console.log(value)
}

// Result:
// 10
// 20
// 30
```

> `[Symbol.iterator]()` works like any other method except that it’s automatically called if we use `for...of` on the object

![Interaction of for of loops with iterables and iterators](https://i.imgur.com/xZ4PXyi.png)

### The default iterator of a native object

What happens when we use for...of to iterate over a native object that’s already iterable, like an array? Calling `[Symbol.iterator]()` on an array will return the result of the `values()` method because that’s the default iterator of arrays

* Arrays' in-built iterator: `Array.values()`
* Maps' in-built iterator: `Object.entries()`

**Note:** Regular objects `{}` do not have a default iterator! Using `for..of` on them results in an error i.e runtime error)

These in-built methods are all *synchronous* iterators. To deal with asynchronous iterators, we *must* come up with custom ones!

## Custom async iterators

### Building an async iterator

The differences with a synchronous iterator are:
1. We use the **`Symbol.asyncIterator`** method instead
2. The `next()` returns a **promise** instead of a plain object (This promise resolves to the object containing `value` and `done` properties)

> Typically, a sync iterator returns an object containing a next() method. With each call to `next()`, a `{value, done}` pair is returned with the value property containing the yielded value. Similarly, an async iterator returns an object containing a `next()` method. But rather than a plain object, `next()` returns a promise that fulfills to `{value, done}`

```js
const myObj = {
  a: 10,
  b: 20,
  c: 30,
  [Symbol.asyncIterator]() { // Makes myObj an asyn iterable
    const collection = this; // Custom extra step: need reference to object in next()
    
    const keys = Object.keys(collection);
    let i = 0;
    
    // Returns an iterator
    return { 
      next() {
	    // Returns a promise!
        return new Promise(resolve => {
          setTimeout(() => { // Used just to mimic an async op
            resolve({
              value: collection[keys[i++]],
              done: i > keys.length
            })
          }, 1000);
        });
      }
    }
  }
}

const myObjAsyncIterator = myObj[Symbol.asyncIterator]();

myObjAsyncIterator.next().then(result => {
  console.log(result); // {value: 10, done: false}
});

myObjAsyncIterator.next().then(result => {
  console.log(result); // {value: 20, done: false}
});

myObjAsyncIterator.next().then(result => {
  console.log(result); // {value: 30, done: false}
});

myObjAsyncIterator.next().then(result => {
  console.log(result); // {value: undefined, done: true}
});
```

### Real world benefits of async iterators

We already know that built-in collections can only perform synchronous iterations. Therefore, we need a custom async iterator for anything async.

Generally, we need it when:
* Perform async operation in parallel i.e non-blocking fashion, but
* Process the results of the operation in order i.e one-by-one

Real world example would be this:
Consider you have an array of URLs you want to fetch and process. Since it is an array, we cannot use the in-built iterator (`values()`) since it will only provide the stored URLs.

We can build a custom sync iterator but fetching the URLs is an async operation (with `fetch()`) so this will not work too!

Hence, we can build a custom async iterator! (Fetch URLs when we invoke `next()`. We can stack up `next` calls but internally, the async operations to fetch will be happening independently and we have the option to process them in order)

```js
const myURLs = [
  'https://eloux.com/async_js/examples/1.json',
  'https://eloux.com/async_js/examples/2.json',
  'https://eloux.com/async_js/examples/3.json',
];

myURLs[Symbol.asyncIterator] = function() {
  let i = 0;
  
  return {
    // Note: async function is an alternative to returning a Promise
    // Externally, it still returns a promise
    async next() {
      if (i === myURLs.length) {
        return {
          done: true
        }
      }

      let response = await fetch(myURLs[i++]);

      if (!response.ok) {
        throw new Error('Unable to fetch!');
      }

      return {
        value: await response.json(),
        done: false
      }
    }
  }
}

const myURLsAsyncIterator = myURLs[Symbol.asyncIterator]();

myURLsAsyncIterator.next().then(result => {
  console.log(result.value.firstName); // John
});

myURLsAsyncIterator.next().then(result => {
  console.log(result.value.firstName); // Anna
});

myURLsAsyncIterator.next().then(result => {
  console.log(result.value.firstName); // Peter
});

myURLsAsyncIterator.next().then(result => { 
  console.log(result); // { done: true }
});
```

### Using for await of loop to iterate quickly

Similar to the `for...of` loop to iterate quickly and automatically over values, we can use the **`for await...of`** loop for asynchronous iterators.

**Note:** 
* `for...of` loop does not work with async iterables
* `for await...of` can only be used in contexts where [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) can be used

As with `for...of`, the `for await...of` loop will continue until `done` has a value of `true`

```js
(async function() {
	for await (const url of myURLs) {
		console.log(url.firstName);
	}
})();

// John
// Anna
// Peter
```

### Error handling with for await of loop

It is common practice to use a `try...catch` block:
```js
(async function() {
	try {
		for await (const value of collection) { /*...*/ }
	} catch (error) {
		console.error('Caught: ' + error.message);
	}
})();
```

> An interesting aspect of iterators is that they are infinite. For instance, you may have a Fibonacci iterator that delivers an infinite sequence

### Other examples of async iterators in the real world
* Working with web APIs that provide paginated data
* Fetching images from a photo sharing website and optimizing them. Ex: Flicker provides an API to fetch images. It is not good to fetch all of them at once and optimize them. Fetching them one-by-one is super time consuming. Instead, we can fetch a small number each time using a generator, process them, and then call `next()` to do the same on the next batch of images.

## Detecting if an object is iterable

Make sure that the type of `[Symbol.iterator]` and `[Symbol.asyncIterator]` object properties are functions.
```js
function isIterable(object) {
  return typeof object[Symbol.iterator] === "function";
}

console.log(isIterable({ a: 10, b: 20 })); // false
console.log(isIterable([1, 2, 3])); // true
```

```js
function isAsyncIterable(object) {
  return typeof object[Symbol.asyncIterator] === "function";
}
```

## Generators

Generators enable us to ***avoid the hassle of coding an iterator***.

In fact, they provide us with a ***shortcut way of easily creating iterators***. 

That is already enough reason to use generator functions. Additionally, since they are functions, we can do other things in them.

What this means:
> **Every generator is an iterator but not vice-versa!**

Generators are a type of function. Like iterators, they have been available since ES2015 (ES6+). We need Node 4+ or a Babel plugin.

![Generator function](https://i.imgur.com/iCDkwzd.png)

A generator function:
1. Is marked with a `function*` prefix
2. Does not execute immediately when invoked:
	a. It returns a special iterator object with a `next()` method
3. We execute a generator function's body by invoking `next()` 
	a. With each iteration, i.e calling `next`, the `yield` keyword inside the function halts exection and "yields" the value provided
	b. Yielding the value is nothing but returning an object like `{value, done}` just like in an iterator
	c. `done` is true whenever there is nothing to yield. That is, when the function executes to completion.

### Custom sync generator

We can replace an iterator with an generator for our `[Symbol.iterator]` method.

```js
const myObj = {
  a: 10,
  b: 20,
  c: 30,
  [Symbol.iterator]: function* () { // Represents a generator function
      // Internally using a for in to get the object keys
      for (let key in this) {
          yield this[key]; // Super simple! 
      }
  } 
}

const generator = myObj[Symbol.iterator](); // Returns a special iterator: generator object

console.log(generator.next()) // {value: 10, done: false}
console.log(generator.next()) // {value: 20, done: false}
console.log(generator.next()) // {value: 30, done: false}
console.log(generator.next()) // {value: undefined, done: true}
```

#### Using for of loop with a generator

Since a generator function invokes a special kind of iterator, we can use it with a `for..of` loop as well! (Just like you would nay iterator)

```js
for (let value of myObj) {
    console.log(value)
}

// 10
// 20
// 30
```

### Custom async generator

An async generator is *a combination of*:
1. An async function (`async`)
2. A generator function (`function*`)

We can replace an async iterator with an async generator for our `[Symbol.asyncIterator]` method

Similar to a (sync) generator, it returns a special type of async iterator on invocation. 

Since it is an async function, it should automatically resolve a promise when we `yield`

```js
const myURLs = [
  'https://eloux.com/async_js/examples/1.json',
  'https://eloux.com/async_js/examples/2.json',
  'https://eloux.com/async_js/examples/3.json',
];

myURLs[Symbol.asyncIterator] = async function* () { // async generator
    for (let url of this) {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error('Unable to fetch!');
        }

        yield response.json(); // Super simple!
    }
}

const asyncGenerator = myURLs[Symbol.asyncIterator](); // Returns a special iterator: Async generator object

asyncGenerator.next().then(result => {
    console.log(result); // {value: {firstName: 'John', lastName: 'Doe'}, done: false}
});


asyncGenerator.next().then(result => {
    console.log(result); // {value: {firstName: 'Anna', lastName: 'Smith'}, done: false}
})

asyncGenerator.next().then(result => {
    console.log(result); // {value: {firstName: 'Peter', lastName: 'Jones'}, done: false}
})

asyncGenerator.next().then(result => {
    console.log(result); // {value: undefined, done: true}
})
```

***Async generator is not only easier to write but also less error-prone when compared to writing an async iterator!***

In ***production***, you’ll also want to use **`catch()`** to handle errors and rejected cases during the iteration.

```js
iterator.next()
.then(result => {
	console.log(result.value.firstName);
})
.catch(error => {
	console.error('Caught: ' + error.message);
});
```

### Real world example of async generator

We can use an async generator for any async iterator real-world use case.

One example is the fetching of URL data in parallel but process the result serially that we have seen before.

Another real world example is *working with web APIs to paginate data*.

Example:
```js
const asyncGetContent = async function* (url){
  const limit = 10; /* content per page */
  let offset = 0; /* index of item to start from */
  let totalCount = -1; /* -1 signifies failure */
  while (offset === 0 || offset < totalCount) {
    try {
      const response = await fetch(url)
      const data = await response.json();
      offset = offset + limit;
      totalCount = response["total-count"];
      yield data;
    } catch (e) {
      console.warn(`exception during fetch`, e);
      yield {
        done: true,
        value: "error"
      };
    }
  }
}

const asyncPageGenerator = asyncGetContent(/* pass url */);

// First page data:
asyncPageGenerator.next().then(pageData => {}); 
// Next page data:
asyncPageGenerator.next().then(pageData => {});
// Third page data:
asyncPageGenerator.next().then(pageData => {});
// ... so on
```

## Promise.all

***How do fetch a single promise?***
Run the function doing async stuff inside a promise. Simple!

***How do you fetch multiple promises?***
Put them in `forEach` loop (or just any sync loop over them).
Since you are dealing with promises, can use async callback functions

```js
const delayedExecution = (func, arg, delay) => setTimeout(() => func(arg), delay);

const p1 = () => new Promise(resolve => { delayedExecution(resolve, 1, 1000); });
const p2 = () => new Promise(resolve => { delayedExecution(resolve, 2, 500); });
const p3 = () => new Promise(resolve => { delayedExecution(resolve, 3, 1500); });
const p4 = () => new Promise(resolve => { delayedExecution(resolve, 4, 900); });

[p1, p2, p3, p4].forEach(async (p) => {
    result = await p();
    console.log(result);
});
```

***Problems with simple looping***
1. The promises executions are started sequentially i.e Each time the callback in the `forEach` executes, an attempt is made to await on a new promise. Hence, no concurrent fetching.
2. There is no way to maintain the order of the promise outcomes in our processing.

```js
// Output for the above example
2
4
1
3
```

***Using `Promise.all()` and its benefits***
This method allows us to:
1. Fetch promises concurrently
2. Maintains the order of the promise resolutions for processing (contained in an array)

**Note**: Even though the promises run concurrently, the Promise.all itself is a promise that resolves once all the individual promises resolve (or rejects as soon as one of them rejects)

```js
const delayedExecution = (func, arg, delay) => setTimeout(() => func(arg), delay);

const p1 = () => new Promise(resolve => { delayedExecution(resolve, 1, 1000); });
const p2 = () => new Promise(resolve => { delayedExecution(resolve, 2, 500); });
const p3 = () => new Promise(resolve => { delayedExecution(resolve, 3, 1500); });
const p4 = () => new Promise(resolve => { delayedExecution(resolve, 4, 900); });

Promise.all([p1(), p2(), p3(), p4()])
    .then((results) => {
       console.log(results) 
    });

// Logs:
// [1, 2, 3, 4]
```

## Drawbacks of Promise.all

In `Promise.all()`, the promise resolves if every single one of the promises resolves and rejects if even one of them rejects.

Many times, this is a problem. We do not want the result of one affecting the others. A better, more independent method is `Promise.allSettled()` 

```js
const delayedExecution = (func, arg, delay) => setTimeout(() => func(arg), delay);

const p1 = () => new Promise(resolve => { delayedExecution(resolve, 1, 1000); });
const p2 = () => new Promise(resolve => { delayedExecution(resolve, 2, 500); });
const p3 = () => new Promise((resolve) => { delayedExecution(resolve, 3, 1500); });
const p4 = () => new Promise((_, reject) => { delayedExecution(reject, 'error', 900); });

Promise.all([p1(), p2(), p3(), p4()])
    .then((results) => {
       console.log(results) 
    })
    .catch((e) => {
        console.log(e)
    });

// Logs
// error
```

## Promise.allSettled

`Promise.allSettled()` was introduced to avoid the pitfalls of `Promise.all()`. It reports the outcome of all requests (without letting the result of one spoil the others).

**Requirements:**
- Node 12.9+,
- Supported by modern browsers

**How it works:**
1. All fulfilled? Fulfilled
2. Partially fulfilled? Fulfilled
3. None fulfilled (All rejected)? Rejected

![Working of Promise.allSettled](https://i.imgur.com/qZpHuOA.png)

> The `Promise.allSettled()` method returns a pending promise that resolves when all of the given promises have either successfully fulfilled or rejected (“settled,” in other words). This behavior is very useful to track multiple asynchronous tasks that are not dependent on one another to complete.

> Rather than immediately rejecting when one of the promises fails, Promise.allSettled() waits until they all have completed.

`Promise.allSettled()` also preserves the order of the outcomes for processing. i.e an iterable (array) matching the order of the promises in the iterable passed as an argument to the method.

***The outcome of Promise.allSettled() is unique***

Instead of providing an iterable with the results of the fulfillments directly like in other Promise methods, `Promise.allSettled()` returns a unique iterable. 

Each iterable contains:
1. `status`: Either `"fulfilled"` or `"rejected"`
2. `value`: Value of the fulfillment. Only exists if the promise fulfills
3. `reason`: Reason for rejection. Only exists if the promise rejects

```js
const delayedExecution = (func, arg, delay) => setTimeout(() => func(arg), delay);

const p1 = () => new Promise(resolve => { delayedExecution(resolve, 1, 1000); });
const p2 = () => new Promise(resolve => { delayedExecution(resolve, 2, 500); });
const p3 = () => new Promise((resolve) => { delayedExecution(resolve, 3, 1500); });
const p4 = () => new Promise((_, reject) => { delayedExecution(reject, 'error', 900); });

Promise.allSettled([p1(), p2(), p3(), p4()]) // p4 is meant to fail i.e partial failure
    .then((results) => { // allSettled still settles to fulfillment
       console.log(results) 
    })
    
// Logs
// {status: 'fulfilled', value: 1}
// {status: 'fulfilled', value: 2}
// {status: 'fulfilled', value: 3}
// {status: 'rejected', reason: 'error'}
```

> The outcome of each promise has a status property, indicating whether the promise has fulfilled. When a promise is rejected, the result won’t have a value property. Instead, it has a reason property containing the rejection reason.

***When should we use Promise.all and Promise.allSettled?***
When we want to process the result of multiple async requests together. If it’s possible to process the result of each async request individually, then handle each promise with its own `then()` handler.

> Using `Promise.all()` is more appropriate when you have essential async tasks that are dependent on each other

> On the other hand, `Promise.allSettled()` is more suitable for async tasks that might fail but are not essential for your program to function.

***Special case for `Promise.allSettled()` rejection***

One special case is when you pass a *non-iterable* like a regular object.

## Promise.any

A new promise method that was recently added.

`Promise.any()` resolves as soon as one of the promises resolves and rejects if all of the promises reject.

**Requirements**
- ES2021

***Difference between `Promise.any` and `Promise.race`:***
1. `Promise.race` was introduced much earlier (ES2015)
2. `Promise.race` settles whenever the first promise settles, this can either be fulfillment or rejection. However, Promise.any is only looking out for fulfillment

***When should we use Promise.any?***

Two super-important cases:
1. Avoiding *Single Point of Failure (SPOF)*. Ex: When you need a *critical resource* but the server has a failure. We can fetch the same resource from multiple servers (one main, others fallback) using `Promise.any`
3. Performance optimization: When you want to load things from the fastest service. Ex: When choosing between two API endpoints for loading the same set of images

***Resolves with the value of the first resolving promise***

```js
const delayedExecution = (func, arg, delay) => setTimeout(() => func(arg), delay);

const p1 = () => new Promise(resolve => { delayedExecution(resolve, 1, 1000); });
const p2 = () => new Promise((_, reject) => { delayedExecution(reject, 'error_1', 500); });
const p3 = () => new Promise((resolve) => { delayedExecution(resolve, 3, 1500); });
const p4 = () => new Promise((_, reject) => { delayedExecution(reject, 'error_2', 900); });

Promise.any([p1(), p2(), p3(), p4()])
.then((result) => {
    console.log(result);
})

// Logs:
// 1
```

***Rejects when all the promises reject***

`Promise.any()` rejects when all promises reject. 

However, the error object is unique. It is an error type called **AgrregateError**.

This error object contains an **`error` property** that contains an array of the rejection reasons from all the promises, in order.

```js
const delayedExecution = (func, arg, delay) => setTimeout(() => func(arg), delay);

const p1 = () => new Promise((_, reject) => { delayedExecution(reject, 'error_1', 500); });
const p2 = () => new Promise((_, reject) => { delayedExecution(reject, 'error_2', 900); });

Promise.any([p1(), p2()])
.then((result) => {
    console.log(result); // Does not execute
})
.catch((error) => {
    // Executes
    console.log(error);
    console.log(error.errors)
})

// Logs:
// AggregateError: All promises were rejected
// ['error_1', 'error_2']


// Note: 
// We do NOT get the first rejected promise error ('error_1')
// That would be the behaviour of Promise.race()
```

***Special case: Rejects when an empty iterable is passed***

If there are no promises in the iterable (empty iterable like `[]` or `""`), `Promise.any()` rejects.

```js
Promise.any([]).then(() => {})
.catch(error => {
    console.log(error);
    console.log(error.errors)
});

// Logs:
// AggregateError: All promises were rejected
// []
```

***Real-world reasons to use Promise.any***

> A single point of failure (SPOF) is a component of a system that with just one malfunction or fault will stop the entire system from working. If you want to have a reliable application, you should be able to identify and avoid potential SPOFs in the system.

> A common SPOF in web applications occurs when fetching critical resources, such as data for financial markets, from external APIs. If the API is inaccessible, the app will stop working. The `Promise.any()` method is extremely useful in this regard. It enables us to request data from multiple APIs and use the
result of the first successful promise.

> As a programmer, it’s always in your best interest to build apps that respond quickly to user requests. `Promise.any()` allows you to improve the performance of critical app services by using the data from the API that responds first. You can use `Promise.any()` to improve the performance of your application

## Promise.race

`Promise.race()` settles when the first promise settles or rejects.

***Comparison with `Promise.any()`***
* For fulfillment, both work the same i.e Resolves with the first promise that resolves.
* For rejection, `Promise.race()` is rejected when the first promise rejects while `Promise.any()` is rejected only when all the promises are rejected
* If the iterable passed to the method is empty, `Promise.race()` never settles whereas `Promise.any()` rejects

***Fulfillment example:***
```js
const delayedExecution = (func, arg, delay) => setTimeout(() => func(arg), delay);

const p1 = () => new Promise((resolve) => { delayedExecution(resolve, 1, 2000); });
const p2 = () => new Promise((resolve) => { delayedExecution(resolve, 2, 900); });
const p3 = () => new Promise((_, reject) => { delayedExecution(reject, 'error', 900); });

Promise.race([p1(), p2(), p3()])
.then((result) => {
    console.log(result);
})
.catch((error) => {
    console.log(error);
});


// Logs:
// 2
```

***Rejection example:***
```js
const delayedExecution = (func, arg, delay) => setTimeout(() => func(arg), delay);

const p1 = () => new Promise((resolve) => { delayedExecution(resolve, 1, 2000); });
const p2 = () => new Promise((resolve) => { delayedExecution(resolve, 2, 900); });
const p3 = () => new Promise((_, reject) => { delayedExecution(reject, 'error', 100); });

Promise.race([p1(), p2(), p3()])
.then((result) => {
    console.log(result);
})
.catch((error) => {
    console.log(error);
});


// Logs:
// error
```

***Promise.race does remains pending when passed an empty iterable***

Unlike `Promise.any()`, `Promise.race()` does not reject when there is no item in the iterable. Instead, it remains stuck in the PENDING state. This is a drawback

```js
Promise.race([]) // An empty iterable
.then(result => { // This never executes
    console.log(result);
})
.catch(error => { // This never executes
    console.log(error);
});

// Promise is always in the PENDING state
// > Promise {<pending>}
```

### Using Promise.race to set a time limit on async tasks

> The `Promise.race()` method can be useful when fetching an external resource that may take a while to complete. With this method, we can race an async task against a promise that’s going to be rejected after a number of milliseconds. Depending on the promise that settles first, we either obtain the result or report an "error message" or "load data from a cache!"

```js
const fetchMock = () => new Promise(resolve => {
    setTimeout(() => {
        resolve({ name: 'Pushkar' });
    }, 5000);
});

const fetchDataFromAnAPI = () => {
    const timeOut = 1000;
    const result = fetchMock();
    const timeLimiter = new Promise((_, reject) => {
        setTimeout(() => {
            reject('API taking too long!')
        }, timeOut);    
    });

    return Promise.race([result, timeLimiter]);
}

fetchDataFromAnAPI().then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
});

// Logs:
// API taking too long!
```

***Example with a cached data loader***:
Useful only for cases when data does not change frequently and it is okay to show recently stale data.

```js
const fetchMock = () => new Promise(resolve => {
    setTimeout(() => {
        resolve({ name: 'Pushkar' });
    }, 5000);
});

const cachedData = { name: 'Rahul' }

const fetchDataFromAnAPI = () => {
    const timeOut = 1000;
    const result = fetchMock();
    const loadFromCache = new Promise((resolve) => {
        setTimeout(() => {
            resolve(cachedData)
        }, timeOut);    
    });

    return Promise.race([result, loadFromCache]);
}

fetchDataFromAnAPI().then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
});

// Logs:
// {name: 'Rahul'}
```

### Using Promise.race to run a fixed number of async batch processes 

[Stackoverflow link](https://stackoverflow.com/questions/46376432/understanding-promise-race-usage/48820037#48820037)

> An interesting use case for `Promise.race()` is to batch async requests. Iif you have to make a large number of async requests and don’t want the pending requests to get out of hand, you can use Promise.race() “to keep a fixed number of parallel promises running and add one to replace whenever one completes.” Using Promise.race() in this way lets you run multiple jobs in a batched way while preventing too much work from happening at one time.

**Note: (Important!)** This is also a technique in how to manage an array of promises i.e replace them one-by-one!

```js
const _ = require('lodash')

async function batchRequests(options) {
    let query = { offset: 0, limit: options.limit };

    do {
        batch = await model.findAll(query);
        query.offset += options.limit;

        if (batch.length) {
            const promise = doLongRequestForBatch(batch).then(() => {
                // Once complete, pop this promise from our array
                // so that we know we can add another batch in its place
                _.remove(promises, p => p === promise);
            });
            promises.push(promise);

            // Once we hit our concurrency limit, wait for at least one promise to
            // resolve before continuing to batch off requests
            if (promises.length >= options.concurrentBatches) {
                await Promise.race(promises);
            }
        }
    } while (batch.length);

    // Wait for remaining batches to finish
    return Promise.all(promises);
}

batchRequests({ limit: 100, concurrentBatches: 5 });
```

### Using Promise.race to run computationally intensive tasks

> You can also apply `Promise.race()` to a computationally expensive background task. It’s easy to imagine cases where some task might be attempted in the background, such as rendering a complex canvas while the user is occupied with something else. Using `Promise.race()` there, again gives you some knowable time to work with—and the opportunity to introduce some logic of what to do should the task fail.

## AbortController API to cancel pending async requests

Previously, there has been no in-built way to cancel a pending request. Now there is.

> Applications today must work with information on remote servers, and the Fetch API allows you to easily retrieve resources asynchronously across the network. But sometimes you may want to cancel a pending async request before it has completed. Perhaps you have a network-intensive application and async requests are taking too long to fulfill, or maybe the user clicked a Cancel button.

The **`AbortController`** interface provides an **`abort()`** method. 

* You can create a cancelable fetch request by passing the **`signal`** property of `AbortController` as an option to `fetch()`.
* Later, when you want to abort the fetch, simply call the `abort()` method to terminate the network transmission.

**Requirements:**
- Node 15+
- Modern browsers

**Note:** `abort()` is the only method of controller and will cause the promise object returned by fetch to reject with an exception like this: 

`DOMException: The operation was aborted`

The error type is: **`AbortError`**

Example:
```js
// Step 1: Instantiate an AbortController
const abortController = new AbortController();
const signal = abortController.signal;

// Step 2: Connect the controller signal to the fetch signal option
const data = fetch('https://www.google.com', { signal });

// Step 3: Abort the request when a timeout is reached (or on user action like cancel)
const timeout = 1000;
setTimeout(() => abortController.abort(), timeout)
```
***Handling the abort error in the catch clause***
Whenever a fetch request is aborted, the control goes into the `.catch()` clause since the promise is rejected with an error, `AbortError`

```js
const abortController = new AbortController();
const signal = abortController.signal;
const data = fetch('https://localhost:8080', { signal });

abortController.abort();

data.then(data => {
    console.log(data)
}).catch(error => {
    console.log('The request was aborted');
    console.log(error.name);
    console.log(error);
})

// Logs
// The request was aborted
// AbortError
// DOMException: The user aborted a request.
```

***Listening to aborts using a listener***

We can also listen to the aborted signal from within the abort controller's `signal` object if we wish to. The event is `abort` and the signal is `signal.aborted`.

```js
const abortController = new AbortController();
const data = fetch('https://eloux.com/todos/1', { signal: abortController.signal });

abortController.signal.addEventListener('abort', () => {
    console.log(abortController.signal.aborted); 
})

setTimeout(() => abortController.abort(), 10);

// Logs:
// true
```

### Canceling event listeners with AbortController

`AbortController` is not just useful for cancelling `fetch` requests but we can also *cancel multiple event listeners*! 

This was a tedious task earlier:
* Maintain a reference to event listener functions
* Identify by reference the function to be removed & run `removeEventListener`

> If we register dozens of event handlers, we’ll need the exact same number of `removeEventListener()` methods to deregister them, which unnecessarily bloats the code. With `AbortController` we can de-register multiple event listeners in only one statement.

***How?***
1. Instantiate an abort controller
2. Pass its `signal` to the new 3rd `addEventListener` argument, options
3. Abort with `.abort()`

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .container { 
      background-color: blue; 
      width: 500px; 
      height: 200px; 
    }
  </style>
</head>
<body>
  <div class="container">Container</div>
  <script>
    const container = document.querySelector('.container');

    const abortController = new AbortController();
    abortController.signal.addEventListener('abort', () => {
      console.log(abortController.signal.aborted);
    });

    container.addEventListener('mouseenter', () => console.log('enter'), { signal: abortController.signal });
    container.addEventListener('mouseleave', () => console.log('leave'), { signal: abortController.signal });
    container.addEventListener('mousedown', () => console.log('press'), { signal: abortController.signal });
    container.addEventListener('mouseup', () => console.log('release'), { signal: abortController.signal });

    // Only allow events on the container to happen for the first 5 seconds.
    setTimeout(() => {
      abortController.abort();
    }, 5000);
  </script>
</body>
</html>
```

### Real world use cases of abort controller

1. Abort event handlers that load things asynchronously. ex: Fetching an image on user clicking load and then canceling that load on clicking cancel. Saves bandwidth if we are loading large images.
Refer to "User cancelable async requests"
2. ***We can cancel multiple fetch requests by connecting the same signal to all of them*** . Maybe you want to stop loading anything from the network on a user action, etc.

## Waiting for promises in another module using top level await

Unit recently, `await` could only be used inside an `async` function! But now, it is available at the top level as well in modules & devtools environment.

***Problems without support for top level await:***
We essentially do not have a way to make a module importing another module wait until all the async code in the imported module completes i.e promise settles (`await` code completes)

**Note:**
> Modules are subject to same-origin policy, meaning that you can’t import them from the file system. You need to use a server.

***Problem with trying to wait for promises from another module***
```js
// async.js

let data = {}

const doSomethingAsync = () => new Promise(resolve => {
  setTimeout(() => {
    data = { name: 'Pushkar' }
  }, 1000);
});

// Earlier: Can use await in async functions only.
const doAsync = async function() {
  await doSomethingAsync();
};

doAsync();

export {
  data
}
```

```js
// main.js
import { data } from "./async.js";
console.log(data);
setTimeout(() => {
	console.log(data);
}, 3000);
```

```shell
// Output of main.js:
{}
{name: 'Pushkar'}
```

As we can see, when we import the `data`, it is an empty object. But, if we check it after a while (once the promise resolves), it contains the updated data.

***Workaround for waiting for a promise in another module to settle***

How were we making sure that we wait for all async code in a module executes before importing when top-level await support was missing?

Default export an *async function* / *function returning a promise* as an *IIFE (Immediately invoked function expression)*.
Imported value is a promise we can use.

```js

let data = {};

const doSomethingAsync = () => new Promise(resolve => {
  setTimeout(() => {
    data = { name: 'Pushkar' }
  }, 1000);
});

export default (() => new Promise((resolve) => {
  doSomethingAsync().then(() => {
    resolve(data);
  })
})()); // Exported value is a promise
```

```js
// main.js
import dataPromise from "./async.js";
dataPromise.then((data) => {
  console.log(data);
});
```

***Top level await***

Top level await is only supported in:
1. Special type of script called **modules** (`type="module" ``<script>` tag attribute)
2. It works only on the same-origin policy i.e Runs into CORS issue when running 

**Note:** Top level await also works in the ***browser devtools*** apart from module scripts.

```js
// async.js
await fetch('https://www.google.com', { mode: 'no-cors' });
```

**Devtools**
The above module works if run as a snippet in the browser devtools.

**Regular script**
If it is a classic script (i.e not a "module"), you will get an ERROR like so:

```js
Uncaught SyntaxError: await is only valid in async functions and the top level bodies of modules (at async.js:8:1)
```

**Module**

When using a module (`<script type="module" src="./async.js"></script>`), we get no errors and the module does execute i.e it waits for the `await` operation to complete.

```js
// async.js
let data = {};

const doSomethingAsync = () => new Promise(resolve => {
  setTimeout(() => {
    data = { name: 'Pushkar' }
  }, 1000);
});

console.log(1)

await doSomethingAsync();

export {
  data
}
```

```js
// main.js
import { data } from "./async.js";
console.log('data', data); // { name: 'Pushkar' }
```
***Real world use case for top level await***

> When designing a program to support multiple languages and regions, you may want to use a runtime value to determine the language to use. Say you have an ES module and want to load a language pack dynamically, based on the preferred language of the user set in the browser. You can take advantage of top-level await to import the messages:

```js
const messages = await import(`./packs/messages-${navigator.language}.js`);
```

Another use case is for having a graceful degradation or selecting a fallback like how you would use `Promise.any()`. The following is an alternative to `Promise.any()`  (However, it is a blocking way of doing things while Promise.any is concurrent fetching)

```js
let d3;
try {
	d3 = await import('https://cdnjs.cloudflare.com/ajax/libs/d3/6.7.0/d3.min.js');
} catch {
	d3 = await import('https://ajax.googleapis.com/ajax/libs/d3js/6.7.0/d3.min.js');
}
```
