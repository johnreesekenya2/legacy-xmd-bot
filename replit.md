# LEGACY XMD - WhatsApp Bot Project

## Overview

LEGACY XMD is a comprehensive WhatsApp bot built with Node.js and the latest Baileys library. The bot features advanced automation capabilities, media downloading, AI chat integration, and sophisticated message handling features. Created by John Reese with session ID support and deployment-ready configuration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Bot Architecture
- **Node.js Backend**: Built on Node.js 20+ with modern ES6+ features
- **Baileys Library**: Uses @whiskeysockets/baileys for WhatsApp Web API integration
- **Modular Design**: Organized in separate modules for commands, features, and utilities
- **Session Management**: Secure session handling with multi-file auth state

### Core Features
- **Anti-Delete Protection**: Automatically captures and forwards deleted messages
- **Anti-View Once**: Saves view once media before expiration
- **Auto-Features**: Auto-typing, auto-recording, auto-status reactions
- **Media Downloads**: YouTube audio/video downloads, APK search
- **AI Integration**: OpenAI chat functionality with fallback responses
- **Owner Controls**: Special admin commands for bot management

### File Structure
```
legacy-xmd/
├── config.js              # Bot configuration and settings
├── index.js               # Main bot initialization and connection
├── src/
│   ├── commands/           # Command handlers
│   │   ├── menu.js        # Beautiful menu display
│   │   ├── ytdownload.js  # YouTube download functionality
│   │   ├── aichat.js      # AI chat integration
│   │   ├── apksearch.js   # APK search feature
│   │   └── extra.js       # Stats and about commands
│   ├── features/          # Automated features
│   │   ├── antidelete.js  # Anti-delete message protection
│   │   ├── antiviewonce.js # View once media protection
│   │   └── autoReactStatus.js # Auto status reactions
│   ├── utils/             # Utility functions
│   │   └── botUtils.js    # Helper functions and validations
│   └── messageHandler.js  # Main message processing logic
├── session/               # WhatsApp session data (auto-generated)
├── package.json          # Dependencies and scripts
├── README.md             # Comprehensive documentation
└── Deployment files      # Dockerfile, render.yaml, .env.example
```

## External Dependencies

### Core Dependencies
- **@whiskeysockets/baileys**: Latest WhatsApp Web API library
- **chalk**: Terminal styling and colored output
- **fs-extra**: Enhanced file system operations
- **axios**: HTTP client for API requests
- **ytdl-core**: YouTube download functionality
- **qrcode-terminal**: QR code generation for pairing
- **node-cron**: Scheduled tasks support
- **express**: Web server framework (optional)

### API Services
- **OpenAI API**: AI chat functionality (optional)
- **YouTube API**: Enhanced download features (optional)
- **APK APIs**: Application search services (configurable)

### Session Configuration
- **Session ID Format**: `LEGACY-XMD~[unique-session-string]`
- **Owner Number**: +254745282166 (John Reese)
- **Multi-device Support**: Full Baileys multi-device implementation

## Deployment Options

### Supported Platforms
- **Render.com**: Primary deployment platform with render.yaml config
- **Railway.app**: Alternative hosting with easy GitHub integration
- **Heroku**: Classic hosting platform support
- **VPS/Dedicated**: Full server deployment with Docker support

### Environment Variables
- `SESSION_ID`: WhatsApp session identifier (required)
- `OWNER_NUMBER`: Bot owner phone number (required)
- `OPENAI_API_KEY`: AI chat functionality (optional)
- `YOUTUBE_API_KEY`: Enhanced YouTube features (optional)

## Recent Changes

- ✅ Complete WhatsApp bot implementation with Baileys
- ✅ Comprehensive command system with beautiful menu
- ✅ Advanced anti-delete and anti-view once features
- ✅ YouTube download and APK search functionality
- ✅ AI chat integration with OpenAI API support
- ✅ Auto-features for typing, recording, and status reactions
- ✅ Owner control panel with settings and statistics
- ✅ Multi-platform deployment configuration
- ✅ Complete documentation and setup guides
- ✅ Fixed session handling logic - checks session ID first, no QR by default
- ✅ Proper connection flow - validates LEGACY-XMD~ format correctly
- ✅ Ready for deployment with user's session ID: LEGACY-XMD~6MFwnTzR#...
- ✅ All features tested and working in development environment