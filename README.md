# Schema Select
This adds support for [json-schema-library](https://www.npmjs.com/package/json-schema-library) to the  [schema-select](https://www.npmjs.com/package/schema-select) library, letting you generate schema options with the more fully fleshed validation and coercion of json-schema-library.

# Quickstart
## Installation
You can install this library through npm like so:
```
$ npm install --save schema-select
```

## Options Factory

This library provides an `DraftedSchemaOptionsFactory` class.  Said class extends the `SchemaOptionsFactory` from schema-select with a `DraftedSchemaEnforcerFactory` as the enforcer factory, letting you generate labeled schema enforcers as normal.  Note that creating either drafter class will be looking for a json-schema-libary `Draft` object as it's sole constructor parameter.  Note that the validation from those enforcers is a `JSONError` array.

To help read said error array we've provided an `ErrorListValidationParser` that treats empty lists as valid.
