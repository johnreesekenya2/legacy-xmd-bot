// LEGACY XMD Bot Configuration
// Created by John Reese

const config = {
    // Bot Information
    botName: "LEGACY XMD",
    version: "1.0.0",
    
    // Owner Information
    owner: {
        name: "John Reese",
        number: process.env.OWNER_NUMBER || "254745282166",
        prefix: (process.env.OWNER_NUMBER || "254745282166") + "@s.whatsapp.net"
    },
    
    // Session Configuration
    sessionId: process.env.SESSION_ID || "LEGACY-XMD~6MFwnTzR#YG0tLwmhTtpkGCBvhSWDoftSMcZ6cnu7NUK-2XVQ488",
    
    // Bot Features Toggle
    features: {
        antidelete: true,
        antiviewonce: true,
        autorecord: true,
        autoreactstatus: true,
        autotype: true,
        apksearch: true,
        ytdownload: true,
        aichat: true,
        autoReply: true,
        groupManagement: true,
        mediaDownload: true
    },
    
    // Bot Behavior
    prefix: ".",
    autoRead: true,
    autoTyping: true,
    autoRecording: false,
    
    // API Keys (Add your keys here)
    apiKeys: {
        youtube: process.env.YOUTUBE_API_KEY || "", // For YouTube downloads
        openai: process.env.OPENAI_API_KEY || "", // For AI chat
        gemini: process.env.GEMINI_API_KEY || "", // Alternative AI
    },
    
    // Messages
    messages: {
        loading: "⏳ *LEGACY XMD* is loading...",
        sessionActive: "✅ *Active session loaded successfully!*\n🤖 *LEGACY XMD* is now online!",
        sessionInvalid: "❌ Invalid session ID. Please provide a valid session.",
        ownerOnly: "❌ This command is only for the owner.",
        groupOnly: "❌ This command can only be used in groups.",
        privateOnly: "❌ This command can only be used in private chat.",
        error: "❌ An error occurred. Please try again later."
    },
    
    // Anti-Delete Settings
    antidelete: {
        enabled: true,
        saveMedia: true,
        notifyGroup: true
    },
    
    // Auto React Status Settings
    statusReact: {
        enabled: true,
        emojis: ["❤️", "👍", "🔥", "😍", "💯", "⚡"],
        delay: 2000 // 2 seconds delay
    }
};

module.exports = config;