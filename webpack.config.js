const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        getProductsList: './src/product-service/handlers/getProductsList.ts',
        getProductsById: './src/product-service/handlers/getProductsById.ts'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.mjs', '.json', '.ts'],
        symlinks: false,
        cacheWithContext: false,
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};