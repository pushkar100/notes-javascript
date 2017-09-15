/* Custom Implementation of Promises/Deferred behavior in JS and jQuery: */

function Async() {
	/* Private: */
	function _executeCallbacks(type, args) {
		var i = _callbacksQueue[type].length;
		args = Array.prototype.slice.call(args);
		while(i--) {
			_callbacksQueue[type][i].apply(null, args);
		}
		_callbacksQueue[type] = []; // Clear Queue after executing all of them
	}
	var _callbacksQueue = {
		success: [],
		failure: [],
		always: []
	};

	/* Public: */
	this.success = function(callback) {
		_callbacksQueue.success.push(callback);
		return this;
	};
	this.failure = function(callback) {
		_callbacksQueue.failure.push(callback);
		return this;
	};
	this.always = function(callback) {
		_callbacksQueue.always.push(callback);
		return this;
	};
	this.resolve = function() {
		_executeCallbacks('success', arguments);
		_executeCallbacks('always', arguments);
	};
	this.reject = function() {
		_executeCallbacks('failure', arguments);
		_executeCallbacks('always', arguments);
	};
}

/* Demo(Example usage): */
function asyncFunction() {
	var async = new Async();
	/* Mimic some delay like in real async functions: */
	setTimeout(function() {
		async.resolve();
	}, 5000);
	return async;
}
a = asyncFunction();
a.success(function() {
	console.log('success cb');
}).failure(function() {
	console.log('failure cb');
}).always(function() {
	console.log('always cb');
});
