import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Video } from './Video'; // Your existing Video entity

@Entity()
@Index(['videoId', 'startTimeOffsetSeconds']) // Index for faster queries
export class GeospatialCommand {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: "uuid" }) // Assuming video_id in Video entity is uuid
  videoId!: string; // This column holds the foreign key value

  @ManyToOne(() => Video, video => video.geospatialCommands)
  @JoinColumn({ name: 'videoId' }) // This links to the videoId column in this table
  video!: Video;

  @Column()
  commandType!: string; // "move", "place_marker", etc.

  @Column('float')
  startTimeOffsetSeconds!: number;

  @Column('float', { nullable: true })
  endTimeOffsetSeconds!: number | null;

  @Column('jsonb') // Use 'jsonb' for PostgreSQL, 'json' for MySQL/MariaDB
  commandData!: Record<string, any>; // Store as JSON object

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  generatedAt!: Date;
}