"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// src/data-source.ts
require("reflect-metadata"); // This MUST be the very first line
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Import all your entities here
const User_1 = require("./entity/User");
const Video_1 = require("./entity/Video");
const Transcript_1 = require("./entity/Transcript");
const Summary_1 = require("./entity/Summary");
const UsageLog_1 = require("./entity/UsageLog");
const UserSettings_1 = require("./entity/UserSettings");
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"), // Ensure port is parsed as number
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // IMPORTANT: Set to false in production and use migrations!
    logging: ["query", "error"], // Log database queries and errors for debugging
    entities: [
        User_1.User,
        Video_1.Video,
        Transcript_1.Transcript,
        Summary_1.Summary,
        UsageLog_1.UsageLog,
        UserSettings_1.UserSettings // List all your entities here so TypeORM knows about them
    ],
    migrations: [], // You'll use this for production database schema management
    subscribers: [], // For TypeORM event subscribers
});
