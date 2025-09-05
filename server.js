import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from 'cors';

import seoRoutes from './routes/seoRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
// import themeRoutes from './routes/themeRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import listingRoutes from './routes/listingRoutes.js'
import agentRoutes from './routes/agentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
// import userRoutes from './routes/userRoutes.js';

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

const app = express();

// Configure CORS to allow requests from frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON parsing middleware with error handling
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.error('Invalid JSON received:', e.message);
      res.status(400).json({ 
        error: 'Invalid JSON format',
        message: 'The request body contains invalid JSON'
      });
      throw new Error('Invalid JSON');
    }
  }
}));

// Error handling middleware for JSON parsing errors
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('❌ JSON parsing error:', error.message);
    return res.status(400).json({
      error: 'Invalid JSON format',
      message: 'The request body contains invalid JSON'
    });
  }
  next(error);
});


app.get('/',(req, res)=>{
  res.send("backend Working Fine")
})

// Test endpoint for authentication
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});
// Routes
app.use('/api', authRoutes);
app.use('/api', seoRoutes);
app.use('/api', pageRoutes);
// app.use('/api', themeRoutes);
app.use('/api', blogRoutes);
app.use('/api', newsRoutes);
app.use('/api', eventRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api', agentRoutes);

app.use("/api/employee", employeeRoutes);

// app.use('/api', userRoutes);
app.use('/uploads', express.static('uploads')); // serve images

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server even if MongoDB is not available (for testing)
const startServer = () => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
};

// Try to connect to MongoDB, but don't fail if it's not available
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
      startServer();
    })
    .catch((err) => {
      console.warn('MongoDB connection failed, starting server without database:', err.message);
      console.log('Note: Authentication features will not work without database connection');
      startServer();
    });
} else {
  console.log('No MongoDB URI provided, starting server without database');
  startServer();
}

  