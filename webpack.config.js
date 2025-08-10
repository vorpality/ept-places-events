import defaultConfig from '@wordpress/scripts/config/webpack.config.js';

export default {
  ...defaultConfig,
  entry: {
    ...defaultConfig.entry(),
    'admin/meta-boxes': './src/admin/meta-boxes/index.js',
    'admin/json-importer': './src/admin/json-importer/index.js',
  }
}   