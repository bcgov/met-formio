// ts-node needs tsconfig.test.json; the build config emits ESM that mocha cannot require().
const path = require('path');

require('ts-node').register({
    project: path.join(__dirname, '..', 'tsconfig.test.json'),
});

// Via require(), not mocha's --require, so ts-node's CommonJS hook handles the .ts file.
require('./setup');
