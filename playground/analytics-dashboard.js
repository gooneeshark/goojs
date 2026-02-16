// Analytics Dashboard for Visualizing Share and Engagement Data
class AnalyticsDashboard {
    constructor() {
        this.isVisible = false;
        this.refreshInterval = null;
        this.charts = {};
        this.init();
    }

    init() {
        this.createDashboard();
        this.setupEventListeners();
        this.addDashboardToggle();
    }

    createDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'analyticsDashboard';
        dashboard.className = 'analytics-dashboard';
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <h2>📊 Analytics Dashboard</h2>
                <div class="dashboard-controls">
                    <button class="dashboard-btn" id="refreshDashboard">🔄 Refresh</button>
                    <button class="dashboard-btn" id="exportData">💾 Export</button>
                    <button class="dashboard-btn" id="clearData">🗑️ Clear</button>
                    <button class="dashboard-close" id="closeDashboard">&times;</button>
                </div>
            </div>
            
            <div class="dashboard-content">
                <!-- Summary Cards -->
                <div class="summary-cards">
                    <div class="summary-card">
                        <div class="card-icon">👁️</div>
                        <div class="card-content">
                            <div class="card-value" id="pageViews">0</div>
                            <div class="card-label">Page Views</div>
                        </div>
                    </div>
                    
                    <div class="summary-card">
                        <div class="card-icon">📤</div>
                        <div class="card-content">
                            <div class="card-value" id="totalShares">0</div>
                            <div class="card-label">Total Shares</div>
                        </div>
                    </div>
                    
                    <div class="summary-card">
                        <div class="card-icon">🎯</div>
                        <div class="card-content">
                            <div class="card-value" id="shareSuccessRate">0%</div>
                            <div class="card-label">Success Rate</div>
                        </div>
                    </div>
                    
                    <div class="summary-card">
                        <div class="card-icon">🔧</div>
                        <div class="card-content">
                            <div class="card-value" id="toolInteractions">0</div>
                            <div class="card-label">Tool Interactions</div>
                        </div>
                    </div>
                    
                    <div class="summary-card">
                        <div class="card-icon">⏱️</div>
                        <div class="card-content">
                            <div class="card-value" id="avgSessionTime">0s</div>
                            <div class="card-label">Avg Session</div>
                        </div>
                    </div>
                    
                    <div class="summary-card">
                        <div class="card-icon">📜</div>
                        <div class="card-content">
                            <div class="card-value" id="scrollDepth">0%</div>
                            <div class="card-label">Scroll Depth</div>
                        </div>
                    </div>
                </div>
                
                <!-- Charts Section -->
                <div class="charts-section">
                    <div class="chart-container">
                        <h3>📊 Shares by Platform</h3>
                        <canvas id="sharesPlatformChart" width="400" height="200"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3>🔧 Popular Tools</h3>
                        <canvas id="popularToolsChart" width="400" height="200"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3>🎨 Theme Usage</h3>
                        <canvas id="themeUsageChart" width="400" height="200"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h3>🔥 Click Heatmap</h3>
                        <canvas id="heatmapChart" width="400" height="300"></canvas>
                    </div>
                </div>
                
                <!-- Detailed Tables -->
                <div class="tables-section">
                    <div class="table-container">
                        <h3>📈 Recent Events</h3>
                        <div class="table-wrapper">
                            <table id="recentEventsTable">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Event</th>
                                        <th>Details</th>
                                        <th>User</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="table-container">
                        <h3>🏆 Top Performing Content</h3>
                        <div class="table-wrapper">
                            <table id="topContentTable">
                                <thead>
                                    <tr>
                                        <th>Content</th>
                                        <th>Shares</th>
                                        <th>Success Rate</th>
                                        <th>Platform</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- Real-time Activity Feed -->
                <div class="activity-feed">
                    <h3>⚡ Real-time Activity</h3>
                    <div id="activityFeed" class="feed-container">
                        <div class="feed-item">
                            <span class="feed-time">--:--</span>
                            <span class="feed-message">Waiting for activity...</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dashboard);
    }

    addDashboardToggle() {
        // Add analytics toggle button to the page
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'analyticsToggle';
        toggleBtn.className = 'analytics-toggle';
        toggleBtn.innerHTML = '📊';
        toggleBtn.title = 'Open Analytics Dashboard';
        
        document.body.appendChild(toggleBtn);
    }

    setupEventListeners() {
        // Dashboard toggle
        document.addEventListener('click', (e) => {
            if (e.target.id === 'analyticsToggle') {
                this.toggleDashboard();
            }
            
            if (e.target.id === 'closeDashboard') {
                this.hideDashboard();
            }
            
            if (e.target.id === 'refreshDashboard') {
                this.refreshData();
            }
            
            if (e.target.id === 'exportData') {
                this.exportData();
            }
            
            if (e.target.id === 'clearData') {
                this.clearData();
            }
        });

        // Listen for analytics events to update real-time feed
        document.addEventListener('shareAttempt', (e) => {
            this.addActivityFeedItem('Share attempt', `${e.detail.platform} - ${e.detail.tool?.name || 'General'}`);
        });

        document.addEventListener('shareSuccess', (e) => {
            this.addActivityFeedItem('Share success', `${e.detail.platform} - ${e.detail.tool?.name || 'General'}`, 'success');
        });

        document.addEventListener('toolOpened', (e) => {
            this.addActivityFeedItem('Tool opened', e.detail.tool?.name || 'Unknown tool');
        });

        document.addEventListener('themeChanged', (e) => {
            this.addActivityFeedItem('Theme changed', `${e.detail.from} → ${e.detail.to}`, 'info');
        });

        // Auto-refresh dashboard when visible
        document.addEventListener('visibilitychange', () => {
            if (this.isVisible && !document.hidden) {
                this.refreshData();
            }
        });
    }

    toggleDashboard() {
        if (this.isVisible) {
            this.hideDashboard();
        } else {
            this.showDashboard();
        }
    }

    showDashboard() {
        const dashboard = document.getElementById('analyticsDashboard');
        dashboard.classList.add('visible');
        this.isVisible = true;
        
        this.refreshData();
        
        // Start auto-refresh
        this.refreshInterval = setInterval(() => {
            this.refreshData();
        }, 30000); // Refresh every 30 seconds
    }

    hideDashboard() {
        const dashboard = document.getElementById('analyticsDashboard');
        dashboard.classList.remove('visible');
        this.isVisible = false;
        
        // Stop auto-refresh
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    refreshData() {
        if (!window.analyticsTracker) return;
        
        const report = window.analyticsTracker.generateReport();
        this.updateSummaryCards(report.summary);
        this.updateCharts(report);
        this.updateTables(report);
    }

    updateSummaryCards(summary) {
        document.getElementById('pageViews').textContent = summary.pageViews;
        document.getElementById('totalShares').textContent = summary.successfulShares;
        document.getElementById('shareSuccessRate').textContent = summary.shareSuccessRate;
        document.getElementById('toolInteractions').textContent = summary.toolInteractions;
        document.getElementById('avgSessionTime').textContent = this.formatDuration(summary.sessionDuration);
        document.getElementById('scrollDepth').textContent = summary.scrollDepth;
    }

    updateCharts(report) {
        this.updateSharesPlatformChart(report.sharesByPlatform);
        this.updatePopularToolsChart(report.popularTools);
        this.updateThemeUsageChart();
        this.updateHeatmapChart(report.heatmapData);
    }

    updateSharesPlatformChart(sharesByPlatform) {
        const canvas = document.getElementById('sharesPlatformChart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const platforms = Object.keys(sharesByPlatform);
        if (platforms.length === 0) {
            this.drawNoDataMessage(ctx, canvas, 'No sharing data yet');
            return;
        }
        
        const data = platforms.map(platform => sharesByPlatform[platform].successes);
        const colors = ['#1DA1F2', '#4267B2', '#0077B5', '#25D366', '#FF4500'];
        
        this.drawBarChart(ctx, canvas, platforms, data, colors, 'Successful Shares');
    }

    updatePopularToolsChart(popularTools) {
        const canvas = document.getElementById('popularToolsChart');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (popularTools.length === 0) {
            this.drawNoDataMessage(ctx, canvas, 'No tool interactions yet');
            return;
        }
        
        const tools = popularTools.map(item => item.tool);
        const interactions = popularTools.map(item => item.interactions);
        const colors = ['#00ff41', '#ff00ff', '#00ffff', '#ffff00', '#ff4500'];
        
        this.drawBarChart(ctx, canvas, tools, interactions, colors, 'Interactions');
    }

    updateThemeUsageChart() {
        const canvas = document.getElementById('themeUsageChart');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get theme usage from events
        if (!window.analyticsTracker) return;
        
        const themeEvents = window.analyticsTracker.getEvents('theme_change');
        const themeUsage = {};
        
        themeEvents.forEach(event => {
            themeUsage[event.toTheme] = (themeUsage[event.toTheme] || 0) + 1;
        });
        
        const themes = Object.keys(themeUsage);
        if (themes.length === 0) {
            this.drawNoDataMessage(ctx, canvas, 'No theme changes yet');
            return;
        }
        
        const usage = Object.values(themeUsage);
        const colors = ['#00ff41', '#ff00ff', '#00ffff', '#ffff00', '#0099ff', '#ff4500'];
        
        this.drawPieChart(ctx, canvas, themes, usage, colors);
    }

    updateHeatmapChart(heatmapData) {
        const canvas = document.getElementById('heatmapChart');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (heatmapData.length === 0) {
            this.drawNoDataMessage(ctx, canvas, 'No click data yet');
            return;
        }
        
        // Draw heatmap
        const maxClicks = Math.max(...heatmapData.map(d => d.clicks));
        
        heatmapData.forEach(point => {
            const intensity = point.clicks / maxClicks;
            const radius = 10 + (intensity * 20);
            const alpha = 0.3 + (intensity * 0.7);
            
            ctx.beginPath();
            ctx.arc(
                (point.x / window.innerWidth) * canvas.width,
                (point.y / window.innerHeight) * canvas.height,
                radius,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = `rgba(255, 65, 0, ${alpha})`;
            ctx.fill();
        });
        
        // Add legend
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText('Click Intensity Heatmap', 10, 20);
        ctx.fillText(`Max clicks: ${maxClicks}`, 10, 35);
    }

    drawBarChart(ctx, canvas, labels, data, colors, title) {
        const padding = 40;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);
        const barWidth = chartWidth / labels.length * 0.8;
        const maxValue = Math.max(...data);
        
        // Draw title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, canvas.width / 2, 20);
        
        // Draw bars
        labels.forEach((label, index) => {
            const barHeight = (data[index] / maxValue) * chartHeight;
            const x = padding + (index * (chartWidth / labels.length)) + ((chartWidth / labels.length) - barWidth) / 2;
            const y = canvas.height - padding - barHeight;
            
            // Draw bar
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw value on top of bar
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(data[index], x + barWidth / 2, y - 5);
            
            // Draw label
            ctx.save();
            ctx.translate(x + barWidth / 2, canvas.height - 10);
            ctx.rotate(-Math.PI / 4);
            ctx.textAlign = 'right';
            ctx.fillText(label, 0, 0);
            ctx.restore();
        });
    }

    drawPieChart(ctx, canvas, labels, data, colors) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        const total = data.reduce((sum, value) => sum + value, 0);
        
        let currentAngle = -Math.PI / 2;
        
        labels.forEach((label, index) => {
            const sliceAngle = (data[index] / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${label} (${data[index]})`, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
    }

    drawNoDataMessage(ctx, canvas, message) {
        ctx.fillStyle = '#666666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    }

    updateTables(report) {
        this.updateRecentEventsTable(report.events);
        this.updateTopContentTable(report.sharesByPlatform);
    }

    updateRecentEventsTable(events) {
        const tbody = document.querySelector('#recentEventsTable tbody');
        tbody.innerHTML = '';
        
        events.slice(-10).reverse().forEach(event => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${this.formatTime(event.timestamp)}</td>
                <td><span class="event-type ${event.type}">${this.formatEventType(event.type)}</span></td>
                <td>${this.formatEventDetails(event)}</td>
                <td>${event.userId.substring(0, 8)}...</td>
            `;
        });
    }

    updateTopContentTable(sharesByPlatform) {
        const tbody = document.querySelector('#topContentTable tbody');
        tbody.innerHTML = '';
        
        Object.entries(sharesByPlatform).forEach(([platform, data]) => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${platform}</td>
                <td>${data.successes}</td>
                <td>${data.successRate}</td>
                <td><span class="platform-badge ${platform}">${platform}</span></td>
            `;
        });
    }

    addActivityFeedItem(action, details, type = 'default') {
        const feed = document.getElementById('activityFeed');
        const item = document.createElement('div');
        item.className = `feed-item ${type}`;
        item.innerHTML = `
            <span class="feed-time">${this.formatTime(Date.now())}</span>
            <span class="feed-message">${action}: ${details}</span>
        `;
        
        feed.insertBefore(item, feed.firstChild);
        
        // Keep only last 20 items
        while (feed.children.length > 20) {
            feed.removeChild(feed.lastChild);
        }
        
        // Add animation
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 10);
    }

    exportData() {
        if (!window.analyticsTracker) return;
        
        const data = window.analyticsTracker.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        this.addActivityFeedItem('Data exported', 'Analytics data downloaded', 'success');
    }

    clearData() {
        if (confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
            if (window.analyticsTracker) {
                window.analyticsTracker.clearData();
            }
            this.refreshData();
            this.addActivityFeedItem('Data cleared', 'All analytics data has been cleared', 'info');
        }
    }

    // Utility methods
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString();
    }

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    formatEventType(type) {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    formatEventDetails(event) {
        switch (event.type) {
            case 'share_attempt':
            case 'share_success':
                return `${event.platform} - ${event.tool?.name || 'General'}`;
            case 'tool_interaction':
                return event.tool?.name || 'Unknown tool';
            case 'theme_change':
                return `${event.fromTheme} → ${event.toTheme}`;
            case 'click':
                return `${event.element?.tagName} (${event.coordinates?.x}, ${event.coordinates?.y})`;
            default:
                return 'N/A';
        }
    }
}

// Initialize Analytics Dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsDashboard = new AnalyticsDashboard();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsDashboard;
}