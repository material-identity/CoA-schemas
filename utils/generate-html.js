const { generateHtml } = require('@s1seven/schema-tools-generate-html');
const { promises: fs } = require('fs');
const path = require('path');
const prettier = require('prettier');
const { translations } = require('./constants');

const templatePath = path.resolve('template.hbs');

async function generateHtmlCertificate(certificatePath) {
  const outputPath = certificatePath.replace('.json', '.html');
  const rawHtml = await generateHtml(certificatePath, {
    templatePath,
    templateType: 'hbs',
    translations,
  });

  const html = prettier.format(rawHtml, { parser: 'html' });
  await fs.writeFile(outputPath, html);
}

module.exports = {
  generateHtmlCertificate,
};
