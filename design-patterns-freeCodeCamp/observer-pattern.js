
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
