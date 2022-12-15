const { readFileSync } = require('fs');
const { resolve } = require('path');

const defaultServerUrl = 'https://schemas.s1seven.com/coa-schemas';
const schemaDefinitionsPath = 'schema-definitions';
const defaultSchemaDefinitionsVersion = 'v0.0.6';

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
    'GoodsReceiver',
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

const campusTranslationProperties = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '44',
  '45',
  '46',
  '47',
  '48',
  '49',
  '50',
  '51',
  '52',
  '53',
  '54',
  '55',
  '56',
  '57',
  '58',
  '59',
  '60',
  '61',
  '62',
  '63',
  '64',
  '65',
  '66',
  '67',
  '68',
  '69',
  '70',
  '71',
  '72',
  '73',
  '74',
  '75',
  '76',
  '77',
  '78',
  '79',
  '80',
  '81',
  '82',
  '83',
  '84',
  '85',
  '86',
  '87',
  '88',
  '89',
  '90',
  '92',
  '93',
  '94',
  '95',
  '96',
  '97',
  '98',
  '99',
  '100',
  '101',
  '102',
  '103',
  '104',
  '105',
  '106',
  '107',
  '108',
  '110',
  '111',
  '112',
  '113',
  '114',
  '120',
  '121',
  '122',
  '130',
  '131',
  '132',
  '133',
  '134',
  '135',
  '136',
  '151',
  '165',
  '166',
  '167',
  '168',
  '170',
  '171',
  '172',
  '173',
  '174',
  '175',
  '176',
  '177',
  '178',
  '179',
  '180',
  '181',
  '182',
  '183',
  '184',
  '185',
  '186',
  '187',
  '188',
  '191',
  '196',
  '197',
  '198',
  '199',
  '200',
  '201',
  '202',
  '203',
  '204',
  '205',
  '206',
  '207',
  '208',
  '209',
  '210',
  '211',
  '212',
  '213',
  '214',
  '215',
  '216',
  '217',
  '218',
  '219',
  '220',
  '221',
  '222',
  '230',
  '231',
  '232',
  '233',
  '234',
  '235',
  '236',
  '237',
  '239',
  '411',
  '412',
  '413',
  '414',
  '415',
  '416',
  '417',
  '418',
  '419',
  '420',
  '421',
  '422',
  '423',
  '424',
  '425',
  '426',
  '427',
  '428',
  '429',
  '430',
  '431',
  '432',
  '433',
  '434',
  '435',
  '436',
  '437',
  '438',
  '439',
  '440',
  '441',
  '442',
  '443',
  '444',
  '445',
  '446',
  '447',
  '448',
  '543',
  '544',
  '546',
  '547',
  '548',
  '549',
  '550',
  '551',
  '553',
  '555',
  '557',
  '559',
  '561',
  '563',
  '565',
  '654',
  '655',
  '658',
  '659',
  '671',
  '672',
  '675',
  '676',
  '686',
  '704',
  '705',
  '731',
  '753',
  '754',
  '755',
  '756',
  '757',
  '758',
  '759',
  '760',
  '761',
  '762',
  '763',
  '764',
  '765',
  '766',
  '767',
  '768',
  '769',
  '770',
  '771',
  '772',
  '773',
  '774',
  '775',
  '776',
  '777',
  '778',
  '779',
  '780',
  '781',
  '782',
  '783',
  '784',
  '785',
];

module.exports = {
  campusTranslationProperties,
  defaultSchemaDefinitionsVersion,
  defaultServerUrl,
  extraTranslations,
  htmlTemplatePath,
  languages,
  pdfDocDefinition,
  pdfGeneratorPath,
  pdfStylesPath,
  pdfStyles,
  pdfFonts,
  schemaDefinitionsPath,
  translationProperties,
  translations,
};
