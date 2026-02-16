// ฟังก์ชันสร้าง panel ของเครื่องมือ MiniBurp (Request Converter)
function runMiniBurp() {
  // ถ้ามี panel อยู่แล้ว (เรียกซ้ำ) ให้ยกเลิกก่อน
  const existing = document.getElementById('mini-burp-panel');
  if (existing) { existing.remove(); }

  const panel = document.createElement('div');
  panel.id = 'mini-burp-panel';
  panel.style.cssText = `
    position:fixed; top:20px; right:20px;
    z-index:2147483647; background:rgba(0,0,0,0.96); color:#fff;
    padding:16px 12px; border-radius:10px; border:2px solid #00bcd4;
    box-shadow:0 0 14px #00bcd488; font-family:sans-serif; min-width:320px; max-width:90vw;
    touch-action:none;
  `;
  panel.innerHTML = `
    <div style="font-size:17px; margin-bottom:10px; color:#00e5ff;">
      MiniBurp - ตัวแปลง Request
      <button id="mini-burp-closeBtn" style="float:right; background:#b71c1c;color:#fff;padding:4px 8px;border:none;border-radius:4px;">✕</button>
    </div>
    <textarea id="mini-burp-inputArea" placeholder="วาง Payload หรือ HAR JSON ที่นี่..." 
      style="width:100%;height:90px;resize:vertical;border-radius:6px;padding:7px;font-size:14px;"></textarea><br>
    <button id="mini-burp-convertBtn" style="margin:8px 0;padding:8px 18px;border-radius:6px;border:none;background:#0097a7;color:#fff;font-size:15px;">
      แปลงเป็น Request
    </button><br>
    <textarea id="mini-burp-outputArea" placeholder="ผลลัพธ์ของ Request จะปรากฏที่นี่..." 
      style="width:100%;height:90px;resize:vertical;border-radius:6px;padding:7px;font-size:14px;margin-top:7px;"></textarea>
    <div style="margin-top:6px;">
      <button id="mini-burp-copyBtn" style="padding:6px 18px;border-radius:6px;border:none;background:#43a047;color:#fff;font-size:14px;">
        คัดลอก Request
      </button>
    </div>
    <div id="mini-burp-msg" style="margin-top:7px;color:#ffeb3b;font-size:13px;"></div>
  `;
  document.body.appendChild(panel);

  // ฟังก์ชันลาก panel ได้จากทุกจุด (ยกเว้น control)
  (function enableDrag(){
    let dragging=false, sx=0, sy=0, sl=0, st=0;
    function onPointerDown(e){
      if (e.target.closest('button, input, select, textarea, a, label')) return;
      const r=panel.getBoundingClientRect();
      sl = r.left; st = r.top; sx = e.clientX; sy = e.clientY; dragging = true;
      panel.style.left = sl + 'px'; panel.style.top = st + 'px'; panel.style.right = 'auto';
      try { panel.setPointerCapture(e.pointerId); } catch(_) {}
      e.preventDefault();
    }
    function onPointerMove(e){
      if (!dragging) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      panel.style.left = (sl + dx) + 'px'; panel.style.top = (st + dy) + 'px';
    }
    function onPointerUp(e){
      dragging = false;
      try { panel.releasePointerCapture(e.pointerId); } catch(_) {}
    }
    panel.addEventListener('pointerdown', onPointerDown, {passive:false});
    window.addEventListener('pointermove', onPointerMove, {passive:true});
    window.addEventListener('pointerup', onPointerUp, {passive:true});
    window.addEventListener('pointercancel', onPointerUp, {passive:true});
  })();

  // ฟังก์ชันแปลงข้อมูล (HAR/Raw/Response เป็น HTTP request)
  function parseInput(input) {
    try {
      const har = JSON.parse(input);
      if (har.log && har.log.entries && har.log.entries.length) {
        const entry = har.log.entries[0];
        const req = entry.request;
        let out = `${req.method} ${req.url} HTTP/1.1\n`;
        req.headers.forEach(h => { out += `${h.name}: ${h.value}\n`; });
        out += '\n';
        if (req.postData && req.postData.text) out += req.postData.text;
        return out.trim();
      }
    } catch {}
    if (/^([A-Z]+)\s+\S+\s+HTTP/i.test(input)) {
      let lines = input.replace(/\r/g,'').split('\n');
      let reqLine = lines[0].replace(/\s+/g,' ').trim();
      let headers = [], bodyIdx = lines.findIndex(l=>/^\s*$/.test(l));
      let body = bodyIdx>=0 ? lines.slice(bodyIdx+1).join('\n').trim() : '';
      let headerLines = bodyIdx>=0 ? lines.slice(1,bodyIdx) : lines.slice(1);
      let hasHost=false, hasUA=false;
      headerLines.forEach(h=>{
        if (/^host:/i.test(h)) hasHost=true;
        if (/^user-agent:/i.test(h)) hasUA=true;
        if (h.trim()) headers.push(h.replace(/\s+/g,' ').trim());
      });
      if (!hasHost) headers.unshift('Host: example.com');
      if (!hasUA) headers.push('User-Agent: MiniBurp/1.0');
      let out = reqLine + '\n' + headers.join('\n') + '\n\n' + body;
      return out.trim();
    }
    if (/HTTP\/\d\.\d\s+\d+/.test(input)) {
      const lines = input.split(/\r?\n/);
      let idx = lines.findIndex(l=>/^\s*$/.test(l));
      if (idx > 0) return lines.slice(0,idx).join('\n');
    }
    return '// ไม่สามารถแปลงข้อมูลนี้เป็น HTTP request ได้';
  }

  // ตั้งค่าปุ่มต่างๆ ใน panel
  document.getElementById('mini-burp-convertBtn').onclick = () => {
    const input = document.getElementById('mini-burp-inputArea').value.trim();
    if (!input) {
      document.getElementById('mini-burp-msg').textContent = 'กรุณาวางข้อมูลก่อน';
      return;
    }
    const req = parseInput(input);
    document.getElementById('mini-burp-outputArea').value = req;
    document.getElementById('mini-burp-msg').textContent = req.startsWith('//') ? 'ข้อมูลไม่ถูกต้องหรือไม่รองรับ' : 'แปลงสำเร็จ!';
  };
  document.getElementById('mini-burp-closeBtn').onclick = () => panel.remove();
  document.getElementById('mini-burp-copyBtn').onclick = () => {
    const txt = document.getElementById('mini-burp-outputArea').value;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(txt).then(()=>{
        document.getElementById('mini-burp-msg').textContent = 'คัดลอกแล้ว!';
      }).catch(()=>{ fallbackCopy(txt); });
    } else {
      fallbackCopy(txt);
    }
  };
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try {
      const ok = document.execCommand('copy');
      document.getElementById('mini-burp-msg').textContent = ok ? 'คัดลอกแล้ว!' : 'คัดลอกไม่สำเร็จ';
    } catch(e) {
      document.getElementById('mini-burp-msg').textContent = 'คัดลอกไม่สำเร็จ: ' + e;
    }
    document.body.removeChild(ta);
  }
}

// ฟังก์ชันสร้าง panel ของเครื่องมือ MiniPostman (HTTP Request Sender)
function runMiniPostman() {
  // ยกเลิก panel เดิมถ้ามีอยู่
  const existing = document.getElementById('mini-postman-panel');
  if (existing) { existing.remove(); }

  const panel = document.createElement('div');
  panel.id = 'mini-postman-panel';
  panel.style.cssText = `
    position:fixed; top:20px; left:50%; transform:translateX(-50%);
    z-index:2147483647; background:rgba(0,0,0,0.95); color:#fff;
    padding:18px 22px; border-radius:12px; border:2px solid #4caf50;
    box-shadow:0 0 16px #4caf5099; font-family:sans-serif; min-width:320px; max-width:90vw;
    touch-action:none;
  `;
  panel.innerHTML = `
    <div style="font-size:18px; margin-bottom:10px; color:#4caf50;">
      MiniPostman
      <button id="mini-postman-closeBtn" style="float:right;background:#b71c1c;color:#fff;padding:4px 8px;border:none;border-radius:4px;">✕</button>
    </div>
    <input id="mini-postman-urlInput" placeholder="URL" 
      style="width:100%;padding:7px;margin-bottom:7px;border-radius:5px;border:1px solid #666;font-size:15px;"><br>
    <select id="mini-postman-methodSelect" style="width:100%;padding:6px;margin-bottom:7px;border-radius:5px;font-size:15px;">
      <option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option>
    </select><br>
    <textarea id="mini-postman-headersInput" placeholder="Headers (JSON)" 
      style="width:100%;height:48px;resize:vertical;border-radius:5px;padding:7px;font-size:14px;margin-bottom:7px;"></textarea><br>
    <textarea id="mini-postman-bodyInput" placeholder="Body (ถ้ามี)" 
      style="width:100%;height:60px;resize:vertical;border-radius:5px;padding:7px;font-size:14px;margin-bottom:7px;"></textarea><br>
    <button id="mini-postman-sendBtn" style="width:100%;margin-bottom:6px;padding:7px;background:#222;color:#4caf50;border:none;border-radius:6px;cursor:pointer;font-size:16px;">
      🚀 ส่งคำขอ
    </button><br>
    <div id="mini-postman-result" style="margin-top:12px;text-align:left;font-size:13px;color:#fff;"></div>
  `;
  document.body.appendChild(panel);

  // ฟังก์ชันลาก panel ได้จากทุกจุด
  (function enableDrag(){
    let dragging=false, sx=0, sy=0, sl=0, st=0;
    function onPointerDown(e){
      if (e.target.closest('button, input, select, textarea, a, label')) return;
      const r = panel.getBoundingClientRect();
      sl = r.left; st = r.top; sx = e.clientX; sy = e.clientY; dragging = true;
      panel.style.left = sl + 'px'; panel.style.top = st + 'px'; panel.style.right = 'auto';
      try { panel.setPointerCapture(e.pointerId); } catch(_) {}
      e.preventDefault();
    }
    function onPointerMove(e){
      if (!dragging) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      panel.style.left = (sl + dx) + 'px'; panel.style.top = (st + dy) + 'px';
    }
    function onPointerUp(e){
      dragging = false;
      try { panel.releasePointerCapture(e.pointerId); } catch(_) {}
    }
    panel.addEventListener('pointerdown', onPointerDown, {passive:false});
    window.addEventListener('pointermove', onPointerMove, {passive:true});
    window.addEventListener('pointerup', onPointerUp, {passive:true});
    window.addEventListener('pointercancel', onPointerUp, {passive:true});
  })();

  // ฟังก์ชันช่วยแก้ไข JSON เบื้องต้น
  function autoFixJson(str) {
    try { return JSON.parse(str); } catch {}
    let fixed = str.trim()
      .replace(/([,{]\s*)([a-zA-Z0-9_-]+)\s*:/g, '$1"$2":')   // ใส่เครื่องหมาย quote ให้ key
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/(['"])??([a-zA-Z0-9_-]+)(['"])?:/g, '"$2":')  // แก้ key ที่ขาด quote
      .replace(/:(\s*)'([^']*)'/g, ': "$2"')  // เปลี่ยนค่าที่อยู่ใน single quote ให้เป็น double quote
      .replace(/:(\s*)\b(true|false|null)\b/g, ': "$2"')  // แปลง boolean/null เป็น string
      .replace(/\s+/g, ' ');
    try { return JSON.parse(fixed); } catch {}
    if (fixed.lastIndexOf('{') > fixed.lastIndexOf('}')) fixed += '}';
    try { return JSON.parse(fixed); } catch {}
    return {};
  }

  // กำหนดการทำงานของปุ่มส่งคำขอ
  document.getElementById('mini-postman-sendBtn').onclick = () => {
    const url = document.getElementById('mini-postman-urlInput').value.trim();
    const method = document.getElementById('mini-postman-methodSelect').value;
    const body = document.getElementById('mini-postman-bodyInput').value;
    let headers = {};
    try {
      headers = autoFixJson(document.getElementById('mini-postman-headersInput').value);
    } catch {
      alert('Header ไม่ถูกต้องและไม่สามารถแก้ไขได้');
      return;
    }
    fetch(url, {
      method,
      headers,
      body: method !== 'GET' ? body : null
    })
    .then(r => r.text())
    .then(txt => { document.getElementById('mini-postman-result').textContent = txt; })
    .catch(e => { document.getElementById('mini-postman-result').textContent = 'เกิดข้อผิดพลาด: ' + e; });
  };
  document.getElementById('mini-postman-closeBtn').onclick = () => panel.remove();
}

// ฟังก์ชันสร้าง panel ของเครื่องมือ SharkScan (Ping, Whois, DNS, HTTP Headers)
function runSharkScan() {
  const existing = document.getElementById('shark-scan-panel');
  if (existing) { existing.remove(); }

  const panel = document.createElement('div');
  panel.id = 'shark-scan-panel';
  panel.style.cssText = `
    position:fixed; top:120px; left:50%; transform:translateX(-50%);
    z-index:2147483647; background:rgba(0,0,0,0.92); color:#fff;
    padding:18px 22px; border-radius:12px; border:2px solid #2196f3;
    box-shadow:0 0 16px #2196f399; font-family:sans-serif; min-width:280px; max-width:90vw;
    text-align:center;
  `;
  panel.innerHTML = `
    <div style="font-size:19px; margin-bottom:12px; color:#03a9f4;">
      เครื่องมือดีบักเบื้องต้น (Lab)
      <button id="shark-scan-closeBtn" style="float:right;background:#b71c1c;color:#fff;padding:4px 8px;border:none;border-radius:4px;">✕</button>
    </div>
    <button id="shark-scan-pingBtn" style="margin:6px 0;width:90%;padding:8px;border-radius:6px;border:none;background:#263238;color:#fff;font-size:15px;">
      Ping เว็บไซต์
    </button><br>
    <button id="shark-scan-whoisBtn" style="margin:6px 0;width:90%;padding:8px;border-radius:6px;border:none;background:#263238;color:#fff;font-size:15px;">
      Whois Lookup
    </button><br>
    <button id="shark-scan-dnsBtn" style="margin:6px 0;width:90%;padding:8px;border-radius:6px;border:none;background:#263238;color:#fff;font-size:15px;">
      DNS Lookup
    </button><br>
    <button id="shark-scan-httpBtn" style="margin:6px 0;width:90%;padding:8px;border-radius:6px;border:none;background:#263238;color:#fff;font-size:15px;">
      HTTP Headers
    </button><br>
    <div id="shark-scan-result" style="margin-top:12px;text-align:left;font-size:13px;color:#fff;"></div>
  `;
  document.body.appendChild(panel);

  // ลาก panel ได้จากทุกจุด
  (function enableDrag(){
    let dragging=false, sx=0, sy=0, sl=0, st=0;
    function onPointerDown(e){
      if (e.target.closest('button')) return;
      const r = panel.getBoundingClientRect();
      sl = r.left; st = r.top; sx = e.clientX; sy = e.clientY; dragging = true;
      panel.style.left = sl + 'px'; panel.style.top = st + 'px'; panel.style.right = 'auto';
      try { panel.setPointerCapture(e.pointerId); } catch(_) {}
      e.preventDefault();
    }
    function onPointerMove(e){
      if (!dragging) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      panel.style.left = (sl + dx) + 'px'; panel.style.top = (st + dy) + 'px';
    }
    function onPointerUp(e){
      dragging = false;
      try { panel.releasePointerCapture(e.pointerId); } catch(_) {}
    }
    panel.addEventListener('pointerdown', onPointerDown, {passive:false});
    window.addEventListener('pointermove', onPointerMove, {passive:true});
    window.addEventListener('pointerup', onPointerUp, {passive:true});
    window.addEventListener('pointercancel', onPointerUp, {passive:true});
  })();

  function fetchTool(url, callback) {
    fetch(url).then(r=>r.text()).then(callback).catch(()=>{
      callback('เกิดข้อผิดพลาดหรือโดนบล็อก CORS');
    });
  }

  document.getElementById('shark-scan-pingBtn').onclick = () => {
    const target = prompt('ใส่โดเมนหรือ IP ที่ต้องการ Ping:');
    if (target) {
      document.getElementById('shark-scan-result').textContent = 'กำลัง Ping...';
      fetchTool('https://api.hackertarget.com/nping/?q='+encodeURIComponent(target), res=>{
        document.getElementById('shark-scan-result').textContent = res;
      });
    }
  };
  document.getElementById('shark-scan-whoisBtn').onclick = () => {
    const target = prompt('ใส่โดเมนที่ต้องการ Whois:');
    if (target) {
      document.getElementById('shark-scan-result').textContent = 'กำลังค้นหา Whois...';
      fetchTool('https://api.hackertarget.com/whois/?q='+encodeURIComponent(target), res=>{
        document.getElementById('shark-scan-result').textContent = res;
      });
    }
  };
  document.getElementById('shark-scan-dnsBtn').onclick = () => {
    const target = prompt('ใส่โดเมนที่ต้องการ DNS Lookup:');
    if (target) {
      document.getElementById('shark-scan-result').textContent = 'กำลังค้นหา DNS...';
      fetchTool('https://api.hackertarget.com/dnslookup/?q='+encodeURIComponent(target), res=>{
        document.getElementById('shark-scan-result').textContent = res;
      });
    }
  };
  document.getElementById('shark-scan-httpBtn').onclick = () => {
    const target = prompt('ใส่ URL ที่ต้องการดู HTTP Headers:');
    if (target) {
      document.getElementById('shark-scan-result').textContent = 'กำลังดึง HTTP Headers...';
      fetchTool('https://api.hackertarget.com/httpheaders/?q='+encodeURIComponent(target), res=>{
        document.getElementById('shark-scan-result').textContent = res;
      });
    }
  };
  document.getElementById('shark-scan-closeBtn').onclick = () => panel.remove();
}

// ฟังก์ชันสร้าง panel ของ SharkSnipers (CSS Selector Auto-Clicker)
function runSnipers() {
  const existing = document.getElementById('shark-snipers-panel');
  if (existing) { existing.remove(); }

  const panel = document.createElement('div');
  panel.id = 'shark-snipers-panel';
  panel.style.cssText = [
    'position:fixed',
    'z-index:2147483647',
    'top:20px',
    'right:20px',
    'background:#111',
    'color:#fff',
    'font:14px/1.4 system-ui, sans-serif',
    'border:1px solid #333',
    'border-radius:8px',
    'box-shadow:0 6px 18px rgba(0,0,0,.4)',
    'width:300px',
    'max-width:90vw',
    'padding:10px',
    'touch-action:none'
  ].join(';');
  panel.innerHTML = ''
    + '<div id="snipers-header" style="display:flex;justify-content:space-between;align-items:center;'
    + 'gap:8px;margin:-10px -10px 8px -10px;padding:8px 10px;cursor:move;background:#0d0d0d;'
    + 'border-bottom:1px solid #222;border-top-left-radius:8px;border-top-right-radius:8px">'
    +   '<strong>SharkSnipers</strong>'
    +   '<div>'
    +     '<button id="snipers-min" style="margin-right:6px">_</button>'
    +     '<button id="snipers-close">✕</button>'
    +   '</div>'
    + '</div>'
    + '<label style="display:block;margin:6px 0 4px">CSS Selector</label>'
    + '<input id="snipers-selector" type="text" placeholder=".btn.buy-now" '
    +   'style="width:100%;padding:6px;border-radius:4px;border:1px solid #444;'
    +   'background:#1a1a1a;color:#fff" />'
    + '<div style="display:flex;gap:8px;margin-top:8px;align-items:center;">'
    +   '<label>Interval (ms)</label>'
    +   '<input id="snipers-interval" type="number" min="50" value="1000" '
    +     'style="width:100px;padding:4px;border-radius:4px;border:1px solid #444;'
    +     'background:#1a1a1a;color:#fff" />'
    + '</div>'
    + '<div style="display:flex;gap:8px;margin-top:10px;">'
    +   '<button id="snipers-start" style="flex:1;background:#16a34a;color:#fff;'
    +     'border:none;border-radius:6px;padding:8px 10px">Start</button>'
    +   '<button id="snipers-stop" style="flex:1;background:#dc2626;color:#fff;'
    +     'border:none;border-radius:6px;padding:8px 10px" disabled>Stop</button>'
    + '</div>'
    + '<div style="margin-top:8px;font-size:12px;color:#ccc">'
    +   '<span id="snipers-status">พร้อม</span> · คลิกแล้ว: <span id="snipers-count">0</span>'
    + '</div>'
    + '<div style="margin-top:6px;font-size:12px;color:#999">'
    +   'ใช้งานอย่างระมัดระวัง เคารพกฎของเว็บไซต์ และข้อกำหนดการใช้งาน'
    + '</div>';
  document.body.appendChild(panel);

  // ลาก panel ได้จาก header (ยกเว้นปุ่มภายใน)
  (function enableDrag(){
    let dragging=false, sx=0, sy=0, sl=0, st=0;
    function onPointerDown(e){
      const el = e.target;
      if (el.closest('button, input, select, textarea, a, label')) return;
      const r = panel.getBoundingClientRect();
      sl = r.left; st = r.top; sx = e.clientX; sy = e.clientY; dragging = true;
      panel.style.left = sl + 'px'; panel.style.top = st + 'px'; panel.style.right = 'auto';
      try { panel.setPointerCapture(e.pointerId); } catch(_) {}
      e.preventDefault();
    }
    function onPointerMove(e){
      if (!dragging) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      panel.style.left = (sl + dx) + 'px'; panel.style.top = (st + dy) + 'px';
    }
    function onPointerUp(e){
      dragging = false;
      try { panel.releasePointerCapture(e.pointerId); } catch(_) {}
    }
    panel.addEventListener('pointerdown', onPointerDown, {passive:false});
    window.addEventListener('pointermove', onPointerMove, {passive:true});
    window.addEventListener('pointerup', onPointerUp, {passive:true});
    window.addEventListener('pointercancel', onPointerUp, {passive:true});
  })();

  const selInput = panel.querySelector('#snipers-selector');
  const intInput = panel.querySelector('#snipers-interval');
  const startBtn = panel.querySelector('#snipers-start');
  const stopBtn  = panel.querySelector('#snipers-stop');
  const statusEl = panel.querySelector('#snipers-status');
  const countEl  = panel.querySelector('#snipers-count');
  let timer=null, count=0, minimized=false;

  panel.querySelector('#snipers-close').onclick = () => panel.remove();
  panel.querySelector('#snipers-min').onclick = () => {
    minimized = !minimized;
    Array.from(panel.children).forEach((ch,i) => {
      if (i>0) ch.style.display = minimized ? 'none' : '';
    });
  };
  function setStatus(t){ statusEl.textContent = t; }
  function enableRun(r){ startBtn.disabled = r; stopBtn.disabled = !r; }

  function clickOnce(q){
    let clicked = 0;
    try {
      document.querySelectorAll(q).forEach(n=>{
        try { n.click(); clicked++; } catch(_) {}
      });
    } catch(err) {
      console.warn('SharkSnipers selector error:', err);
      setStatus('Selector ไม่ถูกต้อง');
    }
    return clicked;
  }

  startBtn.onclick = () => {
    const q = (selInput.value||'').trim();
    const ms = Math.max(50, parseInt(intInput.value||'1000', 10));
    if (!q) {
      setStatus('กรุณาใส่ CSS Selector');
      return;
    }
    if (timer) clearInterval(timer);
    count = 0; countEl.textContent = '0';
    enableRun(true);
    setStatus('กำลังทำงานทุก ' + ms + ' ms');
    timer = setInterval(()=>{
      const c = clickOnce(q);
      if (c > 0) { count += c; countEl.textContent = String(count); }
    }, ms);
  };
  stopBtn.onclick = () => {
    if (timer) { clearInterval(timer); timer = null; }
    enableRun(false);
    setStatus('หยุดทำงาน');
  };
}
// Request config/files from background (IndexedDB in extension origin can't be read from arbitrary pages)
async function getConfig(){
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    // retry a few times in case the service worker is temporarily inactive
    const maxTries = 3;
    for (let attempt = 1; attempt <= maxTries; attempt++) {
      const resp = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'get-config' }, (r) => {
          resolve({ resp: r, err: chrome.runtime.lastError });
        });
      });
      if (resp.err) {
        console.warn('getConfig messaging attempt', attempt, 'failed', resp.err && resp.err.message);
        if (attempt < maxTries) await new Promise(r => setTimeout(r, 200 * attempt));
        continue;
      }
      const r = resp.resp;
      if (r && r.ok) return r.items || [];
      return [];
    }
    console.error('getConfig messaging failed after retries');
    return [];
  }
  // fallback: empty
  return [];
}

// get a file blob via background: background returns an ArrayBuffer and mime-type
async function getFile(key){
  if (!key) return null;
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    const maxTries = 3;
    for (let attempt = 1; attempt <= maxTries; attempt++) {
      const resp = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'get-file', key }, (r) => {
          resolve({ resp: r, err: chrome.runtime.lastError });
        });
      });
      if (resp.err) {
        console.warn('getFile messaging attempt', attempt, 'failed', resp.err && resp.err.message);
        if (attempt < maxTries) await new Promise(r => setTimeout(r, 200 * attempt));
        continue;
      }
      const r = resp.resp;
      if (!r || !r.ok) return null;
      try{
        const ab = r.buffer;
        const uint8 = new Uint8Array(ab);
        const blob = new Blob([uint8], { type: r.type || 'application/octet-stream' });
        return blob;
      }catch(e){ console.error('getFile decode failed', e); return null; }
    }
    console.error('getFile messaging failed after retries');
    return null;
  }
  return null;
}

function normalizeBuiltinPath(path){
  if(!path) return null;
  if (/^https?:\/\//.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path;
  const trimmed = path.replace(/^\.\//, '');
  try{ if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) return chrome.runtime.getURL(trimmed); }catch(e){}
  return trimmed;
}

// allow external messages to refresh config or toggle visibility (refresh-config support)
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((msg, sender, resp) => {
    if (!msg) return;
    if (msg.type === 'refresh-config' || (msg.type === 'broadcast' && msg.payload && msg.payload.type === 'refresh-config')){
      (async ()=>{
        try{
          if (menuOpen){
            closeMenu();
            await new Promise(r=>setTimeout(r,80));
            await openMenu();
          }
        }catch(e){ console.error('refresh-config failed', e); }
      })();
      // also ask background to (re)inject all matching scripts into this tab
      try {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({ type: 'exec-all' }, (resp) => {
            if (chrome.runtime.lastError) {
              console.warn('content: exec-all sendMessage failed', chrome.runtime.lastError);
            } else {
              console.log('content: exec-all response', resp);
            }
          });
        }
      } catch (e) {
        console.warn('content: exec-all messaging exception', e);
      }
    }
    if (msg.type === 'toggle-visibility'){
      mainIcon.style.display = msg.visible ? 'block' : 'none';
    }
  });
}

// สร้างไอคอนหลัก (main icon)
const mainIcon = document.createElement('div');
mainIcon.id = 'mainMenuIcon';
// Inject small stylesheet for rotation and hover-friendly defaults
(function(){
  try{
    const s = document.createElement('style');
    s.id = 'shark-tools-inline-style';
    s.textContent = `
      @keyframes sharktools-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      #mainMenuIcon { transition: transform 220ms ease; }
      /* while menu open, rotate continuously */
      #mainMenuIcon.rotating { animation: sharktools-spin 0.8s linear infinite; transform-origin: center center; }
    `;
    (document.head || document.documentElement).appendChild(s);
  }catch(e){ console.warn('could not inject style for shark tools', e); }
})();
const defaultMainImage = chrome.runtime.getURL('image/main.png');
Object.assign(mainIcon.style, {
  position: 'fixed',
  left: '100px',
  top: '100px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundImage: `url(${defaultMainImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  touchAction: 'none',
  zIndex: '2147483647'
});
document.body.appendChild(mainIcon);

// inject small stylesheet for rotating animation and sub-icon hover helper
;(function injectMenuStyles(){
  try{
    if (document.getElementById('shark-tools-styles')) return;
    const s = document.createElement('style');
    s.id = 'shark-tools-styles';
    s.textContent = `
      @keyframes shark-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      #mainMenuIcon.rotating { animation: shark-spin 0.6s linear; transform-origin: center center; }
      .sub-icon { transition: opacity 120ms ease, transform 120ms ease; }
      .sub-icon:active { transform: scale(0.96); }
    `;
    (document.head || document.documentElement).appendChild(s);
  }catch(e){ console.warn('injectMenuStyles failed', e); }
})();

// ฟังก์ชันทำให้ element สามารถลากได้ (draggable)
function makeDraggable(el) {
  el.style.touchAction = 'none';
  el.style.userSelect = 'none';
  let startX = null, startY = null, origX = null, origY = null;
  el.addEventListener('pointerdown', function (e) {
    startX = e.clientX; startY = e.clientY;
    origX = parseInt(el.style.left) || 0; origY = parseInt(el.style.top) || 0;
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
  });
  el.addEventListener('pointermove', function (e) {
    if (startX === null) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    el.style.left = (origX + dx) + 'px'; el.style.top = (origY + dy) + 'px';
  });
  el.addEventListener('pointerup', function (e) {
    try { el.releasePointerCapture(e.pointerId); } catch (_) {}
    startX = startY = origX = origY = null;
  });
}
makeDraggable(mainIcon);

let menuOpen = false;
const subIcons = [];

// เปิดเมนูย่อย (สร้างไอคอนย่อยวงกลม)
async function openMenu() {
  mainIcon.classList.add('rotating');
  const rect = mainIcon.getBoundingClientRect();
  const centerX = rect.left + rect.width/2;
  const centerY = rect.top + rect.height/2;
  const radius = 100;

  // built-in tools
  const builtins = [
    { id: 'builtin-miniburp', name: 'MiniBurp', iconBuiltin: 'image/a1.png', iconBuiltinHover: 'image/a2.png', action: runMiniBurp },
    { id: 'builtin-postman', name: 'PostMan', iconBuiltin: 'image/b1.png', iconBuiltinHover: 'image/a2.png', action: runMiniPostman },
    { id: 'builtin-sharkscan', name: 'SharkScan', iconBuiltin: 'image/sharkscan_40.png', iconBuiltinHover: 'image/b2.png', action: runSharkScan },
    { id: 'builtin-snipers', name: 'Snipers', iconBuiltin: 'image/c1.png', iconBuiltinHover: 'image/c2.png', action: runSnipers }
  ];

  // load user-configured items from DB
  let userItems = [];
  try { userItems = await getConfig(); } catch (e) { console.warn('getConfig failed', e); }

  // filter user items by scope: global or host
  const currentHost = (location && location.hostname) ? location.hostname : '';
  const filteredUser = (Array.isArray(userItems) ? userItems.slice() : []).filter(it => {
    if (!it || !it.scope) return true; // default to show
    if (it.scope === 'global') return true;
    if (it.scope === 'host') {
      // if scopeHost provided, match that, otherwise match current host
      if (it.scopeHost && it.scopeHost.trim()) {
        try {
          const want = it.scopeHost.trim().toLowerCase();
          return currentHost.toLowerCase().endsWith(want);
        } catch(e){ return false; }
      }
      return true; // if no scopeHost specified, assume host-scope means current host
    }
    return true;
  });

  // Merge: filtered user items first, then builtins (you can change ordering as desired)
  const items = filteredUser.concat(builtins);

  const count = items.length;
  const angleStep = (2 * Math.PI) / Math.max(1, count);

  for (let i = 0; i < count; i++) {
    const item = items[i];
    const angle = i * angleStep;
  const sub = document.createElement('img');
  sub.className = 'sub-icon';
    sub.draggable = false;
    Object.assign(sub.style, {
      position: 'fixed',
      left: (centerX + Math.cos(angle)*radius - 20) + 'px',
      top: (centerY + Math.sin(angle)*radius - 20) + 'px',
      width: '40px', height: '40px', cursor: 'pointer',
      userSelect: 'none', touchAction: 'none', zIndex: '2147483647',
      borderRadius: '8px', backgroundColor: '#444'
    });

    // prepare icon: user-provided blob or builtin path
      // prepare icon: follow fallback rules
      // normal priority: item.iconId -> item.iconBuiltin -> image/a1.png -> image/og.png
      // hover  priority: item.iconHoverId -> item.iconBuiltinHover -> image/a2.png -> image/og.png
      let normalURL = null, hoverURL = null;
      try {
        if (item.iconId) { const b = await getFile(item.iconId).catch(()=>null); if (b) normalURL = URL.createObjectURL(b); }
      } catch(e){}
      if (!normalURL && item.iconBuiltin) normalURL = normalizeBuiltinPath(item.iconBuiltin);
    // fallback to og.png when no normal icon provided
    if (!normalURL) normalURL = normalizeBuiltinPath('image/og.png');

      try {
        if (item.iconHoverId) { const b = await getFile(item.iconHoverId).catch(()=>null); if (b) hoverURL = URL.createObjectURL(b); }
      } catch(e){}
      if (!hoverURL && item.iconBuiltinHover) hoverURL = normalizeBuiltinPath(item.iconBuiltinHover);
    // fallback to og.png when no hover icon provided
    if (!hoverURL) hoverURL = normalizeBuiltinPath('image/og.png');

      if (normalURL) sub.src = normalURL; else sub.style.backgroundColor = '#666';

      // hover swap handlers: swap to hoverURL on pointerenter, revert on pointerleave
      const originalSrc = sub.src;
      sub.addEventListener('pointerenter', () => {
        try {
          if (hoverURL) sub.src = hoverURL;
        } catch(e) {}
      });
      sub.addEventListener('pointerleave', () => {
        try { sub.src = originalSrc; } catch(e) {}
      });

  // default fallback: prefer a1.png as normal and a2.png as hover; final fallback to og.png
  const defaultA1 = normalizeBuiltinPath('image/a1.png');
  const fallbackOg = normalizeBuiltinPath('image/og.png');
  if (normalURL) sub.src = normalURL;
  else if (defaultA1) sub.src = defaultA1;
  else if (fallbackOg) sub.src = fallbackOg;
  else sub.style.backgroundColor = '#666';

    makeDraggable(sub);
    let subMoved = false;
    sub.addEventListener('pointerdown', () => { subMoved = false; });
    sub.addEventListener('pointermove', () => { subMoved = true; });

    // hover swapping: prefer item.iconHoverId -> item.iconBuiltinHover -> a2.png -> og.png
    (function attachHover(){
      let hoverAssigned = null;
      async function resolveHoverURL(){
        if (item.iconHoverId) {
          try { const b = await getFile(item.iconHoverId); if (b) return URL.createObjectURL(b); } catch(_){}
        }
        if (item.iconBuiltinHover) return normalizeBuiltinPath(item.iconBuiltinHover);
        // try a2.png as pair to a1.png
        const a2 = normalizeBuiltinPath('image/a2.png');
        if (a2) return a2;
        return normalizeBuiltinPath('image/og.png');
      }
      sub.addEventListener('pointerenter', async () => {
        try {
          const hover = await resolveHoverURL();
          if (hover && hover !== sub.src) {
            // if hover is blob URL, remember to cleanup
            if (hover.startsWith('blob:')) hoverAssigned = hover;
            sub.dataset._prevSrc = sub.src || '';
            sub.src = hover;
          }
        } catch(e){ console.warn('hover resolve failed', e); }
      });
      sub.addEventListener('pointerleave', () => {
        try {
          const prev = sub.dataset._prevSrc || '';
          if (prev) sub.src = prev;
          if (hoverAssigned) { try { URL.revokeObjectURL(hoverAssigned); } catch(_){} hoverAssigned = null; }
        } catch(e){ }
      });
    })();

    sub.addEventListener('click', async () => {
      if (subMoved) { subMoved = false; return; }
      try {
        // run script: if user-provided script blob
        if (item.scriptId) {
          // Prefer asking background for text to avoid ArrayBuffer decoding issues
          let code = '';
          try {
            const resp = await new Promise((resolve) => {
              try {
                chrome.runtime.sendMessage({ type: 'get-file-text', key: item.scriptId }, (r) => {
                  resolve({ r, err: chrome.runtime.lastError });
                });
              } catch (e) { resolve({ r: null, err: e }); }
            });
            if (resp && resp.err) {
              console.warn('content get-file-text failed', resp.err && resp.err.message);
            } else if (resp && resp.r && resp.r.ok) {
              code = resp.r.text || '';
            }
          } catch(e){ console.warn('content get-file-text exception', e); }

          // fallback: getFile() and blob.text()
          if (!code) {
            try {
              const blob = await getFile(item.scriptId).catch(()=>null);
              if (blob) code = await blob.text().catch(()=>'');
            } catch(e){ console.warn('fallback read blob failed', e); }
          }

          if (code) {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
              console.log('content: sending exec-code to background', { length: code.length });
              chrome.runtime.sendMessage({ type: 'exec-code', code }, (resp) => {
                if (chrome.runtime.lastError) {
                  console.warn('content exec-code sendMessage failed', chrome.runtime.lastError);
                  try { alert('ส่งคำสั่งไม่สำเร็จ: ' + chrome.runtime.lastError.message); } catch(_){ }
                } else {
                  console.log('content exec-code response', resp);
                }
              });
            } else {
              const b = new Blob([code], { type: 'text/javascript' });
              const url = URL.createObjectURL(b);
              const s = document.createElement('script'); s.src = url; s.async = false;
              s.onload = ()=>{ URL.revokeObjectURL(url); s.remove(); };
              (document.head || document.documentElement).appendChild(s);
            }
          } else {
            console.warn('No code retrieved for item', item.id || item.name);
          }
        } else if (item.scriptBuiltin) {
          const url = normalizeBuiltinPath(item.scriptBuiltin);
          try {
            const res = await fetch(url).catch(()=>null);
            if (res && res.ok) {
              const code = await res.text();
              if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                chrome.runtime.sendMessage({ type: 'exec-code', code }, ()=>{});
              } else {
                const b = new Blob([code], { type: 'text/javascript' });
                const url2 = URL.createObjectURL(b);
                const s = document.createElement('script'); s.src = url2; s.async = false;
                s.onload = ()=>{ URL.revokeObjectURL(url2); s.remove(); };
                (document.head || document.documentElement).appendChild(s);
              }
            }
          } catch(e){ console.warn('failed to fetch builtin script', e); }
        } else if (item.action && typeof item.action === 'function') {
          // builtin tool action
          item.action();
        }
      } catch(err) { console.error('Error executing item', item, err); }
      closeMenu();
    });

    document.body.appendChild(sub);
    // store created object URLs on element for cleanup
    sub._createdBlobSrc = (normalURL && normalURL.startsWith('blob:')) ? normalURL : null;
    sub._hoverBlobSrc = (hoverURL && hoverURL.startsWith('blob:')) ? hoverURL : null;
    sub._builtinHover = hoverURL && !hoverURL.startsWith('blob:') ? hoverURL : null;
    sub._builtinNormal = normalURL && !normalURL.startsWith('blob:') ? normalURL : null;
    subIcons.push(sub);
  }
  menuOpen = true;
}

// ปิดเมนูย่อย (รีเซ็ต)
function closeMenu() {
  mainIcon.classList.remove('rotating');
  subIcons.forEach(s => {
    try {
      if (s._createdBlobSrc) { URL.revokeObjectURL(s._createdBlobSrc); }
      if (s._hoverBlobSrc) { URL.revokeObjectURL(s._hoverBlobSrc); }
    } catch(e){}
    s.remove();
  });
  subIcons.length = 0;
  menuOpen = false;
}

// คลิก main icon เพื่อเปิด/ปิดเมนูย่อย
mainIcon.addEventListener('click', () => {
  if (!menuOpen) openMenu();
  else closeMenu();
});
