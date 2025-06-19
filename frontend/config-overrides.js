const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  webpack: function(config, env) {
    config.resolve.fallback = {
      fs: false,
      path: false,
      crypto: false,
    };

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'node_modules/sql.js/dist/sql-wasm.wasm',
            to: '../public/sql-wasm.wasm',
          },
        ],
      })
    );

    return config;
  },
  devServer: function(configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.headers = {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      };
      return config;
    };
  },
};
