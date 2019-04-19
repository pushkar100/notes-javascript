# Javascript Patterns 

[LinkedIn Learning](!https://www.linkedin.com/learning/javascript-patterns/prototype-class-design-pattern)

## What is a pattern?

It is a programming method employed to solve an existing problem in the code.

## Creational Patterns

These are patterns that help us create new objects and the best, most-suitable ways to do so...

1. **Prototype or Class Pattern**

This pattern allows us to create a blueprint for a specific type of item and then reuse it by creating a new object from that class

A class in ES6 is the same as the prototype used earlier in javascript (and that which still exists)

**Why?**

It helps us create new objects based off the blueprint very quickly!

```javascript
class Car {
    constructor(doors, engine, color) {
        this.doors = doors
        this.engine = engine
        this.color = color
    }
}

const audi = new Car(4, 'V6', 'red') 
// The object's `__proto__` object will point to a `constructor` `Car`
```

2. **Constructor Pattern**

This patterns `extends` the existing class pattern. We leverage a class created to initiate a new extended class from it. 

When we extend the class, we run the constructor of the older class first (to inherit the values assigned to members of it) using `super` and then write the rest of our own, extended class.

**Why?**

- We can extend an existing class (OR) use the same information without repetition (i.e without writing the parent class' constructor & methods)!

```javascript
class Car {
    constructor(doors, engine, color) {
        this.doors = doors
        this.engine = engine
        this.color = color
    }
}

class Suv extends Car {
    constructor(doors, engine, color, wheels) {
        super(doors, engine, color)
        this.wheels = wheels
    }
}

const audi = new Car(4, 'V6', 'red') 
const cx5 = new Suv(4, 'V8', 'blue', 4) // The object's `__proto__` object will point to a `constructor` `Suv`
```

3. **Singleton Pattern**

It simply prevents the class from instantiating more than one instance of the blueprint we have defined (i.e more than one object)

We allow only one instance of the class to be created.

**Why?**

We want to restrict the number of instances to just 1

```javascript
let instance
class Car {
    constructor(doors, engine, color) {
        if(!instance) {
            this.doors = doors
            this.engine = engine
            this.color = color
            instance = this
        } else {
            return instance
        }
    }
}

const audi = new Car(4, 'V6', 'red') 
const honda = new Car(4, 'V7', 'green') // Since we already created `audi`, `honda` basically gets back `audi`
// Makes sure there isn't more than one instance!
audi === honda // true
```

4. **Factory Pattern**

It is a mechanism to create other objects. We can handle most of our classes in a 'factory' and then simply use the factory method to create new objects

**Why?**

A factory function can be used to pass the 'type' (variations) and create a new object (from an existing class that the factory is aware of)


```javascript
class Car {
    constructor(doors, engine, color) {
        this.doors = doors
        this.engine = engine
        this.color = color
    }
}

class CarFactory {
    create(type) {
        switch(type) {
            case 'audi': 
                return new Car(4, 'V6', 'red')
            case 'honda':
                return new Car(2, 'V4', 'blue')
            default:
                return new Car(4, 'Basic', 'White')
        }
    }
}

const carFactory = new CarFactory() // initialize the factory

// Make different types of cars by telling the factory (i.e using factory method):
const audi = carFactory.create('audi')
const honda = carFactory.create('honda')
```

4. **Abstract Factory Pattern**

We can extend the concept of a factory pattern even further. You abstract the factories to create multiple factories, classes, etc.

We have a class (blueprint) to create an item and its associated factory to make those items (of different variations as per input). Then we have another, higher-level factory that takes in both the type of item and the variations, and instructs an individual factory to go build that item from the right class.

The higher level, abstract factory need not be concerned with the individual classes.

**Why?**

- We can create a higher level factory that is constructor agnostic - it delegates work to other factories.
- It is a very scalable approach (i.e we can add other factories to the higher level factory)

```javascript
// 1. Classes:
class Car {
    constructor(doors, engine, color) {
        this.doors = doors
        this.engine = engine
        this.color = color
    }
}
class Suv {
    constructor(doors, engine, color, wheels) {
        this.doors = doors
        this.engine = engine
        this.color = color
        this.wheels = wheels
    }
}

// 2. Factories:
class CarFactory {
    create(type) {
        switch(type) {
            case 'audi': 
                return new Car(4, 'V6', 'red')
            case 'honda':
                return new Car(2, 'V4', 'blue')
        }
    }
}
class SuvFactory {
    create(type) {
        switch(type) {
            case 'cx5': 
                return new Suv(4, 'V2', 'red', 3)
            case 'santa fe':
                return new Suv(2, 'V8', 'yellow', 4)
        }
    }
}

// 3. Instantiate Individual Factories:
const carFactory = new CarFactory()
const suvFactory = new SuvFactory()

// 4. Abstract Factory:
const autoManufacturer = (type, model) => {
    switch(type) {
        case 'car':
            return carFactory.create(model) 
        case 'suv':
            return suvFactory.create(model)
    }
}

// 5. Use abstract factory:
const cx5 = autoManufacturer('suv', 'cx5')
const audi = autoManufacturer('car', 'audi')
```

## Structural Patterns

These are patterns that help us organize our code better...

1. **Module Pattern**

The idea behind modules is to organize your code into *pure functions* so that it becomes easier to identify the origin of an error while debugging.

It is also used to encapsulate functionality and expose only what needs to be publicly accessible

ES5 Implementation:
```javascript
// Module
var circleModule = function (radius) {
    // Private properties/methods
    var PI = 3.14
    var getRadius = function () {
        return radius
    }
    // Public properties/methods
    return {
        calculateArea: function () {
            return PI * getRadius() * getRadius()
        },
        calculateCircumference: function () {
            return 2 * PI * getRadius()
        }
    }
}

// Using our module
var circleRad5 = circleModule(5)
circleRad5.calculateArea()
circleRad5.calculateCircumference()
```

ES6 modules:
```javascript
/* Module file: circle-module */
let radius
const PI = 3.14
const getRadius =  () => radius
const initRadius = (r) => { radius = 5 }
const calculateArea = () => PI * getRadius() * getRadius()
const calculateCircumference = () => 2 * PI * getRadius()


export {
    initRadius,
    calculateArea,
    calculateCircumference
} // Use `export` keyowrd to send public properties/methods

/* Another file: */
import circle from './circle-module' // Use `import` keyword to get the public methods of a module

circle.initRadius(5)
circle.calculateArea()
circle.calculateCircumference()
```

2. **Mixins Pattern**

Mixins are a great way to mix functions and instances of a class ***after they have been created***! With a mixin, we can add new functionality to our classes/prototypes!

We can use `Object.assign(<prototype>, <mixinFunction>)` to combine the mixin pattern with a prototype of a class

**Why?**

Enhancing the existing functionality of a class that was already created and passed to us? We can use a mixin.

```javascript
// Existing class:
class Car {
    constructor(doors, engine, color) {
        this.doors = doors
        this.engine = engine
        this.color = color
    }
}
// Existing factory (Optional) (Factories are not mandatory for mixins)
class CarFactory {
    create(type) {
        switch(type) {
            case 'audi': 
                return new Car(4, 'V6', 'red')
            case 'honda':
                return new Car(2, 'V4', 'blue')
            default:
                return new Car(4, 'Basic', 'White')
        }
    }
}

// Our Mixin Function: We want to rev the car!
const revEngine = function () {
    console.log(`This engine, ${this.engine}, is doing vroom vroom!`)
}

// Mixin: Adding funcationality to the existing class/prototype
Object.assign(Car.prototype, revEngine)

// Creating an instance 
const carFactory = new CarFactory()
const audi = carFactory.create('audi')
audi.revEngine() // This engine, V6, is doing vroom vroom!

// Notice that the revEngine() was not present in the original class
// We added this functionality AFTER the class was created and hander over to us!
// Enhancing existing functionality of a class? Use a mixin.
```

1. **Facade Pattern**

What is a *facade*? It is basically hiding away complexity by creating a 'facade' for the complex code. 

**Facade meaning**: A deceptive outward appearance / the principal front of a building, that faces on to a street or open space.

Whenever we use a react component to render another component, we are hiding away the complexity of the inner component:

```javascript
    ...
    render() {
        return (
            <div>
                <h1>Oops.. something went wrong</h1>
                <Slate error={errorobj}>
            <div>
        )
    }
    ...
```

**Why?**
When building an application, we often face problems with sub-systems. One has simple methods, other has them very complicated. Unifying them under one common interface is one of uses of the facade pattern.

jQuery example:
```javascript
...
ready: (function() {
   ...
   // Mozilla, Opera, and Webkit
   if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", idempotent_fn, false);
      ...
   }
   // IE event model
   else if (document.attachEvent) {
      // ensure firing before onload; maybe late but safe also for iframes
      document.attachEvent("onreadystatechange", idempotent_fn);
      // A fallback to window.onload, that will always work
      window.attachEvent("onload", idempotent_fn);
    ...    
   }
})
...

// Usage:
$(document).ready(function() {
    // all your code goes here...
});
```

Pure JS:
```javascript
/* Complex parts */
class CPU {
    freeze() { /* code here */ }
    jump(position) { /* code here */ }
    execute() { /* code here */ }
}
class Memory {
    load(position, data) { /* code here */ }
}
class HardDrive {
    read(lba, size) { /* code here */ }
}

/* Facade */
class ComputerFacade {
    constructor() {
        this.processor = new CPU();
        this.ram = new Memory();
        this.hd = new HardDrive();
    }
   start() {
        this.processor.freeze();
        this.ram.load(this.BOOT_ADDRESS, this.hd.read(this.BOOT_SECTOR, this.SECTOR_SIZE));
        this.processor.jump(this.BOOT_ADDRESS);
        this.processor.execute();
    }
}

/* Client */
let computer = new ComputerFacade();
computer.start(); // such a simple interface!
```

1. **Flyweight Pattern**

A pattern used to minimize the recreation of the same item twice. It is useful for *reducing the memory* used by the application.

It is similar to the ***singleton pattern*** in terms of implementation. For example, image loading and memoization can be thought of as flyweight pattern. If already created, the created object is passed back.

1. **Decorator Pattern**

The Decorator pattern extends (decorates) an object’s behavior dynamically. The ability to add new behavior at runtime is accomplished by a Decorator object which ‘wraps itself’ around the original object. Multiple decorators can add or override functionality to the original object.

```javascript
/* What we're going to decorate */
function MacBook() {
    this.cost = function () { return 997; };
    this.screenSize = function () { return 13.3; };
}

/* Decorator 1 */
function Memory(macbook) {
    var v = macbook.cost();
    macbook.cost = function() {
        return v + 75;
    }
}

/* Decorator 2 */
function Engraving( macbook ){
    var v = macbook.cost();
    macbook.cost = function(){
        return  v + 200;
    };
}

/* Decorator 3 */
function Insurance( macbook ){
    var v = macbook.cost();
    macbook.cost = function(){
        return  v + 250;
    };
}

/* Usage: */
var mb = new MacBook();
Memory(mb);
Engraving(mb);
Insurance(mb);
console.log(mb.cost()); //1522
console.log(mb.screenSize()); //13.3
```

**ES6 Decorators**

They allow us to alter the definition of a class, method, or a property. There are already a few neat libraries which provide decorators and make our life easier by allowing us to write more declarative code with better performance characteristics.

```javascript
class Math {
    @log
    add(a, b) {
       return a + b;
    }
}

function log(target, name, descriptor) {
    // target: instance of the class
    // name: method on which decorator is defined
    // descriptor: Similar to the 2nd object passed to Object.defineProperty()
    // descriptor props: value, enumerable, configurable, writable
    var oldValue = descriptor.value;
    descriptor.value = function() {
        console.log(`Calling "${name}" with`, arguments);
        return oldValue.apply(null, arguments);
    };
    return descriptor;
}

const math = new Math();

// passed parameters should get logged now
math.add(2, 4);
```

6. **Model-View-Controller (MVC) Pattern**

A common structural pattern.

- **Model** is the **Data**
- **View** is the **Visuals (Ex: HTML)**
- **Controllers** are where we have ALL the **logic** of the app (***functions*** that make the app run)

The Controller tells to View to "do" something "with" something from the Model. *The view has access to both the model and controller. It can interact and fetch data from both.*

Most developers split all their files and structure of their app based on this pattern.

```javascript
// Very simple MVC example:
var M = {}, 
    V = {}, 
    C = {};

// Model
M.data = "hello world";

// View
V.render = function (M) { alert(M.data); }

// Controller
C.handleOnload = function () { V.render(M); }

// Exposing the Controller
window.onload = C.handleOnLoad;

// Controller (C) listens on some kind of interaction/event stream. In this case it's the page's loading event.
// Model (M) is an abstraction of a data source.
// View (V) knows how to render data from the Model.

// In this example
// * View knows nothing about the Model apart from it implements some interface
// * Model knows nothing of the View and the Controller
// * Controller knows about both the Model and the View and tells the View to go do something with the data from the Model.
```

1. **Model-View-Presenter (MVP) Pattern**

Very similar to MVC where Presenter is like th Controller but with the follow differences:
- The view has access only to the presenter and not the model like in MVC
- Presenter (Controller) servers as both:
  - The logic 
  - The supplier of data (to the view)

Therefore, the view passes through the presenter via the presenter's functions to get the data. The presenter in turn pulls from the model.

This pattern is popular in backbone.js and Android development.

1. **Model-View-ViewModel (MVVM) Pattern**

Again, this is the same as MVC and MVP but differs in implementation. 

- The **View** is *stateless* visual (stateless component) (Dumb - takes what data it receives and displays it blindly)
- The **ViewModel** is *stateful* visual (stateful component) (It holds the *logic* & *state* of the data)

## Behavioral Patterns

1. **Observer Pattern**

Introduces a notification/event system so that:
- There is loose coupling between pub and sub
- We can have as many subscribers (listeners) as we want
- We can sub and un-sub as and when we want

```javascript
/* ------------------ THE PUBLISHER ------------------ */

function Publisher() {
	this.subscribers = [];
}

Publisher.prototype.deliver = function (data) {
	this.subscribers.forEach(function (sub) {
		sub(data);
	});
	return this; // Helps chain multiple `deliver` calls (or other methods)
} // Publisher "push"es the data!

/* ------------------ THE SUBSCRIBER ------------------ */

// We can extend the function prototype
// Subscriber will remain a callback but have methods:

Function.prototype.subscribe = function (publisher) {
	var that = this;
	var alreadyExists = publisher.subscribers.some(function (sub) {
		return sub === that;
	});
	if(!alreadyExists) {
		publisher.subscribers.push(this);
	}
}

Function.prototype.unSubscribe = function (publisher) {
	var that = this;
	publisher.subscribers = publisher.subscribers.filter(function (sub) {
		return sub !== that;
	});
	return this;
}
```
// TODO: 

2. **State Pattern**


3. **Chain of Responsibility**


4. **Iterator Pattern**


5. **Strategy Pattern**


6. **Memento Pattern**


7. **Mediator Pattern**


8. **Command Pattern**
