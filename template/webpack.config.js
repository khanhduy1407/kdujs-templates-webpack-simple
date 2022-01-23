var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'kdu-style-loader',
          'css-loader'
        ],
      },{{#sass}}
      {
        test: /\.scss$/,
        use: [
          'kdu-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'kdu-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {{/sass}}
      {
        test: /\.kdu$/,
        loader: 'kdu-loader',
        options: {
          loaders: {
            {{#sass}}
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'kdu-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'kdu-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
            {{/sass}}
          }
          // other kdu-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'kdu$': 'kdu/dist/kdu.esm.js'
    },
    extensions: ['*', '.js', '.kdu', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
