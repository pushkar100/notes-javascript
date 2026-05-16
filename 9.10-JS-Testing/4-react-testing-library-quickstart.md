# React Testing Library Basics

[Youtube video](https://www.youtube.com/watch?v=GLSSRtnNY0g)

- [React Testing Library Basics](#react-testing-library-basics)
  * [Intro](#intro)
    + [Manual testing](#manual-testing)
    + [Automated testing](#automated-testing)
    + [Test driven development](#test-driven-development)
    + [CRA and RTL](#cra-and-rtl)
  * [First RTL test](#first-rtl-test)
    + [Rendering a component](#rendering-a-component)
    + [Testing component text & properties](#testing-component-text---properties)
    + [Testing events on a component](#testing-events-on-a-component)
  * [A full example](#a-full-example)

## Intro

### Manual testing 

Software is tested manually (Ex: By running it ourselves or playing with it on a browser)

### Automated testing 

Software is tested through scripts

- Manual testing is error prone
- Manual testing is time consuming
- Automated testing tells you exactly what went wrong
- Automated testing can serve as documentation

### Test driven development

`Tests => Develop => Tests`

- Write tests before writing code (**RED**)

- Write minimal code to make test pass (**GREEN**)

- Refactor code for code smells (Optional) (**REFACTOR**)

Write another test and continue the RED-GREEN-REFACTOR cycle

TDD forces us to write tests. Waiting to write tests after writing the code might lead us to neglect writing it at all!

### CRA and RTL

You automatically get support for **`@testing-library/react`** (RTL) once you create a React project using **Create React App (CRA)**

## First RTL test

### Rendering a component

* Before writing a test using RTL we need to ***import React*** & the ***component*** we want to test. We should also *extend the `expect` functionality of Jest to work with RTL* by importing **`@testing-library/jest-dom/extend-expect`**
* First, we need to **render** a component to a ***virtual DOM*** using the **`render`** function provided by RTL
* Second, we can **find elements** of the rendered component by one of the **`getBy*`** methods on it

Example:

```js
import React from 'react'
import Counter from '../Counter'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect' // enhances the expect keyword of Jest
```

### Testing component text & properties 

- We can test a component's properties by rendering it and find an element by many means. Ex: **`getByRole()`**, **`getByDisplayValue()`**, etc
  - It is common to use a **`data-testid`** attribute on the component to *find elements* and then use **`getByTestId()`** method during testing. The benefit of this approach is that it separates production code attributes like class and id which may change in the future from testing related code
- Use DOM element properties like **`textContent`**, **`value`**, **`className`**, etc on the rendered elements. These can used to assert inside our tests using the `expect` library of Jest

Example:

```html
<div>
	<h3 data-testid="header">My Counter</h3>
  <h2 data-testid="counter">...</h2>
  ...
</div>
```

Test file:

```js
test('header renders with correct text', () => {
  const component = render(<Counter />)
  const headerElement = component.getByTestId('header')

  expect(headerElement.textContent).toBe('My Counter')
})

// We can even destructure out the `getByTestId` function:
test('Counter should start with a text of 0', () => {
  const { getByTestId } = render(<Counter />)
  const counterElement = getByTestId('counter')

  expect(counterElement.textContent).toBe('0')
})

test('input contains initial value of 1', () => {
  const component = render(<Counter />)
  const inputElement = component.getByTestId('input')

  expect(inputElement.value).toBe('1')
})
```

### Testing events on a component

- Import the **`fireEvent`**  object from RTL (`@testing-library/react`)
- The `fireEvent` object allows us to simulate many events such as **`click`**, **`change`**, **`focus`**, etc. They are provided as methods on the object
- These methods take in an element on which to fire the event, and optionally an event object for events such as `change` where you need to provide the target and its value, for example

Examples:

```js
test('clicking on add button adds 1 to counter', () => {
  const { getByTestId } = render(<Counter />)
  const addButton = getByTestId('add-btn')

  fireEvent.click(addButton)

  const counterElement = getByTestId('counter')
  expect(counterElement.textContent).toBe('1')
})
```

```js
test('changing input value then clicking on add button works correctly', () => {
  const { getByTestId } = render(<Counter />)
  const addButtonElement = getByTestId('add-btn')
  const inputElement = getByTestId('input')
  const counterElement = getByTestId('counter')

  fireEvent.change(inputElement, {
    target: { value: '5' },
  })

  fireEvent.click(addButtonElement)

  expect(counterElement.textContent).toBe('5')
})
```

## A full example

Below is a `Counter` component file and its test file, `Counter.test.js`. The test file is refactored using `beforeEach` to avoid some duplication

```jsx
// Counter.js
import React, { useState } from 'react'
import './Counter.css'

function Counter() {
  const [counterValue, setCounterValue] = useState(0)
  const [inputValue, setInputValue] = useState(1)

  const addToCounter = () => {
    setCounterValue(counterValue + inputValue)
  }

  const subtractFromCounter = () => {
    setCounterValue(counterValue - inputValue)
  }

  return (
    <div>
      <h3 data-testid="header">My Counter</h3>
      <h2
        data-testid="counter"
        className={`${counterValue >= 100 ? 'green' : ''}${
          counterValue <= -100 ? 'red' : ''
        }`}
      >
        {counterValue}
      </h2>
      <button data-testid="subtract-btn" onClick={subtractFromCounter}>
        -
      </button>
      <input
        type="number"
        data-testid="input"
        value={inputValue}
        className="text-center"
        onChange={(e) => setInputValue(parseInt(e.target.value))}
      />
      <button data-testid="add-btn" onClick={addToCounter}>
        +
      </button>
    </div>
  )
}

export default Counter
```

```js
// Counter.test.js
import React from 'react'
import Counter from '../Counter'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect' // expect keyword

let getByTestId

beforeEach(() => {
  const component = render(<Counter />)
  getByTestId = component.getByTestId
})

test('header renders with correct text', () => {
  const headerElement = getByTestId('header')

  expect(headerElement.textContent).toBe('My Counter')
})

test('Counter should start with a text of 0', () => {
  const counterElement = getByTestId('counter')

  expect(counterElement.textContent).toBe('0')
})

test('input contains initial value of 1', () => {
  const inputElement = getByTestId('input')

  expect(inputElement.value).toBe('1')
})

test('add button renders with + sign', () => {
  const addButton = getByTestId('add-btn')

  expect(addButton.textContent).toBe('+')
})

test('subtract button renders with - sign', () => {
  const subtractButton = getByTestId('subtract-btn')

  expect(subtractButton.textContent).toBe('-')
})

test('changing value of input works correctly', () => {
  const inputElement = getByTestId('input')

  fireEvent.change(inputElement, {
    target: {
      value: '5',
    },
  })

  expect(inputElement.value).toBe('5')
})

test('clicking on add button adds 1 to counter', () => {
  const addButton = getByTestId('add-btn')

  fireEvent.click(addButton)

  const counterElement = getByTestId('counter')
  expect(counterElement.textContent).toBe('1')
})

test('clicking on subtract button subtracts 1 from counter', () => {
  const substractButton = getByTestId('subtract-btn')

  fireEvent.click(substractButton)

  const counterElement = getByTestId('counter')
  expect(counterElement.textContent).toBe('-1')
})

test('changing input value then clicking on add button works correctly', () => {
  const addButtonElement = getByTestId('add-btn')
  const inputElement = getByTestId('input')
  const counterElement = getByTestId('counter')

  fireEvent.change(inputElement, {
    target: { value: '5' },
  })

  fireEvent.click(addButtonElement)

  expect(counterElement.textContent).toBe('5')
})

test('changing input value then clicking on subtract button works correctly', () => {
  const subtractButtonElement = getByTestId('subtract-btn')
  const inputElement = getByTestId('input')
  const counterElement = getByTestId('counter')

  fireEvent.change(inputElement, {
    target: { value: '5' },
  })

  fireEvent.click(subtractButtonElement)

  expect(counterElement.textContent).toBe('-5')
})

test('adding and subtracting leads to correct counter number', () => {
  const addButtonElement = getByTestId('add-btn')
  const subtractButtonElement = getByTestId('subtract-btn')
  const inputElement = getByTestId('input')
  const counterElement = getByTestId('counter')

  fireEvent.change(inputElement, {
    target: { value: '10' },
  })

  fireEvent.click(addButtonElement)
  fireEvent.click(addButtonElement)
  fireEvent.click(addButtonElement)
  fireEvent.click(addButtonElement)
  fireEvent.click(subtractButtonElement)
  fireEvent.click(subtractButtonElement)

  expect(counterElement.textContent).toBe('20')

  fireEvent.change(inputElement, {
    target: { value: '5' },
  })

  fireEvent.click(addButtonElement)
  fireEvent.click(subtractButtonElement)
  fireEvent.click(subtractButtonElement)

  expect(counterElement.textContent).toBe('15')
})

test('counter contains correct class name', () => {
  const counterElement = getByTestId('counter')
  const inputElement = getByTestId('input')
  const addButtonElement = getByTestId('add-btn')
  const subtractButtonElement = getByTestId('subtract-btn')

  expect(counterElement.className).toBe('')

  fireEvent.change(inputElement, {
    target: { value: '50' },
  })
  fireEvent.click(addButtonElement)

  expect(counterElement.className).toBe('')

  fireEvent.click(addButtonElement)
  expect(counterElement.className).toBe('green')

  fireEvent.click(addButtonElement)
  expect(counterElement.className).toBe('green')

  fireEvent.click(subtractButtonElement)
  fireEvent.click(subtractButtonElement)
  expect(counterElement.className).toBe('')

  fireEvent.click(subtractButtonElement)
  fireEvent.click(subtractButtonElement)
  fireEvent.click(subtractButtonElement)
  fireEvent.click(subtractButtonElement)
  expect(counterElement.className).toBe('red')
})
```

