"use strict";
// // src/entity/Transcript.ts
// import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
// import { Video } from "./Video";
// import { Summary } from "./Summary";
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
exports.Transcript = void 0;
// @Entity()
// export class Transcript {
//   @PrimaryGeneratedColumn("uuid")
//   id!: string; // Primary key, auto-generated UUID
//   @Column({ type: "uuid" })
//   video_id!: string; // Foreign key column for Video
//   @Column({ type: "text" })
//   transcript_content!: string; // The full text of the video's transcript
//   @Column({ nullable: true })
//   model_used?: string; // Model used for transcription (e.g., 'Whisper', 'Google Speech-to-Text')
//   @Column({ nullable: true })
//   tone_version?: string; // Version/details about the tone analysis model used (if applicable)
//   @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
//   created_at!: Date; // Timestamp when the transcript was generated
//   // --- Relationships ---
//   // One-to-One relationship with Video: One Transcript belongs to one Video
//   // This is the owning side, as it holds the foreign key 'video_id'
//   @OneToOne(() => Video, video => video.transcript)
//   @JoinColumn({ name: "video_id" }) // Map 'video_id' column to the Video entity
//   video!: Video; // The Video entity associated with this transcript
//   // One-to-One relationship with Summary: One Transcript has one Summary
//   // The Summary is typically generated from the Transcript, so CASCADE delete is logical.
//   @OneToOne(() => Summary, summary => summary.transcript, { onDelete: "CASCADE" })
//   summary!: Summary; // The Summary entity associated with this transcript
// }
// src/entity/Transcript.ts
const typeorm_1 = require("typeorm");
const Video_1 = require("./Video");
const Summary_1 = require("./Summary");
let Transcript = class Transcript {
};
exports.Transcript = Transcript;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Transcript.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", unique: true }) // video_id is the foreign key, and typically unique for OneToOne
    ,
    __metadata("design:type", String)
], Transcript.prototype, "video_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Transcript.prototype, "transcript_content", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transcript.prototype, "model_used", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transcript.prototype, "tone_version", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Transcript.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Video_1.Video, video => video.transcript, { onDelete: "CASCADE" }) // Add CASCADE delete here if desired
    ,
    (0, typeorm_1.JoinColumn)({ name: "video_id" }) // Map 'video_id' column to the Video entity
    ,
    __metadata("design:type", Video_1.Video)
], Transcript.prototype, "video", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Summary_1.Summary, summary => summary.transcript, { onDelete: "CASCADE" }),
    __metadata("design:type", Summary_1.Summary)
], Transcript.prototype, "summary", void 0);
exports.Transcript = Transcript = __decorate([
    (0, typeorm_1.Entity)()
], Transcript);
