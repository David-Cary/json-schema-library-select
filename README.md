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

## Options Parser

As of version 1.1.0, this library also provides a `DraftedSchemaOptionsParser` to find the subschema that best fits the provided value.

It does this through the `JSONErrorListValidationParser`.  That starts with a validity rating of 1 and defaults to subtracting 1 per error.  Said parser lets you set code priorities to adjust that reduction, with the default priority map giving type errors a weight of 10.  The reductions are divided by the path length, so a having a property with the wrong type would have a weight of 5 (10 for type, divided by 2 for being a property).
