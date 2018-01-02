const path = require('path')
const webpack = require('webpack')
// const BabiliPlugin = require('babili-webpack-plugin')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer')
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

  devServer: { // synch history with redux and react-router
    historyApiFallback: true
  },

  plugins: [
    new WebpackBundleAnalyzer.BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.RAILS_ENV || 'develop'), // Heroku will have RAILS_ENV variable for Rails server
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
      { // css files not included in modules correctly
        test: /.*(swiper.min|noHash).*\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        exclude: /.*(swiper.min|noHash).*/,
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
