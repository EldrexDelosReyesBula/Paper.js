/**
 * PAPER SECURITY KERNEL
 * Enterprise-grade XSS Sanitization and Injection Prevention.
 * Web App Tracking Transparency (WATT) script and storage filter.
 */
(function() {
    let tempStorage = {};
    const trackingKeys = ['_ga', '_gid', '_fbp', '_uid_tracking_id', 'tracking', 'analytics', 'pixel', 'adsense'];
    
    let originalSetItem = null;
    let originalGetItem = null;
    let originalRemoveItem = null;

    if (typeof window !== 'undefined' && window.localStorage) {
        if (typeof localStorage.setItem === 'function') originalSetItem = localStorage.setItem.bind(localStorage);
        if (typeof localStorage.getItem === 'function') originalGetItem = localStorage.getItem.bind(localStorage);
        if (typeof localStorage.removeItem === 'function') originalRemoveItem = localStorage.removeItem.bind(localStorage);
    }

    papyr.security = {
        _isActive: true, // Enabled by default for safety
        currentTier: 'default',
        hasConsent: false,
        _scriptsBlocked: false,

        setTier(tier) {
            this.currentTier = tier;
            if (tier === 'high') {
                this.blockThirdPartyScripts();
            }
        },

        setConsent(granted) {
            this.hasConsent = !!granted;
            if (granted) {
                // Flush tempStorage back to real localStorage
                try {
                    if (originalSetItem) {
                        Object.entries(tempStorage).forEach(([k, v]) => {
                            originalSetItem(k, v);
                        });
                    }
                    tempStorage = {};
                } catch(e) {}
            } else {
                // Clear tracking keys from real localStorage
                try {
                    if (originalRemoveItem && originalGetItem) {
                        trackingKeys.forEach(tk => {
                            for (let i = localStorage.length - 1; i >= 0; i--) {
                                let key = localStorage.key(i);
                                if (key && key.toLowerCase().includes(tk)) {
                                    originalRemoveItem(key);
                                }
                            }
                        });
                    }
                } catch(e) {}
            }
        },

        shouldBlockScript(src) {
            if (this.currentTier === 'none') return false;
            if (!src || typeof src !== 'string') return false;
            
            const trackingDomains = ['analytics', 'pixel', 'doubleclick', 'google-analytics', 'adsense', 'ad-tracker', 'facebook.net', 'adnxs'];
            const isTracker = trackingDomains.some(d => src.toLowerCase().includes(d));
            
            if (this.currentTier === 'high' && isTracker) return true;
            if (this.currentTier === 'default' && !this.hasConsent && isTracker) return true;
            return false;
        },

        blockThirdPartyScripts() {
            if (typeof document === 'undefined') return;
            if (this._scriptsBlocked) return;
            this._scriptsBlocked = true;
            
            const originalCreateElement = document.createElement;
            document.createElement = function(tag, options) {
                const el = originalCreateElement.call(document, tag, options);
                if (tag && tag.toLowerCase() === 'script') {
                    const originalSetAttribute = el.setAttribute;
                    el.setAttribute = function(k, v) {
                        if (k && k.toLowerCase() === 'src' && papyr.security.shouldBlockScript(v)) {
                            console.warn(`Papyr Security Kernel: Blocked tracking script from ${v}`);
                            return;
                        }
                        originalSetAttribute.apply(this, arguments);
                    };
                    Object.defineProperty(el, 'src', {
                        set(v) {
                            if (papyr.security.shouldBlockScript(v)) {
                                console.warn(`Papyr Security Kernel: Blocked tracking script from ${v}`);
                                return;
                            }
                            originalSetAttribute.call(el, 'src', v);
                        },
                        get() { return el.getAttribute('src'); },
                        configurable: true
                    });
                }
                return el;
            };
        },

        shouldSandboxStorage(key) {
            if (this.currentTier === 'none') return false;
            if (this.currentTier === 'high') return true;
            if (!this.hasConsent) {
                return trackingKeys.some(tk => key.toLowerCase().includes(tk));
            }
            return false;
        },

        /**
         * Strip dangerous tags and attributes from raw HTML strings.
         */
        sanitize(html) {
            if (!this._isActive || typeof html !== 'string') return html;
            
            // 1. Remove <script> tags and their contents
            let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            
            // 2. Remove inline event handlers (onclick, onmouseover, etc)
            clean = clean.replace(/ on\w+="[^"]*"/gi, '');
            clean = clean.replace(/ on\w+='[^']*'/gi, '');
            clean = clean.replace(/ on\w+=\w+/gi, '');
            
            // 3. Remove javascript: pseudo-protocols
            clean = clean.replace(/href="javascript:[^"]*"/gi, 'href="#"');
            clean = clean.replace(/src="javascript:[^"]*"/gi, 'src=""');

            if (html !== clean) {
                if (papyr.warn) papyr.warn("Papyr Security Interceptor blocked a potential XSS payload.");
            }
            return clean;
        },

        /**
         * Allow enterprise users to register custom security hooks
         */
        use(provider) {
            if (provider === 'disable') {
                this._isActive = false;
                if (papyr.warn) papyr.warn("Papyr Security Kernel DISABLED. You are vulnerable to XSS.");
            }
        },

        /**
         * Lightweight Client-Side Storage Encryption (Obfuscation)
         * Prevents generic localStorage scraping by malicious extensions.
         */
        encrypt(text, password) {
            if (!text) return text;
            let result = '';
            for (let i = 0; i < text.length; i++) {
                result += String.fromCharCode(text.charCodeAt(i) ^ password.charCodeAt(i % password.length));
            }
            return typeof window !== 'undefined' ? window.btoa(result) : result;
        },

        decrypt(encodedText, password) {
            if (!encodedText) return encodedText;
            try {
                let text = typeof window !== 'undefined' ? window.atob(encodedText) : encodedText;
                let result = '';
                for (let i = 0; i < text.length; i++) {
                    result += String.fromCharCode(text.charCodeAt(i) ^ password.charCodeAt(i % password.length));
                }
                return result;
            } catch(e) {
                if (papyr.warn) papyr.warn("Papyr Security: Decryption failed (invalid key or corrupted data).");
                return null;
            }
        }
    };

    // Install LocalStorage Interception
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem = function(key, val) {
            if (papyr.security && papyr.security.shouldSandboxStorage(key)) {
                tempStorage[key] = val;
                return;
            }
            if (originalSetItem) originalSetItem(key, val);
        };
        
        localStorage.getItem = function(key) {
            if (papyr.security && papyr.security.shouldSandboxStorage(key)) {
                return tempStorage[key] !== undefined ? tempStorage[key] : null;
            }
            return originalGetItem ? originalGetItem(key) : null;
        };
        
        localStorage.removeItem = function(key) {
            if (papyr.security && papyr.security.shouldSandboxStorage(key)) {
                delete tempStorage[key];
                return;
            }
            if (originalRemoveItem) originalRemoveItem(key);
        };
    }
})();
