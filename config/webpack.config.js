'use strict';

const { merge } = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      contentScript: PATHS.src + '/contentScript.ts',
      deleteAllCookies: PATHS.src + '/deleteAllCookies.js',
      getCookies: PATHS.src + '/getCookies.js',
      parser: PATHS.src + '/parser.js',
      psl: PATHS.src + '/psl.min.js',
      cookies: PATHS.src + '/storage/cookies.ts',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    plugins: [
      new BrowserSyncPlugin(
        {
          host: 'localhost',
          port: 3000,
          files: [
            {
              match: ['**/*'],
              fn: function (event, file) {
                if (event === 'change') {
                  const bs = require('browser-sync').get('bs-webpack-plugin');
                  bs.reload();
                }
              },
            },
          ],
          browser: 'google-chrome',
          reloadDelay: 0,
          reloadDebounce: 0,
          reloadOnRestart: true,
          notify: false,
        },
        {
          reload: false,
          injectCss: true,
          name: 'bs-webpack-plugin',
        }
      ),
    ],
  });

module.exports = config;
