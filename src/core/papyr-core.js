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
