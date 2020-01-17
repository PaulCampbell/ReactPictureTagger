/*** webpack.config.js ***/
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "examples/src/index.html"),
  filename: "./index.html"
})
const copyWebpackPlugin = new CopyWebpackPlugin([{
  from: path.join(__dirname, "examples/src/static"),
  to: path.join(__dirname, "examples/dist/static")
}])

module.exports = {
  entry: path.join(__dirname, "examples/src/index.js"),
  output: {
    path: path.join(__dirname, "examples/dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [htmlWebpackPlugin, copyWebpackPlugin],
  resolve: {
    extensions: [".js"]
  },
  devServer: {
    port: 3001,
    contentBase: path.join(__dirname, 'examples/src')
  }
}
