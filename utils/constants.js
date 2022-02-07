const { readFileSync } = require('fs');
const { resolve } = require('path');

const languages = ['CN', 'DE', 'EN', 'FR', 'PL', 'IT', 'TR', 'ES'];

const translations = languages.reduce((acc, ln) => {
  acc[ln] = JSON.parse(readFileSync(resolve(`${ln}.json`), 'utf-8'));
  return acc;
}, {});

const translationProperties = {
  Certificate: [
    'Customer',
    'ConsigneeOfGoods',
    'Name',
    'Id',
    'Certificate',
    'Date',
    'BusinessTransaction',
    'Order',
    'OrderNumber',
    'OrderQuantity',
    'OrderPosition',
    'OrderDate',
    'InternalOrderNumber',
    'InternalOrderPosition',
    'Delivery',
    'DeliveryNumber',
    'DeliveryPosition',
    'DeliveryQuantity',
    'DeliveryDate',
    'Transport',
    'GoodsReceiptNumber',
    'Product',
    'ProductName',
    'ProductNumber',
    'CustomerProductNumber',
    'CountryOfOrigin',
    'PlaceOfOrigin',
    'ChargeNumber',
    'ProductionDate',
    'Standards',
    'AdditionalInformation',
    'Inspections',
    'Property',
    'Symbol',
    'Method',
    'Value',
    'Minimum',
    'Maximum',
    'Unit',
    'SupplementaryInstructions',
    'TestConditions',
    'Temperature',
    'Weight',
    'DeclarationOfConformity',
    'Contacts',
    'ContactName',
    'ContactRole',
    'ContactDepartment',
    'ContactEmail',
    'ContactPhone',
    'ContactFax',
    'Attachments',
  ],
};

module.exports = {
  languages,
  translationProperties,
  translations,
};
