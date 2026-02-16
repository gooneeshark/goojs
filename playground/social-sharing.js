// Social Sharing System - Dynamic Preview Generation
class SocialSharingSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.previewCache = new Map();
        this.currentTheme = this.getCurrentTheme();
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.addShareButtons();
        this.initializeAnalytics();
    }

    getCurrentTheme() {
        const theme = document.documentElement.getAttribute('data-theme') || 'matrix';
        const themeColors = {
            matrix: { primary: '#00ff41', secondary: '#00cc33', bg: '#000000' },
            cyberpunk: { primary: '#ff00ff', secondary: '#cc00cc', bg: '#0a0a0a' },
            hacker: { primary: '#00ffff', secondary: '#00cccc', bg: '#001122' },
            neon: { primary: '#ffff00', secondary: '#cccc00', bg: '#000011' },
            ocean: { primary: '#0099ff', secondary: '#0077cc', bg: '#001133' },
            fire: { primary: '#ff4500', secondary: '#cc3300', bg: '#110000' }
        };
        return themeColors[theme] || themeColors.matrix;
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1200;
        this.canvas.height = 630; // Standard social media preview size
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.display = 'none';
        document.body.appendChild(this.canvas);
    }

    // Generate dynamic preview image for sharing
    async generatePreviewImage(options = {}) {
        const {
            title = 'ศูนรวมของเล่นDevสไตล์Hacker',
            subtitle = 'Advanced Web Security Toolkit',
            tool = null,
            theme = this.currentTheme
        } = options;

        const cacheKey = `${title}-${subtitle}-${tool?.id || 'main'}-${JSON.stringify(theme)}`;
        
        if (this.previewCache.has(cacheKey)) {
            return this.previewCache.get(cacheKey);
        }

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, theme.bg);
        gradient.addColorStop(0.5, this.adjustColor(theme.bg, 20));
        gradient.addColorStop(1, theme.bg);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Add matrix-style background pattern
        this.drawMatrixBackground(theme);

        // Add main content
        await this.drawMainContent(title, subtitle, tool, theme);

        // Add branding elements
        this.drawBrandingElements(theme);

        // Convert to data URL
        const dataUrl = this.canvas.toDataURL('image/png', 0.9);
        this.previewCache.set(cacheKey, dataUrl);
        
        return dataUrl;
    }

    drawMatrixBackground(theme) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()';
        this.ctx.font = '14px monospace';
        this.ctx.globalAlpha = 0.1;
        
        for (let x = 0; x < this.canvas.width; x += 20) {
            for (let y = 20; y < this.canvas.height; y += 25) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                this.ctx.fillStyle = theme.primary;
                this.ctx.fillText(char, x, y);
            }
        }
        this.ctx.globalAlpha = 1;
    }

    async drawMainContent(title, subtitle, tool, theme) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Draw main title
        this.ctx.font = 'bold 48px Arial, sans-serif';
        this.ctx.fillStyle = theme.primary;
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = theme.primary;
        this.ctx.shadowBlur = 20;
        this.ctx.fillText(title, centerX, centerY - 80);

        // Draw subtitle
        this.ctx.font = '24px Arial, sans-serif';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText(subtitle, centerX, centerY - 30);

        // Draw tool-specific content if provided
        if (tool) {
            this.ctx.font = 'bold 32px Arial, sans-serif';
            this.ctx.fillStyle = theme.secondary;
            this.ctx.fillText(`🔧 ${tool.name}`, centerX, centerY + 30);
            
            this.ctx.font = '18px Arial, sans-serif';
            this.ctx.fillStyle = '#cccccc';
            this.ctx.fillText(tool.description || 'Advanced Security Tool', centerX, centerY + 70);
        }

        // Reset shadow
        this.ctx.shadowBlur = 0;
    }

    drawBrandingElements(theme) {
        // Draw logo/icon area
        const logoSize = 80;
        const logoX = 60;
        const logoY = 60;

        // Draw circular background for logo
        this.ctx.beginPath();
        this.ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
        this.ctx.fillStyle = theme.primary;
        this.ctx.fill();

        // Draw shark emoji as logo
        this.ctx.font = '48px Arial, sans-serif';
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🦈', logoX + logoSize/2, logoY + logoSize/2 + 15);

        // Draw website URL
        this.ctx.font = '16px Arial, sans-serif';
        this.ctx.fillStyle = theme.primary;
        this.ctx.textAlign = 'right';
        this.ctx.fillText('Advanced Dev Tools', this.canvas.width - 40, this.canvas.height - 40);

        // Draw decorative elements
        this.drawDecorativeElements(theme);
    }

    drawDecorativeElements(theme) {
        // Draw corner decorations
        const cornerSize = 100;
        
        // Top right corner
        this.ctx.strokeStyle = theme.primary;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.3;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width - cornerSize, 0);
        this.ctx.lineTo(this.canvas.width, 0);
        this.ctx.lineTo(this.canvas.width, cornerSize);
        this.ctx.stroke();

        // Bottom left corner
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - cornerSize);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.lineTo(cornerSize, this.canvas.height);
        this.ctx.stroke();

        this.ctx.globalAlpha = 1;
    }

    // Generate animated GIF for tool demos
    async generateAnimatedGIF(tool, duration = 3000) {
        // This is a simplified version - in a real implementation, 
        // you'd use a library like gif.js for actual GIF generation
        const frames = [];
        const frameCount = 30;
        const frameDelay = duration / frameCount;

        for (let i = 0; i < frameCount; i++) {
            const progress = i / frameCount;
            const frame = await this.generateDemoFrame(tool, progress);
            frames.push(frame);
        }

        // Return base64 data URL for the "animated" preview
        // In a real implementation, this would be a proper GIF
        return frames[0]; // Return first frame as static preview for now
    }

    async generateDemoFrame(tool, progress) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Create demo background
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width/2, this.canvas.height/2, 0,
            this.canvas.width/2, this.canvas.height/2, this.canvas.width/2
        );
        gradient.addColorStop(0, this.adjustColor(this.currentTheme.bg, 30));
        gradient.addColorStop(1, this.currentTheme.bg);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw animated demo content based on tool type
        this.drawToolDemo(tool, progress);

        return this.canvas.toDataURL('image/png', 0.8);
    }

    drawToolDemo(tool, progress) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Tool icon with animation
        this.ctx.font = '120px Arial, sans-serif';
        this.ctx.fillStyle = this.currentTheme.primary;
        this.ctx.textAlign = 'center';
        
        // Pulsing effect
        const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.1;
        this.ctx.save();
        this.ctx.translate(centerX, centerY - 50);
        this.ctx.scale(scale, scale);
        this.ctx.fillText(tool.icon || '🔧', 0, 0);
        this.ctx.restore();

        // Tool name
        this.ctx.font = 'bold 36px Arial, sans-serif';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(tool.name, centerX, centerY + 50);

        // Animated progress bar
        const barWidth = 300;
        const barHeight = 8;
        const barX = centerX - barWidth/2;
        const barY = centerY + 100;

        // Background bar
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        // Progress bar
        this.ctx.fillStyle = this.currentTheme.primary;
        this.ctx.fillRect(barX, barY, barWidth * progress, barHeight);

        // Glowing effect
        this.ctx.shadowColor = this.currentTheme.primary;
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(barX, barY, barWidth * progress, barHeight);
        this.ctx.shadowBlur = 0;
    }

    // Create custom share messages based on context
    generateShareMessage(context = {}) {
        const {
            tool = null,
            action = 'discover',
            theme = 'matrix'
        } = context;

        const messages = {
            discover: [
                '🦈 Just discovered this amazing dev toolkit! Perfect for ethical hackers and developers.',
                '⚡ Found the ultimate collection of security tools and dev utilities!',
                '🔧 This hacker-style toolkit has everything a developer needs!'
            ],
            tool: [
                `🚀 Check out this ${tool?.name || 'awesome tool'} - perfect for security testing!`,
                `💻 Just tried ${tool?.name || 'this tool'} and it\'s incredible for dev work!`,
                `🔒 ${tool?.name || 'This security tool'} is a game-changer for ethical hacking!`
            ],
            theme: [
                `🎨 Loving the ${theme} theme on this dev toolkit!`,
                `✨ The ${theme} aesthetic makes coding feel like hacking in the movies!`,
                `🌈 This ${theme} theme is perfect for late-night coding sessions!`
            ]
        };

        const messageType = tool ? 'tool' : (context.themeChange ? 'theme' : 'discover');
        const messageArray = messages[messageType];
        const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];

        return {
            text: randomMessage,
            hashtags: ['#DevTools', '#EthicalHacking', '#WebSecurity', '#JavaScript', '#HackerTools'],
            url: window.location.href
        };
    }

    // Add share buttons to the page
    addShareButtons() {
        // Create share button container
        const shareContainer = document.createElement('div');
        shareContainer.className = 'share-container';
        shareContainer.innerHTML = `
            <div class="share-buttons">
                <button class="share-btn" data-platform="twitter" title="Share on Twitter">
                    <span class="share-icon">🐦</span>
                    <span class="share-text">Twitter</span>
                </button>
                <button class="share-btn" data-platform="facebook" title="Share on Facebook">
                    <span class="share-icon">📘</span>
                    <span class="share-text">Facebook</span>
                </button>
                <button class="share-btn" data-platform="telegram" title="Share on telegram">
                    <span class="share-icon">💼</span>
                    <span class="share-text">telegram</span>
                </button>
                <button class="share-btn" data-platform="copy" title="Copy Link">
                    <span class="share-icon">📋</span>
                    <span class="share-text">Copy Link</span>
                </button>
                <button class="share-btn" data-platform="download" title="Download Preview">
                    <span class="share-icon">💾</span>
                    <span class="share-text">Download</span>
                </button>
            </div>
        `;

        // Add to header
        const header = document.querySelector('.header');
        if (header) {
            header.appendChild(shareContainer);
        }

        // Add share buttons to feature cards
        this.addFeatureShareButtons();
    }

    addFeatureShareButtons() {
        const features = document.querySelectorAll('.feature');
        features.forEach((feature, index) => {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'feature-share-btn';
            shareBtn.innerHTML = '📤';
            shareBtn.title = 'Share this tool';
            shareBtn.setAttribute('data-feature-index', index);
            
            feature.style.position = 'relative';
            feature.appendChild(shareBtn);
        });
    }

    setupEventListeners() {
        // Main share buttons
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.share-btn')) {
                const btn = e.target.closest('.share-btn');
                const platform = btn.getAttribute('data-platform');
                await this.handleShare(platform);
            }

            // Feature share buttons
            if (e.target.closest('.feature-share-btn')) {
                const btn = e.target.closest('.feature-share-btn');
                const featureIndex = btn.getAttribute('data-feature-index');
                await this.handleFeatureShare(featureIndex);
            }
        });

        // Listen for theme changes to update previews
        document.addEventListener('themeChanged', () => {
            this.currentTheme = this.getCurrentTheme();
            this.previewCache.clear(); // Clear cache when theme changes
        });
    }

    async handleShare(platform, context = {}) {
        try {
            // Track share attempt
            this.trackShareEvent(platform, 'attempt', context);

            const shareData = this.generateShareMessage(context);
            const previewImage = await this.generatePreviewImage(context);

            switch (platform) {
                case 'twitter':
                    await this.shareToTwitter(shareData, previewImage);
                    break;
                case 'facebook':
                    await this.shareToFacebook(shareData, previewImage);
                    break;
                case 'telegram':
                    await this.shareToTelegram(shareData, previewImage);
                    break;
                case 'copy':
                    await this.copyToClipboard(shareData);
                    break;
                case 'download':
                    await this.downloadPreview(previewImage, context);
                    break;
            }

            // Track successful share
            this.trackShareEvent(platform, 'success', context);
            this.showShareSuccess(platform);

        } catch (error) {
            console.error('Share failed:', error);
            this.trackShareEvent(platform, 'error', context);
            this.showShareError(platform);
        }
    }

    async handleFeatureShare(featureIndex) {
        const features = document.querySelectorAll('.feature');
        const feature = features[featureIndex];
        
        if (!feature) return;

        const toolName = feature.querySelector('h3')?.textContent || 'Dev Tool';
        const toolDescription = feature.querySelector('p')?.textContent || 'Advanced development tool';
        const toolIcon = feature.querySelector('.icon')?.textContent || '🔧';

        const context = {
            tool: {
                name: toolName,
                description: toolDescription,
                icon: toolIcon,
                id: `feature-${featureIndex}`
            },
            action: 'tool'
        };

        // Show share options for this specific tool
        this.showShareModal(context);
    }

    showShareModal(context) {
        const modal = document.createElement('div');
        modal.className = 'share-modal-overlay';
        modal.innerHTML = `
            <div class="share-modal">
                <div class="share-modal-header">
                    <h3>Share ${context.tool?.name || 'Dev Tools'}</h3>
                    <button class="share-modal-close">&times;</button>
                </div>
                <div class="share-modal-content">
                    <div class="share-preview">
                        <canvas class="share-preview-canvas"></canvas>
                    </div>
                    <div class="share-options">
                        <button class="share-option-btn" data-platform="twitter">
                            <span class="share-icon">🐦</span>
                            Share on Twitter
                        </button>
                        <button class="share-option-btn" data-platform="facebook">
                            <span class="share-icon">📘</span>
                            Share on Facebook
                        </button>
                        <button class="share-option-btn" data-platform="telegram">
                            <span class="share-icon">💼</span>
                            Share on telegram
                        </button>
                        <button class="share-option-btn" data-platform="copy">
                            <span class="share-icon">📋</span>
                            Copy Link
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Generate and show preview
        this.generatePreviewImage(context).then(previewUrl => {
            const canvas = modal.querySelector('.share-preview-canvas');
            const img = new Image();
            img.onload = () => {
                const ctx = canvas.getContext('2d');
                canvas.width = 300;
                canvas.height = 157; // Maintain aspect ratio
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = previewUrl;
        });

        // Handle modal interactions
        modal.addEventListener('click', async (e) => {
            if (e.target.classList.contains('share-modal-close') || 
                e.target.classList.contains('share-modal-overlay')) {
                modal.remove();
            }

            if (e.target.closest('.share-option-btn')) {
                const platform = e.target.closest('.share-option-btn').getAttribute('data-platform');
                await this.handleShare(platform, context);
                modal.remove();
            }
        });

        // Show modal with animation
        setTimeout(() => modal.classList.add('active'), 10);
    }

    async shareToTwitter(shareData, previewImage) {
        const text = encodeURIComponent(shareData.text + ' ' + shareData.hashtags.join(' '));
        const url = encodeURIComponent(shareData.url);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }

    async shareToFacebook(shareData, previewImage) {
        const url = encodeURIComponent(shareData.url);
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    }

    async shareToTelegram(shareData, previewImage) {
        const url = encodeURIComponent(shareData.url);
        const text = encodeURIComponent(shareData.text);
        const telegramUrl = `https://t.me/share/url?url=${url}&text=${text}`;

        window.open(telegramUrl, '_blank', 'width=600,height=400');
    }


    async copyToClipboard(shareData) {
        const textToCopy = `${shareData.text}\n${shareData.url}\n${shareData.hashtags.join(' ')}`;
        
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(textToCopy);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    async downloadPreview(previewImage, context) {
        const link = document.createElement('a');
        link.download = `dev-tools-preview-${context.tool?.id || 'main'}.png`;
        link.href = previewImage;
        link.click();
    }

    showShareSuccess(platform) {
        this.showNotification(`Successfully shared to ${platform}!`, 'success');
    }

    showShareError(platform) {
        this.showNotification(`Failed to share to ${platform}. Please try again.`, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `share-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Analytics and tracking methods
    initializeAnalytics() {
        this.analytics = {
            shares: {},
            popularTools: {},
            engagementMetrics: {
                totalShares: 0,
                uniqueUsers: new Set(),
                sessionShares: 0
            }
        };

        // Load existing analytics from localStorage
        const savedAnalytics = localStorage.getItem('socialSharingAnalytics');
        if (savedAnalytics) {
            try {
                const parsed = JSON.parse(savedAnalytics);
                this.analytics = { ...this.analytics, ...parsed };
                // Convert Set back from array
                this.analytics.engagementMetrics.uniqueUsers = new Set(parsed.engagementMetrics?.uniqueUsers || []);
            } catch (e) {
                console.warn('Failed to load analytics:', e);
            }
        }
    }

    trackShareEvent(platform, action, context = {}) {
        const timestamp = Date.now();
        const userId = this.getUserId();

        // Track platform shares
        if (!this.analytics.shares[platform]) {
            this.analytics.shares[platform] = [];
        }
        this.analytics.shares[platform].push({
            action,
            timestamp,
            context,
            userId
        });

        // Track popular tools
        if (context.tool) {
            const toolId = context.tool.id || context.tool.name;
            if (!this.analytics.popularTools[toolId]) {
                this.analytics.popularTools[toolId] = 0;
            }
            if (action === 'success') {
                this.analytics.popularTools[toolId]++;
            }
        }

        // Update engagement metrics
        if (action === 'success') {
            this.analytics.engagementMetrics.totalShares++;
            this.analytics.engagementMetrics.sessionShares++;
            this.analytics.engagementMetrics.uniqueUsers.add(userId);
        }

        // Save to localStorage
        this.saveAnalytics();
    }

    getUserId() {
        let userId = localStorage.getItem('socialSharingUserId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('socialSharingUserId', userId);
        }
        return userId;
    }

    saveAnalytics() {
        try {
            const analyticsToSave = {
                ...this.analytics,
                engagementMetrics: {
                    ...this.analytics.engagementMetrics,
                    uniqueUsers: Array.from(this.analytics.engagementMetrics.uniqueUsers)
                }
            };
            localStorage.setItem('socialSharingAnalytics', JSON.stringify(analyticsToSave));
        } catch (e) {
            console.warn('Failed to save analytics:', e);
        }
    }

    // Utility methods
    adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * amount);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // Public API methods
    getAnalytics() {
        return {
            ...this.analytics,
            engagementMetrics: {
                ...this.analytics.engagementMetrics,
                uniqueUsers: this.analytics.engagementMetrics.uniqueUsers.size
            }
        };
    }

    getMostPopularTools(limit = 5) {
        return Object.entries(this.analytics.popularTools)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([tool, shares]) => ({ tool, shares }));
    }

    getSharesByPlatform() {
        const result = {};
        Object.keys(this.analytics.shares).forEach(platform => {
            result[platform] = this.analytics.shares[platform].filter(s => s.action === 'success').length;
        });
        return result;
    }
}

// Initialize the social sharing system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.socialSharingSystem = new SocialSharingSystem();
});