module.exports = {
    mode: 'production',
    entry: './demo/main.js',
    output: {
        filename: '../demo/bundle.js'
    },
    devtool: 'inline-source-map'
};