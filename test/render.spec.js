/* eslint-disable no-undef */
const { generateHtml } = require('@s1seven/schema-tools-generate-html');
const { readFileSync } = require('fs');
const htmlCompare = require('html-compare');
const { HtmlDiffer } = require('html-differ');
const { resolve } = require('path');

describe('Render', function () {
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
      //
      const html = await generateHtml(certificatePath, {
        templatePath,
        templateType: 'hbs',
      });

      const htmlDiffer = new HtmlDiffer({
        ignoreAttributes: [],
        ignoreWhitespaces: true,
        ignoreComments: true,
        ignoreEndTags: false,
        ignoreDuplicateAttributes: false,
      });

      const isEqualComp = htmlCompare.compare(expectedHTML, html);
      const isEqualDiffer = htmlDiffer.isEqual(expectedHTML, html);
      expect(isEqualComp.changes).toHaveLength(0);
      expect(isEqualComp.different).toBe(false);
      expect(isEqualDiffer).toBe(true);
    });
  });
});
