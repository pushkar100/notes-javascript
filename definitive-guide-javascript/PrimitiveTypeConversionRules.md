# Type Conversion Rules for Primitives

- **Primitives**: Values that are not composite and are immutable (Numbers, Strings, Boolean, null, undefined)
- **Objects**: Values that are composite and are mutable (Objects - also includes Arrays, Functions, Dates, RegExps)

## Primitive-To-Primitive Conversion *Rules*

### Convert Primitive to a Boolean:

- *Falsy* values convert to `false` (Falsy values are `false`, `0`, `-0`, `NaN`, `null`, `undefined`, and `""`).
- *Truthy* values convert to `true` (Truthy values are anything that is not falsy. Ex: `{}`, `1`, `'Hi'`, `[]`, etc).

**Note**: These two rules apply to ***Objects to Boolean*** Conversion as well.

### Convert Primitive to a Number:

- If Primitive is a `String`:
	1. Tries to parse the String to a Number (Leading/Trailing Whitespaces are ignored). Ex: `"123" => 123`. If ***any*** Non-Numeric character apart from trailing/leading spaces is present anywhere in the String then it returns `NaN`. Ex: `"123a" => NaN`.
	3. Empty String (`""`) gets converted to `0`.

- If Primitive is a `Boolean`:
	1. `true` is converted to `1`.
	2. `false` is converted to `0`.

- If Primitive is `null` or `undefined`:
	1. `null` is converted to `0`.
	2. `undefined` is converted to `NaN`.

### Convert Primitive to a String:

- If Primitive is a `Number`: (*Wraps it in Quotes*)
	- It wraps the Number into a String. Ex: `0 => "0"`, `56 => "56"`.

- If Primitive is a `Boolean`: (*Wraps it in Quotes too!*)
	1. `true` is converted to `"true`.
	2. `false` is converted to `"false"`.

- If Primitive is `null` or `undefined`: (*Wraps them in Quotes too!*)
	1. `null` is converted to `"null"`.
	2. `undefined` is converted to `"null"`.

## Primitive-to-Object Conversion *Rules*

- *Numbers*, *Strings* and *Booleans* are wrapped inside their ***Wrapper Objects***;
	- Number `n` is converted into `new Number(n)` which returns a wrapper object.
	- String `s` is converted into `new String(s)` which returns a wrapper object.
	- Boolean `b` is converted into `new Boolean(b)` which returns a wrapper object.

- `null` and `undefined` cannot be converted into objects and ***implicitly*** trying to do so throws a `TypeError`. The exception is when you are trying to ***explicity*** try to do so. In the explicit case, an empty object is returned `{}`.

## Explicit Primitive Conversions

How to explicitly convert Primitives to other Primitives or to an Object?

- To convert a Primitive to a `Number`: Pass it as argument to `Number()`.
- To convert a Primitive to a `String`: Pass it as argument to `String()`.
- To convert a Primitive to a `Boolean`: Pass it as argument to `Boolean()`.
- To convert a Primitive to an `Object`: Pass it as argument to `Object()`

**Note**: Explicit Conversions strictly follow the primitive conversion *rules* defined above.