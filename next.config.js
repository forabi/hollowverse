const { createCommonConfig } = require('./webpack/webpack.config.common');

// const withTypescript = require('@zeit/next-typescript');\

module.exports = nextConfig => ({
  webpack(config, options) {
    return createCommonConfig(config, options);
  },
  pageExtensions: [nextConfig.pageExtensions, 'tsx', 'tsx'],
});
