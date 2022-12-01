const path = require('path');

module.exports = {
    entry: {bundle: './src/app.ts'},
    output: {
        path: path.join(__dirname,'main'),
        filename: '[name].js'
    },
    resolve: {extensions: ['.ts','.js']},
    devServer: {
        static: {directory: path.join(__dirname, "main")}
    },
    module: {
        rules: [{test:/\.ts$/,loader:'ts-loader'}]
    }
}