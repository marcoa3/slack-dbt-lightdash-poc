const glob = require("glob");
const path = require("path");

const config = {
  mode: "production",

  entry: glob.sync("./src/functions/**/handler.ts").reduce((acc, path) => {
    const folders = (path.match(/\//g) || []).length;
    const entry = path.split("/")[folders - 1];
    acc[entry] = path;
    return acc;
  }, {}),

  target: "node",
  devtool: "source-map",

  externals: ["aws-sdk"],

  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".js", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  output: {
    filename: "[name]/index.js",
    path: path.resolve(__dirname, "dist"),
    library: { type: "commonjs2" },
  },
};

module.exports = config;
