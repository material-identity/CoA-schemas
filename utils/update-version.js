const { execSync } = require('child_process');
const { SchemaRepositoryVersion } = require('@s1seven/schema-tools-versioning');
const { version: pkgVersion } = require('../package.json');
const partialsMap = require('../partials-map.json');

const {
  defaultServerUrl,
  htmlTemplatePath,
  pdfDocDefinition,
  pdfFonts,
  pdfGeneratorPath,
  translations,
  extraTranslations,
  schemaDefinitionsPath,
  defaultSchemaDefinitionsVersion,
} = require('./constants');

const schemaFilePaths = [
  {
    filePath: 'schema.json',
    properties: [
      { path: '$id', value: 'schema.json' },
      {
        path: 'definitions.CertificateLanguages.allOf.0.$ref',
        schemaType: schemaDefinitionsPath,
        version: defaultSchemaDefinitionsVersion,
        value: 'languages/languages.json#/definitions/CertificateLanguages',
      },
      {
        path: 'definitions.Company.allOf.0.$ref',
        schemaType: schemaDefinitionsPath,
        version: defaultSchemaDefinitionsVersion,
        value: 'company/company.json#/definitions/Company',
      },
      {
        path: 'properties.RefSchemaUrl.allOf.0.$ref',
        schemaType: schemaDefinitionsPath,
        version: defaultSchemaDefinitionsVersion,
        value: 'ref-schema-url/ref-schema-url.json#/definitions/RefSchemaUrl',
      },
      {
        path: 'definitions.Attachment.allOf.0.$ref',
        schemaType: schemaDefinitionsPath,
        version: defaultSchemaDefinitionsVersion,
        value: 'attachment/attachment.json#/definitions/Attachment',
      },
    ],
  },
];

const partialsMapPaths = {
  filePath: 'partials-map.json',
  properties: [
    {
      path: 'company',
      schemaType: schemaDefinitionsPath,
      version: defaultSchemaDefinitionsVersion,
      value: 'company/company.hbs',
    },
  ],
};

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

function addV(version) {
  return version.startsWith('v') ? version : `v${version}`;
}

(async function (argv) {
  const version = argv[2] || pkgVersion;
  console.log(`Updating files to version : ${version}`);
  const updater = new SchemaRepositoryVersion(
    defaultServerUrl,
    schemaFilePaths,
    addV(version),
    translations,
    extraTranslations,
    'schema.json',
  );
  await updater.updateSchemasVersion();
  await updater.updateJsonFixturesVersion(jsonFixturesPattern);
  await updater.updatePartialsMapVersion(partialsMapPaths);
  await updater.updateHtmlFixturesVersion(validCertificateFixturesPattern, htmlTemplatePath, {}, partialsMap);
  await updater.updatePdfFixturesVersion(
    validCertificateFixturesPattern,
    pdfGeneratorPath,
    pdfDocDefinition(),
    pdfFonts,
  );

  stageAndCommitChanges(version);
})(process.argv);
