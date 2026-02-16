// Add App Icon to Social Links
// สคริปต์สำหรับเพิ่มไอคอน app.png ลงใน social links

(function() {
    'use strict';
    
    // รอให้ DOM โหลดเสร็จ
    document.addEventListener('DOMContentLoaded', function() {
        addAppIcon();
    });
    
    // ถ้า DOM โหลดเสร็จแล้ว ให้รันทันที
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addAppIcon);
    } else {
        addAppIcon();
    }
    
    function addAppIcon() {
        // หา social-links container
        const socialLinks = document.querySelector('.social-links');
        
        if (!socialLinks) {
            console.log('Social links container not found');
            return;
        }
        
        // ตรวจสอบว่ามี app icon อยู่แล้วหรือไม่
        const existingAppIcon = socialLinks.querySelector('.app-link');
        if (existingAppIcon) {
            console.log('App icon already exists');
            return;
        }
        
        // สร้าง app icon link
        const appLink = document.createElement('a');
        appLink.href = '#download-app'; // เปลี่ยน URL ตามต้องการ
        appLink.target = '_blank';
        appLink.rel = 'noopener';
        appLink.title = 'Download App';
        appLink.className = 'social-link app-link';
        
        // สร้าง app icon image
        const appIcon = document.createElement('img');
        appIcon.src = 'gooimage/app.png';
        appIcon.alt = 'Download App';
        appIcon.className = 'social-icon app-icon';
        
        // เพิ่ม error handling สำหรับกรณีที่ไฟล์ไม่พบ
        appIcon.onerror = function() {
            console.warn('App icon not found: gooimage/app.png');
            // ใช้ไอคอนสำรองหรือซ่อน element
            this.style.display = 'none';
        };
        
        // รวม elements เข้าด้วยกัน
        appLink.appendChild(appIcon);
        
        // เพิ่มลงใน social links (หลังไอคอนสุดท้าย)
        socialLinks.appendChild(appLink);
        
        console.log('App icon added successfully');
        
        // เพิ่ม click event สำหรับ app icon
        appLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // แสดง modal หรือ redirect ไปหน้าดาวน์โหลด
            showAppDownloadModal();
        });
    }
    
    function showAppDownloadModal() {
        // สร้าง modal สำหรับดาวน์โหลด app
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
            backdrop-filter: blur(10px);
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(0, 20, 0, 0.95), rgba(0, 0, 0, 0.95));
                border: 2px solid #00ff41;
                border-radius: 15px;
                padding: 40px;
                max-width: 500px;
                text-align: center;
                color: #00ff41;
                font-family: monospace;
                box-shadow: 0 0 50px rgba(0, 255, 65, 0.3);
            ">
                <h2 style="margin: 0 0 20px 0; font-size: 2rem;">📱 Download Shark Console App</h2>
                <img src="gooimage/app-hover.png" alt="App Icon" style="
                    width: 80px;
                    height: 80px;
                    margin: 20px 0;
                    filter: drop-shadow(0 0 20px rgba(0, 255, 65, 0.8));
                ">
                <p style="color: #ccc; margin: 20px 0; line-height: 1.6;">
                    Get the mobile version of Shark Console with all your favorite security tools on the go!
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; margin: 30px 0;">
                    <button onclick="window.open('https://play.google.com/store', '_blank')" style="
                        background: linear-gradient(45deg, #00ff41, #00cc33);
                        color: #000;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    ">📱 Android</button>
                    <button onclick="window.open('https://apps.apple.com', '_blank')" style="
                        background: linear-gradient(45deg, #00ff41, #00cc33);
                        color: #000;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    ">🍎 iOS</button>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #ff4444;
                    color: #fff;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 20px;
                ">✕ Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // เพิ่ม animation
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.transition = 'opacity 0.3s ease';
            modal.style.opacity = '1';
        }, 10);
    }
    
    // เพิ่ม CSS animations สำหรับ app icon
    function addAppIconAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes appIconPulse {
                0%, 100% { 
                    transform: scale(1); 
                    filter: drop-shadow(0 0 5px rgba(0, 255, 65, 0.5));
                }
                50% { 
                    transform: scale(1.05); 
                    filter: drop-shadow(0 0 15px rgba(0, 255, 65, 0.8));
                }
            }
            
            .app-link:hover .app-icon {
                animation: appIconPulse 2s ease-in-out infinite;
            }
            
            /* เพิ่ม glow effect เมื่อ hover */
            .app-link::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0, 255, 65, 0.2), transparent);
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                z-index: -1;
            }
            
            .app-link:hover::after {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // เรียกใช้ animations
    addAppIconAnimations();
    
    console.log('🦈 App Icon Script loaded successfully!');
})();