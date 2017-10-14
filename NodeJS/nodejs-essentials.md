# NodeJS Essentials

Node is built on Javascript an currently also supports some ES6 syntax. 

## NodeJS History

- **2009** - NodeJS created.
- **2011** - NPM created
- **2014** - io.js forked (Some developers were unhappy with NPM being controlled by a corporation)
- **Sept 2015** - Node v4.0 released (After a consensus between NPM and io.js communities to work as one)

## How NodeJS Applications Work?

Imagine there are two restaurants, an Apache Cafe and a Cafe Node. 

The Apache Cafe has one waiter assigned to each customer. When the customer orders something, the waiter places the order in the kitchen, to the Chef. This waiter does nothing else but waits there until the order is ready, not even taking other orders from the same customer. Once the chef has prepared the meal, it is served to the customer. The waiter is fired after the customer leaves because, according to the rules, there is one waiter for each customer and if customer is gone, the waiter is not needed anymore.

In contrast, the Cafe Node employs only one waiter for all of its customers. This waiter is super busy. Once an order is place, the waiter gives the information to the chef in the kitchen. But, in this cafe, the waiter does not wait for the chef to finish preparing that meal. Instead, he goes around looking to take new orders and coming back to give the chef those new orders (he does not wait for the chef to finish preparing a meal before taking other orders). The chef notifies him whenever a meal is ready and the waiter comes, takes it, and serves it to the customer who ordered it. After that, the waiter goes around either taking more orders and delivering more meals. Even though he is super busy, this restaurant is being managed better. We can even expand this cafe's business through franchise sytem.

The customer represents a request and the waiter represents a *thread*. Apache (i.e a traditional server) is multithreaded while Node is *single threaded*. So, every request in Apache has a thread attached to it while node has only one thread for all requests.

The chef represents the *file system/data store*. The thread in Apache has to wait for the data store to finish its task and does nothing else while waiting. This is called *blocking*. In node, the thread does not wait but instead takes requests and deliveris response in the order they appear, all the while continuing to take other requests. This is called *asynchronous* or *non-blocking* model, which is more efficient.

NodeJS is:

- Single-threaded
- All of the users are sharing the same thread
- Events are raised and recorded in an event queue and handled in the order that they were raised
- Hence, NodeJS has the ability to multi-task

## Node Core

Node has a global object known as `global`.

(Every javascript environment needs to have a global object. In browsers, it is the `window` object)

There are a lot of globally available objects in Node (accessible directly from the global namespace), some of the common ones are:

1. `global`
2. `process`
3. `console` - Similar to the console object in the browser (here, messages appear on the terminal)
4. `class::Buffer`
5. `require()`
6. `__filename`
7. `__dirname`
8. `module`
9. `exports`
10. `setTimeout` - Just like in the browser
11. `clearTimeout` - Just like in the browser
12. `setInterval ` - Just like in the browser
13. `clearInterval ` - Just like in the browser

Using any one of the above independently is the same as using them namespaced with the `global` object. For example, using `console.log` is the same as `global.console.log`.

Running a NodeJS file: type `node <filename>` in the CLI. Note that the `.js` file extension is optional (it is assumed to be a javascript file).

### Differences between browsers and NodeJS

While there are mostly similarities between the browsers and NodeJS in the way they work, there are some fundamental differences in their environments. One of the most important differences has to do with something known as *modules*.

In NodeJS, *every file* is a *module* of itself. The *variables* inside modules are *scoped to the module* and are accessible within it but are *not accessible from the global scope*. In the browser, had a variable been declared in a file (but not within an inner scope like a function) that was included in the page, it would be accessible as a property of the global object `window.<variableName>`

```javascript
// NodeJS Environment
// File: global.js
console.log('Logging with console object');

var hello = "Hello";
console.log(hello); // Hello (scoped to module)
console.log(global.hello); // undefined (variables in module are not scoped to global object)

// Run: `node global.js` or `node global`
```

**Note** that the globally scoped objects are, however, accessible from within modules.

There is *no difference* when it comes to the **javascript core** between the browser and NodeJS. This means that only the environment has changed but not javascript itself (both are built on javascript). Therefore, core functions such as Array, String, Object, etc methods are available to us in NodeJS as well.

We can even use some of the new ES6 syntax in NodeJS like arrow functions, template strings, etc.

## Commonly Used Global Objects

### `__dirname` and `__filename`

`__dirname` and `__filename` are two global properties that give the full path of the directory the file is in and the full path of the directory plus the file name that the file is in, respectively.

```javascript
console.log(__dirname);
console.log(__filename);

// Run `node app`
// Output:
// /Users/pushkardk/Desktop/nodeJSEssentials/Exercise Files/Ch03/03_01/start
// /Users/pushkardk/Desktop/nodeJSEssentials/Exercise Files/Ch03/03_01/start/global.js
```

There are built-in NodeJS modules, known as **core modules** (such as `fs`, `http`, `path`, `querystring`, `readline`, `stream`, `buffer`, `events`, etc) that are readily available with our installation of node. These will be discussed later but for now we can use the `path` module. This module provides methods that work with file and directory paths.

We use the globally available `require()` functionality to load a module into another module. Let's load `path` module:

```javascript
var path = require('path');

console.log(__dirname); // /Users/pushkardk/Desktop/nodeJSEssentials/Ex_Files_Nodejs_EssT/Exercise Files/Ch03/03_01/start

console.log(__filename); // /Users/pushkardk/Desktop/nodeJSEssentials/Ex_Files_Nodejs_EssT/Exercise Files/Ch03/03_01/start/global.js

console.log(path.basename(__filename)); // global.js
console.log(path.delimiter); // :

console.log(path.dirname(__filename)); // /Users/pushkardk/Desktop/nodeJSEssentials/Ex_Files_Nodejs_EssT/Exercise Files/Ch03/03_01/start

console.log(path.extname(__filename)); // .js

var obj = { dir: 'C:\\Users\\Refsnes', base: 'demo_path.js' };
console.log(path.format(obj)); // C:\Users\Refsnes/demo_path.js

console.log(path.isAbsolute(__filename)); // true
console.log(path.isAbsolute('test/demo_path.js')); // false

console.log(path.join('Users', 'Refsnes', 'demo_path.js')); // Users/Refsnes/demo_path.js

console.log(path.normalize('Users/Refsnes/../Jackson')); // Users/Jackson
```

| Few Methods of `path` | Description                              |
| --------------------- | ---------------------------------------- |
| basename()            | Returns the last part of a path          |
| delimiter             | Returns the delimiter specified for the platform.  `;` for Windows and `:` for POSIX |
| dirname()             | Returns the directories of a part        |
| extname()             | Returns the file extension of a path     |
| format()              | Formats a path object into a path string |
| isAbsolute()          | Returns true if a path is an absolute path, otherwise false |
| join()                | Joins the specified paths into one.  Specify as many path segments as you like |
| normalize()           | Normalizes the specified path.  Resolves the specified path, fixing '..','\\\\' etc. |
| parse()               | Formats a path string into a path object |
| posix                 | Returns an object containing POSIX specific properties and methods |
| relative()            | Returns the relative path from one specified path to another specified path |
| resolve()             | Resolves the specified paths into an absolute path |

### `process` object

The `process` object is available globally. It gives us information regarding the current process like what arguments does it have, methods to kill the process, etc.

The arguments to a process can be supplied from the **CLI**. They will get stored in an `Array` object referenced by `process.argv` (An actual array object and not array-like).

The first value in the array is always the path to the node file (since it is this process that starts everything). If we are running a file from node then the second value in the array is the file's path.

```javascript
// app.js:
console.log(process.argv);

// Run: `node app abc 123`
// Output:
// [ '/usr/local/bin/node',
// '/Users/pushkardk/Desktop/practice-node/app.js',
// 'abc',
// '123' ]
```

An example that fetches arguments based on flags supplied to the app:

```javascript
// app.js:
function grabFlag(flag) {
	var index = process.argv.indexOf(flag);
	return (index === -1) ? null : process.argv[index + 1];
}

var user = grabFlag('--user');
var greeting = grabFlag('--greeting');

if(!user || !greeting) {
	console.log('You did not supply both arguments');
} else {
	console.log(`Welcome ${user}, ${greeting}`);
}

// Run: `node app --user Ram --greeting 'how are you?'`
// Output:
// Welcome Ram, how are you?
```

`process.argv` is useful in the beginning when you want to set the port & defaults that the app should use.

#### `process.stdout` and `process.stdin`

The standard input and standard output objects are properties of the process object. We have already used them in our code implicitly. That is, `console.log` uses the `stdou` object (which is the terminal screen by default).

```javascript
process.stdout.write('Hi! ');
process.stdout.write('How are you?');

// Run `node app`
// Output:
// Hi! How are you?(11:52 AM) ~/Desktop/practice-node\➤ 
```

Methods and listeners on the `stdout` & `stdin` objects:

- `process.stdout.write(string)` : The `write` method writes strings to the standard output. The point to note here is that it *does not* automatically add `\n` at the end of every write operation, we have to do that manually.

```javascript
process.stdout.write('Hi! ');
process.stdout.write('How are you?');
process.stdout.write('\n');

// Run `node app`
// Output:
// Hi! How are you?
// (11:52 AM) ~/Desktop/practice-node\➤  
```

- `process.stdin.on(type, callback)` : The `stdin` object has a listener called `on` and the most common event it listens to is the `data` event. This `data` event is fired whenever user types something on the terminal and hits enter (`\n`) (one line of data). The captured data is available in the callback as the first argument. This captured data in the callback needs to be converted to a string (`toString()`) before it can be displayed.

There is one more listener, this time on the `process` object itself and it listens for the  `exit` event that is triggered just before the process can exit via the `process.exit()` call.

Note that listeners work asynchronously, meaning that they wait for something to happen. Because of this, as long as listeners are active, the app process does not return control to the terminal but keeps running. To explicitly exit a process we can call the `process.exit()` function.

```javascript
// app.js:
var questions = [
		'What is your name?',
		'Where are you from?',
		'Where do you work?'
	],
	answers = [];

// Start asking (with the first question):
ask(0);

// ***************************

function ask(index) {
	process.stdout.write(`${questions[index]}\n> `);
}

// Runs CB everytime user inputs data and hits enter(`\n`):
process.stdin.on('data', function(data) {
	answers.push(data.toString().trim()); // converting to strign and trimming extra spaces
	// Decide if we need to ask more questions/not:
	if(answers.length < questions.length) {
		ask(answers.length);
	} else {
		process.exit(); // exit process (no need for listener sicne everything has been asked)
	}
});

// Runs CB just before actual process exit (via `process.exit()`):
process.on('exit', function() {
	console.log(`Your Answers:`);
	console.log(`${answers.join(' | ')}`);
});

// Run: `node app`
// Output:
// What is your name?
// > Pushkar
// Where are you from?
// > Bangalore
// Where do you work?
// > MySmartPrice
// Your Answers:
// Pushkar | Bangalore | MySmartPrice
```

**Note:** 

1. Listeners work *asynchronously* in NodeJS.
2. To forcefully exit a waiting process use `<ctrl-c>` or `<ctrl-d>`.
3. `process.stdout` has two other useful methods called **`clearLine()`** and **`cursorTo(0)`**. Invoking `clearLine` (no params required) will clear the last line that was output to the terminal while invoking `cursorTo` with `0` place the cursor on the *beginning of that line* in terminal. A useful example of their usage can be seen in the next section (Global timing functions).

### Global Timing Functions `setTimeout` and `setInterval`

`setTimeout` and `setInterval`  are *globally available* functions. Apart from listeners, the `setTimeout` and `setInterval` functions are the other two *asynchronous* constructs in NodeJS. These work here in NodeJS just like they work in the browser (no difference).

```javascript
var waitTime = 3000; // Times for setTimeout/setInterval need to be in MILLISECONDS

console.log('Wait 3 seconds...');

setTimeout(function() {
	console.log('DONE');
}, waitTime);

// Run: 'node app'
// Output:
// Wait 3 seconds...
// DONE  [Displayed after 3 seconds]
```

- `setTimeout` : It is used to execute a callback function after a specified amount of time (in milliseconds).  It executes callback only once and it is done. But, if you still wish to clear the time-out, refer to `clearTimeout`.


- `setInterval` : It is used to execute a callback periodically. And, since it is a listener it will continue to wait during each interval (and again till the next interval, forever). At some point, we will have to clear it (or the process will *not* exit). So, we use `clearInterval()`.  `clearInterval()` requires the `id` that is returned by `setInterval` which is why we assign `setInterval` to a variable and pass that variable to `clearInterval`.

```javascript
var waitTime = 3000,
	waitInterval = 500,
	currentTime = 0;

var interval = setInterval(function() {
	currentTime += waitInterval;
	writeWaitingPercent(Math.floor((currentTime / waitTime) * 100));
}, waitInterval);

setTimeout(function() {
	clearInterval(interval);
	console.log('\nDONE');
}, waitTime);

// ******************

function writeWaitingPercent(p) {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(`Waiting ... ${p}%`);
}

// Run: 'node app'
// Output:
// Waiting ... 16% [Keeps increasing until 3 second mark]
// DONE  [Displayed after 3 seconds]
```

The above example made use of `process.stdout.clearLine` which clears the previous output line and `process.stdout.cursorTo(0)` which places the cursor at the beginning of the line.

## Modules

There are three types of modules in NodeJS

1. **Core** Modules
2. **Custom** Modules
3. **NPM** Modules

### Core Modules

Core modules come installed with our installation of NodeJS itself. We use `require()` to include these modules in our app and we only need to supply the name of these modules (extension not required).

The core modules are defined within Node.js's source and are located in the `lib/` folder. We need not add the whole path to the `lib/` directory of the node installation folder - just the name suffices since node will check that folder automatically.

Some of the popular core modules are: `path` (already seen) , `util` (It is similar to `console` except that `util.log` will output the timestamp as well) and `v8` (It represents the v8 javascript engine on top of which NodeJS has been built).

```javascript
// core.js:
var path = require('path');
var util = require('util');
var v8 = require('v8');

util.log(path.basename(__filename));
util.log('Util has timestamps in the console');
util.log(v8.getHeapStatistics());

// Run: `node core`
// Output:
// 8 Oct 13:23:40 - core.js
// 8 Oct 13:23:40 - Util has timestamps in the console
// 8 Oct 13:23:40 - { total_heap_size: 6291456,
//   total_heap_size_executable: 3145728,
//   total_physical_size: 5715504,
//   total_available_size: 1493337352,
//   used_heap_size: 4445968,
//   heap_size_limit: 1501560832,
//   malloced_memory: 8192,
//   peak_malloced_memory: 5079792,
//   does_zap_garbage: 0 }
```

#### `readline` Module

`readline` is a core module that makes it easy to ask questions and take in answers. We have already seen the `stdout` and `stdin` properties of the `process` global object and `readline` is a wrapper around these items (facade?). 

[Read the `readline` documentation](https://nodejs.org/api/readline.html#readline_event_line)

`readline` is a module and from the module we need to instantiate the interface that wraps the standard input and output objects. This is done using the `createInterface()` method. To ask the user a question, we use the `question` method which takes the question as first param with a callback as the second. The user's response is available as first param to the callback (as a string). Here is an example:

```javascript
// readline.js:
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

rl.question('What is your name?', function(name) {
	console.log(name);
	rl.close();
});

// Run: `node readline`
// Output
// What is your name?Pushkar
// Pushkar
```

`close()` method needs to be called to turn off the `readline` listeners (like `question`). Otherwise, the process won't end (you will need `<ctrl-c>`).

There are two more commonly used methods: `prompt()` and `setPrompt()`. The first one prompts the user for a new response on a new line and the second sets the message for the prompt. We can use the combination of these two to create an interactive CLI for the user. The `prompt` is *not* a listener, so when you prompt the user for a response, you need a listener to capure user input. We have the `on` listener with the `line` event that it listens to and can be used to capture the new responses (It is a basic listener and similar to `question` since it also has a callback with the answer passed to it).

```javascript
// readline.js:
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

rl.question('What is your name? ', function(name) {
	console.log(name);
	rl.setPrompt('What do you want to say? ');
	rl.prompt();
	rl.on('line', function(saying) {
		if(saying.toLowerCase().trim() === 'exit') {
			rl.close();
		} else { 
			console.log(saying);
			// further prompts:
			rl.setPrompt('What else do you want to say? (\'exit\' to leave) ');
			rl.prompt();
		}
	});
});

// Run: `node readline`
// Output
// What is your name? Pushkar
// Pushkar
// What do you want to say? Hi
// Hi
// What else do you want to say? ('exit' to leave) Bye
// Bye
// What else do you want to say? ('exit' to leave) exit
```

We can also listen to the `close` event. We can place a callback that can do something just before `readline` actually closes.

```javascript
rl.on('close', function() {
	console.log('Bye!');
	process.exit(); // Optional/Explicit:
	// (It will automatically exit if no other listeners are attached to the app)
});
```

`readline` makes it easier to prompt users without dealing with the complexities of `stdin` and `stdout`.

#### `events` Module

The `events` module is another core module in NodeJS. It is an implementation of the *publisher-subscriber* (PubSub) design pattern. We have used it whenever we have implemented the `on` listener.

Creating custom event emitters and listeners:

- `events` is a constructor, so we need to instantiate the event emitter with `new events.EventEmitter()`
- Use the `on` method to listen to events. First parameter is the name of the event and second is a callback with parameters that the event passes to it.
- Use the `emit` method to emit events. First parameter is the name of the event and the rest are the parameters to be passed to the listeners.

```javascript
// events.js
var events = require('events');
var emitter = new events.EventEmitter();

emitter.on('customEvent', function(param1, param2, param3) {
	console.log(param1, param2, param3);
});
emitter.emit('customEvent', 'this is param 1', 'this is param 2', 300);

// Run: `node events`
// Output:
// this is param 1 this is param 2 param 300
```

Events are generally not used standalone. A common pattern is to inherit the event emitter into custom objects and emit and listen to events from this custom object. We can use ES6 `class` to extend the event emitter on an object (Note that you will have to call `super()` in the `contructor` so that the parent class constructor is executed first). 

The non-ES6 way of doing it would be to use `util` module that has an `inherits` method. Also, the **prototypal** way of inheriting should work too (if you do *not* want to use `util`)!

```javascript
// events.js
var EventEmitter = require('events').EventEmitter;

class Person extends EventEmitter {
	constructor(name) {
		super();
		this.name = name;
	}
}

// Alternate: Non-ES6 way using `util`
// var util = require('util');
// function Person(name) {
// 	this.name = name;
// }
// util.inherits(Person, EventEmitter);

var pushkar = new Person('Pushkar');
pushkar.on('speak', function(said) {
	console.log(`${this.name} said: ${said}`);
})
pushkar.emit('speak', 'Hi there!');

// Run: `node events`
// Output:
// Pushkar said: Hi there!
```

 **Note:** All listeners and emitters (events) work **asynchronously**.

#### `child_process` Core Module

The `child_process` module contains utilities to create or execute commands as child processes.

- Executing child processes
- Spawning/Killing child processes

We can use `exec()` command to execute terminal commands such as `ls`, `open <path>` (opens path in finder/explorer), `open http://<url>` (opens path in default browser), `open -a Terminal <path>` (opens new terminal with path as pwd).

```javascript
var exec = require('child_process').exec;

exec('open -a Terminal ~'); // opens a new terminal with pwd being home folder(~)
```

The output of the commands are not seen in the terminal (since they are executed via a parent process) but is available to the parent process in the `exec`'s callback function (2nd param).

exec()` has two parameters: First is the command to execute (in a string) and second is a callback function. The callback also has two parameters, one is the error object (if any error occurs during execution of that command) and the other is the stdout object containing the output of that command we ran.

```javascript
// childprocs.js:
var exec = require('child_process').exec;

exec('ls', function(err, stdout) {
	if(err) throw err;
	else {
		console.log('listing done!');
		console.log(stdout);
	}
}); // runs ls command to list files

// Run 'node childprocs'
// Output:
// listing done!
// app.js
// childprocesses.js
// core.js
// events.js
// lib
// readline.js
// stdinout.js
```

`exec` is good for commands that are short and synchronous. What about commands that have *long outputs, are on-going or execute asynchronously*? `exec` is *not* sufficient for those type of commands. We need to use another method called **`spawn`**.

`spawn` will execute commands (as child processes). It runs the command and any other commands that need to be run are placed in an array as the second argument.

The spawn object has the `stdout` and `stdin` properties so we can listen to the outputs of the child processes line-by-line and even pass in data to them via the `stdin`. An example:

```javascript
// alwaysTalking.js:
var sayings = [
    "You may delay, but time will not.",
    "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    "It takes many good deeds to build a good reputation, and only one bad one to lose it.",
    "Early to bed and early to rise makes a man healthy, wealthy and wise.",
    "By failing to prepare, you are preparing to fail.",
    "An investment in knowledge pays the best interest.",
    "Well done is better than well said."
];

var interval = setInterval(function() {
	var i = Math.floor(Math.random() * sayings.length);
	process.stdout.write(`${sayings[i]} \n`);
}, 1000);

process.stdin.on('data', function(data) {
	console.log(`STDIN Data Recieved -> ${data.toString().trim()}`);
    if(data.toString().trim() === 'stop') {
        clearInterval(interval);
    	process.exit();
    }
});

// *******************************

// spawn.js
var spawn = require("child_process").spawn;

var cp = spawn("node", ["alwaysTalking"]);

cp.stdout.on("data", function(data) {
	console.log(`STDOUT: ${data.toString()}`);
});

cp.on("close", function() {
	console.log("Child Process has ended");
	process.exit();
});

setTimeout(function() {
	cp.stdin.write("stop");
}, 4000);

// *******************************

// Run `node spawn.js`:
// STDOUT: It takes many good deeds to build a good reputation, and only one bad one to lose it. 
// STDOUT: It takes many good deeds to build a good reputation, and only one bad one to lose it. 
// STDOUT: It takes many good deeds to build a good reputation, and only one bad one to lose it. 
// STDOUT: STDIN Data Recieved -> stop
// Child Process has ended

```

#### `url` Core Module

The URL module *splits* up a web address into *readable* parts.

Parse an address with the `url.parse()` method, and it will return a URL object with each part of the address as properties:

```javascript
var url = require('url');
var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

console.log(q.host); //returns 'localhost:8080'
console.log(q.pathname); //returns '/default.htm'
console.log(q.search); //returns '?year=2017&month=february'

var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
console.log(qdata.month); //returns 'february'
```

All the parts of the URL are listed in the diagram below:

![Parts of a URL](http://www.tom-mccluskey.com/wp-content/uploads/2014/06/nodeurl.png)

The *optional* second parameter to `url` is the `parseQueryString` parameter. If `true`, the `query` property will always be set to an object returned by the `querystringc` module's `parse()` method (The `querystring` module provides utilities for parsing and formatting URL query strings). If `false`, the `query` property on the returned URL object will be an unparsed, undecoded string. Defaults to `false`.

```javascript
var url = require('url');
// ...
// Assume request is the request object to our http server and it has a url property:
var url_parts = url.parse(request.url, true);
// ...
var id = url_parts.query.id; // $_GET["id"]
```

### Custom Modules

We can write our own modules in NodeJS apart from the core ones available to us. *Every file in NodeJS is a module.* You can relate the contents of the file to be the private methods and properties of the *module pattern* that is commonly used. Only whatever needs to be made available as a public API gets exported.

NodeJS uses the `CommonJS` library style of requiring modules. The `require` function that we used so far is an example of that.

- Requiring a module (file): Use `require(<path-to-file>)`
- Exporting from modules (Public API): Use `module.exports`. `module.exports` is like *any other javascript object* (It can be assigned to a function or a string or number, and obviously is an object so it can have properties and methods as well).
- We *need not* require the module's whole public API. Instead, we can include only what we want. For example, if a module (an object) contains two methods, say something like `Emitter` and `Logger`, and we want `Emitter` to get our job done, we can include only the `Emitter` property like so: `var Emitter = require(<path-to-file>).Emitter`.

```javascript
// lib/person.js:
function Pushkar(name) {
	this.name = name;
}

module.exports = Pushkar;

// *******************************

// app.js:
var Person = require('./lib/person');

var pushkar = new Person('pushkar');
console.log(pushkar.name);

// *******************************

// Run `node app`
// Output:
// pushkar
```

## The File System

The `fs` module (core) allows us to interact with the file system.

```javascript
// filesystem.js
var fs = require('fs');

var files = fs.readdirSync('.');
console.log(files);

// Run `node filesystem`:
// Output:
// [ 'alwaysTalking.js',
//   'app.js',
//   'childprocesses.js',
//   'core.js',
//   'events.js',
//   'filesystem.js',
//   'lib',
//   'readline.js',
//   'spawn.js',
//   'stdinout.js' ]
```

Every `fs` method can be written in **two** ways: Asynchronously and synchronously. The `readdirSync` is the synchronous version of the read directory functionality. That means, the directory listing must be available before we log it to console (**blocking**).

Removing the suffix `Sync` from the `fs` methods will execute the asynchronous, non-blocking version of the method which has a *callback* attached to it. For example, `readdir` is the asynchronous version of `readdirAsync`.

The general syntax for **synchronous `fs`** calls:

```javascript
var fs = require('fs');
var holdsReturnedVal = fs.<methodName>Sync(<comma-sep-arguments>);                                         
// Ex:
// var content = fs.readFileSync('./src/rivers.txt', 'UTF-8')
```

The general syntax for **Asnychronous `fs`** calls:

```javascript
var fs = require('fs');
fs.<methodName>(<comma-sep-arguments>, callback); // callback(<error-obj>, <params>)
// Ex:
// fs.readFile('./src/rivers.txt', 'UTF-8', function(err, content) {
// 		console.log(content);
// });
```

### `readdir`

The `readdir` function *lists* *files* and *sub-directories* in a specified directory. Sub-directories do not have file extensions (and even hidden files are listed). `readdir` returns an array of the files it contains.

```javascript
// filesystem.js
var fs = require('fs');

fs.readdir('.', function(err, files) {
  	if(err) throw err;
	console.log(files);
});

console.log('Reading files...');

// Run `node filesystem`:
// Output:
// Reading files...
// [ 'alwaysTalking.js',
//   'app.js',
//   'childprocesses.js',
//   'core.js',
//   'events.js',
//   'filesystem.js',
//   'lib',
//   'readline.js',
//   'spawn.js',
//   'stdinout.js' ]
```

### `readFile`

This method allows us to read files. In order to read *text* files, we need to pass as second argument the text encoding (first argument is path to file).

If we do not pass an encoding parameter, the file is read as *binary* by default. The returned data is a *buffer*.

```javascript
// filesystem.js
var fs = require('fs');

fs.readFile('./lorem.txt', function(err, content) {
	if(err) console.log(err);
	console.log(content);
});

// Run `node filesystem`:
// Output:
// <Buffer 4c 6f 72 65 6d 20 69 70 73 75 6d 20 64 6f 6c 6f 72 20 73 69 74 20 61 6d 65 74 2c 20 63 6f 6e 73 65 63 74 65 74 75 72 20 61 64 69 70 69 73 69 63 69 6e ... >
```

```javascript
// filesystem.js
var fs = require('fs');

fs.readFile('./lorem.txt', 'utf-8', function(err, content) {
	if(err) console.log(err);
	console.log(content);
});

// Run `node filesystem`:
// Output:
// Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
// tempor incididunt ut labore et dolore magna aliqua. 
// Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
// consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ...
```

**Note:** 

- Logging the error does not kill the process, but throwing an error does kill it (stops execution of everything).
- Errors are *automatically thrown* when using the *synchronous* versions of the `fs` methods.


- Get stats of a file or directory: Use `fs.stat()` or `fs.statSync()`. It returns an object (or as param in callback) which contains methods such as `isFile(<path>)` (which tells if file is not a directory).

### `writeFile`

This method *writes* content to a file (*overwrites* existing content). The first parameter is the name of the file to be written (along with the extension), second is the content, and third is the callback.

```javascript
// filesystem.js
var fs = require('fs');

var list = [
	'Delhi',
	'Bangalore',
	'Mumbai',
	'Hyderabad',
	'Chennai',
	'Calcutta'
];

fs.writeFile('list.txt', list.join('\n'), function(err) {
	if(err) console.log(err);
	else console.log('File written');
});

// Run `node filesystem`:
// Output:
// File written

// **********************

// Contents of 'list.txt':
Delhi
Bangalore
Mumbai
Hyderabad
Chennai
Calcutta
```

`writeFile` *creates* the file if it does not exist. If the file exists, its contents are rewritten with the new (supplied) content.

### `appendFile`

This module *appends* data to files. `appendFile` also creates the file if it does not exist (and puts the content into it like in `writeFile`). If file exists, it appends the data below/after the existing data.

```javascript
// filesystem.js
var fs = require('fs');

var Extendedlist = [
	'Agra',
	'Mysore',
	'Madurai',
	'Mangalore'
];

fs.apppendFile('list.txt', list.join('\n'), function(err) {
	if(err) console.log(err);
	else console.log('List appended!');
});
```

**Note:** Depending on the case, we would be using either the asynchronous or the synchronous versions of the `fs` methods. For example, if you are looping through data that needs to be written line by line (in order) into a file then you would use the synchronous version `writeFileSync` for the first write because otherwise if the subsequent `appendFile` runs before the write it would throw errors.

### `mkdir`

It is used to *create* directories.

```javascript
// mkdir.js:
var fs = require('fs');

fs.mkdir('src', function(err) {
	if(err) console.log(err);
	else console.log('Directory Created');
});
```

### `exists`

We can check if a file *exists* with `exists` method. But, it is more common to use its synchronous version since it can be used inside if statements (`existsSync`).

```javascript
// mkdir.js:
var fs = require('fs');

if(fs.existsSync('src')) {
	console.log('File already exists.');
} else {
	fs.mkdir('src', function(err) {
		if(err) console.log(err);
		else console.log('Directory Created');
	});
}
```

### `rename`

This method allows us to *rename* files. The synchronous version is `renameSync`. This method takes two parameters, the name (or path) of the file and the new name of the file.

The rename function also acts as the *move* (`mv` in CLI) function. If we rename the file to a different location then it gets moved to that location.

```javascript
// rename.js:
var fs = require('fs');

fs.renameSync('list1.txt', 'extendedList.txt');
console.log('list1 has been renamed');
fs.rename('lorem.txt', 'lib/lorem.txt', function(err) {
	if(err) console.log(err);
	else console.log('lorem.txt has been moved to lib folder');
})
```

### `unlink`

`unlink` is a method used to *remove* a file. Its synchronous version is `unlinkSync`.

**Note**: If we want to handle errors thrown automatically during synchronous calls then we should use a `try {...} catch(err) {…}` block.

```javascript
var fs = require('fs');

try {
	fs.unlinkSync('list.txt');
} catch(e) {
	console.log('Error removing list.txt: ', e);
}

fs.unlink('lib/lorem.txt', function(err) {
	if(err) console.log('Error removing lib/lorem.txt: ', err);
	else console.log('lorem.txt has been deleted from lib folder');
});
```

#### Renaming (Moving) & Deleting Directories

- We can use the same `rename` method of `fs` to *rename or move directories*.
- `rmdir` method can be used to *remove directories* that **empty** (Remember that for files it was `unlink`!)

```javascript
var fs = require('fs');

fs.renameSync('./src', './lib/source');

fs.rmdir('tmp', function(err) {
	if(err) console.log(err); // tmp must be an empty directory, else an error is thrown.
	else console.log('tmp removed!');
});
```

**Deleting a non-empty directory:** We must first delete all the files that the directory contains and then delete the directory itself (which is empty by then).

```javascript
var fs = require('fs');

fs.readdirSync('lib').forEach(function(file) {
	fs.unlinkSync('./lib/' + file);
});

fs.rmdir('lib', function(err) {
	if(err) console.log(err);
	else console.log('lib removed!');
});
```

### Streams of Data in NodeJS

Reading small files with `readFile` is fine but with **large** ones (such as file containing a chat log) it becomes an issue because:

- Any large file that is being read will cause a *latency* in reading it (async or sync)
- All the content of the file is usually stored in one variable - occupies *too much memory* and will probably slowdown processing.

For reading large files, we can use **streams**. We have been using streams already - the `process.stdout` and `process.stdin` are using the write and read streams, respectively. The `write()` method of `stdout` will input chunks of data to the terminal while the `on('data')` method of `stdin` will capture chunks of data from the console.

#### `createReadStream`

This method on the `fs` module is used to create a readable stream. It is similar to `readFile` in syntax: First param is the file name while an optional second parameter specifies the encoding (if you wish to read the data as text and not binary).

The `createReadStream` object has a few listeners:

- `on('data')` listens to data from the stream as it arrives in chunks
- `once('data')` listens to the first time that data from the stream starts arriving
- `on('end')` listens to the end of the read stream (i.e when the last chunk of data has arrived)

Readable stream example:

```javascript
// readstream.js:
var fs = require('fs');

var stream = fs.createReadStream('list1.txt');

stream.once('data', function() {
	console.log('Started reading file ...');
});

stream.on('data', function(chunk) {
	console.log(`Chunk arrived, length = ${chunk.length}`);
});

stream.on('end', function() {
	console.log(`... Finished reading file`);
});

// Run 'node readstream':
// Output:
// Started reading file ...
// Chunk arrived, length = 65536
// Chunk arrived, length = 65536
// Chunk arrived, length = 42032
// ... Finished reading file
```

#### `createWriteStream`

It is used to write data using a write stream. It returns a write stream object that can call the `write()` method and `close()` or `end()` to close the stream.

```javascript
var fs = require('fs');

var stream = fs.createWriteStream('list1.txt');

stream.write('Random text');
stream.close();
```

## `http` Module

The `http` module is used to construct a web server, make requests to servers, handle responses from them, etc.

There is a very similar module to `http` and it is `https`. The only difference being that we must produce the `ssl` certificate if we are building a server using the `https` module, for everything else it is the same.

This module comes with a `request()` function (async). This function makes a request to a server. First parameter is the options object (`hostname`, `port` - **80** for http/**443** for https, `path`, `method`). The second parameter is a callback function which receives the *response* object.

The response object is a **stream**. It delivers data in chunks. We can get the status code of the response using the `statusCode` property and the response headers are available using `headers` property (in *json* format).

To read the response in text format, we have to set the encoding before data starts arriving. `setEncoding('utf-8')` (*utf-8* is common). The data, when it arrives can be listened to using the stream listeners `on('data')`, `once('data')`, `on('end')`, etc.

The `request()` method, apart from doing all of the above, returns an object. This object can listen to errors (if any) during the request operation(`on('error')`). In the end, we have to end the request to that server, so we call `end()` method on the request object.

**1. Making requests:**

```javascript
var https = require('https');
var fs = require('fs');

var options = {
	hostname: 'en.wikipedia.org',
	port: 443,
	path: '/wiki/George_Washington',
	method: 'GET'
};

// https.request() returns an object that has listeners to any errors, etc.
var req = https.request(options, funiction(res) {
	// In http(s) request, we receive the response in the callback
	// response (res) is a "stream".
	var responseBody = '';

	console.log('Server responded.');
	console.log(`Server Status: ${res.statusCode}`);
	console.log('Response Headers: %j', res.headers); // headers are in json format (%j)

	res.setEncoding('UTF-8'); // to read the data as a piece text! (not binary) 

	res.once('data', function(chunk) {
		console.log(chunk); // log the first chunk
	});
	res.on('data', function(chunk) {
		console.log(`--chunk-- : ${chunk.length}`); // log each chunk's length
		responseBody += chunk;
	});
	// Listen to the 
	res.on('end', function() {
		fs.writeFile('george-washington.html', responseBody, function(err) {
			if(err) throw err; 
			else console.log('File Downloaded');
		});
	});
});

// If there is any error with our request, handle it:
req.on('error', function(err) {
	if(err) console.log(`Problem with request: ${err}`); 
});

// End the request (explicitly):
req.end();
```

**2. Building a web server:**

We can build a web server with either the `http` core module or `https`. In the case of `https` we need to set the `key` and `cert` options for ssl (see these references: [Doc](https://nodejs.org/api/https.html) , [Tutorial](https://www.sitepoint.com/how-to-use-ssltls-with-node-js/)).

The `http` module (or `https`) comes with a `createServer()` method. It creates a server and takes in a callback function. The callback function has access to two parameters, request and response. Request refers to the request that was made (it contains details such a url or method and body, etc). Response refers to the reply of the server to the request (at the beginning of the callback execution, it is an empty string).

Inside the callback, we can start writing the response. First, we set the headers with `header()` method. This method specifies the status code (first param) - 200 for OK. And, it specifies all the other header properties in a javascript object. We don't have to mention all the properties but the most commonly used header is the `Content-Type` which specifies the type of the response being sent. 

When we actually want to send the response data to the client, we call the `end()` method. This method ends the response to the client with whatever data it is to respond with (data sent as a parameter to the method).

`createServer()` also returns an object with a `listen()` method that listens to requests on a port that is specified. Alternatively, we could chain the `listen` method to `createServer` without assigning it to a variable first (Ex: `http.createServer(cb).listen(port)`).

```javascript
var http = require('http');
var server = http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-Type' : 'text/plain' });
	res.end('Hello world');
});

server.listen(3000);
console.log('Server is listening on port 3000');
```
**Note:** The `createServer()`  method (in the current setup) listens to *all the requests*. That means, a request to either `/` or `/lib/style.css` both will be handled by the callback to `createServer` . Inside this, we must segregate the requests if required (using the request object properties such as `url` and `method`).

```javascript
var http = require('http');
var server = http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-Type' : 'text/html' });
	res.end(`
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<title>HTTP Server Example</title>
		</head>
		<body>
		Request Stats:<br>
		Url: ${req.url}<br>
		method: ${req.method}
		</body>
	</html>
	`);
});

server.listen(3000);
console.log('Server is listening on port 3000');

// Run in browser: 'localhost:3000'
// Browser Output:
// Request Stats:
// Url: /
// method: GET
```

**3. Serving Files From The Web Server**

On other platforms such as Apache or Nginx, static files are served automatically from the `www` or `htdocs` or `public` folder. In NodeJS, we must create a file server ourselves. We will need the `http` (or `https`) modules as well as the `fs` module.

Based on the url of the request, we can serve up files. We can use the `readFile` method available in `fs` and serve all static files from a folder called `public` (it can be named anything, we will store all our static files there).

```javascript
var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function(req, res) {
	console.log(`${req.method} request for ${req.url}`);
	if(req.url === '/') {
		fs.readFile('./public/index.html', function(err, html) {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(html);
		});
	} else {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('404 Page not found');
	}
}).listen(3000);

console.log('Serving files from port 3000');

// Console output on visiting 'localhost:3000':
// Serving files from port 3000
// GET request for /
// GET request for /style.css
```
Once we load an `html` file, requests are usually made to fetch the supplementary css, script and image files. These requests need to be handled too.

Using the `readFile` method was fine for small files, but for large files it poses the same problems as earlier. That is, if the file is large then it causes a huge latency and memory consumption could hit the roof. Therefore, we could make use of **streams**. For serving files, we can create a *read stream*. The *response* object is a *write stream* itself. We can **pipe** the chunks of data being read from the read stream into a write stream. A method called `pipe` exists on every read stream and we pass it a write stream object which will handle the chunks of data. 

We can pipe the chunks of data from the read stream into the response object as follows (it will automatically send the response upon piping):

```javascript
var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function(req, res) {
	console.log(`${req.method} request for ${req.url}`);
	if(req.url === '/') {
		fs.readFile('./public/index.html', function(err, html) {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(html);
		});
	} else if(req.url.match(/.css$/)) {
		var cssPath = path.join(__dirname, 'public', req.url);
		var fileStream = fs.createReadStream(cssPath, 'UTF-8');
		res.writeHead(200, { 'Content-Type': 'text/css' });
		fileStream.pipe(res);
	} else if(req.url.match(/.jpg$/)) {
		var imagePath = path.join(__dirname, 'public', req.url);
		var fileStream = fs.createReadStream(imagePath); // Read images as binary data (not text)
		res.writeHead(200, { 'Content-Type': 'image/jpeg' });
		fileStream.pipe(res);
	} else {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('404 Page not found');
	}
}).listen(3000);

console.log('Serving files from port 3000');

// Console output on visiting 'localhost:3000':
// Serving files from port 3000
// GET request for /
// GET request for /style.css

// This time all the files are served because we handled each case.
```

**Note:** Creating a fully functional file server involves quite a lot of code since each case needs to be handled. (We will see later how the `express` framework simplifies this).

**4. Serving JSON Data**

If we are building an API (say, a RESTful API) then we want to send json data for every request. Any client that can make an http request will make one to our server and we respond with just data (No html, etc) and the format is **json**.

This method is a *great way to pass data to and from the client*.

An example of serving **json** data from a file containing it:

```javascript
var http = require('http');

var jsonData = require('./data.json'); // extension is optional
// Note that we can require 
http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/json'});
	res.end(JSON.stringify(jsonData)); // we must convert the json to a string with stringify before sending in response (response expects a string).
}).listen(3000);
console.log('Server listening on port 3000');
```

The ability to create json APIs is a powerful feature of NodeJS. We can create *middle-tier* web applications to communicate with the clients. A better example of supplying different data based on different requests is as follows:

```javascript
var http = require('http');

var jsonData = require('./data.json'); 
// jsonData is a json object - So we can treat it as objects/arrays.

http.createServer(function(req, res) {
	if(req.url === '/') {
		res.writeHead(200, { 'Content-Type': 'text/json' });
		res.end(JSON.stringify(jsonData));
	} else if(req.url === '/batters') {
		sendBatters(res);
	} else if(req.url === '/toppings') {
		sendToppings(res);
	} else {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('404 - Bad Request');
	}
}).listen(3000);
console.log('Server listening on port 3000');

// ***************

function sendBatters(res) {
	var batterData = jsonData.batters.batter;
	res.end(JSON.stringify(batterData));
}

function sendToppings(res) {
	var toppingsData = jsonData.topping;
	res.end(JSON.stringify(toppingsData));
}
```

**5. Collecting POST Data**

So far, every request that we received was handled in one fashion only - we did not care if it was GET or POST (although in the examples it is GET).

We can handle POST data (say, from HTML form) and then based on that, change our response. First of all, we can use a *read stream*  to read the POST request data. This is because the POST data can be longer than the GET request (which has a limit). So, it makes sense to wait till all the chunks of data have arrived. Luckily, the *request object* is a read stream itself!

```javascript
var http = require('http');

http.createServer(function(req, res) {
	if(req.method === 'GET') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(`You made a GET request`);
	} else if(req.method === 'POST') {
		var body = '';
		req.on('data', function(chunk) {
			body += chunk;
		});
		req.on('end', function() {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(`
				<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="UTF-8" />
						<title>Document</title>
					</head>
					<body>
						<p>${body}</p> <!-- Prints the querystring -->
					</body>
				</html>`);
		});
	}
}).listen(3000);
console.log('Server listening on port 3000');
```

**Note:**

1. **GET** parameters are passed in the **URL** (as query string). There is a *limit* on the data size.
2. **POST** parameters are passed in the **Body** of the Request (Encrypted). There is *no* limit on the data size (?).

## NodeJS Package Manager (NPM)

The core modules of NodeJS are a small set of functionalities that are shipped along with the installation. It does not get bloated since it only contains only the very basic and necessary utilities. NodeJS relies upon the open source community to provide us with libraries, plugins and frameworks that can be installed on-demand into a certain NodeJS application.

The open source community contributes to the **Node Package Manager (NPM)** from where we can download modules. NPM comes installed along with our NodeJS application.

- Checking version of NPM: `npm -v`
- Installing a module from NPM: `npm install <plugin-name>` (Installs **locally**, into the current directory)
- Removing an NPM plugin: `npm remove <plugin-name>` 
- List all the locally installed NPM modules: `npm ls`

All the *locally* installed NPM modules are stored in a folder called `node_modules` (automatically created) inside the current working directory. Every folder inside `node_modules` denotes a plugin/module that was installed using `npm` locally. Removing them (physically or with `npm remove`) will delete the module from the application.

**Example**: `npm install underscore`.

Viewing the NPM repository online: [NPM Repository](https://www.npmjs.com/).

**Note**: 

- NPM now allows private modules as well (not accessible as open source content).
- Install dependencies locally and need to run them in production: `npm install <plugin> --save`  (Discussed while discussing package.json file)
- Install dependencies locally and need them only in development: `npm install <plugin> —save-dev` (Discussed while discussing package.json file)

### Installing Packages Globally (Mac)

The normal install adds package to our application folder because the ones we install there will be run as a dependency to our own code. So, wherever we ship our code to, we must make sure we are able to send these modules as well.

We don't need to ship all modules with our code and some of them can be used across multiple applications. Such useful modules can be installed **globally** (accessed from anywhere on the system).

Usually, in order to install NPM modules globally, we have to run NPM commands via the root user (using `sudo`). Also, the syntax for installing modules globally is `npm install -g <plugin>`.

**Example**: `sudo npm install -g nodemon` or `sudo npm install -g node-dev`. (`nodemon` and `node-dev` watch for changes to our http server file and restarts the app automatically).

Installing a *linter* tool for javascript so that we can check for errors and coding style warning in any of our javascript files on the system: `sudo npm install -g jshint` (Usage: `jshint <js-file-path>`)

**Note**: Global NPM modules are added to the `/usr/local/bin` folder so it lies in the default `path` and its commands are recognised from all places in the system.

**A file server plugin**

We wrote quite a bit code to build a static file server using the `http` module earlier. We can install plugins to take care of that.

`httpster`: Useful file server that serves from the directory that you specify and on a particular port.

Installation: `sudo npm install -g httpster`

Usage: `httpster -p <port> -d <path>`

Example: `httpster -p 3000 -d ./lib` (Access something like `http://localhost:3000/lib/style.css` in the browser assuming the folder from where `httpster` was run contains the `lib ` folder).

Any static files in the path specified will be accessible (whether the resource is an html file or an image or a stylesheet, etc).

**Accessing locally installed modules from CLI**

To run a local plugin, we cannot just mention the module name in the CLI since the file does not lie in any of the PATH folders. We have to give the *file path* to the local install location of that plugin's executable file.

Example: If we had installed `httpster` locally then it would have been installed inside the `node_modules` folder and its executable file would be `./node_modules/httpster/bin/httpster`. Now, to run the locally installed httpster, we must use the path to the script (not just the name):

`./node_modules/httpster/bin/httpster -p 3000 -d ./lib` in the CLI

**Accessing locally installed modules from a Node Application**

We can `require()` the module by passing its name. The *path* is **not** required since node knows that it has to search in the `node_modules` directory for it.

## Web Servers

Most of the applications we build using NodeJS will have dependencies in the form of NPM repositories. For example, we might need a `body-parser` plugin to parse POST request parameters.

If we want to distribute our app to other centres, it is difficult to transfer it along with all the dependent modules as well because it bloats our application and the app size might be very huge (impractical). Therefore, we can save a list of our dependencies and then distribute only that information. On the receiving side, the list of dependencies are re-downloaded before publishing the app or working with it.

NodeJS offers a `package.json` file to manage app. It is a **manifest** file which describes our code and helps maintain it. This file also handles the list of dependencies. It is usually there in every node project.

This file is also necessary when you yourself want to distribute the app as an NPM module. (The first requirement for the file is a name for the project/package - the name has to be *all lowercase* with *no spaces* since *dashes* are allowed.)

`package.json` can be automatically initialized by running the **`npm init`** command inside our project folder. It will walk you through a list of items that need to be input inside the file such as name, author, license used, description, keywords, etc. At the end of the walkthrough, your `package.json` file gets created.

To save an NPM module as a ***dependency*** that needs to be distributed and even run on production, use `npm install <plugin> --save` (This will save the plugin name into our list of dependencies in `package.json`). Ex: `npm install body-parser --save`

Not all modules need to be installed as dependencies. Some modules are required only during *development* . For example, the `gulp` task manager used as a tool to do some pre-processing (Converting LESS to CSS, for example) might not be needed in production where only the compiled CSS exists.

To save an NPM module as a ***dev dependency*** that needs to be distributed and even run on production, use `npm install <plugin> --save-dev` (This will save the plugin name into our list of development dependencies in `package.json`). Ex: `npm install gulp —save-dev`.

A sample `package.json` file:

```javascript
{
  "name": "node-essentials",
  "version": "1.0.0",
  "description": "node essentials",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "node",
    "essential",
    "express",
    "socket"
  ],
  "author": "Pushkar DK",
  "license": "MIT"
}
```

The same  `package.json` file after NPM modules were installed locally as dependencies:

```javascript
{
  "name": "node-essentials",
  "version": "1.0.0",
  "description": "node essentials",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "node",
    "essential",
    "express",
    "socket"
  ],
  "author": "Pushkar DK",
  "license": "MIT",
  "dependencies": { // Were all installed as dependencies
    "body-parser": "^1.18.2",
    "cors": "^2.8.4",
    "express": "^4.16.2"
  },
  "devDependencies": {
    "gulp": "^3.9.1" // Was installed as dev dependency
  }
}
```

- `cors` stands for *Cross Origin Resource Sharing* and the NPM module by the same name enables us to do CORS - which basically opens up our API to other clients (*not* from the same domain) so that they can access it.
- `body-parser` is a utility that helps us parse the ***body*** of a *request*. It is helpful when we deal with **POST** requests. The parameters for the POST request are available in the request body and hence can be parsed using this utility. 
- **Note:** For **GET** requests, the parameters are in the ***query string*** of the URL and can be accessed via the `url` core module (In Vanilla NodeJS, this is the method to use, in `express` it is easier - seen later): 

```javascript
url = require('url');
...
...
var parsedUrl = url.parse(req, true); // req is the request object.
// true parses the req string into an object. So req.query will be an object with parameters as the props/keys.
...
var id = parsedUrl.id; // $_GET["id"]
```

- `express` is a very popular framework that helps us build web servers. It is internally creating an http server using the http/https modules but reduces the amount of code, making it easier to build a web server quickly. It is so popular that it stands for the **E** in the **MEAN** stack.
- `gulp` is a task manager tool. It can be used to process files (Like LESS to CSS) using plugins (it is based on plugins), watch for changes in files and perform actions automatically, etc. So, for most purposes we need it during development only. Hence, it is saved as a dev dependency in the above example.


**How do we install the dependencies that are listed in `package.json`?**

Whenever we distribute the app or add it to production then all the dependent modules will be installed by parsing the `package.json` file and downloading the modules one-by-one.

The command to run that does this is: **`npm install`** (No other argument supplied. It automatically downloads NPM modules listed in the `package.json` file).

**Removing NPM modules from the `package.json` file**

We can pass the same `--save` (or `—save-dev` if it was a dev dependency) option to the `npm remove` command. 

Ex: `npm remove underscore --save`

### Introduction to Express

`express` is an NPM modules that was built as a framework to create web servers (or API servers). It basically wraps around the `http` and `https` modules and provides *additional functionality* that makes it easy to code a server.

We have to just *`require`* the express module into our app via `var express = require('express');` and then we need to **instantiate** our server app with `var app = express();` (which imiplicitly creates an http server).

Similar to a way in which the `http.createServer()` object was chained to the `listen` method to specify a port to listen to, we can plug our app to the same method to listen on a port (`app.listen('3000')`).

**Optionally**, we could supply our express app (`app`) to other modules via `module.exports = app`. This is helpful in cases where we want to **test our code**, so the testing modules can access our app's code.

- what are middleware
- callback fns in middle ware & next()
- serving static files in express

```javascript
var express = require('express');
var app = express(); // instantiate express object (implicitly creates http server)

// listen on port:
app.listen(3000);
console.log('App listening on port 3000');

// Export the app in case it needs to be used in other modules:
// Main use of doing this: Can be sent to testing modules that test our app.
module.exports = app;
```

Express has a very unique concept known as **middleware**. We can think of middleware as plugins (code that does one particular thing over the input) that *act on every request before it can be processed by the routes and responded to*. 

Visualization of middleware:

![Server middleware and express app Image](http://cdn.vnykmshr.com/images/articles/express-routes-middleware-chains/express-routes-middleware-chains.png)

*Creating a middleware function*

Any middlware function that we create must be passed as a **callback** to the **`app.use()`** function. *Any request first passes through the middleware before it can be handled by a route handler.* The callback function has three parameters: **request** object, **response** object and **`next`**. 

Syntax: `app.use(function(req, res, next) { ... ; next(); });`

The `next` function that is available in the callback must be explicitly invoked `next()` at the end to invoke the next middleware function in the queue. If we don't call `next` then the subsequent middleware functions do not get executed. So, it is somewhat necessary to invoke it in every middleware function.

There are a few NPM or built-in modules that are middelware functions. Invoking them within `app.use` is as good as passing the callback. They perform their duties and automatically call the `next` middleware. Examples are `express.static()` (built into express) and *body-parser*'s `json()` method (NPM module).

**1. Serving Static Files in Express**

Express has a built-in middleware function called **`express.static(<dir-path>)`** which takes a directory path as input. It checks all requests that come to the server (since it is a middleware function) and if there is any static file in the directory specified that matches the request, then that file is served to the client. Only static files like `html` , `css` , `js`, images, etc can be served.

```javascript
var express = require('express');
var app = express(); // instantiate express object (implicitly creates http server)

// Specify middle ware:
app.use(function(req, res, next) {
	console.log(`${res.method} request for '${res.url}'`);
	next();
});

// Use the 'public' directory to store and serve static files
app.use(express.static('./public'));

// listen on port:
app.listen(3000);

console.log('App listening on port 3000');

// Export the app in case it needs to be used in other modules:
// Main use of doing this: Can be sent to testing modules that test our app.
module.exports = app;
```

**2. Express Routing with GET requests (Includes `cors`)**

We can add the routing functions after all the middleware.

We can add a listener to GET requests with **`app.get()`**. It takes two parameters: The *request path* and a *callback*.

The callback is similar to the `http.createServer()` callback in the sense that it takes two parameters: The *request* and response objects. The difference is that it gets invoked only for the specified request path and not all requests. (**Note:** The `app.<method>` callbacks do not have a `next` param since they are not middleware functions and definitely do not need to call the next route!)

Any request path that is **not** matched gets sent a *404 error response automatically by express*. This is not just for GET or static files but for all types of requests (POST, DELETE, etc). We can modify or add a request handler to supply a custom 404 error page.

```javascript
var express = require('express');
var app = express(); // instantiate express object (implicitly creates http server)

var synonyms = [
	{
		term: 'democracy', 
		synonym: [
			'representative government', 
			'elective government', 
			'constitutional government', 
			'popular government'
		]
	},
	{
		term: 'grateful', 
		synonym: [
			'thankful',
			'filled with gratitude',
			'appreciative'
		]
	}
];

// Specify middle ware:
app.use(function(req, res, next) {
	console.log(`${res.method} request for '${res.url}'`);
	next();
});
app.use(express.static('./public'));

// Specify routes:
app.get('/synonyms-api', function(req, res) {
	res.json(synonyms);
});

app.listen(3000);
console.log('App listening on port 3000');

module.exports = app;
```

Another useful NPM module is the `cors` module. It helps other domains from accessing our APIs (by making requests). Imagine that we have a dictionary API (shares data in json format) and it needs to be accessed by a website that displays the dictionary. If the website uses the same domain (our own) as our NodeJS API app then there is no issue with the requests. But, if it uses some other domain (not ours) then the requests throw an error. To handle or enable these requests, Cross Origin Resource Sharing (CORS) is required.

The `cors` module enables CORS. It is a *middleware* function so we must add it as one in our app. After adding it, requests can be made from any client anywhere and from any domain to our app.

```javascript
var express = require('express');
var app = express(); // instantiate express object (implicitly creates http server)
var cors = require('cors');

// ...
// ...

// Specify middle ware:
app.use(function(req, res, next) {
	console.log(`${res.method} request for '${res.url}'`);
	next();
});

app.use(express.static('./public'));

app.use(cors()); // all our requests go through 'cors' middleware
// Therefore, any domain can make requests to our API now

// Specify routes:
app.get('/synonyms-api', function(req, res) {
	res.json(synonyms);
});

// ...
// ...
```

**Note:** 

Since `express` is a wrapper around the `http` module, it has extended functionality built into it. Some important additions that make working with data easy are:

- We can send a `json` response using the `res.json()` method that automatically coerces arrays or objects (or any JS data) into a json object before sending them to the client. (Remember, in the `http` module we had to set the `Content-Type` as `text/json` in `res.writeHead` and then send the response with `res.send()`);
- In Express extracting **GET** params from URL in a route is easy: Your query parameters can be retrieved from the `query` object on the request object `req` sent to your route. Ex: `req.query.getParamName; // GET['getParamName']`. (Remember, in Vanilla NodeJS we had to use a core module `url` to parse the url with `var parsed = url.parse(rawUrl, true)` to be able to access the GET (querystring) parameter with `parsed.query.getParamName`).
- In Express, we can use the `body-parser` middleware to access the **POST** parameters. This will parse all the bodies of the requests before the route. In Vanilla NodeJS we had to manually parse the body if we wanted to access the POST params.

[Extracting parameters in Node & Express - Guide](http://stackabuse.com/get-query-strings-and-parameters-in-express-js/)

**3. Express Routing with POST requests (Includes `body-parser`)**

Just like we handled GET requests, we can have routes to handle POST requests. Everything is same except that the function to create the route handler is **`app.post()`**.

The `body-parser` NPM module gives us a set of middleware functions to access the request **body**, especially useful in accessing **POST** parameters (which are sent in the request body).

There are two ways in which a request and its data can be POSTed to the server (assume `var bodyParser = require('body-parser')`:

1. The form action: In this case, the data is sent as `x-www-form-urlencoded`. To parse this type of body, we use the `bodyParser.urlencoded()` middleware.
2. Request from a REST service (comes as `json`): In this case, the data is sent as `json`. To parse this type of body, we use the `bodyParser.json()` middleware.

After adding the body parser middlewares, the request object `req` contains a `body` parameter which is an object containing all the POST parameters. We can access params via the `req.body` object. For example, `req.body.id` fetches the `id` param that was sent via POST.

```javascript
var express = require('express');
var app = express(); // instantiate express object (implicitly creates http server)
var cors = require('cors');
var bodyParser = require('body-parser');

// ...
// ...

// Specify middle ware:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
// `extended: true` only required if post body is heavily nested! (else, `false`)

// After using bodyParser middleware for both json and urlencoded requests:
// All request bodies (from POST requests) are parsed all variables/params  
// and placed on the request object.

app.use(function(req, res, next) {
	console.log(`${res.method} request for '${res.url}' - ${JSON.stringify(req.body)}`);
	next();
});
app.use(express.static('./public'));
app.use(cors()); 

// Specify routes:
app.get('/synonyms-api', function(req, res) {
	res.json(synonyms);
});
// Post routes:
app.post('/synonyms-api', function(req, res) {
	synonyms.push(req.body); // adding whatever synonym was posted to the server
	res.json(synonyms);
});

// ...
// ...
```

**4. Express Routing with DELETE requests (Includes routing variables)**

The DELETE request can be handled with`app.delete()` and it is very similar to handling `app.get` and `app.post`:

```javascript
// ...
// ...

// Specify routes:
app.get('/synonyms-api', function(req, res) {
	res.json(synonyms);
});
// Post routes:
app.post('/synonyms-api', function(req, res) {
	synonyms.push(req.body); // adding whatever synonym was posted to the server
	res.json(synonyms);
});
// Delete routes:
app.delete('/synonyms-api/:term', function(req, res) { 
	// The routing variables can be captured using a colon(:)
	// Ex: If request is "/synonyms-api/grateful" then 
	// that term property is available on `req.params` object 
	// as `req.params.term = 'grateful'`.
	synonyms = synonyms.filter(function(synObj) {
		return synObj.term.toLowerCase() !== req.params.term.toLowerCase();
	});
	res.json(synonyms);
});

// ...
// ...
```

**Note: Capturing routing variables**

We can capture routing variables by placing *a colon(:) prefixed variable name in the path of the request* (As in the above example). This variable will later hold the actual value of that part of the path and is accessible via the request object' `params` property. For example, `req.params.term` will capture `term` routing variable in the URL/path. If the route had `/synonyms-api/:term` and the actual URL was `/synonyms-api/marvel` then `term` would be `marvel`. 

[Full List of Express' Response Object and its methods](https://www.javatpoint.com/expressjs-response)
[Full List of Express' Request Object and its methods](https://www.javatpoint.com/expressjs-request)

## Web Sockets

**Web sockets** are a wonderful addition to the new **HTML5** specification. They use their *own protocol* to send and receive data from a **TCP** server (web sockets enable *true two-way communication*). HTTP servers are built on top of TCP servers enabling us to use sockets along with our web server.

Before web sockets were introduced into the HTML5 spec, we had to use **polling** to check for change in state in the server to fetch data. A more efficient way to poll was the use of **long polling** in which the request to the server is left open until a timeout. If state changes before this timeout (before request closes) then response is *immediately* sent to the client. Long polling is an efficient form of polling. We need not use either of these with HTML5 web sockets.

Using web sockets, multiple clients are able to connect to the server and open a two-way communication channel. In this way, the clients can communicate with the server and post messages to and fro as well as broadcast messages to other clients. The server is also able to push data changes to the client via sockets.

Web sockets are *not* limited to the browser. Any application can connect to our server using sockets, including native applications. 

### `ws` Module

*Setting up a socket server from scratch is tedious or complicated*. We will need a *TCP Socket server* and an *HTTP proxy*. Fortunately, there exist many NPM (NodeJS) Modules that help creating socket servers easier. One such module is called **`ws`** (stands for Web Socket, I guess).

Installing `ws` module: **`npm install ws --save`**

When we require a `ws` module, we will fetch only the **'Server'** property  and it is a *constructor* function. We instantiate a socket server by using the `new` keyword. To the constructor, we pass an object containing `port` as a property and its value being a port number to listen on.

The `ws` socket server can listen (via the `on` method) to any new `'connection'`  and trigger a callback. The callback recieves a socket object for that connection as parameter. Every new connection (every time a client connects) will trigger this callback).

To send data to a particular client on a socket connection we can use the `send` method available on every individual socket object. (A socket object represents one socket connection from the client to our server).

```javascript
var WebSocketServer = require('ws').Server; // need only the Server constructor.
var wss = new WebSocketServer({ port: 3000 }); // create a new socket server listening on specified port

wss.on('connection', function(ws) {
	// ws represents each socket connection (from client - so each client)
	ws.send('Welcome to Chat Room'); // send message to client upon connecting
});

console.log('Socket server is running...');
```

(**Note:** `ws` uses the `ws://` protocol instead of `http://` or `https://` to communicate over a `TCP` connection)

Since socket is a two-way communication, we will need a socket codebase on the *client-side as well* (For example, an `index.html` file with a `ws-client.js` script).

The `index.html` can be run locally, it need not be hosted on a server to test the socket communication.

```html
<!-- index.html: -->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Socket testing</title>
</head>
<body>
	<h1 class="title"></h1>
	<div class="messages"></div>
	<input class="msg" type="text" name="msg" placeholder="Type and send message">
	<script src="ws-client.js"></script>
</body>
</html>
```

The client side web socket object can be created from the natively enabled `WebSocket` constructor (chrome has it). It has a couple of methods on it:

- `onopen` which is triggered when connection between socket and client is made (It is the client-side version of `on('connection', …)` event).
- `onclose` which is triggered whenever the connectiong is closed (say, server is stopped!).
- `onmessage` which is triggered whenever the server sends it a message (via `send()` method on the server side). The function automatically gets a parameter which is an *object* (a message object). The object contains numerous properties regarding origin, target, timestamp, etc. The data that is sent to us is available in the `data` property of that message object.
- We can send data from the client-side to the server using the same `send()` method on the web socket object `ws`.

```javascript
// ws-client.js:
// If our browser NATIVELY SUPPORTS Web sockets, we can use it (on the client side):
var ws = new WebSocket('ws://localhost:3000'); // WebSocket - available by default in the HTML5 API.
// Web sockets use their own protocol (ws://)
// We need to pass as param our web socket server's domain!

ws.onopen = function() {
	setTitle('Connected to Chat Room :)');
};

ws.onclose = function() {
	setTitle('Disconnected from Chat Room!');
};

ws.onmessage = function(payload) {
	printMessage(payload.data);
};

window.addEventListener('DOMContentLoaded', handleMessaging);
/* ********************* */
function handleMessaging() {
	var msgInput = document.getElementsByClassName('msg')[0];
	msgInput.addEventListener('keyup', function(e) {
    	e.preventDefault();
    	if (e.keyCode === 13) { // Enter Key
    		msgInput.value = '';
    	}
    });
}

function setTitle(title) {
	document.querySelector('h1.title').textContent = title;
}

function printMessage(message) {
	var p = document.createElement('p');
	p.textContent = message;
	document.querySelector('div.messages').appendChild(p);
}
```

**Receiving Messages on Server-side, Broadcasting & Closing connections:**

On the server-side:

- We can receive the messages from a socket using that individual socket's (`ws` parameter inside the callback) to *listen* to messages from the client. The method is `ws.on('message', function(message) { ... })`. This listeners captures the messages sent via the `send()` method on the client-side and the message is passed as a parameter to the callback function.
- We can *close* a connection (a socket/client) using the `close()` method on that socket object (`ws` parameter inside the callback) . The server will still be running but connection is de-established with that client.
- The web socket server instance (`wss`) maintains a *javascript array* of all the connected client socket object (all `ws`'es) and it can be accessed via the`wss.clients` property. By looping over it we can access each connected client - an easy way to **broadcast** messages.

```javascript
// ws.js:
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 3000 }); // create a new socket server listening on specified port

wss.on('connection', function(ws) {
	// ws represents each socket connection (from client - so each client)
	ws.send('Welcome to Chat Room'); // send message to client upon connecting
	ws.on('message', function(message) {
		if(message === 'exit') {
			ws.close();
		} else {
			// Broadcast received message to all connected clients:
			wss.clients.forEach(function(client) {
				// Here each 'client' is a 'ws' object:
				client.send(message); // similar to 'ws.send()'
			});
		}
	});
});

console.log('Socket server is running...');
```

### `socket.io` Module

The `ws` module, along with the native `WebSocket` constructor in the browser, are great for creating socket servers but they have *one drawback*. The older browsers *do not support* the native WebSocket HTML5 API. We need to have a fallback option (See [caniuse for WebSocket](http://caniuse.com/#search=WebSocket)).

There is another popular NPM module called **`socket.io`** that is an *alternative* to `ws`. The benefit of using `socket.io` is that it checks if browser supports web sockets. If yes, it implements the native sockets feature. If not, it falls back to the **long polling** method. For long polling, it require `http` server (I guess (?)). Similar fall backs are taken care of on the server-side.

Install `socket.io`: **`npm install socket.io --save`**

`socket.io` is generally used along with `express` so we can install that as well: 

**`npm install express --save`**

Here is how we initialize a socket.io server built on express:

1. We will require `express`, `http` and `socket.io` modules.
2. We need to create a `http` server with `createServer` first by passing the `express` app (instantiated express server) to it instead of a callback.
3. This server object that has been create should be fed to `socket.io` as a parameter since socket.io is a function.
4. Any other middleware or routing can be handled normally, like you would do in a regular `express` server.
5. `on('connection')` method on the socket server listens to any new socket connections.
6. Once a socket connection has been made, we can use that socket object to **emit** events: `emit()` to emit to that client, `broadcast.emit()` to emit to all clients.
7. We can even listen to client emitted events with `on(<event-name>, function (msg) { ... })` handler on that socket object.

```javascript
// server.js:
var express = require('express');
var http = require('http'); // socket.io requires it to be setup with HTTP module
var app = express(); // instance of an express server

// Steps:
// 1. We need to PASS the express 'app' to the HTTP module's 'createServer()' method
// 2. This created http server object is going to be fed to the 'socket.io' instance.
// 3. When we require 'socket.io', it's a function and we need to pass it the http server built with our express() app.
var server = http.createServer(app).listen(3000); // instead of callback, we send in our express app ('app').
var io = require('socket.io')(server); // socket server created.

// Optional: Do other expresss things:
// Like setting up express static to serve static files (middleware):
app.use(express.static('./public'));

// socket.io connection event (similar to 'wss' in prev example):
io.on('connection', function(socket) { 
	// 'socket' is the socket that connected (i.e the client like 'ws' in prev ex.)
	socket.emit('Welcome to Chat Room'); // Emit a message on connection (similar to `ws.send()` in prev ex.)
	// We are not 'send'ing but emitting an event that can be listened to on the client side.
	
	// Listen to events and/or broadcast:
	socket.on('chat', function(message) { // similar to "ws.on('message', fn(msg) {..});"
		// To broadcast: "socket.broadcast.emit" which is similar to "wss.clients.forEach(fn(client){ client.send(); });"
		socket.broadcast.emit('message', message);
	});
});

console.log('Starting socket.io server...');
```

On the client side:

- We need to include the `socket.io` script meant for client-side communication (Download it or use a CDN).
- Create a socket object with `io(<http-server>)`. Notice how we send an HTTP domain (instead of `ws://`).
- The socket object can listen to events with `on()` and emit events with `emit()`. The `'connect'` event is emitted when a connection is made and `'disconnect'` event is emitted when the socket connection is broken/ends.
- Other listeners and emitters deal with custom events (such as `'chat'` and `'message'` in the example).

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Socket.io testing</title>
</head>
<body>
	<h1 class="title"></h1>
	<div class="messages"></div>
	<input class="msg" type="text" name="msg" placeholder="Type and send message">
	
	<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>
	<script src="client.js"></script>
</body>
</html>
```

```javascript
// client.js
var socket = io('http://localhost:3000'); // Uses `http://` and not `ws://`

// connection event:
socket.on('connect', function() { // simialar to `ws.onopen`
	setTitle('Connected to socket server :)');
});

// disconnection event:
socket.on('disconnect', function() { // similar to `ws.onclose`
	setTitle('Disconnected from socket server!');
});

// receiving a message (Event):
// The message event is a custom event (as in has a custom name):
socket.on('message', function(message) { // we receive message directly (no need for 'payload.data' as with `ws`)
	printMessage(message);
});

window.addEventListener('DOMContentLoaded', handleMessaging);
/* ********************** */
function handleMessaging() {
	var msgInput = document.getElementsByClassName('msg')[0];
	msgInput.addEventListener('keyup', function(e) {
    	e.preventDefault();
    	if (e.keyCode === 13) { // Enter Key
    		// First show msg to myself:
    		printMessage(msgInput.value);
    		socket.emit('chat', msgInput.value); // emit the input data as custom event to socket server.
    		msgInput.value = '';
    	}
    });
}

function setTitle(title) {
	document.querySelector('h1.title').textContent = title;
}

function printMessage(message) {
	var p = document.createElement('p');
	p.textContent = message;
	document.querySelector('div.messages').appendChild(p);
}
```

