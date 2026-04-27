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
var Ticket_1 = require("./Ticket");
var WhatsappQueue_1 = require("./WhatsappQueue");
var Company_1 = require("./Company");
var Prompt_1 = require("./Prompt");
var QueueIntegrations_1 = require("./QueueIntegrations");
var Whatsapp = /** @class */ (function (_super) {
    __extends(Whatsapp, _super);
    function Whatsapp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "id");
    __decorate([
        sequelize_typescript_1.AllowNull,
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], Whatsapp.prototype, "name");
    __decorate([
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], Whatsapp.prototype, "session");
    __decorate([
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], Whatsapp.prototype, "qrcode");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "status");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "battery");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "plugged");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "retries");
    __decorate([
        (0, sequelize_typescript_1.Default)(""),
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], Whatsapp.prototype, "greetingMessage");
    __decorate([
        (0, sequelize_typescript_1.Default)(""),
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], Whatsapp.prototype, "farewellMessage");
    __decorate([
        (0, sequelize_typescript_1.Default)(""),
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], Whatsapp.prototype, "complationMessage");
    __decorate([
        (0, sequelize_typescript_1.Default)(""),
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], Whatsapp.prototype, "outOfHoursMessage");
    __decorate([
        (0, sequelize_typescript_1.Default)(""),
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], Whatsapp.prototype, "ratingMessage");
    __decorate([
        (0, sequelize_typescript_1.Column)({ defaultValue: "stable" })
    ], Whatsapp.prototype, "provider");
    __decorate([
        (0, sequelize_typescript_1.Default)(false),
        sequelize_typescript_1.AllowNull,
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "isDefault");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], Whatsapp.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], Whatsapp.prototype, "updatedAt");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return Ticket_1["default"]; })
    ], Whatsapp.prototype, "tickets");
    __decorate([
        (0, sequelize_typescript_1.BelongsToMany)(function () { return Queue_1["default"]; }, function () { return WhatsappQueue_1["default"]; })
    ], Whatsapp.prototype, "queues");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return WhatsappQueue_1["default"]; })
    ], Whatsapp.prototype, "whatsappQueues");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Company_1["default"]; }),
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "companyId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Company_1["default"]; })
    ], Whatsapp.prototype, "company");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "token");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "transferQueueId");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "timeToTransfer");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Prompt_1["default"]; }),
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "promptId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Prompt_1["default"]; })
    ], Whatsapp.prototype, "prompt");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return QueueIntegrations_1["default"]; }),
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "integrationId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return QueueIntegrations_1["default"]; })
    ], Whatsapp.prototype, "queueIntegrations");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "maxUseBotQueues");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "timeUseBotQueues");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "expiresTicket");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "number");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "expiresInactiveMessage");
    __decorate([
        (0, sequelize_typescript_1.Default)("baileys"),
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "channel");
    __decorate([
        (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)
    ], Whatsapp.prototype, "facebookAccessToken");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "facebookUserId");
    __decorate([
        sequelize_typescript_1.Column
    ], Whatsapp.prototype, "whatsappAccountId");
    Whatsapp = __decorate([
        sequelize_typescript_1.Table
    ], Whatsapp);
    return Whatsapp;
}(sequelize_typescript_1.Model));
exports["default"] = Whatsapp;
