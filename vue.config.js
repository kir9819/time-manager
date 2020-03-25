const path = require('path')

module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/time-manager/' : '/',
	configureWebpack: {
		resolve: {
			alias: {
				Images: path.resolve(__dirname, 'src/assets/images/'),
				Styles: path.resolve(__dirname, 'src/assets/styles/'),
				Components: path.resolve(__dirname, 'src/components/'),
				Mixins: path.resolve(__dirname, 'src/mixins/'),
				Pages: path.resolve(__dirname, 'src/pages/'),
				Plugins: path.resolve(__dirname, 'src/plugins/'),
				Utils: path.resolve(__dirname, 'src/utils/'),
			},
		},
		devServer: {
			port: 8091,
		},
	},
	pluginOptions: {
		lintOnBuild: true,
		lintStyleOnBuild: true,
	},
	chainWebpack: config => config.module
		.rule('raw-loader')
		.test(/\.xml$/)
		.use('raw-loader')
		.loader('raw-loader')
		.end(),
}