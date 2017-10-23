# VueJS Notes

**VueJS**: Progressive Javascript Framework (Is extremely intuitive and makes it easy to think about applications).

Most web apps are structured using **components** when built using a framework. These components are reusable.

**What is VueJS?**

- ***Progressive framework*** for building user interfaces
- Works with the ***view layer*** of your app
- Can ***integrate*** with ***existing*** projects
- Can be used ***standalone*** to build big ***SPAs***

**Benefits of VueJS**

- ***Approachable***: Straight forward docs, intuitive syntax, uses familiar tools - HTML, CSS, JS
- ***Versatile***: Can easily slide into existing projects, can be used standalone for big projects and lots of libraries.
- ***Performant***: Light-weight and blazing fast.

**Features of VueJS**

- ***Reactive Interfaces***: VueJS helps us build apps that react to user input and update the data model seamlessly (using straight forward and intuitive syntax).
- ***Declarative Rendering***: Template syntax is as you would expect. Templates are written in HTML and are made reactive under the hood.
- ***Data Binding***: VueJS allows us to ***dynamically bind*** HTML attributes.
- ***Directives and Template Logic***: Adds extra functionality to your app (eg. `v-if` is an inbuilt directive that shows or hides an HTML element based on a boolean value).
- ***Components***: Components represent well organized architecture. Makes it easy to reason about our apps overall.
- ***Event handling***: Event handling in VueJS is also straight forward (eg. `v-on` directive captures events and performs and action, the template also being updated). 

**VueJS vs Other Javascript Frameworks**:

Benchmark data is not the single source of truth - find out for yourself by testing each framework - choose what suits your needs.

- VueJS makes use of ***Virtual DOM*** just like ReactJS.
- On ***average***, Vue 2.0 is ***faster*** than ReactJS.
- VueJS is ***definitely faster*** than AngularJS.
- VueJS is ***fast enough*** for modern web applications.
- VueJS is ***Extremely light-weight*** compared to many other frameworks.

## Setting up VueJS

1. Including VueJS as a single CDN or local file:

```html
<!-- CDN file -->
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<!-- OR: Local file -->
<script src="/path/to/vue.js"></script>
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Vue JS</title>
</head>
<body>
	<div id="app">{{ message }}</div>
	<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
	<script>
		new Vue({
			el: '#app',
			data() {
				return {
					message: 'Hello Vue'
				};
			}
		});
	</script>
</body>
</html>
```

2. Alternatively, we can install vue using ***NPM*** (if using NodeJS) or via ***Bower***.

```bash
# With NPM:
npm install vue
# With Bower:
Bower install vue
```

3. You can also bootstrap your program using **`vue-cli`** (Another, ***recommended alternative*** to installing VueJS). It comes with a router and loader for creating single file components. These tools have proven to be very useful with any type of vue projects.

```shell
# This install vue-cli library globally:
npm install -g vue-cli
# This initializes the project using the webpack template:
vue init webpack my-project # There could be other templates apart from the webpack one

cd my-project
npm install
npm run dev # Opens 'http://localhost:8080/#/' in the browser by default
```

[List of available templates for vue-cli](https://github.com/vuejs/vue-cli)

4. Install ***Vue Dev Tools*** which is a Chrome extension that helps debug VueJS applications. You can get it from the [Chrome extension website](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en).

## Building a simple SPA in VueJS

1. Every VueJS application starts off with a root Vue *instance* (i.e **`new Vue()`**).
2. The root Vue instance is ***constructed*** with an ***object*** containing a bunch of ***properties***.
   1. First, we specify the HTML element (usually with an `id`) that VueJS can mount itself on. This is defined by the **`el`** property. (This is what is meant by *declarative* - the template is just HTML and when Vue is mounted on it - it becomes *reactive*).
   2. The **`data`** property contains all the data that we can access from our vue app. We may sometimes refer to it as the *data model* of our app. The `data` property is an object and its properties are the ones that can be accessed inside the template ([string interpolation](https://en.wikipedia.org/wiki/String_interpolation))

**Note**: The properties contained inside `data` key of a Vue instance are known as **State Variables**.

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Vue JS</title>
</head>
<body>
	<div id="guestbook-app">
		<div class="form">
			
		</div>
		<ul class="entries-list">
			<li v-for="entry in entries">{{ entry }}</li>
		</ul>
	</div>
	<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
	<script>
		new Vue({
			el: '#guestbook-app',
			data: {
				message: 'Hello Vue',
				entries: ['Hello', 'World']
			}
		});
	</script>
</body>
</html>
```

**The `v-for` Directive**

**`v-for`** is an important vue ***directive*** (directives are custom html attributes that add some extra functionality). `v-for` allows us to iterate over a collection (an array, perhaps) and basically repeat as many DOM elements as there are in the collection (eg. Iterating over a list of entries which can be stored in our data model and print out HTML elements for each of them).

`v-for` syntax: **`<htmltag v-for="[name] in [collection]">{{ [name] }} </htmltag>`**. 

The `[name]` serves as a temporary variable to hold an element in the collection. 

A better example of `v-for`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Vue JS</title>
</head>
<body>
	<div id="guestbook-app">
		<div class="form">
			
		</div>
		<ul class="entries-list">
			<li v-for="entry in entries">
				<p>{{ entry.text }}</p>
				<small>{{ entry.user }}</small>
			</li>
		</ul>
	</div>
	<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
	<script>
		new Vue({
			el: '#guestbook-app',
			data: {
				message: 'Hello Vue',
				entries: [{
						user: 'pushkar',
						text: 'Hi bruh'
					}, {
						user: 'mark',
						text: 'Bye... I am going'
					}]
			}
		});
	</script>
</body>
</html>
```

**The `v-model` Directive**

**`v-model`** is another important vue ***directive***. It allows for **two-way data binding** between the HTML element and our vue js **`data` properties**. Changing one of them will change the other. For example, if an input field and a data property are in a two-way binding then changing one of them will change the other. The change happens in ***Real-Time***.

Syntax:  **`<htmltag v-model="[A vue data property]">...</htmltag>`**

**Defining Methods in VueJS**

VueJS allows us to define methods inside the **`methods`** property of the VueJS instance's constructor object. A new method is defined as a *key* in the `methods` object.

Inside a method, the `data` attribute of the parent vue constructor can be accessed using **`this`**. Hence, its properties can also be used or updated from inside the method.

The defined methods can be ***invoked*** when certain ***events*** are triggered.

**The `v-on` Directive**

`v-on` is a VueJS directive that allows us to *listen to common javascript events* (eg. click event). `v-on` event needs to be defined like this `v-on:<eventname>` and its value will be the call to the vue method we want to trigger.

Syntax: **`<htmltag v-on:<eventname>="[A vue method name]()">...</htmltag>`**

An example of an app that adds an entry (it uses `v-model`, `methods`, `v-on`, and `v-for`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Vue JS</title>
</head>
<body>
	<div id="guestbook-app">
		<div class="form">
			<input type="text" v-model="newEntry.name">
			<textarea cols="150" rows="10" v-model="newEntry.text"></textarea>
			<input type="button" value="submit" v-on:click="addNewEntry()">
		</div>
		<ul class="entries-list">
			<li v-for="entry in entries">
				<p>{{ entry.text }}</p>
				<small>{{ entry.user }}</small>
			</li>
		</ul>
	</div>
	<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
	<script>
		new Vue({
			el: '#guestbook-app',
			data: {
				newEntry: {
					name: '',
					text: ''
				},
				message: 'Hello Vue',
				entries: [{
						user: 'pushkar',
						text: 'Hi bruh'
					}, {
						user: 'mark',
						text: 'Bye... I am going'
					}]
			},
			methods: {
				addNewEntry() {
					this.entries.push({
						user: this.newEntry.name,
						text: this.newEntry.text
					})
				}
			}
		});
	</script>
</body>
</html>
```

## Building Blocks of VueJS

1. **Templates**

Declarative rendering means that all our templates are specified as pure HTML. We use the mustache syntax `{{ … }}` to insert dynamic content into our HTML. The mustache can contain a *variable* or *any javascript expression* including *ternary* operators.

VueJS comes with a bunch of built-in directives that can be used inside the template. These are special HTML attributes used by VueJS on the element and they add extra functionality. We have already seen a few: `v-model`, `v-for` and `v-on`. Let's look at a few more.

**The `v-bind` Directive**

VueJS allows us to dynamically bind ***HTML Attributes*** (`src`, `class`, `href`, etc) using the `v-bind` directive. We pass in the name of the data property in the template (the data property holds the value for that attribute).

Syntax: **`<htmltag v-bind:[attrName]="[A vue data property]">...</htmltag>`**

Example:

```html
<div id="users">
    <p>Male users {{ maleUsers }}</p>
    <p>Female users {{ femaleUsers }}</p>
    <p>You are a {{ isMale ? 'Male' : 'Female' }} user</p>
    <img v-bind:src="catPhoto" alt="dog pic">
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    new Vue({
        el: '#users',
        data: {
            maleUsers: 40,
            femaleUsers: 35,
            isMale: true,
            catPhoto: 'https://www.stockvault.net/data/2011/03/20/119866/preview16.jpg'
        }
    });
</script>
```

The `v-bind` directive has a ***shorthand***: Just replace `v-bind:` with **`:` (colon)**. 

`<img :src="catPhoto">`  is the same as `<img v-bind:src="catPhoto">`

The `v-bind` can also ***bind a value to an attribute based on a boolean expression's output***. For example, `v-bind:class="{done: todo.done}"` attaches the `done` class to the element if `todo.done` is `true` (`todo` can be a data property or a prop).

**The `v-if` Directive**

The `v-if` directive *hides or displays* an HTML element based on the evaluated ***boolean expression***. 

```html
<div id="users">
    <p v-if="shouldShow">
        Can you see me?
    </p>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    new Vue({
        el: '#users',
        data: {
            shouldShow: true
        }
    });
</script>
```

**The `v-for` Directive**

We have already seen the `v-for` directive earlier. It is used to ***iterate over a collection*** (eg. an array) and is useful in ***accessing*** each of the collection's ***elements***. Imagine a case where you have to display the chat history where the chats are in an array - `v-for` would be useful here.

When we add the `v-for` directive in the template, we wish to add the element as many times as there are elements in the collection mentioned.

Syntax: **`<htmltag v-for="[name] in [collection]">{{ [name] }} </htmltag>`**. 

The `[name]` serves as a temporary variable that holds each element in the collection. 

```html
<div id="users">
    <ul>
        <li v-for="user in users">User: {{ user }}</li>
    </ul>
	<img :src="dogPic"> <!-- :src === v-bind:src -->
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    new Vue({
        el: '#users',
        data: {
            users: ['Pushkar', 'Saurabh', 'Pavan', 'Neha', 'Ganga'],
          	dogPic: 'https://www.stockvault.net/data/2011/03/20/119866/preview16.jpg'
        }
    });
</script>
```

2. **Events**

Event listening in VueJS is done with the **`v-on`** directive. It allows us to *listen to common javascript events* (eg. click, dblclick, hover, mouseover, change, etc). We specify the event with `v-on:` as the prefix. The *value* is the Vue *method* that needs to be triggered.

Syntax: **`<htmltag v-on:<eventname>="[A vue method name]()">...</htmltag>`**

The `v-on` directive has a ***shorthand***: Just replace `v-on:` with **`@` (At the rate symbol)**. 

`<img @click="deletePic()">`  is the same as `<img v-on:click="deletePic()">`

```html
<style>
  .blue {
      color: #00f;
  }
  .green {
      color: #0f0;
  }
</style>
<div id="users">
  <input type="button" v-on:click="showAlert()" value="Click me">
  <input type="text" v-on:change="changeClass()" v-bind:class="color">
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
  new Vue({
      el: '#users',
      data: {
          color: 'blue'
      },
      methods: {
          showAlert() {
              alert('I am alerting you!');
          },
          changeClass() {
          	  // Note: 'data' object can be accessed via `this` inside the methods:
              this.color = this.color === 'blue' ? 'green' : 'blue';
          }
      }
  });
</script>
```

**Preventing the default operations on elements via event modifiers**

The `v-on` directive takes an optional parameter **`.prevent`** which prevents the default action from happening on that element's event (eg. `<a>` tag going to link specified in `href` attribute can be prevented). This event modifier `.prevent` is similar to the `e.preventDefault()` in vanilla javascript.

The general syntax for event modifiers is: 

**`<htmltag v-on:[eventName].[eventModifierName]="[a method in vue js]()"></htmltag>`**

```html
<div id="vue-app">
    <a :href="href" v-on:click="clickHandler()">Goes to google by default</a>
    <br>
    <a :href="href" v-on:click.prevent="clickHandler()">Does not go to google</a>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    new Vue({
        el: '#vue-app',
        data: {
            href: 'http://www.google.com'
        },
        methods: {
            clickHandler() {
                alert('You clicked me!');
            }
        }
    });
</script>
```

3. **Forms**

The `v-model` directive (seen earlier) can be used on form elements to capture the changes to the inputs made by the user into our data properties (The `v-model` provides two-way data-binding between HTML element and data properties). 

```html
<div id="vue-app">
		<input type="text" v-model="message">
		<input type="button" v-on:click="showMessage()" value="Show message">
	</div>
	<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
	<script>
		new Vue({
			el: '#vue-app',
			data: {
				message: ''
			},
			methods: {
				showMessage() {
					alert(`message: ${this.message}`);
				}
			}
		});
	</script>
```

The `v-model` binding can be applied to form tags other than `<input>` also. For example, it can be applied to `<select>`. The `<input type="submit">` can listen to the click event on it.

```html
<div id="vue-app">
    <input type="text" v-model="user">
    <select v-model="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
    </select>
    <input type="submit" v-on:click="authenticate()" value="Check Authorization">
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    new Vue({
        el: '#vue-app',
        data: {
            user: '',
            gender: ''
        },
        methods: {
            authenticate() {
                if(this.user === 'brown' && this.gender === 'male') {
                    alert(`Welcome Mr. ${this.user}`);
                } else {
                    alert('You are not the correct user!');
                }
            }
        }
    });
</script>
```

4. **Making AJAX Requests with `vue-resource` Vue Plugin**

AJAX requests are very important to any website. It helps us interact with the server's API (such as a REST API). VueJS makes it very easy to make AJAX requests with the `vue-resource` plugin.

Installing `vue-resource`: **`npm install vue-resource`**

**CDN script** for `vue-resource`:  **`<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-resource/1.3.4/vue-resource.min.js"></script>`**

[Github repo for `vue-resource`](https://github.com/pagekit/vue-resource)

The Vue model instance has `$http` variable automatically available when using `vue-resource` plugin. This `$http` variable has methods (http verbs) to get/post/etc to URLs (APIs). Promise is returned on these methods and can be handled in the `then` chain.

```javascript
new Vue({ 
    el: '#vue-app', 
    mounted() { 
        this.$http.get('http://www.google.com')
            .then(function(response) { 
                // Do something with response
            }, function(err) {
                // Do something when an error occurs
            });
    } 
});
```

**The `mounted()` method**

Every vue instance's constructor can have a `mounted()` method which is triggered when the UI component is loaded - that is, the data properties are loaded, template is ready, etc.

It is useful when we need to ***preload data*** to the page as soon as the ***UI component is ready***.

The AJAX functions that input data to the templates can be placed inside this `mounted()` method.

```html
<div id="vue-app">
    <img type="text" v-bind:src="sources.imageSource">
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-resource/1.3.4/vue-resource.min.js"></script>
<script>
new Vue({ 
    el: '#vue-app', 
    data: {
        sources: {
            imageSource: ''
        }
    },
    mounted() { 
        this.$http.get('https://jsonplaceholder.typicode.com/photos')
            .then(function(response) {
                this.sources.imageSource = response.body[0].url;
            }, function(err) {
                alert('Error occurred');
            });
    } 
});
</script>
```

## Components in VueJS

Components are VueJS's ***most powerful feature***. They give us a way to ***create reusable custom elements***.

We can pass custom values to components using **props** in VueJS.

**Creating a component:**

1. Vue syntax: **`Vue.component(<componentTagName>, <optionsObjectToInitializeComponent>)`**.
2. The component in the template is represented by a *custom tag in HTML* with the *component's name* as the *tag name*.
3. Some of the options that we need to specify in the options object are:
   1. **`template`**: Contains the template we will replace the component with. Component template should contain ***exactly one root element***.
   2. **`data`**: We have a data variable similar to how we have in a Vue instance (`new Vue({})`). The ***difference*** is that the `data` property in a component must be defined within a function and that function returns an object (*Module pattern*). If we don't define it within a function, the object gets reused by various instances of that component which is undesirable since we want every instance to have its own data object.
   3. **`methods`**: Similar to a vue instance, even components can have methods which are defined within the `methods` property of the options object. These will have access to data properties as well as props via the `this` reference.
   4. If there are other properties, we will learn it along the way.

Whenever we use the component tag in HTML, it gets replaced by its `template` and this template can have: 

- String interpolation (mustache syntax `{{}}`).
- Vue directives (v-on, v-model, v-bind, v-for, v-if, etc).
- Nested components (one component inside another)

**Note**:

- Components should be used inside a vue instance (`new Vue()`). So, for any component to work inside an element, a vue instance must exist on that element (`el` property in the constructor).
- **(?)** I think using camelCase or PascalCase for components *does not work*. Use ***dashes(-)*** to separate out multiword component names in the template.

```html
<div id="app">
    <sample-component></sample-component>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    // Define a vue component:
    Vue.component('sample-component', {
        template: '<p>Hello {{ name }}!</p>',
        data: function() {
            return {
                name: 'Pushkar'
            }
        }
    });
    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app'
    });
</script>
```

**Nested or Child Components**

These are components that are defined within another component. They can *only* be used *within* the *template of the parent component* but not outside it.

We have a **`components`** property inside the parent component's options object (second argument to `Vue.component`). Inside this we can define child components. Syntax: 

```javascript
// Inside a component's options object (The second argument to Vue.component)
// ...
components: {
	<componentNameString>: {
        template: '...',
        data: function() {
            return {
                // ... : ...
            }
        }
      	// ...
    }
}
// ...
```

Example:

```html
<div id="app">
    <sample-component></sample-component>
    <child-component></child-component> <!-- Child cmpnt is NOT compiled outside parent component -->
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    // Define a vue component:
    Vue.component('sample-component', {
        template: '<p>Hello {{ name }}! <child-component></child-component></p>',
        data: function() {
            return {
                name: 'Pushkar'
            }
        },
        components: {
            'child-component': {
                template: '<span>Welcome to {{ welcomePlace }}</span>',
                data: function() {
                    return {
                        welcomePlace: 'VueJS'
                    }
                }
            }
        }
    });
    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app'
    });
</script>
```

**Composing components**

When we are composing components such as nested component, the rule that we need to remember is:

> The data (props) always goes downwards (from parent to child) and the events emitted by a child is sent upwards (to the parent).

![Composing components](https://vuejs.org/images/props-events.png)

- ***The parent is responsible for passing data to all child components.***
- ***Child sends events upwards to parents to give information about what is happening to it***.

In this way, it is very *easy to architect* our apps. Data does *not* get modified by child components *unknowingly* and everything is very *streamlined*.

**The `props` Property of Components**

`props` are *custom attributes* primarily used to ***pass data*** from *parent* components to *child* components.

Defining `props`:

- We use the `props` key inside the options object of a vue component. 
- Each prop's name is specified inside an array that is assigned to the `props` key.
- In the template containing the component tag, we can write the *name* of the prop as an *attribute* of the component tag and *assign it a value*. ***If camel cased prop names are used in the template as attributes then they must be changed to dashed (-) names inside it*** **(?)**.
- These props can be *accessed* via name in the *component's template* using the mustache syntax `{{}}`. This is similar to how data property keys (state variables) are accessed.
- Similar to accessing data properties (state variables), the props can be accessed with the `this` reference inside methods.

```html
<div id="app">
  <sample-component new-prop="100"></sample-component> <!-- = <p>1002</p> -->
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    // Define a vue component:
    Vue.component('sample-component', {
        template: '<p>{{ newProp + 2 }}</p>',
        props: ['newProp']
    });
    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app',
      	data: {
			newPropValue: 1000
		}
    });
</script>
```

- Each prop can be bound to data property on the Vue instance (`new Vue({ ... })`) instead of being assigned a value directly in the template (as in the above example). This is known as ***dynamically assigning a prop value***. So, use `v-bind` to bind the prop's value to a data property on the vue instance.

```html
<div id="app">
    <sample-component v-bind:new-prop="newPropValue"></sample-component>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    // Define a vue component:
    Vue.component('sample-component', {
        template: '<p>{{ newProp }}</p>',
        props: ['newProp']
    });
    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app',
        data: {
            newPropValue: 1000
        }
    });
</script>
```

**Note**: Do not mutate or transform prop values sent from parent to child components. Attempting to do so will trigger a warning message from Vue since it *breaks* the ***One-way data flow*** rule.

**Validating Props**

We can validate props in VueJS. Inside the `props` key, instead of using an array to specify props, we use an *object*.

The *object* has keys that refer to a prop. The value of this key will be a javascript data type (eg. Number). If we want to delve deeper, each prop can be an object with `type`, `required`, `default`, etc. attributes (self-explanatory). This kind of definition of props is similar to schema definition in MongooseJS.

```html
<div id="app">
    <sample-component v-bind:new-prop="newPropValue" prop-a="propA value"></sample-component>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    // Define a vue component:
    Vue.component('sample-component', {
        template: '<p>{{ newProp }} {{ propA }}</p>',
        props: {
            newProp: Number,
            propA: {
                type: String,
                required: true,
                default: 'Hello'
            }
        }
    });
    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app',
        data: {
            newPropValue: 1000
        }
    });
</script>
```

**Emitting Custom Events Inside Components**

In order to emit events from inside a component, we can use **`this.$emit`** inside the component's methods (`this` refers to the `data` object). The **argument** to the `this.$emit()` function is the *name of the custom event.* An optional second argument to it is the *data* to be passed along with the event (eg. a prop/state variable_.

*It is easy for parent components to listen to child component events since events travel upwards.*

*Listening to an event*: We can use the `v-on:` directive for listening to events but instead of mentioning a javascript event, we will supply the name of the custom event.

**The `v-show` directive**: It is very similar to `v-if` in that it takes in a boolean value and shows/hides the element accordingly. The difference is that `v-if` does not render the element in the DOM if the value is false but `v-show` will still render it in the DOM but hides it.

**Note**: We need not always invoke a method when `v-on` is triggered. We can pass it a javascript expression to evaluate (eg. `v-on:click="someDataProp = false"`).

```html
<div id="app">
    <sample-component v-show="isOpen" v-on:close-component="isOpen = false"></sample-component>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    // Define a vue component:
    Vue.component('sample-component', {
        template: `
            <p>
                Click the close button to close me
                <input type="button" v-on:click="closeComponent" value="close">
            </p>
            `,
        methods: {
            closeComponent() {
                this.$emit('close-component');
            }
        }
    });
    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app',
        data: {
            isOpen: true
        }
    });
</script>
```

Using the `this.$emit` technique, we can achieve sophisticated communication between parent and child.

**Sending Data in Events**

Since parents can listen to events emitted by children, we can pass data along with the event by specifying it as the second argument to `$emit` (Note that this is not possible otherwise since only the props on the parent are available to the child but not vice-versa).

In order to preserve that prop flow from parent to child only, we should make a clone of the properties (Using something like `Object.assign(targetObj, sourceObj1, [sourceObj2, ...]);`and send it instead of sending the reference to the prop directly.

Example: 

```javascript
// ...
data() {
  	return {
  		newTodo: { text: '', done: false }
	}
},
methods: {
  addItem() {
		const newTodoItem = Object.assign({}, this.newTodo);
  		this.$emit('new-todo',newTodoItem) 
    	// Instead of this.$emit('new-todo', this.newTodo)
	}
}
// ...
```

**Capturing Events**

Event listeners can be attached using the regular `v-on:<eventName>` attribute (Shorthand: `@<eventName>`).

The data passed with the emitted event will be available as ***parameter*** to the function/method that handles the event.

**Using `slot` Inside Components**

Components help us organize our code better and nested components offer better semantic appeal. There is one case that is still not handled by components and that is related to existing component data. What if the component has *nested text* or *HTML* that we want to preserve and not overwrite? We can do that using `<slot>` tag within our template for the component.

```html
<div id="app">
    <my-article title="Some article title">
      <span>This is the content of the article ...</span>
    </my-article>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    // Define a vue component:
    Vue.component('my-article', {
        template: `<div>
                <h1>{{ title }}</h1>
                <p class="article-text"><slot></slot></p>
            </div>`,
        props: ['title']
    });
    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app'
    });
</script>

<!--
Output:
<h1>Some article title</h1>
<p class="article-title"><span>This is the content of the article ...</span></p>
-->
```

Slots help us determine where exactly we want to place our component's nested content within the component's template. Helps distribute our code/text properly.

**Named Slots**

We can ***divide*** nested content inside our component into slots of their own by providing them with the `slot` property. This slot property name can then be used with the `<slot>` tag in the template. We pass in the name of the slot to the `name` property of the `<slot>` tag in the template.

The parts of the nested content that are *not named* (**remaining part**) can be accessed via the `<slot></slot>` tag (*without* a `name` property) in the template.

Naming of slots helps us organize our content and restructure them from within the component before being displayed.

```html
<div id="app">
    <my-article>
        <header slot="header">Some article title</header>
        Article Content
        <footer slot="footer">Footer</footer>
        Some other part of article
    </my-article>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    // Define a vue component:
    Vue.component('my-article', {
        template: `<div class="article">
                <slot name="header"></slot>
                <p class="article-text"><slot></slot></p>
                <slot name="footer"></slot>
            </div>`,
        props: ['title']
    });
    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app'
    });
</script>

<!--
Output:
<div class="article">
	<header>Some article title</header>
	<p class="article-text">
		Article Content
		Some other part of article
	</p>
	<footer>Footer</footer>
</div>
-->
```

**Content within `<slot>`**

Components or any content mentioned within `<slot>` is ***only rendered if the slot is empty*** (i.e there is no nested content inside the component).

```html
<div id="app">
    <my-article></my-article>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    // Define a vue component:
    Vue.component('my-article', {
        template: `<div class="article">
                <slot><empty-component></empty-component></slot>
            </div>`,
        components: {
            'empty-component': {
                template: '<p>There is no article here</p>'
            }
        }
    });
    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app'
    });
</script>
```

## VueJS Directives

VueJS Directives are special HTML attributes that add extra functionality to our DOM elements. Examples include `v-show`, `v-if`, `v-for`, `v-model`, `v-bind`, `v-on`, etc.

General syntax for vue directives:

```javascript
v-<directiveName>:<argumentName>.<eventModifier1>.<eventModifier2>="<expression>"

// Example:
v-on:click.prevent="someMethodName()"
```

**Creating Custom Directives**

It is recommended to use components to create apps in Vue. But, we can also make use of the powerful vue directives to build awesome stuff.

We can use the **`Vue.directive()`** method to create directives. The *first argument* is the *name* of the directive. The *second argument* is an object which contains a *bunch of functions*. These functions are called ***directive hook functions***.

***Hook functions*** get called at various stages (hooks) during the initialization of the directive. One such hook function is called **`bind`**. It gets called once the element is bound to the directive (something like a setup indicator). 

`bind()` has a bunch of parameters available to it. The first is the reference to the DOM element to which the directive is attached (We can add event listeners to the element, modify its content, etc). The second argument is an ***object*** (called **bindings**).

The Bindings object has a bunch of properties, the most common one being **`value`** which is the evaluated value from the expression passed to the directive in the template/HTML. We also have access to the expression itself (which will be represented inside a string). Apart from these two, we also have access to all the modifiers, etc.

```html
<div id="app">
    <p v-suffix="'Mr.'">Hello</p>
    <p v-suffix="'inches'">42</p>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    // Create custom directive:
    Vue.directive('suffix', {
        bind(el, bindings) {
            var suffix = bindings.value;
            el.innerHTML = el.innerHTML + ' ' + suffix;
        }
    });
    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app'
    });
</script>

<!--
Output:
<div id="app">
	<p>Hello Mr.</p>
	<p>42 inches</p>
</div>
-->
```

**List of Directive Hook Functions**

- **`bind`**: Called only once when directive is first bound to the element
- **`inserted`**: Called when bound element has been inserted into its parent node
- **`update`**: Called after containing component has update but possibly before its children have updated
- **`componentUpdated`**:  Called after containing component and its children have updated
- **`unbind`**: Called only once, when the directive is unbound from the element

**Directive Hook Arguments**

1. The ***DOM element*** the directive is attached to (`el`).
2. The ***Bindings object*** (`bindings`). It contains the following properties:
   1. **`name`**: Name of the directive
   2. **`value`**: Computed value of the directive expression
   3. **`oldValue`**: Previous computed value of the directive expression
   4. **`expression`**: The directive expression itself represented as a string
   5. **`arg`**: The argument to the directive (eg. `click` in `v-on:click.prevent="doSomething()`)
   6. **`modifiers`**: Object with each of the modifiers used with directive as keys and their values are always `true`.
3. The ***Virtual node*** produced by the Vue's compiler (`vnode`)
4. The ***Previous Virtual node*** only available in the `update` and `componentUpdated` hooks (`oldVnode`).

An example of making use of modifiers in our directive hooks:

```html
<div id="app">
    <p v-suffix="'Mr.'">Hello</p>
    <p v-suffix.caps="'inches'">42</p>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script>
    // Create custom directive:
    Vue.directive('suffix', {
        bind(el, bindings) {
            var suffix = bindings.value;
            if(bindings.modifiers.caps) {
                suffix = suffix.toUpperCase();
            }
            el.innerHTML = el.innerHTML + ' ' + suffix;
        }
    });
    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app'
    });
</script>

<!--
Output:
<div id="app">
	<p>Hello Mr.</p>
	<p>42 INCHES</p>
</div>
-->
```

## VueJS Tooling and Automation

**Bootstrapping Our App with `vue-cli`**

The advantage of `vue-cli` is the ability to setup an almost production-grade Vue project.

Steps to install `vue-cli` and bootstrap our project:

```shell
# This install vue-cli library globally:
[sudo] npm install -g vue-cli
# This initializes the project using the webpack template:
vue init webpack my-project # There could be other templates apart from the "webpack" one

cd my-project
npm install
npm run dev # Runs app and opens 'http://localhost:8080/#/' in the browser by default
```
The `webpack` template is more complete and it uses more features including installing webpack - so it is the more popular template for bootstrapping vue projects.

The folder structure when bootstrapping a vue project (with `webpack` template):

```shell
# "build": Contains all our build config files and folders including webpack configs for dev/prod/etc.

# "config": Contains more config files but mostly to do with the node app - like setting up node environment variables depending on dev/prod/testing/etc.

# "src": This is the *MOST* important folder. Here goes our Vue project files. It comes pre-srtuctured with a folder for "components" (component files), "assets" (assets), and "router" (route configuration). There is one main vue component called "App.vue" and a main javascript file called "main.js".
# (Note: The components are composed as '.vue' files)

# "package.json" and other node setup files.

# ".babelrc" file: for ES6.

# "static": Mostly for storing static files.
```

VueJS has come up with an *easy way* to *compose* our components in the **`.vue`** extension files. It basically has ***three* sections**:

1. A section called `<template>` which is the visual part of the component.
2. A `<script>` section which more like the logic part of the component. Also has ability to export the components for use in other files (in the end, all component files can be bundled into one file! HTTP1.1 perf).
3. A `<style>` section for defining css for our component (Use `<style scoped>` to limit inner CSS to our component only). 

An example component file:

```vue
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
```

## Routing with VueJS

**`vue-router`** is the default routing package used by VueJS. It is maintained by the VueJS dev team themselves.

Routing in Vue is basically *swapping out views on our page based on the URLs that we are accessing*. These URLs are *relative* to the *base app's path (root path)*. The views are composed as components in VueJS.

[`vue-router` Documentation](https://router.vuejs.org/en/essentials/getting-started.html)

Installing `vue-router`:

- As a CDN script: `<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>`

- Or, as an NPM package: **`npm install vue-router`**.

  - When used with a module system, you must explicitly install the router via `Vue.use()`:

  ```javascript
  import Vue from 'vue'
  import VueRouter from 'vue-router'

  Vue.use(VueRouter)
  // Using ES6 style module import inside our node app
  ```

Usage of `vue-router`:

- We need a **`<router-view></router-view>`** component. Whatever views get swapped, those components get rendered within these tags.
- We need to instantiate our router with **`new VueRouter()`**. It takes in an object as the constructor. The first argument to the constructor is an *array of routes*. Each route contains a `path` and a `component` property at least.
- The router must be added as ***property*** (or key) to the **`new Vue()`** constructor (Vue app constructor).

(**Note**: Route mapping is done using a simple array of object with each object containing at least a path and a component name. Each individual component represents a single route.)

```html
<div id="app">
    <router-view></router-view>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
<script>
    // Create routes:
    var routes = [
        {
            path: '/users',
            component: listAllUsers
        }
    ];

    // Create the router:
    var router = new VueRouter({
        routes
    });

    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app',
        router
    });
</script>
```

**The `<router-link>` Component and `to` Attribute**

`router-link` component generates links for the router. Essentially, it creates `<a>` links. It throws an exception if the routes don't exist.

We can specify a link or a route on an element by using the `<router-link>` component in our template. On this component, we can mention a `to` attribute which contains the path. The path is one of the URLs defined for the router. Clicking an element with a `to` attribute will make Vue route to the component defined for that path.

A working example:

```html
<div id="app">
    <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
    </nav>
    <div class="page-content">
        <router-view></router-view>
    </div>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
<script>
    // Define our components:
    var Home = {
        template: '<h1>Welcome to Home</h1>'
    };
    var About = {
        template: '<h1>Welcome to About</h1>'
    };

    // Create routes:
    var routes = [
        {
            path: '/',
            component: Home
        },
        {
            path: '/about',
            component: About
        }
    ];

    // Create the router:
    var router = new VueRouter({
        routes
    });

    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app',
        router
    });
</script>
```

**Note:** VueJS adds a `#` (**hash**) before the routes in the URL bar by *default* (eg. `localhost:3000/#/about`).

**Named Routes**

VueJS allows us to specify names for our routes. This is done by setting a `name` property to each of the route object in the routes array.

The good thing about named routes is that they give us a static handle to access routes even when the paths to the routes changes (with change in app architecture).

Therefore, instead of specifying paths, we can specify named routes in the `to` attributes of `router-link` components of the template. 

- First, we bind the attribute (`v-on:` or `:`) and 
- We pass it an object with `name` property. 
- This name is the name we have given to one of our routes.

```html
<div id="app">
		<nav>
			<router-link :to="{ name: 'home' }">Home</router-link>
			<router-link :to="{ name: 'about' }">About</router-link>
		</nav>
		<div class="page-content">
			<router-view></router-view>
		</div>
	</div>
	<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
	<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
	<script>
		// Define our components:
		var Home = {
			template: '<h1>Welcome to Home</h1>'
		};
		var About = {
			template: '<h1>Welcome to About</h1>'
		};

	    // Create routes:
	    var routes = [
	    	{
	    		path: '/',
	    		name: 'home',
	    		component: Home
	    	},
	    	{
	    		path: '/about',
	    		name: 'about',
	    		component: About
	    	}
	    ];

	    // Create the router:
	    var router = new VueRouter({
	    	routes
	    });
	  
	    // Create the Vue instance (or vue app):
	    new Vue({
	        el: '#app',
	        router
	    });
	</script>
```

**Route Parameters**

Route parameters are those values that appear in the route URL. They are identified with a placeholder variable prefixed with a colon (:). Ex: `/users/:id` - `id` is the route parameter and the actual URL could be something like `/users/4532` and then `id` would be `4532`.

Route parameters can be accessed in the template of the component with `{{ $route.params.<paramName> }}` (Similar to how params are accessed in ExpressJS).

Two objects are available to us when we route:

- **`$route`**: Contains some parameters such as route parameters. It's `params` property is an object that contains all the params specified in the URL of the route as keys.
- **`$router`**: Helps us do programmatic routing.

If we are using the `$route` or `$router` within component logic, we must prefix them with `this.`.

Inside the template, we can either use the relative path in the `to` attribute or supply the params to the object of a bound `:to` attribute. Supplying the params is done by specifying a `params` object inside the `:to` expression object. This `params` object's keys are param names and values are their corresponding values.

```html
<div id="app">
    <nav>
        <router-link :to="{ name: 'home' }">Home</router-link>
        <router-link :to="{ name: 'about' }">About</router-link>
        <router-link :to="{ name: 'user', params: { id: 44 } }">User</router-link>
        <!-- <router-link to="/users/44">User</router-link> -->
    </nav>
    <div class="page-content">
        <router-view></router-view>
    </div>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
<script>
    // Define our components:
    var Home = {
        template: '<h1>Welcome to Home</h1>'
    };
    var About = {
        template: '<h1>Welcome to About</h1>'
    };
    var User = {
        template: '<h1>Welcome User #{{ $route.params.id }}</h1>',
        mounted() {
            this.displayUserId(this.$route.params.id);
        },
        methods: {
            displayUserId(userId) {
                alert(userId);
            }
        }
    }

    // Create routes:
    var routes = [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            component: About
        },
        {
            path: '/users/:id',
            name: 'user',
            component: User
        }
    ];

    // Create the router:
    var router = new VueRouter({
        routes
    });

    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app',
        router
    });
</script>
```

**Nested Routes**

Nested routes can be handled easily in VueJS. Nested routes will be something like `/users/:id` path and `/users/:id/settings`  where the paths refer to some user but functionality is different. So, the nested route on top of the first route can be setup.

*Setting up nested routes*: Define a **`children`** property inside the base route object. The children is an *array* that stores objects. The objects it stores are route objects (they have path, name, component, etc properties). 

The children routes are prefixed automatically with the base route (or parent route). Base route is also known as *Vendor route*.

***Each child route has to also be represented by its own component.***

***The child component can only get rendered within the parent route's component***. To render a child, the parent route's component must have its own `<router-view>` and `<router-link>` tags in its template.

```html
<div id="app">
    <nav>
        <router-link :to="{ name: 'home' }">Home</router-link>
        <router-link :to="{ name: 'user', params: { id: 44 } }">User</router-link>
    </nav>
    <div class="page-content">
        <router-view></router-view>
    </div>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
<script>
    // Define our components:
    var Home = {
        template: '<h1>Welcome to Home</h1>'
    };
    var User = {
        template: `
            <div class="user-page">
                <h1>Welcome User #{{ $route.params.id }}</h1>
                <nav>
                    <router-link :to="{ name: 'user_profile' }">Profile</router-link>
                    <router-link :to="{ name: 'user_settings' }">Settings</router-link>
                </nav>
                <router-view></router-view>
            </div>
        `
    };
    var UserProfile = {
        template: '<p>This is your profile</p>'
    };
    var UserSettings = {
        template: '<p>This is your settings</p>'
    };

    // Create routes:
    var routes = [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/users/:id',
            name: 'user',
            component: User,
            children: [
                {
                    path: 'profile',
                    name: 'user_profile',
                    component: UserProfile
                },
                {
                    path: 'settings',
                    name: 'user_settings',
                    component: UserSettings
                }
            ]
        }
    ];

    // Create the router:
    var router = new VueRouter({
        routes
    });

    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app',
        router
    });
</script>
```

**Programmatic Routing**

Programmatic navigation allows us to do routing from within our component (instead of from the template links).

Take a look at this case: In our previous example, we had child routes (& components) for a user - namely profile and settings. The section allotted for the child components was initially empty on load! Only by clicking the router links were we able to see the profile/setting.

With programmatic routing we can automatically load up child components (routes). This is done by using the `$router` object that comes with routes. (Access using `this.$router` inside the component logic).

The `$router` object has a `push` method that accepts the *same* parameters as the `:to` attribute on `<router-link>`. Pushing a route like this will load up that component.

We can load child component when the parent component is loaded by using `$router` inside the `mounted()` method of the component. Say, we can load up the user's profile when the user page loads:

```html
<div id="app">
    <nav>
        <router-link :to="{ name: 'home' }">Home</router-link>
        <router-link :to="{ name: 'user', params: { id: 44 } }">User</router-link>
    </nav>
    <div class="page-content">
        <router-view></router-view>
    </div>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
<script>
    // Define our components:
    var Home = {
        template: '<h1>Welcome to Home</h1>'
    };
    var User = {
        template: `
            <div class="user-page">
                <h1>Welcome User #{{ $route.params.id }}</h1>
                <nav>
                    <router-link :to="{ name: 'user_profile' }">Profile</router-link>
                    <router-link :to="{ name: 'user_settings' }">Settings</router-link>
                </nav>
                <router-view></router-view>
            </div>
        `,
        mounted() {
            this.$router.push({ name: 'user_profile' })
        }
    };
    var UserProfile = {
        template: '<p>This is your profile</p>'
    };
    var UserSettings = {
        template: '<p>This is your settings</p>'
    };

    // Create routes directive:
    var routes = [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/users/:id',
            name: 'user',
            component: User,
            children: [
                {
                    path: 'profile',
                    name: 'user_profile',
                    component: UserProfile
                },
                {
                    path: 'settings',
                    name: 'user_settings',
                    component: UserSettings
                }
            ]
        }
    ];

    // Create the router:
    var router = new VueRouter({
        routes
    });

    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app',
        router
    });
</script>
```

**Navigation Guards**

Navigation guards give us a way to secure our apps from unauthorized access. Each of these guards are ***functions*** that can be defined at different levels of the app's configuration.

There are three different types of guards:

- ***Global Guards***
- ***Per-Route Guard***
- ***In-Component Guards***

Guards are also referred to as ***Hooks***.

**Global Guards**

These are defined directly on the `router` object. The respective functions are called on the `router` object. Ex: `router.beforeEach()` where `beforeEach` is a global guard and it takes a function as its argument. 

The functions passed to global guards have three parameters:

- The `to` object: Contains information about the path that we are routing to.
- The `from` object: Contains information about the path that we are currently routing from.
- The `next` function: This needs to be invoked once we are done with our hook (invoking this will invokethe next hook). It is similar to `next()` in express middleware.

Working example:

```html
<div id="app">
    <nav>
        <router-link :to="{ name: 'home' }">Home</router-link>
        <router-link :to="{ name: 'about' }">About</router-link>
    </nav>
    <div class="page-content">
        <router-view></router-view>
    </div>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
<script>
    // Define our components:
    var Home = {
        template: '<h1>Welcome to Home</h1>'
    };
    var About = {
        template: '<h1>Welcome to About</h1>'
    };

    // Create routes:
    var routes = [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            component: About
        }
    ];

    // Create the router:
    var router = new VueRouter({
        routes
    });

    // Define a global guard:
    router.beforeEach((to, from, next) => {
        console.log('Calling this hook'); // logs this for every new route we visit
        next();
    });

    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app',
        router
    });
</script>
```

**Per-Route Guard**

Per route guards are specified within the routes array for each route object. For a route object, we can specify a **`beforeEnter`** key/property that contains a function that has the same structure (*same function signature*) as the other (global) guard functions but it executes *only* before entering that particular route.

Working example:

```html
<div id="app">
    <nav>
        <router-link :to="{ name: 'home' }">Home</router-link>
        <router-link :to="{ name: 'about' }">About</router-link>
    </nav>
    <div class="page-content">
        <router-view></router-view>
    </div>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
<script>
    // Define our components:
    var Home = {
        template: '<h1>Welcome to Home</h1>'
    };
    var About = {
        template: '<h1>Welcome to About</h1>'
    };

    // Create routes:
    var routes = [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            component: About,
            beforeEnter: (to, from, next) => {
                console.log('Navigating to about page');
                next();
            }
        }
    ];

    // Create the router:
    var router = new VueRouter({
        routes
    });

    // Define a global guard:
    router.beforeEach((to, from, next) => {
        console.log('Calling this hook'); // logs this for every new route we visit
        next();
    });

    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app',
        router
    });
</script>
```

**In-Component Guards**

We can also have hooks within components. The component object must have a **`beforeRouteEnter`** which is again a hook function (*same function signature* as the other two). It gets invoked when the component gets rendered **(?)**.

Working example:

````html
<div id="app">
    <nav>
        <router-link :to="{ name: 'home' }">Home</router-link>
        <router-link :to="{ name: 'about' }">About</router-link>
    </nav>
    <div class="page-content">
        <router-view></router-view>
    </div>
</div>
<script src="https://unpkg.com/vue@2.5.2/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
<script>
    // Define our components:
    var Home = {
        template: '<h1>Welcome to Home</h1>'
    };
    var About = {
        template: '<h1>Welcome to About</h1>',
        beforeRouteEnter: (to, from, next) => {
            console.log('Entering the about component');
            next();
        }
    };

    // Create routes:
    var routes = [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/about',
            name: 'about',
            component: About,
            beforeEnter: (to, from, next) => {
                console.log('Navigating to about page');
                next();
            }
        }
    ];

    // Create the router:
    var router = new VueRouter({
        routes
    });

    // Define a global guard:
    router.beforeEach((to, from, next) => {
        console.log('Calling this hook'); // logs this for every new route we visit
        next();
    });

    // Create the Vue instance (or vue app):
    new Vue({
        el: '#app',
        router
    });
</script>
````

In most cases, hooks or guards are used to do ***validation*** at different points in our app flow. For example, verifying user information.

[Navigation Guards Documentation](https://router.vuejs.org/en/advanced/navigation-guards.html)

## VueJS Testing

The best way to test VueJS is by working on a project that has been bootstrapped by `vue-cli`. It is straight-forward and is the recommended way to make a Vue app.

`vue-cli` has testing built into it. So, it is really easy to test our components with this setup.

Folder structure for tests:

```shell
# The "root" folder of the project:

	# "test" folder:
	
		# "e2e" : for doing end to end testing
		
		# "unit" : for doing unit tests:
		
			# "coverage" : folder containing code coverage reports
			
			# "specs" : folder containing our unit test suites (we'll mostly be working here - actual tests happen here)
			 
			# "karma.conf.js" : Karma is a test runner that is pre-installed with vue-cli for running our tests. It is used to configure how our tests are run - like changing browser engine - by default it uses phantomJS engine (we can change it to chrome), mention the testing frameworks used, webpack configs for the same, etc.
			
			# "index.js" : A file where we can require other files. We can change where our tests are stored (instead of the `specs` folder), where are our source files, etc.
```

Sample spec file for unit testing vue js components:

```javascript
import Vue from 'vue'
import ProgressBar from '@/components/ProgressBar'

describe('ProgressBar', () => {
  it('should create a new component instance', () => {
    const Ctor = Vue.extend(ProgressBar)
    const vm = new Ctor().$mount()
    expect(vm.$el.getAttribute('class')).to.equal('ProgressBar')
  })

  it('should sets the correct element width', () => {
    const Ctor = Vue.extend(ProgressBar)
    const vm = new Ctor({ propsData: { level: 90 } }).$mount()
    expect(vm.level).to.equal(90)
    expect(vm.$el.querySelector('.level').style.width).to.equal('90%')
  })

  it('should update the element width on state change', (done) => {
    const Ctor = Vue.extend(ProgressBar)
    const vm = new Ctor({ propsData: { level: 90 } }).$mount()
    vm.level = 70
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.level').style.width).to.equal('70%')
      done()
    })
  })
})
```

To test our vue unit test suites (run the spec files), we must run **`npm run unit`** in the CLI.

**We need to know Mocha, Chai, etc. Learn Javascript Testing first and then come back to this lesson.**

## Server-Side Rendering

SSR gives us the ability to render components as HTML strings, send that back to the browser and then activate static markup on the client-side application.

Server rendered Vue.js application can be considered *isomorphic* or *universal* because a majority of the application's code runs on both the server and client.

**Benefits of SSR**

- ***SEO*** (Search engines can crawl site more efficiently because they don't need to wait for heavy JS to load or any Asynchronous content). All content to 'search out' your site is directly rendered.
- Does not need to load client JS libraries before markup is displayed. Makes for a ***better UX*** since it reduces the time that it takes for the users to get the content rendered to them in the browser.

**Trade-Offs of SSR**

- Development constraints. Can use browser-specific code within some lifecycle hooks.
- More involved build setup and deployment requirements.
- More server-side load especially with high traffic (because it is doing more than just serving static files).

**Do We Really Need Server Side Rendering?**

This makes our app do a lot of things on the server-side (complex). So, we need to ask ourselves that is it required to put so much strain on our apps? (This is a subjective matter and various factors must be taken into account during our research before we can come to a conclusion)

**SSR vs Pre-rendering**

If our reason for using SSR is ***better SEO for certain pages alone*** then we are better off trying to implement ***prerendering***. Prerendering allows us to generate static HTML files for specific routes at build time. They are already available and cached.

**Note:** Try *not* to use prerendering for things such as *user-specific pages* and *frequently changing content*. Use it for static pages.

NPM Package that needs to be installed for SSR: **`npm install vue-server-renderer`** (Assuming that `vue` module was already installed - either via `vue-cli` or standalone).

**Steps for rendering on the server:**

1. Import VueJS (`vue`) library.
2. Create a renderer with **`require('vue-server-renderer').createRenderer()`**.
3. Rendering a vue application as HTML: Use **`renderer.renderToString()`** function which takes in the Vue App and a callback that receives (an error, if any, and) the HTML generated from the Vue app (as a *string*).
4. This rendered HTML string can be sent back in our response to the client (For example, in the response of a node or express app).

Example of an express app that uses server-side rendering for a VueJS app:

```javascript
const Vue = require('vue');
const server = require('express')();
const renderer = require('vue-server-renderer').createRenderer();

server.get('*', (req, res) => {
  const app = new Vue({
    template: '<h1>Hello</h1>'
  })
  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error');
      return;
    }
    
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `);
  })
});

server.listen(8080, () => {
  console.log('Server listening on port 8080...');
})
```

Content that is served from the server has an attribute called `data-server-rendered` and it is set to `true`. In the above example, the output of the Vue app on the client side would be:

`<h1 data-server-rendered="true">Hello</h1>`

If SSR had not been used then on the client side we would have to send VueJS template then the Vue scripts must load in the browser then the components must render, etc which would have all taken more time on the client side.

[More Information on SSR in VueJS](https://ssr.vuejs.org/en/)

**NUXT**

NUXT gives us a nice boilerplate or framework that helps us build universal javascript applications with VueJS (uses server-side rendering). [Documentation for NUXT](https://nuxtjs.org/)

