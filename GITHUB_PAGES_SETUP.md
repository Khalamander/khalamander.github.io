# GitHub Pages Setup Guide

This guide will help you deploy your portfolio to GitHub Pages and connect it with the backend API.

## 🚀 **How It Works**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GitHub Pages  │───▶│   Your Backend   │───▶│   Your Email    │
│  (Frontend)     │    │   (Heroku/etc)   │    │  (Notifications)│
│ khalamander.io  │    │   API Server     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

- **Frontend**: Static files hosted on GitHub Pages (FREE)
- **Backend**: Node.js API hosted on cloud service (FREE tier available)
- **Database**: SQLite file stored on backend server
- **Email**: Automatic notifications when someone contacts you

## 📋 **Step-by-Step Deployment**

### **Step 1: Prepare GitHub Repository**

1. **Create Repository**
   ```bash
   # Create a new repository named exactly: khalamander.github.io
   # This is the magic name that GitHub Pages uses
   ```

2. **Clone and Setup**
   ```bash
   git clone https://github.com/Khalamander/khalamander.github.io.git
   cd khalamander.github.io
   ```

3. **Copy Your Files**
   ```bash
   # Copy all your portfolio files to this repository
   cp /path/to/your/portfolio/* ./
   ```

### **Step 2: Deploy Backend (Choose One)**

#### **Option A: Heroku (Recommended)**

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   ```

2. **Create Backend App**
   ```bash
   cd backend
   heroku create khaled-portfolio-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-gmail-app-password
   heroku config:set NOTIFICATION_EMAIL=your-email@gmail.com
   heroku config:set FRONTEND_URL=https://khalamander.github.io
   heroku config:set ADMIN_KEY=your-secure-admin-key
   ```

4. **Deploy Backend**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

#### **Option B: Railway (Alternative)**

1. Go to [Railway.app](https://railway.app)
2. Connect GitHub account
3. Deploy from your repository's `backend` folder
4. Set environment variables in Railway dashboard

### **Step 3: Update Frontend for Production**

The frontend is already configured to automatically detect the environment:

- **Local development**: Uses `http://localhost:3000`
- **GitHub Pages**: Uses your Heroku backend URL

### **Step 4: Deploy Frontend to GitHub Pages**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy portfolio to GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

3. **Wait for Deployment**
   - GitHub will build and deploy your site
   - Usually takes 1-2 minutes
   - Your site will be live at `https://khalamander.github.io`

## 🔧 **Configuration Details**

### **Frontend Configuration**

The JavaScript automatically detects the environment:

```javascript
// This code is already in your script.js
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const backendUrl = isLocal 
    ? 'http://localhost:3000/api/contact'           // Local development
    : 'https://khaled-portfolio-backend.herokuapp.com/api/contact';  // Production
```

### **Backend CORS Configuration**

The backend is configured to accept requests from GitHub Pages:

```javascript
// In backend/server.js
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true
}));
```

## 📧 **Email Setup (Gmail)**

1. **Enable 2-Factor Authentication**
   - Google Account → Security → 2-Step Verification

2. **Generate App Password**
   - Security → 2-Step Verification → App passwords
   - Select "Mail" → Generate
   - Use this password in `EMAIL_PASS`

3. **Test Email**
   - Submit a test form
   - Check your email for notification

## 🧪 **Testing Your Setup**

### **Local Testing**
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd ../
python -m http.server 8000

# Test at http://localhost:8000
```

### **Production Testing**
1. Visit `https://khalamander.github.io`
2. Fill out contact form
3. Check your email for notification
4. Check backend logs: `heroku logs --tail`

## 🔍 **Troubleshooting**

### **Common Issues**

1. **CORS Errors**
   ```
   Access to fetch at 'https://...' from origin 'https://khalamander.github.io' has been blocked by CORS policy
   ```
   **Solution**: Check `FRONTEND_URL` environment variable in backend

2. **Form Not Submitting**
   - Check browser console for errors
   - Verify backend URL is correct
   - Test backend health: `https://your-backend-url.com/api/health`

3. **Email Not Sending**
   - Verify Gmail app password
   - Check spam folder
   - Check backend logs for email errors

### **Debug Commands**

```bash
# Check backend health
curl https://khaled-portfolio-backend.herokuapp.com/api/health

# Test contact form
curl -X POST https://khaled-portfolio-backend.herokuapp.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'

# View backend logs
heroku logs --tail
```

## 📊 **Monitoring**

### **Backend Health**
- Health endpoint: `https://your-backend-url.com/api/health`
- Monitor with services like UptimeRobot

### **View Submissions**
```bash
# Get admin key from environment variables
curl -H "X-Admin-Key: your-admin-key" \
  https://your-backend-url.com/api/admin/submissions
```

## 🔄 **Updates and Maintenance**

### **Updating Frontend**
1. Make changes to HTML/CSS/JS
2. Commit and push to GitHub
3. GitHub Pages automatically redeploys

### **Updating Backend**
1. Make changes to backend code
2. Commit and push to Heroku
3. Backend automatically redeploys

## 💰 **Cost Breakdown**

- **GitHub Pages**: FREE
- **Heroku**: FREE (with limitations) or $7/month
- **Railway**: FREE tier available
- **Gmail**: FREE (for email notifications)

## 🎯 **Final Checklist**

- [ ] Repository named `khalamander.github.io`
- [ ] Backend deployed and environment variables set
- [ ] Frontend pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Contact form tested
- [ ] Email notifications working
- [ ] Screenshots added to `screenshots/` folder

## 🚀 **You're All Set!**

Once everything is deployed:
- **Portfolio**: `https://khalamander.github.io`
- **Contact Form**: Fully functional with email notifications
- **Backend API**: `https://your-backend-url.com`

Your portfolio will be live and professional, with a working contact form that sends you email notifications whenever someone reaches out!
