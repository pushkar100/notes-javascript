# Type Conversion Rules for Javascript Objects

JavaScript ***Objects*** include not just plain old objects (`{}` or `new Object()`) but also ***Arrays***, ***Functions***, ***Dates***, and ***Regular Expressions***.

There are two important `Object` methods in JavaScript that help in converting an Object to a Primitive:
1. `.toString()`: This method tries its best to convert an Object to a String.
2. `.valueOf()`: This method tries its best to convert an Object to a Number.

The above two functions are **writable**. It means that you can assign them to custom functions that override their default behaviors and make them return whatever you wish when they get invoked. We will discuss only their default behaviors.

**`.toString()`**

- When invoked on a *Plain* Object returns the string `"[object Object]"`.
- When invoked on an *Array* Object returns a comma separated string of values, like with `.join()`.
- When invoked on a ***User-Defined*** *Function* Object returns the function's source code (definition) as a JavaScript string. (For ***Native*** *Functions*, it returns an implementation-defined string - Not important!)
- When invoked on a *Date* Object returns the date in a Human-readable and JavaScript-parsable format.
- When invoked on a *RegExp* Object returns the string representation of the regular expression (Forward slashes are escaped in the string).

**`.valueOf()`**

- When invoked on a *Plain* Object returns the object itself!
- *Arrays*, *Functions*, and *RegExps* **inherit** the `Object.valueOf()` method. So, these too return the object itself.
- When invoked on *Date* Object returns the number of milliseconds passed since Jan 1st, 1970.

## Converting an Object to a Boolean (*Rules*)

An Object being converted into a Boolean always returns `true`. The reason is, ***any*** Object is considered a *truthy* value.

Special Example: Even the Boolean Wrapper Object that is `false` will return `true` when converted to a Boolean. `Boolean(new Boolean(false)); // true`.

## `Object-to-String`: Converting an Object to a String (*Rules*)

There are a series of steps that a JavaScript Interpreter takes to convert the object to a **string**:

**First Step:**
- Checks for a `toString` method on the Object. If there exists one, it invokes it.
- If the return value is a Primitive, it converts that primitive to a **string** (if not already one) and ***returns*** the result.
- If the return value of `toString` is not a Primitive or if the object has no `toString` method, it goes to find `valueOf`.

**Second Step:**
- Checks for a `valueOf` method on the Object. If there exists one, it invokes it.
- If the return value is a Primitive, it converts that primitive to a **string** (if not already one) and ***returns*** the result.
- If the return value of `valueOf` is not a Primitive or if the object has no `valueOf` method, it throws a `TypeError`.

## `Object-to-Number`: Converting an Object to a Number (*Rules*)

It is similar to `Object-to-String` but we try to convert the primitive to a **number**.

**First Step:**
- Checks for a `valueOf` method on the Object. If there exists one, it invokes it.
- If the return value is a Primitive, it converts that primitive to a **number** (if not already one) and ***returns*** the result.
- If the return value of `valueOf` is not a Primitive or if the object has no `valueOf` method, it goes to find `toString`.

**Second Step:**
- Checks for a `toString` method on the Object. If there exists one, it invokes it.
- If the return value is a Primitive, it converts that primitive to a **number** (if not already one) and ***returns*** the result.
- If the return value of `toString` is not a Primitive or if the object has no `toString` method, it throws a `TypeError`.

## Explicit Object Conversions

How to explicitly convert Object to Primitives?

- To convert any object to a Number, pass it to `Number()`.
- To convert any object to a String, pass it to `String()`.
- To convert any object to a Boolean, pass it to `Boolean()`.
- An Object cannot be converted to `null` or `undefined`. They are the sole members of their type and have no methods.


