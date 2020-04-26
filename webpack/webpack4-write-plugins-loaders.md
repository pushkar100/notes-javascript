# Webpack Plugins

Webpack is 80% plugin based.

The power of Webpack is its extensibility which is provided by plugins. We should be able to use them and even build our own custom plugins



## Tapable & compiler

The compiler refers to the Webpack compiler.

Tapable is a class that helps you hook on to the compiler's events. In fact, the compiler class in Webpack extends the Tapable class and defines the hooks you can use.

Hooks are nothing but events your plugin can latch on to.

```js
// Compiler.js (inside Webpack):
class Compiler extends Tapable {
	constructor(context) {
		super();
		this.hooks = {
			/** @type {SyncBailHook<Compilation>} */
			shouldEmit: new SyncBailHook(["compilation"]), // hook
			/** @type {AsyncSeriesHook<Stats>} */
			done: new AsyncSeriesHook(["stats"]),          // hook
			/** @type {AsyncSeriesHook<>} */
			additionalPass: new AsyncSeriesHook([]),       // hook
			/** @type {AsyncSeriesHook<Compiler>} */
      
      //...
      
    }
    // ...
}
```

The above source code example is Webpack 4. Before this version, the hooks were not definedd this clearly. They were not clearly exposed in the prototype but were instead strings inside the constructor and one had to manually check the available hooks.

**Using Tapable**

When you are writing a plugin, we can hook on to the events that the compiler provides using Tapable internally. 

Tapable is a library that webpack uses to build plugins for itself. It is about `~200` lines of code and is the backbone of the whole webpack architecture.

A plugin needs to be initialized using `new`, remember? Therefore, we write our plugins as classes. Inside this, it is mandatory to have an **`apply`** method. This method receives the `compiler` instance as argument.

We can ` tap` into **`compiler.hooks`** to perform our custom code execution. 

```js
// Webpack's own EntryOptionPlugin:
module.exports = class EntryOptionPlugin {
	/**
	 * @param {Compiler} compiler the compiler instance one is tapping into
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
			if (typeof entry === "string" || Array.isArray(entry)) {
				itemToPlugin(context, entry, "main").apply(compiler);
			} else if (typeof entry === "object") {
				for (const name of Object.keys(entry)) {
					itemToPlugin(context, entry[name], name).apply(compiler);
				}
			} else if (typeof entry === "function") {
				new DynamicEntryPlugin(context, entry).apply(compiler);
			}
			return true;
		});
	}
};
```

`tap` has two arguments: First is a string used for analytics (tells us which plugin hooked on to this event) and the second is our callback itself (that runs on that hook event).

**Note**:

- We cannot directly access `Tapable` instances. We can only do so using `compiler` object.
- Compiler can be found in **`Compiler.js`** file inside Webpack source.



## 7 most important Tapable Instances

### Compiler

As seen earlier, Compiler is the first instance that uses Tapable.

### Compilation

This is the module responsible for create the ***dependency graph***. It contains code to:

- Traverse the graph
- Perform tree shaking, and so on...

The module uses Tapable to latch on to hooks, and it has a ton of hooks!

```js
// Compilation.js:
class Compilation extends Tapable {
	/**
	 * Creates an instance of Compilation.
	 * @param {Compiler} compiler the compiler which created the compilation
	 */
	constructor(compiler) {
		super();
		this.hooks = {
			/** @type {SyncHook<Module>} */
			buildModule: new SyncHook(["module"]),
			/** @type {SyncHook<Module>} */
			rebuildModule: new SyncHook(["module"]),
			/** @type {SyncHook<Module, Error>} */
			failedModule: new SyncHook(["module", "error"]),
			/** @type {SyncHook<Module>} */
			succeedModule: new SyncHook(["module"]),

			/** @type {SyncHook<Dependency, string>} */
			addEntry: new SyncHook(["entry", "name"]),
			/** @type {SyncHook<Dependency, string, Error>} */
			failedEntry: new SyncHook(["entry", "name", "error"]),
			/** @type {SyncHook<Dependency, string, Module>} */
			succeedEntry: new SyncHook(["entry", "name", "module"]),
			// ...
  }
  // ...
}
```

**Note**:

- Compilation can be found in **`Compilation.js`** file inside Webpack source.

### Resolver

It is a module that webpack uses internally to resolve paths to requested modules. It makes use of the node APIs for the same too.

**Advantages**:

- When you give it a path, it checks if the file exists at that location
- It provides you the file if its exists
- It also returns some metadata such as query string data, path, context, and so on

**Note**:

- Resolver can be found in **`Resolver.js`** file inside Webpack source.

### Module factories

Module factories:

1. Take the source of the file resolved successfully by the `Resolver` module, and
2. Put the source into a javascript module of its own

There are more than one module factories:

- `NormalModuleFactory` used by the `NormalModule` 
- `MultiModuleFactory` used by the `MultiModule`, and so on...

### Parser

The parser takes in source javascript (tokens) and creates a tree data structure called the **abstract syntax tree (AST)** (parsable/walkable object).

Webpack uses **acorn** parser which can be experimented with at [astexplorer.net](astexplorer.net).

The Webpack parser:

- Takes in the source module generated by the Module factories 
- Builds the ASTs to be parsed, and
- Helps build the dependency graph by looking for `require()` and `import()` statements (i.e A module with its dependencies)

### Template

It is a module that:

- Does data binding for the modules
- It creates the code we see in our final bundles
- When it creates a chunk, we can see the module and the dependent modules in the chunk. Template module is responsible for this

Template modules has a `render` method that does all of the rendering to the final bundle/chunk.



## Compiler walkthrough

The compiler has 3 main steps:

1. Build the graph:
  1. Takes in the entry module
  2. Resolves the path and gets the source
  3. The source is parser and its dependencies are found
  4. Each dependency's path is resolved and the source is parsed, recursively, which is done using a *Breadth First Search (BFS)*
2. Optimize the graph
3. Render it



## Plugin system code walkthrough

The `entryOptionPlugin` is called which kicks off the whole compiler process as mentioned earlier.



## Writing a plugin

**Steps to creating a plugin**:

1. Write the plugin skeleton and export the module (A `Class` with `apply` method receiving the `compiler` instance is mandatory):

   ```js
   class MyFirstWebpackPlugin {
     apply (compiler) {
       // Plugin code goes here
     }
   }
   
   module.exports = MyFirstWebpackPlugin
   ```

2. Use the plugin in your webpack config:

   ```js
   const MyFirstWebpackPlugin = require('./build-utils/MyFirstWebpackPlugin')
   
   module.exports = {
     // ...
     plugins: [
       new MyFirstWebpackPlugin()
       // ...
     ]
     // ...
   }
   ```

3. We can identify the hook we want to tap into by checking the `compiler` source (or docs, if they are available)

   ```js
   // Webpack's compiler.js file hooks (the hooks available to plugins):
   this.hooks = {
   			shouldEmit: new SyncBailHook(["compilation"]),
   			done: new AsyncSeriesHook(["stats"]),
   			additionalPass: new AsyncSeriesHook([]),
   			beforeRun: new AsyncSeriesHook(["compilation"]),
   			run: new AsyncSeriesHook(["compilation"]),
   			emit: new AsyncSeriesHook(["compilation"]),
   			afterEmit: new AsyncSeriesHook(["compilation"]),
   			thisCompilation: new SyncHook(["compilation", "params"]),
   			compilation: new SyncHook(["compilation", "params"]),
   			normalModuleFactory: new SyncHook(["normalModuleFactory"]),
   			contextModuleFactory: new SyncHook(["contextModulefactory"]),
   			beforeCompile: new AsyncSeriesHook(["params"]),
   			compile: new SyncHook(["params"]),
   			make: new AsyncParallelHook(["compilation"]),
   			afterCompile: new AsyncSeriesHook(["compilation"]),
   			watchRun: new AsyncSeriesHook(["compiler"]),
   			failed: new SyncHook(["error"]),
   			invalid: new SyncHook(["filename", "changeTime"]),
   			watchClose: new SyncHook([]),
   
   			// TODO the following hooks are weirdly located here
   			// TODO move them for webpack 5
   			environment: new SyncHook([]),
   			afterEnvironment: new SyncHook([]),
   			afterPlugins: new SyncHook(["compiler"]),
   			afterResolvers: new SyncHook(["compiler"]),
   			entryOption: new SyncBailHook(["context", "entry"])
   };
   ```

4. The plugin has to `tap` (or `tapAsync` for asynchronous) into the hook. It needs to supply two arguments.

   1. The string identifying the plugin (useful for analytics). It can be the name of the plugin.
   2. A callback method which receives arguments listed below:
      1. Named properties defined for hook. Ex: `stats` in `done: new AsyncSeriesHook(["stats"])`
      2. A callback which must be invoked once we are done with the plugin code

   ```js
   // Example of a function that logs all the asset (chunk) names to the console:
   // We can console.log(stats) to find what information it provides us (Maybe even run webpack in node debug mode to debug with inspector)
   
   class MyFirstWebpackPlugin {
     apply (compiler) {
       compiler.hooks.done.tapAsync("MyFirstWebpackPlugin", (stats, cb) => {
         const assetNames = []
         for (let assetName in stats.compilation.assets) {
           assetNames.push(assetName)
         }
         console.log("Assets: ")
         console.log(assetNames.join(`\n`))
         cb() // The compiler provides a `cb` param by default and it needs this to be invoked else compiler fails and webpack throws and error
       })
     }
   }
   
   module.exports = MyFirstWebpackPlugin
   ```

   ```shell
   # Output in terminal on running webpack
   
   # ...
   Assets:                                                                                 
   6a4054541db6606e000c7cc9054e34b2.jpg
   0.lazy-chunk.js
   1.lazy-chunk.js
   2.lazy-chunk.js
   3.lazy-chunk.js
   4.lazy-chunk.js
   5.lazy-chunk.js
   footer.lazy-chunk.js
   7.lazy-chunk.js
   main.css
   bundle.js
   index.html
   # ...
   ```

**When do we use `tapAsync` & `tap`?**

If the hook is an async class (Ex: `done: new AsyncSeriesHook(["stats"])`) the we use `tapAsync`. If it is a sync hook (Ex: `compile: new SyncHook(["params"])`) then we use the `tap` method.

**How do we latch on to other instances apart from compiler?**

By default, the compiler instance is available to our plugin's `apply` method. 

Some of the compiler's hooks allow us to access other instances as a hook. The parameters to the callback function will contain the reference to the other instance. We can use it to latch on to its hooks now.

```js
class MyFirstWebpackPlugin {
  apply (compiler) {
    compiler.hooks.compilation.tap('MyFirstWebpackPlugin', (compilation, params) => {
      compilation.hooks.seal.tap('MyFirstWebpackPlugin', () => {
        console.log(compilation)
      })
    })
  }
}

module.exports = MyFirstWebpackPlugin
```

```js
// Webpack's compiler.js file:

class Compilation extends Tapable {
	constructor(compiler) {
		super();
		this.hooks = {
			buildModule: new SyncHook(["module"]),
			rebuildModule: new SyncHook(["module"]),
			failedModule: new SyncHook(["module", "error"]),
			succeedModule: new SyncHook(["module"]),

			finishModules: new SyncHook(["modules"]),
			finishRebuildingModule: new SyncHook(["module"]),

			unseal: new SyncHook([]),
			seal: new SyncHook([]),
      // ...
  }
}
```

**Note**:

You can separate your plugins to call smaller plugins (by instantiating and invoking their `apply` method with an instance of a Tapable extended class). This helps keep your plugin code modular.

[API for plugins](https://webpack.js.org/api/plugins/)



## Creating a custom loader

**Steps:** 

- A very basic loader is a function that gets a source string and must return a string back. The sourc that it receives are the source of all the files it matches with.
- It also receives map and meta arguments (2nd and 3rd). Refer the [API for different loader types](https://webpack.js.org/api/loaders/)
- Within this function, we can modify our source string and return it
- A good approach is to parse source, modify the AST, re-build the string, and return the rebuilt string.

```js
// ./my-loader.js
function myLoader (source) {
  // Modify "source" string
  return source
}

module.exports = myLoader
```

```js
// Webpack:
//...
module.exports = {
  // ...
  // If it is a custom loader within the local repository, we need to "alias" it:
  resolveLoader: {
    alias: {
      "my-loader": require.resolve("./my-loader.js")
    }
  },
  rules: [
  	{ test: /\.js$/, use: "my-loader" }
	],
  // ...
}
//...
```


