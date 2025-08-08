
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');

class GitHubUploader {
    constructor(token, username, repoName) {
        this.token = token;
        this.username = username;
        this.repoName = repoName;
        this.baseUrl = 'https://api.github.com';
        this.headers = {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'LEGACY-XMD-Bot'
        };
    }

    async createRepository() {
        try {
            console.log(chalk.blue('📦 Creating GitHub repository...'));
            
            const repoData = {
                name: this.repoName,
                description: 'LEGACY XMD - Advanced WhatsApp Bot with Anti-Delete, YouTube Downloads, AI Chat & More',
                homepage: 'https://replit.com',
                private: false,
                has_issues: true,
                has_projects: true,
                has_wiki: true,
                auto_init: false
            };

            const response = await axios.post(`${this.baseUrl}/user/repos`, repoData, { headers: this.headers });
            console.log(chalk.green(`✅ Repository created: ${response.data.html_url}`));
            return response.data;
        } catch (error) {
            if (error.response?.status === 422) {
                console.log(chalk.yellow('⚠️  Repository already exists, continuing...'));
                return { name: this.repoName };
            }
            throw error;
        }
    }

    async getFileContent(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            return Buffer.from(content).toString('base64');
        } catch (error) {
            console.log(chalk.red(`❌ Error reading file ${filePath}:`, error.message));
            return null;
        }
    }

    async uploadFile(filePath, content, message) {
        try {
            const apiPath = `repos/${this.username}/${this.repoName}/contents/${filePath}`;
            
            // Check if file exists
            let sha = null;
            try {
                const existingFile = await axios.get(`${this.baseUrl}/${apiPath}`, { headers: this.headers });
                sha = existingFile.data.sha;
            } catch (error) {
                // File doesn't exist, that's fine
            }

            const data = {
                message: message,
                content: content,
                ...(sha && { sha })
            };

            await axios.put(`${this.baseUrl}/${apiPath}`, data, { headers: this.headers });
            console.log(chalk.green(`✅ Uploaded: ${filePath}`));
        } catch (error) {
            console.log(chalk.red(`❌ Failed to upload ${filePath}:`, error.response?.data?.message || error.message));
        }
    }

    async getAllFiles(dir, baseDir = '') {
        const files = [];
        const items = await fs.readdir(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const relativePath = path.join(baseDir, item);
            const stat = await fs.stat(fullPath);

            if (stat.isDirectory()) {
                // Skip certain directories
                if (['node_modules', '.git', 'session', '.replit-data'].includes(item)) {
                    continue;
                }
                const subFiles = await this.getAllFiles(fullPath, relativePath);
                files.push(...subFiles);
            } else {
                // Skip certain files
                if (['.env', 'package-lock.json', '.replit'].includes(item)) {
                    continue;
                }
                files.push({
                    path: relativePath.replace(/\\/g, '/'),
                    fullPath: fullPath
                });
            }
        }

        return files;
    }

    async uploadProject() {
        try {
            console.log(chalk.cyan('🚀 Starting LEGACY XMD upload to GitHub...'));
            
            // Create repository
            await this.createRepository();

            // Get all files
            console.log(chalk.blue('📁 Scanning project files...'));
            const files = await this.getAllFiles('.');

            // Replace package.json with GitHub version
            const packageGithubExists = files.find(f => f.path === 'package_github.json');
            if (packageGithubExists) {
                files.push({
                    path: 'package.json',
                    fullPath: 'package_github.json'
                });
            }

            console.log(chalk.blue(`📊 Found ${files.length} files to upload`));

            // Upload files
            let successCount = 0;
            for (const file of files) {
                const content = await this.getFileContent(file.fullPath);
                if (content) {
                    await this.uploadFile(
                        file.path, 
                        content, 
                        `Add ${file.path} - LEGACY XMD Bot`
                    );
                    successCount++;
                }
                
                // Rate limit protection
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            console.log(chalk.green(`✅ Upload completed! ${successCount}/${files.length} files uploaded`));
            console.log(chalk.cyan(`🌐 Repository URL: https://github.com/${this.username}/${this.repoName}`));
            console.log(chalk.yellow(`🚀 Deploy URL: https://github.com/${this.username}/${this.repoName}/fork`));

        } catch (error) {
            console.error(chalk.red('❌ Upload failed:'), error.message);
            if (error.response) {
                console.error(chalk.red('Response:', error.response.data));
            }
        }
    }
}

// Main execution
async function main() {
    console.log(chalk.cyan(`
╔═══════════════════════════════════════╗
║           LEGACY XMD UPLOADER         ║
║          GitHub API Upload            ║
╚═══════════════════════════════════════╝
    `));

    // Configuration
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'johnreesekenya2';
    const REPO_NAME = process.env.REPO_NAME || 'legacy-xmd-bot';

    if (!GITHUB_TOKEN) {
        console.log(chalk.red('❌ GITHUB_TOKEN environment variable is required!'));
        console.log(chalk.yellow('💡 Set your GitHub personal access token:'));
        console.log(chalk.cyan('   export GITHUB_TOKEN="your_token_here"'));
        console.log(chalk.blue('🔗 Create token at: https://github.com/settings/tokens'));
        process.exit(1);
    }

    const uploader = new GitHubUploader(GITHUB_TOKEN, GITHUB_USERNAME, REPO_NAME);
    await uploader.uploadProject();
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = GitHubUploader;
