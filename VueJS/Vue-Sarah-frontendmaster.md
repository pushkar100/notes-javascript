# Vue Workshop

Sarah Drasner's Workshop on VueJS @ Frontend Masters (September 14, 2017)

This is an introductory course on VueJS and intends to cover the breadth of the tools available within Vue and different ways in which we can use them. It does not cover ES6 or deployment and does not go into too much detail about everything.

[Sarah Drasner](https://twitter.com/sarah_edo) is a consultant at Microsoft, a big fan of VueJS and currently on the core Vue team.

## Why VueJS?

**Vue is**:

1. Decalarative
2. Legible
3. Easy to maintain
4. Powerful
5. A collection of the best of the best
6. Elegant
7. Gives me what I want when I need it, and then it gets out of my way
8. A way to be productive

**Comparison with other frameworks**:

1. Vue has a *virtual DOM*
2. It has *reactive components* that offer the *View* layer only
3. It has *Props* and a *Redux*-like store similar to *React*
4. It has *Conditional Rendering*, and services, similar to *Angular*
5. It is inpired by *Polymer* for simplicity and performance. Vue offers a similar development style as HTML, styles, and Javascript are composed in tandem (*Progressive framework*).
6. It has a *slightly better performance* than React, no use of *polyfills* like Polymer, and an *isolated*, *less opinionated* view than Angular, which is an MVC.

[**Github Repo for this course**](https://github.com/sdras/intro-to-vue)

## Directives and Data rendering

Basic Vue instance example

```html
<div id="app">
	{{ text }}, Nice to meet Vue!
</div>
```

```js
new Vue({
	el: '#app',
	data: {
		text: 'Hello world'
	}
})
```

`Hello world, Nice to meet Vue!`

Using the mustache syntax `{{…}}`  (***String interpolation***) we can place our data inside the HTML. To create a Vue instance, invoke its constructor with an object that contains an element (defined by `el`) that the instance should attach itself to and, optionally, some data. This data is part of what enables the reactivity system that Vue offers.

The element that Vue attaches itself to can be *any CSS selector* (`id`, `class`, etc) but you typically want only one instance attached to one element, so you generally pass an `id`.

**Vue vs Vanilla Javascript**:

Taking an example: Displaying a collection of items as a list on the page. In Vanilla JS:

```javascript
/* <div id="container"></div> */

const items = [
  'Apple',
  'Orange',
  'Grape',
  'Mango',
  'Guava',
  'Pineapple'
]

var itemsHTML = '';
for(let i = 0, len = items.length; i < len; i++) {
  itemsHTML += `<li>${items[i]}</li>`;
}

const container = document.querySelector('#container');
container.innerHTML = `<ul>${itemsHTML}</ul>`;
```

The same functionality written using Vue:

```javascript
/* 
<div id="app">
	<ul>
		<li v-for="item in items">
			{{item}}
		</li>
	</ul>
</div>
*/

new Vue({
	el: '#app',
	data: {
		items: [
			'Apple',
			'Orange',
			'Grape',
			'Mango',
			'Guava',
			'Pineapple'
		]
	}
})
```

From above, we can see that Vue already has a more ***declarative style*** (Vanilla JS was more about writing steps, like in a recipe). It clearly tells the computer to take the items list and iterating through it in the template (the HTML) and it is the computer that does the hardwork.

Therefore, Vue is *clean* and *semantic*.

### Directives

Directives are HTML attributes that Vue provides to that piece of HTML markup. It helps us avoid diving into the DOM and changing things because directives offer us some functionality.

- `v-text` `v-html`
- `v-show`
- `v-if` `v-else` `v-else-if`
- `v-for`
- `v-on`
- `v-bind` `v-model`
- `v-pre`
- `v-cloak`
- `v-once` 

We can also make our *custom directives* apart from the ones listed above.

#### `v-for`

**`v-for`**: We can iterate through data or even run the loop for a static count.

```html
<!-- Example 1 -->
<div>
  <ul>
    <!-- takes data 'items' and iterates through each value: -->
    <li v-for="item in items">{{ items }}</li> 
  </ul>
</div>

<!-- Example 2 -->
<div>
  <ul>
    <li v-for="num in 5">{{ num }}</li> <!-- Print 1 to 5 as li elements -->
  </ul>
</div>
```

#### `v-model`

**`v-model`**: Creates a relationship between the *data* in the instance/component and a *form input*, so you can dynamically update values.

```javascript
/*<div id="app">
	<textarea v-model="message" cols="30" rows="10"></textarea>
	<div class="msg">{{message}}</div>
</div>*/

new Vue({
	el: '#app',
	data() {
		return {
			message: ''
		}
	}
})

/* Writing inside the textarea will automatically update the message data value which in turn automatically updates what is shown inside the `.msg` div */
```

**Notice** we are returning the data object from inside a function `data()` instead of directly specifying the object. This is a required pattern when we start using components in Vue (and the reason will be explained later).

A **one-to-many** relationship example with *v-model* using *checkboxes*: All the checkboxes are linked to the same data property. The data property is an *array*. Checking off the boxes would either include their value in the array or remove it.

```javascript
/*<div id="app">
	<input type="checkbox" value="apple" v-model="fruits"> Apple<br>
	<input type="checkbox" value="orange" v-model="fruits"> Orange<br>
	<input type="checkbox" value="grape" v-model="fruits"> Grape<br>
	<div>Selected Fruits:<br>{{ fruits }}</div>
</div>*/

new Vue({
	el: '#app',
	data() {
		return {
			fruits: []
		}
	}
})
```

Example output: `Selected Fruits: [ "grape", "orange" ]`

We can also combine `v-model` and `v-for` to dynamically output the checkboxes and their values (which maybe dynamic) and have a two-way data binding with v-model:

```javascript
/*<div id="app">
	<div v-for="fruit in fruits">
		<input type="checkbox" :value="fruit" v-model="fruitNames"> {{ fruit }}<br>
	</div>
	<div>Selected Fruits:<br>{{ fruitNames }}</div>
</div>*/

new Vue({
	el: '#app',
	data() {
		return {
			fruitNames: [],
			fruits: [
				'Apples',
				'Oranges',
				'Grapes'
			]
		}
	}
})
```

In the above example, what we have achieved is that we don't need to hardcode all the checkboxes and their corresponding values.

`v-model` can also be used in the same way for *radio buttons* but for radio buttons only one value is selected and hence, our data attribute need not be an array but a single value (although it could still be defined as an array initially).

```javascript
/*<div id="app">
	<input type="radio" value="apple" v-model="fruit"> Apple<br>
	<input type="radio" value="orange" v-model="fruit"> Orange<br>
	<input type="radio" value="grape" v-model="fruit"> Grape<br>
	<div>Selected Fruit:<br>{{ fruit }}</div>
</div>*/

new Vue({
	el: '#app',
	data() {
		return {
			fruit: ''
		}
	}
})
```

Example output: `Selected Fruit: apple`

`v-model` example wih `<select>` tag:

```javascript
/*<div>
  <select v-model="name" class="row second">
    <option value="Carne Asada">Carne Asada</option>
    <option value="Pollo">Pollo</option>
    <option value="Bean">Bean</option>
    <option value="Al Pastor">Al Pastor</option>
  </select>
  <p v-if="name">My favorite kind of taco is {{ name }}</p>
</div>*/

new Vue({
  el: '#app',
  data() {
    return {
      name: ''
    }
  }
})
```



**Modifiers to v-model**: There are many modifiers available to directives in general and are identified by a leading `.` after the directive name. There are a few common ones available to `v-model`:

1. `v-model.trim`: Will strip any leading or trailing whitespace from the bound string.
2. `v-model.number`: Changes strings to number inputs.
3. `v-model.lazy`: Won't populate the content automatically. It will wait till to bind until an event happens (It listens to change events instead of input).

#### `v-if` and `v-show`

**`v-if`** and **`v-show`**: These two are conditionals that will display information depending on meeting a requirement. This can be anything - buttons, forms, divs, components (large or small pieces of data).

The requirement to be met is a *boolean based conditional* like in a javascript expression (Ex: an if-statement).

```javascript
/*<div id="app">
	Leave us a message
	<textarea v-model="message"></textarea>
	<button v-if="message">Submit message</button> <!-- Shown if message is not empty -->
</div>*/

new Vue({
	el: '#app',
	data() {
		return {
			message: '' // Initially message is empty (false)
		}
	}
})
```

The exact same thing can be accomplished using `v-show`.

**What is the difference between `v-if` and `v-show`?**

- `v-if` completely unmounts and remounts the element every time the requirement is met and not met. (When unmounted, the element is represented by an empty comment `<!——>` and when mounted, the actual element replaces the comment).
- `v-show` on the other hand only *toggles* the visibility of the element. (In the console, you can see `display:none` being set and unset on the element. The element itself exists all the time)

If we have a component or element that needs to be shown or hidden frequently, that is, the user interacts with it quite often then we want to use `v-if` since it will be *more performant than mounting elements*.

If we have a large component (and with which does not need to alternated between hidden and shown so frequently) then we would use `v-if` since our *initial load time will be less* and the component is *loaded only on demand*.

#### `v-else` and `v-else-if`

**`v-else`** and **`v-else-if`**: They are used to conditionally render one thing or the other.

```javascript
/*<div id="app">
	Do you like tacos?
	<br><input type="radio" value="yes" v-model="tacos"> Yes
	<br><input type="radio" value="no" v-model="tacos"> No
	
	<div v-if="tacos">
		<div v-if="tacos === 'yes'">👍</div>
		<div v-else>You're a monster</div>
	</div>
</div>*/

new Vue({
	el: '#app',
	data() {
		return {
			tacos: ''
		}
	}
})
```

You would use `v-if`, `v-else-if` and `v-else` can be used like how we would use them as a construct in javascript with the `if(){}`, `else if() {}` and `else {}` constructs.

```javascript
/*<div id="app">
	Do you like tacos?
	<br><input type="radio" value="yes" v-model="tacos"> Yes
	<br><input type="radio" value="no" v-model="tacos"> No
	
	<div v-if="tacos">
		<div v-if="tacos === 'yes'">👍</div>
		<div v-else-if="tacos === 'no'">👎</div>
	</div>
	<div v-else>What's your answer?</div>
</div>*/

new Vue({
	el: '#app',
	data() {
		return {
			tacos: ''
		}
	}
})
```

#### `v-bind`

**`v-bind:`** or **`:`**: One of the most useful directives and it has a shortcut (`:`). We can use it for *many* things - class or style binding, creating dynamic props, etc.

An example of class binding:

```javascript
/*<div id="app">
	Leave us a message: <br>
	<textarea v-model="message" cols="30" rows="10"></textarea>
	<br><button :class="[message ? activeClass : '']">Submit</button>
</div>*/

/*.red-btn {
	background: red;
	color: #fff;
}

button {
	background: #ccc;
	color: #dfe1e8;
}*/

new Vue({
	el: '#app',
	data() {
		return {
			message: '',
			activeClass: 'red-btn'
		}
	}
})
```

Ternary operators (`?:`) within `v-bind` are pretty useful and a nice *toggling* techinique.

An example of style binding: 

```javascript
/*<div id="app">
	<div :style="`color: rgb(${x}, 150, 255)`"> 
		<!-- Alternatively: <div :style="{ color: `rgb(${x}, 150, 255)`}"> -->
		{{ name }}
	</div>
</div>*/

new Vue({
	el: '#app',
	data() {
		return {
			x: 50,
			name: 'Pushkar'
		}
	}
})
```

#### `v-once` and `v-pre`

**`v-once`**: Not that useful. It will not update once it's been rendered. It will only update the first time you enter it into the DOM and on subsequent user inputs, it will not be updated or re-rendered. It is a boolean directive.

**`v-pre`**: Will print out the inner text exactly how it is, including *code* (Useful for documentation). Also not used much and it's a boolean directive.

```javascript
/*<div id="app">
	Do you like tacos?
	<input type="text" v-model="tacos"><br>
	<div v-once="tacos">{{ tacos }}</div> <!-- 'Not sure' -->
	<div v-pre>{{ tacos }}</div>
	<!-- We can debug data by displaying the object in pre (debugging tip) --> 
	<pre>{{ $data }}</pre>
</div>*/

new Vue({
	el: '#app',
	data() {
		return {
			tacos: 'Not sure'
		}
	}
})
```

`v-pre` versus the `<pre>` tag: `v-pre` does not resolve the inner text. For example, it does not resolve the mustache syntax but instead it is shown the way it is (with `{{` and `}}` ). `<pre>` tag on the other hand, does resolve the mustache strings but it does not format the data. For example, if we output an object and it is enclosed in `<pre>`, it is shown as is (useful for debugging).

#### `v-on`

**`v-on:`** or **`@`**: Extremely useful and comes with a shortcut (`@`). It is used to bind *events* like click, mouseenter, etc. You are able to pass in a parameter for the event like `e` (It refers to the event object, just like in plain javascript event handlers). We don't have to explicitly mention the event parameter in the call since vue will automatically add it to the assigned event handler method.

The events can be any of the DOM events used in practice.

We can have regular javascript statements and expressions (like ternary operations) directly in the `@` attribute value or it can be a function call.

```javascript
/*<div id="app">
	<button @click="counter += 1">Increment Counter</button>
	<button @click="counter > 0 ? counter -= 1 : 0">Decrement Counter</button>
	<button @click="counter = 0; isReset = true">Reset Counter</button>
	
	<div>Counter = {{ counter }}</div>
</div>*/

new Vue({
	el: '#app',
	data() {
		return {
			counter: 0,
			isReset: false
		}
	}
})
```

Using *multiple bindings*: Vue allows us to bind multiple things based on different events. Instead of repeating the `@` or `v-on:`  for each type of event, we can define them all under one property like this:

```html
<div v-on="
		click   : onClick,
		keyup   : onKeyUp,
		keydown : onKeyDown
"></div>
```

The values given to the event properties in the example above are function/method names. We will learn later how to call methods for an event. These methods will get the event object.

**Modifiers to v-on**: There are many modifiers available to directives in general and are identified by a leading `.` after the directive name. There are a few common ones available to `v-bind`:

1. `@mousemove.stop`: `.stop` is a modifier that will prevent the propagation of the event upwards. It is comparable to `e.stopPropagation()`. Therefore, in our handler method, we need not write `e.stopPropagation()` if we haved used the `.stop` modifier.
2. `@mousemove.prevent`: `.prevent` is a modifier that will prevent the default action for a particular element's particular event from taking place (Ex: clicking an `<a>` link will take the user to location specified by `href` attribute). `.prevent` is comparable to `e.preventDefault()` and we need not write it in the handler method if this modifier is present.
3. `@click.once`: `.once` is a modifier that will be *triggered only once*. It is **not** to be confused with v-once since they are not the same. It is quite the same as jQuery's `$(selector).once(event, handler)` method.
4. `@click.native`: `.native` is a modifier used to listen to *native events* on the DOM. It is rarely used since it is an edge-case usage where you would want to capture the real DOM instead of the virtual DOM.

**Note**: For key press events such as `keyup`, `keydown`, etc there are **key codes** as *modifiers* available to match keys that were pressed (Ex: `@keyup.enter="..."`). Apart from available key codes, we can *configure* our own key codes. This is the [link](https://vuejs.org/v2/api/#keyCodes) to the documentation regarding it.

#### `v-html` and `v-text`

**`v-html`**: It is great for strings that have HTML elements that need to be rendered.

```javascript
/*<div id="app">
	<div v-html="favoriteLink"></div>
</div>*/

new Vue({
	el: '#app',
	data() {
		return {
			favoriteLink: `I love <a href="https://www.google.com" target="_blank">Google</a>`
		}
	}
})
```

**Note**: Do not use `v-html` to render *user input data*! The reason is because the user string might contain string that tries to access your data. Therefore, **XSS** attacks are a possibility and as a security issue, we must avoid them.   

**`v-text`**: Similar to using the mustache (`{{...}}`) template. Not very useful since you can always use the mustache syntax (string interpolation) instead of it.

```javascript
/*<div id="app">
	<div v-text="tacos"></div> <!-- 'I love tacos' -->
	<div>{{ tacos }}</div>     <!-- 'I love tacos' -->
</div>*/

new Vue({
	el: '#app',
	data() {
		return {
			tacos: 'I love tacos'
		}
	}
})
```

The documentation recommends us to use the *mustache syntax* over `v-text`.

[View Sarah Drasner's 5-part learning Vue Guide on CSS-Tricks](https://css-tricks.com/guides/vue/)

## Methods, Computed and Watchers

Method are used very often, computed properties are going to be used a lot as well, and watchers will be used in special cases.

Methods are available to a Vue instance or component. Methods can be called as event handlers (instead of directly executing javascript in the attribute). They can also be called from other methods.

```javascript
/*<div id="app" @mousemove="changeX" :style="{ backgroundColor: `hsl(${x}, 50%, 80%)`}">
	<button @click="incrementCtr">Increment Counter</button>
	<span class="counter"> {{ ctr }} </span>
</div>*/

/*#app { height: 200px; }
.counter { margin-left: 10px; }*/

new Vue({
	el: '#app',
	data() {
		return {
			x: 0,
			ctr: 0
		}
	},
	methods: {
		incrementCtr() {
			this.ctr += 1;
		},
		changeX(e) {
			this.x = e.clientX;
		}
	}
})
```

The Vue instance contains `methods` object. Inside it, we place our methods (you may choose the ES6 syntax for object methods or use the old one with the *function* keyword). 

If method was called as an event handler, the event object is atuomatically available to it as the first parameter (we can name it anything, like `e`).

**Note**: 

1. Inside the methods, the `data()` returned object properties and other methods can be referenced. They are referenced using the `this` keyword (which is an object that contains, apart from other things, properties and methods that we have defined in `data` and `methods`, respectively).
2. **Do not use arrow functions for a method**. Arrow functions do not change the `this` reference. Hence, we won't be able to access data properties from inside such a method since the context using which it was called has no effect on the `this` (We will get an error trying to access properties).
3. We can use arrow functions *inside* of a method (i.e for functions nested inside a method).

```javascript
new Vue({
	el: '#app',
	data() {
		return { x: 0 }
	},
	methods: {
      	/* WRONG!: */
		incX => {
			this.x += 1; /* Will throw an error */
		},
        /* RIGHT: */
		incX() {
			this.x += 1;
		}
	}
})
```

More useful example of methods:

A simple comment section:

```javascript
/*
<div id="app">
  <ul>
    <li v-for="comment in comments">
      {{ comment }}
    </li>
  </ul>
  <input
    v-model="newComment"
    @keyup.enter="addComment"
    placeholder="Add a comment" 
  />
</div>
*/

new Vue({
  el: '#app',
  data: {
    newComment: '',
    comments: [
      'Looks great Julianne!',
      'I love the sea',
      'Where are you at?'
    ]
  },
  methods: {
    addComment() {
      this.comments.push(this.newComment)
      this.newComment = ''
    }
  }
});
```

A simple form submit example that uses `Axios` library to make the requests:

```javascript
/*
<div id="app">
  <form @submit.prevent="submitForm">
    <div>
      <label for="name">Name:</label><br>
      <input id="name" type="text" v-model="name" required/>
    </div>
    <div>
      <label for="email">Email:</label><br>
      <input id="email" type="email" v-model="email" required/>
    </div>
    <div>
      <label for="caps">HOW DO I TURN OFF CAPS LOCK:</label><br>
      <textarea id="caps" v-model="caps" required></textarea>
    </div>
    <button :class="[name ? activeClass : '']" type="submit">Submit</button>
    <div>
      <h3>Response from server:</h3>
      <pre>{{ response }}</pre>
    </div>
  </form>
</div>
*/

new Vue({
  el: '#app',
  data() {
    return {
      userID: 1,
      name: '',
      email: '',
      caps: '',
      response: '',
      activeClass: 'active'
    }
  },
  methods: {
    submitForm() {
      axios.post('//jsonplaceholder.typicode.com/posts', {
        userID: this.userID,
        name: this.name,
        email: this.email,
        caps: this.caps
      }).then(response => {
        this.response = JSON.stringify(response, null, 2)
      }).catch(error => {
        this.response = 'Error: ' + error.response.status
      })
    }
  }
})
```

### Computed Properties

Computed properties are calculations that will be ***cached*** and will only ***update when needed***. It is highly performant but use with understanding.

Generally, properties that we access need to be inside `data()`. But with computed properties, we can define methods that create properties (which are computed from the existing properties).

```javascript
/*
<div id="app">
  <h3>Your Name: <input v-model.lazy="userData" /></h3>
  <h2 v-if="userData">Initial entry: {{ userData }}</h2>
  <h2 v-if="userData">Computed Value: {{ greeting }}</h2>
</div>
*/

new Vue({
  el: '#app',
  data() {
    return {
      userData: ''
    }
  },
  computed: {
    greeting() {
      return `You're a monster, ${this.userData}!`
    }
  }
})
```

Notice that `greeting` is accessed as a property in the template even though it has been defined as a method inside `computed`. This is how computed properties work, we define them as methods and a property gets created with the same name.

**Computed properties versus Methods**

1. Computed runs only when a dependency has changed. Method runs whenever an update occurs.
2. Computed properties are cached. Methods aren't cached.
3. Computed properties should be used as a property, in place of data. Methods are typically invoked on `v-on`/`@`, but flexible.
4. Computed properties are, by default, getters (but you can define a setter). Methods are getters/setters.

Computed properties might be useful when you want to filter data. For example, if you want to filter data based on some search, then the complete data could be a property while the filtered data can be computed. Example:

```javascript
// Using our computed property in place of the data, we now have a different view of the data: 
data() {
  return {
    ratingsInfo: ...,
    ...
  }
},
methods: {
  sortLowest() {
    this.ratingsInfo.sort((a, b) => a.rating > b.rating ? 1 : -1);
  },
  ...
},
computed: {
  filteredFilms() {
    let filter = new RegExp(this.filterText, 'i')
    return this.ratingsInfo.filter(el => el.title.match(filter))
  }
}
```

### Watchers and Vue's Reactivity System

**Reactive programming** is programming with *asynchronous* data streams. A stream is a sequence of ongoing events ordered in time that offer some hooks with which to observe it. (Ex: A hover state change with a transition property will have a series of events with hooks being start of the transition, in-between points of the transition, and the end point of the transition).

When we use reactive premises for building applications, this means it's very easy to update state in reaction to events. This concept can be seen in practice in Vue.

- Angular 1.x has dirty checking to be reactive.
- Angular 2 and Cycle.js use reactive streams like XStream and Rx.js
- **Vue.js**, MobX, and Ractive.js all use a variation of **getters/setters.** ([Vue Doc for Reactivity](https://vuejs.org/v2/guide/reactivity.html))

"React" (The framework) has nothing to do with "Reactive". React is, in fact, not reactive - It uses a "pull" approach rather than a "push" approach ([More details](https://reactjs.org/docs/design-principles.html#scheduling)).

[Building a reactive engine in JS](https://www.monterail.com/blog/2016/how-to-build-a-reactive-engine-in-javascript-part-1-observable-objects)

**In Vue**: Vue takes the object, walks through its properties and converts them to getters/setters. We cannot keep track of property addition or deletion so we create the `data` object to keep track. This is how Vue is reactive.

`data(){ return { ...Vue walks through these properties, so data() needs to be defined ... }}`

Example: 

```javascript
var vm = new Vue({
  el: '#app',
  data() {
    return {
      message: 'This is the initial message',
      otherMessage: 'This is another message'
    }
  }
})

vm.thing = 'I am a new thing'; // We can add a property to the vue instance
console.log(vm); // Will display 'thing' but it was not added by a getter/setter (so useless)
```

If we add a property to our Vue instance like with regular javascript objects, it does not get registered as a property since the data properties were already walked through before this property was added (and it was not added inside `data()` which was a requirement). Therefore, we should only add properties to the `data` object (apart from computed properties). Once a getter/setter has been defined for a property, we can **"watch"** it (monitor) so that when the setter is triggered, the watcher will know and we can perform some operation.

#### Watchers

- ***Each component*** in Vue has a ***watcher instance***.
- The ***properties*** touched by the watcher during the render are registered as ***dependencies***.
- When the ***setter is triggered***, it lets the watcher know, and causes the component to re-render.
- The Vue instance is the ***middleman*** between the *DOM* and the *Business Logic*.
- Watch ***updates the DOM only if it's required*** - performing calculations in JS is really performant but accessing the DOM is not. So we have a Virtual DOM which is like a copy, but parsed in JavaScript.
- It will only update the DOM for things that need to be changed, which is ***faster***.

What are watchers good for? They are good for **asynchronous updates** and updates/transitions with **data changes**.

Watcher is defined by a `watch` object. This object has got methods whose names should correspond to the names of actual data properties that it is watching for changes.

The watch method for a property also gets a parameter which is the data property itself.

```javascript
new Vue({
  el: '#app',
  data() {
    return {
      bottom: false,
      beers: []
    }
  },
  watch: {
    /* When watching a property, you trigger a method on change */
    /* If "bottom"'s value changes, its watcher will get triggered: */
    bottom(bottom) {
      if (bottom) {
        this.addBeer()
      }
    }
  },
  ...
});
```

**Note**:

1. With a watcher, we also have access to the *new value* (first param) and the *old value* (second param):

```javascript
watch: {
  watchedProperty (value, oldValue) {
    //your dope code here
  }
},
```

2. We can also gain access to *nested values* with `deep`: Our properties might be objects and we'd want to watch over properties of that object: Use the following with `deep` set to `true`:

```javascript
watch: {
  watchedProperty {
    deep: true,
    nestedWatchedProperty (value, oldValue) {
      //your dope code here
    }
  }
},
```

## Components

### Templates

Vue.js uses ***HTML-based template syntax*** to bind the Vue instance to the *DOM*, very useful for components.

Templates are ***optional***, you can also [write render functions](https://vuejs.org/v2/guide/render-function.html) with optional JSX support.

We don't really need components to write templates. Without components, the template is written as a *template string*. This is how we would do it, with a `template` property on the instance:

```javascript
/* <div id="app">
</div> */

new Vue({
  el: '#app',
	template: `<div>Hello, Pushkar!</div>`,
  data() {
    return {}
  }
})
```

### Components

Components are a collection of elements that are encapsulated into a group that can be accessed through one single element.

For example:

```html
<!-- Imagine a collection of elements: -->
<div id="item">
  <p class="item-data">
    <span>...</span>
  </p>
</div>

<!-- Everything above can be replaced by one component: -->
<item></item>
```

A very simple component creation example in Vue:

```javascript
/*
<div id="app">
  <child></child>
</div>
*/

Vue.component('child', {
  template: `<div>hello mr. magoo</div>`
}); // Define name and template of component

new Vue({
  el: "#app"
}); // define target element for a Vue App
```

Sending **Props** down from one component (or Vue Instance) to a Child component:

```javascript
/*
<div id="app">
  <child :text="message"></child> <!-- Use v-bind to bind attrs as props to child cpt -->
</div>
*/

Vue.component('child', {
  props: ['text'],
  template: `<div>{{ text }}</div>`
});

new Vue({
  el: "#app",
  data() {
    return {
      message: 'hello mr. magoo'
    }
  }
});
```

### Props

Passing data down from the parent to the child.

```javascript
props: ['text'] // Inside the child component
```

Props are intended for *one way communication*.

You can think of it a little like the component holds a variable that is waiting to be filled out by whatever the parent sends down to it.

`props` will be an ***Array*** (Unless we want to specify the types of the props - it will be an object then). Even if we have to pass down one element, it will still be inside an array. Th values inside will always be ***strings*** since we are calling something (some value) by name.

The same `props` can be sent different values from the parent:

```javascript
/*
<div id="app">
  <child :text="message"></child>
  <child :text="other"></child>
</div>
*/

/* Output:
hello mr. magoo
Hi there
*/

Vue.component('child', {
  props: ['text'],
  template: `<div>{{ text }}</div>`
});

new Vue({
  el: "#app",
  data() {
    return {
      message: 'hello mr. magoo',
      other: 'Hi there'
    }
  }
});
```

**Prop Types and Validation**: We can specify what values we are expecting for a prop (If there are multiple acceptable types, put them in an **array**). Types are basic JS types.

```javascript
props: {
  text: [String, Number] // `text` can be a String or a Number
}
```

If we want to be more specific, we can define the `required` and `default` properties of a particular prop. Required means that prop needs to be passed down and default gives it a default value. The prop is now an object with type being handled by `type` property. Ex:

```javascript
Vue.component('child', {
  props: {
    text: {
      type: String,
      required: true,
      default: 'hello mr. magoo'
    }
  },
  template: `<div>{{ text }}<div>`
});
```

If there is a prop mismatch, then Vue throws a warning in the console. For example, passing a String prop when the child is expecting a Boolean value for the prop will throw a warning (but not an error, and text will still be rendered (confirm it!)).

**Note**: Props that are  `Objects` and `arrays` need their defaults to be *returned* from a *function*: 

```javascript
text: {
  type: Object,
  default: function () {
    return { message: 'hello mr. magoo' }
  }
}
```

**Dynamically binding props from parent to child: Use `v-bind` (`:`)**

```html
<!-- Not using the state of the parent -->
<child count="1"></child> <!-- The count value is STATIC. Will always equal 1 -->
 
<!-- vs -->
 
<!-- Using the state of the parent -->
<child :count="count"></child> <!-- Child' count prop is dynamic. Changes with parent's count -->
```

Therefore, if we wanted to we could pass static data as props.

**Conversion between camelCasing and kebab-casing**

Props inside the javascript code can be written in camelCase but we cannot have the same in the HTML (as attribute). Therefore, to get around this, all the camelCased properties can be represented via kebab-case in HTML.

```html
<!-- camelCasing will be converted
props: ['booleanValue'] -->
 
<!-- In HTML it will be kebab-case: -->
<checkbox :boolean-value="booleanValue"></checkbox>
```

### Components and Isolated Scopes

Each component instance has its own isolated scope. Because of this, **`data`** must be a **function**. If we do not put the data properties inside a function that *returns an object*, the data changes affect all instances of a component (which is not desirable). By returning an object from a function, the data properties of one instance of the component is not affected by another instance.

**Note**: Vue-CLI build process will actually throw an error if a component is not returning an object from a function for its `data` property.

### Refactoring into a Component

1. Linking a component using `is`: 

```javascript
/*
<li
  is="individual-comment"
  v-for="comment in comments"
  :commentpost="comment">
</li>
*/

Vue.component('individual-comment', {
  template: 
  `<li> {{ commentpost }} </li>`, // It REPLACES the <li> in the markup
  props: ['commentpost']
});

// Takes the template and replaces the element in the markup.
```

**Note**: We can use `v-bind` (`:`) on the `is` attribute to dynamically/programmatically switch between components used for that piece of markup. For example, `:is="selected"` would be bound to a `data` property called `selected` whose value will be the name of a component. There maybe multiple components and only the component whose name matches what is in `selected` will be used for that piece of markup (So, we can toggle between components or select one out of many).

2. Specifying the template for a component separately (If template string is complex, it can be taken out of the component creator function and placed inside a special script with type `text/x-template`).

```javascript
/*
<script type="text/x-template" id="comment-template">
  <li> 
    <img class="post-img" :src="commentpost.authorImg" /> 
    <small>{{ commentpost.author }}</small>
    <p class="post-comment">"{{ commentpost.text }}"</p>
  </li>
</script>
*/

/* We must select the script tag that represents the template */
Vue.component('individual-comment', {
  template: '#comment-template', // Any Selector
  props: ['commentpost']
});
```

**Note**: This method of creating components and templates is VERY USEFUL if you intent to add VueJS to an *existing application*! For a complete Vue based app, we can go with the Vue-CLI approach (using `.vue` files).

3. **Local Component**: Another option is when the component and the template are all in the **SAME** file (One file). We can do the following:

```javascript
const IndividualComment = {
  template: '#comment-template',
  props: ['commentpost']
}

/* We need to notify Vue that we want to use the above as a component: */
new Vue({
  ...
  components: {
    'individual-comment': IndividualComment
  }
})
```

### Events

`props` are meant to be passed down from parent to child. Changing the prop of a parent in the child throws a warning in Vue (Mutating props directly is bad!). The reason is (and this can be checked in Vue Devtools), only the child knows of the change to the prop but the parent doesn't, so the original data attribute in the parent has not changed (not synced)!

Therefore, child components can *emit events to parent*. This is the mode of communication between parent and child (parent passes props, child emits events). Hence, to change a prop, child can emit event to parent who can then change the prop value by itself (and that change in prop is reflected in the child component also).

A child can report its activity to the parent using the special **`$emit`** function available to every component. The parent can capture the emitted event using a `v-on` attribute (`@`):

```javascript
/* Child component: */
methods: {
  fireEvent() {
    this.$emit('myEvent', eventValue);
  }
}
```

```html
<!-- In parent: -->
<my-component @myEvent="parentHandler"></my-component>
```

First parameter to `$emit` is the name of the event while the rest are values passed as data to the event.

```javascript
methods: {
  fireEvent() {
    this.$emit('myEvent', eventValueOne, eventValueTwo);
  }
}
```

Another example of emitting an event from child and changing the parent's data directly in the template (inline) with the use of `$event`:

```javascript
/*
<div id="app">
  <child :text="message" @changetext="message = $event"></child>
  <pre>{{ $data }}</pre>
</div>

<script type="text/x-template" id="child">
  <div>
    <p>{{ text }}</p>
    <button @click="talkToMe">Let's talk</button>
  </div>
</script>
*/

Vue.component('child', {
  props: ['text'],
  template: '#child',
  methods: {
    talkToMe() {
      this.$emit('changetext', 'forget introductions, I want a taco')
    }
  }
});

new Vue({
  el: "#app",
  data() {
    return {
      message: 'hello mr. magoo'
    }
  }
});
```

The most standard way of capturing events by the child and using that in the parent is to use methods on both side (they need not have the same names):

```javascript
/* Child */
/*
<script type="text/x-template" id="height-counter">
 <button @click="heightincrease">Increase height</button>
</script>
*/
Vue.component("height-counter", {
  template: "#height-counter",
  data() {
    return {
      count: 0
    }
  },
  methods: {
    heightincrease: function () {
      this.count += 1
      this.$emit('heightincrease')
    }
  },
});

/* Parent */
/*
<div class="button-group">
  <button @click="animateBall" v-if="!running">Start</button>
  <button @click="cancelAnimate" v-else>Reset</button>
  <height-counter @heightincrease="incrementHeight"></height-counter>
</div>
*/
new Vue({
  el: '#app',
  data: {
    total: 200,
    ...
  },
  methods: {
    incrementHeight() {
      this.total += 100
    },
    ...
  }
})
```

### Slots

We can use slots to ***populate content inside a component***. If we have a `<slot>` within a component, we can define the content we want to send to the component.

```javascript
/*
HTML  SCSS  Babel  Result
EDIT ON
 <div id="app">
  <h2>We can use slots to populate content</h2>
  <app-child>
    <h3>This is slot number one</h3>
  </app-child>
  <app-child>
    <h3>This is slot number two</h3>
    <small>I can put more info in, too!</small>
  </app-child>
</div>

<script type="text/x-template" id="childarea">
  <div class="child">
    <slot></slot>
    <p>This is the other content of the component.</p>
  </div>
</script>
*/

const Child = {
  template: '#childarea'
};

new Vue({
  el: '#app',
  components: {
    appChild: Child
  }
});
```

A slot can have ***default text*** too:

```html
<slot>I am some default text</slot>
```

If we want to have more than one slot, we can. It is better to use **named slots** (with `name` attribute) in this case. The parent can identify the slot with the `slot` attribute. Whatever is passed to the component will go into the corresponding named slots. If there is some slot that is not named and there is remaining content then that content goes into the unnamed slot.

```html
<!-- Child component: -->
<div id="post">
  <main>
    <slot name="header"></slot>
    <slot></slot>
  </main>
</div>

<!-- Inside Parent: -->
<app-post>
  <h1 slot="header">This is the main title</h1>
  <p>I will go in the unnamed slot!</p>
</app-post>

<!-- Resulting markup (final): -->
<main>
  <h1>This is the main title</h1>
  <p>I will go in the unnamed slot!</p>
</main>
```

**Note**: The `<slot>` tag gets **replaced** by the element passed down from the parent for that slot.

### Keep-Alive

If we intend to switch (or swap) components (Say, by using the `:is="dataPropHoldingComponentName"`) then we can keep the "state" of a component alive when we make the switch between components.

```html
<keep-alive>
  <component :is="selected">
    ...
  </component>
</keep-alive>
```

Full example of `slots` and `keep-alive`: [Codepen by Sarah Drasner](https://codepen.io/sdras/pen/db71c231f760ee3a53e9d4e65f8745b8) (Try to design something on both the black and white labels and switch back and forth).

## Vue CLI and Nuxt.js

For very small projects or snippets of code, we can just use the CDN VueJS (or use Codepen), have all our components in one single file, etc. But, for larger and practical Vue projects, we need a proper **build process** that help with development and deployment (and also the way we structure our code).

There are two popular build tools that are available:

1. **`vue-cli`**
2. **`nuxt.js`**

**Why do we need a build process?** 

- Build processes allow us to use great features like ES6, or SCSS, easy to use other libraries.
- We're going to build and concatenate *single file templates*.
- Not load all our files at startup (lazy load, async).
- Server-side rendering, code-splitting, performance metrics, etc.
- We can also have Build and Prod versions.

### 1. `vue-cli`

It is an NPM (or yarn) package that needs to be installed *globally*.

```shell
npm install -g vue-cli
```

Inside our desired location in the system, we can run the setup as follows (Vue CLI provides us with a bunch of commands):

```shell
vue init webpack-simple my-project
cd my-project
```

The `vue init` command takes two parameters: The package to use (webpack/webpack-simple/browserify/ etc) and the project name (will be the name of the folder created).

Generally `webpack` theme is popularly used (since webpack build tool is really popular and useful). It has testing, ESLinting, etc configs that `webpack-simple` lacks - we should eventually use `webpack` for our projects.

Once we have our project setup, we can run the dev version of our app with:

```shell
npm run dev
```

### Single File Templates

With a build process, we can have single file components with the **`.vue`** extension. The components are usually placed inside the `./src/components` folder. It contains the template, the JS component logic, and the styles for that component:

```vue
<template>
  <div>
     <!-- Write your HTML with Vue in here -->	
  </div>
</template>

<script>
  export default {
     // Write your Vue component logic here
  }
</script>

<style scoped>
  /* Write your styles for the component in here */
</style>
```

The good thing about single file components: NO CONTEXT-SHIFTING!

Exporting one component into another (Accessing child via the parent):

```javascript
import New from './components/New.vue'; // ES6 style of importing

export default {
  /* We can have an object containing the child components */
  components: {
    New		// ES6 style of listing properties (Instead of `New: New`)
  }
}

/* Usage of child component in template:
<new></new> => All lowercase, and camelCase components have to be kebab-cased */
```

Our child component can even be ***renamed*** in the parent component:

```javascript
import New from './components/New.vue';

export default {
  components: {
    appNew: New
  }
}

/*
<app-new></app-new>
*/
```

**Initial Contents of a Vue CLI Setup:** 

You'll start off with an App file in your `/src/` directory with a `Hello.vue` file in the `/components/` directory. This is really nice because you can see already how you'd set up these files, and how imports and exports might work.

**Vue CLI folders**:

1. `/index.html`: The index file for project. Contains `#app` which the Vue app will use. We seldom use it, except for adding some external styles or scripts to the project (Say, for adding a font from CDN).
2. `/src/main.js`: Our main javascript file. It instantiates a vue app by importing `Vue` and imports immediate child component `App`. Note that all our work is done inside `/src`
3. `/src/App`: This is the main Vue App that is included by `main.js`. This is really the place where we start to work on our Vue app. We will be importing components, adding store, writing styles, etc.
4. `/src/assets`: Place to keep static stuff like images, and site-wide styles, etc.

All the components that we create, we generally place them inside `/src/components` (Create the folder if it doesn't exist).

**Note**: We can use what we need inside a component. For example, if we don't have any styles inside a component, we can remove the `<style>` tag completely.

**Deployment**: Once we have finished building our app, we can run **`npm run build`** which creates a `/dist` folder containing all the final HTML and JS files. The contents of this folder can be uploaded to the production server.

[**A list of sublime text vue snippets by Sarah Drasner**](https://github.com/sdras/vue-sublime-snippets)

**Scoped Styles:**

The `scoped` attribute in `<style scoped>` makes sure that styles we write are for that component itself and does not affect other components. This is a very useful attribute.

For slots in Vue components with the scoped style tags, they apply only to the component that has the slots.

**Importing Styles:**

If you want to import styles into your component's styles, we will need to install **`vue-style-loader`** package. For example, we can have a `normalize.css` (or `main.css`) inside our `/src/assets` folder and import it into our component's `<style>` with `@import '../assets/normalize.css'`.

### Lifecycle Hooks

Lifecycle hooks are very important in Vue.

The lifecycle hooks provide you a ***method*** so that you might *trigger* something precisely at *different junctures* of a component's lifecycle. Components are *mounted* when we instantiate them, and in turn *unmounted*, for instance when we toggle them in a v-if/v-else statement (but not for v-show, which only toggles its display).

Lifecycle hooks:

1. `beforeCreate`: It observes the data and init events
2. `created`: Template options and render. (***Important***)
3. `beforeMount`: Create Virtual DOM element and replace `el` with it.
4. `mounted`: When the DOM element is *rendered*. (***Important***)
5. `beforeUpdate`: Part of `mounted`. Just **before** *Virtual DOM re-render* and *patch*.
6. `updated`: Part of `mounted`. Just **after** *Virtual DOM re-render* and *patch*.
7. `activated`: Part of `mounted`. Works for `keep-alive` components - when it is *activated*.
8. `deactivated`: Part of `mounted`. Works for `keep-alive` components - when it is *deactivated*.
9. `beforeDestroy`: Just before the component is destroyed. For example, the `v-if` on it fails so it has to be unmounted and destroyed.
10. `destroyed`: When the component has been destroyed. For example, the `v-if` on it fails so it has to be unmounted and destroyed.

The Vue instance itself has these hooks but we're mostly going to have to work with the lifecycle hooks of the components we build.

[View the Sarah Drasner Codepen example on lifecycle hooks](https://codepen.io/sdras/pen/28d3a5b277ada8f9d1b0b34a2d73831c) (You need to view the console)

**Note:**

- Lifecycle hooks also *auto-bind* to the instance (component instance) so that you can use the component’s *state*, and *methods*. Again, you don't have to console.log to find out what **`this`** refers to! (It refers to the component and you can access its properties and methods like, `this.propName` or `this.methodName`)
- For this reason though, you should **not** use an *arrow function* on a lifecycle method, as it will return the *parent* instead of giving you nice binding out of the box. (Same applies for methods of a component - you should **not** use arrow function for methods)
- We can, however, use arrow functions for functions **inside** (nested) of a lifecycle hook function or a method.

An example (Executable code found on [Codepen](https://codepen.io/sdras/pen/28d3a5b277ada8f9d1b0b34a2d73831c)):

```html
<div id="app">
	<h3>Let's check out the lifecycle of this hur' child.</h3>
	<h4>Check the console!</h4>
	<button @click="toggleShow">
  		<span v-if="isShowing">Hide child</span>
  		<span v-else>Show child</span>
	</button>
	<hr>
	<div v-if="isShowing">
  	<app-child></app-child>
	</div>
</div>

<script type="text/x-template" id="childarea">
  <div>
  	<h4>Here I am!</h4>
  </div>
</script>
```


```javascript
const Child = {
  template: '#childarea',
  beforeCreate() {
    console.log("beforeCreate!");
  }, 
  created() {
    console.log("created!");
  }, 
  beforeMount() {
    console.log("beforeMount!");
  }, 
  mounted() {
    console.log("mounted!");
  }, 
  beforeDestroy() {
    console.log("beforeDestroy!");
  }, 
  destroyed() {
    console.log("destroyed!");
  }
};

new Vue({
  el: '#app',
  data() {
    return {
      isShowing: false 
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  },
  components: {
    appChild: Child
  }
});
```

### 2. Nuxt.js & Routing

Why use **Nuxt**?

- Automatic Code Splitting
- **Server-Side Rendering** (Leads to faster websites and helps with SEO since crawlers can see content in the source)
- **Powerful Routing System with Asynchronous Data** (For Vue CLI, It does not come with a built in routing sytem and you would have to use something like **`vue-router`**)
- **Great lighthouse scores out of the gate**  🐎 (Lighthouse is a performance metric tool for PWA apps and Nuxt.js has great scores on it)
- Static File Serving
- **ES6/ES7 Transpilation** (It doesn't mean we don't need Webpack - Nuxt still uses webpack like how Vue CLI setup does)
- Hot reloading in Development (It is a bit slower than `vue-cli` hot reload since it has to make changes in the server also)
- Pre-processor: SASS, LESS, Stylus, etc.
- Write Vue Files

Building a **Nuxt** project:

1. You need `vue-cli`: **`npm install -g vue-cli`**
2. **(Important)** You will init your project as a `nuxt/starter` template (instead of webpack):

```shell
vue init nuxt/starter my-project
```

3. Change directory to your project: **`cd my-project`**
4. Run dev: **`npm run dev`**

**Things to notice in a `Nuxt.js` setup:**

1. No `index.html` file. Instead, we have a **`nuxt.config.js`** file. In this file, we mention all the information that a normal `index.html`	would contain but in a slightly different, object format. The reason for it being the way it is has to do with the fact that Nuxt creates the index.html **for us** on the server-side.
2. The special stylesheets like `normalize.css` can be specified in the `css` array in `nuxt.config.js`.
3. There is a **`/pages`** directory which contains `.vue` files. We place our components that we'd like to have as standalone pages to here. The components are normal ones, just like how we built them in basic `vue-cli`. They contain a template, script and style.
4. Nuxt automatically knows that anything you put inside the `pages` folder needs to be a separate page that we can route to and it ***automatically*** creates that page and route for you. In *plain* `vue-cli`, we'd have to use `vue-router` (by importing it to main.js and use its middleware) and setup routes manually and include the file in `main.js`.
5. The other components (children) that do not need to be pages, are placed in the **`/components`** folder.
6. Our page layouts can be stored inside **`/layouts`** folder. For example, we can have `default.vue` inside the `/layouts` folder which has a menu bar component imported into it (adding header/footer). The files in this folder are like templates for a page. We can define **`<nuxt/>`** within the layout's template. This is the placeholder for the pages that are listed in `pages` directory. (Notice that this is similar to `vue-router` and its `<router-view></router-view>` tags!)
7. Wherever we have a **`<nuxt-link>`** in our templates (for example, in our header navigation or inside a page - anywhere), it is a link to one of our pages in the `/page` folder. The attribute **`to`** will contain the path to the page (`/` for index, for others it is `/filename`). (Notice that this is very similar to `vue-router`'s `<router-link to="/…"></router-link>` tags!)
8. `<nuxt-link>` has an optional **`exact`** boolean attribute. This tells nuxt to match the route exactly. For example, if we want to visit index page (`/`) then `to="/"` will match everything including `/cart` which we don't want to route to.

Routing example:

```vue
/* /pages/index.vue */
<template>
  <div class="container">
    <h1>Welcome!</h1>
    <p><nuxt-link to="/product">Product page</nuxt-link></p>
  </div>
</template>
 
<style>
  .container {
    font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    padding: 60px;
  }
</style>
```

```vue
/* /pages/Product.vue */
<template>
  <div class="container">
    <h1>This is the product page</h1>
    <p><nuxt-link to="/">Home page</nuxt-link></p>
  </div>
</template>
```

[View a sample Nuxt application on Sarah Drasner's repo](https://github.com/sdras/intro-to-vue/tree/master/setup2)

[Nuxt.js Docs](https://github.com/nuxt/nuxt.js)

## Filters, Mixins and Custom Directives

### Filters

The first thing to understand about filters is that they aren't replacements for methods, computed values, or watchers, **because filters don't transform the data, just the output that the user sees.**

Filters are useful when you want to make certain tweaks to how our data is displayed. Example: Formatting dates.

There are two ways to register a filter:

1. Globally 
2. Locally

```javascript
//global (like in main.js file, before the Vue instance)
Vue.filter('filterName', function(value) {
  return // thing to transform
});
 
//locally, like methods or computed
filters: {
  filterName(value) {
    return // thing to transform
  }
}
```

Using filters (in the template):

```javascript
// We use the pipe (|) symbol to mention the filter on a data property:
{{ data | filter }}

// Example:
{{ text | capitalize }}
```

The value that the filter function expects as parameter is the one that is piped into the filter within the mustache syntax. The filter then returns some computed output to the display.

```javascript
/*
<div id="app">
  <h2>Tip Calculator</h2>
  <p><strong>Total: {{ customer1total }}</strong></p>
  <p>15%: {{ randomVar | tip15 }}</p>
  <p>20%: {{ customer1total | tip20 }}</p>
  <p>25%: {{ customer1total | tip25 }}</p>
</div>
*/

new Vue({
  el: '#app',
  data() {
    return {
      customer1total: 35.43,
      randomVar: 100
    }
  },
  filters: {
    tip15(value) {
      return (value*.15).toFixed(2)
    },
    tip20(value) {
      return (value*.2).toFixed(2)
    },
    tip25(value) {
      return (value*.25).toFixed(2)
    }
  }
});
```

Note that `customer1total` itself never changes in value and a computed property is also not created (since it's not going to be used in code). Only the display changes.

**We can chain filters**:

 The syntax is `{ data | filterA | filterB }}`. The first will be applied first, second after:

```javascript
/*
<div id="app">
  <h2>Chained Filters</h2>
  <p><strong>Original number:</strong> {{ num }}</p>
  <p>plus5: {{ num | plus5 }}</p>
  <p>times2: {{ num | times2 }}</p>
  <p>plus5 then times2: {{ num | plus5 | times2 }}</p>
  <p>times2 then plus5: {{ num | times2 | plus5  }}</p>
</div>
*/

new Vue({
  el: '#app',
  data() {
    return {
      num: 2    
    }
  },
  filters: {
    plus5(value) {
      return value + 5
    },
    times2(value) {
      return value * 2
    },
  }
});
```

[View executable code](https://codepen.io/sdras/pen/33d92d8939e0c10e8ec80de693795a26)

**We can pass arguments to filters:**

The syntax is: `{{ data | filterName(arg1, arg2) }}`. The value that the filter acts on (the one that is piped to it) is the first param. The remaining params are the ones passed to it (in the same order).

```javascript
// arguments are passed in order after the value
filters: {
  filterName(value, arg1, arg2) {
    return //thing to transform
  }
}
```

**(Important!) Filters are not that optimized:**

Filters sounds like it would be good to filter a lot of data, but filters are rerun on every single update, so better to use **computed**, for values like these that should be cached!

Filters would be useful for date formatting, currency selection and conversin based on country, etc.

### Mixins

It's a common situation: you have two components that are pretty similar, they share the same basic functionality, but there's enough that's different about each of them that you come to a crossroads: do I split this component into two different components? Or do I keep one component, but create enough variance with props that I can alter each one?

A **mixin** allows you to ***encapsulate one piece of functionality*** so that you can use it in different components throughout the application.

 If written correctly, they are ***pure*** - they don't modify or change things outside of the function's scope, so you will reliably always receive the same value with the same inputs on multiple executions. (Functional Programming concept)

Mixins can be really powerful.

An example of two components having same toggle functionality and ***not*** using a mixin:

```javascript
//modal
const Modal = {
  template: '#modal',
  data() {
    return {
      isShowing: false
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  },
  components: {
    appChild: Child
  }
}


//tooltip
const Tooltip = {
  template: '#tooltip',
  data() {
    return {
      isShowing: false
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  },
  components: {
    appChild: Child
  }
}
```

The same two components, when they start using a mixin:

```javascript
// Toggle mixin:
const toggle = {
  data() {
    return {
      isShowing: false
    }
  },
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  }
}

// Modal component:
const Modal = {
  template: '#modal',
  mixins: [toggle],
  components: {
    appChild: Child
  }
};

// Tooltip component:
const Tooltip = {
  template: '#tooltip',
  mixins: [toggle],
  components: {
    appChild: Child
  }
};
```

The mixin's data elements behave or are attached to the components that they are used in. Each component will have a separate copy (it's not shared).

[Full example on codepen including the templates](https://codepen.io/sdras/pen/101a5d737b31591e5801c60b666013db)

Some example use-cases for mixins:

- Getting dimensions of the viewport and component
- Gathering specific mousemove events
- Base elements of charts

**Merging with Mixins:**

By default, mixins will be applied first, and the component will be applied second so that we can override it as necessary. **The component has the last say.**

```javascript
//mixin
const hi = {
  mounted() {
    console.log('hello from mixin!')
  }
}

//vue instance or component
new Vue({
  el: '#app',
  mixins: [hi],
  mounted() {
    console.log('hello from Vue instance!')
  }
});

//Output in console
//> hello from mixin!
//> hello from Vue instance!
```

*Mixins have all of the lifecycle events available to them just like a component*. The mixin that's included in the component is run (mounted) first in the above example and then the component/instance. The component's mounted method overrides the mixin's override method since it has the last say.

```javascript
//mixin
const hi = {
  methods: {
    sayHello: function() {
      console.log('hello from mixin!')
    }
  },
  mounted() {
    this.sayHello()
  }
}

//vue instance or component
new Vue({
  el: '#app',
  mixins: [hi],
  methods: {
    sayHello: function() {
      console.log('hello from Vue instance!')
    }
  },
  mounted() {
    this.sayHello()
  }
})

// Output in console
//> hello from Vue instance!
//> hello from Vue instance!
```

When using `vue-cli`, we can probably set up mixins inside a `mixins` folder and import it into components.

**Global Mixins:**

Global mixins are literally applied to every single component. One use I can think of that makes sense is something like a plugin, where you may need to gain access to everything.

**But still, the use case for them is extremely limited and they should be considered with great caution.**

Example of a global mixin:

```javascript
Vue.mixin({
  mounted() {
    console.log('hello from mixin!')
  }
})

new Vue({
  ...
})
  
// This console.log would now appear in every component!
```

Only few cases exist where it is okay to have a global mixin. One of those cases is when you are developing a Vue plugin and need access to all components.

### Custom Directives

**A recap of how directives (standard or custom) work:**

- **v-example** - this will instantiate a directive, but doesn't accept any arguments. Without passing a value, this would not be very flexible, but you could still hang some piece of functionality off of the DOM element.
- **v-example="value"** - this will pass a value into the directive, and the directive figures out what to do based off of that value. Ex: `<div v-if="stateExample">I will show up if stateExample is true</div>`.


- **v-example="'string'"** - this will let you use a string as an expression. Ex: `<p v-html="'<strong>this is an example of a string in some text</strong>'"></p>`.
- **v-example:arg="value" **- this allows us to pass in an argument to the directive. In the example below, we're binding to a class, and we'd style it with an object, stored separately. Ex: `<div v-bind:class="someClassObject"></div>`.
- **v-example:arg.modifier="value"** - this allows us to use a modifier. The example below allows us to call preventDefault() on the click event. Ex: `<button v-on:submit.prevent="onSubmit"></button>`.

**The lifecycle hooks of a directive (not the same as a component):**

![https://s3.amazonaws.com/media-p.slid.es/uploads/75854/images/3909041/custom-directives-flat.svg](https://s3.amazonaws.com/media-p.slid.es/uploads/75854/images/3909041/custom-directives-flat.svg)



**Custom Directives:**

The custome directives are usually specifed in the `main.js` file since they are available to every component.

Syntax: 

```javascript
Vue.directive('tack', {
  bind(el, binding, vnode) {
    ... // el is the DOM element, 
    ... // binding is the object containing value passed to it
  }
});
```

**Custom Directive Example 1:** Passing a value:

```javascript
/*
<div id="app">
  <p>Scroll down the page</p>
  <p v-tack="70">Stick me 70px from the top of the page</p>
</div>
*/

Vue.directive('tack', {
  bind(el, binding, vnode) {
    el.style.position = 'fixed'
    el.style.top = binding.value + 'px'
  }
});
```

**Custom Directive Example 2:** Passing an argument

```javascript
/*
<p v-tack:left="70">I'll now be offset from the left instead of the top</p>
*/

Vue.directive('tack', {
  bind(el, binding, vnode) {
    el.style.position = 'fixed';
    const s = (binding.arg == 'left' ? 'left' : 'top');
    el.style[s] = binding.value + 'px';
  }
});
```

**Custom Directive Example 2:** Passing more than one value

```javascript
Vue.directive('tack', {
  bind(el, binding, vnode) {
    el.style.position = 'fixed';
    el.style.top = binding.value.top + 'px';
    el.style.left = binding.value.left + 'px';
  }
}); 
```

## Vuex (Centralized Data Store)

**What** is **Vuex**?

- It is a Centralized store for shared data and logic, even shared methods or async (Useful for larger applications)
- Unidirectional data flow
- Influenced by Flux application architecture
- Hence, similar to Redux
- You can still use Redux if you like but this is Vue's version

**Why** use Vuex?

In a complex single page application, passing state between many components, and especially deeply nested or sibling components, can get complicated quickly. Having one centralized place to access your data can help you stay organized.

**When** do we use Vuex?

- Multiple instances of children/siblings communicating
- I'd like to "see" what all of the state looks like and keep it organized in one place.
- ***Warning:*** Vuex is not a replacement for single component methods.

### Setup

**`npm install --save vuex`** or **`yarn add vuex`**

I set it up this way: within my `/src` directory, I create another directory named store (this is a preference, you could also just create a `store.js` file in that same directory), and a file named `store.js`.

**Initial file contents:**

```javascript
/* store/store.js */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex); // middleware that uses Vuex

export const store = new Vuex.Store({
  state: {
    key: value
  }
});
```

```javascript
/* main.js */
import Vue from 'vue';
import App from './App.vue';

import { store } from './store/store'; // Importing the store

new Vue({
  el: '#app',
  store, // Including store in instance (ES6 style) (ES5 style: `store: store`)
  template: '<App/>',
  components: { App }
});
```

**Parts of a store**

1. **State:** Contains the `key: value` pairs (The data).
2. **Getters:** will make values able to show statically in our templates. In other words, getters can *read the value*, but not mutate the state.
3. **Mutations:** will allow us to *update* the state, but they will *always be synchronous*. Mutations are the ***only*** way to change data in the state in the store.
4. **Actions:** will allow us to *update* the state, *asynchronously*, but will *use an existing mutation*. This can be very helpful if you need to perform a few different mutations at once in a particular order, or reach out to a server.

The store is available in our component's methods with the special **`this.$store`**.

We *separate* actions and mutations because we don't want to get into an ordering problem!

```javascript
/* Basic abstract example (store/store.js): */
export const store = new Vuex.Store({
  state: {
    counter: 0
  },
  //showing things, not mutating state
  getters: {
    tripleCounter: state => {
      return state.counter * 3;
    }
  },
  //mutating the state
  //mutations are always synchronous
  mutations: {
    //showing passed with payload, represented as num
    increment: (state, num) => {
      state.counter += num;
    }
  }, 
  //commits the mutation, it's asynchronous
  actions: {
    // showing passed with payload, represented as asyncNum (an object)
    asyncIncrement: ({ commit }, asyncNum) => {
      setTimeout(() => {
        //the asyncNum objects could also just be static amounts
        commit('increment', asyncNum.by);
      }, asyncNum.duration);
    }
  }
});
```

#### Actions

We have to pass in the `context`: It is composed of `context.state`, `context.getter`, `context.commit`. We cannot pass state directly to actions because of some complex namespacing conflict.

`commit` is used to "commit" (perform) a mutation (remember that actions use mutations). The first argument is the mutation name and the second (optional) would be the payload (data). Since we can pass only one payload, to send multiple data items, payload can be made an object with all those items in it.

 ```javascript
actions: {
  increment (context) {
    context.commit('increment')
  }
}
 ```

Typically, we will destructure the context so that it's a bit more legible:

```javascript
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

We can perform asynchronous actions inside `actions`. It helps with debugging too! Suppose async method is done inside `mutations` then the mutation is seen when the async call has not even ended yet. But with actions, the mutation is commited only when it finishes.

```javascript
actions: {
  asyncIncrement ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Using async calls inside `mutations` could block up our app. Better async methods in `actions`.

**Calling an action from our component (`dispatch`)**

We can call `this.$store.dispatch()` where first argument is the name of the action and an optional second argument is the payload where we mention the data (Note that there is no third argument, so all of the data you want to pass must be inside payload - make payload an object).

```javascript
// Inside a component:
methods: {
  asyncIncrement() {
    this.$store.dispatch('asyncIncrement')
  }
}
```

```javascript
// Passing a payload:

// Store:
actions: {
  asyncIncrement: ({ commit }, asyncNum) => {
    setTimeout(() => {
      commit('increment', asyncNum.by);
    }, asyncNum.dur);
  }
}

// Component:
methods: {
  asyncIncrement() {
    this.$store.dispatch('asyncIncrement', {
      by: 10,
      dur: 1000
    })
  }
}
```

#### Using getters inside the components

The `getters` can be called from any method inside our components but there is a general best practice: 

- On the component itself, we would use **computed** for **getters** (this makes sense because the value is already computed for us), and 
- **methods** with **commit** to access the **mutations, **(synchronous) and 
- methods with **dispatch** for the **actions** (asynchronous):

```javascript
// Inside a vue instance or component:
computed: {
  value() {
    return this.$store.getters.tripleCounter;
  }
},
methods: {
  increment() {
    this.$store.commit('increment', 2)
  },
  asyncIncrement() {
    this.$store.dispatch('asyncIncrement', 2)
  }
}
```

**Note**: For mutations, we will call is using `commit` (passing the name of the mutation and optionally the payload). We call commit to mutate whether it is from a component method or from inside the store's actions.

Inside a mutation, we have direct access to the `state` and can update its properties (Ex: `state.ctr += 1;`).

[Very nice YT tutorial on Vuex store and how to use it](https://www.youtube.com/playlist?list=PL4cUxeGkcC9i371QO_Rtkl26MwtiJ30P2)

- **Getters** receive `state` as parameter
- **Mutations** receive `state` and optionally a payload as parameters.
- **Actions **receive `context` (contains `commit` and `state`, etc) and optionally a payload as parameters.

**Note:** We can use a **spread** operator, useful when you have to work with a **lot** of getters or mutations or actions:

```javascript
// Inside a component:

import {mapActions} from 'vuex';

export default {
  // ...
  methods: {
    ...mapActions([
      // map this.increment() to this.$store.dispatch('increment')
      'increment', 
      'decrement',
      'asyncIncrement'
    ])
  }
}

// Usage also could change like this (Since actions are properties of `this` now):
/* 
<button @click="increment(5)">Number of TACOS</button>
*/
```

For getters use `mapGetters` and for mutations it is `mapMutations`.

This allows us to still make our own computed properties if we wish.

You may need: `babel-preset-stage-2` or `babel-plugin-transform-object-rest-spread`.

## Wrapping it up

**Further Resources:**

[vue docs](https://vuejs.org/)

[vue repo](https://github.com/vuejs)

[nuxt docs](https://nuxtjs.org/)

[vuex docs](https://github.com/vuejs/vuex)

[css-tricks guide](https://css-tricks.com/guides/vue/)

[awesome vue](https://github.com/vuejs/awesome-vue)

[vue newsletter](http://vue-newsletter.com/)

[monterail blog](https://www.monterail.com/blog)

[vue tips](http://vuetips.com/)

[the majesty of vue](https://leanpub.com/vuejs2)

**………...The End!**

