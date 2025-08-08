// Bot Utilities for LEGACY XMD
const config = require('../../config');
const chalk = require('chalk');

// Check if user is the owner
function isOwner(userNumber) {
    return userNumber === config.owner.number;
}

// Extract command and arguments from message
function extractCommand(body) {
    const args = body.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    return { command, args };
}

// Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Format time
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

// Get random element from array
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Validate session ID
function validateSessionId(sessionId) {
    if (!sessionId) return false;
    if (!sessionId.startsWith('LEGACY-XMD~')) return false;
    if (sessionId.length < 20) return false;
    return true;
}

// Initialize bot features
async function initializeBot(sock) {
    console.log(chalk.blue('🔄 Initializing LEGACY XMD features...'));
    
    // Send startup message to owner
    if (config.owner.number) {
        try {
            const startupMessage = `
🚀 *LEGACY XMD Started Successfully!*

✅ Bot is now online and active
🤖 All features are operational
⏰ Started at: ${new Date().toLocaleString()}

🛡️ *Active Features:*
${config.features.antidelete ? '✅' : '❌'} Anti Delete
${config.features.antiviewonce ? '✅' : '❌'} Anti View Once  
${config.features.autorecord ? '✅' : '❌'} Auto Record
${config.features.autoreactstatus ? '✅' : '❌'} Auto React Status
${config.features.autotype ? '✅' : '❌'} Auto Type
${config.features.apksearch ? '✅' : '❌'} APK Search
${config.features.ytdownload ? '✅' : '❌'} YouTube Download
${config.features.aichat ? '✅' : '❌'} AI Chat

🔧 Bot ready to serve users!`;

            await sock.sendMessage(config.owner.prefix, { text: startupMessage });
            console.log(chalk.green('📱 Startup notification sent to owner'));
            
        } catch (error) {
            console.log(chalk.yellow('⚠️ Could not send startup notification to owner'));
        }
    }
    
    console.log(chalk.green('✅ LEGACY XMD initialization complete!'));
}

// Log bot activity
function logActivity(type, details) {
    const timestamp = new Date().toLocaleString();
    const logMessage = `[${timestamp}] ${type}: ${details}`;
    
    console.log(chalk.cyan(logMessage));
    
    // You can extend this to write to file if needed
    // fs.appendFileSync('bot.log', logMessage + '\n');
}

// Format file size
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Check if message is from group
function isGroup(jid) {
    return jid.includes('@g.us');
}

// Get sender from message
function getSender(message) {
    return message.key.participant || message.key.remoteJid;
}

// Clean phone number
function cleanPhoneNumber(number) {
    return number.replace(/[^0-9]/g, '');
}

module.exports = {
    isOwner,
    extractCommand,
    delay,
    formatTime,
    getRandomElement,
    validateSessionId,
    initializeBot,
    logActivity,
    formatBytes,
    isGroup,
    getSender,
    cleanPhoneNumber
};