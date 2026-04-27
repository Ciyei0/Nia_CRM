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
var Contact_1 = require("./Contact");
var Message_1 = require("./Message");
var Plan_1 = require("./Plan");
var Queue_1 = require("./Queue");
var Setting_1 = require("./Setting");
var Ticket_1 = require("./Ticket");
var TicketTraking_1 = require("./TicketTraking");
var User_1 = require("./User");
var UserRating_1 = require("./UserRating");
var Whatsapp_1 = require("./Whatsapp");
var Company = /** @class */ (function (_super) {
    __extends(Company, _super);
    function Company() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column
    ], Company.prototype, "id");
    __decorate([
        sequelize_typescript_1.Column
    ], Company.prototype, "name");
    __decorate([
        sequelize_typescript_1.Column
    ], Company.prototype, "phone");
    __decorate([
        sequelize_typescript_1.Column
    ], Company.prototype, "email");
    __decorate([
        sequelize_typescript_1.Column
    ], Company.prototype, "status");
    __decorate([
        sequelize_typescript_1.Column
    ], Company.prototype, "dueDate");
    __decorate([
        sequelize_typescript_1.Column
    ], Company.prototype, "recurrence");
    __decorate([
        (0, sequelize_typescript_1.Column)({
            type: sequelize_typescript_1.DataType.JSONB
        })
    ], Company.prototype, "schedules");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Plan_1["default"]; }),
        sequelize_typescript_1.Column
    ], Company.prototype, "planId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Plan_1["default"]; })
    ], Company.prototype, "plan");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], Company.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], Company.prototype, "updatedAt");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return User_1["default"]; }, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            hooks: true
        })
    ], Company.prototype, "users");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return UserRating_1["default"]; }, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            hooks: true
        })
    ], Company.prototype, "userRatings");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return Queue_1["default"]; }, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            hooks: true
        })
    ], Company.prototype, "queues");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return Whatsapp_1["default"]; }, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            hooks: true
        })
    ], Company.prototype, "whatsapps");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return Message_1["default"]; }, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            hooks: true
        })
    ], Company.prototype, "messages");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return Contact_1["default"]; }, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            hooks: true
        })
    ], Company.prototype, "contacts");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return Setting_1["default"]; }, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            hooks: true
        })
    ], Company.prototype, "settings");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return Ticket_1["default"]; }, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            hooks: true
        })
    ], Company.prototype, "tickets");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return TicketTraking_1["default"]; }, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            hooks: true
        })
    ], Company.prototype, "ticketTrankins");
    Company = __decorate([
        sequelize_typescript_1.Table
    ], Company);
    return Company;
}(sequelize_typescript_1.Model));
exports["default"] = Company;
