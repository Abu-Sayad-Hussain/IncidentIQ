const { composePlugins, withNx } = require('@nx/webpack');
const { join } = require('path');

module.exports = composePlugins(
  withNx({
    target: 'node',
    compiler: 'tsc',
    main: './apps/log-processor-service/src/main.ts',
    tsConfig: './apps/log-processor-service/tsconfig.app.json',
    assets: ['./apps/log-processor-service/src/assets'],
    optimization: false,
    outputHashing: 'none',
  }),
  (config) => {
    config.output.path = join(__dirname, '../../dist/apps/log-processor-service');
    return config;
  }
);
