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
var QueueOption = /** @class */ (function (_super) {
    __extends(QueueOption, _super);
    function QueueOption() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QueueOption_1 = QueueOption;
    var QueueOption_1;
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column
    ], QueueOption.prototype, "id");
    __decorate([
        sequelize_typescript_1.Column
    ], QueueOption.prototype, "title");
    __decorate([
        sequelize_typescript_1.AllowNull,
        sequelize_typescript_1.Column
    ], QueueOption.prototype, "message");
    __decorate([
        sequelize_typescript_1.AllowNull,
        sequelize_typescript_1.Column
    ], QueueOption.prototype, "option");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Queue_1["default"]; }),
        sequelize_typescript_1.Column
    ], QueueOption.prototype, "queueId");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return QueueOption_1; }),
        sequelize_typescript_1.Column
    ], QueueOption.prototype, "parentId");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], QueueOption.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], QueueOption.prototype, "updatedAt");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Queue_1["default"]; })
    ], QueueOption.prototype, "queue");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return QueueOption_1; }, { foreignKey: 'parentId' })
    ], QueueOption.prototype, "parent");
    __decorate([
        sequelize_typescript_1.Column
    ], QueueOption.prototype, "mediaPath");
    __decorate([
        sequelize_typescript_1.Column
    ], QueueOption.prototype, "mediaName");
    QueueOption = QueueOption_1 = __decorate([
        sequelize_typescript_1.Table
    ], QueueOption);
    return QueueOption;
}(sequelize_typescript_1.Model));
exports["default"] = QueueOption;
