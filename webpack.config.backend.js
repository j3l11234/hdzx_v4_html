var webpack = require('webpack');

const DIST_PATH = 'D:/xampp/htdocs/hdzx_v4/backend/web/js';

module.exports = {
  entry: {
    common: [
      'md5',
      'react',
      'react-dom',
      'react/lib/ReactComponentWithPureRenderMixin.js'
    ],
    approve: __dirname + '/src/js/approve/index.js',
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