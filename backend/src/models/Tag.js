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
var Ticket_1 = require("./Ticket");
var TicketTag_1 = require("./TicketTag");
var Tag = /** @class */ (function (_super) {
    __extends(Tag, _super);
    function Tag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column
    ], Tag.prototype, "id");
    __decorate([
        sequelize_typescript_1.Column
    ], Tag.prototype, "name");
    __decorate([
        sequelize_typescript_1.Column
    ], Tag.prototype, "color");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return TicketTag_1["default"]; })
    ], Tag.prototype, "ticketTags");
    __decorate([
        (0, sequelize_typescript_1.BelongsToMany)(function () { return Ticket_1["default"]; }, function () { return TicketTag_1["default"]; })
    ], Tag.prototype, "tickets");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Company_1["default"]; }),
        sequelize_typescript_1.Column
    ], Tag.prototype, "companyId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Company_1["default"]; })
    ], Tag.prototype, "company");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], Tag.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], Tag.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.Column
    ], Tag.prototype, "kanban");
    __decorate([
        (0, sequelize_typescript_1.Column)({ defaultValue: false })
    ], Tag.prototype, "isDefault");
    Tag = __decorate([
        sequelize_typescript_1.Table
    ], Tag);
    return Tag;
}(sequelize_typescript_1.Model));
exports["default"] = Tag;
