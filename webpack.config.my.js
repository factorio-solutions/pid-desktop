const path = require('path')
const webpack = require('webpack')
// const BabiliPlugin = require('babili-webpack-plugin')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer')
const BabelPolyfill = require("babel-polyfill")

module.exports = {
  // devtool: 'cheap-module-eval-source-map',
  devtool: 'source-map',

  // entry: ['./app/index'], // WP1
  entry: ['babel-polyfill', './app/index'],

  // output: { // WP1
  //   path: path.join(__dirname, 'public'),
  //   filename: 'bundle.js',
  //   publicPath: '/public/'
  // },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    // libraryTarget: 'commonjs2' // can be commented
    publicPath: '/public/'
  },

  // resolve: { // WP1
  //   extensions: ['.js', '.jsx', '.json'],
  //   mainFields: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  // },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.join(__dirname, 'public'),
      'node_modules',
    ],
  },

  // plugins: [
  //   new webpack.optimize.DedupePlugin(),
  //   new webpack.optimize.UglifyJsPlugin({
  //     minimize: true,
  //     compress: {
  //       warnings: false
  //     }
  //   }),
  //   new webpack.DefinePlugin({
  //     'process.env': {
  //       'NODE_ENV': JSON.stringify('production'),
  //       // 'API_ENTRYPOINT': JSON.stringify(process.env.API_ENTRYPOINT)
  //       'API_ENTRYPOINT': JSON.stringify('http://localhost:3000')
  //     }
  //   })
  // ],
  plugins: [
    // new BabiliPlugin(),

    new WebpackBundleAnalyzer.BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
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
      // { // from WP2 this should work by default
      //   test: /\.json$/,
      //   use: 'json-loader'
      //   // loader: 'json-loader'
      // },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     {
      //       loader: 'style-loader'
      //     },
      //     {
      //       loader: 'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
      //     },
      //     {
      //       loader: 'sass-loader?sourceMap'
      //     }
      //   ]
      // },
      {
        test: /\.scss$/,
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
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     {
      //       loader: 'style-loader'
      //     },
      //     {
      //       loader: 'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      //     }
      //   ]
      // },
      {
        test: /\.css$/,
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
          }
        ]
      }
    ]
  }
}
