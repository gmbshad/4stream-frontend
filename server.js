const express = require('express');
const app = express();
const request = require('request');

app.get('/', function(req, res) {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build/index.html');
  } else {
    request('http://localhost:9090/build/index.html').pipe(res);
  }
});

app.get([
  '/index.html',
  '/news.html',
  '/tariffs.html',
  '/guides.html'], function(req, res) {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build' + req.originalUrl);
  } else {
    request('http://localhost:9090/build' + req.originalUrl).pipe(res);
  }
});

// Serve application file depending on environment
app.get([
  '/shared.js',
  '/unify.js',
  '/unify.css',
  '/dashboard.js',
  '/dashboard.css',
  '/resources*',
  '/node_modules*',
  '/src/unify*'], function(req, res) {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build' + req.originalUrl);
  } else {
    res.redirect('//localhost:9090/build' + req.originalUrl);
  }
});

app.get('*', function(req, res) {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build/dashboard.html');
  } else {
    request('http://localhost:9090/build/dashboard.html').pipe(res);
  }
});


/*************************************************************
 *
 * Webpack Dev Server
 *
 * See: http://webpack.github.io/docs/webpack-dev-server.html
 *
 *************************************************************/

if (!process.env.PRODUCTION) {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const config = require('./webpack.local.config');

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    noInfo: true,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  }).listen(9090, 'localhost', function(err) {
    if (err) {
      console.error(err);
    }
  });
}

const port = process.env.PORT || 8889;
const server = app.listen(port, function() {
  console.log('Listening at http://%s:%s', server.address().address, server.address().port);
});
