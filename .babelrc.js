// Babel configuration
// https://babeljs.io/docs/usage/api/

module.exports = {
	presets: [
		['env', { targets: { node: 'current' } } ],
		'stage-2',
	],
	ignore: ['node_modules', 'build']
};
