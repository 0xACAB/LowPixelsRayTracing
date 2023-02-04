const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	module: {
		rules: [
			{
				test: /\.(vert|frag)$/i,
				use: 'raw-loader',
			}
		],
	},
	devtool: "source-map",
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Geometry',
			template: './src/index.html',
			filename: './index.html' //relative to root of the application
		}),
		new CopyPlugin({
			patterns: [
				{ from: 'assets', to: 'assets' }
			]
		})
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		static: {
			directory: path.resolve(__dirname, './assets'),
		},
		port: 8082
	}
};