import webpack       from 'webpack';
import config        from '../../config';
import webpackConfig from './_base';
import startKoa      from './utils/start-koa';

webpackConfig.devtool = 'source-map';

webpackConfig.entry.app.push(
  `webpack-hot-middleware/client?path=${config.get('webpack_public_path')}`,
  `webpack/hot/dev-server`
);

webpackConfig.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify('development')
    }
  }),
  function() { this.plugin('done', startKoa); }
);

// We need to apply the react-transform HMR plugin to the Babel configuration,
// but _only_ when HMR is enabled. Putting this in the default development
// configuration will break other tasks such as test:unit because Webpack
// HMR is not enabled there, and these transforms require it.
webpackConfig.module.loaders = webpackConfig.module.loaders.map(loader => {
  if (/js(?!on)/.test(loader.test)) {
    loader.query.env.development.extra['react-transform'].transforms.push({
      transform : 'react-transform-hmr',
      imports   : ['react'],
      locals    : ['module']
    });
  }

  return loader;
});

export default webpackConfig;

