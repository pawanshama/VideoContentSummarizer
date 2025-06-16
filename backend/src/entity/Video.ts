// // src/entity/Video.ts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn } from "typeorm";
// import { User } from "./User";
// import { Transcript } from "./Transcript";
// import { UsageLog } from "./UsageLog"; // Import UsageLog for inverse relationship

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