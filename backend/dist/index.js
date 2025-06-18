"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
require("reflect-metadata"); // KEEP THIS AS THE VERY FIRST LINE
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const data_source_1 = require("./data-source");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const video_routes_1 = __importDefault(require("./routes/video.routes")); // New: Import video routes
const userSettings_routes_1 = __importDefault(require("./routes/userSettings.routes")); // New: Import user settings routes
const cors_1 = __importDefault(require("cors"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
// Middleware
app.use(express_1.default.json()); // For parsing application/json
app.use(express_1.default.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded (for multer non-file fields)
// --- Routes ---
app.get('/', (req, res) => {
    res.send('Welcome to the Video Summarizer Backend!');
});
app.use('/api/users', user_routes_1.default);
app.use('/api/videos', video_routes_1.default); // New: Register video routes
app.use('/api/settings', userSettings_routes_1.default); // New: Register user settings routes
// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error("Global Error Handler caught an error:");
    console.error(err.stack);
    res.status(500).send('Something broke on the server!');
});
// --- Initialize Database and Start Server ---
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized successfully!");
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("FATAL ERROR: Could not initialize Data Source:", error);
    // In a real application, you might want to exit the process here
    // process.exit(1);
});
