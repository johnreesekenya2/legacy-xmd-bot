# LEGACY XMD - WhatsApp Bot

<div align="center">

```
██╗     ███████╗ ██████╗  █████╗  ██████╗██╗   ██╗    ██╗  ██╗███╗   ███╗██████╗ 
██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝╚██╗ ██╔╝    ╚██╗██╔╝████╗ ████║██╔══██╗
██║     █████╗  ██║  ███╗███████║██║      ╚████╔╝      ╚███╔╝ ██╔████╔██║██║  ██║
██║     ██╔══╝  ██║   ██║██╔══██║██║       ╚██╔╝       ██╔██╗ ██║╚██╔╝██║██║  ██║
███████╗███████╗╚██████╔╝██║  ██║╚██████╗   ██║       ██╔╝ ██╗██║ ╚═╝ ██║██████╔╝
╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝       ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝ 
```

**The Ultimate WhatsApp Bot**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Baileys](https://img.shields.io/badge/Baileys-Latest-red.svg)](https://github.com/WhiskeySockets/Baileys)

</div>

## 📖 Overview

LEGACY XMD is a powerful, feature-rich WhatsApp bot built with the latest Baileys library. Created by **John Reese**, this bot offers advanced automation features, media downloading capabilities, AI chat integration, and much more!

## ✨ Features

### 🛡️ Auto Protection Features
- **Anti-Delete**: Automatically saves and forwards deleted messages
- **Anti-View Once**: Captures view once media before it disappears
- **Auto Record**: Shows recording indicator for voice messages
- **Auto React Status**: Automatically reacts to status updates
- **Auto Type**: Shows typing indicator during command processing

### 📥 Download Features
- **YouTube Downloader**: Download audio and video from YouTube
- **APK Search**: Search for Android applications
- **Media Recovery**: Recover deleted media files

### 🤖 AI & Chat Features
- **AI Chat**: Intelligent conversations using OpenAI
- **Smart Responses**: Context-aware automated replies
- **Command Recognition**: Natural language command processing

### 👑 Admin Features
- **Owner Controls**: Special commands for bot owner
- **Settings Management**: Configure bot features on-the-fly
- **Statistics**: Track bot usage and performance
- **Restart Function**: Remote bot restart capability

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- Valid WhatsApp session ID
- Internet connection

### Installation

1. **Fork this repository** or **download ZIP file**

2. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/legacy-xmd.git
   cd legacy-xmd
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure the bot**:
   - Open `config.js`
   - Add your session ID (must start with `LEGACY-XMD~`)
   - Configure your preferences and API keys

5. **Start the bot**:
   ```bash
   npm start
   ```

### 📱 Session Setup

Your session ID should follow this format:
```
LEGACY-XMD~[your-session-string]
```

Example:
```
LEGACY-XMD~6MFwnTzR#YG0tLwmhTtpkGCBvhSWDoftSMcZ6cnu7NUK-2XVQ488
```

## ⚙️ Configuration

Edit `config.js` to customize your bot:

```javascript
const config = {
    // Bot Information
    botName: "LEGACY XMD",
    
    // Owner Information
    owner: {
        name: "John Reese",
        number: "254745282166"
    },
    
    // Your Session ID
    sessionId: "LEGACY-XMD~YourSessionHere",
    
    // Feature Toggle
    features: {
        antidelete: true,
        antiviewonce: true,
        autorecord: true,
        // ... more features
    },
    
    // API Keys (Optional)
    apiKeys: {
        openai: "your-openai-key",
        youtube: "your-youtube-key"
    }
};
```

## 🎯 Commands

### Basic Commands
- `.menu` - Show all available commands
- `.ping` - Check bot response time
- `.alive` - Check if bot is active
- `.owner` - Show owner information

### Download Commands
- `.yt <url>` - Download YouTube audio
- `.ytmp4 <url>` - Download YouTube video
- `.apk <app name>` - Search for APK files

### AI Commands
- `.ai <question>` - Chat with AI
- `.chat <message>` - AI conversation
- `.gpt <query>` - GPT response

### Owner Commands (Owner Only)
- `.restart` - Restart the bot
- `.settings` - View bot settings
- `.stats` - Bot statistics

## 🌐 Deployment

### Deploy on Render

1. Fork this repository
2. Connect your GitHub account to [Render](https://render.com)
3. Create a new Web Service
4. Connect your forked repository
5. Add environment variables:
   - `SESSION_ID`: Your WhatsApp session ID
   - `OWNER_NUMBER`: Your phone number
6. Deploy!

### Deploy on Railway

1. Fork this repository
2. Go to [Railway](https://railway.app)
3. Create new project from GitHub repo
4. Add environment variables
5. Deploy!

### Deploy on Heroku

1. Fork this repository
2. Create new app on [Heroku](https://heroku.com)
3. Connect your GitHub repository
4. Add config vars in settings
5. Deploy!

## 🛠️ Development

### Project Structure
```
legacy-xmd/
├── config.js              # Bot configuration
├── index.js               # Main bot file
├── src/
│   ├── commands/           # Bot commands
│   │   ├── menu.js
│   │   ├── ytdownload.js
│   │   ├── aichat.js
│   │   └── apksearch.js
│   ├── features/           # Auto features
│   │   ├── antidelete.js
│   │   └── autoReactStatus.js
│   ├── utils/              # Utilities
│   │   └── botUtils.js
│   └── messageHandler.js   # Message processing
├── package.json
└── README.md
```

### Adding New Commands

1. Create a new file in `src/commands/`
2. Export a handler function
3. Add command logic to `src/messageHandler.js`
4. Update the menu in `src/commands/menu.js`

### Adding New Features

1. Create a new file in `src/features/`
2. Export setup function
3. Call setup function in `index.js`
4. Add feature toggle to `config.js`

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SESSION_ID` | WhatsApp session ID | ✅ |
| `OWNER_NUMBER` | Bot owner phone number | ✅ |
| `OPENAI_API_KEY` | OpenAI API key for AI chat | ❌ |
| `YOUTUBE_API_KEY` | YouTube API key | ❌ |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**John Reese**
- Phone: +254745282166
- WhatsApp: [Contact](https://wa.me/254745282166)

## 🙏 Acknowledgments

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API library
- [OpenAI](https://openai.com) - AI chat functionality
- All contributors who helped improve this bot

## ⚠️ Disclaimer

- This bot is for educational and personal use only
- Use responsibly and respect WhatsApp's Terms of Service
- The author is not responsible for any misuse of this software
- Always respect privacy and obtain consent before using automated features

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [John Reese](https://github.com/johnreese)

</div>