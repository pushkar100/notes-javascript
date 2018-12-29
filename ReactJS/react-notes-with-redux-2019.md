# React 16.6 (React + Redux + Router)

[Tutorial Source](https://www.udemy.com/react-redux/learn/)

[Course Repo](https://github.com/StephenGrider/redux-code)

---

**Contents**:

- Intro
- Setting Up A React Project
- Getting Started
- Building Content with JSX
- Components & Props
- Class Based Components
- "State" in Class Based Components
- Lifecycle Methods
- Linking a CSS file to a Component file
- Default Props
- Imposing Structure into Large React Apps (Opinionated)
- Handling User Input and Events
- Making API Requests
- Rendering Lists in JSX
- Usings Refs for DOM Access
- Redux
- Integrating React with Redux

---

## Intro

**Q: What is React?** 
A: It is a JS Framework (Library). Goal is to show content (HTML) on the screen and handler user interaction (with event handlers). It handles everything as components and combines and nests them in many ways with the biggest component being our app itself

**Q. How are React Components made?**
A: Using either Javascript *functions* or *classes* (ES6)

**Q: What is JSX?**
A: It is a special syntax in React that looks like HTML and is placed in JS code. Displays content very much like HTML code

**Q: What is Redux?**
A: It is another way to manage "state" in your application - That is, many components have access to centrally available data.

**Q: What is ReactDOM?**
A: React is split into 2 libraries: First is *React* (The core) which defines components and how components work together. Second is *ReactDOM* which takes a component and renders it (places it in the DOM). This split is because react can be used in other environments like mobile and IoT apps where the rendering is not done using ReactDOM  but somethig else, so the core library is separate from render library.

## Setting Up A React Project

1. Install/Update NodeJS `nodejs.org/en/download` > `node -v`
2. Install `create-react-app` that helps us with setting up a boilerplate `sudo npm i -g create-react-app`
3. Generate a project `create-react-app <project-name>` (or `npx create-react-app <project-name>` with NPMv5.2+)
4. Build project!

**Q: Why `create-react-app`?**
A: It gives us a boilerplate. `create-react-app` will build a brand new react project which will have many dependencies that we need to get our app running. For example, we need *webpack*, ***babel***, *dev server*, and so on

**Browser Support for ES Versions** (2019 Jan)

1. ES5: 100% support across all browsers (at least IE8, I think)
2. ES6 (ES2015): Almost complete support across all browsers
3. ES2016, ES2017, ES2018: Poor support

**Q: What is Babel?**
A: It is command line tool that helps convert newer ES2015/16/17/18 code into ES5 code (or down to a code version of our choice) depending on how much of the older browsers we want to support. The processs is called ***transpiling***. `create-react-app` will include Babel by default. Example:

```
1. ES2015+ ==> TARGET BROWSER (X) NO GUARANTEE IT WILL WORK
2. ES2015+ ==> BABEL ==> ES5 (Or target ES) ==> TARGET BROWSER (Y) GUARANTEED TO WORK!
```

**General Project Structure (After setup with`create-react-app`)**

- `src`: Folder where we put all the source code we write. It is a good idea to delete all the initial files in this folder before writing your own files from start
- `public`: Folder that stores static files, like images
- `node_modules`: Folder that contains all of our project dependencies
- `package.json`: Records our project dependencies and configures the project
- `package-lock.json`: Records the exact version of the packages that we install
- `README.md`: Instructions on how to use this project

**Starting the React App (After setup with`create-react-app`)**

- Start React App (Development): `npm start` (or `yarn start`) builds and opens the app in the browser in a dev server
- Stop the React App: `ctrl-c`
- Visit `localhost:3000` (or similar) to see a running app
- Production build: `npm run build` (or `yarn build`) builds the react app for production

## Getting Started

Because of our `create-react-app` setup: 

- Create a file **`src/index.js`**. This is the starting point of our app
- The app is basically run on the **`public/index.html`** where the existing `#root` DOM element is used to render the app and its components

There are 3 essential things we need to do to write a react app:

1. *Import React and ReactDOM libraries*
2. *Create a React Component*
3. *Take the Component and show it on screen (Render it)*

React uses ES6 Modules to `import` and `export` either libraries or custom components (as modules). Therefore, we import `React` and `ReactDOM` (These were installed as dependencies in our `create-react-app` setup, hence available in `node_modules`, and we can import them by name)

`import <variable> from '<dependency/filepath>'`

**ES2015 Modules versus CommonJS**

Each define a set of rules on how to share code between different files. ES2015 Module system uses `import` while CommonJS Module system uses `require` statement (Ex: in NodeJS). CommonJS is not native to JavaScript but ES2015 Modules are in the spec.

**Components**

Components are either ***functions*** or ***classes*** that produce HTML to be shown to users (with the help of JSX) and handles feedback from the user

```react
// Function based component:
const App = () => {
	return <div>Hi There!</div>; // Function components return JSX 
}
```

**Rendering (Displaying)**

*ReactDOM* provides us with a `render` method that takes in a component and a target DOM element inside which we will display our component

```react
ReactDOM.render(<App />, document.querySelector('#root'));
```

A Simple React App Example:
```react
// 1. Import React & ReactDOM dependencies
import React from 'react';
import ReactDOM from 'react-dom';
// Place any other dependency/file imports here based on requirement

// 2. Create a React Component
const App = () => {
	return <div>Hi There!</div>; // JSX 
}

// 3. Render the Component (display it)
ReactDOM.render(<App />, document.querySelector('#root'));
```

## Building Content with JSX

**Q: What is JSX?**
A: JSX is *not HTML*! It is essentially still javascript - a special dialect of it. Its syntax gets parsed into javascript code that we can understand.

**Q: How does JSX work in the browser then?**
A: Babel transpiles ES2015+ code down to lower levels so that it can run on browsers, right? In the same way, Babel converts JSX code too (Converts it to understandable JS code which then outputs HTML). This is setup automatically for you by `babel` config in the `create-react-app` package

**Q: Is JSX JavaScript? It does not look like it..**
A: JSX gets parsed to javascript function calls `React.createElement()` that take in params for the type of tag to create, it's attributes, and child nodes in an array (or text string), in that order.

```react
// React
const App = () => {
	return (
      <div>
        <span>Hi There!</span>
      </div>
    ); // JSX 
}
```

```js
// Babelified Code
var App = function App() {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "span",
      null,
      "Hi There!"
    )
  ); // JSX 
};
```

**Q: So why JSX and not `React.createElement()` calls itself?**
A: Both output HTML in the end but writing JSX is *easier* and more *readable*. For complex components, reading all the function calls and nested elements will become hard if JSX is not used. Almost everyone uses  JSX

**Multline JSX**

Multiline JSX needs to be wrapped in *parentheses* (recommended) or the *opening tag must be next to the `return` keyword*

```jsx
// Best:
return (
  <div>
    <span>Hi There!</span>
  </div>
); 

// Also works:
return <div>
    <span>Hi There!</span>
</div>;

// (X) ERROR! Because the function returns undefined (not the JSX below):
return 
    <div>
      <span>Hi There!</span>
    </div>
```

**JSX vs HTML syntax**

JSX syntax is the the *same as HTML* except for *the following **4** differences*:

1. Adding ***custom styling*** to an element: *camelCase* and *mustache {{...}}* syntax

```jsx
// HTML
<div style="background-color: red"></div>

// JSX
// 1. First {} indicates we want to access a (JS variable or expression): No "" required.
// 2. Next {} (Inner one) indicates an object. We use objects to specify style properties.
// keys are properties, values are strings.
// '-' in property names get converted to camelCase when they are object keys.
<div style={{ backgroundColor: 'red' }}><div>
```

2. Adding a ***class*** element: we use ***className*** instead. This is because `class` is a keyword in JavaScript

```jsx
// HTML
<div class="label">Enter name</div>

// JSX
<div className="label">Enter name</div>
// In the future, we'll be able to use 'class', discussions to fix this in react are on.
```

3. JSX can ***reference JS variables***: Use `{<expression>}` syntax

```JSX
// JS:
function getButtonText() {
	return 'Click on me!';
}
// JSX:
<button>{getButtonText()}</button>
// Note that for RENDERING purposes (not props):
// JS objects will throw an error since it won't be
// converted to a string. However, object properties that are not objects themselves 
// will be fine. Apart from this you can render all primitives, arrays, etc.
```

```jsx
// JS:
const buttonText = 'Click on me!';
const style = { backgroundColor: 'blue', color: '#fff' };
// JSX:
<button style={style}>{buttonText}</button> 
// Note: 
// Objects can be a prop but not text.
// Multiple interpolations are allowed (Ex: style & buttonText).
```

4. Most ***JavaScript keywords cannot appear as JSX element attributes***: Replacement attributes exist

```jsx
<div className="label" for="name">Enter name</div> // Invalid (X)
<div className="label" htmlFor="name">Enter name</div> // Valid
// In the future, we'll be able to use 'for', discussions to fix this in react are on.
```

**Note**: Self-enclosing tags must close with **`/>`**. This is optional in HTML but *mandatory in JSX*

```JSX
<input type="text" id="name" /> <!-- Right -->
<input type="text" id="name"> <!-- Wrong(X) -->
```

**Note**: JSX returned by a component can *only have one top level element*. This is because it gets parsed to a React.createElement() call which accepts only one element (and children, if they exist).

## Components & Props

**3 tenets of Components**

1. *Nesting*: React has the ability to place one component in another
2. *Reusability*: React can reuse components again and again without repeating code (Ex: Buttons)
3. *Configuration*: React can use same component differently each time (Ex: Text/behavior is different, etc.)

**Q: When do we create a reusable & configurable component?**
A: We can go through the following process:

1. Identify JSX that appears to be duplicated
2. Come up with a descriptive name for that JSX block (that is duplicated)
3. Create a separate file to house this new component **(%)**. *File name must be same as the component name*
4. Create the component in that new file and paste the JSX into it
5. Make new component configurable using react's *props* system

**(%)**: We can have separate components in the same file as well but ideally this is bad practice since it is less maintanable for larger projects & when you need to access components from outside the file, it becomes hard to do so

**Q: How is Nesting of components possible?**
A: We use the `<ChildComponentName />` tag in JSX to render child components. We can instantiate a child inside parent as many times as we want, making it reusable!

**Note**: 

1. Earlier we said that we use `{}` to display JS expressions but we do not do that for child components. We use tags itself!
2.  Component tags are *Self-closing* and therefore this means that they too must close with `/>`

**Q: How do we import one component from another?**
A: We use ES6 import/export. 

1. First of all, the filename and component name must be the *same* and *Capitalized*. 
2. Use `export default <ComponentName>` to export child component
3. Use `import <ComponentName> from <PathToChildComponentFile>` in the parent component

```react
/* src/CommentDetails.js */

import React from 'react'; // Every component needs this 
// ReactDOM not needed if not rendering component here (but are exporting it to parent)

const CommentDetails = () => {
	return (
		<div className="comment-details">
			<div className="author">Author</div>
			<div className="date">12:03PM</div>
			<div className="content">Very nice article!</div>
		</div>
	);
}

export default CommentDetails;
```

```react
/* src/index.js */

import React from 'react';
import ReactDOM from 'react-dom'; // Rendering, hence required
import CommentDetails from './CommentDetails'; // Import component,  .js extension not required

const App = () => {
	return (
		<div className="comments">
			<CommentDetails />
			<CommentDetails /> 
			<CommentDetails /> 
		</div>
	);
}

ReactDOM.render(<App />, document.querySelector('#root'));
```

**Component Hierarchy**

The way that React is created, components can be nested and this creates a *hierarchy*. At every level there is one component, ***Parent***, that may have one or more child components, collectively termed as **children**.

**Props System**

In this component hierarchy, there is a need to pass data between components, especially from *Parent to Child*. The Props system enables this. 

- It passes data from Parent to Child (***One-way direction of data***)
- This allows parent to "communicate" with child
- Through this communication, it is capable of configuring the child

1. *Sending Props (from Parent)*: By setting attributes on child component in JSX

   `<ChildComponentName propName1="value" propName2={<js-expression>} />`

2. *Receiving Props (inside Child) and Consuming them*: Available as `props` param to the function/class and use `{props.<name>}` to access it inside JSX.

   `const ChildComponentName = (props) => { ... available as 'props' object ... }`

   `return <div>{props.<name>}</div>`

```react
const App = () => {
	return (
		<div className="comments">
			<CommentDetails author="Sam" date={new Date()} content="Hi, awesome" />
			<CommentDetails author="Tom" date={new Date()} content="Bye, not awesome" /> 
			<CommentDetails author="Ron" date={new Date()} content="Cool article" /> 
		</div>
	);
}

/* What is sent to child:
props = {
	author: ...,
	date: ...,
	content: ...
}
*/
```

```react
const CommentDetails = (props) => {
	return (
		<div className="comment-details">
			<div className="author">{props.author}</div>
			<div className="date">{props.date.toLocaleTimeString()}</div>
			<div className="content">{props.content}</div>
		</div>
	);
}
```

**Note on JSX**: Use `{}` for expressions, ` ""` for hardcoded values (General rule)

**Children Components Through Props: Sending Whole Components via Props**

*Nest them like how you would nest HTML tags*. The inner component would be available as props to the outer component. An example use case of this would be to have a wrapper for a generic widget say, an edit section wrapper, that can display one or more kinds of inner widgets say, a section that holds a comment.

1. The outer component will ***not*** be self-closing: `<Outer>...<Inner />...</Outer>`
2. The inner component(s) will be passed as a property of `props` of outer component: `props.children`
3. The JSX for the parent and child component will remain the same: Add attributes to pass in other props

```react
import React from 'react';
import ReactDOM from 'react-dom'; // Rendering, hence required
import CommentDetails from './CommentDetails'; // Import component,  .js extension not required
import EditWidget from './EditWidget';

const App = () => {
	return (
		<div className="comments">
			<EditWidget>
				<CommentDetails author="Sam" date={new Date()} content="Hi, awesome" />
			</EditWidget>
			<CommentDetails author="Tom" date={new Date()} content="Bye, not awesome" /> 
			<CommentDetails author="Ron" date={new Date()} content="Cool article" /> 
		</div>
	);
}

ReactDOM.render(<App />, document.querySelector('#root'));
```

```react
import React from 'react';

const EditWidget = (props) => {
	return (
		<div>
			<div className="edit-widget">
				{props.children} 
                // CommentDetails was passed as child, it's output here
                // Even other JSX tags placed inside EditWidget will be in props.children
			</div>
			<span>Approve</span>
			<span>Reject</span>
		</div>
	);
}

export default EditWidget;
```

```react
import React from 'react'; // Every component needs this 
// ReactDOM not needed if not rendering component here (but are exporting it to parent)

const CommentDetails = (props) => {
	return (
		<div className="comment-details">
			<div className="author">{props.author}</div>
			<div className="date">{props.date.toLocaleTimeString()}</div>
			<div className="content">{props.content}</div>
		</div>
	);
}

export default CommentDetails;
```

This type of flexibility increases the reusability.

## Class Based Components

There are two ways in which we can initialize components: functions and classes

*Function*: This is mainly used for simple components that do not involve complex logic

*Class*: Used for complex logic that can involve many things like user interaction, making new requests, etc.

**Q: How is Class better than a function?**
A: Because of the following reasons:

1. Easier to organize code (debatable and developers are split on this one)
2. Can use the "state" system. It makes it easy to handle input, handle async operations, and update the component or app
3. Makes understanding the app lifecycle hooks easier. This in turn makes it easy to do certain stuff.

**Example of a Drawback of Function Based Components**

```react
const App = () => {
	window.navigator.geolocation.getCurrentPosition(
		pos => console.log(pos),
		err => console.log(err)
	);
	return <div>Hi</div>;
}

/* Geolocation API takes time to return location data and it is asynchronous. In function based components, there is no easy way to stop the rendering of the JSX before async operations complete. So, in this complex case, "<div>Hi</div>" is rendered and then API results are returned after a while */
```

With Class Based components, we can solve this issue by either waiting (pausing) for async calls to complete before rendering (using 'lifecycle hooks') or re-rendering the component with new information after the async data becomes available. Using React "state" (Seen later) will help us with the solution to the above problem

**Rules for Writing Class Component**

1. It must be a JavaScript (ES6) Class
2. Must extend (subclass) `React.Component` class using `extends` keyword. This class provides us with basic methods for dealing with components so that we don't have to write it again
3. ***Must*** define a `render()` method which returns JSX

```react
// Minimal Class Component Example:
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
	render() { 
		return <div>Hi</div>;
	}
} // same as 'App = () => { return <div>Hi</div>; }

ReactDOM.render(<App />, document.querySelector('#root'));
```

**Note**: `render()` method is called very frequently! Therefore, do not put computationally heavy logic inside it before it returns JSX. Keep it simple and make sure most of what it does is just return JSX and not compute stuff.

## "State" in Class Based Components

**Q: What is 'State'?**
A: It is a JavaScript object that contains data relevant to a component

**Features of 'State'**

1. It is mostly usable only with ***Class components***. This is not 100% true because it can be used with Function components by using something known as 'hooks' - however, that is a complicated setup and not as easy as it is in Class components
2. `state` is ***not the same*** as `props`. Props is an object that is passed down to a component from outside (as a parameter) such as by the parent. State is an object that represents the data within the component. One might use some of the received props to add to/update state but this does not make state equal to props
3. "Updating" the state will cause the component to ***re-render***. Although many updates are batched, the changes are almost instantaneuous to the user
4. State ***must be initialized when the component is created*** (Ex: In the constructor of the component class)
5. State can ***only*** be updated using a special function called  **`setState`**

The most common way to initialize state is by making use of a class `constructor`. This is special method on the class (required by JS and not React) that is run first and automatically every time the component is instantiated. It is the perfect place to put `state` object.

`constructor` receives `props` as the argument (just like a function based component receives it as the argument). The one requirement of a constructor in a subclass is that whenever it runs, it must call the base class's constructor first (with the same [or different] arguments). This can be done using `super` keyword which is a reference to the base class' constructor

After all that, `this.state` can be initialized as an object `{}` (Either empty or with some initial data)

```react
class App extends React.Component {
	constructor(props) {
		super(props);
		// Initialize state:
		this.state = { name: 'Pushkar' }; // Can be empty also
	}
	render() {
		return <div>Hi, {this.state.name}</div>;
	}
}
```

**Note**: Whenever state changes, the component re-renders itself but it *also re-renders any child components*

**Making use of state properties inside JSX and other methods of the component:**

1. For JSX inside `render()` method, it can be accessed with `this.state.<prop-name>` and using the interpolation syntax`{}`

**Updating State Properties (Important):**

1. `this.state = { ... }` is only called during ***initialization*** (first time). For example, in the constructor
2. For every further update (Ex: in render() or any other method), we use **`this.setState()`** to ***update*** `this.state`

**Q: Why do we use `this.setState()`?**
A: If we do not use it, React does not understand that the component needs to be re-rendered because it is not alerted to the change.

**Q: How does `setState()` cause a re-render?**
A: It is derived from `React.Component` base class and contains code to alert react that state has changed and component must be updated/re-rendered. A number of `setState` calls get bathed internally and then run but the changes are almost instantaneous.

**Q: What do we pass to `setState()`?**
A: It takes in an object. The properties of that object are either added to or are updated on the actual `this.state` object. It is a ***shallow merge***, meaning it does not affect other properties already defined in the state but are missing here. It only adds or updates state, does not remove unspecified properties of the state

**Notes**:

1.  `constructor` function is optional - It is a requirement of JS classes when you want to initialize some properties, etc on instantion of the class. `render` is mandatory for any React Class based component and it must return JSX
2. `constructor` is run first and only then is `render` run in any component that has been created. 

**Example of how Class solves the drawback of Function components using State**

```react
/* Async calls and render problem solved by re-rendering on state change */
class App extends React.Component {
	constructor(props) {
		super(props);
		
		// Initializing state: The only time we do `this.state = {...}`
		// and not use `this.setState(obj)`
		this.state = { lat: null, errorMessage: '' }; 
		// For any other time, use `this.setState(obj)` to update this.state
 
		window.navigator.geolocation.getCurrentPosition(
			pos => {
				this.setState({ lat: pos.coords.latitude })
			},
			err => {
				this.setState({ errorMessage: err.message })
			}
		);
	}
	render() {
		return (
			<div>
				Latitude: {this.state.lat}
				<br />
				Error: {this.state.errorMessage}
			</div>
		);
	}
}

/* Timeline:
1. JS and React code loads into browser
2. App component is created 
3. Therefore, constructor is run
	a. this.state is initialised
	b. Geolocation API is called (ASYNC)
4. Component now calls 'render'
	a. JSX is rendered on page. 'Latitude: '
	...
	...
5. API response becomes available (ASYNC)
6. setState() is called in the callback of the API call:
	a. state is altered
	b. Almost instantaneous re-render of App component takes place. That is, 'render' method gets called again. Ex: 'Latitude: 37.77466'
*/
```

An example of ***conditional rendering***: Note that conditional rendering inside the render method is ***BAD Practice*** and you must avoid it. This technique is the equivalent of the `v-if`, `v-else-if`, and `v-else` directives in Vue. Discussed in detail later!

```react
render() {
    if(this.state.errorMessage && !this.state.lat) {
        return <div>Error: {this.state.errorMessage}</div>;
    }
    if(!this.state.errorMessage && this.state.lat) {
        return <div>Latitude: {this.state.lat}</div>;
    }
    return <div>Loading...</div>
}
```

**Q: In how many ways can `state` be initilized inside a Class component?**
A: In ***2 ways***, inside a constructor and without using a constructor. Without using a constructor, we can just write `state = { ... }` outside and it is equivalent to the constructor way of defining the state. It does *not* use the `this` keyword and is easier to read. *Internally however, since this is new syntax, Babel is responsible for converting it into the earlier constructor format - This is verifiable in the Babel REPL with required presets on!*

```react
// Using constructor to initialize state:
class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = { lat: null, errorMessage: '' }; 
	}
    ...
	render() { ... }
}	
```

```react
// Equivalent code but without using a constructor:
class App extends React.Component {
	state = { lat: null, errorMessage: '' }; // No need to pass props to constr., etc
	...
	render() { ... }
}	
```

**Passing state as props**

We can take state from one component (Parent) and pass it down as props to another component (child). This is possible because props can accept a javascript expression/value as shown below:

```react
// Inside App.js:
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { lat: null, errorMessage: '' }; 
		window.navigator.geolocation.getCurrentPosition(
			pos => this.setState({ lat: pos.coords.latitude }),
			err => this.setState({ errorMessage: err.message })
		);
	}
	render() {
		if(this.state.errorMessage && !this.state.lat) {
			return <div>Error: {this.state.errorMessage}</div>;
		}
		if(!this.state.errorMessage && this.state.lat) {
			return <Season lat={this.state.lat} />; // Passing state as props
		}
		return <div>Loading...</div>
	}
}

// Inside Season.js:
const Season = (props) => {
	return <h1>Latitude: {props.lat}</h1>;
}
```

## Lifecycle Methods

The component life cycle (timeline) is:

1. Component is created: `constructor` is called and `this.state` is set
2. Component renders: `render` method is invoked
3. The first time that the component renders (i.e content becomes visible on screen), **`componentDidMount`** method is called. This method (and similar ones) exist on the base `React.Component` class and we can override them by including them in our class 
4. Next, everytime there is an update (i.e State has changed): React internally calls `render` and thereafter, invokes the **`componentDidUpdate`** method
5. Finally, whenever the component is no longer shown: The **`componentWillUnmount`** method is executed. We can put code that we want to run as a cleanup service before component is removed in this method

**Tips**

1. `constructor`: Use it to *set initial state* (& possible do initial data loading)
2. `render`: Use it to only *return JSX* and not do complex stuff (since it is called frequently)
3. `componentDidMount`: Use it to do *initial data loading*. Best practice suggests that this is better for initial data loading than inside the constructor
4. `componentDidUpdate`: Good place to do *more data loading*. Ex: Changes on user clicks, change in props, etc
5. `componentWillUnmount`: Good place to do *cleanup* - especially when dealing with non-React code. Ex: Removing google maps library

**Rarely used lifecycle methods**

Only a tiny subset of use-cases will demand the implementation of the following methods:

1. `shouldComponentUpdate`
2. `getDerivedStateFromProps`
3. `getSnapshotBeforeUpdate`

Example of a lifecycle method:

```react
class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = { lat: null, errorMessage: '' }; 
	}
	componentDidMount() {
		window.navigator.geolocation.getCurrentPosition(
			pos => this.setState({ lat: pos.coords.latitude }),
			err => this.setState({ errorMessage: err.message })
		);
	}
	render() {
		if(this.state.errorMessage && !this.state.lat) {
			return <div>Error: {this.state.errorMessage}</div>;
		}
		if(!this.state.errorMessage && this.state.lat) {
			return <div>Latitude: {this.state.lat}</div>;
		}
		return <div>Loading...</div>
	}
}
```

## Linking a CSS file to a Component file

We have to manually link a CSS file to a component (unlike in Vue). 

We write out a CSS file and the name of this file is usually the *same* as the component name (& component filename). This is by convention

We import the file in our component using `import <filepath>.css`. The extension is *required* here because it is not the automatically assumed `.js` 

Webpack (or a similar loader) that is babel-ifying, loading, and bundling our modules will identify the CSS file for the component then place this CSS in our HTML file (like `public/index.html`) and that is how the CSS and the JS for the component get linked to each other. It does not happen in the way component's template, JS, and CSS are scoped together in Vue

**Example**: 

```react
/* src/Season.css: */
.heading {
	font-size: 30px;
	line-height: 50px;
	text-align: center;
}

/* src/Season.js: */
import React from 'react';
import './Season.css';
const Season = (props) => {
	const season = getSeason(props.lat, new Date().getMonth());
	return <h1 className="heading">{season}</h1>;
}
export default Season;

/* The generated 'public/index.html' on build (dev): */
<html>
<head>
	...
	<title>...</title>
	<style>
	.heading {
        font-size: 30px;
        line-height: 50px;
        text-align: center;
    }
    </style>
</head>
<body>
	...
</body>
</html>
```

## Default Props 

When the data that needs to be displayed or used in a component is dependent on the parent passing props, and if those props are not sent, our component may not behave the way in which it is supposed to. In this case, we can set default props within the component itself

There are two ways to specify default props:

1. Use the **`||`** operator. Example: `<div>{props.message || 'Loading...'}</div>`
2. Use the **`defaultProps`** object on the component. Example:

```react
// Loader.js:
import React from 'react';
const Loader = (props) => {
	return <div>{props.message}</div>;
}
Loader.defaultProps = {
	message: 'Loading...'
}
export default Loader;

// Inside Parent:
...
render() {
    return <Loader />; // No 'message' set; 'Loading...' will be shown
}
...
```

**Avoiding Conditional Rendering (Good Practice)**

We avoid conditional rendering by abstracting the rendering to another method. Imagine a case where you need to show 3 different divs inside one component based on conditions. We would have an `if` statement to return the appropriate JSX in the return statement

Now, if a requirement comes in that the component must have a wrapper with border no matter what the case, we will have to duplicate code in each of the if blocks. This is bad! Instead, what we can do is give the control over  the conditionals and returning the inner divs to another, separate method and always invoke this method in our actual `render`. Due to abstraction, we have eliminated code duplication and messy conditionals inside `render` and it is more readable now

```react
class App extends React.Component {
	state = { lat: null, errorMessage: '' }; 

	componentDidMount() {
		window.navigator.geolocation.getCurrentPosition(
			pos => this.setState({ lat: pos.coords.latitude }),
			err => this.setState({ errorMessage: err.message })
		);
	}
	/* HELPER METHOD: */
	renderContent() {
		if(this.state.errorMessage && !this.state.lat) {
			return <div>Error: {this.state.errorMessage}</div>;
		}
		if(!this.state.errorMessage && this.state.lat) {
			return <Season lat={this.state.lat} />;
		}
		return <Loader message="Please enable location..." />
	}
	/* RENDER HAS NO CONDITIONALS/MULTIPLE RETURNS: */
	render() {
		return (
			<div className="wrapper">
				{this.renderContent()}
			</div>
		);
	}
}
```

Therefore, avoid conditionals and multiple return statements inside your `render` function and instead put them in ***helper*** methods

## Imposing Structure into Large React Apps (Opinionated)

```
"/" (Root folder)
	"public/" (All the public/static libraries, images, etc)
		"index.html" (The main HTML file. Use it to add links to CSS libraries etc)
		...
	"src/" (Parent folder for all our source files)
		"index.js" (The entry point (file) for our React app)
		"components/" (Place each individual component file inside this folder)
			"App.js"
			"Search.js"
			...
		"api/" (Place all the API related code and config information here)
			"SomeAPIName.js"
```

## Handling User Input and Events

Event handlers are the ***sole*** means by which we come to know that the user is interacting with our application. How do we handle this?

1. Set an event handler property on the element in JSX and pass it a *reference to a method*

   `<div onClick={this.someHandlerMethod}>...</div>`

2. *Define an event handler* inside the component as a method that gets executed on the defined event

   `someHandlerMethod() { ... }`

**Note**: Do not call `() `the method, only *reference* it since it is a callback: `onClick={this.method()}` is wrong.

Every event handler method that is a callback gets an ***event argument*** by *default* (as first parameter). This is a *synthetic react event* that mostly behaves like a normal javascript event that contains a bunch of information on the element on which the event was triggered. For example, `event.target` returns the DOM element, `event.target.value` for the value of the element if it is an input 

There are many event listener properties in React, similar to ones in the DOM:

1. `onClick` (when element is clicked)
2. `onDoubleClick` (when element is double clicked)
3. `onChange` (changes text in a text input)
4. `onSubmit` (when a form element is submitted)
5. `onFocus` (when focussing on an input)
6. `onBlur` (when focussing outside of an input)
7. `onMouseDown`, `onMouseEnter`, `onMouseLeave`, `onMouseMove`, `onMouseOut`, `onMouseOver`, ...
8. `onKeyPress`, `onKeyDown`, `onKeyUp` (key events)
9. `onCopy`, `onCut`, `onPaste` (clipboard events)
10. `onDrag`, `onDragEnd`, ... (drag events)
11. `onSelect` (when content is selected by the user)
12. `onScroll` (when the element is scrolled)
13. `onLoad`, `onError` (image load events)

Example:

```react
class SearchBar extends React.Component {
	onInputChange(event) {
		console.log(event.target.value);
	}

	onInputClick(event) {
		console.log('Input was clicked');
	}

	render() {
		return (
			<div className="ui segment">
				<form className="ui form">
					<div className="field">
						<label htmlFor="">Image Search</label>
						<input type="text" onChange={this.onInputChange} onClick={this.onInputClick} />
					</div>
				</form>
			</div>
		);
	}
}
```

The ***convention*** followed by developers for event handler method names is: **`on<Element><Event>`**. For example: `onTextareaBlur() { ... }`. Sometimes `on` is replaced with `handler`

Even the following syntax is allowed since we are still passing a reference to a function in JSX:

`<input type="text" onClick={(e) => console.log('Input was clicked')} />`

### Controlled versus Uncontrolled Elements

Assume that there is an element say, an input field, and the value of the input field is in the HTML source. React does not have any control over this value and can only know about it either through a DOM reference or during an event handler's execution when the value becomes available in `e.target.value`. Generally, we do not wish to keep source of data as HTML because then our component becomes less useful and less powerful - ***Data must be in our application logic***, not in rendered elements

"Controlled elements" ensure that *data is centralized in the component* and the *component controls the value of data instead of HTML*. Values can be ***bound*** to elements and vice-versa

**Implementing One-Way data binding (Similar to `v-bind` in Vue)**

A state property (or any other component variable) sets the value, text, attribute, etc. so that the information on that element is bound to the data source and it cannot change unless data source changes as well

```jsx
...
// State values:
this.state = { 
    imgSource: 'https://placem.at/things?w=250&random=some_seed',
    inputVal: 5
};
...
// A. src attribute is fixed to this.state.imgSource:
<img src={this.state.imgSource} /> 
...
// B. input value will always be fixed to this.state.inputVal
<input type="number" value={this.state.inputVal} />
// It cannot change - In fact, it does NOT ALLOW you to edit the input on the webpage!!
// Why? Because the value is BOUND to state and it has not changed on user input.
...
```

**Implementing Two-Way data binding (Similar to `v-model` in Vue)**

We require two-way data-binding mostly on input elements where our state provides the value for an input element and if a user changes the value on screen then we in turn trigger state change and re-render the element with the new value. Two-way data binding is made possible by the following steps:

1. Bind your input `value` to a property in the `state`
2. Have an event handler that will get triggered on user input. Ex: `onChange`, `onClick`, etc.
3. Inside this event handler, set the state with the new value available in `e.target.value`. This will change the value of the state property and cause a re-render. On re-render, React notices that value of the input is bound to the state property and that is how we save & display the new value. 

**Note**: *Input change is not allowed if event handler has not been wired to it*. If event handler was not present then that state property would not have changed and hence React will not allow us to edit the input to create two-way data binding (user trying to click or change the input will not work since the state property that is 'controlling' the input has not changed)

```react
class SearchBar extends React.Component {
	state = { term: 'a' }; // initial value of the input
	render() {
		return (
			<div className="ui segment">
				<form className="ui form">
					<div className="field">
						<label htmlFor="">Image Search</label>
						<input 
							type="text" 
							value={this.state.term}
							onChange={e => this.setState({ term: e.target.value })}
						/>
					</div>
				</form>
			</div>
		);
	}
}

/* 
1. User types input
2. Callback gets invoked
3. We call setState with new value
4. Component re-renders
5. Input is told what its value is (coming from state)
*/
```

### Right way to initialize methods (`this` in a Class component)

The following snippet throws this error on form submit (enter): 

`TypeError: Cannot read property 'state' of undefined`

```react
// (X) Erroneous code:
class SearchBar extends React.Component {
	state = { term: 'a' };
	onFormSubmit() {
		console.log(this.state.term); // Line responsible for error (X)
	}
	render() {
		return (
			<div>
				<form onSubmit={this.onFormSubmit}> // triggered on enter (i.e submit)
					<div>
						<label htmlFor="">Image Search</label>
						<input 
							type="text" 
							value={this.state.term}
							onChange={e => this.setState({ term: e.target.value })}
						 />
					</div>
				</form>
			</div>
		);
	}
}
```

The error occurs because `this.state` and `this.setState()` are not available inside the `onFormSubmit` handler.

**Q: How does `this` work?**
A: `this` is set (to an object) based on where the method/function is ***invoked from*** (and not where it appears). The following **4** rules explain it:

1. Function is called with `new` keyword: `this` is the new object that was created

2. Function is called as a method of an object: `this` is the object on which it was called

   `obj.doSomething(); // On execution: 'this' inside 'doSomething' will refer to 'obj' `

3. Function is called with `call`, `apply`, or `bind`: `this` will be whatever object was passed as argument to those functions

4. Function is called stand-alone: It is either the `window` object or **`undefined`** if it is strict mode (which React is babel-ified to)

   ```javascript
   function bar() {
       return this; // value of 'this' depends on how 'bar' was called
   }
   function foo(bar) { 
       bar(); // bar is called standalone (no call/apply/bind, no new, not object method)
       // Therefore 'this' is set to window (or undefined, if strict mode)
   }
   foo(bar); // Reference to bar sent to foo
   ```

**Q: So what is wrong with the above code snippet?**
A: Whenever we pass a method to an event identifier attribute in JSX, we pass it as a ***reference***. That is, the method is not immediately invoked, but the reference to them is used to invoke them at a later time when the event actually gets fired. Even though we have specified the reference to the handler with `this.<handler-name>` in our JSX, when it is actually executed, it is done so internally by React in a ***"stand-alone"*** (rule 4) way. And, since React is babel-ified to code under `use strict;`, we get the "`this.state` is `undefined`" error!

**Q: How do we fix the `this` context issue in class methods?**
A: There are **3** ways in which you can do this (technically two):

1. Use **`bind`** on every method and fix its `this` so that whenever and wherever it is run from, there is only one `this` initialized for it. You will need a constructor for this purpose

   `this.someMethod = this.someMethod.bind(this); `

   ```react
   ...
   constructor(props) {
   	super(props);
   	this.state = { ... };
   	this.someMethod = this.someMethod.bind(this); // hard-codes the `this` to method
   	// A constructor is called with the class object as 'this'
   	// Therefore, the class object is always gonna be the 'this' inside someMethod
   }
   someMethod() { ... }
   render() {
       ...
       <input onChange={this.someMethod} />
       ...
   }
   ...
   ```

2. Using ***arrow functions***: Arrow functions *do not* create a new context. That is, they do not alter `this` inside their body according to the above 4 rules. Instead, the value inside is the same as the `this` value inside their parent function. So, `this` for arrow functions is kind of determined lexically (i.e how the parent of the arrow function was invoked is what determines `this` inside an arrow function)

   1. Use arrow function inline inside JSX `{}`: The `this` will refer to the value of `this` in the parent (the `render` method). `render` is always invoked as a method of the component object. Hence, `this` will always refer to the class component object making `this.state` and `this.setState` available, which is what we want

      `<input onChange={e => this.setState({ someKey: 'itsValue' })} />`

   2. **[Most popular method]** Use arrow function instead of a class method and assign it to a variable: The parent of this arrow function is the class object, so `this` inside arrow function will always refer to the class object making `this.state` and `this.setState` available, which is what we want

      `someHandlerMethod = e => { this.setState({ ... }); }`

Example:

```react
// Example of Solution 1: bind (onFormSubmit) and
// Solution 2.1: Inline arrow functions in JSX (onChange)
class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { term: 'a' };
		this.onFormSubmit = this.onFormSubmit.bind(this);
	}
	onFormSubmit(e) {
		e.preventDefault();
		console.log(this.state.term);
	}
	render() {
		return (
			<div className="ui segment">
				<form className="ui form" onSubmit={this.onFormSubmit}>
					<div className="field">
						<label htmlFor="">Image Search</label>
						<input 
							type="text" 
							value={this.state.term}
							onChange={e => this.setState({ term: e.target.value })}
						 />
					</div>
				</form>
			</div>
		);
	}
}
```

```react
// Example of 2.2: arrow function in variable (MOST POPULAR METHOD)
class SearchBar extends React.Component {
	state = { term: 'a' };
	onFormSubmit = (e) => {
		e.preventDefault();
		console.log(this.state.term);
	}
	render() {
		return (
			<div className="ui segment">
				<form className="ui form" onSubmit={this.onFormSubmit}>
					...
				</form>
			</div>
		);
	}
}	
```

```react
// Example of 2.1: inline arrow function
class SearchBar extends React.Component {
	state = { term: 'a' };
	onFormSubmit(e) {
		e.preventDefault();
		console.log(this.state.term);
	}
	render() {
		return (
			<div className="ui segment">
				<form className="ui form" onSubmit={e => this.onFormSubmit(e)}>
					...
				</form>
			</div>
		);
	}
}	
```

### Communicating from Child to Parent

In React, prop system works in such a way that data can be sent from parent to children (using `props`) but the opposite is not possible. This is the way the system has been intentionally desgined. That is, *unidirectional flow of data* that is explicit and easy to debug

Sometimes, we want the child to communicate with its parent. We can make this happen in the following way:

1. Define a method on the Parent to handle communication from child (Hence, parent component needs to be ***class-based***)
2. Pass this method to child as a prop
3. Inside the child, invoke this method when required, passing it arguments if needed

```react
// Inside App.js (Parent):
class App extends React.Component {
	onSearchSubmit(term) {
		console.log(term);
	}
	render() {
		return (
			<div className="ui container" style={{ marginTop: '10px' }}>
				<SearchBar onSubmit={this.onSearchSubmit} /> 
			</div>
		);
	}
} 
/* 'onSubmit' is not a special attribute on a component tag, 
it is just another prop name */

// Inside SearchBar.js (Child)
class SearchBar extends React.Component {
	state = { term: 'a' };
	onFormSubmit = e => {
		e.preventDefault();
		this.props.onSubmit(this.state.term);
	}
	render() {
		return (
			<div className="ui segment">
				<form className="ui form" onSubmit={this.onFormSubmit}>
					<div className="field">
						<label htmlFor="">Image Search</label>
						<input 
							type="text" 
							value={this.state.term}
							onChange={e => this.setState({ term: e.target.value })}
						 />
					</div>
				</form>
			</div>
		);
	}
}
```

**Note**: 

1. Inside Functional Component: Access props with `props`
2. Inside Class-based Component: Access props with `this.props` inside a method (Only within constructor can we use jsut `props` because it receives it as the first argument)

(**Note**: Vuex and probably redux provide a centralized store for the entire application and different, even unrelated components may communicate with each other through this central store. It is mostly made possible via publisher/subscriber or event-listener pattern. But, a central store should not be misused. Learnt later...)

## Making API Requests

In most cases, we would require data from external sources, like an API, in our app. React itself does not provide functionality for making these HTTP (Ajax) requests. That is because React is a framework/library and not a network request utility

There are **2** utilities/packages/functionalities that we can use to make network request and fetch data:

1. **`axios`**: A 3rd party package (library) (there are other, less popular alternatives too)
2. **`fetch`**: A native functionality built into modern browsers (fetch API is part of ES6 or 7 - something). No installation required. Hence, final application code size is slightly smaller compared to when we use axios

`fetch` is a much lower level, basic utility as compared to the `axios` library. With `axios`, you need to write much less code than you would with `fetch`

1. **Installing `axios`:**

`npm i --save axios`

2. **Importing the dependency:**

`import axios from 'axios';`

3. **`GET` request with `axios`:**

`axios.get(url, options object)`

4. **Header options in `axios`:**

`axios.get(url, { headers: {}, ... })`

5. **Query string params in `axios`:**

`axios.get(url, { params: {}, ... })`

6. **Retrieving the response from `axios`:** There are 2 ways of doing this:
   1. With a **Promise** (ES6)
   2. With **Async / Await** (Newer than Promise, ES7 I guess)

**Retrieving response with a Promise**: Chain `then()` (and/or `catch()`) methods to `axios.get` (which returns a JavaScript promise). The callback in `then` receives the response as first parameter and `catch`'s callback gets error as first parameter. Babel will transpile this which is automatically configured internally in our `create-react-app` setup

```react
onSearchSubmit(term) {
    axios.get('https://api.unsplash.com/search/photos', {
        params: {
            query: term 
            // In 'GET', this equals https://api.unsplash.com/search/photos?query=<term>
        },
        headers: {
            Authorization: 'Client-ID ae0ec6d866d399836287a89994f87302fc381674ef1ce34496ec73470062303d'
        }
    }).then(response => {
        console.log(response.data.results)
    }).catch(err => {
        console.log(`Error: ${err}`);
    });
}
```

**Retrieving response with a Async / Await**: This is easier to use than promises because it makes the code and the flow easier to read. Babel needs to be told to transpile this which is automatically configured internally in our `create-react-app` setup

In order to use `async`/`await`, place the `async` keyword in front of whatever method is tasked with running the `async` operation. Now, inside this method place the `await` keyword in front of the exact operation that takes times to resolve (like axios.get() which returns a promise). This forms an expression which can be assigned to a variable. We can then use this variable later inside the method. The value of the operation is stored in the variable when it becomes available (and later use or manipulation of that variable is paused until the value in it is available)

```react
async onSearchSubmit(term) {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
            query: term // In 'GET', this equals https://api.unsplash.com/search/photos?query=<term>
        },
        headers: {
            Authorization: 'Client-ID ae0ec6d866d399836287a89994f87302fc381674ef1ce34496ec73470062303d'
        }
    });

    console.log(response.data.results);
}
```

Usually, `state` is updated after an API call is made:

```react
class App extends React.Component {
	state = { images: [] };
	/* this.setState() is being called inside the method, 
	so context for 'this' must be fixed: using one of the 3 ways to fix it */
	onSearchSubmit = async (term) => {
		const response = await axios.get('https://api.unsplash.com/search/photos', {
			params: {
				query: term
			},
			headers: {
				Authorization: 'Client-ID ae0ec6d866d399836287a89994f87302fc381674ef1ce34496ec73470062303d'
			}
		});

		this.setState({
			images: response.data.results
		});
	};

	render() {
		return (
			<div className="ui container" style={{ marginTop: '10px' }}>
				<SearchBar onSubmit={this.onSearchSubmit} />
				Found: {this.state.images.length} images
			</div>
		);
	}
}
```

```javascript
// Async/await using an ARROW function (Syntax):
const <methodName> = async (<arguments>) => {
    const <resultName> = await <operation that takes time to resolve>;
    ...
    // <resultName> becomes accessible
};
```

**Creating custom clients using `axios`**

**`axios.create`** allows us to customize a client such that it creates a instance of axios that allows us to make requests only to specific APIs with specific options (specific headers and params). Basically, it allows use to *pre-program* the properties of a request

```react
axios.create({
    baseURL: '...',
    headers: {
        ...
    },
    ...
});
```

Our code can be further modularized by saving the API related code in a separate file (and/or folder), using `axios.create` to pre-program requests to this API, exporting it to our main App, and making a simple API request from there as shown in the example below

```react
// src/api/unsplash.js:
import axios from 'axios';

export default axios.create({
	baseURL: 'https://api.unsplash.com',
	headers: {
		Authorization: 'Client-ID ae0ec6d866d399836287a89994f87302fc381674ef1ce34496ec73470062303d'
	}
});
```

```react
// src/components/App.js:
import React from 'react';
import unsplash from '../api/unsplash';
import SearchBar from './SearchBar';
import ImageList from './ImageList';

class App extends React.Component {
	state = { images: [] };
	
	onSearchSubmit = async (term) => {
		const response = await unsplash.get('/search/photos', {
				params: { query: term }
			}); // baseURL & headers were pre-programmed

		this.setState({
			images: response.data.results
		});
	};

	render() {
		return (
			<div className="ui container" style={{ marginTop: '10px' }}>
				<SearchBar onSubmit={this.onSearchSubmit} />
				<ImageList images={this.state.images} />
			</div>
		);
	}
}

export default App;
```

**Note**: It is common practice to place imports to all (library/framework/external) dependencies first and then the imports to other custom files later; increases readability

## Rendering Lists in JSX

The most useful and readable way of rendering lists in JSX is to use the javascript **`map`** method on arrays.

`map` method takes in a callback function which is run for every item in the array (or any iterable object that has a map method). This callback function gets parameters each time it is run, the first being the item itself (second is index, third is reference to the array itself). The callback is expected to process the item and return something. The `map` method returns a new array (original is unaffected) with each item contains the result of the operation that was performed on the original array item (1:1 mapping) 

```javascript
const arr = [1, 2, 3, 4];
const arr10 = arr.map(item => item * 10);
console.log(arr); // [1, 2, 3, 4]
console.log(arr10); // [10, 20, 30, 40]
```

***JSX can display lists inside itself***. Save your lists using map into a variable and display that inside your JSX

```react
// props.images is sent to the component:
const ImageList = props => {
	const images = props.images.map(image => {
		return <img src={image.urls.regular} />
	});

	return (
		<div>
            {images}
        </div>
	);
}

```

### Using keys in lists

Whenever we display lists, react throws a warning if each element of the list does not have a **`key`** property. This happens because react uses the key to optimize re-rendering of lists. For example, if a list has 3 items and it is updated with a 4th item then react will only append the 4th extra item instead of re-rendering the previous 3 items as well. The `key` proeperty helps keep track of individual items in a list and make this rendering optimization possible

**Q: How do we choose keys for each item?**
A: We have to set key as a unique value associated with that element. Usually, an `id` property associated with an individual data can be used as key since this is a unqiue

```react
const ImageList = props => {
	const images = props.images.map(({id, urls, description}) => {
		return <img key={id} src={urls.regular} alt={description} />
	})

	return {images};
}
```

**Q: Where do we place the key attribute?**
A: We place the key attribute on the *root element* of each item. For example, if we have a list of items, we can place `key` on the each `img` tag but if each image is wrapped in a container, say a `div`, the `key` must be placed on that wrapper

```react
const ImageList = props => {
	const images = props.images.map(({ id, urls, description }) => {
		return (
			<div key={id}>
				<img src={urls.regular} alt={description} />
			</div>
		);
	});

	return <div>{images}</div>;
}
```

## Usings Refs for DOM Access

Whenever we want to access DOM elements using React, we use the ***Ref system*** (short for reference)

In normal javascript, you would use `document.querySelector` and the likes to identify and manipulate a DOM element. We do not use this in React

React Ref is used to give the developer access to a single DOM element.

**Q: How do we implement Refs?**
A: In the following way (using **`ref`** attribute)

1. We create refs in the constructor: `React.createRef();`
2. Assign them to instance variables: `this.imageRef = React.createRef();`
3. Pass to a particular JSX element as props: `ref={this.imageRef}`

Although refs can be linked with state, it is not required since you do not need state to work with refs.

It is not a good idea to overuse refs since that is not what React is primarily intended to do. But, in a few cases, it becomes useful. For example, it is useful to have a ref on images when you need to specify its height and spacing which differs from image to image based on its aspect ratio

The ref itself is a javascript object that has a propert, `current`, which references a DOM node. Example:

```react
class ImageCard extends React.Component {
	constructor(props) {
		super(props);

		this.imageRef = React.createRef(); // Create a ref system and assign to instance var
	}
	componentDidMount() {
		console.log(this.imageRef); 
		// Whenever an image with a ref is rendered (because this is 'componentDidMount'), 
		// its ref object is logged "{ current: <DOM node> }"
	}

	render() {
		const { urls, description } = this.props.image;
		return (
			<div>
				<img ref={this.imageRef} src={urls.regular} alt={description} />
			</div>
		); // created ref is passed as property to element we want a DOM reference to
	}
}

```

**Issue with DOM elements that take longer to load**: Even after getting the element, accessing its properties might not show the true value since the element has not fully loaded yet. For example, if we get the ref of an image and try to access its height immediately, it will return 0 because the image has not finished loading yet. In such cases, we must wait for the image to load. This is possible with the native DOM API (nothing to do with React):

```react
class ImageCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = { spans: 0 };
		this.imageRef = React.createRef(); // Create a ref system, assign to instance var
	}

	componentDidMount() {
		this.imageRef.current.addEventListener('load', this.setSpans); // Wait till load
		// addEventListener is not React but part of the basic DOM API (in browsers)
	}

	setSpans = () => {
		const height = this.imageRef.current.clientHeight;
		const spans = Math.ceil(height / 10);
		this.setState({ spans: spans });
	};

	render() {
		const { urls, description } = this.props.image;
		return (
			<div style={{ gridRowEnd: `span ${this.state.spans}` }}>
				<img ref={this.imageRef} src={urls.regular} alt={description} />
			</div>
		); // created ref is passed as property to element we want a DOM reference to
	}
}
```

**Summary of `ref`**

1. The ref basically refers to an instance of the component itself (not the element on which it is set as a ref prop). That is why it is created in the constructor and assigned to a property of the instance (similar to state). `constructor(props) { ... this.imageRef = React.createRef(); ... }`
2. However, the `current` property of the ref object will refer to the DOM node that it refers to in the JSX

```jsx
<img ref={this.imageRef} src={urls.regular} alt={description} />
```

3. In the lifecycle methods, the ref variable (Ex: `this.imageRef`) can be used to refer to the ref object on the instance of the component. And, the `this.imageRef.current` will refer to the DOM node of an element, on which `ref` prop was set, of that instance of the component

## Redux

Redux is a ***state management library***. We can store the same data that we have been storing inside our components' states inside Redux. Redux abstracts management away from React. It is similar to the `Vuex` store in VueJS.

**Q: Why abstract state management away from React?**
A: React's primary job is to render data and handle user input. Therefore, if state management gets complicated then it is better to abstract it out

**Q: What are the features of Redux?**
A: The following:

1. It makes creating complex applications easier
2. We do not require React to work with Redux - Many different libraries make use of it
3. It is not explicitly designed to work with React - More of a generic state management utility

### The Redux Cycle

There are **5** steps in the Redux Cycle:

1. **Action Creator**
  A *function* that is going to create and return a plain javascript object `{..}`. This plain javascript object is known as the ***action***

2. **Action**
  It is a javascript *object* that has a ***type*** and a ***payload*** property. The type decides the change that we want to make in our data. The payload describes the context around this change

3. **Dispatch**
  A *function* that is going to take in an ***action*** object, make copies of it, and pass it off to a different bunch of places

4. **Reducers**
  A *function* that is responsible for taking in an ***action*** and some ***existing amount of data***. It is going to process that action and make some changes to the data, and then return it so that it then can be ***centralized in some other location***

5. **State**
  It is a ***central repository*** of all the information that has been created & returned by ***reducers***

**An analogy to understand the Redux Cycle**

Imagine you have an insurance company with 3 departments: claims, policies, and accounting. There is also an upper level management that manages all the 3 departments. Assume that there also a front desk tasked with creating a form for the type of transaction that the customer wants to do. 

The customer who comes in with a query is met by the frontdesk. The front desk creates a form for the customer for making a claim/deleting policy/etc. The customer here is the ***action creator***. The form itself is will have two things: A *type* (claim/policy?) and the information (*payload*) associated with it (the claim amount / initial amount for creating a policy / etc.). Therefore, the form is the ***action*** object

The frontdesk then makes copies of these forms and sends them to the 3 departments for acting on it (the departments will act on it only if it concerns them). Since the frontdesk is 'dispatching' the form, it is the ***dispatcher***

When the departments receive the form, they will decide if they need to process it. They will only process the data if it concerns them. For example, if the form (*action*) is regarding a claim, then the claims department will process it but the same form (*action*) is not processed but 'passed on' as it is by the policies department because it does not concern them. Whenever a department needs to process a form (*action*), it needs additional data. That is, to add a claim, the department needs a data of all claims to update it. Or, to file a new policy or delete an existing one, the policy department needs a list of all policies. All this data for each department is held by the management in a centralized repository known as the ***state***. 

The departments which get a chunk of this data and update it or pass it on are known as the ***reducers***. The flow of data is such that the management (*state*) sends chunks of data to departments (*reducers*) who process/update it if necessary and return it to the central management (*state*) which is now updated if processing took place. 

**Note**: 

- All the information gets *consolidated* in the ***state*** object so that our react app can reach out to the redux side of our app and get all of the required data
- Reducer decides if data needs to be modified based upon the action specified
- Redux can be included to work with plan JS (Pure Redux without React works!)

**Q: What is a Redux "Store" then ?**
A: A ***store*** in Redux is essentially the assembly of a collection of different ***reducers*** (Ex. departments) and ***action creators*** (Ex: customers)

**Q: What is inside the `redux` library?**
A: It contains many methods. The two most important ones are:

1. **`combineReducers`**: Takes an object whose properties are set to the different reducers (Ex: departments)
2. **`createStore`**: Takes in the `combineReducers` function, creates and returns a ***store***

**Methods available on the created "store"**

1. **`dispatch`**: We pass an *action* (Ex: form) to the dispatch function (Ex: front desk). It creates *copies* of the action and sends it to each of the *reducers* (Ex: departments)
2. **`getState`**: Returns the *state* (central repository). The structure contains keys to each of the *reducers* (that were registered inside `combineReducers` and sent to `createStore`), and the value of each key is the (existing/current/previously updated) data associated with that reducer.

**A pure Redux example based on the analogy above**

```javascript
/* ASSUMING THAT THE REDUX LIBRARY WAS INCLUDED EITHER AS A PACKAGE OR FROM CDN */
/* `redux` library is available */

// Let us create a form for each type (for each action)
// (A) Action Creators:
// --------------------

// People dropping off a form (Action creator function)
const createPolicy = (name, amount) => {
	return { // The form (Action object)
		type: 'CREATE_POLICY', // Uppercase+underscore => convention (can be any str) 
		payload: {
			name: name,
			amount: amount
		}
	};
};

// People dropping off a form (Action creator function)
const deletePolicy = (name) => {
	return { // The form (Action object)
		type: 'DELETE_POLICY', // Uppercase+underscore => convention (can be any str) 
		payload: {
			name: name
		}
	};
};

// People dropping off a form (Action creator function)
const createClaim = (name, amountToCollect) => {
	return { // The form (Action object)
		type: 'CREATE_CLAIM', // Uppercase+underscore => convention (can be any str) 
		payload: {
			name: name,
			amountToCollect: amountToCollect
		}
	};
};

// (B) Departments (Reducers):
// ---------------------------

// Every department (reducer function) gets the data relating to it (old/existing data). It also receives the form (action object)

// Claims department (reducer)
const claimsHistory = (oldClaimsList = [], action) => {
	if(action.type === 'CREATE_CLAIM') {
		// we process the form (action)
		return [...oldClaimsList, action.payload];
		// adding new payload to oldClaimsList array (as new array) (using spread)
		// we AVOID modifying existing data structure
		// hence: returning a new array
	}
	
	// we wont process this form (action)
	return oldClaimsList;
};

// Accounting department (reducer)
const accounting = (bagOfMoney = 100, action) => {
	if(action.type === 'CREATE_CLAIM') {
		// we process the form (action)
		return bagOfMoney - action.payload.amountToCollect;
	}
	else if(action.type === 'CREATE_POLICY') {
		// we process the form (action)
		return bagOfMoney + action.payload.amount;
	}
	
	// we wont process this form (action)
	return bagOfMoney;
};

// Policy department (reducer)
const policies = (listOfPolicies = [], action) => {
	if(action.type === 'CREATE_POLICY') {
		// we process the form (action)
		return [...listOfPolicies, action.payload.name];
	}
	else if(action.type === 'DELETE_POLICY') {
		return listOfPolicies.filter(name => name !== action.payload.name);
	}
	
	// we wont process this form (action)
	return listOfPolicies;
};

// (C) Using the Redux Library methods:
// ------------------------------------

// Pulling off the required properties from the `redux` library:
const { createStore, combineReducers } = Redux;

// (C.1) Combine all our reducers:
const ourDepartments = combineReducers({
	policies: policies,
	accounting: accounting,
	claimsHistory: claimsHistory
});
// (C.2) Create our Redux store:
const store = createStore(ourDepartments);

// ***Testing/Application***: 
// Create an action from one of the action creators,
// Dispatch that action (form) to all reducers in store (departments):
const action = createPolicy('Alex', 20);
store.dispatch(action); // []Each of the reducers processed the action]

// logging:
console.log(store.getState());

store.dispatch(createPolicy('Jim', 30));
store.dispatch(createPolicy('Bob', 40));

// logging:
console.log(store.getState());

store.dispatch(createClaim('Alex', 120));
store.dispatch(createClaim('Jim', 50));

// logging:
console.log(store.getState());

store.dispatch(deletePolicy('Bob'));

// logging:
console.log(store.getState());

```

Test the above example on codepen by opening your console (Devtools) while on this [codepen link](https://codepen.io/pushkardk/pen/dwVLvy)

**Formal way of understanding the redux cycle**

1. Whenever we want to change the state of our app, we call an **action creator** function
2. It produces an **action** object
3. Which gets fed to a **dispatcher** function (inside the **store** object)
4. Which forwards the action to all **reducers**
5. Which creates a new **state** object
6. And this state is stored centrally (set using the **store** object) and 
7. Then we just wait until the next update...

**Q: Why do we need `combineReducers` and `createStore` redux methods?**
A: All of the reducers we created were simple javascript functions. They needed to be wired up to be recognised as reducers. `combineReducers` is responsible for doing that. `createStore` takes all the wired up reducers and relates them to the central state (i.e data required by all reducers)

**Q: What does the "state" look like?**
A: It has property names that match the key names of the reducer properties passed to the `combineReducers` method. The values are the data that these reducers interact with and update

**Q: What does `dispatch` do?**
A: It helps Redux perform *one full cycle* of all the redux operations. That is, take  action (form), send it to all the reducers (departments), update state (central repo of all the data of all departments).

**An Important Note on Redux**

One important thing about Redux is that we can only modify data in the state only through these cycle methods provided. There is *NO WAY* in which we can directly access the central state object maintained by redux and manipulate it

`store.state.accounting = 150; // (X) Wrong. Something like this is impossible with redux`

**Q: So, why use Redux? (BIG QUESTION)**
A: Theoretically, without Redux, the complexity of our app increases exponenentially as its size grows. If the app is small then it is not complex and there is no need for a state manager like Redux. However, analyzing apps which use Redux has shown that as the app size increase, the increase in complexity has been more stable/almost linear (non-exponential growth in complexity). Therefore, small apps using Redux might have a higher complexity initially but as they grow, the complexity stabilizes

## Integrating React with Redux

Apart from installing the `react` and `redux` libraries, we need to install a 3rd library called **`react-redux`** that is a helper library that makes react and redux work together

`create-react-app <name>`

`npm i --save redux react-redux`

Whenever we are using Redux, we will make use of component level state *much less frequently*! Because of this, we will use more function based components. This is because one of the main reasons for using class based components was to maintain component's state. If no component state is there, we don't have many reasons to use class components over function components

With function based components, our code becomes shorter and easier to read

There are some occcasions when we want to have state inside both the component as well as Redux. In such a case, we can use a class based component

**An idea for a react app**

An app to display a list of songs and play a selected song. One of the possible implementations *without* redux could be like so:

```
App [State: listOfSongs, selectedSong]
|
|
|-------------------------------|
|                               |
[onSongSelect (Callback),       [selectedSong]
listOfSongs]                    |
|                               |
|                               |
SongList                        SongDetail
```

Same react app but with *Redux* (A possible solution):

```
App
|
|
|-----------------|
|                 |
|                 |
SongList          SongDetail

===========================================

Redux
|_________ Reducers
|          |_________ Song List Reducer
|          |_________ Selected Song Reducer
|
|_________ Action Creators
           |_________ Select Song
```

