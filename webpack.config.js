var webpack = require('webpack');

module.exports = {
    entry: {
    lib: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'redux-router',
      'redux-thunk',
      'history' 
    ],
    app: __dirname + '/src/js/index.js',
  },
  output: {
    path: __dirname + '/dist/js',
    filename: '[name].js'
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
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-3']
        }
      }
    ]
  },
  devtool: 'source-map'
};