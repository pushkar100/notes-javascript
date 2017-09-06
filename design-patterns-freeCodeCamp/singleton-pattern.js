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

