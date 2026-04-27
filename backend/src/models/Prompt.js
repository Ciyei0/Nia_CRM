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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var sequelize_typescript_1 = require("sequelize-typescript");
var Queue_1 = require("./Queue");
var Company_1 = require("./Company");
var Prompt = /** @class */ (function (_super) {
    __extends(Prompt, _super);
    function Prompt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column
    ], Prompt.prototype, "id");
    __decorate([
        (0, sequelize_typescript_1.AllowNull)(false),
        sequelize_typescript_1.Column
    ], Prompt.prototype, "name");
    __decorate([
        (0, sequelize_typescript_1.AllowNull)(false),
        sequelize_typescript_1.Column
    ], Prompt.prototype, "prompt");
    __decorate([
        (0, sequelize_typescript_1.AllowNull)(false),
        sequelize_typescript_1.Column
    ], Prompt.prototype, "apiKey");
    __decorate([
        (0, sequelize_typescript_1.Column)({ defaultValue: 10 })
    ], Prompt.prototype, "maxMessages");
    __decorate([
        (0, sequelize_typescript_1.Column)({ defaultValue: 100 })
    ], Prompt.prototype, "maxTokens");
    __decorate([
        (0, sequelize_typescript_1.Column)({ defaultValue: 1 })
    ], Prompt.prototype, "temperature");
    __decorate([
        (0, sequelize_typescript_1.Column)({ defaultValue: 0 })
    ], Prompt.prototype, "promptTokens");
    __decorate([
        (0, sequelize_typescript_1.Column)({ defaultValue: 0 })
    ], Prompt.prototype, "completionTokens");
    __decorate([
        (0, sequelize_typescript_1.Column)({ defaultValue: 0 })
    ], Prompt.prototype, "totalTokens");
    __decorate([
        (0, sequelize_typescript_1.AllowNull)(false),
        sequelize_typescript_1.Column
    ], Prompt.prototype, "voice");
    __decorate([
        (0, sequelize_typescript_1.AllowNull)(true),
        sequelize_typescript_1.Column
    ], Prompt.prototype, "voiceKey");
    __decorate([
        (0, sequelize_typescript_1.AllowNull)(true),
        sequelize_typescript_1.Column
    ], Prompt.prototype, "voiceRegion");
    __decorate([
        sequelize_typescript_1.AllowNull,
        (0, sequelize_typescript_1.ForeignKey)(function () { return Queue_1["default"]; }),
        sequelize_typescript_1.Column
    ], Prompt.prototype, "queueId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Queue_1["default"]; })
    ], Prompt.prototype, "queue");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Company_1["default"]; }),
        sequelize_typescript_1.Column
    ], Prompt.prototype, "companyId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Company_1["default"]; })
    ], Prompt.prototype, "company");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], Prompt.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], Prompt.prototype, "updatedAt");
    Prompt = __decorate([
        sequelize_typescript_1.Table
    ], Prompt);
    return Prompt;
}(sequelize_typescript_1.Model));
exports["default"] = Prompt;
