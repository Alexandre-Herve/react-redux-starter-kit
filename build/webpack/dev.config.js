import webpack from 'webpack';
import { isArray } from 'lodash';

import baseConfig from './base.config';
import startKoa from './utils/start-koa';

const { VIRTUAL_HOST, C9_HOSTNAME } = process.env;

const LOCAL_IP = require('dev-ip')();

const PORT = (C9_HOSTNAME) ? '443' : parseInt(process.env.PORT, 10) + 1 || 3001;
const HOST = VIRTUAL_HOST || C9_HOSTNAME || isArray(LOCAL_IP) && LOCAL_IP[0] || LOCAL_IP || 'localhost';
const PUBLIC_PATH = `//${HOST}:${PORT}/assets/`;

export default {
  server: {
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
  }
};
