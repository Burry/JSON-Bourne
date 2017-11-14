## Install Guide

This guide will prepare your environment and install the necessary runtimes, databases, and dependencies for developing the application locally. We'll use [Yarn](https://yarnpkg.com/en/) as a fancy package manager and to install the [Node.js](https://nodejs.org/en/) runtime.

1. Install [Yarn](https://yarnpkg.com/en/)
	- macOS:
		- Install Homebrew if you haven't already: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
		- `brew install yarn`
	- Windows: [Get Installer](https://yarnpkg.com/latest.msi)
	- Ubuntu/Debian:
		- `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
		- `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
		- `sudo apt-get update && sudo apt-get install yarn`
2. Install [MongoDB](https://docs.mongodb.com/manual/installation/)
	- macOS: `brew install mongodb`
	- Windows: [Installation Guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
	- Ubuntu: [Installation Guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
	- Debian: [Installation Guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/)
	- If you aren't already running it as a daemon, start the database with `mongod`. You can open another shell and run `mongo` to access the MongoDB client.
3. Install [PostgreSQL](https://www.postgresql.org/)
	- macOS: [Get Postgres.app](http://postgresapp.com)
	- Windows: [Get Installer](https://www.postgresql.org/download/windows/)
	- Ubuntu: [Get Installer](https://www.postgresql.org/download/linux/ubuntu/)
	- Debian: [Get Installer](https://www.postgresql.org/download/linux/debian/)
4. Clone/download repository: `git clone https://github.com/Burry/JSON-Bourne.git`
5. Enter the repository directory: `cd JSON-Bourne`
6. Install Node dependencies: `yarn`
7. Rename `.env.example` to `.env` and add your PostgreSQL server's credentials or change other variables.
8. Build and start the app: `gulp`

**Tip 1:** If `yarn` returns a permissions error, try running it with sudo.

**Tip 2:** If the application complains that it can't find a particular Node module, it must have been added to the application's `package.json` in a recent commit. Run `yarn` again to install the new dependencies.

[Gulp](https://gulpjs.com/) automates the process of compiling, optimizing, and testing the code base. Once you've prepared your environment and have a working copy of the application, running `gulp` will set everything up, run the application, open a new browser window, and automatically reload the server and webpage upon detecting changes to your local installation.
