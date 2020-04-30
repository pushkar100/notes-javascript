# Dependencies for a Modern Project

Every package is a `devDependency` unless specified otherwise.

## Webpack

- Basic:
    - `webpack`
        - The core module
    - `webpack-cli`
        - The CLI that enables us to run core module with options  
- CSS Preprocessor Loaders:
    - `sass-loader` or `less-loader` for CSS preprocessing
    - Install `node-sass` as well for SASS since it is a dependency for `sass-loader`
- CSS Loaders:
    - `css-loader`
        - Converts imported CSS file into array of CSS rules
    - `style-loader`
        - Converts `css-loader` output into `<style>` tag in HTML on bundle execution
- Image and Asset Loaders:
    - `file-loader`
        - Loads a file into JS and manages its output location (Non JS files too!)
        - Can be used for any file (Commonly: Images, Fonts)
        - Used internally by many loaders to manage files (Ex: CSS `background-image` files)
    - `url-loader`
        - A more advanced file loader with more options (Such as image inlining size limit)
    - `csv-loader`
        - Load CSV files
    - `xml-loader`
        - Load XML files
    - Note: `JSON` has a default export and it does not need a loader (automatic)
- Output Management:
    - `html-webpack-plugin`
        - Manages generated HTML in output folder
    - `clean-webpack-plugin`
        - Cleans the output folder before every webpack build
        - Therefore, avoids stale files in output folder
        - Not "default" (`const { CleanWebpackPlugin } = require('clean-webpack-plugin')`)
- Development:
    - `webpack-dev-server`
        - Responsible for creating a dev server
        - Use this command over `webpack` to start dev server
- Production:
    - `terser-webpack-plugin`
        - **No** install required (Can install if needed to manually use it in config)
        - Used by default to minify JS inside webpack "production" build
        - Usage example: `optimization.minimizer = [new TerserPlugin()]`
        - Note: `optimization.minimize` must be `true` (It is, in 'production' env)
- Multiple builds:
    - `webpack-merge`
        - Helps separate out builds for different modes
        - Can keep a common shared config between configs for different modes
- Extract CSS into Separate Files:
    - `mini-css-extract-plugin`
        - Used in place of `style-loader`. Does not generate `<style>` tags for CSS
        - Generates CSS output file for every CSS import per file
        - On-demand loading of CSS and its Source Maps
        - Use as BOTH plugin & loader (`MiniCssExtractPlugin.loader` replaces `style-loader`
- Optimize (Minimize CSS):
    - `optimize-css-assets-webpack-plugin`
        - Minifes the output CSS (Used in conjunction with `MiniCssExtractPlugin`)
        - Need to define as: 
            - `optimization.minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]`
        - Since we are changing the minimizers, we need to add TerserJSPlugin (default) explicitly as well!
- Copying files:
    - `copy-webpack-plugin`
        - Copies individual files or entire directories, which already exist, to the build directory.
        - [About CopyWebpackPlugin](https://webpack.js.org/plugins/copy-webpack-plugin/)
- Plugins already defined inside webpack (No installation):
    - `DefinePlugin`
        - Lets us defined global variables that can be consumed inside our code
    - `SplitChunksPlugin`
        - Helps avoid duplicate dependencies between mutliple bundles
        - Extracts common dependencies out
- Additional plugins:
    - `uglifyjs-webpack-plugin`
        - Alternate to webpack default `TerserPlugin`
        - Use as `optimization.minimizer = [new UglifyJsPlugin()]`
    - `webpack-bundle-analyzer`
        - To analyze the bundle created by webpack
    - `webpack-visualizer-plugin`
        - See a visual representation of each of our bundle size
        - How much space they are taking and what are their dependencies
    - `offline-plugin`
        - To give an offline experience to webpack projects
        - Caching all (or some) of the webpack output assets
        - Uses `ServiceWorker` and `AppCache` under the hood
    - `webpack-pwa-manifest`
        - Generates manifest file for PWA (`manifest.json`)
    - `imagemin-webpack-plugin`
        - Compress image assets while bundling (Uses `imagemin` to compress it)
    - `duplicate-package-checker-webpack-plugin`
        - Checks if duplicate packages got included in our bundle due to different versions
        - Ex: Webpack might not realize lodash@x.y.z is another version of lodash@m.n.o
        - Webpack might add both to the bundle which leads to a bloated bundle
        - This plugin helps identify such packages that differ only in version

## Typescript

- Basic:
    - `typescript`
        - The core typescript package
- For Webpack:
    - `ts-loader`
        - The loader to make typescript process files before bundling by webpack 

## React & Redux

- Basic:
    - `react` (dep)
        - The core react package
    - `react-dom` (dep)
        - The react module to be able to render to the DOM
    - `redux` (dep)
        - The core redux package
    - `react-redux` (dep)
        - Enables `Provider` & `connect`

- CSS in JS:
    - `styled-components` (dep)
        - Allows us to write styles for our components inside it
        - Uses string literals, is scoped to component, etc

- Redux Middlewares:
    - `redux-thunk` (dep)
        - Enables async calls (such as APIs) before dispatching action to store
    - `redux-saga` (dep)
        - Library that aims to make application side effects easier to manage
        - Also, more efficient to execute, easy to test 
        - Side effects: asynchronous things, data fetching, impure things like accessing the browser cache
        - It is a middleware

- Routing:
    - `react-router` (dep)
        - Enables client-side routing in an SPA
    - `react-router-redux` (dep)
        - Allows router to work with redux data

## SSR:

- Next:
    - `next` (dep)
        - Library used to write universal / server-side code esp. with React

## Babel

- Basic:
    - `@babel/core`
        - The core babel package containing the 'Babylon' parser
    - `@babel/preset-env`
        - The level of transpilation (`env` is quite common) and is sufficient in most cases
    - `@babel/cli`
        - Use only if you are using babel from the command line. **Ignore, if used via webpack!**
        - Gives us the `babel` command on the CLI
- For Webpack:
    - `babel-loader`
        - Need it to transpile (js) files before webpack bundles them
        - Note: set `modules: false` in babel config
        - Doing so will let Webpack manipulate `import`/`export` instead of babel doing it
        - It lets Webpack optimize code (tree-shaking mainly)
- For React:
    - `@babel/preset-react`
        - Enables transpilation of React code (Ex: JSX into JS functions)
- For Poyfilling:
    - `@babel/polyfill` (dep)
        - Runtime polyfilling
- Plugins (Support for latest features - Proposal / Below stage-2):
    - `@babel/plugin-proposal-class-properties`
        - [Link to explanation](https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html)
    - `@babel/plugin-proposal-export-namespace-from`
        - [Link to explanation](https://babeljs.io/docs/en/next/babel-plugin-proposal-export-namespace-from.html)
    - `@babel/plugin-proposal-pipeline-operator`
        - Used to allow pipeline operator (`|>`)

## ESLint & Prettier

### ESLint

- Basic:
    - `eslint`
        - The core ESLint package that uses the `espree` parser by default
        - Need a config file to go along with it (or defined inside `package.json`)
    - `eslint-plugin-import`
        - Support linting of ES2015+ (ES6+) import/export syntax
        - Prevent issues with misspelling of file paths and import names
- For Webpack:
    - `eslint-loader`
        - If you want Webpack to ESLint your files before bundling
        - Make sure it is called before `babel-loader` (Prior to transpilation)
        - Can emit error events that will exit webpack
        - Guide: https://webpack.js.org/loaders/eslint-loader/
- For React:
    - `eslint-plugin-react`
        - React specific linting rules
    - `eslint-plugin-jsx-a11y`
        - For accessibility rules on JSX elements. Accessibility is Important!
- For Prettier:
    - `eslint-plugin-prettier`
        - Helps ESLint work smoothly with Prettier
        - When Prettier formats code, it does it keeping our ESLint rules in mind
        - Integrates the Prettier rules into ESLint rules
    - `eslint-config-prettier`
        - Turns off all ESLint rules that could conflict with Prettier,
- For Jest:
    - `eslint-plugin-jest`
        - ESLint plugin for Jest
- Configs:
    - `eslint-config-airbnb`
        - If you want to use airbnb style guide over the recommended    
    - `eslint-config-jest-enzyme`
        - This helps with Jest and Enzyme specific variables which are globalized 
        - Ex: No warning against assertions `it` and `describe`.

**Note**:
- You can install the corresponding Linter plugin for your editor
- This plugin will read the config and identify / make the changes on saving the file
- This will save time on fixing linting errors when webpack actually runs

### Prettier

- Basic:
    - `prettier`
        - Formats (prettifies) code when executed

**Note**: Make sure to setup "prettier" for formatting code
- Step 1: [Prettier with VSCode](https://www.robinwieruch.de/how-to-use-prettier-vscode)
- Step 2: [Integrate with ESLint](https://www.robinwieruch.de/prettier-eslint)

## Testing

### Jest & Enzyme (For testing with React)

- Unit Testing:
    - `jest`
        - The unit testing framework, mocking, and code coverage library (All in one)
    - `@babel/core`
        - Jest requires this since it is a peer-dependency
    - `babel-core`
        - Another dependency for Jest to work
    - `@babel/polyfill`
        - Jest requires a thing called regenerator-runtime
        - `@babel/polyfill` comes built-in with it and some other cool features.
    - `babel-jest`
        - Will help Babel understand the code we write in Jest

- UI (React Component) Testing:
    - `enzyme`
        - Assertion library: Makes it easy to assert, manipulate, & traverse React Components’ output.
    - `enzyme-adapter-react-16`
        - An adapter/middle-ware to help Jest connect with Enzyme

## Automation

- Shareable git hooks:
    - `husky`
        - A package that allows you to write hooks which are shareable within repo
- Pre-commit checks:
    - `lint-staged`
        - Run arbitrary shell tasks with a list of staged files as an argument
        - Filtered by a specified glob pattern
