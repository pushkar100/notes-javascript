# JavaScript DOM Manipulation

My notes from a 4 part crash course on the DOM and its manipulation using JS (*Traversy Media Youtube channel*). It also includes additional information based on MDN and StackOverFlow resources.

[Link to the Playlist on Youtube](https://www.youtube.com/watch?v=0ik6X4DJKCc&list=PLillGF-RfqbYE6Ik_EuXA2iZFcE082B3s)

Missing content from the above listed course has been covered by the following ones:
- [NetNinja JS DOM Playlist](https://www.youtube.com/playlist?list=PL4cUxeGkcC9gfoKa5la9dsdCNpuey2s-V)
- [The Modern JavaScript Tutorial - Part 2: Browser: Document, DOM, Interfaces](http://javascript.info/)

## Examining the `document` object

```javascript=
console.dir(document); // View inside the object (its methods & props)
console.log(document); // View the inner HTML
console.log(document.domain);  // Domain name of the site/page
console.log(document.URL); // Entire URL of the page
console.log(document.doctype); // Ex: '<!DOCTYPE html>'

console.log(document.title); // Prints the title of the page (whatever is present inside <title> tags)
// If <title> changes then document.title will reflect the change too.
```

#### **1.** `document` properties are **NOT** read-only. They can be changed.
```javascript=
document.title = 123;
console.log(document.title); // 123 (& text inside <title> also changes)
```

#### **2.** `document` has reference to `head` and `body`:
```javascript=
console.log(document.head);
console.log(document.body);
```

#### **3.** Just like other elements, it has event listeners:
```javascript=
document.onkeypress = function() { 
    console.log(1); // Logs 1 every time a key is pressed
};
```

#### **4.** `document.all` is an *HTML collection* (array-like structure). It contains a reference to all the elements on the page in the order they are written
```javascript=
console.log(document.all);
console.log(document.all[10]); // Ex: <h1 class="hdr"><h1>
document.all[10].
    = 'Hello'; // Again, it is NOT read-only
console.log(document.all[10]); // Ex: <h1 class="hdr">Hello<h1>
```
Any element added to the DOM gets referenced in `document.all`. It is **not** a good practice to use `document.all` to fetch or edit elements since their positions (indices) will change when elements are added or deleted.

#### **5.** Fetching *forms*, *images*, *scripts*, *links*, etc from `document`. Returns an **HTML Collection** (array-like structure).
```
console.log(document.forms); // gets all the forms in the order they appear
console.log(document.scripts); // gets all the scripts in the order they appear
console.log(document.links); // gets all the links in the order they appear
console.log(document.images); // gets all the images in the order they appear
```

## JavaScript Selectors and Their Properties & Methods (Fetching DOM Elements)

#### **1.** Fetch Element by ID (`getElementById(<id>)`):
```javascript=
var headerTitle = document.getElementById('header-title');
console.log(headerTitle); // <h1 id="header-title">Item Lister <span>123</span></h1>
console.log(headerTitle.textContent); // "Item Lister 123"
console.log(headerTitle.innerText); // "Item Lister"
headerTitle.innerHTML = '<h3>Hello</h3>';
console.log(headerTitle); // <h1 id="header-title"><h3>Hello</h3></h1>
```

Difference between `textContent` and `innerText`: The former will output the text of all the child elements also (concatenated) but the latter outputs only the text of the outer (selected) element.

[Differences between `textContent` and `innerText`](https://stackoverflow.com/questions/24427621/innertext-vs-innerhtml-vs-label-vs-text-vs-textcontent-vs-outertext)

`innerHTML` replaces the HTML *inside* the selected element with what is supplied. `outerHTML` replaces the selected element itself (the whole element).

`textContent`, `innerText`, `innerHTML`, and `outerHTML` act as both *setters* and *getters*. If we supply a value, it sets it. If we do not assign but use/return these properties, we will have access to their values.

**Note:** **Changing Styles (CSS)**. We use the `style` property on the DOM element(s) (selected). We need to use *camel case* for the CSS properties (since '-' cannot be used within property names). The styles are added to the **style attribute** of the element(s).
```javascript=
// syntax: <selectedElement(s)>.style.<cssPropertyInCamelCase> = '<property rule(RHS)>';

var header = document.getElementById('main-header');
header.style.borderBottom = '1px solid #0d426c';
```

#### **2.** Fetch Elements by Class (`getElementsByClassName(<className>)`):
```javascript=
var items = document.getElementsByClassName('list-group-item'); // Fetches all '.list-group-item' elements
console.log(items); // lists all the matched DOM elements (as an HTMLCollection)
console.log(items[1]); // Lists the second DOM element that was matched (0 based index)

items[1].style.backgroundColor = '#FF0'; // Change background color of 2nd matched item to '#FF0'
items[2].textContent = 'I am third on the list'; // Changes text of the 3rd matched element
console.log(items[2].textContent); // 'I am the third on the list'

items.style.backgroundColor = '#C00'; // Error! 'items' is an HTMLCollection of DOM elements (not DOM itself)
```

**Note:** 
1. DOM element properties such as `textContent`, `innerText`, `innerHTML`, `outerHTML` etc can be used upon *any selected DOM element*, it does not matter if it was selected using id/class/any other method.
2. **Adding/Fetching common properties from all elements of an HTMLCollection**: We have to loop through the elements of the collection (collection comes with a `length` property). Every index contains a DOM element upon which we can work (Useful for methods that return a collection of DOM elements, such as `getElementsByClassName`).
```javascript=
var items = document.getElementsByClassName('list-group-item'); 
for(var i = 0; i < items.length; i++) {
	items[i].style.fontStyle = 'italic';
}
```

#### **3.** Fetch Elements by Tag Name (`getElementsByTagName(<tagName>)`): 

It is very similar to `getElementsByClassName` but it selects all elements of a certain type (i.e by html tags).

```javascript=
var li = document.getElementsByTagName('li'); // Fetches all 'li' tag elements
console.log(li); // lists all the matched DOM list elements (as an HTMLCollection)
console.log(li[1]); // Lists the second DOM list element that was matched (0 based index)

li[1].style.backgroundColor = '#FF0'; // Change background color of 2nd matched list item to '#FF0'
li[2].textContent = 'I am third on the list'; // Changes text of the 3rd matched list element
console.log(li[2].textContent); // 'I am the third on the list'

// li.style.backgroundColor = '#C00'; // Error! 'items' is an HTMLCollection of DOM elements (not DOM itself)

// Applying/fetching common properties/methods on all list items:
var li = document.getElementsByClassName('li'); 
for(var i = 0; i < li.length; i++) {
	li[i].style.fontStyle = 'italic';
}
```

#### **4.** Fetch Elements by Using Query Selector (`querySelector(<css-Selector>)`): 

`querySelector()` is very similar to jquery's `$()` or `jquery()`. That is, it takes in CSS selectors as input ('#', '.', '\[\]', etc). The difference between this and `$()` is that `$()` selects all the matching elements (like an HTMLCollection) but `querySelector()` matches **only one element (first match)**. Therefore, `querySelector()` returns a **DOM element**(not HTMLCollection), similar to `getElementById`.

```javascript=
var header = document.querySelector('#main-header');
header.style.color = '#0d426c';

var input = document.querySelector('input'); // Will select only the 1st input (even if there are more)
input.value = 'Hello World'; // We 
```

**Note:** **Accessing Attributes of DOM Elements (set & get):**
We can access attributes of a DOM element with the attribute name (using the 'dot' reference). Syntax: `<DOMElement>.<Attribute>` (get) and `<DOMElement>.<Attribute> = <Value>;` (set).

```javascript=
var submit = document.querySelector('input[type="submit"]'); // selects only the submit input (if there is only one)
submit.value = 'SEND';
```

We can use **Pseudo Selectors** to match the exact element with `querySelector()` (Not just the first match):
```javascript=
var item = document.querySelector('.list-group-item'); // gets only the first item
item.style.color = 'red'; // changes 

// Pseudo selectors last-child, first-child and nth-child(n):
var lastItem = document.querySelector('.list-group-item:last-child');
lastItem.style.color = 'blue'; 

var secondItem = document.querySelector('.list-group-item:nth-child(2)');
secondItem.style.color = 'green';
```

#### **5.** Fetch All Elements by Using Query Selector All (`querySelectorAll(<css-Selector>)`): 

This, again, is similar to `$()` and `querySelector()`. The difference is that it returns a **list** of matched elements (Not just the first match like in `querySelector()`). But, it is not the same as `$()` since it returns a **`NodeList`**. The NodeList is an array (not HTMLCollection) because we can invoke array methods like `reverse()` on it (not just length property).

- `$()`: Returns `Object`
- `querySelector()`: Returns a DOM element (first match)
- `getElementById()`: Returns a DOM element
- `getElementsByClassName()` & `getElementsByTagName()`: Returns `HTMLCollection` object(array-like).
- `querySelectorAll()`: Returns a `NodeList` (An Array).

```javascript=
var titles = document.querySelectorAll('.title');
console.log(titles); // logs a NodeList containing all the matched DOM elements
titles[0].textContent = 'Hello';
```

A more useful example:
```javascript=
var odd = document.querySelectorAll('li:nth-child(odd)');
var even = document.querySelectorAll('li:nth-child(even)');
for(var i = 0; i < odd.length; i++) {
	odd[i].style.backgroundColor = '#dfe1e8';
	even[i].style.backgroundColor = '#ccc';
}
```

## Traversing the DOM

Sample HTML for the examples that follow:
```htmlmixed=
<body>
  <header id="main-header" class="bg-success text-white p-4 mb-3">
    <div class="container">
      <h1 id="header-title">Item Lister <span style="display:none">123</span></h1>
    </div>
  </header>
  <div class="container">
   <div id="main" class="card card-body">
    <h2 class="title">Add Items</h2>
    <form class="form-inline mb-3">
      <input type="text" class="form-control mr-2">
      <input type="submit" class="btn btn-dark" value="Submit">
    </form>
    <h2 class="title">Items</h2>
    <ul id="items" class="list-group">
      <li class="list-group-item">Item 1</li>
      <li class="list-group-item">Item 2</li>
      <li class="list-group-item">Item 3</li>
      <li class="list-group-item">Item 4</li>
    </ul>
    <span></span>
   </div>
  </div>

  <script src="dom.js"></script>
</body>
```

#### **1.** Fetching the Parent Node of an Element (`parentNode`):

We can use the `parentNode` property that comes with every element. Also, this property can be **chained** in order to fetch the ancestors.

```javascript=
var itemsList = document.querySelector('#items');
console.log(itemsList.parentNode); // parent of '#items' element is '#main' element

itemsList.parentNode.style.backgroundColor = '#f4f4f4'; // parent node is a DOM too!

itemsList.parentNode.parentNode; // returns '.container' DOM element
itemsList.parentNode.parentNode.parentNode; // returns 'body' DOM element
```

Alternative to `parentNode`: **`parentElement`**

`parentElement` is new to Firefox 9 and to DOM4, but it has been present in all other major browsers for ages.

In most cases, it is the **same** as `parentNode`:
```javascript=
var itemsList = document.querySelector('#items');
console.log(itemsList.parentElement); // parent of '#items' element is '#main' element

itemsList.parentElement.style.backgroundColor = '#f4f4f4'; // parent node is a DOM too!

itemsList.parentElement.parentElement; // returns '.container' DOM element
itemsList.parentElement.parentElement.parentElement; // returns 'body' DOM element
```

The only **difference** comes when a node's parentNode is **not an element**. If so, `parentElement` is `null`:
```javascript=
document.body.parentNode; // the <html> element
document.body.parentElement; // the <html> element

document.documentElement.parentNode; // the document node
document.documentElement.parentElement; // null
```

Since the `<html>` element (`document.documentElement`) doesn't have a parent that is an element, `parentElement` is `null`. (There are other, more unlikely, cases where `parentElement` could be `null`, but you'll probably never come across them.)

**Use `parentNode` for all practical purposes.**

#### **2.** Fetching the Child Nodes of an Element (`childNodes`):

`childNodes` property of an element returns a list of all the child nodes (as a `NodeList`) in the order they appear.
```javascript=
var itemsList = document.querySelector('#items');
console.log(itemsList.childNodes); // all child nodes including text nodes.
// Ex: (9) [text, li.list-group-item, text, li.list-group-item, text, li.list-group-item, text, li.list-group-item, text]
```

The **problem** with `childNodes` is that it will return even text nodes. For example, if there is space (or newline or tab) between child elements, they are also returned as an element of the list.

Alternative to `childNodes`: **`children`**

`children` returns only the HTML elements and **not** text nodes. The difference, however, is that it is an `HTMLCollection` (and not a `NodeList`).

```javascript=
var itemsList = document.querySelector('#items');
console.log(itemsList.children); // html collection of all child elements (excluding text nodes)
console.log(itemsList.children[1]); // log the second child
itemsList.children[1].style.backgroundColor = 'yellow'; // every childElement is a DOM element as well.
```

**Use `children` for all practical purposes.**

**Fetching specific child nodes:**
1. Fetching the First Child Node:
    - Use `firstChild` but this will again return a text node (say, space/newline) if it is the first child. 
    - Therefore, use `firstElementChild` property instead (Will always match an element node and not text).
```javascript=
var itemsList = document.querySelector('#items');
console.log(itemsList.firstChild); // '> #text'
console.log(itemsList.firstElementChild); // logs the first child of '#items'
itemsList.firstElementChild.style.backgroundColor = 'teal'; // first element child is a DOM element too!
```

2. Fetching the Last Child Node:
    - Use `lastChild` but this will again return a text node (say, space/newline) if it is the last child. 
    - Therefore, use `lastElementChild` property instead (Will always match an element node and not text).
```javascript=
var itemsList = document.querySelector('#items');
console.log(itemsList.lastChild); // '> #text' (the last text before tag close)
console.log(itemsList.lastElementChild); // logs the first child of '#items'
itemsList.lastElementChild.style.backgroundColor = 'red'; // last element child is a DOM element too!
```

#### **3.** Fetching Sibling DOM Elements

1. To fetch the next sibling, use `nextSibling` but once again, it has a drawback - matches text nodes also. Therefore, use `nextElementSibling` instead!
2. To fetch the previous sibling, use `previousSibling` but again, it has a drawback - matches text nodes also. Therefore, use `previousElementSibling` instead!

```javascript=
var itemsList = document.querySelector('#items');
console.log(itemsList.nextSibling); // '> #text'
console.log(itemsList.nextElementSibling); // logs '<span></span>' DOM element
console.log(itemsList.previousSibling); // '> #text'
console.log(itemsList.previousElementSibling); // logs '<h2 class="title">Items</h2>' DOM element
itemsList.previousElementSibling.style.backgroundColor = '#f4f4f4'; // nextElementSibling & previousElementSibling are DOM elements too!
```

## Creating New Elements and Inserting into DOM

#### **1.** Creating an element node `document.createElement()`:

- Use `document.createElement()` method. It creates the HTML element specified by tagName.
- Set `class` name and `id` to created nodes with `className` and `id` properties (get/set).

```javascript=
var newDiv = document.createElement('div');
console.log(newDiv); // <div></div>

newDiv.className = 'header-info';
console.log(newDiv); // <div class="header-info"></div>

newDiv.id = 'subheader';
console.log(newDiv); // <div class"header-info" id="subheader"></div>
```

#### **2.** Setting and Getting Attributes:

We can set and get attributes for any DOM element using `setAttribute(<attr-name>, <attr-value>)` and `getAttribute(<attr-name>)`.

```javascript=
newDiv.setAttribute('title', 'List of items');
console.log(newDiv); // <div class"header-info" id="subheader" title="List of items"></div>
newDiv.getAttribute('title'); // "List of items"
```

Two other ways to set and get attributes:
```javascript=
// 1. Dot method: Only if property name does not contain dashes/spaces/etc.
newDiv.customAttr = 'Hi';
console.log(newDiv); // Does not show customAttr in the log (Since customAttr is a "property" (not attr.))
console.log(newDiv.customAttr); // "Hi"

// 2. Square Bracket Notation: Works in any case:
newDiv['newAttr'] = 'bye';
console.log(newDiv); // Does not show newAttr in the log (Since customAttr is a "property" (not attr.))
console.log(newDiv['newAttr']); // "bye"
```

**Note:** 
1. To set the`class` of the element, you have to use `className` as attribute name instead.
2. Properties vs Attributes: **Attributes are defined by HTML**. **Properties are defined by DOM**. Some HTML attributes have 1:1 mapping onto properties. `id` is one example of such. But, custom attributes that we add are actually "properties". Hence, `customAttr` and `newAttr` above were properties.

#### **3.** Creating Text Nodes:

Use `document.createTextNode(<text>)`.

```javascript=
var text = document.createTextNode('Listing items');
text.textContent; // Listing items
```

#### **4.** Appending Nodes to an Element (`appendChild()`):
```javascript=
newDiv.appendChild(text);
console.log(newDiv); // <div class"header-info" id="subheader">Listing items</div>
```
#### **5.** Inserting Newly Created DOM Element @ Specific Position (`<parent>.insertBefore()`):

Use `<parentElement>.insertBefore(<newelementtoinsert>, <existingnode>)`. It places the new element before the existing node within that parent.

```javascript=
var container = document.querySelector('header .container');
var h1 = document.querySelector('header h1');
container.insertBefore(newDiv, h1); // inserts newDiv inside 'header .container' and before 'header h1'.
```

**Note:**
1. There is no `Node.insertAfter()` DOM function in Javascript (jQuery has it).
2. `ParentNode.prepend(nodesToPrepend);` is like an alternative to appendChild(). **It is experimental, only available in new DOM versions (do not use it just yet)**.

#### **6.** Removing Child Nodes from DOM

We can remove a child node by calling `removeChild` on its parent node. (`appendChild()` & `removeChild()` can be used together)

```javascript=
var mainHeader = document.querySelector('#main-header .container'),
	headerTitle = document.getElementById('header-title');
mainHeader.removeChild(headerTitle);
```
The child element must be a **direct child** of the parent node.

## Adding Event Listeners

Handling click, hover, blur, etc events on DOM elements.

#### **1.** Old way of adding event listeners (still works):

We can have an attribute, say `onclick`, on the DOM element and pass it either some JS expression to execute or a JS function to handle it.
```htmlmixed=
<button id="button" onclick="hey()">Click me<button> <!-- calls some JS function 'hey' when clicked -->
<button id="new-button" onclick="alert(1)">Annoy yourself<button> <!-- Alerts 1 every time you click -->
```

#### **2.** Using `addEventListener` method:

We want to keep markup and functionality separate (so method 1 should not be used, ideally). `addEventListener` is a method on an HTML element which accepts two parameters: (a) Event type (string) and (b) Callback function (reference to it). It can have an optional third parameter.

```javascript=
var button = document.getElementById('button');
button.addEventListener('click', function() { // Setting function expression as callback
    console.log('You clicked me!'); 
});

// We can also use the function handle/reference:
button.addEventListener('mouseover', hoverHandler); 
function hoverHandler() { 
    console.log('Try clicking me'); 
} 
```

**Note:**
Whenever an event occurs, an event object holds the details to it. This events object is *passed* to our callback function (listener) as the *first parameter*. We can name it anything we want but it's usually `e` or `event`. We can log it to see all its properties. 

One of the most important properties of the event object is `target` which holds the DOM element that caused the event to get triggered (target of the event).

```javascript=
// <button id="button" class="btn btn--s">Click me</button>
var button = document.getElementById('button');
button.addEventListener('click', function(e) { 
	console.log(e); // Ex: '> MouseEvent {isTrusted: true, clientX: 294, clientY: 365, …}
	console.log(e.target); // Ex: Logs the '#button' DOM element
    console.log(e.target.id); // "button" (target is just like any other DOM element!)
    console.log(e.target.className); // 'btn btn--s' (the whole string of class attribute)
});
```

**Note:** 
1. If you want to access the class names *"one-by-one"* then you should use the `classList` property of a DOM element. This returns an **array** where each element is a class name.
```javascript=
console.log(e.target.classList); // Ex: ["btn", "btn-dark", "btn-block", value: "btn btn-dark btn-block"]
```

List of all the events (reference): [MDN Page](https://developer.mozilla.org/en-US/docs/Web/Events)

**Note 1:** More event properties:
1. `e.type` will tell us what event occurred (Ex: 'click' for a `click` event).
2. `e.clientX` will give the mouse x-axis position for that event from the `window`.
3. `e.clientY` will give the mouse y-axis position for that event from the `window`.
4. `e.offsetX` will give the mouse x-axis position for that event from the current DOM element `e.target`.
5. `e.offsetY` will give the mouse y-axis position for that event from the current DOM element `e.target`.

```javascript=
var button = document.getElementById('button');
button.addEventListener('click', function(e) { 
	console.log(e.clientX, e.clientY); // Ex: 459 339
	console.log(e.offsetX, e.offsetY); // Ex: 352 -1
	console.log(e.type); // click
});
```

**Note 2:** Checking if `alt`, `ctrl` or `shift` keys were pressed during the event (Useful if we want to implement a different functionality for a click):
1. `e.altKey`: `true` if alt key was pressed during event.
2. `e.ctrlKey`: `true` if ctrl key was pressed during event.
3. `e.shiftKey`: `true` if shift key was pressed during event.
```javascript=
var button = document.getElementById('button');
button.addEventListener('click', function(e) { 
	console.log(e.altKey);
	console.log(e.ctrlKey);
	console.log(e.shiftKey);
});
```

**Note 3:** Mouse events:
1. `click` (Single click)
2. `dblclick` (Double click)
3. `mousedown` (Similar to click but triggered as soon as the mouse is pressed)
4. `mouseup` (Similar to click but triggered only when a pressed mouse is released)
5. `mouseenter` (Triggered when mouse enters target element - not triggered for entering child elements)
6. `mouseover` (Triggered when mouse enters target element - triggered for entering child elements also)
7. `mouseleave` (Triggered when mouse leaves target element - not triggered when leaving child elements)
8. `mouseout` (Triggered when mouse leaves target element - triggered when leaving child elements also)
9. `mousemove` (Triggered whenever the mouse moves inside the target element. So as long as we are moving the mouse inside the element, it keeps getting triggered. We can use `e.clientX`, `e.offsetY`, etc to get mouse position)

Check the differences with these examples:
```javascript=
// <div id="box" style="width: 500px; height: 300px">
//     <h1>Hello</h1>
// </box>
var box = document.getElementById('box');
box.addEventListener('mouseenter', logEvent); 
box.addEventListener('mouseover', logEvent); 
function logEvent(e) {
	console.log(e.type);
}
```

```javascript=
// <div id="box" style="width: 500px; height: 300px">
//     <h1>Hello</h1>
// </box>
var box = document.getElementById('box');
box.addEventListener('mouseleave', logEvent); 
box.addEventListener('mouseout', logEvent); 
function logEvent(e) {
	console.log(e.type);
}
```

`mousemove` event example:
```javascript=
var box = document.getElementById('box');
box.addEventListener('mousemove', changePageColor); 
function changePageColor(e) {
	console.log(e.type);
	console.log(e.offsetX, e.offsetY);
	document.body.style.backgroundColor = 'rgb(' + e.offsetX + ', ' + e.offsetY + ', 40)';
}
```

**Note 3:** Input & Keyboard events:

Input & Keyboard events usually go together since we type into the inputs and forms.

The keyboard events are as follows: 
1. `keydown` (Triggered when key is pressed down)
2. `keyup` (Triggered when pressed key is released)
3. `keypress` (Triggered once when key is pressed)

```javascript=
var input = document.querySelector('input[type="text"]');
input.addEventListener('keypress', logEvent);
function logEvent(e) {
	console.log(e.type, e.keyCode, String.fromCharCode(e.keyCode));
    if(String.fromCharCode(e.keyCode) === 'a') {
        console.log('You pressed "a"');
    }
}
```

`e.keyCode` will return a numeric value which is a map to a character.
If you want the ASCII character from the code, use `String.fromCharCode(e.keyCode)` (calling a function directly from the `String` prototype which converts numeric key to corresponding ASCII character.

[ASCII and Key Codes mapping](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)

The input box events are as follows:
1. `focus` (Triggered when you click into the input - brings input into focus (if not already focused))
2. `blur` (Triggered when you click out of the input and it was in focus prior to it)
3. `change` (Triggered when value inside input changes(edited). Gets triggered when you change some text and click out of the input (i.e blur))
4. `cut` (Triggered when you cut some text from input)
5. `cut` (Triggered when you copy some text from input)
6. `paste` (Triggered when you paste something into the input)
7. `input` (Triggered whenever any of the above input events, except focus and blur, are triggered.

```javascript=
var input = document.querySelector('input[type="text"]');
input.addEventListener('focus', logEvent);
input.addEventListener('blur', logEvent);
function logEvent(e) {
	console.log(e.type);
}
```

```javascript=
var input = document.querySelector('input[type="text"]');
input.addEventListener('change', logEvent);
function logEvent(e) {
	console.log(e.type);
	console.log(e.target.value);
}
```

```javascript=
var input = document.querySelector('input[type="text"]');
input.addEventListener('cut', logEvent);
input.addEventListener('copy', logEvent);
input.addEventListener('paste', logEvent);
function logEvent(e) {
	console.log(e); // logged as ClipboardEvent
	console.log(e.type); // cut or copy or  paste

	var clipboardData = e.clipboardData || window.clipboardData; // window.clipboardData is like backup(?)
    console.log(clipboardData.getData('Text')); // works only with paste
}
```

```javascript=
// Another copy example:
document.addEventListener('copy', function(e){
    e.clipboardData.setData('text/plain', 'Hello, world!');
    e.clipboardData.setData('text/html', '<b>Hello, world!</b>');
    e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
});
```

**Note 4:** Select Input (Dropdown) events:

The usual input events get triggered for a select (dropdown) element too (Whichever is applicable). The most common event that we will be needing is the `change` event. Whenever a different dropdown \<option\> is chosen from the \<select\>, the `change` event gets triggered. The selected value is accessible with `e.target.value`.

```javascript=
var select = document.querySelector('select');
select.addEventListener('change', logEvent);
function logEvent(e) {
	console.log(e.type, e.target.value); // logs: change <value-of-selected-input>

}
```

**Note 5:** Form Submit event:
Whenever a form submit happens (click on `input[type="submit"]` button), we can listen to it by attaching a handler to the `submit` event of that form.

A point to note is that the form's default action is to submit the form to the specified page (if page is the same, it reloads). We do not want this behavior in the submit event listener, especially if we are going to submit the form ourselves (via ajax).

Use `e.preventDefault()` to stop the default action from occurring (For form it is submit to specified page, for links it is to open the specified page, etc.)

```javascript=
var form = document.querySelector('form');
form.addEventListener('submit', logEvent);
function logEvent(e) {
	e.preventDefault(); // if this was not there, default behavior of form submit takes place
	console.log(e.type);
}
```

**`e.preventDefault()` vs `e.stopPropagation()` vs `return false;`**
1. `e.preventDefault()` – It stops the browsers default behaviour.
2. `event.stopPropagation()` – It prevents the event from propagating (or “bubbling up”) the DOM (To either unexecuted event listeners on the same DOM element or to the event listeners of the parent/ancestors (bubbling)).
3. `return false;` - Does both `e.preventDefault()` and `event.stopPropagation()`. It also stops current callback execution and returns immediately when called.

---

## `DOMContentLoaded` vs `jQuery.ready` vs `load`

The above are different page load triggers (`ready` is a jquery utility; listed for comparison).

MDN Definition of `DOMContentLoaded`:
> The DOMContentLoaded event is fired when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading. A very different event load should be used only to detect a fully-loaded page. It is an incredibly popular mistake to use load where DOMContentLoaded would be much more appropriate, so be cautious.

Synchronous JavaScript **pauses** parsing of the DOM. Maybe we can place our script at the end of the body or use `async` or `defer` attributes. `jQuery(document).ready()`.

MDN Definition of `load`:
> The load event is fired when a resource and its dependent resources have finished loading.

`jQuery.ready` / `DOMContentLoaded` occurs when all of the HTML is ready to interact with, but often before its been rendered to the screen.

The `load` event occurs when all of the HTML is loaded, and any subresources like images are loaded.

[Codepen example](https://codepen.io/LukeAskew/pen/LnJsE)

Most Often, to work with HTML elements, we wait for the DOM to be parsed (HTML constructed) and then do all our computation:
```javascript=
window.addEventListener('DOMContentLoaded', function(){
    // Fetch , add, append, remove, add listeners, etc. 
});

// jQuery equivalent code:
jQuery.ready(function(){
  document.querySelector('#my-awesome-el').innerHTML = new Date
});
// OR
$(function(){
  document.querySelector('#my-awesome-el').innerHTML = new Date
});
```

Run When All Images And Other Resources Have Loaded:
```javascript=
window.addEventListener('load', function(){
  // Everything has loaded!
});
```

**Note:** `load` event need not be called only on the window (calling it on window makes sure to execute callback only after *all the resources have finished loading*). We can call it on a **specific element** as well (For example, we can call it on an \<img\> DOM element, waiting for it to load).
```javascript=
document.querySelector('img.my-image').addEventListener('load', function(){
  // The image is ready!
});
```

**Note:** Changes you make in your JavaScript code often don't actually render to the page immediately. In the interest of speed, the browser often waits until the *next event loop cycle* to render changes. Alternatively, it will wait until you request a property which will likely change after any pending renders happen. If you need that rendering to occur, you can either *wait* for the next event *loop tick* or *request a property* which is known to **trigger a render of anything pending**:
```javascript=
el.offsetHeight // Trigger render

// el will have rendered here
```

---

# Javascript.info DOM & BOM (Part 2)

A host environment provides platform-specific objects and functions additionally to the language core.

In the browser, there is a “root” object called `window`. It has two roles:
1. It is a global object for JavaScript code.
2. It represents the “browser window” and provides methods to control it.

![Window object](http://javascript.info/article/browser-environment/windowObjects@2x.png)

## Document Object Model (DOM)

The `document` object gives access to the page content. We can change or create anything on the page using it.

The first version was “DOM Level 1”, then it was extended by DOM Level 2, then DOM Level 3, and now it’s **DOM Level 4**.

**Note:**
1. DOM is *not only* for browsers. For example, server-side tools that download HTML pages and process them. They may support only a part of the DOM specification though.
2. **CSSOM** for styling. CSSOM is rarely required, because usually CSS rules are static.

## Browser Object Model (BOM)

Browser Object Model (BOM) are additional objects provided by the browser (host environment) to work with everything except the document.

1. `navigator` object provides background information about the browser and the operation system. `navigator.userAgent` – about the current browser, and `navigator.platform` – about the platform (can help to differ between Windows/Linux/Mac etc.
2. `location` object allows to read the current URL and redirect the browser to a new one. Ex: `location.href = 'https://wikipedia.org'; // redirect the browser to another URL
}`
3. Functions `alert`/`confirm`/`prompt`/`setTimeout` are also a part of BOM: not related to the document, but represent pure browser methods of communicating with the user.

[MOZILLA RESOURCE FOR JS, DOM, & BOM]( https://developer.mozilla.org/en-US/search)

## DOM In Detail

- Every HTML-tag is an **object**. Tags are called *element nodes* (or just elements)
- Nested tags are called “children” of the enclosing one.
- The text inside a tag it is an object as well. A text node contains *only a string*. It may not have children and is always a *leaf* of the tree.
- All these objects are accessible using JavaScript.

The DOM represents HTML as a **tree structure of tags.**

**Text Nodes:** (`#text`)
1. Spaces and newlines – are totally valid characters, they form text nodes and become a part of the DOM.
2. There are two top-level text node **exclusions**:
    - Spaces and newlines before `<head>` are ignored.
    - If we put something after `</body>`, then that is automatically moved inside the body (Applies to non-text nodes also). So there may be no spaces after `</body>`.

**Browser Autocorrection:** (`#comment`)
1. If the browser encounters malformed HTML, it automatically corrects it when making DOM.
2. The top tag is always `<html>`. Even if it doesn’t exist in the document – it will be in DOM, the browser will create it. The same about `<body>`. Example: if the HTML file is a single word "Hello", the browser will wrap it into `<html>` and `<body>`, add the required `<head>`.
3. `<table>` must have `<tbody>` according to specs, but HTML text may (officially) omit it. Then the browser creates `<tbody>` in DOM automatically.
4. Everything in HTML, even `<!-- -->` "comments" (`#comment`), becomes a part of DOM.

**Summary:**
There are **12** node types. In practice we usually work with 4 of them:

1. `document` – the “entry point” into DOM.
2. element nodes – HTML-tags, the tree building blocks.
3. text nodes – contain text.
4. comments – sometimes we can put the information there, it won’t be shown, but JS can read it from DOM.

[Live DOM viewer](http://software.hixie.ch/utilities/js/live-dom-viewer/)

## Walking the DOM

A picture depicting links to traverse DOM:

![DOM Traversal Picture](http://javascript.info/article/dom-navigation/dom-links@2x.png)

Important Mappings:
- `<html>` = `document.documentElement`
- `<body>` = `document.body`
- `<head>` = `document.head` (Not shown in diagram)

The body element does not exist until it is parsed by browser:
```htmlmixed=
<html>
    
<head>
  <script>
    alert( "From HEAD: " + document.body ); // null, there's no <body> yet (Doesn't exist)
  </script>
</head>

<body>

  <script>
    alert( "From BODY: " + document.body ); // HTMLBodyElement, now it exists
  </script>

</body>
</html>
```

### Child Nodes & Descendants

1. The `childNodes` collection (an **HTMLCollection**) provides access to all child nodes, including text nodes.

```htmlmixed=
<html>
<body>
  <div>Begin</div>

  <ul>
    <li>Information</li>
  </ul>

  <div>End</div>

  <script>
    for (let i = 0; i < document.body.childNodes.length; i++) {
      alert( document.body.childNodes[i] ); // Text, DIV, Text, UL, ..., SCRIPT
    }
  </script>
  ...more stuff...
</body>
</html>
```

2. Properties `firstChild` and `lastChild` give fast access to the first and last children.

```javascript=
elem.childNodes[0] === elem.firstChild
elem.childNodes[elem.childNodes.length - 1] === elem.lastChild
```

3. Check if a Node has Child Nodes: `elem.hasChildNodes()` checks whether there are any child nodes.

**A Note On HTMLCollections**:
1. They are "array-like" but not arrays. It will have a `length` property though.
2. Other array methods won’t work (Ex: `filter`), because it’s not an array. 
3. DOM collections are **read-only**. `childNodes[i] = ....` will not replace it (error!).
4. **Important** DOM collections are "live" - reflect the current state of DOM. For example, If we keep a reference to `elem.childNodes`, and add/remove nodes into DOM, then they appear in the collection *automatically*.
5. **Don’t use** `for..in` to loop over collections. The `for..in` loop iterates over all *enumerable* properties. And collections have some “extra” rarely used properties that we usually do not want to get.
6. We can use `for..of` to iterate over it:
```
for (let node of document.body.childNodes) {
  alert(node); // shows all nodes from the collection
}
```
That’s because it’s iterable (provides the Symbol.iterator property, as required).

**Converting HTMLCollections to Actual Array:**

We can use `Array.from` to create a “real” array from the collection, if we want array methods:
```javascript=
document.body.childNodes.filter; // undefined (there's no filter method!)
Array.from(document.body.childNodes).filter; // now it's there
```

### Siblings & Element Siblings

Siblings are nodes that are children of the same parent. For instance, `<head>` and `<body>` are siblings:

The next node in the same parent (next sibling) is `nextSibling`, and the previous one is `previousSibling`.

The parent is available as `parentNode`.

For instance:
```htmlmixed=
 <html><head></head><body><script>
  // HTML is "dense" to evade extra "blank" text nodes.

  // parent of <body> is <html>
  alert( document.body.parentNode === document.documentElement ); // true

  // after <head> goes <body>
  alert( document.head.nextSibling ); // HTMLBodyElement

  // before <body> goes <head>
  alert( document.body.previousSibling ); // HTMLHeadElement
</script></body></html>
```

**Element-only Navigation:**
For many tasks we don’t want `text` or `comment` nodes. We want to manipulate element nodes that represent tags and form the structure of the page.

![Element Navigation](http://javascript.info/article/dom-navigation/dom-links-elements@2x.png)

| Node Navigation | Element Navigation |
| --------------- | ------------------ |
| `parentNode`    | `parentElement`    |
| `childNodes`    | `children`         |
| `firstChild`    | `firstElementChild`|
| `lastChild`     | `lastElementChild` |
| `previousSibling` | `previousElementSibling` |
| `nextSibling`   | `nextElementSibling` |

`parentNode` vs `parentElement` (An Exception):
```javascript=
// <html> element parent node (document) is not an element.
alert( document.documentElement.parentNode ); // document
alert( document.documentElement.parentElement ); // null
```

### Some Elements Have Additional Links: 

Apart from the links to parent, child, siblings, etc. some elements have additional links.

1. `<table>` has the following:
    - `table.rows` – the collection of `<tr>` elements of the table.
    - `table.caption/tHead/tFoot` – references to elements `<caption>`, `<thead>`, `<tfoot>`.
    - `table.tBodies` – the collection of `<tbody>` elements (can be many according to the standard).
2. `<thead>`, `<tfoot>`, `<tbody>` elements provide the rows property:
    - `tbody.rows` – the collection of `<tr>` inside.
3. `<tr>` has the following:
    - `tr.cells` – the collection of `<td>` and `<th>` cells inside the given `<tr>`.
    - `tr.sectionRowIndex` – the number of the given `<tr>` inside the enclosing `<thead>`/`<tbody>`
    - `tr.rowIndex` – the number of the `<tr>` in the table.
4. `<td>` and `<th>` have:
    - `td.cellIndex` – the number of the cell inside the enclosing `<tr>`. 

## Searching Nodes & Elements

1. `document.getElementById(id)`: The id must be unique. There can be only one element in the document with the given id. (Note: Only `document.getElementById`, not `anyNode.getElementById` because the method `getElementById` can be called only on **document** object. It looks for the given id in the whole document.)
2. `elem.getElementsByTagName(tag)` looks for elements with the given tag and returns the collection of them. The tag parameter can also be a star "*" for “any tags”. This method is callable in the context of any DOM element.
3. `elem.getElementsByClassName(className)` returns elements that have the given CSS class. Elements may have other classes too.
4. `document.getElementsByName(name)` returns elements with the given name attribute, document-wide (*Rarely used*). Again, `getElementsByName` can be called only on **document** object.

`getElementsByTagName(tag)`, `getElementsByClassName(className)`, and `getElementsByName(name)` return a collection (**HTMLCollection**), not an element!

5. `elem.querySelectorAll(css)` returns all elements inside elem matching the given CSS selector (most often used and powerful method). 
6. `elem.querySelector(css)` returns the **first element** for the given CSS selector. In other words, `elem.querySelectorAll(css)[0] === querySelector(css)`

`querySelectorAll(css)` returns a `NodeList` object - It is again an "array-like" structure but is not the same as an `HTMLCollection`.

**Checking if an element matches a CSS selector:**

`elem.matches(css)` to check if elem matches the given CSS selector. It returns `true` or `false.`

```javascript=
if (elem.matches('a[href$="zip"]')) {
  alert("The archive reference: " + elem.href );
}
```

**Getting the closest ancestor matching a CSS selector:**

The method `elem.closest(css)` looks the nearest ancestor that matches the CSS-selector. The `elem` itself is also included in the search.

```htmlmixed=
<h1>Contents</h1>

<div class="contents">
  <ul class="book">
    <li class="chapter">Chapter 1</li>
    <li class="chapter">Chapter 1</li>
  </ul>
</div>

<script>
  let chapter = document.querySelector('.chapter'); // LI

  alert(chapter.closest('.book')); // UL
  alert(chapter.closest('.contents')); // DIV

  alert(chapter.closest('h1')); // null (because h1 is not an ancestor)
</script>
```

**Checking if an element contains another element:**

`elemA.contains(elemB)` returns true if `elemB` is inside `elemA` (a descendant of `elemA`) or when `elemA == elemB`. `elemB` need not be an immediate child of `elemA` but can be a descendant of it for the method to return `true`.

**Important:**

1. All methods "getElementsBy*" (`getElementsByClassName`, `getElementsByTagName`, `getElementsByName`) return a **live collection**. Such collections always reflect the current state of the document and “auto-update” when it changes

```htmlmixed=
<div>First div</div>

<script>
  let divs = document.getElementsByTagName('div');
  alert(divs.length); // 1
</script>

<div>Second div</div>

<script>
  alert(divs.length); // 2
</script>
```

2. `querySelectorAll` returns a **static collection**. It’s like a fixed array of elements.

```htmlmixed=
<div>First div</div>

<script>
  let divs = document.querySelectorAll('div');
  alert(divs.length); // 1
</script>

<div>Second div</div>

<script>
  alert(divs.length); // 1
</script>
```

**Summary**

| Method	              | Searches by...    |	Can call on an element? | Live? |
| ----------------------- | ----------------- | ----------------------- | ----- |
| getElementById	      | id                |	-                       |	-   |
| getElementsByName       |	name              |	-                       |	✔  |
| getElementsByTagName    |	tag or *          |	✔                       |	✔  |
| getElementsByClassName  |	class             |	✔                       |	✔  |
| querySelector	          | CSS-selector      | ✔                       |	-  |
| querySelectorAll        |	CSS-selector      |	✔                       |	-  |

## Node properties: type, tag and contents

### Node Classes

![Node Classes](http://javascript.info/article/basic-dom-node-properties/dom-class-hierarchy@2x.png)

DOM nodes have different properties depending on their **class**. Ex: `<a>` and `<input>` have different properties (href vs name/type).

- `EventTarget` – is the root “abstract” class. Objects of that class are never created. It serves as a base. But, it has an important functionality, that is, it gives support for **events**.
- `Node` – is also an “abstract” class, serving as a base for **DOM nodes**. It provides the core tree functionality: `parentNode`, `nextSibling`, `childNodes` and so on (they are getters). Objects of this class are also never created. `Text`, `Element` and `Comment` Classes inherit from it.
- `Element` – is a base class for **DOM elements**. It provides element-level navigation like `nextElementSibling`, `children` and searching methods like `getElementsByTagName`, `querySelector`. It's a base class for different kind of elements (`SVGElement`, `XMLElement` and `HTMLElement`).
- `HTMLElement` – is finally the basic class for all HTML elements. It is inherited by various HTML elements(`HTML*Element`):
    - `HTMLInputElement` – the class for `<input>` elements,
    - `HTMLBodyElement` – the class for `<body>` elements,
    - `HTMLAnchorElement` – the class for `<a>` elements 
    - ... and so on.

**Example of inheritance:**

`<input>` element inherits from `HTMLInputElement`, `HTMLElement`, `Element`, `Node`, `EventTarget`, and finally `Object` which is a pure JS Object class (gives methods like `hasOwnProperty`, etc).

An object usually has the `constructor` property. It references to the class constructor, and `constructor.name` is its name:
```javascript=
document.body.constructor.name; // f HTMLBodyElement() [The function]
document.body.__proto__; // > HTMLBodyElement [The function's prototype object]
```

```javascript=
alert( document.body instanceof HTMLBodyElement ); // true
alert( document.body instanceof HTMLElement ); // true
alert( document.body instanceof Element ); // true
alert( document.body instanceof Node ); // true
alert( document.body instanceof EventTarget ); // true
```

**DOM nodes are regular JavaScript objects. They use prototype-based classes for inheritance.**

**Note:**
- `document` is an instance of `HTMLDocument` class.
- `HTMLDocument` inherits from `Document` class which inherits from `Node` class.

```javascript=
alert(HTMLDocument.prototype.constructor.name); // HTMLDocument
alert(HTMLDocument.prototype.__proto__.constructor.name); // Document
alert(HTMLDocument.prototype.__proto__.__proto__.constructor.name); // Node
```

**Note: `console.dir(elem)` versus `console.log(elem)`**
- `console.log(elem)` shows the *element DOM tree*.
- `console.dir(elem)` shows the element as a *DOM object*, good to explore its *properties*.

### `nodeType`, `nodeName` & `tagName`

1. `nodeType` property provides an old-fashioned way to get the “type” of a DOM node. It has a numeric value.

```javascript=
elem.nodeType === 1; // element nodes,
elem.nodeType === 3; // text nodes, ... so on.
```

2. `tagName` property exists only for Element nodes.
3. `nodeName` is defined for any Node: for elements it means the *same as* `tagName`. For other node types (text, comment etc) it has a *string with the node type*.

```javascript=
<body><!-- comment -->

  <script>
    // for comment
    alert( document.body.firstChild.tagName ); // undefined (not element)
    alert( document.body.firstChild.nodeName ); // #comment

    // for document
    alert( document.tagName ); // undefined (not element)
    alert( document.nodeName ); // #document

    alert( document.body.nodeName ); // BODY`
    alert( document.body.tagName ); // BODY`
  </script>
</body>
```

### Node Contents:

1. `innerHTML` (getter & setter) allows to get/set the HTML **inside** the element as a **string**.
    - If innerHTML inserts a `<script>` tag into the document – it **doesn’t execute**.
    - Browser fixes broken HTML in string before insertion.

```javascript=
alert( document.body.innerHTML ); // read the current contents
document.body.innerHTML = 'The new BODY!'; // replace it
```

**Caution:** Appending using `innerHTML+=`:
- The old content is removed.
- The new innerHTML is written instead (a concatenation of the old and the new one).
- All images and other resources will be reloaded (hopefully they are cached).
- Other side-effects: mouse selected text is gone, input fields cleared.

```javascript=
chatDiv.innerHTML += "<div>Hello<img src='smile.gif'/> !</div>";
chatDiv.innerHTML += "How goes?";

elem.innerHTML += "...";
// is a shorter way to write:
elem.innerHTML = elem.innerHTML + "..."
```

2. `outerHTML` (getter & setter) does *not* change the element. Instead, it replaces it as a whole in the outer context.
    - `outerHTML` assignment does *not* modify the DOM element, but extracts it from the outer context and inserts a new piece of HTML instead of it.
    - We can get a reference to new elements by querying DOM again.

```htmlmixed=
<div>Hello, world!</div>

<script>
  let div = document.querySelector('div');

  // replace div.outerHTML with <p>...</p>
  div.outerHTML = '<p>A new element!</p>'; // (*)

  // Wow! The div is still the same!
  alert(div.outerHTML); // <div>Hello, world!</div>
</script>
```

3. Text & Comment Node Values: `nodeValue` and `data` (almost identical). Use `data`.

```htmlmixed=
<body>
  Hello
  <!-- Comment -->
  <script>
    let text = document.body.firstChild;
    alert(text.data); // Hello

    let comment = text.nextSibling;
    alert(comment.data); // Comment
  </script>
</body>
```

4. `textContent`: (Getter & Setter) Gets only the text inside an element (minus the `<tags>`).
    - If text to be set contains html tags, it is put in as text only (innerHTML would have parsed it).
    - `textContent` is much more useful, because it allows to write text the “safe way”.

```htmlmixed=
<div id="news">
  <h1>Headline!</h1>
  <p>Martians attack people!</p>
</div>

<script>
  // Headline! Martians attack people!
  alert(news.textContent);
</script>
```

```htmlmixed=
<!-- Run it and see! -->
<div id="elem1"></div>
<div id="elem2"></div>

<script>
  let name = prompt("What's your name?", "<b>Winnie-the-pooh!</b>");

  elem1.innerHTML = name;
  elem2.textContent = name;
</script>
```

### More Node Properties

1. `value` – the value for `<input>`, `<select>` and `<textarea>` (`HTMLInputElement`, `HTMLSelectElement`, ...)
2. `href` – the “href” for `<a href="...">` (`HTMLAnchorElement`).
3. `id` – the value of “id” attribute, for all elements (`HTMLElement`).
4. ETC..

```htmlmixed=
<input type="text" id="elem" value="value">

<script>
  alert(elem.type); // "text"
  alert(elem.id); // "elem"
  alert(elem.value); // value
</script>
```
## Attributes (HTML) & Properties (DOM)

Most common attributes of an element becomes its property. Ex: If the tag is `<body id="page">`, then the DOM object has `body.id="page"`. But, the mapping is **not 1:1** between attrs. & props.

### DOM Properties

DOM properties and methods behave just like those of *regular JavaScript objects*. We can add properties and methods to DOM objects and invoke them.

```javascript=
document.body.myData = {
  name: 'Caesar',
  title: 'Imperator'
};

alert(document.body.myData.title); // Imperator

// ------

document.body.sayHi = function() {
  alert(this.tagName);
};

document.body.sayHi(); // BODY (the value of "this" in the method is document.body)

// ------

Element.prototype.sayHi = function() {
  alert(`Hello, I'm ${this.tagName}`);
};

document.documentElement.sayHi(); // Hello, I'm HTML
document.body.sayHi(); // Hello, I'm BODY
```

### HTML Attributes

When browser reads/parses the HTML, it identifies attributes of elements.

There can be two types of attributes:
1. "Standard Attributes" - `type` for `<input>`, `href` for `<a>`, etc.
2. Non-standard Attributes - Custom attributes, mismatched attributes & types (`type` for `<a>`), etc.

When an element has a standard attribute, the *corresponding property gets created*. But that doesn’t happen if the attribute is non-standard.

```htmlmixed=
<body id="test" something="non-standard">
  <script>
    alert(document.body.id); // test
    // non-standard attribute does not yield a property
    alert(document.body.something); // undefined
  </script>
</body>
```

All attributes (std and non-std) are accessible using following methods:
1. `elem.hasAttribute(name)` – checks for existence.
2. `elem.getAttribute(name)` – gets the value.
3. `elem.setAttribute(name, value)` – sets the value.
4. `elem.removeAttribute(name)` – removes the attribute.
5. `elem.attributes` - a collection of objects (attributes) with each object having `name` and `value` properties (attribute names and values)

```htmlmixed=
<body something="non-standard">
  <script>
    alert(document.body.getAttribute('something')); // non-standard
  </script>
</body>
```

HTML **attributes** have following features:
- Their name is **case-insensitive** (that’s HTML: `id` is same as `ID`).
- They are **always strings**.

Property-attribute synchronization:
- In most cases, when a standard attribute changes, the corresponding property is auto-updated (& vice-versa).
- There are exceptions, like `input.value` synchronizes only from attribute → to property, but not back (attribute not updated if property is changed).
- Attribute names are case-insensitive while property names are case-sensitive.
- **Important** HTML Attributes are always strings but DOM properties need not be only strings:
    - For instance, input.checked property (for checkboxes) is boolean
    - The style attribute is a string, but style property is an object
    - Even if a DOM property type is a string, it may differ from the corresponding attribute!

```htmlmixed=
<input id="input" type="checkbox" checked> checkbox

<script>
  alert(input.getAttribute('checked')); // the attribute value is: empty string
  alert(input.checked); // the property value is: true
</script>
```

```htmlmixed=
<div id="div" style="color:red;font-size:120%">Hello</div>

<script>
  // string
  alert(div.getAttribute('style')); // color:red;font-size:120%

  // object
  alert(div.style); // [object CSSStyleDeclaration]
  alert(div.style.color); // red
</script>
```

```htmlmixed=
<!-- href DOM property is always a full URL, even if the attribute contains a relative URL or just a #hash. -->
<a id="a" href="#hello">link</a>
<script>
  // attribute
  alert(a.getAttribute('href')); // #hello

  // property
  alert(a.href ); // full URL in the form http://site.com/page#hello
</script>
```

### Non-Standard Attributes in `dataset`

Using non-standard attributes may pollute the global space and in case some attribute name gets standardized later in the DOM, there will be conflicts between attributes.

Therefore, DOM provides us with `data-*` prefixed attributes. All attributes starting with “data-” are *reserved for programmers’ use*. They are available in `dataset` property.

Example: 
- If an elem has an attribute named "data-about", it’s available as `elem.dataset.about`.
- Multiword attributes like `data-order-state` become **camel-cased**: `dataset.orderState`.
- Using `data-*` attributes is a *valid, safe way* to pass *custom data*.

```htmlmixed=
<body data-about="Elephants">
<div data-order-state="new"></div>
<script>
  alert(document.body.dataset.about); // Elephants
alert(order.dataset.orderState); // new
</script>
```

