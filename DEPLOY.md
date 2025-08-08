# LEGACY XMD Bot - Deployment Guide

## Quick Deploy to Render

### Step 1: Fork Repository
1. Fork this repository to your GitHub account
2. Note your GitHub username and repository name

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the deployment:

**Basic Settings:**
- Name: `legacy-xmd-bot`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `node index.js`

**Environment Variables:**
```
SESSION_ID=LEGACY-XMD~6MFwnTzR#YG0tLwmhTtpkGCBvhSWDoftSMcZ6cnu7NUK-2XVQ488
OWNER_NUMBER=254745282166
NODE_ENV=production
```

### Step 3: Complete Pairing
1. After deployment, check the logs
2. Look for QR code or pairing instructions
3. Scan QR code with your WhatsApp
4. Bot will become active immediately

## Alternative: Railway Deployment

### One-Click Deploy
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yourusername/legacy-xmd)

### Manual Railway Deploy
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add environment variables:
   - `SESSION_ID`: Your session string
   - `OWNER_NUMBER`: Your phone number
4. Deploy and check logs for pairing

## Heroku Deployment

### Using Heroku CLI
```bash
git clone <your-repo-url>
cd legacy-xmd
heroku create your-bot-name
heroku config:set SESSION_ID="LEGACY-XMD~6MFwnTzR#YG0tLwmhTtpkGCBvhSWDoftSMcZ6cnu7NUK-2XVQ488"
heroku config:set OWNER_NUMBER="254745282166"
git push heroku main
heroku logs --tail
```

## VPS/Server Deployment

### Using PM2 (Recommended)
```bash
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone and setup
git clone <your-repo-url>
cd legacy-xmd
npm install

# Set environment variables
export SESSION_ID="LEGACY-XMD~6MFwnTzR#YG0tLwmhTtpkGCBvhSWDoftSMcZ6cnu7NUK-2XVQ488"
export OWNER_NUMBER="254745282166"

# Start with PM2
pm2 start index.js --name "legacy-xmd"
pm2 logs legacy-xmd
```

## Docker Deployment

### Build and Run
```bash
docker build -t legacy-xmd .
docker run -d --name legacy-xmd-bot \
  -e SESSION_ID="LEGACY-XMD~6MFwnTzR#YG0tLwmhTtpkGCBvhSWDoftSMcZ6cnu7NUK-2XVQ488" \
  -e OWNER_NUMBER="254745282166" \
  legacy-xmd

docker logs -f legacy-xmd-bot
```

## Post-Deployment Steps

### 1. Monitor Logs
Always check deployment logs to see:
- Session validation
- QR code generation
- Connection status
- Pairing confirmation

### 2. Test Basic Commands
Once connected, test with:
- `.ping` - Check response
- `.menu` - View commands
- `.alive` - Bot status

### 3. Configure Optional Features
Add API keys for enhanced features:
```bash
# For AI chat
OPENAI_API_KEY=your-openai-key

# For enhanced YouTube downloads  
YOUTUBE_API_KEY=your-youtube-key
```

## Troubleshooting

### Connection Issues
- **QR Not Appearing**: Check logs for pairing instructions
- **Connection Fails**: Ensure environment variables are set
- **Bot Offline**: Restart service and check logs

### Command Issues
- **No Response**: Verify owner number is correct
- **Commands Not Working**: Check prefix (.) and spelling
- **Permissions Error**: Ensure you're the configured owner

### Platform-Specific
- **Render**: Check build logs if deployment fails
- **Railway**: Verify environment variables in dashboard
- **Heroku**: Use `heroku logs --tail` for real-time logs
- **VPS**: Check PM2 status with `pm2 status`

## Success Indicators

✅ **Deployment Successful When You See:**
```
✅ Session ID validated: LEGACY-XMD~...
🔄 Connecting to WhatsApp...
📱 QR Code generated for session: ...
✅ Connected to WhatsApp successfully!
🤖 LEGACY XMD Bot is now active
```

## Support

**Need Help?**
- Check logs first
- Verify all environment variables
- Ensure session ID format is correct
- Contact: +254745282166 (John Reese)

**Common Success Flow:**
1. Deploy → 2. Check Logs → 3. Scan QR → 4. Bot Active → 5. Test Commands

---

**LEGACY XMD** - Deploy once, enjoy forever! 🚀