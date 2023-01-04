# Change Log

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.1.0

### Added

- Added the property `GoodsReceiver` under the `Parties` property.

### Changed

- Make the property `Identifiers` optional.

## 1.0.0 - Breaking changes

### Changed

- `AddressLine1` and `AddressLine2` have been replaced with the property `Street`, which can be either a string or an array containing between one and three strings.
- In `Company`, `Identifier` has been renamed `Identifiers` as more than one can be present.
- These are the breaking changes in v1.0.0:
- `VAT` now has a minimum length of 8 characters.
- `VAT` can be replaced with `DUNS`.
- The default value of `ValueType` in `Inspections` has been removed. It is now necessary to specify the type.
- Handlebars partials have been implemented for the html rendering. The partials that are currently used can be seen in the file `partials-map.json`, which must be kept up to date.
- In `Company`, email is no longer a required property.
- `Analysis` is no longer a required property.
