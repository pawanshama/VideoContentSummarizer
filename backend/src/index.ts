// src/index.ts
import "reflect-metadata"; // KEEP THIS AS THE VERY FIRST LINE
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { AppDataSource } from './data-source';
import userRoutes from './routes/user.routes';
import videoRoutes from './routes/video.routes'; // New: Import video routes
import userSettingsRoutes from './routes/userSettings.routes'; // New: Import user settings routes
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pdfRoutes from "./routes/features.routes"

// ✅ Add this before any route/middleware that needs cookies
// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // ✅ Allow credentials (cookies)
}));
app.use(cookieParser());

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded (for multer non-file fields)

// --- Routes ---
app.get('/', (req, res) => {
  res.send('Welcome to the Video Summarizer Backend!');
});

app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes); // New: Register video routes
app.use('/api/settings', userSettingsRoutes); // New: Register user settings routes
app.use("/api/summary",pdfRoutes);

// --- Global Error Handler ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Error Handler caught an error:");
  console.error(err.stack);
  res.status(500).send('Something broke on the server!');
});


// --- Initialize Database and Start Server ---
AppDataSource.initialize()
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