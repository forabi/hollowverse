// const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

const NameAllModulesPlugin = require('name-all-modules-plugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');

const path = require('path');
const compact = require('lodash/compact');

const {
  createGlobalCssLoaders,
  createCssModulesLoaders,
  createScriptRules,
} = require('./shared');
const {
  srcDirectory,
  pkg,
  publicPath,
  excludedPatterns,
  cssModulesPattern,
} = require('./variables');
const common = require('./webpack.config.common');

const {
  ifEs5,
  ifEsNext,
  // ifLint,
  ifProd,
  ifDev,
  ifReact,
  ifPreact,
  ifHot,
  ifPerf,
  isProd,
  isStats,
} = require('./env');

// const svgoConfig = {
//   plugins: [
//     { removeXMLNS: false },
//     { cleanupIDs: false },
//     { convertShapeToPath: false },
//     { removeEmptyContainers: false },
//     { removeViewBox: false },
//     { mergePaths: false },
//     { convertStyleToAttrs: false },
//     { convertPathData: false },
//     { convertTransform: false },
//     { removeUnknownsAndDefaults: false },
//     { collapseGroups: false },
//     { moveGroupAttrsToElems: false },
//     { moveElemsAttrsToGroup: false },
//     { cleanUpEnableBackground: false },
//     { removeHiddenElems: false },
//     { removeNonInheritableGroupAttrs: false },
//     { removeUselessStrokeAndFill: false },
//     { transformsWithOnePath: false },
//   ],
// };

// const svgLoaders = [
//   {
//     loader: 'svgo-loader',
//     options: svgoConfig,
//   },
// ];

// const createSvgIconLoaders = name => [
//   {
//     loader: 'svg-sprite-loader',
//     options: {
//       extract: true,
//       spriteFilename: name,
//       runtimeCompat: false,
//     },
//   },
//   ...svgLoaders,
// ];

const clientSpecificConfig = {
  name: 'client',
  target: 'web',
  entry: compact([
    ifHot(
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false',
    ),
    ifReact(ifHot('react-hot-loader/patch')),
    ifPreact(ifDev('preact/devtools')),
    ifProd('regenerator-runtime/runtime'),
    path.resolve(srcDirectory, 'clientEntry.ts'),
  ]),

  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath,
  },

  // Producing build stats require that this property contains details about assets
  // Setting it to `undefined` keeps the default, which is to produce stats.
  stats: isStats ? undefined : 'errors-only',

  // Enforce performance limits for production build if PERF flag is set
  performance:
    ifProd(
      ifPerf({
        hints: 'error',
        maxEntrypointSize: 60000,
        maxAssetSize: 50000,
      }),
    ) || false,

  module: {
    rules: compact([
      // JavaScript and TypeScript
      ...createScriptRules(false),

      // CSS Modules
      {
        test: cssModulesPattern,
        exclude: excludedPatterns,
        use: ExtractCssChunks.extract({
          use: createCssModulesLoaders(false),
        }),
      },

      // Global CSS
      {
        test: /\.s?css$/,
        exclude: [...excludedPatterns, cssModulesPattern],
        use: ExtractCssChunks.extract({
          use: createGlobalCssLoaders(false),
        }),
      },

      // // SVG Icons
      // {
      //   test: /\.svg$/,
      //   exclude: excludedPatterns,
      //   include: [path.resolve(srcDirectory, 'icons')],
      //   use: createSvgIconLoaders('icons.svg'),
      // },

      // // SVG assets
      // {
      //   test: /\.svg$/,
      //   exclude: excludedPatterns,
      //   include: [path.resolve(srcDirectory, 'assets')],
      //   use: svgLoaders,
      // },
    ]),
  },

  plugins: compact([
    // CSS
    // extractCssModules,
    new ExtractCssChunks(),

    // Required for debugging in development and for long-term caching in production
    new webpack.NamedModulesPlugin(),

    // SVG sprites
    // new SpriteLoaderPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.context),
    }),

    // Production-only
    ...ifProd([
      // Chunks

      // See https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
      new webpack.NamedChunksPlugin(),
      new NameAllModulesPlugin(),

      new webpack.optimize.OccurrenceOrderPlugin(true),

      // Scope hoisting a la Rollup (Webpack 3+)
      new webpack.optimize.ModuleConcatenationPlugin(),

      // Minification
      ...ifEs5([
        new webpack.optimize.UglifyJsPlugin({
          // @ts-ignore
          minimize: true,
          comments: false,
          sourceMap: true,
        }),
      ]),

      ...ifEsNext([new BabelMinifyPlugin()]),

      // Banner
      new webpack.BannerPlugin({
        entryOnly: true,
        banner: `${pkg.name} hash:[hash], chunkhash:[chunkhash], name:[name]`,
      }),
    ]),

    // Contains all Webpack bootstraping logic
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'],
      filename: isProd ? '[name].[chunkhash].js' : '[name].js',
      minChunks: Infinity,
    }),

    ifHot(new webpack.HotModuleReplacementPlugin()),
  ]),
};

module.exports = webpackMerge(common, clientSpecificConfig);