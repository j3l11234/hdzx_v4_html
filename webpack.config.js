var webpack = require('webpack');

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
    path: '/dist/js',
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