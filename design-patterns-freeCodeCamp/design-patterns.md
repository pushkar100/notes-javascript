# Design Patterns by FreeCodeCamp

Youtube Playlist: Beau teaches JavaScript.
Source: https://www.youtube.com/playlist?list=PLWKjhJtqVAbnZtkAI3BqcYxKnfWn_C704

## 1. Singleton Design Pattern:

The **singleton** pattern limits the number of instances of a particular object to just **one single instance**. It is useful when you need *exactly one object* to *coordinate* across the system.

*Examples:*
1. Config settings for a web app (singleton pattern for config object).
2. On the client side for anything initiated with an API key.
3. A database connection pool. The pool manages the creation, destruction, and lifetime of all database connections for the entire application ensuring that no connections are 'lost'.

Singletons also serve as a *shared, isolated namespace* which isolate the implementation code from the global namespace. It provides a single point of access to all the object's functions and properties. The catch is, however, singletons involve a *global instance* (the singleton object itself) which pollutes the global namespace (even though its internal functions and properties do not pollute it).

**(Advantage)** Primary use of singletons: **Namespacing** our code.
**(Drawback)**: Creates a *Global instance*, hence not liked by many developers.

Most popular singleton library: **jQuery**.

*Sources for learning more about singleton pattern:*
1. https://www.youtube.com/watch?v=bgU7FeiWKzc&list=PLWKjhJtqVAbnZtkAI3BqcYxKnfWn_C704&index=1
2. https://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript
3. http://www.dofactory.com/javascript/singleton-design-pattern

*How it works / Implementation:*
1. The Singleton object is implemented as an immediate anonymous function (**IIFE**)
2. The IIFE contains a function that contains everything that the instance needs (*public/private propeties*). Let's call the function `init()` and it returns the instance object.
3. The IIFE itself returns an object with a method for getting the instance created by `init()`. Let's call this method `getInstance()`.
4. The `getInstance` method demonstates another design pattern called **Lazy Load**. Lazy Load checks if an instance has already been created; if not, it creates one and stores it for future reference. All subsequent calls will receive the stored instance.

**Note:** Singleton is a manifestation of a common JavaScript pattern: the **Module pattern**. Module is the basis to all popular JavaScript libraries and frameworks (jQuery, Backbone, Ember, etc.).

*Code Example:*
```
/*
Singleton Design Pattern Example/Demo
*/

/* mySingleton is an IIFE that will return an object.
The returned object contains the code to initialize the singleton obbject.
No matter how many times we initialize the object, we will only one instance (see below)!
*/
var mySingleton = (function () {
	var instance; // 1. The object that will contain reference to the singleton

	// 2. A function to initialize the singleton:
	// Also, to separate what is only defined(private) and 
	// what is defined plus returned(public)
	function init() {
		// 3. Private props & methods of the singleton: 
		// (Not returned, hence accessible from outside)
		function privateFunction () {
			console.log("Private method");
		}
		var privateVariable = "Private property";
		var privateRandomNumber = Math.random();

		// 4. Returning an object which contains the public methods and props:
		return {
			publicMethod: function () {
				return "Public method";
			},
			publicProperty: "Public property",
			getRandomNumber: function () {
				return privateRandomNumber; // Public function has access to private (Because of CLOSURE!)
			}
		}
	}

	// 5. Finally return an object to get an instance of the singleton:
	// Multiple calls will still return only one instance (whichever was created first).
	return {
		getInstance: function () {
			if(!instance) { // Do not create instance if one already exists.
				instance = init();
			}
			return instance;
		}
	}
})();

/* NOTE: The init() function contains everything that the singleton is going to do (body).
Everything else helps in setting up and maintaining only one instance. */


/* Example: */
var singleA = mySingleton.getInstance(); 
var singleB = mySingleton.getInstance(); // Trying to create new instance; 
// singleB will refer to same as singleA (since an instance was already created)

console.log( singleA.publicMethod() ); // 'Public method'
console.log( singleA.publicProperty ); // 'Public property'
console.log( singleA.getRandomNumber() === singleB.getRandomNumber() ); // true
// singleA and singleB can refer to only one instance. Hence, they execute the same function giving the same output.
```

## 2. Observer Design Pattern:

In the **observer** pattern, if an object is *modified* then it *broadcasts to dependent objects* that a *change* has occurred.

*Examples:*
1. The Model-View-Controller (**MVC**) architecture where changes in view modify the model also.
2. **Event listeners**. Once an event is triggered, the listeners are notified (Ex: `addEventListener` in JS).

*Sources to learn more about the observer pattern:*
1. http://robdodson.me/javascript-design-patterns-observer/
2. https://scotch.io/bar-talk/4-javascript-design-patterns-you-should-know

*Popular Examples of Observer pattern:* If you've ever written an event listener with `addEventListener` or used one of jQuery's many versions: `on`, `delegate`, `live`, `click`, etc.

**(Advantage)**: Very loose coupling between objects.
**(Advantage)**: The ability to broadcast changes and updates.
**(Drawback)**: Potentially unexpected updates and sequencing issues.
**(Drawback)**: A significant drop in performance as the number of observers increased (notorious listeners are *watchers*).

*When do we use observer pattern?:*
1. When the state or actions of one object depends on the state or actions of another object.
2. (Similar to 1) When changing one object necessitates a change to an unknown number of other objects.
3. When an object should be able to *notify* other objects of changes *without knowing anything about these other objects.*

*How it works / Implementation:*
1. In a nutshell the **Observer** pattern allows a **Subject** to publish updates to a group of Observers.
2. The Subject maintains a list of Observers and provides an interface for objects to register as Observers. 
3. Otherwise the Subject doesn't care who or what is listening to it. In this way the Subject is **decoupled** from the Observers allowing easy replacement of one Observer for another or even one Subject for another so long as it maintains the same lexicon of events/notifications.
4. When the Subject's state changes it sends out notifications, unaware of who its Observers are. 
5. The Observers, in turn, perform some action in response to this update.

**Note:** The Observer pattern is also known or is part of the **Publisher Subscriber Pattern (PubSub)**. Publisher refers to *Subject/Event dispatcher* and Subscribers refer to the *Observers/listeners*. (Observer pattern is also known as **dependents pattern**)

*Explaining the Observer pattern code structure:*
1. The publisher object (the subject) needs to have a property subscribers that is an **array** storing all subscribers.
2. The act of subscription is merely adding to this array. 
3. When an event occurs, the publisher loops through the list of subscribers and **notifies** them. The notification means *calling a method of the subscriber object*.
4. Therefore, when subscribing, the subscriber provides one of its methods to the publisher’s `subscribe()` method.
5. The publisher can also provide `unsubscribe()`, which means removing from the array of subscribers.
6. The last important method of the publisher is `publish()`, which will call the subscribers’ methods.

*Code Example:*
```
// Step 1: Creating the publisher/subject:
var Subject = function () {
	// Array that holds all the observers.
	var observers = []; // A private property

	// The public contents (contains methods to sub/unsub/notify/etc):
	return {
		// 1. Allow observers(subscribers) to subsribe to subject(publisher):
		subscribeObserver: function (observer) {
			observers.push(observer);
		},
		// 2. Remove observers(subscribers) from subject(publisher):
		unsubscribeObserver: function (observer) {
			var index = observers.indexOf(observer); // Get index of observer from observers array
			if(index > -1) {
				observers.splice(index, 1); // remove observer from its position in array
			}
		},
		// 3. Notify one observer from the array of all observers:
		notifyObserver: function (observer) {
			var index = observers.indexOf(observer); // Get index of observer from observers array
			if(index > -1) {
				observers[index].notify(); // Call that observer's notify method
			}
		},
		// 4. Notify all observers together:
		notifyAllObservers: function () {
			for(var i = 0;i < observers.length; i++) {
				observers[i].notify();
			}
		}
	}
}

// Step 2: Creating the observer(s):
var Observer = function (number) {
	return {
		notify: function() {
			console.log("Observer " + number + " is notified!");
			// Technically, we will have something meaningful to do here.
		}
	}
}

// Instantiating:
var subject = new Subject();

var observer1 = new Observer(1); // Observer is like a constructor function
var observer2 = new Observer(2); // `new` will create a new object of Observer class.
var observer3 = new Observer(3);
var observer4 = new Observer(4);

subject.subscribeObserver(observer1);
subject.subscribeObserver(observer2);
subject.subscribeObserver(observer3);
subject.subscribeObserver(observer4);

subject.notifyObserver(observer2); // Observer 2 is notified!
subject.unsubscribeObserver(observer2);

subject.notifyAllObservers(); 
// Observer 1 is notified!
// Observer 3 is notified!
// Observer 4 is notified!
```

## 3. Module Design Pattern:

The **module** pattern is one of the most used design patterns. It's a way to keep pieces of code independent of each other and provide *encapsulation* which can protect methods and properties from being accessed by other modules (files). Each module can be a javascript file in the project.

*Popular Examples of Module pattern:* This pattern can be seen in **NodeJS/RequireJS/CommonJS** modules.

*Sources to learn more about the observer pattern:*
1. http://2ality.com/2014/09/es6-modules-final.html
2. https://joshbedo.github.io/JS-Design-Patterns/

*Before ES6:* Before ES6, we used to declare modules with an IIFE function in a file that returns an object. *Returned object* will have *public* items while what's not returned will contain *private* items. Example:
```
/* Module pattern before ES6 */
(function() {

    // declare private variables and/or functions

    return {
      // declare public variables and/or functions
    }

})();
```

*ES6 Module pattern:* We can use **ES6 classes** within modules. It becomes easy to `export` and `import` data from these modules to one another. 

Example:
```
// After ES6

/* lib/module.js */
class ShoppingDataType {
  constructor() {
    // private properties.
    this.shoppingList = ['coffee', 'chicken', 'pizza']
  }
  // public methods
  getShoppingList() {
    return this.shoppingList.join(", ")
  }
  addItem(item) {
   this.shoppingList.push(item)
  }
}
export default ShoppingDataType;

/* main.js */
import ShoppingDataType from 'libs/module';
var shopping = new ShoppingDataType;
console.log(shopping.getShoppingList());
```

## 4. Mediator Design Pattern:

The *mediator* pattern provides one *central authority* to preside over object interaction. All the objects communicate with the mediator which in turn passes the messages to the concerned objects. The objects themselves *do not directly interact with each other* (i.e w/o the mediator).

*Real-life analogy of mediator:*
An example of Mediator is that of a control tower on an airport coordinating arrivals and departures of airplanes. A plane requests the ATC to land, the ATC conveys a message to other waiting planes, asking them to wait. Once the plane lands, the ATC allows another plane to land. (All planes communicate with the ATC and never with each other).

*Popular Examples of Module pattern:*
1. We can build a **chat application** where the chatroom is the mediator and the members are the participants.

*Sources to learn more about the mediator pattern:*
1. http://www.dofactory.com/javascript/mediator-design-pattern

*How it works/Implementation:*
1. There is always *one mediator* and *multiple colleagues/participants* who talk to the mediator.
2. Mediator acts as an *Interface* for communication.
3. Mediator maintains references to colleague objects.
4. It also manages central control over operations.
5. Each colleague instance maintains a reference to the Mediator.

*Chatroom Code Example:*
```
/* Simple Chat application using MEDIATOR Pattern */

/* Class to create participant objects: */
var Participant = function (name) {
	this.name = name;
	this.chatroom = null; // initially not assigned
};

// Pariticipant can have two functions:
// 1. Send message
// 2. Receive
Participant.prototype = {
	send: function (msg, to) {
		// Whatever the participant does has to be done via mediator:
		this.chatroom.send(msg, this, to); // this refers to own participant
	},
	receive: function (msg, from) {
		// the chatroom will call this method of the participant is msg received
		console.log('From: ' + from.name + ' | To: ' + this.name + ' | Message: ' + msg);
	}
};

// A class to create a chatroom object:
var Chatroom = function () {
	// Maintain a private object of all participants:
	var participants = {};

	// All the fns to add participants, send msg, receive, etc:
	return {
		register: function (participant) {
			participants[participant.name] = participant;
			participant.chatroom = this; // assign this chatroom to the participant
		},
		send: function (msg, from, to) {
			if(to) { // unicast (single msg)
				to.receive(msg, from);
			} else { // broadcast
				for(key in participants) {
					if(participants[key] !== from) { // send to all participants except itself
						participants[key].receive(msg, from);
					}
				}
			}
		}
	}
};

var rahul = new Participant('rahul');
var joel = new Participant('joel');
var ganga = new Participant('ganga');

var chatroom = new Chatroom();
chatroom.register(rahul);
chatroom.register(joel);
chatroom.register(ganga);

rahul.send('Hey guys'); // Only msg; Hence, broadcast!
rahul.send('Hi, Joel', joel); // single msg
joel.send('How are you, Rahul?', rahul); // single msg
ganga.send('Hi, Joel!', joel); // single msg

/*
Console Output:
From: rahul | To: joel | Message: Hey guys
From: rahul | To: ganga | Message: Hey guys
From: rahul | To: joel | Message: Hi, Joel
From: joel | To: rahul | Message: How are you, Rahul?
From: ganga | To: joel | Message: Hi, Joel!
*/
```



