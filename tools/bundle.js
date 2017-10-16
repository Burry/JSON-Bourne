// Creates application bundles from the source files.

import webpack from 'webpack';
import webpackConfig from './webpack.config';

export default () => {
	return new Promise((resolve, reject) => {
		webpack(webpackConfig).run((err, stats) => {
			if (err) return reject(err);
			console.info(stats.toString(webpackConfig[0].stats));
			return resolve();
		});
	});
};
