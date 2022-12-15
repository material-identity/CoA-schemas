module.exports = {
  verbose: true,
  moduleFileExtensions: ['js', 'ts', 'node'],
  moduleNameMapper: {
    // needed since axios after 1.x.x
    '^axios$': require.resolve('axios'),
  },
};
