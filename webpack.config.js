const webpack = require('webpack');

module.exports = {
  entry: [
    `${__dirname}/index.js`,
  ],
  output: {
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
    path: `${__dirname}`,
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
    ],
  },
};