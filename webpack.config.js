var webpack = require('webpack');
var path= require('path');

module.exports = {
  entry: {
    react_common: [
      'md5',
      'react',
      'react-dom',
      'react/lib/ReactComponentWithPureRenderMixin.js'
    ],
    vue_common: [
      'md5',
      'vue',
      'vue-router',
      'vuex'
    ],
    react_approve: './src/js/approve/index.js',
    react_issue: './src/js/issue/index.js',
    react_login: './src/js/login/index.js',
    react_myorder: './src/js/myorder/index.js',
    // react_order: './src/js/order/index.js',
    react_lock: './src/js/lock/index.js',
    vue_apply: './src/js/vue_apply/main.js',
    function: './src/js/common/function.js'
  },
  output: {
    path: path.resolve(__dirname, './dist/js'),
    filename: '[name].js',
    publicPath: "/js",
  },
  externals: {
    jquery: 'jQuery.noConflict()'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        }
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'react_common',
      minChunks: 3,
      chunks: ['react_approve', 'react_issue', 'react_login', 'react_myorder', 'react_lock'],
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vue_common',
      minChunks: Infinity,
      chunks: ['vue_apply']
    }),
    
  ],
  //devtool: '#eval-source-map'
  devtool: '#source-map'
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
