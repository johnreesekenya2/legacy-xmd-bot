// Session Utilities for LEGACY XMD
const fs = require('fs-extra');
const path = require('path');
const config = require('../../config');

function parseSessionString(sessionId) {
    // Remove LEGACY-XMD~ prefix
    const sessionData = sessionId.replace('LEGACY-XMD~', '');
    
    try {
        // Try base64 decode first
        const decoded = Buffer.from(sessionData, 'base64').toString('utf-8');
        return JSON.parse(decoded);
    } catch {
        try {
            // Try URL-safe base64
            const urlSafe = sessionData.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = Buffer.from(urlSafe, 'base64').toString('utf-8');
            return JSON.parse(decoded);
        } catch {
            // Return null if can't decode - session likely needs fresh pairing
            return null;
        }
    }
}

function createMinimalSession() {
    // Create a minimal session structure that prevents QR generation
    // This forces the bot to use session-based authentication only
    return {
        creds: {
            noiseKey: {
                private: Buffer.alloc(32),
                public: Buffer.alloc(32)
            },
            signedIdentityKey: {
                private: Buffer.alloc(32), 
                public: Buffer.alloc(32)
            },
            signedPreKey: {
                keyPair: {
                    private: Buffer.alloc(32),
                    public: Buffer.alloc(32)
                },
                signature: Buffer.alloc(64),
                keyId: 1
            },
            registrationId: Math.floor(Math.random() * 16777215) + 1,
            advSecretKey: config.sessionId.replace('LEGACY-XMD~', '').substring(0, 32),
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
            registered: false // This prevents QR generation
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
        // Create minimal session that prevents QR generation
        const minimalSession = createMinimalSession();
        await fs.writeJson(path.join(sessionDir, 'creds.json'), minimalSession.creds);
        
        console.log('✅ Session configured for direct connection (No QR)');
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
            return creds && Object.keys(creds).length > 0;
        }
        return false;
    } catch {
        return false;
    }
}

module.exports = {
    initializeSession,
    hasValidSession
};