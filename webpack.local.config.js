const webpack = require('webpack');
const commonExportsObject = require('./webpack.common.config');
/**
 * This is the Webpack configuration file for local development. It contains
 * local-specific configuration such as the React Hot Loader, as well as:
 *
 * - The entry point of the application
 * - Where the output file should be
 * - Which loaders to use on what files to properly transpile the source
 *
 * For more information, see: http://webpack.github.io/docs/configuration.html
 */
const localExports = {

  // Efficiently evaluate modules with source maps
  devtool: 'eval',

  // Set entry point to ./src/index and include necessary files for hot load
  entry: {
    dashboard: ['webpack-dev-server/client?http://localhost:9090', 'webpack/hot/only-dev-server', './src/dashboard'],
    unify: ['webpack-dev-server/client?http://localhost:9090', 'webpack/hot/only-dev-server', './src/unify/index'],
  },

  // This will not actually create a bundle.js file in ./build. It is used
  // by the dev server for dynamic hot loading.
  output: Object.assign({
    publicPath: 'http://localhost:9090/build/'
  }, commonExportsObject.output),

  // Necessary plugins for hot load
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'SA_PROTOCOL': JSON.stringify('http'),
        'SA_HOST': JSON.stringify('localhost'),
        'TWITCH_APP_ID': JSON.stringify('dri15wvh9i32a31utyul6dtzt16dohm')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ].concat(commonExportsObject.plugins),

  // Transform source code using Babel and React Hot Loader
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel-loader'] }
    ].concat(commonExportsObject.module.loaders)
  }
};

module.exports = Object.assign({}, commonExportsObject, localExports);
