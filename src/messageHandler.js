// Message Handler for LEGACY XMD
const config = require('../config');
const { getMenuMessage } = require('./commands/menu.js');
// Anti-delete is handled in features, not commands
const { handleYTDownload } = require('./commands/ytdownload.js');
const { handleAIChat } = require('./commands/aichat.js');
const { handleApkSearch } = require('./commands/apksearch.js');
const { handleStats, handleAbout } = require('./commands/extra.js');
const { isOwner, extractCommand, delay } = require('./utils/botUtils.js');

async function handleMessage(sock, message) {
    try {
        if (!message.message) return;
        
        const from = message.key.remoteJid;
        const body = message.message.conversation || 
                    message.message.extendedTextMessage?.text || '';
        
        const isGroup = from.includes('@g.us');
        const sender = isGroup ? message.key.participant : from;
        const senderNumber = sender.split('@')[0];
        
        // Auto-typing feature
        if (config.features.autotype && body) {
            await sock.sendPresenceUpdate('composing', from);
            await delay(1000);
            await sock.sendPresenceUpdate('available', from);
        }
        
        // Auto-recording feature for voice messages
        if (config.features.autorecord && message.message.audioMessage) {
            await sock.sendPresenceUpdate('recording', from);
            await delay(2000);
            await sock.sendPresenceUpdate('available', from);
        }
        
        // Check if message starts with prefix
        if (!body.startsWith(config.prefix)) return;
        
        const { command, args } = extractCommand(body);
        
        console.log(`Command received: ${command} from ${senderNumber}`);
        
        // Command handling
        switch (command) {
            case 'menu':
            case 'help':
                await sock.sendMessage(from, { text: getMenuMessage() });
                break;
                
            case 'ping':
                const start = Date.now();
                const msg = await sock.sendMessage(from, { text: '🏓 Pinging...' });
                const end = Date.now();
                await sock.sendMessage(from, { 
                    text: `🏓 Pong!\n⚡ Response Time: ${end - start}ms\n🤖 Bot: LEGACY XMD\n👑 Owner: ${config.owner.name}`,
                    edit: msg.key
                });
                break;
                
            case 'alive':
                await sock.sendMessage(from, { 
                    text: `✅ *LEGACY XMD is Active!*\n\n🤖 *Bot Name:* ${config.botName}\n📱 *Version:* ${config.version}\n👑 *Owner:* ${config.owner.name}\n⏰ *Uptime:* ${process.uptime().toFixed(2)}s\n🔥 *Status:* Online & Running!`
                });
                break;
                
            case 'owner':
                await sock.sendMessage(from, {
                    text: `👑 *Bot Owner Information*\n\n📱 *Name:* ${config.owner.name}\n📞 *Number:* +${config.owner.number}\n🤖 *Bot:* ${config.botName} v${config.version}`
                });
                break;
                
            // YouTube Download
            case 'yt':
            case 'ytmp3':
            case 'ytmp4':
                if (config.features.ytdownload) {
                    await handleYTDownload(sock, from, args, command);
                } else {
                    await sock.sendMessage(from, { text: '❌ YouTube download feature is disabled.' });
                }
                break;
                
            // AI Chat
            case 'ai':
            case 'gpt':
            case 'chat':
                if (config.features.aichat) {
                    await handleAIChat(sock, from, args.join(' '));
                } else {
                    await sock.sendMessage(from, { text: '❌ AI chat feature is disabled.' });
                }
                break;
                
            // APK Search
            case 'apk':
            case 'apksearch':
                if (config.features.apksearch) {
                    await handleApkSearch(sock, from, args.join(' '));
                } else {
                    await sock.sendMessage(from, { text: '❌ APK search feature is disabled.' });
                }
                break;
                
            // Owner only commands
            case 'restart':
                if (isOwner(senderNumber)) {
                    await sock.sendMessage(from, { text: '🔄 Restarting LEGACY XMD...' });
                    process.exit(0);
                } else {
                    await sock.sendMessage(from, { text: config.messages.ownerOnly });
                }
                break;
                
            case 'settings':
                if (isOwner(senderNumber)) {
                    const settings = `⚙️ *LEGACY XMD Settings*\n\n` +
                        `🛡️ *Anti Delete:* ${config.features.antidelete ? '✅' : '❌'}\n` +
                        `👁️ *Anti View Once:* ${config.features.antiviewonce ? '✅' : '❌'}\n` +
                        `🎤 *Auto Record:* ${config.features.autorecord ? '✅' : '❌'}\n` +
                        `❤️ *Auto React Status:* ${config.features.autoreactstatus ? '✅' : '❌'}\n` +
                        `⌨️ *Auto Type:* ${config.features.autotype ? '✅' : '❌'}\n` +
                        `📱 *APK Search:* ${config.features.apksearch ? '✅' : '❌'}\n` +
                        `🎵 *YT Download:* ${config.features.ytdownload ? '✅' : '❌'}\n` +
                        `🤖 *AI Chat:* ${config.features.aichat ? '✅' : '❌'}`;
                    
                    await sock.sendMessage(from, { text: settings });
                } else {
                    await sock.sendMessage(from, { text: config.messages.ownerOnly });
                }
                break;
                
            case 'stats':
                if (isOwner(senderNumber)) {
                    await handleStats(sock, from);
                } else {
                    await sock.sendMessage(from, { text: config.messages.ownerOnly });
                }
                break;
                
            case 'about':
            case 'info':
                await handleAbout(sock, from);
                break;
                
            default:
                await sock.sendMessage(from, { 
                    text: `❌ Unknown command: *${command}*\n\nType *.menu* to see available commands.`
                });
        }
        
    } catch (error) {
        console.error('Error handling message:', error);
        await sock.sendMessage(from, { text: config.messages.error });
    }
}

module.exports = { handleMessage };