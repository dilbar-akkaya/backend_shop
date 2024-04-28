const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    devtool: slsw.lib.webpack.isLocal ? 'source-map' : 'cheap-source-map',
    entry: slsw.lib.entries,
   // externals: /^[a-z\-0-9]+$/,
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
    //externals: ['@aws-sdk/client-dynamodb'],
    module: {
        rules: [
            {
              test: /\.ts$/,
              exclude: /node_modules/,
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                experimentalFileCaching: true,
              },
            },
          ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};