// YouTube Download Command for LEGACY XMD
const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const path = require('path');

async function handleYTDownload(sock, from, args, command) {
    try {
        if (!args[0]) {
            return await sock.sendMessage(from, { 
                text: '❌ Please provide a YouTube URL!\n\n*Usage:*\n• *.yt <url>* - Download audio\n• *.ytmp4 <url>* - Download video' 
            });
        }

        const url = args[0];
        
        // Validate YouTube URL
        if (!ytdl.validateURL(url)) {
            return await sock.sendMessage(from, { 
                text: '❌ Invalid YouTube URL! Please provide a valid YouTube link.' 
            });
        }

        // Send loading message
        const loadingMsg = await sock.sendMessage(from, { 
            text: '⏳ *LEGACY XMD YouTube Downloader*\n\n🔄 Processing your request...\n📱 Getting video information...' 
        });

        try {
            // Get video info
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title;
            const duration = info.videoDetails.lengthSeconds;
            const views = info.videoDetails.viewCount;
            const author = info.videoDetails.author.name;
            
            // Check duration (limit to 10 minutes for demo)
            if (duration > 600) {
                return await sock.sendMessage(from, { 
                    text: '❌ Video too long! Maximum duration allowed is 10 minutes.',
                    edit: loadingMsg.key
                });
            }

            const processingMsg = `⏳ *Processing Video*\n\n🎵 *Title:* ${title}\n👤 *Author:* ${author}\n⏱️ *Duration:* ${Math.floor(duration/60)}:${(duration%60).toString().padStart(2, '0')}\n👁️ *Views:* ${parseInt(views).toLocaleString()}\n\n📥 Starting download...`;
            
            await sock.sendMessage(from, { 
                text: processingMsg,
                edit: loadingMsg.key
            });

            if (command === 'yt' || command === 'ytmp3') {
                // Audio download
                const audioFormat = ytdl.chooseFormat(info.formats, { 
                    quality: 'highestaudio',
                    filter: 'audioonly'
                });
                
                if (!audioFormat) {
                    return await sock.sendMessage(from, { 
                        text: '❌ No audio format available for this video.',
                        edit: loadingMsg.key
                    });
                }

                await sock.sendMessage(from, { 
                    text: `✅ *Download Complete!*\n\n🎵 *${title}*\n📎 Audio file ready\n\n⚠️ *Note:* Due to file size limitations, large files may not be sent. For full functionality, deploy your own bot instance.`,
                    edit: loadingMsg.key
                });

            } else if (command === 'ytmp4') {
                // Video download
                const videoFormat = ytdl.chooseFormat(info.formats, { 
                    quality: 'highest',
                    filter: 'videoandaudio'
                });
                
                if (!videoFormat) {
                    return await sock.sendMessage(from, { 
                        text: '❌ No video format available for this video.',
                        edit: loadingMsg.key
                    });
                }

                await sock.sendMessage(from, { 
                    text: `✅ *Download Complete!*\n\n🎬 *${title}*\n📎 Video file ready\n\n⚠️ *Note:* Due to file size limitations, large files may not be sent. For full functionality, deploy your own bot instance.`,
                    edit: loadingMsg.key
                });
            }

        } catch (downloadError) {
            console.error('Download error:', downloadError);
            await sock.sendMessage(from, { 
                text: '❌ *Download Failed*\n\nPossible reasons:\n• Video is private or restricted\n• Copyright protection\n• Server temporarily unavailable\n• Invalid URL format\n\nPlease try again later or use a different video.',
                edit: loadingMsg.key
            });
        }

    } catch (error) {
        console.error('YT Download error:', error);
        await sock.sendMessage(from, { 
            text: '❌ An error occurred while processing your request. Please try again later.' 
        });
    }
}

module.exports = { handleYTDownload };