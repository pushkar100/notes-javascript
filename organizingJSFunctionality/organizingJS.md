# Organizing JavaScript Functionality (Notes - Browser Part Only)

**Notes from the workshop video series by Kyle Simpson**

> No amount of learning the theory of JavaScript will substitute for actually practicing the implementation of it. Even before you adopt a framework, learning how to organize the different bits of JavaScript (modularizing, decoupling, etc) will make a huge positive impact on the quality of your code. Once you've mastered those techniques, turn your attention to building code that you can share between the client (browser) and the server (Node). That's where the most exciting exercises of your new-found JS knowledge will shine!

## Nested Scopes

```javascript=
function foo() {
	var a = 1;

	function bar() {
		var b = 2;

		function baz() {
			var c = 3;

			console.log( a, b, c );	// 1 2 3
		}

		baz();
		console.log( a, b );		// 1 2
	}

	bar();
	console.log( a );				// 1
}

foo();
```

We can only go upwards/outwards the scope (inner scope can access outer scope but not vice-versa).

Nested scopes form **closures**. And this pattern is useful since it is seen as part of many other patterns, especially a two-level nesting (one function inside another).

**Closure** example using nested scope:
```javascript=
function makeAdder(x) {
	// parameter `x` is an inner variable

	// inner function `add()` uses `x`, so
	// it has a "closure" over it
	function add(y) {
		return y + x;
	};

	return add;
}

var fn = makeAdder(5);
fn(10); // 15
fn(20); // 25
```

## Modules

Closures are taken advantage of in the module pattern (very popular and common pattern). We use closures to create private and public methods (Encapsulation).

For example, If we have a function that has 10 methods and it only wants to expose 5 of them, then it can return 5 of them when called. (The remaining 10 are accessible to the public 5 via closure).

Generally, what you want to expose to the outside world from the function is known as the function's *public API*.

```javascript=
// Module pattern example:
function Hello(name) {
    var greeting = 'Hi! '; // private

	function upper() { // private function
		return name.toUpperCase();
	}

    function sayHi(lastName) {
        console.log(greeting + upper() + ' ' + lastName);
    }
           
    var publicAPI = {
        sayHi: sayHi // publicAPI property name could be same/different as function
    }
    return publicAPI;
}

var o = Hello('Kyle');
o.sayHi('Simpson'); // Hi! KYLE Simpson
```

Why return objects? Because they can hold multiple properties and functions (If we intend on returning only 1 item, we need not use an object - but returning objects is the most common way of implementing this pattern).

**Drawback of Modules:** Makes it hard to *unit test* the private methods. Solutions exist, such as, dependency injection but Kyle's take on it is that only the public API testing (which is accessible) needs to be tested and private functions don't matter. He believes that a unit should not be every function but the smallest module that is indivisible.

**Note:** "Private" in javascript refers to "accessibility" from some place in code or not. It does not mean that the code is hidden from developers who examine the source code (such privacy does not exist). At least all browser javascript code can be examined.

## Callbacks

Functions are first-class objects. It means that functions can be treated as *values*. That is, they can be passed to other functions, returned from functions. They can have properties, etc.

One pattern used when dealing with processes that take time (Ex: Asynchronous ones, like setTimeout/Ajax) are **callbacks**. Callbacks are used mostly because the value of the long processes are not available immediately, so we cannot assign the calls to them to a variable. Hence, we *pass a function to the async process* (we do not invoke the function but pass it using the name) and that long (and probably asynchronous) process executes it when it is ready to output/return the value(s). This function that was passed is known as the *callback*.

```javascript=
function handleResponse() {
	...
}
setTimeout(handleResponse, 1000); // Calls the callback function after 1 second
```

```javascript=
function outputRes(result) {
	// makes use of result passed to it
}
// Assume async func that calls callback passing result as argument:
doAjax(url, outputRes); // We need not specify params to callback here (automatically passed to it by 'doAjax' internals).
```

**Useful example** of refactoring a piece of code into **module pattern**:
```javascript=
/*
// OLD: HEADER.JS (NOT REFACTORED):
$(document).ready(function() {

	var $modal = $('[rel=js-modal]');

	$('[rel=js-header]').on('click', '[rel*=js-]', openAuthModal);

	function openAuthModal(evt) {
		var url = $(evt.target).attr('href');

		evt.preventDefault();
		evt.stopPropagation();
		evt.stopImmediatePropagation();
		$.ajax(url, { dataType: 'text' })
		.done(function(modalContent) {
			$modal.html(modalContent).show();
		});
	}
});
*/

/*
************************************************
*/

// NEW: HEADER.JS IN MODULE PATTERN:
var Header = (function Header() {
	var $modal;

	var publicAPI = {
		init: init
	};

	return publicAPI;

	// ****************
	
	function init() {
		$modal = $('[rel=js-modal]'); // need to wait for dom ready, so initialize modal here in init.
		$('[rel=js-header]').on('click', '[rel*=js-]', openAuthModal);
	}

	function openAuthModal(evt) {
		var url = $(evt.target).attr('href');

		evt.preventDefault();
		evt.stopPropagation();
		evt.stopImmediatePropagation();
		$.ajax(url, { dataType: 'text' })
		.done(function(modalContent) {
			$modal.html(modalContent).show();
		});
	}
})();

$(document).ready(Header.init);

// Note: Module does not have to be IIFE. 
// We could have had a normal function (abstract function) and then used: 
// 'var o = Header(); $(document).ready(o.init);' 
// But, IIFEs save us that extra step (invoking function) plus we create a singleton object.
```

**Reasons to use modules:**

1. Modules give us a way to encapsulate data. It means that we can have private and public methods and expose to the outside world only the public ones.
2. It also provides namespacing, so it avoids naming conflicts with other parts of code.
3. Comparison with **Class**: In JS, in a class, everything is *public* by default whereas in modules, everything is *private* by default (you decide what you want to expose).

**Note on `$(document).ready()`:**

We should only put inside `$(document).ready()` all the code that needs to wait for DOM to be loaded. Often times, a lot of other code, that need not wait for any DOM related stuff is also put into `ready`. This is an anti-pattern and should not be done. Those functions need to be kept out. While using module pattern function whose `init` will be called from `ready` outside, we need to make sure that we only include those functions in `init` that have to wait for DOM (Ex: In the above `header.js` code, only the event handler for the DOM element is inside `init` and `init` is called from outside the module in the DOM ready event handler. But,     `init` has click event whose callback function `openAuthModal` need not be inside `init` itself. it can be internal. That is, need not be placed in `init` - which is what we have done). Every other function can be private (and accessed via closure automatically).

**Controlling Global Access:**

What if we had *spaghetti code* with a set of unrelated functions and variables (that didnt make sense to be put into one or more modules - because each did some independent computation)? In this case, we can wrap everything inside an **IIFE**.

Since everything inside the IIFE will be linked to the IIFE's scope, nothing inside it will pollute the global scope. We can even *pass parameters to the IIFE*.

What if some part of the spaghetti code needs to be made public (available globally) (Some methods need to be made global else we won't be able to access anything in the app)? We take those methods/variables and assign them to `widnow` (global) object as properties from within the IIFE (so that only they become available outside IIFE).

```javascript=
(function(global, $) {
    // ** Spaghetti code **:
    // 100 random methods/vars
    // 98 can be private
    // 2 need to be accessed outside (say, 'foo' and 'bar')
    
    global.foo = foo;
    global.bar = bar;
})(window, jQuery);

// Accessing whatever was made public by the IIFE:
window.foo;
window.bar;
```

## Refactoring Code Post Modularization

Once we have put our code into modules, there may still be some pieces of it that is ideally supposed to be in another module. So, we need to do some shifting so that all code is logically associated with its own module.

Another cause for further refactoring includes making calls to public APIs of modules from another module. This is needed so that modules can communicate with each other using their public APIs. 

An example would be of a "carousel" and a "details" module. 
- If there are carousel items in the details module, we should shift them to the carousel module and vice-versa.
- Assume that there is a function that initializes an event handler on some element in the carousel and on triggering it, it loads some data into the details section. Here, we need to separate out the concerns - the function must be logically split in such a way that the event triggered on the carousel must be defined in the carousel and the loading of data into details part must be in the details module. The two modules must expose modules in their public API so that they can interact with each other.

**Note:** Refactoring post organizing of data into modules might be hard (easier to leave it like that) but it is *conceptually wrong to have one module do other module's work*. **Separation of concerns** is a must!

```javascript=
// PRE-REFACTORING OF MODULES:
// Details module:
var Details = (function() {
    // ...
    var $carouselItem; // IDEALLY NEEDS TO BE DECLARED IN CAROUSEL

    var publicAPI = {
        init: init
    };
    return publicAPI;

    // **********

    function init() {
        $carouselItem = $('someItemInCarousel'); // IDEALLY NEEDS TO BE ASSIGNED IN CAROUSEL

        // event handler that is defined on carousel item (should not be here)
        $carouselItem.on('click', loadIntoDetails);
        // ...
    }

    function loadIntoDetails($someCarouselElement) {
        var id = $someCarouselElement.data('id'); // NEEDS TO BE IN CAROUSEL

	/* Use "id" to fetch some data and put it into details div. */
    }
    // ...
})();

// Carousel module:
var Carousel = (function() {
    // ...
    var publicAPI = {
        init: init
    };
    return publicAPI;

    // **********
	
    function init() {
        // ...
    }
    // ...
})();
```

And, after refactoring, we get:

```javascript=
// AFTER REFACTORING OF MODULES:
// Details module:
var Details = (function() {
	// ...
	var publicAPI = {
		init: init,
		loadIntoDetails: loadIntoDetails // (8) make new details functionality of earlier function available to Carousel to call it
	};
	return publicAPI;

	// **********

	function init() {
		...
	}

	function loadIntoDetails(id) { // (9) Only deals with loading details based on some "id" passed to it (does not care about click on carousel elt).
		/* Use "id" to fetch some data and put it into details div. */
	}
	// ...
})();

// Carousel module:
var Carousel = (function() {
	...
	var $carouselItem, // (1) MOVED TO LOGICAL PLACE (inside carousel module)
		$someCarouselElement = '$(...)' ; // (5) This item also belonged to carousel

	var publicAPI = {
		init: init
	};
	return publicAPI;

	// **********
	
	function init() {
		// ... does something
		$carouselItem = $('someItemInCarousel'); // (2) ASSIGNED IN CAROUSEL'S INIT (NOT IN DETAILS')

		// (3) event handler on carousel item is placed in carousel itself
		$carouselItem.on('click', handleItemClick); // (4) We only care about click on carousel item (not what is added details)
	}

	function handleItemClick() {
		var id = $someCarouselElement.data('id'); // (6) This has been brought into carousel

		Details.loadDetails(id); // (7) Use public API of details to call its functionality
	}
	...
})();
```

## `$(document).ready`

Multiple modules call their own callback attached to the `ready` function (In pure JS, it would be the event listener `DOMContentLoaded`). We can define the `ready` method in one place and all the module inits can be done there. 

- `app.js` that holds the `ready` function.
- All modules' `init` needs to be called inside `ready`
- Remove `ready` from the modules themselves
- Add `app.js` script (load it from index.html) - place it after all the module scripts.

```javascript=
// File 1: Details module
var Details = (function() { ... })();

// File 2: Carousel module
var Carousel = (function() { ... })();
                            
// File 3: Header module
var Header = (function() { ... })();
                          
// File 4: App.js
$(document).ready(function() {
    Header.init();
    Carousel.init();
    Details.init();
});
```

```htmlmixed=
<!-- File 5: index.html -->
<html>
    <head>
    </head>
    <body>
        <script src="jquery.js"></script>
        <script src="Header.js"></script>
        <script src="Carousel.js"></script>
        <script src="Details.js"></script>
        <script src="App.js"></script>
    </body>
</html>
```

## Event Emitters

There is one more level of abstraction above modularizing and refactoring code within these modules and that is **events**.

In the previous example, the `Carousel` module called the `Details` module's method to load a person when something in the carousel was clicked. If we want to go to a higher level of abstraction, we need to make sure that the modules are *"completely independent"* of each other. 

Instead of `Carousel` calling a method that belongs to `Details`, we can *emit* and event from `Carousel` that notifies anyone listening to it about its occurrence. On the listener's side (`Details`) we can perform some action (execute a callback function) when we become aware of an event occurring. In this way, **neither the emitter nor the listener needs to be aware of each other** and the we will have achieved a *new layer of abstraction*.

This pattern that uses events is known as *Publisher/Subscriber* pattern (**PubSub**) or *Observer* pattern. One module emits or publishes an event while others subscribe or listen to it. There needs to be a **central object/module** that *manages* the emission of events and its listeners.

[Link to basic observer pattern implementation](https://github.com/pushkar100/javascript-notes/blob/master/design-patterns-freeCodeCamp/observer-pattern.js)

We can write our own event emitter but it is easier to use a library. One such library is [eventemitter2.js](https://github.com/asyncly/EventEmitter2/blob/master/lib/eventemitter2.js). This very tiny library has the same public API as the node's built-in event emitter. So, an app written for node need not change its event emitter API calls when used in the browser (if we are using eventemitter2.js lib).

Example usage:
```javascript=
// File 1: App
var EVT = new EventEmitter(); // Constructor to initialize that central object controlling events
// defined on the global object so that all modules can access it.
$(document).ready(function() {
    ...
});
                           
// File 2: Carousel
var Carousel = (function() {
    ...
    EVT.emit('person-selected', id); // pass any data (id) that a listener would need
    ...
})();
                           
// File 3: Details
var Details = (function() {
    ...
    EVT.on('person-selected', loadPerson); // callback will receive as params the data passed from emitter
    ...
})();

// Neither the Details module nor the Carousel module need to know about each other.
// Thanks to the emitter object (pub-sub or observer pattern)
// HIGHER LEVEL ABSTRACTION
```

**A major advantage of events**

Events help us test modules independently. When we write test cases, we can create mock events and emit them. In this way, we will not have to depend on another module that emits it. For example, to test the `Details` module, we need not click an item identified inside the `Carousel` module to emit an event captured by `Details`. Instead, we can simulate the event emission in the test suite and test only the `Details` module.

*It is not possible to avoid calling modules and to use events all the time but wherever possible, it is good to use events over calling modules*

**Using events to initialize modules (optional)**

We can emit an event on document ready state so that it initializes modules. We can omit the `init()` method from each of the module's APIs or leave it there.

Example:
```javascript=
// app.js
var EVT = new EventEmitter();
$(document).ready(function() {
   EVT.emit('init');
});

// details.js
var Details = (function() {
    ...
    EVT.on('init', init);
    
    var publicAPI = {
        init: init // we can either leave it or remove it if 'init' event is the only time it is executed.
        ...
    }
    return publicAPI;
})(); // Similarly for Carousel & Header modules

// Since App.js has the EVT object that all modules need to use, 
// place the app.js script before all module scripts in the HTML
```

Using events is known as:
- **Event-driven architecture**
- Event-driven architecture is **not** the same as *Reactive programming*. It is a small subset of it.

**Another advantage of events:**

We can emit events for use *within the same module* as well. The reason this is good is that if there are other listeners that need to do something on the same event, it will help them as well. In contrast, had we done a direct call to a paricular function within the module, the listeners would not become aware of it and not do their bit.

## Factory vs Singleton:

Everytime we need to have only a single instance of an object, we will use modules to create singleton (a single object). No matter how many times we initialize it, only one instance is created.

```javascript=
var Factory = (function Factory() {
	...
	var publicAPI = { ... };
	return publicAPI;
})();

var factObj1 = Factory();
var factObj2 = Factory();

factObj1 === factObj2; // true
```

When we want to create instances of objects continuously from a blueprint, we invoke the factory function as many times as the number of objects we need to create.

```javascript=
var Factory = function Factory() {
	...
	var publicAPI = { ... };
	return publicAPI;
};

var factObj1 = Factory();
var factObj2 = Factory();

factObj1 !== factObj2; // true

factObj1.init();
factObj2.init();
```

# Server Side JavaScript (Not Covered)

## Middle End Architecture

There are a lot of tasks:
1. That every application needs &
2. That need to be done both on the server as well as the client (browser).

Examples of such tasks include:
- Data validation,
- Data formatting
- Templating
- Caching
- Routing

Earlier, there was *no single language* that you could use on both platforms. An advantage of using one language on both sides is that code can be *reused*.

"Middle-end Architecture" refers to the arhictecture that handles all the above mentioned tasks. You can think of it as tasks that bottom 10% of server & top 10% of the browser does (& everything in between).

In the middle-end style of development, once again we want to separate concerns. So, the frontend never talks to the backend and vice-versa. Instead, they both talk to the middle-end.

**END**
