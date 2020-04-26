 # Webpack 4

[Frontend Masters: Webpack 4 Fundamentals](https://frontendmasters.com/courses/webpack-fundamentals)



## Running an NPM module from "scripts"

When NPM installs packages, it creates a folder in `node_modules` called `.bin`. This folder contains all the executable files of the modules we just NPM installed.

If we try to execute any of these executables by typing their names on the CLI, it will not run (unless it is a global install whose folder was added to the PATH variable)! 

NPM **"scripts"** allow you to access these executables. It creates a scope around these executables for easy access. Defining something like `"scripts": { "webpack": "webpack" }` in the *package.json* will now enable us to run webpack by typing `npm run webpack` in the CLI.



## Default Webpack input & output

When you run "npm run webpack" and it triggers webpack. without any options, the entry point defaults to `./src` (such as an `index.js` or `index.ts`) and the default output is at `./dist/main.js`



## NPM allows you to reference scripts inside others

We can run `npm run <somescript>` inside another one:
```js
"scripts": {
	"webpack": "webpack",
	"prod": "npm run webpack -- --mode production",
	"dev": "npm run webpack -- --mode development"
}
```

Using `--` inside an npm script specifies that we "pipe" the following commands into the preceding command. Therefore the `prod` script is basically equivalent to `webpack --mode production`.



## Webpack for different modes

We can build for different levels of optimisation such as development and production. We generally do this with the `--mode` option followed by an environment. The `development` and `production` environments are the most common ones. The latter tries to optimise code by minifiying it and so on.



## Inspecting (Debugging) a node script

We can use the `--inspect` and `--inspect-brk` params to debug a node script. For example, 
we can run `node --inspect --inspect-brk ./src/index.js`. It can be debugged from here on from a browser that supports it (Chrome) or an editor that does (VSCode).

In Chrome, if we open `chrome://inspect` we see this node script as one of the targets and we can click to open the devTools for it. The debugger will be paused on the first line initially. The console has access to everything that node has (`process`, `global`, etc).

We can debug webpack executable in the same way too!:
```js
"scripts": {
	"debug": "node --inspect --inspect-brk ./node_modules/webpack/bin/webpack.js",
	"dev": "npm run webpack -- --mode development",
	"dev:debug": "npm run debug -- --mode development"
}
```



## Adding a watcher to Webpack

We can specify the `--watch` option to the webpack command:
```js
"scripts": {
	"webpack": "webpack",
	"dev": "npm run webpack -- --mode development --watch"
}
```

Any changes to the files touched by the webpack command with re-trigger webpack on them thanks to `--watch`.



## Dependency graph in Webpack

Webpack builds a dependency graph starting from the entry point. You can visualise this dependency graph from the webpack output:
```bash
Hash: b318af23f20ff3a7a7e3
Version: webpack 4.39.1
Time: 265ms
Built at: 04/24/2020 12:39:47 AM
  Asset       Size  Chunks             Chunk Names
main.js  985 bytes       0  [emitted]  main
Entrypoint main = main.js
[0] ./src/index.js + 2 modules 178 bytes {0} [built]
    | ./src/index.js 95 bytes [built]
    | ./src/nav.js 26 bytes [built]
    | ./src/footer.js 57 bytes [built]
```

- `./src/index.js + 2 modules` are the total dependencies.
- `./src/index.js` depends on `./src/index.js` (itself)
- which depends on `./src/nav.js` and `./src/footer.js`

Webpack might alter the above visual description for `development` and `production` mode outputs.



## Mixing CommonJS and ESM modules

Webpack understands both:
- CommonJS (`require` and `module.exports`) and
- ESM (`import` and `export`) 
module types.

```js
// button.js: Uses CommonJS
module.exports = (buttonName) => {
	return `button: ${buttonName}`
}
```
```js
// index.js: Uses ESM
import MakeButton from './button'
console.log(nav(), top, bottom, MakeButton('My button!'))
```

It is not a good idea to use two different module mechanisms in the same module though! In some cases, babel converts all module types to CommonJS before giving it to Webpack. But, this is not needed since webpack understands ESM and CommonJS by itself (making it easier to optimise such as tree shaking)

**Named exports in CommonJS**
```js
// button-styles.js
const red = "color: red;"
const blue = "color: blue;"
const makeColorStyle = color => `color: ${color}`

exports.red = red
exports.blue = blue
exports.makeColorStyle = makeColorStyle

// Importing will be:
// import { red, blue, makeColorStyle } from  './button-styles'
```

**Named exports in ESM**
```js
// footer.js
const top = "top"
const bottom = "bottom"

export { 
	top, 
	bottom 
} // equal to "export top; export bottom"

// Importing will be:
// import { top, bottom } from  './footer'
```



##  Tree shaking in Webpack

Webpack can remove dead code from your app. If a function or module is no reachable or not exported to the final build, it gets tree-shaken (i.e removed from final bundle)

Ex:
```js
// footer.js
const top = "top";
const bottom = "bottom";
export { top, bottom };

// index.js (entry point for webpack)
import { top } from "./footer";
console.log(top)

/*
You will never find "bottom" in the webpack constructed bundle. 
*/
```



## Webpack config

The default config file that `webpack` command looks for is `webpack.config.js` in the root of the project. If you have an empty `module.exports = {}` in the config, it does not matter as webpack applies defaults (if required) post processing of the config file.

**Basic example**:

```js
module.exports = {
	mode: 'none'
}
```

`mode: 'none'` tells webpack to just do what the default behaviour is instead of adding optimizations and so on that are defined in other modes.



## The Webpack bundle output

What is the structure of the webpack bundle?
1. We have an IIFE that encapsulates the whole bundle. This is known as the **webpackBootstrap** (can be thought of as the runtime).
2. It receives one parameter called **modules**
3. The actual modules parameter that gets passed to it is an *array*
4. To be specific, it is an array of more IIFEs.
5. Each IIFE in the array is one module that was added to the final bundle (that we have written, just bundled as an IIFE). Webpack even gives helpful comments on the sides that help identify the module start (with a module id)

```js
(function (modules) {
	// The webpackBootstrap (runtime/initializer) code
	// ...
})([
	(function () { /* Our module 0 */ })(),
	(function () { /* Our module 1 */ })(),
	(function () { /* Our module 2 */ })(),
	// ...
])
```

The "module 0" is actually the **entry point** module to webpack.

The **webpackBootstrap** does the following:
1. It contains a module cache
2. It has a function called `__webpack__.require`
3. It sets up other functionalities such as object freeze, takes care of cyclic dependency, etc
4. It invokes `__webpack__.require` with the first module's id (0).

Inside **`__webpack__.require`**:
1. It receives an id (Refers to a module id)
2. If module is present in module cache, it loads the module's exports from there and returns them
3. If module is not present in cache, it loads the module from the module array passed to it is executed and its exports are saved & returned
5. The module when run has access to `__webpack__.require` itself so that it can require more modules. In this way, the entry point loads its dependencies, which load their dependencies, and so on (loading the full dependency graph)

`__webpack__.require` is the **only runtime action** (during bundle execution) of webpack. Everything else is *static*. That is, everything else runs at the time of build (bundle creation)



## Webpack core concepts

There are 4 core concepts.

### 1. Entry

The entry point tells webpack what to load for the browser. We define a file that webpack must access and recursively add the imported contents of the modules that the current module depends on. Thus, it creates a graph (of dependent modules)

```js
module.exports = {
	entry: './src/browser.js' // Relative path from config file to entry file
}
```

The `entry` property works in conjunction with the `output` property.

### 2. Output

This tells webpack *how* and *where* to distribute bundles (compilations). Works with the `entry` property.

```js
module.exports = {
	entry: './src/browser.js',
	output: {
		path: './dist',
		filename: './bundle.js'
	}
}
```

### 3. Loaders

Loaders are mentioned within the **`module.rules`** property (an array). These tell webpack to **modify files before it is added to the dependency graph**.

Loaders are essentially **javascript modules** (such as an npm module) that takes in a file and transforms it. At their core, loaders are just functions that take an input and produce an output.

```js
module.exports = {
	module: {
    rules: [
			{ test: /\.ts$/, use:  'ts-loader ' },
			{ test: /\.js$/, use:  'babel-loader ' },
			{ test: /\.css$/, use:  'css-loader ' }
		]
  }
}
```

By default, the transformations occur on single files *before* the graph is built (i.e loaders act on individual files) and not on the complete bundle. This helps convert files to formats that webpack can read and parse. For example, a `ts-loader` converts the `.ts` files into javascript.

**Anatomy of a loader**: Takes a source as input and returns a new source as output. It does this on a *per-file* basis. It tells webpack how to interpret and translate a file. Therefore, it makes it possible for webpack to import many kinds of files, not just javascript modules.

- `test`: Regular expression to match the files
- `use`: (Array, String, or Function) Returns the loaders objects
- `include`: Regular expression for files/folders allowed to be transformed
- `exclude`: Regular expression for files/folders not allowed to be transformed
- `enforce`: `"pre"` | `"post"` (Tell webpack to run rule before or after all the other rules)
- `issuer`: Regular expression array or a String array

#### Chaining loaders

Loaders can be chained in a rule set by passing an array `[]` of loaders to the `use` property. They are applied from `right-to-left`. For example, `['style', 'css', 'less']` is applied from right to left. We can think of this as a `style(css(less()))` nesting.

**Note**:
- The less or sass loader (Ex: `less-loader`) converts less/sass files into css
- The `css-loader` converts css into an in-memory array of css rules (i.e Contains the css rules as an array in javascript)
- The `style-loader` takes the in-memory css rules created by the css-loader and feeds it into a javascript module that creates a `<style>` tag to input all the css into it.

### 4. Plugins

Plugins allow you to add functionality to *compilations*. That is, enhance the generated bundle modules. They are powerful because they have access to the compiler and can listen to events and read the compiler data ("event-driven architecture")

Loaders are only useful on a *per-file* basis but with plugins, you can access the *entire bundle*. Example plugins are UglifyJS, compression, etc.

**Plugin anatomy**

A plugin basically is an object (defined as an instance of a class). The class for it is what is written in the plugin itself and is instantiated inside webpack.

The prototype has to have an `apply` property which is a function that receives a reference to the webpack compiler. Since it is an event-driven approach, we can plug into the compiler's events and do stuff.

```js
// ES5 style of a plugin:
// Example shown: A plugin that sends a character (ding! sound) to the process standard error if there is an error in the bundle creation.

function dingPlugin () { }

somePlugin.prototype.apply = function (compiler) {
	if(typeof process !== undefined) {
		compiler.plugin('load', function (stats) {
			if (stats.hasErrors()) {
				process.stderr.write('\x07')
			}
		})
		compiler.plugin('failed', function (err) {
			process.stderr.write('\x07')
		})
	}
}

module.exports = dingPlugin
```

This `apply` method will get invoked by webpack when the plugin is incorporated into its config.

The plugins can be shipped as stand-alone NPM modules (common).

**Webpack config for plugins**

Since plugin provides a class (Constructor), we invoke it using the `new` keyword and place it inside the `plugins` array.

```js
const dingPlugin = require('webpack-ding-plugin')

module.exports  = {
	plugins: [
		new dingPlugin(),
		//...
	]
}
```

Webpack itself is *80%* composed of plugins. It helps with their dog-fooding, improves flexibility (can add and remove functionality on the fly), etc.



## Passing variables to Webpack 

Webpack config can actually be a function that returns an object (i.e the config itself) instead of a plain object. This allows us to pass in variables to this function.

The **`--env`** flag is special because the value is sent as a parameter to the webpack config function. The pattern is **`--env value`** in CLI and will be available as a parameter to the function.

We can also pass in mutliple properties which become available as properties of the env object in the config. Dot notation (`.`) is used send properties via CLI (Ex: **`webpack --env.mode production`**).

```js
module.exports = ({ mode }) => ({
  mode,
  output: {
    filename: 'bundle.js'
  }
})
```



## Adding Webpack plugins

**Steps**:

1. Require the plugin module
2. Create the `plugins` array if it doesn't exist
3. Instantiate the plugin with the `new` keyword within the plugins array

**Note**:

- Webpack itself provides access to the plugins it encapsulates (without having to install them separately). We can access these by requiring `webpack` in our config and the plugins are now available as properties of it.

- We usually install the plugins as dev dependencies (**`npm i html-webpack-plugin -D`**).

```js
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = ({ mode }) => ({
  mode,
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.ProgressPlugin()
  ]
})
```

What is **HtmlWebpackPlugin** (`html-webpack-plugin`)?

- It is a plugin that takes your bundle and attaches it to an HTML file that the plugin creates. By default, the generated HTML file is placed inside the weback defined output folder path.
- It helps us move into "browser-land" with access to DOM and all.
- It is helpful because we can now do multiple things: Keep a dev server running to test our changes, Generate HTML for the final production SPA, etc.



## Setting up a dev server

A development server is useful while writing and debugging code. It

- Helps us auto reload the server thereby giving us a chance to view our changes instantly on thr browser
- It does not generate a bundle in the output folder. That is reserved for the actual `webpack` command

We can install it using the command: `npm i webpack-dev-server -D`. When we run the dev server script, we would replace `webpack` command with `webpack-dev-server` instead.

```js
// Example package.json:
//...
"scripts": {
    "webpack-dev-server": "webpack-dev-server",
    "dev": "npm run webpack-dev-server -- --env.mode development --watch"
  },
//...
```

**How does it work?**

- The library creates an ExpressJS server when executed
- The output that gets generated by running webpack will be *stored in memory* (not the output folder) and passed on to Express via a socket connection
- Whenever the bundle changes by editing any of our modules (`--watch` not required on the script, `web pack-dev-server` will take care of watching for edits) and a new build becomes available, the message is sent to the Express server and it reloads the server (which helps reflect the changes on the browser)



## Splitting environment config files

We can use the **`webpack-merge`** to split configs for different environments by splitting them. Inside our main config, we can return the webpack merge output instead of the basic config.

Install `webpack-merge` with **`npm i -D webpack-merge`**

Example:

- We can require an environment specific config in our base config file
- Pass or invoke the environment config with the environment vairables accessible to base config (`env`)
- Return WebpackMerge output by combining base config *(first param)* and env config *(second param)*

```js
// webpack.config.js:
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);

module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
  return webpackMerge(
    {
      mode,
      output: {
        filename: "bundle.js"
      },
      plugins: [new HtmlWebpackPlugin(), new webpack.ProgressPlugin()]
    },
    modeConfig(mode)
  );
};
```

```js
// ./build-utils.webpack.js:
module.exports = () => ({
  output: {
    filename: "[chunkhash].js"
  }
});
```

In the above example, the conflicting config values in base config (1st param of webpack merge) are overriden by the production config (2nd param of webpack merge)

**webpackMerge** can be thought of as `Object.assign` for config files. We can *pass any number of configs to be merged.*



## Loading CSS

If we want to add CSS to our bundle, we can do so by ***importing*** the css into our JS files.

- We need the CSS loader (`css-loader`) to convert the imported JS file into an array of stringified CSS rules. Without this, webpack will throw an error.

```js
// ./footer.js:
import css from './footer.css'

console.log(css) // ["./src/footer.css", "#footer {↵  width: 100px;↵  height: 100px;↵  background-color: teal;↵}", ""]

// Note: We can also just do "import from './footer.css'" without giving a variable export.
```

- We can feed this array into the Style loader (`style-loader`) which takes it and creates a js module that will render a **`<style>`** tag in the HTML document with the styles from the array when it runs.

```js
// webpack.config.js:
// ...
	module: {
    rules: [
      { 
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
// ...
```

Additionally, if our CSS was written using a pre-processor such as SASS or LESS, we can add its loader first so that the input is now css for the `css-loader`. 

Ex: `use: [ 'style-loader', 'css-loader', 'less-loader' ]`

### Hot module replacement with CSS

What if we had complex states in a module and changing something in it would reload the browser again repeating the delays in re-executing a module? In such a case, it would be ideal if changing something in CSS will not reload the whole dev server but only reflect the changes in the browser directly.

This is possible with **Hot Module Replacement (HMR)** where the dev server is not reloaded but only the changes are made directly on the browser. For example, changing background of a div from blue to green will reflect on the browser but will not trigger a page refresh where everything has to load again!

Provide the **`--hot`** option to the `webpack-dev-server` to enable this feature. 

Ex: `"dev": "npm run webpack-dev-server -- --env.mode development --hot"`

### Extracting CSS into a separate file

By default, using the loaders for CSS (`style-loader`) will add the CSS into the `<style>` tag. The problems with this are:

- It blocks your JS since a module to load the CSS into the `<style>` tag has to execute
- Does not separate out your JS and CSS

There is a plugin available to extract your CSS into separate files. It is called **`mini-css-extract-plugin`**.

This will automatically inject `<link>` tags with the path to the generated CSS inside your **HtmlWebpackPlugin** generated HTML.

The **`mini-css-extract-plugin`** needs a plugin as well as a ***loader*** which replaces the `style-loader`. By default, it will output a `main.js` by default in the output folder.

```js
// ./footer.js
import './footer.css'
import './button-styles.css'
```

```css
/* ./dist/main.js: */
#footer { /* From footer.css */
  width: 100px;
  height: 100px;
  background-color: black;
}
button { /* From button.css */
  font-family: fantasy;
}
```

```html
<!-- ./dist/index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Webpack App</title>
  <link href="main.css" rel="stylesheet"></head>
  <body>
  <script type="text/javascript" src="bc943f5e1c800dd6b84d.js"></script></body>
</html>
```



## File Loader and URL Loader

The `url-loader` loads images from our source image into our bundle by creating a base64 encoding of it.

Basic usage:

```js
// webpack config:
rules: [
  {
    test: /\.jpe?g/,
    use: "url-loader" // can be a string if it's just one loader
  }
]
```

For example:

```js
import exampleImage from './example.jpg'
//...
const image = document.createElement("img")
image.src = exampleImage
//...
```

The above image will be saved as base64 data within javascript and when attached to an image to be rendered, will be seen in the HTML image source as base64 itself.

```html
<img height="100" width="100" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABA....q7sh9tp+t9MbZl4pMj6AdLJKj/9k=">
```

If we want to limit the file sizes that get loaded as base64 within the bundle, we can set a `limit` inside the loader's `options` property. The value has to be in ***bytes***. Any file that exceeds this limit will be output as a separate file in the output folder of webpack.

```js
// webpack config:
module: {
  rules: [
    {
      test: /\.jpe?g/,
      use: {
        loader: "url-loader",
        options: {
          limit: 1024 // 1kb
        }
      }
    }
  ]
},
```

The image when supplied as source to an `<img>` tag will be the following (by default, a hashed file name for the image):

```html
<img height="100" width="100" src="c78ccdf55308749dbc6a3806f42d1382.jpg">
```

**What is `file-loader`?**

We do not have to use `file-loader` directly but still need to install it along with `url-loader` because if we have limits on file sizes such as in the example above, it internally uses `file-loader` to create a separate image, output it to the output folder of webpack and so on.



## Presets 

Webpack presets (not to be confused with babel presets) are a way to test something that does not necessarily go into production or development. It can be an ad-hoc feature or a one time check, and so on. 

There is no particular syntax for this because a preset can include anything that a normal webpack config includes. But, since it is ad hoc, we can have a webpack config that runs a preset file that it receives as an argument to it. And, this file name can be passed conditionally, say, from an NPM script and not part of dev or prod build.

A good setup will be to have a webpack config that:

- Receives the presets to include via params
- Requires the preset files (i.e preset config files)
- Merges all the preset configs using `webpack-merge` and returns the final config

The final preset config itself can be merged with the rest of the config. 

**What is the advantage?**

The advantage is that if the preset is not specified in the params that are passed to webpack, it will not be loaded. In the NPM scripts, we can define a separate script just for testing add-ons (temporary features).

**A sample such setup**:

```js
// A presets loader file that checks for preset configs based on the preset names passed to it.
const webpackMerge = require("webpack-merge");

const applyPresets = (env = {presets: []}) => {
  const presets = env.presets || [];
  /** @type {string[]} */
  const mergedPresets = [].concat(...[presets]);
  const mergedConfigs = mergedPresets.map(presetName =>
    require(`./presets/webpack.${presetName}`)(env)
  );

  return webpackMerge({}, ...mergedConfigs);
};

module.exports = applyPresets;
```

```js
// The main webpack config:
module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
  return webpackMerge(
    {
      //...
    },
    modeConfig(mode),
    presetConfig({ mode, presets })
  );
};
```

```js
// NPM Script or webpack options:
"prod:typescript": "npm run prod -- --env.presets typescript"
```

There are a few plugins that can be used as presets.

### Bundle Analyzer Plugin

This is a really cool webpack plugin and is a perfect case for a preset style webpack build. The plugin:

- Starts a separate dev server
- Displays a tree map of your bundle and the modules it contains
- Essentially, it has the stats for your bundle (Which modules were included, size of each, why wasn't it tree shaken, etc)

```js
// webpack config:
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// ...
module.exports = {
  //...
  plugins: [
    //...
    new WebpackBundleAnalyzer(),
    //...
  ]
}
```

### Compression Plugin

Compresses the bundle using any of the compression techniques (`gzip` is default).

```js
// webpack config:
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// ...
module.exports = {
  //...
  plugins: [
    //...
    new WebpackBundleAnalyzer(),
    //...
  ]
}
```

### Source Maps

Source maps are great for *debug driven development*. We want to generate source maps but this increases the build time (trade-off).

Add the **`devtool: "source-map"`** property in the root of the webpack config. We can use different values for this property to generate source maps of different levels of detail. Check the documentation of webpack for this.

Perhaps we can load source maps as presets so that only when we want to debug, we can have it.

## Building a library: Should you use Webpack?

The answer is **NO**. 

The reason is that if the library is *pre-bundled* using Webpack then when it is imported in one of third-party code bases, Webpack will not be able to analyze and tree-shake it (along with other optimisations). 

It is better to ship the ES6+ source code such that Webpack in the consumer code can optimize and bundle it.

## Building a library: Should you use Babel to transpile it before others use it?

The answer is **NO**.

The reason is that if the library is transpiled completely (including the modules) then it poses the same problem as in the previous question. That is, webpack cannot tree-shake and optimize it *if the transpile has **pre-converted** the modules into CommonJS/AMD/etc*. 

## Using Babel-ify (`babel-loader`) with Webpack

We can babelify our code but **not** transform the modules. Webpack understands ES6+ ou of the box thanks to the "acorn" parser that it uses.

There are many presets (such as `env`) that convert the modules into CommonJS or AMD or UMD so that it works in the browser. We can do this in webpack `output` itself ad not babel because it gives us the power to tree-shake and optimize the code (Remember: If code is already bundled as CommonJS or AMD, Webpack cannot optimize it). 

Add the `"modules": false` property in babel config such that it is not bundled into CommonJS/AMD/UMD by itself.

We can, however, add the presets that do not modify the modules. Use babel if the environment does not understand ES6+ syntax but leave the modules to be handled by Webpack.

---


