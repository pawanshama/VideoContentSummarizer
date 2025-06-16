// // src/entity/Transcript.ts
// import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
// import { Video } from "./Video";
// import { Summary } from "./Summary";

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
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Video } from "./Video";
import { Summary } from "./Summary";

@Entity()
export class Transcript {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", unique: true }) // video_id is the foreign key, and typically unique for OneToOne
  video_id!: string; // Foreign key column for Video

  @Column({ type: "text" })
  transcript_content!: string;

  @Column({ nullable: true })
  model_used?: string;

  @Column({ nullable: true })
  tone_version?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  // --- Relationships ---

  // -------------------------------------------------------------------
  // IMPORTANT FIX HERE: This is the OWNING side for the OneToOne relationship with Video.
  // It HAS the foreign key 'video_id' and uses @JoinColumn.
  // We can add onDelete: "CASCADE" here if deleting a Video should delete its Transcript.
  // -------------------------------------------------------------------
  @OneToOne(() => Video, video => video.transcript, { onDelete: "CASCADE" }) // Add CASCADE delete here if desired
  @JoinColumn({ name: "video_id" }) // Map 'video_id' column to the Video entity
  video!: Video;

  @OneToOne(() => Summary, summary => summary.transcript, { onDelete: "CASCADE" })
  summary!: Summary;
}