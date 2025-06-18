"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsageLog = void 0;
// src/entity/UsageLog.ts
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Video_1 = require("./Video");
let UsageLog = class UsageLog {
};
exports.UsageLog = UsageLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UsageLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], UsageLog.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], UsageLog.prototype, "video_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UsageLog.prototype, "event_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], UsageLog.prototype, "event_details", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], UsageLog.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.usageLogs),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }) // Map 'user_id' column to the User entity
    ,
    __metadata("design:type", User_1.User)
], UsageLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Video_1.Video, video => video.usageLogs, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "video_id" }) // Map 'video_id' column to the Video entity
    ,
    __metadata("design:type", Video_1.Video)
], UsageLog.prototype, "video", void 0);
exports.UsageLog = UsageLog = __decorate([
    (0, typeorm_1.Entity)()
], UsageLog);
