const { readFileSync } = require('fs');
const { resolve } = require('path');

const defaultServerUrl = 'https://schemas.s1seven.com/coa-schemas';

const htmlTemplatePath = resolve('template.hbs');

const pdfGeneratorPath = resolve('generate-pdf.min.js');
const pdfStylesPath = resolve('generate-pdf.styles.json');
const pdfStyles = () => JSON.parse(readFileSync(pdfStylesPath, 'utf8'));
const pdfFonts = {
  Lato: {
    normal: `node_modules/lato-font/fonts/lato-normal/lato-normal.woff`,
    bold: `node_modules/lato-font/fonts/lato-bold/lato-bold.woff`,
    italics: `node_modules/lato-font/fonts/lato-light-italic/lato-light-italic.woff`,
    light: `node_modules/lato-font/fonts/lato-light/lato-light.woff`,
  },
};

const pdfDocDefinition = () => ({
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
  styles: pdfStyles(),
});

const languages = ['CN', 'DE', 'EN', 'FR', 'PL', 'IT', 'TR', 'ES'];

const translations = languages.reduce((acc, ln) => {
  acc[ln] = JSON.parse(readFileSync(resolve(`${ln}.json`), 'utf-8'));
  return acc;
}, {});

const extraTranslations = languages.reduce(
  (acc, ln) => {
    acc['CAMPUS'][ln] = JSON.parse(readFileSync(resolve(`CAMPUS/${ln}.json`), 'utf-8'));
    return acc;
  },
  { CAMPUS: {} },
);

const translationProperties = {
  Certificate: [
    'Customer',
    'Receiver',
    'Id',
    'Certificate',
    'Date',
    'BusinessTransaction',
    'Order',
    'OrderId',
    'OrderQuantity',
    'OrderPosition',
    'OrderDate',
    'InternalOrderId',
    'InternalOrderPosition',
    'Delivery',
    'DeliveryId',
    'DeliveryPosition',
    'DeliveryQuantity',
    'DeliveryDate',
    'Transport',
    'GoodsReceiptId',
    'Product',
    'ProductName',
    'ProductId',
    'CustomerProductId',
    'CustomerProductName',
    'CountryOfOrigin',
    'PlaceOfOrigin',
    'FillingBatchId',
    'FillingBatchDate',
    'ProductionBatchId',
    'ProductionDate',
    'ExpirationDate',
    'Standards',
    'AdditionalInformation',
    'Inspections',
    'LotId',
    'Property',
    'Method',
    'Value',
    'Minimum',
    'Maximum',
    'Unit',
    'TestConditions',
    'DeclarationOfConformity',
    'Contacts',
    'ContactName',
    'ContactRole',
    'ContactDepartment',
    'ContactEmail',
    'ContactPhone',
    'Attachments',
  ],
};

module.exports = {
  defaultServerUrl,
  extraTranslations,
  htmlTemplatePath,
  languages,
  pdfDocDefinition,
  pdfGeneratorPath,
  pdfStylesPath,
  pdfStyles,
  pdfFonts,
  translationProperties,
  translations,
};
