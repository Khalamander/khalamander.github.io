# 🧪 Deployment Testing Guide

## Frontend Testing
1. **Visit**: `https://khalamander.github.io`
2. **Check**: All sections load properly
3. **Test**: Particle simulation works
4. **Test**: Hammer/anvil demo works
5. **Test**: Smooth scrolling navigation

## Backend Testing
1. **Health Check**: `https://your-railway-url.up.railway.app/api/health`
2. **Should return**: `{"status":"OK","timestamp":"...","uptime":...}`

## Contact Form Testing
1. **Fill out contact form** on your live site
2. **Check your email** for notification
3. **Verify** form shows success message

## Troubleshooting

### If Frontend doesn't load:
- Check GitHub Pages settings
- Wait 5-10 minutes for deployment
- Check browser console for errors

### If Backend doesn't work:
- Check Railway deployment logs
- Verify environment variables are set
- Test health endpoint first

### If Email doesn't work:
- Check Gmail app password is correct
- Verify EMAIL_USER and EMAIL_PASS in Railway
- Check Railway logs for email errors

## URLs to Test
- **Frontend**: https://khalamander.github.io
- **Backend Health**: https://portfolio-backend-production.up.railway.app/api/health
- **Contact API**: https://portfolio-backend-production.up.railway.app/api/contact
