// ESLint configuration
// http://eslint.org/docs/user-guide/configuring

module.exports = {
    parser: 'babel-eslint',
    extends: [
        'eslint:recommended',
        'prettier'
    ],
    plugins: ['prettier'],
    globals: {
        __DEV__: true,
    },
    env: {
        es6: true,
        node: true,
        browser: true,
        amd: true,
        mocha: true,
        jquery: true
    },
    parserOptions: {
        emcaVersion: 6,
        sourceType: 'script',
        emcaFeatures: {
            impliedStrict: true
        }
    },
    rules: {
        'brace-style': ["warn", "1tbs", { "allowSingleLine": true }],
        'camelcase': ["warn", { "properties": "always" }],
        'comma-dangle': ["warn", "never"],
        'comma-spacing': ["warn", { "before": false, "after": true }],
        'comma-style': ["warn", "last"],
        'no-unused-vars': ["warn", { "vars": "local" }],
        'eqeqeq': ["warn", "smart"],
        // Recommend not to leave any console.log in your code
        // Use console.error, console.warn and console.info instead
        'no-console': [
            'error', {
                allow: ['warn', 'error', 'info']
            }
        ],
        // ESLint plugin for prettier formatting
        // https://github.com/prettier/eslint-plugin-prettier
        'prettier/prettier': [
            'error', {
                singleQuote: true,
                trailingComma: 'none'
            }
        ]
    }
    settings: {
        // Allow absolute paths in imports, e.g. import Button from 'components/Button'
        // https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers
        'import/resolver': {
            node: {
                moduleDirectory: ['node_modules', 'src']
            }
        }
    }
};
