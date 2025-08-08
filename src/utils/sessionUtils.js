
// Session Utilities for LEGACY XMD
const fs = require('fs-extra');
const path = require('path');
const config = require('../../config');

function parseSessionString(sessionId) {
    // Remove LEGACY-XMD~ prefix
    const sessionData = sessionId.replace('LEGACY-XMD~', '');
    
    try {
        // Split on # if present
        const parts = sessionData.split('#');
        const mainData = parts[0];
        
        // Try base64 decode
        const decoded = Buffer.from(mainData, 'base64').toString('utf-8');
        const parsed = JSON.parse(decoded);
        return parsed;
    } catch {
        try {
            // Try direct JSON parse
            return JSON.parse(sessionData);
        } catch {
            // Return raw session data for manual processing
            return { rawData: sessionData };
        }
    }
}

function createSessionFromId() {
    const sessionData = config.sessionId.replace('LEGACY-XMD~', '');
    const parts = sessionData.split('#');
    const sessionKey = parts[0];
    
    // Create proper session structure using the session key
    return {
        creds: {
            noiseKey: {
                private: Buffer.from(sessionKey.substring(0, 32), 'base64'),
                public: Buffer.from(sessionKey.substring(32, 64), 'base64')
            },
            signedIdentityKey: {
                private: Buffer.from(sessionKey.substring(64, 96), 'base64'),
                public: Buffer.from(sessionKey.substring(96, 128), 'base64')
            },
            signedPreKey: {
                keyPair: {
                    private: Buffer.from(sessionKey.substring(128, 160), 'base64'),
                    public: Buffer.from(sessionKey.substring(160, 192), 'base64')
                },
                signature: Buffer.from(sessionKey.substring(192, 256), 'base64'),
                keyId: 1
            },
            registrationId: parseInt(sessionKey.substring(256, 264), 16) || Math.floor(Math.random() * 16777215) + 1,
            advSecretKey: sessionKey.substring(0, 32),
            processedHistoryMessages: [],
            nextPreKeyId: 31,
            firstUnuploadedPreKeyId: 31,
            accountSyncCounter: 0,
            accountSettings: {
                unarchiveChats: false
            },
            me: {
                id: config.owner.number + '@s.whatsapp.net',
                name: config.owner.name
            },
            platform: 'web',
            lastAccountSyncTimestamp: Date.now(),
            registered: true // Mark as registered to prevent QR
        },
        keys: {
            preKeys: {},
            sessions: {},
            senderKeys: {},
            appStateSyncKeys: {},
            appStateVersions: {},
            senderKeyMemory: {}
        }
    };
}

async function initializeSession() {
    const sessionDir = './session';
    await fs.ensureDir(sessionDir);
    
    if (!config.sessionId || !config.sessionId.startsWith('LEGACY-XMD~')) {
        throw new Error('Invalid session ID format. Must start with LEGACY-XMD~');
    }
    
    try {
        // Create session from existing session ID
        const sessionData = createSessionFromId();
        
        // Write credentials
        await fs.writeJson(path.join(sessionDir, 'creds.json'), sessionData.creds);
        
        // Write keys
        await fs.writeJson(path.join(sessionDir, 'keys.json'), sessionData.keys);
        
        console.log('✅ Session created from existing session ID');
        return true;
    } catch (error) {
        console.log('❌ Error creating session:', error.message);
        return false;
    }
}

async function hasValidSession() {
    const sessionDir = './session';
    const credsFile = path.join(sessionDir, 'creds.json');
    
    try {
        if (await fs.pathExists(credsFile)) {
            const creds = await fs.readJson(credsFile);
            return creds && creds.registered === true;
        }
        return false;
    } catch {
        return false;
    }
}

module.exports = {
    initializeSession,
    hasValidSession,
    parseSessionString
};
