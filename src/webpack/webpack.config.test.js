const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const { compact } = require('lodash');
const path = require('path');
const WildcardsEntryWebpackPlugin = require('wildcards-entry-webpack-plugin');

const {
  createScriptRules,
  createGlobalCssLoaders,
  createCssModulesLoaders,
  createExternals,
} = require('./shared');
const {
  srcDirectory,
  testsDistDirectory,
  publicPath,
  excludedPatterns,
  cssModulesPattern,
} = require('./variables');
const { createCommonConfig } = require('./webpack.config.common');

const common = createCommonConfig();

const testSpecificConfig = {
  name: 'tests',
  target: 'web',

  // This plugin watches for newly added test files and
  // updates webpack entries so that we do not have
  // to restart webpack again in watch mode to pick
  // up the changes.
  entry: WildcardsEntryWebpackPlugin.entry(
    path.resolve(srcDirectory, '__tests__/**/*.{ts,tsx}'),
    undefined,
    '/../tests',
  ),

  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.join(testsDistDirectory, 'bundle'),
    publicPath,

    // By default, webpack will generate source map URLs starting
    // with webpack://, but we need the actual, absolute file path
    // for Jest to find the source files.
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },

  stats: 'errors-only',

  performance: false,

  externals: createExternals(common.resolve.alias),

  module: {
    rules: compact([
      // CSS Modules
      {
        test: cssModulesPattern,
        exclude: excludedPatterns,
        use: createCssModulesLoaders(true),
      },

      // JavaScript and TypeScript
      ...createScriptRules(false),

      // Global CSS
      {
        test: /\.s?css$/,
        exclude: [...excludedPatterns, cssModulesPattern],
        use: createGlobalCssLoaders(true),
      },
    ]),
  },

  plugins: compact([
    new WildcardsEntryWebpackPlugin(),

    // Required for debugging in development and for long-term caching in production
    new webpack.NamedModulesPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.context),
    }),

    // Contains all Webpack bootstraping logic, required for `react-universal-component`
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'],
      filename: '[name].js',
      minChunks: Infinity,
    }),

    // Environment
    new webpack.DefinePlugin({
      __IS_SERVER__: false,
    }),
  ]),
};

module.exports = webpackMerge(common, testSpecificConfig);
