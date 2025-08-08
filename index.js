// LEGACY XMD - WhatsApp Bot
// Created by John Reese
// Powered by Baileys

const { makeWASocket, DisconnectReason, useMultiFileAuthState, downloadContentFromMessage, isJidBroadcast } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const config = require('./config');
const { handleMessage } = require('./src/messageHandler');
const { setupAntiDelete } = require('./src/features/antidelete');
const { setupAutoReactStatus } = require('./src/features/autoReactStatus');
const { setupAntiViewOnce } = require('./src/features/antiviewonce');
const { initializeBot } = require('./src/utils/botUtils');
const { initializeSession, hasValidSession } = require('./src/utils/sessionUtils');

let sock;
let isConnected = false;

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
    // First validate session ID
    if (!config.sessionId || !config.sessionId.startsWith('LEGACY-XMD~')) {
        console.log(chalk.red('❌ Invalid session ID format!'));
        console.log(chalk.yellow('⚠️  Session ID must start with "LEGACY-XMD~"'));
        console.log(chalk.cyan('💡 Please provide a valid session ID in config.js'));
        return;
    }
    
    console.log(chalk.green('✅ Session ID validated: ' + config.sessionId.substring(0, 20) + '...'));
    
    // Try to initialize session from session ID
    console.log(chalk.blue('🔄 Checking for existing session...'));
    
    const hasSession = await hasValidSession();
    if (!hasSession) {
        console.log(chalk.yellow('⚠️  No valid session found, attempting to initialize...'));
        const sessionInitialized = await initializeSession();
        if (!sessionInitialized) {
            console.log(chalk.red('❌ Failed to create session configuration'));
            console.log(chalk.yellow('⚠️  Check session ID format and try again'));
            return;
        } else {
            console.log(chalk.green('✅ Session configured for direct connection (No QR)'));
            console.log(chalk.cyan('🔄 Bot will attempt direct WhatsApp connection'));
        }
    } else {
        console.log(chalk.green('📱 Valid session found, attempting connection...'));
    }
    
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    console.log(chalk.blue('🔄 Connecting to WhatsApp...'));
    
    const logger = {
        info: () => {},
        error: () => {},
        warn: () => {},
        debug: () => {},
        trace: () => {},
        child: () => logger,
        level: 'silent'
    };

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: logger,
        browser: ['LEGACY XMD', 'Chrome', '1.0.0'],
        generateHighQualityLinkPreview: true,
        markOnlineOnConnect: true,
        defaultQueryTimeoutMs: 60000,
        qrTimeout: 0, // Disable QR timeout
        connectTimeoutMs: 30000,
        emitOwnEvents: false
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom) &&
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            
            console.log(chalk.red('❌ Connection closed due to:'), lastDisconnect?.error);
            
            if (shouldReconnect) {
                console.log(chalk.yellow('🔄 Reconnecting in 5 seconds...'));
                setTimeout(connectToWhatsApp, 5000);
            } else {
                console.log(chalk.red('❌ Connection failed - session needs authentication'));
                console.log(chalk.cyan('📱 Deploy to live server for proper WhatsApp pairing'));
                console.log(chalk.yellow('💡 Local development may have connection restrictions'));
            }
        } else if (connection === 'open') {
            isConnected = true;
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
            console.log(chalk.red('❌ QR generation should be disabled - session ID should handle connection'));
            console.log(chalk.yellow('⚠️  This indicates session format needs adjustment for direct connection'));
        }
    });

    sock.ev.on('creds.update', saveCreds);
    
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