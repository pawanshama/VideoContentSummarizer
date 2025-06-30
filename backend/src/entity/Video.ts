// src/entity/Video.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany,JoinColumn } from "typeorm"; // Removed JoinColumn from import
import { User } from "./User";
import { Transcript } from "./Transcript";
import { UsageLog } from "./UsageLog";

@Entity()
export class Video {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  user_id!: string;

  @Column()
  video_id!: string; // This stores Cloudinary's public_id (unique identifier)

  @Column()
  title!: string;

  @Column({ nullable: true, type: "text" })
  description?: string;

  @Column()
  storage_url!: string; // Stores the Cloudinary secure_url for direct access

  @Column({ nullable: true })
  original_filename?: string; // Original filename from client

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  duration_seconds?: number; // Duration of the video in seconds

  @Column({ default: 'uploaded' })
  processing_status!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;


  // --- Relationships ---

  @ManyToOne(() => User, user => user.videos)
  @JoinColumn({ name: "user_id" })
  user!: User;

  // -------------------------------------------------------------------
  // IMPORTANT FIX HERE: This is the NON-OWNING side for the OneToOne relationship with Transcript.
  // It should NOT have @JoinColumn. It only points to the inverse property on Transcript.
  // -------------------------------------------------------------------
  @OneToOne(() => Transcript, transcript => transcript.video) // Removed { onDelete: "CASCADE" } here, it goes on the owning side
  transcript!: Transcript; // The Transcript entity associated with this video

  @OneToMany(() => UsageLog, usageLog => usageLog.video)
  usageLogs?: UsageLog[];
}