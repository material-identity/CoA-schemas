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
    {
      certificateName: `valid_certificate_5`,
    },
    {
      certificateName: `valid_certificate_6`,
    },
  ];
  const invalidCertTestSuitesMap = [
    {
      certificateName: `invalid_certificate_1`,
      expectedErrors: [
        {
          instancePath: '/Certificate/Parties/Manufacturer',
          keyword: 'required',
          message: "must have required property 'Name'",
          params: {
            missingProperty: 'Name',
          },
          schemaPath: '#/required',
        },
        {
          instancePath: '/Certificate/Parties/Manufacturer/Identifier',
          keyword: 'required',
          message: "must have required property 'VAT'",
          params: {
            missingProperty: 'VAT',
          },
          schemaPath: '#/definitions/Identifier/required',
        },
        {
          instancePath: '/Certificate/BusinessTransaction/OrderConfirmation/Date',
          keyword: 'format',
          message: 'must match format "date"',
          params: {
            format: 'date',
          },
          schemaPath: '#/definitions/BusinessTransaction/properties/OrderConfirmation/properties/Date/format',
        },
        {
          instancePath: '/Certificate/BusinessTransaction/Delivery/Id',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/definitions/BusinessTransaction/properties/Delivery/properties/Id/type',
        },
        {
          instancePath: '/Certificate/Analysis/Inspections/1',
          keyword: 'required',
          message: "must have required property 'Property'",
          params: {
            missingProperty: 'Property',
          },
          schemaPath: '#/definitions/Inspection/required',
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
