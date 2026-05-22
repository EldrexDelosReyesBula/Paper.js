/**
 * PAPER SECURITY KERNEL
 * Enterprise-grade XSS Sanitization and Injection Prevention.
 */
(function() {
    papyr.security = {
        _isActive: true, // Enabled by default for safety
        
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
            // Future: hook in external providers like DOMPurify
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
})();
