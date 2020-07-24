# React Design Patterns & Best Practices

[Book: React Design Patters and Best Practices - **Bertoli, Michele**](https://www.amazon.com/React-Design-Patterns-Best-Practices-ebook/dp/B01LFAN88E)

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


