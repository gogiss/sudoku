const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: '/src/sudoku.js', // Entry point of your app
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html', // Use index.html from the src directory
    }),
    new CopyPlugin({
        patterns: [
            {
                from: path.resolve(__dirname, 'src/sudoku.css'),
            },
        ],
    }),
  ],
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all',
    static: {
        directory: path.resolve(__dirname, "./dist"),
    },
    open: true,
    hot: true,
    port: 9000,
  },
};
