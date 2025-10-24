// GitHub API Content Management Solution
class GitHubContentManager {
    constructor() {
        this.owner = 'ranjith888999';
        this.repo = 'meghana-sukamanchi-fashion';
        this.token = 'YOUR_GITHUB_TOKEN'; // You'll need to set this
        this.branch = 'main';
    }

    // Save content to GitHub repository
    async saveContent(data) {
        const content = btoa(JSON.stringify(data, null, 2)); // Base64 encode
        
        try {
            // Get current file SHA (required for updates)
            const currentFile = await this.getFile('content/website-data.json');
            
            const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/content/website-data.json`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Update website content via admin panel',
                    content: content,
                    sha: currentFile ? currentFile.sha : undefined,
                    branch: this.branch
                })
            });

            if (response.ok) {
                console.log('Content saved to GitHub successfully');
                return true;
            }
        } catch (error) {
            console.error('Error saving to GitHub:', error);
            return false;
        }
    }

    // Load content from GitHub repository
    async loadContent() {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/content/website-data.json`);
            
            if (response.ok) {
                const data = await response.json();
                const content = JSON.parse(atob(data.content)); // Decode base64
                return content;
            }
        } catch (error) {
            console.error('Error loading from GitHub:', error);
            return null;
        }
    }

    async getFile(path) {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`);
            return response.ok ? await response.json() : null;
        } catch (error) {
            return null;
        }
    }
}

// Usage in admin panel:
const contentManager = new GitHubContentManager();

// When admin saves changes:
async function saveContentToGitHub(contentData) {
    const success = await contentManager.saveContent(contentData);
    if (success) {
        showSuccessMessage('Content updated worldwide!');
        // Trigger Vercel rebuild automatically
        triggerVercelRebuild();
    } else {
        showErrorMessage('Failed to update content');
    }
}

// On main website load:
async function loadGitHubContent() {
    const content = await contentManager.loadContent();
    if (content) {
        applyContentToWebsite(content);
    }
}