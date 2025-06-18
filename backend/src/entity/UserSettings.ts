// src/entity/UserSettings.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class UserSettings {
  @PrimaryGeneratedColumn("uuid")
  id!: string; // Primary key, auto-generated UUID

  @Column({ type: "uuid", unique: true }) // Foreign key column for User, must be unique for One-to-One
  user_id!: string;

  @Column({ default: 'concise' })
  default_summary_type!: string; // User's preferred summary style (e.g., 'concise', 'detailed')

  @Column({ default: 'hindi' })
  default_output_language!: string; // User's preferred language for generated outputs

  @Column({ type: 'boolean', default: false })
  auto_delete_original_video!: boolean; // Whether to auto-delete original video files after processing

  @Column({ type: 'jsonb', nullable: true })
  notification_preferences?: object; // JSON for notification settings (e.g., email, push, types)

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date; // Timestamp when the settings record was created

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at!: Date; // Timestamp of the last update to the settings

  // --- Relationships ---

  // One-to-One relationship with User: One UserSettings record belongs to one User
  // This is the owning side because it holds the foreign key (user_id)
  @OneToOne(() => User, user => user.userSettings, { onDelete: "CASCADE" }) // If a user is deleted, their settings should also be deleted
  @JoinColumn({ name: "user_id" }) // Map 'user_id' column to the User entity
  user!: User; // The User entity associated with these settings
}