# Observer Pattern

**Sources (Credits):**

1. Pro Javascript Design Patterns - Ross Harmes and Dustin Diaz (Apress)
2. Javascript Patterns - Stoyan Stefanov (O’Reilly)
3. JavaScript Design Patterns - Addy Osmani (O’Reilly)
4. [Hackernoon Article: Observer versus PubSub Pattern](https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c)
5. [Dev.Housetrip Article: Decoupling Javascript Apps using PubSub Pattern](http://dev.housetrip.com/2014/09/15/decoupling-javascript-apps-using-pub-sub-pattern/)

## Introduction

Observer is a common pattern in an *event-driven environment* where things constantly seek attention from the user (such as in a browser)

### Type of pattern

**Behavioral pattern**. It focus on improving or streamlining the communication between disparate (different/differing/contrasting) objects in a system.

## What is the pattern? 

A pattern that allows you *observe* the **state** of an object in a program and be *notified* when it changes

There are two roles: 

1. *Observer* (Subscriber): The component that watches.
2. *The observed* (Publisher): The component that is being watched.

### Subscriber

The subscribers will ***receive*** data from publishers and consumes it. 

### Publisher

The publisher ***sends*** the data. 

The publisher notifies (calls) all the subscribers when an important event occurs and may often pass a message in the form of an event object.

### Relationship between Publisher and Subscriber

A publisher can most likely have *many subscribers*. A subscriber might be subscribed to *many publishers*. It can be a *many-to-many relationship*.

```
One Publisher <===> Can have many Subscriber(s)
```

```
Many Publisher(s) <===> One Subscriber can be subscribed to them all
```

This allows for *advanced abstraction*, where subscribers can *vary independently from one another*.

### Push vs Pull

Subscribers can either have the data delivered to them with the publisher ***pushing*** (commonly used method) it or they can receive it themselves by ***pulling*** it.

### An Analogy

There are newspaper publishers (Ex: Times of India) and there are subscribers (Ex: Readers) who read the daily paper either at home or pick one up from a newspaper stand.

### Roles

*Subscriber* can:

1. Subscribe
2. Unsubscribe
3. Can either have data delivered to them or pull it themselves

*Publisher* can:

1. Deliver data
2. Can either deliver data or have it taken from them

![Observe & PubSub Pattern](https://learning.oreilly.com/library/view/learning-javascript-design/9781449334840/httpatomoreillycomsourceoreillyimages1547803.png)

## Ways to implement it

Note that only publisher can deliver, and only subscriber can consume. Apart from that, there are two ways in which it can be implemented:

1. Publisher has control:

   ```
   Publisher (An object)
   	Methods:
   		- subscribeCustomer(Subscriber)
   		- deliver(Subscriber)
   		- unSubscribeCustomer(Subscriber)
   
   Subscriber (A function, i.e a callback)
   	The callback is invoked with data arguments when deliver is executed
   ```

2. Subscriber has control:

   ```
   Publisher (An object)
   	Methods:
   		- deliver(data)
   		
   Subscriber (A function, i.e a callback)
   	The callback is invoked with data arguments when deliver is executed
   	Methods (since a function is an object too):
   		- subscribe(Publisher)
   		- unSubscribe(Publisher)
   ```

**Note**: Publisher also needs to maintain a list of subscribers. For example, in an array.

## Implementation Example 

```javascript
/* AN EXAMPLE OF A SUBSCRIBER HAVING CONTROL */

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

```javascript
/* ------------------ TESTING ------------------ */

var timesOfIndia = new Publisher();
var theHindu = new Publisher();
var deccanHerald = new Publisher();

subscriberPushkar = function(data) { 
	console.log('Pushkar received: ', data);
}
subscriberVandana = function(data) { 
	console.log('Vandana received: ', data); 
}
subscriberJoel = function(data) { 
	console.log('Joel received: ', data) ;
}

subscriberPushkar.subscribe(timesOfIndia);
subscriberPushkar.subscribe(theHindu);

subscriberVandana.subscribe(timesOfIndia);
subscriberVandana.subscribe(deccanHerald);

subscriberJoel.subscribe(timesOfIndia);
subscriberJoel.subscribe(theHindu);
subscriberJoel.subscribe(deccanHerald);

timesOfIndia.deliver('ToI Daily News');
theHindu.deliver('The Hindu Daily News');
deccanHerald
	.deliver('Deccan Herald Daily News')
	.deliver('Deccan Herald Special');

/* Output:

Pushkar received:  ToI Daily News
Vandana received:  ToI Daily News
Joel received:  ToI Daily News
Pushkar received:  The Hindu Daily News
Joel received:  The Hindu Daily News
Vandana received:  Deccan Herald Daily News
Joel received:  Deccan Herald Daily News
Vandana received:  Deccan Herald Special
Joel received:  Deccan Herald Special

*/
```

## Real World Examples

1. Event listeners are basically observers. For example, Javascript DOM event listeners are based on the Observer pattern
2. You can use the Observer pattern to listen to different points in an animation like start, end, and during.
3. jQuery events' system is an Observer or a PubSub pattern.

## When do we use the pattern?

1. Used in situations where you want to *abstract human behavior from application behavior*. For example, we should not rely on a user click to log that a tab was opened. It could have happened via a mouseover or focus event. So, instead of using DOM events, we should maintain an `onTabChange` observable which is not tied to any DOM event.

## Publisher Subscriber Pattern: A Variation of Observer

The Observer pattern requires that the observer (or object) wishing to receive topic notifications must subscribe this interest to the object firing the event (the subject).

The Publish/Subscribe pattern however uses ***a topic/event channel which sits between the objects*** wishing to receive notifications (subscribers) and the object firing the event (the publisher). 

```
Publisher(s) <===> Event Bus <===> Subscriber(s)
```

The idea here is to ***avoid dependencies*** between the *subscriber* and *publisher*.

> "*In software architecture, publish–subscribe is a messaging pattern where senders of messages, called publishers, do not program the messages to be sent directly to specific receivers, called subscribers. Instead, published messages are characterized into classes, without knowledge of what, if any, subscribers there may be. Similarly, subscribers express interest in one or more classes, and only receive messages that are of interest, without knowledge of what, if any, publishers there are.*"

The *event bus / topic channel* will be responsible for providing the API for publishing & subscribing (unsubscribing too!). Therefore, it essentially becomes the receiver & deliverer of content.

```javascript
/* PUBLISHER-SUBSCRIBER PATTERN: */

/* ------------- THE EVENT BUS / TOPIC CHANNNEL ------------- */

class EventBus {
	constructor() {
		this.topics = {
			// topic: [sub1, sub2, ...]
		}
	}

	// Publish an event to all subscribers of topic:
	publish(topic, data) {
		if(!(this.topics[topic] && this.topics[topic].length))
			return;
		this.topics[topic].forEach(listener => {
			listener(data);
		});
	}

	// Subscribe (a callback) to a particular topic:
	subscribe(topic, listener) {
		if(!(this.topics[topic] && this.topics[topic].length))
			this.topics[topic] = [];
		this.topics[topic].push(listener);
	}
}
```

```javascript
/* ------------- CREATE A SPECIFIC EVENT BUS ------------- */

let orderEvents = new EventBus();

/* ------------- PUBLISHER EXAMPLE ------------- */

class Order {
	constructor(orderDetails) {
		this.orderDetails = orderDetails;
		this.orderReady = false;
	}

	completeOrder() {
		if(!this.orderReady) {
			this.orderReady = true;
			orderEvents.publish('orderReady', this.orderDetails);
		}
	}
}

/* ------------- SUBSCRIBER EXAMPLE ------------- */

class Mailer {
	constructor() {
		// Subscribe to events:
		orderEvents.subscribe('orderReady', this.sendMail);
	}

	sendMail(data) {
		console.log('Sending Mail: ', data);
	}
}

/* ------------- TESTING ------------- */

let orderOne = new Order({ item: 'Book 1', price: '100' });
let mailerOne = new Mailer();

orderOne.completeOrder();

/* Output:

Sending Mail:  {item: "Book 1", price: "100"}

*/
```

In Publisher-Subscriber pattern, senders of messages, called **publishers**, *do not* program the messages to be sent directly to specific receivers, called **subscribers.**

This means that the publisher and subscriber don’t know about the existence of one another. There is a third component, called **broker or message broker or event bus**, which is known by both the publisher and subscriber, which filters all incoming messages and distributes them accordingly.

In other words, pub-sub is a pattern used to communicate messages between different system components *without these components knowing anything about each other’s identity*. 

### PubSub vs Observer:

1. In the **Observer** pattern, the **Observers are aware of the Subject, also the Subject maintains a record of the Observers**. Whereas, in **PubSub**, publishers and subscribers **don’t need to know each other**. They simply communicate with the help of *message queues or broker*.
2. In **PubSub** pattern, components are ***loosely coupled*** as opposed to Observer pattern.
3. **Observer** pattern is mostly implemented in a **synchronous** way, i.e. the Subject calls the appropriate method of all its observers when some event occurs. The **PubSub** pattern is mostly implemented in an **asynchronous** way (using message queue).
4. **Important Information!**:
   - **Observer** pattern needs to be implemented in a ***single application address space***. On the other hand, the **PubSub** pattern is more of ***a cross-application pattern***.

## Features of Observer Pattern

1. ***It promotes loose coupling***. Instead of one object calling another object’s method, an object subscribes to another object’s specific activity and gets notified.

## Benefits of Observer Pattern

1. It is the best way to ***abstract your applications***. You can ***broadcast events*** and allow any developer to take advantage of subscribing to those events ***without ever having to dig into the other developers’ implementation code***. For example: Third party developers do not need to delve into your code; they just subscribe to the events.
2. ***A great way to maintain your action-based application in large architectures***. Hundreds of thousands of events might be happening sporadically through a browser session.
3. ***It can reduce memory usage and speeds up interaction performance***. You can cut back on listeners by implementing ***one observable object*** that uses ***one event listener*** and ***delegate the information to all its subscribers***. 
4. It encourages us to think hard about the ***relationships between different parts of our application***. They also help us ***identify which layers containing direct relationships can be replaced with sets of subjects and observers***.
5. Helps break down an application into ***smaller***, ***more loosely coupled blocks*** to ***improve code management and potentials for re-use***.
6. Used where we need to ***maintain consistency between related objects without making classes tightly coupled***.
   - Usually you know two components are *tightly coupled* when *a change to one requires a change in the other one*.
7. It is one of the ***best tools for designing decoupled systems*** and should be considered ***an important tool in any JavaScript developer's utility belt***.

## Drawbacks of Observer Pattern

1. There is a ***cost on load time when setting up observable objects***
   - We can solve this by using *lazy loading* which allows putting of instantiating new observable objects until delivery time.
   - Subscribers can still subscribe to an event that has yet to be created.
   - This helps avoid the slow down of your initial load.

2. By decoupling publishers from subscribers, ***it can sometimes become difficult to obtain guarantees that particular parts of our applications are functioning as we may expect***. 
   - Publishers may make an assumption that one or more subscribers are listening to them
   - If the subscriber performing an action fails to function, the publisher won't have a way of seeing this due to the decoupled nature of the system.
3. ***Subscribers are quite ignorant to the existence of each other*** and are ***blind to the cost of switching publishers***. The update dependency can be difficult to track
