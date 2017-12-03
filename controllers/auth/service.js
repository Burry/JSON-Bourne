// Add OAuth login services here
const services = {
	facebook: require('./facebook')
}

exports = module.exports = (req, res, next) => {
	if (!req.params.service) {
		console.log('[auth.service] - You must define the service you wish to authenticate with.')
		return res.redirect('/sign-in')
	}

	if (req.query.target) {
		console.log('[auth.service] - Set target as [' + req.query.target + '].')
		res.cookie('target', req.query.target)
	}

	services[req.params.service].authenticateUser(req, res, next)
}
