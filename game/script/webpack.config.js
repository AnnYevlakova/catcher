
var path = require('path');

module.exports = {
    entry: './app/app.js',
    output: {
        path: path.join(__dirname, './'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.json',]
    }
};
