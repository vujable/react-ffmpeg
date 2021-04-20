const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  mode: "production",
  entry: "./src/app.js",
  output: {
    path: path.resolve("dist"),
    publicPath: "/",
    filename: "app.js",
    libraryTarget: "umd",
    globalObject: "this",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "ffmpeg.js") },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: "workerize-loader",
          options: { inline: true },
        },
      },
    ],
  },
  node: {
    fs: "empty",
  },
};
