'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      contentScript: PATHS.src + '/contentScript.ts',
      helloChookies: PATHS.src + '/helloChookies.js',
      getCookies: PATHS.src + '/getCookies.js',
      parser: PATHS.src + '/parser.js',
      psl: PATHS.src + '/psl.min.js',
      cookies: PATHS.src + '/storage/cookies.ts',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
  });

module.exports = config;
