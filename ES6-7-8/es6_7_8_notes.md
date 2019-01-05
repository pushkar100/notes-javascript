# ES6, ES7, and ES8 Notes

[Source of this tutorial](https://www.udemy.com/es6-es7-and-es8-its-time-to-update-your-javascript)

Additions to each ECMAScript standard:

- **ES6**: 
  - `let` & `const`
  - Template Literals
  - Tagged Templates
  - Rest operator and Default parameters
  - Spread Syntax
  - Arrow Functions
  - Object Literals & Destructuring
  - Classes (Including Setters & Getters)
  - Arrays
    - `for...of`
    - `Array.from()`
    - `Array.of()` and `Array.prototype.fill()`
    - `Array.prototype.find()` and `Array.prototype.findIndex()`
  - `Map`, `WeakMap`, `Set`,  and `WeakSet`
  - Symbols (New Data Type)
  - Promises
  - Proxies
  - Reflect Object
  - Generators, Iterators, Iterables (and `for..of`)
- **ES7**:
  - Exponentiation operator `**`
  - `Array.protoype.includes()`
  - Rest Parameter Destructuring
- **ES8**:
  - Async & Await
  - `Object.values()` and `Object.entries()`
  - `String.prototype.padStart()` and `String.prototype.padEnd()`
  - `Object.getOwnPropertyDescriptors()`
  - Trailing commas in functions

## `let` and `const`

####  `var` based variables are:

- *Function scoped* 
- Their *declarations are hoisted to the top of the function* they appear within. (If they are declared in the global scope then they are scoped to and hoisted in the global execution context)

```javascript
function foo() {
    for(var i = 0; i < 3; i++) {
        console.log('loop ' + i);
    }
    console.log(i); // 'i' is still accessible outside the 'for' block
}

// 'i' is not acccessible here though! - since it is scoped & hoisted only to 'foo()'

foo();

/* Output:
loop 0
loop 1
loop 2
3
*/
```

```javascript
var x = 0;
function foo() {
    console.log(x);
    var x = 1; // Declaration is hoisted within 'foo'
    // (Note: only declaration is hoisted, not the assignment/value!)
    console.log(x);
}
foo();

/* Output:
undefined
1
*/
```

#### `let` is a block-level (`{}`) declaration that:

- Behaves in a similar way to `var` but with **two** differences:
- First, It is *block-scoped* (`{}`), so it only exists inside the block that it appears in (& *not* the function that it appears in). That is, it only lasts as long as the brackets do...
- Second, *Hoisting does not apply to `let`*! Unlike `var`, `let` declarations are not taken and hoisted to the top of the block

```javascript
function foo() {
    for(let i = 0; i < 3; i++) {
        console.log('loop ' + i);
    }
    console.log(i); // REFERENCE ERROR (X): 'i' is not defined
	// Cannot access 'i' outside the 'for' BLOCK
}

// 'i' is not acccessible outside its block, & therefore, outside the function as well

foo();
```

```javascript
function foo() {
	let i; // 'i' is declared inside the function BLOCK (Hence, scoped to it)

    for(i = 0; i < 3; i++) {
        console.log('loop ' + i);
    }
    console.log(i); // Since 'i' is now scoped to the function BLOCK (No error)
}

// 'i' is not acccessible outside its block

foo();

/* Output:
loop 0
loop 1
loop 2
3
*/
```

```javascript
let i = 10;
console.log(i);
if(i === 10) {
	let i = 0; // "shadowing" just like in 'var'
	// (This block's 'let' takes precedence over parent block's due to "shadowing")
	console.log(i);
}
console.log(i);

/* Output:
10
0
10
*/
```

```javascript
let x = 0;
function foo() {
    console.log(x); // REFERENCE ERROR: 'x' is not defined
    let x = 1; // 'let' declarations are not hoisted to the block
    console.log(x);
}
foo();
```

**Note: Two tricky concepts regarding `let` and `var`**

1. Even though `let` is not hoisted inside a block or a function, it will still **"shadow"** an outer block/function variable with the same name (whether it is another `let` or a `var`)

```javascript
var x = 0;
function foo() {
    console.log(x); // ReferenceError: x is not defined
    let x = 1; // Declaration is hoisted within 'foo'
    // (Note: 'let' will still "shadow" outer variable with same name)
    console.log(x); // 1
}
foo();
```

2. Some REPLS of Javascript, for some weird reason, could hoist `let` when it is in the *global scope* (& this is the only exception)

#### `const` is also block-level (`{}`) declaration that:

1. Is similar to `let` (i.e block-scoped, not hoisted to the block, capable of "shadowing")
2. It has to be *initialized during declaration*
3. A `const` variable *cannot be re-assigned using `=`*. That is, the reference to whatever it stores can never be changed

**Note**: Although a `const` cannot be re-assigned later, if the value it references can be mutated(w/o using `=`), it can be done so without causing any errors! This rule applies to mutable data types like arrays, objects, and functions but not to primitives

```javascript
const x = 5;
x = 10; // TypeError: Assignment to constant variable.
```

```javascript
const x = [1, 2, 3];
x.push(4); // No error since this is a mutation and not a reassignment using '='
console.log(x);

/* Output:
[1, 2, 3, 4]
*/
```

```javascript
function foo() {
    console.log(x); // REFERENCE ERROR (X): 'x' is not defined
    const x = 1; // Just like 'let', 'const's are not hoisted to the block
    console.log(x);
}
foo();
```

```javascript
// `const` can also "shadow" outer consts of same name in nested functions:
const x = 0;
function foo() {
    const x = 1;
    console.log(x);
}
foo();

/* Output:
1
*/
```

**Summary of `var`, `let`, and `const`:**

1. `var`: is function-scoped, declaration is hoisted to the top of the function, and it "shadows" outer function variables of the same name in inner (nested) functions
2. `let`: is block-scoped, declaration is not hoisted to the top of the block, and it "shadows" outer block variables of the same name in inner (nested) blocks
3. `const`: is block-scoped, declaration is not hoisted to the top of the block, and it "shadows" outer block consts of the same name in inner (nested) blocks. Additionally, it cannot be reassigned using `=` (throws error). However, if the value it was assigned is a mutable value (say, an object), that value can be mutated (without using `=`)

**Trick: We can use isolated blocks**

```javascript
let x = 5;
{
    let a = 10;
    const b = 20;
    console.log(x, a, b); // 5 10 20
}
// Cannot access 'a' and 'b' here, but x can be accessed!
```

## Template Literals

Earlier in ES5, Javascript strings were constructed using either `''` or `""`. While these work just fine, doing certain things like the following became cumbersome and hard to read:

- String interpolation (i.e Including dynamic values inside strings): We have to use the ` +` to concatenate the different parts
- Multiline strings: Not possible unless you use the `+` again or place each single-line string in an array and perform a `.join('\n')`

```javascript
var str1 = 'SELECT * FROM Users WHERE name = "' + name + '" AND city = "' + city + '" AND age = "' + age + '"';
```

```javascript
var multiline = 'This is line 1\n' + 'This is line 2\n' + 'This is line 3';
var multiline2 = ['This is line 1', 'This is line 2', 'This is line 3'].join('\n');
```

**Template Literals** in ES6 solve the above two issues. It uses the back-tick (`) for its syntax:

- Allows **String Interpolation**: By using `${}` inside template strings to hold values/expressions
- Allows **Multiline Strings**: It just preserves the whitespace and newlines (The syntax allows you to write on new lines until the closing back-tick(`))

**Note**: *Any valid javascript expression can be interpolated*, and not just variables (Ex: Ternary `?:` expressions)

```javascript
var str1 = `SELECT * FROM Users WHERE name = "${name}" AND city = "${city}" AND age = "${age}"`;
```

```javascript
var str1 = `This is line 1,
and this is line 2, and
   this is line 3 with some leading space`;

/* Output:
"This is line 1,
and this is line 2, and
   this is line 3 with some leading space"
*/
```

## Tagged Templates

The use cases of this new syntax or feature are ***limited***! But, it is still worth knowing...

**What do tagged templates do?**

Whenever we want to work with string templates inside a function, instead of passing all the dynamic params and static strings separately to the function, we can use a more concise and readable syntax

**How tagged templates work:**

- The syntax for the call is:

  ```javascript
  <function-name><templatestring>
  ```

- The above calls a function which receives at least two things:

  - First, an *array of all the static parts of the string*, in the order that they appear
  - From the second arguments onwards, *each interpolated expression*, in the order that they appear

  ```javascript
  var flowers = ['Tulip', 'Lotus'];
  
  function buildHTML(arrayOfStaticStrings, expression1, expression2) {
      console.log(arrayOfStaticStrings);
      console.log(expression1, expression2);
  }
  
  buildHTML`I want to collect ${flowers[0]} and ${flowers[1]} flowers`;
  // This is equivalent to calling:
  // buildHTML(['I want to collect ', " and ", " flowers"], flowers[0], flowers[1])
  
  /* Output:
  ["I want to collect ", " and ", " flowers"]
  Tulip Lotus
  */
  ```

**Note**: The function is any normal javascript function that can return anything

**Use Cases of Tagged Templates:**

- DOM insertion of templates, building HTML. Ex: append, prepend, etc
- Styled Components in React ([Article Link](https://www.styled-components.com/docs/basics)) ... and similar stuff ...

**Example**

```javascript
// Append to a particular DOM element (with currying) example:
let flowers = ['Tulip', 'Lotus'];

function buildHTML(tags, list) { 
    let appendHTML = list.map(function(item) {
       return `${tags[0]}${item}${tags[1]}`;
    });
    return function(element) {
        document.querySelector(element).innerHTML += appendHTML.join('');
    }
}

let appendFlowersTo = buildHTML`<li>${flowers}</li>`; 
// Sends tags: ['<li>', '</li>], list = ['Tulip', 'Lotus']
appendFlowersTo('body');
```

## Rest operator and Default parameters

**Default Parameters**

We can set default values on the parameters passed to the function. Therefore, if the parameter value is not passed (or is passed in `undefined`) in the function invocation then the default value of that parameter is set for use within the function. 

**Note**: The order of the params being passed cannot be changed (always has to match formal args' order)

```
function foo(a = 5, b, c = 1) {
    return a * b * c;
}

console.log(foo(1, 2)); // 2
console.log(foo(undefined, 2, 3)); // 30
console.log(foo(undefined, 2)); // 10
```

**Rest Parameters**

Earlier in javascript, there was no mechanism to collectively refer to or combine the multiple arguments passed to a function. There is the `arguments` object that is available but it is not exactly an array (in fact, it's an array-like object) and it will contain every argument ever passed to it (and in that order). They keys of this object are numbers starting from `0` upwards. Hence, we can refer to elements inside of it with array index access

```javascript
function foo(a, b, c, d) {
    console.log(arguments); // { 0: "a", 1: "b", 2: "c", 3: "d"}
}

foo('a', 'b', 'c', 'd');
```

There are drawbacks to using `arguments`:

1. It is *not an array* but an array-like, iterable object
2. It contains *all the arguments*, *not customizable* to contain only the things we want it to contain

This is where ***rest parameters*** come into play. We can use the **`...`** operator to combine the 'rest of the parameters' into elements of an array denoted by that rest param name. 

1. Rest parameter must *always be the last argument in the function signature*. Placing another argument after it will throw an error!
2. We can have as many named params preceding the rest parameter, and *only the remaining arguments are packed into the rest param's array value*

```javascript
function foo(a, b, ...remaining) {
    console.log(a, b, remaining); // a b ["c", "d"]
}

foo('a', 'b', 'c', 'd');
```

```javascript
function foo(a, b, ...remaining, d) { 
    // ERROR (X): SyntaxError: Rest parameter must be last formal parameter
    console.log(a, b, remaining);
}

foo('a', 'b', 'c', 'd');
```

```javascript
function findMaxUnderBound(upperBound, ...elements) {
    return elements
            .filter(el => el <= upperBound)
            .reduce((prev, cur) => (prev < cur) ? cur : prev);
}

findMaxUnderBound(80, 90, 60, 77, 78, 45, 82, 56);
```

Rest parameter always appears only in the function's formal parameters list (that is, the arguments' list in the function signature)

## Spread Syntax

The spread operator does exactly the opposite operation of  what a rest parameter does. They both use the same `...` syntax but where they appear defines them

- A rest parameter "packs" all the data into one single array
- A spread operator ***"unpacks" values from an array or object and separates them out***

Note that rest parameter always appear only in the function's formal parameters list (that is, the arguments' list in the function signature)

Spread on the other hand appears in the following places:

1. Within a *function invocation* to separate out arguments from a list/object (i.e in the set of actual params)
2. It can appear *within arrays* to spread out elements of another array within this array
3. It can appear *within objects* to spread out elements of another object within this object

**Note**: Unlike rest parameters, spread syntax does not have to be the last item in an object/array/function call.

```javascript
// For a function that accepts a specific set of arguments, we can use spread in the the function call to effectively pass an array/object which will be received as separate arguments:
function foo(a, b, c) {
    console.log(a, b, c); // 5 6 7
}

let arr = [5, 6, 7];
foo(...arr); // Equal to: foo(arr[0], arr[1], arr[2]);
// Also equal to: foo.apply(this, arr);
```

Therefore, the spread operator can replace `.apply()` calls, unless you want to dictate the `this` value

```javascript
function foo(a, b, c = 1) {
    console.log(a, b, c); // 5 6 1
}

let arr = [5, 6];
foo(...arr, 1); // Spread, unlike rest, does not have to be the last item in the args list
```

Spread item, unlike a rest parameter, does not have to be the last argument inside a function call or an array or an object

**Spread syntax in arrays**

We have already seen an example in the function invocation example above.

Common use case: ***Copying one array into another array (of same or bigger size)***

```javascript
let arr = [3, 4, 5];

let arr1 = [...arr]; // copying 
let arr2 = [1, 2, ...arr];
let arr3 = [...arr, 1, 2];
let arr4 = [1, 2, ...arr, 6, 7];

console.log(arr1); // [3, 4, 5]
console.log(arr1 === arr); // false 
console.log(arr2); // [1, 2, 3, 4, 5]
console.log(arr3); // [3, 4, 5, 1, 2]
console.log(arr4); // [1, 2, 3, 4, 5, 6, 7]
```

**Spread syntax in objects**

It works in the way you can intuitively guess it, it copies the key-value properties of one object and puts them in another object. 

Common use case: ***Copying one object into another object (of same or bigger size)***

```javascript
let obj = {
    foo: 1,
    bar: 2
};

// Copy object:
let obj2 = { ...obj }; // same as Object.assign({}, obj);

// Copy object as a subset of another object:
let obj3 = { baz: 3, ...obj };

console.log(obj, obj2, obj3);// {foo: 1, bar: 2} {foo: 1, bar: 2} {baz: 3, foo: 1, bar: 2}
console.log(obj2 === obj); // false (coz its a copy)
console.log(obj3 === obj); // false (coz it's a copy)
```

```javascript
// Practical use: not mutating input state in a reducer (redux)
// Making a copy of state
function aReducer(state, action) {
    if(action.type == 'ADD_ID') {
        let newState = { ...state, id: action.payload.id };
        return inputState;
    }

    return state;
}
```

**Note**: In function calls, we can only spread out arrays (& in function definition we use rest to fetch multiple args into one single array). We do not use spread and rest for objects in function calls and definition. We use something known as **object destructuring** (Later)

**Summary**

- Use `=` in formal params of a function (i.e signature) to assign default parameters
- Rest params "pack" multiple arguments of a function into a single array. This happens in the function definition.
- Rest uses the preceding `...` syntax. It has to be the last parameter in a set of formal parameters
- Spread, in a way, does the opposite of rest - It "unpacks" items of an array or object into separate items
- Spread deals with both arrays and objects (rest param deals only with arrays)
- Rest param can appear inside the function definition (i.e formal params), spread item can appear inside the function invocation (i.e actual params)
- Uses of spread: Copying one array into another, copying one object into another, separating out elements from an array and passing them to a function
- **Important**: We cannot use spread to separate out object key/value pairs and pass them to a function. For this purpose, we use something known as **destructuring**

## Arrow Functions

Arrow functions in javascript are used to simplify the syntax of anonymous functions. They also server another explained below:

1. Syntax: `function(...) { ... }` is now **`(...) => { ... }`** 
2. Syntax variations:
   1. No parameters? **`() => { ... }`** is the same as `function() { ... }`
   2. Single parameter? **`param => { ... }`** is the same as `function(param) { ... }`
   3. Multiple parameters? **`(param1, param2, ..) => { ... }`** is the same as `function(param1, param2, ..) { ... }`
   4. Direct return statement?  **`() => <expr> `** is the same as `function() { return <expr>; }`

Apart from syntax, there is a major difference between the earlier anonymous function calls and the arrow function: Arrow functions **do not modify the `this`**. That is, they do not set the *context* (by following the 4 rules that govern the value of  `this`  when a function is invoked. [link](https://jsbin.com/zojoyu/28/edit?js,console))

The value of `this` inside an arrow function is equal to what the `this` is inside of the parent function inside which the call to the arrow function was made

```javascript
let obj = {
    foo: function() {
        let bar = function() {
            console.log(this);
        };
        let baz = () => {
            console.log(this);
        };

        bar(); // Context is set: `this` inside is the `window` object
        
        baz(); // No context set: `this` inside the arrow function 
        // is the same as the this for the parent function inside which it was called
        // => parent is 'foo' and according to the way it was called, its `this` is `obj`
    }
}

obj.foo(); // Context is set: 'this' inside foo() will be `obj`

/* Output:
Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, parent: Window, …}
{foo: ƒ}
*/
```

**Useful example of an arrow function:** DOM manipulation & API call promises (Also, async callbacks)

```javascript
// Earlier solution for accessing 'this' of parent function:
$doc.on('click', function() {
    var self = this;
    makeAPICall('...')
        .then(function() {
	        console.log(self); // Will refer to the parent anonymous function's `this`
            console.log(this); // Will refer to the makeAPICall() object
        });
});
```

```javascript
// New solution for accessing 'this' of parent function: Arrow functions
$doc.on('click', function() {
    var self = this;
    makeAPICall('...')
        .then(() => {
            console.log(self); // Will refer to the parent anonymous function's `this`
            console.log(this); // Will also refer to the parent anonymous function's `this`
        });
});
```

## Object Literals & Destructuring

Objects in JS can be defined in the following 3 ways:

1. `var x = new Object()`
2. `var x = Object.create(null)`
3. `var x = {}` (*Object literals*)

For defining and updating objects literals, ES6 has introduces new features:

1. If the *name of the property* and the *variable* being assigned to it are the same, we can shorten it like so:

   ```javascript
   let name = 'Tom', age = 25;
   let obj = {
       name,
       age
   };
   obj.name; // 'Tom'
   obj.age; // 25
   ```

2. Methods can be written in a shorter syntax by *omitting the `:` and the `function` keyword*:

   ```javascript
   let name;
   let obj = {
       name,
       doSomething() {
           console.log('Method');
       }
   };
   obj.doSomething(); // 'Method'
   /* Equal to:
       doSomething: function() { 
           console.log('Method');
       }
   */
   ```

### Object destructuring

Given an object, we can pick individual properties out from it and set them as separate variables. The syntax is `const/let/var { <propName>, <propName>, ... } = <Object>`. It does no affect the object itself in any way.

```javascript
const obj = {
  foo: 1,
  bar: 'a',
  baz: 'Hi'  
};

const { foo, bar, baz } = obj; // 3 new constants created
console.log(foo, bar, baz);  // 1 a Hi

// Original object is unchanged:
console.log(obj.foo, obj.bar, obj.baz);  // 1 a Hi
```

Additionally, we can ***change the names of the variable that is being created***, although this is less commonly used. The syntax changes to `<propName>: <variableName>`

```javascript
const obj = {
  foo: 1,
  bar: 'a',
  baz: 'Hi'  
};

const { foo: a, bar: b, baz: c } = obj; // 3 new constants created
console.log(a, b, c);  // 1 a Hi

console.log(foo); // ReferenceError: foo is not defined

```

**Destructuring parameters of a function**

When you need to access properties of an object passed to a inside the function, you can make use of destructuring. This makes us use only the properties of the object we intend to use in our function and also makes the code less messy/more readable

```JavaScript
const obj = {
  foo: 1,
  bar: 'a',
  baz: 'Hi'  
};

function showFooBar({ foo, bar }) { // Receiving only the desired properties
  console.log(foo, bar); // 1 a
}

showFooBar(obj); // Passing the whole object
```

Destructing an object into function params gives us a way to set named params where the order of arguments do not matter

**Destructuring nested objects**

We can destructure nested object in the following fashion. In case of accessing arrays inside an object, it has to be assigned a new variable name like so: `<arrayPropName>: { [<index>]: <newVariableName> }`

```javascript
const obj = {
  foo: 1,
  bar: {
    one: 'Hola',
    two: 'Bye'
  },
  baz: [10, 20, 30]
};

const { bar: { one, two: theTwo }, baz: {[1]: middle } }= obj;

console.log(one, theTwo, middle);

console.log(two); // ReferenceError: two is not defined
console.log(baz); // ReferenceError: baz is not defined
```

### Array Destructuring

It is similar to object destructuring except that instead of mapping the keys, here the indices of the array are mapped to variables (so every index used will have a new variable associated with it)

The variables are matched in the order of the indices. You can even "hop over" indices by leaving them blank (`,`)

```javascript
const arr = [10, 20, 30, 40, 50];

const [ first, second ] = arr;
console.log(first, second); // 10 20
```

```javascript
const arr = [10, 20, 30, 40, 50];

const [ , second, , , fifth ] = arr;
console.log(second, fifth); // 20 50
```

**Making use of rest operator (`...`) in array destructuring**

```javascript
const arr = [10, 20, 30, 40, 50];

const [ , second, , ...others ] = arr;
console.log(second); // 20
console.log(others); // [40, 50]
```

You cannot use rest in object destructuring because, if you remember, it can only combine elements into an array (not an object)!

## Classes

Classes in ES6 are just **syntactical sugar** over the existing *prototype-based inheritance system* of javascript. Every function that is created ss associated with a prototype object (`__proto__`) and that object's constructor refers back to the function

Whenever the function is called with the `new` keyword, the following things happen:

1. A new object is created
2. The `this` for the function is set the the newly created object
3. The function is executed (& therefore the newly created object now has properties) and it returns the newly created object
4. The newly created object is added to the function's prototype chain (i.e connected to the `__proto__` object associated with the function)

`<funcName>.prototype`: Refers to the prototype object associated with the function

`<prototypeObject>.constructor`: Refers to the function associated with the prototype object

```javascript
// Constructor functions are written in PascalCase (convention)
function Superhero(name, strength, speed, weapon, specialMove) {
  // set object's properties:
  this.name = name;
  this.strength = strength;
  this.speed = speed;
  this.weapon = weapon;
  // Define object's methods:
  this.doSpecialMove = function() {
    console.log(specialMove);
  }
}

// Prototype methods shared by all object of this class:
Superhero.prototype.powerUp = function() {
  this.strength += 5;
};
Superhero.prototype.speedBoost = function(boost) {
  this.speed += 10;
};

// Instantiating an object from the class using the 'new' keyword:
var batman = new Superhero('Bruce Wayne', 70, 85, 'belt', 'kappow!');
batman.powerUp();
batman.speedBoost(5);
console.log(batman); // Superhero {name: "Bruce Wayne", strength: 75, speed: 95, weapon: "belt", specialMove: ƒ}

batman.doSpecialMove(); // kappow!
```

**Converting into class syntax**

1. Use `class <ClassName> { ... }` 
2. Inside the class, define all the object's properties and methods inside the **`constructor()`** method. This method is ***run first*** on every object instantiation
3. Set you prototype methods and prototype properties as other *members of the class* (outside the constructor)

```javascript
class Superhero {
  constructor(name, strength, speed, weapon, specialMove) {
    // Set object's properties:
    this.name = name;
    this.strength = strength;
    this.speed = speed;
    this.weapon = weapon;
    // Define object's methods:
    this.doSpecialMove = function() {
      console.log(specialMove);
    }
  }
  // Prototype methods shared by all objects: Defined as class members
  powerUp() {
    this.strength += 5;
  }
  speedBoost(boost) {
    this.speed += 10;
  }
}

// Instantiating an object from the class using the 'new' keyword:
var batman = new Superhero('Bruce Wayne', 70, 85, 'belt', 'kappow!');
batman.powerUp();
batman.speedBoost(5);
console.log(batman); // Superhero {name: "Bruce Wayne", strength: 75, speed: 95, weapon: "belt", specialMove: ƒ}

batman.doSpecialMove(); // kappow!
```

**Note**:

1. Class methods (prototype methods) can be written similar to object literal method shorthands. `<name>() { ... }`
2. Class methods are *not separated by commas(,)* as is done between object literal methods

**`static` methods of a class**

We can have methods defined on a class instead of any object or on the prototype. Precede the class method with the keyword `static` in order to intialize it as a static method. This method is invoked directly using the class (& not the object) - It belongs to the class, not the object.

This is useful in cases where we have a method that is dependent on the class but not on the object

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  appendToName(app) {
    this.name += app;
  }
  static someStaticMethod() { // A static method on the class `Person`
    console.log('Static method of class Person');
  }
}

Person.someStaticMethod(); // "Static method of class Person"

let boy = new Person('Pushkar');
boy.appendToName(' DK'); // No error -> It is prototype method (object related)
boy.someStaticMethod(); // TypeError: boy.someStaticMethod is not a function
```

### Setters & Getters

Setters and Getters are special methods used in both *classes* as well as *object literals*.

**Setters**: *bind an object property to a function to be called when there is an attempt to set that property.*

```javascript
// Setter syntax:
set prop(val) { . . . }
set [expression](val) { . . . } // For a computed property name to bind to the given function.
```

For a setter to get triggered, just use assignment `=` on that set function name. Ex: `obj.prop = 5`

**Getters**:  *bind an object property to a function that will be called when that property is looked up.*

```javascript
// Getter syntax:
get prop() { ... } 
get [expression]() { ... } // For a computed property name to bind to the given function.
```

For a getter to get triggered, just use it in a javascript expression with its name. Ex: `let a = obj.prop`

1. **Example use inside object literals:**

```javascript
var obj = {
  log: ['a', 'b', 'c'],
  set latest(value) {
    this.log.push(value);
  },
  get latest() {
    if(!this.log.length)
      return undefined;
    return this.log[this.log.length - 1];
  }
}

console.log(obj.latest);
obj.latest = 'd';
console.log(obj.latest);

/*
Output:
c
d
*/
```

2. **Example use inside classes:**

```javascript

```

**Important: We have a problem when getter & setter names exactly match an object's property**

When this is the case, and we are *setting the same property inside the setter*, JavaScript runs out of memory because call stack exceeds the limit. This problem occurs in both classes as well as object literals!

```javascript
// This code throws an error:
class Person {
  constructor(name) {
    this.name = name;
  }
  set name(value) {
    this.name = value;
  }
  get name() {
    return this.name;
  }
}

let boy = new Person('Pushkar');

console.log(boy.name);
boy.fullname = 'Rohit';
console.log(boy.name);

class Person {
  constructor(name) {
    this.name = name;
  }
  set name(value) {
    this.name = value;
  }
  get name() {
    return this.name;
  }
}

let boy = new Person('Pushkar');

console.log(boy.name);
boy.fullname = 'Rohit';
console.log(boy.name);

/*
Script snippet %239:1 RangeError: Maximum call stack size exceeded
    at Person.set name [as name] (Script snippet %239:5)
    at Person.set name [as name] (Script snippet %239:6)
    at Person.set name [as name] (Script snippet %239:6)
    at Person.set name [as name] (Script snippet %239:6)
    at Person.set name [as name] (Script snippet %239:6)
    at Person.set name [as name] (Script snippet %239:6)
    at Person.set name [as name] (Script snippet %239:6)
    at Person.set name [as name] (Script snippet %239:6)
    at Person.set name [as name] (Script snippet %239:6)
    at Person.set name [as name] (Script snippet %239:6)
*/
```

The reason is because:

1. Properties of the object get initialized in the constructor() function
2. Whenever a property is set, the setter by the same property name gets triggered (if it exists)
3. Inside this triggered setter, we are again updating the same property - which causes the setter to be triggered again
4. The recursion cycle continues indefinitely, causing the max call stack error

Solution? Use slightly different names for a property and its setter (& getter)

```javascript
// This code works!
class Person {
  constructor(name) {
    this._name = name; // Using `_` to indicate a kind of a private variable
  }
  set name(value) {
    this._name = value;
  }
  get name() {
    return this._name;
  }
}

let boy = new Person('Pushkar');

console.log(boy.name);
boy.name = 'Rohit';
console.log(boy.name);

/* Output:
Pushkar
Rohit
*/
```

### Subclasses & Prototype Based Inheritance (`extends` & `super`)

A subclass can be defined with respect to a parent class. This new subclass:

1. Will derive all the properties and methods of the parent class
2. Can override a parent class method or property
3. Can have its own set of properties and methods

**`extends`**: To inherit from a class you use the syntax: `class <SubClass> extends <ParentClass> { ... }` 

**`super`**: The super keyword inside a subclass is used to refer to the parent class. Inside the constructor of the subclass, you must invoke `super(<propsForParentClassConstructor>)` first before you can set the properties of your own class. This is because, the `this` keyword is not available to us in the subclass until and unless the parent class constructor has run - Hence, trying to initialize subclass props without parent class constructor call is going to throw an error!

As a habit, it is better to always run the `super()` first inside your base class constructor before you do anything else:

```javascript
constructor() {
	super();
	...
    ...
}
```

Example:

```javascript
// A parent class:
class Person {
  constructor(name) {
    this.name = name;
  }
  appendToName(app) {
    this.name += app;
  }

}

// A subclass:
class Indian extends Person {
  constructor(name, language) {
    // Cannot access `this` here
    super(name); // passing props required by parent constructor
    // Can access `this` here
    this.language = language;
  }
  // Override parent method:
  appendToName(app) {
    this.name += `${app} Ji`;
  }
  // Have its own methods:
  changeLanguage(newLang) {
    this.language = newLang;
  }
}

let push = new Indian('Pushkar', 'Kannada');
push.appendToName(' DK');
push.changeLanguage('Hindi');
console.log(push); // Indian {name: "Pushkar DK Ji", language: "Hindi"
```

## Arrays 

ES6 has provided many improvements on arrays.

### `for...of` loop

Prior to ES6, we had mainly 3 ways of iterating over arrays:

1. `for(<init>;<condtn>;<inc/dec>) {...}` loop: The traditional for loop construct to iterate a fixed number of times over something
2. `Array.prototype.forEach(<callback>)`: Loops over each element of the array and runs a callback function. It is *limited* only to arrays and not other iterable data structures

```javascript
var arr = [10, 20, 30];
arr.forEach(function(el, i) {
  console.log(el, i);
});

/* Output:
10 0
20 1
30 2
*/
```

1. `for...in` loop: This is mainly used to iterate over the keys of an object (recommended use). However, if you run it with arrays, it iterates over the indices of the arrays

```javascript
var arr = [10, 20, 30];
var obj = {
  foo: 'Hi',
  bar: 'Bye'
};

for(var key in obj) {
  console.log(key, obj[key]);
}
/* Output:
foo Hi
bar Bye
*/


for(var key in arr) {
  console.log(key, arr[key]);
}
/* Output:
0 10
1 20
2 30
*/
```

**`for...of` loop:**

This loop was introduced in ES6. It is very similar to `for..in` loop.

The difference is that:

1. It iterates over the *values* (and not the keys)
2. It works on *any iterable list* like strings, DOM nodelists, maps, sets, etc 

```javascript
var arr = [10, 20, 30];
for(let value of arr) {
  console.log(value);
}
/* Output:
10
20
30
*/

var str = 'Rahul';
for(let letter of str) {
  console.log(letter);
}
/* Output:
R
a
h
u
l
*/

// Objects are not iterable lists:
// They work based on keys (not values):
// The following snippet fails:
var obj = { foo: 'a', bar: 'b' };
for(let value of obj) { // TypeError: obj is not iterable
  console.log(value); 
}
```

**Note**: Objects are **not** iterable (they are key based, not ordered like in index/value based systems)

### `Array.from()` method

This is a method which takes in *any iterable list*, converts it into an array, and returns it

```javascript
// From a string:
var str = 'push';
console.log(Array.from(str)); // ['p', 'u', 's', 'h']

// From another array itself: Not very useful
var arr = [10, 20, 30];
console.log(Array.from(arr)); // [10, 20, 30]

// Also possible from a DOM NodeList, HTMLElements, etc.
```

The method can optionally take in a *second argument* which is a callback function that acts like a *map* method. So, the array is created from an iterable, and the the callback receives each item. Finally, the mapped array is returned from the `Array.from()` call

```javascript
var flowers = ['tulip', 'lotus', 'rose'];
var flowersList = Array.from(flowers, flower => `<li>${flower}</li>`);

console.log(flowersList); // ["<li>tulip</li>", "<li>lotus</li>", "<li>rose</li>"]
```

### `Array.of()` & `Array.prototype.fill()` methods

The **`Array.of()`** method is used to convert a variable set of arguments into an array of such values. It is not very useful since `Array()` itself can do that!

```javascript
var arr = Array.of(5, 10, 15, ['A', 'B'], { foo: 1, bar: 2 });
console.log(arr); // [5, 10, 15, ["A", "B"], {foo: 1, bar: 2}]

// But, even Array() does the same:
arr = Array(5, 10, 15, ['A', 'B'], { foo: 1, bar: 2 });
console.log(arr); // [5, 10, 15, ["A", "B"], {foo: 1, bar: 2}]
// (Same result)

// Single element to array:
var arr = Array.of(7);
console.log(arr); // [7]
// Why not just use this?:
console.log([7]); // [7]
```

The **`Array.prototype.fill()`** is used to replace certain items in the array with a given value (i.e to fill in something instead of the existing thing). It takes 3 arguments: 

1. Value to insert
2. Optional: Start index (***inclusive***). If omitted, the whole array is replace with value to insert. If supplied a `-ve` index, it will start from the end index
3. Optional: End index (***exclusive***). When to stop inserting the new value. If omitted, will move till end of array

**Note:** This method *mutates* the original array! (i.e) It affects/changes the original array with no copy being created

```javascript
// Array.prototype.fill():
var arr = ['a', 'b', 'c', 'd', 'e'];
arr.fill('x', 2, 3); 
console.log(arr);
```

```javascript
var arr = ['a', 'b', 'c', 'd', 'e'];
arr.fill('x', 2); // ["a", "b", "x", "x", "x"]
console.log(arr);
```

```javascript
var arr = ['a', 'b', 'c', 'd', 'e'];
arr.fill('x', -1); // ["a", "b", "c", "d", "x"]
console.log(arr);
```

```javascript
var arr = ['a', 'b', 'c', 'd', 'e'];
arr.fill('x'); // ["x", "x", "x", "x", "x"]
console.log(arr);
```

### `Array.prototype.find()` & `Array.prototype.findIndex()` methods

Both these methods run callbacks on the array in question. The callback receives two params, the item and its index (and a third param to set the `this` but its not very useful).

**`.find()`** will return the first element for which the callback returns `true`. 

**`.findIndex()`** will return the index of first element for which the callback returns `true`.

In case the callback never returns true, both of these methods  will then return `undefined`

```javascript
var profits = [99, 85, 90, 125, 70, 112];

var first100PlusMark = profits.find((p, i) => p > 100);
console.log(first100PlusMark); // 125

var first100PlusMarkIndex = profits.findIndex((p, i) => p > 100);
console.log(first100PlusMarkIndex); // 3
```

## `Map`, `Set`, `WeakMap`, `WeakSet`, & How JS Stores Stuff

**Values versus Reference:**

All Javacript ***primitives*** (number, strings, booleans, null, undefined, symbols) are immutable and whenever they are assigned to something, their *value gets copied over*

Javascript ***objects*** (including arrays, functions, etc), on the other hand, are mutable and whenever are assigned to something, their *reference gets copied over* (not a copy of their value). Reference basically means the address

```javascript
let a = 5;
let b = a; // value gets copied
console.log(a, b, a === b); // 5 5 true

let c = 'A string';
console.log(c); // 'A string'
console.log(c.toUpperCase()); // 'A STRING'
console.log(c); // 'A string'
// `c`, a string, is immutable
```

```javascript
let o1 = { foo: 1, bar: 2 };
let o2 = o1; // reference gets copied (not value)

console.log(o1 === o2); // true (because both refer to same object)
o2.foo = 10;
console.log(o1.foo, o2.foo); // 10 10
// Even o1.foo has changed even though only o2.foo was edited
// This is because:
// 1. o1 and o2 refer to the same object
// 2. objects are mutable
```

```javascript
// Arrays are also a type of an object (& hence, mutable)
let arr1 = [5, 10, 15, 20];
let arr2 = arr1;
console.log(arr1 === arr2); // true
arr2.pop();
arr2.pop();
console.log(arr1, arr2); // [5, 10] [5, 10]
```

Primitives are "passed-by-value" into functions while objects are "passed-by-reference" into them

```javascript
let x = 10;
function foo(x) {
  x = 0;
}
foo(x);
console.log(x); // 10 (Unchanged! Passed a copy of value)
```

```javascript
let x = { foo: 10 };
function foo(x) {
  x.foo = 20;
}
foo(x);
console.log(x); // { foo: 20 } (Changed! Passed a reference)
```

**What are Hash Maps?**

Hash Maps are basically `<key>` & `<value>` pairs that exist inside a data structure that is optimized to fetch data (it is ***fast/Quick*** at accessing/updating data inside of it). There is a `1:1` mapping between the key and the value and we use the key to identify the value & read/update it

It is similar to how an object works (keys are property names) or how an array works (keys are indices). 

**Objects versus Maps:**

1. A map is ***far more protected than is a regular object***.
   1. Syntax: **`new Map()`**
2. A map also comes with some ***useful methods***.
   1. **`.set(<key>, <value>)`**: Sets a key and its associated value inside a map
   2. **`.get(<key>)`**: Gets the value associated with the key. (Notice that for get and set, this is exactly the same way in which we interact with `localStorage` and `sessionStorage`)
   3. **`.size`**: This property length of the hash map (i.e The number of key-value pairs it contains)
   4. **`.clear()`**: Clears the map of all its values (removes them)
   5. **`.entries()`**: It returns an *iterable* (MapIterator) which we can loop over if we want to
   6. **`.forEach()`**: Similar to an array, we can do a forEach on Maps as well. The callback receives each value.
   7. **`.keys()`**: Grabs every key in the Map and returns an *iterable* (MapIterator) (which we can loop over)
   8. **`.values()`**: Grabs every value in the Map and returns an *iterable* (MapIterator) (which we can loop over)
   9. **`.has(<key>)`**: Returns `true` if the key-value pair is present (Entry exists)
   10. **`.delete(<key>)`**: Deletes the key & the value (BUT NO GARBAGE COLLECTION)
3. A map is an ***iterable*** (Objects are not iterables)

```javascript
let userLocation = new Map();
userLocation.set('Pushkar', 'Bangalore');
userLocation.set('Saurabh', 'Mumbai');

console.log(userLocation.get('Pushkar')); // Bangalore
console.log(userLocation.get('Saurabh')); // Mumbai

console.log(userLocation.entries()); // MapIterator {"Pushkar" => "Bangalore", "Saurabh" => "Mumbai"}
console.log(userLocation.keys()); // MapIterator {"Pushkar", "Saurabh"}
console.log(userLocation.values()); // MapIterator {"Bangalore", "Mumbai"}
console.log(userLocation.size); // 2

userLocation.forEach(value => {
  console.log(value);
});
/*
Bangalore
Mumbai
*/

userLocation.clear();
console.log(userLocation.size); // 0
console.log(userLocation); // Map(0) {}
```

The cool thing about keys in a map is that we can have **key functions** (instead of just key values):

```javascript
function keyFunc() {
  return 'I am a key function';
}

let newMap = new Map();
newMap.set(keyFunc, 'A  value associated with a key function');
newMap.get(keyFunc); // "A  value associated with a key function"
```

Similarly, the keys can be **objects** as well!

**Note**: 

1. A regular object in javascript cannot have key functions as keys!
2. You can use `null` and `undefined` as keys as well

```javascript
let newMap = new Map();
newMap.set(null, 'A  value associated with null');
newMap.get(null); // "A  value associated with null"
```

2. You can use ***Symbols*** to set keys as well
3. Since Maps are ***iterables***, we can use the `for..of` loop on them

```Javascript
let userAges = new Map();
userAges.set('Pushkar', 25);
userAges.set('Saurabh', 27);
userAges.set('Sukhdeep', 25);
userAges.set('Rohit', 29);

for(let age of userAges) {
  console.log(age);
}

/* Output:
["Pushkar", 25]
["Saurabh", 27]
["Sukhdeep", 25]
["Rohit", 29]
*/

// We cannot use `for..of` on regular objects
```

**What is a `WeakMap`?**

A WeakMap is essentially just a Map but with the following differences:

1. WeakMaps allow *garbage collection*, if the *key has no reference*. This is a really nice feature to ***seal up memory leaks***. Therefore, that 'key' must be an object (in order to garbage collect it)
2. It is *not an iterable*: it has only the `.get`, `.set`, `.has`, and `.delete` methods

```javascript
let friends = new WeakMap();

let saurabh = { name: 'Saurabh' };
let simpson = { name: 'Simpson' };

friends.set(saurabh, 'Great friend');
friends.set(simpson, 'Flatmate');

console.log(friends.has(saurabh)); // true

console.log(friends.get(saurabh)); // Great friend
saurabh = null; // does garbage collection
console.log(friends.get(saurabh)); // undefined

console.log(friends.get(simpson)); // Flatmate
friends.delete(simpson); // does garbage collection
console.log(friends.get(simpson)); // undefined
```

Use Maps whenever you want to:

1. Create a data structure that stores ***key-value*** pairs
2. Has quick access to data
3. Is iterable (unlike an object)
4. Has garbage collection (WeakMap)

**What are `Sets`?**

`Sets` are similar to *arrays*. They can contain items of any data type. They differ from arrays in the following ways:

1. It does *not* have array methods (`push`, `pop`, etc)
2. All elements are *unique*
3. A set is an *iterable* (And the iteration order is the same as the insertion order)

Syntax: `new Set(<An Iterable>)` creates a new set out of the elements of the iterable. If duplicate elements are added, the duplicate is ignored (not added to the set)

Sets have:

1. **`.size`**: Propety containing the size of the set (similar to `length` of array)
2. **`.add()`**: We can add an item to the set
3. **`.clear()`**: Clears the set of all its values
4. **`.delete(<value>)`**: Deletes the entry (NO GARBAGE COLLECTION)
5. **`.entries()`**: Returns an *iterable* (SetIterator) which we can map through. But, it is a little *quirky*:
   1. Each item in the entry is an array (two-element array)
   2. The index `0` and index`1` both contain the value (index `0` value will be the key)
6. **`.forEach()`**: Since a set is an *iterable*, we can attach a callback function that receives each value in the array
7. **`.has(<key>)`**: Returns `true` if the element is present (exists)
8. **`.delete(<key>)`**: Deletes the key & the value (BUT NO GARBAGE COLLECTION)

**Note:** When two different object having the same properties and values are added, they are not considered the same - their references (address) differ - and set will not ignore one of them (both will be added)

```javascript
let items = new Set(['A', 'B', 'C', 'A']); // The duplicate 'A' will be removed

console.log(items); // Set(3) {"A", "B", "C"}

console.log(items.size); // 3
items.add(56);
console.log(items.size); // 4

console.log(items.has('C')); // true
items.delete('C');
console.log(items); // Set(3) {"A", "B", 56}

items.forEach(val => {
  console.log(val);
})
/*
A
B
56
*/

console.log(items.entries()); // SetIterator {"A", "B", 56}
for(let val of items.entries()) {
  console.log(val);
}
/*
["A", "A"]
["B", "B"]
[56, 56]
*/

items.clear();
console.log(items); 
```

**Note**: If object values are same but references are different, they are each considered unique

```javascript
let items = new Set();

items.add({ name: 'Pushkar' }); // new obj
items.add({ name: 'Pushkar' }); // new obj

console.log(items); // Set(2) {{ name: 'Pushkar' }, { name: 'Pushkar' }}
```

Use Sets whenever you want to:

1. Create a data structure that stores ***unique*** values
2. Is iterable (just like an array)
3. Ignores duplicate entries

**What is a `WeakSet`?**

Unlike a Set, a WeakSet can ***only contain objects***. The primary advantage again, is *Garbage Collection*. Hence, only deals with objects.

- As soon as refrence to the object is removed, it is garbage collected from the set
- It is not an iterable (cannot loop through it with say, `for..of`)
- Does *not* have iterable methods like `.forEach` and `entries` (Only has `add`, `has`, `delete`)
- The size is always `0` (or `undefined`?)

**It is useful for tagging (flagging) a set of objects and check if they exist**

```javascript
let items = new WeakSet();
let one = { name: 'Pushkar' };
let two = { name: 'Saurabh' };

items.add(one, two);

console.log(items); // WeakSet {{…}}
console.log(items.size); // undefined

console.log(items.has(one)); // true
items.delete(one); // garbage collected
console.log(items.has(one)); // false
```

## Symbols (New Data Type)

Symbols in JavaScript are a ***new data type***. (Earlier ones included undefined, null, number, string, and boolean)

**Syntax**: `Symbol(<descriptor>)`

Even though the syntax is a function, it *cannot* be used as a constructor (i.e `new Symbol()` is not valid: Error!)

The `<descriptor>` does not affect a symbol. It is only useful in debugging to know where the Symbol was defined

**So what is a Symbol?**: It is something unique that is created which can be *used as an identifier*. No two symbols are equal to each other!

```javascript
// Other primitives with same value will be equal:
let str1 = String('a');
let str2 = String('a');
console.log(str1 === str2); // true

// BUT: Two symbols can never be equal:
let aSymbol = Symbol();
let bSymbol = Symbol();
console.log(aSymbol === bSymbol); // false

console.log(aSymbol); // Symbol()
```

**So, what is the point of symbols?**: It can be used to *avoid name collisions* (since they are 'unique somethings')

```javascript
// (A) Your library/utility (Module):
let NAME = Symbol();
let COLOR = Symbol();
let MODEL = Symbol();

class Car {
  constructor(name, color, model) {
    this[NAME] = name;
    this[COLOR] = color;
    this[MODEL] = model;
  }
  set name(val) {
    this[NAME] = val;
  }
  get name() {
    return this[NAME];
  }
  set color(val) {
    this[COLOR] = val;
  }
  get color() {
    return this[COLOR];
  }
}
// Export the class Car


// (B) External script using your Module: Import the Car module
// It has no access to those symbols in the library:
let newCar = new Car('i20', 'Orange', '2018');

console.log(newCar.name); // i20 (getter)
newCar.color = 'blue'; // Triggers the setter
console.log(newCar.color); // blue (getter)

console.log(newCar.model); // undefined ('model' property doesn't exist)
// A symbol exists that refers to the model passed
```

Therefore, symbols can help protect object and class properties!

**`Symbol.for(<descriptor>)`**: This searches for (and creates) a symbol with a descriptor. It searches for an existing symbol based on the descriptor provided. If it is not found, it creates a new symbol with the descriptor. Later, if another symbol for the same descriptor is created then these two symbols *ARE ACTUALLY EQUAL TO EACH OTHER*! The catch is, they must both be created using the `.for`

```javascript
let aSymbol = Symbol.for('test'); // created if it doesn't exist
console.log(aSymbol); // Symbol(test)

let bSymbol = Symbol.for('test');
console.log(aSymbol === bSymbol); // true

let cSymbol = Symbol('test'); // Without using for
console.log(aSymbol === cSymbol); // false (both should have been defined with '.for')
```

## Promises

Promises are one of the most popular and most important additions to the JavaScript language

Javascript is:

- *Single Threaded*: It has only one process (cannot run multiple processes at the same time)
- *Non-Blocking and IO/Event Driven*: Even though it is single-threaded, it does not always work synchronously. It can do things that can be done immediately while waiting for others tasks to finish

Therefore, we can do asynchronous tasks in JS: Asynchronous call (ex: `setTimeout` & `setInterval`) are put on something known as the ***event loop***. This loop is run after the synchronous tasks are finished (inside that function). 

```javascript
setTimeout(() => console.log('Hi'), 0); // Event though it is 0, it is run later
console.log(1);
setTimeout(() => console.log('Uhmm'), 100);
setTimeout(() => console.log('Bye'), 50); // Run before '100' coz of placement in event queue
for(let i = 0; i < 1000; i++) {
  if(i === 999)
    console.log('Done');
}

/* Output:
1
Done
Hi
Bye
Uhmm
*/

/* Visualizing the Event queue: 
 [@0: () => console.log('Hi'), 
  @50: () => console.log('Bye'), 
  @100: () => console.log('Uhmm')]
*/
```

One of the mistakes that new developers do is expecting async operations to happen synchronously... Consider an async API call which returns data. We cannot assign the call to a variable and read it. It won't work because the call has not finished returning the data.

```javascript
var results = someAsyncAPICall(); // API Call starts
console.log(results); // WONT CONTAIN DATA (X)
// ...
// ...
// API Call finishes with data
```

Traditional Javascript solution: **Callbacks**

Callbacks are passed to the function that is doing the processing (since callbacks are functions which are first-class objects). The processing function then internally invokes our callback when it is done with its processing (i.e data becomes available)

```javascript
function processSomething(input, cb) {
  // ... usually some processing ... 
  let result = input * 5;
  // When ready:
  if(typeof cb === 'function') {
    cb(result); // The processing function decides when to run our callback
  }
}

function handler(result) {
  console.log(result);
}

processSomething(10, handler);

/* Output:
50
*/
```

Most of our jQuery methods use the callback pattern:

```javascript
// Example:
$('.main').on('click', () => alert('clicked main'));
```

**Callback Hell: A Problem**

In complex application, we might have a dependency built on callbacks where we are required to nest callback inside on another because for one task to be complete, another task has to finish first. This leads to **deeply nested callbacks** which is not readable and messy to manage

An example would be of a set of API calls where each of them requires data from another API call to make the request

```javascript
fetchUsers(users => {
    fetchSingleUser(users[5], user => {
        fetchUserPosts(user.id, posts => {
            fetchSinglePost(posts[10], post => {
                console.log(post); // DEEPLY NESTED CALLBACK! *BAD*
            })
        })
    })
})
```

**Intro to Promises:**

So, promises provide a solution to the problem of *callback hell*!

**Q: Are promises faster than callbacks?**
A: No. In fact, they could be slightly slower because of the overhead involved

**Q: Does a promise give us new powers that a callback did not?**
A: No.

**Q: Then why do we need to use Promises?**
A: It improves *code-readability* (solves 'callback hell' issue) and makes our code *manageable*

ES6 now has **native support** for promises. Earlier promise libraries included *Q* and *bluebird* (by jQuery)

**Q: What is a promise?**
A: Promise is basically a **constructor function** (use **`new Promise()`**) that returns an object with the following methods: `.then` and `.catch`

**Steps**: 

1. Promise constructor is run with `new` keyword. It takes in one arguments, a callback. It returns an object (known as the promise object)
2. The callback to promise constructor (above) is passed two arguments (*automatically* by javascript), first is a `resolve` function, and second, a `reject` function
3. The promise object returned from (1) contains the methods `.then` and `.catch`
4. Whenever the `resolve` method is run inside the promise callback, the `.then` method of the promise object is called.
5. Whenever the `reject` method is run inside the promise callback, the `.catch` method of the promise object is called.

The `then` versus `catch` callbacks:

1. `.then(<callback>)`: The callback receives the same parameter that was passed to `resolve`

2. `.catch(<callack>)`: The callback receives the same parameter that was passed to `reject`

```javascript
const status = true;

let aPromise = new Promise((resolve, reject) => { // resolve & reject names are just convention
  setTimeout(() => {
    if(status) {
      resolve('Success');
    } else {
      reject();
    }
  }, 100);
});

aPromise.then(dataFromResolve => {
  console.log(dataFromResolve); // Success (After 100 milliseconds)
})

// Since status is `true`: 
// The following callback will not execute:
aPromise.catch(errorFromReject => {
  console.log(errorFromReject); // Failure (After 100 milliseconds)
})
```

**`Promise.race(<Array of Promises>)`**:

This function takes a list of promises (technically, promise objects) and itself returns a promise object. The `then` function gets executed as soon as *any of the promises in that array get resolved*. The data received by the callback will be the data from the resolve of the fastest promise

**`Promise.all(<Array of Promises>)`**:

This function takes a list of promises  (technically, promise objects) and itself returns a promise object. The `then` function gets executed when *all of the promises in that array get resolved*. The data received by the callback will be an array of all the data from the resolves of all the promises (in that order)

```javascript
let aProm = new Promise((resolve, reject) => {
  setTimeout(() => resolve('a'), 100);
});

let bProm = new Promise((resolve, reject) => {
  setTimeout(() => resolve('b'), 90);
});

let cProm = new Promise((resolve, reject) => {
  setTimeout(() => resolve('c'), 110);
});

let arrOfProms = [aProm, bProm, cProm];
```

```javascript
Promise.race(arrOfProms).then(dataFromFastestResolve => {
  console.log(dataFromFastestResolve);
});

/* Output:
b
*/
```

```javascript
Promise.all(arrOfProms).then(dataFromFastestResolve => {
  console.log(dataFromFastestResolve);
});

/* Output:
["a", "b", "c"]
*/
```

jQuery AJAX success callback example with promises:

```javascript
function makeAJAXCall(url, method) {
    return Promise((resolve, reject) => {
       $.ajax({
            url,
            method,
            success: (response) => {
            	resolve(response.data);
            },
            error: (errorMsg) => {
            	reject(errorMsg);   
            }
        }); 
    });
}

let data = makeAJAXCall('google.com', 'get');
data.then(results => {
    console.log(results);
}).catch(msg => {
    console.log(msg);
});
```

Note: The term **returns a promise** usually means returns a promise object (i.e the object that has the methods `then`, `catch`)

**Bonus**: [Custom implementation of a Promise](https://github.com/pushkar100/javascript-notes/blob/master/custom-promises/async.js)

**Note**: `resolve` and `reject` are actually methods of the `Promise` constructor function: **`Promise.resolve`** and **`Promise.reject`**

### Promise Chaining

Really helpful at solving callback hell - no nesting is required!

`.then()` and .`catch()` **methods always return a promise**. So you can chain multiple `.then` & `.catch` calls together

1. A call to `promise.then` returns a promise, so that we can call the next `.then` on it
2. When a value is returned (#) in a `.then()` callback, that promise becomes resolved, and the next `.then` or `.catch` handler following it runs with this returned value (#) (as argument to its own callback).

```javascript
let aProm = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Success'), 1000);
});

aProm
  .then(resolveData => { // (1)
    console.log(resolveData);
    return 'first then value';
  })
  .then(returnOfPrevThen => { // (2)
    console.log(returnOfPrevThen);
    return 'second then value';
  })
  .then(returnOfPrevThen => { // (3)
    console.log(returnOfPrevThen);
  });


/* Output:
Success
first then value
second then value
*/

/* Note:
(1) only runs after aProm has resolved
(2) only runs after (1) has resolved
(3) only runs after (2) has resolved
Therefore, chaining
*/
```

**Multiple `then` or `catch` on a single promise:**

In this case, whenever the original promise gets resolved, then all the `.then` associated with it get called in the order that they are defined.

1. There is no chaining
2. Therefore, one `.then` does not depend on another `.then` to finish (they all depend only on the original promise)

```javascript
let aProm = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Success'), 1000);
});

aProm
  .then(resolveData => { // (1)
    console.log(resolveData);
    return 'first then value';
  });

aProm.then(resolveData => { // (2)
    console.log(resolveData);
  });
  
aProm.then(resolveData => { // (3)
    console.log(resolveData);
  });


/* Output:
Success
Success
Success
*/
```

**Returning a promise**

Normally, a value returned by a `.then` handler is immediately passed to the next handler. ***But there’s an exception!***

If the returned value is a promise, then the further execution is suspended until it settles. After that, the result of that promise is given to the next `.then` handler.

```javascript
new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000);
}).then(function(result) {
  alert(result); // 1
  return new Promise((resolve, reject) => { // (*)
    setTimeout(() => resolve(result * 2), 1000);
  });
}).then(function(result) { // (**)
  alert(result); // 2
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result * 2), 1000);
  });
}).then(function(result) {
  alert(result); // 4
});
```

Here the first `.then` shows `1` returns `new Promise(…)` in the line `(*)`. After one second it resolves, and the result (the argument of `resolve`, here it’s `result*2`) is passed on to handler of the second `.then` in the line `(**)`. It shows `2` and does the same thing.

So the output is again 1 → 2 → 4, but now with 1 second delay between `alert` calls.

Returning promises allows us to build chains of asynchronous actions.

[Article on promise chaining](https://javascript.info/promise-chaining )

## Async & Await (ES8)

**ES8** does not have enough support across all browsers (2019) and is not included even in the commonly used babel presets. If you intend to use it then make sure you add the necessary babel plugins. Also, it is supported only in Node7.6+

Just like promises, Async/Await is not a fundamentally new thing. Performance/power wise, it is not any better than callbacks pattern and promises. 

Similar to promises, it helps make your code more readable and manageable. Unlike promises however, it is not used to return objects that resolve, (and we chain the `then`) etc. Instead, it is applied on the function as a whole

**Important:**

Promises are more about adapting the human mind to the way in which the computer does async programming. 

Async/Await is more about getting the code written to adapt to the human mind. That is, make it at least appear synchronous in nature (it is still asynchronous internally), so that the flow of reading & understanding code is unidirectional

Async/await work closely with promises

**Syntax:**

Place the **`async`** keyword before the function that carries out the async task. 

The word “async” before a function means one simple thing: a function always returns a promise. If the code has `return <non-promise>` in it, then JavaScript automatically wraps it into a *resolved promise* with that *value*.

```javascript
async function f() {
  return 1; // non-promise gets wrapped into a resolved promise (with resolved value being what is returned)
}

f().then(alert); // 1
```

```javascript
async function f() {
  return Promise.resolve(1); // Explicitly returning a promise
}

f().then(alert); // 1
```

**`await`**: It is a keyword that can only appear inside an `async` function

The keyword `await` makes JavaScript wait until that promise settles and returns its result. (**Important** because it ***pauses*** the execution of the function until the promise in the await gets resolved/rejected)

```javascript
/* Syntax of await: */
// works only inside async functions
let value = await promise;
```

```javascript
let promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done!"), 1000)
});

async function f() {
  let result = await promise; // wait till the promise resolves (*)
  console.log(result); // "done!"
}

f();
```

The function execution “pauses” at the line `(*)` and resumes when the promise settles (that is,  resolves/rejects), with `result` becoming its result. So the code above shows “done!” in one second.

**Important:** Let’s emphasize: `await` literally makes JavaScript wait until the promise settles, and then go on with the result. That doesn’t cost any CPU resources, because the engine can do other jobs meanwhile: execute other scripts, handle events etc. Therefore, *JS is still asynchronous*!

**Note**: Can’t use `await` in regular functions. If we try to use `await` in non-async function, that would be a Syntax Error. We need to have a wrapping async function for the code that awaits.

## ES8 Easy Wins

**`Object.values(<object>)`**

It takes in an object and returns all its values (without the keys - it does not care about the keys). The values are actually returned as an ***array of values***.

```javascript
let obj = {
  name: 'Pushkar',
  age: 25,
  city: 'Bangalore'
}
console.log(Object.values(obj)); // ["Pushkar", 25, "Bangalore"]
```

**`Object.entries(<object>)`**

It takes in an object and returns all its key-value pairs. The values are actually returned as an ***array of array of key & value pairs***.

```javascript
let obj = {
  name: 'Pushkar',
  age: 25,
  city: 'Bangalore'
}
console.log(Object.entries(obj)); 
// [["name", "Pushkar"], ["age", 25], ["city", "Bangalore"]]
```

**`String.prototype.padStart`** and **`String.prototype.padEnd`**

`padStart` takes in two parameters: the length of the final string, the character to use for padding. The padding is done at the *beginning* of the string

`padEnd` also takes in two parameters: the length of the final string, the character to use for padding. The padding is done at the *end* of the string

If the length parameter specified in these two methods is less than original string length, no padding / trimming is done, returning the original string.

The default character used for padding (if it is not specified) is space (` `)

```javascript
let str = 'Wayne Rooney';
console.log(str.padStart(20, 'x')); // xxxxxxxxWayne Rooney
console.log(str.padEnd(20, 'z')); // Wayne Rooneyzzzzzzzz
console.log(str.padEnd(15) + '!!'); // Wayne Rooney   !! (default pad is space)
console.log(str.padEnd(5, 'n')); // Wayne Rooney
```

Strings are primitives and so, immutable. Hence, the `padEnd` and `padStart` methods *do not mutate the string* (i.e cannot affect the original array)

**`Object.getOwnPropertyDescriptors(<object>)`**

Every object property has **4** descriptors attached to it:

1. `value`: The value of the property
2. `writable`: Is the property writable
3. `configurable`: Is the property configurable
4. `enumerable`: Is the property enumerable (can it be counted?)

The `Object.getOwnPropertyDescriptors()` method takes in an object and prints out the descriptors of each of its properties

```javascript
let obj = {
  name: 'Pushkar',
  age: 25,
  city: 'Bangalore'
}
console.log(Object.getOwnPropertyDescriptors(obj)); 

/* Output:
{
  name: {value: "Pushkar", writable: true, enumerable: true, configurable: true},
  age: {value: 25, writable: true, enumerable: true, configurable: true}, 
  city: {value: "Bangalore", writable: true, enumerable: true, configurable: true}
}
*/
```

**Trailing commas in functions**

Since ES1 we have been allowed to use trailing commas in arrays. `[1, 2, 3, 4,]`

Since ES5 we have been allowed to use trailing commas in objects. `{foo: 1, bar: 2,}`

But, leaving behind trailing commas in a function call or signature used to throw a syntax error. 

Starting from **ES8** however, we ***can*** have trailing commas in the function call/signature:

```javascript
function foo(a, b) {
  return a + b; // 3
}
foo(1, 2,); // trailing commas in fn. call

/* ************************* */

function foo2(a, b, ) { // trailing commas in fn. signature
  return a + b; // 3
}
foo(1, 2);
```

## ES7 Easy Wins (Only a couple of additions to ES7)

The main additions to ES7 **exponentiation** and **`includes`**

**Exponentiation** `**`

This operator takes two operands and finds the exponent. That is, operand 1 (left) raised to the operand 2 (right). 

It works with numbers, decimal point number, negative values, and even `NaN`. If one of the values is `NaN`, it returns `NaN`

```javascript
console.log(5 ** 3); // 125
console.log(5 ** 1.5); // 11.180339887498949
console.log(5 ** -1); // 0.2
console.log(5 ** NaN); // NaN
```

Exponent operator is **Right-to-Left** associative:

```javascript
console.log(2 ** 3 ** 2); // 512
// The above is equal to logging (2 ** (3 ** 2))
```

**`Array.prototype.includes()`**

Earlier, we used to use `indexOf()` method of arrays in order to locate an item inside. This is messy and not exactly readable because of the following syntax:

```javascript
let arr = [10, 40, 50, NaN, 20, 25];

if(arr.indexOf(40) !== -1) // Bit of a mess here
  console.log('found')
else
  console.log('Not found');

// found
```

`includes` does the same thing as `indexOf`, that is, it searches for an item in the array. But, it returns a *Boolean*. `true` if found, else `false`

It is much more easy to read than `indexOf`!

```javascript
let arr = [10, 40, 50, NaN, 20, 25];

if(arr.includes(40)) // very readable
  console.log('found')
else
  console.log('Not found');

// found
```

One more advantage is that `indexOf` does strict comparison (`===`), so we cannot identify the presence of a `NaN` value inside an array (Because `NaN === NaN` returns` false`)

However, with `includes` we can match an `NaN` as well.

```javascript
let arr = [10, 40, 50, NaN, 20, 25];

console.log(arr.indexOf(NaN)); // -1
console.log(arr.includes(NaN)); // true
```

**Destructuring Rest Parameters**

This was not possible before ES8. It *only works with arrays* because the rest operator always combines multiples elements into arrays.

```javascript
// Earlier (ES5/6/7-)
function add(...params) {
  return params[0] + params[1];
}
console.log(add(2, 3)); // 5
```

```javascript
// Now (ES8+)
function add(...[first, second]) {
  return first + second;
}
console.log(add(2, 3)); // 5
```

## Proxies

This is a powerful new feature. Unlike promises/async/etc, proxies give new power to javascript.

Proxy basically means *middleman*. A proxy is what comes in between two communicating parties - the middleman is used to enable that communication (instead of the parties talking directly to each other)

In Javascript, *a proxy allows you to cut-off almost any part of the process of object change*. It comes in between the object and the external code trying to acces it - acting as the middleman. It is analogous to the use of middleware in express which interacts every route request. Proxies can be used to protect objects from abuse.

We use something known as ***traps***: We set a trap of getting a property, setting it.

The power of proxies is that it gives us exclusive control over the access to the object.

**Use cases:**

1. Middleware
2. Validator, ... and so on

**Syntax:**

1. `Proxy` is a constructor, so it has to be invoked with the `new` keyword
2. It takes in two arguments: The "**target**" object, and the object that is going to act as the "**handler**" to the target object (the middleman). Therefore, two objects as params
3. The handler object has properties. Each property corresponds to each "***trap***" that you want to set
4. One will only interact with the object returned by the constructor in (1). Interacting directly with the target object directly is possible but then defeats the purpose of the Proxy

**Common methods of the handler:**

- **`handler.get(<targetObject>, <propName>)`**: This method runs any time the proxy object is ***accessed (read)***. It traps the access (think of it like a middleware) and whatever this method returns is what is available outside. It *automatically* has access to the "target" object and the property name that was being accessed

```javascript
let handler = {
  get(target, propName) {
    return `${target[propName]} from handler's get()`;
  }
}

let proxy = new Proxy({}, handler);
proxy.name = 'Tom cruise';
// Trying to 'get' a property will trigger the handler's get():
console.log(proxy.name); // Tom cruise from handler's get()

// Triggered on any property acces (even unset ones):
console.log(proxy.age); // undefined from get
```

- **`handler.set(<targetObject>, <propName>, <newValue>)`**: This method runs any time the proxy object is ***being written to***. It is similar to get except for when it gets triggered.  It *automatically* has access to the "target" object, the property name that was being set, and the new value

```javascript
let handler = {
  get(target, propName) {
    return target[propName];
  },
  set(target, propName, newVal) {
    target[propName] = `${newVal} set from proxy`;
  }
}

let proxy = new Proxy({}, handler);
proxy.name = 'Nelson Mandela'; // triggers handler's set
console.log(proxy.name); // Nelson Mandela set from proxy
```

- **`handler.has(<targetObject>, <propName>)`**: This method is triggered whenever there is check for the property name, such as in the `if..in` construct and reflectors. You would usually want to return a boolean value from here (although, technically, anything can be done since it's just a function that gets triggered)

```javascript
let handler = {
  get(target, propName) {
    return target[propName];
  },
  set(target, propName, newVal) {
    target[propName] = newVal;
  },
  has(target, propName) {
    console.log('has was triggered');
    return target[propName] ? true : false;
  }
}

let proxy = new Proxy({}, handler);
proxy.name = 'Nelson Mandela'; // triggers handler's set

if('name' in proxy)
  console.log('exists');
else
  console.log('does not exist');

/* Output:
has was triggered
exists
*/
```

**Note**: The target object need not just be an object literal but also an object of a class.

```javascript
//...
let hondaHandler = { ... };
// ...
let honda = new Car('Honda');
let hondaProxy = new Proxy(hondaProxy, hondaHandler);
// ...
```

**Proxies to functions**

Since functions are objects, the proxies can be applied to them as well.

- **`handler.apply(<targetFunction>, <thisArg>, <argsList>)`**: This method is specifically for functions that are proxied. Apart from target object, it receives the `this` param for the function call, and a list of arguments. It gets triggered whenever the function is called

```javascript
function sum(a, b) {
  return a + b;
}

let handler = {
  apply(targetFunc, thisArg, arguments) {
    console.log('I have intercepted the call!');
    return targetFunc(arguments[0], arguments[1]);
  }
}

let sumProxy = new Proxy(sum, handler);
sumProxy(5, 10);


/* Output:
I have intercepted the call!
15
*/
```

**This is the full list of proxy methods (13):**

1. `handler.getPrototypeOf`
2. `handler.setPrototypeOf`
3. `handler.isExtensible`
4. `handler.preventExtensions`
5. `handler.getOwnPropertyDescriptor`
6. `handler.defineProperty`
7. `handler.has`
8. `handler.get`
9. `handler.set`
10. `handler.deleteProperty`
11. `handler.ownKeys`
12. `handler.apply`
13. `handler.construct`

**`Reflect` object**

It is not very useful, but has the same functions as a proxy. It does not intercept objects - it is meant only for observing and analyzing them. If you want to learn more: [Link]()

## Generators,  Iterators, Iterables (& revisiting `for..of`)

All these features are linked to each other

**Generator**

A function in javascript can be defined as a generator function by appending **`*`** to the `function` keyword. When you do this and invoke the function, *it does not run the function immediately*, instead it returns a *generator object* (which is an iterator - later)

This generator object can be used to run the contents of the original function by using the **`.next()`** method. 

 ```javascript
function* aGenerator() {
  console.log('Hi');
  console.log('I am a generator function');
  return 'Execution done';
}

let genObj = aGenerator();

console.log(genObj);
console.log(genObj.next());

/* Output:
aGenerator {...}
Hi
I am a generator function
{value: "Execution done", done: true}
*/
 ```

Notice that `.next()` returns an object with `value` and `done` properties. In order to understand this object, we need to understand another concept called **`yield`**.

`yield` **pauses** the execution of the generator function (when executed by using `.next()`) and returns the expression linked to the yield statement (`yield <expr>`). Every time `.next()` is invoked on the generator object, the successive `yield` expression is returned. 

Basically, everytime `.next()` is called, it picks up execution of the function from the previous yield to the next yield (or until function return)

`done` indicates whether the function has finally returned or if there is still more to yield. In all the yields, the `done` property of the `next()` return object will be `false`. When there is nothing more to yield, and the function has returneda final value, the `done` is set to `true` (so that we need not run `.next()` once again)

```javascript
function* aGenerator() {
  console.log('A');
  yield 1; // pause here!
  console.log('B');
  yield 2;
  console.log('C');
  return 'Execution done';
}

let genObj = aGenerator();

console.log(genObj.next());
console.log(genObj.next());
console.log(genObj.next());

/* Output:
aGenerator {...}
A
{value: 1, done: false}
B
{value: 2, done: false}
C
{value: "Execution done", done: true}
*/
```

*Useful example*: Making an infinite counter (without getting *stuck* in an infinite loop)

```javascript
function* counter() {
  let i = 0;
  while(true) {
    yield i++;
  }
}

let iValue = counter();
// Can be hooked up to an event handler:
console.log(iValue.next()); // {value: 0, done: false}
console.log(iValue.next()); // {value: 1, done: false}
console.log(iValue.next()); // {value: 2, done: false}
```

`done` can be used to check if `next` must be invoked again or not!

**Passing data to yield via `next(<expression>)`**

We can pass in something to the function from an external source. When `yield` executes inside the function, it also returns the expression that was sent to it from the `next` of the external code. This expression can be stored and used within the function

```javascript
function* counter() {
  let i = 0;
  while(true) {
    let valFromNext = yield i++;
    console.log(valFromNext);
  }
}

let iValue = counter();
// can be hooked up to an event handler
console.log(iValue.next('A')); // First time: Discarded inside function (not consoled)
console.log(iValue.next(3));
console.log(iValue.next({ foo: 1 }));

/* Output:
{value: 0, done: false}
3
{value: 1, done: false}
{foo: 1}
{value: 2, done: false}
*/
```

*Another example of generators*: Fetching the *fibonacci* series `(0, 1, 1, 2, 3, 5, 8, 13 ..)` indefinitely! Check MDN

**Iterables & Iterators**

*Definition*: 

1. Iterables can be `for..of`..ed (looped)
2. Iterables have an *iterator* attached to them
3. Iterables have the `Symbol.iterator` property

In Javascript, data structures like **Arrays**, **Strings**, **Maps**, **Sets**, and **TypedArrays** have an *in-built iterator* (default) function that helps us loop over their elements using the `for..of` construct

In order for a data structure to be considered *iterable*, it must implement the *iterator* method. The object meant to be an iterable must have a **`Symbol.iterator`** key. This key points to an *iterator* method. The `for..of` construct makes use of the `Symbol.iterator` method internally

*Internals of `for..of`*: It invokes the `Symbol.iterator()` on each loop (each iteration) to fetch the elements inside the iterable one by one

```javascript
// Strings are iterables:
let str = "string";
console.log(str[Symbol.iterator]); // ƒ [Symbol.iterator]() { [native code] }

// Regular objects are not iterables:
let obj = { foo: 'bar' };
console.log(obj[Symbol.iterator]); // undefined

for(let letter of str) {
  console.log(letter);
}
/* Output:
s
t
r
i
n
g
*/
```

**Note**: For strings, the iterator returns a letter each time (in order defined). For arrays, the iterator returns each element (in the index order)

**Making an object iterable!**

By default, objects are not iterable. But, we can make them iterable by specifying a property inside it where the key is `Symbol.iterator`. This key is supposed to point to an ***iterator***.

**Iterator**

*Definition*: It is a function that follows the *iterator **protocol***. An object is an iterator if it implements the `.next()` method that takes no arguments and returns at least the two properties: `value` and `done` (Notice that this is very similar to the generator object)

*Real-world analogy of iterators*: A disposable camera. Whenever we click a photo (`next`) we get some data and we can only click more photos but are unable to go back. Once the cards are exhausted (all `yield`s have been run), there is nothing more to do other than develop the photos (the function returns)

`Symbol.iterator`: An *iterator function* that returns an *iterator object* that has the `next()` method.

```javascript
let str = "String";

// Next gives an error bcoz a string is an iterable not an iterator
// console.log(str.next()); // TypeError: str.next is not a function

// 'Symbol.iterator' key is an iterator:
console.log(str[Symbol.iterator]); // ƒ [Symbol.iterator]() { [native code] }
console.log(str[Symbol.iterator]()); // StringIterator {}
```

*Writing our own iterator function (& object):*

```javascript
let rangeIteratorFunc = (start, end, step) => {
  let cur = start;
  let result;
  let isDone = false;
  return {
    next() {
      if(cur < end) {
        result = { value: cur , done: isDone };
        if(cur + step >= end) { // for the next 'next()'
          isDone = true;
        }
        cur += step;
        return result;
      } 
      else {
        return { done: isDone };
      }
    }
  };
};

let rangeIterator = rangeIteratorFunc(0, 10, 2);

let result = rangeIterator.next();
while(!result.done) {
  console.log(result);
  result = rangeIterator.next();
}

/* Output:
{value: 0, done: false}
{value: 2, done: false}
{value: 4, done: false}
{value: 6, done: false}
{value: 8, done: false}
{done: true}
*/
```

*Linking an iterator function to an object:*

```javascript
let someObj = {
    ...
    [Symbol.iterator]: rangeIteratorFunc // the iterator function
    ...
}

// Now, someObj is iterable!
```

**Comparison with Generators**

*Generators are Iterators*! Because a generator object has `next()` just like an iterator object does. And the function of the `next` method is the same in both cases

*Generators actually make writing an iterator easier*! By using the `yield` statement (which pauses flow of the generator function), it becomes easy to pass the `value` and `done` properties for a `next()` call.

***Combining generators:***

```javascript
function* gen1() {
  yield 'a';
  yield 'b';
}
 
function* gen2() {
  yield 1;
  yield 2;
  // you can yield from another generator 
  // using "yield* <genFuncCall>"
  yield* gen1(); 
  yield 3;
}
 
let res = gen2();
console.log(res.next()); // {value: 1, done: false}
console.log(res.next()); // {value: 2, done: false}
console.log(res.next()); // {value: "a", done: false}
console.log(res.next()); // {value: "b", done: false}
console.log(res.next()); // {value: 3, done: false}
console.log(res.next()); // {value: undefined, done: true}
```

**THE END**

