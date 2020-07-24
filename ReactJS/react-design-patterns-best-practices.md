# React Design Patterns & Best Practices

[Book: React Design Patterns and Best Practices - **Bertoli, Michele**](https://www.amazon.com/React-Design-Patterns-Best-Practices-ebook/dp/B01LFAN88E)

## Declarative programming

React is **powerful** because it employs declarative programming

**Imperative vs Declarative**

- Imperative: A way of **describing how things work**
- Declarative: A way **describing what you want to achieve**

```js
// Imperative
const toLowerCase = input => { 
  const output = [] 
  for (let i = 0; i < input.length; i++) { 
    output.push(input[i].toLowerCase()) 
  } 
  return output 
}
```

```js
// Declarative
const toLowerCase = input => input.map(value => value.toLowerCase())
```

Imperative is:

1. Less elegant
2. Requires more effort to be understood

Declarative is:

1. Terser and hence, elegant
2. Easier to read

Therefore, declarative programming is great for **maintainability of large codebases**

**React is declarative**

```js
// Google maps example without react:
const map = new google.maps.Map(document.getElementById('map'), { 
  zoom: 4, 
  center: myLatLng, 
}) 
 
const marker = new google.maps.Marker({ 
  position: myLatLng, 
  title: 'Hello World!', 
}) 
 
marker.setMap(map)
```

```jsx
// Google maps example using a react component:
<Gmaps zoom={4} center={myLatLng}> 
  <Marker position={myLatLng} Hello world! /> 
</Gmaps>
```

In declarative (react code above), we only describe what we want. There is no need to list out all the steps. Hence, react code is **simple**, has **fewer bugs**, and is **highly maintanable**

## React components & elements

In react, we create **components** when we code. Examples of code that creates a component: `extends Component`,`createClass`, and a pure function component

These components are *instantiated* by react and managed at *runtime*. There can be more than one instance of the same component in memory at a time

**Internals**

The components and their instances are maintained as **elements** (javascript objects) by react internally. These elements are **immutable** and contain only the *information required to represent that interface*

```js
// React element object 
{ 
  type: Title, 
  props: { 
    color: 'red', 
    children: { 
      type: 'h1', 
      props: { 
        children: 'Hello, H1!' 
      } 
    } 
  } 
}
```

It is a nested structure.

- If `type` is a string, it refers to a **DOM Node**
- If `type` is a **function**, it refers to a react component
  - Whenever the type is a function, react invokes and passes the props
  - It does this recursively until all the types are strings. Once this is the case, we have a **tree of DOM nodes**
  - Finally, React DOM (& React Native) **renders** the display using the DOM tree
  - This whole process is called **reconciliation**

## React's ways

Earlier, the frontend world would emphasize on **separation of concerns** so that data and the display logic can be managed separately. We had templating engines such as jade, mustache, and so on

```html
{{#items}} 
  {{#first}} 
    <li><strong>{{name}}</strong></li> 
  {{/first}} 
  {{#link}} 
    <li><a href="{{url}}">{{name}}</a></li> 
  {{/link}} 
{{/items}}
```

The problems with this approach:

- The view (template) directly depends on the model. If model changes its values, template needs to be updated too!
- The javascript will eventually need to interact with the DOM nodes created by the template directly (bypassing template)
- In general, CSS too is tightly coupled to markup in its structure

Therefore, the separation of concerns by segregating data and the view is just an **illusion!** (Does not solve any real problems related to SoC)

**The react approach**

Instead of separating data and the view, we can combine everything into one. That is, combine the *data (js)*, the *view (html)*, and nowadays even *styling (css-in-js)*. The question is, what is being separated?

We will separate out the logical units of display. Each such unit is a **component**. 

The component can be a button or something more complex, like a sidebar. We can reuse components and create complex ones by using simpler ones.

Every component has data (functionality) & markup and optionally, even styling. This is the real separation of concern. Every logical piece of code that needs to be rendered can be one react component.

To summarise, ***the end goal is to encapsulate every single technology used to create our components and separate the concerns according to their domain and functionalities.***

React made this new way of thinking popular

## React setup 

We only need two libraries, `react` and `react-dom` to get started. Without `react-dom` we cannot write JSX and are forced to use `createElement` methods

At some point, we will need to perform routing and for that we will need a router such as `react-router`. We might even need a mechanism to load API responses and so on. If app grows, it's better to have a *package manager*

Therefore, to get over package and module *fatigue*, we can use a starter kit that includes most if not all requirements for a react app.

```bash
npm install -g create-react-app

create-react-app hello-world

npm start
```

## Clean React Code

1. **Use JSX**: An XML-like syntax that will eventually get transpiled into `react.createElement()` function calls (JSX is just syntactic sugar)
   1. It is similar to HTML and therefore, is very convenient to create UIs (markup)
   2. Opening and closing tags make it easier to represent nested tree of elements when compared to `createElement()` calls
   3. JSX supports *self-closing* tags. Ex: `<div />`
   4. We need Babel to run JSX. This is because JSX needs to be transpiled into regular JS functions for the browser to understand it

```jsx
// This in JSX:
<div><span>Hello</span></div>
```

```js
// Is the same as this:
React.createElement('div')
```

2. **Use capital letters to create react components in JSX**

```jsx
<button /> {/* A button DOM element */}
<Button /> {/* A Button component of React */}
```

```js
// The above gets converted to:
React.createElement('button') // If the argument is a string => It's a HTML tag i.e DOM node
React.createElement(Button) // Not a string? So, a react component (internally, a function)
```

3. **Differences between JSX and HTML to keep in mind**

   1. Use **`className`** instead of `class` and **`htmlFor`** instead of `for` since these are reserved words in JS

   2. `style` attribute receives a **JS object** with **camelCased** style properties and not css stylesheet rules

   3. We **cannot return two or more JSX top level tags** from a react component's render method

      1. *Reason*: Internally,  they are JS functions. Hence, we cannot return two things at a time from a function in JS

      ```react
      render() {
        return (
          <div>Something</div>
        	<Button>Something else!</Button>
        )
      }
      // THIS IS AN ERROR! ❌
      ```

      ```react
      // Use <React.Fragment> as a workaround:
      render() {
        return (
          <React.Fragment>
            <div>Something</div>
            <Button>Something else!</Button>
          <React.Fragment>
        )
      }
      // <React.Fragment> does not add any UI when it gets rendered>
      // If <React.Fragment> has no attributes (like `key` in a map), 
      // we can use `<></>` instead
      ```

   4. **JSX collapses spaces. Use explicit spaces with `{' '}`** 

      ```jsx
      <div> 
        <span>foo</span> 
        bar 
        <span>baz</span> 
      </div>
      ```

      The above returns `foobarbaz`. Use the following for spaces in between:

      ```jsx
      <div> 
        <span>foo</span> 
        {' '} 
        bar 
        {' '} 
        <span>baz</span> 
      </div>
      ```

      The above returns `foo bar baz`

   5. **Prop without a value becomes a `true` value in JSX**

      ```jsx
      <Button disabled>Click me!</Button>
      ```

      ```js
      // Gets translated into:
      React.createElement(Button, { disabled: true })
      
      // BE CAREFUL: If disabled is not present in JSX, it does not mean it is `false`. Instead it won't be defined
      // TRY TO BE EXPLICIT ALL THE TIME
      // <Button disabled={false}>Click me!</Button>
      ```

   6. **JSX props can spread attributes using `{...<obj>}`unlike HTML**

      ```react
      const foo = { id: 'bar' } 
      return <div {...foo} />
      ```

      ```js
      // The above JSX gets transpiled into the following:
      var foo = { id: 'bar' }; 
      return React.createElement('div', foo)
      ```

      In general, it is good practice to **not** send whole objects as a reference since it can lead to more bugs. Instead, ***extract the prop object values and pass them as primitives (not references)***

4. **Common JSX patterns:**

   1. Keep **nested JSX multiline** for readability unless children are texts and variables (Can be a lint rule)

      - Reason: It is easier to read less per line, vertically than more per line, horizontally 

   2. **Wrap multiline JSX in parentheses `()`**

      - Reason: Due to Javascript's ASI, semicolons might get inserted in between returning only a partial markup

   3. **Write each attribute on a new line**

      - Reason: Again, for readability. We want to avoid very long lines

   4. **Conditionals inside JSX**

      1. **Use the `&&` shortcut in expressions to conditionally render something.** It's terse & elegant

         ```react
         // Instead of this: ❌
         let button 
         if (isLoggedIn) { 
           button = <LogoutButton /> 
         }
         return <div>{button}</div>
         
         
         // Do this: ✅
         <div> 
           {isLoggedIn && <LoginButton />} 
         </div>
         ```

      2. **For an if and an else case in a conditional, use a ternary operator**

         ```react
         // Instead of this: ❌
         let button 
         if (isLoggedIn) { 
           button = <LogoutButton /> 
         } else { 
           button = <LoginButton /> 
         } 
         
         
         // Use this: ✅
         <div> 
           {isLoggedIn ? <LogoutButton /> : <LoginButton />} 
         </div>
         ```

      3. **For more complex conditions, use helper methods of the component**

         ```react
         // Instead of this: ❌
         <div>
          {dataIsReady && (isAdmin || userHasPermissions) && 
            <SecretData />
          }
         </div>
         
         
         // Use this: ✅
         canShowSecretData() { 
           const { dataIsReady, isAdmin, userHasPermissions } = this.props 
           return dataIsReady && (isAdmin || userHasPermissions) 
         }
         // RESULT - MORE READABLE JSX:
         <div> 
           {this.canShowSecretData() && <SecretData />}
         </div>
         ```

      4. **Alternatively, you can use getters and setters**

         ```react
         // Objects and classes can have property getters and setters: Use them!
         // Use this: ✅
         get canShowSecretData() { 
           const { dataIsReady, isAdmin, userHasPermissions } = this.props 
           return dataIsReady && (isAdmin || userHasPermissions) 
         }
         // RESULT - MORE READABLE JSX:
         <div> 
           {this.canShowSecretData && <SecretData />} 
         </div>
         
         // ANOTHER IDEA FOR GETTERS AND SETTERS:
         // USE THEM FOR "COMPUTED PROPERTIES" (Ex: Computed props such as fullname from firstname and lastname)
         ```

      5. **As a last option, use sub-rendering**

         - The general rule is to keep components *small* and render() method *clean* and *simple*
         - However, if it is not possible to split a component, we can still clean up render() method
         - Use **sub-rendering** (modularised rendering) to split rendering tasks in such a case:

         ```react
         // Instead of this: ❌
         render() { 
           return ( 
             <div> 
               <h1>Welcome back!</h1> 
               {this.userExists && /* JSX for user menu */ } 
               {this.userIsAdmin && /* JSX for admin menu */} 
             </div> 
           ) 
         }
         
         
         // Use this: ✅
         renderUserMenu() { 
           // JSX for user menu 
         } 
         renderAdminMenu() { 
           // JSX for admin menu 
         } 
         render() { 
           return ( 
             <div> 
               <h1>Welcome back!</h1> 
               {this.userExists && this.renderUserMenu()} 
               {this.userIsAdmin && this.renderAdminMenu()} 
             </div> 
           ) 
         }
         ```

      6. **Use `.map()` as a loop**

         - We generally have an array of values and we map that to the UI we wish to render

         ```react
         <ul> 
           {users.map(user =><li>{user.name}</li>)} 
         </ul>
         ```

5. **Libraries that can make JSX conditionals and loops easy**

   - Try to avoid 3rd party libraries since they can add to the bundle size and intoduce delays

   - However, there are some like the following that can be useful with JSX

   - **The goal:  ✅** *Never add too much logic inside our components. Some of them will require a bit of it, but we should try to keep them as simple and dumb as possible so that we can easily spot and fix errors.*

   - **`render-if`**

     - `npm install --save render-if`

     ```react
     const { dataIsReady, isAdmin, userHasPermissions } = this.props 
     const canShowSecretData = renderIf( 
       dataIsReady && (isAdmin || userHasPermissions) 
     ) 
     // JSX:
     <div> 
       {canShowSecretData(<SecretData />)} 
     </div>
     ```

   - **`react-only-if`**

     - `npm install --save react-only-if`
     - It creates a **higher order component (HOC)** where the argument is a function that returns a boolean output based on the props

     ```react
     const SecretDataOnlyIf = onlyIf(
       ({ dataIsReady, isAdmin, userHasPermissions }) => {
         return dataIsReady && (isAdmin || userHasPermissions)
       }
     )(SecretData)
     
     <div>
       <SecretDataOnlyIf 
         dataIsReady={...}
         isAdmin={...}
         userHasPermissions={...}
       />
     </div>
     ```

   - **`jsx-control-statements`**

     - Useful for both conditionals and loops
     - Need a babel plugin `"plugins": ["jsx-control-statements"]` since it needs to be transpiled to JSX

     ```react
     // Example 1: <If>
     <If condition={this.canShowSecretData}> 
       <SecretData /> 
     </If>
     // Transpiled to: {canShowSecretData ? <SecretData /> : null}
     
     
     // Example 2: <Choose>
     <Choose> 
       <When condition={...}> 
         <span>if</span> 
       </When> 
       <When condition={...}> 
         <span>else if</span> 
       </When> 
       <Otherwise> 
         <span>else</span> 
       </Otherwise> 
     </Choose>
     
     // Example 3: <For>
     <ul> 
       <For each="user" of={this.props.users}> 
         <li>{user.name}</li> 
       </For> 
     </ul>
     ```

6. **Use functional programming techniques**

   - React is declarative and functional programming is also declarative. Hence, we can combine the two to write *well maintainable* and *clean* applications that can be *tested easily*
   - **First class objects:** Functions are treated as first class objects in FP. The can be passed around like any other value. In react, we can treat our **components** as first class objects
   - **Purity**: A function is pure when it has no side-effects. The output only depends on the input and re-runs don't change it. We can employ pure functions in react wherever possible
   - **Immutability:** The state of the inputs are not mutated. Can lead to bugs otherwise on re-runs
   - **Currying**: When a function that takes multiple arguments is replaced by higher order functions that return functions allowing us to apply inputs one by one at different times. Helps us compose software well
   - Think of functional programmig in react as **`UI = f(state)`**. Given the same state, the same UI must be returned (idempotent). Therefore, our component can be the function `f`, our state being the input to the component and the UI is what the `render()` method produces

## Reusable components

### Creating class (stateful) components

There are **two** ways: `React.createClass` and `class <name> extends React.Component`. The former is a factory method while the later using the class syntax of ES2015.

**React developers recommend using the ES6 class based syntax**. In this:

1. You `extend` a class called `React.Component`
2. If constructor is defined, invoke `super` with the props (`super(props)`)

**`React.createClass`**

```js
// Invoke the factory with an object as the argument
const Button = React.createClass({
  propTypes: { 
    text: React.PropTypes.string, 
  }, 
 
  getDefaultProps() { // You have to specify a function that gives default object for props
    return { 
      text: 'Click me!', 
    } 
  }, 
 
  render() { 
    return <button>{this.props.text}</button> 
  }, 
})
```

**`ES6 class`**

```js
class Button extends React.Component {
  constructor(props) {
    super(props)
  }
  
  render() { 
    return <button>{this.props.text}</button> 
  } 
} 

// `propTypes` becomess a static property object of the class:
Button.propTypes = { 
  text: React.PropTypes.string, 
} 

// Instead of `getDefaultProps`, we use a static property:
// An object called `defaultProps`
Button.defaultProps = {
  text: 'Click me!', 
}
```

### State declaration

**In `React.createClass`** (We define a `getInitialState` method)

```js
const Button = React.createClass({ 
  // We use a method `getInitialState` that returns an object that is the state!
  getInitialState() { 
    // This becomes the initial state of the component
    return { 
      text: 'Click me!', 
    } 
  }, 
 
  render() { 
    // Can access the state using `this.state`
    return <button>{this.state.text}</button> 
  }, 
})
```

**In `ES6 class`**

```js
class Button extends React.Component { 
  constructor(props) { 
    super(props) 
 
    // We use a special instance variable `this.state` and assign it an object
    // This becomes the initial state of the component
    this.state = { 
      text: 'Click me!', 
    } 
  }
  
  render() { 
    // Can access the state using `this.state`
    return <button>{this.state.text}</button> 
  } 
}
```

### Autobinding problem in class components (`this`)

**With `React.createClass`**

We can set an *event handler* in the following way and rely on the fact that this inside the function refers to the component itself. That is, there is **no autobinding problem with `createClass`**

```js
const Button = React.createClass({ 
  handleClick() { 
    console.log(this) // `this` will refer to the component ✅
    // Can call other component methods here
  }, 
 
  render() { 
    return <button onClick={this.handleClick} /> 
  }, 
})
```

**With `ES6 class`**

We cannot set an *event handler* in the following way because *we lose the **this** reference when that function gets called from the event handler*

```js
class Button extends React.Component { 
  handleClick() { 
    console.log(this) // `this` will be null ❌
    // Cannot call other component methods here!
  } 
 
  render() { 
    return <button onClick={this.handleClick} /> 
  } 
}
```

**Autobinding solution in class component**

There are a few ways:

1. ***Register an arrow function*** that invokes the instance method. In this way, the this value is preserved

   - However, this is a ***non-performant way*** of doing things and ***must be avoided***

   - Binding a function inside the render method has an *unexpected side-effect* because the arrow function gets fired every time the component is rendered (which happens multiple times during the lifetime of the application). There are two inefficiencies because of this:
     - Overhead of arrow function being fired on every render (& this render can occur quite often)
     - An even larger problem is that we are passing the function down to a child component. So, receives a new prop on each update which leads to inefficient rendering, and that represents a problem, especially if the component is pure!

   ```js
   // Works but is a non-performant solution ❌
   class Button extends React.Component { 
     handleClick() { 
       console.log(this) 
     } 
    
     render() { 
       return <button onClick={() => this.handleClick()} /> 
     } 
   }
   ```

2. ***Bind the instance method*** to the component (in constructor) so that the `this` context is ***never altered***

   ```js
   // Works and is performant ✅
   class Button extends React.Component { 
     constructor(props) { 
       super(props) 
    		// We usually bind inside constructor (ensures other methods execute post binding)
       this.handleClick = this.handleClick.bind(this) // Permanent binding of `this`
     } 
    
     handleClick() { 
       console.log(this) 
     } 
    
     render() { 
       return <button onClick={this.handleClick} /> 
     } 
   }
   ```

3. There is a 3rd way that relies on a class properties proposal getting a nod from the specification TC39 authority *(The example is not shown here and we need a babel plugin as of now to make it work)*

### Stateless components

Functional components or pure components are known to be **stateless**. That is, they. do **not** have state!

They are as simple as a function returning some JSX.

Functional components receive **two** properties:

1. The props
2. The context

```js
// Example 1
const Button = ({ text }) => <button>{text}</button>


// Example 2
const Button = (props, context) => ( 
  <button>{context.currency}{props.value}</button> 
)
```

**Limitations of stateless components**

1. The `this` does not represent the component. You cannot call `this.setState()` or any other instance method

2. There is **no state** but only props and context. These are arguments and tthe render only depends on them. Therefore, functional components are closer to the functional programming paradigm (i.e **pure**)

3. There are **no lifecycle methods**. Parent handles everything - if it invokes it, it will re-render

4. Handling **refs**: We define a callback method for the `ref` JSX attribute which receives the ref value

   ```js
   () => { 
     let input 
     
     const onClick = () => input.focus()
   	
     return ( 
       <div> 
         <input ref={el => (input = el)} /> 
         <button onClick={onClick}>Focus</button> 
       </div> 
     ) 
   }
   ```

5. They are ***not as performant as stateful components*** since ***there is no way to tell them not to render if props don't change or change partially***

### State in-depth

1. **Every time the state changes, React renders the component again with the new state**, which is why documentation often says that a React component is similar to a **state machine.** 

2. We may want to perform some operations when the state is updated, and React provides a **callback** for that:

   ```js
   this.setState({ 
     clicked: true, 
   }, () => { 
     console.log('the state is now', this.state) // { clicked: true }
   }
   ```

3. State updates are **asynchronous**. React tries to optimize state updates from *event handlers* and *batches* them (However, it cannot always optimise and sometimes it is synchronous). We cannot guarantee synchronicity!

   ```js
   // Assuming `clicked` is false initially
   handleClick() { 
     this.setState({ 
       clicked: true, 
     }) 
     console.log('the state is now', this.state) // { clicked: false } !
   } 
    
   render() { 
     return <button onClick={this.handleClick}>Click me!</button> 
   }
   ```

   Outside of event handlers, react cannot optimize much and triggers state updates as soon as possible

**When to use state and what must it contain?**

***State must contain only:***

1. Minimal amount of data (Ex: If you are changing button text on click, keep a flag and not the texts)
2. Keep in state only the values we want to update when an event, that must cause a re-render, happens 
3. Store only the information dealing with current UI (Ex: If the value needed outside component such as parent or children or in multiple places, consider an application level state manager such as Redux)

***State must not contain:***

1. Computed props. If the final values is constructed from the props, do not keep it in state. Use instance methods or getters and setters instead.

   - Why is it bad? If props update but not the state, the component will not re-render causing problems

   ```js
   // Bad! ❌
   constructor(props) {
     super(props) 
     this.state = { 
       price: `${props.currency}${props.value}` 
     } 
   }
   
   // Good! ✅
   getPrice() { 
     return `${this.props.currency}${this.props.value}` 
   }
   ```

2. Anything in the state that is *not* being used in the `render()` method. Such values are not responsible for re-rendering and hence don't make sense being in the state. A good solution is to keep such values in an external module or as instance variables (not state variables)

   ```js
   // Bad! ❌
   // this.state.request is not going to be used inside render()
   componentDidMount() { 
     this.setState({ 
       request: API.get(...) 
     }) 
   }
   componentWillUnmount() { 
     this.state.request.abort() 
   }
     
   // Good! ✅
   // Keeping such values as instance variables and not state:
   componentDidMount() { 
     this.request = API.get(...) 
   } 
   componentWillUnmount() { 
     this.request.abort() 
   }
   ```

**Cheetsheet for deciding state value**

```js
function shouldIKeepSomethingInReactState() {
  if (canICalculateFromProps()) {
    // Don't duplicate data from props in state
    // Calculate what you can in render() method
    return false
  }
  if (!amIUsingItInRenderMethod()) {
    // Don't keep something in state if you don't use it for rendering
    // For example, API subscriptions are better off as custom private
    // fields or variables in external modules
    return false
  }
  
  // You can use React state for this!
  return true
}
```

### PropTypes

Our components must be well-defined with clear boundaries which make them straight-forward to use. We can add some validation rules for the props that our component requires.

`PropTypes` is a named export of the `react` library and it type checks our props for a component. We define  a static `propTypes` (camelCase) property on the component for which we want to define prop types for.

**Note:** PropType validation is **disabled in production mode** for **performance** (Used only in development)

We can use:

1. Built-in types (Ex: `PropTypes.string`)
2. Built-in aggregators or conditionals (Ex: `PropTypes.oneOf(<An array of different PropTypes>)`)
3. Built-in mandatory checks (Ex: `PropTypes.isRequired` or `PropTypes.number.isRequired`)
4. "Shapes" to describe objects
5. Custom functions which let us do our own validation

Regarding point **4**, we are discouraged from passing whole objects to components as props. We should usually only *send primitive values* because they are simpler to *validate and compare* (instead of reference comparison) making them easy to test and debug

However, we cannot always prevent ourselves from sending objects. In this case, we can define the shape of the object with `PropTypes.shape`

```js
const Profile = ({ id, user, age }) =>( 
  <div>{id} : {user.name} {user.surname} | {age}</div> 
)

// camelCased static property called 
Profile.propTypes = { 
  id: React.PropTypes.number.isRequired,
  user: React.PropTypes.shape({ 
    name: React.PropTypes.string.isRequired, 
    surname: React.PropTypes.string, 
  }).isRequired, 
  age: (props, propName) => { 
    if (!(props[propName] > 0 && props[propName] < 100)) { 
      return new Error(`${propName} must be between 1 and 99`) 
    } 
    return null 
  },
}
```

### Documentation of components and props

Some tools that are useful for documenting components:

1. **`react-docgen`** which documents the component props from its prop types
2. **`react-storybook`** which documents components *visually*. It has stories inside which we describe the component for each state of the component. Generates an HTML page

### Reusable components in action

Do not duplicate code (DRY principle). So, if there are similar ***specific-to-use-case components***, we can convert them into a ***single, more generic component which is configurable***.

```js
// Bad! ❌
const PostList = ({ posts }) => ( 
  <ul> 
    {posts.map(user => ( 
      <li key={posts.id}> 
        <h1>{posts.title}</h1> 
        {posts.excerpt && <p>{posts.excerpt}</p>} 
      </li> 
    ))} 
  </ul> 
)
const UserList = ({ users }) => ( 
  <ul> 
    {users.map(user => ( 
      <li key={user.id}> 
        <h1>{user.username}</h1> 
        {user.bio && <p>{user.bio}</p>} 
      </li> 
    ))} 
  </ul> 
)
```

```js
// Good! ✅
const Item = ({ text, title }) => (
  <li>
    <h1>{title}</h1>
    {text && <p>{text}</p>}
  </li>
)
const List = ({ collection, textKey, titleKey }) => ( 
  <ul> 
    {collection.map(item => 
      <Item  
        key={item.id}  
        text={item[textKey]}  
        title={item[titleKey]}  
      /> 
    )} 
  </ul> 
)

// Reusing List and indirectly, Item:
const PostList = ({ posts }) => (
  <List  
    collection={posts}  
    textKey="excerpt"  
    titleKey="title"  
  />
)
const UserList = ({ users }) => ( 
  <List  
    collection={users}  
    textKey="bio"  
    titleKey="username"  
  /> 
)
```


