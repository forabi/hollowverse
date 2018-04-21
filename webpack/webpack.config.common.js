const { createScriptRules } = require('./shared');

const {
  createConditionalWithFallback,
} = require('@hollowverse/utils/helpers/env');

const webpackMerge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const CssChunkHashPlugin = require('css-chunks-html-webpack-plugin');
const NameAllModulesPlugin = require('name-all-modules-plugin');

const { getAppGlobals } = require('./appGlobals');

const webpack = require('webpack');
const path = require('path');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const { compact, mapValues } = require('lodash');

const {
  srcDirectory,
  excludedPatterns,
  cssModulesPattern,
} = require('./variables');

const { createGlobalCssLoaders, createCssModulesLoaders } = require('./shared');

const { ifPreact, isProd } = require('@hollowverse/utils/helpers/env');

/**
 *
 * @param {Webpack.Configuration} config
 * @param {object} options
 */
module.exports.createCommonConfig = (
  config,
  { isServer, dev: isDev, defaultLoaders },
) => {
  const ifServer = createConditionalWithFallback(isServer);
  const ifClient = createConditionalWithFallback(!isServer);

  const cssModulesLoaders = createCssModulesLoaders({ isServer });
  const cssGlobalLoaders = createGlobalCssLoaders({ isServer });

  const extractGlobalCss = new ExtractCssChunks({
    filename: isProd ? '[name].global.[contenthash].css' : '[name].global.css',
  });

  const extractLocalCss = new ExtractCssChunks({
    filename: isProd ? '[name].module.[contenthash].css' : '[name].module.css',
  });

  return webpackMerge(config, {
    // devtool: isDev ? 'cheap-module-source-map' : 'source-map',

    module: {
      rules: compact([
        // // Read source maps produced by TypeScript and Babel and merge
        // // them with Webpack's source maps
        // {
        //   test: /\.t|jsx?$/,
        //   exclude: excludedPatterns,
        //   use: ['source-map-loader'],
        //   enforce: 'pre',
        // },

        ...createScriptRules({ isServer, babelLoader: defaultLoaders.babel }),

        // CSS Modules
        {
          test: cssModulesPattern,
          exclude: excludedPatterns,
          use: isServer
            ? cssModulesLoaders
            : extractLocalCss.extract({ use: cssModulesLoaders }),
        },

        // Global CSS
        {
          test: /\.s?css$/,
          exclude: [...excludedPatterns, cssModulesPattern],
          use: isServer
            ? cssGlobalLoaders
            : extractGlobalCss.extract({ use: cssGlobalLoaders }),
        },

        {
          test: /\.(graphql|gql)$/,
          exclude: excludedPatterns,
          use: [
            {
              loader: 'raw-loader',
              options: {
                output: 'string',
                removeUnusedFragments: true,
              },
            },
            {
              loader: 'pattern-replace-loader',
              options: {
                multiple: [
                  { search: '#.*\n', flags: 'gi', replace: '' },
                  { search: '[\\s|,]*\n+[\\s|,]*', flags: 'gi', replace: ' ' },
                ],
              },
            },
          ],
        },

        // SVG assets
        {
          test: /\.svg$/,
          exclude: excludedPatterns,
          include: [srcDirectory],
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                extract: true,
                spriteFilename: isProd ? 'icons.[hash].svg' : 'icons.svg',
                esModule: false,
              },
            },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  { removeXMLNS: false },
                  { cleanupIDs: false },
                  { convertShapeToPath: false },
                  { removeEmptyContainers: false },
                  { removeViewBox: false },
                  { mergePaths: false },
                  { convertStyleToAttrs: false },
                  { convertPathData: false },
                  { convertTransform: false },
                  { removeUnknownsAndDefaults: false },
                  { collapseGroups: false },
                  { moveGroupAttrsToElems: false },
                  { moveElemsAttrsToGroup: false },
                  { cleanUpEnableBackground: false },
                  { removeHiddenElems: false },
                  { removeNonInheritableGroupAttrs: false },
                  { removeUselessStrokeAndFill: false },
                  { transformsWithOnePath: false },
                ],
              },
            },
          ],
        },
      ]),
    },

    resolve: {
      alias: {
        // Replace lodash with lodash-es for better tree shaking
        lodash: 'lodash-es',

        algoliasearch: 'algoliasearch/lite',

        'es6-promise': 'empty-module',

        // That's all what we need to use Preact instead of React
        ...ifPreact({
          react: 'preact-compat',
          'react-dom': 'preact-compat',
        }),
      },
      extensions: [
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.css',
        '.scss',
        '.module.scss',
      ],
      modules: [
        // Allow absolute imports from 'src' dir,
        // e.g. `import 'file';` instead of `'../../file';`
        // This also has to be set in `tsconfig.json`, check `compilerOptions.paths`
        srcDirectory,

        // Fallback to node_modules dir
        path.join(process.cwd(), 'node_modules'),
      ],
    },

    plugins: compact([
      extractGlobalCss,
      extractLocalCss,
      //   // Development
      //   // Do not watch files in node_modules as this causes a huge overhead
      //   new webpack.WatchIgnorePlugin([
      //     /node_modules/,

      //     // Ignore auto-generated type definitions for CSS module files
      //     /\.s?css\.d\.ts$/,
      //   ]),

      //   ifServer(
      //     new webpack.ProvidePlugin({
      //       URL: ['url', 'URL'],
      //       URLSearchParams: ['url', 'URLSearchParams'],
      //       fetch: ['node-fetch', 'default'],
      //     }),
      //   ),

      //   // Error handling
      //   // new webpack.NoEmitOnErrorsPlugin(), // Required to fail the build on errors

      //   // Environment
      //   new webpack.DefinePlugin(
      //     mapValues(
      //       mapValues(getAppGlobals({ isServer }), v => JSON.stringify(v)),
      //       v => JSON.stringify(v),
      //     ),
      //   ),

      //   new SpriteLoaderPlugin(),

      //   new webpack.NamedModulesPlugin(),

      ifClient(new CssChunkHashPlugin()),

      //   ...ifProd([
      //     // Chunks
      //     // See https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
      //     new webpack.NamedChunksPlugin(),
      //     new NameAllModulesPlugin(),

      //     // Banner
      //     new webpack.BannerPlugin({
      //       entryOnly: true,
      //       banner: 'chunkhash:[chunkhash]',
      //     }),

      //     new LodashModuleReplacementPlugin(),

      //     new webpack.optimize.OccurrenceOrderPlugin(true),

      //     // Scope hoisting a la Rollup (Webpack 3+)
      //     new webpack.optimize.ModuleConcatenationPlugin(),

      //     // Minification
      //     ...ifEs5([
      //       new UglifyJsPlugin({
      //         parallel: true,
      //         sourceMap: true,
      //         uglifyOptions: {
      //           comments: false,
      //           minimize: true,
      //           safari10: true,
      //           compress: {
      //             inline: false,
      //           },
      //         },
      //       }),
      //     ]),

      //     ...ifEsNext([
      //       new BabelMinifyPlugin({
      //         removeConsole: true,
      //         removeDebugger: true,
      //       }),
      //     ]),
      //   ]),

      //   new CircularDependencyPlugin({
      //     exclude: /node_modules/,
      //     failOnError: true,
      //   }),
    ]),
  });
};
