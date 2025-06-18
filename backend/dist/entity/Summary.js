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
exports.Summary = void 0;
// src/entity/Summary.ts
const typeorm_1 = require("typeorm");
const Transcript_1 = require("./Transcript");
let Summary = class Summary {
};
exports.Summary = Summary;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Summary.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Summary.prototype, "transcript_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Summary.prototype, "summary_text", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Summary.prototype, "summary_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Summary.prototype, "model_used", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Summary.prototype, "tone_version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Summary.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Transcript_1.Transcript, transcript => transcript.summary),
    (0, typeorm_1.JoinColumn)({ name: "transcript_id" }) // Map 'transcript_id' column to the Transcript entity
    ,
    __metadata("design:type", Transcript_1.Transcript)
], Summary.prototype, "transcript", void 0);
exports.Summary = Summary = __decorate([
    (0, typeorm_1.Entity)()
], Summary);
