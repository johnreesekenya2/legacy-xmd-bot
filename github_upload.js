const fs = require('fs');
const path = require('path');
const axios = require('axios');

const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const REPO_OWNER = 'johnreesekenya2';
const REPO_NAME = 'legacy-xmd-bot';
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
};

async function uploadFile(filePath, content, message) {
    try {
        console.log(`📤 Uploading ${filePath}...`);
        
        // Get current file SHA if it exists
        let sha = null;
        try {
            const response = await axios.get(`${API_BASE}/contents/${filePath}`, { headers });
            sha = response.data.sha;
            console.log(`📋 Found existing file, SHA: ${sha.substring(0, 7)}...`);
        } catch (error) {
            if (error.response?.status !== 404) {
                console.log(`⚠️  Warning getting file info: ${error.message}`);
            }
        }

        // Create/update file
        const data = {
            message: message,
            content: Buffer.from(content).toString('base64'),
            branch: 'main'
        };

        if (sha) {
            data.sha = sha;
        }

        const response = await axios.put(`${API_BASE}/contents/${filePath}`, data, { headers });
        console.log(`✅ ${filePath} uploaded successfully`);
        return true;
    } catch (error) {
        console.log(`❌ Failed to upload ${filePath}:`, error.response?.data?.message || error.message);
        return false;
    }
}

async function uploadDirectory(dirPath, relativePath = '') {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const relativeItemPath = relativePath ? `${relativePath}/${item}` : item;
        
        // Skip certain files/directories
        if (['.git', 'node_modules', '.cache', '.replit'].includes(item)) {
            continue;
        }
        
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            console.log(`📁 Processing directory: ${relativeItemPath}`);
            await uploadDirectory(fullPath, relativeItemPath);
        } else if (stat.isFile()) {
            const content = fs.readFileSync(fullPath, 'utf8');
            await uploadFile(relativeItemPath, content, `Update ${item} - Fixed all Baileys issues and deployment configuration`);
            
            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
}

async function main() {
    console.log('🚀 Starting GitHub upload...');
    console.log(`📍 Repository: ${REPO_OWNER}/${REPO_NAME}`);
    
    if (!GITHUB_TOKEN) {
        console.log('❌ GitHub token not found!');
        return;
    }
    
    try {
        // Test API access
        const repoResponse = await axios.get(API_BASE, { headers });
        console.log(`✅ Repository access confirmed: ${repoResponse.data.full_name}`);
        
        // Upload all files from current directory
        await uploadDirectory('.');
        
        console.log('🎉 Upload completed successfully!');
        console.log('🔗 Check your repository at: https://github.com/johnreesekenya2/legacy-xmd-bot');
        
    } catch (error) {
        console.log('❌ Upload failed:', error.response?.data?.message || error.message);
        
        if (error.response?.status === 401) {
            console.log('🔑 Please check your GitHub token permissions');
        }
    }
}

main().catch(console.error);