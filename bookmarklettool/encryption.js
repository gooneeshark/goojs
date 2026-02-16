// Encryption & Encoding Tools (Classical Ciphers + Base64)
(function () {
    const panel = document.createElement('div');
    panel.style.cssText = `
      position:fixed; top:80px; left:20px;
      z-index:99999; background:rgba(0,0,0,0.95); color:#fff;
      padding:18px 22px; border-radius:12px; border:2px solid #ffeb3b;
      box-shadow:0 0 16px #ffeb3b99; font-family:sans-serif; min-width:320px; max-width:96vw; touch-action:none;
    `;
    panel.innerHTML = `
      <div style="font-size:18px; margin-bottom:10px; color:#ffeb3b;">🔐 เครื่องมือเข้ารหัส (Encryption)</div>
      <textarea id="cryptoInput" placeholder="ใส่ข้อความที่ต้องการ..." style="width:97%;height:60px;resize:vertical;border-radius:5px;padding:7px;font-size:14px;margin-bottom:7px;"></textarea><br>
      
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; margin-bottom:7px;">
        <button id="b64Enc" style="padding:7px; background:#222; color:#ffeb3b; border:1px solid #ffeb3b; border-radius:4px; cursor:pointer;">Base64 Encode</button>
        <button id="b64Dec" style="padding:7px; background:#222; color:#ffeb3b; border:1px solid #ffeb3b; border-radius:4px; cursor:pointer;">Base64 Decode</button>
        <button id="caesarEnc" style="padding:7px; background:#222; color:#ffeb3b; border:1px solid #ffeb3b; border-radius:4px; cursor:pointer;">Caesar +3</button>
        <button id="caesarDec" style="padding:7px; background:#222; color:#ffeb3b; border:1px solid #ffeb3b; border-radius:4px; cursor:pointer;">Caesar -3</button>
      </div>

      <textarea id="cryptoOutput" placeholder="ผลลัพธ์..." style="width:97%;height:60px;resize:vertical;border-radius:5px;padding:7px;font-size:14px;margin-bottom:7px;"></textarea><br>
      
      <button id="copyCrypto" style="width:100%; margin-bottom:6px; padding:7px; background:#43a047; color:#fff; border:none; border-radius:6px; cursor:pointer;">📋 คัดลอกผลลัพธ์</button>
      <button id="closeCrypto" style="width:100%; padding:6px; background:#b71c1c; color:#fff; border:none; border-radius:6px; cursor:pointer;">ปิด</button>
    `;
    document.body.appendChild(panel);

    // Draggable
    (function enableDrag() {
        let dragging = false, sx = 0, sy = 0, sl = 0, st = 0;
        panel.onpointerdown = e => {
            if (e.target.closest('button, textarea, input')) return;
            const r = panel.getBoundingClientRect(); sl = r.left; st = r.top; sx = e.clientX; sy = e.clientY; dragging = true;
            panel.setPointerCapture(e.pointerId);
        };
        panel.onpointermove = e => {
            if (!dragging) return;
            panel.style.left = (sl + e.clientX - sx) + 'px';
            panel.style.top = (st + e.clientY - sy) + 'px';
        };
        panel.onpointerup = e => { dragging = false; panel.releasePointerCapture(e.pointerId); };
    })();

    const input = document.getElementById('cryptoInput');
    const output = document.getElementById('cryptoOutput');

    // Base64
    document.getElementById('b64Enc').onclick = () => {
        try { output.value = btoa(input.value); } catch (e) { alert('Encoding failed: ' + e); }
    };
    document.getElementById('b64Dec').onclick = () => {
        try { output.value = atob(input.value); } catch (e) { alert('Decoding failed: ' + e); }
    };

    // Caesar
    function caesar(str, shift) {
        return str.replace(/[a-zA-Z]/g, function (c) {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base);
        });
    }
    document.getElementById('caesarEnc').onclick = () => output.value = caesar(input.value, 3);
    document.getElementById('caesarDec').onclick = () => output.value = caesar(input.value, -3);

    // Tools
    document.getElementById('copyCrypto').onclick = () => {
        output.select();
        document.execCommand('copy');
        alert('คัดลอกลงคลิปบอร์ดแล้ว!');
    };
    document.getElementById('closeCrypto').onclick = () => panel.remove();
})();
