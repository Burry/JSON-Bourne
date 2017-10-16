# Development Automation Tools

## Build / Start

#### `yarn start` (`tools/start.js`)

* Cleans up the output `/build` directory (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Launches [Webpack](https://webpack.github.io/) compiler in a watch mode (via [webpack-middleware](https://github.com/kriasoft/webpack-middleware))
* Launches Node.js server from the compiled output folder (`runServer.js`)
* Launches [Browsersync](https://browsersync.io/) and [Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement)

#### `yarn run build` (`tools/build.js`)

* Cleans up the output `/build` folder (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Creates application bundles with Webpack (`bundle.js`, `webpack.config.js`)

### Options

Flag        | Description
----------- | --------------------------------------------------
`--release` | Minimizes and optimizes the compiled output
`--verbose` | Prints detailed information to the console
`--analyze` | Launches [Webpack Bundle Analyzer](https://github.com/th0r/webpack-bundle-analyzer)
`--docker`  | Build an image from a Dockerfile
`--silent`  | Do not open the default browser

## Testing

```bash
yarn run lint                   # Find problematic patterns in code
yarn run fix                   	# Fix linting errors
yarn run test                   # Run unit tests once
yarn run test-watch             # Run unit tests in watch mode
```

## Misc

* `webpack.config.js` - Webpack configuration for both client-side and server-side bundles
* `postcss.config.js` - PostCSS configuration for transforming styles with JS plugins
* `run.js` - Helps to launch other scripts with `babel-node` (e.g. `babel-node tools/run build`)
* `.eslintrc` - ESLint overrides for built automation scripts
