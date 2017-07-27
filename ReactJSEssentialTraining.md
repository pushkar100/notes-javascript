# React Essential Training

React is a JavaScript library used to build **User Interfaces** (Created @ Facebook & Instagram).

React is used to build **Dynamic Websites**.

**Prerequisites:**
- JavaScript
- ECMAScript 6 (ES6) coding
- Installing packages using NPM & Node

## What is ReactJS?

We create reusable components in React and these display data as it changes over time.

React has expanded to include **React Native** which makes it easy to build *Mobile Applications*.

React has excellent documentation on their official site and tech giants like Uber & Netflix use it.

**React Detector** chrome extension by *Kent C Dodds* detects sites that use React. For a page that uses react, the extension logo turns *blue*.

**React Developer Tools** chrome extension by *Facebook* describes all the React elements that make up a page. This extension will add a "react" column in the developer tools and display the *Virtual DOM* in the "elements" section while the right side will show *properties* and *states* (which are editable).

**Document Object Model(DOM)** is the structure of the HTML elements that make up a web page. React made updating the DOM *faster* by **DOM Diffing** - JS objects are compared rather than writing to or reading from the actual DOM.

- Any DOM read/write operation takes time. Therefore JS updating the DOM frequently (Ex: getElementById, document.write, etc) slows down performance.
- Dealing with JS objects is faster. React only renders the minimal changes to the DOM making it efficient.
- Other frameworks like *backbone.js* write to the DOM for every small change. This affects performance negatively (re-render same data over and over again).

```
// Without Any Library:
DOM <= JS Logic

// With BackboneJS:
DOM <= JS Logic

// With ReactDOM:
DOM(min changes only) <= ReactDOM <= JS Logic
```

**Note:** In React
- We *never read* from the DOM.
- We only write to it when a *change is required* (else not).

## Intro to JSX and Babel

For working with React we will be needing two libraries, React (for the react logic) and ReactDOM (for interactign with the React DOM).
Ex:
```
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>
```

You may use CDN hosted scripts, available on [CDN JS](cdnjs.com).

We can either run our sripts directly inside the browser or host it on a server.
- If you wish to convert your work folder into a server, download an npm module called `httpster` and install it: `sudo npm install -g httpster`
- To run a server from a folder, use: `httpster -d <folder-path> -p <port-number>` where providing a port number is optional. (Example: `httpster -d ./dist/ -p 3000`)

### Pure React

1. Creating a React element (Syntax):
```
const title = React.createElement(
	type-of-html-element,
	object-with-props-such-as-id-className,
	children-of-the-element(html-tag-or-text)
);
```

Example:
```
const title = React.createElement(
	'h1', 
	{
		id: 'title',
		className: 'header'
	}, 
	'Hello World!'
);
```

**Note:** We use `className` instead of `class` in React.

2. Rendering a React Element (Syntax):
```
ReactDOM.render(
	a-react-element, 
	element-fetched-from-dom-by-javascript
);
```

Example:
```
ReactDOM.render(
	title, 
	document.getElementById('react-container')
);
```

**Full example:**
```
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://fb.me/react-15.1.0.js"></script>
    <script src="https://fb.me/react-dom-15.1.0.js"></script>
    <meta charset="UTF-8">
    <title>Hello World with React</title>
</head>
<body>
    <div id="react-container"></div>
	
    <script>
const title = React.createElement(
	'h1', 
	{
		id: 'title',
		className: 'header'
	}, 
	'Hello World!'
);

ReactDOM.render(
	title, 
	document.getElementById('react-container')
);
	</script>
</body>
</html>
```
3. **ES6 Destructuring** in React:
We can pick up particular properties of an object or particular elements of an array in es6 (known as destructuring - helps with writing shorter syntax). So, in the same way, we can pick up only the required React component properties for our file, for example:
```
const { createElement } = React;
const { render } = ReactDOM;

const title = createElement(
	'h1', 
	{
		id: 'title',
		className: 'header'
	}, 
	'Hello World!'
);

render(
	title, 
	document.getElementById('react-container')
);
```

4. JavaScript objects to define **style** for an element:
We can define an object in JS to hold the styles for an object. And, pass these to the properties object of the createElement.

Ex:
```
const style = {
	backgroundColor: 'orange',
	color: 'white',
	fontFamily: 'verdana'
};

const title = createElement(
	'h1', 
	{
		id: 'title',
		className: 'header',
		style: style
	}, 
	'Hello World!'
);
```

### Using JSX

1. JSX stands for **JavaScript as XML**. It can be used to output HTML and has its own syntax (XML-like syntax).
2. JSX syntax can be passed to `render()` function of ReactDOM, thus eliminating the need for `createElement()` method of `React`.
3. Also, JSX can accept React expressions (JS Objects) for its properties (enclosed within `{}`) as property values. 

**Note:** Instead of passing a React Element to `render` we can pass JSX itself (as 1st param).

Ex. of React expression inside JSX:
```
render(
	<h1 id='title'
		className='header'
		style={style}>
	Hello World	
	</h1>,
	document.getElementById('react-container')
)
```

We do not require `createElement` from `React` if we are using JSX (which is more elegant). For example:
```
const { render } = ReactDOM

render(
	<h1 id='title'
		className='header'
		style={{backgroundColor: 'orange', color: 'white', fontFamily: 'verdana'}}>
	Hello World	
	</h1>,
	document.getElementById('react-container')
)
```

The above code does **not** work without Babel.

### Babel
The browser cannot run JSX. Therefore, if we use JSX in React then we need to **transpile** our code into plain JS version so that it works in the browser. **Babel** helps us do that.

(Checkout the babel **REPL** http://babeljs.io/)

**(A) In-browser transpiler**: To use in-browser transpiler of Babel: Use `babel-core` upto version 5.
```
https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.38/browser.js
```
1. Include the script along with React & reactDOM scripts
2. Change the `type` of your JS script to `text/babel` so that babel knows it has to transpile it.

**(B) Static transpilation using Babel CLI**: In browser transpiling is good only for small projects or for development. For bigger projects, we can transpile statically and include the bundled js file in our code before execution in the browser.
**Step 1:** Do an `npm init` in your project folder.
**Step 2:** Install and save as a dependency the **Babel CLI** NPM module : `npm install --save-dev babel-cli` (Or install it globally `sudo npm install -g babel-cli` )
**Step 3:** Organise your folder structure:
    - Maybe put all the React & ES6 JS files into a separate folder like `src` (source).
    - And, all the ready files like `index.html` and generated JS files (say, `bundle.js`) into a separate folder like `dist` (distribution).
**Step 4:** Define a file called `.babelrc` which is a configuration file for your babel transpiler.
    - Specify `presets` in an object like structure inside your `.babelrc` file.
```
/* .babelrc: */

{
	'presets': ['latest', 'react', 'stage-0']
}
```
Presets tell Babel what to use while transpiling: `latest` will include the latest ES6 features, `react` will include ReactJS features, and `stage-0` includes some other features.
**Step 5:** Once the presets have been defined inside `.babelrc`, we need to install the presets & save them as dependency too so that we may use them. Therefore, we install them like so (`babel-preset-*`):
```
npm install --save-dev babel-preset-latest babel-preset-react babel-preset-stage-0
```
**Step 6:** Run `babel` to transpile the input file and give the output (specified) file.
```
babel ./src/index.js --out-file ./dist/bundle.js

/* --out-file is used to specify the name & location of the output file - created if it doesn't exist */
```
(For `.babelrc` usage refer: https://babeljs.io/docs/usage/babelrc/)

**Note:** Automatically run the `httpster` local server by pasting the following inside the `package.json` file:
```
{
    ...
    "scripts": {
        "start": "httpster -d ./dist -p 3000"
    },
    ...
}
```
Now, we just have to run `npm start` from our project folder to start the server.

The `index.html` would look something like this:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://fb.me/react-15.1.0.js"></script>
    <script src="https://fb.me/react-dom-15.1.0.js"></script>
    <meta charset="UTF-8">
    <title>Hello World with React</title>
</head>
<body>
    <div id="react-container"></div>
    <script type="text/javascript" src="bundle.js"></script>
</body>
</html>
```

### Webpack

Installing Babel CLI for static transpiling was a tedious task. We can do better by installing a **module bundler** like `webpack`.

Webpack:
- Helps deliver static files
- Helps automate processes: For example, run processes that need to happen before files can be loaded to & used in production.
- Can be used to bundle files: Convert multiple files into one single file (Reduces number of file requests, be it JS files or CSS or anything else).

The first thing we need with `webpack` is a config file: `webpack.config.js`.

A sample `webpack.config.js` file looks like this:
```
var webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		path: 'dist/assets',
		filename: 'bundle.js',
		publicPath: 'assets'
	},
	devServer: {
		inline: true,
		contentBase: './dist',
		port: 3000
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /(node_modules)/,
			loader: ['babel-loader'],
			query: {
				presets: ['latest', 'react', 'stage-0']
			}
		}]
	}
}
```

- `entry` is the file(s) to work on (input or source file).
- `output` is the output file to be generated. `path` is the location, `filename` is its name, and `publicPath` is the publicly visible location of the file.
- `loaders` helps us load modules that work on the input file. In this case, `babel` is the loader we want. It should run on all `.js` files (as mentioned in `test`) but must exclude `node_modules` folder files 
(as mentioned in `exclude`).
- Once we mention the loader (`babel-loader`), we can defined the presets it uses with `query` whose value is the same `.babelrc` object that we used to define presets earlier.

**Note:** We can define a `devServer` (something like `httpster`) which will launch a server from the folder we specify (here, it is `./dist`) and reload it as and when changes occur (also known as a *hot reload*).

In our `package.json` file, we need to change the start script to run the `webpack-dev-server` (instead of `httpster`):
```
{
    ...
    "scripts": {
        "start": "./node_modules/.bin/webpack-dev-server"
      },
    ...
}
```

**Required Installations:**
- `npm install webpack@1.13.3 --save-dev` (We want to install version `1.13.3`)
- `npm install babel-loader@6.2.5 --save-dev` (We want to install version `6.2.5`)
- `npm install webpack-dev-server@1.16.2 --save-dev` (We want to install version `1.16.2`)

**Last Step:** We can run our `webpack` in the CLI from the project folder (The `npm init`-ed folder. The babel loader must act upon the input files and produce the output (by using all its defined presets).

**Note:** If we have an error in running `webpack`:
- Install it globally: `sudo npm install -g webpack@1.13.3` **OR**
- Run `webpack` with its full path: `./node_modules/.bin/webpack`

**Note:** Change the path of the `bundle.js` being included in our `index.html` page to match with that being generated by the babel loader.

**LAUNCH STEP:** Once all the webpack setup is done and the file paths are modified, we can run `npm start` to launch the `webpack-dev-server` and see our site being loaded in the browser with the supplied port number (Ex: `localhost:3000`).

___

#### Loading JSON data with Webpack
First install `react` and `react-dom` with npm:
```
npm install --save react react-dom
```

Installing *React* and *ReactDOM* with NPM saves us from having to attach the CDN scripts to the same. Our index page would look something like this without those CDN links to react and react-dom:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World with React</title>
    <!-- Missing React & ReactDOM CDN Scripts -->
</head>
<body>
    <div id="react-container"></div>
    <script type="text/javascript" src="assets/bundle.js"></script>
</body>
</html>
```

**Note:**
- `--save-dev` is used to save the package for development purpose. Example: unit tests, minification..
- `--save` is used to save the package required for the application to run.

Since we have installed React & ReactDOM via NPM , there is a slight change in the way we include them in our files:
```
import React from 'react'
import { render } from 'react-dom'
```

**Steps to load JSON data with Webpack:**
- Create a JSON file (say, `titles.json` inside `src` folder).
- Create another file that fetches the JSON data and creates elements (say, `lib.js` inside `src` folder).
- Import the following into `lib.js` file:
    - `import React from 'react'` and 
    - `import text from './titles.json'`
- Import the following into `index.js` (inside `src`) file:
    - `import React from 'react'`
    - `import { render } from 'react-dom'`
    - `import { hello, goodbye } from './lib'`
- Export whatever element(s) we want from lib.js and use them in index.js
- Important!: Add the `json-loader` module inside `webpack.config.js` in order to load the json from the json files. Once we have added the loader to webpack config file, we need to install it with `npm install --save-dev json-loader`.
- Run the project with `npm start` to start the webpack-dev-server.

**A Full Example:**
```
<!-- "./dist/index.html": -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World with React</title>
</head>
<body>
    <div id="react-container"></div>
    <script type="text/javascript" src="assets/bundle.js"></script>
</body>
</html>
```

```
// "./src/index.js":

import React from 'react'
import { render } from 'react-dom'
import { hello, goodbye } from './lib'

render(
	<div>
		{hello}
		{goodbye}
	</div>,
	document.getElementById('react-container')
)
```

```
// "./src/lib.js":

import React from 'react'
import text from './titles.json'

export const hello = (
	<h1 id='title'
		className='header'
		style={{backgroundColor: 'purple', color: 'yellow'}}>
		{text.hello}
	</h1>
)

export const goodbye = (
	<h1 id='title'
		className='header'
		style={{backgroundColor: 'yellow', color: 'purple'}}>
		{text.goodbye}
	</h1>
)
```

```
// "./src/titles.json":

{
	"hello": "Bonjour!",
	"goodbye": "Au Revoir"
}
```

```
// "./webpack.config.js":

var webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		path: 'dist/assets',
		filename: 'bundle.js',
		publicPath: 'assets'
	},
	devServer: {
		inline: true,
		contentBase: './dist',
		port: 3000
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: ['babel-loader'],
				query: {
					presets: ['latest', 'react', 'stage-0']
				}
			},
			{
				test: /\.json$/,
				exclude: /(node_modules)/,
				loader: "json-loader"
			}
		]
	}
}
```

```
// Example "./package.json" file: 

{
  "name": "react-essentials",
  "version": "1.0.0",
  "description": "React essential learning",
  "main": "index.js",
  "scripts": {
    "start": "./node_modules/.bin/webpack-dev-server"
  },
  "author": "Pushkar DK",
  "license": "ISC",
  "devDependencies": {
    "babel-cli": "^6.24.1",
    "babel-loader": "^6.2.5",
    "babel-preset-latest": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-0": "^6.24.1",
    "json-loader": "^0.5.7",
    "webpack": "^1.13.3",
    "webpack-dev-server": "^1.16.2"
  },
  "dependencies": {
    "react": "^15.6.1",
    "react-dom": "^15.6.1"
  }
}
```

___

#### Adding CSS to Webpack build:
We can use webpack to bundle css files as well.

Instead of supplying styles directly to the elements (via `style` attribute in JSX), we can define classes & IDs and declare the style rules for them in separate stylesheet(s).

**Steps:**
- Remove the `style` property from elements and give `className` that can be targeted from css. Ex:
```
// Taken from './src/lib.js':

export const hello = (
	<h1 id='title'
		className='hello'>
		{text.hello}
	</h1>
)
```
- Create **stylesheets** folder inside **src** to hold our css files. Let one file be `plain css` and the other `sass`:
```
// "./src/stylesheets/hello.css":

.hello {
	background-color: #dfe1e8;
	color: #444;
}

// "./src/stylesheets/goodbye.scss":

$bg-color: #cc0;
$text-color: #00c;

.goodbye {
	background-color: $bg-color;
	$text-color: $text-color;
}
```
- Next, we need to add the **CSS and SCSS loaders** to our webpack config file (There are at least 3 loaders that we can specify together):
```
// "./webpack.config.js":

{
    module: {
        ...
        loaders: [
            ...
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!autoprefixer-loader'
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
            }
        ]
        ...
    }
}
```
(The `sass` loader will need one more loader over plain css: `sass-loader`)
- Once the loaders have been defined, we need to install them via NPM as follows:
```
npm install --save-dev style-loader css-loader autoprefixer-loader sass-loader node-sass
```
(**Note:** `sass` requires one more package not declared as a loader to be installed and that is `node-sass`. Also, here we install every package together (same command) but we can install each separately as well.)
- **Lastly**, we have to include the stylesheets inside our js file, wherever the elements that have these classes are being created. (Note that we don't include the file inside `index.html`)
```
import './stylesheets/goodbye.scss'
import './stylesheets/hello.css'
```

**A Full Example:**
```
// "./src/lib.js":

import React from 'react'
import text from './titles.json'
import './stylesheets/goodbye.scss'
import './stylesheets/hello.css'

export const hello = (
	<h1 id='title'
		className='hello'>
		{text.hello}
	</h1>
)

export const goodbye = (
	<h1 id='title'
		className='goodbye'>
		{text.goodbye}
	</h1>
)
```

```
// "./src/stylesheets/hello.css":

.hello {
	background-color: #dfe1e8;
	color: #444;
}
```

```
// "./src/stylesheets/goodbye.css":

$bg-color: #ff0;
$text-color: #00f;

.goodbye {
	background-color: $bg-color;
	color: $text-color;
}
```

```
// "./webpack.config.js":

var webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		path: 'dist/assets',
		filename: 'bundle.js',
		publicPath: 'assets'
	},
	devServer: {
		inline: true,
		contentBase: './dist',
		port: 3000
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: ['babel-loader'],
				query: {
					presets: ['latest', 'react', 'stage-0']
				}
			},
			{
				test: /\.json$/,
				exclude: /(node_modules)/,
				loader: "json-loader"
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader!autoprefixer-loader'
			},
			{
				test: /\.scss$/,
				loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
			}
		]
	}
}
```

```
// "./src/index.js":

import React from 'react'
import { render } from 'react-dom'
import { hello, goodbye } from './lib'

render(
	<div>
		{hello}
		{goodbye}
	</div>,
	document.getElementById('react-container')
)
```

```
// "./dist/index.html":

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World with React</title>
</head>
<body>
    <div id="react-container"></div>
    <script type="text/javascript" src="assets/bundle.js"></script>
</body>
</html>
```

```
// "./package.json":

{
  "name": "react-essentials",
  "version": "1.0.0",
  "description": "React essential learning",
  "main": "index.js",
  "scripts": {
    "start": "./node_modules/.bin/webpack-dev-server"
  },
  "author": "Pushkar DK",
  "license": "ISC",
  "devDependencies": {
    "autoprefixer-loader": "^3.2.0",
    "babel-cli": "^6.24.1",
    "babel-loader": "^6.2.5",
    "babel-preset-latest": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "babel-preset-stage-0": "^6.24.1",
    "css-loader": "^0.28.4",
    "json-loader": "^0.5.7",
    "node-sass": "^4.5.3",
    "sass-loader": "^6.0.6",
    "style-loader": "^0.18.2",
    "webpack": "^1.13.3",
    "webpack-dev-server": "^1.16.2"
  },
  "dependencies": {
    "react": "^15.6.1",
    "react-dom": "^15.6.1"
  }
}
```

```
// "./src/titles.json":

{
	"hello": "Bonjour!",
	"goodbye": "Au Revoir"
}
```

## React Components

We can think of React interface as an **organized collection** of **Components**.

In React, we can create components with `React.createClass()` and save it as a variable or constant.

We need to supply an object `{}` to the function which will contain a `render` method. This `render` method has to return **JSX**.

Whatever components we create can be **export**ed from the file and **import**ed to the destination.

**Example** of a simple component (created within the `./src/components` folder: 
```
// "./src/components.js":

import React from 'react'
import '../stylesheets/workout.css'

export const WorkoutActivityCounter = React.createClass({
	render() {
		return (
			<div className="workout-count">
				<div className="workout-count-total">
					<span>5 days</span>
				</div>
				<div className="workout-count-morning">
					<span>3 days</span>
				</div>
				<div className="workout-count-evening">
					<span>2 days</span>
				</div>
			</div>
		)
	}
})
```

```
// "./src/index.js":

import React from 'react'
import { render } from 'react-dom'

import { WorkoutActivityCounter } from './components/WorkoutActivityCounter'

window.React = React

render(
	<WorkoutActivityCounter />,
	document.getElementById('react-container')
)
```

(**Note:** that it is important to use destructuring assignment while fetching exported variables in our imports)

### Adding Properties to Components
Instead of hardcoding values within our components, we can use properties.

Properties are just objects that contain values. We can add properties to a component during its inclusion like so:
```
render(
	<WorkoutActivityCounter total={19}
							morning={12}
							evening={7}
							goal={30} />,
	document.getElementById('react-container')
)
```

**Note:** for `numbers` & `booleans` we require `{}` around the property value but for `strings` we do not (Ex: `total="Nineteen"`)

We can **use the properties** inside the components like this (via the `this.props` object - again wrapped inside `{}`):
```
export const WorkoutActivityCounter = React.createClass({
	render() {
		return (
			<div className="workout-count">
				<div className="workout-count-total">
					<span>{this.props.total}</span>
					<span> Total days</span>
				</div>
				<div className="workout-count-morning">
					<span>{this.props.morning}</span>
					<span> Morning days</span>
				</div>
				<div className="workout-count-evening">
					<span>{this.props.evening}</span>
					<span> Evening days</span>
				</div>
				<div className="workout-count-goal">
					<span>{this.props.goal}</span>
					<span> Days is the goal</span>
				</div>
			</div>
		)
	}
})
```

### Adding Methods to Components

Inside our createClass (which has the `render` method), we can hve other methods too! (In ES6 class methods style).

Methods are used to add functionality to our component.

Syntax:
```
React.createClass({
    ...
    method1Name() {
    
    },
    method2Name() {
    
    },
    ...
    render() {
        return <someJSX>
    }
})
```

We can refer to the methods inside a component by using `this.methodName` (Notic that only for properties do we use `this.props.propName` but for methods we directly reference it from `this`).

Example:
```
export const WorkoutActivityCounter = React.createClass({
	decimalToPercent(decimal) {
		return (Math.floor(decimal * 100) + '%')
	},
	calcGoalProgress(total, goal) {
		return this.decimalToPercent(total/goal);
	},
	render() {
		return (
			<div className="workout-count">
				<div className="workout-count-total">
					<span>{this.props.total}</span>
					<span> Total days</span>
				</div>
				<div className="workout-count-morning">
					<span>{this.props.morning}</span>
					<span> Morning days</span>
				</div>
				<div className="workout-count-evening">
					<span>{this.props.evening}</span>
					<span> Evening days</span>
				</div>
				<div className="workout-count-goal">
					<span>{this.calcGoalProgress(this.props.total, this.props.goal)}</span>
					<span> Complete</span>
				</div>
			</div>
		)
	}
})

// Inside the render() method, 
// we use JS expressions {} to make calls 
// to component methods (by passing values) and 
// also can refer to component properties
```

### Using ES6 Classes for Components
With the advent of ES6, we can write a simpler React component as an ES6 class. This syntax is more elegant.

**Note:** ES6 classes start with the keyword `class` and they have methods in the enhanced object notation form, with **no commas** between their methods.

Defining a component as a class:
```
import React from 'react'
...
export class <className> extends React.Component {
    ...methods including render...
}
```

We can also use **destructuring assignment** to fetch only the `Component` property of `react` and extend that class (helps in preventing inclusion of unwanted code/data). Example:
```
import { Component } from 'react'
...
export class <className> extends Component {
    ...methods including render...
}
```

**A Full Example:**
```
import { Component } from 'react'
import '../stylesheets/workout.css'

export class WorkoutActivityCounter extends Component {
	decimalToPercent(decimal) {
		return (Math.floor(decimal * 100) + '%')
	}
	calcGoalProgress(total, goal) {
		return this.decimalToPercent(total/goal);
	}
	render() {
		return (
			<div className="workout-count">
				<div className="workout-count-total">
					<span>{this.props.total}</span>
					<span> Total days</span>
				</div>
				<div className="workout-count-morning">
					<span>{this.props.morning}</span>
					<span> Morning days</span>
				</div>
				<div className="workout-count-evening">
					<span>{this.props.evening}</span>
					<span> Evening days</span>
				</div>
				<div className="workout-count-goal">
					<span>{this.calcGoalProgress(this.props.total, this.props.goal)}</span>
					<span> Complete</span>
				</div>
			</div>
		)
	}
}
```

### Creating Stateless Functional Components
Apart from the `createClass` and ES6 `class` ways to create components, we can also create one using stateless functions.

Stateless functional components are functions that take in *property information* and *return JSX*.

Stateless functional components **do not** have access to `this`.

**Note:**
- We create stateless functional components uing the function syntax (preferrably "arrow functions").
- The function must return JSX. Whenever we are returning JSX, we can wrap it around in parenthese `()` - No need for a `return` statement nor the functions curly braces `{}` (see example).
- The function takes properties object passed to it from the parent classes (or wherever it is included and has props defined) as a parameter. 
- The function **cannot** have other **methods** within it. The other methods must be defined as separate functions.
- The function is **not** extending `React.Component`, hence inclusion of the same in the file is **not needed**.

Example:
```
import '../stylesheets/workout.css'

const decimalToPercent = (decimal) => {
	return (Math.floor(decimal * 100) + '%')
}
const calcGoalProgress = (total, goal) => {
	return decimalToPercent(total / goal);
}

export const WorkoutActivityCounter = (props) => (
	<div className="workout-count">
		<div className="workout-count-total">
			<span>{props.total}</span>
			<span> Total days</span>
		</div>
		<div className="workout-count-morning">
			<span>{props.morning}</span>
			<span> Morning days</span>
		</div>
		<div className="workout-count-evening">
			<span>{props.evening}</span>
			<span> Evening days</span>
		</div>
		<div className="workout-count-goal">
			<span>{calcGoalProgress(props.total, props.goal)}</span>
			<span> Complete</span>
		</div>
	</div>
)

// Note the use of parentheses () inside the arrow function. 
// This is valid syntax as long as the only thing within () is JSX. 
// Syntax is the same as returning JSX from the function.
```

**Note:** We can also use **destructuring** of the properties object in the formal parameters section of the function to receive only those properties that we intend to render from the component. Example:
```
export const WorkoutActivityCounter = ({total, morning, evening, goal}) => (
	<div className="workout-count">
		<div className="workout-count-total">
			<span>{total}</span>
			<span> Total days</span>
		</div>
		<div className="workout-count-morning">
			<span>{morning}</span>
			<span> Morning days</span>
		</div>
		<div className="workout-count-evening">
			<span>{evening}</span>
			<span> Evening days</span>
		</div>
		<div className="workout-count-goal">
			<span>{calcGoalProgress(total, goal)}</span>
			<span> Complete</span>
		</div>
	</div>
)
```

**Note:**
- It may be a good idea to use stateless functions.
- React team has hinted that it might offer performance benefits over the other two methods of creating components.
- It is a very simple way of creating components and it does not have state. So unless state is required, we can stick to these functionsfor components.

### `react-icons`: Using a community tool:

**React is a LIBRARY and not a framework**
- Libraries are intentionally pretty small
- When we don't find what we need in React, there is a huge probability that someone else has already built it for you.
- `react-icons` is one such tool that is built by the community.

Read Usage/Documentation for `react-icons`: https://gorangajic.github.io/react-icons/fa.html

Installing `react-icons`:
```
npm install --save react-icons
```

Using/Importing a react icon (example):
```
import Terrain from 'react-icons/lib/md/terrain'
```
We can import only what we wish to use (instead of importing the full set of icons). In this case, we import 'react-icons/lib/md/terrain'.

`react-icons` are basically *components** so you may use them within other components. Example:
```
...
<div className="workout-count-goal">
    <span><Terrain /></span>
    <span>{calcGoalProgress(total, goal)}</span>
    <span> Complete</span>
</div>
...
```
