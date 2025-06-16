// src/entity/Summary.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Transcript } from "./Transcript";

@Entity()
export class Summary {
  @PrimaryGeneratedColumn("uuid")
  id!: string; // Primary key, auto-generated UUID

  @Column({ type: "uuid" })
  transcript_id!: string; // Foreign key column for Transcript

  @Column({ type: "text" })
  summary_text!: string; // The generated summary text

  @Column({ type: "text" })
  summary_type!: string; // The generated summary text

  @Column({ nullable: true })
  model_used?: string; // Model used for summary generation (e.g., 'GPT-3.5', 'BART')

  @Column({ nullable: true })
  tone_version?: string; // Version/details about the tone analysis model used (if applicable to summary)

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date; // Timestamp when the summary was generated

  // --- Relationships ---

  // One-to-One relationship with Transcript: One Summary belongs to one Transcript
  // This is the owning side, as it holds the foreign key 'transcript_id'
  @OneToOne(() => Transcript, transcript => transcript.summary)
  @JoinColumn({ name: "transcript_id" }) // Map 'transcript_id' column to the Transcript entity
  transcript!: Transcript; // The Transcript entity associated with this summary
}