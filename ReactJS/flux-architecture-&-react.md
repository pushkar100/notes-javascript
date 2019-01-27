# Flux Architecture

My notes on Flux, React and AltJS!

## Intro to Flux Architecture & React

[Source: Fullstack Academy on Youtube](https://www.youtube.com/watch?v=fNCkCmir3ic)

[Source 2: Also Youtube](https://www.youtube.com/watch?v=iwbkgOq1SMQ)

### Flux Features:

- *Unidirectional*, easily maintainable data structure (easy to debug)
- Intended to be used with React JS
- More of a *pattern* than a formal framework

### When was the Flux pattern created?

It was created a facebook. Facebook was having problems with its message counter in the chat application. The messages that were read by users was still appearing as new messages in the counter. 

The problem had to do with the difficulty in scaling up the MVC architecture (It has problems)

### MVC vs Flux:

MVC is not unidirectional in data flow but Flux is unidirectional!

**MVC Pattern**

```
[ CONTROLLER ] ---updates--> [ MODEL ] ---notifies--> [ VIEW ]

[ VIEW ] ---queries--> [ MODEL ]

[ VIEW ] ---user action events--> [ CONTROLLER ]
```

Controller updates the model which notifies the view. The view can query the Model (giving rise to two-way data flow).

The MVC pattern works fine if there are few models and views. But, if the number of models and views increases then it becomes *difficult to trace dependencies*. Tangled dependencies lead to *unpredictable results.*

Therefore, as app size increases, complexity increases and MVC gets hard to debug (due to two-way interaction between model and view. The view can mutate the state in the model while it derives the data from the model itself)

- Prone to bugs
- Hard to debug
- Difficult to:
  - Maintain/Understand
  - Add new features
  - Test, etc.

**External vs Internal Control**

The problem with MVC is that data was being controlled externally. In internal control, the only thing responsible for changing the data of something is itself.

Implementing internal control was done in the following way:

1. Explicit data is used on the client side
2. We have a central store that receives actions and changes the data inside the store and notifies all the views *by itself*
3. This allows for separation of concerns

These problems and solution approaches gave rise to Flux architecture

### Flux Architecture

```
[ ACTION ] -----> [ DISPATCHER ] -----> [ STORE ] -----> [ VIEW ] -----> [ ACTION (loop)]
```

![flux architecture image](https://facebook.github.io/flux/img/flux-simple-f8-diagram-with-client-action-1300w.png)

- **Action**: Invokes a method on the dispatcher
- **Dispatcher**: Handles a given action by (1) Emitting an event with a payload (2) to a specific store
- **Store**: (1) Listens for events, (2) updates its internal data in response, and (3) notifies the view of its updates
- **View**: Queries the store and updates itself according to changes in the store

Components on the views can also invoke action methods in response to store changes, bringing the loop full circle.

### ReactJS

**React JS** is like the ***View (V)*** in **MVC**: A light-weight framework that allows for high performance, up-to-date views. It is great as a view layer, but not intended to be a full-fledged framework.

**Flux** is an *alternative* to the _MV*_ patterns

**React Advantages:**

1. Uses a *Virtual DOM* and does *DOM Diffing*: High Performance and relatively inexpensive to re-render compared to entire DOM changes

2. Uses *JSX*: Allows embedding of HTML elements into Javascript Syntax (Has to be transpiled into JS in order to be understood by browser (`React.createElement`))

#### More on Flux

**Dispatcher** is:

1. Central hub of the application
2. It is a registry of callbacks
3. When new data comes in, the dispatcher uses these callbacks to propagate data to the stores

**Action** is

1. Something that are fired on page load or user interaction like button click, form submit, and so on (Technically, *action creators* are fired)
2. Actions are provided to the dispatcher in something called as an action creator method

### Flux in React (`Redux` example)

- ***Store***: 

  - Contains entire app's **state/view-model**
    - State is a plain old JS object `{}`
    - State is the single source of truth: only place where app state is kept
  - Contains **logic** to change its state
    - Predefined list of all mutations called ***Action Handlers*** (reducers)
    - Mutations are always ***synchronous***
  - **Listens** for and reacts to ***dispatched actions***
    - No traditional getters/setters
    - Change requests are broadcasted in
    - Cannot mutate state in any other way (Hence, very helpful for scalabiity!)
    - Therefore, ***Immutable*** or not directly mutable
  - **Emits** notifications to listeners when changes to state occur

  ```
  *** Working of a store ***
  1. Listens to incoming actions
  2. Action handler (reducers) check if an incoming action is valid
  3. Processes valid actions and changes the state/model
  4. Emits notifications to listeners (usually views) that state/model has changed
  
  *** Advantage of a store ***
  It is event-based (listeners and notifications). This makes it extremely decoupled from everything else. Dependencies are broadcast in and broadcast out, it doesn't care where it is coming from or where it is notifying stuff.
  ```

- ***Smart component:***

  - Subscribes to store
  - *Reacts* to store's state
  - It itself is stateless
  - Cannot change itself directly
  - A *pure* function of state
  - Composes dumb components
  - A.k.a Controller-Views

- ***Dumb component:***

  - 100% decoupled from store, smart component, and each other
  - *Pure/Reactive*
  - Reusable
  - Composable
  - All dependencies are inject via ***props*** (No other dependencies)

*Smart* + *Dumb* components form the ***View***

Example of a dumb component:

```react
/* A Dumb Component: */
const People = (props) => {
  console.log(props);
  let list = props.people.map(p => (
    <li>{p.name}</li>
  ));
  
  return props.people.length ? 
    (<ul>{ list }</ul>) : 
    (<strong>No People</strong>);
}
     
let peeps = [
  {
       name: 'Pushkar'
  },
  {
       name: 'Kevin'
  },
  {
       name: 'Rahul'
  }
];

/* A smart component will compose dumb components: */ 
ReactDOM.render(<People people={peeps} />, document.getElementById('app'));
```

- ***Actions***
  - These are plain old JS objects `{}`
  - The requirement is a **`type`** key which specifies which mutation to the state must be applied (which action handler must be invoked)
  - `type` must be unique across app (else, collisions)
  - Rest of the architecture is up to you (minimalism is recommended)
  - An action
    - Asks the store to make a mutation, and hangs up
    - It is blissfully ignorant - does not care how the store handles this request further
    - It is not aware of current state, how mutation occurs, nor if mutation has occurred (decoupled)

```js
/* An action: */
{
    type: 'ADD_PERSON', // required
    payload: { // all other properties (data) are optional
        name: 'Pushkar DK',
        age: 25,
        country: 'India',
        likes: ['pizza', 'dosa', 'coca-cola']
    }
}
```

- ***Action Handlers***
  - Expects the ***incoming state*** and an ***action object***
  - Usually a *switch* statement
  - You have a finite set of mutations predefined. 
  - We check if the action type matches one of the predefined mutations
  - If it does, we perform a mutation. Else, do nothing

```javascript
function incrementCounter(state = 0, action) {
    switch(action.type) {
            case 'INCREMENT_COUNTER': return state + 1;
            case 'DECREMENT_COUNTER': return state - 1;
            default: return state;
    }
}
```

- ***Action Creators***
  - A function that returns an ***action*** object
  - Abstracts away the details of the acton object structure
  - We need to dispatch an action to the store
  - That is, call ***dispatch*** passing an action creator that dispatches an action object to the store which will be handled by an action handler (reducers)

```javascript
export function addTodo(text) {
    return {
        type: 'ADD_TODO',
        text
    }
}
```

Example of a smart component:

```javascript
import { dispatch } from './store';
import { addTodo } from './add-todo';
import { Dumb } from './dumb'; // Smart component will compose dumb components

// To be passed into Dumb component
let add = text => {
    disptach( addTodo(text) )
};

// Later usage:
<Dumb addAction={add} />
```

The whole flow of a **Fluxy** app in **React** can be visualized as follows:

```
1. Action Creator
  2. Creates an action object
    3. This action gets dispatched to the store by a dispatcher
      4. Store is receives action by an action handler (reducer/listener)
        4. If action's 'type' is valid, mutation occurs on store's state/model
          5. Store notifies subscribers (views) that state has changed
            6. Views (Smart) get notified of state change (& tell Dumb ones via props)
              7. Views may dispatch an action via action creators on user interaction
              [Therefore, Loops back to action creator, maintains unidirectional flow!]
```

**Note**: An action creator (action) could make API calls (say, REST API calls) to get the data to be dispatched!

### Advantages of a fluxy app:

1. Every unit is testable, reusable, composable, a pure function, and encapsulated
2. Unidirection data flow and so, is very easy to maintain or debug (unlike MVC)
3. Highly scalable: Due to the ***emitter - listener*** model, the complexity does not increase heavily
   1. Add more dumb components: No effect on complexity (Number of smart components notifying these dumb components does not change)
   2. Add smart components: No effect on complexity since store that notifies that smart components does not change (or is unaware of how many smart components are subscribed to it)
   3. Add action handlers: May result in creation of more action creators too! But, it is still okay since the complexity is not growing - still undirectional data flow.

**Visualization of a Fluxy app with React**

```
(1) Action creator <===========> API calls
|
| 
(2) Dispatch
|
|
(3) Store
|
|
(4) Smart Component
|
|
(5) Dumb Component
|
|
{ User } ---> Capable of calling action creator (event clicks, form submits, etc)
```

