/* eslint-disable no-undef */
const { generateHtml } = require('@s1seven/schema-tools-generate-html');
const { readFileSync } = require('fs');
const { HtmlDiffer } = require('html-differ');
const { resolve } = require('path');

describe('Render', function () {
  const translations = ['CN', 'DE', 'EN', 'FR', 'PL'].reduce((acc, ln) => {
    acc[ln] = JSON.parse(readFileSync(resolve(__dirname, `../${ln}.json`), 'utf-8'));
    return acc;
  }, {});

  const testSuitesMap = [
    {
      certificateName: `valid_certificate_1`,
    },
  ];

  testSuitesMap.forEach(({ certificateName }) => {
    it(`${certificateName} should be rendered as a valid HTML`, async () => {
      const templatePath = resolve(__dirname, '../template.hbs');
      const certificatePath = resolve(__dirname, `./fixtures/${certificateName}.json`);
      const expectedHTML = readFileSync(resolve(__dirname, `./fixtures/${certificateName}.html`), 'utf-8');
      const htmlDiffer = new HtmlDiffer({
        ignoreAttributes: [],
        ignoreWhitespaces: true,
        ignoreComments: true,
        ignoreEndTags: false,
        ignoreDuplicateAttributes: false,
      });
      //
      const html = await generateHtml(certificatePath, {
        templatePath,
        templateType: 'hbs',
        translations,
      });
      const isEqualDiffer = htmlDiffer.isEqual(expectedHTML, html);
      expect(isEqualDiffer).toBe(true);
    });
  });
});
