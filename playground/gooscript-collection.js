// Gooscript Collection System - แทนที่ระบบรถเข็น
// ระบบรวบรวมสคริปต์สำหรับ Gooscript Extension

// เปลี่ยนชื่อและฟังก์ชันของระบบรถเข็นเป็นระบบคอลเลกชัน
(function() {
    'use strict';

    // เปลี่ยนข้อความในหน้าเว็บ
    function updateMarketplaceText() {
        // เปลี่ยนหัวข้อ
        const marketplaceTagline = document.querySelector('.marketplace-tagline');
        if (marketplaceTagline) {
            marketplaceTagline.textContent = 'ค้นพบ ทดลอง และรวบรวมสคริปต์ที่มีประสิทธิภาพสำหรับ Gooscript Extension';
        }

        // เปลี่ยนไอคอนและข้อความ counter
        const cartCounter = document.getElementById('cartCounter');
        if (cartCounter) {
            cartCounter.innerHTML = `
                <span class="counter-icon">📦</span>
                <span class="counter-number" id="collectionCount">0</span>
                <span class="counter-text">Collection</span>
            `;
            cartCounter.id = 'collectionCounter';
        }

        // เปลี่ยนข้อความปุ่มต่างๆ
        const cartButtons = document.querySelectorAll('.cart-package, .cart-download');
        cartButtons.forEach(btn => {
            if (btn.textContent.includes('Create Package')) {
                btn.innerHTML = '📦 สร้าง Gooscript Package';
            }
            if (btn.textContent.includes('Download All')) {
                btn.innerHTML = '📤 ส่งออกสำหรับ Gooscript';
            }
        });

        // เปลี่ยนหัวข้อ Shopping Cart เป็น Gooscript Collection
        const cartHeader = document.querySelector('.cart-header h3');
        if (cartHeader) {
            cartHeader.innerHTML = '📦 Gooscript Collection';
        }

        // เปลี่ยนข้อความ empty cart
        const emptyCart = document.querySelector('.empty-cart');
        if (emptyCart) {
            emptyCart.textContent = 'ยังไม่มีสคริปต์ในคอลเลกชัน เพิ่มสคริปต์เพื่อเริ่มต้นใช้งาน!';
        }
    }

    // ฟังก์ชันสำหรับจัดการคอลเลกชัน Gooscript
    class GooscriptCollectionManager {
        constructor() {
            this.collection = JSON.parse(localStorage.getItem('gooscriptCollection') || '[]');
            this.init();
        }

        init() {
            this.updateUI();
            this.setupEventListeners();
            updateMarketplaceText();
        }

        setupEventListeners() {
            // แทนที่ event listeners ของระบบรถเข็น
            document.addEventListener('click', (e) => {
                if (e.target.matches('.add-to-cart, .btn-add-to-cart')) {
                    e.preventDefault();
                    this.addToCollection(e.target);
                }

                if (e.target.matches('.cart-package, #createPackage')) {
                    e.preventDefault();
                    this.createGooscriptPackage();
                }

                if (e.target.matches('.cart-download, #downloadCart')) {
                    e.preventDefault();
                    this.exportForGooscript();
                }

                if (e.target.matches('.cart-clear, #clearCart')) {
                    e.preventDefault();
                    this.clearCollection();
                }
            });
        }

        addToCollection(button) {
            const scriptCard = button.closest('.script-card, .feature');
            if (!scriptCard) return;

            const scriptData = this.extractScriptData(scriptCard);
            
            // ตรวจสอบว่ามีในคอลเลกชันแล้วหรือไม่
            if (this.collection.find(item => item.id === scriptData.id)) {
                this.showNotification('⚠️ สคริปต์นี้อยู่ในคอลเลกชันแล้ว', 'warning');
                return;
            }

            this.collection.push(scriptData);
            this.saveCollection();
            this.updateUI();
            this.showNotification(`✅ เพิ่ม "${scriptData.name}" ลงคอลเลกชันแล้ว`, 'success');
        }

        extractScriptData(element) {
            const title = element.querySelector('h3, .script-title, .feature h3')?.textContent || 'Unknown Script';
            const description = element.querySelector('p, .script-description, .feature p')?.textContent || 'No description';
            
            return {
                id: this.generateId(title),
                name: title,
                description: description,
                category: this.detectCategory(title, description),
                addedAt: new Date().toISOString(),
                code: this.generateScriptCode(title, description)
            };
        }

        generateId(title) {
            return title.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 30);
        }

        detectCategory(title, description) {
            const text = (title + ' ' + description).toLowerCase();
            
            if (text.includes('security') || text.includes('scan') || text.includes('vulnerability')) {
                return 'security';
            }
            if (text.includes('form') || text.includes('auto') || text.includes('fill')) {
                return 'automation';
            }
            if (text.includes('data') || text.includes('extract') || text.includes('scrape')) {
                return 'data';
            }
            if (text.includes('performance') || text.includes('speed') || text.includes('optimize')) {
                return 'performance';
            }
            if (text.includes('fun') || text.includes('game') || text.includes('effect')) {
                return 'fun';
            }
            
            return 'general';
        }

        generateScriptCode(title, description) {
            const scriptName = title.replace(/[^\w\s]/g, '').replace(/\s+/g, '');
            
            return `// ${title}
// ${description}
(function() {
    'use strict';
    
    console.log('🦈 Starting ${title}...');
    
    const ${scriptName.toLowerCase()} = {
        init() {
            this.createUI();
            this.setupEventListeners();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = '${scriptName.toLowerCase()}-panel';
            panel.style.cssText = \`
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #00ff41;
                border-radius: 10px;
                padding: 15px;
                color: #00ff41;
                font-family: monospace;
                z-index: 10000;
            \`;
            
            panel.innerHTML = \`
                <h3 style="margin: 0 0 10px 0;">${title}</h3>
                <p style="margin: 0 0 10px 0; font-size: 0.9em;">${description}</p>
                <button onclick="this.parentElement.remove()" style="
                    background: #ff4444;
                    color: #fff;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                ">Close</button>
            \`;
            
            document.body.appendChild(panel);
        },
        
        setupEventListeners() {
            // Add your event listeners here
            console.log('${title} event listeners setup completed');
        },
        
        execute() {
            // Main script functionality here
            console.log('${title} is now running...');
            
            // Example functionality based on category
            ${this.generateCategorySpecificCode(this.detectCategory(title, description))}
        }
    };
    
    ${scriptName.toLowerCase()}.init();
    ${scriptName.toLowerCase()}.execute();
    
    console.log('✅ ${title} loaded successfully');
})();`;
        }

        generateCategorySpecificCode(category) {
            switch (category) {
                case 'security':
                    return `
            // Security scanning functionality
            const forms = document.querySelectorAll('form');
            console.log(\`Found \${forms.length} forms to analyze\`);
            
            if (location.protocol !== 'https:') {
                console.warn('⚠️ Site not using HTTPS - Security Risk!');
            }`;

                case 'automation':
                    return `
            // Form automation functionality
            const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
            console.log(\`Found \${inputs.length} input fields for automation\`);`;

                case 'data':
                    return `
            // Data extraction functionality
            const links = document.querySelectorAll('a[href]');
            const images = document.querySelectorAll('img[src]');
            console.log(\`Found \${links.length} links and \${images.length} images\`);`;

                case 'performance':
                    return `
            // Performance analysis functionality
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(\`Page load time: \${loadTime}ms\`);`;

                case 'fun':
                    return `
            // Fun effects functionality
            document.body.style.filter = 'hue-rotate(0deg)';
            let hue = 0;
            setInterval(() => {
                hue = (hue + 1) % 360;
                document.body.style.filter = \`hue-rotate(\${hue}deg)\`;
            }, 50);`;

                default:
                    return `
            // General functionality
            console.log('Script is running with general functionality');`;
            }
        }

        createGooscriptPackage() {
            if (this.collection.length === 0) {
                this.showNotification('⚠️ ไม่มีสคริปต์ในคอลเลกชัน', 'warning');
                return;
            }

            const packageData = {
                manifest: {
                    name: 'Custom Gooscript Package',
                    version: '1.0.0',
                    description: 'สคริปต์ที่รวบรวมจาก Shark Console',
                    author: 'Shark Console User',
                    createdAt: new Date().toISOString(),
                    totalScripts: this.collection.length
                },
                scripts: this.collection.map(script => ({
                    id: script.id,
                    name: script.name,
                    description: script.description,
                    category: script.category,
                    enabled: true,
                    code: script.code,
                    metadata: {
                        addedAt: script.addedAt,
                        source: 'shark-console'
                    }
                }))
            };

            this.downloadFile(
                JSON.stringify(packageData, null, 2),
                'gooscript-package.json',
                'application/json'
            );

            this.showNotification(`📦 สร้าง Gooscript Package เรียบร้อย (${this.collection.length} สคริปต์)`, 'success');
        }

        exportForGooscript() {
            if (this.collection.length === 0) {
                this.showNotification('⚠️ ไม่มีสคริปต์ในคอลเลกชัน', 'warning');
                return;
            }

            // สร้างไฟล์ JavaScript ที่พร้อมใช้
            const jsContent = `// Gooscript Collection Export
// สร้างเมื่อ: ${new Date().toLocaleString('th-TH')}
// จำนวนสคริปต์: ${this.collection.length}

const GooscriptCollection = {
    name: 'Shark Console Collection',
    version: '1.0.0',
    totalScripts: ${this.collection.length},
    
    scripts: [
${this.collection.map(script => `        {
            id: '${script.id}',
            name: '${script.name}',
            description: '${script.description}',
            category: '${script.category}',
            execute: function() {
${script.code.split('\n').map(line => '                ' + line).join('\n')}
            }
        }`).join(',\n')}
    ],
    
    executeAll() {
        console.log('🦈 Executing all Gooscript collection scripts...');
        this.scripts.forEach(script => {
            try {
                script.execute();
            } catch (error) {
                console.error('Error executing script:', script.name, error);
            }
        });
        console.log('✅ All scripts executed');
    },
    
    execute(scriptId) {
        const script = this.scripts.find(s => s.id === scriptId);
        if (script) {
            script.execute();
        } else {
            console.error('Script not found:', scriptId);
        }
    },
    
    list() {
        console.log('📦 Available scripts:');
        this.scripts.forEach((script, index) => {
            console.log(\`\${index + 1}. \${script.name} (\${script.id})\`);
        });
    }
};

// Auto-execute all scripts (comment out if not needed)
// GooscriptCollection.executeAll();

console.log('🦈 Gooscript Collection loaded!');
console.log('Use GooscriptCollection.list() to see available scripts');
console.log('Use GooscriptCollection.execute("script-id") to run specific script');
console.log('Use GooscriptCollection.executeAll() to run all scripts');`;

            this.downloadFile(jsContent, 'gooscript-collection.js', 'application/javascript');
            this.showNotification(`📤 ส่งออกสำหรับ Gooscript เรียบร้อย (${this.collection.length} สคริปต์)`, 'success');
        }

        clearCollection() {
            if (confirm('คุณต้องการลบสคริปต์ทั้งหมดในคอลเลกชันหรือไม่?')) {
                this.collection = [];
                this.saveCollection();
                this.updateUI();
                this.showNotification('🗑️ ลบคอลเลกชันทั้งหมดแล้ว', 'info');
            }
        }

        updateUI() {
            // อัปเดตตัวนับ
            const countElement = document.getElementById('collectionCount') || document.getElementById('cartCount');
            if (countElement) {
                countElement.textContent = this.collection.length;
            }

            // อัปเดตรายการในแผง
            this.updateCollectionPanel();
        }

        updateCollectionPanel() {
            const cartContent = document.getElementById('cartContent');
            if (!cartContent) return;

            if (this.collection.length === 0) {
                cartContent.innerHTML = '<p class="empty-cart">ยังไม่มีสคริปต์ในคอลเลกชัน เพิ่มสคริปต์เพื่อเริ่มต้นใช้งาน!</p>';
                return;
            }

            cartContent.innerHTML = this.collection.map(script => `
                <div class="cart-item" data-script-id="${script.id}">
                    <div class="item-info">
                        <h4>${script.name}</h4>
                        <p>${script.description}</p>
                        <small>หมวด: ${script.category} | เพิ่มเมื่อ: ${new Date(script.addedAt).toLocaleString('th-TH')}</small>
                    </div>
                    <div class="item-actions">
                        <button class="btn-preview" onclick="gooscriptManager.previewScript('${script.id}')">👁️ ดู</button>
                        <button class="btn-remove" onclick="gooscriptManager.removeFromCollection('${script.id}')">🗑️ ลบ</button>
                    </div>
                </div>
            `).join('');
        }

        previewScript(scriptId) {
            const script = this.collection.find(s => s.id === scriptId);
            if (!script) return;

            // สร้าง modal สำหรับแสดงโค้ด
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            modal.innerHTML = `
                <div style="
                    background: rgba(0, 20, 0, 0.95);
                    border: 2px solid #00ff41;
                    border-radius: 15px;
                    padding: 30px;
                    max-width: 90%;
                    max-height: 90%;
                    overflow: auto;
                    color: #00ff41;
                    font-family: monospace;
                ">
                    <h3>👁️ ${script.name}</h3>
                    <p style="color: #ccc; margin-bottom: 20px;">${script.description}</p>
                    <button onclick="eval(this.nextElementSibling.textContent)" style="
                        background: #00ff41;
                        color: #000;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-bottom: 15px;
                    ">🚀 ทดลองรัน</button>
                    <pre style="display: none;">${script.code}</pre>
                    <pre style="
                        background: rgba(0, 0, 0, 0.5);
                        padding: 20px;
                        border-radius: 8px;
                        overflow: auto;
                        white-space: pre-wrap;
                        max-height: 400px;
                    ">${script.code}</pre>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: #ff4444;
                        color: #fff;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 15px;
                    ">ปิด</button>
                </div>
            `;

            document.body.appendChild(modal);
        }

        removeFromCollection(scriptId) {
            const script = this.collection.find(s => s.id === scriptId);
            if (!script) return;

            if (confirm(`คุณต้องการลบ "${script.name}" จากคอลเลกชันหรือไม่?`)) {
                this.collection = this.collection.filter(s => s.id !== scriptId);
                this.saveCollection();
                this.updateUI();
                this.showNotification(`🗑️ ลบ "${script.name}" แล้ว`, 'info');
            }
        }

        saveCollection() {
            localStorage.setItem('gooscriptCollection', JSON.stringify(this.collection));
        }

        downloadFile(content, filename, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        showNotification(message, type = 'info') {
            const colors = {
                success: '#00ff41',
                warning: '#ffff00',
                error: '#ff4444',
                info: '#00ffff'
            };

            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: ${colors[type]};
                border: 2px solid ${colors[type]};
                padding: 15px 20px;
                border-radius: 8px;
                font-family: monospace;
                z-index: 10001;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }
    }

    // เพิ่ม CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .cart-item {
            background: rgba(0, 255, 65, 0.05);
            border: 1px solid rgba(0, 255, 65, 0.2);
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }
        .cart-item h4 {
            color: #00ff41;
            margin: 0 0 5px 0;
        }
        .cart-item p {
            color: #ccc;
            margin: 0 0 5px 0;
            font-size: 0.9em;
        }
        .cart-item small {
            color: #666;
            font-size: 0.8em;
        }
        .item-actions {
            margin-top: 10px;
        }
        .btn-preview, .btn-remove {
            background: rgba(0, 255, 65, 0.2);
            border: 1px solid #00ff41;
            color: #00ff41;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 5px;
            font-size: 0.8em;
        }
        .btn-remove {
            background: rgba(255, 68, 68, 0.2);
            border-color: #ff4444;
            color: #ff4444;
        }
    `;
    document.head.appendChild(style);

    // สร้าง instance และเริ่มต้นระบบ
    window.gooscriptManager = new GooscriptCollectionManager();

    console.log('🦈 Gooscript Collection System initialized!');
})();