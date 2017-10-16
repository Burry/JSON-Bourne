// stylelint configuration
// https://stylelint.io/user-guide/configuration/

module.exports = {
    // The standard config based on a handful of CSS style guides
    // https://github.com/stylelint/stylelint-config-standard
    extends: 'stylelint-config-standard',

    plugins: [
        // stylelint plugin to sort CSS rules content with specified order
        // https://github.com/hudochenkov/stylelint-order
        'stylelint-order'
    ],

    rules: {
        'property-no-unknown': [
            true, { ignoreProperties: ['composes'] }
        ],

        'selector-pseudo-class-no-unknown': [
            true, { ignorePseudoClasses: ['global'] }
        ],

    	'string-quotes': 'single',
        'indentation': 'tab',

        // Rules for Autoprefixer compatibility
        'at-rule-no-vendor-prefix': true,
        'media-feature-name-no-vendor-prefix': true,
        'property-no-vendor-prefix': true,
        'selector-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,

    	// https://github.com/hudochenkov/stylelint-order/blob/master/rules/order/README.md
    	'order/order': [
    	  'custom-properties',
    	  'dollar-variables',
    	  'declarations',
    	  'at-rules',
    	  'rules'
    	]
    }
};
