"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftedSchemaOptionsParser = exports.JSONErrorListValidationParser = exports.ErrorListValidationParser = exports.DraftedSchemaOptionsFactory = exports.DraftedSchemaEnforcerFactory = void 0;
var schema_select_1 = require("schema-select");
var DraftedSchemaEnforcerFactory = /** @class */ (function () {
    function DraftedSchemaEnforcerFactory(draft) {
        this.draft = draft;
    }
    DraftedSchemaEnforcerFactory.prototype.process = function (source) {
        var _this = this;
        var schema = typeof source === 'boolean'
            ? (source
                ? { type: 'any' }
                : { not: { type: 'any' } })
            : source;
        return {
            schema: schema,
            validate: function (value) { return _this.draft.validate(value, schema); },
            coerce: function (value) { return _this.draft.getTemplate(value, schema); }
        };
    };
    return DraftedSchemaEnforcerFactory;
}());
exports.DraftedSchemaEnforcerFactory = DraftedSchemaEnforcerFactory;
var DraftedSchemaOptionsFactory = /** @class */ (function (_super) {
    __extends(DraftedSchemaOptionsFactory, _super);
    function DraftedSchemaOptionsFactory(draft) {
        return _super.call(this, new DraftedSchemaEnforcerFactory(draft), new schema_select_1.JSONSchemaLabeler(), new schema_select_1.JSONSchemaSplitter()) || this;
    }
    return DraftedSchemaOptionsFactory;
}(schema_select_1.SchemaOptionsFactory));
exports.DraftedSchemaOptionsFactory = DraftedSchemaOptionsFactory;
var ErrorListValidationParser = /** @class */ (function () {
    function ErrorListValidationParser() {
    }
    ErrorListValidationParser.prototype.isValid = function (value) {
        return value.length === 0;
    };
    ErrorListValidationParser.prototype.getValid = function () {
        return [];
    };
    ErrorListValidationParser.prototype.rateValidity = function (value) {
        return 1 - value.length;
    };
    return ErrorListValidationParser;
}());
exports.ErrorListValidationParser = ErrorListValidationParser;
var JSONErrorListValidationParser = /** @class */ (function (_super) {
    __extends(JSONErrorListValidationParser, _super);
    function JSONErrorListValidationParser(keywordPriority) {
        if (keywordPriority === void 0) { keywordPriority = {
            type: 100
        }; }
        var _this = _super.call(this) || this;
        _this.keywordPriority = keywordPriority;
        return _this;
    }
    JSONErrorListValidationParser.prototype.rateValidity = function (value) {
        var _a;
        var totalValidity = 1;
        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
            var error = value_1[_i];
            var steps = error.data.pointer.split('/');
            var keyword = steps[steps.length - 1];
            var priority = (_a = this.keywordPriority[keyword]) !== null && _a !== void 0 ? _a : 1;
            totalValidity -= Math.min(1, priority);
        }
        return totalValidity;
    };
    return JSONErrorListValidationParser;
}(ErrorListValidationParser));
exports.JSONErrorListValidationParser = JSONErrorListValidationParser;
var DraftedSchemaOptionsParser = /** @class */ (function (_super) {
    __extends(DraftedSchemaOptionsParser, _super);
    function DraftedSchemaOptionsParser(draft) {
        return _super.call(this, new DraftedSchemaOptionsFactory(draft), new JSONErrorListValidationParser()) || this;
    }
    return DraftedSchemaOptionsParser;
}(schema_select_1.SchemaOptionsParser));
exports.DraftedSchemaOptionsParser = DraftedSchemaOptionsParser;
