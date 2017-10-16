// Compiles the application and copies it to the output (build) folder,
// optionally with static HTML files or a Docker image

import cp from 'child_process';
import run from './run';
import clean from './clean';
import copy from './copy';
import bundle from './bundle';
import pkg from '../package.json';

export default () => {
	await run(clean);
	await run(copy);
	await run(bundle);

	if (process.argv.includes('--docker'))
		cp.spawnSync('docker', ['build', '-t', pkg.name, '.'], { stdio: 'inherit' });
};
