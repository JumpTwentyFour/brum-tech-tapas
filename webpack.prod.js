const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const buildPath = path.resolve(__dirname, 'dist');

// We need Nodes fs module to read directory contents
const fs = require('fs');

function getFileNameAndFolder(file) {
  const pagesFolder = path.resolve(__dirname, 'src/views/pages');
  const reformattedFile = file.replace(pagesFolder, buildPath);
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
  const files = fs.readdirSync(dirPath);

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
  mode: 'production',
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
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
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
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
          publicPath: '/',
        },
      },
      {
        test: /\.(ico|xml|webmanifest|png|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'icons/[name].[ext]',
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
    new CleanWebpackPlugin(), // cleans output.path by default
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
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
  ].concat(htmlPlugins),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      views: path.resolve(__dirname, './src/views'),
      images: path.resolve(__dirname, './src/images'),
      svgs: path.resolve(__dirname, './src/svgs'),
      icons: path.resolve(__dirname, './src/icons'),
    },
  },

  // https://webpack.js.org/configuration/optimization/
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCssAssetsPlugin({}),
    ],
  },
};
