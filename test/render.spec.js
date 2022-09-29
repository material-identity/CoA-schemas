/* eslint-disable no-undef */
const { generateHtml } = require('@s1seven/schema-tools-generate-html');
const { generatePdf } = require('@s1seven/schema-tools-generate-pdf');
const { createHash } = require('crypto');
const { readFileSync } = require('fs');
const { HtmlDiffer } = require('@markedjs/html-differ');
const logger = require('@markedjs/html-differ/lib/logger');
const { resolve } = require('path');
const { fromBuffer } = require('pdf2pic');
const { translations, extraTranslations } = require('../utils/constants');
const partialsMap = require('../partials-map.json');

describe('Render', function () {
  const testSuitesMap = [
    {
      certificateName: `valid_certificate_1`,
    },
    {
      certificateName: `valid_certificate_2`,
    },
    {
      certificateName: `valid_certificate_3`,
    },
    {
      certificateName: `valid_certificate_4`,
    },
    {
      certificateName: `valid_certificate_5`,
    },
    {
      certificateName: `valid_certificate_6`,
    },
  ];

  testSuitesMap.forEach(({ certificateName }) => {
    it(`${certificateName} should be rendered as a valid HTML`, async () => {
      const templatePath = resolve(__dirname, '../template.hbs');
      const certificatePath = resolve(__dirname, `./fixtures/${certificateName}.json`);
      const expectedHTML = readFileSync(resolve(__dirname, `./fixtures/${certificateName}.html`), 'utf-8');
      const htmlDiffer = new HtmlDiffer({
        ignoreAttributes: ['src'],
        ignoreWhitespaces: true,
        ignoreComments: true,
        ignoreEndTags: true,
        ignoreSelfClosingSlash: true,
        ignoreDuplicateAttributes: false,
      });
      //
      const html = await generateHtml(certificatePath, {
        templatePath,
        templateType: 'hbs',
        translations,
        extraTranslations,
        partialsMap,
      });
      const isEqual = await htmlDiffer.isEqual(expectedHTML, html);
      if (!isEqual) {
        const diff = await htmlDiffer.diffHtml(expectedHTML, html);
        logger.logDiffText(diff, { charsAroundDiff: 40 });
      }
      expect(isEqual).toBe(true);
    });

    it(`${certificateName} should be rendered as a valid PDF`, async () => {
      const generatorPath = resolve(__dirname, '../generate-pdf.min.js');
      const certificatePath = resolve(__dirname, `./fixtures/${certificateName}.json`);
      const certificate = JSON.parse(readFileSync(certificatePath, 'utf8'));
      const styles = JSON.parse(readFileSync(resolve(__dirname, '../generate-pdf.styles.json'), 'utf8'));
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [20, 20, 20, 40],
        footer: (currentPage, pageCount) => ({
          text: currentPage.toString() + ' / ' + pageCount,
          style: 'footer',
          alignment: 'center',
        }),
        defaultStyle: {
          font: 'Lato',
          fontSize: 10,
        },
        styles,
      };
      const options = {
        density: 100,
        width: 600,
        height: 600,
      };
      const expectedPDFBuffer = readFileSync(resolve(__dirname, `./fixtures/${certificateName}.pdf`));
      const expectedPDF = await fromBuffer(expectedPDFBuffer, options)(1, true);
      //
      const buffer = await generatePdf(certificate, {
        docDefinition,
        inputType: 'json',
        outputType: 'buffer',
        generatorPath,
        translations,
        extraTranslations,
      });
      const result = await fromBuffer(buffer, options)(1, true);
      expect(buffer instanceof Buffer).toEqual(true);
      const resultHash = createHash('sha256').update(result.base64).digest('hex');
      const expectedHash = createHash('sha256').update(expectedPDF.base64).digest('hex');
      expect(resultHash).toEqual(expectedHash);
    }, 8000);
  });
});
