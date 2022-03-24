const { execSync } = require('child_process');
const { SchemaRepositoryVersion } = require('@s1seven/schema-tools-versioning');
const { version: pkgVersion } = require('../package.json');
const {
  defaultServerUrl,
  htmlTemplatePath,
  pdfDocDefinition,
  pdfFonts,
  pdfGeneratorPath,
  translations,
  extraTranslations,
} = require('./constants');

const schemaFilePaths = [{ filePath: 'schema.json', properties: [{ path: '$id', value: 'schema.json' }] }];
const fixturesFolder = 'test/fixtures';
const jsonFixturesPattern = `${fixturesFolder}/*valid_certificate_*.json`;
const htmlFixturesPattern = `${fixturesFolder}/*valid_certificate_*.html`;
const pdfFixturesPattern = `${fixturesFolder}/valid_certificate_*.pdf`;
const validCertificateFixturesPattern = `${fixturesFolder}/valid_certificate_*.json`;

function stageAndCommitChanges(version) {
  const schemasPaths = schemaFilePaths.map(({ filePath }) => filePath).join(' ');
  execSync(`git add ${jsonFixturesPattern} ${htmlFixturesPattern} ${pdfFixturesPattern} ${schemasPaths}`);
  execSync(`git commit -m 'chore: sync versions to ${version}'`);
}

(async function (argv) {
  const version = argv[2] || pkgVersion;
  console.log(`Updating files to version : ${version}`);
  const updater = new SchemaRepositoryVersion(
    defaultServerUrl,
    schemaFilePaths,
    version,
    translations,
    extraTranslations,
    'schema.json',
  );
  await updater.updateSchemasVersion();
  await updater.updateJsonFixturesVersion(jsonFixturesPattern);
  await updater.updateHtmlFixturesVersion(validCertificateFixturesPattern, htmlTemplatePath);
  await updater.updatePdfFixturesVersion(
    validCertificateFixturesPattern,
    pdfGeneratorPath,
    pdfDocDefinition(),
    pdfFonts,
  );

  stageAndCommitChanges(version);
})(process.argv);
