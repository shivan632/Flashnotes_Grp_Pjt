import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './src/config/supabase.js';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './src/routes/auth.js';
import notesRoutes from './src/routes/notes.js';
import historyRoutes from './src/routes/history.js';
import aiRoutes from './src/routes/ai.js';
import quizRoutes from './src/routes/quiz.js';
import scoreRoutes from './src/routes/score.js';
import feedbackRoutes from './src/routes/feedback.js';
import pdfRoutes from './src/routes/pdf.js';
import profileRoutes from './src/routes/profile.js';
import roadmapRoutes from './src/routes/roadmap.js';
import notesGenRoutes from './src/routes/notesGenRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ============= CORS CONFIGURATION =============
const allowedOrigins = [
    'https://flashnotes-grp-pjt-1t3z.vercel.app',
    'https://flashnotes-grp-pjt.onrender.com',
    'http://localhost:3000',
    'http://localhost:10000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:10000'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('⚠️ Blocked origin:', origin);
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
}));

// ============= RATE LIMITING =============
app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: { error: 'Too many requests. Please try again later.' },
    validate: { xForwardedForHeader: false },
    skip: (req) => {
        return req.path === '/api/health';
    }
});

app.use('/api', limiter);

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://cdn.jsdelivr.net", "https://www.gstatic.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https:", "data:", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://sgrprgcsvyyhqluwtszz.supabase.co", "https://openrouter.ai", "https://*.googleapis.com", "https://*.firebaseio.com"],
        }
    }
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ============= SERVE STATIC FILES (FRONTEND) =============
const frontendPath = path.join(__dirname, '../frontend');
console.log(`📁 Frontend path: ${frontendPath}`);

app.use(express.static(frontendPath));

// ============= API ROUTES =============
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);           // Old notes routes
app.use('/api/notes-gen', notesGenRoutes);    // ✅ NEW: Notes Generator routes (separate path)
app.use('/api/history', historyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/user', profileRoutes);
app.use('/api/roadmap', roadmapRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Flashnotes API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// ============= SPA ROUTING =============
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({
            success: false,
            message: `Route not found: ${req.method} ${req.path}`
        });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
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
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Frontend path: ${frontendPath}`);
    console.log(`🌐 Open: http://localhost:${PORT} to view the app\n`);
    
    await testConnection();
});

export default app;