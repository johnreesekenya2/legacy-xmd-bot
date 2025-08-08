// Auto React to Status Feature for LEGACY XMD
const config = require('../../config');

function setupAutoReactStatus(sock) {
    sock.ev.on('messages.upsert', async (m) => {
        try {
            if (m.messages && m.messages[0]) {
                const message = m.messages[0];
                const from = message.key.remoteJid;
                
                // Check if it's a status update
                if (from === 'status@broadcast') {
                    const sender = message.key.participant;
                    const senderNumber = sender.split('@')[0];
                    
                    // Don't react to owner's status
                    if (senderNumber === config.owner.number) return;
                    
                    // Random delay to make it seem natural
                    const delay = Math.random() * config.statusReact.delay + 1000;
                    
                    setTimeout(async () => {
                        try {
                            // Pick random emoji from configured list
                            const randomEmoji = config.statusReact.emojis[
                                Math.floor(Math.random() * config.statusReact.emojis.length)
                            ];
                            
                            // React to the status
                            await sock.sendMessage(from, {
                                react: {
                                    text: randomEmoji,
                                    key: message.key
                                }
                            });
                            
                            console.log(`✅ Auto-reacted to ${senderNumber}'s status with ${randomEmoji}`);
                            
                        } catch (error) {
                            console.error('Error reacting to status:', error);
                        }
                    }, delay);
                }
            }
        } catch (error) {
            console.error('Error in auto-react status feature:', error);
        }
    });
    
    console.log('✅ Auto-React Status feature activated');
}

module.exports = { setupAutoReactStatus };