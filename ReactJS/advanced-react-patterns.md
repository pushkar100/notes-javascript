# Advanced React Patterns

[Kent C Dodds Course](https://frontendmasters.com/courses/advanced-react-patterns/)

## Pattern 1: `setState` object vs updater function

**We can set state in two ways:**

1. Pass an object (`this.setState(<obj>)`)
2. Pass a function (`this.setState(<function>)`). The function receives the *current state* as the argument.

**When should we use each of them?**

1. Use an object if the current state is not being used to compute the new state
2. Use an updater function if the current state is being used to compute the new state (or if you are doing complex computations)

**Reason**

The `setState` calls can be ***batched*** in React and executed together. If we depend on the current state inside a plain object, it might not be the actual current state (i.e the most updated one) or the state might change while you are executing the `setState`. Therefore, it is not highly predictable. However, when an updater function executes, it receives the current state as a representation of the current state, and not the state itself. Hence, it is safer to use when producing new state from current state

## Pattern 2: Using compound components

**When does a React component get complex?**

A React component gets complex when you start doing multiple things i.e breaking the **SRP** principle. For example, a `Toggle` component needs to display a button/switch but what if we also wanted to display a message (the on/off status)? 

Should we add this logic into the toggle? No. It complicates the component and its logic. Instead, we must convert them into compound components

**What are compound components?**

Components that have child components and the children share the implicit state of the parent. Whenever we want all the children to update, change their props from the parent. Whenever a child wants to notify the parent, it can communicate using callbacks. And, if that communication requires that other children update themselves too, we simply change their props again, from the parent.

In the following example we place `<ToggleMessage>` and `Button` inside `<Toggle>` parent which manages them (implicit state sharing)

```jsx
<Toggle>
	<Button onClick={toggle} />
	<ButtonMessage text={text} />
</Toggle>
```

**Advantages of compound component**

1. The ability to choose what order to place the children in (Ex: button first, message second). Just change the order of child components and that is all that is required
2. ***Implicitly sharing*** state via the parent component (which controls the children via props). The user (writing the JSX) does not need to know the shared state between these components and hence, does not have to define them as props explicitly

**Note**
  
You can create function components as ***static properties***! For example:

```js
static Candy = (props) => <div>CANDY! {props.children}</div>
// Then that could be used like: 
<Toggle.Candy />
// This is handy because it makes the relationship between the
// parent Toggle component and the child Candy component more explicit

// ONLY USE IT WHEN YOU LOGICALLY TIE THE CHILD TO THE PARENT? 
// THERE EXISTS A TIGHT COUPLING BETWEEN PARENT AND CHILD COMPONENT.
// A CHILD COMPONENT CANNOT BE REUSED ELSEHWERE AS A STANDALONE COMPONENT.
```

## Pattern 3: Enhancing compound component with `Children.map` and `cloneElement`

When we create compound components, we can use the `this.props.children` property to access the children components, as an array

On top of that, we can use `React.Children.map(<children>, <child => {}>)` to map the immediate children similar to how we use `Array.prototype.map`. Why can't we use `Array.prototype.map` itself? Because the method does not work for a single child which isn't an array but React's method does

Once we map our children, we can return an enhanced component of each by ***cloning*** them. By cloning, we can edit or add extra props, change its children, and so on. We clone using `React.cloneElement(<child>, [<props>, <children>])`. The `<props>` object will be shallow merged with the existing props of the child

In this way, we can enhance the immediate children by injecting properties, changing its children, etc. We don't have to explicitly pass props to every child in JSX

```js
// Usage: Note we don't define the same props on every child:
<Toggle onToggle={onToggle}>
  <Toggle.On>The button is on</Toggle.On>
  <Toggle.Off>The button is off</Toggle.Off>
  <Toggle.Button />
</Toggle>
```

```js
// Rendering of Toggle
render() {
    const {toggle, state} = this
    const {on} = state
    return React.Children.map(this.props.children, child =>
      React.cloneElement(
        child,
        {
          on,
          toggle,
        }, // Therefore, all the immediate children receive `on` & `toggle` props
        child.props.children,
      ),
    )
  }
}
```

## Pattern 4: Flexible components with `React.createContext`

**What if you wanted to pass props to children of your children?** 

This is not possible with just the compound components,  `React.Children.map` and `React.cloneElement` combination. These cater to only the immediate children. So, if we wrap our child components in other markup, we cannot enhance them with props

```js
// THIS IS FINE:
<Toggle onToggle={onToggle}>
  <Toggle.On>The button is on</Toggle.On>
  <Toggle.Off>The button is off</Toggle.Off>
  <Toggle.Button />
</Toggle>

// THIS IS NOT:
<Toggle onToggle={onToggle}>
  <Toggle.On>The button is on</Toggle.On>
  <Toggle.Off>The button is off</Toggle.Off>
  <div>
	{/* Since this is not an immediate ch*/}
    <Toggle.Button />
  </div>
</Toggle>
```

**Solution: Use `context` API**

```js
const defaultValue = 'light'
const ThemeContext = React.createContext(defaultValue)

// ...
<ThemeContext.Provider value={this.state}>
  {this.props.children}
</ThemeContext.Provider>
// ...

// ...
<ThemeContext.Consumer>
  {value => <div>The current theme is: {value}</div>}
</ThemeContext.Consumer>
// ...
```

Example usage:
```js
const ToggleContext = React.createContext({on: false, toggle: null})
// This argument is the default value to any consumer that gets rendered
// NOT within a provider!

//...
render() {
  return (
    <ToggleContext.Provider value={this.state}>
      {this.props.children}
    </ToggleContext.Provider>
  )
}

// ...
static Button = ({on, toggle, ...props}) => {
  return (
    <ToggleContext.Consumer>
      {({on, toggle}) => (
        <Switch on={on} onClick={toggle} {...props} />
      )}
    </ToggleContext.Consumer>
  )
}
```

**NOTE**

1. Anytime the value of a context changes, it ***re-renders*** itself (the provider) as well as all of its consumers. Therefore, it is important to know this behaviour for performance reasons. If you are passing in state or other objects into context, it is better to save it by *reference* rather than a new object inside the context

Ex: `value={this.state}` over `value={{some:Object, sameAs: state}}`

2. We can get into nesting too many components in our JSX markup because of having to wrap them in providers and consumers. Instead, we can use functional components that wrap them and give them to us (abstracting away the wrapping complexity) and that's how we can reduce the nesting inside our markup. Or, we can try `react-compose` (A 3rd part library)

## Pattern 5: Flexible components with render props

**The problem with compound component: Tight coupling**

In the patterns seen above, if we had to share state, we have done it implicitly (such as in the `context` pattern). While that in itself might be good, the props to the children and their names are decided by the parent component

The child components will have access to the state and methods of the parent, either through direct access or via constructs such as context making the state available. This is tight coupling, it is impure, and so on. We can avoid this!

**Solution: Render props**

The render props patterns allows us to pass in a ***function*** instead of components and elements to a component in the JSX. The parent can access this function via `this.props.children` and invoke. It will pass in the arguments that the function requires. In this way, the user can define, inside the function, what props the child components take - pure and decoupled from parent - and the parent's task is to pass in the appropriate values to function itself. That's all!

**Features of render props**

* Rendering responsibility is now under the ownership of the user and not the component's implementation
* Parent component is only in-charge of the state

Think of it as a conversation between the parent component and a user of the component (the one who writes the JSX for it and is children). It's as good as the component telling the user, "I'll be in-charge of the state but you decide what you want to render and what prop names and values you are going to use for the child components"

```js
// Toggle component (The parent):
render() {
  const {on} = this.state
  return this.props.children({on, toggle: this.toggle})
}
```

```js
// Another component that renders toggle (The user):
return (
  <Toggle onToggle={onToggle}>
    {({on, toggle}) => (
      <div>
        {on ? 'The button is on' : 'The button is off'}
        <Switch on={on} onClick={toggle} />
        <hr />
        <button aria-label="custom-button" onClick={toggle}>
          {on ? 'on' : 'off'}
        </button>
      </div>
    )}
  </Toggle>
)
// 1. We create a child function instead of child components
// 2. The function receives arguments (which will be supplied by parent internally)
// 3. The function returns other, pure components (not linked to their parents)
```

**Advantages of render props**

1. **Pure functions.** Our components will not access the state directly - they don't need to be ingested directly by name into the child component via parent. They are but the names are decided by the user so there is some decoupling happening. Hence, it does it not need to be a part of the parent class. It does not use its 	`this`
2. We can take a component with render props and create another component built on top of it but the original API stays the same, we can use it in the same way. This makes it a good pattern. 
3. Another problem the render props solves is that of ***implicit sharing***. It is good from implementation perspective but the user does not know what props are being sent when he/she writes the JSX. Render props make it more explicit.

**Compound components vs Render props: When to use what?**

Use compound components where the child components don't need much control. Use render props when you need fine grained control over what gets passed to your child component

## Pattern 6: Prop collections and getters with render props

Sometimes with render props, we might want to supply a collection of props rather than defining them individually. This helps keep code DRY and increases usability

Examples of places where you'd use a collection can be things like a set of accessibility attributes of buttons and input elements, a set of attributes for all media elements and so on. These collections contain common props that all similar components will be needing

```js
// Snippet of <Toggle> component:
getStateAndHelpers() {
  return {
    on: this.state.on,
    toggle: this.toggle,
    togglerProps: {
      'aria-expanded': this.state.on,
      onClick: this.toggle,
    },
  }
}
render() {
  // Passing prop collections as part of the render props argument
  return this.props.children(this.getStateAndHelpers())
}

// Example usage of prop collections with render props:
// Spread out the prop collection object inside JSX:
return (
  <Toggle onToggle={onToggle}>
    {({on, togglerProps}) => (
      <div>
        <Switch on={on} {...togglerProps} />
        <hr />
        <button aria-label="custom-button" {...togglerProps}>
          {on ? 'on' : 'off'}
        </button>
      </div>
    )}
  </Toggle>
)
```

**Greater flexibility with prop getters**

Prop collections are good but not flexible. For example, if the user wanted to use a custom `onClick` method in the above snippet, there is no way other than placing `onClick={<customFn>}` after the `{...togglerProps}` in the JSX. Only one of them can get registered as the `onClick` handler. Both cannot run!

Prop getters solve the ***merging props problem*** by giving you a ***prop collection function*** instead of an object. The function takes in the custom property too, and merges it with the original one. How is it done? Like the following:

```const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))```

```js
// Snippet of <Toggle> component:
getTogglerProps = ({onClick, ...props}) => {
  return {
    'aria-expanded': this.state.on,
    onClick: callAll(this.toggle, onClick)
    ...props,
  }
}
getStateAndHelpers() {
  return {
    on: this.state.on,
    toggle: this.toggle,
    getTogglerProps: this.getTogglerProps,
  }
}
render() {
  return this.props.children(this.getStateAndHelpers())
}

// Usage example:
<Toggle onToggle={onToggle}>
   {({on, getTogglerProps}) => (
     <div>
       <Switch {...getTogglerProps({on})} />
       <hr />
       <button
         {...getTogglerProps({
           'aria-label': 'custom-button',
           onClick: onButtonClick,
           id: 'custom-button-id',
         })}
       >
         {on ? 'on' : 'off'}
       </button>
     </div>
   )}
 </Toggle>
```

## Pattern 7: State initialisers

This pattern allows us to set an initial state and to reset the state to its initial one when it has changed

