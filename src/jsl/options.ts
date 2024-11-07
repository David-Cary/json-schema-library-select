import {
  type ConversionFactory,
  type FlagOrObject,
  JSONSchemaLabeler,
  JSONSchemaSplitter,
  type SchemaEnforcer,
  SchemaOptionsFactory,
  type ValidationParser
} from 'schema-select'
import {
  type Draft,
  type JsonError,
  type JsonSchema
} from 'json-schema-library'

export class DraftedSchemaEnforcerFactory
implements ConversionFactory<JsonSchema, SchemaEnforcer<FlagOrObject, JsonError[]>> {
  draft: Draft

  constructor (
    draft: Draft
  ) {
    this.draft = draft
  }

  process (
    source: FlagOrObject
  ): SchemaEnforcer<FlagOrObject, JsonError[]> {
    const schema = typeof source === 'boolean'
      ? (
          source
            ? { type: 'any' }
            : { not: { type: 'any' } }
        )
      : source
    return {
      schema,
      validate: (value: any) => this.draft.validate(value, schema),
      coerce: (value: any) => this.draft.getTemplate(value, schema)
    }
  }
}

export class DraftedSchemaOptionsFactory extends SchemaOptionsFactory<FlagOrObject, JsonError[]> {
  constructor (
    draft: Draft
  ) {
    super(
      new DraftedSchemaEnforcerFactory(draft),
      new JSONSchemaLabeler(),
      new JSONSchemaSplitter()
    )
  }
}

export class ErrorListValidationParser <T> implements ValidationParser<T[]> {
  isValid (value: T[]): boolean {
    return value.length === 0
  }

  getValid (): T[] {
    return []
  }
}
