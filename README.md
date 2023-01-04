# CoA-schemas

[![CoA Schema CI](https://github.com/thematerials-network/CoA-schemas/actions/workflows/ci.yml/badge.svg)](https://github.com/thematerials-network/CoA-schemas/actions/workflows/ci.yml)

EN 10204 specifies the types of inspection certificates by which manufacturers declare the compliance of steel products to either product standards or customer specifications. In the absence of norms, other metals and plastics manufacturers have adopted EN 10204 to issue Certificates of Analysis, short CoA.

The main content of CoAs is the origin of the product and its physical attributes, such as dimensions, mechanical properties, or chemical composition. Furthermore, they contain information about the commercial transaction to enable the customer to link it to its purchase order.

This project defines a JSON data structure for Digital Certificates of Analysis meeting the requirements of plastic products.

The complete documentation of the design and its features is available at [https://materialidentity.org](https://materialidentity.org).

## Contribution guidelines

We use [GitHub issues](https://github.com/thematerials-network/CoA-schemas/issues/) for tracking enhancement requests and bugs, please see [Github Discussions](https://github.com/thematerials-network/CoA-schemas/discussions) for general questions and discussion.

### Tests

To run the PDF rendering tests we use [pdf2image](https://github.com/yakovmeister/pdf2image) lib. Please refer to this [guide](https://github.com/yakovmeister/pdf2image/blob/master/docs/gm-installation.md) to install required dependencies.

## Testing a locally updated schema definition

When you update a schema definition locally, you will want to test it before releasing it. To do so, open the `schema.json` file, and change the `$id` value to `schema.json`. Then update the `$ref` of the updated definition with an absolute path to the updated definition, plus the following string: `#/definitions/<definition name>`.

For example, to test an updated `Company` definition, the `schema.json` should look like this:

```json
{
"$id": "schema.json",
  "definitions": {
    ...
    "Company": {
      "allOf": [
        {
          "$ref": "/Users/<username>/s1seven/schema-definitions/company/company.json#/definitions/Company"
        }
      ]
    },
  }
}
```

After testing and the release of the schema definition, simply return the `$id` to its previous value and the `$ref` to the uri of the newly released schema definition.

If you have trouble loading the file, you can **temporarily** update the property `loadSchema` in `createAjvInstance` in `validate.spec.js` to the following to debug the filepath:

```js
    loadSchema: (uri) => {
      if (!uri.startsWith('http')) {
        console.log(uri);
      }
      return loadExternalFile(uri, 'json');
    },
```

## Updating the partial versions in schema.json

First, update `defaultSchemaDefinitionsVersion` in `utils/constants.js` to the latest version number.

Then run `npm run update-version`.

## License

[AGPL-3.0 License](https://github.com/thematerials-network/CoA-schemas/blob/main/LICENSE)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fthematerials-network%2FCoA-schemas.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fthematerials-network%2FCoA-schemas?ref=badge_large)
