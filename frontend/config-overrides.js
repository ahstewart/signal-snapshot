module.exports = function override(config) {
  // Add fallback for 'fs' to fix sql.js browser build error
  if (!config.resolve) config.resolve = {};
  if (!config.resolve.fallback) config.resolve.fallback = {};
  config.resolve.fallback.fs = false;
  config.resolve.fallback.path = false;
  config.resolve.fallback.crypto = false;
  return config;
};
