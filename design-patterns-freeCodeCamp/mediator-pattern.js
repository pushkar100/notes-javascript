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
From: ganga | To: ganga | Message: Hi, Joel!
*/