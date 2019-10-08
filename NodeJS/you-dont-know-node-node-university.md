# You Don't Know Node

Introduction to **5 core features** by *Azat Mardan* [https://node.university/courses/107814](https://node.university/courses/107814)

## Why use NodeJS

I/O operations are the most expensive. Operations that need to access outside CPU and memory such as file system, Database access, etc form I/O operations. These tasks take much more time than CPU tasks (order of 10s to 1000s of times slower).

NodeJS has this thing called **Non-blocking I/O**.

**What is blocking I/O?**

In blocking I/O, the process that needs to do I/O waits on I/O to complete. While it is happening, the process that triggered it is doing nothing. Therefore, it is a waste of time and resources which makes it an inefficient system.

Real world example: You are waiting in a queue at a cafe and place an order when it is your turn. The cashier herself is the one who goes and prepares your order. While she is doing that you are just waiting in the queue doing nothing else. Only when she comes back with the food do you get to go and do other things.

**What is non-blocking I/O?**

In non-blocking I/O system such as Node, we use an **event loop** that constantly checks for any callbacks, These callbacks are the ones registered when an I/O operation is started. When it is completed, the callback can then be executed as signaled by the I/O task. The event loop will pick it up in the next free cycle if the call stack is empty. In this way, the node system can go do other things while I/O is taking place.

*The event loop itself runs on a **single-thread.*** The NodeJS code is a fork of the **V8** open source JS engine and so the foundations are the same.

Real world example: The same cafe but you can place your order and go sit down, doing other things. In the meantime, the cashier delegates your order's work to another worker who will prepare it and then call you to collect it (the callback). The cashier and you are not affected while worker is doing her job (need not wait to do other things)

**How to make blocking systems non-blocking?**

With blocking systems, you need **multi-threading** (instead of a single-threaded, event-loop system) because that is the only way to *scale*.

It comes with a lot of problems however, such as handling race-conditions and so on, but it was born out of necessity. [Why multithreading is scary](https://blog.codinghorror.com/threading-concurrency-and-the-most-powerful-psychokinetic-explosive-in-the-univ/)

Programming with threads is *hard* because:

- Our current programming models don't deal with concurrency well
- Most of the programming we do is linear in nature
- Programmers have a hard time thinking in terms of events than can interrupt each other at any time

**How does node make a non-blocking web server?**

1. Multiple requests come in (maybe concurrently)
2. The event loop handles them (single thread) since they are almost never blocked (due to delegation)
3. The event loop *delegates* them to one of the many ***posic async threads*** (independent processes, outside the node's single threaded JS engine execution)
4. These threads perform non-blocking I/O (Say, on the file system)
5. Once the I/O is complete, event loop is notified (callback runs) and request is responded to successfully.

**Blocking & Non-blocking code in Node**

Even though node is single threaded, it is possible to write *blocking* code in it. For example, `readFileSync` & `writeFileSync` are synchronous, blocking I/O operations. This might be okay while reading a single small file but is bad for multiple files or long files (time-consuming). Therefore, we must be careful to use non-blocking methods when working with expensive operations.

```js
const fs = require('fs')
const contents = fs.readFileSync('../some/file/path', 'utf-8') // Blocking! This can take very long!
console.log('printing...')
console.log(contents)
```

The *non-blocking* version of the above code will be:

```js
const fs = require('fs')
fs.readFile('../some/file/path', 'utf-8', (err, contents) => {
  if (err) return
  console.log(contents)
}) // Non-Blocking! Other parts of code can execute... Callback triggered only when contents become available!
console.log('printing...') // Synchronous part of code, so will execute before contents.
```

We can read multiple files in *parallel* and still be *non-blocking*:

```js
const fs = require('fs')
fs.readFile('../some/file/path', 'utf-8', (err, contents) => {
  if (err) return
  console.log('1: ', contents)
})
fs.readFile('../some/file/path', 'utf-8', (err, contents) => {
  if (err) return
  console.log('2', contents)
})
console.log('printing...')
```

*Node is typically much faster than other platforms (for I/O*).

**Other benefits of Node**

Backend and frontend code is in **one language** which enables:

1. *Faster* thinking
2. *Code reuse* across frontend and backend (utilities)
3. *Lesser* syntax related bugs

## Global and Process

Most of Node is Javascript. The data types are:

1. Objects (literals, arrays, functions, date, null, etc)
2. Strings
3. Numbers
4. Boolean
5. undefined
6. symbols (new in ES6)

**Differences with browser JavaScript**

1. There is no window object. Instead, the global object that is available throughout node applications is called **`global`** or **`GLOBAL`** and it has properties.
2. Some common properties of the global object are **`__filename`** and **`__dirname`** which can be accessed as is (without the `global` object reference). These get the absolute path to file and absolute path to directory, respectively.
3. In browser JavaScript, platform information is ***not*** available to you (OS, memory usage, file system, etc.) because of *security reasons*.
4. In Node however, we can access details of system processes using the **`process`** global property. Ex: `process.pid`, `process.versions`, `process.arch` (architecture of the platform like `x64`), `process.argv` (command line arguments), `process.argc`, etc.
5. We can also access the environment variables (Ex: $PATH, database/API keys, passwords, IP address, etc are stored). These are available as proeprties of the **`process.env`** object.
6. We can get the current working directory with **`process.cwd()`**.

**`process.cwd()` versus `__dirname`**

The cwd command returns the folder path from where the currently running node process *was launched from*.

The directory name command on the other hand provides the folder path where *the script that we are currently executing resides in*.

**Exiting a process**

We can exit from a current process with **`process.exit()`**

**Killing another process**

We can kill another process from ours with **`process.kill()`**

The above two are handy when talking about scalability and launching other processes.

**Note**

We can run the Node REPL and type `global`, `process`, etc. to view the objects and their properties.

## Event Emitters

Callbacks were the way to do async stuff earlier but it is bad - makes the code complex and leads to something known as **[callback hell](http://callbackhell.com/)**

ES6+ has provided us with promises, async/await, and generators to get over this problem. While these are finding acceptance in node, they are not entirely natively supported yet. They still use callbacks but in a different way.

Node has an **observer pattern** instead. It is called **Events**. The event emitter module is *built-in* and they are supported by most *core* modules. They are even present in most of the core modules in some form.

The event emitter system: There is a subject and multiple event triggers on it that other objects can subscribe to. 

To create an event emitter use the **`EventEmitter`** class from the `events` core module. On the instantiated emitter, we can use the **`on()`** method to listen to an event. To emit an event, we use **`emit()`** methods.

On modules that employ this event system, the emit and listeners are on different parts of code. For example, a library might employ the `emit` function and give you, the user of the library, access to the emitter so that you can listen to it using `on`.

```js
const events = require('events')
const emitter = new events.EventEmitter()
// Emitter is the subject that will trigger events

// We can latch onto the events with `on`:
emitter.on('knock', () => console.log('I heard you knock'))
emitter.on('knock', () => console.log('what do you want?')) // multiple listeners.

// Emitting events:
emitter.emit('knock')

/* Output:
I heard you knock
what do you want?
*/
```

Common events and their names are `done`, `end`, etc. (Depends on the event emitter module we are using).

Instead of **`on()`** method, we can also use **`once()`** to listen to an emitted event *only once*. It will not be called even if the event is emitted again (unlike in the case of `on`).

```js
emitter.once('knock', () => console.log('I heard you knock'))
//...
emitter.emit('knock')
emitter.emit('knock')
emitter.emit('knock')
//...

/*
Output:
I heard you knock
*/
```

If you want to pass data along with `emit`, you can pass it as the *second argument* to it.

```js
emitter.emit('knock', { some: 'data', object: 'passed', to: 'listener' })
```

We can use the method **`removeAllListeners()`** to remove all the subscribed listeners.

**Inheriting from an EventEmitter**

In case you are writing a library and want to provide an emitter, you may extend objects as emitter classes themselves.

Node comes with a **`util`** that helps you do many things such as `promisify` a callback, `inherits` from another class, etc. `inherits` takes in a class/constructor and another class/constructor. The first parameter inherits from the second parameter.

```js
// jobs.js
const util = require('util')

function Job() {}

Job.prototype.process = function() {
    this.emit('done', { isComplete: true })
}

util.inherits(Job, require('events').EventEmitter)

module.exports = Job
```

```js
// run.js
#!/usr/bin/env node

'use strict';

var Job = require('./job')
var job = new Job()

// Using it as an event emitter since it has inherited it.
job.on('done', data => {
    console.log('Job is done', data)
})

job.process()
```

```shell
$ node run.js
Job is done { isComplete: true }
```

**`EventEmitter` methods' list**

1. `emitter.listeners(eventName)` gives the currently subscribeed listeners for an event.
2. `emitter.on(eventName, listener)` attaches a new listener to an event. It is called whenever event is emitted.
3. `emitter.once(eventName, listener)` attaches a new listener to an event. It is called only the first time an event is emitted (after the listener subscribed to it).
4. `emitter.removeListener(eventName, listener)` removes a particular listener (using function reference) from an event that it has subscribed to.
5. `emitter.removeAllListeners(eventName)` removes all listeners for that event.

Apart from inheriting events there are many *design patterns in Node*. Some of them can be found [here](https://github.com/azat-co/node-patterns).

## Streams

If you want to process large amounts of data, it is not a good idea to do it all at once. For example, `readFile` tries to read the whole file at once, no matter hor small or big it is. Therefore, it can be very slow. Also, the entire buffer size is about a GB (?). Therefore, even a lot of memory is used at one time to process a file by bringing all of its contents into memory at once.

With streams, we can read or write in *chunks* (which are smaller segments of the entire data). They use small buffers (temporary storage areas) and when a chunk or multiple chunks fill up the buffer, they can send this buffer data across to the next destination.

With streams:

1. You can send data in chunks
2. Can process data as it comes, without having to wait for the entire transfer to finish
3. Perform efficient network calls, file I/O, etc as it conserves bandwidth and memory.

**Streams inherit from the `EventEmitter` class**

Since they inherit, we can treat streams as an observer pattern. The streams emit events about the progress of a stream. They also emit events that one another can listen to.

**Streams exist everywhere!**

1. HTTP requests and responses are streams
2. `process.stdin`, `process.stdout`, and `process.stderr` are streams
3. File read and write can be done using the streams `fs.createReadStream()` and `fs.createWriteStream()`

**There are four types of streams**

1. Read stream
2. Write stream
3. Duplex stream (can both read and write)
4. Transform: A special type of duplex stream that transforms input of one stream and provides a new stream

**Readable stream example**

`stdin` is a readable stream. We can pass input to it from the keyboard. The `data` event is triggered everytime it receives a chunk and the `end` event is triggered when the stream has finished.

We can set the encoding to `utf-8` (using the `setEncoding()` method) to process the chunk data from buffer as character (text) instead of binary data.

```js
process.stdin.resume() // todo: what is resume?
process.stdin.setEncoding('utf-8')

process.stdin.on('data', data => {
    console.log('chunk:', data)
})

process.stdin.on('end', () => {
    console.log('end')
})
```

**Paused and Flowing Modes of Readable Streams**

Readable streams have two main modes that affect the way we can consume them:

- They can be either in the **paused** mode
- Or in the **flowing** mode

Those modes are sometimes referred to as pull and push modes.

All readable streams start in the paused mode by default but they can be easily switched to flowing and back to paused when needed. Sometimes, the switching happens automatically.

When a readable stream is in the paused mode, we can use the `read()` method to read from the stream on demand, however, for a readable stream in the flowing mode, the data is continuously flowing and we have to listen to events to consume it.

In the flowing mode, data can actually be lost if no consumers are available to handle it. This is why, when we have a readable stream in flowing mode, we need a `data` event handler. 

In fact, just adding a `data` event handler switches a paused stream into flowing mode and removing the `data` event handler switches the stream back to paused mode. Some of this is done for backward compatibility with the older Node streams interface.

To manually switch between these two stream modes, you can use the `resume()` and `pause()` methods.

```js
// PAUSED READABLE STREAM:
// CAN USE THE `stream.read()` method

// FLOWING READABLE STREAM:
// CAN USE EVENT EMITTER EVENTS: `stream.on('data')`, `stream.on('end')`

// SWITCH FROM PAUSED TO FLOWING: stream.resume()

// SWITCH FROM FLOWING TO PAUSED: stream.pause()
```

**New interface `read()`**

This is a new way of working with a readable stream. The `read()` method of a readable stream fetches the stream but in a **synchronous** fashion. When the stream is over, the method returns `null`.

So, we can keep invoking it and it will return chunks of data everytime we invoke it. So we can loop over it to process all chunks of data until we get `null`.

```js
var readableStream = returnsAReadableStream()
readableStream.on('readable', () => {
    var chunk = readable.read()
    while (chunk !== null) {
        console.log('Chunk length:', chunk.length, ' | chunk:', chunk)
    }
})
```



**Note:**

When consuming readable streams using the **`pipe`** method, we don’t have to worry about these modes as `pipe` manages them automatically.

**Writable stream example**

**`stdout`** and **`stderr`** and writeable streams. We can even use `stdout.write()` method to put some data onto the standard output.

**Filesystem stream examples**

`fs.createReadStream(<file>, <encoding>)` creates a read stream from a file.

`fs.createWriteStream(<file>)` creates a write stream from a file.

**Piping**

Piping is similar to the POSIX pipe system. The `pipe()` method is defined on a readable stream like `stdin` and its destination (param) is a writable stream. It returns a readable stream so that `pipe()` method can be chained. In the middle of a pipe chain, we can use transform or duplex streams (act as both in and out streams).

```js
<readableStream>.pipe(<writeableStream)
// OR
<readableStream>
  .pipe(<transformStream)
	.pipe(<transformStream)
  .pipe(<writeableStream)
```

**Converting a chunk (buffer) into a string**

```js
chunkOrBufferDataInBinary.toString(/* 'utf-8' */)
```

[Read more about streams: Free code camp article](https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/)

Also try `npm i -g stream-adventure`

## Clusters

Clusters are used to take advantage of multicore systems. The number of nodes in the cluster can be equal to the number of CPUs. The core module **`cluster`** helps us with this task.

The cluster has a a **master-worker** relationship. One master spews off a few workers and these workers do a particular task such as running a web server.

Since the workers do the same task, they all share the burden. Therefore, it acts a sort of load balance. When you have mutliple workers running a web server on the same port, the requests get channeled almost evenly to each worker.

```js
const numCpus = require('os').cpus().length
const cluster = require('cluster')

if(cluster.isMaster) {
  // spawn the workers
  for (let i = 0; i < numCpus; i++) {
    cluster.fork() // creates workers (is from require('child_process').fork() originally)
  }
} else if (cluster.isWorker) {
  // Do something
  // Like start a web server.
}
```

**Spawn versus Fork versus Exec**

- `require('child_process').spawn()`: You can create non NodeJS process too (Ex: bash script). It can be used to process large data, you get the stream. *No* new V8 instance is created (Since it is not a new nodejs process).
- `require('child_process').fork()`: Forks any process (but only NodeJS processes). It uses the same NodeJS code (or new based on conditionals). It is a new V8 instance. Multiple workers are created this way.
- `require('child_process').exec()`: Use it for small commands. The reason is that it uses buffers and happens asynchronously. But, it also returns all the data at once after executing that process (no streams). Therefore, not good for heavy data tasks. 


---
