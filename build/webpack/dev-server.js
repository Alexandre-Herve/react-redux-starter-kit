process.env.BABEL_ENV = 'browser';
process.env.NODE_ENV = 'development';

import koa from 'koa';
import debug from 'debug';
import webpack from 'webpack';

import webpackConfig from '../../webpack.config.js';
import config from '../../config';

const app = koa();
const compiler = webpack(webpackConfig);

debug.enable('dev');

app.use(require('koa-webpack-dev-middleware')(compiler, config.get('server_config').options));
app.use(require('koa-webpack-hot-middleware')(compiler));

app.listen(config.get('server_config').port, '0.0.0.0', function() {
  debug('dev')('`webpack-dev-server` listening on port %s', config.get('server_config').port);
});
