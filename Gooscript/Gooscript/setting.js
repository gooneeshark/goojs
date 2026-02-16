(function(){
  const DB_NAME = 'bundle_extension_db';
  const DB_VERSION = 1;

  function openDB(){
    return new Promise((resolve,reject)=>{
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e)=>{
        const db = e.target.result;
        if(!db.objectStoreNames.contains('files')) db.createObjectStore('files');
        if(!db.objectStoreNames.contains('config')) db.createObjectStore('config');
      };
      req.onsuccess = ()=>resolve(req.result);
      req.onerror = ()=>reject(req.error);
    });
  }

  async function putFile(key, blob){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('files','readwrite');
      tx.objectStore('files').put(blob, key);
      tx.oncomplete = ()=>resolve();
      tx.onerror = ()=>reject(tx.error);
    });
  }

  async function getFile(key){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('files','readonly');
      const r = tx.objectStore('files').get(key);
      r.onsuccess = ()=>resolve(r.result);
      r.onerror = ()=>reject(r.error);
    });
  }
  async function deleteFile(key){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('files','readwrite');
      tx.objectStore('files').delete(key);
      tx.oncomplete = ()=>resolve();
      tx.onerror = ()=>reject(tx.error);
    });
  }

  async function getConfig(){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('config','readonly');
      const r = tx.objectStore('config').get('items');
      r.onsuccess = ()=>resolve(r.result || []);
      r.onerror = ()=>reject(r.error);
    });
  }

  async function saveConfig(items){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('config','readwrite');
      tx.objectStore('config').put(items,'items');
      tx.oncomplete = ()=>resolve();
      tx.onerror = ()=>reject(tx.error);
    });
  }

  // UI
  const nameEl = document.getElementById('name');
  const iconFileEl = document.getElementById('iconFile');
  const iconHoverFileEl = document.getElementById('iconHoverFile');
  const scriptFileEl = document.getElementById('scriptFile');
  const scriptTextEl = document.getElementById('scriptText');
  const scriptBuiltinPathEl = document.getElementById('scriptBuiltinPath');
  const iconBuiltinPathEl = document.getElementById('iconBuiltinPath');
  const iconHoverBuiltinPathEl = document.getElementById('iconHoverBuiltinPath');
  const scopeSelect = document.getElementById('scopeSelect');
  const scopeHostEl = document.getElementById('scopeHost');
  const addBtn = document.getElementById('addBtn');
  const itemsEl = document.getElementById('items');
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const importFile = document.getElementById('importFile');
  const iconPreview = document.getElementById('iconPreview');
  const iconHoverPreview = document.getElementById('iconHoverPreview');

  // track object URLs we create so we can revoke them when refreshing/clearing
  let currentIconPreviewUrl = null;
  let currentIconHoverPreviewUrl = null;
  const createdPreviewUrls = [];

  // default fallback image (og.png) for preview placeholders
  const defaultOg = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) ? chrome.runtime.getURL('image/og.png') : 'image/og.png';
  // Always set preview placeholders to og.png so UI shows a consistent default
  try { if (iconPreview) iconPreview.src = defaultOg; } catch(e) {}
  try { if (iconHoverPreview) iconHoverPreview.src = defaultOg; } catch(e) {}

  // file input preview handlers
  if (iconFileEl) {
    iconFileEl.addEventListener('change', () => {
      try {
        const f = iconFileEl.files && iconFileEl.files[0];
        if (currentIconPreviewUrl) { try { URL.revokeObjectURL(currentIconPreviewUrl); } catch(_){} currentIconPreviewUrl = null; }
        if (f) {
          currentIconPreviewUrl = URL.createObjectURL(f);
          if (iconPreview) iconPreview.src = currentIconPreviewUrl;
        } else {
          if (iconPreview) iconPreview.src = '';
        }
      } catch (e) { console.warn('iconFile preview failed', e); }
    });
  }
  if (iconHoverFileEl) {
    iconHoverFileEl.addEventListener('change', () => {
      try {
        const f = iconHoverFileEl.files && iconHoverFileEl.files[0];
        if (currentIconHoverPreviewUrl) { try { URL.revokeObjectURL(currentIconHoverPreviewUrl); } catch(_){} currentIconHoverPreviewUrl = null; }
        if (f) {
          currentIconHoverPreviewUrl = URL.createObjectURL(f);
          if (iconHoverPreview) iconHoverPreview.src = currentIconHoverPreviewUrl;
        } else {
          if (iconHoverPreview) iconHoverPreview.src = '';
        }
      } catch (e) { console.warn('iconHover preview failed', e); }
    });
  }

  async function refreshList(){
    try {
      const items = await getConfig();
      // revoke any created preview object URLs from previous render
      try { createdPreviewUrls.forEach(u=>{ try{ URL.revokeObjectURL(u); }catch(_){} }); } catch(e){}
      createdPreviewUrls.length = 0;
      itemsEl.innerHTML = '';
      for(const it of items){
      const div = document.createElement('div'); div.className='item';
      const img = document.createElement('img'); img.className='preview';
      let imgNormalSrc = '';
      let imgHoverSrc = '';
      if(it.iconId){
        const blob = await getFile(it.iconId).catch(()=>null);
        if(blob) { imgNormalSrc = URL.createObjectURL(blob); createdPreviewUrls.push(imgNormalSrc); }
      } else if(it.iconBuiltin) imgNormalSrc = it.iconBuiltin;
      // hover image for listing: prefer iconHoverId -> iconBuiltinHover -> image/a2.png -> image/og.png
      if(it.iconHoverId){ const b = await getFile(it.iconHoverId).catch(()=>null); if(b){ imgHoverSrc = URL.createObjectURL(b); createdPreviewUrls.push(imgHoverSrc); } }
      if(!imgHoverSrc && it.iconBuiltinHover) imgHoverSrc = it.iconBuiltinHover;
      if(!imgHoverSrc) imgHoverSrc = 'image/a2.png';
      if(!imgNormalSrc) imgNormalSrc = imgHoverSrc || 'image/og.png';
      img.src = imgNormalSrc;
  // ensure og.png fallback uses runtime URL when available
  const ogUrl = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) ? chrome.runtime.getURL('image/og.png') : 'image/og.png';
  if (!imgNormalSrc) imgNormalSrc = ogUrl;
  if (!imgHoverSrc) imgHoverSrc = ogUrl;
  // add hover swap on listing preview (swap to og.png if hover not provided)
  img.addEventListener('pointerenter', ()=>{ try{ img.src = imgHoverSrc || imgNormalSrc; }catch(_){} });
  img.addEventListener('pointerleave', ()=>{ try{ img.src = imgNormalSrc; }catch(_){} });
      const span = document.createElement('span'); span.textContent = it.name || it.id;
      const scopeSpan = document.createElement('small'); scopeSpan.style.color='#999'; scopeSpan.style.marginLeft='8px';
      if (it.scope === 'host') scopeSpan.textContent = '(host:' + (it.scopeHost || '') + ')';

      // per-item auto-run checkbox
      const autoLabel = document.createElement('label'); autoLabel.style.marginLeft='8px'; autoLabel.style.color='#9e9e9e';
      const autoChk = document.createElement('input'); autoChk.type='checkbox'; autoChk.checked = !!it.autoRun;
      autoChk.style.marginLeft='8px';
      autoChk.onchange = async ()=>{
        try {
          const items2 = await getConfig();
          const idx = items2.findIndex(x=>x.id===it.id);
          if (idx>=0) { items2[idx].autoRun = !!autoChk.checked; await saveConfig(items2); chrome.runtime.sendMessage({ type: 'broadcast', payload: { type: 'refresh-config' } }, ()=>{}); }
        } catch(e){ console.error('toggle autoRun failed', e); }
      };
      autoLabel.appendChild(autoChk);
      autoLabel.appendChild(document.createTextNode(' auto-run'));

      // run button
      const runBtn = document.createElement('button'); runBtn.textContent='ทดสอบ';
      runBtn.onclick = async ()=>{
        try{
          if(it.scriptId){
            const blob = await getFile(it.scriptId);
            const code = await blob.text();
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
              chrome.runtime.sendMessage({ type: 'exec-code', code }, (resp) => {
                if (chrome.runtime.lastError) {
                  console.warn('exec-code sendMessage failed', chrome.runtime.lastError);
                  alert('เรียกใช้งานสคริปต์ไม่สำเร็จ (ดูคอนโซล)');
                } else {
                  alert('สั่งรันแล้ว (ดูคอนโซลด้วย)');
                }
              });
            } else {
              const b = new Blob([code], { type:'text/javascript' });
              const url = URL.createObjectURL(b);
              const script = document.createElement('script');
              script.src = url; script.async = false;
              script.onload = ()=>{ URL.revokeObjectURL(url); script.remove(); };
              (document.head || document.documentElement).appendChild(script);
              alert('สั่งรันแล้ว (ดูคอนโซลด้วย)');
            }
          } else if(it.scriptBuiltin){
            // ensure scriptBuiltin is string
            const built = (typeof it.scriptBuiltin === 'string') ? it.scriptBuiltin : String(it.scriptBuiltin || '');
            const res = await fetch(built).catch(()=>null);
            if(res && res.ok){
              const code = await res.text();
              if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                chrome.runtime.sendMessage({ type: 'exec-code', code }, (resp) => {
                  if (chrome.runtime.lastError) {
                    console.warn('exec-code sendMessage failed', chrome.runtime.lastError);
                    alert('เรียกใช้งานสคริปต์ไม่สำเร็จ (ดูคอนโซล)');
                  } else {
                    alert('สั่งรันแล้ว (ดูคอนโซลด้วย)');
                  }
                });
              } else {
                const b = new Blob([code], { type:'text/javascript' });
                const url = URL.createObjectURL(b);
                const script = document.createElement('script'); script.src = url; script.async = false;
                script.onload = ()=>{ URL.revokeObjectURL(url); script.remove(); };
                (document.head || document.documentElement).appendChild(script);
                alert('สั่งรันแล้ว (ดูคอนโซลด้วย)');
              }
            } else alert('ไม่มีสคริปต์');
          } else alert('ไม่มีสคริปต์สำหรับปุ่มนี้');
        }catch(e){ console.error(e); alert('เกิดข้อผิดพลาด ดูคอนโซล'); }
      };

      // delete button
      const delBtn = document.createElement('button'); delBtn.textContent='ลบ';
      delBtn.onclick = async ()=>{
        if(!confirm('ลบปุ่มนี้จริงหรือ?')) return;
        const items2 = (await getConfig()).filter(x=>x.id!==it.id);
        if(it.iconId) await deleteFile(it.iconId).catch(()=>null);
        if(it.iconHoverId) await deleteFile(it.iconHoverId).catch(()=>null);
        if(it.scriptId) await deleteFile(it.scriptId).catch(()=>null);
        await saveConfig(items2);
        await refreshList();
      };

      div.appendChild(img); div.appendChild(span); div.appendChild(scopeSpan); div.appendChild(autoLabel); div.appendChild(runBtn); div.appendChild(delBtn);
      itemsEl.appendChild(div);
      }
    } catch(e){
      console.error('refreshList error', e);
      try{ itemsEl.innerHTML = '<div style="color:red">โหลด config ไม่สำเร็จ ดู console</div>'; }catch(_){}
    }
  }

  function uid(prefix='id'){ return prefix + '-' + Math.random().toString(36).slice(2,9); }

  addBtn.addEventListener('click', async ()=>{
    const name = nameEl.value.trim() || ('item-' + Date.now());
    const item = { id: uid('item'), name };
    // builtin paths (ensure strings)
    const scriptBuiltinPath = scriptBuiltinPathEl && scriptBuiltinPathEl.value && String(scriptBuiltinPathEl.value.trim());
    const iconBuiltinPath = iconBuiltinPathEl && iconBuiltinPathEl.value && String(iconBuiltinPathEl.value.trim());
    const iconHoverBuiltinPath = iconHoverBuiltinPathEl && iconHoverBuiltinPathEl.value && String(iconHoverBuiltinPathEl.value.trim());
    if(scriptBuiltinPath) item.scriptBuiltin = scriptBuiltinPath;
    if(iconBuiltinPath) item.iconBuiltin = iconBuiltinPath;
    if(iconHoverBuiltinPath) item.iconBuiltinHover = iconHoverBuiltinPath;
    // script
    if(scriptFileEl.files && scriptFileEl.files[0]){
      const f = scriptFileEl.files[0];
      const key = uid('script');
      await putFile(key, f);
      item.scriptId = key;
    } else if(scriptTextEl.value.trim()){
      const blob = new Blob([scriptTextEl.value], { type:'text/javascript' });
      const key = uid('script');
      await putFile(key, blob);
      item.scriptId = key;
    }
    // icons
    if(iconFileEl.files && iconFileEl.files[0]){
      const f = iconFileEl.files[0];
      const key = uid('icon');
      await putFile(key, f);
      item.iconId = key;
    }
    if(iconHoverFileEl.files && iconHoverFileEl.files[0]){
      const f = iconHoverFileEl.files[0];
      const key = uid('icon');
      await putFile(key, f);
      item.iconHoverId = key;
    }

  // scope
  const scope = (scopeSelect && scopeSelect.value) ? scopeSelect.value : 'global';
  if (scope === 'host') item.scope = 'host'; else item.scope = 'global';
  if (scopeHostEl && scopeHostEl.value && scopeHostEl.value.trim()) item.scopeHost = scopeHostEl.value.trim();

  // save and broadcast
  await addButton(item);

  // clear inputs (reset file inputs using .value only)
  nameEl.value=''; scriptTextEl.value=''; scriptFileEl.value='';
  // revoke and clear preview object URLs
  try { if (currentIconPreviewUrl) { URL.revokeObjectURL(currentIconPreviewUrl); currentIconPreviewUrl = null; } } catch(_){}
  try { if (currentIconHoverPreviewUrl) { URL.revokeObjectURL(currentIconHoverPreviewUrl); currentIconHoverPreviewUrl = null; } } catch(_){}
  iconFileEl.value=''; iconHoverFileEl.value='';
    if(scriptBuiltinPathEl) scriptBuiltinPathEl.value='';
    if(iconBuiltinPathEl) iconBuiltinPathEl.value='';
    if(iconHoverBuiltinPathEl) iconHoverBuiltinPathEl.value='';
    // reset preview images to default og
    try { if (iconPreview) iconPreview.src = defaultOg; } catch(_){}
    try { if (iconHoverPreview) iconHoverPreview.src = defaultOg; } catch(_){}
    await refreshList();
    alert('เพิ่มปุ่มแล้ว');
  });

  // addButton: save item into config and broadcast refresh to all tabs via background
  async function addButton(item) {
    try {
      const items = await getConfig();
      if (!item.id) item.id = uid('item');
      const idx = items.findIndex(i => i.id === item.id);
      if (idx >= 0) items[idx] = item; else items.push(item);
      await saveConfig(items);
      // broadcast via background so all tabs receive refresh-config
      try {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
          // retry broadcast a few times in case service worker is not active yet
          const maxTries = 4;
          for (let t = 1; t <= maxTries; t++) {
            chrome.runtime.sendMessage({ type: 'broadcast', payload: { type: 'refresh-config' } }, (resp) => {
              if (chrome.runtime.lastError) {
                console.warn('broadcast attempt', t, 'failed', chrome.runtime.lastError);
              }
            });
            // small delay between tries
            await new Promise(r => setTimeout(r, 150 * t));
          }
        }
      } catch (e) { console.warn('broadcast exception', e); }
      return { ok: true };
    } catch (e) {
      console.error('addButton failed', e);
      return { ok: false, error: e && e.message };
    }
  }

  exportBtn.addEventListener('click', async ()=>{
    const items = await getConfig();
    const exportItems = [];
    for(const it of items){
      const out = Object.assign({}, it);
      // include scope info
      if (it.scope) out.scope = it.scope;
      if (it.scopeHost) out.scopeHost = it.scopeHost;
      // ensure builtin fields are strings in export
      if(out.scriptBuiltin && typeof out.scriptBuiltin !== 'string') out.scriptBuiltin = String(out.scriptBuiltin);
      if(out.iconBuiltin && typeof out.iconBuiltin !== 'string') out.iconBuiltin = String(out.iconBuiltin);
      if(it.iconId){
        const b = await getFile(it.iconId).catch(()=>null);
        if(b) {
          out.iconData = await blobToDataURL(b);
        }
      }
      if(it.iconHoverId){ const b = await getFile(it.iconHoverId).catch(()=>null); if(b) out.iconHoverData = await blobToDataURL(b); }
      if(it.scriptId){ const b = await getFile(it.scriptId).catch(()=>null); if(b) out.scriptData = await b.text(); }
      exportItems.push(out);
    }
    const json = JSON.stringify(exportItems, null, 2);
    const blob = new Blob([json], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'bundle-export.json'; a.click(); URL.revokeObjectURL(url);
  });

  importBtn.addEventListener('click', ()=> importFile.click());
  importFile.addEventListener('change', async ()=>{
    const f = importFile.files[0]; if(!f) return;
    const text = await f.text();
    try{
      const list = JSON.parse(text);
      const items = await getConfig();
      for(const it of list){
  const newIt = { id: uid('item'), name: it.name || ('import-' + Date.now()) };
        // make sure builtin are strings
        if(it.scriptBuiltin) newIt.scriptBuiltin = String(it.scriptBuiltin);
        if(it.iconBuiltin) newIt.iconBuiltin = String(it.iconBuiltin);
        if(it.iconHoverBuiltin) newIt.iconBuiltinHover = String(it.iconHoverBuiltin);
  if(it.scriptData){ const key = uid('script'); await putFile(key, new Blob([it.scriptData], { type:'text/javascript' })); newIt.scriptId = key; }
  if(it.scope) newIt.scope = it.scope;
  if(it.scopeHost) newIt.scopeHost = it.scopeHost;
        if(it.iconData){ const key = uid('icon'); await putFile(key, dataURLtoBlob(it.iconData)); newIt.iconId = key; }
        if(it.iconHoverData){ const key = uid('icon'); await putFile(key, dataURLtoBlob(it.iconHoverData)); newIt.iconHoverId = key; }
        items.push(newIt);
      }
      await saveConfig(items);
      await refreshList();
      alert('นำเข้าเรียบร้อย');
    }catch(e){ console.error(e); alert('ไฟล์ไม่ถูกต้อง'); }
  });

  function blobToDataURL(blob){ return new Promise((res)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(blob); }); }
  function dataURLtoBlob(dataurl){ const parts = dataurl.split(','); const m = parts[0].match(/:(.*?);/); const mime = m?m[1]:'application/octet-stream'; const bstr = atob(parts[1]); let n=bstr.length; const u8=new Uint8Array(n); while(n--) u8[n]=bstr.charCodeAt(n); return new Blob([u8],{type:mime}); }

  // initial
  (async ()=>{ await refreshList(); })();

})();
