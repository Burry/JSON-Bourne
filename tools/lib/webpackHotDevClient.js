// Webpack hot module development client

import hotClient from 'webpack-hot-middleware/client';

hotClient.setOptionsAndConnect({
	name: 'client',
	reload: true
});

if (module.hot) module.hot.dispose(stopReportingRuntimeErrors);
