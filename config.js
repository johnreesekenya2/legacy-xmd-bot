// LEGACY XMD Bot Configuration
// Created by John Reese

const config = {
    // Bot Information
    botName: "LEGACY XMD",
    version: "1.0.0",
    
    // Owner Information
    owner: {
        name: "John Reese",
        number: "254745282166",
        prefix: "254745282166@s.whatsapp.net"
    },
    
    // Session Configuration
    sessionId: "LEGACY-XMD~6MFwnTzR#YG0tLwmhTtpkGCBvhSWDoftSMcZ6cnu7NUK-2XVQ488",
    
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
        youtube: "", // For YouTube downloads
        openai: "", // For AI chat
        gemini: "", // Alternative AI
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