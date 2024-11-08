import {
  type ConversionFactory,
  type FlagOrObject,
  JSONSchemaLabeler,
  JSONSchemaSplitter,
  type SchemaEnforcer,
  SchemaOptionsFactory,
  SchemaOptionsParser,
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

  rateValidity (value: T[]): number {
    return 1 - value.length
  }
}

export class JSONErrorListValidationParser extends ErrorListValidationParser<JsonError> {
  codePriority: Record<string, number>
  
  constructor (
    codePriority: Record<string, number> = {
      'type-error': 10
    }
  ) {
    super()
    this.codePriority = codePriority
  }
  
  rateValidity (value: JsonError[]): number {
    let totalValidity = 1
    for (const error of value) {
      const steps = error.data.pointer.split('/')
      const depth = Math.max(1, steps.length)
      const codePriority = this.codePriority[error.code] != null
        ? Math.max(1, this.codePriority[error.code])
        : 1
      totalValidity -= codePriority / depth
    }
    return totalValidity
  }
}

export class DraftedSchemaOptionsParser extends SchemaOptionsParser<FlagOrObject, JsonError[]> {
  constructor (
    draft: Draft
  ) {
    super(
      new DraftedSchemaOptionsFactory(draft),
      new JSONErrorListValidationParser()
    )
  }
}
