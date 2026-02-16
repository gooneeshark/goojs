// Main Test Runner for Automated Testing Suite
// Orchestrates all test suites and generates comprehensive reports

class TestRunner {
    constructor() {
        this.testSuites = [];
        this.results = {
            visual: null,
            performance: null,
            compatibility: null,
            overall: null
        };
        this.startTime = null;
        this.endTime = null;
    }

    async runAllTests(options = {}) {
        console.log('🚀 Starting Automated Testing Suite...');
        console.log('=====================================');
        
        this.startTime = new Date();
        
        const {
            runVisual = true,
            runPerformance = true,
            runCompatibility = true,
            generateReport = true,
            saveResults = true
        } = options;

        try {
            // Initialize test suites
            if (runVisual && typeof VisualRegressionTests !== 'undefined') {
                console.log('\n📸 Initializing Visual Regression Tests...');
                const visualTests = new VisualRegressionTests();
                this.results.visual = a