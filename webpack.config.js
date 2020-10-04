const webpack = require('webpack')
const path = require('path')
const meteorExternals = require('webpack-meteor-externals')
const nodeExternals = require('webpack-node-externals')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const clientConfig = {
  target: 'web',
  entry: './client/main.js',
  resolve: {
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true
  },
  output: {
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  node: {
    fs: 'empty',
    child_process: 'empty',
    net: 'empty',
    crypto: 'empty'
  },
  externals: [meteorExternals()],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './client/index.html',
      hash: true
    })
  ]
}

const serverConfig = {
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [meteorExternals(), nodeExternals()], // in order to ignore all modules in node_modules folder
  entry: './server/main.js',
  devServer: {
    hot: true
  },
  plugins: []
}

module.exports = [clientConfig, serverConfig]
