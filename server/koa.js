import path from 'path';
import debug from 'debug';
import mount from 'koa-mount';

import koa from 'koa';

const app = koa();
const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  // set debug env, must be programmaticaly for windows
  debug.enable('dev,koa');
  // log when process is blocked
  require('blocked')((ms) => debug('koa')(`blocked for ${ms}ms`));
}

// Proxy asset folder to webpack development server in development mode
if (env === 'development') {
  const webpackConfig = require('./../webpack.config');
  const proxy = require('koa-proxy')({
    host: 'http://0.0.0.0:' + process.env.PORT,
    map: (filePath) => 'assets/' + filePath
  });
  app.use(mount('/assets', proxy));
} else {
  app.use(mount('/assets', staticCache(path.join(__dirname, '../dist'), cacheOpts)));
}

app.use(function* (){
  this.body = 'salut hehe';
});

app.listen(parseInt(process.env.PORT, 10) || 3000);

// Tell parent process koa-server is started
if (process.send) {
  process.send('online');
  debug('koa')(`Application started on port ${parseInt(process.env.PORT, 10) || 3000}`);
}
