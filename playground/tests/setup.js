// Test Setup and Configuration
// This file sets up the testing environment for the dev tools enhancement project

// Global test configuration
const testConfig = {
    // Visual regression test settings
    visualRegression: {
        threshold: 0.1, // 10% difference threshold
        screenshotDir: './tests/screenshots',
        baselineDir: './tests/baselines',
        diffDir: './tests/diffs'
    },
    
    // Performance benchmark settings
    performance: {
        maxLoadTime: 3000, // 3 seconds
        maxFPS: 60,
        minFPS: 30,
        maxMemoryUsage: 100 * 1024 * 1024, // 100MB
        maxCPUUsage: 80 // 80%
    },
    
    // Cross-browser test settings
    browsers: [
        'chrome',
        'firefox', 
        'safari',
        'edge'
    ],
    
    // Mobile device settings
    mobileDevices: [
        'iPhone 12',
        'Samsung Galaxy S21',
        'iPad Pro',
        'Pixel 5'
    ],
    
    // Test timeouts
    timeouts: {
        default: 10000,
        animation: 5000,
        network: 15000
    }
};

// Test utilities
class TestUtils {
    static async waitForAnimation(element, timeout = testConfig.timeouts.animation) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkAnimation = () => {
                const computedStyle = window.getComputedStyle(element);
                const isAnimating = computedStyle.animationName !== 'none' || 
                                  computedStyle.transitionProperty !== 'none';
                
                if (!isAnimating) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Animation timeout'));
                } else {
                    requestAnimationFrame(checkAnimation);
                }
            };
            
            checkAnimation();
        });
    }
    
    static async measurePerformance(testFunction, iterations = 10) {
        const results = [];
        
        for (let i = 0; i < iterations; i++) {
            const startTime = performance.now();
            await testFunction();
            const endTime = performance.now();
            results.push(endTime - startTime);
        }
        
        return {
            average: results.reduce((a, b) => a + b) / results.length,
            min: Math.min(...results),
            max: Math.max(...results),
            results
        };
    }
    
    static async captureScreenshot(element, filename) {
        if (typeof html2canvas !== 'undefined') {
            const canvas = await html2canvas(element);
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL();
            link.click();
            return canvas.toDataURL();
        }
        return null;
    }
    
    static simulateTouch(element, type = 'touchstart', coordinates = null) {
        const rect = element.getBoundingClientRect();
        const x = coordinates?.x || rect.left + rect.width / 2;
        const y = coordinates?.y || rect.top + rect.height / 2;
        
        const touchEvent = new TouchEvent(type, {
            touches: [{
                clientX: x,
                clientY: y,
                target: element
            }],
            bubbles: true,
            cancelable: true
        });
        
        element.dispatchEvent(touchEvent);
    }
    
    static async checkAccessibility(element) {
        const issues = [];
        
        // Check for alt text on images
        const images = element.querySelectorAll('img');
        images.forEach(img => {
            if (!img.alt) {
                issues.push(`Image missing alt text: ${img.src}`);
            }
        });
        
        // Check for proper heading hierarchy
        const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > lastLevel + 1) {
                issues.push(`Heading hierarchy skip: ${heading.tagName} after h${lastLevel}`);
            }
            lastLevel = level;
        });
        
        // Check for keyboard accessibility
        const interactiveElements = element.querySelectorAll('button, a, input, select, textarea');
        interactiveElements.forEach(el => {
            if (el.tabIndex < 0 && !el.disabled) {
                issues.push(`Interactive element not keyboard accessible: ${el.tagName}`);
            }
        });
        
        // Check color contrast (simplified)
        const textElements = element.querySelectorAll('*');
        textElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const backgroundColor = style.backgroundColor;
            
            if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
                // Simplified contrast check - in real implementation would use proper contrast ratio calculation
                const colorLuminance = this.getLuminance(color);
                const bgLuminance = this.getLuminance(backgroundColor);
                const contrast = (Math.max(colorLuminance, bgLuminance) + 0.05) / (Math.min(colorLuminance, bgLuminance) + 0.05);
                
                if (contrast < 4.5) {
                    issues.push(`Low color contrast detected on element: ${el.tagName}`);
                }
            }
        });
        
        return issues;
    }
    
    static getLuminance(color) {
        // Simplified luminance calculation
        // In real implementation, would properly parse RGB values and calculate luminance
        const rgb = color.match(/\d+/g);
        if (!rgb) return 0;
        
        const [r, g, b] = rgb.map(val => {
            const normalized = parseInt(val) / 255;
            return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    
    static async measureFPS(duration = 1000) {
        return new Promise(resolve => {
            let frames = 0;
            const startTime = performance.now();
            
            function countFrame() {
                frames++;
                const currentTime = performance.now();
                
                if (currentTime - startTime < duration) {
                    requestAnimationFrame(countFrame);
                } else {
                    const fps = frames / (duration / 1000);
                    resolve(fps);
                }
            }
            
            requestAnimationFrame(countFrame);
        });
    }
    
    static getMemoryUsage() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }
}

// Export for use in tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testConfig, TestUtils };
} else {
    window.testConfig = testConfig;
    window.TestUtils = TestUtils;
}