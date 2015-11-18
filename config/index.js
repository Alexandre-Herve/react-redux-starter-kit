/* eslint-disable */
import path     from 'path';
import { argv } from 'yargs';
import dotenv   from 'dotenv';
import chalk    from 'chalk';
import pkg      from '../package.json';
import { isArray } from 'lodash';
import webpack from 'webpack';

dotenv.load();
const config = new Map();

// ------------------------------------
// Dev Server Configuration
// ------------------------------------
const { VIRTUAL_HOST, C9_HOSTNAME } = process.env;
const LOCAL_IP = require('dev-ip')();
const PORT = (C9_HOSTNAME) ? '443' : parseInt(process.env.PORT, 10) + 1 || 3001;
const HOST = VIRTUAL_HOST || C9_HOSTNAME || isArray(LOCAL_IP) && LOCAL_IP[0] || LOCAL_IP || 'localhost';
const PUBLIC_PATH = `//${HOST}:${PORT}/assets/`;

config.set('server_config', {
  port: PORT,
  options: {
    publicPath: (C9_HOSTNAME) ? '/' : PUBLIC_PATH,
    hot: true,
    stats: {
      assets: true,
      colors: true,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false
    }
  }
});


// ------------------------------------
// User Configuration
// ------------------------------------
config.set('dir_src',  'src');
config.set('dir_dist', 'dist');
config.set('dir_test', 'tests');

config.set('coverage_enabled', !argv.watch);
config.set('coverage_reporters', [
  { type : 'text-summary' },
  { type : 'html', dir : 'coverage' }
]);

config.set('webpack_host',  'localhost');
config.set('webpack_port',  process.env.PORT || 3000);

// Define what dependencies we'd like to treat as vendor dependencies,
// but only include the ones that actually exist in package.json. This
// makes it easier to remove dependencies without breaking the
// vendor bundle.
config.set('vendor_dependencies', [
  'history',
  'react',
  'react-redux',
  'react-router',
  'redux',
  'redux-router'
].filter(dep => {
  if (pkg.dependencies[dep]) return true;

  console.log(chalk.yellow(
    `Package "${dep}" was not found as an npm dependency and won't be ` +
      `included in the vendor bundle.\n` +
      `Consider removing it from vendor_dependencies in ~/config/index.js`
  ));
}));

/*  *********************************************
    -------------------------------------------------

    All Internal Configuration Below
    Edit at Your Own Risk

    -------------------------------------------------
 ************************************************/
// ------------------------------------
// Environment
// ------------------------------------
config.set('env', process.env.NODE_ENV);
config.set('globals', {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.get('env'))
  },
  'NODE_ENV'     : config.get('env'),
  '__DEV__'      : config.get('env') === 'development',
  '__PROD__'     : config.get('env') === 'production',
  '__DEBUG__'    : config.get('env') === 'development' && !argv.no_debug,
  '__DEBUG_NW__' : !!argv.nw
});

// ------------------------------------
// Webpack
// ------------------------------------
config.set('webpack_public_path', `//${HOST}:${PORT}/__webpack_hmr`);

// ------------------------------------
// Project
// ------------------------------------
config.set('path_project', path.resolve(__dirname, '../'));

// ------------------------------------
// Utilities
// ------------------------------------
const paths = (() => {
  const base    = [config.get('path_project')];
  const resolve = path.resolve;

  const project = (...args) => resolve.apply(resolve, [...base, ...args]);

  return {
    project : project,
    src     : project.bind(null, config.get('dir_src')),
    dist    : project.bind(null, config.get('dir_dist'))
  };
})();

config.set('utils_paths', paths);
config.set('utils_aliases', [
  'middleware',
  'actions',
  'components',
  'constants',
  'containers',
  'layouts',
  'reducers',
  'routes',
  'services',
  'store',
  'styles',
  'utils',
  'views'
].reduce((acc, dir) => ((acc[dir] = paths.src(dir)) && acc), {}));

export default config;
/* eslint-enable */
