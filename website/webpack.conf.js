const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: (process.env.NODE_ENV === 'development') ? 'development' : 'production',
  entry: [
    path.resolve('./website/index.js')
  ],
  output: {
    path: path.resolve('./public')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      },
      {
        test: /\.s(c|a)ss$/,
        // shorthand, use MiniCssExtractPlugin only in production
        use: [
          (process.env.NODE_ENV === 'production') ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./website/index.html')
    }),
    new VueLoaderPlugin(),
    // this will kick in only in NODE_ENV production
    new MiniCssExtractPlugin({
      filename: `[name].css`
    })
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  serve: {
    port: 2000,
    hot: true,
    open: true,
    content: [
      path.resolve('./public')
    ]
  }
}
