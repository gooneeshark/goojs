// Type definitions for Chrome Extension API
declare const chrome: {
  runtime: {
    getURL(path: string): string;
    lastError?: { message?: string };
  };
  debugger: {
    attach(target: { tabId: number }, requiredVersion: string, callback?: () => void): void;
    detach(target: { tabId: number }, callback?: () => void): void;
    sendCommand(target: { tabId: number }, method: string, params?: any, callback?: (result?: any) => void): void;
  };
  action: {
    setIcon(details: { path: string | { [key: number]: string }, tabId?: number }): void;
    onClicked: {
      addListener(callback: (tab: chrome.tabs.Tab) => void): void;
    };
  };
  tabs: {
    Tab: {
      id?: number;
      url?: string;
    };
  };
  scripting: {
    executeScript(details: {
      target: { tabId?: number };
      files?: string[];
      func?: () => void;
      world?: 'ISOLATED' | 'MAIN';
      args?: any[];
    }, callback?: () => void): void;
    insertCSS(details: {
      target: { tabId?: number };
      files?: string[];
      css?: string;
      origin?: 'AUTHOR' | 'USER';
    }, callback?: () => void): void;
  };
};

// Extend Window interface to include __eruda
declare interface Window {
  __eruda?: {
    init: (config: any) => void;
    show: () => void;
    hide: () => void;
    translation: {
      set: (translations: Record<string, any>) => void;
    };
  };
}

// Global variable for TypeScript
declare const eruda: any;
