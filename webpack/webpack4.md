# Webpack 4

[Source: Udemy](https://www.udemy.com/webpack-from-beginner-to-advanced)

**Contents:**

1. *Introduction*
2. *Basic Webpack Setup*
3. *Loaders*
   1. *Loading an image into Javascript (Importing an image file)*
   2. *Loading CSS files (Importing a CSS file)*
   3. *Handling SASS (Importing an SCSS or SASS file)*
   4. *Handling LESS (Importing a less file)*
   5. *Loading Latest ES6+ Features (Using Babel to transpile)*
4. *Plugins*
   1. *Minification of resulting Javascript bundles*
   2. *Extracting CSS into a separate file*
   3. *Browser Caching*
   4. *Cleaning generated files folder*
   5. *Generating HTML files automatically*
   6. *Customizing our Generated HTML files*
5. *Production versus Development builds*
   1. *`mode` option in webpack 4*
   2. *Managing separate configurations for Production and Development*
   3. *Faster development with `webpack-dev-server`*
6. *Multiple Page Applications*
   1. *How to generate multiple HTML files*

## Introduction

**Q: What is webpack?**
A: Webpack is a *"static module bundler"*. When it processes your apps, it :

1. *Recursively* builds a *dependency graph* 
2. The graph includes *every module in your application*
3. Packages all of those modules into *one or more bundles*

**Q: Why webpack?**
A: Traditionally, we used mutliple scripts on our page and we have to maintain the order of those scripts manually if there were dependencies. This became very cumbersome! Tools like webpack help bundle our scripts and styles required by our application into one or more 'bundled' files with all dependencies resolved within these bundles itself! There are no hidden dependencies - no worries regarding order of scripts. Webpack also handles variety of files: JS, CSS, TypeScript, SASS, LESS, Images, etc (All-in-One)

**Problem with dependency resolution in traditional script loads**

In the following snippet, the script that loads is immediately executed and both these steps are performed in a blocking way. Therefore, when you load multiple scripts, the order of load of these scripts must be maintained manually and mistakes could lead to errors in our scripts:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Traditional script loading</title>
</head>
<body>
	
	<script src="src/index.js"></script> <!-- index: is loaded + executed first -->
	<script src="src/hello.js"></script> <!-- hello: loaded + executed after index -->
</body>
</html>

<!-- Output: -->
<!-- Uncaught ReferenceError: hello is not defined in index.js:1 -->
```

```javascript
/* src/index.js: */
hello();

/* Output:
Uncaught ReferenceError: hello is not defined in index.js:1
*/
```

```javascript
/* src/hello.js: */
function hello() {
	console.log('Hello');
}
```

## Basic Webpack Setup

1. Create `package.json`: Keep track of all external dependencies like webpack needed by the project (`npm init`)
2. Install **`webpack`** and **`webpack-cli`** as dev dependencies: `npm i webpack webpack-cli -D`. `webpack-cli` provides the CLI command 'webpack' in order to run it
3. Once webpack is included in our project (as a dev dependency), we need to ***configure*** it! Webpack stores its configuration in a javascript file typically named **`webpack.config.js`** in the root directory of our project
4. Minimum setup: We need to export an object from the config file (`module.exports = { ... }`) which has 3 mandatory properties:
   1. **`entry`**: Specifies the entry file. This file will import all the other dependencies. Webpack starts resolving dependencies from this file when running the build process
   2. **`output`**: It is an object `{}` that specifies the output **`filename`** of the bundle that is created and define the **`path`** where it will be placed (directory, & webpack creates this directory if it does not exist yet)
      - The path in webpack ***cannot*** be a relative path. It has to be absolute!
      - To have an absolute path, make use of the **`path`** module available to us globally in NodeJS
      - Use **`path.resolve(<current-dir>, <rel-path-from-cur-dir>)`**
      - The current directory can be accessed using **`__dirname`**
   3. **`mode`**: Set it to `none` for now (explained later)
5. Running webpack more efficiently: We can run the webpack command as an **NPM script**. Insert inside `scripts` property of `package.json`, the following: **`"build": "webpack"`**. Now, you can run webpack from the command line with **`npm run build`**
6. Now, instead of adding multiple scripts in our HTML, we wil have *only one script* and this script will load the other scripts (imports). This single script is the `output` file that gets generated according to the webpack configuration. We can import using the ES6 `import` and `export` functionality. 
   1. Webpack, by default, supports ES6 modules
   2. But, *inside webpack configuration itself we cannot use ES6 module import/export*! We have to use **`require`**, that is, CommonJS style module loading
7. Finally, as mentioned in `(5)`, `npm run build` will give you the output

```javascript
/* webpack.config.js: */
const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist')
	},
	mode: 'none'
};
```

```json
/* package.json: */
{
  ...
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
  ...
}
```

```html
<!-- index.html: -->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Traditional script loading</title>
</head>
<body>
	<script src="dist/bundle.js"></script>
</body>
</html>
```

```javascript
/* src/index.js: */
import hello from './hello';

hello();
```

```javascript
/* src/hello.js: */
function hello() {
	console.log('Hello');
}

export default hello;
```

## Loaders

Webpack resolves dependencies, traditionally of javascript files. But, we can do more than just resolve dependencies between just javascript files! We can include and resolve dependencies of Images, CSS, LESS, SASS, Handlebars, XML, and so on. 

We can have javascript depend on these types of files too and generate bundles for them as well. In order to *import all this non-javascript files,* webpack provides us with **loaders**! 

**Q: What are loaders?**
A: Loaders help us *import* files into our javascript. Mostly used to import non-javascript files into our javascript. And, in some cases (like images) loaders output them eventually into our `output` folder.

**Q: How do we add loaders?** 
A: In the following way:

1. We create a **`module`** property (an object) inside the webpack object.
2. Inside `module`, we have a **`rules`** property (another object) inside it. 
3. `rules` is an *array* of specific rules (each rule is an object itself)
4. Every rule has at least two properties: **`test`** and **`use`**
5. `test` takes a *regular expression*. We match *files* (extensions) in this regular expression
6. `use` is an *array* in which we *specify the names of the loaders* that must be used to *import* the type of files matched by the regular expression in `test`
   - **Note**: The `use` array executes loaders in the *reverse order* (from last element to first)
   - That is, webpack uses loaders from *right-to-left*

**Q: How does webpack go about importing files using the `rules`?**
A: In the following way:

1. If it is a javascript file (or a file that webpack intrinsically knows how to import), specifying an additional rule is not necessary
2. If we are importing any other kind of file, it does two things:
   1. If there is no associated `rule` for that filetype's import, webpack *throws an error*
   2. If there is an associated `rule` for that filetype's import, webpack goes to that rule and loads the loader(s) specified in the `use` property

**Note**: The loaders are *npm packages* and need to be ***installed*** before they can be used!

### Loading an image into Javascript (Importing an image file)

We can easily import JS to another JS. But, how do we import an image file into a JS? We can configure webpack (`module > rules > a rule`). The name of the loader used is **`file-loader`**.

Install it as dev dependency: **`npm i file-loader -D`**

**Q: So, what will a `file-loader` do?**
A: It basically:

1. Copies the required file to the *output* folder
2. By default, the file name will be the ***MD5 hash of the file's contents*** with the ***original extension***

**Example**: Assume `car.jpeg` exists in `/src` folder.

```javascript
/* src/add-image.js: */
import car from './car.jpeg';

function addImage() {
	const img = document.createElement('img');
	img.src = car;
	img.alt = 'A car\'s image';
	img.width = 300;

	const body = document.querySelector('body');
	body.appendChild(img);
}

export default addImage;
```

```javascript
/* webpack.config.js: */
const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist')
	},
	mode: 'none',
	module: {
		rules: [
			{
				test: /\.(png|jpg|jpeg)$/,
				use: [
					'file-loader'
				]
			}
		]
	}
};
```

The above snippet, when executed with `npm run build` will output the following image file: `8343e576ef3f3d63cd6235fdf5188ad9.jpeg` in the dist folder (The filename is the MD5 hash of its contents)

But, it will not work since the output HTML contains a broken image (incorrect path): 

`<img src="8343e576ef3f3d63cd6235fdf5188ad9.jpeg" alt="A car's image" width="300">`

We need to load `dist/8343e576ef3f3d63cd6235fdf5188ad9.jpeg` instead.

**Using `publicPath` in our `output` object of webpack**:

We can specify the public directory from which to serve files like images that are output to a certain folder (like `dist/`). Any image or file in the output folder that is loaded in HTML will contain the directory path *prefixed* to it

```javascript
/* webpack.config.js: */
const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist'),
		publicPath: 'dist/' // trailing '/' is important!
	},
	mode: 'none',
	module: {
		rules: [
			{
				test: /\.(png|jpg|jpeg)$/,
				use: [
					'file-loader'
				]
			}
		]
	}
};
```

The image is shown without breaking and the tag now contains:

`<img src="dist/8343e576ef3f3d63cd6235fdf5188ad9.jpeg" alt="A car's image" width="300">`

**Tip**: When deploying to a web server, you can have the `publicPath` reflect the same:

`publicPath: 'http://www.pushkardk.com/'`

Output: `<img src="http://www.pushkardk.com/8343e576ef3f3d63cd6235fdf5188ad9.jpeg">`

### Loading CSS files (Importing a CSS file)

With the advent of frameworks like React, Vue, and Angular, it has become a good pratice to organize our code into *isolated components*. These components define their own behaviour (Javascript) and we can also define their styles (in the CSS). And, we can import these styles to the JS file for this component, mapping every aspect of this component together!

CSS is not JS! Therefore, we need a loader that will tell webpack how to import these CSS files into the JS.

We need two loaders:

1. **`css-loader`**: It reads the CSS from our file and *converts it into a JS representation*
2. **`style-loader`**: It creates `<style>` tags from the CSS and appends to our HTML (from the JS representation)

Both the loaders can be specified in `use` array. `css-loader` must execute first, so we put it at the *end* of the `use` array

CSS files need both these loaders in order to import it!

Load them as dev dependencies: `npm i -D css-loader style-loader`

**Q: What happens when you import CSS files like this?**
A: Unlike file-loader which simply outputs the file into the output, here:

1. The CSS is imported internally as a string into JS (check output bundle - CSS styles will exist in it). Therefore, *no* separate CSS file is output to the `dist folder`
2. The CSS which exists as a module in the final JS bundle is converted into contents of a `<style>` tag and placed in the `<head>` of our HTML (Note: JS places this style tag and it does not exist in the page source!)

Example:

```css
/* src/components/HelloButton.css: */
.hello-button {
	font-size: 16px;
	padding: 5px 15px;
	background: green;
	color: white;
	outline: none;
}

.hello-para {
	width: 200px;
	text-align: center;
	margin: 20px auto;
}
```

```javascript
/* src/components/HelloButton.js: */
import './HelloButton.css'; // This is the format for css/less/sass (No " <name> from ")

class HelloButton {
	render() {
		const button = document.createElement('button');
		button.innerHTML = 'Hello world';
		button.classList.add('hello-button');
		button.addEventListener('click', e => {
			const p = document.createElement('p');
			p.innerHTML = 'Hello World';
			p.classList.add('hello-para');
			body.appendChild(p);
		});
		const body = document.querySelector('body');
		body.appendChild(button);
	}
}

export default HelloButton;
```
```javascript
/* src/index.js: */
import HelloButton from './components/HelloButton';

const hb = new HelloButton();
hb.render();
```

```javascript
/* webpack.config.js: */
const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist'),
		publicPath: 'dist/'
	},
	mode: 'none',
	module: {
		rules: [
			...
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
            ...
		]
	}
};
```

### Handling SASS (Importing an SCSS or SASS file)

It is common practice to use CSS Preprocessors to write maintainable CSS. We can use the same in our projects with webpack.

For SASS, we will use the **`sass-loader`**. It converts your SASS (.scss) files into CSS. `sass-loader` requires **`node-sass`** as a dependency to actually process the files

Therefore:  `npm i -D sass-loader node-sass`

*Steps*: 

1. The SASS loader must run first, so it must be the last loader in the `use` array. It generates CSS
2. Then we have to load our generated CSS normally, using `css-loader` and later `style-loader`

```scss
/* src/components/HelloButton.scss: */
$font-size: 16px;
$color: white;
$background: green;

.hello-button {
	font-size: $font-size;
	padding: 5px 15px;
	background: $background;
	color: $color;
	outline: none;
}

.hello-para {
	font-size: $font-size;
	width: 200px;
	text-align: center;
	margin: 20px auto;
}
```

```javascript
/* src/components/HelloButton.js: */
import './HelloButton.scss'; // importing '.scss' file

class HelloButton {
	...
	...
}

export default HelloButton;
```

```javascript
/* webpack.config.js: */
const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist'),
		publicPath: 'dist/'
	},
	mode: 'none',
	module: {
		rules: [
			...
			{
				test: /\.scss$/,
				use: [
					'style-loader', // take css as js and make style tags in head
					'css-loader', // represent css as js
					'sass-loader' // convert sass to css
				]
			}
            ...
		]
	}
};
```

### Handling LESS (Importing a less file)

Very similar to sass-loader. Instead, here we use **`less-loader`**. Just like SASS, you need an additional dependency that performs the actual processing of Less to CSS. That package is called **`less`**.

Installation: `npm i -D less-loader less`

The concept is the same:

1. Less loader runs. It generates CSS
2. We load CSS normally, by using the css loader first and then the style loader

```less
/* src/components/HelloButton.less: */
@font-size: 17px;
@color: white;
@background: green;

.hello-button {
	font-size: @font-size;
	padding: 5px 15px;
	background: @background;
	color: @color;
	outline: none;
}

.hello-para {
	font-size: @font-size;
	width: 200px;
	text-align: center;
	margin: 20px auto;
}
```

```javascript
/* src/components/HelloButton.js: */
import './HelloButton.less'; // importing '.less' file

class HelloButton {
	...
    ...
}

export default HelloButton;
```

```javascript
/* webpack.config.js: */
const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist'),
		publicPath: 'dist/'
	},
	mode: 'none',
	module: {
		rules: [
			...
			{
				test: /\.less$/, // /\.(less|css)$/
				use: [
					'style-loader', // take css as js and make style tags in head
					'css-loader', // represent css as js
					'less-loader' // convert less to css
				]
			}
            ...
		]
	}
};
```

**Note**: You may run `sass-loader` or `less-loader` on plain `css` files as well. Example:  `test: /\.(css|scss)$/ `

### Loading Latest ES6+ Features (Using Babel to transpile)

For importing plain javascript files, we do not require a special loader in webpack. But, to make sure that the code that is imported works in all browsers is a challenge. We need to transform modern javascript code into slightly older, widely accepted javascript standard (like ES5) that works in your browers & NodeJS.

Most browsers and NodeJS do not yet have full support for the latest ECMAScript standards. But, as developers, we *do not* want to stop writing modern javascript.

The best/common practice is to write our code in ES6+ and use a tool called a ***transpiler*** which converts our code back into ES5 (or similar) so that it can be understood by most browsers and node. **Babel** is the most popular transpiler out in the market that does that. It is a very powerful tool!

Webpack allows us to include a **`babel-loader`** in order to transpile our code. Like some other loaders, the `babel-loader` too depends on another package: **`@babel/core`** which is responsible for performing the actual transpilation of our code!

***Installation*: `npm i -D babel-loader @babel/core`**

**Telling babel what to do**

We need to tell babel up to which ECMAScript standard (or up to which browser version) we want it to transpile down to. This can be done with the use of ***presets***. Common babel preset package name format: **`@babel/preset-<presetName>`**

The most common babel preset is the **`env`** preset which transpiles code down to ES5. It can convert most of our ES6+ code, but not everything!

There are some patterns of code that are not included in the presets. These are usually proposed additions to the specification that have not become official yet (or) the specification is so new that babel has not included it in any preset such as `env`. In case we want to use such features, babel provides us with **plugins**. Common babel plugin package name format: **`babel-plugin-<pluginName>`**

An example of a plugin would be `babel-plugin-transform-class-properties`. We can write class properties without using a constructor (latest addition to JS - still a proposal, I think!) and this plugin would make that code work in our browser by transpiling it down!

***Installation of presets & plugins*, example: `npm i -D @babel/preset-env babel-plugin-transform-class-properties`**

**Note**: `rules` & `use`:

- A `rules`' rule can have another property called **`exclude`** apart from `test` and `use`. This `exclude` property also takes in a regex and does not use the loader on these matching files/directories. Generally, when using babel to transpile, we want to leave out the `node_modules` folder.

- The `use` property can take an array of loader names: `['style-loader', 'css-loader']`
- It can also take a *single loader*. It has to be defined as an object `{}`. 
- When `use` is an object, we define a **`loader`** and **`options`** properties on it. `loader` is the name of the loader being used
- `options` itself is an object. For `babel-loader`, this contains an array of **`presets`** and an array of **`plugins`** (names)

Example: 

```javascript
/* webpack.config.js: */
const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist'),
		publicPath: 'dist/'
	},
	mode: 'none',
	module: {
		rules: [
			...
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: { // Can even be an object for a single loader with more options:
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/env' ], 
                        // presets format: [ '@babel/<presetName>', ... ]
						plugins: [ 'transform-class-properties' ] 
                        // plugins format: [ <pluginName>, ... ]
					}
				}
			}
            ...
		]
	}
};
```

```javascript
/* components/HelloButton.js: */
import './HelloButton.less';

class HelloButton {
	paraClass = 'hello-para'; // class properties, w/o comstructor (new, N/A in preset!)

	render() {
		const button = document.createElement('button');
		button.innerHTML = 'Hello world';
		button.classList.add('hello-button');
		button.addEventListener('click', e => {
			const p = document.createElement('p');
			p.innerHTML = 'Hello World';
			p.classList.add(this.paraClass); // using class prop
			body.appendChild(p);
		});
		const body = document.querySelector('body');
		body.appendChild(button);
	}
}

export default HelloButton;
```

```javascript
/* A snippet of bundle.js: After 'npm run build' */
...
...
/*#__PURE__*/
function () {
  function HelloButton() {
    _classCallCheck(this, HelloButton);

    this.paraClass = 'hello-para';
  }

  _createClass(HelloButton, [{
    key: "render",
    // class properties, w/o comstructor (new, N/A in preset!)
    value: function render() {
      var _this = this;

      var button = document.createElement('button');
      button.innerHTML = 'Hello world';
      button.classList.add('hello-button');
      button.addEventListener('click', function (e) {
        var p = document.createElement('p');
        p.innerHTML = 'Hello World';
        p.classList.add(_this.paraClass); // using class prop

        body.appendChild(p);
      });
      var body = document.querySelector('body');
      body.appendChild(button);
    }
  }]);

  return HelloButton;
}();
...
...
```

**Summary**: List of babel packages used: **`@babel/core`**, **`babel-loader`**, **`@babel/preset-env`**, and **`babel-plugin-transform-class-properties`**

**Note on `stage-x` presets:**

Earlier in babel, we could use presets such a `stage-0`, `stage-1`, etc. These contained transpilation for the latest JS features, including those proposed and not yet official. The stages represent the levels that a new feature must pass through before it becomes official in the spec. It starts from `stage-0` and up to `stage-3` (?).

Babel has **stopped** offering `stage-x` presets starting from `babel version 7`. For any new feature from now on, we must ***explicitly use that feature's babel plugin***, like the `transform-class-properties` plugin. Stage presets will not be allowed!

## Plugins

Plugins are Javascript libraries that can do everything that a loader *cannot* do. A loader can only import different types of files into javascript (& maybe pre-process those files). But, it cannot do anything else. A plugin on the other hand:

- Define globals constants across the whole project
- Minify our resultant bundle so that it consumes less space
- Create new files in the output other than the bundle

Basically, webpack plugins affect our build process, unlike loaders. 

We can have a `plugins` property in our webpack config object and it can contain multiple plugins. Hence, an *array* of plugins

The **syntax** for **`plugins`** is:

```
module.exports = { 
	entry: '...',
	output: {
		...
	},
	mode: '...',
	module: {
        rules: [
            ...
        ]
	},
	plugins: [
        new <pluginName>(),
        ...,
        ...
	]
}
```

The plugins are files themselves. NPM packages. They need to be **imported** into our `webpack.config.js` file (using commonjs format) before they can be used.

Note that plugins are defined ***outside*** of `module` and its `rules`.

### Minification of resulting Javascript bundles

One of the most common tasks is to minify our javascript to save space and reduce N/W latency while requesting them. Webpack has a popular plugin to minify our bundles. The plugin is called **`uglifyjs-webpack-plugin`**.

Installation would be: `npm i -D uglifyjs-webpack-plugin`

```javascript
/* webpack.config.js: */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist'),
		publicPath: 'dist/'
	},
	mode: 'none',
	module: {
        rules: [
            ...
            ...
        ]
	},
	plugins: [
		new UglifyJsPlugin()
	]
};

/* Experiment with a certain bundle: 
Resulting minified bundle was 7.8KB compared to the 22.2KB of the unminified bundle */
```

### Extracting CSS into a separate file

Drawbacks of the CSS & Style loaders: The CSS is represented in the Javascript bundle and the style loader loads the CSS from this bundle into the DOM as `style` tag only when the bundle has been loaded. Therefore, 

1. The bundle size increases - takes more time to download the script in the browser
2. The CSS is added from JS into the DOM after bundle is executed (during runtime). Therefore, there is a delay between first paint and first meaningful paint (with CSS)

These drawbacks do not matter during development phase, but performance matters during production!

Using a *CSS Extractor plugin*:

1. Will help you have two bundles - one for JS and one for CSS
2. The Javascript bundle will be smaller and loaded faster
3. The CSS file can be confirgured to be downloaded in parallel

The css extractor plugin we will use is called **`mini-css-extract-plugin`**

The plugin syntax: `new MiniCssExtractPlugin({ filename: '<output-css-filename>.css' })`

**Note**: The `MiniCssExtractPlugin` comes with a **"loader" **(**`MiniCssExtractPlugin.loader`**). We need to use this loader instead of the `style-loader` because we do not want to embed styles inside our DOM, instead we want to make use of our external stylesheet (create and link it in the output folder). Therefore, in our CSS/Less/Sass rules, we can replace `'style-loader'` with `MiniCssExtractPlugin.loader`

Example:

```javascript
/* webpack.config.js: */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: 'src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist'),
		publicPath: 'dist/'
	},
	mode: 'none',
	module: {
		rules: [
			...
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader, 
					'css-loader',
					'sass-loader'
				]
			}
            ...
		]
	},
	plugins: [
		new UglifyJsPlugin(),
		new MiniCssExtractPlugin({
			filename: 'styles.css' // Output css file name
		})
	]
};
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Webpack</title>
	<link rel="stylesheet" href="dist/styles.css"> <!-- Need to add this! -->
</head>
<body>
	<script src="dist/bundle.js"></script>
</body>
</html>
```

```html
dist/
	bundle.js
	styles.css
```

**Note**: The css extractor plugin will *combine all your separate component styles and concatenate them to create the output css file* (by default)!

Example: `src/components/a.scss` and `src/components/b.scss` are both concatenated (after their respective CSS's have been generated) and output to a single file (say, `dist/styles.css`)

### Browser Caching

Inside our plugins' outputs or the main output files, we can change the way our filename is generated. Browser caching works by caching the files on the browser side automatically so that N/W requests are minimized when you have a resource.

Just for the sake of browser caching, we do not need to do any additional processing in webpack. However, if we *make edits to our javascript, CSS, or other files* then those changes must reflect on the browser side. Since the files are cached by filenames (paths, actually), the *browser does not realize that changes have occured and doesn't download the updated file*!

A better caching mechanism is to ***save the filename along with the MD5 hash of the file's contents***! Webpack natively offers a string **`[contenthash]`** that can be placed in our output filenames and the hash replaces it.

In this way:

1. Any edits to the files generates a new filename - so the new filename is requested by browser invalidating the existing cache (based on filename) for that file
2. Only the edited file hashes changes. So, if no edits are made to a particular file then its hash does not change and if browser has it cached, it is served from there
3. We can add the `[contenthash]` to files generated from plugins as well (not just the final webpack bundle). In this way, if CSS or other files changes, the plugins generating separate files for them will update their hashes as well

```javascript
/* webpack.config.js: */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.[contenthash].js',  // HERE! Hash for JS files
		path: path.resolve(__dirname, './dist'),
		publicPath: 'dist/'
	},
	mode: 'none',
	module: {
		rules: [
			...
            ...
		]
	},
	plugins: [
		new UglifyJsPlugin(),
		new MiniCssExtractPlugin({
			filename: 'styles.[contenthash].css' // HERE! Hash for CSS files
		})
	]
};
```

**Note**: If hash does not change, webpack wont generate that file again!

**Note (Important)**: 

Since the hashes are generated, filenames will carry hashes and the `index.html` file also has to be generated to link to the updated links (with updated the hashes)

Therefore, to make sure (1) the files with cache in their names are linked and (2) the HTML links are updated when files with hash names change, we **need to use another plugin for our HTML**!

This plugin name is called **`html-webpack-plugin`** (see 'Generating HTML files automatically')

### Cleaning generated files folder

We do not want the generated files folder to be overwritten without being cleaned everytime we build using webpack! For this purpose, we have a *plugin* that will clear out the generated folder (like `dist/`) every time we run the build process

The plugin package is called **`clean-webpack-plugin`**  (`CleanWebpackPlugin`) and we can install & add it to our array of plugins.

Installation: `npm i -D clean-webpack-plugin`

We must specify a path that we want to clean as argument inside this plugin constructor: `new CleanWebpackPlugin('<path-to-folder>')`

Cleaning basically means *removing the specified folder*.

```javascript
/* webpack.config.js: */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.[contenthash].js',
		path: path.resolve(__dirname, './dist'),
		publicPath: 'dist/'
	},
	mode: 'none',
	module: {
		rules: [
            ...
            ...
		]
	},
	plugins: [
		new UglifyJsPlugin(),
		new MiniCssExtractPlugin({
			filename: 'styles.[contenthash].css'
		}),
		new CleanWebpackPlugin('dist') // HERE: specifying folder to clean
	]
};
```

**Note**: If you want to clean multiple paths, pass an array `new CleanWebpackPlugin(['dist', 'src/trash')`. 

### Generating HTML files automatically

In order to generate our HTML files into the output folder, we can use **`html-webpack-plugin`** (**`HtmlWebpackPlugin`**)

Installation: `npm i -D html-webpack-plugin`

**Q: Why do we need to generate HTML files?**
A: Because of the following reasons:

1. When we are using *hashes* for the filenames of other resources and generating them, we need to update the links to those resources in our HTML as well. We do not want to do this manually, so we can use a generator plugin
2. We can create *templates* to generate our HTML and output the required (multiple) templates

*By default*, the HTML files are put into the output folder (`dist`) and therefore, the `publicPath` needs to be changed accordingly. If `index.html` and resources are in the same folder then you cannot have a public path that is broken.

```javascript
/* webpack.config.js: */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.[contenthash].js',
		path: path.resolve(__dirname, './dist'),
		publicPath: '' // HERE: Update the public path
	},
	mode: 'none',
	module: {
		rules: [
			...
		]
	},
	plugins: [
		new UglifyJsPlugin(),
		new MiniCssExtractPlugin({
			filename: 'styles.[contenthash].css' // output css file name
		}),
		new CleanWebpackPlugin('dist'),
		new HtmlWebpackPlugin() // HERE: All html files are generated into output folder
	]
};
```

The generated HTML file might look like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Webpack App</title>
  <link href="styles.32c24cca2813d0a8ca8b.css" rel="stylesheet"></head>
  <body>
  <script type="text/javascript" src="bundle.9aba21a7b72f1011abe5.js"></script></body>
</html>
```

Therefore, `index.html` must be accessed from `dist/` folder instead of the root `/` now.

### Customizing our Generated HTML files

By default, **`html-webpack-plugin`** (**`HtmlWebpackPlugin`**), adds its own `<title>` and other stuff to our generated HTML file (the generated `index.html` file)

We can pass an object `{}` as parameter to the `HtmlWebpackPlugin` and its properties are options.

1. `title`: The title for the generated HTML file
2. `filename`: Custom file name (what do you want `index.html` to be generated as in the output folder?). Note that the filename is actually a *path* (we can generate our HTML file into a *sub-folder* of output folder)
3. `meta`: We can specify certain meta tags. This property is an object `{}` itself. The `key-value` pairs inside is the `name` and `content` attributes of the meta tag.
4. Any propertie that is created here become options that can be accessed with **`HtmlWebpackPlugin.options.<propName>`**

Example: 

```javascript
/* webpack.config.js: */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.[contenthash].js',
		path: path.resolve(__dirname, './dist'),
		publicPath: ''
	},
	mode: 'none',
	module: {
		rules: [
			...
		]
	},
	plugins: [
		new UglifyJsPlugin(),
		new MiniCssExtractPlugin({
			filename: 'styles.[contenthash].css' // output css file name
		}),
		new CleanWebpackPlugin('dist'),
		new HtmlWebpackPlugin({
			title: 'Hello World',
			filename: 'custom_filename.html',
			meta: {
				viewport: 'width=device-width, initial-scale=1.0'
			}
		})
	]
};
```

The generated HTML might look something like this:

```html
<!-- dist/custom_filename.html: -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="styles.32c24cca2813d0a8ca8b.css" rel="stylesheet">
  </head>
  <body>
    <script type="text/javascript" src="bundle.9aba21a7b72f1011abe5.js"></script>
  </body>
</html>
```

[Full list of options](https://github.com/jantimon/html-webpack-plugin#options)

### Using our own templates for generating HTML files

It is common to use a ***templating engine*** to generate HTML files. Popular templating engines are Jade, Handlebars and so on (even lodash and underscore have utilities).

Instead of having an `index.html` file that is taken and generate by our `HtmlWebpackPlugin`, we can point that same plugin to another file which acts like the template.

[Template options](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md)

This template file can be a plain `.html` file or one of the templating engine files. For example, let us use **`handlebarsJS`**

For every templating engine we use, we need:

1. The webpack *loader* for the templating engine (& therefore, an *additional rule* in the webpack config)
2. The NPM package for the loader that actually parses the template into HTML

`handlebars-loader` and `handlebars`: `npm i handlebars-loader handlebars`

```handlebars
<!-- src/index.hbs: -->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>{{htmlWebpackPlugin.options.title}}</title>
</head>
<body>
	
</body>
</html>
```

```javascript
/* webpack.config.js: */
...
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.[contenthash].js',
		path: path.resolve(__dirname, './dist'),
		publicPath: ''
	},
	mode: 'none',
	module: {
		rules: [
			...
			{
				test: /\.hbs$/,
				use: [
					'handlebars-loader'
				]
			}
            ...
		]
	},
	plugins: [
		new UglifyJsPlugin(),
		new MiniCssExtractPlugin({
			filename: 'styles.[contenthash].css' // output css file name
		}),
		new CleanWebpackPlugin('dist'),
		new HtmlWebpackPlugin({
			title: 'Hello World',
			filename: 'custom_filename.html',
			meta: {
				viewport: 'width=device-width, initial-scale=1.0',
				description: 'A sample application to explain webpack and how it works'
			},
			template: 'src/index.hbs' // read from this template (instead of /index.html)
		})
	]
};
```

The generated HTML file is something like the following. The separated stylesheets and the generated bundles (scripts) are *automatically appended* to the output HTML in the appropriate places:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
    <title>Hello World</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="A sample application to explain webpack and how it works"><link href="styles.32c24cca2813d0a8ca8b.css" rel="stylesheet"></head>
<body>
	
<script type="text/javascript" src="bundle.9aba21a7b72f1011abe5.js"></script></body>
</html>
```

[List of plugins from webpack - page](https://webpack.js.org/plugins/)

## Production versus Development builds

On production, you want to load things fasters, minmize the size of all our bundles, etc. It is optimized for performance

During development, you want to be able to debug, read source maps, etc where performance is not the metric that is prioritized!

### `mode` option in webpack 4

The **`mode`** option in webpack 4 (not available earlier) is used to define optimizations for certain builds. The default value is `none` where no optimizations are specified.

[Mode](https://webpack.js.org/concepts/mode/)

*All values:*

**`development`**: Sets `process.env.NODE_ENV` on `DefinePlugin` to value `development`. 

- Enables `NamedChunksPlugin` and `NamedModulesPlugin`.

**`production`**: Sets `process.env.NODE_ENV` on `DefinePlugin` to value `production`. 

- Enables `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`, `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin` and `TerserPlugin`.

**`none`**: Opts out of any default optimization options

*Important difference between production and development:*

1. `process.env.NODE_ENV` will contain different values, so we can do certain things for production and certain things for development
2. The error handling mechanism is different. For any error in development, webpack loads the source of that error & points to it in devTools (not to the final bundle), a more readable version. In production, the error is pointed to the final (minified) bundle where it is hard to debug
3. Production output bundle is *automatically minified*. Therefore, we ***don't need*** `uglifyjs-webpack-plugin`!

Example:

```javascript
/* webpack.config.js: */
...
	mode: 'production', // mode: 'development'
...
```

```javascript
/* src/index.js: */
import HelloButton from './components/HelloButton';

const hb = new HelloButton();
hb.render();

if(process.env.NODE_ENV === 'production') {
	console.log('Production mode');
} else if(process.env.NODE_ENV === 'development') {
	console.log('Development mode');
}

HelloButton.nonExistentMethod(); // Error in both prod & dev build
// But, in dev build, you can see error in your source (& not final, minified bundle)
// Easier to debug
```

### Managing separate configurations for Production and Development

Instead of just changing the `mode` and having to manually changing its value to have two different builds, we can:

1. Have two configuration files for webpack (For example, `webpack.production.config.js` and `webpack.dev.config.js`)
2. Modify NPM scripts so that we have one build for dev and one for production

We can provide **`--config`** flag to the the `webpack` command in our NPM script so that the configuration for webpack is loaded from the file we specify

Example: 

```javascript
/* webpack.production.config.js: */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.[contenthash].js',
		path: path.resolve(__dirname, './dist'),
		publicPath: ''
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.(png|jpg|jpeg)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader, 
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: { // Can even be an object for a single loader with more options:
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/env' ], // format: [ '@babel/<presetName>', ... ]
						plugins: [ 'transform-class-properties' ] // format: [ <pluginName>, ... ]
					}
				}
			},
			{
				test: /\.hbs$/,
				use: [
					'handlebars-loader'
				]
			}
		]
	},
	plugins: [
        /* We do not need to use UglifyJsPlugin since production config automatically minifies it for us! */
		new MiniCssExtractPlugin({
			filename: 'styles.[contenthash].css' // output css file name
		}),
		new CleanWebpackPlugin('dist'),
		new HtmlWebpackPlugin({
			title: 'Hello World',
			filename: 'index.html',
			meta: {
				viewport: 'width=device-width, initial-scale=1.0',
				description: 'A sample application to explain webpack and how it works'
			},
			template: 'src/index.hbs'
		})
	]
};
```

```javascript
/* webpack.dev.config.js: */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js', // Do not need browser caching during development
        // Hence, no [contenthash] or other substitutions are required
		path: path.resolve(__dirname, './dist'),
		publicPath: ''
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.(png|jpg|jpeg)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader', // using `style-loader` instead of MiniCssExtractPlugin.loader
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader', // using `style-loader` instead of MiniCssExtractPlugin.loader
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: { // Can even be an object for a single loader with more options:
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/env' ], // format: [ '@babel/<presetName>', ... ]
						plugins: [ 'transform-class-properties' ] // format: [ <pluginName>, ... ]
					}
				}
			},
			{
				test: /\.hbs$/,
				use: [
					'handlebars-loader'
				]
			}
		]
	},
	plugins: [
        /* We do not need to use UglifyJsPlugin since minfying will not help with debugging in dev mode! */
        /* We do not need to extract our CSS into a separate file - can use style loader itself */
		new CleanWebpackPlugin('dist'),
		new HtmlWebpackPlugin({
			title: 'Hello World',
			filename: 'index.html',
			meta: {
				viewport: 'width=device-width, initial-scale=1.0',
				description: 'A sample application to explain webpack and how it works'
			},
			template: 'src/index.hbs'
		})
	]
};
```

```javascript
/* package.json: */
{
  "name": "wptutorial",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.production.config.js",
    "dev": "webpack --config webpack.dev.config.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    ...
  },
  "dependencies": {
    ...
  }
}

```

### Faster development with `webpack-dev-server`

We can install a dev server in order to automatically run our build on a local server. This is helpful because whenever we make changes, the running dev server will automatically build our code again and does the (optional) hot reload on our open server page in the browser.

Installation: `npm i -D webpack-dev-server`

Usage: Replace `webpack` with `webpack-dev-server` command in our NPM script for dev build. Add the `--hot` flag if you need it to perform hot reload.

Therefore, any CSS/JS etc changes are automatically reflected in the browser that has the `localhost:<port>` page(s) open.

```javascript
/* package.json: */
{
  "name": "wptutorial",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.production.config.js",
    "dev": "webpack-dev-server --config webpack.dev.config.js --hot"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    ...
  },
  "dependencies": {
    ...
  }
}
```

Inside webpack dev config, we must configure the dev server. We can do this by defining an object `{}` called **`devServer`** with 3 properties: 

1. `contentBase`: The folder from which to serve the files (For example, the `www` directory). This is generally the same as the output `path`. Hence, it takes in the *absolute path* using `resolve()`
2. `index`: Which file serves as the index file to our server
3. `port`: Which port to listen to. For example, if port is `9000` then server is setup for `localhost:9000`

```javascript
/* webpack.dev.config.js: */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, './dist'),
		publicPath: ''
	},
	mode: 'production',
	devServer: {
		contentBase: path.resolve(__dirname, './dist'),
		index: 'index.html',
		port: 9000
	},
	module: {
		rules: [
			...
	},
	plugins: [
		...
	]
};
```

Run `npm run dev` to start the dev server and listen to the changes!

##Multiple Page Applications

Contrary to SPAs, having a single bundle for all our pages in an MPA does not make sense and is not performant also.

Ideally in an MPA, we need:

1. All the shared code between pages in one bundle
2. All the code related a particular page (component) in its own bundle
3. Load a page specific bundle only when that page is requested

The structure that we can follow to maintain our MPA codebase is (subjective):

```html
/
	dist/ => Generated files
	src/
		components/ => Store all the component files and the component CSS here
		index.js => Main page JS
		anotherPage.js => Some other page JS
		oneMorePage.js
		...
		...

1. The pages can include one or more components inside them
2. There is a separate bundle that is created for every page (generated)
```

**Telling webpack to create separate bundles for each page in an MPA:**

1. Changing the `entry` point in webpack to multiple entry points. `entry` becomes an object `{}` where the keys are entry point names and their values are paths to the javascript files that are the actual entries. 
2. The output bundles that are generated also need to be unique. So, we can use a **`[name]`** substitution in our output filename in order to generate unqiue bundles
3. The same `[name]` substitution can be used in our css extractor plugin (`MiniCssExtractorPlugin`) to generate separate CSS files from what was included in each of the `entry` javascript files

```javascript
/* webpack.production.config.js: */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: { // Earlier: `entry: './src/index.js'`
		'hello': './src/hello.js',
		'car': './src/car.js',
	},
	output: {
		filename: '[name].[contenthash].js', // Earlier: bundle.[contenthash].js
		path: path.resolve(__dirname, './dist'),
		publicPath: ''
    }
    ...
    ...
    plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css' // Earlier: styles.[contenthash].css
		}),
        new CleanWebpackPlugin('dist'),
		new HtmlWebpackPlugin({
			title: 'Hello World',
			filename: 'index.html',
			meta: {
				viewport: 'width=device-width, initial-scale=1.0',
				description: 'A sample application to explain webpack and how it works'
			},
			template: 'src/index.hbs'
		})
	]
}
```

 Now run `npm run build` to create the production build. The output will be something like the following:

```html
dist/
	3875334d606b8b4fabc4be2a5ba29732.jpg
	car.db61ffa9778a73d482bc.css
	car.e4663877790525a96e4d.js
	hello.1cff982b5b27131c2126.js
	hello.378300dfb7264eb65495.css
	index.html
```

Note that the generated **`index.html`** will contain all the styles and all the scripts generated into `dist`. That is, *all our bundles (JS & CSS) is included in one HTML file*. For example:

```html
<!-- dist/index.html: -->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Hello World</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A sample application to explain webpack and how it works">
    <link href="hello.378300dfb7264eb65495.css" rel="stylesheet">
    <link href="car.db61ffa9778a73d482bc.css" rel="stylesheet">
</head>
<body>
    
	<script type="text/javascript" src="hello.1cff982b5b27131c2126.js"></script>
    <script type="text/javascript" src="car.e4663877790525a96e4d.js"></script>
</body>
</html>
```

### How to generate multiple HTML files

As seen above, all our bundles are generated and placed inside the `index.html` file. This happens because our `HtmlWebpackPlugin`was configured to generate only one output HTML file.

We can:

1. Specify multiple `HtmlWebpackPlugin()` so that we generated a page from each of them
2. We can change the name of the output HTML files. Specify each name with `filename` attribute
3. We can specify a property **`chunks`** which takes in an array of javascript files (eventual bundles) that we wish to include on that page. The chunk name must correspond to the `entry` object properties

Example:

```javascript
/* webpack.production.config.js: */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		'hello': './src/hello.js',
		'car': './src/car.js',
	},
	output: {
		filename: '[name].[contenthash].js', // Earlier: bundle.[contenthash].js
		path: path.resolve(__dirname, './dist'),
		publicPath: ''
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.(png|jpg|jpeg)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader, 
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: { // Can even be an object for a single loader with more options:
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/env' ], // format: [ '@babel/<presetName>', ... ]
						plugins: [ 'transform-class-properties' ] // format: [ <pluginName>, ... ]
					}
				}
			},
			{
				test: /\.hbs$/,
				use: [
					'handlebars-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css' // earlier: styles.[contenthash].css
		}),
		new CleanWebpackPlugin('dist'),
		new HtmlWebpackPlugin({
            filename: 'hello.html',
			title: 'Hello',
			chunks: ['hello'],
			description: 'The hello page',
			template: 'src/page-template.hbs' // renamed index.hbs to this! (semantics)
		}),
		new HtmlWebpackPlugin({
            filename: 'car.html',
			title: 'Car',
			chunks: ['car'],
			description: 'The car page',
			template: 'src/page-template.hbs' // renamed index.hbs to this! (semantics)
		})
	]
};
```

Run `npm run build`

```html
<!-- Webpack `npm run build` output: -->
                               Asset       Size  Chunks             Chunk Names
3875334d606b8b4fabc4be2a5ba29732.jpg   90.6 KiB          [emitted]
        car.db61ffa9778a73d482bc.css  131 bytes       0  [emitted]  car
         car.e4663877790525a96e4d.js   2.15 KiB       0  [emitted]  car
                            car.html  249 bytes          [emitted]
       hello.1cff982b5b27131c2126.js   2.26 KiB       1  [emitted]  hello
      hello.378300dfb7264eb65495.css  273 bytes       1  [emitted]  hello
                          hello.html  255 bytes          [emitted]
```

```html
<!-- dist/car.html: -->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Car</title>
<link href="car.db61ffa9778a73d482bc.css" rel="stylesheet"></head>
<body>
	
<script type="text/javascript" src="car.e4663877790525a96e4d.js"></script></body>
</html>
```

```html
<!-- dist/hello.html: -->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Hello</title>
<link href="hello.378300dfb7264eb65495.css" rel="stylesheet"></head>
<body>
	
<script type="text/javascript" src="hello.1cff982b5b27131c2126.js"></script></body>
</html>
```

...TO BE CONTINUED...

