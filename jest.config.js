module.exports = {
  verbose: true,
  rootDir: '.',
  maxConcurrency: 2,
  testRegex: '.*\\.spec\\.js$',
  moduleFileExtensions: ['js', 'node'],
  moduleNameMapper: {
    // needed since axios after 1.x.x
    '^axios$': require.resolve('axios'),
  },
};
