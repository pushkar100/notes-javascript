# React 16.6 (React Router + Redux)

[Tutorial Source](https://www.udemy.com/react-redux/learn/)

[Course Repo](https://github.com/StephenGrider/redux-code)

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

### "State" in Class Based Components

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

An example of ***conditional rendering***:

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
