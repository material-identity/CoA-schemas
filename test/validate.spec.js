/* eslint-disable no-undef */
const { loadExternalFile } = require('@s1seven/schema-tools-utils');
const Ajv2019 = require('ajv/dist/2019');
const draft7MetaSchema = require('ajv/dist/refs/json-schema-draft-07.json');
const addFormats = require('ajv-formats');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const { campusTranslationProperties, languages, translationProperties } = require('../utils/constants');

const createAjvInstance = () => {
  const ajv = new Ajv2019({
    loadSchema: (uri) => loadExternalFile(uri, 'json'),
    strictSchema: true,
    strictNumbers: true,
    strictRequired: true,
    strictTypes: true,
    allErrors: true,
  });
  ajv.addKeyword('meta:license');
  ajv.addMetaSchema(draft7MetaSchema);
  addFormats(ajv);
  return ajv;
};

describe('Validate', function () {
  const schemaPath = resolve(__dirname, '../schema.json');
  const localSchema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
  const validCertTestSuitesMap = [
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
    // temporarily disabled: refer to: https://github.com/material-identity/CoA-schemas/issues/74
    // {
    //   certificateName: `valid_certificate_5`,
    // },
    {
      certificateName: `valid_certificate_6`,
    },
    {
      certificateName: `valid_certificate_7`,
    },
  ];
  const invalidCertTestSuitesMap = [
    {
      certificateName: `invalid_certificate_1`,
      expectedErrors: [
        {
          instancePath: '/Certificate/Parties/Manufacturer',
          schemaPath: '#/definitions/CompanyBase/oneOf/0/required',
          keyword: 'required',
          params: { missingProperty: 'Name' },
          message: "must have required property 'Name'",
        },
        {
          instancePath: '/Certificate/Parties/Manufacturer',
          schemaPath: '#/definitions/CompanyBase/oneOf/1/required',
          keyword: 'required',
          params: { missingProperty: 'CompanyName' },
          message: "must have required property 'CompanyName'",
        },
        {
          instancePath: '/Certificate/Parties/Manufacturer',
          schemaPath: '#/definitions/CompanyBase/oneOf',
          keyword: 'oneOf',
          params: { passingSchemas: null },
          message: 'must match exactly one schema in oneOf',
        },
        {
          instancePath: '/Certificate/Parties/Manufacturer/Identifiers',
          schemaPath: '#/definitions/CompanyIdentifiers/anyOf/0/required',
          keyword: 'required',
          params: { missingProperty: 'VAT' },
          message: "must have required property 'VAT'",
        },
        {
          instancePath: '/Certificate/Parties/Manufacturer/Identifiers/DUNS',
          schemaPath: '#/definitions/CompanyIdentifiers/anyOf/1/properties/DUNS/minLength',
          keyword: 'minLength',
          params: { limit: 9 },
          message: 'must NOT have fewer than 9 characters',
        },
        {
          instancePath: '/Certificate/Parties/Manufacturer/Identifiers',
          schemaPath: '#/definitions/CompanyIdentifiers/anyOf',
          keyword: 'anyOf',
          params: {},
          message: 'must match a schema in anyOf',
        },
        {
          instancePath: '/Certificate/BusinessTransaction/OrderConfirmation/Date',
          schemaPath: '#/definitions/BusinessTransaction/properties/OrderConfirmation/properties/Date/format',
          keyword: 'format',
          params: { format: 'date' },
          message: 'must match format "date"',
        },
        {
          instancePath: '/Certificate/BusinessTransaction/Delivery/Id',
          schemaPath: '#/definitions/BusinessTransaction/properties/Delivery/properties/Id/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        },
        {
          instancePath: '/Certificate/Analysis/Inspections/1',
          schemaPath: '#/definitions/Inspection/required',
          keyword: 'required',
          params: { missingProperty: 'Property' },
          message: "must have required property 'Property'",
        },
      ],
    },
    {
      certificateName: `invalid_certificate_2`,
      expectedErrors: [
        {
          instancePath: '/Certificate/Parties/Manufacturer',
          schemaPath: '#/definitions/CompanyBase/oneOf/0/required',
          keyword: 'required',
          params: { missingProperty: 'Name' },
          message: "must have required property 'Name'",
        },
        {
          instancePath: '/Certificate/Parties/Manufacturer',
          schemaPath: '#/definitions/CompanyBase/oneOf/1/required',
          keyword: 'required',
          params: { missingProperty: 'CompanyName' },
          message: "must have required property 'CompanyName'",
        },
        {
          instancePath: '/Certificate/Parties/Manufacturer',
          schemaPath: '#/definitions/CompanyBase/oneOf',
          keyword: 'oneOf',
          params: { passingSchemas: null },
          message: 'must match exactly one schema in oneOf',
        },
        {
          instancePath: '/Certificate/Parties/Manufacturer',
          schemaPath: '#/definitions/CompanyAddress/required',
          keyword: 'required',
          params: { missingProperty: 'Street' },
          message: "must have required property 'Street'",
        },
        {
          instancePath: '/Certificate/Parties/Customer',
          schemaPath: '#/definitions/CompanyAddress/required',
          keyword: 'required',
          params: { missingProperty: 'Street' },
          message: "must have required property 'Street'",
        },
        {
          instancePath: '/Certificate/BusinessTransaction/OrderConfirmation/Date',
          schemaPath: '#/definitions/BusinessTransaction/properties/OrderConfirmation/properties/Date/format',
          keyword: 'format',
          params: { format: 'date' },
          message: 'must match format "date"',
        },
        {
          instancePath: '/Certificate/BusinessTransaction/Delivery/Id',
          schemaPath: '#/definitions/BusinessTransaction/properties/Delivery/properties/Id/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        },
        {
          instancePath: '/Certificate/Analysis/Inspections/1',
          schemaPath: '#/definitions/Inspection/required',
          keyword: 'required',
          params: { missingProperty: 'Property' },
          message: "must have required property 'Property'",
        },
      ],
    },
  ];

  it('should validate schema', async () => {
    const validateSchema = await createAjvInstance().compileAsync(localSchema);
    expect(() => validateSchema()).not.toThrow();
  });

  validCertTestSuitesMap.forEach(({ certificateName }) => {
    it(`${certificateName} should be a valid certificate`, async () => {
      const certificatePath = resolve(__dirname, `./fixtures/${certificateName}.json`);
      const certificate = JSON.parse(readFileSync(certificatePath, 'utf8'));
      const validator = await createAjvInstance().compileAsync(localSchema);
      //
      const isValid = await validator(certificate);
      expect(isValid).toBe(true);
      expect(validator.errors).toBeNull();
    });
  });

  invalidCertTestSuitesMap.forEach(({ certificateName, expectedErrors }) => {
    it(`${certificateName} should be an invalid certificate`, async () => {
      const certificatePath = resolve(__dirname, `./fixtures/${certificateName}.json`);
      const certificate = JSON.parse(readFileSync(certificatePath, 'utf8'));
      const validator = await createAjvInstance().compileAsync(localSchema);
      //
      const isValid = await validator(certificate);
      expect(isValid).toBe(false);
      expect(validator.errors).toEqual(expectedErrors);
    });
  });

  languages.forEach((language) => {
    it(`${language} translations should contain all required properties`, () => {
      const translationsPath = resolve(__dirname, `../${language}.json`);
      const translations = JSON.parse(readFileSync(translationsPath, 'utf8'));
      const certificateProperties = Object.keys(translations.Certificate);
      //
      expect(certificateProperties).toEqual(translationProperties.Certificate);
    });
  });

  languages.forEach((language) => {
    it(`CAMPUS ${language} translations should contain all required properties`, () => {
      const translationsPath = resolve(__dirname, `../CAMPUS/${language}.json`);
      const translations = JSON.parse(readFileSync(translationsPath, 'utf8'));
      const certificateProperties = Object.keys(translations);
      //
      expect(certificateProperties).toEqual(campusTranslationProperties);
    });
  });
});
