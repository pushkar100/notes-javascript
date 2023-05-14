# Functional Lite JS v2

## Kyle Simpson

### Imperative Programming

HOW to do it? (Ex: binary code, assembly lang). Move this here, save variable here, delete this, etc.

### Declarative Programming

WHAT should happen? (Ex: Angular, React). Ex: I want this data I have to be displayed.
(More abstraction compared to imperative)

Less abstraction: mostly imperative
More abstraction: mostly declarative
We don't have completely declarative code.

### Why FP?

- We are reusing patterns that have been tested for many years (~100) and even longer mathematical history (provable)
- The math concepts help prove that the unit test written for it IS going to pass before we even test it
- Reader of the code need not know how the different functions in fp work (coz it's tested for years)
- Less to read (we already have functions to do stuff - you can trust your fp tools)
- Therefore, code is more readable!

### Procedure

A collection of instructions

### Pure Functions

Take in some inputs, compute an output and "return" it

It does not have "side effects":

- Use something that was not explicitly passed to it
- Does not update/modify something that was not passed to it

Summary:

- It does NOT observe NOR change the state outside of the function itself
- No matter how many times we call a function, if inputs are same, output will also be the same

**Note**: All functions are procedures, but not all procedures are functions!

### Why do we NOT want "side effects"?

Although easier to write, it is harder to understand code.

For example: If we have f() on line 500, and it uses x & y without x & y being passed to it, we will have to understand the modifications to x & y between lines 1 & 499. Therefore, we cannot take f() out of the context of the rest of the code to understand what happens when we invoke it!

Side effects are:
1. Not a direct output but an indirect one. i.e Changes or references values of variables outside of what is passed
2. Can be observed (in the system) when it happens

### Advantages of Pure functions

1. Increases readability
2. Can do much better testing
3. Can trust code: This f() returns exactly X for inputs Y (always)

### Common side-effects

1. Printing to console
2. Writing to I/O
3. Updating or inserting DOM elements
4. Write to a file system
5. Making a network request (Ex: XHR)
6. Using & updating timestamps
7. Randomness (Ex: Math.random())

Looking at 5 points above, it is really hard to not have side-effects! Therefore, we CANNOT write programs WITHOUT ANY side effects

What do we do?
- Make as much of your program without Side effects 
- Make the place of side effects obvious (Maybe keep them in a very specific location)
- Label these functions as having side-effects

Explanation: It is like having 2 buckets, one for NO SE, one for SE (So you know where to look when something goes wrong)

For example: React's side effects w.r.t DOM are only in render() since it updates DOM only there

### Purifying a function

#### Technique 1 (Best)

For a function depending on side-effects, enclose side-effect variables in lexical scope. Ex: Outer function executing the inner side-effect-ridden function. Now, the outer function becomes pure. Calling the outer function makes it stand-alone (i.e value from execution is independent of surrounding context)

**Note**: Outer function is a pure function wrapper over the impure inner function!

Code examples:

```
// Initial, Impure (Bad) Function:
function f() {
	y = x * 2 + 1
}

var x = 0
var y = f() // 1

x = 2
y = f() // 3
```

```
// Refactored with pure wrapper:
function F(x) {  
  return f(x)
  
  function f(x) {
  	y = x * 2 + 1
  }
}

var y = F(0) // 1
y = F(1) // 3
```

#### Technique 2 (Only if Technique 1 is not possible)

Creating an INTERFACE to an impure function when Technique 1 is NOT possible. Call the interface from outside.

Steps:
- Capture the Current state (& Set it to something predictable)
- Run the side effect function
- Reset the state to original one (as if nothing had changed)

Code examples:
```
function f() {
	y = x * 2 + 1
}

function F(curX) {
	// Capture current state
	var [origX, origY] = x, y
	// Run side effect:
	x = curX
	f()
	newY = y
	// reset state:
	[x, y] = [origX, origY]
	// Return output of side effect
	return newY
}

var x, y
F(0) // 1
F(1) // 3
```

**Note**:
- **Side Cause**: Means that we are utilizing an outside variable's value inside the function
- **Side Effect**: Means that we are changing an outside variable's value inside of the function

#### Tips while purifying a function

- **In Techique 1**: You must include side causes in your input list and include side effects in the output 
- **In Technique 2**: Therefore, we must capture side causes in your wrapper function and include side effects in your output (HINT: Create an array of multiple o/ps) 

HINT for handling multiple outputs: Create an array of multiple o/ps

Example:
```
// Impure function:
function foo(x) {
	y++;
	z = x * y;
}

var y = 5, z;

foo(20);
z;		// 120

foo(25);
z;		// 175
```

```
// Technqiue 1:
function bar(x, y) {
	var z
	foo(x)
	return [y, z]

	function foo(x) {
		y++
		z = x * y
	}
}

bar(20, 5) // [6, 120]
bar(25, 6) // [7, 175]
```

```
// Technique 2:
function foo(x) {
	y++
	z = x * y
}

function bar(curX, curY) {
	var [oY, oZ] = [y, z]
	y = curY
	foo(curX)
	var [nY, nZ] = [y, z]
	var [y, z] = [oY, oZ]
	return [nY, nZ]
}

var y, z

bar(20, 5) // 120
bar(25, 5) // 175
```

### Understanding purity in Javascript

We must strive for *"observable"* purity. It is impossible to have only pure functions

Example 1:
```
const y = 1

function foo(x) {
	return y + x
}

foo(1) // 2
```

Even thought the above function `foo()` depends on the external `y`, it is always gonna give back the same output for an input because `y` is a constant and won't change. Therefore `foo()` is pure in this case
High level of confidence.

Example 2:
```
function foo(bar) {
	return function (x) {
		return bar(x)
	}
}

foo(function times2(x) {
	return x * 2
})(3) // 6
```

In the above snippet, `foo()` is pure because it returns a function that remembers input.
The inner function is also pure since `bar()` does not change between `foo()` & its execution.
If `bar()` gets reassigned before inner function can be run, then it is not a pure function anymore
High level of confidence.

Example 3:
```
function foo(obj) {
	return obj.id
}
```

The above is pure because for every unique object structure that is passed to it, returns the same value.
High level of confidence.

Example 4:
```
function foo(obj) {
	return obj.id
}

var obj = {
	get id() {
		return Math.random()
	}
}
```

The above is not pure because everytime we pass in the same object, it can return a different value each time.
Low level of confidence.

Therefore, context matters. ***Observable purity*** in Javascript is important (can't have only pure functions).
We shouldn't do stuff like getters that return random numbers.

### Point-free style

Point in this case means parameter. Instead of mapping a parameter to another function's argument explicitly, we remove the need for it completely, by using an implicit style.

Example:
```
//Point style
foo(function(x) {
	return bar(x)
)}

// Point-free style
foo(bar)
```

#### Example of using a utility function to create point-free style code

A function that returns a boolean value is called a *predicate function*

Original:
```
function isOdd(x) {
	return x % 2 === 1
}

function isEven(x) {
	return !isOdd(x)
}

isEven(4) // true
```

Creating a utility function that negates the value of a boolean function:
(generic, can be used for negating any kind of predicate function)
```
function not(fn) {
	return function (...args) {
		return !fn(...args)
	}
}

function isOdd() {
	return x % 2 === 1
}

var isEven = not(isOdd) // point-free definition of isEven

isEven(4) // true
```

But, the utility function has a point-style now! Yes. However, point-free style does not mean that we have to always use this style. We must use this style in MOST of our code, keeping the other style in well-established utilities that are reused, helping us keep other parts point-free. 

Advantages of point-free style:
1. Reduces verbosity of code (shorter)
2. Is less confusing & more readable (`not(isOdd)` is easier to understand than `function() { return !isOdd(x) }`)

Tips for converting to point-free style:

1: Direct input mapping
```
function A(x) {
	return B(x)
}

// Above can be written as:
var A = B

// Use B.bind(<context>) prior to using point-free style if B expects a certain context always
```

2: When you need to use the same function, but with negation (`!`)
```
function isLongEnough(str) {
	return !isShortEnough(str);
}

// Above can be written as below by creating a utility function 'not'
function not(fn) {
	return function(...args) {
		return !fn(...args)
	}
} 

isLongEnough = not(isShortEnough)
```

3: When you have to decide execution of a function based on the truthfulness of a predicate function
```
var msg1 = "Hello";
var msg2 = msg1 + " World";

function printIf(predicate) {
	return function(msg) {
		if (predicate(msg)) {
			output(msg);
		}
	};
}
printIf(isShortEnough)(msg1);		// Hello
printIf(isShortEnough)(msg2);

// Above can be written as below by using the utility function 'when'
function when(fn) { // fn: the final function to be run
	return function(predicate){ // predicate: fn will be run if predicate is true (non-falsy)
		return function(...args){ // args: args to the original 'fn'
			if (predicate(...args)) {
				return fn(...args);
			}
		};
	};
} // We can use this utility to supply different final functions, predicate functions, and args

var printIf = when(output)

printIf(isShortEnough)(msg1);		// Hello
printIf(isShortEnough)(msg2);

// Usage of when: 
// when(<function-to-run>)(<predicate-it-depends-on)(<args-to-function-to-run>)
```

### Composition & Pipes

The objective is to make the data flow between functions more declarative! Data flow must be easily understandable

**Higher Order Functions**: Functions that either take other functions as input or return a function as output or both. 

**Piping**: Taking one function's output and making it the input to another function

**Composition**: A particular arrangement of the higher-order functions. Also a type of pipe (?)

Composition vs Pipe:

1. In composition, you will list the functions in the order that is convenient to us (Right to Left)
	
```
foo(bar(baz(2))) can be composed as compose(foo, bar, baz)(2)
```

2. In piping, you will list the functions in order of execution (Left to right). This is because we give output of one function to another as input.

```
foo(bar(baz(2))) can be composed as pipe(baz, bar, foo)(2)
```

Compose and pipe both do the same things but in different ways. There is no right or wrong approach, choose one as you deem fit (Sometimes one makes more sense over the other)

#### Why use compose & pipe?

If we created another function that takes in all the inputs to compute them one by one and return the result, we'd be passing too many input parameters and the order of execution is clear only from the name of the function. In compose, 
1. We are using less parameters, and 
2. Watching the data flow through functions

Example: Without compose
``` 
function sum(x, y) {
	return x + y
}

function multBy10(a) {
	return a * 10
}

function sumMultAndMultBy10(x, y) {
	return multBy10(sum(x, y))
}

sumAndMultBy10(1, 5) // 60
```

Example: With compose
```
function sum(x, y) {
	return x + y
}

function divideBy(a, z) {
	return a / z
}

function compose(f1, f2) {
	return function(...args) {
		return f1(f2(...args))
	}
}

var sumAndMultBy10 = compose(multBy10, sum)
sumAndMultBy10(1, 5) // 60
```

Compose & pipe are more *point-free style* of doing things.

Complete compose & pipe example:
```
function increment(x) { return x + 1; }
function decrement(x) { return x - 1; }
function double(x) { return x * 2; }
function half(x) { return x / 2; }

function compose(...methods) { // R to L
	return function(...result) {
		for(var i = 0; i < methods.length; i++) {
			result = methods[i](...result)
		}
		return result
	}
}

function pipe(...methods) { // L to R
	return compose(...methods.reverse())
}

var f = compose(decrement,double,increment,half);
var p = pipe(half,increment,double,decrement);

f(3) === 4;
// true

f(3) === p(3);
// true
```

With a list operation, a function composition is basically a *reduce*

### Mutability

There are two types of mutability

1. **Assignment mutability**: This is achieved by using `const`
2. **Value mutability**: Whenever we change an array index or object property, we are mutating it. The changes reflect in the original array if it was passed down to us before the change occurred

**Assignment vs Value immutability**

Assignment mutability is not very helpful. It tells you that a variable cannot be reassigned but it does not tell you that it's values can be mutated

```
const a = 5
const x = [1, 2, 4]

a = 6 // error!
x = [1, 2] // error!
x[1] = 10 // allowed!! (Hence, const does not guarantee value immutability)
```

Value immutability is ***more important*** because:

1. The values can be ported to other parts of code where they can be mutated (& changes appear in the original array)
2. When we write code, we must be able to **trust it**. If we want something to be immutable, we must define it as such, and if we are dealing with 3rd party objects that are passed down, we must not mutate them (copy and return instead)

**Ways to make immutable objects**

1. Use an immutable library (ex: ImmutableJS) to define lists or objects and their operations

   ```javascript
   var state = immutable.list.define(1, 9, 10)
   newState = state.set(19, 'a') // can't mutate, returns new state & we save it
   newState // 1, 9, 10, 19, 'a'
   state // 1, 9, 10
   
   // These libraries usually store only the difference between states, so that we don't always create a copy of the entire state, wasting space
   ```

2. Use something in-built in the language for simple purposes (if you think a library is too heavy)

   ```javascript
   // 1. Using Object.freeze(<array-or-object>):
   var x = Object.freeze([10, 20, [0, 5]])
   x[1] = 30 // ERROR!
   x[2][0] = 4 // Allowed, since freeze() is a shallow freeze
   
   // 2. Using .map() or other built-in while passing :
   var list = [9, 1, 5, 22, 8, 10, 12]
   sortTheList(list.map(n => n))
   ```

**Modifying an object or an array that we have received**

```javascript
var myList = [1, 2, 4]

// Don't do this:
function doubleIt(list) {
    for(let i = 0; i < list; i++) {
        list[i] = list[i] * 2
    }
}
doubleIt(myList)

// Do this:
function doubleIt(list) {
    var newList = []
    for(let i = 0; i < list; i++) {
        newList[i] = list[i] * 2
    }
    return newList
}
myList = doubleIt(myList)
```

**Complete example**

```javascript
// # Instructions

// 1. Define `pickNumbers(..)` so that it's a pure function (other than the randomness!) which generates a new random lottery number (using `lotteryNum()`) and adds it to the list.

// 2. `pickNumbers(..)` should always keep the list of lottery numbers sorted in ascending order. Also, no duplicates!

function lotteryNum() {
	return (Math.round(Math.random() * 100) % 58) + 1
}

function pickNumbers(list) {
	var nums = list.slice() // make sure you copy orig array and not mutate it
	var num
	do {
		num = lotteryNum()
	} while(nums.indexOf(num) !== -1)
	nums.push(num)
	nums.sort(function (a,b) {
		return a - b
	})
	return nums
}

var luckyLotteryNumbers = [];

for (var i = 0; i < 6; i++) {
	luckyLotteryNumbers = pickNumbers(
        Object.freeze(luckyLotteryNumbers)
        // OR
        // luckyLotteryNumbers.map(n => n)
    ) // passing something immutable
}

console.log(luckyLotteryNumbers)
```

### Closure

Closure is the concept where a function that is taken out of it's lexical scope and executed elsewhere, will still remember the variables from the earlier scope.

Ex: Event handler functions, AJAX callbacks (any async callback), etc.

Closure becomes possible when:
1. Functions can be passed around (as first-class objects)
2. Functions follow lexical scoping

By nature, functions use variables outside it thanks to closure. Does this violate functional programming concepts? Not really. It depends on the situation i.e If we have a high degree of confidence that the variable in closure cannopt change by the time the function gets executed, it is perfectly okay to use closure in functional programming.

Example:
```javascript
function unary(fn) {
    return function execUnary(arg) {
        return fn(arg)
    }
}

// We have a high level of confidence that `fn` is not going to change between lines 1 & 3.
// Therefore, `unary` and `execUnary` are pure
```

**Referential Transparency**

A function must be observationally transparent. That is, if we replace the function with its return value and it does not affect the state of pthe program, it is referentially transparent.

```javascript
function foo() {
    let id = 0
    return function() {
        return id
    }
}

var x = foo()
x() // 0
x() // 0
x() // 0

// We can replace the functon with its value and the state is consistent
// Not referentially transparent
```

```javascript
function foo() {
    let id = 0
    return function() {
        return id++
    }
}

var x = foo()
x() // 0
x() // 1
x() // 2

// We CANNOT replace the functon with its value and the state is inconsistent
// Not referentially transparent
```

#### General to Specialized application using Closures

We can defer the execution of a function by passing partial arguments bit by bit. Consider a function that adds 3 numbers:

```javascript
function add(x, y, z) {
    return x + y + z
}

var add345 = add(3, 4, 5) // 12
```

Now, if adding was:
1. An expensive operation, and 
2. We did not have all the data, and needed to pass on the function to a 3rd party

In such a case, **partial application** or **currying** helps!

**Partial Application**

There are only 2 levels of functions: One for partial args, one for all the remaining args.

```javascript
function add(x, y, z) {
    return x + y + z
}

function partial(fn, ...firstArgs) {
    return function applied(...remainingArgs) {
        return fn(...firstArgs, ...remainingArgs)
    }
}

var addTo3 = partial(add, 3)
addTo3(4, 5) // 12
```

**Currying**

There can be `n` levels of functions: Each time we pass in arguments bit-by-bit

```javascript
function add(x, y, z) {
    return x + y + z
}

function curryAdd(fn, firstArg) {
    return function curryMore(secondArg) {
        return function applied(thirdArg) {
            return fn(firstArg, secondArg, thirdArg)
        }
    }
}

var add3 = curryAdd(add, 3)
var add4 = addTo3(4)
var add5 = add4(5) 
add5 // 12
```
---
