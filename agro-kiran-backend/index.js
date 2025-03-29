import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

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

// Rate limiting configuration
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// More lenient limiter for timestamp endpoints
const timestampLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60 // limit each IP to 60 requests per minute
});

// Apply rate limiting
app.use('/api', generalLimiter);
app.use(['/api/products/timestamp', '/api/users/cart/timestamp'], timestampLimiter);

app.use(express.json({ limit: '10kb' })); // Body size limit

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);

// Error handling
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
