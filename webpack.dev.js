const webpack = require('webpack');
const config = require('./webpack.base');

// plugins
const DefinePlugin = webpack.DefinePlugin;
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const NoErrorsPlugin = webpack.NoErrorsPlugin;
const OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  cache: true,
  debug: true,
  devtool: 'source-map', // for faster builds use 'cheap-module-eval-source-map'
  output: config.output,
  resolve: config.resolve,
  postcss: config.postcss,
  sassLoader: config.sassLoader,

  entry: {
    main: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/dev-server',
      config.entry.main
    ],
    vendor: config.entry.vendor
  },

  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {
        plugins: [
          ['react-transform', {
            transforms: [{
              transform: 'react-transform-hmr',
              imports: ['react'],
              locals: ['module']
            }]
          }]
        ]
      }},

      {test: /\.scss$/, loader: 'style!css!postcss-loader!sass'},

      {
        test: /masonry|imagesloaded|fizzy\-ui\-utils|desandro\-|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
        loader: 'imports?define=>false&this=>window'
      }
    ]
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new OccurenceOrderPlugin(),
    new HotModuleReplacementPlugin(),
    new NoErrorsPlugin(),
    new OfflinePlugin(),
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      filename: 'index.html',
      hash: true,
      inject: 'body',
      template: './src/index.html'
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:3000' })
  ],

  devServer: {
    contentBase: './src',
    historyApiFallback: true,
    hot: true,
    port: 3000,
    progress: true,
    publicPath: config.output.publicPath,
    stats: {
      cached: true,
      cachedAssets: true,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false
    }
  }
};
