## Install Guide

This guide will prepare your environment and install the necessary runtime and dependencies for developing the application locally. We'll use [Yarn](https://yarnpkg.com/en/) as a fancy package manager and to install the [Node.js](https://nodejs.org/en/) runtime.

1. Install [Yarn](https://yarnpkg.com/en/)
	- macOS:
		- `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
		- `brew install yarn`
	- Debian/Ubuntu:
		- `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
		- `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
		- `sudo apt-get update && sudo apt-get install yarn`
	- Windows: [Download Installer](https://yarnpkg.com/latest.msi)
3. Clone/download repository: `git clone https://github.com/Burry/JSON-Bourne.git`
4. Enter the repository directory: `cd JSON-Bourne`
5. Install Node dependencies: `yarn`
6. Build and start the app: `gulp`

**Tip 1:** If `yarn` returns a permissions error, try running it with sudo.
**Tip 2:** If the application complains that it can't find a particular Node module, it must have been added to the application's `package.json` in a recent commit. Run `yarn` again to install the new dependencies.

[Gulp](https://gulpjs.com/) automates the process of compiling, optimizing, and testing the code base. Once you've prepared your environment and have a working copy of the application, running `gulp` will set everything up, run the application, open a new browser window, and automatically reload the server and webpage upon detecting changes to your local installation.
