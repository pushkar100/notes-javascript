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

This pattern allows us to:
1. Set an initial state from the props (instead of hardcoding it), and
2. To reset the state to its initial one when it has changed

```js
// Usage example: Pass initial state via `initialOn` props
// Have a `onReset` callback
// Also, expose the reset method as render prop argument
<Toggle
  initialOn={initialOn}
  onToggle={onToggle}
  onReset={onReset}
>
  {({getTogglerProps, on, reset}) => (
    <div>
      <Switch {...getTogglerProps({on})} />
      <hr />
      <button onClick={() => reset()}>Reset</button>
    </div>
  )}
</Toggle>

// Implementation snippet:
class Toggle extends React.Component {
  static defaultProps = { on: false }
  initialState = {on: this.props.initialOn}
  state = this.initialState
  reset = () => {
    this.setState(
      initialState,
      () => this.props.onReset(this.state.on),
    )
 }
 //...
}
```

## Pattern 8: State reducers

State reducers allow users to be in control over logic based on actions. This is similar to redux.

The basic idea is that any time there's an internal change in state, we first call a stateReducer prop with the current state and the changes. Whatever is returned is what we use in our setState call. This allows users of the component to return the changes they received or to modify the changes as they need.

We can create a single function that does all the work before calling setState. Then we can replace all calls to setState with that function.

This pattern allows us greater control of our state changes and the luxury of keeping our dumb components, dumb. By using per-component, custom reducers we can gate our setState calls and thus prevent unnecessary renders. 

```js
class ButtonWrapper extends React.Component {
  state = { added: 0 }

  controlledSetState (stateOrFunc) {
    this.setState(state => {
      /*  In this example we're only invoking the `controlledState` function in one place, so we
       *  can be sure `stateOrFunc` is a function. Nonetheless, we'll check here. In some use cases
       */ it might be a normal piece of the state
      const changedState = typeof stateOrFunc === 'function' ? stateOrFunc(state) : stateOrFunc

      /* `stateReducer` is guaranteed to return an empty object in this example,
       * but it could be possible in other use cases that the return value is null.
       * This will make sure we at least have a {} to return appropriately below.
       */
      const reducedState = this.props.stateReducer(state, changedState) || {}

      /* We'll return the `reducedState` if something interesting happens
       * i.e. we stay below our limit of 8. In other instances ( >= 8) we'll return `null`
       * to prevent excessive re-renders.
       */
      return Object.keys(reducedState).length > 0
      ? reducedState
      : null
    })   
  }

  addToCart = () => {
    // Just being explicit with this assignment for readability
    const fn = ({ added }) => ({ added: added + 1 })
    this.controlledSetState(fn)
  }

  getWrapperState () {
    return {
      addToCart: this.addToCart,
      added: this.state.added,
    }   
  }

  render () {
    return this.props.children(this.getWrapperState())   
  }
}
```

```js
class CartButton extends React.Component {

  /*
   *  This is the only "intelligent" thing our dumb component
   *  does: define its reducer. This is then passed on to
   *  the ButtonWrapper as a prop.
   */ 
  addToCartStateReducer = (currentState, updatedState) => {
    if (currentState.added >= 8) {
      return { }   
    }   
    return updatedState
  }

  render () {
    return (
      <ButtonWrapper
        stateReducer={this.addToCartStateReducer}
      > 
        {buttonLogic => (
          <div>
            <button onClick={buttonLogic.addToCart}>Add Item</button>
          </div>
        )}
      </ButtonLogic>
    )     
  }
}
```

State reducers help us:
1. Give state change control to the user (ex: via `addToCartStateReducer`)
2. Add restrictions on state changes (ex: Don't change state after 8 tries)
3. Prevent re-renders if the state has not changed (by returning the same state or `null`)

## Pattern 9: State reducers with change types

This is the same as state reducers except that we explicitly provide the type of change on the state. This makes it easy for the staterReducer to act on what has changed (instead of figuring out). For example, passing in `type: 'reset'` to a button reset handler that calls setState

This pattern is the one that's most similar to redux in its implementation

```js
// Component snippet:
static stateChangeTypes = {
  reset: '__toggle_reset__',
  toggle: '__toggle_toggle__',
}
initialState = {on: this.props.initialOn}
state = this.initialState
internalSetState(changes, callback) {
  this.setState(state => {
    // handle function setState call
    const changesObject =
      typeof changes === 'function' ? changes(state) : changes

    // apply state reducer
    const reducedChanges =
      this.props.stateReducer(state, changesObject) || {}

    // remove the type so it's not set into state
    const {type: ignoredType, ...onlyChanges} = reducedChanges

    // return null if there are no changes to be made
    return Object.keys(onlyChanges).length ? onlyChanges : null
  }, callback)
}

reset = () =>
  this.internalSetState(
    {...this.initialState, type: Toggle.stateChangeTypes.reset},
    () => this.props.onReset(this.state.on),
  )
toggle = ({type = Toggle.stateChangeTypes.toggle} = {}) =>
  this.internalSetState(
    ({on}) => ({type, on: !on}),
    () => this.props.onToggle(this.state.on),
  )
  // ...
```
```js
// Usage example (with state reducer):
toggleStateReducer = (state, changes) => {
  if (changes.type === 'forced') {
    return changes
  }
  if (this.state.timesClicked >= 4) {
    return {...changes, on: false}
  }
  return changes
}
// ...
// render():
<Toggle
  stateReducer={this.toggleStateReducer}
  onToggle={this.handleToggle}
  onReset={this.handleReset}
  ref={this.props.toggleRef}
>
  {({on, toggle, reset, getTogglerProps}) => ( /* ... */)
</Toggle>
```

## Pattern 10: Control props

This pattern can be used in place of state reducer pattern. The crux being that we want to control or sync the states of the similar child components

[Watch the explanation video](https://egghead.io/lessons/react-make-controlled-react-components-with-control-props)

[Read more here](https://kentcdodds.com/blog/control-props-vs-state-reducers)

## Pattern 11: Provider pattern

**Problem: Props drilling**

When we are not using the provider pattern but just a compound component, we cannot pass the values down to any component that is not an immediate child. To solve this issue we used the context API

When we used render props, we passed the props as arguments to the function. Now, if the components render inside pass down the values of those props to their children and so on, we will have to deal with those props at multi-levels. If the names or props change, we need to change it everywhere. 

An example of this problem, with render props:
```js
// Layer 1 never uses the render props but passes it to its children
const Layer1 = ({on, toggle}) => <Layer2 on={on} toggle={toggle} />
// Layer 2 partially uses the render props
const Layer2 = ({on, toggle}) => (
  <Fragment>
    {on ? 'The button is on' : 'The button is off'}
    <Layer3 on={on} toggle={toggle} />
  </Fragment>
)
// Layer 3 never uses the render props but passes it to its children
const Layer3 = ({on, toggle}) => <Layer4 on={on} toggle={toggle} />
const Layer4 = ({on, toggle}) => <Switch on={on} onClick={toggle} />

function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      {({on, toggle}) => <Layer1 on={on} toggle={toggle} />}
    </Toggle>
  )
}
```

**Solution: Provide a consumer using the context API**

Instead of just render props, we can combine it with our context API pattern and enable a provider-consumer flow.

## Pattern 12: Higher Order Components

They take in a component and return the same component but in an enhanced way! For example, a component that adds some data props to the given component

These are, by convention, prefixed with the `with` keyword. Helps us know that they are HOCs.
