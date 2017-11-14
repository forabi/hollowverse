// tslint:disable:no-console

const clientConfig = require('./src/webpack/webpack.config.client');
const serverConfig = require('./src/webpack/webpack.config.server');
const { build } = require('./src/webpack/builder');
const { isProd } = require('./src/webpack/env');
const { promisify } = require('util');
const fs = require('fs');

const writeFile = promisify(fs.writeFile);

if (isProd) {
  build([clientConfig, serverConfig])
    .then(stats => {
      console.info('Build complete.');

      console.log(stats.toString());

      return writeFile(
        './dist/stats.json',
        JSON.stringify(stats.toJson(), undefined, 2),
      );
    })
    .catch(err => {
      console.error('Failed to build', err);
      process.exit(1);
    });
} else {
  console.warn(
    'This script should only be used to build a production build. ' +
      'Run yarn server/dev for development, or set NODE_ENV to "production"',
  );
  process.exit(1);
}