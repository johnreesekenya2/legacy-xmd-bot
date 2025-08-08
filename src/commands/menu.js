// Menu Command for LEGACY XMD
const config = require('../../config');

function getMenuMessage() {
    const menu = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃                                                        ┃
┃        ██╗     ███████╗ ██████╗  █████╗  ██████╗██╗   ┃
┃        ██║     ██╔════╝██╔════╝ ██╔══██╗██╔════╝╚██╗  ┃
┃        ██║     █████╗  ██║  ███╗███████║██║      ╚██║  ┃
┃        ██║     ██╔══╝  ██║   ██║██╔══██║██║       ██║  ┃  
┃        ███████╗███████╗╚██████╔╝██║  ██║╚██████╗ ██║   ┃
┃        ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝   ┃
┃                                                        ┃
┃               ██╗  ██╗███╗   ███╗██████╗                ┃
┃               ╚██╗██╔╝████╗ ████║██╔══██╗               ┃
┃                ╚███╔╝ ██╔████╔██║██║  ██║               ┃
┃                ██╔██╗ ██║╚██╔╝██║██║  ██║               ┃
┃               ██╔╝ ██╗██║ ╚═╝ ██║██████╔╝               ┃
┃               ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝                ┃
┃                                                        ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

┌─────────────────────────────────────────────────────┐
│  🤖 *LEGACY XMD v${config.version}*                           │
│  👑 Created by: ${config.owner.name}                      │
│  📱 Owner: +${config.owner.number}                         │
└─────────────────────────────────────────────────────┘

╭─────────────────────────────────────────────────────╮
│             📋 *MAIN COMMANDS*                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🏠 *.menu* - Show this menu                        │
│  🏓 *.ping* - Check bot response time               │
│  ✅ *.alive* - Check if bot is active               │
│  👑 *.owner* - Owner information                    │
│                                                     │
╰─────────────────────────────────────────────────────╯

╭─────────────────────────────────────────────────────╮
│             📥 *DOWNLOAD COMMANDS*                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🎵 *.yt <url>* - Download YouTube audio           │
│  🎬 *.ytmp4 <url>* - Download YouTube video        │
│  📱 *.apk <app name>* - Search APK files           │
│                                                     │
╰─────────────────────────────────────────────────────╯

╭─────────────────────────────────────────────────────╮
│             🤖 *AI & CHAT COMMANDS*                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🧠 *.ai <question>* - Chat with AI                │
│  💬 *.chat <message>* - AI conversation             │
│  🎯 *.gpt <query>* - GPT response                   │
│                                                     │
╰─────────────────────────────────────────────────────╯

╭─────────────────────────────────────────────────────╮
│             🛡️ *AUTO FEATURES* (Always On)          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🗑️ *Anti Delete* - Saves deleted messages         │
│  👁️ *Anti View Once* - Saves view once media       │
│  🎤 *Auto Record* - Shows recording on voice       │
│  ❤️ *Auto React Status* - Reacts to status         │
│  ⌨️ *Auto Type* - Shows typing indicator           │
│                                                     │
╰─────────────────────────────────────────────────────╯

╭─────────────────────────────────────────────────────╮
│             👑 *OWNER COMMANDS*                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔄 *.restart* - Restart the bot                   │
│  ⚙️ *.settings* - View bot settings                │
│  📊 *.stats* - Bot statistics                      │
│                                                     │
╰─────────────────────────────────────────────────────╯

┌─────────────────────────────────────────────────────┐
│  💡 *Usage Tips:*                                   │
│  • All commands start with "." (dot)               │
│  • Bot works in groups and private chat            │
│  • Some features work automatically                │
│  • Report issues to owner for support              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  🔗 *Links & Support:*                              │
│  • GitHub: github.com/johnreese/legacy-xmd         │
│  • Deploy: Fork repo & deploy on Render            │
│  • Support: Contact +${config.owner.number}                 │
└─────────────────────────────────────────────────────┘

╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  💎 *LEGACY XMD* - The Ultimate WhatsApp Bot       ┃
┃  🚀 Fast • 🛡️ Secure • 🔧 Feature-Rich             ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

    return menu;
}

module.exports = { getMenuMessage };