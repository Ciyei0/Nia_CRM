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
var uuid_1 = require("uuid");
var Contact_1 = require("./Contact");
var Message_1 = require("./Message");
var Queue_1 = require("./Queue");
var User_1 = require("./User");
var Whatsapp_1 = require("./Whatsapp");
var Company_1 = require("./Company");
var QueueOption_1 = require("./QueueOption");
var Tag_1 = require("./Tag");
var TicketTag_1 = require("./TicketTag");
var QueueIntegrations_1 = require("./QueueIntegrations");
var Prompt_1 = require("./Prompt");
var Ticket = /** @class */ (function (_super) {
    __extends(Ticket, _super);
    function Ticket() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ticket.setUUID = function (ticket) {
        ticket.uuid = (0, uuid_1.v4)();
    };
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column
    ], Ticket.prototype, "id");
    __decorate([
        (0, sequelize_typescript_1.Column)({ defaultValue: "pending" })
    ], Ticket.prototype, "status");
    __decorate([
        sequelize_typescript_1.Column
    ], Ticket.prototype, "unreadMessages");
    __decorate([
        sequelize_typescript_1.Column
    ], Ticket.prototype, "lastMessage");
    __decorate([
        (0, sequelize_typescript_1.Default)(false),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "isGroup");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], Ticket.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], Ticket.prototype, "updatedAt");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return User_1["default"]; }),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "userId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return User_1["default"]; })
    ], Ticket.prototype, "user");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Contact_1["default"]; }),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "contactId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Contact_1["default"]; })
    ], Ticket.prototype, "contact");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Whatsapp_1["default"]; }),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "whatsappId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Whatsapp_1["default"]; })
    ], Ticket.prototype, "whatsapp");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Queue_1["default"]; }),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "queueId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Queue_1["default"]; })
    ], Ticket.prototype, "queue");
    __decorate([
        sequelize_typescript_1.Column
    ], Ticket.prototype, "chatbot");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return QueueOption_1["default"]; }),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "queueOptionId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return QueueOption_1["default"]; })
    ], Ticket.prototype, "queueOption");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return Message_1["default"]; })
    ], Ticket.prototype, "messages");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return TicketTag_1["default"]; })
    ], Ticket.prototype, "ticketTags");
    __decorate([
        (0, sequelize_typescript_1.BelongsToMany)(function () { return Tag_1["default"]; }, function () { return TicketTag_1["default"]; })
    ], Ticket.prototype, "tags");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Company_1["default"]; }),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "companyId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Company_1["default"]; })
    ], Ticket.prototype, "company");
    __decorate([
        (0, sequelize_typescript_1.Default)((0, uuid_1.v4)()),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "uuid");
    __decorate([
        (0, sequelize_typescript_1.Default)(false),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "useIntegration");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return QueueIntegrations_1["default"]; }),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "integrationId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return QueueIntegrations_1["default"]; })
    ], Ticket.prototype, "queueIntegration");
    __decorate([
        sequelize_typescript_1.Column
    ], Ticket.prototype, "typebotSessionId");
    __decorate([
        (0, sequelize_typescript_1.Default)(false),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "typebotStatus");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Prompt_1["default"]; }),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "promptId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Prompt_1["default"]; })
    ], Ticket.prototype, "prompt");
    __decorate([
        sequelize_typescript_1.Column
    ], Ticket.prototype, "fromMe");
    __decorate([
        (0, sequelize_typescript_1.AllowNull)(false),
        (0, sequelize_typescript_1.Default)(0),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "amountUsedBotQueues");
    __decorate([
        (0, sequelize_typescript_1.Default)(true),
        sequelize_typescript_1.Column
    ], Ticket.prototype, "isBot");
    __decorate([
        sequelize_typescript_1.BeforeCreate
    ], Ticket, "setUUID");
    Ticket = __decorate([
        sequelize_typescript_1.Table
    ], Ticket);
    return Ticket;
}(sequelize_typescript_1.Model));
exports["default"] = Ticket;
