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
var ContactCustomField_1 = require("./ContactCustomField");
var Ticket_1 = require("./Ticket");
var Company_1 = require("./Company");
var Schedule_1 = require("./Schedule");
var Whatsapp_1 = require("./Whatsapp");
var Contact = /** @class */ (function (_super) {
    __extends(Contact, _super);
    function Contact() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column
    ], Contact.prototype, "id");
    __decorate([
        sequelize_typescript_1.Column
    ], Contact.prototype, "name");
    __decorate([
        (0, sequelize_typescript_1.AllowNull)(false),
        sequelize_typescript_1.Unique,
        sequelize_typescript_1.Column
    ], Contact.prototype, "number");
    __decorate([
        (0, sequelize_typescript_1.AllowNull)(false),
        (0, sequelize_typescript_1.Default)(""),
        sequelize_typescript_1.Column
    ], Contact.prototype, "email");
    __decorate([
        (0, sequelize_typescript_1.Default)(""),
        sequelize_typescript_1.Column
    ], Contact.prototype, "profilePicUrl");
    __decorate([
        (0, sequelize_typescript_1.Default)(false),
        sequelize_typescript_1.Column
    ], Contact.prototype, "isGroup");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], Contact.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], Contact.prototype, "updatedAt");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return Ticket_1["default"]; })
    ], Contact.prototype, "tickets");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return ContactCustomField_1["default"]; })
    ], Contact.prototype, "extraInfo");
    __decorate([
        (0, sequelize_typescript_1.Default)(true),
        sequelize_typescript_1.Column
    ], Contact.prototype, "active");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Company_1["default"]; }),
        sequelize_typescript_1.Column
    ], Contact.prototype, "companyId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Company_1["default"]; })
    ], Contact.prototype, "company");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return Schedule_1["default"]; }, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            hooks: true
        })
    ], Contact.prototype, "schedules");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Whatsapp_1["default"]; }),
        sequelize_typescript_1.Column
    ], Contact.prototype, "whatsappId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Whatsapp_1["default"]; })
    ], Contact.prototype, "whatsapp");
    Contact = __decorate([
        sequelize_typescript_1.Table
    ], Contact);
    return Contact;
}(sequelize_typescript_1.Model));
exports["default"] = Contact;
