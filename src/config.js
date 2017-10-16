// Application configuration

// eslint-disable max-len

if (process.env.BROWSER)
	throw new Error('Do not import \'config.js\' from inside the client-side code.');

exports = module.exports = {
	// Node.js app
	port: process.env.PORT || 3000,

	// Database
	databaseUrl: process.env.DATABASE_URL || '',

	// Google Analytics
	analyticsID: process.env.GOOGLE_TRACKING_ID || 'UA-107916920-1',

	// Authentication
	auth: {
		jwt: { secret: process.env.JWT_SECRET || 'EdB9%L4>*AVPqy.DEw/7tm[c28kVWztVXm@DZyxe9mFk*GLZBruU}62f#Rn7YU3M' },

		// https://developers.facebook.com/
		facebook: {
			id: process.env.FACEBOOK_APP_ID || '',
			secret: process.env.FACEBOOK_APP_SECRET || ''
		},

		// https://cloud.google.com/console/project
		google: {
			id: process.env.GOOGLE_CLIENT_ID || '',
			secret: process.env.GOOGLE_CLIENT_SECRET || ''
		},

		// https://apps.twitter.com/
		twitter: {
			key: process.env.TWITTER_CONSUMER_KEY || '',
			secret: process.env.TWITTER_CONSUMER_SECRET || ''
		}
	}
};
