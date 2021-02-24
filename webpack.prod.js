const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // installed via npm
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const buildPath = path.resolve(__dirname, 'current/dist');
const pagesPath = path.resolve(__dirname, 'src/views/pages');
let files = null;

// We need Nodes fs module to read directory contents
const fs = require('fs');

function getFileNameAndFolder(file) {
  return file.replace(pagesPath, buildPath);
}

function returnHtmlWebpackPlugin(file) {
  // Create new HTMLWebpackPlugin with options
  return new HtmlWebpackPlugin({
    filename: getFileNameAndFolder(file),
    inject: true,
    template: path.resolve(file),
  });
}

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, '/', file));
    }
  });

  return arrayOfFiles;
}

// Our function that generates our html plugins
function generateHtmlPlugins(templateDir) {
  // Read files in template directory
  const templateFiles = getAllFiles(templateDir);

  const htmlPluginsStart = templateFiles.map(
    file => returnHtmlWebpackPlugin(file),
  );

  const htmlPlugins = htmlPluginsStart.reduce((result, element) => {
    if (element !== null) {
      result.push(element);
    }
    return result;
  },
  []);
  return htmlPlugins;
}

const htmlPlugins = generateHtmlPlugins('./src/views/pages/');

module.exports = {
  mode: 'production',
  // This option controls if and how source maps are generated.
  // https://webpack.js.org/configuration/devtool/
  devtool: 'source-map',
  node: {
    fs: 'empty',
  },
  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    index: './src/assets/js/main.js',
  },
  // how to write the compiled files to disk
  // https://webpack.js.org/concepts/output/
  output: {
    filename: '[name].[hash:20].js',
    path: buildPath,
  },
  // https://webpack.js.org/concepts/loaders/
  module: {
    rules: [
      {
        test: /\.(html)$/,
        include: path.join(__dirname, 'src/views'),
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true,
            minimize: true,
            removeComments: false,
            collapseWhitespace: false,
          },
        },
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
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
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          // Please note we are not running postcss here
        ],
      },
      {
        test: /\.svg/,
        loader: 'svg-inline-loader',
      },
      {
        // Load all images as base64 encoding if they are smaller than 8192 bytes
        test: /\.(png|jpg|gif|webp|ico|xml|webmanifest)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // On development we want to see where the file is coming from,
              // hence we preserve the [path]
              name: '[path][name].[ext]?hash=[hash:20]',
              publicPath: `${buildPath}/`,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif|webp)$/,
        loader: 'image-webpack-loader',
        // Specify enforce: 'pre' to apply the loader
        // before url-loader/svg-url-loader
        // and not duplicate it in rules with them
        enforce: 'pre',
        options: {
          disable: false, // webpack@2.x and newer
          publicPath: '/',
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
    new Dotenv({
      safe: true,
      systemvars: true,
      silent: false,
      defaults: false,
    }),
    new ImageminPlugin({
      disable: true, // Disable during development
      pngquant: {
        quality: '95-100',
      },
      mozjpeg: {
        progressive: true,
        quality: 65,
      },
    }),
    new CleanWebpackPlugin(), // cleans output.path by default
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ].concat(htmlPlugins),
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/assets'),
      views: path.resolve(__dirname, './src/views'),
      images: path.resolve(__dirname, './src/assets/images'),
    },
  },
};
