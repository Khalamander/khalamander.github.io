# Full-Stack Portfolio Deployment Guide

This guide covers deploying both the frontend portfolio and the backend contact form system.

## 🏗️ Architecture Overview

- **Frontend**: Static HTML/CSS/JS (GitHub Pages)
- **Backend**: Node.js/Express API (Cloud hosting)
- **Database**: SQLite (file-based)
- **Email**: Nodemailer with Gmail

## 📁 Project Structure

```
Portfolio/
├── index.html              # Frontend portfolio
├── styles.css              # Frontend styles
├── script.js               # Frontend JavaScript
├── screenshots/            # Project screenshots
├── backend/                # Backend server
│   ├── server.js           # Express server
│   ├── package.json        # Backend dependencies
│   ├── env.example         # Environment template
│   └── README.md           # Backend documentation
└── DEPLOYMENT_FULLSTACK.md # This guide
```

## 🚀 Deployment Options

### Option 1: Heroku (Recommended for Backend)

#### Backend Deployment to Heroku

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create khaled-portfolio-backend
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   heroku config:set NOTIFICATION_EMAIL=your-email@gmail.com
   heroku config:set FRONTEND_URL=https://khalamander.github.io
   heroku config:set ADMIN_KEY=your-secure-admin-key
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

#### Frontend Deployment to GitHub Pages

1. **Update Backend URL in Frontend**
   ```javascript
   // In script.js, change:
   const response = await fetch('http://localhost:3000/api/contact', {
   // To:
   const response = await fetch('https://khaled-portfolio-backend.herokuapp.com/api/contact', {
   ```

2. **Deploy to GitHub Pages**
   - Push to `khalamander.github.io` repository
   - Enable GitHub Pages in repository settings

### Option 2: Railway (Alternative Backend)

1. **Connect GitHub Repository**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub account
   - Select your repository

2. **Configure Environment Variables**
   - Add all environment variables in Railway dashboard

3. **Deploy**
   - Railway automatically deploys on push

### Option 3: Render (Alternative Backend)

1. **Create New Web Service**
   - Go to [Render.com](https://render.com)
   - Connect GitHub repository
   - Choose "Web Service"

2. **Configure**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Add environment variables

## 🔧 Local Development Setup

### 1. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

### 2. Frontend Setup

```bash
# Open index.html in browser or use a local server
python -m http.server 8000
# Or
npx serve .
```

### 3. Test the Integration

1. Open frontend at `http://localhost:8000`
2. Fill out contact form
3. Check backend logs for submission
4. Check your email for notification

## 📧 Email Configuration

### Gmail Setup

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Security → 2-Step Verification

2. **Generate App Password**
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Use this password in `EMAIL_PASS`

3. **Alternative Email Services**
   - **SendGrid**: Professional email service
   - **Mailgun**: Developer-friendly
   - **AWS SES**: Amazon's email service

## 🔒 Security Considerations

### Production Security

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique passwords
   - Rotate admin keys regularly

2. **Rate Limiting**
   - Backend includes rate limiting (5 requests per 15 minutes)
   - Consider additional DDoS protection

3. **CORS Configuration**
   - Only allow your frontend domain
   - Update `FRONTEND_URL` for production

4. **Database Security**
   - SQLite is file-based (consider PostgreSQL for high traffic)
   - Regular backups recommended

## 📊 Monitoring and Maintenance

### Health Checks

- Backend health endpoint: `https://your-backend-url.com/api/health`
- Monitor uptime with services like UptimeRobot

### Logs

- Heroku: `heroku logs --tail`
- Railway: View in dashboard
- Render: View in dashboard

### Database Management

- View submissions: `GET /api/admin/submissions`
- Use admin key: `X-Admin-Key: your-admin-key`

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` environment variable
   - Ensure frontend URL matches exactly

2. **Email Not Sending**
   - Verify Gmail app password
   - Check spam folder
   - Test with different email service

3. **Database Errors**
   - Check file permissions
   - Verify SQLite installation
   - Check database path

4. **Form Not Submitting**
   - Check browser console for errors
   - Verify backend URL in frontend
   - Test with curl/Postman

### Testing Commands

```bash
# Test backend health
curl https://your-backend-url.com/api/health

# Test contact form
curl -X POST https://your-backend-url.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

## 🔄 Updates and Maintenance

### Updating Backend

1. Make changes to backend code
2. Test locally
3. Commit and push to trigger deployment

### Updating Frontend

1. Make changes to frontend files
2. Update backend URL if needed
3. Push to GitHub Pages repository

### Database Backups

```bash
# Download database from Heroku
heroku run cat contact_submissions.db > backup.db

# Or use Heroku Postgres for production
heroku addons:create heroku-postgresql:mini
```

## 📈 Scaling Considerations

### For High Traffic

1. **Database Upgrade**
   - Move from SQLite to PostgreSQL
   - Use connection pooling

2. **Caching**
   - Add Redis for session storage
   - Implement response caching

3. **Load Balancing**
   - Use multiple backend instances
   - Implement health checks

4. **CDN**
   - Use CloudFlare for frontend assets
   - Implement caching strategies

## 💰 Cost Estimation

### Free Tiers

- **GitHub Pages**: Free
- **Heroku**: Free tier (with limitations)
- **Railway**: Free tier available
- **Render**: Free tier available

### Paid Options

- **Heroku**: $7/month for hobby tier
- **Railway**: $5/month for starter
- **Render**: $7/month for starter

## 🎯 Next Steps

1. **Set up email notifications**
2. **Deploy backend to cloud**
3. **Update frontend with production URL**
4. **Deploy frontend to GitHub Pages**
5. **Test end-to-end functionality**
6. **Set up monitoring and alerts**

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review backend logs
3. Test API endpoints manually
4. Verify environment variables
5. Check email configuration

Remember to keep your environment variables secure and never commit them to version control!
