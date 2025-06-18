"use strict";
// // src/entity/Video.ts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn } from "typeorm";
// import { User } from "./User";
// import { Transcript } from "./Transcript";
// import { UsageLog } from "./UsageLog"; // Import UsageLog for inverse relationship
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
exports.Video = void 0;
// @Entity()
// export class Video {
//  @PrimaryGeneratedColumn("uuid")
//   id!: string;
//   @Column({ type: "uuid" })
//   user_id!: string;
//   @Column()
//   video_id!: string; // This stores Cloudinary's public_id (unique identifier)
//   @Column()
//   title!: string;
//   @Column({ nullable: true, type: "text" })
//   description?: string;
//   @Column() // <--- THIS IS IT!
//   storage_url!: string; // Stores the Cloudinary secure_url for direct access
//   @Column({ nullable: true })
//   original_filename?: string; // Original filename from client
//   @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
//   duration_seconds?: number; // Duration of the video in seconds
//   @Column({ default: 'uploaded' }) // Status: 'uploaded', 'extracting_audio', 'transcribing', 'summarizing', 'completed', 'failed'
//   processing_status!: string;
//   @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
//   created_at!: Date;
//   // --- Relationships ---
//   // Many-to-One relationship with User: Many Videos belong to one User
//   // This is the owning side, so @JoinColumn is here to specify the foreign key
//   @ManyToOne(() => User, user => user.videos)
//   @JoinColumn({ name: "user_id" }) // Map 'user_id' column to the User entity
//   user!: User; // The User entity associated with this video
//   // One-to-One relationship with Transcript: One Video has one Transcript
//   // The @JoinColumn could be here or on Transcript. Placing it here makes Video the owning side.
//   // If Transcript must exist for a Video, consider { onDelete: "CASCADE" }
//   @OneToOne(() => Transcript, transcript => transcript.video, { onDelete: "CASCADE" })
//   @JoinColumn({ name: "transcript_id" }) // Assuming a transcript_id FK on Video for this relation
//   transcript!: Transcript; // The Transcript entity associated with this video
//   // One-to-Many relationship with UsageLog: One Video can have many UsageLogs
//   @OneToMany(() => UsageLog, usageLog => usageLog.video)
//   usageLogs?: UsageLog[]; // Array of UsageLog entities associated with this video (optional as video_id in UsageLog is nullable)
// }
// src/entity/Video.ts
const typeorm_1 = require("typeorm"); // Removed JoinColumn from import
const User_1 = require("./User");
const Transcript_1 = require("./Transcript");
const UsageLog_1 = require("./UsageLog");
let Video = class Video {
};
exports.Video = Video;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Video.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Video.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Video.prototype, "video_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Video.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    __metadata("design:type", String)
], Video.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Video.prototype, "storage_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Video.prototype, "original_filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Video.prototype, "duration_seconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'uploaded' }),
    __metadata("design:type", String)
], Video.prototype, "processing_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Video.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.videos),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], Video.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Transcript_1.Transcript, transcript => transcript.video) // Removed { onDelete: "CASCADE" } here, it goes on the owning side
    ,
    __metadata("design:type", Transcript_1.Transcript)
], Video.prototype, "transcript", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UsageLog_1.UsageLog, usageLog => usageLog.video),
    __metadata("design:type", Array)
], Video.prototype, "usageLogs", void 0);
exports.Video = Video = __decorate([
    (0, typeorm_1.Entity)()
], Video);
