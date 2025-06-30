
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