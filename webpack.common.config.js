const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  output: {
    path: __dirname + '/build/',
    filename: '[name].js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css', { allChunks: true }),
    // http://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin('shared.js'),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'dashboard.html',
      template: './src/dashboard.html'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'index.html',
      template: './src/unify/index.html'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'news.html',
      template: './src/unify/news.html'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'tariffs.html',
      template: './src/unify/tariffs.html'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'guides.html',
      template: './src/unify/guides.html'
    })
  ],

  module: {
    loaders: [
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader') },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
      { test: /\.(png|jpg|gif|txt|svg|woff2|otf|eot|ttf|woff).*$/, loader: 'file-loader?name=[path][name].[ext]'},
      { test: /\.json$/, loader: 'json-loader'}
    ]
  },

  postcss: [ autoprefixer({ browsers: ['last 2 versions', 'Chrome > 36'] }) ],

  // Automatically transform files with these extensions
  resolve: {
    extensions: ['', '.js', '.jsx', '.css']
  }
};

