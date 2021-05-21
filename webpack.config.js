module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' },
    ],
  },
  resolve: {
    extensions: ['.jsx', '.css', '.js']
  }
};