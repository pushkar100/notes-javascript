# Scope Chains and Closures:

1. **Lexical Scoping**: Refers to the scope of the functions (within functions)
2. **Block Scoping**: Refers to the scope of the curly brackets `{}`, like in an `if` block. (New scope, a feature of ES6)

Less popular scopes:
- Global
- `this`
- `catch` block
- `eval()`

Use **var** to lexically scope variable to the current function.
```
function foo() {
    var a;
}
```

Use **let** or **const** to block scope variable to current block.
```
if(<condition>) {    
    let b;
}
```

## Scope Chains:

Scopes can be **nested**.
- Lexical scope inside lexical scope:
```
function foo() {
    function bar() {
    ...
    }
}
```
- Block scope inside block scope:
```
if() {
    while() {
    ...
    }
}
```
- Block scope inside lexical scope:
```
function foo() {
    if() {
    ...
    }
}
```
Etc.

Sibling scopes **cannot** access each other's variables:
```
function foo() {
    function inner1() {
    ...
    }
    function inner2() {
    ...
    }
}
```
`inner1` cannot access `inner2` variables (and vice versa).

**Scope Trees:** We can construct a tree-structure linking all the scopes, starting from the global/window object. (Construct from **top to down**).

**Scope Chain:** If we look at the scope tree from **bottom to top**, the *path* gives us a scope chain. Variable access is upwards in a scope chain.

**Only inner scopes can access outer scopes (but not vice-versa).**

Ex:
```
function a() {
    function b() {
    ...
    }
    function c() {
        function d() {
        ...
        }
    }
}
```

```
a--->b
|
|
c--->d
```

`dca` is one scope chain.
`ba` is another scope chain.

## Global Scope & Shadowing:

Every JS Runtime must have a **Global Scope Object** (Root of the scope tree). For browser, it is `window` and for Node it is `global`.

**How are variables fetched?**

Example: Assume that during execution we need to assign a variable some value. It is done as follows:
1. Search within current scope
2. If not found, search immediately outer scope (parent scope).
3. If found, go to point (6).
4. If Not found from (2), repeat (2). Repeat until we hit global scope.
5. Not found in global scope? Create it (under window/global object).
6. Assign the value.

In this way, if some variable needs to be used or assigned and that variable is not declared anywhere in the scope chain, it gets declared automatically in the global scope (& the operation is carried out).

Ex:
```
function foo() {
    var a = 2;
    function bar() {
        b = 3; 
        /* b is not declared in the current scope nor in any of the outer scopes (ancestors), not even globally. */
        /* Hence, it gets auto-declared during runtime as a global property and then being assigned the value 3 */
    }
}
```

**Shadowing:**
- Two different variables in two different scopes (sibling or unrelated) can have the **same name**. Depending upon the context/scope, the correct variable (and its value) is identified.
```
function foo() {
    function bar() {
        var a = 5;
        console.log(a); // 5
    }
    function baz() {
        var a = 10;
        console.log(a); // 10
    }
}
```
- Two different variables in **nested, related scopes** can also have the **same name**. In this case, when execution is in the inner scope, the **inner scope variable** is what takes **precedence**. When inner scope variable is used instead of outer scope variable (of same name) then the *inner variable is said to be **shadowing** the outer variable*.
```
function bar() {
    var a = 5;
    console.log(a); // logs 5 when executed
    function baz() {
        var a = 10; // shadows the outer 'a'
        console.log(a); // logs 10 when executed
    }
    console.log(a); // logs 5 when executed
}
```

## Closures:

Closures enable callback-last programming in Node. They also provide an excellent mechanism for handling asynchronous nature of most JS tasks.

- Nested scopes form scope chains.
- Inner scopes of scope chain have access to the content (variables, functions, etc.) of outer scope.
- It means that the inner scope captures the variables & constants of the context in which it was defined (i.e Scope chain). Therefore, we can say that inner scope **closes over** the outer scope.
- The closing over of the outer scope is defined as **closure**.

```
***Scope Chain:***
someFunc() : { var bar; }
    |
    |
    |
inner() : { alert(bar); }

```
`inner` has access to `someFunc` variable `bar`.

Important point regarding closures:
- **Closure will be maintained even if the inner function is not executed immediately.**
- This means that we can pass `inner` function around or `return` it from `someFunc` for later execution and the closure will still be maintained (whenever `inner` is executed)!

## Garbage Collection:
- Memory is managed *automatically* by the **JS Runtime**
- This memory management process is known as **Garbage collection**
- Programmers have **no** say in how and when must certain memory be released/sent to garbage.

The most common algorithm used by JS engines to perform garbage collection is known as 
**Mark & Sweep**:
- We **mark** references in memory (variables, functions, etc.) which can still be reached from the active code (i.e, lies in  the scope chain of the part of code that is executing)
- Any reference not marked is **sweeped** into garbage.
- Not only should a reachable variable be kept in memory, but also its **scope chain**. (Reason: Scope chain tells us how to reach the variable).

Ex:
```
***Scope chain***
someFunc() : { var bar; return inner; }
    |
    |
    |
inner() : { alert(bar); }
```

Due to closure, `inner` has access to `bar`. `bar` is reachable along with its scope chain. Therefore, both are kept in memory.

Whenever `inner` gets executed, it is no longer required in memory. Even `bar` is no longer reference anywhere, so we do not require it either. Finally, the scope chain too is not required since everything it contains has finished executing. None of these are marked and are sent to the garbage.

**Note:** Garbage collection **blocks** the main thread - effectively stopping all other JS tasks from executing until it is complete. That is why, extensive garbage collection is bad (make sure the JS engine you use is good at GC).

