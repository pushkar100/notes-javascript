# Babel Usage Tutorial (with React)

## Basic setup

NPM install as dev dependencies, `@babel/core` and `@babel/cli`

## Executing

`npx babel <filename>`

Ex: `npx babel es6.js` will print to console, the transpiled source of `es6.js`

NPX lets us run the node module executables. It allows for the scoping of modules inside the package (i.e `npx <pkg-command>` is the same as `node_modules/.bin/<pkg-command>`

## Output to a file

`npx babel <filename> -o <outputfilename>`. You may use `-o` or `--out-file`

Ex: `npx babel es6.js -o es5.js`

**Drawback**: Reads only 1 file and outputs it to another

## Run on multiple files

`npx babel <source-folder> -d <output-folder>`. Runs on all files in specified folder and creates corresponding transpiled files in output folder

Ex: `npx babel src -d dist`

## Configuration (`.babelrc`)

- Create a `.babelrc` in the root of your project. Babel will make use of this file by default
- It is a JSON file.
- The most common property is a `"preset"` which is an array []
- A preset defines a collection of plugins. The `@babel/preset-env` is used for targeting browser. So, it contains plugins for transpiling to browser
- We can provide a "string" of presets or and "array" of presets. 
- If it is an array, the first element is the string (name of the preset) and the second is an options object `{}` 
- Inside this object we can `target` specific browser versions, `useBuiltIns`, and many other things

```js
// .babelrc:
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "edge": "17",
                    "chrome": "67",
                    "firefox": "60",
                    "safari": "11.1"
                },
                "useBuiltIns": "usage"
            }
        ]
    ]
}
```

### Babel config inside `package.json`

We can take our entire `.babelrc` and store it inside `package.json` under the **`babel`** property and it still works.

Example:
```json
{
  "babel": {
      "presets": [
          [
              "@babel/preset-env",
              {
                  "targets": {
                      "edge": "17",
                      "chrome": "67",
                      "firefox": "60",
                      "safari": "11.1"
                  },
                  "useBuiltIns": "usage"
              }
          ]
      ]
  }
}
```

## `babel.config.js` versus `.babelrc`

`.babelrc` is capable of transpiling files within the same directory and below

`babel.config.js` can transpile files anywhere in the project

Keeping `.babelrc` in the root of the project must suffice

## Babel Polyfills

By default, babel "translates" the code while transpiling. This is not enough all the time.

For example, using `Promise`, `async/await`, `Map`, etc (newer ES6+ only features) cannot work on older browsers because a translation to ES5 does not exist

We need to add polyfill code to make them work. That is, we need to add functions that mimic the functionality of these ES6+ features in ES5.

A **polyfill** handles missing features.

The `useBuiltIns` property on the preset's options is used for polyfilling.
1. `usage`: The most common value. It requires the polyfills by analyzing our code and only adding what is needed by it.
2. `false`: Does not add polyfills
3. `entry`: This checks the browsers that are targeted and adds all the polyfills needed for those browsers. It will add the browser polyfills even if our code does not use it. Along with entry, we need to add `require('@babel/polyfill')` at the top of the file we wish to include all the browser polyfills.

```js
// Our source file
require('@babel/polyfill'); // Needed to make sure all browser target polyfills are added to this file
//...
//...
```

**Best**: `usage` value. Only adds plugins required by the file

The transpiled file will contain `require` statements to fetch the polyfills. The built-in polyfills are available in `node_modules/corejs` module

```js
// A transpiled file containing polyfills:

"use strict";

require("regenerator-runtime/runtime");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

// ...

```

## Babel Plugins

Plugins help extend support for proposals to the JS language that are extremely new. These are in `stage-2` or below and hence, not included in any presets.

We can, however, use them by adding specific plugins for the same.

**Example**: Using pipeline operator `|>`
```js
const  transformIt  = (str) =>  str.toUpperCase();
let  helloModified  =  'Hello'  |>  transformIt;
```

If we run babel without adding any plugins, we get an error. The error also tells us that we must use a particular plugin to make it work.

Install `@babel/plugin-proposal-pipeline-operator` as dev dependency.

Edit the `.babelrc` to include this plugin and specify its options (similar to preset structure)

```js
{
	"presets": [ /* presets go here */ ],
	"plugins": [
		[ 
			"@babel/plugin-proposal-pipeline-operator", 
			{ "proposal":  "minimal" }
		]
	] 
}
```

## Note on plugin & preset syntax in `.babelrc`

Both `presets` and `plugins` are arrays `[]`.

```json
{
	"presets": [],
	"plugins": []
}
```

Each plugin can be a string specifying itself `"<name>"` or an array with two elements, the first being the name and the second an options object `["<name>", { /* options go here as properties */ }]`.

## Babel for React

Babel does not know how to react React's JS syntax and convert it into normal JS functions. Even `@babel/preset-env`  cannot understand this.

For being able to **transpile JSX in React**, install `@babel/preset-react` package.

We will add this preset to the list of presets (already containing `preset-env` to convert ES6+ to ES5) so that now we can also transpile JSX in React.

```json
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ],
    "plugins": [/* Plugins list */]
}
```
