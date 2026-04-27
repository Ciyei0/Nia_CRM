"use strict";
exports.__esModule = true;
var AppError = /** @class */ (function () {
    function AppError(message, statusCode) {
        if (statusCode === void 0) { statusCode = 400; }
        this.message = message;
        this.statusCode = statusCode;
    }
    return AppError;
}());
exports["default"] = AppError;
