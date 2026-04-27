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
var User_1 = require("./User");
var Ticket_1 = require("./Ticket");
var Whatsapp_1 = require("./Whatsapp");
var TicketTraking = /** @class */ (function (_super) {
    __extends(TicketTraking, _super);
    function TicketTraking() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column
    ], TicketTraking.prototype, "id");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Ticket_1["default"]; }),
        sequelize_typescript_1.Column
    ], TicketTraking.prototype, "ticketId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Ticket_1["default"]; })
    ], TicketTraking.prototype, "ticket");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Company_1["default"]; }),
        sequelize_typescript_1.Column
    ], TicketTraking.prototype, "companyId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Company_1["default"]; })
    ], TicketTraking.prototype, "company");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Whatsapp_1["default"]; }),
        sequelize_typescript_1.Column
    ], TicketTraking.prototype, "whatsappId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Whatsapp_1["default"]; })
    ], TicketTraking.prototype, "whatsapp");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return User_1["default"]; }),
        sequelize_typescript_1.Column
    ], TicketTraking.prototype, "userId");
    __decorate([
        sequelize_typescript_1.Column
    ], TicketTraking.prototype, "rated");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return User_1["default"]; })
    ], TicketTraking.prototype, "user");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], TicketTraking.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], TicketTraking.prototype, "updatedAt");
    __decorate([
        sequelize_typescript_1.Column
    ], TicketTraking.prototype, "startedAt");
    __decorate([
        sequelize_typescript_1.Column
    ], TicketTraking.prototype, "queuedAt");
    __decorate([
        sequelize_typescript_1.Column
    ], TicketTraking.prototype, "finishedAt");
    __decorate([
        sequelize_typescript_1.Column
    ], TicketTraking.prototype, "ratingAt");
    __decorate([
        sequelize_typescript_1.Column
    ], TicketTraking.prototype, "chatbotAt");
    TicketTraking = __decorate([
        (0, sequelize_typescript_1.Table)({
            tableName: "TicketTraking"
        })
    ], TicketTraking);
    return TicketTraking;
}(sequelize_typescript_1.Model));
exports["default"] = TicketTraking;
