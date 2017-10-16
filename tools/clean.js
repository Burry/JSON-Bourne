// Cleans the output (build) directory

import { cleanDir } from './lib/fs';

export default () => {
	return Promise.all([
		cleanDir('build/*', {
			nosort: true,
			dot: true,
			ignore: ['build/.git']
		})
	]);
};
