const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const MODE = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const DOCS_PATH = path.resolve(__dirname, 'docs');
const NAME_MASK = '[name].[chunkhash]';

module.exports = {
  mode: MODE,
  resolve: {
    // Note: JS needed for dev server
    extensions: ['.ts', '.js'],
  },
  entry: './docs/src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${NAME_MASK}.js`,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${NAME_MASK}.css`,
    }),
    new HtmlWebpackPlugin({
      minify: false,
      template: path.resolve(DOCS_PATH, 'index.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(DOCS_PATH, 'src'),
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(DOCS_PATH, 'tsconfig.json'),
        },
      },
    ],
  },
};
