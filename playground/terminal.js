/**
 * terminal.js - Floating Terminal Logic
 * Draggable, Minimizable, and Tool Integration
 */

class FloatingTerminal {
    constructor() {
        this.terminal = document.getElementById('floating-terminal');
        this.header = this.terminal.querySelector('.terminal-header');
        this.isMinimized = false;
        this.pos1 = 0;
        this.pos2 = 0;
        this.pos3 = 0;
        this.pos4 = 0;

        this.init();
    }

    init() {
        this.setupDragging();
        this.setupControls();
        this.setupTranslator();
        this.setupQuickScan();
        this.loadState();
    }

    setupDragging() {
        this.header.onmousedown = (e) => this.dragMouseDown(e);
        this.terminal.onclick = () => {
            if (this.isMinimized) this.toggleMinimize();
        };
    }

    dragMouseDown(e) {
        if (this.isMinimized) return;
        e = e || window.event;
        e.preventDefault();
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        document.onmouseup = () => this.closeDragElement();
        document.onmousemove = (e) => this.elementDrag(e);
    }

    elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;

        const top = this.terminal.offsetTop - this.pos2;
        const left = this.terminal.offsetLeft - this.pos1;

        // Bounds checking
        if (top > 0 && top < window.innerHeight - 50) this.terminal.style.top = top + "px";
        if (left > 0 && left < window.innerWidth - 300) this.terminal.style.left = left + "px";

        this.terminal.style.bottom = 'auto';
        this.terminal.style.right = 'auto';
    }

    closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        this.saveState();
    }

    setupControls() {
        const minBtn = document.getElementById('term-min');
        const closeBtn = document.getElementById('term-close');

        minBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleMinimize();
        };

        closeBtn.onclick = (e) => {
            e.stopPropagation();
            this.terminal.style.display = 'none';
        };
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.terminal.classList.toggle('minimized', this.isMinimized);
        this.saveState();
    }

    setupTranslator() {
        const input = document.getElementById('trans-input');
        const output = document.getElementById('trans-output');
        const btn = document.getElementById('trans-btn');

        btn.onclick = () => {
            const text = input.value.trim();
            if (!text) return;

            output.textContent = "Translating...";

            // Mock translation logic (In a real app, this would call an API)
            // For now, we'll just simulate a "Hacker Speak" or simple Thai-English swap
            setTimeout(() => {
                const mockTranslations = {
                    'hello': 'สวัสดี (Sawatdee)',
                    'help': 'ช่วยด้วย (Chuay duay)',
                    'hacker': 'แฮกเกอร์ (Hacker)',
                    'script': 'สคริปต์ (Script)',
                    'tool': 'เครื่องมือ (Krueang mue)'
                };

                const lowerText = text.toLowerCase();
                output.textContent = mockTranslations[lowerText] || "แปลว่า: [Simulated Translation for " + text + "]";
            }, 800);
        };
    }

    setupQuickScan() {
        const scanBtn = document.getElementById('scan-btn');
        const bar = document.getElementById('scan-bar');
        const status = document.getElementById('scan-status');

        let scanning = false;

        scanBtn.onclick = () => {
            if (scanning) return;
            scanning = true;
            let progress = 0;
            status.textContent = "Scanning site for vulnerabilities...";

            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    status.textContent = "Scan Complete: 0 critical vulnerabilities found.";
                    scanning = false;
                }
                bar.style.width = progress + "%";
            }, 300);
        };
    }

    saveState() {
        const state = {
            top: this.terminal.style.top,
            left: this.terminal.style.left,
            isMinimized: this.isMinimized
        };
        localStorage.setItem('floatingTerminalState', JSON.stringify(state));
    }

    loadState() {
        const saved = localStorage.getItem('floatingTerminalState');
        if (saved) {
            const state = JSON.parse(saved);
            this.terminal.style.top = state.top;
            this.terminal.style.left = state.left;
            this.terminal.style.bottom = 'auto';
            this.terminal.style.right = 'auto';

            if (state.isMinimized) {
                this.isMinimized = true;
                this.terminal.classList.add('minimized');
            }
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new FloatingTerminal();
});
