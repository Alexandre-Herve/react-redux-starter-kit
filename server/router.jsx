import universalRender from '../shared/universal-render';

export default function *() {

  // Assets name are found into `webpack-stats`
  const assets = require('./webpack-stats.json');

  const { body, locale, title } = {
    body: yield universalRender(this.request.url),
    locale: 'fr',
    title: 'Mon titre'
  };

  yield this.render('main', { body, assets, locale, title });
}
