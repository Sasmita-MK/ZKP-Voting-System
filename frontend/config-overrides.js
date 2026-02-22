const webpack = require('webpack');

module.exports = function override(config) {
    // 1. Setup Fallbacks
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "process": require.resolve("process/browser"),
        "buffer": require.resolve("buffer/"),
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "assert": require.resolve("assert/"),
    };

    // 2. Setup Plugins
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser.js', // Added .js extension here
        }),
    ]);

    // 3. FIX FOR THE .MJS / PROCESS ERROR
    config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
        resolve: {
            fullySpecified: false
        }
    });

    return config;
};