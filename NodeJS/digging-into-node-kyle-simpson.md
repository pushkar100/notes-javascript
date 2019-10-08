# Node



[Source: Kyle Simpson's Course](https://frontendmasters.com/courses/digging-into-node)



## The Middle End

It is the bridge between the frontend and the backend. The frontend and backend do not fit together very well and hence, we need a middle end.

The middle end consists of a collection of behaviors every web app does: Routing, templating, data formatting, data bundling, packaging a resource, responding to an API request.

Middle end bridges the gap between frontend and backend (server/database). From the frontend perspective, the backend can be a black box (Doesnt matter if it is using Django or python or whatever) and vice-versa. The middle end will take care of connecting the two.



**How to have middle end written in Javascript?**

There were many options before Node. For example, **Rhino** is a javascript engine written and run using Java (developed by mozilla). But, creating a Java stack on the backend just to enable a javascript middle end was a bit of a stretch. Usually, the backend was in PHP and adding a Java stack and maintaining it just for one purpose was not feasible. Most other alternatives were also Java based.



**Enter V8**

Around 2008 chrome launched with the **V8** javascript engine. It was written in C++ and you could have your own bindings mapped to its C++ code (or something like that ?). This gave ideas to people to use this engine to build a backend, javascript based product/tool that runs a server (Server-side JS). Others, like kyle simpson, were thinking about using it for the middle end purposes.



**History behind Node**

Ryan Dahl, the creator of NodeJS, wanted to create a high-throughput, low-latency socket servers (nano/microservices). His project was in Ruby and he wanted asynchronous execution to take place. In order to make this possible, he needed an **event loop** system which ruby didn't have (He tried to custom build it for Ruby). However, the realisation that the Javascript environment has it already made him make the fatal shift to it from Ruby for doing his project. This was historic!



**Why Node?** 

When Node was built, it was the first time that there was a strong argument for how *asynchronous communication* and *I/O based tasks* should be modeled. And, that it should be modeled using Javascript.

I/O based tasks such as disk reading/writing, network connection setups, etc take a lot of time to do. Magnitudes slower than just CPU related tasks. The traditional way to handle this is by creating **threads** that run on different processors. While threads are good for CPU related tasks, it turns out that they are not very good for I/O tasks - not the most efficient way to do it.

The argument for Node (& Javascript in turn) is that the **asynchronous event loop** is a much better model for handling I/O based tasks compared to separate threads.

This is the reason why major companies such as netflix used javascript & node to remodel their **high throughput, low latency I/O operations** (& not because a lot of people liked javascript!). If you are not using Node for this purpose, you're probably doing it wrong with your system. 



**When is Node not useful?**

Node is not right for something very CPU bound. For example, I/O and asynchronicity appear when you do tasks outside the CPU. However, if you are doing a significant amount of CPU tasks without much I/O then Node is *not* the right system for you.



If you wish to convince someone to use node, it is helpful to pitch it as the middle end. The stuff that understands the frontend and messages the backend what needs to be done. There is no complete rewrite of the backend architecture needed.



## First Node Program

**Understanding the environment**

How does Node connect with its environment, the operating system? Node does so by mapping to  the POSIX interface so that it can integrate with the OS. This is a standard set of commands and tools for all UNIX like OSes. Earlier in web, the specification does not talk about these things because I/O and file systems were never a part of it. Node had to figure out on its own how to connect with its OS environment and POSIX was the natural choice.



**What is POSIX?**

It stands for **Portable Operating System Interface (POSIX)**. It is a family of standards specified by the IEEE Computer Society for maintaining compatibility between operating systems.

POSIX defines the **API** along with **command line shells** and **utility interfaces**. This makes different types of UNIX and its variant OSes have a standard set of instructions that work on all of them.

POSIX can do dictionary searches, can map to regexes (ex:  grep), work with files (input & output), etc. It is fairly low-level. The interesting thing is that lots of other languages like C++ and Java implement it. So, you probably don't have to use POSIX yourself.

Files have a **path** and also a **file descriptor**. A file descriptor is an index to a file path. For example, **`0`** is the descriptor for standard input, **`1`** for standard output, and **`2`** for standard error. Any whole number can be a file descriptor index, such as `179`. These are more useful than a bulky file path.

The *smallest available file descriptor* is assigned to a file when it is opened using the `open()` POSIX call. When we close the file using `close()` POSIX call, the file descriptor is freed up.

We can **redirect**  a program without its knowledge. For example:

```bash
# Output redirection (into contents file)
$ ls -al > contents

# Redirect by appending to file (Will not overwrite)
$ cal >> contents

# We can redirect to devices as well
$ cat music.mp3 > /dev/audio

# Input redirection (Takes input for command from contents of a file/device)
$ cat < contents

# Error output redirection (using file descriptor 2)
$ ls -al non-existent-file 2> some_input

# Redirect using address of a file descriptor
# &1 : redirects to STDOUT
# &2 : redirects to SDTERR, and so on.
# If these are in turn redirected using `>` then we will find the output there.
$ ls -al ./ ./nonextst > some_input 2>&1
```



**Node made the choice to expose most of the system based connections through a POSIX-like interface.**



**A program to output content**

**Standard I/O** is a set of three *streams* that model input and output to a program in a POSIX environment. Mainly, standard input (0), standard output (1), and standard error (2). Streams are first class citizens, an actual data structures (later).

There is an access point for all the POSIX-like commands for things like standard I/O called the **`process`**. It is available to all node programs and provides connections to overall hosting system.

Javascript in the web never had I/O specs. The language itself doesn't include it. This gives the environment that the engine resides in the flexibility to choose how I/O happens.

**`process.stdout`** is the standard output stream. To write some content to it, you will use its **`write()`** method.

```js
// ex1.js
process.stdout.write('Hello world')

/* SCRIPT EXECUTION:
$ node ex1.js
Hello world$_
*/
```

```js
// ex1.js
console.log('Hello world')

/* SCRIPT EXECUTION:
$ node ex1.js
Hello world
$_
*/
```

1. `write()` *does not add a trailing newline character* to the output as opposed to `console.log()`
2. Printing a ***character string*** directly to a stream (like the output stream) is one of the ***least efficient*** ways to do so. There are many layers that take care of translation (abstraction/subsystems) where the data gets converted before it gets to the host environment which is the shell.
3. Therefore, `console.log()` ***converts the character string to binary*** before it gets sent to the standard output making the whole process faster. This is because the subsystems or abstractions do not come into the picture.



**Other standard output: The standard error**

```js
// ex1.js
process.stderr.write('Oops')

/* SCRIPT EXECUTION:
$ node ex1.js
Oops$_
*/
```

**`process.stderr`** has the **`write()`** method which will send the contents to the standard error. By default, both the standard error and standard output is the shell environment. We can also use `console.error()` to output content to the standard error stream. Again, due to binary versus character strings, `console.error()` is better than `process.stderr.write()`.

```js
// ex1.js
console.log('Hello world')
console.error('Oops')

/* SCRIPT EXECUTION:
$ node ex1.js
Hello world
Oops
*/
```

We can redirect the error using the error file descriptor to a different file so that only the standard output is present in the shell.

```js
// ex1.js
console.log('Hello world')
console.error('Oops')

/* SCRIPT EXECUTION:
$ node ex1.js 2> /dev/null
Hello world

# Redirecting error to null device
# /dev/null is like a trash can for output - sent to be forgotten or deleted.
*/
```

Redirecting both outputs to null:

```bash
$ node ex1.js 1> /dev/null 2>&1
```

Remember to always redirect error to standard error and not standard output since programs that want to read your data will want this separation.



**A note on standard input**

We can use **`process.stdin`** and its method **`read()`** to read from the standard input. But, standard input is much more finicky than standard output. It is easily affected by variations the shell, differs in identifying end of input, how input gets sent, etc.

We will use a package (later) that will handle standard input in a platform agnostic way.



## Writing a command line script

This is similar to writing an executable shell script.



**The shebang & strict mode**

In any script, the first thing we write is the **shebang**. It tells the system which interpreter (bash, zsh, etc) to pass of the script to, for execution. While executing node scripts too we will need a shebang.

Syntax of a shebang (placed on the first line of the file): `#!<absolute-path-to-interpreter>`

Now, we can pass the path to the node executable but this location varies from one operating system to another, and from one style of installation to another. Instead, we can use a special executable **`env`** and ask it to find and use the global node executable:

```bash
#!/usr/bin/env node
```

`env` is included in all the distros of linux and mac.

Another thing to keep in mind is that we must run our code in **strict mode**. So, after the shebang, place the `"use strict;"` line:

```js
#!/usr/bin/env node

"use strict";
```

The shebang line has already been stripped out before node starts executing it. Therefore, the `"use strict;"` is at the top of the script and the contents of the whole file adheres to it. So, you don't have to worry about the shebang being invalid JS.



**Making the script executable**

The file must be treated as an executable. On linux and unix based systems, we can use the **`chmod`** command to do change the file permissions.

`chmod u+x ex1.js` will give the user (you) executable permission on the ex1.js file.

Once we have permissions, we can run the script with **`<path-to-script>`**. We need not pass it as an argument to the global `node` command anymore.

```js
#!/usr/bin/env node

'use strict';

console.log('Hello world')
console.error('Oops')


/* SCRIPT EXECUTION:
$ ex1.js
Hello world
Oops
*/
```



**Tip: Use a print help function**

This is so that you know how to use the script you have written. You or someone else might revisit the script and won't know or remember how to use it.

```js
#!/usr/bin/env node

'use strict';

printHelp();

/* ------------------- */

function printHelp() {
    console.log([
        'ex1 usage:',
        '\tex1.js --help',
        '\n',
        '\t--help\tprint this help'
    ].join('\n'))
}

/* SCRIPT EXECUTION:
$ ex1.js
ex1 usage:
	ex1.js --help
	

	--help	print this help
*/
```



### Command Line Arguments

Command line arguments are the easiest ways to pass in parameters to our program. The POSIX-like exposed function to handle command line arguments is **`process.argv`**. It contains the *array* of all the command line arguments passed to the program.

Traditionally in C, `argv` stood for the command line arguments list, and `argc` for the count of arguments.

```js
#!/usr/bin/env node

'use strict';

console.log(process.argv)

/* SCRIPT EXECUTION:
$ ex1.js --hello=world
[ '/usr/local/bin/node',
  '/Users/pushkardk/Desktop/digging-into-node/exercises/ex1.js',
  '--hello=world' ]
*/
```

We typically do not need the first two items in the array: The *path to the interpreter* and the *path to the script*. We can use `slice(2)` to do that:

```js
#!/usr/bin/env node

'use strict';

console.log(process.argv.slice(2))

/* SCRIPT EXECUTION:
$ ex1.js --hello=world another
[ '--hello=world', 'another' ]
*/
```



**The `minimist` package to parse CLI arguments**

*Node itself does not parse the array of arguments* to assign it as option (Ex: `hello` option contains `world` value). It only reads it as one argument.

We can write our own parsing logic for such cases but to maintain consistency, it is better to use a package that comes *built-in* with node called the **`minimist`**. It is a function that gives us an object from an array passed to it. It also does the conversion to data types (instead of all values being strings) based on certain rules. 

```js
#!/usr/bin/env node

'use strict';

const args = require('minimist')(process.argv.slice(2))

console.log(args)

/* SCRIPT EXECUTION:
$ ex1.js --hello=world another -c9 -foo --bar
{ _: [ 'another' ],
  hello: 'world',
  c: 9,
  f: true,
  o: true,
  bar: true }
*/
```

We can see that:

1. Regular arguments go into the `_` array (or anything that minimist could not figure out what to do with).
2. Options with `-` or `--` are assigned a key and whatever follows `=` becomes its value.
3. For options with `-` and containing a number (typecast): The key is the non-number prefix and the number itself is the value. (This does *not* work for `--` options).
4. If `-` and `--` options dont have values (`=` OR followed by a number in case of `-`) then their values in the resulting object are `true`.

**Configuring `minimist`**

We can define the datatype of the options in minimist invocation. This is to prevent minimist from making any unnecessary assumptions about the option value.

```js
#!/usr/bin/env node

'use strict';

const args = require('minimist')(process.argv.slice(2), {
    boolean: [ 'help'],
    string: [ 'file' ] // A file will be a path so it needs to be a string
})

console.log(args)
```

```shell
$ ex1.js --help=world --file
{ _: [], help: true, file: '' }
```

```bash
$ ex1.js --help=false --file=/some/where
{ _: [], help: false, file: '/some/where' }
```

**Complete example**

```js
#!/usr/bin/env node

'use strict';

// Third party modules:
const args = require('minimist')(process.argv.slice(2), {
    boolean: ['help'],
    string: ['file'] // A file will be a path so it needs to be a string
})

if (args.help) {
    printHelp();
} else if (args.file) {
    console.log(args.file)
} else {
    error('Incorrect usage', true)
}


/* ------------------- */
function printHelp() {
    console.log([
        'Usage:',
        'ex1.js --help : Open help',
        'ex1.js --file <filepath>: Print the file path'
    ].join('\n'))
}

function error(msg, includeHelp = false) {
    console.error(msg)
    if (includeHelp) {
        console.log('')
        printHelp()
    }
}
```

```shell
$ ex1.js
Incorrect usage

Usage:
ex1.js --help : Open help
ex1.js --file <filepath>: Print the file path
```

**Note:** If you want a more powerful arguments parser, try **`yargs`** [http://yargs.js.org/](http://yargs.js.org/). It helps you define the options' syntax and also generates an automatic help output among various other things. For simple purposes, `minimist` is good enough.



### Reading from and writing to a file

**The `path` module**

In order to be able to read a file, we must first access it. This is done through the file path. Node comes with a built in module that works with file paths known as **`path `** [https://nodejs.org/api/path.html](https://nodejs.org/api/path.html). We do not have to reinvent the wheel an instead use this module for all path resolution & construction purposes.

Use **`path.resolve()`** to resolve the file path.

```js
#!/usr/bin/env node

'use strict';

// built-in modules:
const path = require('path')

// Third party modules:
const args = require('minimist')(process.argv.slice(2), {
    boolean: ['help'],
    string: ['file'] // A file will be a path so it needs to be a string
})

if (args.help) {
    printHelp();
} else if (args.file) {
    let filepath = path.resolve(args.file)
    console.log(filepath)
} else {
    error('Incorrect usage', true)
}

// Assume these functions exist:
// function printHelp()
// function error()
```

```shell
$ ex1.js --file=hello
/Users/pushkardk/Desktop/digging-into-node/exercises/hello

# Path tries to find the file in current directory if value is just a name. 
```

```shell
$ ex1.js --file='../hello'
/Users/pushkardk/Desktop/digging-into-node/hello
```

`path` figures out relative paths & related logic automatically on its own.



**The `__dirname` keyword**

It is a magic keyword that gives the directory path of the file that is currently being worked on (i.e currently executing script). It gives you the path of the currently running file.

To get the current working directory (& not of the file that is being executed), use **`process.cwd()`**.

```js
#!/usr/bin/env node

'use strict';

console.log(__dirname)
console.log()
console.log(process.cwd())
```

```shell
exercises$ test.js
/Users/pushkardk/Desktop/digging-into-node/exercises 

/Users/pushkardk/Desktop/digging-into-node/exercises
```

```shell
exercises$ cd ..
digging-into-node$ exercises/test.js
/Users/pushkardk/Desktop/digging-into-node/exercises

/Users/pushkardk/Desktop/digging-into-node
```



**Note**

The `path` module resolves relative paths based on the `__dirname` value. 

If an absolute path is supplied then `__dirname` is not used for resolution.



**The `fs` module**

Once we have resolved the file path using `path` module, we need to process it (read/write). To do so, there exists another built-in module called **`fs`** which stands for file system. It contains methods that can open, read from, and write to files.

The **`fs.readFileSync(<filepath>)`** method reads the contents of the file synchronously. 

```
# files/hello.txt
Hello World
```

```js
#!/usr/bin/env node

'use strict';

// built-in modules:
const fs = require('fs')
const path = require('path')

// Third party modules:
const args = require('minimist')(process.argv.slice(2), {
    boolean: ['help'],
    string: ['file'] // A file will be a path so it needs to be a string
})

if (args.help) {
    printHelp();
} else if (args.file) {
    processFile(path.resolve(args.file))
} else {
    error('Incorrect usage', true)
}

function processFile(filepath) {
    const contents = fs.readFileSync(filepath);
    console.log(contents)
    process.stdout.write(contents)
}

// Assume these functions exist:
// function printHelp()
// function error()
```

```shell
$ ex1.js --file=files/hello.txt
<Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64 0a>
Hello World
```

Notice that

1. `console.log` printed a weird <Buffer... > string to standard output.
2. `process.stdout.write` printed the expected content of the file.

Standard output, standard input, standard error, etc are all **Buffers**. Buffers are binary streams of data. Even the `fs` methods work with buffers. When a buffer is supplied to standard input, it does the correct translation of it into a string. That is what happens in `process.stdout.write`. But, when buffer content is passed to `console.log`, it first converts the buffer to a string and then passes it to the standard output. This causes it to print the stringified buffer onto the screen instead of the actual content.

Therefore, `console.log` does some ***extra value processing***. When we don't want that, we can use `process.stdout.write`.

If we still want to use `console.log`, we can provide an **encoding** option to the `readFileSync` method as the next argument. This will return the contents in the encoding specified. So, if `utf-8`, it will provide contents as a `utf-8` string.

```js
#!/usr/bin/env node

'use strict';

// built-in modules:
const fs = require('fs')
const path = require('path')

// Third party modules:
const args = require('minimist')(process.argv.slice(2), {
    boolean: ['help'],
    string: ['file'] // A file will be a path so it needs to be a string
})

if (args.help) {
    printHelp();
} else if (args.file) {
    processFile(path.resolve(args.file))
} else {
    error('Incorrect usage', true)
}

function processFile(filepath) {
    const contents = fs.readFileSync(filepath, 'utf-8');
    console.log(contents)
}

// Assume these functions exist:
// function printHelp()
// function error()
```

```shell
$ ex1.js --file=files/hello.txt
Hello World

# Now console.log works fine since encoding is utf-8.
```

Using the encoding affects the performance very slightly (in microseconds). This is because, instead of sending in binary data as buffer, we are now converting it into character string data and sending it. So, it will go through extra steps to output the data on the shell display.

**Asynchronous `readFile`**

Node was designed to be asynchronous. So ideally, we should be using async functions for reading and writing files. The `readFile` is the asynchronous version of the the `readFileSync` method. It takes in a callback apart from the file path. The callback receives two parameters, an error if it was thrown, and the content or data.

The `require()` method used in Node itself is synchronous. So, why use async methods?

This is because node was never meant to be asynchronous throughout. *Everything apart from the startup code* was meant to be asynchronous. Therefore, `require()` is synchronous. 

Note that for the purpose of a CLI script, every piece of code in the script can be thought of as startup code. Therefore, our read files can be synchronous. One more reason is that the probability of executing 1000s of read files via a script over the same area in the file system which causes blocking issues is very rare.

However, it is good practice to write async code since there are many use cases where it is necessary and best practice to have it.

```js
#!/usr/bin/env node

'use strict';

// built-in modules:
const fs = require('fs')
const path = require('path')

// Third party modules:
const args = require('minimist')(process.argv.slice(2), {
    boolean: ['help'],
    string: ['file'] // A file will be a path so it needs to be a string
})

if (args.help) {
    printHelp();
} else if (args.file) {
    processFile(path.resolve(args.file))
} else {
    error('Incorrect usage', true)
}

function processFile(filepath) {
    fs.readFile(filepath, 'utf-8', (err, contents) => {
        if (err) {
            error(err)
        } else {
            console.log(contents)
        }
    });
}

// Assume these functions exist:
// function printHelp()
// function error()
```

```shell
$ ex1.js --file=files/hello.txt
Hello World
```

```shell
$ ex1.js --file=files/hello.txtdoesntexist
{ [Error: ENOENT: no such file or directory, open '/Users/pushkardk/Desktop/digging-into-node/exercises/files/hello.txtdoesntexist']
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path:
   '/Users/pushkardk/Desktop/digging-into-node/exercises/files/hello.txtdoesntexist' }
```

If you omit the encoding parameter (second one) then the log will contain the stringified buffer `<buffer ...>` value. We can handle binary buffers (unencoded) in the following way:

```js
fs.readFile(filepath, (err, contents) => {
      if (err) {
          error(err.toString()) // In case you want to convert error object to a string
      } else {
          process.stdout.write(contents) // This works well with binary buffers.
      }
  });
```

```shell
$ ex1.js --file=files/hello.txt
Hello World$_
```

```shell
$ ex1.js --file=files/hello.txtdoesntexist
Error: ENOENT: no such file or directory, open '/Users/pushkardk/Desktop/digging-into-node/exercises/files/hello.txtdoesntexist'
```



**Converting a binary buffer into a string**

Use the **`toString()`** method on it. For example:

```js
function processFile(filepath) {
    fs.readFile(filepath, (err, contents) => {
        if (err) {
            error(err.toString()) // In case you want to convert error object to a string
        } else {
            contents = contents.toString().toUpperCase();
            process.stdout.write(contents) // console.log(contents)
        }
    });
}
```

```shell
$ ex1.js --file=files/hello.txt
HELLO WORLD$_
```

**Note**

If we read a huge file then the above example is *bad* (performance wise). We are reading a huge file as binary buffer, converting it to a string entirely, converting it all into uppercase, and sending it as a string to the standard output where a couple of transformations happen to convert it all back into a buffer before it prints it as a string output on the shell. That is a lot of memory consumed!

Thankfully, there are better ways of doing this (later) and Node really excels at them.



**Reading from standard input**

We can use `process.stdin.read()` but it is really quirky - we have to deal with platform related variations in its behavior.

To read input in a platform agnostic way, we can use a package that does this for us. **`get-stdin`** is a popular package that does this [https://www.npmjs.com/package/get-stdin](https://www.npmjs.com/package/get-stdin). It is a wrapper around the standard input read.

It is a method that returns a *promise* on execution. The `then` clause receives the input content and the `catch` receives the error, if any.

```js
#!/usr/bin/env node

'use strict';

// built-in modules:
const fs = require('fs')
const path = require('path')
const getStdin = require('get-stdin')

// Third party modules:
const args = require('minimist')(process.argv.slice(2), {
    boolean: ['help'],
    string: ['file'] // A file will be a path so it needs to be a string
})

if (args.help) {
    printHelp();
} else if (args.in || args._.includes('-')) {
    // It is a convention among devsto pass `-` at the end of a script sometimes.
    // It means that the remaining arguments to the script will be supplied by standard unput.
    getStdin()
        .then(processFile)
        .catch(error)
} else if (args.file) {
    fs.readFile(path.resolve(args.file), (err, contents) => {
        if (err) {
            error(err.toString()) // In case you want to convert error object to a string
        } else {
            processFile(contents.toString())
        }
    });
} else {
    error('Incorrect usage', true)
}

function processFile(contents) {
    console.log(contents.toUpperCase());
}

// Assume these functions exist:
// function printHelp()
// function error()
```

```shell
$ cat files/hello.txt | ex1.js --in
HELLO WORLD
```

```shell
$ cat files/hello.txt | ex1.js -
HELLO WORLD
```

```shell
$ ex1.js --in

# The enter key press causes input to contain only `\n`
```

```shell
$ ex1.js --file=files/hello.txt
HELLO WORLD
```

The pipe `|` turns an earlier output into an *input stream* for the next command.



**Environment variables**

Apart from file paths and standard inputs, there is another way to pass data to scripts. These are known as **Environment variables**. When these are set, they act as *global variables* throughout the system, available to all tasks.

1. If set in the startup file of a shell (ex: `~/.bash_profile`) then they are available to any script run via that shell, including in a new session.
2. If they are defined by typing them in the terminal of a shell, then they are available from that point till the end of the session to any task run in that shell.
3. We can also provide a ***per-command environment variable***. This is done by prefixing the environment `key=value` pair before the actual command. Ex: `HELLO=WORLD <some-script-or-command>`. Such environment variables are not available outside that command execution. It is the same technique used when tools run something in dev mode as opposed to the production mode (They use different environment variables)

We can fetch the values of environment variables using **`process.env`** object. Any environment variable is a property of this object.

Here is an example code snippet which sets the base path for a file: If BASE_PATH is set, it is used else, use `__dirname`. We will use **`path.join`** to join multiple paths.

```js
#!/usr/bin/env node

'use strict';

// built-in modules:
const fs = require('fs')
const path = require('path')
const getStdin = require('get-stdin')

// Third party modules:
const args = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'in'],
    string: ['file'] // A file will be a path so it needs to be a string
})

const basePath = path.resolve(process.env.BASE_PATH || __dirname)

if (args.help) {
    printHelp();
} else if (args.in || args._.includes('-')) {
    // It is a convention among devsto pass `-` at the end of a script sometimes.
    // It means that the remaining arguments to the script will be supplied by standard unput.
    getStdin()
        .then(processFile)
        .catch(error)
} else if (args.file) {
    fs.readFile(path.join(basePath, args.file), (err, contents) => {
        if (err) {
            error(err.toString()) // In case you want to convert error object to a string
        } else {
            processFile(contents.toString())
        }
    });
} else {
    error('Incorrect usage', true)
}

function processFile(contents) {
    console.log(contents.toUpperCase());
}

// Assume these functions exist:
// function printHelp()
// function error()
```

```shell
$ BASE_PATH=files ex1.js --file=hello.txt
HELLO WORLD
```



## Streams (And Buffers)

What is a **buffer**?

- It is a temporary storage spot for a *chunk* of data that is being *transferred* from one place to another.
- The buffer is *first filled with data* and *then passed along (once it is full)*.
- It is used to *transfer small chunks of data at a time*.

```
Data:
[ o o o o o o o o o o o o o o o o o o o o o o o o o o o o o o o o o ]

Buffer:
[ o o o o ]

Chunk:
o
```

What is a **stream**?

The definition is in its name. It is a *stream of data that flows over time from one place to another*.

```
Data --> sends chunks --> Buffer collects enough chunks --> data is passed along when buffer if full --> ....so on....
```

We can create streams in **Node** for transfer of data.



**Why are streams good?**

- They *increase performance*. Reading and writing huge amounts of data (Esp. files) in one go is a hit on performance. Doing them in chunks is better.
- They are essential for *scalability*. We are able to manage small chunks of data at a time and process them fast. Communication over the internet too happens in small chunks using streams.
- Streams use ***memory*** and ***bandwidth*** efficiently (less) when async operations (such as data chunk arriving from a stream) occur.



**Different types of streams in Node**

1. **Writable streams**: Allows you to write data to a stream.
2. **Readable streams**: Allows you to read data from a stream.
3. **Duplex**: Can both read from and write to a stream. **Transforms** are a special variety of duplux streams.



**Piping**

We can take data (in chunks) from one stream to another using **`pipe()`** as follows:

```js
<readable-stream>.pipe(<writable-streams>)
```

Note that `pipe()` will return a **readable stream** (so that it can be chained).

Readable streams can act as the source but not the destination. Ex: **`fs.createReadStream()`**

Writeable streams can act as the destination but not the source. Ex: **`fs.createWriteStream()`**

A transform duplex stream can read from a readable stream, transform its input, and present that data to the next stream in the pipe. It is most useful in the form:

```js
<readable-stream>.pipe(<transform-stream>).pipe(<writable-stream>)

// The above is important because it helps with chaining:
<readable-stream>
  .pipe(<transform-stream>)
	.pipe(<transform-stream>)
	...
	.pipe(<writable-stream>) // destination
```

**How does piping work?**

The writable stream sends a signal to the readable stream when it is full with data. The read stream will then wait before sending through more data. It gives you a 'high watermark' which is basically signalling the capacity of data that it can process at a given time.



**More resources on streams in Node**

1. [https://github.com/substack/stream-handbook](https://github.com/substack/stream-handbook): Considered as the bible!
2. [https://github.com/workshopper/stream-adventure](https://github.com/workshopper/stream-adventure): Interactive and educational.



**1. Simple piping: Taking content from a readable stream and sending it to a writable stream**

When using streams, we no longer require the `get-stdin` package since we can directly tap into the three most popular streams: **`stdin`**, **`stdout`**, and **`stderr`**.

We also replace `fs.readFile` with `fs.createReadStream`.

```js
#!/usr/bin/env node

'use strict';

// built-in modules:
const fs = require('fs')
const path = require('path')

// Third party modules:
const args = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'in'],
    string: ['file'] // A file will be a path so it needs to be a string
})

const basePath = path.resolve(process.env.BASE_PATH || __dirname)

if (args.help) {
    printHelp();
} else if (args.in || args._.includes('-')) {
    processFile(process.stdin) // Sending the standard input as the input stream.
} else if (args.file) {
    let stream = fs.createReadStream(path.join(basePath, args.file))
    processFile(stream) // Sending the file's contents as an input stream.
} else {
    error('Incorrect usage', true)
}

function processFile(inStream) {
    const targetStream = process.stdout // The standard out is a writable stream
    inStream.pipe(targetStream); // From source to destination
}

// Assume these functions exist:
// function printHelp()
// function error()
```

```shell
$ ex1.js --file=files/hello.txt
HELLO WORLD
```



**2. Processing: Taking content from a readable stream, transforming it, and sending it to a writable stream**

We can use a **transform**. The node built-in module **`stream`** provides us with a **`Transform`** class. We can use this to instantiate a transform stream (a type of a duplex). 

Transform streams help us *step in the middle of a stream pipe* and process it item by item (chunk by chunk). We pass an object to the constructor with a *method* called `transform`. It takes a *chunk, an encoding, and a next callback* as parameters. We can call `this.push()` in order to pass that chunk onto a list (say, an internal array or something) and then invoke the next callback to process the next chunk. `this.push()` makes the chunk available in the stream - it is some kind of filtering.

The callback needs to be invoked because the stream needs to know that *"this chunk has been processed and it needs to move on"*.

Inside `this.push()` we can pass our modiifed data chunk. For example:

```js
this.push(<data-chunk-to-be-part-of-resulting-transform-stream>)
```

Full example:

```js
#!/usr/bin/env node

'use strict';

// built-in modules:
const fs = require('fs')
const path = require('path')
const Transform = require('stream').Transform

// Third party modules:
const args = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'in'],
    string: ['file'] // A file will be a path so it needs to be a string
})

const basePath = path.resolve(process.env.BASE_PATH || __dirname)

if (args.help) {
    printHelp();
} else if (args.in || args._.includes('-')) {
    processFile(process.stdin) // Sending the standard input as the input stream.
} else if (args.file) {
    let stream = fs.createReadStream(path.join(basePath, args.file))
    processFile(stream) // Sending the file's contents as an input stream.
} else {
    error('Incorrect usage', true)
}

function processFile(inStream) {
    const targetStream = process.stdout // The standard out is a writable stream
    const outStream

    const upperStream = new Transform({
        // The constructor takes in an object with a method called `transform`.
        transform(chunk, encoding, next) {
            this.push(chunk.toString().toUpperCase()) // toString() is used to convert binary buffer data to strings
            next();
        }
    })
    outStream = inStream.pipe(upperStream)
    outStream.pipe(targetStream) // From source to destination
}

// Assume these functions exist:
// function printHelp()
// function error()
```

```shell
$ ex1.js --file=files/lorem.txt
// Outputs the entire file (chunk by chunk)
```

**Note:** If you want to really see that the data is being written one chunk at a time (stream) and not as a whole, introduce a delay in the transform method before calling `next` and observe the script execution:

```js

function processFile(inStream) {
    const targetStream = process.stdout // The standard out is a writable stream
    const outStream

    const upperStream = new Transform({
        // The constructor takes in an object with a method called `transform`.
        transform(chunk, encoding, next) {
            this.push(chunk.toString().toUpperCase()) 
          	// toString() is used to convert binary buffer data to strings
            setTimeout(next, 2000) // introducing 2sec delay in chunk processing
        }
    })
    outStream = inStream.pipe(upperStream)
    outStream.pipe(targetStream) // From source to destination
}
```



**3. Writing to a file using streams**

Till now we wrote to the standard output but we can write to a file using streams as well.

Example: We will use a CLI argument `--out` if we want to output to the standard output, else we will output to a file `out.txt` in the execution directory.

To write to a file using streams, you need to create a write stream file using **`fs.createWriteStream()`**.

```js
#!/usr/bin/env node

'use strict';

// built-in modules:
const fs = require('fs')
const path = require('path')
const Transform = require('stream').Transform

// custom modules:
const args = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'in', 'out'],
    string: ['file']
})


const basePath = path.resolve(process.env.BASE_PATH || __dirname)
const outFile = path.join(basePath, 'out.txt')

if (args.help) {
    printHelp();
} else if (args.in || args._.includes('-')) {
    processFile(process.stdin) // Sending the standard input as the input stream.
} else if (args.file) {
    let stream = fs.createReadStream(path.join(basePath, args.file))
    processFile(stream) // Sending the file's contents as an input stream.
} else {
    error('Incorrect usage', true)
}

function processFile(inStream) {
    let targetStream

    // Choose stdout or a file based on args:
    if (args.out) {
        targetStream = process.stdout
    } else {
        targetStream = fs.createWriteStream(outFile)
    }

    const upperStream = new Transform({
        transform(chunk, encoding, next) {
            this.push(chunk.toString().toUpperCase()) 
            next()
        }
    })

    inStream
        .pipe(upperStream)
        .pipe(targetStream) // From source to destination
}

// Assume these functions exist:
// function printHelp()
// function error()
```

```shell
$ ex2.js --file=files/lorem.txt
# Contents of lorem.txt are written to out.txt file
```

```shell
$ ex2.js --file=files/lorem.txt --out
# Contents of lorem.txt are written to standard output
```



**The `zlib` module**

Node has a built-in module called **`zlib`**. It is used for stream-based gzipping and unzipping. It serves as a more useful transformation example. [https://nodejs.org/api/zlib.html](https://nodejs.org/api/zlib.html)

To create a gzip (compression) stream, use: `zlib.createGzip()` (transform/duplex stream)

To create an gunzip (uncompression) strwam, use: `zlib.createGunzip()` (transform/duplex stream)

The gzipping protocol was designed with streaming in mind which makes it easy to use with node streams.

```js
#!/usr/bin/env node

'use strict';

// built-in modules:
const fs = require('fs')
const path = require('path')
const Transform = require('stream').Transform
const zlib = require('zlib')

// custom modules:
const args = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'in', 'out', 'compress'],
    string: ['file']
})


const basePath = path.resolve(process.env.BASE_PATH || __dirname)
let outFile = path.join(basePath, 'out.txt')

if (args.help) {
    printHelp();
} else if (args.in || args._.includes('-')) {
    processFile(process.stdin) // Sending the standard input as the input stream.
} else if (args.file) {
    let stream = fs.createReadStream(path.join(basePath, args.file))
    processFile(stream) // Sending the file's contents as an input stream.
} else {
    error('Incorrect usage', true)
}

function processFile(inStream) {
    let targetStream
    let outStream

    const upperStream = new Transform({
        transform(chunk, encoding, next) {
            this.push(chunk.toString().toUpperCase())
            next()
        }
    })
    outStream = inStream.pipe(upperStream)

    // Gzip the stream after it has been transformed
    if (args.compress) {
        let gzipStream = zlib.createGzip()
        outStream = outStream.pipe(gzipStream)
        outFile = `${outFile}.gz`
    }

    // Choose stdout or a file based on args:
    if (args.out) {
        targetStream = process.stdout
    } else {
        targetStream = fs.createWriteStream(outFile)
    }

    outStream.pipe(targetStream) // From source to destination
}

// Assume these functions exist:
// function printHelp()
// function error()
```

**Note**: Vim automatically unzips and displays a zipped file with the extension `.gz`. You can use `cat` to verify that it indeed compressed the file.

Chunks come in one by one, not at the same time and definitely not synchronously. For example, changing a part of the above snippet to...

```js
//...
else if (args.file) {
    let stream = fs.createReadStream(path.join(basePath, args.file))
    processFile(stream) // Sending the file's contents as an input stream.
    console.log('End');
}
//...
```

... will produce the output:

```shell
$ ./ex3.js --file files/hello.txt --out
End
HELLO WORLD$_
```

The file was obviously processed after the `End` was printed.



**Detecting the end of a stream**

We have seen that the end of the stream cannot be ascertained easily. We need a signal that the stream has ended. The stream provides an event to tell us when the stream has ended. Using the `on` method available on a stream, we can listen to many events, one of them being `end`. We can write a helper function that listens to the end of a stream and returns a promise:

```js
function streamComplete(stream) {
    return new Promise(resolve => {
        stream.on('end', resolve);
    });
}
```

We can modify the process file function so that it is an async function that waits for `streamComplete` function to resolve on the `outStream` and then we will print the end message:

```js
async function processFile(inStream) {
    let targetStream
    let outStream

    //...
    //...
    //...

    outStream.pipe(targetStream) // From source to destination

    // Wait for stream completion so that we may end with a message:
    await streamComplete(outStream);

    console.log('\n\nStream complete')
}
```

The whole snippet when run will give us the output:

```shell
$ ./ex3.js --file files/hello.txt --out
HELLO WORLD

Stream complete
$_
```



**Asynchronous cancellation and timeout**

Promises are great at resolving or rejection but they are also *kind of like a black box*. That is, we do not know the status of the process inside until it moves to an end state of the promise.

If the processing is too large and we wanted it to timeout or cancelled for some other reason, it cannot be done with promises. However, there are libraries that help you do this exact same thing by way of wrapping around a generator function (instead of a promise returning function). One such library is **`CAF`** written by Kyle (https://github.com/getify/caf)



**Unpiping**

We can use **`unpipe`** in the same way as `pipe` to unsend data from a readable stream to a writable stream. In this way, whatever was sent can be revoked or discarded. For example:

```js
outStream.pipe(targetStream) // Will pipe the chunk into the target
outStream.unpipe(targetStream) // Will unpipe it, nullifying the earlier pipe
```

Note that we *cannot* unpipe after the *stream has completed*.



**Killing the stream processing**

We call the **`destroy()`** method on a stream to do so. Example:

```js
outStream.destroy()
```



**Topics not covered in notes (but part of course)**:

1. Child processes
2. Web servers
3. Database

---




