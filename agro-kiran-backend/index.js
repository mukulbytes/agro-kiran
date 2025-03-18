import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-production-domain.com'
    : ['http://localhost:5173', 'http://localhost:3000'], // Allow both ports in development
  credentials: true
}));

// Security Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' })); // Body size limit

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Error handling
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
