const SitemapPlugin = require('sitemap-webpack-plugin').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const path = require('path');
const Dotenv = require('dotenv-webpack');
const buildPath = path.resolve(__dirname, 'dist');
const pagesPath = path.resolve(__dirname, 'src/views/pages');
const S3Uploader = require('webpack-s3-uploader');
let files = null;

// We need Nodes fs module to read directory contents
const fs = require('fs');

function getFileNameAndFolder(file) {
  const reformattedFile = file.replace(pagesPath, buildPath);
  return reformattedFile;
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

  const htmlPluginsStart = templateFiles.map(file => returnHtmlWebpackPlugin(file));

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
  // This option controls if and how source maps are generated.
  // https://webpack.js.org/configuration/devtool/
  devtool: 'eval-cheap-module-source-map',
  node: {
    fs: 'empty',
  },
  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    index: './src/js/main.js',
  },
  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    http2: true,
    host: '0.0.0.0',
    port: 8888,
    disableHostCheck: true,
    writeToDisk: false, // https://webpack.js.org/configuration/dev-server/#devserverwritetodisk-
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
            collapseWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(ttf|eot|woff|woff2|otf)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(mp4)$/,
        loader: 'file-loader',
        options: {
          name: 'videos/[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
          // Please note we are not running postcss here
        ]
      },
      {
        test: /\.svg/,
        loader: 'svg-inline-loader'
      },
      {
        // Load all images as base64 encoding if they are smaller than 8192 bytes
        test: /\.(png|jpg|gif|ico|xml|webmanifest)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // On development we want to see where the file is coming from,
              // hence we preserve the [path]
              name: '[path][name].[ext]?hash=[hash:20]',
              limit: 8192,
              publicPath: '/',
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'sass-loader',
          options: {
            implementation: require('node-sass')
          }
        }],
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
      disable: false, // Disable during development
      pngquant: {
        quality: '95-100',
      },
    }),
  ].concat(htmlPlugins),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      views: path.resolve(__dirname, './src/views'),
      images: path.resolve(__dirname, './src/images'),
    },
  },
};
