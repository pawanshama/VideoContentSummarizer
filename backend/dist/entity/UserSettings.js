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
exports.UserSettings = void 0;
// src/entity/UserSettings.ts
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let UserSettings = class UserSettings {
};
exports.UserSettings = UserSettings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserSettings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", unique: true }) // Foreign key column for User, must be unique for One-to-One
    ,
    __metadata("design:type", String)
], UserSettings.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'concise' }),
    __metadata("design:type", String)
], UserSettings.prototype, "default_summary_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'en' }),
    __metadata("design:type", String)
], UserSettings.prototype, "default_output_language", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserSettings.prototype, "auto_delete_original_video", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], UserSettings.prototype, "notification_preferences", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], UserSettings.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], UserSettings.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_1.User, user => user.userSettings, { onDelete: "CASCADE" }) // If a user is deleted, their settings should also be deleted
    ,
    (0, typeorm_1.JoinColumn)({ name: "user_id" }) // Map 'user_id' column to the User entity
    ,
    __metadata("design:type", User_1.User)
], UserSettings.prototype, "user", void 0);
exports.UserSettings = UserSettings = __decorate([
    (0, typeorm_1.Entity)()
], UserSettings);
