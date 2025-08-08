// Extra Commands for LEGACY XMD
const config = require('../../config');
const { formatTime, formatBytes } = require('../utils/botUtils');

async function handleStats(sock, from) {
    try {
        const uptime = process.uptime();
        const memUsage = process.memoryUsage();
        
        const stats = `
📊 *LEGACY XMD Statistics*

🤖 *Bot Information:*
• Name: ${config.botName}
• Version: ${config.version}
• Owner: ${config.owner.name}

⏱️ *Runtime Information:*
• Uptime: ${formatTime(uptime)}
• Memory Usage: ${formatBytes(memUsage.heapUsed)}
• Total Memory: ${formatBytes(memUsage.heapTotal)}

🛠️ *System Information:*
• Node.js: ${process.version}
• Platform: ${process.platform}
• Architecture: ${process.arch}

🔧 *Feature Status:*
• Anti Delete: ${config.features.antidelete ? '✅' : '❌'}
• Anti View Once: ${config.features.antiviewonce ? '✅' : '❌'}
• Auto Record: ${config.features.autorecord ? '✅' : '❌'}
• Auto React Status: ${config.features.autoreactstatus ? '✅' : '❌'}
• Auto Type: ${config.features.autotype ? '✅' : '❌'}
• APK Search: ${config.features.apksearch ? '✅' : '❌'}
• YT Download: ${config.features.ytdownload ? '✅' : '❌'}
• AI Chat: ${config.features.aichat ? '✅' : '❌'}

📞 *Support:* +${config.owner.number}`;

        await sock.sendMessage(from, { text: stats });
        
    } catch (error) {
        console.error('Stats command error:', error);
        await sock.sendMessage(from, { text: '❌ Could not retrieve statistics.' });
    }
}

async function handleAbout(sock, from) {
    try {
        const about = `
ℹ️ *About LEGACY XMD*

🤖 *LEGACY XMD* is the ultimate WhatsApp bot designed for automation, entertainment, and utility. Built with the latest Baileys library, this bot offers a comprehensive set of features to enhance your WhatsApp experience.

👑 *Created by:* ${config.owner.name}
📱 *Contact:* +${config.owner.number}
🌟 *Version:* ${config.version}

🚀 *Key Features:*
• Advanced message protection (Anti-delete, Anti-view once)
• Smart automation (Auto-typing, Auto-recording, Status reactions)
• Media downloads (YouTube audio/video, APK search)
• AI-powered conversations
• Group management tools
• Owner control panel

🔗 *Deployment Options:*
• Render.com
• Railway.app
• Heroku
• VPS/Dedicated servers

📋 *Requirements:*
• Node.js 18+
• Valid WhatsApp session
• Internet connection

⚡ *Performance:*
• Fast response times
• Lightweight resource usage
• 24/7 uptime capability
• Multi-group support

🛡️ *Security:*
• Secure session management
• Owner-only admin commands
• Privacy-focused design
• No data logging

💡 *Getting Started:*
1. Fork the GitHub repository
2. Configure your session ID in config.js
3. Deploy to your preferred platform
4. Enjoy automated WhatsApp features!

🆘 *Need Help?*
Contact the owner at +${config.owner.number} for support, custom features, or deployment assistance.

Made with ❤️ by ${config.owner.name}`;

        await sock.sendMessage(from, { text: about });
        
    } catch (error) {
        console.error('About command error:', error);
        await sock.sendMessage(from, { text: '❌ Could not retrieve information.' });
    }
}

module.exports = { handleStats, handleAbout };