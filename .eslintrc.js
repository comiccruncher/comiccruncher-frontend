module.exports = {
    env: {
        browser: true,
        es6: true,
        commonjs: true,
        node: true,
    },
    extends: [
        'plugin:react/recommended',
        'prettier',
        'prettier/react',
    ],
    plugins: ['security', 'prettier',],
    parser: "babel-eslint",
    parserOptions: {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    rules: {
        'import/named': 0,
        'import/no-unassigned-import': 0,
        'import/no-named-as-default-member': 0,
        'prettier/prettier': 'error',
        'react/no-unused-prop-types': 0,
        'semi': 'error',
    },
};
