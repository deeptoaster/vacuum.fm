const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = env => ({
  devServer: {
    static: __dirname
  },
  devtool: env.production ? false : 'eval-source-map',
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  corejs: '3.8',
                  useBuiltIns: 'usage'
                }
              ],
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ]
  },
  output: {
    filename: 'vacuum.js',
    path: __dirname
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx']
  },
  target: env.production ? 'browserslist' : 'web',
  watch: false
});
