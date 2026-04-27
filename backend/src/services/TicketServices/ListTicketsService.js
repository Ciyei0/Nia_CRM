"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var date_fns_1 = require("date-fns");
var Ticket_1 = require("../../models/Ticket");
var Contact_1 = require("../../models/Contact");
var Message_1 = require("../../models/Message");
var Queue_1 = require("../../models/Queue");
var User_1 = require("../../models/User");
var ShowUserService_1 = require("../UserServices/ShowUserService");
var Tag_1 = require("../../models/Tag");
var TicketTag_1 = require("../../models/TicketTag");
var lodash_1 = require("lodash");
var Whatsapp_1 = require("../../models/Whatsapp");
var ListTicketsService = function (_a) {
    var _b = _a.searchParam, searchParam = _b === void 0 ? "" : _b, _c = _a.pageNumber, pageNumber = _c === void 0 ? "1" : _c, queueIds = _a.queueIds, tags = _a.tags, users = _a.users, status = _a.status, date = _a.date, updatedAt = _a.updatedAt, showAll = _a.showAll, userId = _a.userId, withUnreadMessages = _a.withUnreadMessages, companyId = _a.companyId;
    return __awaiter(void 0, void 0, void 0, function () {
        var whereCondition, includeCondition, sanitizedSearchParam, user, userQueueIds, ticketsTagFilter, _i, tags_1, tag, ticketTags, ticketsIntersection, ticketsUserFilter, _d, users_1, user, ticketUsers, ticketsIntersection, limit, offset, _e, count, tickets, hasMore;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    whereCondition = (_f = {},
                        _f[sequelize_1.Op.or] = [{ userId: userId }, { status: "pending" }],
                        _f.queueId = (_g = {}, _g[sequelize_1.Op.or] = [queueIds, null], _g),
                        _f);
                    includeCondition = [
                        {
                            model: Contact_1["default"],
                            as: "contact",
                            attributes: ["id", "name", "number", "email", "profilePicUrl"]
                        },
                        {
                            model: Queue_1["default"],
                            as: "queue",
                            attributes: ["id", "name", "color"]
                        },
                        {
                            model: User_1["default"],
                            as: "user",
                            attributes: ["id", "name"]
                        },
                        {
                            model: Tag_1["default"],
                            as: "tags",
                            attributes: ["id", "name", "color"]
                        },
                        {
                            model: Whatsapp_1["default"],
                            as: "whatsapp",
                            attributes: ["name"]
                        },
                    ];
                    if (showAll === "true") {
                        whereCondition = { queueId: (_h = {}, _h[sequelize_1.Op.or] = [queueIds, null], _h) };
                    }
                    if (status) {
                        whereCondition = __assign(__assign({}, whereCondition), { status: status });
                    }
                    if (searchParam) {
                        sanitizedSearchParam = searchParam.toLocaleLowerCase().trim();
                        includeCondition = __spreadArray(__spreadArray([], includeCondition, true), [
                            {
                                model: Message_1["default"],
                                as: "messages",
                                attributes: ["id", "body"],
                                where: {
                                    body: (0, sequelize_1.where)((0, sequelize_1.fn)("LOWER", (0, sequelize_1.col)("body")), "LIKE", "%".concat(sanitizedSearchParam, "%"))
                                },
                                required: false,
                                duplicating: false
                            }
                        ], false);
                        whereCondition = __assign(__assign({}, whereCondition), (_j = {}, _j[sequelize_1.Op.or] = [
                            {
                                "$contact.name$": (0, sequelize_1.where)((0, sequelize_1.fn)("LOWER", (0, sequelize_1.col)("contact.name")), "LIKE", "%".concat(sanitizedSearchParam, "%"))
                            },
                            { "$contact.number$": (_k = {}, _k[sequelize_1.Op.like] = "%".concat(sanitizedSearchParam, "%"), _k) },
                            {
                                "$message.body$": (0, sequelize_1.where)((0, sequelize_1.fn)("LOWER", (0, sequelize_1.col)("body")), "LIKE", "%".concat(sanitizedSearchParam, "%"))
                            }
                        ], _j));
                    }
                    if (date) {
                        whereCondition = {
                            createdAt: (_l = {},
                                _l[sequelize_1.Op.between] = [+(0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(date)), +(0, date_fns_1.endOfDay)((0, date_fns_1.parseISO)(date))],
                                _l)
                        };
                    }
                    if (updatedAt) {
                        whereCondition = {
                            updatedAt: (_m = {},
                                _m[sequelize_1.Op.between] = [
                                    +(0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(updatedAt)),
                                    +(0, date_fns_1.endOfDay)((0, date_fns_1.parseISO)(updatedAt))
                                ],
                                _m)
                        };
                    }
                    if (!(withUnreadMessages === "true")) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, ShowUserService_1["default"])(userId)];
                case 1:
                    user = _t.sent();
                    userQueueIds = user.queues.map(function (queue) { return queue.id; });
                    whereCondition = (_o = {},
                        _o[sequelize_1.Op.or] = [{ userId: userId }, { status: "pending" }],
                        _o.queueId = (_p = {}, _p[sequelize_1.Op.or] = [userQueueIds, null], _p),
                        _o.unreadMessages = (_q = {}, _q[sequelize_1.Op.gt] = 0, _q),
                        _o);
                    _t.label = 2;
                case 2:
                    if (!(Array.isArray(tags) && tags.length > 0)) return [3 /*break*/, 7];
                    ticketsTagFilter = [];
                    _i = 0, tags_1 = tags;
                    _t.label = 3;
                case 3:
                    if (!(_i < tags_1.length)) return [3 /*break*/, 6];
                    tag = tags_1[_i];
                    return [4 /*yield*/, TicketTag_1["default"].findAll({
                            where: { tagId: tag }
                        })];
                case 4:
                    ticketTags = _t.sent();
                    if (ticketTags) {
                        ticketsTagFilter.push(ticketTags.map(function (t) { return t.ticketId; }));
                    }
                    _t.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    ticketsIntersection = lodash_1.intersection.apply(void 0, ticketsTagFilter);
                    whereCondition = __assign(__assign({}, whereCondition), { id: (_r = {},
                            _r[sequelize_1.Op["in"]] = ticketsIntersection,
                            _r) });
                    _t.label = 7;
                case 7:
                    if (!(Array.isArray(users) && users.length > 0)) return [3 /*break*/, 12];
                    ticketsUserFilter = [];
                    _d = 0, users_1 = users;
                    _t.label = 8;
                case 8:
                    if (!(_d < users_1.length)) return [3 /*break*/, 11];
                    user = users_1[_d];
                    return [4 /*yield*/, Ticket_1["default"].findAll({
                            where: { userId: user }
                        })];
                case 9:
                    ticketUsers = _t.sent();
                    if (ticketUsers) {
                        ticketsUserFilter.push(ticketUsers.map(function (t) { return t.id; }));
                    }
                    _t.label = 10;
                case 10:
                    _d++;
                    return [3 /*break*/, 8];
                case 11:
                    ticketsIntersection = lodash_1.intersection.apply(void 0, ticketsUserFilter);
                    whereCondition = __assign(__assign({}, whereCondition), { id: (_s = {},
                            _s[sequelize_1.Op["in"]] = ticketsIntersection,
                            _s) });
                    _t.label = 12;
                case 12:
                    limit = 40;
                    offset = limit * (+pageNumber - 1);
                    whereCondition = __assign(__assign({}, whereCondition), { companyId: companyId });
                    return [4 /*yield*/, Ticket_1["default"].findAndCountAll({
                            where: whereCondition,
                            include: includeCondition,
                            distinct: true,
                            limit: limit,
                            offset: offset,
                            order: [["updatedAt", "DESC"]],
                            subQuery: false
                        })];
                case 13:
                    _e = _t.sent(), count = _e.count, tickets = _e.rows;
                    hasMore = count > offset + tickets.length;
                    console.log("[ListTicketsService] status=".concat(status, " companyId=").concat(companyId, " userId=").concat(userId, " showAll=").concat(showAll, " queueIds=").concat(JSON.stringify(queueIds), " -> found ").concat(tickets.length, " tickets"));
                    if (status === "pending") {
                        console.log("[ListTicketsService] pending tickets:", tickets.map(function (t) { return ({ id: t.id, status: t.status, queueId: t.queueId }); }));
                    }
                    return [2 /*return*/, {
                            tickets: tickets,
                            count: count,
                            hasMore: hasMore
                        }];
            }
        });
    });
};
exports["default"] = ListTicketsService;
