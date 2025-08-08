// AI Chat Command for LEGACY XMD
const axios = require('axios');
const config = require('../../config');

async function handleAIChat(sock, from, query) {
    try {
        if (!query || query.trim() === '') {
            return await sock.sendMessage(from, { 
                text: '❌ Please provide a question!\n\n*Usage:*\n• *.ai <question>*\n• *.chat <message>*\n• *.gpt <query>*\n\n*Example:*\n*.ai What is artificial intelligence?*' 
            });
        }

        // Send loading message
        const loadingMsg = await sock.sendMessage(from, { 
            text: '🤖 *LEGACY XMD AI Chat*\n\n⏳ Thinking... Please wait while I process your question.' 
        });

        try {
            // Check if OpenAI API key is available
            if (config.apiKeys.openai) {
                // Use OpenAI API (if key is provided)
                const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are LEGACY XMD AI assistant, created by John Reese. You are helpful, knowledgeable, and concise. Keep responses under 1000 characters when possible."
                        },
                        {
                            role: "user",
                            content: query
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                }, {
                    headers: {
                        'Authorization': `Bearer ${config.apiKeys.openai}`,
                        'Content-Type': 'application/json'
                    }
                });

                const aiResponse = response.data.choices[0].message.content;
                
                await sock.sendMessage(from, { 
                    text: `🤖 *LEGACY XMD AI Response*\n\n❓ *Your Question:*\n${query}\n\n💭 *AI Response:*\n${aiResponse}\n\n────────────────\n🔮 *Powered by OpenAI GPT*\n⚡ *LEGACY XMD Bot*`,
                    edit: loadingMsg.key
                });

            } else {
                // Use a free AI API or provide a mock response
                const responses = [
                    "I'm LEGACY XMD's AI assistant. To provide accurate AI responses, please configure your OpenAI API key in the bot settings.",
                    "Hello! I'm an AI built into LEGACY XMD. For full AI functionality, make sure you have configured your API keys.",
                    "I understand your question, but I need proper API keys to give you detailed responses. Please contact the bot owner to set up AI services.",
                    "I'm currently running in limited mode. For advanced AI conversations, please configure the bot with proper API credentials."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                await sock.sendMessage(from, { 
                    text: `🤖 *LEGACY XMD AI Response*\n\n❓ *Your Question:*\n${query}\n\n💭 *AI Response:*\n${randomResponse}\n\n────────────────\n⚠️ *Limited Mode Active*\n🔧 *Configure API keys for full functionality*`,
                    edit: loadingMsg.key
                });
            }

        } catch (apiError) {
            console.error('AI API Error:', apiError);
            
            let errorMessage = '❌ AI service temporarily unavailable.';
            
            if (apiError.response?.status === 401) {
                errorMessage = '❌ Invalid API key. Please configure a valid OpenAI API key.';
            } else if (apiError.response?.status === 429) {
                errorMessage = '❌ AI service rate limit exceeded. Please try again later.';
            } else if (apiError.response?.status === 403) {
                errorMessage = '❌ AI service access forbidden. Check your API key permissions.';
            }

            await sock.sendMessage(from, { 
                text: `🤖 *LEGACY XMD AI Service*\n\n${errorMessage}\n\n💡 *For full AI functionality:*\n• Get an OpenAI API key\n• Configure it in config.js\n• Restart the bot\n\n📞 *Contact:* ${config.owner.name} (+${config.owner.number})`,
                edit: loadingMsg.key
            });
        }

    } catch (error) {
        console.error('AI Chat error:', error);
        await sock.sendMessage(from, { 
            text: '❌ An error occurred while processing your AI request. Please try again later.' 
        });
    }
}

module.exports = { handleAIChat };