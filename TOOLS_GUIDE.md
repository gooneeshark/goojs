# Goonee Labs: Tools & Security Toolkit Guide

ยินดีต้อนรับสู่คู่มือการใช้งานเครื่องมือทั้งหมดใน Goonee Labs โปรเจคนี้รวบรวมเครื่องมือด้านความปลอดภัย (Security), การพัฒนาเว็บ (Development), และการปรับแต่ง (Customization) ไว้ในที่เดียว

---

## 1. Goonee Labs (Interactive Platform)
**ที่อยู่:** `/LAB`
แพลตฟอร์มการเรียนรู้ด้าน Cybersecurity แบบ Interactive

- **API Security Lab:** เรียนรู้การทำงานของ API และการจัดการ Auth ผ่านระบบจำลอง Gambling API
- **Classical Ciphers:** ศึกษาการเข้ารหัส Caesar, Vigenère และเทคนิคการถอดรหัส
- **Network Forensics:** วิเคราะห์ traffic และแพ็กเก็ตจำลอง
- **Firewall Config:** ฝึกการตั้งค่า Rules ป้องกันระบบ
- **Port Scanning:** จำลองการใช้ `nmap`
- **MITM Attack:** เข้าใจการโจมตีแบบดักรับข้อมูล
- **DDoS Simulation:** จำลองสถาณการณ์การโจมตี DDoS

---

## 2. SharkTool (Bookmarklet Toolkit)
**ที่อยู่:** `/bookmarklettool`
ชุดเครื่องมือที่สามารถรันได้ทันทีบนเว็บไซต์ใดก็ได้ผ่าน Bookmarklet หรือสคริปต์โหลดเดอร์

- **SharkTool Loader (`loader.js`):** ตัวจัดการการโหลดเครื่องมือ (Manage items) สามารถเลือกโหลดเฉพาะที่ต้องการได้
- **Monitor (`monitor.js`):** ตรวจสอบสถานะระบบเบื้องต้น
- **Theme (`Theme.js` / `panel-theme.css`):** ปรับเปลี่ยนหน้าตาของเว็บไซต์แบบเรียลไทม์ (Dark, Cyber, Retro, etc.)
- **BurpShark (`burpshark.js`):** เครื่องมือจำลองการดักจับ Request
- **PostShark (`postshark.js`):** เครื่องมือส่ง Request (คล้าย Postman แบบย่อ)
- **Dev Panel (`tool.js`):** แผงควบคุม Hacker สไตล์ (Random Clicker, Form Scanner, Unlocker)

---

## 3. Chrome Extensions
**ที่อยู่:** `/gooextension`, `/GooneeXeruda`, `/Gooscript`
ส่วนขยายเบราว์เซอร์สำหรับเพิ่มประสิทธิภาพและความสวยงาม

- **GooneeXeruda:** ติดตั้ง `eruda` (Console สำหรับมือถือ) เพื่อให้ดีบักเว็บได้ทุกที่
- **Gooscript:** รัน Custom JavaScript บนหน้าเว็บโดยอัตโนมัติ
- **Twitter Theme:** เปลี่ยนธีม X/Twitter ให้สวยงาม (Matrix Style)

---

## 4. Playground & Marketplace
**ที่อยู่:** `/playground`
ศูนย์รวมของเล่นและสคริปต์ขั้นสูง

- **Script Marketplace:** ตลาดรันสคริปต์ที่คัดสรรมาแล้ว (Security, Automation, Data)
- **System Monitor:** ตรวจสอบ CPU/RAM/Network
- **Metatag Generator:** เครื่องมือสร้าง Meta Tag สำหรับ Social Sharing

---

## เทคนิคการใช้งานพื้นฐาน
### การรันเครื่องมือผ่าน Console
หากต้องการรันตัวเดโมใน Playground/LAB ให้ใช้คำสั่ง JavaScript ที่ระบุใน `index.html` ของแต่ละส่วน

### การใช้บนมือถือ
แนะนำให้ใช้ **Kiwi Browser** (Android) เพื่อรองรับการติดตั้ง Extension `.crx` และการรัน Bookmarklet ที่ซับซ้อน

### พัฒนาโมดูลเอง
สามารถเพิ่มเครื่องมือใน `bookmarklettool/manifest.json` ตามโครงสร้างที่ระบุใน `DEV_GUIDE.md`
