const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'pmCircle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development'
};