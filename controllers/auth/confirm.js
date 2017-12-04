const async = require('async');
const _ = require('lodash');
const User = require('../../../models').sql.User;

exports = module.exports = (req, res) => {

	let view = new keystone.View(req, res)

	res.locals.section = 'session';
	res.locals.form = req.body
	res.locals.returnto = req.query.returnto
	res.locals.authUser = req.session.auth
	res.locals.existingUser = false

	// Reject request if no auth data is stored in session
	if (!res.locals.authUser) {
		console.log('[auth.confirm] - No auth data detected, redirecting to sign-in.')
		return res.redirect('/sign-in')
	}

	// Set existing user if already logged in
	res.locals.existingUser = req.user ? req.user : null

	// Function to handle sign-in
	let doSignIn = function() {
		console.log('[auth.confirm] - Signing in user...')

		let onSuccess = function(user) {
			console.log('[auth.confirm] - Successfully signed in.')
			return res.redirect(req.cookies.target || '/')
		}

		let onFail = function(err) {
			console.log('[auth.confirm] - Failed signing in.', err)
			// req.flash('error', 'Sorry, there was an issue signing you in. Please try again.')
			return res.redirect('/sign-in')
		}

		keystone.session.signin(String(res.locals.existingUser._id), req, res, onSuccess, onFail)
	}

	// Function to check if a user already exists for this profile id or email (and sign them in)
	let checkExisting = function(next) {
		if (res.locals.existingUser) return checkAuth()


		let serviceProfileId = 'services.' + res.locals.authUser.type + '.profileId'

		let query = User.model.findOne({
			$or: [
				{[serviceProfileId]: res.locals.authUser.profileId},
				{email: res.locals.authUser.email}
			]
		})

		query.exec(function(err, user) {
			if (err) {
				console.log('[auth.confirm] - Error finding existing user.', err)
				return next({ message: 'Sorry, there was an error processing your information. Please try again.' })
			}
			console.log('[auth.confirm] - Existing user found...')

			res.locals.existingUser = user
			return doSignIn()
		})
	}

	// Function to handle data confirmation process
	let checkAuth = function() {
		async.series([

			// Create or update user
			function(next) {
				if (res.locals.existingUser) {
					console.log('[auth.confirm] - Existing user found, updating...')

					var userData = {
						isVerified: true,
						services: res.locals.existingUser.services || {}
					}

					_.extend(userData.services[res.locals.authUser.type], {
						isConfigured: true,
						profileId: res.locals.authUser.profileId,
						username: res.locals.authUser.username,
						avatar: res.locals.authUser.avatar,
						accessToken: res.locals.authUser.accessToken,
						refreshToken: res.locals.authUser.refreshToken
					})

					res.locals.existingUser.set(userData)

					res.locals.existingUser.save(err => {
						if (err) {
							console.log('[auth.confirm] - Error saving existing user.', err)
							return next({ message: 'Sorry, there was an error processing your account. Please try again.' })
						}
						console.log('[auth.confirm] - Saved existing user.')
						return next()
					})
				} else {
					console.log('[auth.confirm] - Creating new user...')

					var userData = {
						name: {
							first: res.locals.form['name.first'],
							last: res.locals.form['name.last']
						},
						email: res.locals.form.email,
						password: Math.random().toString(36).slice(-8),
						newsletter: res.locals.form.newsletter,
						isVerified: true,
						services: {}
					};

					userData.services[res.locals.authUser.type] = {
						isConfigured: true,
						profileId: res.locals.authUser.profileId,
						username: res.locals.authUser.username,
						avatar: res.locals.authUser.avatar,
						accessToken: res.locals.authUser.accessToken,
						refreshToken: res.locals.authUser.refreshToken
					}

					res.locals.existingUser = new User.model(userData)

					res.locals.existingUser.save(err => {
						if (err) {
							console.log('[auth.confirm] - Error saving new user.', err)
							return next({ message: 'Sorry, there was an error processing your account. Please try again.' })
						}
						console.log('[auth.confirm] - Saved new user.')
						return next()
					})
				}
			},

			// Session
			function() {
				if (req.user) {
					console.log('[auth.confirm] - Already signed in, skipping sign in.')
					return res.redirect(req.cookies.target || '/')
				}
				return doSignIn()
			}

		], function(err) {
			if (err) {
				console.log('[auth.confirm] - Issue signing user in.', err)
				// req.flash('error', err.message || 'Sorry, there was an issue signing you in. Please try again.')
				return res.redirect('/sign-in')
			}
		})
	}

	view.on('init', next => {
		return checkExisting(next)
	})

	view.on('post', { action: 'confirm.details' }, next => {
		if (!res.locals.form['name.first'] || !res.locals.form['name.last'] || !res.locals.form.email) {
			// req.flash('error', 'Please enter a name & email.')
			return next()
		}
		return checkAuth()
	})

	view.render('auth/confirm')
}
