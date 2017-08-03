const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const CLIENT_PATH = path.resolve(__dirname, '../client');
const CLIENT_DIST_PATH = path.resolve(__dirname, '../dist/client');
const SERVER_DIST_PATH = path.resolve(__dirname, '../dist/server');

function getExternals() {
    return fs.readdirSync(path.resolve(__dirname, '../node_modules'))
        .filter(filename => !filename.includes('.bin'))
        .reduce((externals, filename) => {
            externals[filename] = `commonjs ${filename}`

            return externals
        }, {})
}

const clientConfig = {
    context: path.resolve(__dirname, '..'),
    entry: {
        bundle: './client',
        vendor: [
            'react',
            'react-dom'
        ]
    },
    output: {
        path: CLIENT_DIST_PATH,
        filename: '[name].[chunkhash:8].js',
        chunkFilename: 'chunk.[name].[chunkhash:8].js',
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react', 'stage-0'],
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
        extensions: ['', '.js', '.jsx', '.json']
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'],
            filename: '[name].[chunkhash:8].js'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            comments: false
        }),
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../view/prod', 'index.html'),
            template: path.resolve(CLIENT_PATH, 'index.html'),
            chunksSortMode: 'none'
        }),
        // new ExtractTextPlugin('[name].[contenthash:8].css', { allChunks: true })
    ]
}

const serverConfig = {
    context: path.resolve(__dirname, '..'),
    entry: {
        server: './server/app.js'
    },
    output: {
        path: SERVER_DIST_PATH,
        filename: '[name].js',
        chunkFilename: 'chunk.[name].js'
    },
    target: 'node',
    node: {
        __dirname: true,
        __filename: true
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: ['add-module-exports'],
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
            test: /\.html$/,
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            }]
        }, {
            test: /\.json$/,
            use: [
                'json-loader'
            ]
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: [
                    'css-loader'
                ]
            })
        }]
    },
    externals: getExternals(),
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            comments: false
        }),
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) })
    ]
}

module.exports = [clientConfig, serverConfig]