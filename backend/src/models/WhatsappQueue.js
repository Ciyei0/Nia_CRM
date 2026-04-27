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
var Whatsapp_1 = require("./Whatsapp");
var WhatsappQueue = /** @class */ (function (_super) {
    __extends(WhatsappQueue, _super);
    function WhatsappQueue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Whatsapp_1["default"]; }),
        sequelize_typescript_1.Column
    ], WhatsappQueue.prototype, "whatsappId");
    __decorate([
        (0, sequelize_typescript_1.ForeignKey)(function () { return Queue_1["default"]; }),
        sequelize_typescript_1.Column
    ], WhatsappQueue.prototype, "queueId");
    __decorate([
        sequelize_typescript_1.CreatedAt
    ], WhatsappQueue.prototype, "createdAt");
    __decorate([
        sequelize_typescript_1.UpdatedAt
    ], WhatsappQueue.prototype, "updatedAt");
    __decorate([
        (0, sequelize_typescript_1.BelongsTo)(function () { return Queue_1["default"]; })
    ], WhatsappQueue.prototype, "queue");
    WhatsappQueue = __decorate([
        sequelize_typescript_1.Table
    ], WhatsappQueue);
    return WhatsappQueue;
}(sequelize_typescript_1.Model));
exports["default"] = WhatsappQueue;
