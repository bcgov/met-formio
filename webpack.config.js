const path = require('path');

module.exports = {
    entry: path.join(path.resolve(__dirname, 'lib'), 'index.js'),
    output: {
        library: 'METFormioComponents',
        libraryTarget: 'umd',
        libraryExport: 'default',
        path: path.resolve(__dirname, 'dist'),
        filename: 'met-formio-components.js',
    },
    mode: 'development',
    performance: { hints: false },
    externals: {
        formiojs: 'Formio',
    },
};
