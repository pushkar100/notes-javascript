# Promises, async await, and fetch

- [Promises, async await, and fetch](#promises,-async-await,-and-fetch)
  * [Problems with callbacks](#problems-with-callbacks)
  * [Promises and their benefits](#promises-and-their-benefits)
    + [Benefits](#benefits)
  * [Creating a promise](#creating-a-promise)
  * [Settling a promise instantaneously](#settling-a-promise-instantaneously)
  * [Errors inside a promise](#errors-inside-a-promise)
  * [What does a promise contain?](#what-does-a-promise-contain-)
  * [Handling a promise](#handling-a-promise)
  * [Chaining promises](#chaining-promises)
  * [Promise.race](#promiserace)
  * [Promise.all](#promiseall)
  * [Async await](#async-await)
  * [Fetch API in detail](#fetch-api-in-detail)
    + [Simple GET request using fetch](#simple-get-request-using-fetch)
    + [Fetching JSON](#fetching-json)
    + [Response object](#response-object)
      - [Synchronous properties of the response object](#synchronous-properties-of-the-response-object)
      - [Determining if the request was successful](#determining-if-the-request-was-successful)
      - [Accessing and modifying headers](#accessing-and-modifying-headers)
      - [Reading the response content](#reading-the-response-content)
      - [Cloning a response](#cloning-a-response)
      - [The raw response stream](#the-raw-response-stream)
    + [Fetch options](#fetch-options)
      - [Uploading files using fetch](#uploading-files-using-fetch)
    + [Request object](#request-object)
      - [Cache properties](#cache-properties)
      - [Request mode](#request-mode)
      - [Controlling cookies with credentials](#controlling-cookies-with-credentials)
      - [Keeping alive a request](#keeping-alive-a-request)
      - [Handling redirects in the URL](#handling-redirects-in-the-url)
      - [Checking the integrity of data](#checking-the-integrity-of-data)
      - [Setting the referrer](#setting-the-referrer)
      - [Setting policies for the referrer](#setting-policies-for-the-referrer)
      - [Canceling a fetch request](#canceling-a-fetch-request)

## Problems with callbacks

"Callback hell" comes from the fact that callbacks:
* Don’t compose easily for multiple levels of callbacks
* Lead to code that is hard to extend
* Have no consistency between order of parameters (Ex: Does data handler callback come first or the error handler?)
* Have no consistent way to handle errors

```js
// Example of callback hell:
function callback() {
	// .. print info
	callbackTwo() {
	  // .. make n/w reqs
	  callback3() {
	    // .. log data to the backend
	    ...
	  }
  }
}
```

## Promises and their benefits

> A promise is an object through which a function may propagate an error or result sometime in the future. At any time, a promise is in one of three states: pending, resolved, or rejected.

![promise states](https://i.imgur.com/4pewx7R.png)

A promise:
* Maybe created in one of the 3 states: "pending", "resolved", "rejected"
* *"resolved"* and *"rejected"* are ***end states*** (also referred to as *"settled"*)
* Whenever an asynchronous function needs to complete an operation, the promise will be in pending state. When the operation ends, the promise is set to resolved or rejected
* If resolved, the promise makes available the resolved value. Ex: data from a fetch request
* If rejected, the promise makes available the rejected reason. Ex: error object for a failing network request

**Note:**
1. Once the promise has settled, it cannot go back to a pending state
2. A settled promise cannot switch between resolved and rejected

### Benefits

1. Promises can form a *chain* : *compose* really well! (No callback hell where we need to call a callback from inside another that causes nesting)
2. Promises consistently and clearly discern data from errors by providing two separate channels of communication: *the data channel used with `then()`* and *the error channel used with `catch()`*
3. There is no confusion in the order of the data and error objects to receive and handlers to apply when dealing with promises

## Creating a promise

* We can create a promise by instantiating it:
`new Promise()`
* The argument for the promise constructor is a function that receives two objects: "resolve" and "reject".
* Invoking resolve, resolves the promise with some data
* Invoking reject, rejects the promise with some error

```js
const computeSqrt = (num) => new Promise((resolve, reject) => {
    if (Number.isNaN(num)) {
        reject('Not a number');
    }

    setTimeout(() => {
        resolve(Math.sqrt(num));
    }, 1000);
});
```

## Settling a promise instantaneously 

If we know that a promise can be settled immediately, we can use *static* methods, **`Promise.resolve()`** or **`Promise.reject()`** to create a settled promise. 

**Note**: This is still asynchronous (i.e goes to the micro-task queue)

```js
const computeSqrt = (num) => {
    if (isNaN(num)) {
        return Promise.reject('Not a number');
    }

    if (num === 0 || num === 1) {
        return Promise.resolve(num);
    }
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(Math.sqrt(num));
        }, 1000);
    });
};
```

**Note:**
* Calls to functions that return promises are ***nonblocking***. The control will immediately flow to the next statement or expression that’s after the function call
* The control will immediately flow to the next statement or expression that’s after the function call.

```js
const asyncFunc = () => {
    return Promise.resolve('resolved');
};

asyncFunc().then(() => {
    console.log('I log second because I am async code');
});
console.log('I log first because I am sync code');

// Logs:
// I log first because I am sync code
// I log second because I am async code
```

## Errors inside a promise

Whenever there is an error in the Promise, it rejects with that error. This error can be caught in a `catch()` method.

```js
const computeSqrt = (num) => {
    return new Promise((resolve, reject) => {
        throw new Error();
        setTimeout(() => {
            resolve(Math.sqrt(num));
        }, 1000);
    });
};

computeSqrt(16).catch(err => console.log(err));

// Logs:
// Error ...
```

## What does a promise contain?

It returns an *object* that needs to be handled.

```js
computeSqrt('dd') // Promise {<rejected>: 'Not a number'}
computeSqrt(0) // Promise {<fulfilled>: 0}
computeSqrt(16) // Promise {<pending>}
```

The promise object contains two important methods:
1. `.then()` to handle resolved data
2. `.catch()` to handle errors i.e rejections

## Handling a promise

Whether a promise rejects or resolves immediately or at a later time, the way to handle the response is just the same

1. To receive the successful response if and when a promise resolves, use the `then()` function on the promise
2. To receive the error details from a promise if and when it rejects, use the `catch()` function

(If the promise continues to be in the pending state, then
neither the `then()` function nor the `catch()` function will be called)

```js
const computeSqrt = (num) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(Math.sqrt(num));
        }, 1000);
    })
};

const badComputeSqrt = (num) => {
    return new Promise((resolve, reject) => {
        throw new Error();
    });
};

computeSqrt(16).then((value) => { console.log(value) }); // 4
badComputeSqrt(16).catch(err => console.log(err)); // Error
```

## Chaining promises

- Both `then()` and `catch() `return a promise, calls to these functions may be ***chained*** to apply a series of filtering and transformations

(a) If the promise resolves, all the `then()` callbacks in the chain up to the first catch are skipped and the `catch()` is invoked
(b) If a callback returns something, that return value is wrapped automatically inside a *resolved* promise. This applies to both `then()` and `catch()` callbacks and *is what enables chaining*
(c) If a callback throws an error, the error object is wrapped automatically inside a *rejected* promise.

Examples:
1. Chaining
```js
const computeSqrt = (num) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(Math.sqrt(num));
        }, 1000);
    })
};

computeSqrt(16)
.then(value => { 
    return `modified value(${value}) in callback`;
}).then(value => {
    return `Second modification: ${value}`;
}).then(value => {
    console.log(value); // Second modification: modified value(4) in callback
});
``` 

2. Skipping `then()`s on error
```js
const computeSqrt = (num) => {
    return new Promise((resolve, reject) => {
        reject('Error in original promise')
    })
};

computeSqrt(16)
.then(() => {
    console.log(`then1`)
}).then(() => {
    console.log(`then2`)
}).catch(err => {
    console.log('Err', err);
    console.log('I throw no error, so the next then callback should run')
}).then(() => {
    console.log(`then3`)
});

// Logs:
// Err Error in original promise
// I throw no error, so the next then callback should run
// then3
```

3. Skipping `catch()`s when there is NO error
```js
```

4. When a callback returns nothing
The default return value, `undefined`, is wrapped in a resolved promise.
```js
const computeSqrt = (num) => {
    return new Promise((resolve, reject) => {
        resolve(1)
    })
};

computeSqrt(16)
.then(() => {
    console.log(`then1`)
}).catch(() => {
    console.log(`I will be skipped`)
}).catch(() => {
    console.log(`I too will be skipped`)
}).then(() => {
    console.log(`then2`)
});

// Logs:
// then1
// then2
```

## Promise.race

The `race()` static method of `Promise` takes an array of promises and returns the ***first*** one to resolve or reject.

Pros:
* It is useful for maintaining a timeout on a promise. Ex: set a time limit on n/w request.

Cons:
* Nothing really. However, if you are looking to fetch a resource most quickly available from multiple endpoints, `Promise.any()` is the best choice

```js
const resolvePromiseAfterDelay = (value, delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(value), delay);
    })
};

const timeoutPromise = timeout => {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(), timeout);
    })
};

Promise.race([
    resolvePromiseAfterDelay(1, 1000),
    resolvePromiseAfterDelay(2, 2000), 
    timeoutPromise(2500)
])
.then(value => console.log(`resolved: ${value}`))
.catch(err => console.log(`timeout`));

// Logs:
// resolved 1
```

```js
const resolvePromiseAfterDelay = (value, delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(value), delay);
    })
};

const timeoutPromise = timeout => {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(), timeout);
    })
};

Promise.race([
    resolvePromiseAfterDelay(1, 1000),
    resolvePromiseAfterDelay(2, 2000), 
    timeoutPromise(500)
])
.then(value => console.log(`resolved: ${value}`))
.catch(err => console.log(`timeout`));

// Logs:
// timeout
```

## Promise.all
The `all()` static method of promise takes an array of promises and passes an array of resolved results to the `then()` function when all promises resolve. If any one of the given promises is rejected, then the `then()` function is *not* called; the `catch()` function is used instead.

Pros
* Non-blocking way to fetch multiple requests *but process the outcomes in order*!

Cons:
* If one promise rejects then the whole `Promise.all()` rejects. If you want to work with partial data, use `Promise.allSettled()`
* One caveat with `all()` is that if computations were to take an indefinitely long amount of time, then it might lead to ***starvation***. To avoid this concern, we can use a *timeout promise*.

```js
const resolvePromiseAfterDelay = (value, delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(value), delay);
    })
};

const rejectedPromise = timeout => {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(), timeout);
    })
};

Promise.all([
    resolvePromiseAfterDelay(1, 1000),
    resolvePromiseAfterDelay(2, 2000), 
    resolvePromiseAfterDelay(3, 2000)
])
.then(value => console.log(`resolved:`, value))
.catch(err => console.log(`rejected`));

// Logs
resolved: (3) [1, 2, 3]
```

`Promise.all()` waits for all promises to resolve.

```js
Promise.all([
    resolvePromiseAfterDelay(1, 1000),
    resolvePromiseAfterDelay(2, 2000), 
    resolvePromiseAfterDelay(3, 2000),
    rejectedPromise(500)
])
.then(value => console.log(`resolved:`, value))
.catch(err => console.log(`rejected`));

// Logs:
// rejected
```

## Async await

Drawback with Promises: 
* The code structure is quite different between the synchronous version (callbacks) and the asynchronous (promise) version 

**Synchronous**: Imperative, sequential code
**Promises**: Need to get our head wrapped around `.then()` and `.catch()` which are non-sequential

```js
const addTwoNumbers = (a, b) => a + b;

const addSync = (a, b) => {
    return addTwoNumbers(a, b)
};

const addAsync = (a, b) => {
    return Promise.resolve(addTwoNumbers(a, b));
};

console.log(addSync(2, 3)); // 5

addAsync(2, 3)
    .then(val => console.log(val)) // 5
    .catch(err => console.log(err));
```

**How can we change promises such that we keep the code structure identical between synchronous and asynchronous code?**

The answer is **async functions**. These return promises that wrap the return value of the function, if resolved. Else, wraps the error thrown in a rejected promise.

*Internally, these functions work just like promises do because they essentially are just that, promises under the hood!*

**Defining an async function:**
* Mark the promise-returning asynchronous function
with the async keyword.

**Invoking an async function synchronously:**
* Place the `await` keyword before it. Usually used with promises or an async function. 

(Note: originally, `await` could only be used inside async functions, but "top level" await inside a module became possible in ES2021)

```js
const addTwoNumbers = (a, b) => a + b;

const addAsync = async (a, b) => {
    const result = await Promise.resolve(addTwoNumbers(a, b));
    return result;
};

addAsync(2, 3)
    .then(val => console.log(val)) // 5
    .catch(err => console.log(err));
```

```js
// More sync-like coding:
const checkTwoPlusThree = async () => {
	const res = await addAsync(2, 3);
	console.log(res); // 5
}

checkTwoPlusThree()
```

**Invoking an async function as is (asynchronously)**

It is not very useful other than to understand that what is return is a ***promise***!

```js
const addTwoNumbers = (a, b) => a + b;

const addAsync = async (a, b) => {
    const result = await Promise.resolve(addTwoNumbers(a, b));
    return result;
};

console.log(addAsync(2, 3));

// Logs:
// Promise {<pending>}
```

**Error handling in async functions**

Instead of having a `catch` block as with promises, we can use the regular **`try-catch`** block! 

If we do *not* handle the error, we get a rejected promise with that error. This needs to be handled in a `catch()` block at some point, else we will see an "unhandled promise" error.

```js
const addTwoNumbers = (a, b) => a + b;

const addAsync = async (a, b) => {
    const result = await Promise.resolve(addTwoNumbers(a, b));
    return result;
};


const checkTwoPlusThree = async () => {
    try {
        const res = await addAsync(2, 3);    
    } catch (e) {
        console.log('error', e);
    }
}
```

> Then then-catch syntax may be more suitable when creating functional style code and the async-await more suitable when writing imperative style code. 
> At the same time, use caution: async-await may be error prone if the function that we are waiting for completion modifies a shared state; such state change may make the suspended code vulnerable

## Fetch API in detail

The main difference between `fetch` and `XMLHttpRequest` is that the Fetch API uses Promises, hence avoiding callback hell.

**Support**
* The `fetch` API is natively supported by all modern browsers except Internet Explorer

**Working of `fetch`**
`fetch()` processes data through a ***data stream (Stream object)***, which can be read in blocks, which is beneficial to improve website performance and reduce memory usage.
- It’s very useful for scenarios where large files are requested or the network speed is slow

> The `XMLHTTPRequest` object does not support data streaming. All data must be stored in the cache. Block reading is not supported. You must wait for all to be obtained before spitting it out in one go.

### Simple GET request using fetch

* Pass a URL string
* Fetch runs a GET request to the endpoint identified by the string
* The result is a promise

```js
const data = fetch('https://www.example.com/');

data
.then(() => /* ... */)
.catch(() => /* ... */)
```

### Fetching JSON

* The `response` received by `fetch()` is a Stream object
* `response.json()` is an ***asynchronous*** operation that takes out all the content and converts it into a JSON object

```js

fetch('https://www.example.com/')
  .then(response => response.json())
  .then(json => console.log(json))
  .catch(err => console.log('Request Failed', err));
```

Re-writing it using *async-await*:
```js
async function getJSON() {
  let url = 'https://www.example.com/';
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log('Request Failed', error);
  }
}
```

### Response object

* `fetch()` returns a promise which resolves to a response object.
* `const response = await fetch(url);`

#### Synchronous properties of the response object

1. `response.ok`: `true` if HTTP status is `2xx`
2. `response.status`: HTTP response `1xx`, `2xx`, `3xx`, `4xx,` `5xx`
3. `response.statusText`: Example: `OK`
4. `response.type`:
	1. `basic`: Ordinary, same-origin request.
	2. `cors`: Cross-origin request.
	3. `error`: Network errors, mainly used for service workers.
	4. `opaque`: If the  `mode`  attribute of the  `fetch()`  request is set to  `no-cors`, this response value will be returned.
	5. `opaqueredirect`: If the  `redirect`  attribute of the  `fetch()`  request is set to  `manual`, this response value will be returned.
5. `response.redirected`: `true` if request was redirected

#### Determining if the request was successful

> After  `fetch()`  sends a request, there is an important point to note:  `fetch()`  will report an error only when there’s a network error or cannot connect. In other cases, no error will be reported, but the request is considered successful.

> This means, even if the status code returned by the server is 4xx or 5xx,  `fetch()`  will not report an error (i.e. The Promise will not become  `rejected`). Only by obtaining the true status code of the HTTP response through the  `Response.status`  property, can it be determined whether the request is successful.

```js
async function fetchText() {
  let response = await fetch('/readme.txt');
  if (response.status >= 200 && response.status < 300) {
    return await response.text();
  } else {
    throw new Error(response.statusText);
  }
}
```

There’s *no need* to consider the URL jump/redirect (status code is `3xx`) because `fetch()` will automatically convert the jumped status code to `200`. 

*Another method is to determine whether `response.ok` is `true`*

#### Accessing and modifying headers

The **`response.headers`**  property. It returns an iterator which we can traverse using the `for...of` loop.

The  `Headers`  object provides the following methods to manipulate headers.

-   `Headers.get()`: According to the specified key name, return the key-value.
-   `Headers.has()`: Returns a Boolean value indicating whether a header is included.
-   `Headers.set()`: Set the specified key name as the new key-value, if the key name does not exist, it will be added.
-   `Headers.append()`: Add headers.
-   `Headers.delete()`: Delete the header.
-   `Headers.keys()`: Return an iterator that can traverse all the keys in turn.
-   `Headers.values()`: Return an iterator that can traverse all key values ​​in turn.
-   `Headers.entries()`: Return an iterator that can traverse all key-value pairs in turn (`[key, value]`).
-   `Headers.forEach()`: Traverse the headers, in turn. Each header will execute a parameter function.

**Note**: *For HTTP responses, modifying headers is of little significance — many headers are read-only and browsers do not allow modification*

```js
let response =  await  fetch(url);  
response.headers.get('Content-Type')
// application/json; charset=utf-8
```

#### Reading the response content

1.  `response.text()`: Get the text string. (Ex: HTML files)
2.  `response.json()`: Get the JSON object.
3.  `response.blob()`: Get the binary  `Blob`  object. Binary files. (Ex: Images)
4.  `response.formData()`: Get the  `FormData`  object. (Ex: form submissions)
5.  `response.arrayBuffer()`: Get the binary  `ArrayBuffer`  object. (Ex: stream data like video and audio. `.ogg` is an example)

#### Cloning a response

The  `Stream`  object can ***only be read once*** and it is gone after reading. This means that only one of the five reading methods in the previous section can be used, otherwise, an error will be reported.
```js
let text =  await response.text();  
let json =  await response.json();  // Report an error
```

```js
const response1 = await fetch('flowers.jpg');
const response2 = response1.clone();

const myBlob1 = await response1.blob();
const myBlob2 = await response2.blob();

image1.src = URL.createObjectURL(myBlob1);
image2.src = URL.createObjectURL(myBlob2);
```

`response.clone()` made a copy of the `Response` object and then read the same image twice. 

The `Response` object also has a `Response.redirect()` method, which is used to redirect the `Response` result to the specified URL. This method is generally only used in `Service Worker`.

#### The raw response stream

The `response.body` property is the underlying interface exposed by the Response object. It returns a **ReadableStream** object for user operations. It can be used to *read content in blocks.* 

One application is to display the progress of the download.

```js
const response = await fetch('flower.jpg');
const reader = response.body.getReader();

while(true) {
  const {done, value} = await reader.read();

  if (done) {
    break;
  }

  console.log(`Received ${value.length} bytes`)
}
```

The `response.body.getReader()` method returns an iterator. The `read()` method of this traverser returns an object each time, representing the content block read this time. The done attribute of this object is a boolean value, used to judge whether it has been read. The value attribute is an `arrayBuffer` array, which represents the content of the content block. The `value.length` attribute is the size of the current block.

### Fetch options

The second parameter to `fetch` helps us provide options.

`fetch(url, options)`

The common `option` properties are:
-   `method`：The HTTP request method, POST, DELETE, PUT are all set in this property. (GET is the default)
-   `headers`：An object used to customize the header of the HTTP request.
-   `body`：The data body of the POST request.

```js
const user =  { name:  'Pushkar', surname:  'Desai' };
const response = await fetch('/article/fetch/post/user', {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json;charset=utf-8'
  }, 
  body: JSON.stringify(user) 
});
```

#### Uploading files using fetch

If there is a file selector in the form, the uploaded file is included in the entire form and submitted together. Another method is to add files with scripts, construct a form, and upload, please see the example below.

```js
const input = document.querySelector('input[type="file"]');

const data = new FormData();
data.append('file', input.files[0]);
data.append('user', 'foo');

fetch('/avatars', {
  method: 'POST',
  body: data
});
```

### Request object

The bottom layer of the `fetch()` request uses the interface of the `Request()` object.

```js
const response = fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "text/plain;charset=UTF-8"
  },
  body: undefined,
  referrer: "about:client",
  referrerPolicy: "no-referrer-when-downgrade",
  mode: "cors", 
  credentials: "same-origin",
  cache: "default",
  redirect: "follow",
  integrity: "",
  keepalive: false,
  signal: undefined
});
```

#### Cache properties

The  `cache`  attribute specifies how to handle the cache. The possible values ​​are as follows:

1.  `default`：The default value is to find matching requests in the cache first.
2.  `no-store`：Request the remote server directly and do not update the cache.
3.  `reload`：Directly request the remote server and update the cache.
4.  `no-cache`：Compare the server resources with the local cache and use the server resources when there is a new version. Otherwise use the local cache.
5.  `force-cache`：Cache is the priority, and the remote server is only requested if there is no cache.
6.  `only-if-cached`：Only check the cache. If the cache does not exist, a `504` error will be returned.

#### Request mode

The  `mode`  attribute specifies the requested mode. The possible values ​​are as follows:

1.   `cors`：The default value allows cross-domain requests.
2.   `same-origin`：Only same-origin requests are allowed.
3.  `no-cors`：The request method is limited to GET, POST and HEAD, and only a limited number of simple headers can be used, and cross-domain complex headers cannot be added, which is equivalent to the request that can be made by submitting the form.

#### Controlling cookies with credentials

The  `credentials`  attribute specifies whether to send cookies. The possible values ​​are as follows:

1.   `same-origin`：By default, cookies are sent when requesting from the same origin, but not when requesting across domains.
2.   `include`：Regardless of same-origin requests or cross-domain requests, cookies are always sent.
3.  `omit`：Never send.

For cross-domain requests to send cookies, the `credentials` attribute needs to be set to `include`.

#### Keeping alive a request

The  `keepalive`  attribute is used when the page is uninstalled to tell the browser to keep the connection in the background and continue to send data. 

A typical scenario is that when the user leaves the web page, the script submits some statistical information about the user’s behavior to the server. At this time, if the  `keepalive`  attribute is not used, the data may not be sent because the browser has uninstalled the page.

#### Handling redirects in the URL

The  `redirect`  attribute specifies the processing method for HTTP redirects. The possible values ​​are as follows:

1.  `follow`：By default,  `fetch()`  follows HTTP redirects.
2.  `error`：If a jump occurs,  `fetch()`  will report an error.
3.  `manual`：`fetch()`  does not follow the HTTP redirection, but the  `response.url`  property will point to the new URL, and the  `response.redirected`  property will become  `true`. The developer decides how to handle the redirection later.

#### Checking the integrity of data

The `integrity` attribute specifies a hash value to check whether the data returned by the HTTP response is equal to the preset hash value. 

For example, when downloading a file, check whether the SHA-256 hash value of the file matches to ensure that it has not been tampered with.

#### Setting the referrer

The `referrer` attribute is used to set the `referrer` header of the `fetch()` request. This attribute can be any string or an empty string (that is, no `referrer` header is sent).

#### Setting policies for the referrer

**referrerPolicy**

The  `referrerPolicy`  attribute is used to set the rules of the  `Referrer`  header. The possible values ​​are as follows:

1.  `no-referrer-when-downgrade`：The *default* value, the  `Referrer`  header is always sent, unless (it is not sent when) requesting HTTP resources from an HTTPS page.
2.  `no-referrer`：The  `Referrer`  header is not sent.
3.  `origin`：The  `Referrer`  header only contains the domain name, not the complete path.
4.  `origin-when-cross-origin`：The  `Referrer`  header of the same-origin request contains the complete path, and the cross-domain request only contains the domain name.
5.  `same-origin`：Cross-domain requests do not send  `Referrer`, but same-source requests are sent.
6.  `strict-origin`：The  `Referrer`  header only contains the domain name. The  `Referrer`  header is not sent when the HTTPS page requests HTTP resources.
7.  `strict-origin-when-cross-origin`：The  `Referrer`  header contains the full path for the same-origin request, and only the domain name for the cross-domain request. This header is not sent when the HTTPS page requests HTTP resources.
8.  `unsafe-url`: No matter what the situation, always send the  `Referrer`  header.

#### Canceling a fetch request

After the `fetch()` request is sent, if you want to cancel halfway, you need to use the `AbortController` object:

```js
let controller = new AbortController();
let signal = controller.signal;

fetch(url, {
  signal: controller.signal
});

signal.addEventListener('abort',
  () => console.log('abort!')
);

controller.abort(); // cancel

console.log(signal.aborted); // true
```

In the above example:
* First create an `AbortController` instance, then send a `fetch()` request. 
* The `signal` property of the configuration object must specify that it receives the signal `Controller.signal` sent by the `AbortController` instance. 
* The `Controller.abort` method is used to signal the cancellation. At this time, the `abort` event will be triggered. 
* This event can be monitored, or you can determine whether the cancel signal has been sent through the `Controller.signal.aborted` property.

[Article link](https://betterprogramming.pub/deep-insights-into-javascripts-fetch-api-e8e8203c0965)
