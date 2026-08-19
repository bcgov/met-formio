// Precompiles src/**/*.ejs into lib/**/*.ejs.js, mirroring the source tree.
// Each output is a CommonJS module whose default export is the compiled render
// function, which is what the .ejs module declaration in src/ejs.d.ts describes.
// Replaces a gulp pipeline that did only this.
'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const SRC = path.join(__dirname, '..', 'src');
const OUT = path.join(__dirname, '..', 'lib');

// Delimiters are Form.io's, not lodash's defaults.
const TEMPLATE_OPTIONS = {
    evaluate: /\{%([\s\S]+?)%\}/g,
    interpolate: /\{\{([\s\S]+?)\}\}/g,
    escape: /\{\{\{([\s\S]+?)\}\}\}/g,
    variable: 'ctx',
};

const PREAMBLE = 'Object.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.default=';

function* walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(full);
        else if (entry.name.endsWith('.ejs')) yield full;
    }
}

let count = 0;
for (const file of walk(SRC)) {
    const compiled = _.template(fs.readFileSync(file, 'utf8'), TEMPLATE_OPTIONS).source;
    const target = path.join(OUT, path.relative(SRC, file) + '.js');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, PREAMBLE + compiled);
    count++;
}
console.log(`templates: compiled ${count} file${count === 1 ? '' : 's'}`);
