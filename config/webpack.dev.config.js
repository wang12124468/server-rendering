const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const CLIENT_BUILD_PATH = path.resolve(__dirname, '../build/client');
const CLIENT_PATH = path.resolve(__dirname, '../client');
const SERVER_PATH = path.resolve(__dirname, '../server');

module.exports = {
    context: path.resolve(CLIENT_PATH, 'src'),
    devtool: 'eval-source-map',
    entry: {
        bundle: [
            '../',
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'
        ],
        vendor: [
            'react',
            'react-dom'
        ]
    },
    output: {
        path: CLIENT_BUILD_PATH,
        filename: '[name].js',
        chunkFilename: 'chunk.[name].js',
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react', 'stage-0', 'react-hmre'],
                    plugins: ['transform-runtime', 'add-module-exports'],
                    cacheDirectory: true
                }
            }]
        }, {
            test: /\.(jpg|png|gif|webp|svg)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8000
                }
            }]
        }, {
            test: /\.json$/,
            use: [
                'json-loader'
            ]
        }, {
            test: /\.html$/,
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            }]
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            })
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest'],
                filename: '[name].js'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
            new HtmlWebpackPlugin({
                filename: path.resolve(SERVER_PATH, 'index.html'),
                template: path.resolve(CLIENT_PATH, 'index.html')
            }),
            new ProgressBarPlugin({ summary: false })
    ]
}
