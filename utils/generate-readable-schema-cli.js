const { SchemaRepositoryVersion } = require('@s1seven/schema-tools-versioning');
const { resolve } = require('path');

(async function (argv) {
  const schemaFilePath = argv[2] || resolve(__dirname, '../schema.json');
  const writeFilePath = argv[3] || null; // this is optional as a default is provided
  try {
    await SchemaRepositoryVersion.generateReadableSchema({ schemaFilePath, writeToDisk: true, writeFilePath });
  } catch (error) {
    console.error(error);
  }
})(process.argv);
