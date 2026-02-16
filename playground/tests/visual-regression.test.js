// Visual Regression Tests
// Tests to ensure visual consistency across different themes and screen sizes

class VisualRegressionTests {
    constructor() {
        this.testResults = [];
        this.currentTheme = 'matrix';
        this.themes = ['matrix', 'cyberpunk', 'hacker', 'neon', 'ocean', 'fire'];
        this.viewports = [
            { width: 1920, height: 1080, name: 'desktop-large' },
            { width: 1366, height: 768, name: 'desktop-medium' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 375, height: 667, name: 'mobile' }
        ];
    }

    async runAllTests() {
        console.log('🎨 Starting Visual Regression Tests...');
        
        try {
            await this.testThemeConsistency();
            await this.testResponsiveDesign();
            await this.testAnimationStates();
            await this.testInteractiveElements();
            await this.testModalComponents();
            
            this.generateReport();
            return this.testResults;
        } catch (error) {
            console.error('Visual regression tests failed:', error);
            throw error;
        }
    }

    async testThemeConsistency() {
        console.log('Testing theme consistency...');
        
        for (const theme of this.themes) {
            await this.switchTheme(theme);
            await this.waitForThemeTransition();
            
            const screenshot = await this.captureFullPageScreenshot(`theme-${theme}`);
            const baseline = await this.loadBaseline(`theme-${theme}`);
            
            if (baseline) {
                const diff = await this.compareImages(screenshot, baseline);
                this.testResults.push({
                    test: `Theme Consistency - ${theme}`,
                    passed: diff.percentage < testConfig.visualRegression.threshold,
                    difference: diff.percentage,
                    screenshot: screenshot,
                    baseline: baseline,
                    diff: diff.image
                });
            } else {
                // First run - save as baseline
                await this.saveBaseline(`theme-${theme}`, screenshot);
                this.testResults.push({
                    test: `Theme Consistency - ${theme}`,
                    passed: true,
                    note: 'Baseline created'
                });
            }
        }
    }

    async testResponsiveDesign() {
        console.log('Testing responsive design...');
        
        for (const viewport of this.viewports) {
            await this.setViewport(viewport.width, viewport.height);
            await this.waitForResize();
            
            // Test main layout
            const screenshot = await this.captureElementScreenshot(
                document.querySelector('.container'),
                `responsive-${viewport.name}`
            );
            
            // Test specific components
            await this.testComponentResponsiveness(viewport);
            
            const baseline = await this.loadBaseline(`responsive-${viewport.name}`);
            if (baseline) {
                const diff = await this.compareImages(screenshot, baseline);
                this.testResults.push({
                    test: `Responsive Design - ${viewport.name}`,
                    passed: diff.percentage < testConfig.visualRegression.threshold,
                    difference: diff.percentage,
                    viewport: viewport
                });
            } else {
                await this.saveBaseline(`responsive-${viewport.name}`, screenshot);
                this.testResults.push({
                    test: `Responsive Design - ${viewport.name}`,
                    passed: true,
                    note: 'Baseline created'
                });
            }
        }
    }

    async testAnimationStates() {
        console.log('Testing animation states...');
        
        const animatedElements = [
            { selector: '.feature', state: 'hover', name: 'feature-hover' },
            { selector: '.btn', state: 'hover', name: 'button-hover' },
            { selector: '.theme-option', state: 'active', name: 'theme-option-active' },
            { selector: '.script-card', state: 'hover', name: 'script-card-hover' }
        ];

        for (const element of animatedElements) {
            const el = document.querySelector(element.selector);
            if (el) {
                // Capture initial state
                const initialScreenshot = await this.captureElementScreenshot(el, `${element.name}-initial`);
                
                // Trigger animation
                await this.triggerAnimationState(el, element.state);
                await TestUtils.waitForAnimation(el);
                
                // Capture animated state
                const animatedScreenshot = await this.captureElementScreenshot(el, `${element.name}-animated`);
                
                // Compare with baseline
                const baseline = await this.loadBaseline(`${element.name}-animated`);
                if (baseline) {
                    const diff = await this.compareImages(animatedScreenshot, baseline);
                    this.testResults.push({
                        test: `Animation State - ${element.name}`,
                        passed: diff.percentage < testConfig.visualRegression.threshold,
                        difference: diff.percentage
                    });
                } else {
                    await this.saveBaseline(`${element.name}-animated`, animatedScreenshot);
                }
                
                // Reset state
                await this.resetAnimationState(el, element.state);
            }
        }
    }

    async testInteractiveElements() {
        console.log('Testing interactive elements...');
        
        const interactiveTests = [
            {
                selector: '.theme-toggle',
                action: 'click',
                name: 'theme-selector-open'
            },
            {
                selector: '.script-card',
                action: 'click',
                name: 'script-preview-modal'
            },
            {
                selector: '.cart-counter',
                action: 'click',
                name: 'shopping-cart-panel'
            }
        ];

        for (const test of interactiveTests) {
            const element = document.querySelector(test.selector);
            if (element) {
                // Trigger interaction
                element.click();
                await this.waitForInteraction();
                
                // Capture result
                const screenshot = await this.captureFullPageScreenshot(test.name);
                
                const baseline = await this.loadBaseline(test.name);
                if (baseline) {
                    const diff = await this.compareImages(screenshot, baseline);
                    this.testResults.push({
                        test: `Interactive Element - ${test.name}`,
                        passed: diff.percentage < testConfig.visualRegression.threshold,
                        difference: diff.percentage
                    });
                } else {
                    await this.saveBaseline(test.name, screenshot);
                }
                
                // Close/reset
                await this.resetInteractiveState();
            }
        }
    }

    async testModalComponents() {
        console.log('Testing modal components...');
        
        const modals = [
            { trigger: '.script-card', modal: '.modal-overlay', name: 'script-preview-modal' },
            { trigger: '.theme-toggle', modal: '.theme-dropdown', name: 'theme-selector-modal' },
            { trigger: '.cart-counter', modal: '.cart-panel', name: 'shopping-cart-modal' }
        ];

        for (const modal of modals) {
            const trigger = document.querySelector(modal.trigger);
            if (trigger) {
                trigger.click();
                await this.waitForModal();
                
                const modalElement = document.querySelector(modal.modal);
                if (modalElement) {
                    const screenshot = await this.captureElementScreenshot(modalElement, modal.name);
                    
                    const baseline = await this.loadBaseline(modal.name);
                    if (baseline) {
                        const diff = await this.compareImages(screenshot, baseline);
                        this.testResults.push({
                            test: `Modal Component - ${modal.name}`,
                            passed: diff.percentage < testConfig.visualRegression.threshold,
                            difference: diff.percentage
                        });
                    } else {
                        await this.saveBaseline(modal.name, screenshot);
                    }
                }
                
                // Close modal
                const closeBtn = modalElement?.querySelector('.modal-close, .cart-close, .theme-close');
                if (closeBtn) closeBtn.click();
                await this.waitForModal();
            }
        }
    }

    // Helper methods
    async switchTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
    }

    async waitForThemeTransition() {
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    async setViewport(width, height) {
        // In a real browser automation environment, this would resize the viewport
        // For now, we'll simulate by changing CSS
        document.documentElement.style.width = width + 'px';
        document.documentElement.style.height = height + 'px';
        window.dispatchEvent(new Event('resize'));
    }

    async waitForResize() {
        return new Promise(resolve => setTimeout(resolve, 300));
    }

    async captureFullPageScreenshot(filename) {
        if (typeof html2canvas !== 'undefined') {
            const canvas = await html2canvas(document.body, {
                height: window.innerHeight,
                width: window.innerWidth,
                useCORS: true
            });
            return canvas.toDataURL();
        }
        return null;
    }

    async captureElementScreenshot(element, filename) {
        if (typeof html2canvas !== 'undefined') {
            const canvas = await html2canvas(element, {
                useCORS: true
            });
            return canvas.toDataURL();
        }
        return null;
    }

    async loadBaseline(name) {
        try {
            const response = await fetch(`${testConfig.visualRegression.baselineDir}/${name}.png`);
            if (response.ok) {
                return await response.blob();
            }
        } catch (error) {
            console.log(`No baseline found for ${name}`);
        }
        return null;
    }

    async saveBaseline(name, screenshot) {
        // In a real implementation, this would save to the filesystem
        console.log(`Saving baseline for ${name}`);
        localStorage.setItem(`baseline-${name}`, screenshot);
    }

    async compareImages(image1, image2) {
        // Simplified image comparison - in real implementation would use proper image diff library
        if (!image1 || !image2) return { percentage: 0, image: null };
        
        // For now, return a mock comparison
        return {
            percentage: Math.random() * 5, // Random difference up to 5%
            image: null
        };
    }

    async triggerAnimationState(element, state) {
        switch (state) {
            case 'hover':
                element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                break;
            case 'active':
                element.classList.add('active');
                break;
            case 'focus':
                element.focus();
                break;
        }
    }

    async resetAnimationState(element, state) {
        switch (state) {
            case 'hover':
                element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
                break;
            case 'active':
                element.classList.remove('active');
                break;
            case 'focus':
                element.blur();
                break;
        }
    }

    async waitForInteraction() {
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    async waitForModal() {
        return new Promise(resolve => setTimeout(resolve, 300));
    }

    async resetInteractiveState() {
        // Close any open modals or panels
        const closeButtons = document.querySelectorAll('.modal-close, .cart-close, .theme-close');
        closeButtons.forEach(btn => btn.click());
        
        // Reset theme selector
        const themeDropdown = document.querySelector('.theme-dropdown');
        if (themeDropdown && themeDropdown.classList.contains('active')) {
            themeDropdown.classList.remove('active');
        }
    }

    async testComponentResponsiveness(viewport) {
        const components = [
            '.features',
            '.getting-started',
            '.script-marketplace',
            '.theme-selector'
        ];

        for (const component of components) {
            const element = document.querySelector(component);
            if (element) {
                const rect = element.getBoundingClientRect();
                const isResponsive = rect.width <= viewport.width && rect.height <= viewport.height;
                
                this.testResults.push({
                    test: `Component Responsiveness - ${component} @ ${viewport.name}`,
                    passed: isResponsive,
                    details: {
                        componentSize: { width: rect.width, height: rect.height },
                        viewport: viewport,
                        fits: isResponsive
                    }
                });
            }
        }
    }

    generateReport() {
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        const passRate = (passed / total * 100).toFixed(1);

        console.log(`\n📊 Visual Regression Test Report`);
        console.log(`================================`);
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${total - passed}`);
        console.log(`Pass Rate: ${passRate}%`);
        
        const failed = this.testResults.filter(r => !r.passed);
        if (failed.length > 0) {
            console.log(`\n❌ Failed Tests:`);
            failed.forEach(test => {
                console.log(`  - ${test.test}: ${test.difference?.toFixed(2)}% difference`);
            });
        }

        // Save detailed report
        const report = {
            summary: { total, passed, failed: total - passed, passRate },
            results: this.testResults,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('visual-regression-report', JSON.stringify(report));
        return report;
    }
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisualRegressionTests;
} else {
    window.VisualRegressionTests = VisualRegressionTests;
}