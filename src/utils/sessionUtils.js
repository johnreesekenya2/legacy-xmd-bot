
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

function generateRandomKey(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function createSessionFromId() {
    const sessionData = config.sessionId.replace('LEGACY-XMD~', '');
    
    try {
        // Try to decode as base64 JSON
        const decoded = Buffer.from(sessionData, 'base64').toString('utf-8');
        const parsed = JSON.parse(decoded);
        return parsed;
    } catch {
        // If that fails, try direct JSON parsing
        try {
            return JSON.parse(sessionData);
        } catch {
            // If both fail, return null to use normal auth flow
            console.log('⚠️  Session ID format not recognized, will use standard auth');
            return null;
        }
    }
}

async function initializeSession() {
    const sessionDir = './session';
    await fs.ensureDir(sessionDir);
    
    if (!config.sessionId || !config.sessionId.startsWith('LEGACY-XMD~')) {
        console.log('⚠️  No valid session ID provided');
        return false;
    }
    
    try {
        // Try to parse the session data
        const sessionData = createSessionFromId();
        
        if (!sessionData) {
            console.log('⚠️  Could not parse session ID, will use normal pairing');
            return false;
        }
        
        // If we have valid session data, write it
        if (sessionData.creds) {
            await fs.writeJson(path.join(sessionDir, 'creds.json'), sessionData.creds);
        }
        
        if (sessionData.keys) {
            await fs.writeJson(path.join(sessionDir, 'keys.json'), sessionData.keys);
        }
        
        console.log('✅ Session data imported from session ID');
        return true;
    } catch (error) {
        console.log('❌ Error importing session:', error.message);
        return false;
    }
}

async function hasValidSession() {
    const sessionDir = './session';
    const credsFile = path.join(sessionDir, 'creds.json');
    
    try {
        if (await fs.pathExists(credsFile)) {
            const creds = await fs.readJson(credsFile);
            return creds && (creds.registered === true || creds.isRegistered === true);
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
