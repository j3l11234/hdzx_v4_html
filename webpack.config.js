var webpack = require('webpack');

const DIST_PATH = 'D:/xampp/htdocs/hdzx_v4/frontend/web/js';

module.exports = {
    entry: {
    common: [
      'react',
      'react/lib/ReactComponentWithPureRenderMixin.js'
    ],
    login: __dirname + '/src/js/login/index.js',
    myorder: __dirname + '/src/js/myorder/index.js',
    order: __dirname + '/src/js/order/index.js'
  },
  output: {
    path: DIST_PATH,
    filename: '[name].js',
    publicPath: "/js",
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: Infinity
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  devtool: 'source-map'
};