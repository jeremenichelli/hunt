const pkg = require('./package.json');
const year = (new Date()).getFullYear();

export default {
  entry: 'src/hunt.js',
  dest: 'dist/hunt.js',
  format: 'umd',
  globals: [
    'window'
  ],
  indent: true,
  useStrict: true,
  moduleName: 'Hunt',
  banner: `/* ${ pkg.title } v${ pkg.version } - ${ year } Jeremias Menichelli - MIT License */`
};
