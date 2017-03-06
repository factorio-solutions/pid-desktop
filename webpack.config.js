'use strict';

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const requireFromString = require('require-from-string');
const MemoryFS = require('memory-fs');
const deasync = require('deasync');
const branch = require('git-branch');

const __PROD__ = process.env.NODE_ENV === 'production';
const __CORDOVA__ = process.env.BUILD_TARGET === 'cordova';
const __DEV__ = __PROD__ === false;

const packageFile = require('./package.json');

 // Take cordova enviroment, if not prod, if not dev
const enviroment = packageFile.enviroments[
  (__CORDOVA__ && '__CORDOVA__') ||
  (__PROD__ && '__PROD__') ||
  (__DEV__ && '__DEV__')
];

const __SSR__ = enviroment.__SSR__;
const __DEVTOOLS__ = enviroment.__DEVTOOLS__;

const define = {
  __DEV__: JSON.stringify(__DEV__),
  __PROD__: JSON.stringify(__PROD__),
  'process.env': {
    'NODE_ENV': JSON.stringify(__PROD__ ? 'production' : 'development'),
    // 'API_ENTRYPOINT': JSON.stringify('http://localhost:3000')
    // 'API_ENTRYPOINT': JSON.stringify(branch.sync() == 'master' ? 'https://park-it-direct.herokuapp.com' : 'https://park-it-direct-alpha.herokuapp.com')
    // 'API_ENTRYPOINT': JSON.stringify('https://park-it-direct-alpha.herokuapp.com')
    'API_ENTRYPOINT': JSON.stringify('https://park-it-direct.herokuapp.com')
  },
  __CORDOVA__: JSON.stringify(__CORDOVA__),
  __SSR__: JSON.stringify(__SSR__),
  __DEVTOOLS__: JSON.stringify(__DEVTOOLS__)
};

let getServerString = undefined;
const webpackConfig = {
  devtool: __DEV__ ? 'source-map' : false,
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: path.join(__dirname, 'www'),
    filename: '[name].js',
    publicPath: ''
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign(define, {
      __CLIENT__: JSON.stringify(true),
      __SERVER__: JSON.stringify(false)
    })),
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      minify: {},
      getAppContent: () => (__SSR__ && false ? getServerString() : ''),
      template: './src/app.html', // Load a custom template
      inject: 'body' // Inject all scripts into the body
    })
  ].concat(__PROD__ ? [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false
      },
      sourceMap: false
    })
  ] : []),
  node: {
    fs: "empty"
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|js)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          env: {
            development: {
              presets: ['react-hmre']
            }
          }
        }
      },
      { test: /.*(font-awesome|normalize.css|define-fonts|onsen).*\.css$/, loader: 'style-loader!css-loader'},
      {
        test: /\.(scss|css)$/,
        exclude: /.*(font-awesome|normalize.css|define-fonts|onsen).*/,
        loader: __PROD__ ? ExtractTextPlugin.extract(
          'style',
          'css?modules&importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true'
        )
        : 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=8192'
      },
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&minetype=application/font-woff'},
      // { test: /\.woff2$/, loader: 'url?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]' },
      {
        test: /\.(eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file'
      }, {
        test: /\.(ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=100000'
      }
    ]
  }
};

getServerString = () => { // TODO Resolve if we will need it
  const fs = new MemoryFS();

  const compiler = webpack(Object.assign(webpackConfig, {
    entry: './src/server.jsx',
    output: {
      path: '/',
      filename: 'bundle.js',
      libraryTarget: 'umd'
    },
    module: Object.assign(webpackConfig.module, {
      loaders: webpackConfig.module.loaders.map(loaderObj => {
        let returnedLoaderObj;
        if (loaderObj.test.toString() === /\.(scss|css)$/.toString()) {
          returnedLoaderObj = Object.assign(loaderObj, {
            loader: 'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!sass'
          });
        } else {
          returnedLoaderObj = loaderObj;
        }
        return returnedLoaderObj;
      })
    }),
    plugins: [
      new webpack.DefinePlugin(Object.assign(define, {
        __CLIENT__: JSON.stringify(false),
        __SERVER__: JSON.stringify(true)
      }))
    ]
  }));

  let sync = true;
  let data = null;
  compiler.outputFileSystem = fs;
  compiler.run(err => {
    if (err) {
      throw err;
    }
    const fileContent = fs.readFileSync('/bundle.js').toString('ascii');
    // Using eval because we can't require from `memory-fs`
    data = requireFromString(fileContent);
    sync = false;
  });

  while (sync) {
    deasync.sleep(100);
  }

  return data;
};

module.exports = webpackConfig;
