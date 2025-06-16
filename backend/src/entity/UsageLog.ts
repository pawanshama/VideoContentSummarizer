// src/entity/UsageLog.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Video } from "./Video";

@Entity()
export class UsageLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string; // Primary key, auto-generated UUID

  @Column({ type: "uuid" })
  user_id!: string; // Foreign key column for User

  @Column({ type: "uuid", nullable: true })
  video_id?: string; // Foreign key column for Video (optional, as not all events are video-specific)

  @Column()
  event_type!: string; // Type of event (e.g., 'video_upload', 'summary_generated', 'api_call')

  @Column({ type: "jsonb", nullable: true })
  event_details?: object; // Additional details about the event in JSON format

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date; // Timestamp when the log entry was created

  // --- Relationships ---

  // Many-to-One relationship with User: Many UsageLogs belong to one User
  @ManyToOne(() => User, user => user.usageLogs)
  @JoinColumn({ name: "user_id" }) // Map 'user_id' column to the User entity
  user!: User; // The User entity associated with this log entry

  // Many-to-One relationship with Video: Many UsageLogs can belong to one Video (optional)
  @ManyToOne(() => Video, video => video.usageLogs, { nullable: true })
  @JoinColumn({ name: "video_id" }) // Map 'video_id' column to the Video entity
  video?: Video; // The Video entity associated with this log entry (optional)
}