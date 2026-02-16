// @ts-check

// Type declarations
/** @typedef {Window & { __eruda?: any }} WindowWithEruda */

let isErudaActive = false;
// Optional: user-provided loader URL (bookmarklet-style bundle)
const USER_LOADER_URL = 'https://goonee.netlify.app/loader.js';

// This function will be injected into the page

// Load Eruda script with container
async function injectEruda(tabId) {
  return new Promise((resolve, reject) => {
    // Inject CSS from extension context to avoid CSP issues
    chrome.scripting.insertCSS({ target: { tabId }, files: ['eruda.css'] }, () => {
      if (chrome.runtime.lastError) {
        console.error('[ErudaExt] insertCSS failed:', chrome.runtime.lastError.message);
      } else {
        console.log('[ErudaExt] insertCSS ok');
      }


// Debugger (CDP) helpers to bypass CSP for evaluation in the page context
async function attachDebugger(tabId) {
  return new Promise((resolve) => {
    try {
      chrome.debugger.attach({ tabId }, '1.3', () => {
        if (chrome.runtime.lastError && !/Another debugger|already attached/i.test(chrome.runtime.lastError.message || '')) {
          console.error('[ErudaExt][CDP] attach failed:', chrome.runtime.lastError.message);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } catch (e) {
      console.error('[ErudaExt][CDP] attach exception:', e);
      resolve(false);
    }
  });
}

async function cdp(tabId, method, params) {
  return new Promise((resolve) => {
    try {
      chrome.debugger.sendCommand({ tabId }, method, params || {}, (result) => {
        if (chrome.runtime.lastError) {
          console.error(`[ErudaExt][CDP] ${method} failed:`, chrome.runtime.lastError.message);
          resolve(null);
        } else {
          resolve(result || null);
        }
      });
    } catch (e) {
      console.error('[ErudaExt][CDP] sendCommand exception:', method, e);
      resolve(null);
    }
  });
}

function buildErudaLoaderExpression(srcUrl) {
  // Produces a self-invoking function that loads eruda from given src URL or toggles if present
  return `(() => {
    const SRC = ${JSON.stringify(srcUrl)};
    function show(){ try{ eruda.init(); eruda.show(); }catch(e){ console.error(e); } }
    if (!window.eruda) {
      const s = document.createElement('script');
      s.src = SRC + '?t=' + Date.now();
      s.onload = show;
      document.documentElement.appendChild(s);
      return 'load';
    } else {
      const cont = document.querySelector('.eruda-container');
      if (cont) {
        const visible = getComputedStyle(cont).display !== 'none';
        (visible ? eruda.hide : eruda.show)();
        return visible ? 'hide' : 'show';
      } else {
        show();
        return 'show';
      }
    }
  })()`;
}

async function toggleErudaWithDebugger(tabId) {
  const attached = await attachDebugger(tabId);
  if (!attached) return false;
  await cdp(tabId, 'Runtime.enable');
  // Prefer local eruda.js from the extension to avoid external fetch
  const localSrc = chrome.runtime.getURL('eruda.js');
  const expression = buildErudaLoaderExpression(localSrc);
  const result = await cdp(tabId, 'Runtime.evaluate', {
    expression,
    includeCommandLineAPI: true,
    awaitPromise: true,
    returnByValue: true,
    allowUnsafeEvalBlockedByCSP: true
  });
  if (result && result.result && Object.prototype.hasOwnProperty.call(result.result, 'value')) {
    console.log('[ErudaExt][CDP] evaluate result:', result.result.value);
  }
  // Do not detach immediately to allow further evals quickly; it's fine to leave attached while tab open
  return true;
}

// Simple mode: inject Eruda and show with default UI (original behavior)
async function injectErudaSimple(tabId) {
  return new Promise((resolve) => {
    try {
      chrome.scripting.executeScript(
        { target: { tabId }, world: 'MAIN', files: ['eruda.js'] },
        () => {
          if (chrome.runtime.lastError) {
            console.error('[ErudaExt] simple: eruda.js inject failed:', chrome.runtime.lastError.message);
            try { resolve(false); } catch {}
            return;
          }
          chrome.scripting.executeScript(
            {
              target: { tabId },
              func: () => {
                try {
                  // @ts-ignore
                  if (typeof eruda === 'undefined') return false;
                  // @ts-ignore
                  if (!window.__eruda) {
                    // @ts-ignore
                    eruda.init();
                    // @ts-ignore
                    window.__eruda = eruda;
                  }
                  // @ts-ignore
                  if (window.__eruda?.show) window.__eruda.show();
                  return true;
                } catch (e) {
                  console.error('[ErudaExt] simple: init error', e);
                  return false;
                }
              }
            },
            (results) => {
              if (chrome.runtime.lastError) {
                console.error('[ErudaExt] simple: run failed:', chrome.runtime.lastError.message);
                try { resolve(false); } catch {}
              } else {
                console.log('[ErudaExt] simple: init executed');
                try { resolve(true); } catch {}
              }
            }
          );
        }
      );
    } catch (e) {
      console.error('[ErudaExt] simple: exception', e);
      try { resolve(false); } catch {}
    }
  });
}
      // Then load eruda library
      chrome.scripting.executeScript({
        target: { tabId },
        files: ['eruda.js']
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('[ErudaExt] executeScript eruda.js failed:', chrome.runtime.lastError.message);
        } else {
          console.log('[ErudaExt] eruda.js injected');
        }
        // Finally run page-side setup
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => {
          // Make element draggable
          function makeDraggable(element, handle) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            
            function dragMouseDown(e) {
              e = e || window.event;
              e.preventDefault();
              // Get the mouse cursor position at startup
              pos3 = e.clientX;
              pos4 = e.clientY;
              document.onmouseup = closeDragElement;
              // Call a function whenever the cursor moves
              document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
              e = e || window.event;
              e.preventDefault();
              // Calculate the new cursor position
              pos1 = pos3 - e.clientX;
              pos2 = pos4 - e.clientY;
              pos3 = e.clientX;
              pos4 = e.clientY;
              // Set the element's new position
              element.style.top = (element.offsetTop - pos2) + "px";
              element.style.left = (element.offsetLeft - pos1) + "px";
              element.style.transform = 'none'; // Remove centering transform when dragging
            }

            function closeDragElement() {
              // Stop moving when mouse button is released
              document.onmouseup = null;
              document.onmousemove = null;
            }

            if (handle) {
              handle.onmousedown = dragMouseDown;
              handle.style.cursor = 'move';
            } else {
              element.onmousedown = dragMouseDown;
            }
          }

          // Check if container already exists
          let container = document.getElementById('eruda-float-container');
          
          if (!container) {
            // Create main container
            container = document.createElement('div');
            container.id = 'eruda-float-container';
            
            // Create header
            const header = document.createElement('div');
            header.className = 'eruda-header';
            header.textContent = 'Eruda DevTools';
            
            // Create close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'eruda-close-btn';
            closeBtn.title = 'Close';
            closeBtn.onclick = () => {
              if (container) {
                container.style.display = 'none';
                const win = /** @type {WindowWithEruda} */ (window);
                if (win.__eruda && typeof win.__eruda.hide === 'function') {
                  win.__eruda.hide();
                }
                // Remove active class so SCSS hides DevTools
                document.documentElement.classList.remove('eruda-active');
              }
            };
            
            // Create content area
            const content = document.createElement('div');
            content.className = 'eruda-content';
            
            // Assemble the container
            header.appendChild(closeBtn);
            container.appendChild(header);
            container.appendChild(content);
            document.body.appendChild(container);
            
            // Make container draggable via header
            makeDraggable(container, header);
            
            // Initialize Eruda in the content area
            if (!window.__eruda) {
              eruda.init({
                container: content,
                tool: ['elements', 'network', 'console', 'settings'],
                defaults: {
                  displaySize: 50,
                  theme: 'Dark',
                  transparency: 0.9
                }
              });
              
              // Set Thai language for Eruda (guarded)
              try {
                if (typeof eruda !== 'undefined' && eruda.translation && typeof eruda.translation.set === 'function') {
                  eruda.translation.set({
                    console: {
                      filter: 'กรอง',
                      clear: 'ล้าง',
                      all: 'ทั้งหมด',
                      log: 'ล็อก',
                      info: 'ข้อมูล',
                      warn: 'คำเตือน',
                      error: 'ข้อผิดพลาด',
                    },
                    elements: {
                      style: 'สไตล์',
                      computed: 'คอมพิวเต็ด',
                      layout: 'เลย์เอาต์',
                      dom: 'DOM',
                      attributes: 'แอตทริบิวต์',
                      eventListeners: 'อีเวนต์',
                      properties: 'คุณสมบัติ',
                      boxModel: 'Box Model'
                    },
                    network: {
                      clear: 'ล้าง',
                      filter: 'กรอง',
                      request: 'รีเควสต์',
                      response: 'รีสปอนส์',
                      headers: 'เฮดเดอร์',
                      preview: 'พรีวิว',
                      timing: 'เวลา',
                      initiator: 'ผู้เริ่มต้น',
                      size: 'ขนาด',
                      time: 'เวลา',
                      type: 'ประเภท',
                      status: 'สถานะ',
                      method: 'เมธอด',
                      url: 'URL'
                    },
                    info: {
                      url: 'URL',
                      userAgent: 'User Agent',
                      platform: 'แพลตฟอร์ม',
                      cookieEnabled: 'คุกกี้',
                      online: 'ออนไลน์',
                      screen: 'หน้าจอ',
                      viewport: 'วิวพอร์ต',
                      pixelRatio: 'อัตราส่วนพิกเซล',
                      touch: 'ทัชสกรีน',
                      devicePixelRatio: 'อัตราส่วนพิกเซลอุปกรณ์',
                      colorDepth: 'ความลึกสี',
                      localStorage: 'ที่เก็บข้อมูล',
                      sessionStorage: 'เซสชัน',
                      indexedDB: 'IndexedDB',
                      webSQL: 'WebSQL',
                      location: 'ตำแหน่ง',
                      protocol: 'โปรโตคอล',
                      host: 'โฮสต์',
                      pathname: 'พาธ',
                      search: 'ค้นหา',
                      hash: 'แฮช',
                      time: 'เวลา',
                      performance: 'ประสิทธิภาพ',
                      memory: 'หน่วยความจำ',
                      timing: 'เวลา',
                      navigation: 'การนำทาง',
                      connection: 'การเชื่อมต่อ',
                      serviceWorker: 'Service Worker',
                      notification: 'การแจ้งเตือน',
                      permission: 'สิทธิ์การเข้าถึง'
                    }
                  });
                }
              } catch (e) {
                console.warn('Eruda translation set failed:', e);
              }
              
              window.__eruda = eruda;

              // Ensure DevTools DOM is mounted inside our content container
              const ensureMount = () => {
                const root = document.querySelector('.dev-tools');
                if (root && content && root.parentElement !== content) {
                  content.appendChild(root);
                }
                if (root) {
                  // Fallback force visible inside panel
                  const s = /** @type {HTMLElement} */(root).style;
                  s.position = 'absolute';
                  s.left = '0';
                  s.top = '0';
                  s.right = '0';
                  s.bottom = '0';
                  s.width = '100%';
                  s.height = '100%';
                  s.display = 'flex';
                  s.opacity = '1';
                  s.pointerEvents = 'auto';
                }
              };
              // Try immediately and again on next tick to catch late render
              try { ensureMount(); } catch {}
              setTimeout(() => { try { ensureMount(); } catch {} }, 0);
            }
            
            // CSS already injected by service worker, just activate and show
            document.documentElement.classList.add('eruda-active');
            try {
              if (typeof eruda !== 'undefined' && eruda.show) {
                eruda.show();
              } else if (window.__eruda && window.__eruda.show) {
                window.__eruda.show();
              }
            } catch (e) {
              console.warn('Eruda show() after load failed:', e);
            }
          } else {
            // Toggle visibility
            if (container) {
              container.style.display = container.style.display === 'none' ? 'flex' : 'none';
              const win = /** @type {WindowWithEruda} */ (window);
              if (win.__eruda && typeof win.__eruda.hide === 'function' && typeof win.__eruda.show === 'function') {
                if (container.style.display === 'none') {
                  win.__eruda.hide();
                  document.documentElement.classList.remove('eruda-active');
                } else {
                  win.__eruda.show();
                  document.documentElement.classList.add('eruda-active');
                }
              }
            }
            // No need to resolve here as it's not in a Promise
          }
          }
        }, () => {
          if (chrome.runtime.lastError) {
            console.error('[ErudaExt] executeScript setup failed:', chrome.runtime.lastError.message);
            try { resolve(false); } catch {}
          } else {
            console.log('[ErudaExt] setup executed');
            try { resolve(true); } catch {}
          }
        });
      });
    });
  });
}

// Simple mode: inject Eruda and show with default UI (original behavior)
async function injectErudaSimple(tabId) {
  return new Promise((resolve) => {
    try {
      // 1) Inject eruda core
      chrome.scripting.executeScript(
        { target: { tabId }, files: ['eruda.js'] },
        () => {
          if (chrome.runtime.lastError) {
            console.error('[ErudaExt] simple: eruda.js inject failed:', chrome.runtime.lastError.message);
            try { resolve(false); } catch {}
            return;
          }
          // 2) Attempt to inject local plugins (CSP-safe). Add your plugin files under eruda-extension/plugins/
          const pluginFiles = [
            'plugins/eruda-orientation.js',
            'plugins/eruda-fps.js',
            'plugins/eruda-code.js'
          ];
          chrome.scripting.executeScript(
            { target: { tabId }, world: 'MAIN', files: pluginFiles },
            () => {
              if (chrome.runtime.lastError) {
                console.warn('[ErudaExt] simple: plugin files injection issue:', chrome.runtime.lastError.message);
              }

              // 3) Init eruda and register any available plugins
              chrome.scripting.executeScript(
                {
                  target: { tabId },
                  world: 'MAIN',
                  func: () => {
                    try {
                      // @ts-ignore
                      if (typeof eruda === 'undefined') return false;
                      // @ts-ignore
                      if (!window.__eruda) {
                        // @ts-ignore
                        eruda.init();
                        // @ts-ignore
                        window.__eruda = eruda;
                      }
                      // Register detected plugins (globals from injected files)
                      // @ts-ignore
                      if (typeof window.erudaOrientation !== 'undefined') eruda.add(window.erudaOrientation);
                      // @ts-ignore
                      if (typeof window.erudaFps !== 'undefined') eruda.add(window.erudaFps);
                      // @ts-ignore
                      if (typeof window.erudaCode !== 'undefined') eruda.add(window.erudaCode);

                      // @ts-ignore
                      if (window.__eruda?.show) window.__eruda.show();
                      return true;
                    } catch (e) {
                      console.error('[ErudaExt] simple: init/register error', e);
                      return false;
                    }
                  }
                },
                () => {
                  if (chrome.runtime.lastError) {
                    console.error('[ErudaExt] simple: run failed:', chrome.runtime.lastError.message);
                    try { resolve(false); } catch {}
                  } else {
                    console.log('[ErudaExt] simple: init executed');
                    try { resolve(true); } catch {}
                  }
                }
              );
            }
          );
        }
      );
    } catch (e) {
      console.error('[ErudaExt] simple: exception', e);
      try { resolve(false); } catch {}
    }
  });
}

// Ensure CDP helpers exist in top-level scope for click handler
async function attachDebuggerTop(tabId) {
  return new Promise((resolve) => {
    try {
      chrome.debugger.attach({ tabId }, '1.3', () => {
        if (chrome.runtime.lastError && !/Another debugger|already attached/i.test(chrome.runtime.lastError.message || '')) {
          console.error('[ErudaExt][CDP] attach failed:', chrome.runtime.lastError.message);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } catch (e) {
      console.error('[ErudaExt][CDP] attach exception:', e);
      resolve(false);
    }
  });
}

async function cdpTop(tabId, method, params) {
  return new Promise((resolve) => {
    try {
      chrome.debugger.sendCommand({ tabId }, method, params || {}, (result) => {
        if (chrome.runtime.lastError) {
          console.error(`[ErudaExt][CDP] ${method} failed:`, chrome.runtime.lastError.message);
          resolve(null);
        } else {
          resolve(result || null);
        }
      });
    } catch (e) {
      console.error('[ErudaExt][CDP] sendCommand exception:', method, e);
      resolve(null);
    }
  });
}

function buildErudaLoaderExpressionTop(srcUrl) {
  return `(() => {
    const SRC = ${JSON.stringify(srcUrl)};
    function show(){ try{ eruda.init(); eruda.show(); }catch(e){ console.error(e); } }
    if (!window.eruda) {
      const s = document.createElement('script');
      s.src = SRC + '?t=' + Date.now();
      s.onload = show;
      document.documentElement.appendChild(s);
      return 'load';
    } else {
      const cont = document.querySelector('.eruda-container');
      if (cont) {
        const visible = getComputedStyle(cont).display !== 'none';
        (visible ? eruda.hide : eruda.show)();
        return visible ? 'hide' : 'show';
      } else {
        show();
        return 'show';
      }
    }
  })()`;
}

async function toggleErudaWithDebugger(tabId) {
  const attached = await attachDebuggerTop(tabId);
  if (!attached) return false;
  await cdpTop(tabId, 'Runtime.enable');
  const localSrc = chrome.runtime.getURL('eruda.js');
  const expression = buildErudaLoaderExpressionTop(localSrc);
  const result = await cdpTop(tabId, 'Runtime.evaluate', {
    expression,
    includeCommandLineAPI: true,
    awaitPromise: true,
    returnByValue: true,
    allowUnsafeEvalBlockedByCSP: true
  });
  if (result && result.result && Object.prototype.hasOwnProperty.call(result.result, 'value')) {
    console.log('[ErudaExt][CDP] evaluate result:', result.result.value);
  }
  return true;
}

// ===== User Loader Helpers (top-level) =====
function buildExternalLoaderExpression(url) {
  return `(() => {
    const SRC = ${JSON.stringify(url)};
    const s = document.createElement('script');
    s.src = SRC + (SRC.includes('?') ? '&' : '?') + 't=' + Date.now();
    document.documentElement.appendChild(s);
    return 'ext-load';
  })()`;
}

async function runUserLoaderWithDebugger(tabId) {
  const attached = await attachDebuggerTop(tabId);
  if (!attached) return false;
  await cdpTop(tabId, 'Runtime.enable');
  const expression = buildExternalLoaderExpression(USER_LOADER_URL);
  const result = await cdpTop(tabId, 'Runtime.evaluate', {
    expression,
    includeCommandLineAPI: true,
    awaitPromise: true,
    returnByValue: true,
    allowUnsafeEvalBlockedByCSP: true
  });
  if (result && result.result && Object.prototype.hasOwnProperty.call(result.result, 'value')) {
    console.log('[ErudaExt][CDP] user loader result:', result.result.value);
  }
  // Wait briefly for eruda to appear; if not present, report failure to trigger fallback
  const ok = await waitForErudaViaCDP(tabId, 6000);
  if (ok) {
    // Ensure it is visible
    await cdpTop(tabId, 'Runtime.evaluate', {
      expression: `try{ eruda && eruda.init && eruda.init(); eruda && eruda.show && eruda.show(); true }catch(e){ false }`,
      includeCommandLineAPI: false,
      awaitPromise: true,
      returnByValue: true
    });
  }
  return !!ok;
}

async function injectUserLoaderSimple(tabId) {
  return new Promise((resolve) => {
    try {
      chrome.scripting.executeScript(
        {
          target: { tabId },
          world: 'MAIN',
          func: (url) => {
            try {
              const s = document.createElement('script');
              s.src = url + (url.includes('?') ? '&' : '?') + 't=' + Date.now();
              document.documentElement.appendChild(s);
              return true;
            } catch (e) {
              console.warn('User loader inject failed:', e);
              return false;
            }
          },
          args: [USER_LOADER_URL]
        },
        async () => {
          if (chrome.runtime.lastError) {
            console.error('[ErudaExt] simple user loader failed:', chrome.runtime.lastError.message);
            try { resolve(false); } catch {}
          } else {
            // Poll using scripting (no debugger on mobile) to see if eruda appears
            try {
              const ok = await waitForErudaByScripting(tabId, 6000);
              if (ok) {
                try {
                  // Ensure show
                  chrome.scripting.executeScript({
                    target: { tabId },
                    world: 'MAIN',
                    func: () => { try { /* @ts-ignore */ eruda && eruda.init && eruda.init(); /* @ts-ignore */ eruda && eruda.show && eruda.show(); } catch(_){} }
                  });
                } catch(_){}
              }
              try { resolve(!!ok); } catch {}
            } catch (_) {
              try { resolve(false); } catch {}
            }
          }
        }
      );
    } catch (e) {
      console.error('[ErudaExt] simple user loader exception:', e);
      try { resolve(false); } catch {}
    }
  });
}

// ===== Polling helpers to detect Eruda presence =====
function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function waitForErudaViaCDP(tabId, timeoutMs = 2000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await cdpTop(tabId, 'Runtime.evaluate', {
      expression: 'typeof window.eruda !== "undefined"',
      includeCommandLineAPI: false,
      returnByValue: true
    });
    if (res && res.result && res.result.value === true) return true;
    await delay(200);
  }
  return false;
}

async function waitForErudaByScripting(tabId, timeoutMs = 2000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const ok = await new Promise((resolve) => {
      try {
        chrome.scripting.executeScript(
          {
            target: { tabId },
            world: 'MAIN',
            func: () => { /* @ts-ignore */ return typeof window.eruda !== 'undefined'; }
          },
          (results) => {
            if (chrome.runtime.lastError) {
              resolve(false);
            } else {
              try {
                const val = Array.isArray(results) && results[0] && results[0].result;
                resolve(!!val);
              } catch { resolve(false); }
            }
          }
        );
      } catch (_) { resolve(false); }
    });
    if (ok) return true;
    await delay(200);
  }
  return false;
}

// @ts-ignore - Chrome extension API
chrome.action.onClicked.addListener(/** @param {chrome.tabs.Tab} tab */ async (tab) => {
  try {
    if (!tab || !tab.id) {
      console.warn('[ErudaExt] No active tab context');
      return;
    }
    if (!tab.url || !/^https?:/i.test(tab.url)) {
      console.warn('[ErudaExt] Skip non-http(s) page:', tab.url);
      return;
    }

    // First try to run user loader (bookmarklet bundle) via Debugger to maximize mobile utility
    let ok = await runUserLoaderWithDebugger(tab.id);
    if (!ok) {
      // Mobile fallback: inject script tag to run external loader (may be limited by page CSP)
      ok = await injectUserLoaderSimple(tab.id);
    }
    // If still not ok, fallback to built-in Eruda toggle
    if (!ok) {
      await toggleErudaWithDebugger(tab.id).catch(() => {});
      await injectErudaSimple(tab.id).catch(() => {});
    }

    // Toggle state
    isErudaActive = !isErudaActive;

    // Update icon using a single string path (lets Chromium scale as needed)
    chrome.action.setIcon({ path: 'icons/icon16.png', tabId: tab.id });
  } catch (e) {
    console.error('[ErudaExt] onClicked error:', e);
  }
});