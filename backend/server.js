// backend/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection } from './src/config/supabase.js';

// Import routes
import authRoutes from './src/routes/auth.js';
import notesRoutes from './src/routes/notes.js';
import historyRoutes from './src/routes/history.js';
import aiRoutes from './src/routes/ai.js';
import quizRoutes from './src/routes/quiz.js';
import scoreRoutes from './src/routes/score.js';
import feedbackRoutes from './src/routes/feedback.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ============= CORS CONFIGURATION - FIX =============
const allowedOrigins = [
    'https://flashnotes-grp-pjt-1t3z.vercel.app',
    'https://flashnotes-grp-pjt.onrender.com',
    'http://localhost:3000',
    'http://localhost:10000',
    'http://127.0.0.1:3000'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('⚠️ Blocked origin:', origin);
            // For development, allow all origins
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
}));

// ============= RATE LIMITING - FIX (Increase limit) =============
app.set('trust proxy', 1);  // Trust first proxy (Render's load balancer)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests' },
    validate: { xForwardedForHeader: false }  // Disable this validation
});

// Apply rate limiting to API routes
app.use('/api', limiter);

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('  Origin:', req.headers.origin || 'none');
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check route (no rate limit)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Flashnotes API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// 404 handler
app.use((req, res) => {
    console.log(`⚠️ 404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.path}`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Allowed origins: ${allowedOrigins.join(', ')}`);
    
    // Test database connection
    await testConnection();
});

export default app;