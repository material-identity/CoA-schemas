const { generatePdf } = require('@s1seven/schema-tools-generate-pdf');
const { createWriteStream, readFileSync } = require('fs');
const path = require('path');
const { translations } = require('./constants');

const generatorPath = path.resolve('generate-pdf.min.js');

const fonts = {
  Lato: {
    normal: `node_modules/lato-font/fonts/lato-normal/lato-normal.woff`,
    bold: `node_modules/lato-font/fonts/lato-bold/lato-bold.woff`,
    italics: `node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff`,
    light: `node_modules/lato-font/fonts/lato-light/lato-light.woff`,
  },
};

const styles = JSON.parse(readFileSync(path.resolve('generate-pdf.styles.json'), 'utf8'));

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

async function generatePdfCertificate(certificatePath) {
  const outputPath = certificatePath.replace('.json', '.pdf');
  const pdfDoc = await generatePdf(path.resolve(certificatePath), {
    docDefinition,
    generatorPath,
    inputType: 'json',
    outputType: 'stream',
    fonts,
    translations,
  });

  const writeStream = createWriteStream(path.resolve(outputPath));
  pdfDoc.pipe(writeStream);
  pdfDoc.end();

  await new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve()).on('error', (err) => reject(err));
  });
}

module.exports = {
  generatePdfCertificate,
};
