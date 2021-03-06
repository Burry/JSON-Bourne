const _ = require('lodash');
const async = require('async');
const passport = require('passport');
const passportFacebookStrategy = require('passport-facebook').Strategy;
const User = require('../../models').sql.User;

exports = module.exports = (req, res, next) => {
	passport.use(new passportFacebookStrategy(
		{
			clientID: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
			callbackURL: process.env.FACEBOOK_CALLBACK_URL,
			profileFields: ['id', 'email', 'displayName']
		},
		(accessToken, refreshToken, profile, done) =>
			done(null, {
				accessToken: accessToken,
				refreshToken: refreshToken,
				profile: profile
			})
	));

	// Save user data once returning from Facebook
	if (_.has(req.query, 'cb')) {
		passport.authenticate('facebook', {session: false}, (err, data, info) => {
			if (err || !data) {
				console.error('Error retrieving Facebook account data: ' + JSON.stringify(err));
				return res.redirect('/sign-in');
			}

			let name = data.profile && data.profile.displayName ? data.profile.displayName.split(' ') : [];

			let auth = {
				type: 'facebook',
				name: {
					first: name.length ? name[0] : '',
					last: name.length > 1 ? name[1] : ''
				},
				email: data.profile.emails.length ? _.first(data.profile.emails).value : null,
				profileId: data.profile.id,
				username: data.profile.username,
				avatar: 'https://graph.facebook.com/' + data.profile.id + '/picture?width=600&height=600',
				accessToken: data.accessToken,
				refreshToken: data.refreshToken
			};
			req.session.auth = auth;
			return res.redirect('/auth/confirm');
		})(req, res, next);

	// Perform inital authentication request to Facebook
	} else {
		passport.authenticate('facebook', {scope: ['email']})(req, res, next);
	}
}
