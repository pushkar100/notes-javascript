/* STACKS: */

/* Challenge: Do NOT use arrays */
/* Therefore: Use objects! */

var Stack = function(max) {
    this.capacity = max || Infinity;
    this.count = -1;
	this.storage = {};
}

Stack.prototype.push = function (val) { // O(1)
    if(this.count < (this.capacity - 1)) {
        this.storage[++this.count] = val;
    } else {
        return "Stack Overflow";   
    }
}
Stack.prototype.pop = function () { // O(1)
    var val;
    if(this.count >= 0) {
        val = this.storage[this.count];
        delete this.storage[this.count--];
        return val;
    } else {
        return "Stack Underflow";
    }
}
Stack.prototype.peek = function () { // O(1)
    return this.storage[this.count];
}
Stack.prototype.size = function () { // O(1)
    return this.count + 1;
}
Stack.prototype.isEmpty = function () { // O(1)
    return this.count === -1 ? true : false
}

/* Testing: */
var aStack = new Stack(4);
aStack.push(5);
aStack.push(3);
aStack.push(4);
console.log(aStack.peek()); // 4
aStack.push(10);
console.log(aStack.size()); // 4
console.log(aStack.push(20)); // Stack Overflow
console.log(aStack.isEmpty()); // false
aStack.pop();
aStack.pop();
console.log(aStack.size()); // 2
aStack.pop();
console.log(aStack.peek()); // 5
aStack.pop();
console.log(aStack.size()); // 0
console.log(aStack.pop()); // "Stack Underflow"
console.log(aStack.isEmpty()); // true
