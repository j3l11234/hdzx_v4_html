var webpack = require('webpack');

module.exports = {
    entry: {
    lib: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'redux-thunk'
    ],
    home: __dirname + '/src/js/home/index.js',
    admin: __dirname + '/src/js/admin/index.js'
  },
  output: {
    path: __dirname + '/dist/js',
    filename: '[name].js',
    publicPath: "/js",
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'lib',
      minChunks: Infinity
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'react-hot',
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-3']
        }
      }
    ]
  },
  devtool: 'source-map'
};