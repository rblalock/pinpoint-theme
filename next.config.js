const withPinpointConfig = require('./pinpoint.next.js');

module.exports = withPinpointConfig({
	reactStrictMode: true,
	poweredByHeader: false,
	images: {
		disableStaticImages: true,
	},
	async redirects() {
		return [
			{
				source: '/post/:slug',
				destination: '/',
				permanent: true,
			},
		]
	},
});
