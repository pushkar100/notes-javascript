# Design Patterns: 20 Patterns For Advancing Your JavaScript Skills

Video Course From Packt Publishing. (Instructor: Ben Fhala)

Learning Design Patterns will change the way you code forever. You will understand when and why they are used.

*Prerequisites:* 
1. Assumes you know Object Oriented JS - Focus is on Foundations of Design Patterns and not JS as a language itself.

**Note:** These notes only cover:
1. **Object Literal Notation and Namespacing**
2. **Module Pattern**
3. **Revealing Module Pattern**
4. **Completely Controlling Global Scope**
5. **Singleton Pattern**
6. **Factory Pattern**
7. **Abstract Factory Pattern**

## Section 1: My First Design Patterns 

*The Problem with Global Scope:* 
The global scope can be polluted with various names (identifiers) with all our functions and variables that exist. Also, it is hard to have private or public methods. It results in spaghetti code.

*Example of a chat app written without any design patterns (polluting global scope):*
```
/* File 1 - index.html */

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Design Patterns - 20 must know</title>
	<style>
		.hdr {
			font-size: 20px;
			font-weight: 600;
			width: 560px;
			margin: 10px auto;
			color: #0d426c;
			padding: 20px;
			border: 1px solid #dfe1e8;
		}
		.chatBox {
			width: 560px;
			height: 104px;
			margin: 10px auto;
			padding: 20px;
			font-size: 15px;
			border: 1px solid #dfe1e8;
		}
	</style>
</head>
<body>
	<h1 class="hdr">Chat App</h1>
	<div class="chatBox"></div>

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js"></script>
	<script src="practice.js"></script>
</body>
</html>

/* File 2 - practice.js: */

/* A fake chat app - written in spaghetti code: */

// List of variables for user, pc, and messages:
var me = 'You: ',
	computer = 'PC: ',
	chatHistory = [], // stores a list of all the msgs outputted
	replyYes = 'Yes',
	replyNo = 'No',
	randomMessages = [
		'Howdy, partner?',
		'Good day!',
		'That\'s all, folks!'
	];

// List of all publicly available functions to send, reply and actually output (echo) the msgs:
function speak (msg) {
	echo(me + msg); // your msg
}

function replyYesOrNo () {
	var msg = Math.random() > .5 ? replyYes : replyNo;
	echo(computer + msg) // computer reply
}

function replyRandomly () {
	var msg = randomMessages[ Math.floor(Math.random() * randomMessages.length) ];
	echo(computer + msg); // random computer reply
}

// Responsible for actually outputting the messages onto page:
// shows max 6 msgs at a time:
function echo (msg) {
	chatHistory.push('<div>' + msg + '</div>'); // add the message to queue
	var len = chatHistory.length,
		start = Math.max(len - 6, 0),
		outputHTML = '';
	for(var i = start;i < len; i++) {
		outputHTML += chatHistory[i];
	}

	$('.chatBox').html(outputHTML);
}

/* Use console to execute the speak, replyYesOrNo, or replyRandomly functions */
```

The above example has no real mechanism to provide privacy to code. All the code is accessible to the user and can be run independently anytime. The code is also just a list of methods and could soon turn into a mess as the application grows.

*How to make the code better?:*
1. Reduce global footprint (can be done using **Object Literal Notation**).
2. Condense code into one large object (reduce global scope pollution).
3. Use the **Namespace** design pattern.

### Pattern 1: Object Literal Notation and Namespacing

With multiple global scope references, we have multiple possibilities to get our code overwritten by other code. Let’s condense our code into an object and move it into a unique namespace protecting it from mistaken overrides.

*Implementation:*
1. Put all our functions and variables into *one object*.
2. The former functions and variables are each now a *method/property* of the object. (Will need to use `this` to reference the props and methods).
3. The application will work in the same way, except that everything is *namespaced*.
4. The namespacing to the methods/props is provided by the object - whose *name* is the only thing polluting the *global scope*.
5. Give the object a *very unique name*, reducing the possibility of a conflict. (Ex: giving a name `app` to the app is not very unique).

*Object Literal Notation (Namespacing) Example Code:*
```
/* practice.js: */
/* A fake chat app - written in object listeral notation (namespaced): */

var myChatApp = {
	me: 'You: ',
	computer: 'PC: ',
	chatHistory: [], // stores a list of all the msgs outputted
	replyYes: 'Yes',
	replyNo: 'No',
	randomMessages: [
		'Howdy, partner?',
		'Good day!',
		'That\'s all, folks!'
	],
	speak: function (msg) {
		this.echo(this.me + msg); // your msg
	},
	replyYesOrNo: function () {
		var msg = Math.random() > .5 ? this.replyYes : this.replyNo;
		this.echo(this.computer + msg) // computer reply
	},
	replyRandomly: function () {
		var msg = this.randomMessages[ Math.floor(Math.random() * this.randomMessages.length) ];
		this.echo(this.computer + msg); // random computer reply
	},
	echo: function (msg) {
		this.chatHistory.push('<div>' + msg + '</div>'); // add the message to queue
		var len = this.chatHistory.length,
			start = Math.max(len - 6, 0),
			outputHTML = '';
		for(var i = start;i < len; i++) {
			outputHTML += this.chatHistory[i];
		}

		$('.chatBox').html(outputHTML);
	}
};

/*
Usage examples:
myChatApp.speak('Hi');
myChatApp.replyRandomly();
myChatApp.speak('Do you smoke?');
myChatApp.replyYesOrNo();
*/
```

The name for the object could be made even more unique, by using a nested object type of reference (you might have seen this type of naming convention in downloaded packages):
```
var com = com || {};
com.pushkardk = com.pushkardk || {};
com.pushkardk.apps = com.pushkardk.apps || {};

com.pushkardk.apps.chat = { 
	... 
	...
};
```

### Pattern 2: The Module Pattern

The object literal notation gave us namespacing and a single point of contact for all our methods. But, there is still no way to *create private members* of an object.

The Module Design Pattern enables us to have a separation between our private and public API – protecting the code from external resources.

*Goals of module pattern:*
1. Create real privacy control
2. Having a clear public API
3. True encapsulation

*Implementation:*
1. We will still have one namespaced object (similar to object literal notation)
2. The way the object is created is different. We assign an *IIFE* to a variable which *returns an object*
3. The *returned object* will contain those *methods* that we want to be *public*
4. The variables and functions inside the IIFE itself (not ones in the returned object) act as *private properties/methods*
5. The public methods have access to the private ones via *closure*. A good thing about the private variables is that we do not require the prefix `this.` to access them.

*Module Pattern Example Code:*
```
/* A fake chat app - written in Module Pattern (namespaced): */

// The module pattern is one step ahead of object literal/namespacing pattern:
// It provides privacy!
var myChatApp = (function () {

	/* (A) We can define private variables here: */

	var me = 'You = ',
		computer = 'PC = ',
		chatHistory = [], // stores a list of all the msgs outputted
		replyYes = 'Yes',
		replyNo = 'No',
		randomMessages = [
			'Howdy, partner?',
			'Good day!',
			'That\'s all, folks!'
		];

	// We do not want `echo` to be public: Not everyone should be able to echo something.
	function echo (msg) {
		chatHistory.push('<div>' + msg + '</div>'); // add the message to queue
		var len = chatHistory.length,
			start = Math.max(len - 6, 0),
			outputHTML = '';
		for(var i = start;i < len; i++) {
			outputHTML += chatHistory[i];
		}
		$('.chatBox').html(outputHTML);
	}

	/* (B) We can return public methods/props from the IIFE: */
	
	return {
		speak: function (msg) {
			echo(me + msg); // your msg
		},
		replyYesOrNo: function () {
			var msg = Math.random() > .5 ? replyYes : replyNo;
			echo(computer + msg) // computer reply
		},
		replyRandomly: function () {
			var msg = randomMessages[ Math.floor(Math.random() * randomMessages.length) ];
			echo(computer + msg); // random computer reply
		}
		// Only if a public method accesses another public method then use `this.` prefix
	}
})();

$(document).ready(function() {
	myChatApp.speak('Hi');
	myChatApp.replyRandomly('Hi');
	myChatApp.speak('Are you mad?');
	myChatApp.replyYesOrNo();
});

/*
An Example of privacy:
myChatApp.echo; // Gives an error: echo() is not publicly accessible
*/
```

**Note: Module Pattern v/s Singleton Pattern:**
1. Both the patterns are very similar an in fact, singleton is enhanced version of the module pattern.
2. Singleton pattern will be covered a little later in this course.
3. Or you may check it out **[here](https://github.com/pushkar100/javascript-notes/blob/master/design-patterns-freeCodeCamp/design-patterns.md)**.
4. The main use of singletone is that We will *maintain only one instance of the object* even if users try to instantiate it multiple times. It also provides privacy and namespacing (because it is built on top of module pattern).

### Pattern 3: The Module Reveal Pattern

While the Module design pattern is very powerful, it has a few limitations and they are related mainly to the fact that we have to treat public and private members differently. Moreover, this split has made it hard for us to call and use the public members from the private areas of our code. The Module Reveal Pattern comes to our rescue to solve this issue.

Module Reveal Pattern is an **upgraded** version of the Module Pattern.

*Problem with the module pattern:*
1. We treat private and public members differently (separation).
2. Ensure private members can't interact with public ones (**Important:** *public could access private but not vice-versa*)
3. Added complexity to our core structure 

*Goals of the module reveal pattern:*
1. *Improve* the complexity of the core structure. (More simplistic and easy to work it pattern).
2. Solve the separation problems between private and public properties/methods.

**Note:** 
1. The module reveal pattern creates its own set of problems: It is hard to rewrite the public methods since they correspond to private methods which we don't have access to.
2. However, it is a *much cleaner process* compared to module pattern. Easier to maintain code.

*Implementation of the module reveal pattern:*
1. Instead of having private stuff inside the IIFE and public stuff in the returned object, we will **have all the methods/props within the IIFE itself**.
2. We can use a *convention* to distinguish between private and public methods: *Private* variables will have *underscore(_) as a prefix*.
3. In the returning object, we will have one corresponding method for each of the methods we want to be made public.
4. In this way, private methods can call/access public methods (& vice-versa) (Ex: `echo` method can call `replyYesOrNo`).

*Module Reveal Pattern Example Code:*
```
/* A fake chat app - written in Module Reveal Pattern (namespaced): */

// Similar to module pattern except that the private can access the public.
// Returned object has references to methods that WE WANT to make public.
var myChatApp = (function () {

	/* (A) Define all our properties/methods here */
	/* Use convention: prefix underscore(_) to private methods/props */

	var _me = 'You = ',
		_computer = 'PC = ',
		_chatHistory = [], // stores a list of all the msgs outputted
		_replyYes = 'Yes',
		_replyNo = 'No',
		_randomMessages = [
			'Howdy, partner?',
			'Good day!',
			'That\'s all, folks!'
		];

	function _echo (msg) {
		_chatHistory.push('<div>' + msg + '</div>');
		var len = _chatHistory.length,
			start = Math.max(len - 6, 0),
			outputHTML = '';
		for(var i = start;i < len; i++) {
			outputHTML += _chatHistory[i];
		}
		$('.chatBox').html(outputHTML);
	}

	function speak (msg) {
		_echo(_me + msg); // your msg
	}

	function replyYesOrNo () {
		var msg = Math.random() > .5 ? _replyYes : _replyNo;
		_echo(_computer + msg) // computer reply
	}

	function replyRandomly () {
		var msg = _randomMessages[ Math.floor(Math.random() * _randomMessages.length) ];
		_echo(_computer + msg); // random computer reply
	}

	/* (B) Return object containing only those methods/props to be made public (to be "revealed"): */
	
	return { // we are "revealing" the methods we want to reveal
		speak: speak,
		replyYesOrNo: replyYesOrNo,
		replyRandomly: replyRandomly
	}
})();

$(document).ready(function() {
	myChatApp.speak('Hi');
	myChatApp.replyRandomly('Hi');
	myChatApp.speak('Are you mad?');
	myChatApp.replyYesOrNo();
});

/*
An Example of privacy:
myChatApp.echo; // Gives an error: echo() is not publicly accessible
*/
```

In the above example, `_echo` is a private method but it can make a call to a public method like `speak`. This feature was missing from the regular module pattern.

### Controlling the Global access completely:

In all our examples so far, namespacing has to at least one identifier polluting the global scope (i.e the name of the object itself).

1. We can wrap the whole module in an IIFE, thereby removing the module name also from the global scope. That is, *use the Module concept to make everything private.* Ex:
```
(function () {
	var myChatApp = function () {
		...
		return {
		...
		}
	}	

	$(document).ready(function () {
		myChatApp.method();
		...
	});
})();
// The global scope only has the IIFE and no access to the module (which is internal to IIFE).
// Everything still gets executed (since the IIFE runs automatically).
```

**Note:** We can have multiple modules inside the IIFE (need not be just one).

2. *Send things from the global scope to our Mega Module.* We can even limit the globally scoped elements that the module is using (Ex: `window`, `document` and `jQuery`). What we can do is *pass as parameters to the IIFE, the global objects we want to use inside our module.* Ex:
```
(function (win, doc, $) {
	var myChatApp = function () {
		...
		return {
		...
		}
	}	

	$(doc).ready(function () {
		myChatApp.method();
		...
	});
})(window, document, jQuery); // Send only required global params to the module wrapper IIFE.
```

3. *Conditionally add elements to the global scope.* We can create a sort of **API** to allow certain modules into the global scope. We can add a prior naming conflict check before exposing our module(s). Ex:
```
(function (win, doc, $) {
	var myChatApp = function () {
		...
		return {
		...
		}
	}	

	$(doc).ready(function () {
		myChatApp.method();
		...
	});

	// Expose certain modules to global scope (API):
	if(!win.myChatApp) {
		win.myChatApp = myChatApp;
	} else {
		console.error('Conflict: Something else uses myChatApp identifier');
	}
})(window, document, jQuery);

// Globally accessible module:
window.myChatApp.speak();
```

*A Complete Example:*
```
/* A fake chat app - written in Controlly the Global Scope completely: */

(function (win, doc, $) {
	var myChatApp = (function () {
		var _me = 'You = ',
			_computer = 'PC = ',
			_chatHistory = [], // stores a list of all the msgs outputted
			_replyYes = 'Yes',
			_replyNo = 'No',
			_randomMessages = [
				'Howdy, partner?',
				'Good day!',
				'That\'s all, folks!'
			];
		function _echo (msg) {
			_chatHistory.push('<div>' + msg + '</div>');
			var len = _chatHistory.length,
				start = Math.max(len - 6, 0),
				outputHTML = '';
			for(var i = start;i < len; i++) {
				outputHTML += _chatHistory[i];
			}
			$('.chatBox').html(outputHTML);
		}
		function speak (msg) {
			_echo(_me + msg); // your msg
		}
		function replyYesOrNo () {
			var msg = Math.random() > .5 ? _replyYes : _replyNo;
			_echo(_computer + msg) // computer reply
		}
		function replyRandomly () {
			var msg = _randomMessages[ Math.floor(Math.random() * _randomMessages.length) ];
			_echo(_computer + msg); // random computer reply
		}

		return {
			speak: speak,
			replyYesOrNo: replyYesOrNo,
			replyRandomly: replyRandomly
		}
	})();

	$(doc).ready(function() {
		myChatApp.speak('Hi');
		myChatApp.replyRandomly('Hi');
		myChatApp.speak('Are you mad?');
		myChatApp.replyYesOrNo();
	});

	// Expose certain modules to global scope (API):
	if(!win.myChatApp) {
		win.myChatApp = myChatApp;
	} else {
		console.error('Conflict: Something else uses myChatApp identifier');
	}
})(window, document, jQuery);

console.log(window.myChatApp); // Output: {speak: ƒn, replyYesOrNo: ƒn, replyRandomly: ƒn}
```

## Section 2: Creational Design Patterns

Creational Design Patterns deal with the different ways in which objects are created (based on requirements). **Focus is on the creation of classes**.

### Pattern 4: The Singleton Pattern

*The **Singleton** pattern is used when:*
1. We want to delay the instantiation of an object (i.e You might want to initialize it at your convenience).
2. When we want a constant interface to gain access to the object.
3. **Important:** Only one instance of the object is needed/created (even with multiple inits).

*Let's take a look at a sample piece of code (spaghetti code wrapped in an IIFE):*
```
/* index.html: */
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Design Patterns - 20 must know</title>
	<style>
		.container {
			width: 100%;
			height: 680px;
			border: 1px solid #dfe1e8;
			margin: 3px auto;
			position: relative;
		}
		.circle {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			background-color: #c00;
			position: absolute;
		}
	</style>
</head>
<body>
	<div class="container"></div>

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js"></script>
	<script src="practice.js"></script>
</body>
</html>

/* practice.js: */
/* Circles are added to the container for every page click: */
(function(win, $){
	$(win.document).ready(function(){
		$('.container').click(function(e){
			var circle = $('<div class="circle"></div>');
				circle.css('left',e.pageX-25);
				circle.css('top',e.pageY-25)
			$('.container').append(circle);
		});

	});
})(window, jQuery);
```

*Basic outline of a singleton pattern:*
1. We have an *IIFE* assigned to a variable.
2. This IIFE *returns an object* that contains a *method*. This method, when run, will create a new instance of the object we desire if it doesn't exist. If it exists, it will pass us a reference to it. (Single instance, delayed instantiation)
3. The IIFE also contains a *private variable to hold the instance object* we intend to use.
4. Another function exists, that is usually written in *Module/Revealing Module* pattern which returns the object (and the one that will eventually be assigned to the instance private variable).

*Syntax Outline:*
```
var creatorName = (function () {
	var instance;

	// A function written usually in module/revealing module pattern:
	function init() {
		// Private vars/mthds
		return {
			// public/revealing vars/mthds
		}
	}

	return {
		getInstance: function () {
			if(!instance) { // checks if instance exists
				instance = init(); // creates new instance only if it doesn't already exist
			}
			return instance;
		}
	}
})();

var singletonObj = creatorName.getInstance(); // Delayed instantiation: We can start obj when we want to
singletonObj.somePublicMethod();
singletonObj.somePublicProp();
```

*Rewritten Circle App Code with Singleton Pattern:*
```
/* Circles app - Rewriting using Singleton Pattern: */

// We can wrap our singleton module too in an IIFE.
// Again, controlling global scope completely
(function(win, doc, $) {
	var circleGenerator = (function() {
		var instance;

		// The function that returns the intance object.
		// Optional: Using revealing module pattern here:
		function init() {
			// Convention: private methods/props have underscore (_) prefix.
			var _allCircles = [],
				_container = $('.container');

			function _position(circle, left, top){
				circle.css('left',left);
				circle.css('top',top);
			}

			function createCircle(left, top){ // Creates circle but does not append it
				var circle = $('<div class="circle"></div>');
				_position(circle,left, top);
				return circle;
			}

			function addCircle(circle){ // Appends the create circle
				_container.append(circle);
				_allCircles.push(circle);
			}

			function index(){
				return _allCircles.length;
			}

			return {
				createCircle: createCircle,
				addCircle: addCircle,
				index: index
			}
		}

		return {
			getInstance: function() {
				if(!instance) { // checks if instance exists
					instance = init(); // creates new instance only if it doesn't already exist
				}
				return instance;
			}
		}
	})();

	// Singleton Usage Example:
	$(doc).ready(function() {
		$('.container').on('click', function(e) {
			var cg = circleGenerator.getInstance(), // even if called many times, instantiated only once
				circle = cg.createCircle(e.pageX - 25, e.pageY - 25);
			cg.addCircle(circle);
		});
		$(doc).on('keypress', function(e) { // Add a circle at a random point
			if(e.key === 'a') {
				var cg = circleGenerator.getInstance(), // even if called many times, instantiated once
					circle = cg.createCircle(Math.floor(Math.random() * 1200), Math.floor(Math.random() * 680));
				cg.addCircle(circle);
			}
		});
	});
})(window, document, jQuery);
```

### Pattern 5: The Factory Pattern

A **Factory** design pattern enables us to *separate the steps involved in what we need to customize and interchange* from the *core logic* of our application.

We will use factories only when there is a high likelihood that the *creation process will change throughout the life of an application*. That is, we might **add or delete methods of the object**, etc over time. (In JavaScript, there aren't any abstract factories, but only factories. Will learn later)

*In factory pattern, we:*
1. Check when more control is needed to customize an item
2. Check out how Factory removes the need for the implementing object
3. **Important:** Make it easy to update and add more versions or updates of the object.

In our example of creating circles, what if we wanted to have a different color for circles generated by key press (say, blue)? This means that we have to modify our object so that we can create blue color circles as well. If there are more colors, we must be able to easily add them also.

*Implementation:*
1. Keeping the singleton pattern, we will create a factory to churn out circles as well.
2. The factory is *constructor* function that will create blue/red circles (*only the HTML for it*). We will use the **new** keyword for instantiation objects.
3. This factory objects can be used within our singleton module itself.

*Code Example:*
```
/* Circles app - Rewriting using Singleton Pattern: */
/* Using factory pattern to create different types of circles: */

// Start with IIFE: Again, to control the global scope completely
(function(win, doc, $) {
	/* A simple factory: (Not very refined) */
	/* Not written in module fashion(no pub/pvt methods, etc) - very basic constructors */
	var RedCircle = function() {
			this.item = $('<div class="circle"></div>');
		},
		BlueCircle = function() {
			this.item = $('<div class="circle blue"></div>');
		},
		CircleFactory = function() {
			// This is the main constructor with a method which create
			this.create = function(color) {
				if(color === 'blue') {
					return new BlueCircle();
				} else {
					return new RedCircle();
				}
			};	
		};
	/* End factory */

	var circleGenerator = (function() {
		var instance;

		// The function that returns the intance object.
		// Optional: Using revealing module pattern here:
		function init() {
			// Convention: private methods/props have underscore (_) prefix.
			var _allCircles = [],
				_container = $('.container'),
				_circleFactory = new CircleFactory(); // Using the factory object in our singleton

			function _position(circle, left, top){
				circle.css('left',left);
				circle.css('top',top);
			}

			function createCircle(left, top, color){ // Creates circle but does not append it
				// Using factory object's method to create circle:
				var circle = _circleFactory.create(color).item;
				_position(circle, left, top);
				return circle;
			}

			function addCircle(circle){ // Appends the create circle
				_container.append(circle);
				_allCircles.push(circle);
			}

			function index(){
				return _allCircles.length;
			}

			return {
				createCircle: createCircle,
				addCircle: addCircle,
				index: index
			}
		}

		return {
			getInstance: function() {
				if(!instance) { // checks if instance exists
					instance = init(); // creates new instance only if it doesn't already exist
				}
				return instance;
			}
		}
	})();

	// Singleton Usage Example:
	$(doc).ready(function() {
		$('.container').on('click', function(e) { // adds a red circle (default color)
			var cg = circleGenerator.getInstance(), // even if called many times, instantiated only once
				circle = cg.createCircle(e.pageX - 25, e.pageY - 25, 'red');
			cg.addCircle(circle);
		});
		$(doc).on('keypress', function(e) { // Add a "blue" circle at a random point
			if(e.key === 'a') {
				var cg = circleGenerator.getInstance(), // even if called many times, instantiated once
					circle = cg.createCircle(Math.floor(Math.random() * 1200), 
											 Math.floor(Math.random() * 680),
											 'blue');
				cg.addCircle(circle);
			}
		});
	});
})(window, document, jQuery);


/* 
CSS for '.blue':
.circle.blue {
	background-color: #00c;
}
*/
```

In the above example, using a factory makes it easy to modify the circle HTML creation. For example, if we wanted a new "green" color circle, we can add another constructor for it in the factory, and send "green" parameter in the function call.

### Pattern 6: The Abstract Factory Pattern

We use the **Abstract Factory** pattern when we want our factory to be more **dynamic**. This means that we create it with the *idea of adding/modifying functionality in the future being a prime concern*.

It is accepted to use this pattern when it is logically expected to enable developers to extend functionality.

It is a more *complex version of the factory pattern* and we should *not always use it*. In most cases, we write a factory pattern and then realise that we are going to keep extending the functionality much further so we modify it to an abstract factory to make extension more "dynamic" (as you will see below in the example(s)). 

In general, if we are in doubt as to whether we must use factory/abstract factory, it it better to use factory and, if needed later, refactor it to abstract (better not to start off with abstract).

**Main difference between Factory and Abstract Factory (Definiton):**

An Abstract Factory, similar to a Factory, creates objects or instances of things that are not in it. The difference is that an abstract Factory *doesn't refer directly* to what kind of a Factory it is; instead, it refers to the *implementation of an interface*. This comes in handy when the actual objects that will be registered are **vast**.

*Implementation:*
1. Use the prototype concept to create classes.
2. Add the class methods to its prototype (and not to `this` object).
3. The prototype will be used to check if a factory (class) to create a certain type of object exists.
4. If it exists, then we will "register" the factory and use it to churn out those type of objects
5. **It makes the whole factory very scalable! It can handle a vast number of different/new types of objects that need to be created**

*Circle App Example Code (Abstract Factory Pattern):*
```
/* Circles app (Singleton Pattern): */

/* We are using the "Abstract Factory Pattern" to create any type of circle: */
(function(win, doc, $) {
	/* An Abstract Factory:  */
	// (A) We do not have an interface, so we use contructors(class) and its "prototype methods"!
	// The constructors define a type of factory and the prototype will define its methods.
	function RedCircle() {}
	RedCircle.prototype.create = function() {
		this.item = $('<div class="circle"></div>');
		return this; // return object so that we can chain methods (Ex: obj.mthd1().mthd2())
	};
	function BlueCircle() {}
	BlueCircle.prototype.create = function() {
		this.item = $('<div class="circle blue"></div>');
		return this; // return object so that we can chain methods (Ex: obj.mthd1().mthd2())
	};

	// (B) The main constructor will use the prototypes of each constructor (class)
	// to check if it exists (valid class). If valid: Register the constructor (class)
	// If invalid: error.
	// The main constructor "registers" a type of circle as long as the class(constructor)
	// and its methods exist!
	function CircleFactory() {
		this.types = {}; // Store all the registered types.
		this.register = function(type, cls) { // cls stands for "class"
			if(cls.prototype.create){ // if methods exist, then valid constructor, add it!
				this.types[type] = cls;
			}
		};
		this.create = function(type){
			return new this.types[type]().create();
		};
	}
	/* End Abstract Factory */

	var circleGenerator = (function() {
		var instance;

		// The function that returns the intance object.
		// Optional: Using revealing module pattern here:
		function init() {
			// Convention: private methods/props have underscore (_) prefix.
			var _allCircles = [],
				_container = $('.container'),
				_circleFactory = new CircleFactory(); // Using the factory object in our singleton

				// (C) We have to register our constructors before creating objects (circles) using them.
				_circleFactory.register('red', RedCircle);
				_circleFactory.register('blue', BlueCircle);

			function _position(circle, left, top){
				circle.css('left',left);
				circle.css('top',top);
			}

			function createCircle(left, top, type){ // Creates circle but does not append it
				// Using factory object's method to create circle:
				var circle = _circleFactory.create(type).item;
				_position(circle, left, top);
				return circle;
			}

			function addCircle(circle){ // Appends the create circle
				_container.append(circle);
				_allCircles.push(circle);
			}

			function index(){
				return _allCircles.length;
			}

			return {
				createCircle: createCircle,
				addCircle: addCircle,
				index: index
			}
		}

		return {
			getInstance: function() {
				if(!instance) { // checks if instance exists
					instance = init(); // creates new instance only if it doesn't already exist
				}
				return instance;
			}
		}
	})();

	// Singleton Usage Example:
	$(doc).ready(function() {
		$('.container').on('click', function(e) { // adds a red circle (default color)
			var cg = circleGenerator.getInstance(), // even if called many times, instantiated only once
				circle = cg.createCircle(e.pageX - 25, e.pageY - 25, 'red');
			cg.addCircle(circle);
		});
		$(doc).on('keypress', function(e) { // Add a "blue" circle at a random point
			if(e.key === 'a') {
				var cg = circleGenerator.getInstance(), // even if called many times, instantiated once
					circle = cg.createCircle(Math.floor(Math.random() * 1200), 
											 Math.floor(Math.random() * 680),
											 'blue');
				cg.addCircle(circle);
			}
		});
	});
})(window, document, jQuery);

................

/*
To add another type of circle, just :
1. Create a class for it (constructor) and 
2. Add prototype method/s.
3. Register it before f
irst use. 

Ex:
function GreenCircle() {}
GreenCircle.prototype.create = function() {
	this.item = $('<div class="circle green"></div>');
	return this; // return object so that we can chain methods (Ex: obj.mthd1().mthd2())
};

// Registering it:
_circleFactory = new CircleFactory();
_circleFactory.register('green', GreenCircle);


// ...Easily Scalable!...

*/
```

In the above example, we used `prototype` because:
1. This is the only way to know if a type (that refers to a constructor) has a valid (required) method (like create()). If so, we can register it. **Note:** We cannot do a check for `BlueCircle.create` (error!) since `BlueCircle` is a class/constructor and not an object. Hence, we need the prototype.
2. Makes it easier to create new classes and methods, whenever we wish to extend functionality to more types of object (i.e more types of circles).

### Pattern 7: The Builder Pattern

**Complicated Explanation - Learn from other resources!**

### Pattern 8: The Prototype Pattern

**Complicated Explanation - Learn from other resources!**




