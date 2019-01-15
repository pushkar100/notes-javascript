# Practical Design Patterns in JavaScript

Pluralsight Course (Instructor: [Jonathan Mills](http://jonathanfmills.com/))

## Introduction

Design Patterns are about solving problems. Every type of problem has a certain type of solution or solutions (pattern).

What constitutes a pattern?

1. It solves a problem
2. It is a proven concept (tried and tested in many application, large & small, simple & complex)
3. The solution is not obvious (For example: to run something multiple time you will use a loop (obvious). Therefore looping is not a pattern, it's just a language construct)
4. It describes a relationship (90% of the time) between entities like objects and functions.
5. It has significant human component (Humans thinking is required to construct a pattern & for further decisions).

Why use design patterns?

1. Code reusability.
2. Common vocabulary to communicate between developers.

## Types of Patterns

1. Creational: Deal with different ways to create object instances.
    1. Constructor
    2. Module
    3. Factory
    4. Singleton

2. Structural
    1. Decorator
    2. Facade
    3. Flyweight

3. Behavioral
    1. Command
    2. Mediator
    3. Observer

## Objects in JavaScript

3 ways to create an object in javascript
1. `var obj = {};` : object literal using curly braces.
2. `var obj = Object.create(Object.prototype);` : Useful way to create object that inherits something.
3. `var obj = new Object();` : Considered slow and hence, bad practice (useful in few cases).

For most cases: `obj = {}` is equivalent to `obj = Object.create(Object.prototype)` which is in turn equivalent to `obj = new Object`.

Ways to assign keys and values to objects (properties):
1. Using dot-notation (properties cannot have dashes & spaces, etc).
    - `var obj = {};`
    - `obj.param = 'someVal';`
2. Using the square-bracket notation (Pass in a string for property name, so it can have spaces & dashes).
    - `var obj = {};`
    - `obj['param'] = 'someVal';`
    - `obj['another-value'] = 1;`
    - We can also use variable values as property names: 
        - `var foo = 'bar'; obj[foo] = 100; obj['bar']; // 100`
3. We can put the properties inside the object literal itself.
    - `var obj = { foo: 'bar', a: 5, baz: function() {} };`
4. Using `Object.defineProperty(objName, propName, { propOptions })`: Gives us a lot more power to define the properties by handling the specifics.
```javascript=
var obj = {};
Object.defineProperty(obj, 'foo', { 
    value: 'some value', // specifies property values
    writable: true, // whether its value will be a constant or can be changed later.
    enumerable: true, // whether it will be shown in for..in loops or Object.keys(obj) method
    configurable: true // whether this property can be redefined using defineProperty() later or not
});
```

The first 3 ways to set parameters can also be used to get them (like if used in an expression without assigning it to something, it gives us its current value) (setters & getters).

## Inheritance

We can mimic inheritance by using `Object.create(Object.prototype)`. Note that `Object.prototype` refers to the prototype object of the `Object` constructor (highest in the hierarchy). So, we need not pass the prototype object of just the `Object` constructor but pass in *any object*. That object will be added to the proto-chain of the object that inherits it.

```javascript=
var obj = {
    foo: 'bar'
};
console.log(obj.foo); // bar
console.log(obj.__proto__); // logs Object constructor's prototype object
Object.defineProperty(obj, 'baz', {
   value: 'fun',
   writable: false, // value cannot be changed
   enumerable: true,
   configurable: true 
});
console.log(obj.baz); // fun

var newObj = Object.create(obj);
newObj.newProp = 'blah';
console.log(newObj.foo); // bar
console.log(newObj.newProp); // blah 
console.log(newObj.__proto__); // logs the 'obj' object (inherited from it)
console.log(newObj.__proto__.__proto__); // logs Object constructor's prototype object

// Even though 'baz' prop value was not writable, we can redefine properties with defineProperty() since it was configurable:
// Only if configurable was set to false, would we get an error below, trying to redefine 'baz':
Object.defineProperty(obj, 'baz', {
   value: 'abcde',
   writable: false, // value cannot be changed
   enumerable: true,
   configurable: true 
});
console.log(newObj.baz); // abcde
```

## Creational Design Patterns

In Javascript, there are no *actual* classes to create objects. This means that there is no single method to create objects and based on requirements and preferences, we can use one of the object creational patterns to create object(s). I list 4 object creational patterns: Constructor (Prototype Pattern included), Module (Revealing Module pattern included), Singleton, and Factory Patterns.

### Constructor Pattern

It is used to create new objects with their own object scope. We can create new objects out of existing objects.

When we use the constructor pattern, we will be using the `new` to create new objects. `new` does the following things:
1. Creates a new object (brand new).
2. Links to an object prototype.
3. Binds `this` to the new object scope.
4. Implicitly returns `this`.

Constructor pattern:
```javascript=
function ObjectName(param1, param2) {
    this.param1 = param1;
    this.param2 = param2;
    this.toString = function() {
        return this.param1 + ' ' + this.param2;
    };
    // If we use 'new', it will implicitly add the following:
    // return this;
}
```

Example of contructor pattern (Creating tasks):
```javascript=
function Task(name) {
	this.name = name;
	this.completed = false;

	this.save = function() {
		console.log('Saving: ' + this.name);
	}

	this.complete = function() {
		console.log('Completed: ' + this.name);
		this.completed = true;
	}
}

var task1 = new Task('Finish homework');
var task2 = new Task('Go to the gym');
var task3 = new Task('Grocery shopping');

task1.save(); // Saving: Finish homework
task2.save(); // Saving: Go to the gym
task3.complete(); // Completed: Grocery shopping
task3.completed; // true


console.log(task1); // Task { name: 'Finish homework', completed: false, save: [Function], complete: [Function] }
console.log(task1.__proto__); // Task {}
```

**Drawback of constructor pattern:**

We are creating a copy of every property or method for every object that is created from the constructor function. We do not have methods or properties that can be shared between objects of the same type.

**Introducing prototypes:**

A "prototype" is an encapsulation of properties that an object links to. What this means is that we can encapsulate a set of properties or methods into a "prototype" of an object. All objects that are linked to that prototype will be able to reference those encapsulated properties and methods. The advantage is that new copies of those methods are not created for every object that is created. So, methods & properties that are **common** to objects can be **shared** by placing them in the prototype. *"Constructor-prototype pattern"*.

How it works:
1. Every function that we created gets associated with a prototype object. Hence, a constructor function will have its own prototype object.
2. We can access a prototype object by `<function/constructorName>.prototype`
3. The instantiated object's `__proto__` points to the constructor's prototype object, completing the prototype chain. For example, if we have a `Task` constructor and we create an object of it, the object's `__proto__` points to `Task`'s prototype object which in turn points to the `Object` constructor's prototype object (which all other objects inherit from).

Demo: Same tasks example, refactored:
```javascript=
// We do not need a copy of save and complete for every object we create.
function Task(name) {
	this.name = name;
	this.completed = false;
}

Task.prototype.save = function() {
	console.log('Saving: ' + this.name);
}

Task.prototype.complete = function() {
	console.log('Completed: ' + this.name);
	this.completed = true;
}

var task1 = new Task('Finish homework');
var task2 = new Task('Go to the gym');

task1.save();
task2.complete();

console.log(task1.save === task2.save); // true
console.log(task1.complete === task2.complete); // true
```

**New in ES6: Classes**

ES6 has introduced classes in Javascript. But, these classes are just *syntactical sugar* that makes the code more elegant and concise (it is not actual OO).

Comparing classes with traditional constructor functions:
1. The constructor method of the class is like the constructor function. All the `this` properties & methods go in here (Properties & methods that need to be created for each of the objects of that type).
2. The other methods and properties defined in the class are equivalent to the prototype functions and properties (i.e shared by all objects of that type).

Class syntax:
```javascript=
class <ClassName> {
    constructor(<params>) {
        // ... `this` related stuff
    }
    <prototypeMethod1Name>() {
        ...
    }
    <prototypeMethod2Name>() {
        ...
    }
    ...
}
```

Demo: Using ES6 classes for tasks example:
```javascript=
class Task {
	constructor(name) {
		this.name = name;
		this.completed = false;
	}
	save() {
		console.log('Saving: ' + this.name);
	}
	complete() {
		console.log('Completed: ' + this.name);
		this.completed = true;
	}
}

var task1 = new Task('Finish homework');
var task2 = new Task('Go to the gym');

task1.save();
task2.complete();

console.log(task1.save === task2.save); // true
console.log(task1.complete === task2.complete); // true
```

Try transpiling the above code into ES5: You can use [Babel transpiler]() and see that the resulting code will be very similar to constructor-prototype pattern.

### Module Pattern

A simple way to encapsulate data and methods (that are similar/related). (Ex: a module to hold all the utilities that work with a database and database functions).

A module is wrapped inside a function (which runs at least once). A module functions returns an object. The object properties and methods inside the returned object are publicly accessible while the others are private.

```javascript=
var Module = function() {
	var privateVar = 'I am private ...';
	return {
		method: function() { ... },
		nextMethod: function() { ... }
	};
}
	
Module.method; // Accessible.
Module.privateVar; // Error! Inaccessible.
```

Demo Example:
```javascript=
var DBRepo = function() {
	var dbAccessId = '...';
	return {
		getTask: function(taskId) {
			...
		},
		saveTask: function(task) {
			...
		}
	}
};
var dbUtil = DBRepo();
var task1 = dbUtil.getTask(1);
...
dbUtil.saveTask(task1);
```

**Advantage of module pattern:**
1. Provides encapsulation (public and private methods)

**Disadvantage of module pattern:**
1. We cannot easily test the private methods during unit testing since they cannot be accessed.

**Constructor vs Module pattern**
- Usually in a constructor everything is public by default, in the module everything is private by default.
- In a constructor, we use the `new` keyword to instantiate objects, in the module pattern we do not use`new` since we return an object anyway.
- Usually, the module pattern is used to instantiate just one object (refer "singleton pattern").

**The Revealing Module Pattern:**

The revealing module pattern puts all the properties and methods as private and references the methods to be made public in its return object. This is just a slight variation in the way module pattern is written and there is no change in functionality.

```javascript=
// Revealing module pattern:
var DBRepo = function() {
	var dbAccessId = '...';
	function getTask(taskId) {
		...
	}
	function saveTask(task) {
		...
	}
	return {
		getTask: getTask,
		saveTask: saveTask 
	}
};
var dbUtil = DBRepo();
var task1 = dbUtil.getTask(1);
...
dbUtil.saveTask(task1);
```

**Advantages of revealing module pattern:**
1. Rename public functions without changing function body.
2. Change members from public to private or vice versa by modifying a single line, without changing the function body.
3. All members, whether public or private, are defined in the closure. (private by default)
4. The return object is an object literal with no function definitions. All right hand side expressions are closure variables
5. All references are via the closure variables, not the return object.

### Singleton Pattern

Used to restrict an object to one instance of itself across the application.

**How does it work?**
- The pattern remembers the last time you created the object (if you had done that).
- If you have created it already, the pattern hands you back the same instance.
- Only if it hadn't been created earlier, it returns a new instance of the object.

**Implementation**
1. It is similar to module pattern: You have private functions and public ones.
2. The whole function's aim is the create an object instance (if not already done).
2. Here, the public API holds a function that checks if the object already exists. If not, it executes the necessary functions to create that object and return it.

```javascript=
var singleton = function(param1, param2) {
	var instance; // Object to create
	// Other properties and methods
	function initObject() { // Function to create new object
		instance = {};
		instance.param1 = param1;
		instance.param2 = param2;
		return instance;
	}
	
	// Public: All access to pvt is via closure (good)
	return {
		getInstance: function() {
			if(!instance) {
				instance = initObject();
			}
			return instance;
		}
	}	
};

var objCreator = singleton();
var obj1 = objCreator.getInstance(); // First call (new instance)
var obj2 = objCreator.getInstance(); // Since already created, returns back that instance.
console.log(obj1 === obj2); // true
```

**Note:** A simple way to create a *singleton using module pattern*:
1. If we use an IIFE with module pattern, it creates a singleton object. This is because the IIFE runs immediately and what is left is an object literal (with the public methods that can access the pvt via closure).
2. If we do not use an IIFE, the module pattern function can be called multiple time and it will return that many objects (Factory).

```javascript=
var Module = (function() {
    // Private:
    var prop1 = 1,
        prop2 = 10;

    // Public:
    return {
        displayProps: function() {
            console.log(prop1, prop2); // 1 10 (accessed via closure)
        }
    };
})();

var obj1 = Module; // Can't call Module (it's IIFE, already resolved - so now its just an object!)
var obj2 = Module;

console.log(obj1.displayProps()); // 1 10
console.log(obj2.displayProps()); // 1 10

console.log(obj1 === obj2); // true
```

In **nodeJS**, to export modules, we use the *commonJS* style of loading them. In *commonJS*, whatever object or function that we export from a module can be used in another module using the `require` method. The require method *caches* the modules that it is supposed to load. Because of this, invoking `require` to fetch the same module from different modules, will not create new instances of that module, it will supply already existing copy of it from the cache (Hence, *Singleton pattern*)

### Factory Pattern

A pattern used to: 
- Simplify object creation. (Ex: Say all the details of connecting to DB, caching, etc needs to be hidden from app logic like task creation, etc)
- Creating different objects based on need.

A Factory Method creates new objects as instructed by the client. One way to create objects in JavaScript is by invoking a constructor function with the new operator. There are situations however, where the client does not, or should not, know which one of several candidate objects to instantiate. The Factory Method allows the client to delegate object creation while still retaining control over which type to instantiate.

The key objective of the Factory Method is extensibility. Factory Methods are frequently used in applications that manage, maintain, or manipulate collections of objects that are different but at the same time have many characteristics (i.e. methods and properties) in common. An example would be a collection of documents with a mix of Xml documents, Pdf documents, and Rtf documents.

Imagine that we have a UI factory where we are asked to create a type of UI component. Rather than creating this component directly using the new operator or via another creational constructor, we ask a Factory object for a new component instead. We inform the Factory what type of object is required (e.g "Button", "Panel") and it instantiates this, returning it to us for use.

This is particularly useful if the object creation process is relatively complex, e.g. if it strongly depends on dynamic factors or application configuration.

Example 1:
```javascript=
function Factory() {
    this.createEmployee = function (type) {
        var employee;
 
        if (type === "fulltime") {
            employee = new FullTime();
        } else if (type === "parttime") {
            employee = new PartTime();
        } else if (type === "temporary") {
            employee = new Temporary();
        } else if (type === "contractor") {
            employee = new Contractor();
        }
 
        employee.type = type;
 
        employee.say = function () {
            log.add(this.type + ": rate " + this.hourly + "/hour");
        }
 
        return employee;
    }
}
 
var FullTime = function () {
    this.hourly = "$12";
};
 
var PartTime = function () {
    this.hourly = "$11";
};
 
var Temporary = function () {
    this.hourly = "$10";
};
 
var Contractor = function () {
    this.hourly = "$15";
};
 
// log helper
var log = (function () {
    var log = "";
 
    return {
        add: function (msg) { log += msg + "\n"; },
        show: function () { alert(log); log = ""; }
    }
})();
 
function run() {
    var employees = [];
    var factory = new Factory();
 
    employees.push(factory.createEmployee("fulltime"));
    employees.push(factory.createEmployee("parttime"));
    employees.push(factory.createEmployee("temporary"));
    employees.push(factory.createEmployee("contractor"));
    
    for (var i = 0, len = employees.length; i < len; i++) {
        employees[i].say();
    }
 
    log.show();
}
```

Example 2: Addy Osmani's JS design patterns book.
```javascript=
// Types.js - Constructors used behind the scenes
 
// A constructor for defining new cars
function Car( options ) {
 
  // some defaults
  this.doors = options.doors || 4;
  this.state = options.state || "brand new";
  this.color = options.color || "silver";
 
}
 
// A constructor for defining new trucks
function Truck( options){
 
  this.state = options.state || "used";
  this.wheelSize = options.wheelSize || "large";
  this.color = options.color || "blue";
}
 
 
// FactoryExample.js
 
// Define a skeleton vehicle factory
function VehicleFactory() {}
 
// Define the prototypes and utilities for this factory
 
// Our default vehicleClass is Car
VehicleFactory.prototype.vehicleClass = Car;
 
// Our Factory method for creating new Vehicle instances
VehicleFactory.prototype.createVehicle = function ( options ) {
 
  switch(options.vehicleType){
    case "car":
      this.vehicleClass = Car;
      break;
    case "truck":
      this.vehicleClass = Truck;
      break;
    //defaults to VehicleFactory.prototype.vehicleClass (Car)
  }
 
  return new this.vehicleClass( options );
 
};
 
// Create an instance of our factory that makes cars
var carFactory = new VehicleFactory();
var car = carFactory.createVehicle( {
            vehicleType: "car",
            color: "yellow",
            doors: 6 } );
 
// Test to confirm our car was created using the vehicleClass/prototype Car
 
// Outputs: true
console.log( car instanceof Car );
 
// Outputs: Car object of color "yellow", doors: 6 in a "brand new" state
console.log( car );
```

**When do we use factory pattern?**
1. When our object or component setup involves a high level of complexity
2. When we need to easily generate different instances of objects depending on the environment we are in
3. When we're working with many small objects or components that share the same properties

**ES6 Classes vs Factory Functions:**

If we have to create objects, say 100s or 1000s of them, then we can use the factory pattern to churn them out. But for creation of a very large number of objects in certain JS engines, ES6 classes (Syntactic sugar for the constructor pattern) provide a performace boost almost twice as that of factory pattern (takes half the time). So, if we need to create something like 10000+ objects, we can use ES6 classes to improve performance. But, ask yourself if you really need to be creating that many objects in the first place!

### Summary of Creational Patterns

When do we use each type of creational pattern?
- If we need to create a "few of something" : Use Constructor Pattern
- If we need to bundle together similar/related functionality and provide encapsulation (public/private) : Use Module Pattern
- If you want to always have only one instance of something no matter how many times it needs to be used : Use Singleton Pattern
- If you need to create objects 

## Structural Design Patterns

Concerned with how objects are made up (their composition) and simplify relationships between objects. It is about taking one object and seeing how it relates to other objects.

Therefore, the structural patterns will either extend the functionality of objects or simplify it.

### Decorator Pattern

It is used to add extra functionality to an object without being obtrusive. (Obtrusive: noticeable and undesirable, or something that sticks out or is in the way).

The decorator pattern:
- Provides more complete inheritance.
- Wraps an object.
- Protecting existing objects.
- Allows extended functionality.

#### Simple Decorator

In a simple decorator, we want to extend the functionality or modify it (without being obtrusive). So, in our example, we will extend the functionality of `Task()` objects. We have an 'urgentTask' which needs to `notify` something before the normal `save`. Only on this object do we extend this functionality, **without actually meddling** with `Task` constructor itself.

```javascript=
function Task(name) {
    this.name = name;
    this.completed = false;
}

Task.prototype.save = function() {
    console.log('Saving: ' + this.name);
};

Task.prototype.complete = function() {
    this.completed = true;
    console.log('Completed: ' + this.name);
};

var task = new Task('normal task');
task.save(); // Saving normal task
task.complete(); // Completed normal task

// Decorating (extending functionality) the Task type of object 
// for a new task that is "urgent":
// What "urgent" task does is, it also notifies something upon save. (this is extended functionality)
// So, we add extra functionality to this new "urgent" task and
// we also override its save method to notify first:
var urgentTask = new Task('urgentTask');
urgentTask.priority = 1; // Adding new properties that only urgentTask needs
urgentTask.notify = function() { // adding new functionality to urgent task (extending Task)
    console.log('Notified: ' + this.name);
};
urgentTask.save = function() { // Overriding (shadowing) prototype function for urgent task (so that notify is called first)
    this.notify();
    Task.prototype.save.call(this); // calling the shadowed save from prototype with object reference as `this`.
};

urgentTask.save(); // Notified: urgentTask\nSaving: urgentTask 
urgentTask.complete(); // Completed: urgentTask
```

#### More Complex Decorator

We do not want to modify every object that extends the original constructor's functionality. That is, we do not want to write methods for every `Task` object that is an urgent task. If there are multiple urgent tasks, it will lead to code duplication. 

We can write a new constructor `UrgentTask` that will call the old `Task` constructor, so that every object will have the basic properties that any task should have. But, `UrgentTask` will also have additional properties and methods that an urgent task needs. 

Moreover, the prototype object of `Task` needs to be cloned for `UrgentTask` and we can add new functionality to it or modify existing prototype properties/methods.

The final outcome will be as follows:
```javascript=
function Task(name) {
    this.name = name;
    this.completed = false;
}

Task.prototype.save = function() {
    console.log('Saving: ' + this.name);
};

Task.prototype.complete = function() {
    this.completed = true;
    console.log('Completed: ' + this.name);
};

var task = new Task('normal task');
task.save(); // Saving normal task
task.complete(); // Completed normal task

// More complex decorator: 
// Javascript cannot have sub-classes (there are no classes)
// So, to extend functionality to more than 1 object, we will have "sub-objects".

// 1. We will have a new constructor UrgentTask that will call the old Task constructor (Extends props/methods).
// 2. We will copy the prototype object of Task into the new UrgentTask constructor.

function UrgentTask(name, priority) {
    Task.call(this, name); // as urgent task should be a task as well (pass required params to original constructor)
    this.priority = 1; // adding new properties to objects of UrgentTask
}
// We don't have access to Task.prototype. So, copy the prototype object.
// We don't want `UrgentTask.prototype = Task.prototype` (Since changing one will change the other - not desired)
// Use Object.create(<prototypeobject>) which returns:
// A new object with the specified prototype object and properties. (A clone, not same reference)
UrgentTask.prototype = Object.create(Task.prototype); // Now save() and complete() are available to urgent objects

// Add new prototype function only for urgent objects:
UrgentTask.prototype.notify = function() {
    console.log('Notify: ' + this.name);
};

// Modify the save function to call notify() first
// and then the normal save() function in the original Task prototype:
UrgentTask.prototype.save = function() {
    this.notify();
    Task.prototype.save.call(this);
}

var ut1 = new UrgentTask('New Urgent Task', 1);
var ut2 = new UrgentTask('Another Urgent Task', 1);

ut1.save(); // Notify: New Urgent Task\nSaving: New Urgent Task
ut1.complete(); // Completed: New Urgent Task

ut2.save(); // Notify: Another Urgent Task\nSaving: Another Urgent Task
ut2.complete(); // Completed: Another Urgent Task

console.log(ut1 instanceof UrgentTask); // true
console.log(ut1 instanceof Task); // true (inheritance achieved)
```

**Note:** The decorator pattern can be used to create **sub-objects** and effectively achieving **inheritance**.

### Facade Pattern

It is used to provide a *simplified interface* to a complicated system.

Imagine dealing with a "complicated API" whose usage made it look very nasty. The facade pattern can help us put something *in front of* that API and make things easy/simple (interface-wise).

**Visualization:**
![Facade Diagram](https://www.joezimjs.com/wp-content/uploads/facade_structure.png)

Real-world analogy: Imagine you see the front of a very nice building, beautifully decorated. Now, inside this building there might be a ton of things happening, people and objects displaced or moving, etc causing a lot of chaos. The facade pattern would hide this chaos from the viewer who is looking at the building front - He only sees something nice.

**jQuery** is probably the most well-known implementation of a facade pattern. It hides the DOM intricacies and browser-dependent variations in code, etc.

**Facade vs Decorator Pattern:**

The facade pattern will **not add new functionality (it only wraps existing functionality making the interface simpler)** whereas the decorator pattern **will add new functionality (it extends existing functionality)**.

```javascript=
var foo = document.getElementById('foo');
    foo.style.color = 'red';
    foo.style.width = '150px';
var bar = document.getElementById('bar');
    bar.style.color = 'red';
    bar.style.width = '150px';
var baz = document.getElementById('baz');
    baz.style.color = 'red';
    baz.style.width = '150px';
```

Notice that in the above example we are getting each element separately and adding color plus width (which are actually the same for all of them) one-by-one. Imagine if this was the API and you had to do everything sequentially. That above piece of code is very annoying, we can write a wrapper function that deals with selecting elements dynamically & setting properties so that our call is just one line of code:

```javascript=
function setStyle(elements, property, value) {
    for (var i=0, length = elements.length; i < length; i++) {
        document.getElementById(elements[i]).style[property] = value;
    }
}
// Now you can write this:
setStyle(['foo', 'bar', 'baz'], 'color', 'red');
setStyle(['foo', 'bar', 'baz'], 'width', '150px');
```

Anytime you write a wrapper function that simplifies the usage of some functionality, we are making use of the facade pattern. For example, adding an event listener on the DOM could be difficult in older browsers, so we need to check in what different ways in which we can add a listener and settle up on the first one that works:

```javascript=
function addEvent(element, type, func) {
    if (window.addEventListener) {
        element.addEventListener(type, func, false);
    }
    else if (window.attachEvent) {
        element.attachEvent('on'+type, func);
    }
    else {
        element['on'+type] = func;
    }
}

// addEvent acts as a facade (hides implementation details):
addEvent(document.body, 'click', function(evt) {
	evt.preventDefault();
	console.log('body clicked');
});
```

**Facade with Revealing Module Pattern:**

The purpose of the facade pattern is to conceal the underlying complexity of the code by using an anonymous function as an extra layer. Internal subroutines are never exposed but rather invoked through a facade which makes this pattern secure in that it never exposes anything to the developers working with it. The facade pattern is both extremely interesting and very useful for adding an extra layer of security to your already minified code. This pattern is extremely useful when coupled with the revealing module pattern.

### Flyweight Pattern

Conserves memory by sharing portions of an object between objects.

Flyweight is useful when many objects have non-unique data. 

- Flyweights share data across objects.
- Overall result is a smaller memory footprint.

**Why "Flyweight"?:** 

flyweight is a weight in boxing and other sports intermediate between light flyweight and bantamweight. In the amateur boxing scale it ranges from 48 to 51 kg. So, flyweight is one of the *smallest* boxing categories by *weight* - the corresponding metric in programming would be the *memory*, of which we want to utilize the *least/smallest amount*.

**Note: Use flyweights only when there are a LOT of objects**

There is an *overhead* to implementing the flyweight pattern, so it *only useful* if we are creating a *large number of objects*! (Not very useful for one or two objects, in fact it is detrimental to performance). Therefore, flyweight is used for pretty complicated apps with thousands of objects or more being created.


Consider the an example: Assume we have numerous task objects that we need to create (from a `Task` constructor). Now, there are 1000s of tasks to be added so we have a `TaskCollection` object to add tasks by name and access them and their props (and it is this function that calls `new Task()` to create a new object):

```javascript=
var Task = function (data) {
    this.name = data.name;
    this.priority = data.priority;
    this.project = data.project;
    this.user = data.user;
    this.completed = data.completed;
}
Task.prototype.getPriority = function () {
    this.priority;
};

function Flyweight(project, priority, user, completed) {
    this.priority = priority;
    this.project = project;
    this.user = user;
    this.completed = completed;
};

function TaskCollection() {
    var tasks = {};
    var count = 0;
    var add = function (data) {
        tasks[data.name] = new Task(data);
        count++;
    };
    var get = function (name) {
        return tasks[name];
    };
    var getCount = function () {
        return count;
    };
    return {
        add: add,
        get: get,
        getCount: getCount
    };
}

var tasks = new TaskCollection();

var projects = ['none', 'courses', 'training', 'project'];
var priorities = [1, 2, 3, 4, 5];
var users = ['Jon', 'Erica', 'Amanda', 'Nathan'];
var completed = [true, false];

// Adding 1 million tasks to collection:
// large number of objects - for demo sake:
for (var i = 0; i < 1000000; i++) {
    tasks.add({
        name: 'task' + i,
        priority: priorities[Math.floor((Math.random() * 5))],
        project: projects[Math.floor((Math.random() * 4))],
        user: users[Math.floor((Math.random() * 4))],
        completed: completed[Math.floor((Math.random() * 2))]
    });
};

console.log("tasks: " + tasks.getCount()); // 1000000
```

The **problem** with the above code is that for every object created, each of its property gets created once too, even though there are only a few distinct values that each property can have. So, for 1,000,000 objects, there are 1,000,000 copies of each property. This is a memory drain! 

The only unique property for every `Task` object above is `name`. Apart from this, every other combo of the properties can be shared. We will build a `Flyweight` constructor that will create the non-unique properties on the `Task` object only if the combination of those properties does not already exist. If it does, we return the existing set of properties which creates sharing of properties and less memory usage.

```javascript=
var Task = function (data) {
    this.flyweight = FlyweightFactory.get(data.project, data.priority, data.user, data.completed);
    this.name = data.name;
    //this.priority = data.priority;
    //this.project = data.project;
    //this.user = data.user;
    //this.completed = data.completed;
}

Task.prototype.getPriority = function () {
    this.flyweight.priority; // changed
};

// ***********************************

function Flyweight(project, priority, user, completed) {
    this.priority = priority;
    this.project = project;
    this.user = user;
    this.completed = completed;
};
var FlyweightFactory = (function () {
    var flyweights = {};

    var get = function (project, priority, user, completed) {
        if (!flyweights[project + priority + user + completed]) {
            flyweights[project + priority + user + completed] =
                new Flyweight(project, priority, user, completed);
        }
        return flyweights[project + priority + user + completed];
    };
    var getCount = function () {
        var count = 0;
        for (var f in flyweights) count++;
        return count;
    }
    return{
        get: get,
        getCount: getCount
    }
})();

// *************************************

function TaskCollection() {
    var tasks = {};
    var count = 0;
    var add = function (data) {
        tasks[data.name] = new Task(data);
        count++;
    };
    var get = function (name) {
        return tasks[name];
    };
    var getCount = function () {
        return count;
    };
    return {
        add: add,
        get: get,
        getCount: getCount
    };
}

var tasks = new TaskCollection();

var projects = ['none', 'courses', 'training', 'project'];
var priorities = [1, 2, 3, 4, 5];
var users = ['Jon', 'Erica', 'Amanda', 'Nathan'];
var completed = [true, false];

for (var i = 0; i < 1000000; i++) {
    tasks.add({
        name: 'task' + i,
        priority: priorities[Math.floor((Math.random() * 5))],
        project: projects[Math.floor((Math.random() * 4))],
        user: users[Math.floor((Math.random() * 4))],
        completed: completed[Math.floor((Math.random() * 2))]
    });
};

console.log("tasks: " + tasks.getCount()); // 1000000
console.log("flyweights: " + FlyweightFactory.getCount()); // 160
```

A good example where flyweights can be used extensively is when dealing with a *large database*.

## Behavioral Design Patterns

It is concerned with the assignment of responsibilities between objects and how they communicate.

Behavioral design patterns:
- Deal with responsibilities of objects.
- Helps objects cooperate with each other.
- Assigns clear hierarchy of objects.
- Can encapsulate requests between objects (to make sure requests are being made properly).

### Observer (Publisher-Subscriber) Pattern

**Note**: [PubSub != Observer](https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c)

It allows a collection of objects to watch an object and be notified of changes.

- Allows for loosely coupled system
- There exists a central object that knows everything that is going on.
- There exists a group of other objects that are watching or listening for changes.

```javascript=
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

### Mediator Pattern

Allows communication between objects so that neither has to be coupled to the others.

- Allows for a loosely coupled system.
- One object manages all communication.
- Allows for many to many relationships.

The mediator pattern provides one central authority to preside over object interaction. All the objects communicate with the mediator which in turn passes the messages to the concerned objects. The objects themselves do not directly interact with each other (i.e w/o the mediator).

Real-life analogy of mediator: An example of Mediator is that of a control tower on an airport coordinating arrivals and departures of airplanes. A plane requests the ATC to land, the ATC conveys a message to other waiting planes, asking them to wait. Once the plane lands, the ATC allows another plane to land. (All planes communicate with the ATC and never with each other).

Popular Examples of mediator pattern:
- We can build a chat application where the chatroom is the mediator and the members are the participants.

```javascript=
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

[Check out easier notes from FreeCodeCamp 4 Design Patterns: Singleton, Module, Observer & Mediator](https://github.com/pushkar100/javascript-notes/blob/master/design-patterns-freeCodeCamp/design-patterns.md)

[FreeCodeCamp JS Design Patterns YT Playlist](https://www.youtube.com/playlist?list=PLWKjhJtqVAbnZtkAI3BqcYxKnfWn_C704)

### Command Pattern:

[Simple Tutorial on Command Pattern](https://www.joezimjs.com/javascript/javascript-design-patterns-command/)
