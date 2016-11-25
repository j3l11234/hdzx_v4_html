var webpack = require('webpack');
var path= require('path');

module.exports = {
  entry: {
    common: [
      'md5',
      'react',
      'react-dom',
      'react/lib/ReactComponentWithPureRenderMixin.js'
    ],
    approve: __dirname + '/src/js/approve/index.js',
    issue: __dirname + '/src/js/issue/index.js',
    login: __dirname + '/src/js/login/index.js',
    myorder: __dirname + '/src/js/myorder/index.js',
    order: __dirname + '/src/js/order/index.js',
    lock: __dirname + '/src/js/lock/index.js',
  },
  output: {
    path: __dirname + '/dist/js',
    filename: '[name].js',
    publicPath: "/js",
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
  ].concat(process.env.NODE_ENV !== 'production' ? [] : [
     new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          'presets': [
            ['es2015', {modules: false}],
            'react'
          ]
        }
      }
    ]
  },
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : ''
};