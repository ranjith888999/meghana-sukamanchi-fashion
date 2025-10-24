// Global Cloud Content Manager
// This allows admin changes to reflect across ALL systems worldwide

class CloudContentManager {
    constructor() {
        // Using JSONBin.io - Free JSON storage service
        this.binId = '672270b0ad19ca34f8be2363'; // Your unique bin ID
        this.apiKey = '$2a$10$8Ev2/C/2G0VuB8CRa2Kv5e0oHnFXTsyk5B8u2J1HZlY3k5N2D7V6G'; // API key
        this.baseUrl = 'https://api.jsonbin.io/v3/b';
    }

    // Save content to cloud (visible to all systems)
    async saveContent(data) {
        try {
            console.log('🌐 Saving content to cloud...');
            
            const response = await fetch(`${this.baseUrl}/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Versioning': 'false'
                },
                body: JSON.stringify({
                    ...data,
                    lastUpdated: new Date().toISOString(),
                    version: Date.now()
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Content saved to cloud successfully!');
                return { success: true, data: result };
            } else {
                console.error('❌ Failed to save to cloud:', response.statusText);
                return { success: false, error: response.statusText };
            }
        } catch (error) {
            console.error('❌ Error saving to cloud:', error);
            return { success: false, error: error.message };
        }
    }

    // Load content from cloud (gets latest changes from any system)
    async loadContent() {
        try {
            console.log('🌐 Loading content from cloud...');
            
            const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Content loaded from cloud successfully!');
                return { success: true, data: result.record };
            } else {
                console.error('❌ Failed to load from cloud:', response.statusText);
                return { success: false, error: response.statusText };
            }
        } catch (error) {
            console.error('❌ Error loading from cloud:', error);
            return { success: false, error: error.message };
        }
    }

    // Check if cloud content is newer than local content
    async hasUpdates() {
        try {
            const cloudContent = await this.loadContent();
            if (!cloudContent.success) return false;

            const localVersion = localStorage.getItem('contentVersion') || '0';
            const cloudVersion = cloudContent.data.version || 0;

            return cloudVersion > parseInt(localVersion);
        } catch (error) {
            console.error('Error checking updates:', error);
            return false;
        }
    }

    // Sync content between cloud and local storage
    async syncContent() {
        const cloudContent = await this.loadContent();
        if (cloudContent.success) {
            localStorage.setItem('websiteContent', JSON.stringify(cloudContent.data));
            localStorage.setItem('contentVersion', cloudContent.data.version || Date.now());
            localStorage.setItem('websiteContentUpdated', 'true');
            return cloudContent.data;
        }
        return null;
    }
}

// Global instance
window.cloudManager = new CloudContentManager();

// Auto-sync functionality for real-time updates
class AutoSync {
    constructor() {
        this.syncInterval = 10000; // Check for updates every 10 seconds
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        console.log('🔄 Auto-sync started - checking for updates every 10 seconds');
        
        this.intervalId = setInterval(async () => {
            if (await window.cloudManager.hasUpdates()) {
                console.log('🆕 New content detected from cloud, syncing...');
                await window.cloudManager.syncContent();
                
                // Notify main website to reload content
                if (typeof loadAdminContent === 'function') {
                    loadAdminContent();
                }
                
                // Show notification if we're on admin panel
                if (window.location.href.includes('admin')) {
                    this.showUpdateNotification();
                }
            }
        }, this.syncInterval);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.isRunning = false;
            console.log('🛑 Auto-sync stopped');
        }
    }

    showUpdateNotification() {
        // Create a notification for real-time updates
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #d4af37, #f4d03f);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 10000;
                font-family: Inter, sans-serif;
                animation: slideIn 0.5s ease-out;
            ">
                <i class="fas fa-sync-alt"></i>
                Content updated from another system!
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.5s ease-out reverse';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }
        }, 4000);
    }
}

// Global auto-sync instance
window.autoSync = new AutoSync();

// Start auto-sync when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Start auto-sync for real-time updates
    window.autoSync.start();
    
    // Load initial content from cloud
    window.cloudManager.syncContent().then(() => {
        if (typeof loadAdminContent === 'function') {
            loadAdminContent();
        }
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CloudContentManager, AutoSync };
}