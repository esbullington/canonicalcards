var webpack = require('webpack');

module.exports = {
  cache: true,
  entry: './src/main.js',
  output: {
    filename: 'browser-bundle.js'
  },
  target: 'web',
  node: {
    fs: "empty"
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader'},
      {test: /\.json$/, loader: "json"}
    ]
  },
  plugins: [
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin()
  ]
};
