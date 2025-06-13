const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      fs: false,
      "path": false,
      "crypto": false,
      "stream": false,
      "buffer": false,
      "process": false,
      "util": false,
    },
  },
  module: {
    rules: [
      {
        test: /sql-wasm.js$/,
        use: [
          {
            loader: 'imports-loader',
            options: {
              additionalCode: 'var global = window;\nvar process = { env: { NODE_ENV: "development" } };',
            },
          },
        ],
      },
      {
        test: /sql-wasm.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/js/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  externals: {
    'sql.js': {
      commonjs: 'sql.js',
      commonjs2: 'sql.js',
      amd: 'sql.js',
      root: 'SQL',
    },
  },
};
