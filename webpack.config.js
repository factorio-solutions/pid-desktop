const path = require('path')
const webpack = require('webpack')
/**
* Babel polyfill adds all needed function used in modern javascript.
* We don't need to care about browser features anymore.
* */
const BabelPolyfill = require('babel-polyfill')
/**
* By separating css into separate file (loading it in HTML header) with ExtractTextPlugin, it loads css in parallel to js.
* By the time js is loaded css is already applied.
* It also allows to cache css separate to js, further improving loading times.
* This makes imposible to hot reload modules, but we dont need that in production.
* It also adds compilation time, which is a good trade for better loading times.
* */
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


let env = process.env.RAILS_ENV
if (!env || env === 'alpha') {
  env = 'production'
}


module.exports = {
  devtool: 'nosources-source-map',

  entry: [ 'babel-polyfill', './app/index' ],

  output: {
    path:       path.join(__dirname, 'public'),
    // filename:   'bundle.js',
    filename:   '[name].[hash].js',
    publicPath: '/public/'
  },

  resolve: {
    extensions: [ '.js', '.jsx', '.json' ],
    modules:    [
      path.join(__dirname, 'public'),
      'node_modules'
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV:       JSON.stringify(env), // Heroku will have RAILS_ENV variable for Rails server
        API_ENTRYPOINT: JSON.stringify(process.env.API_ENTRYPOINT || 'http://localhost:3000')
      }
    }),
    // new ExtractTextPlugin('styles.css'),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name:     'shared',
      filename: 'shared.js'
    }),
    new webpack.SourceMapDevToolPlugin({
      module:                 true,
      columns:                false,
      moduleFilenameTemplate: info => { return `${info.resourcePath}?${info.loaders}` }
    }),
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],

  node: {
    __dirname:  false,
    __filename: false,
    fs:         'empty'
  },

  module: {
    rules: [
      {
        test:    /\.jsx?$/,
        exclude: /node_modules/,
        use:     {
          loader:  'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      { // css files not included in modules correctly
        test: /.*(swiper.min|noHash).*\.css$/,
        use:  [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test:    /\.(scss|css)$/,
        exclude: /.*(swiper.min|noHash).*/,
        use:     ExtractTextPlugin.extract([
          {
            loader:  'css-loader',
            options: {
              sourceMap:      true,
              modules:        true,
              importLoaders:  1,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'sass-loader'
          }
        ])
      }
    ]
  }
}
