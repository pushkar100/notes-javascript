# Typescript

[Stephen Grider Udemy Course](https://www.udemy.com/course/typescript-the-complete-developers-guide)

## Why & How?

1. Catch errors during development (i.e Move most of the runtime type errors into compile time)
2. Custom "Type annotations" to analyze our code
3. Only active during development (not present in deployed javascript)
4. Does *not* provide any performance optimization

## Process

1. Write Javascript code with type annotations
2. The code passes through the Typescript compiler
3. We generate plain old Javascript
4. This Javascript can run in the browser or target environment

We do not "execute" Typescript. We always execute Javascript.

## Installation

**`npm i -g typescript ts-node`** (Install globally, may need to run with `sudo`)

- `typescript` package installs the compiler and gives us access to the `tsc` command on the CLI to compile our code
- `ts-node`: TypeScript execution and REPL for node.js, with source map support. **Works with `typescript@>=2.7`**. Node does not understand and compile typescript by default. Therefore, this package allows us to run node scripts written in Typescript on the node environment

There are two ways to run typescript files on Node. Run `tsc` which generates a `.js` file if there are no errors and we can run this file on Node. 

The other way is to use `ts-node <.ts-file>` to compile on the fly and run it on Node.

**Note:** 

1. VSCode comes with native support for typescript and its intellisense can detect TS errors
2. ES Modules (`import/export`) are experimental in Node (available in Node 13 onwards by default)

## File extension

All the typescript files are having the **`.ts`** extension. If you are using typescript with React that includes JSX then your file extension can be **`.tsx`** (or you can configure support for Typescript to understand JSX without mentioning a `.tsx` file)

## Executing TS on Node

There are two ways:

1. Run the typescript compiler `tsc <.ts-file>` on `.ts` file which produces a `.js` file. This file can be run with `node` command (`node <.js-file>`). It is a two-step process
2. Run `ts-node <.ts-file>` directly on a typescript file and this single command runs the TS compiler and executes resulting JS on Node. This method does *not* produce any `.js` files

## An example of why TS is useful

Assume a JSON response from an API to be the following when converted to a JS object:

```js
{
  userId: 1,
  id: 1,
  title: "delectus aut autem",
  completed: false
}
```

Now, the following snippet does not know if we are accessing the correct properties from the response data:

```typescript
axios.get(url).then((response) => {
  const todo = response.data;

  const id = todo.ID;
  const title = todo.Title;
  const finished = todo.finished;

  console.log(`
    Todo with ID: ${id}
    Todo title: ${title}
    Is finished?: ${finished}
  `);
});
```

... and the output when executed on Node (`ts-node <.ts-script>`) is as follows:

```shell
Todo with ID: undefined
Todo title: undefined
Is finished?: undefined
```

Getting `undefined` is a run-time error. We could have avoided it had twe known that these properties don't exist.

There is a type of structure called **`interface`** in TS that we can use to define object structures. We can use this to get compile time errors on accessing objects in different ways that what is expected.

To use an interface we can append **`as <InterfaceName>`** to an object literal

***Note***: *VSCode, which has strong Typescript support and intellisense, will give us red underlines while writing code to indicate type errors.*

```typescript
import axios from "axios";

const url = "http://jsonplaceholder.typicode.com/todos/1";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

axios.get(url).then((response) => {
  const todo = response.data as Todo;

  const id = todo.id;
  const title = todo.title;
  const finished = todo.completed;

  console.log(`
    Todo with ID: ${id}
    Todo title: ${title}
    Is finished?: ${finished}
  `);
});
```

```shell
Todo with ID: 1
Todo title: delectus aut autem
Is finished?: false
```

The goal of TS is to ***catch errors during development***. We didn't even have to wait for compilation (`tsc`) since VSCode's TS support helped us identify errors in the editor itself. This is the power of TS.

### Another example

```typescript
axios.get(url).then((response) => {
  const todo = response.data as Todo;

  const id = todo.id;
  const title = todo.title;
  const completed = todo.completed;

  logTodo(id, completed, title); // <-- VSCode will show typescript error
});

const logTodo = (id: number, title: string, completed: boolean) => {
  console.log(`
    Todo with ID: ${id}
    Todo title: ${title}
    Is finished?: ${completed}
  `);
};
```

In the above snippet, we have provided "type annotations" (the type of variable each param is) to our params to `logTodo` so that matching the wrong type of param (boolean with a string in the example) will give us an immediate error indication in the editor (& running the compiler on it will also provide an error - unsuccesful exit)

## Types

**What is a type?** It is an easy way to refer to the different *properties* & *functions* that a value has. It is a shortcut that typescript uses to analyze what type of properties and methods are possible on a value. It either infers it implicitly or when we define a type explicitly.

*Value* can be any type in Javascript. A primitive like a string, a number, etc. Or, it can be an object, an array, a function and so on.

Every value has a type associated with it and the properties and functions are automatically identified by specifying the type. For example, if you have a string "hello" and if the type is defined to be a string apart from its value ("hello") we know that it has properties & functions such as `.toLowerCase`, `.concat`, etc. It would have been really painful (without having the 'type' knowledge) to list out every single property that the value has access to.

**Types**

1. Primitive types (*immutable*)
   1. number
   2. string
   3. boolean
   4. null
   5. undefined
   6. symbol
   7. void
2. Object types (*mutable*)
   1. object (includes literals, classes, regular expressions, and dates)
   2. Date
   3. array
   4. function

**Why types matter?**

- Helps TS compiler to analyze our code and detect type errors
- Helps other engineers understand what type values are used by our code and removes ambiguity

**Typescript uses types to know:** 

1. What properties are available (both *when it infers* plus when we *explicitly state the type*), & 
2. What properties are not available (throws an error)

**Where do we use types?**

Everywhere. Due to the nature and purpose of typescript, we have to deal with types everywhere in our code

## Type annotations & inference

**Type annotation**

Code we add to TS to tell *what type of value* a variable will refer to (The developers tell TS manually)

Syntax: `: <type>` placed after a variable identifier during declaration

**Type inference**

TS implicitly *tries to infer i.e figure out* what value a variable refers to (Developers do not tell TS the type)

**Examples:**

1. Primitives & built-ins

```typescript
let apples: number = 5;
let speed: string = "fast";
let hasName: boolean = true;
let aaa: number; // Type annotation with only declaration
aaa = 5;

// Assignment against the type annotation throws error:
const x: string = 10; // <-- TS will show error

// Types that refer to emptiness:
let nothing: undefined = undefined;
let nothingMuch: null = null;

// Reassignment to another type throws an error:
hasName = "Hi"; // <-- TS will show error

// Built in objects
let now: Date = new Date();
```

2. Arrays

```typescript
// Arrays
let nums: number[] = [1, 2, 3];
const names: string[] = ["Pushkar", "Rashid", "Akhil"];
const bools: boolean[] = [true, false, true];

// Error if element type does not match type annotation
const y: string[] = ["a", "b", 10]; // <-- TS error (X)
```

3. Objects & Classes

```typescript
// Classes:
class Car {}
// The class itself can be a type:
const car: Car = new Car();
const myCar: Car = new Car();

// Somehow no error if we assign something other than type:
const fooCar: Car = 10; // <-- NO TS error (hmmm...)

// Objects:
const coords: { x: number; y: number } = {
  x: 10,
  y: 120,
};

const contact: {
  name: string;
  phone: number;
} = {
  name: 10, // <-- TS error if prop does not follow type
  phone: 1020304050,
  y: 10, // <-- Also a TS error if object has additional props
};
```

4. Functions

```typescript
// Functions:
const logNumber = (i: number) => { // Parameters can be annotated
  console.log(i);
};

// Type annotation for the function itself:
// (<param>: <type for params>, ...) => <type annotation for return type>
// Return type annotation is 'void' if it returns nothing
const logNumber: (i: number) => void = (i) => {
  console.log(i);
};
```

5. Assigning multiple types:

```typescript
// We can have the pipe (|) operator to form a union of types:
const x: boolean | number = false
x = 5 // TS allows it to be a number due to type annotation
```

**How does type inference work?**

Type inference works when **declaration + initialization** happens on the same line. 

Declaration is when you specify a new variable name with a keyword like `let`, `var`, `const`.

Initialization is when you assign a variable for the *first* time.

```typescript
let apples = 5; // Typescript infers apples to be a number
let speed = "fast"; // Typescript infers speed to be a string
let hasName = true; // Typescript infers hasName to be a boolean
let numbers = [10, 9, 8, 6]; // Typescript infers numbers is an array of numbers (number[])

let aaa; // Typescript cannot infer type since there is no initialization with declaration
aaa = 5; // Type can be "any"
```

**The `any` type**

Typescript assigns this type when it cannot figure out (infer) what the type is at all 

We must *avoid* any at all costs. We are using TS to catch type errors but with `any` we cannot do error checking

**When do we use type annotations instead of letting TS infer types?**

1. TS will always try to infer types

2. We have common use cases for *explicitly* defining a type:

   1. ***Functions that return the `any` type***

      ```typescript
      const points = '{ "x": 10, "y": 20 }';
      const getPoints = JSON.parse(points); // JSON.parse return type is 'any'
      
      // JSON.parse can return different values (number, boolean, object) for different inputs. Therefore, TS cannot infer the return automatically for this built-in method
      ```

      ```typescript
      // Fixing 'any' type in a function return:
      const points = '{ "x": 10, "y": 20 }';
      const getPoints: { x: number; y: number } = JSON.parse(points);
      getPoints; // getPoints type is now NOT `any`!
      ```

   2. ***When we declare a variable on one line and initialize it later!***

      ```typescript
      const games = ["cricket", "football", "basketball", "badminton"];
      let hasFootball;
      
      games.forEach((game) => {
        if (game === "football") {
          hasFootball = true;
        }
      });
      
      // hasFootball is of type "any" since initialization took place after declaration
      ```

      ```typescript
      // Fix it: Since we know it is a boolean, we can type annotate hasFootball at declaration
      const games = ["cricket", "football", "basketball", "badminton"];
      let hasFootball: boolean;
      
      games.forEach((game) => {
        if (game === "football") {
          hasFootball = true; // We cannot assign any value other than a boolean
        }
      });
      ```

   3. ***Variable whose type cannot be inferred correctly even if initialization is with declaration***

      ```typescript
      // This is an edge case. But, we need to help TS in such cases
      // Bad example of need for changing type but
      // serves the point home:
      const numbers = [10, 11, -1, 0, 2];
      let positiveNum = false; // Inferred type is boolean
      
      numbers.forEach((number) => {
        if (number > 0) {
          positiveNum = number; // positiveNum is no assigned to numebr but type is boolean
        }
      });
      ```

      ```typescript
      // Fix it:
      const numbers = [10, 11, -1, 0, 2];
      let positiveNum: boolean | number = false;
      
      numbers.forEach((number) => {
        if (number > 0) {
          positiveNum = number;
        }
      });
      ```


