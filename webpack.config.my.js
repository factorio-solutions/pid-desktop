const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
<<<<<<< HEAD
  // devtool: 'source-map',
=======
>>>>>>> feature/new_api

  entry: ['./app/index'],

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
<<<<<<< HEAD
    // libraryTarget: 'commonjs2'
=======
>>>>>>> feature/new_api
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'API_ENTRYPOINT': JSON.stringify(process.env.API_ENTRYPOINT)
      }
    })
  ],

<<<<<<< HEAD
  externals: [
  ],

=======
>>>>>>> feature/new_api
  node: {
    fs: "empty"
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,         // Match both .js and .jsx files
        exclude: /node_modules/,
        loader: "babel",
        query:
          {
            presets:['react']
          }
      },
<<<<<<< HEAD
      // {
      //   test: /\.jsx?$/,
      //   loaders: 'babel-loader',
      //   exclude: /node_modules/
      // },
=======
>>>>>>> feature/new_api
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'sass?sourceMap'
        ]
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        ]
      }
    ]
  }
}
