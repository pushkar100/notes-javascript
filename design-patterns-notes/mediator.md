# Mediator Pattern

**Sources (Credits):**

1. Pro Javascript Design Patterns - Ross Harmes and Dustin Diaz (Apress)
2. Javascript Patterns - Stoyan Stefanov (O’Reilly)
3. JavaScript Design Patterns - Addy Osmani (O’Reilly)

## Introduction

When you want to channel multiple event sources through a single object, you think of two patterns:

1. Publisher Subscriber pattern
2. Mediator pattern

However, these two have subtles differences (nuances) (explained below).

### Type of pattern

**Behavioral pattern**. It focuses on improving or streamlining the communication between disparate (different/differing/contrasting) objects in a system.

## What is the pattern? 

It is a pattern that provides a ***unified interface*** through which the different parts of a system may communicate (*a neutral party that assists in communication*).

### Analogy

Air traffic control system. A centralized system where the tower is the mediator that decides which planes can land and take off, etc. Each plane is a colleague in this pattern.

### Mediator vs Publisher Subscriber (event aggregator)

**Similarities**:

1. Both deal with events
2. Both use third-party objects

**Differences**:

1. Mediator uses events only *optionally*, because it is convenient. It is not mandatory to use events - we can use callbacks instead! Observer/PubSub uses the events because it is an integral part of the pattenr itself (has to be used).
2. Observer/PubSub uses the central object only to facilitate the pass-through of events from an unknown numbers of sources to an unknown number of handlers. In a mediator, the channel has the *business logic and workflow aggregated into the itself*. It takes decisions based on events or state of other objects.
3. The individual objects involved in this workflow each *know how to perform their own task*. But it’s the mediator that *tells the objects when to perform the tasks by making decisions at a higher level* than the individual objects. The event channel in observer/pubsub does not take decisions - strictly just message passing.
4. An event aggregator facilitates a “fire and forget” model of communication. The object triggering the event doesn’t care if there are any subscribers. A mediator, though, might use events to make decisions, but it is *definitely not “fire and forget”*. A mediator p*ays attention to a known set of input or activities* so that it can *facilitate and coordinate additional behavior with a known set of actors (objects)*.

![Mediator pattern](https://learning.oreilly.com/library/view/learning-javascript-design/9781449334840/httpatomoreillycomsourceoreillyimages1547805.png)

## Ways to implement it

All we need is a central object that control the workflow of different objects.

```javascript
var mediator = {};
```

## Implementation Example 

An example of a system containing two player objects and a scoreboard. Whenever player plays, it increments its own score. The scoreboard object displays both the players' current scores. The mediator makes this all work. It controls when the scoreboard must be updated and when a player can play, etc.

```javascript
/* ------------- PLAYER ------------ */

function Player(name) {
	this.name = name;
	this.points = 0;
}

Player.prototype.play = function() {
	this.points += 1;
	mediator.played();
}

/* ------------- SCOREBOARD ------------ */

var scoreboard = {
	update: function(scores) {
		var html = '';
		for(var i = 0; i < scores.length; i++) {
			html += [
				'<li>Player: ' + scores[i].name + ' | Score: ' + scores[i].score +  '</li>'
			].join('');
		}
		document.write('<ul>' + html + '</ul>');
	}
}

/* ------------- MEDIATOR (w/o event channel) ------------ */

// Controls the following:
// 1. sets up players
// 2. knows when to make a player play
// 3. updates score when player plays

var mediator = {
	players: {},
	setup: function() {
		this.players['home'] = new Player('home');
		this.players['away'] = new Player('away');
	},
	played: function() {
		var scores = [];
		for(player in this.players) {
			scores.push({ 
				name: this.players[player].name,
				score: this.players[player].points
			});
		}
		scoreboard.update(scores);
	},
	keypress: function(e) {
		if(e.which === 49) { // key '1'
			mediator.players['home'].play();
		} else if(e.which === 48) { // key '0'
			mediator.players['away'].play();
		}
		return true;
	}
}

/* ------------- TEST ------------ */

mediator.setup();
window.onkeypress = mediator.keypress;

// Game over in 30 seconds:
setTimeout(function() {
	window.keypress = null;
	alert('Game over');
}, 30000);
```

An example of event aggregator and mediator pattern in use together:

```javascript
var MenuItem = MyFrameworkView.extend({
  events: {
    "click .thatThing": "clickedIt"
  },
 
  clickedIt: function(e){
    e.preventDefault();
    // assume this triggers "menu:click:foo"
    MyFramework.trigger("menu:click:" + this.model.get("name"));
  }
});
 
/* ----------------- Mediator -------------------- */
 
var MyWorkflow = function(){
  MyFramework.on("menu:click:foo", this.doStuff, this);
};
 
MyWorkflow.prototype.doStuff = function(){
  // instantiate multiple objects here.
  // set up event handlers for those objects.
  // coordinate all of the objects into a meaningful workflow.
};
```

## Real World Examples

1. When you define all your eventh handlers on `document` instead of the target element, the document becomes the mediator

## When do we use the pattern?

**When do we use event aggregator (observe/pubsub)?**

1. When you *have too many unrelated objects to listen to directly*. Example: A menu item and a content tab. Whenever menu item is clicked content and other views can change. But, the menu item need not be tightly coupled to other views. Therefore, use events.
2. When two objects have a *direct* relationship already - like a *parent & child relationship* (ex:  child components). The child can trigger events that the parent can listen to.

**When do we use mediator?**

1. If it appears a system has *too many direct relationships between components*, it may be time to have a *central point of control* that components communicate through instead.

## Features of Mediator Pattern

1. The Mediator promotes *loose coupling* by ensuring that instead of components referring to each other explicitly, their interaction is handled through this *central point*.
2. The mediator extracts the workflow from the implementation details and *creates a more natural abstraction at a higher level*, showing us at a much faster glance what that workflow is.

## Benefits of Mediator Pattern

1. It reduces the communication channels needed between objects or components in a system from many to many to just *many to one*.

## Drawbacks of Mediator Pattern

1. It can introduce a *single point of failure*. (Although, at the end of the day, tight coupling causes all kinds of headaches and this is just another alternative solution, but one which can work very well if implemented correctly). 
