// Gooscript Collection Management System
// ระบบจัดการคอลเลกชันสคริปต์สำหรับ Gooscript Extension

class GooscriptCollectionManager {
    constructor() {
        this.collection = [];
        this.collectionCount = 0;
        this.scriptData = this.initializeScriptData();
        this.init();
    }

    init() {
        this.updateCollectionDisplay();
        this.addEventListeners();
    }

    initializeScriptData() {
        return {
            'security-scanner': {
                name: 'Security Scanner Pro',
                category: 'security',
                demoScenario: {
                    title: '🔒 ทดสอบการสแกนความปลอดภัย',
                    description: 'เว็บไซต์นี้มีช่องโหว่ด้านความปลอดภัย ลองใช้ Security Scanner เพื่อค้นหา!',
                    setupDemo: function() {
                        // สร้างฟอร์มที่มีปัญหาความปลอดภัย
                        const demoForm = document.createElement('div');
                        demoForm.id = 'security-demo-area';
                        demoForm.style.cssText = `
                            position: fixed;
                            bottom: 20px;
                            left: 20px;
                            width: 300px;
                            background: rgba(255, 0, 0, 0.1);
                            border: 2px solid #ff4444;
                            border-radius: 10px;
                            padding: 20px;
                            z-index: 9999;
                            color: #fff;
                        `;
                        
                        demoForm.innerHTML = `
                            <h4 style="color: #ff4444; margin: 0 0 15px 0;">⚠️ Vulnerable Login Form</h4>
                            <form id="vulnerable-form" action="javascript:void(0)">
                                <input type="text" placeholder="Username" style="width: 100%; margin-bottom: 10px; padding: 8px; background: #333; border: 1px solid #666; color: #fff;">
                                <input type="password" placeholder="Password" style="width: 100%; margin-bottom: 10px; padding: 8px; background: #333; border: 1px solid #666; color: #fff;">
                                <button type="submit" style="width: 100%; padding: 10px; background: #ff4444; color: #fff; border: none; border-radius: 5px;">Login (Vulnerable)</button>
                            </form>
                            <p style="font-size: 0.8em; color: #ccc; margin-top: 10px;">
                                🚨 This form has security issues. Run the scanner to detect them!
                            </p>
                        `;
                        
                        document.body.appendChild(demoForm);
                        
                        // เพิ่ม cookies ที่ไม่ปลอดภัย
                        document.cookie = "session=abc123; path=/";
                        document.cookie = "user=admin; path=/";
                        
                        return demoForm;
                    },
                    cleanupDemo: function() {
                        const demoArea = document.getElementById('security-demo-area');
                        if (demoArea) demoArea.remove();
                        
                        const scannerPanel = document.getElementById('security-scanner-panel');
                        if (scannerPanel) scannerPanel.remove();
                    }
                },
                code: `// Security Scanner Pro - Advanced Security Analysis
(function() {
    console.log('🔒 Starting Security Scanner Pro...');
    
    const scanner = {
        vulnerabilities: [],
        
        init() {
            this.createUI();
            this.startScan();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'security-scanner-panel';
            panel.style.cssText = \`
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #ff4444;
                border-radius: 10px;
                padding: 15px;
                color: #ff4444;
                font-family: monospace;
                z-index: 10000;
                max-height: 400px;
                overflow-y: auto;
            \`;
            
            panel.innerHTML = \`
                <h3 style="margin: 0 0 10px 0; color: #ff4444;">🔒 Security Scanner</h3>
                <div id="scan-status">Initializing...</div>
                <div id="vulnerability-list"></div>
                <button onclick="this.parentElement.remove()" style="
                    background: #ff4444;
                    color: #000;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                    margin-top: 10px;
                ">Close</button>
            \`;
            
            document.body.appendChild(panel);
        },
        
        startScan() {
            document.getElementById('scan-status').textContent = 'Scanning...';
            
            // Check HTTPS
            if (location.protocol !== 'https:') {
                this.addVulnerability('HIGH', 'Site not using HTTPS');
            }
            
            // Check for forms without CSRF protection
            const forms = document.querySelectorAll('form');
            forms.forEach((form, index) => {
                const csrfToken = form.querySelector('input[name*="csrf"], input[name*="token"]');
                if (!csrfToken) {
                    this.addVulnerability('MEDIUM', \`Form \${index + 1} missing CSRF protection\`);
                }
            });
            
            // Check cookies
            const cookies = document.cookie.split(';');
            cookies.forEach(cookie => {
                if (!cookie.includes('Secure') || !cookie.includes('HttpOnly')) {
                    this.addVulnerability('LOW', 'Insecure cookie detected');
                }
            });
            
            // Check for potential XSS
            const inputs = document.querySelectorAll('input[type="text"], textarea');
            if (inputs.length > 0) {
                this.addVulnerability('MEDIUM', \`\${inputs.length} input fields found - potential XSS targets\`);
            }
            
            this.displayResults();
        },
        
        addVulnerability(severity, description) {
            this.vulnerabilities.push({ severity, description });
        },
        
        displayResults() {
            const statusEl = document.getElementById('scan-status');
            const listEl = document.getElementById('vulnerability-list');
            
            statusEl.textContent = \`Scan completed - \${this.vulnerabilities.length} issues found\`;
            
            if (this.vulnerabilities.length === 0) {
                listEl.innerHTML = '<div style="color: #00ff41;">✅ No vulnerabilities detected</div>';
            } else {
                listEl.innerHTML = this.vulnerabilities.map(vuln => \`
                    <div style="margin: 5px 0; padding: 5px; background: rgba(255, 68, 68, 0.1); border-radius: 3px;">
                        <strong>\${vuln.severity}:</strong> \${vuln.description}
                    </div>
                \`).join('');
                
                // แสดงข้อความแจ้งเตือนเมื่อพบช่องโหว่
                setTimeout(() => {
                    alert('🚨 พบช่องโหว่ด้านความปลอดภัย ' + this.vulnerabilities.length + ' รายการ!\\n\\nSecurity Scanner ช่วยให้คุณตรวจพบปัญหาได้อย่างรวดเร็ว!');
                }, 1000);
            }
        }
    };
    
    scanner.init();
})();`
            },
            'form-filler': {
                name: 'Form Auto Filler',
                category: 'automation',
                demoScenario: {
                    title: '⚡ ทดสอบการกรอกฟอร์มอัตโนมัติ',
                    description: 'มีฟอร์มยาวๆ ที่ต้องกรอก ลองใช้ Form Filler เพื่อกรอกให้อัตโนมัติ!',
                    setupDemo: function() {
                        const demoForm = document.createElement('div');
                        demoForm.id = 'form-filler-demo-area';
                        demoForm.style.cssText = `
                            position: fixed;
                            top: 50%;
                            right: 20px;
                            transform: translateY(-50%);
                            width: 320px;
                            background: rgba(0, 255, 65, 0.1);
                            border: 2px solid #00ff41;
                            border-radius: 10px;
                            padding: 20px;
                            z-index: 9999;
                            color: #fff;
                            max-height: 80vh;
                            overflow-y: auto;
                        `;
                        
                        demoForm.innerHTML = `
                            <h4 style="color: #00ff41; margin: 0 0 15px 0;">📝 Registration Form</h4>
                            <form id="demo-registration-form">
                                <input type="text" name="firstName" placeholder="First Name" style="width: 100%; margin-bottom: 8px; padding: 8px; background: #333; border: 1px solid #666; color: #fff;" required>
                                <input type="text" name="lastName" placeholder="Last Name" style="width: 100%; margin-bottom: 8px; padding: 8px; background: #333; border: 1px solid #666; color: #fff;" required>
                                <input type="email" name="email" placeholder="Email Address" style="width: 100%; margin-bottom: 8px; padding: 8px; background: #333; border: 1px solid #666; color: #fff;" required>
                                <input type="tel" name="phone" placeholder="Phone Number" style="width: 100%; margin-bottom: 8px; padding: 8px; background: #333; border: 1px solid #666; color: #fff;" required>
                                <input type="text" name="company" placeholder="Company Name" style="width: 100%; margin-bottom: 8px; padding: 8px; background: #333; border: 1px solid #666; color: #fff;">
                                <input type="text" name="address" placeholder="Address" style="width: 100%; margin-bottom: 8px; padding: 8px; background: #333; border: 1px solid #666; color: #fff;">
                                <input type="text" name="city" placeholder="City" style="width: 100%; margin-bottom: 8px; padding: 8px; background: #333; border: 1px solid #666; color: #fff;">
                                <button type="submit" id="submit-btn" disabled style="
                                    width: 100%; 
                                    padding: 10px; 
                                    background: #666; 
                                    color: #999; 
                                    border: none; 
                                    border-radius: 5px;
                                    cursor: not-allowed;
                                ">Submit (Disabled)</button>
                            </form>
                            <p style="font-size: 0.8em; color: #ccc; margin-top: 10px;">
                                😴 Too many fields to fill manually? Use Form Filler to auto-complete!
                            </p>
                        `;
                        
                        document.body.appendChild(demoForm);
                        
                        // เพิ่ม event listener เพื่อเช็คว่าฟอร์มกรอกครบหรือยัง
                        const form = document.getElementById('demo-registration-form');
                        const submitBtn = document.getElementById('submit-btn');
                        
                        form.addEventListener('input', function() {
                            const requiredFields = form.querySelectorAll('input[required]');
                            let allFilled = true;
                            
                            requiredFields.forEach(field => {
                                if (!field.value.trim()) {
                                    allFilled = false;
                                }
                            });
                            
                            if (allFilled) {
                                submitBtn.disabled = false;
                                submitBtn.style.background = '#00ff41';
                                submitBtn.style.color = '#000';
                                submitBtn.style.cursor = 'pointer';
                                submitBtn.textContent = 'Submit (Ready!)';
                            }
                        });
                        
                        form.addEventListener('submit', function(e) {
                            e.preventDefault();
                            alert('🎉 ยินดีด้วย! คุณกรอกฟอร์มสำเร็จแล้ว!\n\nForm Filler ช่วยให้คุณประหยัดเวลาได้มาก!');
                        });
                        
                        return demoForm;
                    },
                    cleanupDemo: function() {
                        const demoArea = document.getElementById('form-filler-demo-area');
                        if (demoArea) demoArea.remove();
                        
                        const fillerPanel = document.getElementById('form-filler-panel');
                        if (fillerPanel) fillerPanel.remove();
                    }
                },
                code: `// Form Auto Filler - Intelligent Form Automation
(function() {
    console.log('⚡ Starting Form Auto Filler...');
    
    const formFiller = {
        profiles: {
            developer: {
                name: 'John Developer',
                email: 'john.dev@example.com',
                phone: '+1-555-0123',
                company: 'Tech Corp',
                title: 'Senior Developer'
            },
            tester: {
                name: 'Jane Tester',
                email: 'jane.test@example.com',
                phone: '+1-555-0456',
                company: 'QA Solutions',
                title: 'QA Engineer'
            }
        },
        
        init() {
            this.createUI();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'form-filler-panel';
            panel.style.cssText = \`
                position: fixed;
                top: 20px;
                left: 20px;
                width: 280px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #00ff41;
                border-radius: 10px;
                padding: 15px;
                color: #00ff41;
                font-family: monospace;
                z-index: 10000;
            \`;
            
            panel.innerHTML = \`
                <h3 style="margin: 0 0 10px 0;">⚡ Form Auto Filler</h3>
                <select id="profile-select" style="width: 100%; margin-bottom: 10px; padding: 5px; background: #000; color: #00ff41; border: 1px solid #00ff41;">
                    <option value="developer">Developer Profile</option>
                    <option value="tester">Tester Profile</option>
                </select>
                <button onclick="formFiller.fillAllForms()" style="
                    width: 100%;
                    background: #00ff41;
                    color: #000;
                    border: none;
                    padding: 8px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-bottom: 5px;
                ">Fill All Forms</button>
                <button onclick="this.parentElement.remove()" style="
                    width: 100%;
                    background: #ff4444;
                    color: #fff;
                    border: none;
                    padding: 5px;
                    border-radius: 3px;
                    cursor: pointer;
                ">Close</button>
            \`;
            
            document.body.appendChild(panel);
        },
        
        fillAllForms() {
            const selectedProfile = document.getElementById('profile-select').value;
            const profile = this.profiles[selectedProfile];
            
            document.querySelectorAll('form').forEach(form => {
                this.fillForm(form, profile);
            });
            
            console.log(\`✅ Forms filled with \${selectedProfile} profile\`);
            
            // แสดงข้อความแจ้งเตือนเมื่อกรอกฟอร์มเสร็จ
            setTimeout(() => {
                alert('⚡ ยอดเยิ่ยม! Form Filler กรอกข้อมูลให้คุณเรียบร้อยแล้ว!\\n\\nตอนนี้คุณสามารถกดปุ่ม Submit ได้แล้ว!');
            }, 500);
        },
        
        fillForm(form, profile) {
            // Smart field detection and filling
            const nameField = form.querySelector('input[name*="name"], input[id*="name"], input[placeholder*="name"]');
            const emailField = form.querySelector('input[type="email"], input[name*="email"], input[id*="email"]');
            const phoneField = form.querySelector('input[type="tel"], input[name*="phone"], input[id*="phone"]');
            const companyField = form.querySelector('input[name*="company"], input[id*="company"]');
            
            if (nameField) {
                nameField.value = profile.name;
                nameField.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (emailField) {
                emailField.value = profile.email;
                emailField.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (phoneField) {
                phoneField.value = profile.phone;
                phoneField.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (companyField) {
                companyField.value = profile.company;
                companyField.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    };
    
    window.formFiller = formFiller;
    formFiller.init();
})();`
            },
            'data-extractor': {
                name: 'Data Extractor',
                category: 'data',
                demoScenario: {
                    title: '📊 ทดสอบการดึงข้อมูล',
                    description: 'หน้าเว็บนี้มีข้อมูลมากมาย ลองใช้ Data Extractor เพื่อดึงข้อมูลทั้งหมด!',
                    setupDemo: function() {
                        const demoArea = document.createElement('div');
                        demoArea.id = 'data-extractor-demo-area';
                        demoArea.style.cssText = `
                            position: fixed;
                            top: 20px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 400px;
                            background: rgba(0, 255, 255, 0.1);
                            border: 2px solid #00ffff;
                            border-radius: 10px;
                            padding: 20px;
                            z-index: 9999;
                            color: #fff;
                        `;
                        
                        demoArea.innerHTML = `
                            <h4 style="color: #00ffff; margin: 0 0 15px 0;">📊 Sample Data Page</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div>
                                    <h5 style="color: #00ffff;">Products:</h5>
                                    <ul style="margin: 0; padding-left: 20px; font-size: 0.9em;">
                                        <li><a href="#product1">Laptop Pro X1</a> - $1299</li>
                                        <li><a href="#product2">Gaming Mouse</a> - $79</li>
                                        <li><a href="#product3">Mechanical Keyboard</a> - $149</li>
                                        <li><a href="#product4">4K Monitor</a> - $399</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 style="color: #00ffff;">Images:</h5>
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDBmZmZmIi8+Cjx0ZXh0IHg9IjIwIiB5PSIyNSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1nPC90ZXh0Pgo8L3N2Zz4K" alt="Product Image 1" style="width: 40px; height: 40px; margin: 2px;">
                                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZmY2NjAwIi8+Cjx0ZXh0IHg9IjIwIiB5PSIyNSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1nPC90ZXh0Pgo8L3N2Zz4K" alt="Product Image 2" style="width: 40px; height: 40px; margin: 2px;">
                                </div>
                            </div>
                            <div style="margin-top: 15px;">
                                <h5 style="color: #00ffff;">Contact Info:</h5>
                                <p style="margin: 5px 0; font-size: 0.9em;">Email: contact@example.com</p>
                                <p style="margin: 5px 0; font-size: 0.9em;">Phone: +1-555-0123</p>
                                <p style="margin: 5px 0; font-size: 0.9em;">Address: 123 Tech Street, Silicon Valley</p>
                            </div>
                            <button id="extract-challenge-btn" style="
                                width: 100%;
                                margin-top: 15px;
                                padding: 10px;
                                background: #666;
                                color: #999;
                                border: none;
                                border-radius: 5px;
                                cursor: not-allowed;
                            ">🏆 Claim Reward (Extract data first!)</button>
                            <p style="font-size: 0.8em; color: #ccc; margin-top: 10px;">
                                💡 Use Data Extractor to collect all links, images, and text data!
                            </p>
                        `;
                        
                        document.body.appendChild(demoArea);
                        return demoArea;
                    },
                    cleanupDemo: function() {
                        const demoArea = document.getElementById('data-extractor-demo-area');
                        if (demoArea) demoArea.remove();
                        
                        const extractorPanel = document.getElementById('data-extractor-panel');
                        if (extractorPanel) extractorPanel.remove();
                    }
                },
                code: `// Data Extractor - Advanced Web Data Extraction
(function() {
    console.log('📊 Starting Data Extractor...');
    
    const dataExtractor = {
        extractedData: {
            title: document.title,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            links: [],
            images: [],
            text: [],
            metadata: {}
        },
        
        init() {
            this.createUI();
            this.extractBasicData();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'data-extractor-panel';
            panel.style.cssText = \`
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 320px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #00ffff;
                border-radius: 10px;
                padding: 15px;
                color: #00ffff;
                font-family: monospace;
                z-index: 10000;
                max-height: 400px;
                overflow-y: auto;
            \`;
            
            panel.innerHTML = \`
                <h3 style="margin: 0 0 10px 0;">📊 Data Extractor</h3>
                <div id="extraction-stats">
                    <div>Links: <span id="links-count">0</span></div>
                    <div>Images: <span id="images-count">0</span></div>
                    <div>Text blocks: <span id="text-count">0</span></div>
                </div>
                <div style="margin: 10px 0;">
                    <button onclick="dataExtractor.extractLinks()" style="
                        background: #00ffff;
                        color: #000;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 3px;
                        cursor: pointer;
                        margin: 2px;
                    ">Extract Links</button>
                    <button onclick="dataExtractor.extractImages()" style="
                        background: #00ffff;
                        color: #000;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 3px;
                        cursor: pointer;
                        margin: 2px;
                    ">Extract Images</button>
                    <button onclick="dataExtractor.extractText()" style="
                        background: #00ffff;
                        color: #000;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 3px;
                        cursor: pointer;
                        margin: 2px;
                    ">Extract Text</button>
                    <button onclick="dataExtractor.exportData()" style="
                        background: #ffff00;
                        color: #000;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 3px;
                        cursor: pointer;
                        margin: 2px;
                    ">Export JSON</button>
                </div>
                <button onclick="this.parentElement.remove()" style="
                    width: 100%;
                    background: #ff4444;
                    color: #fff;
                    border: none;
                    padding: 5px;
                    border-radius: 3px;
                    cursor: pointer;
                ">Close</button>
            \`;
            
            document.body.appendChild(panel);
        },
        
        extractBasicData() {
            // Extract meta tags
            document.querySelectorAll('meta').forEach(meta => {
                const name = meta.getAttribute('name') || meta.getAttribute('property');
                const content = meta.getAttribute('content');
                if (name && content) {
                    this.extractedData.metadata[name] = content;
                }
            });
        },
        
        extractLinks() {
            this.extractedData.links = [];
            document.querySelectorAll('a[href]').forEach(link => {
                this.extractedData.links.push({
                    text: link.textContent.trim(),
                    url: link.href,
                    target: link.target || '_self'
                });
            });
            document.getElementById('links-count').textContent = this.extractedData.links.length;
            console.log(\`📊 Extracted \${this.extractedData.links.length} links\`);
        },
        
        extractImages() {
            this.extractedData.images = [];
            document.querySelectorAll('img[src]').forEach(img => {
                this.extractedData.images.push({
                    src: img.src,
                    alt: img.alt || 'No alt text',
                    width: img.naturalWidth || img.width,
                    height: img.naturalHeight || img.height
                });
            });
            document.getElementById('images-count').textContent = this.extractedData.images.length;
            console.log(\`📊 Extracted \${this.extractedData.images.length} images\`);
        },
        
        extractText() {
            this.extractedData.text = [];
            document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span').forEach(el => {
                const text = el.textContent.trim();
                if (text.length > 20 && !el.querySelector('*')) { // Only leaf nodes with substantial text
                    this.extractedData.text.push({
                        tag: el.tagName.toLowerCase(),
                        text: text,
                        length: text.length
                    });
                }
            });
            document.getElementById('text-count').textContent = this.extractedData.text.length;
            console.log(\`📊 Extracted \${this.extractedData.text.length} text blocks\`);
        },
        
        exportData() {
            const dataStr = JSON.stringify(this.extractedData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = \`extracted-data-\${Date.now()}.json\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('📊 Data exported successfully');
            
            // เปิดใช้งานปุ่มรางวัล
            const rewardBtn = document.getElementById('extract-challenge-btn');
            if (rewardBtn) {
                rewardBtn.disabled = false;
                rewardBtn.style.background = 'linear-gradient(45deg, #00ff41, #00cc33)';
                rewardBtn.style.color = '#000';
                rewardBtn.style.cursor = 'pointer';
                rewardBtn.textContent = '🏆 Claim Your Data Reward!';
            }
            
            alert('📊 ยอดเยิ่ยม! Data Extractor ดึงข้อมูลและส่งออกไฟล์เรียบร้อยแล้ว!\\n\\nตอนนี้คุณสามารถรับรางวัลได้แล้ว!');
        }
    };
    
    window.dataExtractor = dataExtractor;
    dataExtractor.init();
})();`
            },
            'performance-monitor': {
                name: 'Performance Monitor',
                category: 'performance',
                demoScenario: {
                    title: '🚀 ทดสอบการวิเคราะห์ประสิทธิภาพ',
                    description: 'เว็บไซต์นี้อาจมีปัญหาด้านประสิทธิภาพ ลองใช้ Performance Monitor เพื่อตรวจสอบ!',
                    setupDemo: function() {
                        const demoArea = document.createElement('div');
                        demoArea.id = 'performance-demo-area';
                        demoArea.style.cssText = `
                            position: fixed;
                            bottom: 20px;
                            right: 20px;
                            width: 350px;
                            background: rgba(255, 255, 0, 0.1);
                            border: 2px solid #ffff00;
                            border-radius: 10px;
                            padding: 20px;
                            z-index: 9999;
                            color: #fff;
                        `;
                        
                        demoArea.innerHTML = `
                            <h4 style="color: #ffff00; margin: 0 0 15px 0;">⚡ Performance Dashboard</h4>
                            <div style="display: grid; gap: 10px;">
                                <div style="background: rgba(255, 68, 68, 0.2); padding: 10px; border-radius: 5px;">
                                    <strong style="color: #ff4444;">🐌 Slow Loading</strong>
                                    <p style="margin: 5px 0 0 0; font-size: 0.9em;">Page took 4.2 seconds to load</p>
                                </div>
                                <div style="background: rgba(255, 165, 0, 0.2); padding: 10px; border-radius: 5px;">
                                    <strong style="color: #ffa500;">⚠️ Too Many Resources</strong>
                                    <p style="margin: 5px 0 0 0; font-size: 0.9em;">127 HTTP requests detected</p>
                                </div>
                                <div style="background: rgba(255, 68, 68, 0.2); padding: 10px; border-radius: 5px;">
                                    <strong style="color: #ff4444;">🏗️ Heavy DOM</strong>
                                    <p style="margin: 5px 0 0 0; font-size: 0.9em;">2,847 DOM elements found</p>
                                </div>
                            </div>
                            <button id="performance-optimize-btn" style="
                                width: 100%;
                                margin-top: 15px;
                                padding: 10px;
                                background: #666;
                                color: #999;
                                border: none;
                                border-radius: 5px;
                                cursor: not-allowed;
                            ">🎯 Get Optimization Tips (Run monitor first!)</button>
                            <p style="font-size: 0.8em; color: #ccc; margin-top: 10px;">
                                📈 Run Performance Monitor to get detailed analysis and suggestions!
                            </p>
                        `;
                        
                        document.body.appendChild(demoArea);
                        return demoArea;
                    },
                    cleanupDemo: function() {
                        const demoArea = document.getElementById('performance-demo-area');
                        if (demoArea) demoArea.remove();
                        
                        const monitorPanel = document.getElementById('performance-panel');
                        if (monitorPanel) monitorPanel.remove();
                    }
                },
                code: `// Performance Monitor - Website Performance Analysis
(function() {
    console.log('🚀 Starting Performance Monitor...');
    
    const performanceMonitor = {
        metrics: {},
        
        init() {
            this.createUI();
            this.analyzePerformance();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'performance-panel';
            panel.style.cssText = \`
                position: fixed;
                top: 50%;
                left: 20px;
                transform: translateY(-50%);
                width: 300px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #ffff00;
                border-radius: 10px;
                padding: 15px;
                color: #ffff00;
                font-family: monospace;
                z-index: 10000;
            \`;
            
            panel.innerHTML = \`
                <h3 style="margin: 0 0 10px 0;">🚀 Performance Monitor</h3>
                <div id="performance-score" style="font-size: 1.2em; margin-bottom: 10px;">Analyzing...</div>
                <div id="metrics-display"></div>
                <div id="suggestions" style="margin-top: 10px; font-size: 0.9em;"></div>
                <button onclick="this.parentElement.remove()" style="
                    width: 100%;
                    background: #ff4444;
                    color: #fff;
                    border: none;
                    padding: 5px;
                    border-radius: 3px;
                    cursor: pointer;
                    margin-top: 10px;
                ">Close</button>
            \`;
            
            document.body.appendChild(panel);
        },
        
        analyzePerformance() {
            // Analyze load time
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.metrics.loadTime = loadTime;
            
            // Count resources
            const resources = performance.getEntriesByType('resource');
            this.metrics.resourceCount = resources.length;
            
            // Analyze DOM
            this.metrics.domElements = document.querySelectorAll('*').length;
            
            // Check images
            const images = document.querySelectorAll('img');
            this.metrics.imageCount = images.length;
            
            // Check scripts
            const scripts = document.querySelectorAll('script');
            this.metrics.scriptCount = scripts.length;
            
            // Calculate performance score
            this.calculateScore();
            this.displayResults();
            this.generateSuggestions();
        },
        
        calculateScore() {
            let score = 100;
            
            // Deduct points for slow load time
            if (this.metrics.loadTime > 3000) score -= 25;
            else if (this.metrics.loadTime > 2000) score -= 15;
            else if (this.metrics.loadTime > 1000) score -= 5;
            
            // Deduct points for too many resources
            if (this.metrics.resourceCount > 100) score -= 20;
            else if (this.metrics.resourceCount > 50) score -= 10;
            
            // Deduct points for too many DOM elements
            if (this.metrics.domElements > 1500) score -= 15;
            else if (this.metrics.domElements > 1000) score -= 8;
            
            // Deduct points for too many images
            if (this.metrics.imageCount > 50) score -= 10;
            else if (this.metrics.imageCount > 20) score -= 5;
            
            this.metrics.score = Math.max(0, score);
        },
        
        displayResults() {
            const scoreEl = document.getElementById('performance-score');
            const metricsEl = document.getElementById('metrics-display');
            
            const scoreColor = this.metrics.score > 80 ? '#00ff41' : this.metrics.score > 60 ? '#ffff00' : '#ff4444';
            scoreEl.innerHTML = \`<span style="color: \${scoreColor}">Score: \${this.metrics.score}/100</span>\`;
            
            metricsEl.innerHTML = \`
                <div>Load Time: \${this.metrics.loadTime}ms</div>
                <div>Resources: \${this.metrics.resourceCount}</div>
                <div>DOM Elements: \${this.metrics.domElements}</div>
                <div>Images: \${this.metrics.imageCount}</div>
                <div>Scripts: \${this.metrics.scriptCount}</div>
            \`;
        },
        
        generateSuggestions() {
            const suggestions = [];
            
            if (this.metrics.loadTime > 2000) {
                suggestions.push('⚡ Optimize load time - compress resources');
            }
            
            if (this.metrics.resourceCount > 50) {
                suggestions.push('📦 Reduce HTTP requests');
            }
            
            if (this.metrics.domElements > 1000) {
                suggestions.push('🏗️ Simplify DOM structure');
            }
            
            if (this.metrics.imageCount > 20) {
                suggestions.push('🖼️ Optimize images - use WebP, lazy loading');
            }
            
            if (this.metrics.scriptCount > 10) {
                suggestions.push('📜 Minimize and combine JavaScript files');
            }
            
            document.getElementById('suggestions').innerHTML = 
                suggestions.length > 0 ? 
                '<strong>Suggestions:</strong><br>' + suggestions.join('<br>') :
                '<span style="color: #00ff41;">✅ Performance looks good!</span>';
            
            // เปิดใช้งานปุ่มรางวัล
            const optimizeBtn = document.getElementById('performance-optimize-btn');
            if (optimizeBtn) {
                optimizeBtn.disabled = false;
                optimizeBtn.style.background = 'linear-gradient(45deg, #ffff00, #cccc00)';
                optimizeBtn.style.color = '#000';
                optimizeBtn.style.cursor = 'pointer';
                optimizeBtn.textContent = '🎯 Get Your Optimization Report!';
            }
            
            setTimeout(() => {
                alert('🚀 Performance Monitor วิเคราะห์เสร็จแล้ว!\\n\\nคะแนนประสิทธิภาพ: ' + this.metrics.score + '/100\\nพบปัญหา: ' + suggestions.length + ' รายการ\\n\\nคลิกปุ่มเพื่อรับรายงานฉบับเต็ม!');
            }, 1000);
        }
    };
    
    window.performanceMonitor = performanceMonitor;
    performanceMonitor.init();
})();`
            },
            'sql-injection-tester': {
                name: 'SQL Injection Tester Pro',
                category: 'security',
                difficulty: 'advanced',
                requiredSkills: ['SQL', 'Web Security', 'Database Knowledge'],
                demoScenario: {
                    title: '💉 ทดสอบ SQL Injection ขั้นสูง',
                    description: 'เว็บไซต์นี้มีช่องโหว่ SQL Injection ที่ซับซ้อน ต้องใช้ความรู้ SQL และ Web Security ระดับสูง!',
                    setupDemo: function() {
                        const demoArea = document.createElement('div');
                        demoArea.id = 'sql-injection-demo-area';
                        demoArea.style.cssText = `
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            width: 400px;
                            background: rgba(255, 0, 0, 0.15);
                            border: 2px solid #ff0000;
                            border-radius: 10px;
                            padding: 20px;
                            z-index: 9999;
                            color: #fff;
                            font-family: monospace;
                        `;
                        
                        demoArea.innerHTML = `
                            <h4 style="color: #ff0000; margin: 0 0 15px 0;">💉 Advanced SQL Injection Lab</h4>
                            <div style="background: rgba(0, 0, 0, 0.7); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                <h5 style="color: #ff6666; margin: 0 0 10px 0;">🎯 Target: User Search System</h5>
                                <form id="vulnerable-search-form">
                                    <label style="color: #ccc; font-size: 0.9em;">Search Users:</label>
                                    <input type="text" id="search-input" placeholder="Enter username..." style="
                                        width: 100%; 
                                        margin: 5px 0 10px 0; 
                                        padding: 8px; 
                                        background: #333; 
                                        border: 1px solid #666; 
                                        color: #fff;
                                        font-family: monospace;
                                    ">
                                    <button type="submit" style="
                                        width: 100%; 
                                        padding: 8px; 
                                        background: #666; 
                                        color: #fff; 
                                        border: none; 
                                        border-radius: 3px;
                                        cursor: pointer;
                                    ">🔍 Search Database</button>
                                </form>
                                <div id="search-results" style="margin-top: 10px; font-size: 0.8em; color: #999;">
                                    Ready to search...
                                </div>
                            </div>
                            <div style="background: rgba(255, 0, 0, 0.1); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                                <strong style="color: #ff6666;">⚠️ Challenge:</strong>
                                <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #ccc;">
                                    This system is vulnerable to SQL Injection. Use advanced techniques to extract hidden data!
                                </p>
                            </div>
                            <button id="sql-challenge-btn" disabled style="
                                width: 100%;
                                padding: 10px;
                                background: #666;
                                color: #999;
                                border: none;
                                border-radius: 5px;
                                cursor: not-allowed;
                            ">🏆 Claim Expert Badge (Extract admin data first!)</button>
                        `;
                        
                        document.body.appendChild(demoArea);
                        
                        // เพิ่ม event listener สำหรับฟอร์ม
                        const form = document.getElementById('vulnerable-search-form');
                        const resultsDiv = document.getElementById('search-results');
                        
                        form.addEventListener('submit', function(e) {
                            e.preventDefault();
                            const searchTerm = document.getElementById('search-input').value;
                            
                            // จำลองการค้นหาที่มีช่องโหว่
                            if (searchTerm.includes("'") || searchTerm.includes('"') || searchTerm.includes('--')) {
                                resultsDiv.innerHTML = `
                                    <div style="color: #ff6666;">⚠️ SQL Error detected!</div>
                                    <div style="color: #999; font-size: 0.7em;">Query: SELECT * FROM users WHERE username = '${searchTerm}'</div>
                                `;
                            } else {
                                resultsDiv.innerHTML = `
                                    <div style="color: #00ff41;">✅ Found user: ${searchTerm || 'guest'}</div>
                                    <div style="color: #999; font-size: 0.7em;">ID: 1, Role: user</div>
                                `;
                            }
                        });
                        
                        return demoArea;
                    },
                    cleanupDemo: function() {
                        const demoArea = document.getElementById('sql-injection-demo-area');
                        if (demoArea) demoArea.remove();
                        
                        const testerPanel = document.getElementById('sql-injection-tester-panel');
                        if (testerPanel) testerPanel.remove();
                    }
                },
                code: `// SQL Injection Tester Pro - Advanced Security Testing
(function() {
    console.log('💉 Starting SQL Injection Tester Pro...');
    
    const sqlTester = {
        payloads: [
            "' OR '1'='1",
            "' UNION SELECT username,password FROM admin_users--",
            "'; DROP TABLE users; --",
            "' OR 1=1 UNION SELECT database(),user(),version()--",
            "' AND (SELECT COUNT(*) FROM information_schema.tables)>0--"
        ],
        
        init() {
            this.createAdvancedUI();
            this.scanForSQLVulnerabilities();
        },
        
        createAdvancedUI() {
            const panel = document.createElement('div');
            panel.id = 'sql-injection-tester-panel';
            panel.style.cssText = \`
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 450px;
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #ff0000;
                border-radius: 10px;
                padding: 20px;
                color: #ff0000;
                font-family: monospace;
                z-index: 10000;
                max-height: 70vh;
                overflow-y: auto;
            \`;
            
            panel.innerHTML = \`
                <h3 style="margin: 0 0 15px 0; color: #ff0000;">💉 SQL Injection Tester Pro</h3>
                <div style="background: rgba(255, 0, 0, 0.1); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                    <strong>⚠️ Advanced Tool - Requires SQL Knowledge</strong>
                </div>
                <div id="vulnerability-scanner">
                    <h4 style="color: #ff6666; margin: 0 0 10px 0;">🎯 Vulnerability Scanner</h4>
                    <div id="scan-progress" style="margin-bottom: 15px;">
                        <div style="background: #333; height: 20px; border-radius: 10px; overflow: hidden;">
                            <div id="progress-bar" style="background: linear-gradient(90deg, #ff0000, #ff6666); height: 100%; width: 0%; transition: width 0.3s;"></div>
                        </div>
                        <div id="scan-status" style="color: #ccc; font-size: 0.8em; margin-top: 5px;">Ready to scan...</div>
                    </div>
                </div>
                <div id="payload-tester" style="margin-bottom: 15px;">
                    <h4 style="color: #ff6666; margin: 0 0 10px 0;">🧪 Payload Tester</h4>
                    <select id="payload-select" style="width: 100%; padding: 5px; background: #333; color: #fff; border: 1px solid #666; margin-bottom: 10px;">
                        <option value="">Select SQL Injection Payload</option>
                        \${this.payloads.map((payload, index) => \`<option value="\${index}">\${payload}</option>\`).join('')}
                    </select>
                    <button onclick="sqlTester.testPayload()" style="
                        width: 100%;
                        padding: 8px;
                        background: #ff0000;
                        color: #fff;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-bottom: 10px;
                    ">🚀 Test Payload</button>
                </div>
                <div id="results-area">
                    <h4 style="color: #ff6666; margin: 0 0 10px 0;">📊 Results</h4>
                    <div id="test-results" style="background: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 5px; min-height: 60px; font-size: 0.8em;">
                        No tests performed yet...
                    </div>
                </div>
                <button onclick="this.parentElement.remove()" style="
                    width: 100%;
                    background: #666;
                    color: #fff;
                    border: none;
                    padding: 8px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                ">Close</button>
            \`;
            
            document.body.appendChild(panel);
        },
        
        scanForSQLVulnerabilities() {
            const progressBar = document.getElementById('progress-bar');
            const statusEl = document.getElementById('scan-status');
            let progress = 0;
            
            const scanInterval = setInterval(() => {
                progress += 20;
                progressBar.style.width = progress + '%';
                
                if (progress === 20) {
                    statusEl.textContent = 'Scanning input fields...';
                } else if (progress === 40) {
                    statusEl.textContent = 'Testing for SQL injection points...';
                } else if (progress === 60) {
                    statusEl.textContent = 'Analyzing database responses...';
                } else if (progress === 80) {
                    statusEl.textContent = 'Checking for advanced vulnerabilities...';
                } else if (progress === 100) {
                    statusEl.innerHTML = '<span style="color: #ff6666;">⚠️ SQL Injection vulnerabilities detected!</span>';
                    clearInterval(scanInterval);
                    
                    // เปิดใช้งานปุ่มรางวัลหลังสแกนเสร็จ
                    setTimeout(() => {
                        const challengeBtn = document.getElementById('sql-challenge-btn');
                        if (challengeBtn) {
                            challengeBtn.disabled = false;
                            challengeBtn.style.background = 'linear-gradient(45deg, #ff0000, #ff6666)';
                            challengeBtn.style.color = '#fff';
                            challengeBtn.style.cursor = 'pointer';
                            challengeBtn.textContent = '🏆 Claim SQL Expert Badge!';
                            
                            challengeBtn.onclick = () => {
                                alert('🎉 ยินดีด้วย! คุณได้รับ "SQL Injection Expert Badge"!\\n\\nคุณได้เรียนรู้เทคนิคการทดสอบ SQL Injection ขั้นสูงแล้ว!\\n\\n⚠️ จำไว้: ใช้ความรู้นี้เพื่อการป้องกันเท่านั้น!');
                            };
                        }
                    }, 1000);
                }
            }, 800);
        },
        
        testPayload() {
            const payloadSelect = document.getElementById('payload-select');
            const resultsArea = document.getElementById('test-results');
            const selectedIndex = payloadSelect.value;
            
            if (!selectedIndex) {
                resultsArea.innerHTML = '<span style="color: #ff6666;">Please select a payload first!</span>';
                return;
            }
            
            const payload = this.payloads[selectedIndex];
            resultsArea.innerHTML = \`
                <div style="color: #ff6666; margin-bottom: 10px;">
                    <strong>Testing Payload:</strong> \${payload}
                </div>
                <div style="color: #ffff00; margin-bottom: 10px;">
                    <strong>Simulated Response:</strong>
                </div>
                <div style="color: #00ff41; font-size: 0.7em;">
                    \${this.generateMockResponse(selectedIndex)}
                </div>
            \`;
            
            // จำลองการทดสอบในฟอร์มจริง
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = payload;
                const form = document.getElementById('vulnerable-search-form');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        },
        
        generateMockResponse(payloadIndex) {
            const responses = [
                "Error: You have an error in your SQL syntax near ''1'='1' at line 1\\nVulnerability: Authentication Bypass Detected!",
                "admin_user: root, password: $2y$10$hash...\\nhidden_admin: superuser, password: $2y$10$hash...\\nVulnerability: Data Extraction Successful!",
                "Error: Cannot drop table 'users'\\nVulnerability: Destructive SQL Injection Detected!",
                "Database: webapp_db, User: root@localhost, Version: 8.0.25\\nVulnerability: Information Disclosure!",
                "Tables count: 15\\nVulnerability: Database Structure Enumeration!"
            ];
            return responses[payloadIndex] || "Unknown response";
        }
    };
    
    window.sqlTester = sqlTester;
    sqlTester.init();
})();`,
            },

            'reverse-shell-detector': {
                name: 'Reverse Shell Detector',
                category: 'security',
                difficulty: 'advanced',
                requiredSkills: ['Network Security', 'System Administration', 'Malware Analysis'],
                demoScenario: {
                    title: '🐚 ทดสอบการตรวจจับ Reverse Shell',
                    description: 'ระบบนี้อาจมี Reverse Shell ที่ซ่อนอยู่ ต้องใช้ความรู้ Network Security และ System Administration!',
                    setupDemo: function() {
                        const demoArea = document.createElement('div');
                        demoArea.id = 'reverse-shell-demo-area';
                        demoArea.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 20px;
                            transform: translateY(-50%);
                            width: 380px;
                            background: rgba(255, 140, 0, 0.15);
                            border: 2px solid #ff8c00;
                            border-radius: 10px;
                            padding: 20px;
                            z-index: 9999;
                            color: #fff;
                            font-family: monospace;
                        `;
                        
                        demoArea.innerHTML = `
                            <h4 style="color: #ff8c00; margin: 0 0 15px 0;">🐚 Suspicious Network Activity</h4>
                            <div style="background: rgba(0, 0, 0, 0.7); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                <h5 style="color: #ffaa44; margin: 0 0 10px 0;">📡 Network Connections</h5>
                                <div style="font-size: 0.8em; color: #ccc; line-height: 1.4;">
                                    <div>TCP 192.168.1.100:4444 → 10.0.0.1:1337 [ESTABLISHED]</div>
                                    <div>TCP 192.168.1.100:8080 → 203.0.113.1:443 [ESTABLISHED]</div>
                                    <div style="color: #ff6666;">TCP 192.168.1.100:31337 → 198.51.100.1:4444 [SUSPICIOUS]</div>
                                    <div>UDP 192.168.1.100:53 → 8.8.8.8:53 [TIME_WAIT]</div>
                                </div>
                            </div>
                            <div style="background: rgba(255, 140, 0, 0.1); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                                <strong style="color: #ff8c00;">🎯 Challenge:</strong>
                                <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #ccc;">
                                    Detect and analyze potential reverse shell connections using advanced network forensics!
                                </p>
                            </div>
                            <button id="shell-analysis-btn" disabled style="
                                width: 100%;
                                padding: 10px;
                                background: #666;
                                color: #999;
                                border: none;
                                border-radius: 5px;
                                cursor: not-allowed;
                            ">🔍 Advanced Analysis Report (Run detector first!)</button>
                        `;
                        
                        document.body.appendChild(demoArea);
                        return demoArea;
                    },
                    cleanupDemo: function() {
                        const demoArea = document.getElementById('reverse-shell-demo-area');
                        if (demoArea) demoArea.remove();
                        
                        const detectorPanel = document.getElementById('reverse-shell-detector-panel');
                        if (detectorPanel) detectorPanel.remove();
                    }
                },
                code: `// Reverse Shell Detector - Advanced Network Security Analysis
(function() {
    console.log('🐚 Starting Reverse Shell Detector...');
    
    const shellDetector = {
        suspiciousPorts: [4444, 1337, 31337, 8080, 9999, 6666],
        knownMaliciousIPs: ['198.51.100.1', '203.0.113.1', '192.0.2.1'],
        
        init() {
            this.createAdvancedUI();
            this.startNetworkAnalysis();
        },
        
        createAdvancedUI() {
            const panel = document.createElement('div');
            panel.id = 'reverse-shell-detector-panel';
            panel.style.cssText = \`
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 420px;
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #ff8c00;
                border-radius: 10px;
                padding: 20px;
                color: #ff8c00;
                font-family: monospace;
                z-index: 10000;
                max-height: 70vh;
                overflow-y: auto;
            \`;
            
            panel.innerHTML = \`
                <h3 style="margin: 0 0 15px 0;">🐚 Reverse Shell Detector</h3>
                <div style="background: rgba(255, 140, 0, 0.1); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                    <strong>⚠️ Advanced Network Security Tool</strong>
                </div>
                <div id="network-scanner">
                    <h4 style="color: #ffaa44; margin: 0 0 10px 0;">📡 Network Analysis</h4>
                    <div id="scan-status" style="color: #ccc; margin-bottom: 15px;">Initializing network scan...</div>
                    <div id="connection-analysis" style="background: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 15px; min-height: 100px; font-size: 0.8em;">
                        Scanning active connections...
                    </div>
                </div>
                <div id="threat-assessment">
                    <h4 style="color: #ffaa44; margin: 0 0 10px 0;">🎯 Threat Assessment</h4>
                    <div id="threat-level" style="padding: 10px; border-radius: 5px; margin-bottom: 15px; text-align: center; font-weight: bold;">
                        ANALYZING...
                    </div>
                </div>
                <div id="forensics-tools" style="margin-bottom: 15px;">
                    <h4 style="color: #ffaa44; margin: 0 0 10px 0;">🔬 Forensics Tools</h4>
                    <button onclick="shellDetector.deepPacketInspection()" style="
                        width: 100%;
                        padding: 8px;
                        background: #ff8c00;
                        color: #000;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-bottom: 5px;
                        font-weight: bold;
                    ">📦 Deep Packet Inspection</button>
                    <button onclick="shellDetector.behaviorAnalysis()" style="
                        width: 100%;
                        padding: 8px;
                        background: #ff8c00;
                        color: #000;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-bottom: 5px;
                        font-weight: bold;
                    ">🧠 Behavior Analysis</button>
                </div>
                <button onclick="this.parentElement.remove()" style="
                    width: 100%;
                    background: #666;
                    color: #fff;
                    border: none;
                    padding: 8px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Close</button>
            \`;
            
            document.body.appendChild(panel);
        },
        
        startNetworkAnalysis() {
            const statusEl = document.getElementById('scan-status');
            const analysisEl = document.getElementById('connection-analysis');
            const threatEl = document.getElementById('threat-level');
            
            let step = 0;
            const steps = [
                'Scanning network interfaces...',
                'Analyzing TCP connections...',
                'Checking suspicious ports...',
                'Cross-referencing threat intelligence...',
                'Generating security report...'
            ];
            
            const analysisInterval = setInterval(() => {
                if (step < steps.length) {
                    statusEl.textContent = steps[step];
                    step++;
                } else {
                    clearInterval(analysisInterval);
                    statusEl.innerHTML = '<span style="color: #ff6666;">⚠️ Suspicious activity detected!</span>';
                    
                    analysisEl.innerHTML = \`
                        <div style="color: #ff6666; margin-bottom: 10px;"><strong>🚨 THREAT DETECTED</strong></div>
                        <div style="color: #ccc; line-height: 1.4;">
                            <div>• Outbound connection to port 31337 (common reverse shell port)</div>
                            <div>• Destination IP in threat database: 198.51.100.1</div>
                            <div>• Unusual data patterns detected</div>
                            <div>• Connection established outside business hours</div>
                            <div style="color: #ffaa44; margin-top: 10px;">
                                <strong>Confidence Level: 87% (HIGH RISK)</strong>
                            </div>
                        </div>
                    \`;
                    
                    threatEl.style.background = 'rgba(255, 0, 0, 0.3)';
                    threatEl.style.color = '#ff6666';
                    threatEl.textContent = '🚨 HIGH THREAT LEVEL';
                    
                    // เปิดใช้งานปุ่มรางวัล
                    const analysisBtn = document.getElementById('shell-analysis-btn');
                    if (analysisBtn) {
                        analysisBtn.disabled = false;
                        analysisBtn.style.background = 'linear-gradient(45deg, #ff8c00, #ffaa44)';
                        analysisBtn.style.color = '#000';
                        analysisBtn.style.cursor = 'pointer';
                        analysisBtn.textContent = '🔍 Get Advanced Analysis Report!';
                        
                        analysisBtn.onclick = () => {
                            alert('🎉 ยินดีด้วย! คุณได้รับ "Network Security Expert Certificate"!\\n\\nรายงานการวิเคราะห์:\\n• Reverse Shell detected on port 31337\\n• C&C Server: 198.51.100.1\\n• Recommended: Immediate isolation\\n• Forensics: Collect network logs\\n\\n⚠️ ใช้ความรู้นี้เพื่อการป้องกันเท่านั้น!');
                        };
                    }
                }
            }, 1200);
        },
        
        deepPacketInspection() {
            alert('📦 Deep Packet Inspection Results:\\n\\n• Encrypted payload detected\\n• Shell commands identified:\\n  - "whoami"\\n  - "ls -la"\\n  - "cat /etc/passwd"\\n\\n🔍 Advanced analysis requires specialized tools!');
        },
        
        behaviorAnalysis() {
            alert('🧠 Behavior Analysis Results:\\n\\n• Abnormal outbound traffic patterns\\n• Command execution signatures\\n• Persistence mechanisms detected\\n• Lateral movement indicators\\n\\n⚠️ Immediate containment recommended!');
        }
    };
    
    window.shellDetector = shellDetector;
    shellDetector.init();
})();`,
            },

            'cryptographic-analyzer': {
                name: 'Cryptographic Analyzer Pro',
                category: 'security',
                difficulty: 'advanced',
                requiredSkills: ['Cryptography', 'Mathematics', 'Security Analysis'],
                demoScenario: {
                    title: '🔐 ทดสอบการวิเคราะห์การเข้ารหัส',
                    description: 'ระบบนี้ใช้การเข้ารหัสที่อาจมีจุดอ่อน ต้องใช้ความรู้ Cryptography ขั้นสูง!',
                    setupDemo: function() {
                        const demoArea = document.createElement('div');
                        demoArea.id = 'crypto-demo-area';
                        demoArea.style.cssText = `
                            position: fixed;
                            top: 20px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 500px;
                            background: rgba(128, 0, 128, 0.15);
                            border: 2px solid #8000ff;
                            border-radius: 10px;
                            padding: 20px;
                            z-index: 9999;
                            color: #fff;
                            font-family: monospace;
                        `;
                        
                        demoArea.innerHTML = `
                            <h4 style="color: #8000ff; margin: 0 0 15px 0;">🔐 Cryptographic Security Lab</h4>
                            <div style="background: rgba(0, 0, 0, 0.7); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                <h5 style="color: #aa44ff; margin: 0 0 10px 0;">🔑 Encrypted Messages</h5>
                                <div style="font-size: 0.8em; color: #ccc; line-height: 1.4; word-break: break-all;">
                                    <div><strong>Message 1 (Caesar):</strong> Khoor Zruog!</div>
                                    <div><strong>Message 2 (Base64):</strong> SGVsbG8gV29ybGQh</div>
                                    <div><strong>Message 3 (ROT13):</strong> Uryyb Jbeyq!</div>
                                    <div><strong>Message 4 (Weak RSA):</strong> n=143, e=7, c=2</div>
                                </div>
                            </div>
                            <div style="background: rgba(128, 0, 128, 0.1); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                                <strong style="color: #8000ff;">🎯 Challenge:</strong>
                                <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #ccc;">
                                    Analyze and decrypt these messages using advanced cryptographic techniques!
                                </p>
                            </div>
                            <button id="crypto-challenge-btn" disabled style="
                                width: 100%;
                                padding: 10px;
                                background: #666;
                                color: #999;
                                border: none;
                                border-radius: 5px;
                                cursor: not-allowed;
                            ">🏆 Claim Cryptographer Badge (Decrypt messages first!)</button>
                        `;
                        
                        document.body.appendChild(demoArea);
                        return demoArea;
                    },
                    cleanupDemo: function() {
                        const demoArea = document.getElementById('crypto-demo-area');
                        if (demoArea) demoArea.remove();
                        
                        const analyzerPanel = document.getElementById('cryptographic-analyzer-panel');
                        if (analyzerPanel) analyzerPanel.remove();
                    }
                },
                code: `// Cryptographic Analyzer Pro - Advanced Cryptanalysis Tool
(function() {
    console.log('🔐 Starting Cryptographic Analyzer Pro...');
    
    const cryptoAnalyzer = {
        algorithms: {
            caesar: { name: 'Caesar Cipher', difficulty: 'Easy' },
            base64: { name: 'Base64 Encoding', difficulty: 'Easy' },
            rot13: { name: 'ROT13 Cipher', difficulty: 'Easy' },
            rsa: { name: 'RSA Encryption', difficulty: 'Hard' },
            aes: { name: 'AES Encryption', difficulty: 'Very Hard' }
        },
        
        init() {
            this.createAdvancedUI();
            this.startCryptoAnalysis();
        },
        
        createAdvancedUI() {
            const panel = document.createElement('div');
            panel.id = 'cryptographic-analyzer-panel';
            panel.style.cssText = \`
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 500px;
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid #8000ff;
                border-radius: 10px;
                padding: 20px;
                color: #8000ff;
                font-family: monospace;
                z-index: 10000;
                max-height: 70vh;
                overflow-y: auto;
            \`;
            
            panel.innerHTML = \`
                <h3 style="margin: 0 0 15px 0;">🔐 Cryptographic Analyzer Pro</h3>
                <div style="background: rgba(128, 0, 128, 0.1); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                    <strong>⚠️ Advanced Cryptanalysis Tool - Requires Mathematical Knowledge</strong>
                </div>
                <div id="cipher-detection">
                    <h4 style="color: #aa44ff; margin: 0 0 10px 0;">🔍 Cipher Detection</h4>
                    <div id="detection-results" style="background: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 5px; margin-bottom: 15px; min-height: 80px; font-size: 0.8em;">
                        Analyzing encryption patterns...
                    </div>
                </div>
                <div id="decryption-tools">
                    <h4 style="color: #aa44ff; margin: 0 0 10px 0;">🔓 Decryption Tools</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <button onclick="cryptoAnalyzer.decryptCaesar()" style="
                            padding: 8px;
                            background: #8000ff;
                            color: #fff;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 0.8em;
                        ">Caesar Cipher</button>
                        <button onclick="cryptoAnalyzer.decryptBase64()" style="
                            padding: 8px;
                            background: #8000ff;
                            color: #fff;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 0.8em;
                        ">Base64 Decode</button>
                        <button onclick="cryptoAnalyzer.decryptROT13()" style="
                            padding: 8px;
                            background: #8000ff;
                            color: #fff;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 0.8em;
                        ">ROT13 Cipher</button>
                        <button onclick="cryptoAnalyzer.decryptRSA()" style="
                            padding: 8px;
                            background: #ff6600;
                            color: #fff;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 0.8em;
                        ">RSA (Advanced)</button>
                    </div>
                </div>
                <div id="analysis-results">
                    <h4 style="color: #aa44ff; margin: 0 0 10px 0;">📊 Analysis Results</h4>
                    <div id="decryption-output" style="background: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 5px; min-height: 60px; font-size: 0.8em;">
                        No decryption attempts yet...
                    </div>
                </div>
                <button onclick="this.parentElement.remove()" style="
                    width: 100%;
                    background: #666;
                    color: #fff;
                    border: none;
                    padding: 8px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                ">Close</button>
            \`;
            
            document.body.appendChild(panel);
        },
        
        startCryptoAnalysis() {
            const detectionEl = document.getElementById('detection-results');
            let step = 0;
            const steps = [
                'Analyzing character frequency...',
                'Detecting encryption patterns...',
                'Checking for known cipher signatures...',
                'Performing entropy analysis...',
                'Classification complete!'
            ];
            
            const analysisInterval = setInterval(() => {
                if (step < steps.length - 1) {
                    detectionEl.textContent = steps[step];
                    step++;
                } else {
                    clearInterval(analysisInterval);
                    detectionEl.innerHTML = \`
                        <div style="color: #aa44ff; margin-bottom: 10px;"><strong>🔍 CIPHER DETECTION RESULTS</strong></div>
                        <div style="color: #ccc; line-height: 1.4;">
                            <div>• Message 1: Caesar Cipher (shift detected)</div>
                            <div>• Message 2: Base64 Encoding (padding detected)</div>
                            <div>• Message 3: ROT13 Cipher (alphabetic rotation)</div>
                            <div>• Message 4: RSA Encryption (small modulus vulnerability)</div>
                            <div style="color: #ffaa44; margin-top: 10px;">
                                <strong>Recommendation: Use decryption tools in order</strong>
                            </div>
                        </div>
                    \`;
                }
            }, 1000);
        },
        
        decryptCaesar() {
            const output = document.getElementById('decryption-output');
            output.innerHTML = \`
                <div style="color: #00ff41;"><strong>Caesar Cipher Decryption:</strong></div>
                <div style="color: #ccc;">Input: "Khoor Zruog!"</div>
                <div style="color: #00ff41;">Output: "Hello World!" (shift: -3)</div>
                <div style="color: #ffaa44; margin-top: 5px;">✅ Message 1 decrypted successfully!</div>
            \`;
            this.checkAllDecrypted();
        },
        
        decryptBase64() {
            const output = document.getElementById('decryption-output');
            output.innerHTML = \`
                <div style="color: #00ff41;"><strong>Base64 Decoding:</strong></div>
                <div style="color: #ccc;">Input: "SGVsbG8gV29ybGQh"</div>
                <div style="color: #00ff41;">Output: "Hello World!"</div>
                <div style="color: #ffaa44; margin-top: 5px;">✅ Message 2 decoded successfully!</div>
            \`;
            this.checkAllDecrypted();
        },
        
        decryptROT13() {
            const output = document.getElementById('decryption-output');
            output.innerHTML = \`
                <div style="color: #00ff41;"><strong>ROT13 Decryption:</strong></div>
                <div style="color: #ccc;">Input: "Uryyb Jbeyq!"</div>
                <div style="color: #00ff41;">Output: "Hello World!"</div>
                <div style="color: #ffaa44; margin-top: 5px;">✅ Message 3 decrypted successfully!</div>
            \`;
            this.checkAllDecrypted();
        },
        
        decryptRSA() {
            const output = document.getElementById('decryption-output');
            output.innerHTML = \`
                <div style="color: #00ff41;"><strong>RSA Decryption (Advanced):</strong></div>
                <div style="color: #ccc;">n=143, e=7, c=2</div>
                <div style="color: #ffaa44;">Factoring n: 143 = 11 × 13</div>
                <div style="color: #ffaa44;">φ(n) = (11-1)(13-1) = 120</div>
                <div style="color: #ffaa44;">d = e^(-1) mod φ(n) = 103</div>
                <div style="color: #00ff41;">Plaintext: m = c^d mod n = 72 = 'H'</div>
                <div style="color: #ffaa44; margin-top: 5px;">✅ RSA vulnerability exploited!</div>
            \`;
            this.checkAllDecrypted();
        },
        
        checkAllDecrypted() {
            // เปิดใช้งานปุ่มรางวัลเมื่อทำการถอดรหัสครบ
            const challengeBtn = document.getElementById('crypto-challenge-btn');
            if (challengeBtn) {
                challengeBtn.disabled = false;
                challengeBtn.style.background = 'linear-gradient(45deg, #8000ff, #aa44ff)';
                challengeBtn.style.color = '#fff';
                challengeBtn.style.cursor = 'pointer';
                challengeBtn.textContent = '🏆 Claim Master Cryptographer Badge!';
                
                challengeBtn.onclick = () => {
                    alert('🎉 ยินดีด้วย! คุณได้รับ "Master Cryptographer Badge"!\\n\\nคุณได้เรียนรู้:\\n• Classical Ciphers (Caesar, ROT13)\\n• Encoding Systems (Base64)\\n• Public Key Cryptography (RSA)\\n• Cryptanalysis Techniques\\n\\n🔐 ใช้ความรู้นี้เพื่อการป้องกันเท่านั้น!');
                };
            }
        }
    };
    
    window.cryptoAnalyzer = cryptoAnalyzer;
    cryptoAnalyzer.init();
})();`,
            },

            'page-manipulator': {
                name: 'Page Manipulator',
                category: 'fun',
                demoScenario: {
                    title: '🎮 ทดสอบการจัดการหน้าเว็บ',
                    description: 'หน้าเว็บนี้ดูน่าเบื่อ ลองใช้ Page Manipulator เพื่อทำให้สนุกขึ้น!',
                    setupDemo: function() {
                        const demoArea = document.createElement('div');
                        demoArea.id = 'page-manipulator-demo-area';
                        demoArea.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 20px;
                            transform: translateY(-50%);
                            width: 280px;
                            background: rgba(255, 0, 255, 0.1);
                            border: 2px solid #ff00ff;
                            border-radius: 10px;
                            padding: 20px;
                            z-index: 9999;
                            color: #fff;
                        `;
                        
                        demoArea.innerHTML = `
                            <h4 style="color: #ff00ff; margin: 0 0 15px 0;">🎨 Boring Website</h4>
                            <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                <p style="margin: 0; color: #999; font-size: 0.9em;">
                                    This website looks so boring and plain... 😴
                                </p>
                                <div style="margin: 10px 0;">
                                    <div style="width: 100%; height: 20px; background: #333; border-radius: 3px; margin: 5px 0;"></div>
                                    <div style="width: 80%; height: 20px; background: #333; border-radius: 3px; margin: 5px 0;"></div>
                                    <div style="width: 60%; height: 20px; background: #333; border-radius: 3px; margin: 5px 0;"></div>
                                </div>
                            </div>
                            <button id="magic-transform-btn" style="
                                width: 100%;
                                padding: 10px;
                                background: #666;
                                color: #999;
                                border: none;
                                border-radius: 5px;
                                cursor: not-allowed;
                                margin-bottom: 10px;
                            ">✨ Transform Website (Use Page Manipulator!)</button>
                            <p style="font-size: 0.8em; color: #ccc; margin: 0;">
                                🎭 Use Page Manipulator to add colors, effects, and make it awesome!
                            </p>
                        `;
                        
                        document.body.appendChild(demoArea);
                        return demoArea;
                    },
                    cleanupDemo: function() {
                        const demoArea = document.getElementById('page-manipulator-demo-area');
                        if (demoArea) demoArea.remove();
                        
                        const manipulatorPanel = document.getElementById('page-manipulator-panel');
                        if (manipulatorPanel) manipulatorPanel.remove();
                        
                        // รีเซ็ตเอฟเฟกต์ทั้งหมด
                        document.body.style.filter = 'none';
                        document.querySelectorAll('*').forEach(el => {
                            el.style.animation = '';
                            el.style.animationDelay = '';
                        });
                        
                        const danceStyles = document.getElementById('dance-styles');
                        if (danceStyles) danceStyles.remove();
                    }
                },
                code: `// Page Manipulator - Interactive Page Modification Tool
(function() {
    console.log('🎮 Starting Page Manipulator...');
    
    const pageManipulator = {
        originalStyles: new Map(),
        
        init() {
            this.createUI();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'page-manipulator-panel';
            panel.style.cssText = \`
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 280px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #ff00ff;
                border-radius: 10px;
                padding: 15px;
                color: #ff00ff;
                font-family: monospace;
                z-index: 10000;
            \`;
            
            panel.innerHTML = \`
                <h3 style="margin: 0 0 10px 0;">🎮 Page Manipulator</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 10px;">
                    <button onclick="pageManipulator.invertColors()" style="
                        background: #ff00ff;
                        color: #000;
                        border: none;
                        padding: 5px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 0.8em;
                    ">Invert Colors</button>
                    <button onclick="pageManipulator.grayscale()" style="
                        background: #ff00ff;
                        color: #000;
                        border: none;
                        padding: 5px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 0.8em;
                    ">Grayscale</button>
                    <button onclick="pageManipulator.blur()" style="
                        background: #ff00ff;
                        color: #000;
                        border: none;
                        padding: 5px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 0.8em;
                    ">Blur</button>
                    <button onclick="pageManipulator.sepia()" style="
                        background: #ff00ff;
                        color: #000;
                        border: none;
                        padding: 5px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 0.8em;
                    ">Sepia</button>
                    <button onclick="pageManipulator.rainbow()" style="
                        background: #ff00ff;
                        color: #000;
                        border: none;
                        padding: 5px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 0.8em;
                    ">Rainbow</button>
                    <button onclick="pageManipulator.dance()" style="
                        background: #ff00ff;
                        color: #000;
                        border: none;
                        padding: 5px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 0.8em;
                    ">Dance Mode</button>
                </div>
                <button onclick="pageManipulator.reset()" style="
                    width: 100%;
                    background: #00ff41;
                    color: #000;
                    border: none;
                    padding: 8px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-bottom: 5px;
                ">Reset All</button>
                <button onclick="this.parentElement.remove()" style="
                    width: 100%;
                    background: #ff4444;
                    color: #fff;
                    border: none;
                    padding: 5px;
                    border-radius: 3px;
                    cursor: pointer;
                ">Close</button>
            \`;
            
            document.body.appendChild(panel);
        },
        
        invertColors() {
            document.body.style.filter = 'invert(1)';
            console.log('🎮 Colors inverted');
        },
        
        grayscale() {
            document.body.style.filter = 'grayscale(1)';
            console.log('🎮 Grayscale applied');
        },
        
        blur() {
            document.body.style.filter = 'blur(2px)';
            console.log('🎮 Blur effect applied');
        },
        
        sepia() {
            document.body.style.filter = 'sepia(1)';
            console.log('🎮 Sepia effect applied');
        },
        
        rainbow() {
            document.body.style.filter = 'hue-rotate(0deg)';
            let hue = 0;
            const rainbowInterval = setInterval(() => {
                hue += 10;
                document.body.style.filter = \`hue-rotate(\${hue}deg)\`;
                if (hue >= 360) {
                    clearInterval(rainbowInterval);
                    console.log('🎮 Rainbow cycle completed');
                    
                    // เปิดใช้งานปุ่มรางวัล
                    const transformBtn = document.getElementById('magic-transform-btn');
                    if (transformBtn) {
                        transformBtn.disabled = false;
                        transformBtn.style.background = 'linear-gradient(45deg, #ff00ff, #cc00cc)';
                        transformBtn.style.color = '#fff';
                        transformBtn.style.cursor = 'pointer';
                        transformBtn.textContent = '✨ Magical Transformation Complete!';
                    }
                    
                    setTimeout(() => {
                        alert('🌈 ว้าว! Page Manipulator เปลี่ยนหน้าเว็บให้สวยงามแล้ว!\\n\\nตอนนี้คุณสามารถรับรางวัลได้แล้ว!');
                    }, 500);
                }
            }, 100);
            console.log('🎮 Rainbow mode activated');
        },
        
        dance() {
            const elements = document.querySelectorAll('*');
            elements.forEach((el, index) => {
                if (el.id !== 'page-manipulator-panel') {
                    el.style.animation = \`dance \${1 + Math.random()}s infinite alternate\`;
                    el.style.animationDelay = \`\${index * 0.1}s\`;
                }
            });
            
            // Add dance keyframes if not exists
            if (!document.getElementById('dance-styles')) {
                const style = document.createElement('style');
                style.id = 'dance-styles';
                style.textContent = \`
                    @keyframes dance {
                        0% { transform: rotate(0deg) scale(1); }
                        50% { transform: rotate(5deg) scale(1.05); }
                        100% { transform: rotate(-5deg) scale(0.95); }
                    }
                \`;
                document.head.appendChild(style);
            }
            
            console.log('🎮 Dance mode activated - everything is dancing!');
        },
        
        reset() {
            document.body.style.filter = 'none';
            
            // Remove dance animations
            document.querySelectorAll('*').forEach(el => {
                el.style.animation = '';
                el.style.animationDelay = '';
            });
            
            // Remove dance styles
            const danceStyles = document.getElementById('dance-styles');
            if (danceStyles) {
                danceStyles.remove();
            }
            
            console.log('🎮 All effects reset');
        }
    };
    
    window.pageManipulator = pageManipulator;
    pageManipulator.init();
})();`
            }
        };
    }

    addEventListeners() {
        // Add global functions for button clicks
        window.previewScript = (scriptId) => this.previewScript(scriptId);
        window.addToCollection = (scriptId, name, description) => this.addToCollection(scriptId, name, description);
        window.removeFromCollection = (scriptId) => this.removeFromCollection(scriptId);
        window.exportCollection = (format) => this.exportCollection(format);
    }

    previewScript(scriptId) {
        const script = this.scriptData[scriptId];
        if (!script) return;

        // สร้าง Interactive Demo Modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        `;
        
        const demoScenario = script.demoScenario;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(0, 20, 0, 0.95), rgba(0, 0, 0, 0.95));
                border: 2px solid #00ff41;
                border-radius: 15px;
                padding: 30px;
                max-width: 95%;
                max-height: 95%;
                overflow: auto;
                color: #00ff41;
                font-family: monospace;
                box-shadow: 0 0 50px rgba(0, 255, 65, 0.3);
                position: relative;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <h3 style="margin: 0; font-size: 1.5rem;">${demoScenario.title}</h3>
                    <button onclick="gooscriptManager.closeDemoModal()" style="
                        background: #ff4444;
                        color: #fff;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                    ">✕ ปิด</button>
                </div>
                
                <div style="
                    background: rgba(0, 255, 65, 0.1);
                    border: 1px solid rgba(0, 255, 65, 0.3);
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 25px;
                ">
                    <h4 style="color: #00ff41; margin: 0 0 10px 0;">🎯 เหตุการณ์จำลอง:</h4>
                    <p style="color: #ccc; margin: 0; line-height: 1.6;">${demoScenario.description}</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                    <div>
                        <h4 style="color: #00ff41; margin: 0 0 15px 0;">📋 ขั้นตอนการทดสอบ:</h4>
                        <ol style="color: #ccc; line-height: 1.8; padding-left: 20px;">
                            <li>คลิก "🎬 เริ่มการจำลอง" เพื่อสร้างสถานการณ์</li>
                            <li>สังเกตปัญหาหรือสถานการณ์ที่เกิดขึ้น</li>
                            <li>คลิก "🚀 รันสคริปต์" เพื่อแก้ไขปัญหา</li>
                            <li>ดูผลลัพธ์และรับรางวัล! 🎉</li>
                        </ol>
                    </div>
                    <div>
                        <h4 style="color: #00ff41; margin: 0 0 15px 0;">🔧 การควบคุม:</h4>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button id="start-demo-btn" onclick="gooscriptManager.startInteractiveDemo('${scriptId}')" style="
                                background: linear-gradient(45deg, #ff6600, #ff8800);
                                color: #fff;
                                border: none;
                                padding: 12px 20px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                                font-size: 1rem;
                            ">🎬 เริ่มการจำลอง</button>
                            
                            <button id="run-script-btn" onclick="gooscriptManager.runDemoScript('${scriptId}')" disabled style="
                                background: #666;
                                color: #999;
                                border: none;
                                padding: 12px 20px;
                                border-radius: 8px;
                                cursor: not-allowed;
                                font-weight: bold;
                                font-size: 1rem;
                            ">🚀 รันสคริปต์ (เริ่มการจำลองก่อน)</button>
                            
                            <button onclick="gooscriptManager.showScriptCode('${scriptId}')" style="
                                background: rgba(0, 255, 65, 0.2);
                                border: 1px solid #00ff41;
                                color: #00ff41;
                                padding: 10px 20px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: bold;
                            ">👁️ ดูโค้ดสคริปต์</button>
                        </div>
                    </div>
                </div>
                
                <div id="demo-status" style="
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                    text-align: center;
                    color: #ccc;
                ">
                    💡 พร้อมเริ่มการทดสอบ! คลิก "เริ่มการจำลอง" เพื่อเริ่มต้น
                </div>
                
                <div id="script-code-area" style="display: none;">
                    <h4 style="color: #00ff41; margin: 0 0 10px 0;">📜 โค้ดสคริปต์:</h4>
                    <pre style="
                        background: rgba(0, 0, 0, 0.7); 
                        padding: 20px; 
                        border-radius: 8px; 
                        overflow: auto; 
                        white-space: pre-wrap;
                        border: 1px solid rgba(0, 255, 65, 0.3);
                        max-height: 300px;
                        font-size: 0.9rem;
                    ">${script.code}</pre>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // เก็บ reference ของ modal
        this.currentDemoModal = modal;
        this.currentDemoScript = scriptId;
    }

    addToCollection(scriptId, name, description) {
        // Check if already in collection
        if (this.collection.find(item => item.id === scriptId)) {
            this.showMessage('⚠️ สคริปต์นี้อยู่ในคอลเลกชันแล้ว', '#ffff00');
            return;
        }

        // Add to collection
        this.collection.push({
            id: scriptId,
            name: name,
            description: description,
            code: this.scriptData[scriptId]?.code || '// Script code here',
            category: this.scriptData[scriptId]?.category || 'general',
            addedAt: new Date().toISOString()
        });

        this.updateCollectionDisplay();
        this.showMessage(`✅ เพิ่ม "${name}" ลงคอลเลกชันแล้ว`, '#00ff41');
    }

    removeFromCollection(scriptId) {
        const scriptName = this.collection.find(item => item.id === scriptId)?.name;
        this.collection = this.collection.filter(item => item.id !== scriptId);
        this.updateCollectionDisplay();
        this.showMessage(`🗑️ ลบ "${scriptName}" จากคอลเลกชันแล้ว`, '#ff4444');
    }

    updateCollectionDisplay() {
        this.collectionCount = this.collection.length;
        const countElement = document.getElementById('collectionCount');
        if (countElement) {
            countElement.textContent = this.collectionCount;
        }
        
        const container = document.getElementById('collectionItems');
        if (!container) return;
        
        if (this.collection.length === 0) {
            container.innerHTML = `
                <p style="text-align: center; color: #666; padding: 40px;">
                    ยังไม่มีสคริปต์ในคอลเลกชัน<br>
                    เลือกสคริปต์จากด้านล่างเพื่อเพิ่มลงคอลเลกชัน
                </p>
            `;
        } else {
            container.innerHTML = this.collection.map(item => `
                <div class="script-item">
                    <div class="script-info">
                        <div class="script-name">${item.name}</div>
                        <div class="script-description">${item.description}</div>
                        <div style="font-size: 0.8em; color: #666; margin-top: 5px;">
                            หมวด: ${item.category} | เพิ่มเมื่อ: ${new Date(item.addedAt).toLocaleString('th-TH')}
                        </div>
                    </div>
                    <div class="script-actions">
                        <button class="btn-preview" onclick="previewScript('${item.id}')">👁️ ดูโค้ด</button>
                        <button class="btn-add" style="background: #ff4444;" onclick="removeFromCollection('${item.id}')">🗑️ ลบ</button>
                    </div>
                </div>
            `).join('');
        }
    }

    exportCollection(format) {
        if (this.collection.length === 0) {
            this.showMessage('⚠️ ไม่มีสคริปต์ในคอลเลกชัน กรุณาเพิ่มสคริปต์ก่อนส่งออก', '#ffff00');
            return;
        }

        let exportData;
        let filename;
        let mimeType;

        switch (format) {
            case 'json':
                exportData = JSON.stringify({
                    name: 'Gooscript Collection',
                    version: '1.0.0',
                    description: 'สคริปต์ที่รวบรวมสำหรับ Gooscript Extension',
                    author: 'Shark Console User',
                    scripts: this.collection,
                    createdAt: new Date().toISOString(),
                    totalScripts: this.collection.length
                }, null, 2);
                filename = 'gooscript-collection.json';
                mimeType = 'application/json';
                break;

            case 'js':
                exportData = `// Gooscript Collection
// สร้างเมื่อ: ${new Date().toLocaleString('th-TH')}
// จำนวนสคริปต์: ${this.collection.length}

const GooscriptCollection = {
    name: 'Gooscript Collection',
    version: '1.0.0',
    description: 'สคริปต์ที่รวบรวมจาก Shark Console',
    totalScripts: ${this.collection.length},
    scripts: [
${this.collection.map(script => `        {
            id: '${script.id}',
            name: '${script.name}',
            description: '${script.description}',
            category: '${script.category}',
            execute: function() {
                console.log('Executing: ${script.name}');
${script.code.split('\n').map(line => '                ' + line).join('\n')}
            }
        }`).join(',\n')}
    ],
    
    // เรียกใช้สคริปต์ทั้งหมด
    executeAll: function() {
        console.log('🦈 Executing all scripts in collection...');
        this.scripts.forEach(script => {
            try {
                script.execute();
            } catch (error) {
                console.error('Error executing script:', script.name, error);
            }
        });
        console.log('✅ All scripts executed');
    },
    
    // เรียกใช้สคริปต์ตาม ID
    execute: function(scriptId) {
        const script = this.scripts.find(s => s.id === scriptId);
        if (script) {
            try {
                script.execute();
            } catch (error) {
                console.error('Error executing script:', script.name, error);
            }
        } else {
            console.error('Script not found:', scriptId);
        }
    },
    
    // แสดงรายการสคริปต์
    list: function() {
        console.log('📦 Gooscript Collection Scripts:');
        this.scripts.forEach((script, index) => {
            console.log(\`\${index + 1}. \${script.name} (\${script.id}) - \${script.description}\`);
        });
    }
};

// ส่งออกสำหรับใช้งาน
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GooscriptCollection;
}

// เรียกใช้งานทันที (ถ้าต้องการ)
// GooscriptCollection.executeAll();

console.log('🦈 Gooscript Collection loaded successfully!');
console.log('Use GooscriptCollection.list() to see available scripts');
console.log('Use GooscriptCollection.execute("script-id") to run specific script');
console.log('Use GooscriptCollection.executeAll() to run all scripts');`;
                filename = 'gooscript-collection.js';
                mimeType = 'application/javascript';
                break;

            case 'gooscript':
                exportData = JSON.stringify({
                    manifest: {
                        name: 'Custom Gooscript Collection',
                        version: '1.0.0',
                        description: 'สคริปต์ที่รวบรวมจาก Shark Console',
                        author: 'Shark Console User',
                        createdAt: new Date().toISOString(),
                        totalScripts: this.collection.length,
                        compatibility: ['chrome', 'firefox', 'safari', 'edge'],
                        permissions: ['activeTab', 'storage']
                    },
                    settings: {
                        autoExecute: false,
                        showNotifications: true,
                        logLevel: 'info'
                    },
                    scripts: this.collection.map(script => ({
                        id: script.id,
                        name: script.name,
                        description: script.description,
                        category: script.category,
                        enabled: true,
                        autoRun: false,
                        code: script.code,
                        metadata: {
                            addedAt: script.addedAt,
                            source: 'shark-console'
                        }
                    }))
                }, null, 2);
                filename = 'gooscript-package.json';
                mimeType = 'application/json';
                break;
        }

        // Create and download file
        const blob = new Blob([exportData], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage(`📤 ส่งออกไฟล์ ${filename} เรียบร้อยแล้ว (${this.collection.length} สคริปต์)`, '#00ff41');
    }

    showMessage(message, color = '#00ff41') {
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: ${color};
            border: 2px solid ${color};
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 10001;
            font-family: monospace;
            box-shadow: 0 0 20px ${color}40;
            animation: slideDown 0.3s ease;
        `;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    document.body.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    // ฟังก์ชันสำหรับจัดการ Interactive Demo
    startInteractiveDemo(scriptId) {
        const script = this.scriptData[scriptId];
        if (!script || !script.demoScenario) return;

        // ทำความสะอาดการจำลองเก่า
        this.cleanupCurrentDemo();

        // เริ่มการจำลองใหม่
        const demoElement = script.demoScenario.setupDemo();
        this.currentDemoElement = demoElement;

        // อัปเดต UI
        const statusEl = document.getElementById('demo-status');
        const runBtn = document.getElementById('run-script-btn');
        const startBtn = document.getElementById('start-demo-btn');

        if (statusEl) {
            statusEl.innerHTML = `
                <div style="color: #00ff41;">
                    ✅ การจำลองเริ่มต้นแล้ว! 
                    <br><span style="color: #ccc; font-size: 0.9em;">ตอนนี้คุณสามารถรันสคริปต์เพื่อแก้ไขปัญหาได้</span>
                </div>
            `;
        }

        if (runBtn) {
            runBtn.disabled = false;
            runBtn.style.background = 'linear-gradient(45deg, #00ff41, #00cc33)';
            runBtn.style.color = '#000';
            runBtn.style.cursor = 'pointer';
            runBtn.textContent = '🚀 รันสคริปต์เพื่อแก้ไข';
        }

        if (startBtn) {
            startBtn.style.background = '#666';
            startBtn.style.color = '#999';
            startBtn.textContent = '✅ การจำลองเริ่มแล้ว';
            startBtn.disabled = true;
        }

        this.showMessage('🎬 เริ่มการจำลองแล้ว! ลองรันสคริปต์เพื่อดูผลลัพธ์', '#ff6600');
    }

    runDemoScript(scriptId) {
        const script = this.scriptData[scriptId];
        if (!script) return;

        // รันสคริปต์จริง
        try {
            eval(script.code);
            
            // อัปเดต UI หลังรันสคริปต์
            setTimeout(() => {
                this.handleScriptSuccess(scriptId);
            }, 1000);
            
        } catch (error) {
            console.error('Error running script:', error);
            this.showMessage('❌ เกิดข้อผิดพลาดในการรันสคริปต์', '#ff4444');
        }
    }

    handleScriptSuccess(scriptId) {
        const statusEl = document.getElementById('demo-status');
        const runBtn = document.getElementById('run-script-btn');

        // อัปเดตสถานะ
        if (statusEl) {
            statusEl.innerHTML = `
                <div style="color: #00ff41; animation: pulse 2s infinite;">
                    🎉 สคริปต์ทำงานสำเร็จ! 
                    <br><span style="color: #ccc;">ตรวจสอบผลลัพธ์และลองใช้งานฟีเจอร์ที่เปิดใช้งาน</span>
                </div>
            `;
        }

        if (runBtn) {
            runBtn.style.background = '#666';
            runBtn.style.color = '#999';
            runBtn.textContent = '✅ สคริปต์ทำงานแล้ว';
            runBtn.disabled = true;
        }

        // เปิดใช้งานปุ่มรางวัลตามประเภทสคริปต์
        this.enableRewardButtons(scriptId);

        this.showMessage('🎉 ยอดเยิ่ยม! สคริปต์ทำงานสำเร็จแล้ว', '#00ff41');
    }

    enableRewardButtons(scriptId) {
        // เปิดใช้งานปุ่มรางวัลตามประเภทสคริปต์
        switch (scriptId) {
            case 'form-filler':
                const submitBtn = document.getElementById('submit-btn');
                if (submitBtn && submitBtn.disabled) {
                    // ตรวจสอบว่าฟอร์มถูกกรอกแล้วหรือยัง
                    const form = document.getElementById('demo-registration-form');
                    if (form) {
                        const requiredFields = form.querySelectorAll('input[required]');
                        let allFilled = true;
                        requiredFields.forEach(field => {
                            if (!field.value.trim()) allFilled = false;
                        });
                        
                        if (allFilled) {
                            submitBtn.disabled = false;
                            submitBtn.style.background = '#00ff41';
                            submitBtn.style.color = '#000';
                            submitBtn.style.cursor = 'pointer';
                            submitBtn.textContent = '🎉 Submit (Ready!)';
                        }
                    }
                }
                break;

            case 'data-extractor':
                const extractBtn = document.getElementById('extract-challenge-btn');
                if (extractBtn) {
                    extractBtn.disabled = false;
                    extractBtn.style.background = 'linear-gradient(45deg, #00ff41, #00cc33)';
                    extractBtn.style.color = '#000';
                    extractBtn.style.cursor = 'pointer';
                    extractBtn.textContent = '🏆 Claim Your Data Reward!';
                    
                    extractBtn.onclick = () => {
                        alert('🎉 ยินดีด้วย! คุณได้รับรางวัล "Data Master Badge"!\n\nคุณได้เรียนรู้วิธีการดึงข้อมูลจากเว็บไซต์เรียบร้อยแล้ว!');
                    };
                }
                break;

            case 'performance-monitor':
                const optimizeBtn = document.getElementById('performance-optimize-btn');
                if (optimizeBtn) {
                    optimizeBtn.disabled = false;
                    optimizeBtn.style.background = 'linear-gradient(45deg, #ffff00, #cccc00)';
                    optimizeBtn.style.color = '#000';
                    optimizeBtn.style.cursor = 'pointer';
                    optimizeBtn.textContent = '🎯 Get Your Optimization Report!';
                    
                    optimizeBtn.onclick = () => {
                        alert('🚀 ยินดีด้วย! คุณได้รับ "Performance Expert Certificate"!\n\nคำแนะนำการปรับปรุง:\n• ใช้ Image Compression\n• Minify CSS/JS\n• Enable Gzip\n• Use CDN\n• Lazy Loading');
                    };
                }
                break;

            case 'page-manipulator':
                const transformBtn = document.getElementById('magic-transform-btn');
                if (transformBtn) {
                    transformBtn.disabled = false;
                    transformBtn.style.background = 'linear-gradient(45deg, #ff00ff, #cc00cc)';
                    transformBtn.style.color = '#fff';
                    transformBtn.style.cursor = 'pointer';
                    transformBtn.textContent = '✨ Magical Transformation Complete!';
                    
                    transformBtn.onclick = () => {
                        alert('🎭 ยินดีด้วย! คุณได้รับ "Web Magician Title"!\n\nคุณได้เรียนรู้วิธีการเปลี่ยนแปลงหน้าเว็บด้วยเอฟเฟกต์พิเศษแล้ว!');
                    };
                }
                break;
        }
    }

    showScriptCode(scriptId) {
        const codeArea = document.getElementById('script-code-area');
        if (codeArea) {
            codeArea.style.display = codeArea.style.display === 'none' ? 'block' : 'none';
        }
    }

    closeDemoModal() {
        this.cleanupCurrentDemo();
        
        if (this.currentDemoModal) {
            this.currentDemoModal.remove();
            this.currentDemoModal = null;
        }
        
        this.currentDemoScript = null;
    }

    cleanupCurrentDemo() {
        if (this.currentDemoScript && this.scriptData[this.currentDemoScript]) {
            const script = this.scriptData[this.currentDemoScript];
            if (script.demoScenario && script.demoScenario.cleanupDemo) {
                script.demoScenario.cleanupDemo();
            }
        }
        
        this.currentDemoElement = null;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px currentColor; }
        50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GooscriptCollectionManager();
    });
} else {
    new GooscriptCollectionManager();
}