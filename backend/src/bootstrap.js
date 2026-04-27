"use strict";
exports.__esModule = true;
var dotenv_1 = require("dotenv");
dotenv_1["default"].config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});
