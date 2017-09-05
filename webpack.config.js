const path = require('path')
const webpack = require('webpack')
const BabelPolyfill = require("babel-polyfill")

module.exports = {
  devtool: 'source-map',

  entry: ['babel-polyfill', './app/index'],

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.join(__dirname, 'public'),
      'node_modules',
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.RAILS_ENV || 'production'), // Heroku will have RAILS_ENV variable for Rails server
        'API_ENTRYPOINT': JSON.stringify(process.env.API_ENTRYPOINT || 'http://localhost:3000')
      }
    })
  ],

  node: {
    __dirname: false,
    __filename: false,
    fs: "empty"
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
}
