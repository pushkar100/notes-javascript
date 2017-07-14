# Learning ES6

1. 1995 - Javascript Created (Brendan Eich)
2. ECMA - European Computer Manufacturer's Association, governing body for setting javascript standards for the browser.
3. 1997 - ECMAScript 1
4. 2009 - ECMAScript 5
5. 2015 - ECMAScript 6

Not all browsers support ES6 (as of 2017) and the ones that do still do not completely support all features.

## Transpiling

The process of taking ES6 code and converting it to ES5 so that the code may run on browsers.

Transpiling is also done to other scripts like CoffeeScript & TypeScript (converted to plain JS).

### Common Transpilers

1. Babel
2. Traceur
3. Closure

We will use **Babel** because it is the transpiler which supports most number of ES6 features as compared to the rest.

Alternatively, we can download **Chrome Canary** browser (currently, a beta version) which also supports most of the ES6 features and run our code on it.

## Babel.js

Most popular E6-to-ES5 transpiler.

1. Input ES6 > Output ES5
2. Created by *Sebastian McKenzi*e (Australian now at FB)
3. Used tightly with **React.js** (Developed @ FB)

### In-Browser Transpiling

In-Browser Transpiling will degrade the performance of our scipt because the transpiling will happen during runtime, slowing down code execution.

We can use it to test code snippets, small changes, etc.

We need to include the babel **browser.js** script  (preferrably CDN link) in the head (or before our custom script).

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/6to5/3.6.5/browser.js"></script>
```

We also need to change the type of our custom js script from `text/javascript` to `text/babel` for the browser to execute it.

Example: 
```
<head>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/6to5/3.6.5/browser.js"></script>
	<script type="text/babel">
		var nameBuilder = function(firstName="John", lastName="Doe") {
			console.log(firstName + " " + lastName);
		};

		nameBuilder();
	</script>
</head>
```
**Note:** Currently (2017 July) Chrome can run the above snipper without Babel.

### Transpiling ES6 with `babel-cli` and `babel-node`

A better way to transpile ES6 to ES5 is to do it before runtime, on our systems. 

Install `babel` on the system via NPM on NodeJS.

```
sudo npm install -g babel-cli
```

Install globally or locally. With or without `-g`. Also, `babel-cli` used to be part of `babel` package. 

How to use `babel-cli`: https://babeljs.io/docs/usage/cli/

**Compiling an ES6 script to ES5: Run the following:**

```
babel script.js --out-file script-compiled.js
```

Here, `script.js` is an input file (ES6 code) and `script-compiled.js` is the script that is created after transpilation (It is passed as the name of the output file to the `--out-file` option). If `--out-file` is not used (just `babel script.js`), the result is sent to standard output (shown on the screen).

**Add a watcher:**
When we want to compile the ES6 code as and when we are editing it, we can specify a `--watch` option that helps babel keep an eye on the changes we make to the source file and integrate those changes into the transpiled output file.

Example: 
```
babel script.js --watch --out-file script-compiled.js
```

It is similar to the way `grunt` task manager watches for changes in files (say, less files and outputs css).

**Using ES6 in NODEJS coding:**

For this purpose (For use of ES6 in server side scripting and not in the browser), we may use the `babel-node` package.

If a node script contains ES6 features that it does not support, it will throw an error. For example,`node node-script.js` might throw an error saying `let` keyword is not recognised.

We can instead use `babel-node node-script.js` to successfully execute ES6 node code.

(A lot of ES6 features are supported by NodeJS, however. More features than what most browsers support.)

**Note:**
1. `babel-cli` comes with a second CLI, `babel-node`, which works exactly the same as Node.js’s CLI, only it will compile ES6 code before running it.
2. You should not be using babel-node in production. It is unnecessarily heavy, with high memory usage due to the cache being stored in memory. 
3. Checkout https://github.com/babel/example-node-server for an idea of how to use Babel in a production deployment (of a node app).

### Using WebPack Build Tool:

All solutions for transpiling that we have seen till now have been manual. We can use a **Build Tool** to help automate process like transpiling, SAS conversion, etc. **Webpack** is one such build tool. Webpack will run all the dependencis and load all the loaders specified.

Steps to run `webpack`:
1. We need a project folder which is initialized as a node repository.
2. Run `npm init` to create a node project with `package.json` file which holds all the dependencies.
3. Install `webpack` as the first dependency by running `sudo npm install -g webpack` (Useful to do a global install of webpack).
4. Install a `babel-loader`. This is the loader responsible for transpiling ES6 to ES5. This package transpiles JS files using Babel and webpack. Run `npm install --save-dev babel-loader` (Saves it as a dependency in the `package.json` file)
5. New: If running webpack with just babel-loader gives errors, install the loader along with `babel-core` like so: `npm install babel-core babel-loader --save-dev`
6. Write your `webpack.config.js` configuraton file and run `webpack` on the CLI. This should load all dependencies and loaders and create the output js file. This output js file is what we include as our script in our html files.

`webpack.config.js` syntax example:
```
module.exports = {
	entry: './script.js', /* The main file to compile*/
	output: {
            filename: 'bundle.js' /* Output file name */
        },
	module: {
		loaders: [
			{
                            test: /\.js?/, 
                            loader: 'babel-loader', 
                            exclude: /node_modules/
                        }
		] 
        /* Test all js files, load the 'babel-loader' and exclude checking files in the node_modules dir */
	}
};
```

Therefore, the final script we include in our HTML is:
```
<script src="bundle.js">
```

There is a lot of loaders we can use with webpack - like images loader, css loader, etc.

We can think of webpack as a **bundling tool** that bundles all our scripts.

## ES6 Syntax:

### `let` Keyword
ES6 provides *block scoping* by the way of `let` keyword. `var` keyword has been used traditionally to provide function scope (global scope if used in global). Now, inside block scopes such as conditionals and loops, we may use `let`.

Examples:
```
var x = 10;
if(x) {
    var x = 4;
}
console.log(x); // 4
```

```
var x = 10;
if(x) {
    let x = 4;
}
console.log(x); // 10
```

`let` is a great way to enforce block-scoping in Javascript, for example:
```
// Snippet 1: With 'var' and a closure/async function inside loop
for(var i = 0;i < 5;i++) {
  setTimeout(function() {
    console.log(i);
  });
} // Output: 5 5 5 5 5

// Snippet 1: With 'let' and a closure/async function inside loop (Enforce it to remember)
for(let i = 0;i < 5;i++) {
  setTimeout(function() {
    console.log(i);
  });
} // Output: 0 1 2 3 4
```

### `const` keyword

`const` is a keyword that serves as an alternative to `var` (like `let` does). It prevents the reassignment of a variable once it has been declared and initially assigned.

A `const` item must be assigned during its declaration!

Examples:
```
const a; // SyntaxError: Missing initializer in const declaration
```

```
const a = 5;
console.log(a); // 5
a = 5; // TypeError: Assignment to constant variable.
```

Useful example:
```
function coldOrNot(temp) {
	const freezingTemp = 0;
    return freezingTemp >= temp ? "cold" : "not cold";
}

console.log(coldOrNot(10)); // not cold
console.log(coldOrNot(-10)); // cold
console.log(coldOrNot(0)); // cold
console.log(coldOrNot(5)); // not cold
```

### Template Strings

Template strings in JavaScript help us store variables and expressions within a string. 

Normally, values are concatenated with strings using the `+` operator (as in ES5). Example:
```
function greet(name) {
	return "Hello, " + name;
}
greet('Ram');
```

The template string can by multiline.

The same string can be written as a template string in ES6. 
- Use back tick `` ` `` to delimit the string. 
- The variables must be enclosed in `${}` inside the string.
- Not just variables, expressions can also be enclosed.

Example:
```
function computeTax(name, amount) {
  const taxRate = 0.12;
  return `Welcome ${name},
  Amount: $${amount}
  Tax: $${0.12 * amount}
  Total: $${amount + 0.12 * amount}
  `;
}
computeTax('Rahul', 200);

// Output:
"Welcome Rahul,
  Amount: $200
  Tax: $24
  Total: $224
  "
```

### Spread Operators (And rest parameter)

The spread operator consists of three dots `...`. The spread operator can:
1. Turn elements of an array into arguments of a function call, or
2. Turn elements of one array into elements of an array literal.

Spread is a powerful operator.

**Example 1:** Turning one array's elements into elements of another array:
```
/* Without spread: */
var letters = ['a', 'b', 'c'];
var numbers = [1, 2, 3];
console.log(['@', '$', numbers, '&', '*', letters]); 

/* Output: 
["@", "$", Array(3), "&", "*", Array(3)] - Creates subarrays 
*/ 

/* With spread: */
var letters = ['a', 'b', 'c'];
var numbers = [1, 2, 3];
console.log(['@', '$', ...numbers, '&', '*', ...letters]);

/* Output: 
["@", "$", 1, 2, 3, "&", "*", "a", "b", "c"]
*/
```

**Spread in function calls:**
The spread operator expands an array into individual parameters when using the dots in a function call.

**Example 2:** Expanding array into individual parameters of a function:
```
let doWork = function(x, y, z) {
    return x + y + z;
}
 
console.log(doWork(...[1, 2, 3])); // 6
```

**Spread vs Rest parameters:**
- A rest parameter will collect individual parameters into an array when you use the dots in a function parameter definition.
- The spread operator expands an array into individual parameters when using the dots in a function call (and it can also open expand array elements inside another).

We can use spread and rest together. 

**Example 3:** Using spread and rest:
```
var doWork = function(x, y, z){ // x = 1, y = 2, z = 3
    return x + y + z;
}
 
var doSomething = function(...args){ // rest
    return doWork(...args); // spread
}
 
var result = doSomething(...[1,2,3,4,5]); // spread
console.log(result); // 6
```

**Example 4:** A rest parameter ++must be the last parameter++ in the list of formal parameters (Everything to its right is included in itself). If we want separate parameters, they must be added to the *left* of the rest parameter:
```
function sumAndMultiply(multiplier, base, ...elts) {
	var sum = elts.reduce(function(acc, elt) {
		return acc + elt;
	}, base);
	return sum * multiplier;
}
sumAndMultiply(2, 4, 5, 6, 7); // 44
```

## ES6 Functions & Objects

### Default function parameters

In ES6, we can set default values for parameters. So if a parameter has a default value but is not passed to the function then instead of having a value of `undefined` it will have that default value.

```
function foo(a = 5) {
	console.log(a);
}
foo(); // 5
foo(10); // 10
```

Before default parameters was included in ES6, we had to set default params like this:
```
function foo(a) {
	a = a || 5;
	console.log(a);
}
foo(); // 5
foo(10); // 10
```

### Enhancing object literals

Object methods are traditionally written like this:
```
var cat = {
	meow: function(times) {
		console.log(Array(times).join('meow'));
	}
}

cat.meow(4); // meowmeowmeow
```

ES6 provides a simpler and more elegant syntax to **object methods** (Removal of the colon(:) and function keyword).
```
var cat = {
	meow(times) {
		console.log('meow'.repeat(times));
	}
}
cat.meow(4); // meowmeowmeowmeow
```

**Note:** `repeat(x)` is a new String function in ES6 which repeats the given string `x` times.

### `=>` Arrow functions

ES6 provides a way to shorten the *function expressions* used in JavaScript. Function expressions or anonymous functions are used extensively in cases such as callbacks, event handlers, IIFEs, etc.

Traditionally, a function expression is like this:
```
var foo = function(message) {
	console.log(message);
}
foo('Hi!');
```

The above function expression can be converted into an arrow function like this:
```
var foo = message => console.log(message);
foo('Hi!');
```

**Rules for constructing an arrow function**

Specifying Parameters:
1. `() => { ... } // no parameter`
2. `x => { ... } // one parameter, an identifier`
3. `(x, y) => { ... } // several parameters`

Specifying a body:
1. `x => { return x * x }  // block`
2. `x => x * x  // expression, equivalent to previous line`

Therefore, we can exclude the `return` keyword if the body is just one expression. The return value will be the result of that expression.

```
var sum = (x, y) => x + y;
console.log(sum(2, 3)); // 5
```

#### Arrow functions and `this` keyword

One common problem we had in traditional functions, especially with callbacks, was with the value of the `this` keyword:

```
var obj = {
	greet: 'Hi',
	names: ['John', 'Mary'],
	prop: function() {
		this.names.forEach(function(name) {
			console.log(this.greet + ' ' + name);
		});
	}
};
obj.prop();

/* Output:
undefined John
undefined Mary

(The `this` is not referring to the `obj` object 
inside callback of the prop method.)
*/
```

The callback function does not have the same `this` object as the parent function (`obj` in this case). It has changed to global(`window`).

There are two traditional (ES5) ways to fix this:
1. `var that = this` method
2. `bind(thisArg)` method

```
/* 1. var that = this; method */
var obj = {
	greet: 'Hi',
	names: ['John', 'Mary'],
	prop: function() {
		var that = this;
		this.names.forEach(function(name) {
			console.log(that.greet + ' ' + name);
		});
	}
};
obj.prop();

/* Output:
Hi John
Hi Mary
*/
```

```
/* 2. `bind(thisArg)` method */
var obj = {
	greet: 'Hi',
	names: ['John', 'Mary'],
	prop: function() {
		this.names.forEach(function(name) {
			console.log(this.greet + ' ' + name);
		}.bind(this));
	}
};
obj.prop();

/* Output:
Hi John
Hi Mary
*/
```

**Note:** `bind()` is Function prototype method and it can be called in two ways:
1. If function is a function expression, we can just append to it: `var x = function() {...}.bind(someThis);` (or even for a callback function expression parameter).
2. If function is a proper function definition, then enclose it in brackets: `(function() {...}).bind();`.

**Solving `this` problem with arrow functions:** Arrow functions retain the enclosing scope. `this` points at the nearest bound `this` - in the code provided `this` is found in the enclosing scope.

```
/* 2. `bind(thisArg)` method */
var obj = {
	greet: 'Hi',
	names: ['John', 'Mary'],
	prop() {
		this.names.forEach(name => console.log(`${this.greet} ${name}`) );
	}
};
obj.prop();

/* Output:
Hi John
Hi Mary
*/
```

**Important:** Arrow functions do not have `this`, `arguments` or other special names bound at all - when the object is being created the name this is found in the enclosing scope, not the person object. 

```
window.name = "global";

var person = {
    name: "jason",

    shout: function () {
        console.log("my name is ", this.name);
    },
    shout2: () => {
        console.log("my name is ", this.name);
    },
    // Shorter syntax
    shout3() {
        console.log("my name is ", this.name);
    }
};

person.shout();  // "jason"
person.shout2(); // "global"
person.shout3(); // "jason"

/* 
Enhanced object literals support 
short syntax for property functions. 
'this' will be bound as you expect there. 
*/
```

### Destructuring Assignment

Destructuring assignment gives us an easy way to extract data from arrays and objects and assign them to variables.

**Example with Arrays:** Fetching all the cities of Karnataka:
```
// Traditionally:
var cities = ['bangalore', 'delhi', 'mumbai', 'mysore', 'cochin'];
console.log(cities[0], cities[3]); // bangalore mysore

// ES6 Destructuring: Wrap LHS variables with []
var [blr, , , mys, ] = ['bangalore', 'delhi', 'mumbai', 'mysore', 'cochin'];
console.log(blr, mys); // bangalore mysore
```

**Example with Objects:** Fetching only the required properties.
```
// Traditionally:
var vacation = {
	place: 'Hawaii',
	fun: 'surfing',
	on: 'June 20th'
};
console.log(vacation.place, vacation.fun); // Hawaii surfing

// ES6 Destructuring: Wrap LHS variables with {}
var {place, fun} = {
	place: 'Hawaii',
	fun: 'surfing',
	on: 'June 20th'
};
console.log(place, fun); // Hawaii surfing
```

We ++need not++ always destructure the main object/array itself, we may even used the passed object or array and manipulate that inside functions:
```
var vacation = {
	place: 'Hawaii',
	fun: 'surfing'
};

function planVacation({place, fun, people}) {
	console.log(`Come to ${place} to do some ${fun}`); 
	/* Come to Hawaii to do some surfing */
}

planVacation(vacation);
```

**Note:** The destructuring assignment need not have variable names that exactly match the property name or an array value.

### Generators (& `yield`)

Generators are a new type of function in ES6 which allow us to **pause a function** during execution.

(**Note:** If we are doing runtime transpilation using browser.js, We will require one more CDN script in order to support ES6 generators: https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.29/browser-polyfill.js)

Generator functions have an asterisk `*` following the `function` keyword (Sometimes, they are also having the asterisk preceding the function name).

We can use `yield` to pause the function and return a value (Actually, it's an object containing 'done' and 'value' properties).

`yield` takes an *expression* as its argument.

The generator function needs to be called/invoked first. That returns an object which has a`next()` method which when called pauses at every `yield`. Every execution of `next()` method moves onto the next `yield` (every pause where 'done' is `false`) or to the end of the function ('done' is `true`).

```
function* director() {
	yield "One";
	yield "Two";
	yield "Three";
	yield "Action!";
}

/* Function call returns an object related to generators having next() method */
var countDown = director(); 
 
/* 
"countDown.next();" 
will return an object {done, value} 
where done is a boolean indicating 
if there are any more pauses or not
and value is the value of that yield
*/

console.log(countDown.next().value); // One
console.log(countDown.next().value); // Two
console.log(countDown.next().value); // Three
console.log(countDown.next().value); // Action!
```

Generators make it much easier to create **Asynchronous functions** and the benefits are really quick to observe in it.

Example:
```
function* eachItem(arr) {
	for(let i = 0;i < arr.length;i++) {
		yield arr[i];
	}
}

var letters = eachItem(['a', 'b', 'c', 'd']);

var ABCs = setInterval(() => {
	var letter = letters.next();
	if(letter.done) {
		clearInterval(ABCs);
		console.log('Now I know my ABCs');
	} else {
		console.log(letter.value);
	}
}, 100); // Async function

/* Output:
a
b
c
d
Now I know my ABCs
*/
```

## ES6 Classes

Many languages have been using Object Oriented Style coding for long except JavaScript. Initally, JS did not have any OO concepts, and prototypal inheritance was used to create classes (not exactly - they were still just functions).

Now, with ES6, we can create Classes and instantiate objects in JS. ++However++, ES6 classes are *syntactical sugar* over the Objects and prototypes that we’re used to working with. They simply offer a much nicer, cleaner and clearer syntax for creating these objects and dealing with inheritance.

Therefore, functionally, `class` is little more than syntactic sugar over the *prototype-based behavior delegation capabilities* we've had all along.

A class can have 'properties' and 'methods' (Which can be written in the enhanced object notation). 

A special `constructor` method can be defined which can setup the newly created object (something like an `initialize()` for the new object)

### Class creation and instantiation
Use the `class` keyword and the class name followed by `{}` for the class body:

```
class Vehicle {
	constructor(description, wheels) {
		this.description = description;
		this.wheels = wheels;
	}
	describeYourself() {
		console.log(`I am a ${this.description} with ${this.wheels} wheels`);
	}
}
var coolSkiVan = new Vehicle("cool ski van", 4);
coolSkiVan.describeYourself(); // I am a cool ski van with 4 wheels
```

**Points to note about classes:**
- Classes can ++only++ contain method definitions, ++not++ data properties. (Hence, constructor can be used for initializing `this.propName`).
- When defining methods, you use ++enhanced object notations++.
- You can refer to properties on instances of the class directly.
- You don't have to define a constructor function. If you choose not to, the engine will insert an empty one for you: (Which constructs nothing).

Assigning a class to a variable is called a **class expression**.

Example:
```
// This is an anonymous class expression -- you can't refer to the it by name within the class body.
const Food = class {
    // Class definition is the same as before. . . 
}

// This is a named class expression -- you /can/ refer to this class by name within the class body . . . 
const Food = class FoodClass {
    // Class definition is the same as before . . . 

    //  Adding new method, to demonstrate we can refer to FoodClass by name
    //   within the class . . . 
    printMacronutrients () {
      console.log(`${FoodClass.name} | ${FoodClass.protein} g P :: ${FoodClass.carbs} g C :: ${FoodClass.fat} g F`)
    }
}

const chicken_breast = new Food('Chicken Breast', 26, 0, 3.5);
chicken_breast.printMacronutrients(); // 'Chicken Breast | 26g P :: 0g C :: 3.5g F'

// . . . But /not/ outside of it
try {
    console.log(FoodClass.protein); // ReferenceError 
} catch (err) { 
    // pass
}
```

**`static` methods inside classes:**
The `static` keyword defines a static method for a class. 

Static methods are called without instantiating their class and cannot be called through a class instance. 

Static methods are often used to create utility functions for an application.

```
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.hypot(dx, dy);
  }
}

const p1 = new Point(5, 5);
const p2 = new Point(10, 10);

console.log(Point.distance(p1, p2));
```

Therefore, `static` methods are called as properties of the class (class name) and *not* of the instantiated object of the same class.

### Class Inheritance
Classes can be inherited by using the `extends` keyword. A class that is inheriting a parent is also known as a **subclass**.

Class declarations that don't use the extends keyword are called **base classes** (Topmost Parent in the inheritance chain):

1. If your derived class needs to refer to the class it extends, it can do so with the `super` keyword.
2. A derived class ++can't++ contain an empty constructor. Even if all the constructor does is call `super()`, you'll still have to do so explicitly. It can, however, contain *no* constructor.
3. You must call `super` in the constructor of a derived class before you use `this`

```
class Vehicle {
	constructor(description, wheels) {
		this.description = description;
		this.wheels = wheels;
	}
	describeYourself() {
		console.log(`I am a ${this.description} with ${this.wheels} wheels`);
	}
}

var coolSkiVan = new Vehicle("cool ski van", 4);

coolSkiVan.describeYourself();

class SemiTruck extends Vehicle {
	constructor() {
		super("semi truck", 18)
	}
}

var groceryStoreSemi = new SemiTruck();
groceryStoreSemi.describeYourself();

/*
Output:
I am a cool ski van with 4 wheels
I am a semi truck with 18 wheels
*/
```

**Uses of `super` keyword:**
- ++Within subclass constructor calls++. If initializing your derived class requires you to use the parent class's constructor, you can call `super(<parentConstructorParameters>)` within the subclass constructor, passing along any necessary parameters
- ++To refer to methods in the superclass++. Within normal method definitions, derived classes can refer to methods on the parent class with dot notation: `super.methodName`

### Using ES6 Classes with ReactJS

Earlier in React, we used to use a custom `creatClass` method to build classes and objects to be used inside react. 

With ES6, the same class syntax can be used in react (removing the need for `createClass`) making the syntax much more elegant and plain-JS like (Easy to understand).

**Remember:** The class that we create must extend a ++base class++ called `React.Component`.

**Traditionally(pre ES6):**
```
var Restaurant = React.createClass ({
	render: function() {
		return (<div>
				<h1>{this.props.name}</h1>
			</div>)
	}
});

React.render(<Restaurant name="Matey's Shrimp Shack"></Restaurant>, document.body);
```

**Current(ES6):**
```
/* Uses Class syntax & Enhanced object notation inside */

class Restaurant extends React.Component {
	render() {
		return (<div>
				<h1>{this.props.name}</h1>
			</div>)
	}
}

React.render(<Restaurant name="Matey's Shrimp Shack"></Restaurant>, document.body);
```

### Handling State in React with ES6 Classes

We can use the new ES6 syntax inside the React component class that we have created. That is, with enhanced object notations, arrows functions, etc.

++One thing to remember:++ Whenever the render function is called, the other methods of the class are **out of scope** and trying to access `this` will throw an error. 

++To fix this:++ Inside the constructor, we must reassign a method of the class to itself but with `this` passed via a `bind()` call. After this, whenevet those class methods are called, everything works as expected.

Example:
```
class Restaurant extends React.Component {
	constructor(){
		super();
		this.state = {
			status: "not open"
		};
		this.openRestaurant = this.openRestaurant.bind(this);
		this.closeRestaurant = this.closeRestaurant.bind(this);
	}
	openRestaurant(){
		this.setState({
			status: "open"
		});
	}
	closeRestaurant(){
		this.setState({
			status: "not open"
		});
	}
	render() {
		return (<div>
				<h1>{this.props.name}</h1>
				<p>The restaurant is {this.state.status}.</p>
				<button onClick={this.openRestaurant}>Open Restaurant</button>
				<button onClick={this.closeRestaurant}>Close Restaurant</button>
			</div>);
	}
	}

	React.render(<Restaurant name="Matey's Shrimp Shack"></Restaurant>, 
document.body);
```

## What's Proposed in ES7

ES7 is going to be the next standard. But, it will take a long time before it comes into effect and the proposed features in ES7 might still undergo multiple, radical changes themselves.

The themes that are being focused on currently in ES7 are:
- Asynchronous
- Concurrency
- Class improvement

**Note: Node version 4+ offers a lot of support for ES6**


**{THE END}**
