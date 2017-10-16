## Install Guide

This guide will prepare your environment and install the necessary runtime and dependencies for developing the application locally. We'll use [Yarn](https://yarnpkg.com/en/) as a fancy package manager and to install the [Node.js](https://nodejs.org/en/) runtime.

1. Install [Yarn](https://yarnpkg.com/en)
	- macOS:
		- `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
		- `brew install yarn`
	- Debian/Ubuntu:
		- `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
		- `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
		- `sudo apt-get update && sudo apt-get install yarn`
	- Windows: [Download Installer](https://yarnpkg.com/latest.msi)
2. Ensure that Yarn installed Node by checking the Node version. If running `node -v` doesn't return a version >= 8.6.0, [install Node.js manually](https://nodejs.org/en/download).
3. Clone/download repository: `git clone https://github.com/Burry/JSON-Bourne.git`
4. Enter the repository directory: `cd JSON-Bourne`
5. Install Node dependencies: `yarn install`
6. Build and start the app in development mode: `yarn start`

**Tip 1:** If `yarn` returns a permissions error, try running it with sudo.

**Tip 2:** If the application complains that it can't find a particular Node module, it must have been added to the application's `package.json` in a recent commit. Run `yarn` again to install the new dependencies.

### Check out the [development automation tools](https://github.com/Burry/JSON-Bourne/blob/master/doc/tools.md) to learn more about building, running, and testing the application.
