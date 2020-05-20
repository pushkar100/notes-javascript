# React Notes

**Credits**: 

1. [Frontend masters courses](https://frontendmasters.com/learn/react/) (Brian Holt, Steve Kinney)
2. Udemy Courses (Stephen Grider)
3. React and related documentation (important!)

## Basics

You need **two** libraries to make a react application:

1. **`react`**: The library containing the core logic for any react app (no UI).
2. **`react-dom`**: The library (bigger than react) that takes the output of the react library and puts it into the DOM

**First steps**:

1. You write a **"component"** using **React**. It is an entity that eventually outputs some HTML
2. The component is a function that *returns something*.
3. This component (function) is passed to **ReactDOM** along with the DOM element where we want to render it

```jsx
import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  return React.createElement("h1", {}, "Hello World");
};

ReactDOM.render(React.createElement(App), document.getElementById("root"));
```

The result is that `<h1>Hello world</h1>` gets rendered inside the *#root* element of the DOM.

**What is `React.createElement()`?**:

- It creates a React component
- The first argument: The HTML tag (or another component)
- The second argument: We can send additional attributes / properties to the component. It is an object known as **props** and the properties will be the attributes of the created component.
- The third argument: Children of the component/tag. These can be normal html text or other created elements (either a tag or another component)
- **Note**: In order to pass in multiple children, we simply add more arguments (*variable-arity)* with `React.createElement()`. Alternatively, you may define all of them within an array as well.

**What is `ReactDOM.render()`?**:

- Once the component has been defined (as a function and it is meant to return a React created element), we want to render it to the DOM (i.e write the generated HTML to the page)
- We have to first create an element out of the component we have just created. Therefore, this is our first argument
- Next, we want to target the DOM element which will be used to render our component. This is our second argument.
- **Note**: The targeted DOM's entire HTML is *wiped off!* when our component renders (try it out by placing some HTML within it)

**How can we extend our component?**:

- A component can create elements out of other components inside itself
- The third argument that was passed into `createElement` can also be another component
- Now, we have a *hierarchy* of components forming our application

```react
const Pushkar = () => {
  return React.createElement("span", {}, "Pushkar");
};

const App = () => {
  return React.createElement(
    "h1", 
    {}, 
    "Hello ", 
    React.createElement(Pushkar) // We can create elements out of other components too!
    // Note: Not passing props & children assumes empty props & no children!
  );
  // Alternate syntax for multiple children:
  // return React.createElement("h1", {}, ["Hello ", React.createElement(Pushkar)]);
};

ReactDOM.render(React.createElement(App), document.getElementById("root"));
```

The above snippet outputs `Hello Pushkar` in our HTML.

**How can we customize our component?**:

- Since our components are essentially functions and we can pass in arguments.
- The **props** object that is defined while creating a component becomes the argument that is passed in to our component function.

```react
const People = ({ name }) => {
  // Destructuring the argument to fetch individual props
  return React.createElement("span", {}, name);
};

const App = () => {
  return React.createElement(
    "h1",
    {},
    "Hello ",
    React.createElement(People, { name: "Pushkar" }), // Sending props to customize People
    " ",
    React.createElement(People, { name: "Rahul" }) // Sending props to customize People
  );
};

ReactDOM.render(React.createElement(App), document.getElementById("root"));

```

The above snippet outputs `Hello Pushkar Rahul`

**Benefits of React so far**:

1. ***Composability***: Using components to build more complex components (Ex: People inside App)
2. ***Reusability***: Reuse a component in more places (Ex: Same button component in many Form components)
3. ***Customizability***: Send in props into a component and make its render behave according to prop values
4. ***Structure***: By composing components (nesting), we are giving structure to our application (A *tree*)

**Drawback so far**:

1. We have replaced simple HTML with ***functions to generate our HTML*** and it looks ugly. It makes our code quite complex in terms of readability.

**Note**:

- By *convention*, we use capitalized identifiers for our components (Ex: `App`, `People`, ...)

## React Setup

**Steps**:

1. *Setup a repository* for our project (say, on Github). Select the appropriate project type to generate the corresponding `README.md` & `.gitignore` files. For example, our `.gitignore` can look like this:

   ```shell
   # Absolutely must ignore files:
   node_modules/
   .DS_Store # mac creates this file
   # Files and folders generated from our repo that we will want to ignore:
   .env
   .cache/
   dist/
   coverage/ 
   .vscode/
   ```

2. *Clone the repository* using `git clone <link-to-repo-cloning>`. Switch to the project folder locally.

3. *Setup an npm project* using `npm init` (pass `-y` to not answer the questions)

4. *(Optional) Install prettier* to ***format*** your code. 

   - Use it as a dev dependency in your project with `npm i -D prettier`
   - Install the corresponding extension for your editor. Ex: `Prettier` extension for VSCode
   - Enabling prettier as the default formatter for javascript files in VSCode:
     - `"[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" }`
   - Enable your VSCode formatter (prettier) to format code on saving the file:
     - `"[javascript]": { "editor.formatOnSave": true }`
   - Add an *NPM script* to explicitly run a format command with `npm run format`
     - `"scripts": { "format": "prettier --write \"src/**/*.{js,jsx}\" }`
     - This runs the formatter on every `js` or `jsx` file inside our `src` folder (recursively)
     - You need `\"` in order to allow prettier to resolve the string instead of your shell
     - The `--write` option writes back the formatted code into the corresponding files. Without it, the command simply outputs the formatted code onto the terminal
   - Add a configuration file to your project to *customize* prettier with `.prettierrc`
     - Inside this config, use the default config by just having an empty json `{}`. (Note: Customizable!)
     - Inside your editor, make sure that *prettier runs only when a config file exists* for the project. In VSCode settings, search for "Prettier" and turn on `Prettier: Require Config` 

5. *(Optional) Install eslint* to ***lint*** your code.

   - Use it as a dev dependency in your project with `npm i -D eslint eslint-config-prettier`

     - The second package is used to make prettier work smoothly with eslint

   - Add a config file with `.eslintrc.<ext>`. The extensions can be json, yaml, js, etc. It is better to use `.eslintrc.json`

   - Setup the config file:

     - Add the bare minimum collection of rules with `eslint:recommended`. Since we are using prettier, add rules for allowing `prettier` formatting and `prettier/react` formatting

       ```json
       {  "extends": ["eslint:recommended", "prettier", "prettier/react"] }
       ```

     - We have a field for plugins (Usually contains polyfill plugins for features still in stage 3 and below)

       ```json
       { "plugins": [] }
       ```

     - Add *parserOptions*. Tell it which ES version to understand (ES2015, ES2016, ...).Mention "module" if you are using import/export syntax, and also allow it to understand JSX

       ```json
       {
         "parserOptions": {
           "ecmaVersion": 2016,
           "sourceType": "module",
           "ecmaFeatures": {
             "jsx": true
           }
         }
       }
       ```

     - Specify the target environments. Allow ES6 features (Ex: async/await), target the browser (Ex: allow setTimeout, window, etc), and also target node (Ex: allow require, path, etc)

       ```json
       {
       	"env": {
           "es6": true,
           "browser": true,
           "node": true
         }
       }
       ```

   - Add an *NPM script* to explicitly run a lint command with `npm run lint`

     - `"scripts": { "lint": "eslint \"src/**/*.{js,jsx}\" --quiet" }`
     - Runs the linter on every `js` & `jsx` file inside `src` (recursively)
     - You need `\"` in order to allow eslint to resolve the string instead of your shell
     - The option `--quiet` actually removes some of the console output *noise* from this linter command

   - Install the corresponding extension for your editor. Ex: `ESLint` extension for VSCode

     - You will automatically see linter errors (red underlines) in your code where the linter has detected errors. Hovering over it gives you more details
     - Enable in VSCode settings: `Eslint › Code Actions On Save: Mode` to `all` (Lints file on save)

   - Make ESLint work with ***React*** & ***JSX*** & ***Babel***:

     - Install 4 dependencies:
       - `npm i -D babel-eslint eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react`
     - `babel-eslint`: Takes help of babel to understand JSX
     - `eslint-plugin-import`: Understand the import statements
     - `eslint-plugin-jsx-a11y`: Accessibility features for JSX (Ex: Don't make a div take wrong attr)
     - `eslint-plugin-react`: Some additional react specific linting rules

   - Add the plugins and rules to ESLint config for it to work with React/JSX/Babel:

     ```json
     {  
       "extends": [ 
       	/* ... */ ,
       	"plugin:import/errors",
         "plugin:react/recommended",
         "plugin:jsx-a11y/recommended", 
         /* make sure "prettier" rules come last! */
       ],
       plugins: [
         /* ... */
         "react", 
         "import", 
         "jsx-a11y"
         /* ... */
       ],
       rules: [
         /* Optional: */
         "react/prop-types": 0, // Turns off propTypes (using typescript? don't need propTypes)
         "no-console": 1 // warning
       ],
       "settings": {
         "react": {
           "version": "detect" /* Figure out the react from package.json */
         }
       }
     }
     ```

   - Update rules for the new React **hooks**: Offical rules by react team for writing hooks

     - Install the eslint plugin first: `npm i -D eslint-plugin-react-hooks`

     ```json
     // .eslintrc.json
     {
       "plugins": [/*... */, "react-hooks"],
       rules: {
         /* ... */
         "react-hooks/rules-of-hooks": "error", // or you can use 2 for error
         "react-hooks/exhaustive-deps": "warn", // or you can use 1 for warning
         /* ... */
       }
     }
     ```

     

6. *Setup a module bundler*:

   1. ***Webpack***:

      - Run `npm i -D webpack webpack-cli`

      - Check webpack notes on how to setup webpack. No specific react related loaders/plugin needed (unless you are doing HMR for React app - google *"React Hot Loader"* in that case)

      - Check babel notes on how to setup babel & integrate it with webpack. Short notes:

        ```json
        // JSON with comments (remove comments when using):
        // .babelrc
        {
          "presets": [ 
            "react", // React for JSX transpiling
            ["env", {
              "targets": { // Target specific browser and its versions
                "browsers": "last 2 versions",
                // "chrome": 50
              },
              "loose": true, // Using new features in only common ways (exclude the transpilation code for these features that are only needed in edge cases)
              "modules": false // Do not transpile ES6 import/export // (Lets webpack handle it)
            }], // 'env' is a collection of plugins for transpiling to browser 
          ], 
          ""
        }
        ```

        

   2. ***Parcel*** (alternative to webpack):

      - Run `npm i -D parcel-bundler`
      - Add an *NPM script* to run parcel (`"dev": "parcel src/index.html`). It reads the script (our react app code) that we are loading and bundles everything for us on the fly
      - It is much simpler than Webpack. Point it to your HTML file and it figures out everything for you. Understanding extensions, HMR, WDS, etc are all done out-of-the-box for you
      - However, it is not as powerful as webpack and you cannot do a lot of the crazy things that webpack allows you to do
      - It uses babel under the hood whereas in webpack, we have to configure babel

7. *Install **React** & **ReactDOM***:

   - Remove any scripts from CDN in your HTML that were used to fetch React & ReactDOM
   - Add both the packages as production dependencies: `npm i react react-dom`
   - Add `npm intellisense` VSCode extension in order to *autocomplete* while importing your NPM packages in the code
   - **Import** **React** & **ReactDOM** in your modules. 
     - `import React from "react"`
     - `import ReactDOM from "react-dom"`

## Best Practice 

**Move each of the components into its own file!**

We can do this manually or highlight a component function/class and select the *lightbulb* (intellisense) from VSCode and select the `move to a new file` option (it takes care of file creation, import updation, and so on)

```react
import React from 'react'
import ReactDOM from 'react-dom'
import childComponent from './path/to/child'

// Rest of our code ...
```

## JSX

**What is JSX?**

- JSX is an XML/HTML-like syntax used by React that extends ECMAScript so that XML/HTML-like text can co-exist with JavaScript/React code. 
- The syntax is intended to be used by preprocessors (i.e., transpilers like ***Babel***) to transform HTML-like text found in JavaScript files into standard JavaScript objects that a JavaScript engine will parse.

**Why do we need it?**

Writing React methods such as `createElement` everytime is ***cumbersome***. We also have to tax our mind while trying to figure out the nesting of our HTML (not as simple as writing HTML markup itself)

Therefore, we will use JSX and rely on our setup for its transpiling by *babel*.

**How do we specify components in JSX?**

Use them just like HTML tags with props being the attributes. If they don't have children, they will be self-closing tags (`<CompName />` and the `/` is mandatory in JSX while it is optional in pure HTML)

Therefore `React.createElement(App)` becomes simply `<App />`!

**How do we access variables (such as props) inside JSX?**

We use curly braces **`{}`** containing expressions to interpolate their values into our JSX (Ex: `{1 + 1}` or `{value}` where `value` is some variable identifier)

```react
import React from "react";
import ReactDOM from "react-dom";

const People = ({ name }) => {
  return <span>{name}</span>;
};

const App = () => {
  return ( // Multiline ? Use ()
    <h1> <!-- Only one top level element -->
      Hello <People name="Pushkar" /> <People name="Rahul" />
    </h1>
  );
};

ReactDOM.render(React.createElement(App), document.getElementById("root"));
```

**Note**:

- Eventually, we get `React.createElement` in our transpiled code. JSX is just a syntax for the user to make it easier for development. But, in the end, we code that is understood by the JS environment is JS alone and not JSX. Hence, the transpiler converts it to pure JS. 
- We can *only return one top-level element/component* from our JSX (wrap it in `()` when you want to write markup on multiple lines). The reason for this is that we can only return one `React.createElement(tag)` output.

- Enabling emmet autocomplete for JSX (in `.js` files, works out-of-the-box for `.jsx`): 

  ```json
  {
    "emmet.includeLanguages": {
      "javascript": "javascriptreact"
    }
  }
  ```

- **Advantages of JSX over HTML**:
  - JSX is a template which we can use inside our javascript. HTML is *declarative*.
  - JSX is *imperative* & *dynamic* , where we pass in values at runtime (because it is, in fact, javascript under the hood). This makes JSX incredibly powerful
- **Only expressions can be used inside JSX (& not statements) for dynamic data**:
  - Use ***ternary operator `(?:)`*** instead of an `if` statement (Ex: `{ a ? b : c}`)
  - Use ***Array.prototype.map*** to loop over array items instead of `for` statement (Ex: `{list.map(x => x + 1)}`)
- **Writing class names in JSX**:
  
  - Since `class` is a reserved keyword in javascript, you will replace it with **`className`** inside your JSX (The corresponding generated HTML will contain 'class' as the attribute itself)
- **Writing labels in a form in JSX**:
  
  - `for` is a reserved keyword in javascript. We will use **`htmlFor`** instead. Ex: `<label htmlFor="..." />`

## Two-way data binding: Common beginner problem

One of the first problems that beginners to React face is the ***problem of updating inputs***!

**What is the problem?**

The components in React *re-render* on updates from the business logic: When the **"state"** changes. Consider this scenario: You have an input that has a default javascript value as the input value. You try to change the input on the browser as a user but you cannot no matter how hard or fast you type into it!

```react
const App = () => {
  const value = 'Bangalore'
  return <input type="text" value={value} />;
};
```

In the developer tools of the browser, React even gives us a warning about this ("You provided a `value` prop to a form field without an `onChange` handler").

**Why does this happen?**

Whenever a component has to update, it updates with the values that are used inside the component at that moment. 

In the above snippet, the following steps occur:

1. On trying to change the input, React re-renders the component
2. The value to which the input box changed was never recorded or passed along implicitly
3. At the time of re-render, the value for the input is still the constant `value` defined in the component
4. The component re-renders with the same value as before, thereby displaying no change to the frustrated user!

**How do we fix this?**

We fix it with two things: 

1. Attaching event handlers (i.e normal DOM API for events on elements)
2. Adding **state** for data that forces re-render (updating normal variables within the component does not cause a re-render) of the component

Therefore, on DOM events (but not limited to just that), we can change the state of the component, and the component re-renders. If the state value is bound to the input value in the above example, the re-rendered input will have the new value now.

*Functional components by default **do not have state** and this problem used to be fixed by converting them to **class components**. We do not need to do that now. Using "**hooks**", we can add state to functional components as well.*

**Such things are automatic in other frameworks. Why is it hard in React?**

React tries to be minimal and does not provide things like directives, etc. The onus is on the developer to figure out exactly what functionality he wants in the app. This might require more re-wiring (more code) but is actually very **explicit** and gives tremendous **control** and **flexibility** to the developer.

## Hooks

We know that functional components do not have state by default and you need class components for state.

Since **React v16.8**, we have access to additional named exports called **hooks**. These allow us to latch on to many events. The most common of these hooks is **`useState`**. Using this hook, we can have ***stateful functional components!***

There are many more reasons to use functions + hooks over classes (explored later)

### `useState` Hook

**Example of state: Solving the two-way data-binding problem with hooks**

- `useState(<default>)` is used inside a function and it receives a default value
- The output is an array: The first element is the current value of th state (same as the default value if it is the first time). The second element is a method used to update the state. Both can be destructured (common pattern)
- Whenever we want to update our state, we will call the method used to update it (& the component will re-render if it needs to)

```react
import React, { useState } from "react";

const App = () => {
  const [value, setValue] = useState("Bangalore");
  return (
    <input type="text" value={value} onChange={e => setValue(e.target.value)} />
  );
};
// Now we are able to update our input box in the browser!
```

**Best practices for hooks**

*Do not place hooks in conditionals.* Ex: `if (<something>) { const [val, setVal] = useState(0) }`. The reason is that we can have multiple states and each state is ***maintained internally by its order***.

Therefore, if a state is not executed the first time but on subsequent times, its position will still be after all the state hooks that were not in a conditional. React updates the hooks based on the order. So, the wrong hook could get the wrong update because of such things. Unpredictable results, basically.

For similar reasons, *do not place hooks in looping constructs too!* (while, for, etc)

We can identify such attempts by updating our ESLint config: 

- `npm i -D eslint-plugin-react-hooks`
- Add the rules and plugins for hooks as mentioned in the earlier eslint setup section 

### Custom Hooks

We can extend hooks to extract out the logic from our component and provide pre-defined functionality that uses hooks.

For example, we can create generic hooks that work with input elements, return child components that internally use a hook, etc. The possibilities are endless. Let's take a look at a simple custom hook:

```react
import React, { useState } from "react";

const customInputHook = initialValue => {
  const [inputValue, setInputValue] = useState(initialValue);
  const resetState = () => setInputValue(initialValue);
  const attributes = {
    value: inputValue,
    onChange: e => setInputValue(e.target.value)
  };
  return [attributes, resetState]; // We could literally return anything (even a component)
};

const App = () => {
  const [inputAttrs, resetInput] = customInputHook("Bangalore");
  return (
    <div>
      <input type="text" {...inputAttrs} />
      <button onClick={resetInput}>Reset</button>
    </div>
  );
};
```

### `useEffect` hook

It is a hook that is meant to ***run after a render***. It is an functional alternative to the class component lifecycle - it replaces all three class methods: `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`

Syntax: `useEffect(callback, [dependencies])`

**How `useEffect` works**:

1. Component function is executed
2. When `useEffect` is run, the callback to it is **"scheduled"** (to be run later)
3. The component is **rendered first** 
4. The all the `useEffects` (Can have multiple) are executed
5. `useEffect` callback execution rules:
   1. If it is after the first render, the callback is executed
   2. For subsequent renders, it checks the *dependencies* (an array). If at least one of them have changed, the callback is executed

**When do we use `useEffect`?**:

It is usually used for external activity like API data fetching, other asynchronous tasks, tasks to be performed on user actions that change the component state, and so on

```react
import React, { useState, useEffect } from "react";

const App = () => {
  const [animals, setAnimals] = useState([]);
  const [breeds, setBreeds] = useState([]);

  const onAnimalSelect = e => {
    mockAPI.getBreeds(e.target.value).then(breeds => setBreeds(breeds));
  };

  // useEffects are "scheduled" to be run only after a render
  // (1st time & based on changing dependencies the subsequent times)

  // useEffect is run after 1st render & any time the dependencies update:
  // This one will run only once (after 1st render as 'animals' does not change ever)
  useEffect(() => {
    mockAPI.getAnimals().then(animals => setAnimals(animals));
  }, [animals]);

  // This effect will run after 1st render
  // plus every time breeds changes
  useEffect(() => {
    console.log("NEW BREEDS LOADED");
  }, [breeds]);

  return (
    <div>
      Animals
      {animals.map(animal => (
        <button key={animal} value={animal} onClick={onAnimalSelect}>
          {animal}
        </button>
      ))}
      {breeds.map(breed => (
        <div key={breed}>{breed}</div>
      ))}
    </div>
  );
};
```

**Running `useEffect` only once (Similar to `ComponentDidMount`)**

Define an empty dependencies array: `useEffect(() => { /*...*/}, [])`

**Running `useEffect` everytime (Similar to `ComponentDidUpdate` but without conditions)**

Define nothing in the dependencies argument (blank): `useEffect(() => { /*...*/})` (Very bad for performance! Can choke your app - infinite loop even)

**Which dependencies must be added?**

Any dependency (basically a state value) that is used inside the `useEffect` callback as a *readable* or *executable* value is added as a dependency (Ex: `animals` in the above snippet)

For this reason, linter rules even point out that that `useState` method that sets the state must also be added to the list if the state that it sets is a dependency in the list

## React optimizations

- If you are using development setup through your bundler then `NODE_ENV=development`. When this is the case, React bundle is quite big. But, when we build for production with `NODE_ENV=production` then the excess weight is stripped off the bundle.
- React updates very quickly. There are many new features that come with new releases and many that get deprecated. React introduced a wrapper component  **`<React.StrictMode></React.StrictMode>`** that can be wrapped around your app or newer components of the app such that *if you are using deprecated react methods anywhere inside of it, React will throw an error* (Helps keep parts of your code up to date)
- React provides us chrome and firefox extensions called **"React Dev Tools"** so that we can inspect our components just like we inspect our elements. It has additional features too.

## One-way data flow in React

The React components follow a *hierarchy*.

We write our main app component which has one or more child components. Each of these child components maybe composed of one or more components themselves, and so on. There is *nesting* involved.

*We can pass in data to our child components via props but not the other way around*. This might seem like a limitation but the one-way data flow is actually beneficial for **debugging**. If an error occurs, we know exactly where it started from i.e The children of a component could not have been the cause for its failure.

**How do children communicate with the parent?**

We pass in callback functions defined on the parent component to a child via the props (i.e one of the props to the child is a reference to the method on the parent). The child then invokes this from within itself, triggering the necessary process on the parent.

## Client-side routing

With a multi page application (MPA), the browser takes care of routing when you click on links. The new page loads with all the necessary HTML, CSS, and JS.

When you have a single page application (SPA), you are not shifting HTML pages. Everything you wish to do has to be done from the app on that single page that you have built. In this case, the developer has to manage routing.

**Routing involves**:

1. Loading different components (Swapping them out)
2. Updating the URL
3. Other accessibility features, SEO, and so on.

**Common tools used for routing are**:

1. ***React Router***
2. ***Reach Router***

### Reach Router

Basic usage:

```react
import { Router, Link } from '@reach/router'

/* ... */

const App = () => {
  /* ... */
  return (
    <div>
      <Header>
        <Link to="/">Home Page</Link> <!-- Creates an 'a' link and handles route to path -->
      </Header>
      <Router>
        <Component1 path="/" />
        <Component1 path="/detail/:id" /> <!-- :id is a path variable passed in props -->
        <Component1 path="/about" />
        <!-- ... -->
      </Router>
    </div>
  )
  /* ... */
}
```

### React Router

```react
// Basic usage is very similar to Reach Router
```

## Class components

Earlier (before hooks), if we needed ***state*** in our functional components, it was not possible. The functional components were *pure* and *dumb*; Renders whenever different props are passed to it.

If we need *state* and *lifecycle* methods, we had to convert our apps to classes. Let's see how they work.

**Simple class component**:

```react
import React, { Component } from "react";
import ReactDOM from "react-dom";

class App extends Component {
  render() {
    return <h1>Hello World!</h1>;
  }
}

ReactDOM.render(<App />, document.getElementById("root"))
```

- React class components must extend `React.Component`
- It is *mandatory* to have a `render()` method inside it

**How do we access props, add state, and set the state?**

- The constructor to the class receives the props. We have to call `super(props)` before doing anything with the props inside the constructor (throws errors otherwise). Reason: The `Component` class that has been extended needs to process the props first
- We can define our state using `this.state` in the constructor which is an object! The keys will be the individual state values
- Every time we want to update our state, we call `this.setState()` and pass it an object. This method is implicitly available since we extend the `Component` class of React. The method does a ***shallow merge*** of previous state with the new state.
- We refer to the props using `this.props` inside our class methods (constructor is the only exception)

```react
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  onClickHandler() {
    this.setState({
      count: this.state.count + 1
    })
  };

  render() {
    return (
      <div>
        <div>{this.state.count}</div>
        <button onClick={() => this.onClickHandler()}>Increment</button>
      </div>
    );
  }
}
```

**Deriving state directly from props**

Use a `static` class method called `getDerivedStateFromProps` in order to directly map your props to the state. This helps to add to your state those things that are ***computable*** from the props.

```react
const App = () => {
  const initialCount = 10;
  return (
    <div>
      <Button count={initialCount} />
    </div>
  );
};

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props) {
    return { count: props.count };
  }

  render() {
    return <div>Count: {this.state.count}</div>;
  }
}
```

### Binding methods in our class (event handling)

There are many times when we are required to *handle events* from our DOM. We can define methods in our class that act as the callback functions to these events.

There is one problem. We use these listeners to update the state. However, the state is a property on the context of the method which is the object the class instantiates. Therefore, the state & setState are accessible via the `this` keyword. 

When the event listeners from the DOM get triggered, they have a different context based on how the event mechanism calls them. The component class object's context is no longer the `this` keyword for the method when it runs.

We have a few workarounds to help ***preserve the context*** to the class (so that it the `this` value is predictable and locked down to the class i.e its object)

1. Use arrow functions in the event handlers and from there call the actual method:

   ```react
   <button onClick={(e) => this.onClickHandler(e)}>Increment</button>
   ```

2. Bind all the class methods in the constructor to the `this` keyword (when the bind happens, the class is the context and it will not change afterwards)

   ```react
   constructor(props) {
     // ...
     // Method bindings:
     this.onClickHandler = this.onClickHandler.bind(this);
   }
   ```

   ```react
   <button onClick={this.onClickHandler}>Increment</button>
   ```

3. Add a babel proposal plugin to classes called **`@babel/plugin-proposal-class-properties`**:

   - It allows us to define instance properties outside the constructor (internally still the same)

   ```react
   class App extends Component {
     state = { count: 0 }; // Same as this.state = {...} within the constructor
   
     onClickHandler = () => { // Same as this.onClickHandler except that it is () => {}
       // Arrow functions do not alter state: Take from parent context 
       // Parent context will always be the class in this case
       this.setState({
         count: this.state.count + 1
       });
     };
   
     render() {
       return (
         <div>
           <div>Count: {this.state.count}</div>
           <button onClick={this.onClickHandler}>Increment</button>
         </div>
       );
     }
   }
   ```

**Note**: Do *not* do the following:

```react
<button onClick={this.onClickHandler.bind(this)}>Increment</button>
```

Bind methods used to be very slow (in earlier browsers). So, everytime you render, you end up invoking the bind method causing a significant damage to render performance. Although the newer browsers have made bind pretty fast and it does not matter much, we still do not use this pattern in order to not have performance issues on older browsers that are still being used.

### Common lifecycle methods

- `componentDidMount()`: Runs after the first render and only once. Ideally you would like to place the heavy data fetching calls such as API requests in this method so that the *DOM renders first* (non-blocking) and then updates once the data becomes available.
- `componentDidUpdate()`: Called immediately when an update occurs (a prop or state changes). For example, when the parent changes the props sent to it. First argument is the *previous props* and second argument is the *previous state*. We can use this method to *conditionally do some tasks* (including state update) by comparing the props and states that have changed after updating
- `componentWillUnmount()`: Invoked whenever the component is about to unmount. Use this to do clean up tasks such as removing event listeners, timer functions, etc.

## Error boundaries

Whenever we have an unknown error (exception) in our class component that is not caught, our app can *crash*! In order to prevent something like that, we wrap our components that could error out inside an error boundary component.

- The error boundary component can be used to handle errors in the children that can be from external source such as API calls, SDK invocations, etc
- We can use `componentDidCatch()` to view the *error* (1st arg) and related *info* (2nd arg). In this method, we usually log the erro to a logger service such as sentry/trackJS/azure monitor...
- The `static` method `getDerivedStateFromError()` can be used to update our state (For example, update a state key that indicates an error)
- Error boundary components *can detect errors only inside children* (not itself). Therefore, it is commonly used as:
  - A wrapper component which renders its children when there are no errors (else shows an error message and does other things)
  - A pass through component that does not utilize the props intended for the child component(s). We can make a functional component that accepts the props, render the error boundary and within it the actual component that we want to protect from errors, and to it we shall pass the props (not to error boundary)
- **Note**: Children inside a component can be accessed via `this.props.children`

```react
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Usually send it to an error logging service
    console.log("Caught error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>Component errored out. Go back</div>;
    }

    return this.props.children;
  }
}
```

```react
class Greeting extends Component {
  componentDidMount() {
    throw new ReferenceError(); // will crash app without error boundary
  }
  render() {
    return <h1>{this.props.greeting}</h1>;
  }
}

const GreetingWithErrorBoundary = props => (
  <ErrorBoundary>
    <Greeting {...props} />
  </ErrorBoundary>
); // Usually what you would export from an error boundary wrapped component module
```

```react
const App = () => {
  return <GreetingWithErrorBoundary greeting="Hello!" />;
};
```

**Note**: WE CANNOT USE ERROR BOUNDARIES IN FUNCTIONAL COMPONENTS (EVEN IF WE HAVE *HOOKS*). IT IS LIMITED TO CLASS COMPONENTS

## Context API

Context provides a way to pass data through the component tree without having to pass props down manually at every level.

Context is primarily used when some data needs to be accessible by many components at different nesting levels. Apply it sparingly because it makes component reuse more difficult.

- Create a context in a higher order component with `React.createContext(defaultValue)`
- Wrap a context provider within a component using `<MyContext.Provider value={/*...*/}>`
- The default value is used if the Provider is not found for a component in the parent chain 
- The `contextType` property on a class (Not an object) can be assigned the context that we have created. This lets you consume the nearest current value of that Context type using `this.context`. 
- How do we access context insde functional components? By wrapping the JSX of the component inside `<ContextIdentifier.Consumer></ContextIdentifier.Consumer>`. Inside it, we can have a callback expression that receives the context `value` *(Weird syntax!)*. 

```react
const ColorContext = React.createContext("#111"); // Default applied if Provider with value is not present

const App = () => {
  return (
    <ColorContext.Provider value="#BADA55">
      {/* Wrap component subtree within the context's provider */}
      <Intermediate />
    </ColorContext.Provider>
  );
};

/* Intermediate components do not have to scan the context */
const Intermediate = () => {
  return (
    <div>
      <ComponentA />
      <ComponentB />
    </div>
  );
};

/* Class component */
class ComponentA extends Component {
  // Alternate: `static contextType = ColorContext` // needs class properties babel plugin
  render() {
    return <div style={{ color: this.context }}>ComponentA</div>;
  }
}
Component.contextType = ColorContext;

/* Functional component */
const ComponentB = () => {
  return (
    <ColorContext.Consumer>
      {value => <div style={{ color: value }}>ComponentB</div>}
    </ColorContext.Consumer>
  );
};
```

**Alternatives to Context**: 

1. Pass down props through each intermediate component, one by one
2. Create a component or JSX (created in ancestor element) and pass the element itself through all the intermediaries. It will finally be rendered where it has to be. This pattern avoids sending in multiple props each time through all levels (instead, we send the whole component down)

## Portals

Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component. You might want to add modals such as confirmation dialogs, error message displays, hovercards, tooltips, etc.

**Note**: It is defined on the **ReactDOM** (not React)

```react
ReactDOM.createPortal(child, container)
```

```react
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

The first argument (`child`) is any renderable React child, such as an element, string, or fragment. The second argument (`container`) is a DOM element.

- Even though a portal can be anywhere in the DOM tree, it behaves like a *normal React child* in every other way. 
- Features like context work exactly the same regardless of whether the child is a portal, as the portal still exists in the React tree regardless of position in the DOM tree.
- This includes *event bubbling*. An event fired from inside a portal will propagate to ancestors in the containing React tree, even if those elements are not ancestors in the DOM tree.

Let's create a wrapper component called `Modal` which takes the child components and inserts into the portal. We have a DOM into which we insert another DOM element from the `Modal` when the component mounts.

```react
import React, { Component } from "react";
import ReactDOM from "react-dom";

const appRoot = document.getElementById("root");
const portalRoot = document.getElementById("portal");

const App = () => {
  const onClickHandler = () => {
    console.log("SomeComponent was clicked");
  };
  return (
    <div>
      <Modal>
        <SomeComponent clickHandler={onClickHandler} />
      </Modal>
    </div>
  );
};

class Modal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }
  componentDidMount() {
    portalRoot.appendChild(this.el);
  }
  componentWillUnmount() {
    portalRoot.removeChild(this.el);
  }
  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

const SomeComponent = ({ clickHandler }) => {
  return <div onClick={clickHandler}>SomeComponent</div>;
};

ReactDOM.render(<App />, appRoot);
```


