import { ConversionFactory, FlagOrObject, SchemaEnforcer, SchemaOptionsFactory } from 'schema-select';
import { Draft, JsonError, JsonSchema } from 'json-schema-library';
export declare class DraftedSchemaEnforcerFactory implements ConversionFactory<JsonSchema, SchemaEnforcer<FlagOrObject, JsonError[]>> {
    draft: Draft;
    constructor(draft: Draft);
    process(source: FlagOrObject): SchemaEnforcer<FlagOrObject, JsonError[]>;
}
export declare class DraftedSchemaOptionsFactory extends SchemaOptionsFactory<FlagOrObject, JsonError[]> {
    constructor(draft: Draft);
}
