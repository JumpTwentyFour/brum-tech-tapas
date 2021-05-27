const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

// We are exporting a Function instead of a configuration object so that we can
// dynamically define the configuration object based on the execution mode.
module.exports = (env, argv) => {
  const isProductionMode = (argv.mode === 'production');
  const isDevelopmentMode = (argv.mode === 'development');
  const isIEMode = (argv.mode === 'none'); // We use this to disable sourcemaps for IE in development

  // Locally, we want robust source-maps. However, in production, we want something
  // that can help with debugging without giving away all of the source-code. This
  // production setting will give us proper file-names and line-numbers for debugging;
  // but, without actually providing any code content.
  const devtool = isDevelopmentMode
    ? 'eval-source-map'
    : false;

  let config = {
    // This option controls if and how source maps are generated.
    // https://webpack.js.org/configuration/devtool/
    devtool: devtool,

    // https://webpack.js.org/concepts/entry-points/#multi-page-application
    entry: {
      index: './wordpress/wp-content/themes/brumtechtapas/src/js/main.js',
    },

    node: {
      fs: 'empty',
    },

    // how to write the compiled files to disk
    // https://webpack.js.org/concepts/output/
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, './wordpress/wp-content/themes/brumtechtapas/dist/'),
    },

    // https://webpack.js.org/concepts/loaders/
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!(swiper|dom7)\/).*/,
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
          test: /\.(ttf|eot|woff|woff2|otf)$/,
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },
        {
          test: /\.(mp4)$/,
          loader: 'file-loader',
          options: {
            name: 'videos/[name].[ext]',
          },
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
        '@': path.resolve(__dirname, './wordpress/wp-content/themes/brumtechtapas/src/'),
      },
    },

    // https://webpack.js.org/configuration/optimization/
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: isDevelopmentMode,
        }),
        new OptimizeCssAssetsPlugin({}),
      ],
    },
  };

  if (isProductionMode) {
    config.plugins.unshift(new CleanWebpackPlugin());
  }

  return config;
};
