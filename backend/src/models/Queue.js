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
var User_1 = require("./User");
var UserQueue_1 = require("./UserQueue");
var Company_1 = require("./Company");
var Whatsapp_1 = require("./Whatsapp");
var WhatsappQueue_1 = require("./WhatsappQueue");
var QueueOption_1 = require("./QueueOption");
var Prompt_1 = require("./Prompt");
var QueueIntegrations_1 = require("./QueueIntegrations");
var Queue = /** @class */ (function (_super) {
    __extends(Queue, _super);
    function Queue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column
    ], Queue.prototype, "id");
    __decorate([
        (0, sequelize_typescript_1.AllowNull)(false),
        sequelize_typescript_1.Unique,
        sequelize_typescript_1.Column
    ], Queue.prototype, "name");
    __decorate([
        (0, sequelize_typescript_1.AllowNull)(false),
        sequelize_typescript_1.Unique,
        sequelize_typescript_1.Column
    ], Queue.prototype, "color");
    __decorate([
        (0, sequelize_typescript_1.Default)(""),
        sequelize_typescript_1.Column
    ], Queue.prototype, "greetingMessage");
    __decorate([
        (0, sequelize_typescript_1.Default)(""),
        sequelize_typescript_1.Column
    ], Queue.prototype, "outOfHoursMessage");
    __decorate([
        (0, sequelize_typescript_1.Column)({
            type: sequelize_typescript_1.DataType.JSONB
        })
    ], Queue.prototype, "schedules");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], Queue.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], Queue.prototype, "updatedAt");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Company_1["default"]; }),
        sequelize_typescript_1.Column
    ], Queue.prototype, "companyId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Company_1["default"]; })
    ], Queue.prototype, "company");
    __decorate([
        (0, sequelize_typescript_1.BelongsToMany)(function () { return Whatsapp_1["default"]; }, function () { return WhatsappQueue_1["default"]; })
    ], Queue.prototype, "whatsapps");
    __decorate([
        (0, sequelize_typescript_1.BelongsToMany)(function () { return User_1["default"]; }, function () { return UserQueue_1["default"]; })
    ], Queue.prototype, "users");
    __decorate([
        (0, sequelize_typescript_1.HasMany)(function () { return QueueOption_1["default"]; }, {
            onDelete: "DELETE",
            onUpdate: "DELETE",
            hooks: true
        })
    ], Queue.prototype, "options");
    __decorate([
        sequelize_typescript_1.Column
    ], Queue.prototype, "orderQueue");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return QueueIntegrations_1["default"]; }),
        sequelize_typescript_1.Column
    ], Queue.prototype, "integrationId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return QueueIntegrations_1["default"]; })
    ], Queue.prototype, "queueIntegrations");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Prompt_1["default"]; }),
        sequelize_typescript_1.Column
    ], Queue.prototype, "promptId");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Prompt_1["default"]; })
    ], Queue.prototype, "prompt");
    __decorate([
        sequelize_typescript_1.Column
    ], Queue.prototype, "mediaPath");
    __decorate([
        sequelize_typescript_1.Column
    ], Queue.prototype, "mediaName");
    __decorate([
        (0, sequelize_typescript_1.Default)(false),
        sequelize_typescript_1.Column
    ], Queue.prototype, "autoAssignmentEnabled");
    __decorate([
        (0, sequelize_typescript_1.Default)(false),
        sequelize_typescript_1.Column
    ], Queue.prototype, "assignOfflineUsers");
    __decorate([
        (0, sequelize_typescript_1.Column)({
            type: sequelize_typescript_1.DataType.JSONB
        })
    ], Queue.prototype, "autoAssignUserIds");
    Queue = __decorate([
        sequelize_typescript_1.Table
    ], Queue);
    return Queue;
}(sequelize_typescript_1.Model));
exports["default"] = Queue;
