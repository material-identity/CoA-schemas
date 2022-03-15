const { SchemaRepositoryVersion } = require('@s1seven/schema-tools-versioning');
const { defaultServerUrl, extraTranslations, translations, htmlTemplatePath } = require('./constants');
const { version: pkgVersion } = require('../package.json');

(async function (argv) {
  const certificatePattern = argv[2] || 'test/fixtures/valid_certificate_*.json';

  try {
    const updater = new SchemaRepositoryVersion(
      defaultServerUrl,
      [],
      pkgVersion,
      translations,
      extraTranslations,
      'schema.json',
    );
    await updater.updateSchemasVersion();
    await updater.updateHtmlFixturesVersion(certificatePattern, htmlTemplatePath);
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
