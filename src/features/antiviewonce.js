// Anti View Once Feature for LEGACY XMD
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs-extra');
const path = require('path');
const config = require('../../config');

function setupAntiViewOnce(sock) {
    sock.ev.on('messages.upsert', async (m) => {
        try {
            if (m.messages && m.messages[0]) {
                const message = m.messages[0];
                const from = message.key.remoteJid;
                
                // Check for view once messages
                if (message.message?.imageMessage?.viewOnce || 
                    message.message?.videoMessage?.viewOnce) {
                    
                    if (!config.features.antiviewonce) return;
                    
                    const sender = message.pushName || message.key.participant?.split('@')[0] || 'Unknown';
                    const senderNumber = message.key.participant?.split('@')[0] || from.split('@')[0];
                    const isGroup = from.includes('@g.us');
                    
                    let mediaType = '';
                    let caption = '';
                    
                    if (message.message.imageMessage?.viewOnce) {
                        mediaType = 'Image';
                        caption = message.message.imageMessage.caption || '';
                    } else if (message.message.videoMessage?.viewOnce) {
                        mediaType = 'Video';
                        caption = message.message.videoMessage.caption || '';
                    }
                    
                    const antiViewOnceMsg = `
👁️ *ANTI-VIEW ONCE ACTIVATED* 👁️

📸 *Media Type:* ${mediaType}
👤 *Sender:* ${sender}
📱 *Number:* +${senderNumber}
⏰ *Captured at:* ${new Date().toLocaleString()}
${isGroup ? `👥 *Group:* ${from}` : ''}
${caption ? `📝 *Caption:* ${caption}` : ''}

⚠️ *Note:* This view once media was captured by LEGACY XMD's anti-view once feature.`;

                    try {
                        // Send notification
                        await sock.sendMessage(from, { text: antiViewOnceMsg });
                        
                        // Try to download and resend the media
                        try {
                            let mediaMessage = message.message.imageMessage || message.message.videoMessage;
                            
                            if (mediaMessage) {
                                const stream = await downloadContentFromMessage(mediaMessage, mediaType.toLowerCase());
                                let buffer = Buffer.from([]);
                                
                                for await (const chunk of stream) {
                                    buffer = Buffer.concat([buffer, chunk]);
                                }
                                
                                // Send the captured media
                                if (mediaType === 'Image') {
                                    await sock.sendMessage(from, { 
                                        image: buffer,
                                        caption: `📸 *View Once Image Captured*\n${caption ? `Original caption: ${caption}` : ''}`
                                    });
                                } else if (mediaType === 'Video') {
                                    await sock.sendMessage(from, { 
                                        video: buffer,
                                        caption: `🎬 *View Once Video Captured*\n${caption ? `Original caption: ${caption}` : ''}`
                                    });
                                }
                            }
                            
                        } catch (downloadError) {
                            console.error('Error downloading view once media:', downloadError);
                            await sock.sendMessage(from, { 
                                text: '❌ Could not download the view once media. The content might be too large or expired.' 
                            });
                        }
                        
                        console.log(`Anti-view once activated for ${mediaType} from ${sender}`);
                        
                    } catch (error) {
                        console.error('Error in anti-view once feature:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Error in anti-view once feature:', error);
        }
    });
    
    console.log('✅ Anti-View Once feature activated');
}

module.exports = { setupAntiViewOnce };