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
var Company_1 = require("./Company");
var QueueIntegrations = /** @class */ (function (_super) {
    __extends(QueueIntegrations, _super);
    function QueueIntegrations() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column
    ], QueueIntegrations.prototype, "id");
    __decorate([
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], QueueIntegrations.prototype, "type");
    __decorate([
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], QueueIntegrations.prototype, "name");
    __decorate([
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], QueueIntegrations.prototype, "projectName");
    __decorate([
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], QueueIntegrations.prototype, "jsonContent");
    __decorate([
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], QueueIntegrations.prototype, "urlN8N");
    __decorate([
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], QueueIntegrations.prototype, "language");
    __decorate([
        sequelize_typescript_1.CreatedAt,
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6))
    ], QueueIntegrations.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt,
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6))
    ], QueueIntegrations.prototype, "updatedAt");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Company_1["default"]; }),
        sequelize_typescript_1.Column
    ], QueueIntegrations.prototype, "companyId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Company_1["default"]; })
    ], QueueIntegrations.prototype, "company");
    __decorate([
        sequelize_typescript_1.Column
    ], QueueIntegrations.prototype, "typebotSlug");
    __decorate([
        (0, sequelize_typescript_1.Default)(0),
        sequelize_typescript_1.Column
    ], QueueIntegrations.prototype, "typebotExpires");
    __decorate([
        sequelize_typescript_1.Column
    ], QueueIntegrations.prototype, "typebotKeywordFinish");
    __decorate([
        sequelize_typescript_1.Column
    ], QueueIntegrations.prototype, "typebotUnknownMessage");
    __decorate([
        (0, sequelize_typescript_1.Default)(1000),
        sequelize_typescript_1.Column
    ], QueueIntegrations.prototype, "typebotDelayMessage");
    __decorate([
        sequelize_typescript_1.Column
    ], QueueIntegrations.prototype, "typebotKeywordRestart");
    __decorate([
        sequelize_typescript_1.Column
    ], QueueIntegrations.prototype, "typebotRestartMessage");
    QueueIntegrations = __decorate([
        sequelize_typescript_1.Table
    ], QueueIntegrations);
    return QueueIntegrations;
}(sequelize_typescript_1.Model));
exports["default"] = QueueIntegrations;
