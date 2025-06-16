// src/data-source.ts
import "reflect-metadata"; // This MUST be the very first line
import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import path from 'path';

// Import all your entities here
import { User } from "./entity/User";
import { Video } from "./entity/Video";
import { Transcript } from "./entity/Transcript";
import { Summary } from "./entity/Summary";
import { UsageLog } from "./entity/UsageLog";
import { UserSettings } from "./entity/UserSettings";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"), // Ensure port is parsed as number
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // IMPORTANT: Set to false in production and use migrations!
  logging: ["query", "error"], // Log database queries and errors for debugging
  entities: [
    User,
    Video,
    Transcript,
    Summary,
    UsageLog,
    UserSettings // List all your entities here so TypeORM knows about them
  ],
  migrations: [], // You'll use this for production database schema management
  subscribers: [], // For TypeORM event subscribers
});