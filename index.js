// LEGACY XMD - WhatsApp Bot
// Created by John Reese
// Powered by Baileys

const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, downloadContentFromMessage, isJidBroadcast } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const express = require('express');
const config = require('./config');
const { handleMessage } = require('./src/messageHandler');
const { setupAntiDelete } = require('./src/features/antidelete');
const { setupAutoReactStatus } = require('./src/features/autoReactStatus');
const { setupAntiViewOnce } = require('./src/features/antiviewonce');
const { initializeBot } = require('./src/utils/botUtils');

let sock;
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
let lastConnectionAttempt = 0;

// Simple health check server for Render
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        connected: isConnected, 
        timestamp: new Date().toISOString(),
        bot: config.botName,
        version: config.version
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: `${config.botName} WhatsApp Bot is running`,
        status: isConnected ? 'Connected' : 'Disconnected',
        version: config.version
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(chalk.blue(`🌐 Health check server running on port ${PORT}`));
});

console.log(chalk.cyan(`
██╗     ███████╗ ██████╗  █████╗  ██████╗██╗   ██╗    ██╗  ██╗███╗   ███╗██████╗ 
██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝╚██╗ ██╔╝    ╚██╗██╔╝████╗ ████║██╔══██╗
██║     █████╗  ██║  ███╗███████║██║      ╚████╔╝      ╚███╔╝ ██╔████╔██║██║  ██║
██║     ██╔══╝  ██║   ██║██╔══██║██║       ╚██╔╝       ██╔██╗ ██║╚██╔╝██║██║  ██║
███████╗███████╗╚██████╔╝██║  ██║╚██████╗   ██║       ██╔╝ ██╗██║ ╚═╝ ██║██████╔╝
╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝       ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝ 

                          ${chalk.green('LEGACY XMD v1.0.0')}
                      ${chalk.yellow('Created by John Reese')}
                      ${chalk.blue('Powered by Baileys')}
`));

async function connectToWhatsApp() {
    // Rate limiting - ensure minimum time between connection attempts
    const now = Date.now();
    const minInterval = 15000; // 15 seconds minimum between attempts
    const timeSinceLastAttempt = now - lastConnectionAttempt;
    
    if (timeSinceLastAttempt < minInterval && lastConnectionAttempt > 0) {
        const waitTime = minInterval - timeSinceLastAttempt;
        console.log(chalk.yellow(`⏳ Waiting ${Math.ceil(waitTime/1000)} more seconds before connection attempt...`));
        setTimeout(connectToWhatsApp, waitTime);
        return;
    }
    
    lastConnectionAttempt = now;
    
    console.log(chalk.blue('🔄 Initializing WhatsApp connection...'));
    console.log(chalk.green('✅ Attempting connection...'));

    try {
        // Use standard Baileys auth state management
        const { state, saveCreds } = await useMultiFileAuthState('./session');
        console.log(chalk.blue('🔄 Connecting to WhatsApp (session will be created if needed)...'));

        // Simplified logger that's less verbose
        const logger = {
            level: 'silent',
            info: () => {},
            error: () => {},
            warn: () => {},
            debug: () => {},
            trace: () => {},
            child: () => logger
        };

        // Create socket without forcing session
        sock = makeWASocket({
            auth: state,
            printQRInTerminal: false, // No QR code as requested
            logger,
            browser: ['LEGACY-XMD', 'Desktop', '4.2.0'],
            generateHighQualityLinkPreview: false,
            markOnlineOnConnect: false,
            syncFullHistory: false,
            shouldSyncHistoryMessage: () => false,
            shouldIgnoreJid: jid => isJidBroadcast(jid),
            getMessage: async (key) => {
                return { conversation: "Hello!" };
            },
            mobile: false,
            emitOwnEvents: false,
            // Enable pairing code instead of QR
            qrTimeout: 0,
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 60000
        });
        
        // Save credentials when updated
        sock.ev.on('creds.update', saveCreds);
        
        // Connection update handler
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (connection === 'close') {
                isConnected = false;
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const errorMessage = lastDisconnect?.error?.message || 'Unknown error';
                
                console.log(chalk.red('❌ Connection closed due to:'), errorMessage);
                console.log(chalk.yellow(`📊 Status Code: ${statusCode}`));

                // Check if we should reconnect based on the error type
                const shouldReconnect = (lastDisconnect?.error instanceof Boom) &&
                    statusCode !== DisconnectReason.loggedOut &&
                    reconnectAttempts < maxReconnectAttempts;

                if (shouldReconnect) {
                    reconnectAttempts++;
                    const delay = Math.min(5000 * reconnectAttempts, 30000); // Progressive backoff, max 30s
                    console.log(chalk.yellow(`🔄 Reconnecting in ${delay/1000} seconds... (Attempt ${reconnectAttempts}/${maxReconnectAttempts})`));
                    setTimeout(connectToWhatsApp, delay);
                } else {
                    if (reconnectAttempts >= maxReconnectAttempts) {
                        console.log(chalk.red('❌ Maximum reconnection attempts reached'));
                    } else {
                        console.log(chalk.red('❌ Connection failed - session needs authentication'));
                    }
                    console.log(chalk.cyan('📱 Check your SESSION_ID and try redeploying'));
                    console.log(chalk.yellow('💡 Ensure your session is valid and not expired'));
                }
            } else if (connection === 'open') {
                isConnected = true;
                reconnectAttempts = 0; // Reset reconnection attempts on successful connection
                console.log(chalk.green(config.messages.sessionActive));
                console.log(chalk.blue(`📱 Connected as: ${sock.user.name}`));
                console.log(chalk.green('✅ Bot is now active and ready!'));

                // Initialize bot features
                await initializeBot(sock);

                // Setup anti-delete feature
                if (config.features.antidelete) {
                    setupAntiDelete(sock);
                }

                // Setup anti-view once feature
                if (config.features.antiviewonce) {
                    setupAntiViewOnce(sock);
                }

                // Setup auto react to status
                if (config.features.autoreactstatus) {
                    setupAutoReactStatus(sock);
                }
            }

            if (qr) {
                console.log(chalk.red('❌ QR generation blocked - using session ID only'));
                console.log(chalk.yellow('⚠️  No QR code will be displayed as requested'));
                // Do not process QR at all
            }
        });

        // Handle incoming messages
        sock.ev.on('messages.upsert', async (m) => {
            if (m.messages && m.messages[0]) {
                await handleMessage(sock, m.messages[0]);
            }
        });

        // Handle message updates (for anti-delete)
        sock.ev.on('messages.update', (updates) => {
            for (const update of updates) {
                if (update.update.messageStubType === 68) { // Message deleted
                    // Handle deleted message
                    console.log(chalk.yellow('🗑️ Message deleted detected'));
                }
            }
        });
        
    } catch (error) {
        console.log(chalk.red('❌ Failed to initialize socket:'), error.message);
        setTimeout(connectToWhatsApp, 15000);
        return;
    }
}

// Start the bot
connectToWhatsApp().catch(err => {
    console.error(chalk.red('❌ Error starting bot:'), err);
});

process.on('uncaughtException', (err) => {
    console.error(chalk.red('❌ Uncaught Exception:'), err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk.red('❌ Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
});