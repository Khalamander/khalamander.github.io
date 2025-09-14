# Portfolio Backend

Backend server for handling contact form submissions with email notifications and database storage.

## Features

- ✅ Contact form submission handling
- ✅ SQLite database storage
- ✅ Email notifications
- ✅ Input validation and sanitization
- ✅ Rate limiting (5 submissions per 15 minutes per IP)
- ✅ Security headers and CORS protection
- ✅ Admin endpoint for viewing submissions

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:8000

# Email Configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NOTIFICATION_EMAIL=your-email@gmail.com

# Admin Configuration
ADMIN_KEY=your-secure-admin-key-here
```

### 3. Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `EMAIL_PASS`

### 4. Run the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### POST /api/contact
Submit a contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to work with you!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your message! I'll get back to you soon.",
  "submissionId": 123
}
```

### GET /api/health
Health check endpoint.

### GET /api/admin/submissions
View all submissions (requires admin key in header).

**Headers:**
```
X-Admin-Key: your-secure-admin-key-here
```

## Database Schema

The SQLite database stores submissions in the `contact_submissions` table:

```sql
CREATE TABLE contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'new'
);
```

## Security Features

- **Rate Limiting**: 5 submissions per 15 minutes per IP
- **Input Validation**: Email format, length limits, required fields
- **Input Sanitization**: XSS protection with validator.escape()
- **CORS Protection**: Only allows requests from configured frontend URL
- **Security Headers**: Helmet.js for security headers
- **SQL Injection Protection**: Parameterized queries

## Deployment

### Local Development
1. Run backend: `npm run dev`
2. Run frontend: Open `index.html` in browser or use a local server

### Production Deployment

#### Option 1: Heroku
1. Create Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy with Git

#### Option 2: VPS/Cloud Server
1. Set up Node.js environment
2. Install PM2 for process management
3. Configure reverse proxy (Nginx)
4. Set up SSL certificate

#### Option 3: Railway/Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `EMAIL_USER` | Email address for sending | Yes |
| `EMAIL_PASS` | Email password/app password | Yes |
| `NOTIFICATION_EMAIL` | Email to receive notifications | No (defaults to EMAIL_USER) |
| `ADMIN_KEY` | Admin key for viewing submissions | Yes |

## Troubleshooting

### Email Not Sending
- Check email credentials
- Verify app password is correct
- Check spam folder
- Ensure 2FA is enabled

### Database Issues
- Check file permissions
- Ensure SQLite is installed
- Verify database path

### CORS Issues
- Update FRONTEND_URL in environment
- Check frontend is making requests to correct backend URL

## Monitoring

The server includes:
- Health check endpoint
- Error logging
- Request logging
- Database connection monitoring

Check logs for any issues and monitor the health endpoint for uptime.
