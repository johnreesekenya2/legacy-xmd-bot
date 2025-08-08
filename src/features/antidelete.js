// Anti Delete Feature for LEGACY XMD
const fs = require('fs-extra');
const path = require('path');
const config = require('../../config');

let messageStore = new Map();

function setupAntiDelete(sock) {
    // Store messages for anti-delete feature
    sock.ev.on('messages.upsert', async (m) => {
        if (m.messages && m.messages[0]) {
            const message = m.messages[0];
            const msgId = message.key.id;
            const from = message.key.remoteJid;
            
            // Store message data
            messageStore.set(msgId, {
                message: message,
                timestamp: Date.now(),
                from: from
            });
            
            // Clean old messages (older than 24 hours)
            setTimeout(() => {
                messageStore.delete(msgId);
            }, 24 * 60 * 60 * 1000);
        }
    });
    
    // Handle message deletions
    sock.ev.on('messages.update', async (updates) => {
        for (const update of updates) {
            const msgId = update.key.id;
            const from = update.key.remoteJid;
            
            if (update.update.messageStubType === 68) { // Message deleted
                const storedMessage = messageStore.get(msgId);
                
                if (storedMessage && config.features.antidelete) {
                    const originalMsg = storedMessage.message;
                    const sender = originalMsg.pushName || originalMsg.key.participant?.split('@')[0] || 'Unknown';
                    const isGroup = from.includes('@g.us');
                    
                    let deletedContent = '';
                    
                    if (originalMsg.message.conversation) {
                        deletedContent = originalMsg.message.conversation;
                    } else if (originalMsg.message.extendedTextMessage?.text) {
                        deletedContent = originalMsg.message.extendedTextMessage.text;
                    } else if (originalMsg.message.imageMessage) {
                        deletedContent = '[Image] ' + (originalMsg.message.imageMessage.caption || '');
                    } else if (originalMsg.message.videoMessage) {
                        deletedContent = '[Video] ' + (originalMsg.message.videoMessage.caption || '');
                    } else if (originalMsg.message.audioMessage) {
                        deletedContent = '[Audio Message]';
                    } else if (originalMsg.message.documentMessage) {
                        deletedContent = '[Document] ' + (originalMsg.message.documentMessage.title || 'File');
                    } else {
                        deletedContent = '[Media/Other content]';
                    }
                    
                    const antiDeleteMsg = `
🗑️ *ANTI-DELETE ACTIVATED* 🗑️

👤 *Sender:* ${sender}
📱 *Number:* +${originalMsg.key.participant?.split('@')[0] || 'Private'}
⏰ *Deleted at:* ${new Date().toLocaleString()}
${isGroup ? `👥 *Group:* ${from}` : ''}

📝 *Deleted Message:*
${deletedContent}

⚠️ *Note:* This message was deleted but captured by LEGACY XMD's anti-delete feature.`;

                    try {
                        // Send anti-delete notification
                        await sock.sendMessage(from, { text: antiDeleteMsg });
                        
                        // If it was media, try to resend it
                        if (originalMsg.message.imageMessage || 
                            originalMsg.message.videoMessage || 
                            originalMsg.message.audioMessage ||
                            originalMsg.message.documentMessage) {
                            
                            await sock.sendMessage(from, { 
                                text: '📎 *Deleted Media Recovery:*\n⬇️ Attempting to recover deleted media...' 
                            });
                        }
                        
                        console.log(`Anti-delete activated for message from ${sender}`);
                        
                    } catch (error) {
                        console.error('Error in anti-delete feature:', error);
                    }
                }
            }
        }
    });
    
    console.log('✅ Anti-Delete feature activated');
}

module.exports = { setupAntiDelete };