const { SchemaRepositoryVersion } = require('@s1seven/schema-tools-versioning');
const { defaultServerUrl, pdfDocDefinition, pdfFonts, pdfGeneratorPath, translations } = require('./constants');
const { version: pkgVersion } = require('../package.json');

(async function (argv) {
  const certificatePattern = argv[2] || 'test/fixtures/valid_certificate_*.json';
  try {
    const updater = new SchemaRepositoryVersion(defaultServerUrl, [], pkgVersion, translations, 'schema.json');
    await updater.updatePdfFixturesVersion(certificatePattern, pdfGeneratorPath, pdfDocDefinition(), pdfFonts);
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
