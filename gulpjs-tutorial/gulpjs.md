# Gulp JS Tutorial/Crash Course

Source: https://www.youtube.com/watch?v=1rw9MfIleEg

Gulp is a JavaScript toolkit and task runner that runs on Node & NPM with hundreds of plugins made available to us to perform many of the common, repetitive and time-consuming tasks.

## Introduction:

Gulp is a:
1. Open source JS toolkit and task runner
2. Front-end build system
3. Built on Node and NPM
4. Useful for time-consuming and repetitive tasks
5. Hundreds of plugins available for different tasks

Common tasks:
1. Minification of scripts and stylesheets
2. Concatenation
3. Cache busing (check if new version of cache is available)
4. Testing, linting and optimization
5. Dev Servers (run code on a web server)

## How Gulp Works:

Gulp is built on Node. It is built using **Node Streams** and uses the concept of pipelining (`.pipe()` operator). 
The plugins are all pipes which give its output as input to the next pipe (plugin). Files are not affected until all the plugins are processed. (Single purpose gulp plugins).

File System -> Read Files -> Modify -> Modify -> Modify -> Write Files -> Destination

## Gulp v/s Grunt:

1. Gulp is Code over Configuration while Grunt is mostly just Configuration.
2. Gulp is easier to read than Grunt.
3. Gulp is based on streams while Grunt is based on files.

## Installation:

1. Install Node & NPM (https://nodesource.com/blog/installing-nodejs-tutorial-mac-os-x/)
2. Install Gulp via NPM: `sudo npm install -g gulp` (Installing it globally because of use in multiple projects)

## Creation:

We are creating a Node application while working with Gulp, so we will need to initialize our work folder to hold all the dependencies and the `package.json` file. Run `npm init` in the work folder to create a new node project.

We can also install Gulp in the project folder so that when we port to another system that does not have gulp installed globally then it will be re-installed as a dependency from the package file. We only need Gulp as a dev dependency and not in production:
`npm install --save-dev gulp`

## Simple Gulp Setup (Workflow):

A simple way to handle gulp source files would be to store them all inside one folder (`src`) where the plugins act on them and the processed (final) files will be stored in a separate folder (`dist`). `dist` is what will be hosted on a production server since it contains the distribution files.

## Gulpfile.js:

`gulpfile.js` in the root folder of the project is the only file we need to create. Inside this file we mention all the tasks that Gulp needs to do.

A basic `gulpfile.js` contains:
1. Inclusion of the gulp module itself (`require('gulp')` which fetches it from the 'node_modules' folder).
2. There are 4 top-level functions:
	a. `gulp.task`: Defines tasks
	b. `gulp.src`: Points to files to use
	c. `gulp.dest`: Points to folder to output
	d. `gulp.watch`: Watch files and folders for changes

Defining a task:
`gulp.task(task-name>, <callback-function>)`: Names a task with what to do mentioned inside its callback function.

Running a task: Just execute `gulp <task-name>` inside the project folder.

Ex:
```
const gulp = require('gulp');

// Logs message to console:
gulp.task('message', function () {
	return console.log('Gulp is running...');
});
```

## Default Task:

Instead of specifically mentioning the task to be run, we have certain statements to be executed everytime we run gulp. We can put these statements within a task named 'default' and run `gulp` to execute it.

```
const gulp = require('gulp');

// Logs message to console:
gulp.task('default', function () {
	return console.log('Gulp is running...');
});

// Run 'gulp' on the command line.
```

## Gulp Example 1: Copying Files from Source to Destination

1. Mention the source files in `gulp.src()` (we can use regex patterns to match files)
2. Pipe the output of that to the next function `gulp.dest()`
3. In `gulp.dest()` we mention the output folder (for the input files).

```
// Copy all html files from src to dist:
gulp.task('copyHtml', function () {
	gulp.src('src/*.html')
		.pipe(gulp.dest('dist'));
});
```

## Gulp Example 2: Optimizing Images

A gulp plugin exists to minify images. It's called 'gulp-imagemin'. Refer: https://www.npmjs.com/package/gulp-imagemin

Installation: `npm install --save-dev gulp-imagemin` (Only need it in dev and not production)

Usage: 
1. `const imagemin = require('gulp-imagemin');` includes the package. 
2. `imagemin()` is the function that compresses files (pipe/plugin).

```
// Optimize images:
gulp.task('imageMin', function () {
	gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images')); // Destination folder is created if it doesn't exist
});

// Run 'gulp imageMin'.
// If we compare the sizes of images in 'src/images' with those in 'dist/images' then there will be a reduction in sizes.
```

## Gulp Example 3: Minifying JavaScript Files

`gulp-uglify` is a popular JS minification tool available as a gulp plugin.

Installation: `npm install --save-dev gulp-uglify` (Only need it in dev and not production)

Usage: 
1. `const uglify = require('gulp-uglify');` includes the package. 
2. `uglify()` is the function that minifies the scripts.

```
// Minify JS:
gulp.task('minify', function () {
	gulp.src('src/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js')); // Destination folder is created if it doesn't exist
});

// Run 'gulp minify'.
// The source files are not minified while the ones added to the destination are, infact, minified.
```

## Gulp Example 4: SASS CSS Preprocessor with Gulp

SASS is a CSS proprocessor which allows us to have variables, functions, mixins, etc with CSS. This SASS file then needs to be compiled into plain CSS. SASS files use the `.scss` extension.

Documentation: https://www.npmjs.com/package/gulp-sass

Installation: `npm install --save-dev gulp-sass` (Only need it in dev and not production)

Usage: 
1. `const sass = require('gulp-sass');` includes the package. 
2. `sass()` is the function that compiles SASS into CSS.
3. `sass()` returns an `on('error', sass.logError)` functionality which logs errors (if any) while compiling onto the console.

```
// Compile SASS to CSS:
gulp.task('sass', function() {
	gulp.src('src/sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('dist/css'));
});

// Run 'gulp sass'.
// 
```

## Specifying Multiple Tasks:

Instead of having a callback function to perform one task, we can list an array of tasks to be performed inside another task.

Syntax: `gulp.task(<task-name>, [<comma-separated-list-of-other-tasks])`

Example:
```
// Runs all the specified tasks by default
gulp.task('default', ['copyHtml', 'imageMin', 'minify', 'sass']);

// Running 'gulp' will run all the mentioned tasks (plugins) in order.
```

## Gulp Example 5: Concatenating Files (Bundling JS)

Concatenating is a common task and a gulp plugin exists for that as well. It's called 'gulp-concat'.

Installation: `npm install --save-dev gulp-concat` (Only need it in dev and not production)

Usage: 
1. `const concat = require('gulp-concat');` includes the package. 
2. `concat()` is the function that concatenates files.

```
// Concatenate Files (Scripts):
gulp.task('concat', function() {
	gulp.src('src/js/*.js')
		.pipe(concat('main.js')) // Give the concatenated file a name
		.pipe(gulp.dest('dist/js'));
});

// Run 'gulp concat'.
// Will see 'main.js' in 'dist/js' folder.
```

The above example will create a file called `main.js` from the source files but it will **not** minify it.

To minify the file, we must use the earlier 'uglify' plugin on it. Since plugins are piped in gulp, we can pipe concat to uglify as follows:

```
// Concatenate Files (Scripts):
gulp.task('concat', function() {
	gulp.src('src/js/*.js')
		.pipe(concat('main.js')) // Give the concatenated file a name
		.pipe(uglify()) // Piped plugin - minify the concatenated file
		.pipe(gulp.dest('dist/js'));
});

// Run 'gulp concat'.
// Now, the output will be both a single file as well as minified.
```

If we are running all the plugins for a task via the array syntax, we do not need to run 'minify' when 'concat' is being called (as long as minify's purpose was only to minify concat's output file).

Example:
```
// Runs all the specified tasks by default
gulp.task('default', ['copyHtml', 'imageMin', 'sass', 'concat']);

// Run 'gulp'.
```

## Watching Files for Changes:

The concept of 'watch' is that whenever a file is **edited/changes**, we must look out for the change and run the tasks associated with the file (This must happen everytime the file is changed).

In gulp, we can create a task (or use an existing one) and inside it call the `gulp.watch` function. This function takes to parameters:
1. The file(s) to watch (Source files)
2. Array of task(s) to run up on changes in source file(s).

```
// Watch SASS and JS files:
gulp.task('watch', function() {
	gulp.watch('src/sass/*.scss', ['sass']);
	gulp.watch('src/js/*.js', ['concat']);
});

// Run 'gulp watch'.
// Any changes to the SASS or JS files will automatically run 'sass'/'concat' tasks.
```


