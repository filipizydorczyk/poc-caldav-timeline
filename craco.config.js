const path = require("path");
const { loaderByName, addBeforeLoader } = require("@craco/craco");

module.exports = {
    webpack: {
        configure: function (webpackConfig) {
            // const rawLoader = {
            //     test: /\.xml$/i,
            //     use: ["raw-loader"],
            // };

            // addBeforeLoader(
            //     webpackConfig,
            //     loaderByName("file-loader"),
            //     rawLoader
            // );

            webpackConfig.module.rules.push({
                test: /\.xml$/,
                use: ["raw-loader"],
            });

            console.log(webpackConfig.module.rules);

            webpackConfig.resolve.fallback = {
                timers: require.resolve("timers-browserify"),
                stream: require.resolve("stream-browserify"),
                fs: false,
                os: false,
                path: false,
            };

            return webpackConfig;
        },
    },
};
