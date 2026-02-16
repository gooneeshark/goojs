// Advanced Analytics Tracker for Social Sharing and User Engagement
class AnalyticsTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.startTime = Date.now();
        this.events = [];
        this.metrics = {
            pageViews: 0,
            toolInteractions: 0,
            shareAttempts: 0,
            successfulShares: 0,
            themeChanges: 0,
            timeOnPage: 0,
            scrollDepth: 0,
            clickHeatmap: {},
            popularTools: {},
            sharesByPlatform: {},
            userEngagement: {
                bounceRate: 0,
                avgSessionDuration: 0,
                pagesPerSession: 0,
                conversionRate: 0
            }
        };
        this.heatmapData = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startSessionTracking();
        this.loadPreviousData();
        this.trackPageView();
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    getUserId() {
        let userId = localStorage.getItem('analyticsUserId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('analyticsUserId', userId);
        }
        return userId;
    }

    setupEventListeners() {
        // Track page interactions
        document.addEventListener('click', (e) => this.trackClick(e));
        document.addEventListener('scroll', () => this.trackScroll());
        document.addEventListener('mousemove', (e) => this.trackMouseMovement(e));
        
        // Track social sharing events
        document.addEventListener('shareAttempt', (e) => this.trackShareAttempt(e.detail));
        document.addEventListener('shareSuccess', (e) => this.trackShareSuccess(e.detail));
        document.addEventListener('shareError', (e) => this.trackShareError(e.detail));
        
        // Track tool interactions
        document.addEventListener('toolOpened', (e) => this.trackToolInteraction(e.detail));
        document.addEventListener('toolClosed', (e) => this.trackToolClose(e.detail));
        
        // Track theme changes
        document.addEventListener('themeChanged', (e) => this.trackThemeChange(e.detail));
        
        // Track script marketplace interactions
        document.addEventListener('scriptViewed', (e) => this.trackScriptView(e.detail));
        document.addEventListener('scriptDownloaded', (e) => this.trackScriptDownload(e.detail));
        document.addEventListener('scriptAddedToCart', (e) => this.trackScriptCart(e.detail));
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => this.trackVisibilityChange());
        
        // Track before page unload
        window.addEventListener('beforeunload', () => this.trackPageExit());
        
        // Track performance metrics
        window.addEventListener('load', () => this.trackPerformanceMetrics());
    }

    trackPageView() {
        const event = {
            type: 'page_view',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            theme: this.getCurrentTheme(),
            language: navigator.language
        };
        
        this.addEvent(event);
        this.metrics.pageViews++;
    }

    trackClick(event) {
        const target = event.target;
        const elementInfo = this.getElementInfo(target);
        
        const clickEvent = {
            type: 'click',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            element: elementInfo,
            coordinates: { x: event.clientX, y: event.clientY },
            pageX: event.pageX,
            pageY: event.pageY
        };
        
        this.addEvent(clickEvent);
        this.updateHeatmap(event.clientX, event.clientY);
        
        // Track specific click types
        if (target.closest('.feature')) {
            this.trackFeatureClick(target.closest('.feature'));
        }
        
        if (target.closest('.share-btn')) {
            this.trackShareButtonClick(target.closest('.share-btn'));
        }
    }

    trackScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
        
        if (scrollPercentage > this.metrics.scrollDepth) {
            this.metrics.scrollDepth = scrollPercentage;
            
            const scrollEvent = {
                type: 'scroll',
                timestamp: Date.now(),
                sessionId: this.sessionId,
                userId: this.userId,
                scrollDepth: scrollPercentage,
                scrollPosition: scrollTop
            };
            
            this.addEvent(scrollEvent);
        }
    }

    trackMouseMovement(event) {
        // Sample mouse movements (not every movement to avoid performance issues)
        if (Math.random() < 0.01) { // 1% sampling rate
            const mouseEvent = {
                type: 'mouse_move',
                timestamp: Date.now(),
                sessionId: this.sessionId,
                coordinates: { x: event.clientX, y: event.clientY }
            };
            
            this.addEvent(mouseEvent);
        }
    }

    trackShareAttempt(details) {
        const shareEvent = {
            type: 'share_attempt',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            platform: details.platform,
            content: details.content,
            tool: details.tool,
            theme: this.getCurrentTheme()
        };
        
        this.addEvent(shareEvent);
        this.metrics.shareAttempts++;
        
        // Update platform-specific metrics
        if (!this.metrics.sharesByPlatform[details.platform]) {
            this.metrics.sharesByPlatform[details.platform] = { attempts: 0, successes: 0 };
        }
        this.metrics.sharesByPlatform[details.platform].attempts++;
    }

    trackShareSuccess(details) {
        const shareEvent = {
            type: 'share_success',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            platform: details.platform,
            content: details.content,
            tool: details.tool,
            theme: this.getCurrentTheme()
        };
        
        this.addEvent(shareEvent);
        this.metrics.successfulShares++;
        
        // Update platform-specific metrics
        if (this.metrics.sharesByPlatform[details.platform]) {
            this.metrics.sharesByPlatform[details.platform].successes++;
        }
        
        // Track popular tools
        if (details.tool) {
            const toolId = details.tool.id || details.tool.name;
            this.metrics.popularTools[toolId] = (this.metrics.popularTools[toolId] || 0) + 1;
        }
    }

    trackShareError(details) {
        const errorEvent = {
            type: 'share_error',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            platform: details.platform,
            error: details.error,
            tool: details.tool
        };
        
        this.addEvent(errorEvent);
    }

    trackToolInteraction(details) {
        const toolEvent = {
            type: 'tool_interaction',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            tool: details.tool,
            action: details.action || 'open'
        };
        
        this.addEvent(toolEvent);
        this.metrics.toolInteractions++;
        
        // Update popular tools
        const toolId = details.tool.id || details.tool.name;
        this.metrics.popularTools[toolId] = (this.metrics.popularTools[toolId] || 0) + 1;
    }

    trackToolClose(details) {
        const toolEvent = {
            type: 'tool_close',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            tool: details.tool,
            duration: details.duration
        };
        
        this.addEvent(toolEvent);
    }

    trackThemeChange(details) {
        const themeEvent = {
            type: 'theme_change',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            fromTheme: details.from,
            toTheme: details.to
        };
        
        this.addEvent(themeEvent);
        this.metrics.themeChanges++;
    }

    trackScriptView(details) {
        const scriptEvent = {
            type: 'script_view',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            script: details.script
        };
        
        this.addEvent(scriptEvent);
    }

    trackScriptDownload(details) {
        const downloadEvent = {
            type: 'script_download',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            script: details.script,
            downloadType: details.type || 'single'
        };
        
        this.addEvent(downloadEvent);
    }

    trackScriptCart(details) {
        const cartEvent = {
            type: 'script_cart',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            script: details.script,
            action: details.action // 'add' or 'remove'
        };
        
        this.addEvent(cartEvent);
    }

    trackFeatureClick(featureElement) {
        const featureName = featureElement.querySelector('h3')?.textContent || 'Unknown Feature';
        
        const featureEvent = {
            type: 'feature_click',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            feature: featureName
        };
        
        this.addEvent(featureEvent);
    }

    trackShareButtonClick(shareButton) {
        const platform = shareButton.getAttribute('data-platform') || 'unknown';
        
        const shareButtonEvent = {
            type: 'share_button_click',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            platform: platform
        };
        
        this.addEvent(shareButtonEvent);
    }

    trackVisibilityChange() {
        const visibilityEvent = {
            type: 'visibility_change',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            hidden: document.hidden
        };
        
        this.addEvent(visibilityEvent);
    }

    trackPageExit() {
        const exitTime = Date.now();
        const timeOnPage = exitTime - this.startTime;
        
        const exitEvent = {
            type: 'page_exit',
            timestamp: exitTime,
            sessionId: this.sessionId,
            userId: this.userId,
            timeOnPage: timeOnPage,
            scrollDepth: this.metrics.scrollDepth
        };
        
        this.addEvent(exitEvent);
        this.metrics.timeOnPage = timeOnPage;
        
        // Save final metrics
        this.saveMetrics();
    }

    trackPerformanceMetrics() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const performanceEvent = {
                type: 'performance',
                timestamp: Date.now(),
                sessionId: this.sessionId,
                userId: this.userId,
                loadTime: timing.loadEventEnd - timing.navigationStart,
                domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                firstPaint: this.getFirstPaint(),
                resources: this.getResourceTimings()
            };
            
            this.addEvent(performanceEvent);
        }
    }

    getFirstPaint() {
        if (window.performance && window.performance.getEntriesByType) {
            const paintEntries = window.performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
            return firstPaint ? firstPaint.startTime : null;
        }
        return null;
    }

    getResourceTimings() {
        if (window.performance && window.performance.getEntriesByType) {
            const resources = window.performance.getEntriesByType('resource');
            return resources.map(resource => ({
                name: resource.name,
                duration: resource.duration,
                size: resource.transferSize
            })).slice(0, 10); // Limit to first 10 resources
        }
        return [];
    }

    updateHeatmap(x, y) {
        const gridSize = 50;
        const gridX = Math.floor(x / gridSize);
        const gridY = Math.floor(y / gridSize);
        const key = `${gridX},${gridY}`;
        
        this.metrics.clickHeatmap[key] = (this.metrics.clickHeatmap[key] || 0) + 1;
    }

    startSessionTracking() {
        // Track session duration every 30 seconds
        setInterval(() => {
            const currentTime = Date.now();
            const sessionDuration = currentTime - this.startTime;
            
            const sessionEvent = {
                type: 'session_ping',
                timestamp: currentTime,
                sessionId: this.sessionId,
                userId: this.userId,
                duration: sessionDuration
            };
            
            this.addEvent(sessionEvent);
        }, 30000);
    }

    addEvent(event) {
        this.events.push(event);
        
        // Limit events array size to prevent memory issues
        if (this.events.length > 1000) {
            this.events = this.events.slice(-500); // Keep last 500 events
        }
        
        // Auto-save events periodically
        if (this.events.length % 10 === 0) {
            this.saveEvents();
        }
    }

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'matrix';
    }

    getElementInfo(element) {
        return {
            tagName: element.tagName,
            className: element.className,
            id: element.id,
            text: element.textContent?.substring(0, 100) || '',
            attributes: this.getRelevantAttributes(element)
        };
    }

    getRelevantAttributes(element) {
        const relevantAttrs = ['data-platform', 'data-tool', 'data-theme', 'href', 'type'];
        const attrs = {};
        
        relevantAttrs.forEach(attr => {
            if (element.hasAttribute(attr)) {
                attrs[attr] = element.getAttribute(attr);
            }
        });
        
        return attrs;
    }

    // Data persistence methods
    saveEvents() {
        try {
            localStorage.setItem('analyticsEvents', JSON.stringify(this.events));
        } catch (e) {
            console.warn('Failed to save analytics events:', e);
        }
    }

    saveMetrics() {
        try {
            const metricsToSave = {
                ...this.metrics,
                lastUpdated: Date.now(),
                sessionId: this.sessionId,
                userId: this.userId
            };
            localStorage.setItem('analyticsMetrics', JSON.stringify(metricsToSave));
        } catch (e) {
            console.warn('Failed to save analytics metrics:', e);
        }
    }

    loadPreviousData() {
        try {
            const savedEvents = localStorage.getItem('analyticsEvents');
            if (savedEvents) {
                this.events = JSON.parse(savedEvents);
            }
            
            const savedMetrics = localStorage.getItem('analyticsMetrics');
            if (savedMetrics) {
                const parsed = JSON.parse(savedMetrics);
                this.metrics = { ...this.metrics, ...parsed };
            }
        } catch (e) {
            console.warn('Failed to load previous analytics data:', e);
        }
    }

    // Analytics reporting methods
    generateReport() {
        const currentTime = Date.now();
        const sessionDuration = currentTime - this.startTime;
        
        return {
            summary: {
                sessionId: this.sessionId,
                userId: this.userId,
                sessionDuration: sessionDuration,
                pageViews: this.metrics.pageViews,
                toolInteractions: this.metrics.toolInteractions,
                shareAttempts: this.metrics.shareAttempts,
                successfulShares: this.metrics.successfulShares,
                shareSuccessRate: this.metrics.shareAttempts > 0 ? 
                    (this.metrics.successfulShares / this.metrics.shareAttempts * 100).toFixed(2) + '%' : '0%',
                themeChanges: this.metrics.themeChanges,
                scrollDepth: this.metrics.scrollDepth + '%'
            },
            popularTools: this.getMostPopularTools(),
            sharesByPlatform: this.getSharesByPlatform(),
            heatmapData: this.getHeatmapData(),
            events: this.events.slice(-50), // Last 50 events
            performance: this.getPerformanceMetrics()
        };
    }

    getMostPopularTools(limit = 5) {
        return Object.entries(this.metrics.popularTools)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([tool, interactions]) => ({ tool, interactions }));
    }

    getSharesByPlatform() {
        const result = {};
        Object.keys(this.metrics.sharesByPlatform).forEach(platform => {
            const data = this.metrics.sharesByPlatform[platform];
            result[platform] = {
                attempts: data.attempts,
                successes: data.successes,
                successRate: data.attempts > 0 ? 
                    (data.successes / data.attempts * 100).toFixed(2) + '%' : '0%'
            };
        });
        return result;
    }

    getHeatmapData() {
        return Object.entries(this.metrics.clickHeatmap)
            .map(([coordinates, clicks]) => {
                const [x, y] = coordinates.split(',').map(Number);
                return { x: x * 50, y: y * 50, clicks };
            })
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 20); // Top 20 hotspots
    }

    getPerformanceMetrics() {
        const performanceEvents = this.events.filter(e => e.type === 'performance');
        if (performanceEvents.length === 0) return null;
        
        const latest = performanceEvents[performanceEvents.length - 1];
        return {
            loadTime: latest.loadTime,
            domReady: latest.domReady,
            firstPaint: latest.firstPaint,
            resourceCount: latest.resources?.length || 0
        };
    }

    // Public API methods
    getMetrics() {
        return { ...this.metrics };
    }

    getEvents(type = null, limit = 100) {
        let filteredEvents = this.events;
        
        if (type) {
            filteredEvents = this.events.filter(e => e.type === type);
        }
        
        return filteredEvents.slice(-limit);
    }

    exportData() {
        return {
            events: this.events,
            metrics: this.metrics,
            report: this.generateReport()
        };
    }

    clearData() {
        this.events = [];
        this.metrics = {
            pageViews: 0,
            toolInteractions: 0,
            shareAttempts: 0,
            successfulShares: 0,
            themeChanges: 0,
            timeOnPage: 0,
            scrollDepth: 0,
            clickHeatmap: {},
            popularTools: {},
            sharesByPlatform: {},
            userEngagement: {
                bounceRate: 0,
                avgSessionDuration: 0,
                pagesPerSession: 0,
                conversionRate: 0
            }
        };
        
        localStorage.removeItem('analyticsEvents');
        localStorage.removeItem('analyticsMetrics');
    }

    // Integration with external analytics services
    sendToGoogleAnalytics(event) {
        if (typeof gtag !== 'undefined') {
            gtag('event', event.type, {
                event_category: 'User Interaction',
                event_label: event.tool?.name || event.platform || 'General',
                value: 1
            });
        }
    }

    sendToCustomEndpoint(data) {
        // Send analytics data to custom endpoint
        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            navigator.sendBeacon('/api/analytics', blob);
        } else {
            fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).catch(e => console.warn('Failed to send analytics:', e));
        }
    }
}

// Initialize Analytics Tracker
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsTracker = new AnalyticsTracker();
    
    // Integrate with existing systems
    if (window.socialSharingSystem) {
        // Override social sharing methods to include analytics
        const originalHandleShare = window.socialSharingSystem.handleShare;
        window.socialSharingSystem.handleShare = function(platform, context) {
            // Dispatch analytics events
            document.dispatchEvent(new CustomEvent('shareAttempt', {
                detail: { platform, content: context, tool: context.tool }
            }));
            
            return originalHandleShare.call(this, platform, context)
                .then(result => {
                    document.dispatchEvent(new CustomEvent('shareSuccess', {
                        detail: { platform, content: context, tool: context.tool }
                    }));
                    return result;
                })
                .catch(error => {
                    document.dispatchEvent(new CustomEvent('shareError', {
                        detail: { platform, error: error.message, tool: context.tool }
                    }));
                    throw error;
                });
        };
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsTracker;
}