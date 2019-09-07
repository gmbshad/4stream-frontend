const webpack = require('webpack');
const commonExportsObject = require('./webpack.common.config');
/**
 * This is the Webpack configuration file for production.
 */
const localExports = {

  entry: {
    dashboard: './src/dashboard',
    unify: './src/unify/index'
  },

  devtool: 'hidden-source-map',
  // sourceMap filename that's hard to guess, it protects original code from viewing, whereas allows to debug it
  output: Object.assign({
    sourceMapFilename: '[file].EKUDNY2BHP9EWJVA.map'
  }, commonExportsObject.output),

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production'),
        'SA_PROTOCOL': JSON.stringify(process.env.SA_PROTOCOL),
        'SA_HOST': JSON.stringify(process.env.SA_HOST),
        'TWITCH_APP_ID': JSON.stringify(process.env.TWITCH_APP_ID)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ].concat(commonExportsObject.plugins),

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
    ].concat(commonExportsObject.module.loaders)
  }
};
module.exports = Object.assign({}, commonExportsObject, localExports);

