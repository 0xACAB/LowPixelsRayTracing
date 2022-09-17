// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
	devServer: {
		disableHostCheck: true,
		port: 8082
	},
	configureWebpack: {
		devtool: 'source-map'
	}
}