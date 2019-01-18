/* STACKS: */

/* Philosophy: Last In First Out (LIFO) */
/* Description: Last item "push"-ed onto stack is the first item that is "pop"-ed off from it */
/* Example: The function call stack in JS engines */
/* Interface:
1. push(): Add item to the top of stack (If full => Overflow condition) [O(1)]
2. pop(): Removes item from stack top (If empty => Underflow condition) [O(1)]
3. peek(): Read the top element of stack [O(1)]
4. size(): Returns size of a stack [O(1)] (Use array.length in JS [or] every addition/deletion update length)
5. isEmpty(): Returns true if stack is empty [O(1)] (Use array.length in JS [or] every addition/deletion update length)
*/

/* Implementation: */
var Stack = function() {
	this.storage = [];
}

Stack.prototype.push = function (val) {
	this.storage.push(val);
}
Stack.prototype.pop = function () {
	return this.storage.pop(); 
}
Stack.prototype.peek = function () {
	return this.storage[this.storage.length - 1];
}
Stack.prototype.size = function () {
	return this.storage.length;
}
Stack.prototype.isEmpty = function () {
	return this.storage.length === 0;
}

/* Testing: */
var aStack = new Stack();
aStack.push(5);
aStack.push(3);
aStack.push(4);
console.log(aStack.peek()); // 4
aStack.push(10);
console.log(aStack.size()); // 4
console.log(aStack.isEmpty()); // false
aStack.pop();
aStack.pop();
console.log(aStack.size()); // 2
aStack.pop();
console.log(aStack.peek()); // 5
aStack.pop();
console.log(aStack.size()); // 0
console.log(aStack.isEmpty()); // true
