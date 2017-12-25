const npsUtils = require('nps-utils');

module.exports = {
  scripts: {
    test: 'run-p -l --aggregate-output validate-filenames lint-js lint-ts lint-css',
    lint: {
      css: 'stylelint --syntax scss \'src/app/**/*.scss\'',
      js: 'eslint \'**/*.js{,x}\'',
      ts: 'tslint \'./*.ts\' \'src/**/*.ts{,x}\' --project .',
      filenames: 'validate-filenames -c commonconfig.js',
    },
    clean: {
      css:  'del-cli \'./src/app/**/*.module.scss.d.ts\'',
      build: 'del-cli \'./dist\' && mkdir -p ./dist',
    },
    start: {
      dev: '',
      prod: 'node dist/mainServer.js'
    },
    build: {
      server: 'tsc --project ./src',
      client: 'NODE_ENV=production NO_PERF_CHECKS=1 node ./build.js',
      types: {
        graphql: '',
      },
    },
    analyze: {
      bundlesize: 'bundlesize',
      bundles: 'webpack-bundle-analyzer dist/stats.json dist/',
    },
      // appBuild: 'API_ENDPOINT=${API_ENDPOINT:-https://api.hollowverse.com/graphql} run-s -l app/graphql/build app/webpack/build bundlesize',
      // appAnalyze: '',
      // appGraphqlSchema: 'apollo-codegen introspect-schema ${API_ENDPOINT} --output ./graphqlSchema.json',
      // appGraphqlTypes: 'apollo-codegen generate \'src/app/{**,!api}/*.ts{,x}\' --target typescript --output src/app/api/types.ts',
      // appGraphqlDev: 'nodemon -q --watch src/app --ext ts,tsx --exec \'run-s app/graphql/schema app/graphql/types\'',
      // appGraphqlBuild: 'run-s -l app/graphql/schema app/graphql/types',
      // serverAppServerDev: 'APP_SERVER_PORT=${APP_SERVER_PORT:-3001} HOT=1 NODE_ENV=development node --inspect=9231 -r \'source-map-support/register\' -r \'ts-node/register\' src/appServer.ts',
      // serverAppServerStart: 'node dist/appServer.js',
      // serverMainServerDev: 'PORT=${PORT:-8081} nodemon -q --watch src --ignore src/app --ignore src/webpack --ext ts,tsx,json --exec \'node --inspect=0.0.0.0:${SERVER_DEBUG_PORT:-9231} -r \'ts-node/register\' src/mainServer.ts\'',
      // serverMainServerStart: 'node dist/mainServer.js',
      // default: 'NODE_ENV=production run-p server/main-server/start',
      // dev: 'NODE_ENV=development API_ENDPOINT=${API_ENDPOINT:-http://localhost:8080/graphql} npm-run-all -l -s clean -p app/graphql/dev server/app-server/dev',
      // lintStaged: 'lint-staged'
  }
};
