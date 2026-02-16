// Performance Benchmark Tests
// Tests to measure and validate performance metrics across different scenarios

class PerformanceBenchmarkTests {
    constructor() {
        this.testResults = [];
        this.performanceMetrics = {
            loadTime: [],
            fps: [],
            memoryUsage: [],
            animationPerformance: [],
            interactionLatency: []
        };
    }

    async runAllTests() {
        console.log('⚡ Starting Performance Benchmark Tests...');

        try {
            await this.testPageLoadPerformance();
            await this.testAnimationPerformance();
            await this.testMemoryUsage();
            await this.testInteractionLatency();
            await this.testScrollPerformance();
            await this.testThemeTransitionPerformance();
            await this.testMobilePerformance();

            this.generatePerformanceReport();
            return this.testResults;
        } catch (error) {
            console.error('Performance benchmark tests failed:', error);
            throw error;
        }
    }

    async testPageLoadPerformance() {
        console.log('Testing page load performance...');

        const loadMetrics = {
            domContentLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            totalLoadTime: 0
        };

        // Measure DOM Content Loaded
        const domLoadStart = performance.now();
        await this.waitForDOMReady();
        loadMetrics.domContentLoaded = performance.now() - domLoadStart;

        // Get paint metrics from Performance API
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
            if (entry.name === 'first-paint') {
                loadMetrics.firstPaint = entry.startTime;
            } else if (entry.name === 'first-contentful-paint') {
                loadMetrics.firstContentfulPaint = entry.startTime;
            }
        });

        // Measure LCP if available
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                loadMetrics.largestContentfulPaint = lastEntry.startTime;
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // Measure total load time including all resources
        const totalLoadStart = performance.now();
        await this.waitForAllResources();
        loadMetrics.totalLoadTime = performance.now() - totalLoadStart;

        // Validate against benchmarks
        const passed =
            loadMetrics.domContentLoaded < testConfig.performance.maxLoadTime &&
            loadMetrics.totalLoadTime < testConfig.performance.maxLoadTime * 2;

        this.testResults.push({
            test: 'Page Load Performance',
            passed: passed,
            metrics: loadMetrics,
            benchmarks: {
                maxDOMLoad: testConfig.performance.maxLoadTime,
                maxTotalLoad: testConfig.performance.maxLoadTime * 2
            }
        });

        this.performanceMetrics.loadTime.push(loadMetrics);
    }

    async testAnimationPerformance() {
        console.log('Testing animation performance...');

        const animationTests = [
            { name: 'Matrix Background', element: '#matrixCanvas', duration: 2000 },
            { name: 'Particle System', element: '#particleCanvas', duration: 2000 },
            { name: 'Feature Card Hover', element: '.feature', trigger: 'hover', duration: 1000 },
            { name: 'Theme Transition', element: 'body', trigger: 'themeChange', duration: 1000 }
        ];

        for (const test of animationTests) {
            const element = document.querySelector(test.element);
            if (element) {
                // Measure FPS during animation
                const fpsResults = await this.measureAnimationFPS(element, test, test.duration);

                // Measure frame drops
                const frameDrops = fpsResults.filter(fps => fps < testConfig.performance.minFPS).length;
                const averageFPS = fpsResults.reduce((a, b) => a + b, 0) / fpsResults.length;

                const passed =
                    averageFPS >= testConfig.performance.minFPS &&
                    frameDrops / fpsResults.length < 0.1; // Less than 10% frame drops

                this.testResults.push({
                    test: `Animation Performance - ${test.name}`,
                    passed: passed,
                    metrics: {
                        averageFPS: averageFPS,
                        minFPS: Math.min(...fpsResults),
                        maxFPS: Math.max(...fpsResults),
                        frameDrops: frameDrops,
                        frameDropPercentage: (frameDrops / fpsResults.length * 100).toFixed(2)
                    }
                });

                this.performanceMetrics.animationPerformance.push({
                    name: test.name,
                    fps: fpsResults,
                    average: averageFPS
                });
            }
        }
    }

    async testMemoryUsage() {
        console.log('Testing memory usage...');

        const initialMemory = TestUtils.getMemoryUsage();

        // Perform memory-intensive operations
        const memoryTests = [
            { name: 'Theme Switching', action: () => this.performThemeSwitching() },
            { name: 'Modal Operations', action: () => this.performModalOperations() },
            { name: 'Animation Stress', action: () => this.performAnimationStress() },
            { name: 'Script Marketplace', action: () => this.performMarketplaceOperations() }
        ];

        for (const test of memoryTests) {
            const beforeMemory = TestUtils.getMemoryUsage();

            await test.action();

            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }

            const afterMemory = TestUtils.getMemoryUsage();

            if (beforeMemory && afterMemory) {
                const memoryIncrease = afterMemory.used - beforeMemory.used;
                const passed = memoryIncrease < testConfig.performance.maxMemoryUsage;

                this.testResults.push({
                    test: `Memory Usage - ${test.name}`,
                    passed: passed,
                    metrics: {
                        before: beforeMemory,
                        after: afterMemory,
                        increase: memoryIncrease,
                        increaseFormatted: this.formatBytes(memoryIncrease)
                    }
                });

                this.performanceMetrics.memoryUsage.push({
                    test: test.name,
                    increase: memoryIncrease
                });
            }
        }
    }

    async testInteractionLatency() {
        console.log('Testing interaction latency...');

        const interactionTests = [
            { name: 'Button Click', selector: '.btn', event: 'click' },
            { name: 'Theme Toggle', selector: '.theme-toggle', event: 'click' },
            { name: 'Feature Card Hover', selector: '.feature', event: 'mouseenter' },
            { name: 'Script Card Click', selector: '.script-card', event: 'click' },
            { name: 'Modal Close', selector: '.modal-close', event: 'click' }
        ];

        for (const test of interactionTests) {
            const element = document.querySelector(test.selector);
            if (element) {
                const latencies = [];

                // Test multiple times for accuracy
                for (let i = 0; i < 10; i++) {
                    const latency = await this.measureInteractionLatency(element, test.event);
                    latencies.push(latency);

                    // Reset state between tests
                    await this.resetInteractionState();
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
                const maxAcceptableLatency = 100; // 100ms

                const passed = averageLatency < maxAcceptableLatency;

                this.testResults.push({
                    test: `Interaction Latency - ${test.name}`,
                    passed: passed,
                    metrics: {
                        average: averageLatency.toFixed(2),
                        min: Math.min(...latencies).toFixed(2),
                        max: Math.max(...latencies).toFixed(2),
                        all: latencies
                    }
                });

                this.performanceMetrics.interactionLatency.push({
                    name: test.name,
                    latencies: latencies,
                    average: averageLatency
                });
            }
        }
    }

    async testScrollPerformance() {
        console.log('Testing scroll performance...');

        const scrollTests = [
            { name: 'Smooth Scroll', distance: 1000, duration: 1000 },
            { name: 'Fast Scroll', distance: 2000, duration: 500 },
            { name: 'Parallax Scroll', distance: 1500, duration: 1500 }
        ];

        for (const test of scrollTests) {
            const fpsData = [];
            const startTime = performance.now();

            // Start FPS monitoring
            const fpsMonitor = setInterval(() => {
                TestUtils.measureFPS(100).then(fps => fpsData.push(fps));
            }, 100);

            // Perform scroll
            await this.performSmoothScroll(test.distance, test.duration);

            // Stop monitoring
            clearInterval(fpsMonitor);

            const averageFPS = fpsData.reduce((a, b) => a + b, 0) / fpsData.length;
            const passed = averageFPS >= testConfig.performance.minFPS;

            this.testResults.push({
                test: `Scroll Performance - ${test.name}`,
                passed: passed,
                metrics: {
                    averageFPS: averageFPS.toFixed(2),
                    minFPS: Math.min(...fpsData).toFixed(2),
                    scrollDistance: test.distance,
                    duration: test.duration
                }
            });
        }
    }

    async testThemeTransitionPerformance() {
        console.log('Testing theme transition performance...');

        const themes = ['matrix', 'cyberpunk', 'hacker', 'neon'];

        for (let i = 0; i < themes.length; i++) {
            const fromTheme = themes[i];
            const toTheme = themes[(i + 1) % themes.length];

            // Set initial theme
            document.documentElement.setAttribute('data-theme', fromTheme);
            await new Promise(resolve => setTimeout(resolve, 100));

            // Measure transition performance
            const startTime = performance.now();
            const fpsData = [];

            const fpsMonitor = setInterval(() => {
                TestUtils.measureFPS(50).then(fps => fpsData.push(fps));
            }, 50);

            // Switch theme
            document.documentElement.setAttribute('data-theme', toTheme);

            // Wait for transition to complete
            await new Promise(resolve => setTimeout(resolve, 1000));

            clearInterval(fpsMonitor);
            const transitionTime = performance.now() - startTime;

            const averageFPS = fpsData.reduce((a, b) => a + b, 0) / fpsData.length;
            const passed = averageFPS >= testConfig.performance.minFPS && transitionTime < 1500;

            this.testResults.push({
                test: `Theme Transition - ${fromTheme} to ${toTheme}`,
                passed: passed,
                metrics: {
                    transitionTime: transitionTime.toFixed(2),
                    averageFPS: averageFPS.toFixed(2),
                    minFPS: Math.min(...fpsData).toFixed(2)
                }
            });
        }
    }

    async testMobilePerformance() {
        console.log('Testing mobile performance...');

        // Simulate mobile viewport
        const originalWidth = window.innerWidth;
        const originalHeight = window.innerHeight;

        // Set mobile viewport
        Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
        window.dispatchEvent(new Event('resize'));

        await new Promise(resolve => setTimeout(resolve, 500));

        // Test mobile-specific performance
        const mobileTests = [
            { name: 'Touch Interaction', action: () => this.performTouchInteractions() },
            { name: 'Mobile Animation', action: () => this.performMobileAnimations() },
            { name: 'Responsive Layout', action: () => this.performResponsiveTests() }
        ];

        for (const test of mobileTests) {
            const startTime = performance.now();
            const initialMemory = TestUtils.getMemoryUsage();

            await test.action();

            const endTime = performance.now();
            const finalMemory = TestUtils.getMemoryUsage();

            const executionTime = endTime - startTime;
            const memoryIncrease = finalMemory ? finalMemory.used - initialMemory.used : 0;

            const passed = executionTime < 2000 && memoryIncrease < testConfig.performance.maxMemoryUsage;

            this.testResults.push({
                test: `Mobile Performance - ${test.name}`,
                passed: passed,
                metrics: {
                    executionTime: executionTime.toFixed(2),
                    memoryIncrease: this.formatBytes(memoryIncrease)
                }
            });
        }

        // Restore original viewport
        Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: originalHeight, configurable: true });
        window.dispatchEvent(new Event('resize'));
    }

    // Helper methods
    async waitForDOMReady() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    async waitForAllResources() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    async measureAnimationFPS(element, test, duration) {
        const fpsData = [];
        const startTime = performance.now();

        // Trigger animation if needed
        if (test.trigger === 'hover') {
            element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        } else if (test.trigger === 'themeChange') {
            document.documentElement.setAttribute('data-theme', 'cyberpunk');
        }

        // Measure FPS during animation
        const measureFPS = () => {
            if (performance.now() - startTime < duration) {
                TestUtils.measureFPS(100).then(fps => {
                    fpsData.push(fps);
                    setTimeout(measureFPS, 100);
                });
            }
        };

        measureFPS();

        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, duration));

        // Reset animation state
        if (test.trigger === 'hover') {
            element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        }

        return fpsData;
    }

    async measureInteractionLatency(element, eventType) {
        return new Promise(resolve => {
            const startTime = performance.now();

            const handler = () => {
                const latency = performance.now() - startTime;
                element.removeEventListener(eventType, handler);
                resolve(latency);
            };

            element.addEventListener(eventType, handler);

            // Trigger the event
            const event = new MouseEvent(eventType, { bubbles: true });
            element.dispatchEvent(event);
        });
    }

    async performThemeSwitching() {
        const themes = ['matrix', 'cyberpunk', 'hacker', 'neon'];
        for (const theme of themes) {
            document.documentElement.setAttribute('data-theme', theme);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    async performModalOperations() {
        // Open and close various modals
        const triggers = ['.theme-toggle', '.cart-counter'];
        for (const trigger of triggers) {
            const element = document.querySelector(trigger);
            if (element) {
                element.click();
                await new Promise(resolve => setTimeout(resolve, 300));

                const closeBtn = document.querySelector('.modal-close, .cart-close, .theme-close');
                if (closeBtn) closeBtn.click();
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
    }

    async performAnimationStress() {
        // Trigger multiple animations simultaneously
        const features = document.querySelectorAll('.feature');
        features.forEach(feature => {
            feature.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        features.forEach(feature => {
            feature.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        });
    }

    async performMarketplaceOperations() {
        // Simulate marketplace interactions
        const scriptCards = document.querySelectorAll('.script-card');
        for (let i = 0; i < Math.min(5, scriptCards.length); i++) {
            scriptCards[i].click();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    async performSmoothScroll(distance, duration) {
        const startY = window.pageYOffset;
        const targetY = startY + distance;
        const startTime = performance.now();

        const scroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeInOutCubic = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const currentY = startY + (targetY - startY) * easeInOutCubic;
            window.scrollTo(0, currentY);

            if (progress < 1) {
                requestAnimationFrame(scroll);
            }
        };

        requestAnimationFrame(scroll);
        await new Promise(resolve => setTimeout(resolve, duration + 100));
    }

    async performTouchInteractions() {
        const touchElements = document.querySelectorAll('.feature, .btn, .script-card');
        for (let i = 0; i < Math.min(3, touchElements.length); i++) {
            TestUtils.simulateTouch(touchElements[i], 'touchstart');
            await new Promise(resolve => setTimeout(resolve, 50));
            TestUtils.simulateTouch(touchElements[i], 'touchend');
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    async performMobileAnimations() {
        // Test mobile-specific animations
        const mobileElements = document.querySelectorAll('.feature');
        mobileElements.forEach(el => {
            el.classList.add('touch-active');
        });

        await new Promise(resolve => setTimeout(resolve, 500));

        mobileElements.forEach(el => {
            el.classList.remove('touch-active');
        });
    }

    async performResponsiveTests() {
        // Test responsive layout changes
        const viewports = [375, 768, 1024];
        for (const width of viewports) {
            Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
            window.dispatchEvent(new Event('resize'));
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    async resetInteractionState() {
        // Reset any active states
        document.querySelectorAll('.active, .hover, .focus').forEach(el => {
            el.classList.remove('active', 'hover', 'focus');
        });

        // Close any open modals
        document.querySelectorAll('.modal-overlay.active, .theme-dropdown.active').forEach(el => {
            el.classList.remove('active');
        });
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    generatePerformanceReport() {
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        const passRate = (passed / total * 100).toFixed(1);

        console.log(`\n⚡ Performance Benchmark Report`);
        console.log(`===============================`);
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${total - passed}`);
        console.log(`Pass Rate: ${passRate}%`);

        // Performance summary
        const avgLoadTime = this.performanceMetrics.loadTime.length > 0
            ? this.performanceMetrics.loadTime[0].totalLoadTime.toFixed(2)
            : 'N/A';
        const avgFPS = this.performanceMetrics.animationPerformance.length > 0
            ? (this.performanceMetrics.animationPerformance.reduce((sum, item) => sum + item.average, 0) / this.performanceMetrics.animationPerformance.length).toFixed(2)
            : 'N/A';

        console.log(`\n📊 Performance Metrics:`);
        console.log(`Average Load Time: ${avgLoadTime}ms`);
        console.log(`Average Animation FPS: ${avgFPS}`);

        const failed = this.testResults.filter(r => !r.passed);
        if (failed.length > 0) {
            console.log(`\n❌ Failed Tests:`);
            failed.forEach(test => {
                console.log(`  - ${test.test}`);
                if (test.metrics) {
                    console.log(`    Metrics: ${JSON.stringify(test.metrics, null, 2)}`);
                }
            });
        }

        // Save detailed report
        const report = {
            summary: { total, passed, failed: total - passed, passRate },
            results: this.testResults,
            metrics: this.performanceMetrics,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('performance-benchmark-report', JSON.stringify(report));
        return report;
    }
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceBenchmarkTests;
} else {
    window.PerformanceBenchmarkTests = PerformanceBenchmarkTests;
}