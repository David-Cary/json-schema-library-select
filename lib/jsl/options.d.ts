import { type ConversionFactory, type FlagOrObject, type SchemaEnforcer, SchemaOptionsFactory, SchemaOptionsParser, type ValidationParser } from 'schema-select';
import { type Draft, type JsonError, type JsonSchema } from 'json-schema-library';
export declare class DraftedSchemaEnforcerFactory implements ConversionFactory<JsonSchema, SchemaEnforcer<FlagOrObject, JsonError[]>> {
    draft: Draft;
    constructor(draft: Draft);
    process(source: FlagOrObject): SchemaEnforcer<FlagOrObject, JsonError[]>;
}
export declare class DraftedSchemaOptionsFactory extends SchemaOptionsFactory<FlagOrObject, JsonError[]> {
    constructor(draft: Draft);
}
export declare class ErrorListValidationParser<T> implements ValidationParser<T[]> {
    isValid(value: T[]): boolean;
    getValid(): T[];
    rateValidity(value: T[]): number;
}
export declare class JSONErrorListValidationParser extends ErrorListValidationParser<JsonError> {
    keywordPriority: Record<string, number>;
    constructor(keywordPriority?: Record<string, number>);
    rateValidity(value: JsonError[]): number;
}
export declare class DraftedSchemaOptionsParser extends SchemaOptionsParser<FlagOrObject, JsonError[]> {
    constructor(draft: Draft);
}
