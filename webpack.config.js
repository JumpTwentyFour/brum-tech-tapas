const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

// We are exporting a Function instead of a configuration object so that we can
// dynamically define the configuration object based on the execution mode.
module.exports = () => {

  let config = {

    // https://webpack.js.org/concepts/entry-points/#multi-page-application
    entry: {
      index: './src/js/main.js',
    },

    node: {
      fs: 'empty',
    },

    // how to write the compiled files to disk
    // https://webpack.js.org/concepts/output/
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist/'),
    },

    // https://webpack.js.org/concepts/loaders/
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
        },
        {
          test: /\.(png|jpg|gif|ico|cur)$/,
          loader: 'file-loader',
          options: {
            name: 'images/[name].[hash:20].[ext]',
          },
        },
        {
          test: /\.(jpg|png|gif)$/,
          loader: 'image-webpack-loader',
          // Specify enforce: 'pre' to apply the loader
          // before url-loader/svg-url-loader
          // and not duplicate it in rules with them
          enforce: 'pre',
          options: {
            disable: false, // webpack@2.x and newer
          },
        },
        {
          test: /\.scss$/,
          use: [
            // fallback to style-loader in development
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },

    // https://webpack.js.org/concepts/plugins/
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style.css',
        chunkFilename: 'style.css',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
    },

    devServer: {
      http2: true,
      host: '0.0.0.0',
      port: 8888,
      disableHostCheck: true,
      writeToDisk: false, // https://webpack.js.org/configuration/dev-server/#devserverwritetodisk-
      contentBase: path.join(__dirname, './src')
    },

    // https://webpack.js.org/configuration/optimization/
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
        }),
        new OptimizeCssAssetsPlugin({}),
      ],
    },
  };

  return config;
};
