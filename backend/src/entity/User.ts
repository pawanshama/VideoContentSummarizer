// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { Video } from "./Video";
import { UsageLog } from "./UsageLog";
import { UserSettings } from "./UserSettings";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string; // Primary key, auto-generated UUID

  @Column()
  name!: string; // User's full name

  @Column({ unique: true })
  email!: string; // User's email, must be unique

  @Column()
  password_hash!: string; // Hashed password

  @Column({ nullable: true })
  subscription?: string; // User's subscription plan (e.g., 'free', 'premium') - nullable as per ERD

  @Column({ nullable: true })
  status?: string; // User's status (e.g., 'active', 'inactive', 'suspended') - nullable as per ERD

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date; // Timestamp when the user account was created

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at!: Date; // Timestamp of the last update to user data


  // --- Relationships ---

  // One-to-Many relationship with Video: One User can have many Videos
  @OneToMany(() => Video, video => video.user)
  videos!: Video[]; // Array of Video entities associated with this user

  // One-to-Many relationship with UsageLog: One User can have many UsageLogs
  @OneToMany(() => UsageLog, usageLog => usageLog.user)
  usageLogs!: UsageLog[]; // Array of UsageLog entities associated with this user

  // One-to-One relationship with UserSettings: One User has one UserSettings
  // This is the non-owning side, so no @JoinColumn here.
  @OneToOne(() => UserSettings, userSettings => userSettings.user)
  userSettings!: UserSettings; // The UserSettings entity associated with this user
}