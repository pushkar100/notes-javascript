# Typescript CLI & config basics

Sources:

1. [Frontend Master - Intro to Typescript v2](https://frontendmasters.com/courses/typescript-v2)
2. [Educative course](https://www.educative.io/courses/learn-typescript-complete-course)

## Typescript compiler

1. Install typescript (the compiler) globally: `npm install -g typescript`
2. *Optional*: Install ESLint globally: `npm i -g eslint`
3. Typescript has 3 parts: *Type checker, compiler, language server (serves up comments in our editor such as vscode when we are writing typescript or using code written in it)*
4. `tsc /path/to/file.ts` (Generates `.js` file with some overhead - default is `ES3` support)
5. `tsc /path/to/file.ts --target ES2015` (Change support to another ES version. Ex: `ES2016`)
6. `tsc /path/to/file.ts --target ES2015 --module commonjs` (Output common js modules so that the generated `.js` file can run in a **Node** environment since node does not support ES6 modules)
7. `tsc /path/to/file.ts --target ES2015 --watch` watches the source files and incrementally generates the resulting `.js` file as and when we save the source files
8. An example `.ts` file:

```typescript
/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n: number) {
  return new Promise(res => setTimeout(res, n));
}

/**
 * Add three numbers
 * @param a first number
 * @param b second
 */
export async function addNumbers(a: number, b: number) {
  await timeout(500);
  return a + b;
}

//== Run the program ==//
(async () => {
  console.log(await addNumbers(3, 4));
})();
```

## Config file

1. Create a `tsconfig.json` file in the project root folder. The `tsc` command reads from this config file by default if it exists
2. Specifying the files to work the compiler on:
   1. `"files": ["/path/file1.ts", "/path/file2.ts", ...]` We can specify individual files in an array
   2. `"includes": ["src"]` We can specify globs like directories, wildcards like `*` and so on
   3. `compilerOptions` contains the options for the typescript compiler
   4. `compilerOptions.target` specifies the target ES output (ES2015, ES2017, etc)
   5. `compilerOptions.module` specifes if the output must be wrapped in a module (like commonjs)
   6. `compilerOptions.outDir` specifies the output directory where you want all your generated files to be (For example, if you are building a library then this is useful)
3. When working with VSCode, intellisense will give you autocomplete for typescript config and other typescript based libraries that are used in your files (Major advantage of VSCode as it is closely coupled with typescript support)

```json
{
    "includes": ["src"], //"files": ["./src/index.ts"]
    "compilerOptions": {
        "target": "ES2015",
        "module": "CommonJS",
        "outDir": "lib"
    }
}
```

### Declaration and source maps

1. Inside `compilerOptions`: Add `"declaration": true` to our config. This generates corresponding `.d.ts` files of our source typescript files. 
2. The editor (like VSCode) will use this declaration file in order to prompt autocompletion (such as suggesting method names, list the params, specify the types to values in the tooltip, etc) when you are consuming the code in another js/ts application
3. Inside `compilerOptions`: Add `"sourceMap": true` to generate source maps (`.js.map`) so that the devtools will map to this file in order to debug the JS on the browser.
4. Both of the generated files will be placed inside the output directory

```json
{
    "compilerOptions": {
        "declaration": true,
        "sourceMap": true
    }
}
```

5. The `.d.ts` file contains only the function signatures and input/output type info (that code editors like VSCode can use) and nothing else.

```typescript
/**
 * Add three numbers
 * @param a first number
 * @param b second
 */
export declare function addNumbers(a: number, b: number): Promise<number>;
```

### Other compiler options (non-exhaustive list)

1. `"jsx": "react"` Typescript has native support for understanding JSX. If we are parsing `.ts` files and these contain JSX then we need to add this option in config. However, *if we are using .`tsx` files then the react JSX code is compiled by default - don't have to specify `jsx` compiler option*
2. `"strict": true` The default is `false`. This configures the typescript compiler on how strictly the type checking must happen. Initially, we would want to start off with a loose check and as we refactor more of our code, we would want to make it strict option `true`
3. `"noImplicitAny": true` forbids any piece of code that typescript compiler cannot exactly guess statically what the type of the value is supposed to be (grey area)
4. `"strictNullChecks": true` Gives typescript the ability to check and compile regular JS
5. `"allowJS": true` allow regular JS in your `.ts` files
6. Others: `experimentalDecorators`, `emitDecoratorMetaData`, `moduleResolution`, etc.

### A word on `target`

What should be the target of the typescript compiler?

We must compile to a modern JS standard like `ESNext` or something specific like `ES2017` (newer JS standard) and leave the *transpiling* to a transpiler like **Babel**. 

Babel will read the JS that we emit from our typescript compiler and uses its own configuration file `.babelrc` to transpile JS to the target. For this purpose, we will specify to babel the environment and browsers to target, the presets to use, and add the plugins for any new features we intend to code.

In short, leave transpiling to Babel.
