// Enhanced Script.js with Gooscript Collection Mode
// แทนที่ระบบรถเข็นด้วยระบบคอลเลกชัน Gooscript

// โหลด Gooscript Collection System
document.addEventListener('DOMContentLoaded', function() {
    // โหลด script เดิมก่อน
    loadOriginalScript();
    
    // จากนั้นโหลดระบบ Gooscript Collection
    setTimeout(() => {
        loadGooscriptCollectionSystem();
    }, 1000);
});

function loadOriginalScript() {
    // Matrix background animation และ features อื่นๆ จาก script.js เดิม
    // (คัดลอกมาจาก script.js เดิม แต่ไม่รวมส่วนของรถเข็น)
    
    // Matrix background animation
    function updateStatus(message) {
        try {
            const n = document.getElementById('notification');
            if (n) {
                n.textContent = String(message);
                n.classList.add('show');
                setTimeout(() => { 
                    try { 
                        n.classList.remove('show'); 
                    } catch(_) { 
                        /* ignore */ 
                    } 
                }, 3000);
            }
            console.log(message);
        } catch(_) { 
            /* ignore */ 
        }
    }

    // Matrix canvas setup
    let canvas = document.getElementById('matrixCanvas');
    if (!canvas) {
        try {
            const c = document.createElement('canvas');
            c.id = 'matrixCanvas';
            c.style.position = 'fixed';
            c.style.top = '0';
            c.style.left = '0';
            c.style.width = '100%';
            c.style.height = '100%';
            c.style.zIndex = '-2';
            c.style.pointerEvents = 'none';
            document.body.prepend(c);
            canvas = c;
        } catch (_) { 
            /* ignore */ 
        }
    }

    const ctx = (canvas && canvas.getContext) ? canvas.getContext('2d') : null;

    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            try { 
                initDrops(); 
            } catch (_) { 
                /* ignore until initialized */ 
            }
        });
    }

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}ハッカー日本語αβγδεζηθικλμνξοπρστυφχψω";
    const matrixArray = matrix.split("");
    const baseFontSize = 10;
    let columns = ((canvas && canvas.width) ? canvas.width : window.innerWidth) / baseFontSize;
    const drops = [];
    const dropSpeeds = [];
    const dropSizes = [];
    const dropTrails = [];
    
    function initDrops() {
        columns = ((canvas && canvas.width) ? canvas.width : window.innerWidth) / baseFontSize;
        drops.length = 0;
        dropSpeeds.length = 0;
        dropSizes.length = 0;
        dropTrails.length = 0;
        
        for (let x = 0; x < columns; x++) {
            drops[x] = Math.random() * -100;
            dropSpeeds[x] = 0.5 + Math.random() * 1.5;
            dropSizes[x] = 0.7 + Math.random() * 0.6;
            dropTrails[x] = [];
        }
    }
    initDrops();

    function drawMatrix() {
        if (!canvas || !ctx) return;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.02)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const t = performance.now() * 0.001;
        const pulseEffect = Math.sin(t * 2) * 0.3 + 0.7;

        for (let i = 0; i < drops.length; i++) {
            const x = i * baseFontSize;
            const y = drops[i] * baseFontSize;
            const fontSize = baseFontSize * dropSizes[i];
            const speed = dropSpeeds[i];
            
            const baseHue = (t * 30 + i * 15) % 360;
            const secondaryHue = (baseHue + 120) % 360;
            const tertiaryHue = (baseHue + 240) % 360;
            
            if (!dropTrails[i]) dropTrails[i] = [];
            dropTrails[i].push({ x, y, time: t });
            dropTrails[i] = dropTrails[i].filter(point => t - point.time < 2);
            
            dropTrails[i].forEach((point, index) => {
                const age = t - point.time;
                const alpha = Math.max(0, 1 - age / 2) * 0.3;
                const trailHue = (baseHue + age * 60) % 360;
                
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = `hsl(${trailHue}, 100%, 70%)`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = `hsl(${trailHue}, 100%, 50%)`;
                ctx.font = (fontSize * 0.6) + 'px monospace';
                ctx.fillText('•', point.x, point.y);
                ctx.restore();
            });
            
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.font = fontSize + 'px monospace';
            
            ctx.save();
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = `hsl(${baseHue}, 100%, 50%)`;
            ctx.globalAlpha = 0.8 * pulseEffect;
            ctx.fillStyle = `hsl(${baseHue}, 100%, 80%)`;
            ctx.fillText(text, x, y);
            
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsl(${secondaryHue}, 100%, 60%)`;
            ctx.globalAlpha = 0.9 * pulseEffect;
            ctx.fillStyle = `hsl(${secondaryHue}, 100%, 70%)`;
            ctx.fillText(text, x, y);
            
            ctx.shadowBlur = 5;
            ctx.shadowColor = `hsl(${tertiaryHue}, 100%, 70%)`;
            ctx.globalAlpha = 1.0 * pulseEffect;
            ctx.fillStyle = `hsl(${tertiaryHue}, 100%, 90%)`;
            ctx.fillText(text, x, y);
            
            ctx.restore();
            
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = Math.random() * -20;
                dropSpeeds[i] = 0.5 + Math.random() * 1.5;
                dropSizes[i] = 0.7 + Math.random() * 0.6;
                dropTrails[i] = [];
            }
            drops[i] += speed;
        }
    }

    // Start matrix animation
    (function loop() {
        drawMatrix();
        requestAnimationFrame(loop);
    })();

    // Theme system
    const themes = {
        matrix: {
            primary: '#00ff41',
            secondary: '#00cc33',
            background: '#000000',
            text: '#ffffff'
        },
        cyberpunk: {
            primary: '#ff00ff',
            secondary: '#cc00cc',
            background: '#1a0033',
            text: '#ffffff'
        },
        hacker: {
            primary: '#00ffff',
            secondary: '#0099cc',
            background: '#001122',
            text: '#ffffff'
        },
        neon: {
            primary: '#ffff00',
            secondary: '#cccc00',
            background: '#333300',
            text: '#ffffff'
        },
        ocean: {
            primary: '#0066ff',
            secondary: '#0044cc',
            background: '#001133',
            text: '#ffffff'
        },
        fire: {
            primary: '#ff6600',
            secondary: '#cc4400',
            background: '#330011',
            text: '#ffffff'
        }
    };

    function applyTheme(themeName) {
        const theme = themes[themeName];
        if (!theme) return;

        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        document.documentElement.style.setProperty('--background-color', theme.background);
        document.documentElement.style.setProperty('--text-color', theme.text);

        localStorage.setItem('selectedTheme', themeName);
        
        const currentThemeName = document.getElementById('currentThemeName');
        if (currentThemeName) {
            currentThemeName.textContent = themeName.charAt(0).toUpperCase() + themeName.slice(1);
        }
    }

    // Theme selector event listeners
    document.addEventListener('click', function(e) {
        if (e.target.matches('.theme-option')) {
            const themeName = e.target.dataset.theme;
            if (themeName) {
                document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
                applyTheme(themeName);
            }
        }

        if (e.target.matches('#themeToggle')) {
            const dropdown = document.getElementById('themeDropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        }

        if (e.target.matches('#themeClose')) {
            const dropdown = document.getElementById('themeDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('selectedTheme') || 'matrix';
    applyTheme(savedTheme);

    console.log('🦈 Original script features loaded');
}

function loadGooscriptCollectionSystem() {
    // โหลดระบบ Gooscript Collection
    const script = document.createElement('script');
    script.src = 'gooscript-collection.js';
    script.onload = function() {
        console.log('🦈 Gooscript Collection System loaded');
        
        // เพิ่มปุ่มสำหรับเข้าสู่โหมด Preview
        addPreviewModeButton();
        
        // แสดงข้อความแจ้งเตือนเกี่ยวกับโหมดใหม่
        showGooscriptModeNotification();
    };
    script.onerror = function() {
        console.warn('Could not load Gooscript Collection System, using fallback');
        initFallbackGooscriptSystem();
    };
    document.head.appendChild(script);
}

function addPreviewModeButton() {
    // เพิ่มปุ่มสำหรับเข้าสู่โหมด Preview
    const ctaSection = document.querySelector('.cta');
    if (ctaSection) {
        const previewButton = document.createElement('a');
        previewButton.href = 'gooscript-preview.html';
        previewButton.className = 'btn';
        previewButton.style.cssText = `
            background: linear-gradient(45deg, #ff6600, #ff8800);
            margin: 10px;
            box-shadow: 0 0 20px rgba(255, 102, 0, 0.3);
        `;
        previewButton.innerHTML = '🦈 Gooscript Collection Preview';
        
        // เพิ่มหลังปุ่มแรก
        const firstButton = ctaSection.querySelector('.btn');
        if (firstButton) {
            firstButton.parentNode.insertBefore(previewButton, firstButton.nextSibling);
        } else {
            ctaSection.appendChild(previewButton);
        }
    }
}

function showGooscriptModeNotification() {
    // แสดงข้อความแจ้งเตือนเกี่ยวกับโหมดใหม่
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, rgba(255, 102, 0, 0.9), rgba(255, 136, 0, 0.9));
        color: #000;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: bold;
        z-index: 10001;
        font-family: monospace;
        box-shadow: 0 0 30px rgba(255, 102, 0, 0.5);
        animation: slideDown 0.5s ease;
        cursor: pointer;
    `;
    notification.innerHTML = `
        🦈 ใหม่! ระบบ Gooscript Collection - คลิกเพื่อทดลอง
    `;
    
    notification.addEventListener('click', () => {
        window.location.href = 'gooscript-preview.html';
    });
    
    document.body.appendChild(notification);
    
    // ซ่อนหลังจาก 5 วินาที
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 5000);
}

function initFallbackGooscriptSystem() {
    // ระบบสำรองในกรณีที่โหลดไฟล์หลักไม่ได้
    console.log('🦈 Initializing fallback Gooscript system...');
    
    // เปลี่ยนข้อความพื้นฐาน
    const marketplaceTagline = document.querySelector('.marketplace-tagline');
    if (marketplaceTagline) {
        marketplaceTagline.textContent = 'ค้นพบ ทดลอง และรวบรวมสคริปต์สำหรับ Gooscript Extension';
    }
    
    // เปลี่ยนไอคอนรถเข็น
    const cartCounter = document.getElementById('cartCounter');
    if (cartCounter) {
        cartCounter.innerHTML = `
            <span class="counter-icon">📦</span>
            <span class="counter-number">0</span>
            <span class="counter-text">Collection</span>
        `;
    }
    
    // เพิ่ม event listener พื้นฐาน
    document.addEventListener('click', function(e) {
        if (e.target.matches('.add-to-cart, .btn-add-to-cart')) {
            e.preventDefault();
            alert('🦈 Gooscript Collection: กรุณาใช้โหมด Preview สำหรับฟีเจอร์เต็มรูปแบบ');
        }
    });
    
    addPreviewModeButton();
}

// เพิ่ม CSS animations
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
`;
document.head.appendChild(style);

console.log('🦈 Gooscript Mode Script loaded');