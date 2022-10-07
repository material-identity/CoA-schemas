# Change Log

All notable changes to this project will be documented in this file.

## 1.0.0 - Breaking changes

There are 4 breaking changes in the newest implementation:

1. `AddressLine1` and `AddressLine2` have been replaced with the property `Street`, which can be either a string or an array containing between one and three strings.
2. In `Company`, `Identifier` has been renamed `Identifiers` as more than one can be present.
3. `VAT` now has a minimum length of 8 characters.
4. `VAT` can be replaced with `DUNS`.
5. The default value of `ValueType` in `Inspections` has been removed. It is now necessary to specify the type.
6. Handlebars partials have been implemented for the html rendering. The partials that are currently used can be seen in the file `partials-map.json`, which must be kept up to date.
7. In `Company`, email is no longer a required property.
8. `Analysis` is no longer a required property.
