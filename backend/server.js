const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many contact form submissions from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/contact', limiter);

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize SQLite database
const db = new sqlite3.Database('./contact_submissions.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS contact_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'new'
        )`);
    }
});

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail', // or your preferred email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email template
const createEmailTemplate = (submission) => {
    return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${submission.name}</p>
    <p><strong>Email:</strong> ${submission.email}</p>
    <p><strong>Message:</strong></p>
    <p>${submission.message.replace(/\n/g, '<br>')}</p>
    <hr>
    <p><small>Submitted on: ${new Date(submission.created_at).toLocaleString()}</small></p>
    <p><small>IP Address: ${submission.ip_address}</small></p>
    `;
};

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const ip_address = req.ip || req.connection.remoteAddress;
        const user_agent = req.get('User-Agent');

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        if (name.length < 2 || name.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Name must be between 2 and 100 characters'
            });
        }

        if (message.length < 10 || message.length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Message must be between 10 and 1000 characters'
            });
        }

        // Sanitize inputs
        const sanitizedName = validator.escape(name.trim());
        const sanitizedEmail = validator.normalizeEmail(email.trim());
        const sanitizedMessage = validator.escape(message.trim());

        // Insert into database
        const stmt = db.prepare(`
            INSERT INTO contact_submissions (name, email, message, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?)
        `);

        stmt.run([sanitizedName, sanitizedEmail, sanitizedMessage, ip_address, user_agent], function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to save submission'
                });
            }

            const submissionId = this.lastID;
            const submission = {
                id: submissionId,
                name: sanitizedName,
                email: sanitizedEmail,
                message: sanitizedMessage,
                ip_address,
                user_agent,
                created_at: new Date().toISOString()
            };

            // Send email notification
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
                subject: `New Contact Form Submission from ${sanitizedName}`,
                html: createEmailTemplate(submission)
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Email error:', error);
                    // Don't fail the request if email fails
                } else {
                    console.log('Email sent:', info.messageId);
                }
            });

            res.json({
                success: true,
                message: 'Thank you for your message! I\'ll get back to you soon.',
                submissionId: submissionId
            });
        });

        stmt.finalize();

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Admin endpoint to view submissions (optional - for your own use)
app.get('/api/admin/submissions', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    
    if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    db.all('SELECT * FROM contact_submissions ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
