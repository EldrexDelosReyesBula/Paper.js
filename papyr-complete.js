/**
 * PAPER STATIC SITE LIBRARY - Complete Showcase Bundle
 * Released under MIT License.
 */

(function(window) {
    let activeEffect = null;
    let isDebug = false;

// --- MODULE: core/papyr-core.js ---
/**
 * PAPYR CORE DOM ENGINE
 * 
 * Compiles standard JS parameter lists, selectors, and states to native, styled HTML elements.
 * Transitioned to a Modular Intelligent Web Runtime Kernel architecture.
 */

const tagList = ['html','head','body','title','div','span','p','h1','h2','h3','h4','h5','h6','button','a','img',
                  'input','textarea','select','option','optgroup','ul','ol','li','dl','dt','dd',
                  'table','thead','tbody','tfoot','tr','td','th','caption','colgroup','col',
                  'form','label','fieldset','legend','datalist','output',
                  'section','article','header','footer','nav','aside','main',
                  'pre','code','hr','br','strong','em','small','mark','sub','sup','i','b','u','s',
                  'tt','cite','address','blockquote',
                  'audio','video','source','track','picture','embed','iframe','canvas','svg',
                  'details','summary','dialog','menu','menuitem','template','slot'];

/**
 * Parses standard JS class arrays and objects into a space-separated string.
 * @private
 */
function parseClass(val) {
    if (Array.isArray(val)) return val.filter(Boolean).join(' ');
    if (typeof val === 'object' && val !== null) {
        return Object.keys(val).filter(k => val[k]).join(' ');
    }
    return String(val);
}

/**
 * Compute Levenshtein distance between two tags for developer spellcheck hints.
 * @private
 */
function levenshtein(a, b) {
    let tmp = [];
    for (let i = 0; i <= a.length; i++) {
        let row = [i];
        for (let j = 1; j <= b.length; j++) {
            row.push(i === 0 ? j : Math.min(
                tmp[i - 1][j] + 1,
                row[j - 1] + 1,
                tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            ));
        }
        tmp.push(row);
    }
    return tmp[a.length][b.length];
}

const coreInitializers = [];

// 1. EventBus Subsystem
class EventBus {
    constructor(kernel) {
        this.kernel = kernel;
        this.listeners = {};
    }
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => {
                try { cb(data); } catch(e) { this.kernel.diagnostics.reportError(e); }
            });
        }
    }
}

// 2. StateManager Subsystem
class StateManager {
    constructor(kernel) {
        this.kernel = kernel;
        this.states = new Set();
    }
    register(stateObj) {
        this.states.add(stateObj);
    }
    list() {
        return Array.from(this.states);
    }
    dump() {
        const result = {};
        let idx = 0;
        this.states.forEach(s => {
            result[`state_${idx++}`] = s.value;
        });
        return result;
    }
}

// 3. ComponentRegistry Subsystem
class ComponentRegistry {
    constructor(kernel) {
        this.kernel = kernel;
        this.registered = new Set();
    }
    register(el) {
        this.registered.add(el);
    }
    list() {
        return Array.from(this.registered).filter(el => {
            if (typeof document !== 'undefined') {
                if (typeof document.contains === 'function') {
                    return document.contains(el);
                }
                if (document.body && typeof document.body.contains === 'function') {
                    return document.body.contains(el);
                }
            }
            return true;
        }).map(el => {
            return {
                tag: el.tagName ? el.tagName.toLowerCase() : 'unknown',
                id: el.id || '',
                classes: el.className || ''
            };
        });
    }
}

// 4. PluginSystem Subsystem
class PluginSystem {
    constructor(kernel) {
        this.kernel = kernel;
        this.installed = new Map();
    }
    register(plugin) {
        if (!plugin || typeof plugin !== 'object') return;
        this.installed.set(plugin.name, plugin);
        if (typeof plugin.install === 'function') {
            plugin.install(this.kernel);
        }
        if (plugin.hooks && typeof plugin.hooks.onInit === 'function') {
            plugin.hooks.onInit();
        }
    }
    resolve(name) {
        return this.installed.get(name);
    }
    list() {
        return Array.from(this.installed.keys()).map(name => {
            const p = this.installed.get(name);
            return { name: p.name, version: p.version || '1.0.0' };
        });
    }
    triggerHook(hookName, ...args) {
        this.installed.forEach(plugin => {
            if (plugin.hooks && typeof plugin.hooks[hookName] === 'function') {
                try {
                    plugin.hooks[hookName](...args);
                } catch(e) {
                    this.kernel.diagnostics.reportError(e);
                }
            }
        });
    }
}

// 5. RuntimeContext Subsystem
class RuntimeContext {
    constructor(kernel) {
        this.kernel = kernel;
        this.routes = [];
        this.intent = null;
    }
}

// 6. DiagnosticsEngine Subsystem
class DiagnosticsEngine {
    constructor(kernel) {
        this.kernel = kernel;
        this.errors = [];
        this.listeners = {};
        this.updateCounts = new Map();
    }
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
    reportError(err) {
        const errorObj = {
            type: 'error',
            message: err.message || String(err),
            timestamp: new Date().toISOString(),
            stack: err.stack || ''
        };
        this.errors.push(errorObj);
        this.kernel.events.emit('error', errorObj);
    }
    trackUpdate(stateObj, newVal, oldVal) {
        let count = (this.updateCounts.get(stateObj) || 0) + 1;
        this.updateCounts.set(stateObj, count);
        if (count > 100) {
            this.emit('performance', {
                type: 'High Re-renders',
                message: `State variable updated ${count} times, potential infinite re-render loop detected!`,
                state: stateObj,
                count: count
            });
        }
    }
}

/**
 * Creates a Papyr Runtime Kernel Instance
 * @returns {PapyrKernel} callable element creator function with subsystems attached
 */
function createPapyr() {
    // 1. Functional DOM creator
    function papyrInstance(tag, ...args) {
        // Spelling/tag validation checks
        if (isDebug && !tagList.includes(tag)) {
            let min = Infinity, match = '';
            tagList.forEach(t => {
                let d = levenshtein(tag, t);
                if (d < min) { min = d; match = t; }
            });
            const warnMsg = `Unknown tag "${tag}".${min < 3 ? ` Did you mean "${match}"?` : ''}`;
            console.warn(`PapyrWarning: ${warnMsg}`);
            
            papyrInstance.diagnostics.errors.push({
                type: 'warning',
                message: warnMsg,
                timestamp: new Date().toISOString()
            });

            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('papyr-warning', { 
                    detail: { tag, suggestion: min < 3 ? match : '' } 
                }));
            }
        }

        let el;
        if (tag && tag.toLowerCase() === 'script') {
            el = document.createElement(tag);
            const originalSetAttribute = el.setAttribute;
            el.setAttribute = function(k, v) {
                if (k && k.toLowerCase() === 'src' && papyrInstance.security && typeof papyrInstance.security.shouldBlockScript === 'function' && papyrInstance.security.shouldBlockScript(v)) {
                    console.warn(`Papyr Security Kernel: Blocked tracking script from ${v}`);
                    return;
                }
                originalSetAttribute.apply(this, arguments);
            };
            Object.defineProperty(el, 'src', {
                set(v) {
                    if (papyrInstance.security && typeof papyrInstance.security.shouldBlockScript === 'function' && papyrInstance.security.shouldBlockScript(v)) {
                        console.warn(`Papyr Security Kernel: Blocked tracking script from ${v}`);
                        return;
                    }
                    originalSetAttribute.call(el, 'src', v);
                },
                get() { return el.getAttribute('src'); },
                configurable: true
            });
        } else {
            el = document.createElement(tag);
        }

        // Register in ComponentRegistry
        papyrInstance.components.register(el);

        let appendChild = (child) => {
            if (child === null || child === undefined) return;
            
            if (typeof child === 'object' && typeof child.subscribe === 'function') {
                let node = document.createTextNode('');
                el.appendChild(node);
                child.subscribe(v => {
                    if (v instanceof Element || v instanceof DocumentFragment) {
                        let parent = node.parentNode;
                        if (parent) {
                            let next = node.nextSibling;
                            if (next && next !== node && !(next instanceof Text && next.textContent === '')) {
                                parent.replaceChild(v, next);
                            } else {
                                parent.insertBefore(v, next);
                            }
                        }
                    } else {
                        node.textContent = String(v);
                    }
                });
            }
            else if (child instanceof Element || child instanceof DocumentFragment) {
                el.appendChild(child);
            }
            else if (Array.isArray(child)) {
                child.forEach(appendChild);
            }
            else if (typeof child === 'function') {
                let node = document.createTextNode('');
                el.appendChild(node);
                papyrInstance.computed(() => {
                    let v = child();
                    if (v instanceof Element || v instanceof DocumentFragment) {
                        let parent = node.parentNode;
                        if (parent) {
                            let next = node.nextSibling;
                            if (next && next !== node && !(next instanceof Text && next.textContent === '')) {
                                parent.replaceChild(v, next);
                            } else {
                                parent.insertBefore(v, next);
                            }
                        }
                    } else {
                        node.textContent = String(v);
                    }
                });
            }
            else {
                let str = String(child);
                let hasColon = str.includes(':') && !str.startsWith('http://') && !str.startsWith('https://');
                
                if (str.startsWith('.') || str.startsWith('#')) {
                    let selector = str;
                    let text = '';
                    if (hasColon) {
                        let colonIdx = str.indexOf(':');
                        selector = str.substring(0, colonIdx);
                        text = str.substring(colonIdx + 1);
                    }
                    
                    let parts = selector.match(/[.#][^.#]+/g);
                    if (parts) {
                        parts.forEach(part => {
                            if (part.startsWith('#')) {
                                el.id = part.slice(1);
                            } else if (part.startsWith('.')) {
                                el.classList.add(part.slice(1));
                            }
                        });
                    }
                    
                    if (hasColon) {
                        el.appendChild(document.createTextNode(text));
                    }
                }
                else if (hasColon) {
                    let colonIdx = str.indexOf(':');
                    let t = str.substring(0, colonIdx);
                    let [_, ...rest] = str.split(':');
                    let c = rest.join(':');
                    if (tagList.includes(t.toLowerCase())) {
                        let childEl = document.createElement(t);
                        childEl.textContent = c;
                        el.appendChild(childEl);
                    } else {
                        el.appendChild(document.createTextNode(str));
                    }
                }
                else {
                    el.appendChild(document.createTextNode(str));
                }
            }
        };

        args.forEach(arg => {
            if (arg !== null && typeof arg === 'object' && !(arg instanceof Element) && !(arg instanceof DocumentFragment) && !Array.isArray(arg) && typeof arg.subscribe !== 'function') {
                if (arg.style) Object.assign(el.style, arg.style);
                if (arg.data) Object.assign(el.dataset, arg.data);
                if (arg.attrs) Object.assign(el, arg.attrs);
                
                Object.entries(arg).forEach(([k, v]) => {
                    if (['style', 'data', 'attrs'].includes(k)) return;
                    
                    if (k === 'on' && typeof v === 'object' && v !== null) {
                        Object.entries(v).forEach(([evt, handler]) => {
                            el.addEventListener(evt, handler);
                        });
                    }
                    else if (k.startsWith('on')) {
                        let evName = k.slice(2).toLowerCase();
                        el.addEventListener(evName, v);
                    }
                    else if (k === 'class' || k === 'className') {
                        el.className = parseClass(v);
                    }
                    else if (k in el) {
                        el[k] = v;
                    }
                    else {
                        el.setAttribute(k, v);
                    }
                });
            } else {
                appendChild(arg);
            }
        });

        // Trigger onRender hook
        papyrInstance.plugins.triggerHook('onRender', el);

        return el;
    }

    // 2. Instantiate systems
    papyrInstance.state = new StateManager(papyrInstance);
    let compRegistry = new ComponentRegistry(papyrInstance);
    Object.defineProperty(papyrInstance, 'components', {
        get() {
            return compRegistry;
        },
        set(value) {
            if (value && typeof value === 'object') {
                Object.assign(compRegistry, value);
            } else {
                console.warn("Papyr: Attempted to set papyr.components to a non-object value, ignored.");
            }
        },
        configurable: true
    });
    papyrInstance.events = new EventBus(papyrInstance);
    papyrInstance.plugins = new PluginSystem(papyrInstance);
    papyrInstance.runtime = new RuntimeContext(papyrInstance);
    papyrInstance.diagnostics = new DiagnosticsEngine(papyrInstance);

    // Event aliases
    papyrInstance.on = (evt, cb) => papyrInstance.events.on(evt, cb);
    papyrInstance.off = (evt, cb) => papyrInstance.events.off(evt, cb);
    papyrInstance.emit = (evt, data) => papyrInstance.events.emit(evt, data);

    // Context Export API
    papyrInstance.exportContext = () => {
        return {
            components: papyrInstance.components.list(),
            state: papyrInstance.state.dump(),
            routes: papyrInstance.runtime.routes || [],
            errors: papyrInstance.diagnostics.errors,
            plugins: papyrInstance.plugins.list()
        };
    };

    // Plugin registry supporting legacy function plugins and formal object layouts
    papyrInstance.use = (plugin) => {
        if (typeof plugin === 'function') {
            plugin(papyrInstance);
        } else if (plugin && typeof plugin === 'object') {
            papyrInstance.plugins.register(plugin);
        }
        return papyrInstance;
    };

    // Tag shortcuts
    tagList.forEach(tag => {
        papyrInstance[tag] = (...args) => papyrInstance(tag, ...args);
    });

    // Flex/grid dynamic layout shortcuts
    papyrInstance.flex = {
        row: (...args) => papyrInstance('div', '.flex-row', ...args),
        col: (...args) => papyrInstance('div', '.flex-col', ...args),
        center: (...args) => papyrInstance('div', '.flex-center', ...args),
        between: (...args) => papyrInstance('div', '.flex-between', ...args),
        around: (...args) => papyrInstance('div', '.flex-around', ...args),
        wrap: (...args) => papyrInstance('div', '.flex-wrap', ...args)
    };
    papyrInstance.grid = (...args) => papyrInstance('div', '.grid', ...args);
    papyrInstance.container = (...args) => papyrInstance('div', '.container', ...args);
    papyrInstance.row = (...args) => papyrInstance('div', '.row', ...args);
    papyrInstance.col = (...args) => papyrInstance('div', '.col', ...args);

    // OOP Class-based component support
    class PapyrComponent {
        constructor() {
            if (this.render === undefined) {
                throw new Error("PapyrComponent must implement a render() method");
            }
        }
    }
    papyrInstance.component = PapyrComponent;

    // Security validation schemas
    papyrInstance.validate = (schema) => {
        return (data) => {
            let errors = {};
            for (let key in schema) {
                let rule = schema[key];
                let value = data[key];
                if (rule.required && (value === undefined || value === null || value === '')) {
                    errors[key] = "Required field";
                }
                if (rule.type && typeof value !== rule.type) {
                    errors[key] = `Must be of type ${rule.type}`;
                }
            }
            return Object.keys(errors).length ? errors : null;
        };
    };

    // Standard utilities
    papyrInstance.inspect = (component) => {
        let container = document.createElement('div');
        container.appendChild(component.cloneNode(true));
        return container.innerHTML;
    };

    papyrInstance.mount = (selector, component) => {
        let target = document.querySelector(selector);
        if (target) {
            target.innerHTML = '';
            target.appendChild(component);
        }
        return target;
    };

    papyrInstance.debug = (enable) => {
        isDebug = enable;
        if (enable) console.log("📄 Papyr Debug Mode Enabled.");
    };

    papyrInstance.delay = (ms) => new Promise(res => setTimeout(res, ms));
    papyrInstance.copy = (text) => navigator.clipboard.writeText(text);

    papyrInstance.fragment = (...children) => {
        let frag = document.createDocumentFragment();
        children.forEach(child => {
            if (Array.isArray(child)) {
                child.forEach(c => {
                    if (c instanceof Element) frag.appendChild(c);
                    else frag.appendChild(document.createTextNode(String(c)));
                });
            } else if (child instanceof Element || child instanceof DocumentFragment) {
                frag.appendChild(child);
            } else if (child !== null && child !== undefined) {
                frag.appendChild(document.createTextNode(String(child)));
            }
        });
        return frag;
    };

    papyrInstance.html = (htmlString) => {
        let template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content.cloneNode(true);
    };

    // Visual animations transition engine
    papyrInstance.fadeIn = (el, duration = 400) => {
        el.style.opacity = '0';
        el.style.transition = `opacity ${duration}ms ease`;
        requestAnimationFrame(() => { el.style.opacity = '1'; });
    };

    papyrInstance.fadeOut = (el, duration = 400) => {
        el.style.opacity = '1';
        el.style.transition = `opacity ${duration}ms ease`;
        requestAnimationFrame(() => { el.style.opacity = '0'; });
        setTimeout(() => el.remove(), duration);
    };

    papyrInstance.animate = (el, properties, duration = 400) => {
        el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        requestAnimationFrame(() => {
            Object.assign(el.style, properties);
        });
    };

    papyrInstance.loadFramework = (framework) => {
        let id = `papyr-fw-${framework}`;
        if (document.getElementById(id)) return;
        
        if (framework === 'tailwind') {
            let script = document.createElement('script');
            script.id = id;
            script.src = 'https://cdn.tailwindcss.com';
            document.head.appendChild(script);
        } else if (framework === 'bootstrap') {
            let link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
            
            let customStyle = document.getElementById('papyr-complete-styles') || document.querySelector('link[href*="styles.css"]') || document.querySelector('style');
            if (customStyle && customStyle.parentNode) {
                customStyle.parentNode.insertBefore(link, customStyle);
            } else {
                document.head.appendChild(link);
            }
            
            if (typeof document !== 'undefined') {
                if (document.documentElement) {
                    document.documentElement.setAttribute('data-bs-theme', 'dark');
                }
                if (document.body) {
                    document.body.setAttribute('data-bs-theme', 'dark');
                }
            }
        }
    };

    papyrInstance.init = (config = {}) => {
        if (config.privacy) {
            if (papyrInstance.security && typeof papyrInstance.security.setTier === 'function') {
                papyrInstance.security.setTier(config.privacy);
            } else {
                papyrInstance._initialPrivacy = config.privacy;
            }
        }
        if (config.debug !== undefined) {
            papyrInstance.debug(config.debug);
        }
    };

    let previousPapyr = typeof window !== 'undefined' ? window.papyr : null;
    papyrInstance.noConflict = () => {
        if (typeof window !== 'undefined') {
            window.papyr = previousPapyr;
        }
        return papyrInstance;
    };

    papyrInstance.el = papyrInstance;

    // Run registered core initializers!
    coreInitializers.forEach(init => {
        try { init(papyrInstance); } catch(e) { console.error("Error during core initialization", e); }
    });

    return papyrInstance;
}

if (typeof window !== 'undefined') {
    window.createPapyr = createPapyr;
}


// --- MODULE: core/security.js ---
/**
 * PAPYR SECURITY KERNEL
 * Enterprise-grade XSS Sanitization and Injection Prevention.
 * Web App Tracking Transparency (WATT) script and storage filter.
 * Updated to run modularly inside the Papyr Kernel context.
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

    coreInitializers.push((papyr) => {
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
    });

    // Install LocalStorage Interception
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem = function(key, val) {
            if (window.papyr && window.papyr.security && window.papyr.security.shouldSandboxStorage(key)) {
                tempStorage[key] = val;
                return;
            }
            if (originalSetItem) originalSetItem(key, val);
        };
        
        localStorage.getItem = function(key) {
            if (window.papyr && window.papyr.security && window.papyr.security.shouldSandboxStorage(key)) {
                return tempStorage[key] !== undefined ? tempStorage[key] : null;
            }
            return originalGetItem ? originalGetItem(key) : null;
        };
        
        localStorage.removeItem = function(key) {
            if (window.papyr && window.papyr.security && window.papyr.security.shouldSandboxStorage(key)) {
                delete tempStorage[key];
                return;
            }
            if (originalRemoveItem) originalRemoveItem(key);
        };
    }
})();


// --- MODULE: core/reactivity.js ---
/**
 * PAPYR REACTIVITY SYSTEM
 * 
 * Auto-tracking reactive state variables and computed logic nodes.
 * Updated to run modularly inside the Papyr Kernel context.
 */

coreInitializers.push((papyr) => {
    
    /**
     * Creates an auto-tracking reactive state variable.
     * 
     * @param {*} val Initial reactive state value
     * @returns {PaperState} Reactive State accessor interface
     */
    papyr.state = (val) => {
        let subscribers = new Set();
        let stateObj = {
            get value() {
                if (activeEffect) subscribers.add(activeEffect);
                return val;
            },
            set value(newVal) {
                let oldVal = val;
                val = newVal;
                papyr.diagnostics.trackUpdate(stateObj, newVal, oldVal);
                subscribers.forEach(sub => sub(newVal));
                
                // Trigger hooks
                papyr.plugins.triggerHook('onUpdate', stateObj);
            },
            subscribe(sub) {
                subscribers.add(sub);
                sub(val);
                return () => subscribers.delete(sub);
            },
            dump() {
                return val;
            }
        };
        papyr.state.register(stateObj);
        return stateObj;
    };

    // Initialize state registries on the state function itself for this kernel instance
    papyr.state.states = new Set();
    papyr.state.register = (s) => papyr.state.states.add(s);
    papyr.state.list = () => Array.from(papyr.state.states);
    papyr.state.dump = () => {
        let res = {};
        let idx = 0;
        papyr.state.states.forEach(s => {
            res[`state_${idx++}`] = s.value;
        });
        return res;
    };

    /**
     * Generates an auto-updating computed reactive variable.
     * 
     * @param {function} fn Tracked callback evaluating state operations
     * @returns {PaperComputed} Read-only tracking interface
     */
    papyr.computed = (fn) => {
        let subscribers = new Set();
        let currentVal;
        let effect = () => {
            currentVal = fn();
            subscribers.forEach(sub => sub(currentVal));
        };
        
        activeEffect = effect;
        currentVal = fn();
        activeEffect = null;
        
        return {
            get value() {
                if (activeEffect) subscribers.add(activeEffect);
                return currentVal;
            },
            subscribe(sub) {
                subscribers.add(sub);
                sub(currentVal);
                return () => subscribers.delete(sub);
            }
        };
    };

    /**
     * Switches visual DOM subtrees reactively based on condition updates.
     * 
     * @param {PaperState} conditionState Reactive condition state to track
     * @param {HTMLElement|function} trueVal Rendered target when state is truthy
     * @param {HTMLElement|function} [falseVal] Optional target when state is falsy
     * @returns {HTMLDivElement} Content container fragment
     */
    papyr.if = (conditionState, trueVal, falseVal) => {
        let container = papyr.div({ style: { display: 'contents' } });
        let currentEl = null;
        
        let update = (val) => {
            if (currentEl) currentEl.remove();
            let target = val ? trueVal : falseVal;
            if (target) {
                currentEl = typeof target === 'function' ? target() : target;
                container.appendChild(currentEl);
            } else {
                currentEl = null;
            }
        };
        
        if (conditionState && typeof conditionState.subscribe === 'function') {
            conditionState.subscribe(update);
        } else {
            update(!!conditionState);
        }
        return container;
    };

    /**
     * Reactively renders a list of DOM elements from an array state.
     * 
     * @param {PaperState} arrayState Reactive state containing an array
     * @param {function} renderCallback Function returning an HTMLElement for each item
     * @returns {HTMLDivElement} Content container fragment
     */
    papyr.for = (arrayState, renderCallback) => {
        let container = papyr.div({ style: { display: 'contents' } });
        
        let update = (arr) => {
            container.innerHTML = '';
            if (Array.isArray(arr)) {
                arr.forEach((item, index) => {
                    let el = renderCallback(item, index);
                    if (el instanceof Element || el instanceof DocumentFragment) {
                        container.appendChild(el);
                    }
                });
            }
        };
        
        if (arrayState && typeof arrayState.subscribe === 'function') {
            arrayState.subscribe(update);
        } else {
            update(arrayState);
        }
        return container;
    };
});


// --- MODULE: core/router.js ---
/**
 * PAPYR ROUTER
 * Zero-configuration Hash SPA Router.
 * Updated to run modularly inside the Papyr Kernel context.
 */

coreInitializers.push((papyr) => {
    let routes = [];
    let currentView = papyr.state(null);
    let pathParams = papyr.state({});

    /**
     * Define a hash route.
     * @param {string} path Route path (e.g., "#/about", "#/user/:id")
     * @param {function|class} componentFn Component or Class to render
     */
    papyr.route = (path, componentFn) => {
        // Strip leading hash for internal regex matching
        let cleanPath = path.startsWith('#') ? path.substring(1) : path;
        routes.push({
            path: cleanPath,
            regex: new RegExp('^' + cleanPath.replace(/:\w+/g, '([^/]+)') + '$'),
            keys: (cleanPath.match(/:\w+/g) || []).map(k => k.slice(1)),
            componentFn
        });
        
        // Attach to runtime context for context export APIs
        papyr.runtime.routes = routes;
    };

    /**
     * Navigates to a specific path using hash.
     * @param {string} path Target URL hash path
     */
    papyr.navigate = (path) => {
        if (typeof window !== 'undefined') {
            window.location.hash = path.startsWith('#') ? path : '#' + path;
        }
    };

    if (typeof window !== 'undefined') {
        window.addEventListener('hashchange', () => {
            let currentPath = window.location.hash.slice(1) || '/';
            let matchFound = false;

            for (let route of routes) {
                let match = currentPath.match(route.regex);
                if (match) {
                    let params = {};
                    route.keys.forEach((key, index) => {
                        params[key] = match[index + 1];
                    });
                    pathParams.value = params;
                    currentView.value = route.componentFn;
                    matchFound = true;
                    break;
                }
            }
            if (!matchFound) {
                currentView.value = () => papyr.div("404 - Route Not Found");
            }
        });
    }

    /**
     * Global accessor for route parameters
     */
    papyr.useParams = () => pathParams;

    /**
     * Initializes the router and returns the reactive router container.
     */
    papyr.router = () => {
        if (typeof window !== 'undefined' && routes.length > 0 && !currentView.value) {
            window.dispatchEvent(new Event('hashchange')); // Initial load
        }
        
        let routeNode = papyr.if(
            currentView,
            () => {
                let Component = currentView.value;
                if (Component.prototype && Component.prototype instanceof papyr.component) {
                    return new Component().render();
                }
                return Component();
            },
            () => papyr.div()
        );

        // Persistent Workspace Check
        if (typeof document !== 'undefined') {
            // Wait for DOM to paint, then check if layout engine created a shell
            setTimeout(() => {
                let mainShell = document.querySelector('.papyr-main-content');
                if (mainShell && !mainShell.contains(routeNode)) {
                    mainShell.innerHTML = '';
                    mainShell.appendChild(routeNode);
                }
            }, 0);
        }

        return routeNode;
    };
});


// --- MODULE: core/math.js ---
/**
 * PAPYR MATHEMATICAL LOGIC SYSTEM
 * 
 * Auto-updating computed mathematical operations accepting standard numbers or reactive state nodes.
 * Updated to run modularly inside the Papyr Kernel context.
 */

coreInitializers.push((papyr) => {
    const flatten = (arr) => arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);
    const getVal = (x) => (x && typeof x.subscribe === 'function' ? x.value : Number(x || 0));

    papyr.math = {
        /**
         * Calculates reactive sum of multiple states or numbers.
         */
        sum: (...args) => papyr.computed(() => {
            return flatten(args).reduce((acc, cur) => acc + getVal(cur), 0);
        }),

        /**
         * Calculates reactive subtraction of two states or numbers.
         */
        sub: (a, b) => papyr.computed(() => {
            return getVal(a) - getVal(b);
        }),

        /**
         * Calculates reactive product of multiple states or numbers.
         */
        mul: (...args) => papyr.computed(() => {
            let flat = flatten(args);
            if (flat.length === 0) return 0;
            return flat.reduce((acc, cur) => acc * (cur && typeof cur.subscribe === 'function' ? cur.value : Number(cur || 1)), 1);
        }),

        /**
         * Calculates reactive division of two states or numbers.
         */
        div: (a, b) => papyr.computed(() => {
            let denominator = getVal(b);
            if (denominator === 0) return 0;
            return getVal(a) / denominator;
        }),

        /**
         * Calculates reactive average of multiple states or numbers.
         */
        avg: (...args) => papyr.computed(() => {
            let flat = flatten(args);
            if (flat.length === 0) return 0;
            let sumVal = flat.reduce((acc, cur) => acc + getVal(cur), 0);
            return sumVal / flat.length;
        }),

        /**
         * Calculates reactive percentage of a value inside a total.
         */
        percent: (val, total) => papyr.computed(() => {
            let t = getVal(total);
            if (t === 0) return 0;
            return (getVal(val) / t) * 100;
        }),

        /**
         * Calculates reactive rounded values.
         */
        round: (val, decimals = 0) => papyr.computed(() => {
            let v = getVal(val);
            let d = getVal(decimals);
            let factor = Math.pow(10, d);
            return Math.round(v * factor) / factor;
        })
    };
});


// --- MODULE: core/db.js ---
/**
 * PAPYR DATA SYSTEM (Unified DB API)
 * Seamlessly integrates LocalStorage, SessionStorage, IndexedDB, and SQLite endpoints.
 * Updated to run modularly inside the Papyr Kernel context.
 */

coreInitializers.push((papyr) => {
    
    papyr.db = (collectionName, engine = 'local') => {
        
        // Engine Drivers
        const drivers = {
            'local': {
                get: () => {
                    try { return JSON.parse(localStorage.getItem(`papyr_db_${collectionName}`)) || []; } 
                    catch(e) { return []; }
                },
                set: (data) => localStorage.setItem(`papyr_db_${collectionName}`, JSON.stringify(data))
            },
            'session': {
                get: () => {
                    try { return JSON.parse(sessionStorage.getItem(`papyr_db_${collectionName}`)) || []; } 
                    catch(e) { return []; }
                },
                set: (data) => sessionStorage.setItem(`papyr_db_${collectionName}`, JSON.stringify(data))
            },
            'firebase': {
                get: () => [], // Handled async in real implementation
                set: (data) => {
                    if (papyr.firebase && papyr.firebase.db) {
                        papyr.firebase.db(collectionName).set(data);
                    } else {
                        console.warn("PaperDB: Firebase engine selected but papyr.firebase is not initialized.");
                    }
                }
            },
            'sqlite': {
                get: () => [],
                set: (data) => {
                    if (papyr.sqlite) papyr.sqlite.insert(collectionName, data);
                }
            }
        };

        let driver = drivers[engine] || drivers['local'];
        let state = papyr.state(driver.get());

        // Watchers for reactivity
        let watchers = [];

        const sync = () => {
            driver.set(state.value);
            watchers.forEach(cb => cb(state.value));
        };

        return {
            state,
            
            insert(item) {
                let record = { id: Date.now().toString(36), createdAt: new Date().toISOString(), ...item };
                state.value = [...state.value, record];
                sync();
                return record;
            },
            
            find(id) {
                return state.value.find(record => record.id === id);
            },
            
            update(id, data) {
                state.value = state.value.map(record => 
                    record.id === id ? { ...record, ...data, updatedAt: new Date().toISOString() } : record
                );
                sync();
            },
            
            delete(id) {
                state.value = state.value.filter(record => record.id !== id);
                sync();
            },
            
            clear() {
                state.value = [];
                sync();
            },
            
            watch(callback) {
                watchers.push(callback);
                callback(state.value); // immediate execution
                return () => watchers = watchers.filter(cb => cb !== callback); // unsubscribe
            }
        };
    };

    // Upgraded storage helper function with dual call signature compatibility (Getter/Setter + object properties)
    const storageFunc = (key, val) => {
        if (typeof val === 'undefined') {
            let data = localStorage.getItem(key);
            try { return JSON.parse(data); } catch(e) { return data; }
        }
        localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
    };
    storageFunc.set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    storageFunc.get = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; } };
    storageFunc.secureSet = (k, v, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        localStorage.setItem(k, papyr.security.encrypt(JSON.stringify(v), password));
    };
    storageFunc.secureGet = (k, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        let enc = localStorage.getItem(k);
        if (!enc) return null;
        try { return JSON.parse(papyr.security.decrypt(enc, password)); } catch(e) { return null; }
    };
    papyr.storage = storageFunc;

    // Upgraded session helper function with dual call signature compatibility
    const sessionFunc = (key, val) => {
        if (typeof val === 'undefined') {
            let data = sessionStorage.getItem(key);
            try { return JSON.parse(data); } catch(e) { return data; }
        }
        sessionStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
    };
    sessionFunc.set = (k, v) => sessionStorage.setItem(k, JSON.stringify(v));
    sessionFunc.get = (k) => { try { return JSON.parse(sessionStorage.getItem(k)); } catch(e) { return null; } };
    sessionFunc.secureSet = (k, v, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        sessionStorage.setItem(k, papyr.security.encrypt(JSON.stringify(v), password));
    };
    sessionFunc.secureGet = (k, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        let enc = sessionStorage.getItem(k);
        if (!enc) return null;
        try { return JSON.parse(papyr.security.decrypt(enc, password)); } catch(e) { return null; }
    };
    papyr.session = sessionFunc;
});


// --- MODULE: core/orm.js ---
/**
 * PAPER ORM SYSTEM
 * Object-Relational Mapping for Papyr.js
 * Updated to run modularly inside the Papyr Kernel context.
 */

coreInitializers.push((papyr) => {
    class PapyrModel {
        constructor(data = {}) {
            Object.assign(this, data);
        }

        // Instance method for saving to DB
        save() {
            const cname = this.constructor.name.toLowerCase() + 's';
            if (this.id) {
                papyr.db(cname).update(this.id, this);
            } else {
                let record = papyr.db(cname).insert(this);
                this.id = record.id;
            }
            return this;
        }

        // Instance method for deleting from DB
        delete() {
            const cname = this.constructor.name.toLowerCase() + 's';
            if (this.id) {
                papyr.db(cname).delete(this.id);
            }
        }

        // Static CRUD methods
        static create(data) {
            const instance = new this(data);
            return instance.save();
        }

        static find(id) {
            const cname = this.name.toLowerCase() + 's';
            const data = papyr.db(cname).find(id);
            return data ? new this(data) : null;
        }

        static all() {
            const cname = this.name.toLowerCase() + 's';
            return papyr.db(cname).state.value.map(data => new this(data));
        }

        static watch(callback) {
            const cname = this.name.toLowerCase() + 's';
            return papyr.db(cname).watch(dataList => {
                callback(dataList.map(data => new this(data)));
            });
        }
    }

    // Global exposure on the active kernel instance
    papyr.model = PapyrModel;
});


// --- MODULE: core/auth.js ---
/**
 * PAPYR AUTHENTICATION ENGINE
 * Handles login, logout, and registration logic. Provides a unified interface
 * for Local, JWT, Firebase Auth, and OAuth.
 * Updated to run modularly inside the Papyr Kernel context.
 */

coreInitializers.push((papyr) => {
    papyr.auth = {
        user: papyr.state(null), // Reactive current user state
        
        _config: { provider: 'local' },

        async _hashPassword(password) {
            if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
                const msgBuffer = new TextEncoder().encode(password);
                const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            }
            // Deterministic numeric hashing fallback for Node.js/testing environments:
            let hash = 0;
            for (let i = 0; i < password.length; i++) {
                const char = password.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return "sha256_poly_" + Math.abs(hash).toString(16);
        },

        init(config) {
            this._config = { ...this._config, ...config };
            
            // Auto-login check for local token
            if (this._config.provider === 'local') {
                let token = papyr.storage.get("auth_token");
                if (token) {
                    let sessions = papyr.storage.get("papyr_auth_sessions") || {};
                    let username = sessions[token];
                    if (username) {
                        let users = papyr.storage.get("papyr_auth_users") || {};
                        let userRecord = users[username];
                        if (userRecord) {
                            this.user.value = { id: userRecord.id, username: username, token };
                        } else {
                            papyr.storage.set("auth_token", null);
                        }
                    } else {
                        papyr.storage.set("auth_token", null);
                    }
                }
            }
        },

        async login(credentials) {
            if (this._config.provider === 'local') {
                if (!credentials.username || !credentials.password) {
                    return Promise.reject(new Error("Authentication failed: Username and password are required."));
                }
                let users = papyr.storage.get("papyr_auth_users") || {};
                let userRecord = users[credentials.username];
                if (!userRecord) {
                    return Promise.reject(new Error("Authentication failed: Username does not exist."));
                }
                
                const hashedPassword = await this._hashPassword(credentials.password);
                if (userRecord.passwordHash !== hashedPassword) {
                    return Promise.reject(new Error("Authentication failed: Incorrect password."));
                }
                
                const token = "local_session_" + Math.random().toString(36).substr(2, 9);
                let sessions = papyr.storage.get("papyr_auth_sessions") || {};
                sessions[token] = credentials.username;
                papyr.storage.set("papyr_auth_sessions", sessions);
                
                papyr.storage.set("auth_token", token);
                let userObj = { id: userRecord.id, username: credentials.username, token };
                this.user.value = userObj;
                return userObj;
            } else if (this._config.provider === 'firebase') {
                if (papyr.firebase && papyr.firebase.auth) {
                    return papyr.firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
                        .then(res => {
                            this.user.value = res.user;
                            return res.user;
                        });
                } else {
                    return Promise.reject(new Error("Firebase not initialized"));
                }
            }
            return Promise.reject(new Error("Provider not supported"));
        },

        async register(credentials) {
            if (this._config.provider === 'local') {
                if (!credentials.username || !credentials.password) {
                    return Promise.reject(new Error("Registration failed: Username and password are required."));
                }
                let users = papyr.storage.get("papyr_auth_users") || {};
                if (users[credentials.username]) {
                    return Promise.reject(new Error("Registration failed: Username already exists."));
                }
                
                const hashedPassword = await this._hashPassword(credentials.password);
                users[credentials.username] = {
                    id: Date.now(),
                    username: credentials.username,
                    passwordHash: hashedPassword
                };
                papyr.storage.set("papyr_auth_users", users);
                
                const token = "local_session_" + Math.random().toString(36).substr(2, 9);
                let sessions = papyr.storage.get("papyr_auth_sessions") || {};
                sessions[token] = credentials.username;
                papyr.storage.set("papyr_auth_sessions", sessions);
                
                papyr.storage.set("auth_token", token);
                let userObj = { id: users[credentials.username].id, username: credentials.username, token };
                this.user.value = userObj;
                return userObj;
            }
            return Promise.reject(new Error("Registration not implemented for " + this._config.provider));
        },

        logout() {
            if (this._config.provider === 'local') {
                let token = papyr.storage.get("auth_token");
                if (token) {
                    let sessions = papyr.storage.get("papyr_auth_sessions") || {};
                    delete sessions[token];
                    papyr.storage.set("papyr_auth_sessions", sessions);
                }
                papyr.storage.set("auth_token", null);
                this.user.value = null;
                return Promise.resolve();
            } else if (this._config.provider === 'firebase' && papyr.firebase) {
                return papyr.firebase.auth().signOut().then(() => {
                    this.user.value = null;
                });
            }
        }
    };
});


// --- MODULE: core/api.js ---
/**
 * PAPYR API HELPERS
 * Simplifies standard fetch() commands for beginners.
 * Updated to run modularly inside the Papyr Kernel context.
 */

coreInitializers.push((papyr) => {
    papyr.api = {
        /**
         * Perform an async GET request
         */
        async get(url, headers = {}) {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        ...headers
                    }
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return await response.json();
            } catch (error) {
                if (papyr.warn) papyr.warn(`papyr.api.get failed for ${url}`, error);
                throw error;
            }
        },

        /**
         * Perform an async POST request
         */
        async post(url, data, headers = {}) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...headers
                    },
                    body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return await response.json();
            } catch (error) {
                if (papyr.warn) papyr.warn(`papyr.api.post failed for ${url}`, error);
                throw error;
            }
        }
    };
});


// --- MODULE: core/debug.js ---
/**
 * PAPYR DEBUGGING SUITE
 * Provides structured, educational console logs for beginners.
 * Updated to run modularly inside the Papyr Kernel context and instantiate the default global instance.
 */

coreInitializers.push((papyr) => {
    papyr.log = (...args) => {
        console.log(
            '%c Papyr Log ', 
            'background: #3b82f6; color: white; border-radius: 4px; font-weight: bold; padding: 2px 4px;',
            ...args
        );
    };

    papyr.warn = (...args) => {
        console.warn(
            '%c Papyr Warning ', 
            'background: #f59e0b; color: white; border-radius: 4px; font-weight: bold; padding: 2px 4px;',
            ...args
        );
        
        // Report warnings to the kernel diagnostics engine
        papyr.diagnostics.errors.push({
            type: 'warning',
            message: args.map(String).join(' '),
            timestamp: new Date().toISOString()
        });
    };
});

// Since debug.js is the last concatenated file in the build, instantiate the global window.papyr now!
if (typeof window !== 'undefined' && !window.papyr) {
    window.papyr = createPapyr();
}



// --- MODULE: plugins/official.js ---
/**
 * PAPYR OFFICIAL PLUGINS & WIDGETS
 * 
 * Auto-registered official plugins, widgets, layout components, and vector icons.
 */

(function() {
    // Check if papyr exists
    if (typeof papyr === 'undefined') {
        console.warn("Papyr core not detected. Official plugins require papyr core to run.");
        return;
    }

    // ==========================================
    // 1. Vector Icons Library
    // ==========================================
    const icons = {
        bolt: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        unlock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M7 11V7a5 5 0 019.9-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        todo: '<path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>',
        home: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        book: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        users: '<path d="M17 21v-2a4 4 0 00-3-3H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        folder: '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        search: '<circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        external: '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        bell: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        check: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        info: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        alert: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        terminal: '<path d="M4 17l6-6-6-6M12 19h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        palette: '<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14 3 16 4.5 17C5.5 17.6667 5.5 19 4 20C3 20.6667 3 22 5 22C6.5 22 8 21.5 9 20C9.66667 19.3333 10.3333 19 11 19C11.6667 19 12 20 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        code: '<path d="M16 18l6-6-6-6M8 6L2 12l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        database: '<ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        settings: '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        package: '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        refresh: '<path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l5.67-5.67" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        arrowRight: '<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        arrowLeft: '<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        trash: '<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        edit: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>',
        calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        save: '<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 01-2-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>'
    };

    /**
     * Generates a modern vector SVG element for preloaded system icons.
     */
    papyr.icon = (name, options = {}) => {
        let size = options.size || 16;
        let color = options.color || 'currentColor';
        let strokeWidth = options.strokeWidth || 2;
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', String(size));
        svg.setAttribute('height', String(size));
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.style.display = 'inline-block';
        svg.style.verticalAlign = 'middle';
        svg.style.color = color;
        if (options.style) Object.assign(svg.style, options.style);
        if (options.class) svg.setAttribute('class', options.class);
        
        let inner = icons[name] || '';
        if (strokeWidth !== 2) {
            inner = inner.replace(/stroke-width="2"/g, `stroke-width="${strokeWidth}"`);
        }
        svg.innerHTML = inner;
        return svg;
    };

    // ==========================================
    // 2. UI Widgets
    // ==========================================

    /**
     * Auto-suggestions matching autocomplete inputs connected to remote endpoints.
     */
    papyr.autoComplete = (inputEl, apiUrl) => {
        let input;
        let isLocal = Array.isArray(inputEl);
        
        if (isLocal) {
            let placeholder = typeof apiUrl === 'string' ? apiUrl : 'Search...';
            input = papyr.input('text', placeholder, { style: { width: '100%' } });
        } else {
            input = typeof inputEl === 'string' ? papyr.input('text', inputEl, { style: { width: '100%' } }) : inputEl;
        }
        
        // Bulletproof fallback check to guarantee input supports addEventListener
        if (!input || typeof input.addEventListener !== 'function') {
            let placeholder = typeof apiUrl === 'string' ? apiUrl : (typeof inputEl === 'string' ? inputEl : 'Search...');
            input = document.createElement('input');
            input.type = 'text';
            input.placeholder = placeholder;
            input.style.width = '100%';
            input.className = 'input-text';
        }
        
        let suggestions = papyr.ul('.suggestions');
        let container = papyr.div('.autocomplete', input, suggestions);
        let debounceTimer;
        
        if (isLocal) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.toLowerCase().trim();
                suggestions.innerHTML = '';
                if (!value) return;
                
                let matches = inputEl.filter(item => item.toLowerCase().includes(value));
                matches.slice(0, 5).forEach(item => {
                    let li = papyr.li(item, {
                        on: {
                            click: () => {
                                input.value = item;
                                suggestions.innerHTML = '';
                                
                                // Dispatch both select & change events so all user subscriptions work
                                let selectEv = new CustomEvent('select', { detail: item });
                                container.dispatchEvent(selectEv);
                                let changeEv = new CustomEvent('change', { detail: item });
                                container.dispatchEvent(changeEv);
                            }
                        }
                    });
                    suggestions.appendChild(li);
                });
            });
        } else {
            input.addEventListener('input', async (e) => {
                clearTimeout(debounceTimer);
                let value = e.target.value;
                if(value.length < 2) {
                    suggestions.innerHTML = '';
                    return;
                }
                
                debounceTimer = setTimeout(async () => {
                    try {
                        let response = await fetch(`${apiUrl}${value}`);
                        let data = await response.json();
                        
                        suggestions.innerHTML = '';
                        let items = Array.isArray(data) ? data : (data.results || data.products || data.data || []);
                        items.slice(0, 5).forEach(item => {
                            let text = item.title || item.name || item.username || item;
                            let li = papyr.li(text, {
                                on: {
                                    click: () => {
                                        input.value = text;
                                        suggestions.innerHTML = '';
                                        if(papyr.onSuggestion) papyr.onSuggestion(item);
                                        
                                        let selectEv = new CustomEvent('select', { detail: item });
                                        container.dispatchEvent(selectEv);
                                        let changeEv = new CustomEvent('change', { detail: text });
                                        container.dispatchEvent(changeEv);
                                    }
                                }
                            });
                            suggestions.appendChild(li);
                        });
                    } catch(err) { console.error(err); }
                }, 300);
            });
        }
        
        document.addEventListener('click', (e) => {
            if(!container.contains(e.target)) suggestions.innerHTML = '';
        });
        
        return container;
    };

    /**
     * Highly versatile auto-builder forms creator.
     */
    papyr.form = (...args) => {
        if (args.length > 0 && Array.isArray(args[0])) {
            let [fields, onSubmit] = args;
            let form = papyr('form', '.papyr-form');
            let formElements = [];
            
            fields.forEach(field => {
                let wrapper = papyr.div('.form-field');
                let label = papyr.label(field.label, {for: field.name});
                let input;
                
                if(field.type === 'select') {
                    input = papyr.select({name: field.name, id: field.name});
                    field.options.forEach(opt => {
                        input.appendChild(papyr.option(opt, {value: opt, textContent: opt}));
                    });
                } else if(field.type === 'textarea') {
                    input = papyr.textarea('', {name: field.name, id: field.name, rows: field.rows || 3, placeholder: field.placeholder || ''});
                } else {
                    input = papyr.input('', {type: field.type || 'text', name: field.name, id: field.name, placeholder: field.placeholder || ''});
                }
                
                wrapper.appendChild(label);
                wrapper.appendChild(input);
                form.appendChild(wrapper);
                formElements.push(input);
            });
            
            let submitBtn = papyr.button('Submit', {type: 'submit', class: 'btn-primary'});
            form.appendChild(submitBtn);
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let data = {};
                formElements.forEach(el => { data[el.name] = el.value; });
                if(onSubmit) onSubmit(data);
            });
            
            return form;
        } else {
            return papyr('form', ...args);
        }
    };

    /**
     * Glassmorphism Content Card.
     */
    papyr.card = (title, content, footer = null) => {
        let headerEl = typeof title === 'string' ? papyr.h3(title, '.card-title') : title;
        let contentEl = typeof content === 'string' ? papyr.div(content, '.card-content') : content;
        
        let children = [headerEl, contentEl];
        if (footer) {
            let footerEl = typeof footer === 'string' ? papyr.div(footer, '.card-footer') : footer;
            children.push(footerEl);
        }
        
        return papyr.div('.card', ...children);
    };

    /**
     * Dialog modal frames with .show() and .hide() routines.
     */
    papyr.modal = (content, title = "Modal") => {
        let modal = papyr.div('.modal', {style: {display: 'none'}},
            papyr.div('.modal-content',
                papyr.div('.modal-header',
                    papyr.h3(title),
                    papyr.button('×', {
                        class: 'close-btn',
                        on: {click: () => modal.hide()}
                    })
                ),
                papyr.div(content, '.modal-body')
            )
        );
        
        modal.show = () => {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('modal-show'), 10);
        };
        modal.hide = () => {
            modal.classList.remove('modal-show');
            setTimeout(() => modal.style.display = 'none', 300);
        };
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.hide();
        });
        
        return modal;
    };

    // Static native fallbacks for browser/OS alert & confirm
    papyr.modal.alert = (message, title = "Alert") => {
        if (typeof window !== 'undefined') {
            // Check if HTML5 Dialog is preferred, otherwise use window.alert
            if (window.alert) {
                window.alert(`${title}\n\n${message}`);
            }
        }
    };

    papyr.modal.confirm = (message, callback) => {
        if (typeof window !== 'undefined' && window.confirm) {
            let res = window.confirm(message);
            if (callback) callback(res);
            return res;
        }
        if (callback) callback(false);
        return false;
    };

    /**
     * Micro-toast notification alerts. Supports OS native push notifications fallback.
     */
    papyr.toast = (message, type = 'info', duration = 3000, useNative = false) => {
        if (useNative && typeof window !== 'undefined' && 'Notification' in window) {
            const fireNative = () => {
                try {
                    new Notification('Papyr Notification', {
                        body: message,
                        icon: 'https://eldrex.landecs.org/logo/eldrex-papyr-js.png'
                    });
                } catch (e) {
                    showCustomToast();
                }
            };

            if (Notification.permission === 'granted') {
                fireNative();
                return;
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        fireNative();
                    } else {
                        showCustomToast();
                    }
                });
                return;
            }
        }
        
        showCustomToast();
        
        function showCustomToast() {
            let toast = papyr.div(message, `.toast.toast-${type}`);
            document.body.appendChild(toast);
            
            toast.offsetHeight; // trigger reflow
            toast.classList.add('toast-show');
            
            setTimeout(() => {
                toast.classList.remove('toast-show');
                toast.classList.add('toast-hide');
                setTimeout(() => toast.remove(), 400);
            }, duration);
        }
    };

    /**
     * High-performance Tabs routing widgets.
     */
    papyr.tabs = (tabs) => {
        let tabHeaders = papyr.div('.tab-headers');
        let tabContents = papyr.div('.tab-contents');
        let container = papyr.div('.tabs', tabHeaders, tabContents);
        
        tabs.forEach((tab, index) => {
            let header = papyr.button(tab.title, {
                class: index === 0 ? 'tab-header tab-active' : 'tab-header',
                on: {click: () => {
                    container.querySelectorAll('.tab-header').forEach((h, idx) => {
                        h.classList.toggle('tab-active', idx === index);
                    });
                    tabContents.innerHTML = '';
                    let contentNode = typeof tab.content === 'string' ? papyr.div(tab.content) : tab.content;
                    tabContents.appendChild(contentNode);
                }}
            });
            tabHeaders.appendChild(header);
            
            if(index === 0) {
                let contentNode = typeof tab.content === 'string' ? papyr.div(tab.content) : tab.content;
                tabContents.appendChild(contentNode);
            }
        });
        
        return container;
    };

    /**
     * Highly responsive Table renderer.
     */
    papyr.table = (...args) => {
        if (args.length > 0 && Array.isArray(args[0]) && typeof args[0][0] === 'string') {
            let [headers, data] = args;
            let table = papyr('table', '.data-table');
            let thead = papyr.thead();
            let trHead = papyr.tr();
            headers.forEach(h => {
                let formattedHeader = h.charAt(0).toUpperCase() + h.slice(1);
                trHead.appendChild(papyr.th(formattedHeader));
            });
            thead.appendChild(trHead);
            table.appendChild(thead);
            
            let tbody = papyr.tbody();
            data.forEach(row => {
                let tr = papyr.tr();
                headers.forEach(header => {
                    let cellVal = row[header] !== undefined ? row[header] : '';
                    let td = papyr.td();
                    if (cellVal instanceof Element) {
                        td.appendChild(cellVal);
                    } else {
                        td.textContent = cellVal;
                    }
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            
            return table;
        } else {
            return papyr('table', ...args);
        }
    };

    /**
     * Async data spinner fetch utility.
     */
    papyr.fetch = async (url, options = {}) => {
        let loading = papyr.div('.loading', 
            papyr.div('.spinner'),
            papyr.span('Fetching data...')
        );
        let container = papyr.div(loading);
        
        setTimeout(async () => {
            try {
                let response = await fetch(url, options);
                let data = await response.json();
                container.innerHTML = '';
                if(options.onSuccess) {
                    options.onSuccess(container, data);
                } else {
                    container.appendChild(papyr.pre(JSON.stringify(data, null, 2)));
                }
            } catch(e) {
                container.innerHTML = '';
                container.appendChild(papyr.div('.error', `⚠️ Error: ${e.message}`));
            }
        }, 400);
        
        return container;
    };

    // ==========================================
    // 3. Official Plugins (Form, Table, Charts)
    // ==========================================

    papyr.input = (type, placeholder, options = {}) => {
        if (typeof type === 'object' && type !== null) return papyr('input', type);
        if (typeof placeholder === 'object' && placeholder !== null) { options = placeholder; placeholder = options.placeholder || ''; }
        options = Object.assign({}, options);
        if (type) options.type = options.type || type;
        if (placeholder) options.placeholder = options.placeholder || placeholder;
        if (type) return papyr('input', `.input-${type}`, options);
        return papyr('input', options);
    };

    papyr.simpleTable = (data) => {
        let table = papyr('table', '.papyr-table');
        
        // Add headers
        if (data.headers) {
            let thead = papyr('thead');
            let tr = papyr('tr');
            data.headers.forEach(header => {
                tr.appendChild(papyr('th', header));
            });
            thead.appendChild(tr);
            table.appendChild(thead);
        }
        
        // Add rows
        if (data.rows) {
            let tbody = papyr('tbody');
            data.rows.forEach(row => {
                let tr = papyr('tr');
                row.forEach(cell => {
                    tr.appendChild(papyr('td', String(cell)));
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
        }
        
        return table;
    };

    /**
     * High-performance Canvas based micro-charts plugin.
     */
    papyr.chart = (type, data, options = {}) => {
        let canvas = papyr('canvas', {
            width: options.width || 300,
            height: options.height || 180,
            style: { 
                display: 'block', 
                margin: '0 auto', 
                maxWidth: '100%',
                borderRadius: '8px',
                background: 'transparent'
            }
        });
        
        requestAnimationFrame(() => {
            let ctx = canvas.getContext('2d');
            if (!ctx) return;
            let w = canvas.width;
            let h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            
            if (type === 'bar') {
                let values = data.values || [];
                let labels = data.labels || [];
                let max = Math.max(...values, 1);
                let count = values.length;
                let spacing = 16;
                let barW = (w - (spacing * (count + 1))) / count;
                
                values.forEach((val, idx) => {
                    let barH = (val / max) * (h - 50);
                    let x = spacing + idx * (barW + spacing);
                    let y = h - 30 - barH;
                    
                    ctx.fillStyle = 'rgba(255,255,255,0.02)';
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(x, 10, barW, h - 40, 6);
                    } else {
                        ctx.rect(x, 10, barW, h - 40);
                    }
                    ctx.fill();
                    
                    let grad = ctx.createLinearGradient(0, y, 0, h - 30);
                    grad.addColorStop(0, options.color || '#6366f1');
                    grad.addColorStop(1, options.colorAlt || '#312e81');
                    ctx.fillStyle = grad;
                    
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(x, y, barW, barH, [6, 6, 0, 0]);
                    } else {
                        ctx.rect(x, y, barW, barH);
                    }
                    ctx.fill();
                    
                    ctx.fillStyle = '#f8fafc';
                    ctx.font = 'bold 11px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(val, x + barW / 2, y - 8);
                    
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '10px sans-serif';
                    ctx.fillText(labels[idx] || '', x + barW / 2, h - 10);
                });
            } 
            else if (type === 'ring') {
                let val = data.value || 0;
                let cx = w / 2;
                let cy = h / 2;
                let r = Math.min(w, h) / 2.6;
                
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.lineWidth = options.lineWidth || 14;
                ctx.strokeStyle = 'rgba(255,255,255,0.06)';
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(cx, cy, r, -Math.PI / 2, (-Math.PI / 2) + (Math.PI * 2 * (val / 100)));
                ctx.lineWidth = options.lineWidth || 14;
                ctx.strokeStyle = options.color || '#10b981';
                ctx.lineCap = 'round';
                ctx.stroke();
                
                ctx.fillStyle = '#f8fafc';
                ctx.font = 'bold 24px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${val}%`, cx, cy - 6);
                
                ctx.fillStyle = '#94a3b8';
                ctx.font = '10px sans-serif';
                ctx.fillText(data.label || '', cx, cy + 16);
            }
        });
        
        return canvas;
    };

    // ==========================================
    // 4. Pre-built Components
    // ==========================================
    Object.assign(papyr.components, {
        navbar: (logo, links) => {
            let nav = papyr.nav('.navbar');
            let navLinks = papyr.div('.nav-links');
            
            links.forEach(link => {
                navLinks.appendChild(papyr.a(link.text, {
                    href: link.href, 
                    class: 'nav-link',
                    onclick: link.onclick || null
                }));
            });
            
            let logoEl = typeof logo === 'string' ? papyr.div(logo, '.logo') : logo;
            nav.appendChild(logoEl);
            nav.appendChild(navLinks);
            return nav;
        },
        
        hero: (title, subtitle, buttonText, buttonAction) => {
            return papyr.section('.hero',
                papyr.h1(title, '.hero-title'),
                papyr.p(subtitle, '.hero-subtitle'),
                papyr.button(buttonText, {
                    class: 'hero-btn', 
                    on: {click: buttonAction}
                })
            );
        },
        
        sidebar: (items) => {
            let sidebar = papyr.aside('.sidebar');
            items.forEach(item => {
                let name = typeof item === 'string' ? item : (item.text || '');
                let sidebarItem;
                
                if (typeof item === 'object' && item.icon) {
                    sidebarItem = papyr.div('.sidebar-item', 
                        papyr.icon(item.icon, { size: 16, style: { marginRight: '8px' } }),
                        papyr.span(name)
                    );
                } else {
                    sidebarItem = papyr.div('.sidebar-item', 
                        papyr.span(name)
                    );
                }
                
                if (item.active) sidebarItem.classList.add('active');
                
                sidebarItem.addEventListener('click', () => {
                    sidebar.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
                    sidebarItem.classList.add('active');
                    if (item.onclick) item.onclick(name);
                    else papyr.toast(`Navigated to: ${name}`, 'info');
                });
                
                sidebar.appendChild(sidebarItem);
            });
            return sidebar;
        },
        
        footer: (text, links = []) => {
            let footer = papyr.footer('.footer');
            let linkContainer = papyr.div('.footer-links');
            links.forEach(link => {
                linkContainer.appendChild(papyr.a(link.text, {href: link.href}));
            });
            footer.appendChild(linkContainer);
            footer.appendChild(papyr.p(text, '.footer-text'));
            return footer;
        },
        
        carousel: (images) => {
            let current = 0;
            let img = papyr.img('', {src: images[0], class: 'carousel-img'});
            let prevBtn = papyr.button('◀', {class: 'carousel-btn prev-btn'});
            let nextBtn = papyr.button('▶', {class: 'carousel-btn next-btn'});
            
            let dotsContainer = papyr.div('.carousel-dots');
            images.forEach((_, idx) => {
                let dot = papyr.span('.carousel-dot');
                if (idx === 0) dot.classList.add('active');
                dot.onclick = () => goTo(idx);
                dotsContainer.appendChild(dot);
            });
            
            let container = papyr.div('.carousel', prevBtn, img, nextBtn, dotsContainer);
            
            function updateCarousel() {
                img.style.opacity = 0;
                setTimeout(() => {
                    img.src = images[current];
                    img.style.opacity = 1;
                }, 150);
                
                container.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === current);
                });
            }
            
            function goTo(idx) {
                current = idx;
                updateCarousel();
            }
            
            prevBtn.onclick = () => {
                current = (current - 1 + images.length) % images.length;
                updateCarousel();
            };
            nextBtn.onclick = () => {
                current = (current + 1) % images.length;
                updateCarousel();
            };
            return container;
        }
    });
})();


// --- MODULE: plugins/kernel-plugins.js ---
/**
 * PAPYR NATIVE KERNEL PLUGINS
 * 
 * Formal core plugins utilizing the kernel plugin lifecycle hooks:
 * 1. papyr-intent-engine: Supports intent-based cinematic styling configs and spring-physics button builders.
 * 2. papyr-self-heal: Spellchecks unknown HTML tags using Levenshtein distance, prints developer console warnings, and hooks global errors.
 * 3. papyr-accessibility-adapter: Automatically injects appropriate ARIA roles and keyboard accessibility support (tabIndex).
 * 4. papyr-energy-adapter: Links with the Papyr Power system to throttle animations and loop states during idle modes.
 */

(function(window) {
    // Helper to calculate Levenshtein distance (for local self-heal fallback)
    function levenshteinDistance(a, b) {
        let tmp = [];
        for (let i = 0; i <= a.length; i++) {
            let row = [i];
            for (let j = 1; j <= b.length; j++) {
                row.push(i === 0 ? j : Math.min(
                    tmp[i - 1][j] + 1,
                    row[j - 1] + 1,
                    tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
                ));
            }
            tmp.push(row);
        }
        return tmp[a.length][b.length];
    }

    // 1. Intent Engine Plugin
    const intentEnginePlugin = {
        name: 'papyr-intent-engine',
        version: '1.0.0',
        install(kernel) {
            // Register cinematic configs and theme scaffolding styles
            kernel.applyCinematic = (el, styleType) => {
                if (!el || !el.style) return;
                const configurations = {
                    hero: {
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #0f172a 100%)',
                        color: '#f8fafc',
                        padding: '120px 20px',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    },
                    cinematic: {
                        background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
                        color: '#38bdf8',
                        padding: '80px 40px',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        boxShadow: '0 0 40px rgba(56, 189, 248, 0.1)',
                        borderRadius: '24px'
                    },
                    focus: {
                        background: '#020617',
                        color: '#f1f5f9',
                        borderLeft: '4px solid #6366f1',
                        padding: '24px',
                        fontStyle: 'italic',
                        borderRadius: '0 8px 8px 0'
                    }
                };
                const styles = configurations[styleType];
                if (styles) {
                    Object.assign(el.style, styles);
                }
            };

            // Dynamic spring physics-based button builder
            kernel.button = (text, options = {}) => {
                const isSecondary = options.variant === 'secondary';
                
                const btnStyle = {
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    outline: 'none',
                    border: isSecondary ? '1px solid rgba(255,255,255,0.2)' : 'none',
                    background: isSecondary ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease, opacity 0.2s ease',
                    boxShadow: isSecondary ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)',
                };

                const userStyle = options.style || {};
                const finalStyle = Object.assign({}, btnStyle, userStyle);

                const btn = kernel('button', {
                    style: finalStyle,
                    class: options.class || '',
                    on: {
                        mouseenter() {
                            btn.style.transform = 'scale(1.05)';
                            if (!isSecondary) {
                                btn.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.5)';
                            }
                        },
                        mouseleave() {
                            btn.style.transform = 'scale(1)';
                            if (!isSecondary) {
                                btn.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                            }
                        },
                        mousedown() {
                            btn.style.transform = 'scale(0.95)';
                        },
                        mouseup() {
                            btn.style.transform = 'scale(1.05)';
                        }
                    }
                }, text);

                if (options.on && options.on.click) {
                    btn.addEventListener('click', options.on.click);
                }

                return btn;
            };
        }
    };

    // 2. Self Heal Plugin
    const selfHealPlugin = {
        name: 'papyr-self-heal',
        version: '1.0.0',
        install(kernel) {
            // Listen to warning events from the kernel
            if (typeof window !== 'undefined') {
                window.addEventListener('papyr-warning', (e) => {
                    const { tag, suggestion } = e.detail;
                    const logMsg = `💡 [Self Heal Plugin] Corrective suggestion for tag <${tag}>: Use <${suggestion}> instead.`;
                    console.log(`%c ${logMsg} `, 'background: #10b981; color: white; border-radius: 4px; font-weight: bold; padding: 2px 4px;');
                    
                    // Push diagnostic info
                    kernel.diagnostics.errors.push({
                        type: 'self-heal-suggestion',
                        message: `Spellchecked unknown tag <${tag}>. Corrective suggestion: <${suggestion}>`,
                        timestamp: new Date().toISOString()
                    });
                });

                // Global window error safety reporting
                window.addEventListener('error', (e) => {
                    kernel.diagnostics.reportError(e.error || e.message);
                });
            }
        }
    };

    // 3. Accessibility Adapter Plugin
    const accessibilityAdapterPlugin = {
        name: 'papyr-accessibility-adapter',
        version: '1.0.0',
        hooks: {
            onRender(el) {
                if (!el || !el.tagName) return;
                const tag = el.tagName.toLowerCase();

                // 1. Add roles for button and links
                if (tag === 'button') {
                    if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
                }
                
                // 2. Navigation containers
                if (el.classList && (el.classList.contains('navbar') || el.classList.contains('nav'))) {
                    if (!el.hasAttribute('role')) el.setAttribute('role', 'navigation');
                }

                // 3. Complementary sidebars
                if (el.classList && (el.classList.contains('sidebar') || el.classList.contains('aside'))) {
                    if (!el.hasAttribute('role')) el.setAttribute('role', 'complementary');
                }

                // 4. Ensure images have alt descriptions
                if (tag === 'img') {
                    if (!el.hasAttribute('alt')) {
                        el.setAttribute('alt', ''); // Empty alt to hide aesthetic images from screen readers
                    }
                }

                // 5. Interactive elements without standard focus
                if (el.hasAttribute('onclick') || (el.dataset && el.dataset.clickEvent)) {
                    if (tag !== 'button' && tag !== 'a' && tag !== 'input') {
                        if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
                        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
                    }
                }
            }
        }
    };

    // 4. Energy Adapter Plugin
    const energyAdapterPlugin = {
        name: 'papyr-energy-adapter',
        version: '1.0.0',
        install(kernel) {
            // Integrate with kernel.power system to optimize execution pacing
            kernel.events.on('power-state-change', (newState) => {
                if (newState === 'idle') {
                    console.log("⚡ [Energy Adapter] Reducing UI update loops to idle pace.");
                } else if (newState === 'active') {
                    console.log("⚡ [Energy Adapter] Elevating UI performance to full capacity.");
                }
            });

            // Set up a loop listener to dynamically hook with papyr.power if it exists
            setTimeout(() => {
                if (kernel.power && kernel.power.state) {
                    kernel.power.state.subscribe((stateVal) => {
                        kernel.events.emit('power-state-change', stateVal);
                    });
                }
            }, 100);
        }
    };

    // Register all native plugins automatically if papyr library is loaded
    if (typeof window !== 'undefined') {
        window.papyrIntentEngine = intentEnginePlugin;
        window.papyrSelfHeal = selfHealPlugin;
        window.papyrAccessibilityAdapter = accessibilityAdapterPlugin;
        window.papyrEnergyAdapter = energyAdapterPlugin;

        // Auto-install to default global instance if present
        if (window.papyr && window.papyr.use) {
            window.papyr.use(intentEnginePlugin);
            window.papyr.use(selfHealPlugin);
            window.papyr.use(accessibilityAdapterPlugin);
            window.papyr.use(energyAdapterPlugin);
        }
    }

})(typeof window !== 'undefined' ? window : this);


// --- MODULE: plugins/animate.js ---
/**
 * PAPYR ANIMATE
 * Zero-dependency hardware-accelerated animation engine.
 * v2.0 - Agile Cinematic Motion, Spring systems, and Swipe gestures.
 */
(function() {
    const prefersReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
    
    // Intersection Observer for scroll animations
    let observer = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let anim = entry.target.dataset.animate;
                    if (anim) {
                        entry.target.classList.add(`animate-${anim}`);
                        entry.target.classList.add('animated');
                    }
                    if (entry.target.dataset.animateOnce !== 'false') {
                        observer.unobserve(entry.target);
                    }
                } else if (entry.target.dataset.animateOnce === 'false') {
                    // Reverse animation if scrolling out of view
                    let anim = entry.target.dataset.animate;
                    if (anim) {
                        entry.target.classList.remove(`animate-${anim}`);
                        entry.target.classList.remove('animated');
                    }
                }
            });
        }, { threshold: 0.1 });
    }

    const VALID_ANIMATIONS = ['fade', 'slide', 'zoom', 'blur', 'rotate', 'bounce', 'elastic', 'glass-pop', 'fade-in', 'slide-up', 'slide-down', 'zoom-in', 'blur-in'];
    const levenshtein = (a, b) => {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) == a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
                else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
        return matrix[b.length][a.length];
    };

    let mo = new MutationObserver(mutations => {
        if (prefersReducedMotion) return;
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node instanceof Element) {
                    let elements = [node, ...node.querySelectorAll('[animate]')];
                    elements.forEach(el => {
                        if (el.hasAttribute('animate') && observer) {
                            let animType = el.getAttribute('animate');

                            // Spell check animation
                            if (!VALID_ANIMATIONS.includes(animType)) {
                                let closest = '';
                                let minDistance = Infinity;
                                for (let valid of VALID_ANIMATIONS) {
                                    let d = levenshtein(animType, valid);
                                    if (d < minDistance) {
                                        minDistance = d;
                                        closest = valid;
                                    }
                                }
                                if (minDistance <= 3) {
                                    console.error(`PapyrError: Unknown animation "${animType}". Did you mean "${closest}"?`);
                                    if (papyr.toast) papyr.toast(`PapyrError: Unknown animation "${animType}". Did you mean "${closest}"?`, 'error');
                                }
                            }

                            el.dataset.animate = animType;
                            el.removeAttribute('animate'); // Clean DOM
                            el.classList.add('papyr-animate-base');
                            observer.observe(el);
                        }
                    });
                }
            });
        });
    });
    
    if (typeof document !== 'undefined') {
        mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }

    // --- MODULE: MOTION API ---

    /**
     * Unified animation entry point.
     * Supports papyr.animate(el, properties, duration)
     * and decorator configuration papyr.animate({ type: 'glass-pop' })
     */
    const originalAnimate = papyr.animate;
    papyr.animate = (elOrConfig, properties, duration = 400) => {
        if (!elOrConfig) return null;

        // Config-first mode: papyr.animate({ type: 'glass-pop' })
        if (typeof elOrConfig === 'object' && !(elOrConfig instanceof Element)) {
            const config = elOrConfig;
            return (el) => {
                if (!el) return el;
                if (config.type === 'glass-pop') {
                    el.classList.add('animate-glass-pop');
                    el.classList.add('papyr-animate-base');
                }
                return el;
            };
        }

        // Direct DOM mode
        const el = elOrConfig;
        if (properties && typeof properties === 'object') {
            el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            requestAnimationFrame(() => {
                Object.assign(el.style, properties);
            });
            return el;
        }

        return el;
    };

    // Cinematic transition wrappers
    papyr.animate.fade = (el, duration = 600) => {
        if (!el) return el;
        el.style.opacity = '0';
        el.style.transition = `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.opacity = '1';
            });
        });
        return el;
    };

    papyr.animate.slide = (el, duration = 600) => {
        if (!el) return el;
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1.15)`;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0px)';
            });
        });
        return el;
    };

    papyr.animate.zoom = (el, duration = 600) => {
        if (!el) return el;
        el.style.opacity = '0';
        el.style.transform = 'scale(0.9)';
        el.style.transition = `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1.15)`;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.style.transform = 'scale(1)';
            });
        });
        return el;
    };

    papyr.animate.pop = (el, duration = 600) => {
        if (!el) return el;
        el.style.opacity = '0';
        el.style.transform = 'scale(0.3)';
        el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.style.transform = 'scale(1)';
            });
        });
        return el;
    };

    // Spring physics animator solver
    papyr.animate.spring = (el, properties, config = {}) => {
        if (!el || typeof window === 'undefined') return el;
        const { tension = 170, friction = 26, mass = 1 } = config;
        
        const anims = {};
        Object.entries(properties).forEach(([prop, targetVal]) => {
            let currentVal = parseFloat(el.style[prop]) || 0;
            anims[prop] = {
                current: currentVal,
                velocity: 0,
                target: targetVal
            };
        });

        const step = () => {
            let done = true;
            Object.entries(anims).forEach(([prop, anim]) => {
                let force = -tension * (anim.current - anim.target) - friction * anim.velocity;
                let acceleration = force / mass;
                anim.velocity += acceleration * 0.016; // dt = 16ms
                anim.current += anim.velocity * 0.016;

                if (Math.abs(anim.velocity) > 0.01 || Math.abs(anim.current - anim.target) > 0.01) {
                    done = false;
                } else {
                    anim.current = anim.target;
                }

                if (prop === 'scale') {
                    el.style.transform = `scale(${anim.current})`;
                } else if (['x', 'y'].includes(prop)) {
                    el.style.transform = `translate${prop.toUpperCase()}(${anim.current}px)`;
                } else {
                    el.style[prop] = prop === 'opacity' ? anim.current : `${anim.current}px`;
                }
            });

            if (!done) {
                requestAnimationFrame(step);
            }
        };

        step();
        return el;
    };

    // Gesture swipe controls and dynamic touch trackers
    papyr.animate.gesture = (el, options = {}) => {
        if (!el || typeof window === 'undefined') return el;
        const { onSwipeLeft, onSwipeRight, onDrag } = options;
        let startX = 0, startY = 0, currentX = 0, currentY = 0;
        let isDragging = false;

        const start = (clientX, clientY) => {
            startX = clientX;
            startY = clientY;
            isDragging = true;
            el.style.transition = 'none';
        };

        const move = (clientX, clientY) => {
            if (!isDragging) return;
            currentX = clientX - startX;
            currentY = clientY - startY;
            if (onDrag) onDrag(currentX, currentY, el);
            else {
                el.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        };

        const end = () => {
            if (!isDragging) return;
            isDragging = false;
            el.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            if (currentX > 100 && onSwipeRight) {
                onSwipeRight(el);
            } else if (currentX < -100 && onSwipeLeft) {
                onSwipeLeft(el);
            } else {
                el.style.transform = 'translate(0px, 0px)';
            }
            currentX = 0;
            currentY = 0;
        };

        el.addEventListener('mousedown', (e) => start(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
        window.addEventListener('mouseup', end);

        el.addEventListener('touchstart', (e) => start(e.touches[0].clientX, e.touches[0].clientY));
        el.addEventListener('touchmove', (e) => move(e.touches[0].clientX, e.touches[0].clientY));
        el.addEventListener('touchend', end);

        return el;
    };

    // PAPER PARALLAX ENGINE
    papyr.parallax = (selector, speed = 0.5) => {
        if (typeof window === 'undefined') return;
        window.addEventListener('scroll', () => {
            const elements = document.querySelectorAll(selector);
            let scrollY = window.scrollY;
            elements.forEach(el => {
                let yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    };

    // PAPER PHYSICS ENGINE
    papyr.physics = (options = {}) => {
        const { gravity = 0.98, bounce = 0.8, friction = 0.95 } = options;
        return (el) => {
            if (!el || typeof window === 'undefined') return el;
            
            let y = 0, vy = 0;
            let isDragging = false;
            let animationFrame;

            const update = () => {
                if (!isDragging) {
                    vy += gravity;
                    y += vy;
                    
                    let parentHeight = el.parentElement ? el.parentElement.clientHeight : window.innerHeight;
                    let floor = parentHeight - el.offsetHeight;
                    
                    if (y > floor) {
                        y = floor;
                        vy *= -bounce;
                        vy *= friction;
                    }
                    
                    el.style.transform = `translateY(${y}px)`;
                }
                animationFrame = requestAnimationFrame(update);
            };
            
            el.style.cursor = 'grab';
            el.addEventListener('mousedown', () => {
                isDragging = true;
                el.style.cursor = 'grabbing';
            });
            window.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    el.style.cursor = 'grab';
                    vy = 0;
                }
            });
            window.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    y += e.movementY;
                    el.style.transform = `translateY(${y}px)`;
                }
            });

            setTimeout(() => {
                let initialBounds = el.getBoundingClientRect();
                y = initialBounds.top || 0;
                update();
            }, 50);
            
            return el;
        };
    };

})();


// --- MODULE: plugins/charts.js ---
/**
 * PAPYR CHARTS
 * Zero-dependency HTML5 Canvas charting plugin.
 */
(function() {
    papyr.chart = (config) => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        
        let container = papyr.div('.papyr-chart-container', canvas, Object.assign({
            style: { position: 'relative', width: '100%', height: '300px' }
        }, config.attrs || {}));

        let resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                let rect = entry.contentRect;
                canvas.width = rect.width;
                canvas.height = rect.height;
                renderChart();
            }
        });
        
        let renderChart = () => {
            let width = canvas.width;
            let height = canvas.height;
            if (width === 0 || height === 0) return;
            
            ctx.clearRect(0, 0, width, height);
            
            let type = config.type || 'bar';
            let data = config.data || [];
            let colors = config.colors || ['#6366f1', '#14b8a6', '#f43f5e', '#f59e0b', '#8b5cf6'];
            
            if (type === 'bar') {
                let padding = 40;
                let barWidth = (width - padding * 2) / data.length - 10;
                let maxVal = Math.max(...data.map(d => typeof d === 'object' ? d.value : d));
                
                data.forEach((item, i) => {
                    let val = typeof item === 'object' ? item.value : item;
                    let label = typeof item === 'object' ? item.label : '';
                    let barHeight = (val / maxVal) * (height - padding * 2);
                    let x = padding + i * (barWidth + 10);
                    let y = height - padding - barHeight;
                    
                    ctx.fillStyle = colors[i % colors.length];
                    ctx.beginPath();
                    ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
                    ctx.fill();
                    
                    if (label) {
                        ctx.fillStyle = '#cbd5e1';
                        ctx.font = '12px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(label, x + barWidth / 2, height - padding + 20);
                    }
                });
            } else if (type === 'circle' || type === 'pie') {
                let cx = width / 2;
                let cy = height / 2;
                let radius = Math.min(cx, cy) - 20;
                
                if (type === 'circle') {
                    // Circular Progress
                    let val = typeof config.value === 'function' ? config.value() : (config.value || 0);
                    let max = config.max || 100;
                    let percent = val / max;
                    
                    // Background track
                    ctx.beginPath();
                    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                    ctx.lineWidth = 15;
                    ctx.stroke();
                    
                    // Progress arc
                    ctx.beginPath();
                    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * percent));
                    ctx.strokeStyle = colors[0];
                    ctx.lineCap = 'round';
                    ctx.lineWidth = 15;
                    ctx.stroke();
                    
                    // Text
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 24px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${Math.round(percent * 100)}%`, cx, cy);
                } else if (type === 'pie') {
                    let total = data.reduce((sum, d) => sum + (typeof d === 'object' ? d.value : d), 0);
                    let startAngle = -Math.PI / 2;
                    
                    data.forEach((item, i) => {
                        let val = typeof item === 'object' ? item.value : item;
                        let sliceAngle = (val / total) * Math.PI * 2;
                        
                        ctx.beginPath();
                        ctx.moveTo(cx, cy);
                        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
                        ctx.closePath();
                        
                        ctx.fillStyle = colors[i % colors.length];
                        ctx.fill();
                        
                        startAngle += sliceAngle;
                    });
                }
            } else if (type === 'line') {
                let padding = 40;
                let maxVal = Math.max(...data.map(d => typeof d === 'object' ? d.value : d));
                let stepX = (width - padding * 2) / (data.length - 1 || 1);
                
                ctx.beginPath();
                ctx.strokeStyle = colors[0];
                ctx.lineWidth = 3;
                ctx.lineJoin = 'round';
                
                data.forEach((item, i) => {
                    let val = typeof item === 'object' ? item.value : item;
                    let x = padding + i * stepX;
                    let y = height - padding - ((val / maxVal) * (height - padding * 2));
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.stroke();
            }
        };

        // If config.value or config.data is reactive, subscribe
        if (config.value && typeof config.value.subscribe === 'function') {
            config.value.subscribe(() => {
                requestAnimationFrame(renderChart);
            });
        }
        
        // Initial setup
        setTimeout(() => {
            resizeObserver.observe(container);
            renderChart();
        }, 0);

        return container;
    };
})();


// --- MODULE: plugins/browser-api.js ---
/**
 * PAPYR NATIVE BROWSER APIs
 * Simplifies access to native device hardware and browser APIs.
 */
(function() {
    papyr.clipboard = {
        async copy(text) {
            try {
                await navigator.clipboard.writeText(text);
                papyr.log("Copied to clipboard:", text);
            } catch (err) {
                papyr.warn("Failed to copy to clipboard", err);
            }
        },
        async read() {
            try {
                return await navigator.clipboard.readText();
            } catch (err) {
                papyr.warn("Failed to read from clipboard", err);
                return "";
            }
        }
    };

    papyr.location = {
        get() {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error("Geolocation is not supported by your browser"));
                } else {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                }
            });
        }
    };

    papyr.camera = {
        _stream: null,
        async open(videoElementId = null) {
            try {
                this._stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                if (videoElementId) {
                    const videoEl = document.getElementById(videoElementId);
                    if (videoEl) {
                        videoEl.srcObject = this._stream;
                        videoEl.play();
                    }
                }
                return this._stream;
            } catch (err) {
                papyr.warn("Camera access denied or unavailable", err);
                throw err;
            }
        },
        stop() {
            if (this._stream) {
                this._stream.getTracks().forEach(track => track.stop());
                this._stream = null;
            }
        }
    };

    papyr.vibrate = (pattern) => {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };
})();


// --- MODULE: plugins/pwa.js ---
/**
 * PAPYR PWA ENGINE
 * One-line registration for Progressive Web App Service Workers.
 */
(function() {
    papyr.pwa = {
        async init(swPath = '/sw.js') {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register(swPath);
                    papyr.log('PWA ServiceWorker Registration successful with scope: ', registration.scope);
                } catch (err) {
                    papyr.warn('PWA ServiceWorker registration failed: ', err);
                }
            } else {
                papyr.warn('PWA ServiceWorkers are not supported in this browser.');
            }
        }
    };
})();


// --- MODULE: plugins/design.js ---
/**
 * PAPYR DESIGN ENGINE
 * Advanced, responsive layout and aesthetic helpers.
 */
(function() {
    // Structural layout helpers mapping to flexbox
    papyr.center = (...args) => papyr.div({ style: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' } }, ...args);
    papyr.left = (...args) => papyr.div({ style: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' } }, ...args);
    papyr.right = (...args) => papyr.div({ style: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' } }, ...args);
    papyr.justify = (...args) => papyr.div({ style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' } }, ...args);

    // Aesthetic design helpers
    papyr.glass = (...args) => papyr.div({ 
        style: { 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            borderRadius: '16px'
        } 
    }, ...args);

    // Template Engine stub
    papyr.template = (name) => {
        if (name === 'glass-dashboard') {
            return papyr.div({ style: { display: 'flex', minHeight: '100vh', background: '#0f172a', padding: '20px', gap: '20px' } },
                papyr.glass({ style: { width: '250px', padding: '20px' } }, papyr.h3("Sidebar")),
                papyr.div({ style: { flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' } },
                    papyr.glass({ style: { padding: '20px' } }, papyr.h2("Dashboard Overview")),
                    papyr.div({ style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' } },
                        papyr.glass({ style: { padding: '40px', textAlign: 'center' } }, "Metric 1"),
                        papyr.glass({ style: { padding: '40px', textAlign: 'center' } }, "Metric 2")
                    )
                )
            );
        }
        return papyr.div(`Template ${name} not found.`);
    };
})();


// --- MODULE: plugins/power.js ---
/**
 * PAPYR POWER SYSTEM
 * Energy-Aware, Performance-First state management and rendering throttler.
 * Coordinates user interaction states, page visibility, and loop pacing natively.
 */
(function(window) {
    if (!window.papyr) {
        console.warn("Papyr core not found. Load papyr.js before loading power plugins.");
        return;
    }

    const papyr = window.papyr;

    // 1. Setup reactive power states
    const powerState = papyr.state('active'); // 'active', 'idle', 'suspended'
    const powerFps = papyr.state(60);         // Reactive FPS diagnostic

    let idleTimeout = null;
    const IDLE_DELAY_MS = 10000;              // 10 seconds to trigger idle throttling

    // 2. Activity monitor triggers
    const resetIdleTimer = () => {
        if (powerState.value === 'suspended') return; // Do not wake up if tab is backgrounded
        
        if (powerState.value !== 'active') {
            powerState.value = 'active';
            powerFps.value = 60;
        }

        if (idleTimeout) clearTimeout(idleTimeout);
        idleTimeout = setTimeout(() => {
            if (powerState.value === 'active') {
                powerState.value = 'idle';
                powerFps.value = 10;
            }
        }, IDLE_DELAY_MS);
    };

    // 3. Mount global event listeners safely (with passive: true to prevent frame drops)
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const events = ['mousemove', 'mousedown', 'touchstart', 'keydown', 'scroll'];
        events.forEach(evt => {
            window.addEventListener(evt, resetIdleTimer, { passive: true });
        });

        // Background / Visibility change listeners
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                powerState.value = 'suspended';
                powerFps.value = 0;
                if (idleTimeout) clearTimeout(idleTimeout);
            } else {
                resetIdleTimer();
            }
        });

        // Initialize first idle timer
        resetIdleTimer();
    }

    // 4. Power Engine API Exports
    papyr.power = {
        state: powerState,
        fps: powerFps,
        
        /**
         * Reset the idle timer manually (e.g. during custom script interactions)
         */
        activity() {
            resetIdleTimer();
        },

        /**
         * Wraps an animation loop or heavy computation function.
         * Automatically throttles pacing to conserve CPU, RAM, and battery.
         * 
         * @param {function} callback Rendering loop callback to execute
         * @returns {function} Cleanup hook to completely unsubscribe the loop
         */
        throttle(callback) {
            let active = true;
            
            const tick = () => {
                if (!active) return;

                const currentState = powerState.value;
                if (currentState === 'suspended') {
                    // Suspended completely. Return and wait for visibility change to re-trigger.
                    return;
                }

                if (currentState === 'idle') {
                    // Idle state: Throttle to ~10 FPS (100ms pacing)
                    setTimeout(() => {
                        if (active && powerState.value === 'idle') {
                            callback();
                            requestAnimationFrame(tick);
                        } else if (active) {
                            requestAnimationFrame(tick);
                        }
                    }, 100);
                    return;
                }

                // Active state: Full 60 FPS standard pacing
                callback();
                requestAnimationFrame(tick);
            };

            // Re-trigger loop if transitioning from suspended/idle to active
            const unsubscribe = powerState.subscribe((state) => {
                if (state === 'active' && active) {
                    requestAnimationFrame(tick);
                }
            });

            // Start loop execution
            requestAnimationFrame(tick);

            // Return unsubscribe cleanup hook
            return () => {
                active = false;
                unsubscribe();
            };
        }
    };
})(typeof window !== 'undefined' ? window : this);


// --- MODULE: plugins/particles.js ---
/**
 * PAPYR PARTICLES ENGINE
 * High-performance, zero-dependency HTML5 Canvas Particle System.
 */
(function() {
    papyr.particles = (options = {}) => {
        const { type = 'snow', count = 100, speed = 1, color = '#ffffff' } = options;
        
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none'; // Let clicks pass through
        canvas.style.zIndex = '0';

        let ctx = canvas.getContext('2d');
        let particles = [];
        let width = 0, height = 0;

        const resize = () => {
            // Match parent container size
            let parent = canvas.parentElement || document.body;
            width = parent.clientWidth || window.innerWidth;
            height = parent.clientHeight || window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    r: Math.random() * 2 + 1, // radius
                    d: Math.random() * count, // density
                    vx: (Math.random() - 0.5) * speed,
                    vy: (Math.random() * speed) + (type === 'snow' ? 1 : -1) // Snow falls down, fire/sparks float up
                });
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = color;
            ctx.beginPath();
            
            for (let i = 0; i < count; i++) {
                let p = particles[i];
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
            }
            ctx.fill();
            update();
        };

        const update = () => {
            for (let i = 0; i < count; i++) {
                let p = particles[i];
                p.y += p.vy;
                p.x += p.vx;

                // Wrap around edges
                if (p.x > width + 5 || p.x < -5 || p.y > height) {
                    if (type === 'snow') {
                        // Reset to top
                        particles[i] = { x: Math.random() * width, y: -10, r: p.r, d: p.d, vx: p.vx, vy: p.vy };
                    } else {
                        // Reset to bottom
                        particles[i] = { x: Math.random() * width, y: height + 10, r: p.r, d: p.d, vx: p.vx, vy: p.vy };
                    }
                }
            }
        };

        let stopThrottle = null;

        // Mount hook
        setTimeout(() => {
            resize();
            initParticles();
            window.addEventListener('resize', () => { resize(); initParticles(); });
            
            if (papyr.power && typeof papyr.power.throttle === 'function') {
                stopThrottle = papyr.power.throttle(render);
            } else {
                const legacyLoop = () => {
                    render();
                    requestAnimationFrame(legacyLoop);
                };
                requestAnimationFrame(legacyLoop);
            }
        }, 50);

        return canvas;
    };
})();


// --- MODULE: plugins/ui-components.js ---
/**
 * PAPYR UI COMPONENTS
 * Cinematic, interactive UI elements (Toasts, Modals, Sheets).
 */
(function() {
    // 1. Toast System
    let toastContainer = null;
    papyr.toast = (message, type = 'default') => {
        if (typeof window === 'undefined') return;
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.style.position = 'fixed';
            toastContainer.style.bottom = '20px';
            toastContainer.style.right = '20px';
            toastContainer.style.display = 'flex';
            toastContainer.style.flexDirection = 'column';
            toastContainer.style.gap = '10px';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        let bg = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6';
        let toastEl = document.createElement('div');
        toastEl.innerText = message;
        toastEl.style.background = bg;
        toastEl.style.color = '#fff';
        toastEl.style.padding = '12px 24px';
        toastEl.style.borderRadius = '8px';
        toastEl.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        toastEl.style.fontFamily = 'inherit';
        toastEl.style.fontSize = '14px';
        
        // CSS Transition for entrance
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(20px)';
        toastEl.style.transition = 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';
        
        toastContainer.appendChild(toastEl);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            toastEl.style.opacity = '1';
            toastEl.style.transform = 'translateY(0)';
        });

        // Auto remove
        setTimeout(() => {
            toastEl.style.opacity = '0';
            toastEl.style.transform = 'translateY(10px)';
            setTimeout(() => toastEl.remove(), 300);
        }, 3000);
    };

    // 2. Modal System
    papyr.modal = (options = {}) => {
        const { title = '', content = '', animation = 'glass-pop', onClose } = options;
        
        let overlay = papyr.div({
            style: {
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 9998, opacity: 0, transition: 'opacity 0.3s'
            },
            onclick: (e) => {
                if (e.target === overlay) close();
            }
        });

        let modalBox = papyr.glass({
            style: {
                padding: '24px', width: '90%', maxWidth: '400px',
                transform: animation === 'glass-pop' ? 'scale(0.8)' : 'translateY(50px)',
                transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
            }
        }, 
            papyr.flex.between(
                papyr.h3(title, { style: { margin: 0, color: '#fff' } }),
                papyr.button("×", { 
                    onclick: () => close(),
                    style: { background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }
                })
            ),
            papyr.div({ style: { marginTop: '15px', color: 'var(--text-muted)' } }, content)
        );

        overlay.appendChild(modalBox);
        document.body.appendChild(overlay);

        // Animate In
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modalBox.style.transform = animation === 'glass-pop' ? 'scale(1)' : 'translateY(0)';
        });

        const close = () => {
            overlay.style.opacity = '0';
            modalBox.style.transform = animation === 'glass-pop' ? 'scale(0.8)' : 'translateY(50px)';
            setTimeout(() => {
                overlay.remove();
                if (onClose) onClose();
            }, 300);
        };

        return { close };
    };

    // 3. Mobile Bottom Sheet
    papyr.sheet = (options = {}) => {
        const { content = '' } = options;
        // Re-use modal overlay logic but with bottom-anchored sliding physics
        let overlay = papyr.div({
            style: {
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.5)', zIndex: 9998, opacity: 0, transition: 'opacity 0.3s'
            },
            onclick: (e) => { if (e.target === overlay) close(); }
        });

        let sheetBox = papyr.div({
            style: {
                position: 'absolute', bottom: 0, left: 0, width: '100%',
                background: '#1e293b', borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                padding: '24px', transform: 'translateY(100%)',
                transition: 'transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
            }
        },
            // Drag Handle
            papyr.div({ style: { width: '40px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', margin: '0 auto 20px auto' } }),
            content
        );

        overlay.appendChild(sheetBox);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            sheetBox.style.transform = 'translateY(0)';
        });

        const close = () => {
            overlay.style.opacity = '0';
            sheetBox.style.transform = 'translateY(100%)';
            setTimeout(() => overlay.remove(), 300);
        };
    };
})();


// --- MODULE: plugins/watt.js ---
/**
 * PAPER WATT SYSTEM
 * Web App Tracking Transparency.
 * Intercepts hardware API calls to show branded permission modals before executing.
 * Manages tracking permission prompts, privacy tiers, script blocks, and sandboxes.
 */
(function() {
    // 1. Initialize papyr.watt APIs
    papyr.watt = {
        setTier(tier) {
            if (papyr.security && typeof papyr.security.setTier === 'function') {
                papyr.security.setTier(tier);
            }
        },
        getTier() {
            return papyr.security ? papyr.security.currentTier : 'default';
        },
        hasConsent() {
            return papyr.security ? papyr.security.hasConsent : false;
        },
        requestTracking(options = {}) {
            const { purpose = "We use data to personalize your experience and keep this app free.", onAllow = () => {}, onDeny = () => {} } = options;
            
            const currentTier = this.getTier();
            
            if (currentTier === 'none') {
                if (papyr.security) papyr.security.setConsent(true);
                onAllow();
                return Promise.resolve(true);
            }
            
            if (currentTier === 'high') {
                if (papyr.security) {
                    papyr.security.setConsent(false);
                    papyr.security.blockThirdPartyScripts();
                }
                onDeny();
                return Promise.resolve(false);
            }
            
            return new Promise((resolve) => {
                if (currentTier === 'minimal') {
                    // Render inline banner pill at bottom of page
                    if (typeof document === 'undefined') {
                        onDeny();
                        resolve(false);
                        return;
                    }
                    
                    let banner = papyr.div('.watt-banner-pill',
                        papyr.span(purpose, { style: { fontSize: '0.85rem', color: '#cbd5e1' } }),
                        papyr.flex.row(
                            papyr.button("Opt Out", {
                                style: { background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#fda4af', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
                                onclick: () => {
                                    if (papyr.security) {
                                        papyr.security.setConsent(false);
                                        papyr.security.blockThirdPartyScripts();
                                    }
                                    onDeny();
                                    banner.remove();
                                    resolve(false);
                                }
                            }),
                            papyr.button("Allow", {
                                style: { background: '#14b8a6', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' },
                                onclick: () => {
                                    if (papyr.security) papyr.security.setConsent(true);
                                    onAllow();
                                    banner.remove();
                                    resolve(true);
                                }
                            }),
                            { style: { gap: '8px' } }
                        )
                    );
                    document.body.appendChild(banner);
                } else {
                    // default mode: Pop up beautiful glassmorphic modal
                    if (!papyr.modal) {
                        // Fallback to confirm
                        let ok = confirm(`${purpose}\n\nAllow tracking?`);
                        if (ok) {
                            if (papyr.security) papyr.security.setConsent(true);
                            onAllow();
                            resolve(true);
                        } else {
                            if (papyr.security) {
                                papyr.security.setConsent(false);
                                papyr.security.blockThirdPartyScripts();
                            }
                            onDeny();
                            resolve(false);
                        }
                        return;
                    }
                    
                    let consentModal = papyr.modal({
                        title: "🔒 Data Transparency Request",
                        animation: 'glass-pop',
                        content: papyr.div({ style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
                            papyr.p(purpose, { style: { margin: 0, lineHeight: '1.5', color: '#cbd5e1' } }),
                            papyr.p("WATT Protection Guard: We believe in complete control over your personal data. Denying tracking blocks ad trackers and sandboxes identifiers safely.", { 
                                style: { margin: 0, fontSize: '0.8rem', color: '#64748b' } 
                            }),
                            papyr.flex.row(
                                papyr.button("Ask App Not to Track", {
                                    style: { background: 'rgba(255,255,255,0.05)', color: '#fda4af', border: '1px solid rgba(244,63,94,0.3)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', flex: 1 },
                                    onclick: () => {
                                        consentModal.close();
                                        if (papyr.security) {
                                            papyr.security.setConsent(false);
                                            papyr.security.blockThirdPartyScripts();
                                        }
                                        onDeny();
                                        if (papyr.toast) papyr.toast("Ad tracking blocked securely.", "info");
                                        resolve(false);
                                    }
                                }),
                                papyr.button("Allow Personalization", {
                                    style: { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', flex: 1, fontWeight: 'bold' },
                                    onclick: () => {
                                        consentModal.close();
                                        if (papyr.security) papyr.security.setConsent(true);
                                        onAllow();
                                        if (papyr.toast) papyr.toast("Preferences saved successfully.", "success");
                                        resolve(true);
                                    }
                                }),
                                { style: { gap: '12px', marginTop: '10px' } }
                            )
                        )
                    });
                }
            });
        }
    };

    // 2. Hardware permissions logic
    const requestPermission = (title, reason, iconPath, onAllow) => {
        return new Promise((resolve, reject) => {
            if (!papyr.modal) {
                // Fallback to native confirm if UI components aren't loaded
                let ok = confirm(`${title}\n\n${reason}\n\nAllow access?`);
                if (ok) resolve(onAllow());
                else reject(new Error("Permission denied by user."));
                return;
            }

            let permissionModal = papyr.modal({
                title: title,
                animation: 'glass-pop',
                content: papyr.div({ style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
                    papyr.p(reason, { style: { margin: 0, lineHeight: '1.5' } }),
                    papyr.p("We believe in Data Transparency. This action will trigger a native browser prompt.", { 
                        style: { margin: 0, fontSize: '0.85rem', color: '#94a3b8' } 
                    }),
                    papyr.flex.row(
                        papyr.button("Deny", {
                            style: { background: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', flex: 1 },
                            onclick: () => {
                                permissionModal.close();
                                reject(new Error("Permission denied via WATT."));
                                if (papyr.toast) papyr.toast("Access denied.", "error");
                            }
                        }),
                        papyr.button("Allow Access", {
                            style: { background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', flex: 1, fontWeight: 'bold' },
                            onclick: async () => {
                                permissionModal.close();
                                try {
                                    let result = await onAllow();
                                    resolve(result);
                                } catch (e) {
                                    reject(e);
                                }
                            }
                        }),
                        { style: { gap: '10px', marginTop: '10px' } }
                    )
                )
            });
        });
    };

    // Override camera to add request() if camera API exists
    if (papyr.camera) {
        const originalCameraOpen = papyr.camera.open.bind(papyr.camera);
        papyr.camera.request = (reason, videoElementId = null) => {
            return requestPermission(
                "Camera Access Required",
                reason || "This application requires access to your camera.",
                "camera",
                () => originalCameraOpen(videoElementId)
            );
        };
    }

    // Override location to add request() if location API exists
    if (papyr.location) {
        const originalLocationGet = papyr.location.get.bind(papyr.location);
        papyr.location.request = (reason) => {
            return requestPermission(
                "Location Access Required",
                reason || "This application requires access to your GPS coordinates.",
                "map-pin",
                () => originalLocationGet()
            );
        };
    }

    // Process any initial privacy settings set prior to WATT initialization
    if (papyr._initialPrivacy) {
        papyr.watt.setTier(papyr._initialPrivacy);
        delete papyr._initialPrivacy;
    }
})();


// --- MODULE: plugins/layout.js ---
/**
 * PAPYR LAYOUT ENGINE
 * Structural layout orchestration and zero-conflict responsive workspace management.
 * v2.0 - Collapsible glass sidebars, adaptive layout intelligence, and foldable display panels.
 */
(function() {
    // Glassmorphism panel helper
    papyr.glass = (...args) => {
        return papyr.div({ 
            class: 'papyr-glass-panel',
            style: { 
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
                borderRadius: '16px',
                padding: '20px',
                color: '#f8fafc'
            } 
        }, ...args);
    };

    papyr.layout = {
        /**
         * Responsive Flex Container
         * Automatically adjusts based on screen width CSS variables.
         */
        flex(options = {}, ...children) {
            let config = Object.assign({
                direction: 'var(--papyr-flex-dir, row)',
                wrap: 'var(--papyr-flex-wrap, wrap)',
                justify: 'var(--papyr-flex-justify, flex-start)',
                align: 'var(--papyr-flex-align, stretch)',
                gap: 'var(--papyr-flex-gap, 16px)'
            }, options);

            return papyr.div({
                class: 'papyr-layout-flex',
                style: {
                    display: 'flex',
                    flexDirection: config.direction,
                    flexWrap: config.wrap,
                    justifyContent: config.justify,
                    alignItems: config.align,
                    gap: config.gap,
                    width: '100%'
                }
            }, ...children);
        },

        /**
         * Advanced CSS Grid Container
         */
        grid(options = {}, ...children) {
            let config = Object.assign({
                cols: 'var(--papyr-grid-cols, repeat(auto-fit, minmax(250px, 1fr)))',
                rows: 'var(--papyr-grid-rows, auto)',
                gap: 'var(--papyr-grid-gap, 20px)'
            }, options);

            return papyr.div({
                class: 'papyr-layout-grid',
                style: {
                    display: 'grid',
                    gridTemplateColumns: config.cols,
                    gridTemplateRows: config.rows,
                    gap: config.gap,
                    width: '100%'
                }
            }, ...children);
        },

        /**
         * Semantic Row / Col flex wraps
         */
        row(...children) { return this.flex({ direction: 'row' }, ...children); },
        col(...children) { return this.flex({ direction: 'column' }, ...children); },

        /**
         * Foldable dual-screen screen layout adapter.
         * Auto-splits layout if a fold viewport is detected.
         */
        foldable(options = {}, ...children) {
            const isFolded = typeof window !== 'undefined' && (
                window.matchMedia('(spanning: single-fold-vertical)').matches || 
                window.matchMedia('(spanning: single-fold-horizontal)').matches ||
                window.innerWidth < 900 // Fallback breakpoint for fold simulation
            );

            let config = Object.assign({
                gap: '24px'
            }, options);

            return papyr.div({
                class: 'papyr-foldable-layout',
                style: {
                    display: 'grid',
                    gridTemplateColumns: isFolded ? '1fr' : '1fr 1fr',
                    gap: config.gap,
                    width: '100%'
                }
            }, ...children);
        },

        /**
         * Persistent App Shell / Dashboard Template
         * Supports collapsible sidebars, mobile headers, and custom theme overrides.
         */
        dashboard(options = {}) {
            const { 
                sidebar = null, 
                header = null, 
                main = null, 
                footer = null,
                sidebarWidth = '250px',
                headerHeight = '64px'
            } = options;

            // Reactive state to control menu toggle on mobile viewport sizes
            const sidebarOpen = papyr.state(true);

            let shell = papyr.div({
                class: 'papyr-app-shell',
                style: {
                    display: 'grid',
                    gridTemplateColumns: sidebar ? `${sidebarWidth} 1fr` : '1fr',
                    gridTemplateRows: header ? `${headerHeight} 1fr auto` : '1fr auto',
                    minHeight: '100vh',
                    width: '100%',
                    background: '#070913'
                }
            });

            // Auto-collapse sidebar listener on load for mobile viewports
            if (typeof window !== 'undefined') {
                const checkScreenSize = () => {
                    if (window.innerWidth < 768) {
                        sidebarOpen.value = false;
                    } else {
                        sidebarOpen.value = true;
                    }
                };
                window.addEventListener('resize', checkScreenSize);
                // Run on tick to let element mount
                setTimeout(checkScreenSize, 10);
            }

            if (header) {
                // Header gets a menu toggle button for responsive sidebar collapse
                const menuToggleButton = papyr.button('.menu-toggle', {
                    style: {
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '10px',
                        display: sidebar ? 'inline-block' : 'none'
                    },
                    onclick: () => {
                        sidebarOpen.value = !sidebarOpen.value;
                    }
                }, '☰');

                shell.appendChild(papyr('header', { 
                    class: 'papyr-shell-header',
                    style: { 
                        gridColumn: '1 / -1', 
                        background: 'rgba(16, 22, 42, 0.8)', 
                        backdropFilter: 'blur(12px)',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 20px',
                        gap: '15px',
                        zIndex: 10
                    }
                }, menuToggleButton, header));
            }

            if (sidebar) {
                const asideContainer = papyr('aside', {
                    class: 'papyr-shell-sidebar',
                    style: () => ({
                        gridRow: header ? '2 / -1' : '1 / -1',
                        background: 'rgba(11, 16, 36, 0.95)',
                        borderRight: '1px solid rgba(255,255,255,0.08)',
                        overflowY: 'auto',
                        width: sidebarOpen.value ? sidebarWidth : '0px',
                        minWidth: sidebarOpen.value ? sidebarWidth : '0px',
                        opacity: sidebarOpen.value ? 1 : 0,
                        pointerEvents: sidebarOpen.value ? 'auto' : 'none',
                        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s'
                    })
                }, sidebar);

                shell.appendChild(asideContainer);
            }

            // Main routing and component projection area
            shell.appendChild(papyr('main', {
                class: 'papyr-main-content',
                style: { 
                    padding: '24px', 
                    overflowY: 'auto',
                    position: 'relative',
                    zIndex: 1
                }
            }, main || papyr.div("Main Content Area")));

            if (footer) {
                shell.appendChild(papyr('footer', {
                    class: 'papyr-shell-footer',
                    style: { 
                        gridColumn: sidebar ? '2 / -1' : '1', 
                        background: 'rgba(16, 22, 42, 0.8)', 
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        padding: '12px 20px'
                    }
                }, footer));
            }

            return shell;
        },

        /**
         * Cinematic centered Hero Section template
         * Extremely human-centered and beginner friendly: scaffolds titles, descriptions, action lists, and glass backings instantly.
         */
        hero(options = {}) {
            const {
                title = "Cinematic Experience",
                subtitle = "Crafted beautifully with high performance reactivity",
                actions = [],
                theme = 'primary',
                glass = true,
                padding = '80px 40px'
            } = options;

            const primaryColor = theme === 'teal' ? '#14b8a6' : '#6366f1';
            const secondaryColor = theme === 'teal' ? '#0d9488' : '#4f46e5';

            let heroContent = papyr.flex.col({
                align: 'center',
                style: {
                    textAlign: 'center',
                    maxWidth: '800px',
                    gap: '20px',
                    zIndex: 2,
                    position: 'relative'
                }
            },
                papyr.h1(title, {
                    style: {
                        fontSize: 'var(--papyr-hero-title-size, 3.5rem)',
                        fontWeight: '800',
                        color: 'white',
                        margin: 0,
                        lineHeight: '1.1',
                        letterSpacing: '-0.025em',
                        background: `linear-gradient(135deg, #ffffff 30%, ${primaryColor} 100%)`,
                        webkitBackgroundClip: 'text',
                        webkitTextFillColor: 'transparent',
                        textFillColor: 'transparent'
                    }
                }),
                papyr.p(subtitle, {
                    style: {
                        fontSize: '1.25rem',
                        color: '#94a3b8',
                        margin: 0,
                        lineHeight: '1.6',
                        maxWidth: '600px'
                    }
                })
            );

            if (actions && actions.length > 0) {
                let actionRow = papyr.flex.row({
                    justify: 'center',
                    gap: '12px',
                    style: { marginTop: '10px' }
                });
                actions.forEach(action => {
                    if (action instanceof Element) {
                        actionRow.appendChild(action);
                    } else if (typeof action === 'object') {
                        let btn = papyr.button(action.text || 'Action', Object.assign({
                            style: Object.assign({
                                background: action.primary ? `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` : 'rgba(255,255,255,0.06)',
                                border: action.primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.25s',
                                boxShadow: action.primary ? `0 4px 15px ${primaryColor}40` : 'none'
                            }, action.style || {})
                        }, action.attrs || {}));
                        actionRow.appendChild(btn);
                    }
                });
                heroContent.appendChild(actionRow);
            }

            let containerStyle = {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: padding,
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px'
            };

            if (glass) {
                return papyr.div({
                    class: 'papyr-hero-glass',
                    style: Object.assign(containerStyle, {
                        background: 'rgba(10, 15, 30, 0.4)',
                        backdropFilter: 'blur(20px)',
                        webkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
                    })
                }, heroContent);
            }

            return papyr.div({ style: containerStyle }, heroContent);
        }
    };
})();


// --- MODULE: plugins/immersive.js ---
/**
 * PAPYR 3D / IMMERSIVE ENGINE
 * High-performance, zero-dependency cinematic three-dimensional scene orchestration.
 * v2.0 - Intelligent Three.js bindings, parallax depth, and Canvas2D holographic fallbacks.
 */
(function(window) {
    if (!window.papyr) {
        console.warn("Papyr core not found. Load papyr.js before loading papyr-plugins.");
        return;
    }

    const papyr3d = {
        /**
         * Orchestrates an immersive 3D/holographic backdrop.
         * Detects Three.js globally, otherwise boots a gorgeous, pointer-aware fallback particle environment.
         */
        scene(options = {}, ...children) {
            const config = Object.assign({
                environment: 'space', // 'space', 'cyberpunk', 'underwater'
                particles: true,
                depth: true,
                overlay: null
            }, options);

            const container = papyr.div('.papyr-3d-container', {
                style: {
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    minHeight: '400px',
                    overflow: 'hidden',
                    background: '#04060d',
                    borderRadius: '16px'
                }
            });

            // Create Canvas element
            const canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '0';
            canvas.style.pointerEvents = 'none';
            container.appendChild(canvas);

            // Mount child overlay elements
            if (config.overlay) {
                const overlayWrapper = papyr.div('.papyr-3d-overlay', {
                    style: {
                        position: 'relative',
                        zIndex: '2',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '24px',
                        pointerEvents: 'auto'
                    }
                }, config.overlay);
                container.appendChild(overlayWrapper);
            }

            // Append any additional children inside the container
            children.forEach(child => {
                if (child) {
                    if (child instanceof Element) {
                        child.style.position = 'relative';
                        child.style.zIndex = '2';
                    }
                    container.appendChild(child);
                }
            });

            // Boot renderers after mount paint
            setTimeout(() => {
                const w = container.clientWidth || window.innerWidth;
                const h = container.clientHeight || window.innerHeight;
                canvas.width = w;
                canvas.height = h;

                if (window.THREE) {
                    bootThreeJS(canvas, config);
                } else {
                    bootFallbackCanvas(canvas, config);
                }
            }, 50);

            return container;
        }
    };

    // Helper: Smart Three.js WebGL Orchestrator
    function bootThreeJS(canvas, config) {
        try {
            const w = canvas.width;
            const h = canvas.height;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            camera.position.z = 5;

            // Load environments using lights and particles
            let particlesGeometry;
            if (config.particles) {
                particlesGeometry = new THREE.BufferGeometry();
                const particlesCount = config.environment === 'cyberpunk' ? 400 : 800;
                const posArray = new Float32Array(particlesCount * 3);

                for (let i = 0; i < particlesCount * 3; i++) {
                    posArray[i] = (Math.random() - 0.5) * 10;
                }

                particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

                let particleColor = '#ffffff';
                if (config.environment === 'cyberpunk') particleColor = '#ff007f';
                if (config.environment === 'underwater') particleColor = '#00f0ff';

                const material = new THREE.PointsMaterial({
                    size: 0.02,
                    color: particleColor,
                    transparent: true,
                    opacity: 0.8
                });

                const particlesMesh = new THREE.Points(particlesGeometry, material);
                scene.add(particlesMesh);
            }

            // Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);

            const pointLight = new THREE.PointLight(0x6366f1, 2);
            pointLight.position.set(2, 3, 4);
            scene.add(pointLight);

            // Motion tracker
            let mouseX = 0, mouseY = 0;
            if (config.depth) {
                window.addEventListener('mousemove', (e) => {
                    mouseX = (e.clientX / window.innerWidth) - 0.5;
                    mouseY = (e.clientY / window.innerHeight) - 0.5;
                });
            }

            const clock = new THREE.Clock();
            const tick = () => {
                const elapsedTime = clock.getElapsedTime();

                // Rotate particles mesh based on environment
                if (scene.children[1]) {
                    scene.children[1].rotation.y = elapsedTime * 0.05;
                    if (config.environment === 'underwater') {
                        scene.children[1].rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;
                    }
                }

                // Smooth camera depth panning
                if (config.depth) {
                    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
                    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
                    camera.lookAt(scene.position);
                }

                renderer.render(scene, camera);
                requestAnimationFrame(tick);
            };
            tick();

            // Resize support
            window.addEventListener('resize', () => {
                const parent = canvas.parentElement;
                const newW = parent.clientWidth;
                const newH = parent.clientHeight;
                canvas.width = newW;
                canvas.height = newH;
                camera.aspect = newW / newH;
                camera.updateProjectionMatrix();
                renderer.setSize(newW, newH);
            });
        } catch (e) {
            console.warn("Three.js WebGL context initialization failed, falling back to Canvas2D.", e);
            bootFallbackCanvas(canvas, config);
        }
    }

    // Helper: Ultra-Premium Canvas2D Dynamic Perspective Engine
    function bootFallbackCanvas(canvas, config) {
        const ctx = canvas.getContext('2d');
        let w = canvas.width;
        let h = canvas.height;
        let particles = [];
        let mouseX = 0, mouseY = 0;
        let currentMouseX = 0, currentMouseY = 0;

        // Trace pointer coordinates for micro-smooth inertia panning depth
        if (config.depth) {
            window.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth) - 0.5;
                mouseY = (e.clientY / window.innerHeight) - 0.5;
            });
        }

        // Initialize particles based on environment configuration
        const count = config.environment === 'cyberpunk' ? 120 : 250;
        
        const initParticles = () => {
            particles = [];
            for (let i = 0; i < count; i++) {
                if (config.environment === 'space') {
                    // Space: 3D coordinates (x, y, z) for realistic perspective starfield warp
                    particles.push({
                        x: (Math.random() - 0.5) * w * 2,
                        y: (Math.random() - 0.5) * h * 2,
                        z: Math.random() * w, // depth parameter
                        r: Math.random() * 1.5 + 0.5,
                        color: `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.5})`
                    });
                } else if (config.environment === 'cyberpunk') {
                    // Cyberpunk: Sparks floating up, code blocks, grid coordinate nodes
                    particles.push({
                        x: Math.random() * w,
                        y: Math.random() * h,
                        vy: -(Math.random() * 1.2 + 0.3),
                        vx: (Math.random() - 0.5) * 0.4,
                        r: Math.random() * 2 + 1,
                        color: Math.random() > 0.4 ? 'rgba(255, 0, 127, 0.7)' : 'rgba(0, 240, 255, 0.7)',
                        sparkle: Math.random() > 0.7
                    });
                } else {
                    // Underwater: Bubbles floating upwards with smooth horizontal sine waves
                    particles.push({
                        x: Math.random() * w,
                        y: h + Math.random() * 100,
                        vy: -(Math.random() * 0.8 + 0.4),
                        amplitude: Math.random() * 1.5 + 0.5,
                        frequency: Math.random() * 0.02 + 0.005,
                        phase: Math.random() * Math.PI * 2,
                        r: Math.random() * 3 + 1,
                        opacity: Math.random() * 0.4 + 0.2
                    });
                }
            }
        };
        initParticles();

        // 3D holographic rendering loop
        const draw = () => {
            ctx.clearRect(0, 0, w, h);

            // Interpolate pointer displacement smoothly for camera lag
            currentMouseX += (mouseX - currentMouseX) * 0.05;
            currentMouseY += (mouseY - currentMouseY) * 0.05;

            const camX = currentMouseX * 100;
            const camY = currentMouseY * 100;

            if (config.environment === 'space') {
                // Background deep void space
                const spaceGrad = ctx.createRadialGradient(w/2 - camX, h/2 - camY, 10, w/2, h/2, w);
                spaceGrad.addColorStop(0, '#070a1a');
                spaceGrad.addColorStop(1, '#020308');
                ctx.fillStyle = spaceGrad;
                ctx.fillRect(0, 0, w, h);

                // Draw deep stardust nebula glow
                ctx.fillStyle = 'rgba(99, 102, 241, 0.03)';
                ctx.beginPath();
                ctx.arc(w/2 - camX*0.5, h/2 - camY*0.5, 300, 0, Math.PI * 2);
                ctx.fill();

                // Project 3D coordinate star points
                for (let i = 0; i < count; i++) {
                    const p = particles[i];
                    p.z -= 1.5; // fly forward

                    // Loop back stars that fly past the screen
                    if (p.z <= 0) {
                        p.z = w;
                        p.x = (Math.random() - 0.5) * w * 2;
                        p.y = (Math.random() - 0.5) * h * 2;
                    }

                    // 3D perspective scaling factor
                    const fov = 400;
                    const scale = fov / (fov + p.z);
                    const projX = (p.x - camX) * scale + w / 2;
                    const projY = (p.y - camY) * scale + h / 2;

                    if (projX >= 0 && projX < w && projY >= 0 && projY < h) {
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(projX, projY, p.r * scale * 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            } 
            else if (config.environment === 'cyberpunk') {
                // Cyberpunk: Synthwave neon vector horizon background
                const darkGrad = ctx.createLinearGradient(0, 0, 0, h);
                darkGrad.addColorStop(0, '#090514');
                darkGrad.addColorStop(1, '#030206');
                ctx.fillStyle = darkGrad;
                ctx.fillRect(0, 0, w, h);

                // Draw moving 3D wireframe perspective floor grid
                ctx.strokeStyle = 'rgba(255, 0, 127, 0.07)';
                ctx.lineWidth = 1;
                const gridHorizon = h * 0.55 - camY * 0.3;
                const gridYOffset = (Date.now() * 0.05) % 40;

                // Perspective grid lines crossing horizon
                for (let i = -10; i <= 10; i++) {
                    const lineX = w / 2 + i * 80;
                    ctx.beginPath();
                    ctx.moveTo(w / 2 - camX * 0.8, gridHorizon);
                    ctx.lineTo(lineX - camX * 1.5, h);
                    ctx.stroke();
                }

                // Horizontal moving waves compressing near horizon
                for (let y = gridHorizon; y < h; y += 25) {
                    const progress = (y - gridHorizon) / (h - gridHorizon);
                    // Add scrolling offset
                    let nextY = gridHorizon + progress * (h - gridHorizon) + gridYOffset * progress;
                    if (nextY < h) {
                        ctx.beginPath();
                        ctx.moveTo(0, nextY);
                        ctx.lineTo(w, nextY);
                        ctx.stroke();
                    }
                }

                // Render neon glowing nodes
                for (let i = 0; i < count; i++) {
                    const p = particles[i];
                    p.y += p.vy;
                    p.x += p.vx;

                    if (p.y < 0) {
                        p.y = h;
                        p.x = Math.random() * w;
                    }

                    // Render glows around particles
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x - camX * 0.6, p.y - camY * 0.6, p.r * (p.sparkle ? (Math.sin(Date.now() * 0.01) * 0.4 + 1.2) : 1), 0, Math.PI * 2);
                    ctx.fill();
                }
            } 
            else {
                // Underwater: vertical shafts of light (caustics) and rising organic bubbles
                const waterGrad = ctx.createLinearGradient(0, 0, 0, h);
                waterGrad.addColorStop(0, '#001a33');
                waterGrad.addColorStop(1, '#000812');
                ctx.fillStyle = waterGrad;
                ctx.fillRect(0, 0, w, h);

                // Rotating shifting caustics light shafts
                ctx.fillStyle = 'rgba(0, 240, 255, 0.015)';
                const shaftsCount = 4;
                for (let i = 0; i < shaftsCount; i++) {
                    const offset = Math.sin(Date.now() * 0.0004 + i) * 80;
                    ctx.beginPath();
                    ctx.moveTo(w * 0.2 + i * 200 + offset - camX, 0);
                    ctx.lineTo(w * 0.35 + i * 200 + offset * 1.5 - camX, h);
                    ctx.lineTo(w * 0.15 + i * 200 + offset * 1.2 - camX, h);
                    ctx.closePath();
                    ctx.fill();
                }

                // Draw bubbles
                for (let i = 0; i < count; i++) {
                    const p = particles[i];
                    p.y += p.vy;
                    
                    // Sine wave horizontal drift
                    const angle = p.phase + Date.now() * p.frequency;
                    const shiftX = Math.sin(angle) * p.amplitude;

                    if (p.y < -20) {
                        p.y = h + Math.random() * 50;
                        p.x = Math.random() * w;
                    }

                    // Render hollow translucent bubbles
                    ctx.strokeStyle = `rgba(0, 240, 255, ${p.opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(p.x + shiftX - camX * 0.4, p.y - camY * 0.4, p.r, 0, Math.PI * 2);
                    ctx.stroke();

                    // Bubble highlight
                    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.5})`;
                    ctx.beginPath();
                    ctx.arc(p.x + shiftX - camX * 0.4 - p.r*0.3, p.y - camY * 0.4 - p.r*0.3, p.r * 0.25, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);

        // Resize support
        window.addEventListener('resize', () => {
            const parent = canvas.parentElement;
            if (parent) {
                w = parent.clientWidth;
                h = parent.clientHeight;
                canvas.width = w;
                canvas.height = h;
                initParticles();
            }
        });
    }

    // Attach to namespace
    window.papyr3d = papyr3d;
    window.papyr['3d'] = papyr3d; // both references work cleanly

})(typeof window !== 'undefined' ? window : this);


// --- MODULE: plugins/integrations.js ---
/**
 * PAPYR INTEGRATIONS ENGINE
 * Official native connectors for Express, React, Next.js, Angular, Tailwind, Bootstrap, and AI Agents.
 * v2.0 - Zero-dependency Server-Side Renderer (SSR), fine-grained hook bindings, and AI semantic translation.
 */
(function(window) {
    if (!window.papyr) {
        console.warn("Papyr core not found. Load papyr.js before loading integrations.");
        return;
    }

    const papyr = window.papyr;

    // ==========================================
    // 1. NODE.JS & EXPRESS SERVER-SIDE RENDERING
    // ==========================================
    
    /**
     * Renders standard Papyr DOM elements and nested structures to a pure static HTML string.
     * Supports browser nodes, DocumentFragments, array loops, text nodes, and virtual testing objects.
     */
    papyr.ssr = function ssr(element) {
        if (element === null || element === undefined) return '';
        
        // 1. Primitive values (strings, numbers)
        if (typeof element === 'string' || typeof element === 'number') {
            return String(element);
        }
        
        // 2. Arrays of elements
        if (Array.isArray(element)) {
            return element.map(ssr).join('');
        }
        
        // 3. Text Nodes (native nodeType 3 or virtual structure objects)
        if (element.nodeType === 3 || (element.textContent !== undefined && !element.tagName)) {
            return String(element.textContent || '');
        }

        // 4. DocumentFragments / template contents
        if (element instanceof DocumentFragment || element.tagName === 'TEMPLATE-CONTENT' || (element.children && !element.tagName)) {
            if (element.children && Array.isArray(element.children)) {
                return element.children.map(ssr).join('');
            }
            return '';
        }

        // 5. Native and virtual HTML elements
        let tag = (element.tagName || 'DIV').toLowerCase();
        
        let attrsStr = '';
        if (element.id) {
            attrsStr += ` id="${element.id}"`;
        }
        
        if (element.className) {
            attrsStr += ` class="${element.className}"`;
        }
        
        if (element.style) {
            let styleKeys = Object.keys(element.style);
            if (styleKeys.length > 0) {
                let styleStr = styleKeys.map(k => {
                    let cssKey = k.replace(/([A-Z])/g, '-$1').toLowerCase();
                    return `${cssKey}:${element.style[k]}`;
                }).join(';');
                attrsStr += ` style="${styleStr}"`;
            }
        }

        if (element.dataset) {
            Object.entries(element.dataset).forEach(([k, v]) => {
                attrsStr += ` data-${k.replace(/([A-Z])/g, '-$1').toLowerCase()}="${v}"`;
            });
        }

        // Render other direct primitive properties as HTML attributes (excluding internal variables)
        const ignoredKeys = ['tagName', 'style', 'dataset', 'classList', 'children', 'parentNode', 'listeners', 'className', 'id', 'textContent', 'nodeType', 'innerHTML'];
        Object.entries(element).forEach(([k, v]) => {
            if (!ignoredKeys.includes(k) && typeof v !== 'function' && typeof v !== 'object') {
                attrsStr += ` ${k}="${v}"`;
            }
        });

        // HTML5 self-closing elements
        const selfClosing = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'];
        if (selfClosing.includes(tag)) {
            return `<${tag}${attrsStr} />`;
        }

        // Child components serialization
        let childrenStr = '';
        if (element.children && element.children.length > 0) {
            childrenStr = element.children.map(ssr).join('');
        } else if (element.textContent) {
            childrenStr = String(element.textContent);
        } else if (element.innerHTML) {
            childrenStr = String(element.innerHTML);
        }

        return `<${tag}${attrsStr}>${childrenStr}</${tag}>`;
    };

    /**
     * Express.js custom template rendering engine callback.
     * Integrates with Express configurations: app.engine('papyr', papyr.express())
     */
    papyr.express = function() {
        return function(filePath, options, callback) {
            try {
                // Delete module cache to allow real-time changes in dev
                if (typeof require !== 'undefined' && require.resolve) {
                    delete require.cache[require.resolve(filePath)];
                    const module = require(filePath);
                    
                    let element;
                    if (typeof module === 'function') {
                        element = module(options);
                    } else if (module && typeof module.render === 'function') {
                        element = module.render(options);
                    } else if (module && module.default) {
                        if (typeof module.default === 'function') {
                            element = module.default(options);
                        } else {
                            element = module.default;
                        }
                    } else {
                        element = module;
                    }
                    const html = papyr.ssr(element);
                    return callback(null, html);
                } else {
                    return callback(new Error("SSR Express environment requires Node.js standard require resolver."));
                }
            } catch (e) {
                return callback(e);
            }
        };
    };

    // ==========================================
    // 2. REACT & NEXT.JS BINDINGS
    // ==========================================
    papyr.react = {
        /**
         * Custom React hook: useStore(papyrState)
         * Subscribes to fine-grained papyr state reactivity and triggers React re-renders upon state changes.
         */
        useStore(papyrState) {
            const React = window.React || (typeof require === 'function' ? require('react') : null);
            if (!React) {
                console.warn("React is not loaded globally or locally. useStore returning static state value.");
                return papyrState ? papyrState.value : undefined;
            }
            
            const [val, setVal] = React.useState(papyrState ? papyrState.value : undefined);
            
            React.useEffect(() => {
                if (papyrState && typeof papyrState.subscribe === 'function') {
                    const unsubscribe = papyrState.subscribe(newVal => {
                        setVal(newVal);
                    });
                    return () => {
                        if (typeof unsubscribe === 'function') unsubscribe();
                    };
                }
            }, [papyrState]);
            
            return val;
        },

        /**
         * React Component wrapper: <PapyrElement el={element} />
         * Smoothly mounts a living reactive Papyr element hierarchy inside React/Next.js trees.
         */
        Component({ el, ...props }) {
            const React = window.React || (typeof require === 'function' ? require('react') : null);
            if (!React) {
                console.warn("React is not loaded. React component wrapper cannot render.");
                return null;
            }
            
            const ref = React.useRef(null);
            
            React.useEffect(() => {
                if (ref.current) {
                    ref.current.innerHTML = '';
                    let element = typeof el === 'function' ? el() : el;
                    if (element) {
                        ref.current.appendChild(element);
                    }
                }
            }, [el]);
            
            return React.createElement('div', Object.assign({ ref }, props));
        }
    };

    // ==========================================
    // 3. ANGULAR LIFECYCLE COMPATIBILITY
    // ==========================================
    papyr.angular = {
        /**
         * Directive-level manual mounter.
         * Mounts the reactive component into the given Angular native element lifecycle.
         */
        mount(el, papyrComponent) {
            if (!el) return null;
            el.innerHTML = '';
            const rendered = typeof papyrComponent === 'function' ? papyrComponent() : papyrComponent;
            if (rendered) {
                el.appendChild(rendered);
            }
            return rendered;
        }
    };

    // ==========================================
    // 4. TAILWIND & BOOTSTRAP SHORTCUTS
    // ==========================================
    
    // Tailwind direct wrapper mappers
    papyr.tailwind = (classes, ...children) => {
        papyr.loadFramework('tailwind');
        return papyr.div({ class: classes }, ...children);
    };
    
    ['div','span','button','h1','h2','h3','p','a','input','img'].forEach(tag => {
        papyr.tailwind[tag] = (classes, ...children) => {
            papyr.loadFramework('tailwind');
            return papyr(tag, { class: classes }, ...children);
        };
    });

    // Bootstrap direct wrapper mappers
    papyr.bootstrap = (classes, ...children) => {
        papyr.loadFramework('bootstrap');
        return papyr.div({ class: classes }, ...children);
    };
    
    ['div','span','button','h1','h2','h3','p','a','input','img'].forEach(tag => {
        papyr.bootstrap[tag] = (classes, ...children) => {
            papyr.loadFramework('bootstrap');
            return papyr(tag, { class: classes }, ...children);
        };
    });

    // ==========================================
    // 5. AI-FRIENDLY SEMANTIC STRUCTURES
    // ==========================================
    papyr.ai = {
        /**
         * Compiles any Papyr HTMLElement/node tree into a lightweight, noise-free semantic JSON representation.
         * Designed specifically for LLMs to easily read, manipulate, and generate complex layouts.
         */
        toSemanticJSON(el) {
            if (el === null || el === undefined) return null;
            
            // Simple strings, numbers, or text nodes
            if (typeof el === 'string' || typeof el === 'number') {
                return { tag: 'text', text: String(el) };
            }
            if (el.nodeType === 3 || (el.textContent !== undefined && !el.tagName)) {
                return { tag: 'text', text: String(el.textContent || '') };
            }

            let node = {
                tag: (el.tagName || 'DIV').toLowerCase()
            };

            if (el.id) {
                node.id = el.id;
            }
            
            if (el.className) {
                node.classes = el.className.split(/\s+/).filter(Boolean);
            }

            // Styles
            if (el.style) {
                let styleObj = {};
                let styleKeys = Object.keys(el.style);
                styleKeys.forEach(k => {
                    if (el.style[k]) styleObj[k] = el.style[k];
                });
                if (Object.keys(styleObj).length > 0) {
                    node.style = styleObj;
                }
            }

            // Attributes & dataset mapping
            let attributes = {};
            const ignoredKeys = ['tagName', 'style', 'dataset', 'classList', 'children', 'parentNode', 'listeners', 'className', 'id', 'textContent', 'nodeType', 'innerHTML'];
            Object.entries(el).forEach(([k, v]) => {
                if (!ignoredKeys.includes(k) && typeof v !== 'function' && typeof v !== 'object') {
                    attributes[k] = v;
                }
            });
            if (el.dataset && Object.keys(el.dataset).length > 0) {
                Object.assign(attributes, el.dataset);
            }
            if (Object.keys(attributes).length > 0) {
                node.attributes = attributes;
            }

            // Recursively build children or map text
            if (el.children && el.children.length > 0) {
                node.children = el.children.map(child => papyr.ai.toSemanticJSON(child)).filter(Boolean);
            } else if (el.textContent && el.textContent.trim()) {
                node.text = el.textContent.trim();
            }

            return node;
        },

        /**
         * Re-compiles a clean semantic JSON structure directly back into fully-functional interactive DOM nodes.
         */
        fromSemanticJSON(json) {
            if (!json) return null;
            if (typeof json === 'string') {
                return document.createTextNode(json);
            }
            if (json.tag === 'text') {
                return document.createTextNode(json.text || '');
            }

            const args = [];
            
            // Build class and ID selectors
            let selector = '';
            if (json.id) {
                selector += `#${json.id}`;
            }
            if (json.classes) {
                let classesList = Array.isArray(json.classes) ? json.classes : json.classes.split(/\s+/).filter(Boolean);
                classesList.forEach(cls => {
                    selector += `.${cls}`;
                });
            }
            if (selector) {
                args.push(selector);
            }

            // Build style and custom attributes options
            const options = {};
            if (json.style) {
                options.style = json.style;
            }
            if (json.attributes) {
                Object.assign(options, json.attributes);
            }
            if (Object.keys(options).length > 0) {
                args.push(options);
            }

            // Text
            if (json.text) {
                args.push(json.text);
            }
            
            // Render and append children elements
            if (json.children && Array.isArray(json.children)) {
                json.children.forEach(childJson => {
                    const childEl = papyr.ai.fromSemanticJSON(childJson);
                    if (childEl) {
                        args.push(childEl);
                    }
                });
            }

            return papyr(json.tag || 'div', ...args);
        }
    };

})(typeof window !== 'undefined' ? window : this);


// --- MODULE: plugins/system.js ---
/**
 * PAPYR SYSTEM & SANDBOX ACCESS ENGINE
 * Unified, zero-dependency sandboxed interface for File System, Clipboard, notifications, Bluetooth, and WebUSB.
 * v2.0 - Modern showOpenFilePicker wrappers, local download fallbacks, and OS system integrations.
 */
(function(window) {
    if (!window.papyr) {
        console.warn("Papyr core not found. Load papyr.js before loading system plugins.");
        return;
    }

    const papyr = window.papyr;

    // ==========================================
    // 1. FILE SYSTEM SANDBOX ACCESS (papyr.fs)
    // ==========================================
    papyr.fs = {
        /**
         * Open a sandboxed file from the user's system.
         * Leverages high-performance showOpenFilePicker if supported, falling back gracefully to transient inputs.
         */
        open(options = {}) {
            const config = Object.assign({
                multiple: false,
                acceptText: false,
                types: []
            }, options);

            return new Promise((resolve, reject) => {
                // If modern File System Access API is supported
                if (typeof window !== 'undefined' && window.showOpenFilePicker) {
                    window.showOpenFilePicker({
                        multiple: config.multiple,
                        types: config.types
                    }).then(handles => {
                        const filesPromises = handles.map(h => h.getFile());
                        Promise.all(filesPromises).then(files => {
                            if (config.acceptText) {
                                const textPromises = files.map(f => f.text());
                                Promise.all(textPromises).then(texts => {
                                    resolve(config.multiple ? texts : texts[0]);
                                }).catch(reject);
                            } else {
                                resolve(config.multiple ? files : files[0]);
                            }
                        }).catch(reject);
                    }).catch(reject);
                } else {
                    // Fallback to transient input element
                    if (typeof document === 'undefined') {
                        return reject(new Error("DOM document required for file dialog fallback."));
                    }
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = config.multiple;
                    
                    input.onchange = () => {
                        if (!input.files || input.files.length === 0) {
                            return reject(new Error("No files selected."));
                        }
                        const files = Array.from(input.files);
                        if (config.acceptText) {
                            const readerPromises = files.map(file => {
                                return new Promise((res, rej) => {
                                    const reader = new FileReader();
                                    reader.onload = () => res(reader.result);
                                    reader.onerror = () => rej(reader.error);
                                    reader.readAsText(file);
                                });
                            });
                            Promise.all(readerPromises).then(texts => {
                                resolve(config.multiple ? texts : texts[0]);
                            }).catch(reject);
                        } else {
                            resolve(config.multiple ? files : files[0]);
                        }
                    };
                    input.click();
                }
            });
        },

        /**
         * Saves string or blob contents by triggering a secure local browser download.
         */
        save(content, filename = 'document.txt', type = 'text/plain') {
            if (typeof window === 'undefined' || typeof document === 'undefined') {
                console.log(`[papyr.fs.save] Non-browser context saving: ${filename} (${type})`);
                return Promise.resolve(content);
            }

            try {
                const blob = content instanceof Blob ? content : new Blob([content], { type: type });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                
                // Cleanup
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
                
                return Promise.resolve(filename);
            } catch (e) {
                return Promise.reject(e);
            }
        }
    };

    // ==========================================
    // 2. SYSTEM OS INTERACTIONS (papyr.system)
    // ==========================================
    papyr.system = {
        /**
         * Issues native OS system notifications with permissions checks.
         */
        notify(title, options = {}) {
            if (typeof window === 'undefined' || !('Notification' in window)) {
                console.log(`[papyr.system.notify] ${title}: ${options.body || ''}`);
                return Promise.resolve(false);
            }

            const config = Object.assign({
                body: '',
                icon: ''
            }, options);

            return new Promise((resolve) => {
                if (Notification.permission === 'granted') {
                    new Notification(title, config);
                    resolve(true);
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification(title, config);
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
                } else {
                    resolve(false);
                }
            });
        },

        // Unified System Clipboard Wrapper
        clipboard: {
            copy(text) {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    return navigator.clipboard.writeText(text);
                }
                return Promise.reject(new Error("Navigator Clipboard API not supported."));
            },
            paste() {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    return navigator.clipboard.readText();
                }
                return Promise.reject(new Error("Navigator Clipboard API not supported."));
            }
        },

        // Unified Sandbox Hardware Connectors
        devices: {
            bluetooth() {
                if (typeof navigator !== 'undefined' && navigator.bluetooth) {
                    return navigator.bluetooth.getAvailability();
                }
                return Promise.resolve(false);
            },
            usb() {
                if (typeof navigator !== 'undefined' && navigator.usb) {
                    return navigator.usb.getDevices();
                }
                return Promise.resolve([]);
            }
        }
    };

})(typeof window !== 'undefined' ? window : this);


// --- MODULE: plugins/ml.js ---
/**
 * PAPYR MACHINE LEARNING ENGINE
 * Browser-native machine learning abstraction with zero-dependency fallbacks.
 * v2.0 - Built-in training solvers (perceptrons), alongside smart TensorFlow.js and ONNX model wrappers.
 */
(function(window) {
    if (!window.papyr) {
        console.warn("Papyr core not found. Load papyr.js before loading ml plugins.");
        return;
    }

    const papyr = window.papyr;

    // Simple built-in Perceptron/Neural Classifier for zero-dependency client training
    class SimpleClassifier {
        constructor() {
            this.weights = [];
            this.bias = 0;
            this.trained = false;
        }

        train(inputs, outputs, lr = 0.1, epochs = 200) {
            if (inputs.length === 0) return;
            const inputDim = inputs[0].length;
            this.weights = new Array(inputDim).fill(0).map(() => Math.random() * 2 - 1);
            this.bias = Math.random() * 2 - 1;

            for (let e = 0; e < epochs; e++) {
                for (let i = 0; i < inputs.length; i++) {
                    const x = inputs[i];
                    const target = outputs[i];
                    
                    // Feedforward activation (using tanh activation function)
                    let sum = this.bias;
                    for (let d = 0; d < inputDim; d++) {
                        sum += x[d] * this.weights[d];
                    }
                    const prediction = Math.tanh(sum);

                    // Backpropagation gradient delta calculations
                    const error = target - prediction;
                    const gradient = error * (1 - prediction * prediction); // tanh derivative
                    
                    // Adjust weights & bias
                    for (let d = 0; d < inputDim; d++) {
                        this.weights[d] += lr * gradient * x[d];
                    }
                    this.bias += lr * gradient;
                }
            }
            this.trained = true;
        }

        predict(input) {
            if (!this.trained) return 0;
            let sum = this.bias;
            for (let d = 0; d < input.length; d++) {
                sum += input[d] * (this.weights[d] || 0);
            }
            return Math.tanh(sum);
        }
    }

    const activeClassifier = new SimpleClassifier();

    papyr.ml = {
        /**
         * Trains the built-in lightweight classifier.
         * Useful for quick statistical predictions without heavy libraries.
         */
        train(data = {}, options = {}) {
            const { inputs = [], outputs = [] } = data;
            const { learningRate = 0.1, epochs = 250 } = options;

            if (inputs.length === 0 || outputs.length === 0) {
                console.warn("Papyr ML: Missing inputs/outputs training datasets.");
                return false;
            }

            activeClassifier.train(inputs, outputs, learningRate, epochs);
            return true;
        },

        /**
         * Infers predictions on trained datasets or routes to TensorFlow.js models if present.
         */
        predict(options = {}) {
            const { model = 'local', input = null } = options;

            if (input === null) {
                return Promise.reject(new Error("Input dataset is required for classification predictions."));
            }

            // TensorFlow.js integration
            if (window.tf) {
                return new Promise((resolve, reject) => {
                    try {
                        if (typeof model === 'string' && model.startsWith('http')) {
                            // Load web model dynamic wrap
                            window.tf.loadLayersModel(model).then(loadedModel => {
                                const tensor = window.tf.browser.fromPixels(input).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
                                const prediction = loadedModel.predict(tensor);
                                prediction.data().then(data => {
                                    resolve(Array.from(data));
                                }).catch(reject);
                            }).catch(reject);
                        } else if (model === 'image-classifier' && window.cocoSsd) {
                            // If object detection model is loaded
                            window.cocoSsd.load().then(loadedModel => {
                                loadedModel.detect(input).then(resolve).catch(reject);
                            }).catch(reject);
                        } else {
                            // Local tfjs custom operations
                            const tensor = window.tf.tensor(input);
                            const result = tensor.sum();
                            result.data().then(data => resolve(data[0])).catch(reject);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
            }

            // Pure-JS statistical fallback inference
            if (Array.isArray(input)) {
                if (!activeClassifier.trained) {
                    return Promise.reject(new Error("Model Prediction Error: The classifier perceptron engine has not been trained yet. Call papyr.ml.train() first."));
                }
                return Promise.resolve(activeClassifier.predict(input));
            }

            // Reject image element parsing when tfjs is absent (prevents static mock representations)
            if (input instanceof HTMLElement || (input && input.tagName && ['IMG', 'CANVAS'].includes(input.tagName))) {
                return Promise.reject(new Error("Missing Dependency Error: TensorFlow.js (window.tf) or coco-ssd is required to perform real image classification natively."));
            }

            return Promise.reject(new Error("Input Type Error: Inputs to the perceptron engine must be a numeric array. Image inputs require TensorFlow.js."));
        }
    };

})(typeof window !== 'undefined' ? window : this);


// --- MODULE: plugins/ocr.js ---
/**
 * PAPYR OCR & VOICE EXTRACTOR
 * Browser-native optical character scanning, speech synthesis, and voice recognition wrappers.
 * v2.0 - Intelligent Tesseract.js wraps, native speech synthesis bindings, and web speech helpers.
 */
(function(window) {
    if (!window.papyr) {
        console.warn("Papyr core not found. Load papyr.js before loading OCR plugins.");
        return;
    }

    const papyr = window.papyr;

    papyr.ocr = {
        /**
         * Scans image elements for characters and text.
         * Auto-upgrades to Tesseract.js if available globally, falling back to a DOM-attribute meta-extractor.
         */
        scan(image, options = {}) {
            if (!image) {
                return Promise.reject(new Error("Image element or source URL is required for OCR scanning."));
            }

            const config = Object.assign({
                lang: 'eng',
                logger: null
            }, options);

            // Tesseract.js integration
            if (window.Tesseract) {
                return new Promise((resolve, reject) => {
                    window.Tesseract.recognize(image, config.lang, {
                        logger: config.logger
                    }).then(({ data: { text } }) => {
                        resolve(text);
                    }).catch(reject);
                });
            }

            // High-fidelity fallback scanner: extract real DOM alternate parameters
            if (image instanceof HTMLElement) {
                if (image.alt) {
                    return Promise.resolve(image.alt);
                }
                if (image.dataset && image.dataset.ocrText) {
                    return Promise.resolve(image.dataset.ocrText);
                }
            }

            return Promise.reject(new Error("Missing Dependency Error: Tesseract.js is required to perform live optical character recognition on this image."));
        },

        /**
         * System Speech Synthesis (TTS).
         * Speaks aloud any text string using native Web Speech Synthesis API.
         */
        speak(text, options = {}) {
            if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
                console.log(`[papyr.ocr.speak] TTS speak: ${text}`);
                return false;
            }

            const config = Object.assign({
                pitch: 1.0,
                rate: 1.0,
                volume: 1.0,
                lang: 'en-US'
            }, options);

            try {
                window.speechSynthesis.cancel(); // Cancel active queues
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.pitch = config.pitch;
                utterance.rate = config.rate;
                utterance.volume = config.volume;
                utterance.lang = config.lang;
                window.speechSynthesis.speak(utterance);
                return true;
            } catch (err) {
                console.error("Speech synthesis failed:", err);
                return false;
            }
        },

        /**
         * Web Speech Recognition (Speech-to-Text).
         * Listens to the microphone and returns recognized text strings.
         */
        listen(options = {}) {
            const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
            
            if (!SpeechRecognition) {
                return Promise.reject(new Error("Speech Recognition API is not supported in this browser."));
            }

            const config = Object.assign({
                continuous: false,
                interimResults: false,
                lang: 'en-US'
            }, options);

            return new Promise((resolve, reject) => {
                try {
                    const recognition = new SpeechRecognition();
                    recognition.continuous = config.continuous;
                    recognition.interimResults = config.interimResults;
                    recognition.lang = config.lang;

                    recognition.onresult = (event) => {
                        const transcript = event.results[0][0].transcript;
                        resolve(transcript);
                    };

                    recognition.onerror = (event) => {
                        reject(new Error(`Speech recognition error: ${event.error}`));
                    };

                    recognition.start();
                } catch (err) {
                    reject(err);
                }
            });
        }
    };

})(typeof window !== 'undefined' ? window : this);


// --- MODULE: plugins/physics.js ---
/**
 * PAPYR RIGID 2D PHYSICS SIMULATOR
 * Modern, high-performance physical simulation engine with zero-dependency Verlet fallbacks.
 * v2.0 - Multibody Verlet collisions, elastic bounce solvers, mouse drag tracking, and Matter.js auto-upgraders.
 */
(function(window) {
    if (!window.papyr) {
        console.warn("Papyr core not found. Load papyr.js before loading physics plugins.");
        return;
    }

    const papyr = window.papyr;

    // Advanced Zero-Dependency 2D Verlet Integration Collision Solver
    class VerletWorld {
        constructor(canvas, options = {}) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.gravity = options.gravity !== undefined ? options.gravity : 0.5;
            this.friction = options.friction !== undefined ? options.friction : 0.99;
            this.bodies = [];
            this.running = false;
            this.draggedBody = null;
            this.mouseX = 0;
            this.mouseY = 0;

            this.setupInteraction();
        }

        addBody(x, y, radius, options = {}) {
            const body = {
                x: x,
                y: y,
                px: x - (options.vx || 0), // previous x
                py: y - (options.vy || 0), // previous y
                r: radius,
                mass: radius,
                color: options.color || '#6366f1',
                elasticity: options.elasticity !== undefined ? options.elasticity : 0.75,
                isStatic: options.isStatic || false
            };
            this.bodies.push(body);
            return body;
        }

        setupInteraction() {
            if (typeof window === 'undefined') return;
            
            const getPos = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                return {
                    x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
                    y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
                };
            };

            this.canvas.addEventListener('mousedown', (e) => {
                const pos = getPos(e);
                this.mouseX = pos.x;
                this.mouseY = pos.y;
                
                // Find body under cursor
                for (let b of this.bodies) {
                    if (b.isStatic) continue;
                    const dist = Math.hypot(b.x - pos.x, b.y - pos.y);
                    if (dist < b.r * 1.5) {
                        this.draggedBody = b;
                        break;
                    }
                }
            });

            window.addEventListener('mousemove', (e) => {
                const pos = getPos(e);
                this.mouseX = pos.x;
                this.mouseY = pos.y;
                if (this.draggedBody) {
                    this.draggedBody.x = pos.x;
                    this.draggedBody.y = pos.y;
                }
            });

            window.addEventListener('mouseup', () => {
                this.draggedBody = null;
            });
        }

        start() {
            if (this.running) return;
            this.running = true;
            
            const loop = () => {
                this.update();
                this.render();
            };
            
            if (papyr.power && typeof papyr.power.throttle === 'function') {
                this.stopThrottle = papyr.power.throttle(loop);
            } else {
                const legacyLoop = () => {
                    if (!this.running) return;
                    loop();
                    requestAnimationFrame(legacyLoop);
                };
                requestAnimationFrame(legacyLoop);
            }
        }

        stop() {
            this.running = false;
            if (this.stopThrottle) {
                this.stopThrottle();
                this.stopThrottle = null;
            }
        }

        update() {
            const w = this.canvas.width;
            const h = this.canvas.height;

            // 1. Verlet Integration movement solver
            for (let b of this.bodies) {
                if (b.isStatic || b === this.draggedBody) continue;

                const vx = (b.x - b.px) * this.friction;
                const vy = (b.y - b.py) * this.friction;

                b.px = b.x;
                b.py = b.y;

                b.x += vx;
                b.y += vy + this.gravity; // Gravity vector
            }

            // 2. Multibody sphere collision solvers
            for (let i = 0; i < this.bodies.length; i++) {
                for (let j = i + 1; j < this.bodies.length; j++) {
                    const b1 = this.bodies[i];
                    const b2 = this.bodies[j];

                    const dx = b2.x - b1.x;
                    const dy = b2.y - b1.y;
                    const dist = Math.hypot(dx, dy);
                    const minDist = b1.r + b2.r;

                    if (dist < minDist) {
                        const overlap = minDist - dist;
                        const nx = dx / dist;
                        const ny = dy / dist;

                        // Separate overlapping nodes based on mass
                        if (!b1.isStatic) {
                            b1.x -= nx * overlap * 0.5;
                            b1.y -= ny * overlap * 0.5;
                        }
                        if (!b2.isStatic) {
                            b2.x += nx * overlap * 0.5;
                            b2.y += ny * overlap * 0.5;
                        }

                        // Elastic rebound calculation
                        const kx = b1.x - b1.px - (b2.x - b2.px);
                        const ky = b1.y - b1.py - (b2.y - b2.py);
                        const m = b1.mass + b2.mass;

                        if (!b1.isStatic) {
                            b1.px += kx * (b2.mass / m) * b1.elasticity;
                            b1.py += ky * (b2.mass / m) * b1.elasticity;
                        }
                        if (!b2.isStatic) {
                            b2.px -= kx * (b1.mass / m) * b2.elasticity;
                            b2.py -= ky * (b1.mass / m) * b2.elasticity;
                        }
                    }
                }
            }

            // 3. Boundary collision limits
            for (let b of this.bodies) {
                if (b.isStatic || b === this.draggedBody) continue;

                const vx = b.x - b.px;
                const vy = b.y - b.py;

                // Floor collision
                if (b.y > h - b.r) {
                    b.y = h - b.r;
                    b.py = b.y + vy * b.elasticity;
                }
                // Ceiling collision
                if (b.y < b.r) {
                    b.y = b.r;
                    b.py = b.y + vy * b.elasticity;
                }
                // Right border
                if (b.x > w - b.r) {
                    b.x = w - b.r;
                    b.px = b.x + vx * b.elasticity;
                }
                // Left border
                if (b.x < b.r) {
                    b.x = b.r;
                    b.px = b.x + vx * b.elasticity;
                }
            }
        }

        render() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw rigid bodies
            for (let b of this.bodies) {
                this.ctx.fillStyle = b.color;
                this.ctx.beginPath();
                this.ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                this.ctx.fill();

                // Sleek specular lighting effect
                this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
                this.ctx.beginPath();
                this.ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Draw drag lines
            if (this.draggedBody) {
                this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(this.draggedBody.x, this.draggedBody.y);
                this.ctx.lineTo(this.mouseX, this.mouseY);
                this.ctx.stroke();
            }
        }
    }

    papyr.physics = {
        /**
         * Creates a dynamic physics orchestration layer inside a canvas element.
         * Auto-upgrades to Matter.js if loaded globally, otherwise boots our high-performance Verlet engine.
         */
        world(options = {}) {
            const container = papyr.div('.papyr-physics-wrapper', {
                style: {
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    minHeight: '350px',
                    background: '#04060d',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)'
                }
            });

            const canvas = document.createElement('canvas');
            canvas.style.display = 'block';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            container.appendChild(canvas);

            // Setup sizes after painting
            setTimeout(() => {
                const w = container.clientWidth || 600;
                const h = container.clientHeight || 350;
                canvas.width = w;
                canvas.height = h;

                // Matter.js Integration
                if (window.Matter) {
                    try {
                        const Engine = window.Matter.Engine;
                        const Render = window.Matter.Render;
                        const Runner = window.Matter.Runner;
                        const Bodies = window.Matter.Bodies;
                        const Composite = window.Matter.Composite;

                        const engine = Engine.create({ gravity: { y: options.gravity || 1 } });
                        const render = Render.create({
                            canvas: canvas,
                            engine: engine,
                            options: {
                                width: w,
                                height: h,
                                wireframes: false,
                                background: '#04060d'
                            }
                        });

                        Render.run(render);
                        const runner = Runner.create();
                        Runner.run(runner, engine);

                        // Bound borders
                        const ground = Bodies.rectangle(w/2, h + 30, w, 60, { isStatic: true });
                        const leftWall = Bodies.rectangle(-30, h/2, 60, h, { isStatic: true });
                        const rightWall = Bodies.rectangle(w + 30, h/2, 60, h, { isStatic: true });
                        Composite.add(engine.world, [ground, leftWall, rightWall]);

                        // Add some dynamic items
                        for (let i = 0; i < 8; i++) {
                            const radius = Math.random() * 20 + 15;
                            const circle = Bodies.circle(Math.random() * w, 50, radius, {
                                restitution: 0.8,
                                render: { fillStyle: i % 2 === 0 ? '#6366f1' : '#14b8a6' }
                            });
                            Composite.add(engine.world, circle);
                        }
                    } catch (e) {
                        console.warn("Matter.js loading failed, falling back to Verlet engine.", e);
                        bootVerlet(canvas, options);
                    }
                } else {
                    bootVerlet(canvas, options);
                }
            }, 50);

            function bootVerlet(cv, opt) {
                const world = new VerletWorld(cv, opt);
                
                // Add initial bouncing rigid bodies
                world.addBody(100, 100, 24, { vx: 2, vy: 0, color: '#6366f1' });
                world.addBody(200, 80, 18, { vx: -3, vy: 0, color: '#14b8a6' });
                world.addBody(300, 150, 30, { vx: 1, vy: -2, color: '#ff007f' });
                world.addBody(400, 120, 20, { vx: 0, vy: 0, color: '#00f0ff' });

                world.start();
                container._verletWorld = world; // attach reference for developer inspections
            }

            return container;
        }
    };

})(typeof window !== 'undefined' ? window : this);


// --- MODULE: plugins/ai.js ---
/**
 * PAPYR AI PLATFORM GATEWAY & PROMPT OPTIMIZER
 * Unified, zero-dependency connector for OpenAI, Anthropic, Gemini, and local Ollama models.
 * v2.0 - Prompts template managers, semantic DOM token-minimizer serialization, and offline simulator fallbacks.
 */
(function(window) {
    if (!window.papyr) {
        console.warn("Papyr core not found. Load papyr.js before loading AI plugins.");
        return;
    }

    const papyr = window.papyr;

    papyr.ai = {
        /**
         * Reusable prompt templates with simple curly-braces variable interpolation.
         * Usage: papyr.ai.prompt("Hello {{name}}!", { name: "World" }) => "Hello World!"
         */
        prompt(template, variables = {}) {
            if (typeof template !== 'string') return '';
            return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
                return variables[key] !== undefined ? String(variables[key]) : match;
            });
        },

        /**
         * Semantic DOM JSON minimizer.
         * Traverses the element and extracts key content structures to minimize token footprints.
         */
        toSemanticJSON(el) {
            if (typeof document === 'undefined') {
                return { status: "non-browser-node", info: "Document undefined in non-browser context" };
            }
            const element = typeof el === 'string' ? document.querySelector(el) : el;
            if (!element) return null;

            function extract(node) {
                if (node.nodeType === 3) { // Text Node
                    const txt = node.textContent.trim();
                    return txt ? txt : null;
                }
                if (node.nodeType !== 1) return null; // Not an Element

                const data = {
                    tag: node.tagName.toLowerCase(),
                };

                // Capture essential semantic identifiers
                if (node.id) data.id = node.id;
                if (node.className) data.class = node.className;
                if (node.type) data.type = node.type;
                if (node.value) data.value = node.value;
                if (node.name) data.name = node.name;
                if (node.placeholder) data.placeholder = node.placeholder;
                
                // Expose dataset configurations
                const ds = Object.keys(node.dataset || {});
                if (ds.length > 0) {
                    data.dataset = {};
                    ds.forEach(k => {
                        data.dataset[k] = node.dataset[k];
                    });
                }

                // Recurse children nodes
                const children = [];
                node.childNodes.forEach(child => {
                    const res = extract(child);
                    if (res) {
                        if (typeof res === 'string') {
                            if (!data.text) data.text = '';
                            data.text = (data.text + ' ' + res).trim();
                        } else {
                            children.push(res);
                        }
                    }
                });

                if (children.length > 0) {
                    data.children = children;
                }

                return data;
            }

            return extract(element);
        },

        /**
         * Unified AI Provider interface mapping OpenAI, Anthropic, Gemini, and Ollama endpoints.
         * Enforces strict real-world connections, API key validations, and secure data privacy protocols.
         */
        chat(options = {}) {
            const provider = (options.provider || 'openai').toLowerCase();
            const apiKey = options.apiKey || '';
            const messages = options.messages || [];
            const model = options.model;
            
            const isLocal = provider === 'ollama';
            
            if (!isLocal && !apiKey) {
                return Promise.reject(new Error(`Security Validation Error: A secure API key is required to initiate real-world chat completions with provider '${provider}'.`));
            }

            const hasFetch = typeof fetch !== 'undefined';
            if (!hasFetch) {
                return Promise.reject(new Error("Environment Error: global fetch() API is required to communicate with AI endpoints."));
            }

            // Real integration logic
            let url = options.endpoint || '';
            let headers = {
                'Content-Type': 'application/json'
            };
            let body = {};

            if (provider === 'openai') {
                url = url || 'https://api.openai.com/v1/chat/completions';
                headers['Authorization'] = `Bearer ${apiKey}`;
                body = {
                    model: model || 'gpt-4o-mini',
                    messages: messages
                };
            } else if (provider === 'anthropic') {
                url = url || 'https://api.anthropic.com/v1/messages';
                headers['x-api-key'] = apiKey;
                headers['anthropic-version'] = '2023-06-01';
                body = {
                    model: model || 'claude-3-5-sonnet-20241022',
                    messages: messages.filter(m => m.role !== 'system'),
                    max_tokens: 1024
                };
                const systemMsg = messages.find(m => m.role === 'system');
                if (systemMsg) {
                    body.system = systemMsg.content;
                }
            } else if (provider === 'gemini') {
                const gemModel = model || 'gemini-2.5-flash';
                url = url || `https://generativelanguage.googleapis.com/v1beta/models/${gemModel}:generateContent?key=${apiKey}`;
                
                const contents = messages.filter(m => m.role !== 'system').map(m => {
                    return {
                        role: m.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: m.content }]
                    };
                });
                
                body = { contents: contents };
                
                const systemMsg = messages.find(m => m.role === 'system');
                if (systemMsg) {
                    body.systemInstruction = {
                        parts: [{ text: systemMsg.content }]
                    };
                }
            } else if (provider === 'ollama') {
                url = url || 'http://localhost:11434/api/chat';
                body = {
                    model: model || 'llama3',
                    messages: messages,
                    stream: false
                };
            }

            return fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`API error: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                let parsedText = '';
                if (provider === 'openai' || provider === 'ollama') {
                    parsedText = data.choices ? data.choices[0].message.content : (data.message ? data.message.content : '');
                } else if (provider === 'anthropic') {
                    parsedText = data.content ? data.content[0].text : '';
                } else if (provider === 'gemini') {
                    parsedText = (data.candidates && data.candidates[0].content) ? data.candidates[0].content.parts[0].text : '';
                }
                return {
                    text: parsedText,
                    provider: provider,
                    simulated: false,
                    raw: data
                };
            });
        }
    };
})(typeof window !== 'undefined' ? window : this);


// --- MODULE: plugins/pdf.js ---
/**
 * PAPYR DOCUMENT & CANVAS EXPORTER (PDF)
 * Zero-dependency client-side PDF document compiler and DOM element exporter.
 * v2.0 - High-fidelity printing stylesheet isolates, alongside dynamic jsPDF/html2canvas vectorized auto-upgraders.
 */
(function(window) {
    if (!window.papyr) {
        console.warn("Papyr core not found. Load papyr.js before loading PDF plugins.");
        return;
    }

    const papyr = window.papyr;

    papyr.pdf = {
        /**
         * Exports a DOM element or canvas to PDF/document format.
         * Auto-upgrades to global jsPDF/html2canvas if loaded, falling back to clean print stylesheet wrappers.
         */
        export(elementOrSelector, filename = 'document.pdf') {
            if (typeof window === 'undefined' || typeof document === 'undefined') {
                console.log(`[papyr.pdf.export] Non-browser context export: ${filename}`);
                return Promise.resolve(filename);
            }

            const target = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector;
            if (!target) {
                return Promise.reject(new Error("Target element not found for PDF export."));
            }

            // jsPDF / html2canvas auto-upgrade if global jsPDF/jspdf is defined
            const jsPDFLib = window.jspdf ? window.jspdf.jsPDF : (window.jsPDF || null);
            if (jsPDFLib) {
                return new Promise((resolve, reject) => {
                    try {
                        const pdf = new jsPDFLib('p', 'mm', 'a4');
                        
                        // If html2canvas is present, we can do highly precise pixel rendering
                        if (window.html2canvas) {
                            window.html2canvas(target, {
                                scale: 2,
                                useCORS: true
                            }).then(canvas => {
                                const imgData = canvas.toDataURL('image/png');
                                const imgWidth = 210; // A4 page width in mm
                                const pageHeight = 295;
                                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                                let heightLeft = imgHeight;
                                let position = 0;

                                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                                heightLeft -= pageHeight;

                                while (heightLeft >= 0) {
                                    position = heightLeft - imgHeight;
                                    pdf.addPage();
                                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                                    heightLeft -= pageHeight;
                                }
                                pdf.save(filename);
                                resolve(filename);
                            }).catch(reject);
                        } else {
                            // Single-page fallback vector representation using jsPDF element rendering
                            pdf.html(target, {
                                callback: function (doc) {
                                    doc.save(filename);
                                    resolve(filename);
                                },
                                x: 10,
                                y: 10,
                                width: 190,
                                windowWidth: target.clientWidth || 800
                            }).catch(reject);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });
            }

            // Zero-dependency fallback: Isolated media-print style injection and window.print dialog
            return new Promise((resolve) => {
                try {
                    // Create isolated print stylesheet
                    const style = document.createElement('style');
                    style.id = 'papyr-transient-print-style';
                    style.textContent = `
                        @media print {
                            body * {
                                visibility: hidden !important;
                            }
                            #${target.id || 'papyr-print-target'}, #${target.id || 'papyr-print-target'} * {
                                visibility: visible !important;
                            }
                            #${target.id || 'papyr-print-target'} {
                                position: absolute !important;
                                left: 0 !important;
                                top: 0 !important;
                                width: 100% !important;
                                height: 100% !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                border: none !important;
                                background: white !important;
                                color: black !important;
                            }
                        }
                    `;
                    
                    // Assign temporary id if not present
                    const hasId = !!target.id;
                    if (!hasId) target.id = 'papyr-print-target';

                    document.head.appendChild(style);
                    
                    // Trigger native print flow
                    window.print();
                    
                    // Cleanup
                    setTimeout(() => {
                        document.head.removeChild(style);
                        if (!hasId) target.removeAttribute('id');
                        resolve(filename);
                    }, 500);
                } catch (e) {
                    console.warn("Print fallback failed. Downloading raw HTML/text copy instead.", e);
                    // Absolute fallback: download HTML content as a standalone HTML file
                    const htmlContent = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>${filename}</title>
                            <style>
                                body { font-family: system-ui, sans-serif; padding: 2rem; background: #fafafa; }
                                .container { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 2rem; max-width: 800px; margin: 0 auto; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                ${target.innerHTML}
                            </div>
                        </body>
                        </html>
                    `;
                    
                    const blob = new Blob([htmlContent], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename.replace('.pdf', '.html');
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        resolve(filename);
                    }, 100);
                }
            });
        }
    };
})(typeof window !== 'undefined' ? window : this);


// --- MODULE: plugins/science.js ---
/**
 * PAPYR STEM, GRAPHING, & BUSINESS ACCOUNTING ENGINE
 * Sleek, zero-dependency science graphing, scientific converters, and accounting invoice computations.
 * v2.0 - Beautiful responsive Canvas2D grid equation graphers, conversions, and standard tax invoice models.
 */
(function(window) {
    if (!window.papyr) {
        console.warn("Papyr core not found. Load papyr.js before loading science plugins.");
        return;
    }

    const papyr = window.papyr;

    // ==========================================
    // 1. SCIENTIFIC GRAPHING & STEM (papyr.science)
    // ==========================================
    papyr.science = {
        /**
         * Renders standard mathematical equations onto a Canvas element wrapped in a beautiful styled container.
         * Support standard function definitions, coordinate grid systems, and custom vibrant styling.
         */
        graph(options = {}) {
            const container = papyr.div('.papyr-graph-wrapper', {
                style: {
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    minHeight: '280px',
                    background: '#0a0d1a',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '8px'
                }
            });

            const canvas = document.createElement('canvas');
            canvas.style.display = 'block';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            container.appendChild(canvas);

            setTimeout(() => {
                const w = container.clientWidth || 400;
                const h = container.clientHeight || 280;
                canvas.width = w;
                canvas.height = h;

                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, w, h);

                const equation = options.equation || ((x) => Math.sin(x));
                const range = options.range || [-10, 10, -5, 5];
                const [minX, maxX, minY, maxY] = range;
                
                const plotColor = options.color || '#10b981';
                const gridColor = options.gridColor || 'rgba(255, 255, 255, 0.05)';
                const axisColor = options.axisColor || 'rgba(255, 255, 255, 0.3)';

                // Map coordinates from graph dimensions to screen pixels
                const toScreenX = (x) => ((x - minX) / (maxX - minX)) * w;
                const toScreenY = (y) => h - ((y - minY) / (maxY - minY)) * h;

                // 1. Draw Grid Lines
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                
                // Vertical grid lines
                for (let x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
                    const sx = toScreenX(x);
                    ctx.beginPath();
                    ctx.moveTo(sx, 0);
                    ctx.lineTo(sx, h);
                    ctx.stroke();
                }

                // Horizontal grid lines
                for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
                    const sy = toScreenY(y);
                    ctx.beginPath();
                    ctx.moveTo(0, sy);
                    ctx.lineTo(w, sy);
                    ctx.stroke();
                }

                // 2. Draw Axes
                ctx.strokeStyle = axisColor;
                ctx.lineWidth = 1.5;

                // Y Axis (X = 0)
                if (minX <= 0 && maxX >= 0) {
                    const sx0 = toScreenX(0);
                    ctx.beginPath();
                    ctx.moveTo(sx0, 0);
                    ctx.lineTo(sx0, h);
                    ctx.stroke();
                }

                // X Axis (Y = 0)
                if (minY <= 0 && maxY >= 0) {
                    const sy0 = toScreenY(0);
                    ctx.beginPath();
                    ctx.moveTo(0, sy0);
                    ctx.lineTo(w, sy0);
                    ctx.stroke();
                }

                // 3. Draw Equation Curve
                let eqFunc = equation;
                if (typeof equation === 'string') {
                    try {
                        // Safe evaluation fallback for basic math expressions
                        eqFunc = (x) => {
                            const cleanEq = equation.replace(/sin/g, 'Math.sin')
                                                    .replace(/cos/g, 'Math.cos')
                                                    .replace(/tan/g, 'Math.tan')
                                                    .replace(/pi/g, 'Math.PI')
                                                    .replace(/exp/g, 'Math.exp')
                                                    .replace(/pow/g, 'Math.pow');
                            return new Function('x', `return ${cleanEq}`)(x);
                        };
                    } catch (e) {
                        console.error("Failed to parse equation string:", e);
                        eqFunc = (x) => 0;
                    }
                }

                ctx.strokeStyle = plotColor;
                ctx.lineWidth = 2.5;
                ctx.beginPath();

                let first = true;
                const resolution = w; // evaluate at every pixel column
                for (let i = 0; i <= resolution; i++) {
                    const cx = minX + (i / resolution) * (maxX - minX);
                    try {
                        const cy = eqFunc(cx);
                        if (!isNaN(cy) && isFinite(cy)) {
                            const sx = toScreenX(cx);
                            const sy = toScreenY(cy);
                            
                            if (first) {
                                ctx.moveTo(sx, sy);
                                first = false;
                            } else {
                                ctx.lineTo(sx, sy);
                            }
                        }
                    } catch (err) {
                        // skip drawing invalid points
                    }
                }
                ctx.stroke();

                // Draw equation label overlay
                ctx.fillStyle = '#94a3b8';
                ctx.font = '11px sans-serif';
                ctx.fillText(typeof equation === 'string' ? `y = ${equation}` : 'y = f(x)', 12, 20);

            }, 50);

            return container;
        },

        /**
         * STEM scientific converters.
         */
        convert(val, from, to) {
            const key = `${from.toLowerCase()}->${to.toLowerCase()}`;
            const conversions = {
                'c->f': (v) => v * 1.8 + 32,
                'f->c': (v) => (v - 32) / 1.8,
                'm->ft': (v) => v * 3.28084,
                'ft->m': (v) => v / 3.28084,
                'kg->lbs': (v) => v * 2.20462,
                'lbs->kg': (v) => v / 2.20462,
                'km->mi': (v) => v * 0.621371,
                'mi->km': (v) => v / 0.621371
            };

            if (conversions[key]) {
                return conversions[key](val);
            }
            console.warn(`STEM Convert: Conversion from "${from}" to "${to}" is not defined.`);
            return val;
        },

        /**
         * BMI Scientific Calculator.
         */
        bmi(weightKg, heightM) {
            if (heightM <= 0) return { score: 0, category: 'Invalid' };
            const score = parseFloat((weightKg / (heightM * heightM)).toFixed(2));
            let category = 'Normal';
            if (score < 18.5) category = 'Underweight';
            else if (score >= 25 && score < 30) category = 'Overweight';
            else if (score >= 30) category = 'Obese';
            return { score, category };
        }
    };

    // ==========================================
    // 2. FINANCIAL BUSINESS ENGINES (papyr.business)
    // ==========================================
    papyr.business = {
        /**
         * Computes line-item invoicing, taxation, and subtotal parameters.
         */
        invoice(data = {}) {
            const items = data.items || [];
            const taxRate = data.taxRate !== undefined ? data.taxRate : 0.08; // 8% default
            
            let subtotal = 0;
            const computedItems = items.map(item => {
                const qty = item.qty !== undefined ? item.qty : 1;
                const price = item.price !== undefined ? item.price : 0;
                const total = parseFloat((qty * price).toFixed(2));
                subtotal += total;
                return Object.assign({}, item, { qty, price, total });
            });

            const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
            const grandTotal = parseFloat((subtotal + taxAmount).toFixed(2));

            return {
                items: computedItems,
                subtotal: parseFloat(subtotal.toFixed(2)),
                taxRate: taxRate,
                taxAmount: taxAmount,
                total: grandTotal,
                invoiceNumber: data.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
                date: data.date || new Date().toLocaleDateString()
            };
        }
    };

})(typeof window !== 'undefined' ? window : this);



    // Auto-inject Themeable Stylesheets
    if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.id = 'papyr-complete-styles';
        style.textContent = `
:root {
    --papyr-primary: #6366f1;
    --papyr-primary-hover: #4f46e5;
    --papyr-primary-light: rgba(99, 102, 241, 0.15);
    --papyr-bg: #0f172a;
    --papyr-surface: #1e293b;
    --papyr-border: #334155;
    --papyr-text: #f8fafc;
    --papyr-text-muted: #94a3b8;
    --papyr-success: #10b981;
    --papyr-error: #ef4444;
    --papyr-info: #0ea5e9;
    --papyr-radius: 12px;
    --papyr-font: system-ui, -apple-system, sans-serif;
}

/* Flexbox System */
.flex-row { display: flex; flex-direction: row; gap: 1rem; }
.flex-col { display: flex; flex-direction: column; gap: 1rem; }
.flex-center { display: flex; justify-content: center; align-items: center; gap: 1rem; }
.flex-between { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.flex-around { display: flex; justify-content: space-around; align-items: center; gap: 1rem; }
.flex-wrap { display: flex; flex-wrap: wrap; gap: 1rem; }

/* Grid System */
.grid { display: grid; gap: 1.5rem; }

/* Cards */
.card { 
    background: var(--papyr-surface); 
    border: 1px solid var(--papyr-border);
    border-radius: var(--papyr-radius); 
    padding: 1.5rem; 
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
}
.card-title { margin-top: 0; margin-bottom: 0.75rem; color: var(--papyr-text); }
.card-content { color: var(--papyr-text-muted); font-size: 0.95rem; }
.card-footer { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--papyr-border); color: var(--papyr-text-muted); font-size: 0.85rem; }

/* Buttons */
.btn-primary { 
    background: var(--papyr-primary); 
    color: white; 
    border: none; 
    padding: 10px 20px; 
    border-radius: 8px; 
    font-weight: 600; 
    cursor: pointer; 
    transition: background 0.2s; 
}
.btn-primary:hover { background: var(--papyr-primary-hover); }

/* Inputs */
input[type="text"], input[type="email"], input[type="password"], textarea, select {
    background: var(--papyr-bg);
    border: 1px solid var(--papyr-border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--papyr-text);
    font-family: inherit;
    outline: none;
    width: 100%;
    transition: border-color 0.2s;
}
input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus, textarea:focus, select:focus {
    border-color: var(--papyr-primary);
}

/* Forms */
.papyr-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-field { display: flex; flex-direction: column; gap: 0.5rem; }
.form-field label { font-size: 0.85rem; font-weight: 600; color: var(--papyr-text-muted); }

/* Table styling */
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th, .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--papyr-border); }
.data-table th { background: var(--papyr-surface); color: var(--papyr-text); font-weight: 600; }
.data-table td { color: var(--papyr-text-muted); }

/* Suggestions autocomplete */
.autocomplete { position: relative; width: 100%; }
.suggestions { 
    position: absolute; top: 100%; left: 0; right: 0; 
    background: var(--papyr-surface); border: 1px solid var(--papyr-border); 
    border-radius: 8px; list-style: none; padding: 0; margin: 4px 0 0 0; 
    z-index: 1000; max-height: 200px; overflow-y: auto;
}
.suggestions li { padding: 10px 14px; cursor: pointer; color: var(--papyr-text-muted); }
.suggestions li:hover { background: var(--papyr-bg); color: var(--papyr-text); }

/* Modal styles */
.modal { 
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px);
    display: flex; justify-content: center; align-items: center; z-index: 2000;
    opacity: 0; transition: opacity 0.3s ease;
}
.modal-show { opacity: 1; }
.modal-content { 
    background: var(--papyr-surface); border: 1px solid var(--papyr-border);
    border-radius: var(--papyr-radius); width: 90%; max-width: 500px; 
    transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-show .modal-content { transform: translateY(0); }
.modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--papyr-border); display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; color: var(--papyr-text); }
.close-btn { background: none; border: none; font-size: 1.5rem; color: var(--papyr-text-muted); cursor: pointer; }
.close-btn:hover { color: var(--papyr-text); }
.modal-body { padding: 1.5rem; color: var(--papyr-text-muted); }

/* Toasts notifications */
.toast {
    position: fixed; bottom: 20px; right: 20px; 
    background: var(--papyr-surface); border: 1px solid var(--papyr-border);
    border-radius: 8px; padding: 12px 20px; color: var(--papyr-text); 
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); z-index: 3000;
    transform: translateY(100px); opacity: 0; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s;
}
.toast-show { transform: translateY(0); opacity: 1; }
.toast-hide { transform: translateY(-100px); opacity: 0; }
.toast-success { border-left: 4px solid var(--papyr-success); }
.toast-error { border-left: 4px solid var(--papyr-error); }
.toast-info { border-left: 4px solid var(--papyr-info); }

/* Tab components */
.tabs { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
.tab-headers { display: flex; border-bottom: 1px solid var(--papyr-border); gap: 4px; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
.tab-headers::-webkit-scrollbar { display: none; }
.tab-header { 
    background: none; border: none; border-bottom: 2px solid transparent; 
    padding: 10px 16px; color: var(--papyr-text-muted); cursor: pointer; font-weight: 600;
    transition: all 0.2s;
}
.tab-header:hover { color: var(--papyr-text); }
.tab-active { color: var(--papyr-primary); border-bottom-color: var(--papyr-primary); }
.tab-contents { color: var(--papyr-text-muted); line-height: 1.5; }

/* Loader components */
.loading { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 2rem; color: var(--papyr-text-muted); }
.spinner { 
    width: 32px; height: 32px; border: 3px solid var(--papyr-primary-light); 
    border-top-color: var(--papyr-primary); border-radius: 50%; animation: spin 0.8s linear infinite; 
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Sidebars catalog navigation */
.sidebar { display: flex; flex-direction: column; gap: 4px; }
.sidebar-item { 
    padding: 10px 14px; border-radius: 6px; cursor: pointer; 
    color: var(--papyr-text-muted); transition: all 0.2s; 
}
.sidebar-item:hover { background: var(--papyr-primary-light); color: var(--papyr-text); }
.sidebar-item.active { background: var(--papyr-primary); color: white; }

/* Image carousel */
.carousel { position: relative; width: 100%; overflow: hidden; border-radius: var(--papyr-radius); border: 1px solid var(--papyr-border); aspect-ratio: 16/9; }
.carousel-img { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.2s ease-in-out; }
.carousel-btn { 
    position: absolute; top: 50%; transform: translateY(-50%); 
    background: rgba(15, 23, 42, 0.6); border: 1px solid var(--papyr-border); 
    color: white; width: 36px; height: 36px; border-radius: 50%; 
    cursor: pointer; display: flex; justify-content: center; align-items: center; z-index: 10;
    transition: background 0.2s;
}
.carousel-btn:hover { background: var(--papyr-primary); }
.prev-btn { left: 10px; }
.next-btn { right: 10px; }
.carousel-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
.carousel-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); cursor: pointer; }
.carousel-dot.active { background: white; width: 18px; border-radius: 4px; }

/* ==========================================
   BOOTSTRAP SPECIFICITY OVERRIDES
   ========================================== */
:root, [data-bs-theme="dark"] {
    --bs-body-bg: var(--papyr-bg, #0f172a) !important;
    --bs-body-color: var(--papyr-text, #f8fafc) !important;
    --bs-tertiary-bg: var(--papyr-surface, #1e293b) !important;
    --bs-card-bg: var(--papyr-surface, #1e293b) !important;
    --bs-card-color: var(--papyr-text, #f8fafc) !important;
    --bs-border-color: var(--papyr-border, #334155) !important;
}

.card {
    background: var(--papyr-surface, #1e293b) !important;
    border: 1px solid var(--papyr-border, #334155) !important;
    border-radius: var(--papyr-radius, 12px) !important;
}

/* PAPER ANIMATE CSS */
.papyr-animate-base {
    opacity: 0;
    will-change: transform, opacity;
    animation-duration: 0.8s;
    animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
    animation-fill-mode: forwards;
}

.animated {
    opacity: 1; /* fallback if animation fails */
}

/* Entrance Animations */
.animate-fade-in { animation-name: papyr-fade-in; }
@keyframes papyr-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

.animate-slide-up { animation-name: papyr-slide-up; }
@keyframes papyr-slide-up {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-slide-down { animation-name: papyr-slide-down; }
@keyframes papyr-slide-down {
    from { opacity: 0; transform: translateY(-40px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-zoom-in { animation-name: papyr-zoom-in; }
@keyframes papyr-zoom-in {
    from { opacity: 0; transform: scale(0.85); }
    to { opacity: 1; transform: scale(1); }
}

.animate-bounce { animation-name: papyr-bounce; animation-timing-function: cubic-bezier(0.28, 0.84, 0.42, 1); }
@keyframes papyr-bounce {
    0% { opacity: 0; transform: scale(0.3); }
    50% { opacity: 1; transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
}

/* Interactive Hover Animations */
.hover-grow {
    transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.hover-grow:hover {
    transform: scale(1.05);
}

.hover-lift {
    transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.3s;
}
.hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

/* Reduce motion accessibility */
@media (prefers-reduced-motion: reduce) {
    .papyr-animate-base, .hover-grow, .hover-lift {
        animation: none !important;
        transition: none !important;
        transform: none !important;
        opacity: 1 !important;
    }
}


/* Papyr.js Responsive Grid System */
.container { width: 100%; margin-right: auto; margin-left: auto; padding-right: 15px; padding-left: 15px; }
@media (min-width: 576px) { .container { max-width: 540px; } }
@media (min-width: 768px) { .container { max-width: 720px; } }
@media (min-width: 992px) { .container { max-width: 960px; } }
@media (min-width: 1200px) { .container { max-width: 1140px; } }

.row { display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; }
.col { flex-basis: 0; flex-grow: 1; max-width: 100%; padding-right: 15px; padding-left: 15px; }

/* Grid Columns */
.col-12 { flex: 0 0 100%; max-width: 100%; padding-right: 15px; padding-left: 15px; }
.col-6 { flex: 0 0 50%; max-width: 50%; padding-right: 15px; padding-left: 15px; }
.col-4 { flex: 0 0 33.333333%; max-width: 33.333333%; padding-right: 15px; padding-left: 15px; }
.col-3 { flex: 0 0 25%; max-width: 25%; padding-right: 15px; padding-left: 15px; }

@media (min-width: 768px) {
    .col-md-12 { flex: 0 0 100%; max-width: 100%; }
    .col-md-6 { flex: 0 0 50%; max-width: 50%; }
    .col-md-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
    .col-md-3 { flex: 0 0 25%; max-width: 25%; }
}

@media (min-width: 992px) {
    .col-lg-12 { flex: 0 0 100%; max-width: 100%; }
    .col-lg-6 { flex: 0 0 50%; max-width: 50%; }
    .col-lg-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
    .col-lg-3 { flex: 0 0 25%; max-width: 25%; }
}

/* Flex Utilities */
.flex { display: flex; }
.flex-column { flex-direction: column; }
.align-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.wrap { flex-wrap: wrap; }
.gap-1 { gap: 0.5rem; }
.gap-2 { gap: 1rem; }
.gap-3 { gap: 1.5rem; }

/* Global Typography & Adjustments for Mobile */
@media (max-width: 768px) {
    body { font-size: 14px; }
    h1 { font-size: 2rem !important; }
    h2 { font-size: 1.5rem !important; }
    .hero { padding: 3rem 1rem !important; }
    .hero-buttons { flex-direction: column; gap: 1rem; width: 100%; }
    .hero-buttons > * { width: 100%; text-align: center; justify-content: center; }
    .stat-item { width: 100% !important; margin-bottom: 1rem; }
    .api-grid { grid-template-columns: 1fr !important; }
    #playground-split { flex-direction: column !important; }
    #editor-pane, #preview-pane { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--border-color); }
    .catalog-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--border-color); }
    .playground-body { flex-direction: column !important; }
}
\\n
/* Docs Layout */
.docs-container {
    display: flex;
    min-height: 100vh;
}
.sidebar {
    width: 250px;
    background: #0a0f1c;
    border-right: 1px solid var(--border-color);
    padding: 2rem 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    flex-shrink: 0;
}
.sidebar-link {
    display: block;
    padding: 0.5rem 1.5rem;
    color: var(--text-muted);
    text-decoration: none;
    transition: all 0.2s;
    font-size: 0.9rem;
}
.sidebar-link:hover {
    color: #fff;
    background: rgba(255,255,255,0.05);
}
.sidebar-link.active {
    color: var(--primary);
    background: rgba(99, 102, 241, 0.1);
    border-right: 3px solid var(--primary);
}
.docs-content {
    flex-grow: 1;
    padding: 3rem 4rem;
    max-width: 900px;
}

@media (max-width: 768px) {
    .docs-container {
        flex-direction: column;
    }
    .sidebar {
        width: 100%;
        height: auto;
        position: relative;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
        padding: 1rem 0;
    }
    .docs-content {
        padding: 2rem 1.5rem;
    }
}

.crud-grid {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
}
@media (max-width: 768px) {
    .crud-grid {
        grid-template-columns: 1fr;
    }
}

.responsive-split-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}
@media (max-width: 768px) {
    .responsive-split-grid {
        grid-template-columns: 1fr;
    }
}

/* Custom animations for papyr complete */
@keyframes papyr-blur-in {
    0% { opacity: 0; filter: blur(12px); transform: translateY(20px); }
    100% { opacity: 1; filter: blur(0); transform: translateY(0); }
}
@keyframes papyr-glass-pop {
    0% { opacity: 0; transform: scale(0.93) translateY(15px); }
    70% { transform: scale(1.01) translateY(-2px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-blur-in { animation-name: papyr-blur-in; }
.animate-glass-pop { animation-name: papyr-glass-pop; }

/* ==========================================
   WATT PRIVACY BANNER AND CONSENT COMPONENTS
   ========================================== */
.watt-banner-pill {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: rgba(13, 17, 34, 0.85);
    border: 1px solid rgba(20, 184, 166, 0.25);
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(20, 184, 166, 0.1);
    border-radius: 99px;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: calc(100% - 48px);
    max-width: 650px;
    z-index: 9999;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    animation: watt-slide-in-banner 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes watt-slide-in-banner {
    to { transform: translateX(-50%) translateY(0); }
}

@media (max-width: 576px) {
    .watt-banner-pill {
        flex-direction: column;
        border-radius: 16px;
        padding: 16px;
        text-align: center;
        gap: 12px;
    }
}
`;
        document.head.appendChild(style);
        console.log("📄 Papyr Complete styling successfully injected.");
    }

})(typeof window !== 'undefined' ? window : this);
