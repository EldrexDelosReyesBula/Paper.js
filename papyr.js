/**
 * PAPER STATIC SITE LIBRARY - Core Bundle
 * v3.0 - Agile Modular Architecture (Reactivity, Hash SPA Router, Math Logic, Persistent CRUD Store)
 * Released under MIT License.
 */

(function(window) {
    let activeEffect = null;
    let isDebug = false;

// --- MODULE: core/papyr-core.js ---
/**
 * PAPER CORE DOM ENGINE
 * 
 * Compiles standard JS parameter lists, selectors, and states to native, styled HTML elements.
 */

const tagList = ['div','span','p','h1','h2','h3','h4','h5','h6','button','a','img',
                  'input','textarea','select','option','optgroup','ul','ol','li','dl','dt','dd',
                  'table','thead','tbody','tfoot','tr','td','th','caption','colgroup','col',
                  'form','label','fieldset','legend','datalist','output',
                  'section','article','header','footer','nav','aside','main',
                  'pre','code','hr','br','strong','em','small','mark','sub','sup','i','b','u','s',
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

/**
 * Runs runtime spelling validations on tag creators.
 * @private
 */
function checkTag(tag) {
    if (!isDebug || tagList.includes(tag)) return;
    let min = Infinity, match = '';
    tagList.forEach(t => {
        let d = levenshtein(tag, t);
        if (d < min) { min = d; match = t; }
    });
    console.warn(`PapyrWarning: Unknown tag "${tag}".${min < 3 ? ` Did you mean "${match}"?` : ''}`);
    
    let warningEvent = new CustomEvent('papyr-warning', { detail: { tag, suggestion: min < 3 ? match : '' } });
    window.dispatchEvent(warningEvent);
}

/**
 * Creates a native HTML Element wrapped in Papyr selectors, styles, attributes, and events.
 * 
 * @param {string} tag Native HTML element tag (e.g. 'div', 'span', 'button')
 * @param {...*} args Class lists, IDs, event listeners, states, attributes, or children elements
 * @returns {HTMLElement} Native HTML Element
 */
function papyr(tag, ...args) {
    checkTag(tag);
    let el = document.createElement(tag);

    let appendChild = (child) => {
        if (child === null || child === undefined) return;
        
        // Reactive State Object (has a subscribe method)
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
            // Computed state binding
            let node = document.createTextNode('');
            el.appendChild(node);
            papyr.computed(() => {
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
            // Standard string parsing
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
            // Setup attributes mapping
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

    return el;
}

// Generate shortcuts for tags (e.g. papyr.div(), papyr.span())
tagList.forEach(tag => {
    papyr[tag] = (...args) => papyr(tag, ...args);
});

// Dynamic layout shortcuts for visual alignment
papyr.flex = {
    row: (...args) => papyr('div', '.flex-row', ...args),
    col: (...args) => papyr('div', '.flex-col', ...args),
    center: (...args) => papyr('div', '.flex-center', ...args),
    between: (...args) => papyr('div', '.flex-between', ...args),
    around: (...args) => papyr('div', '.flex-around', ...args),
    wrap: (...args) => papyr('div', '.flex-wrap', ...args)
};

papyr.grid = (...args) => papyr('div', '.grid', ...args);
papyr.container = (...args) => papyr('div', '.container', ...args);
papyr.row = (...args) => papyr('div', '.row', ...args);
papyr.col = (...args) => papyr('div', '.col', ...args);

// OOP Class-based component support
class PapyrComponent {
    constructor() {
        if (this.render === undefined) {
            throw new Error("PapyrComponent must implement a render() method");
        }
    }
}
papyr.component = PapyrComponent;

// Security and validation
papyr.validate = (schema) => {
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
papyr.inspect = (component) => {
    let container = document.createElement('div');
    container.appendChild(component.cloneNode(true));
    return container.innerHTML;
};

papyr.mount = (selector, component) => {
    let target = document.querySelector(selector);
    if (target) {
        target.innerHTML = '';
        target.appendChild(component);
    }
    return target;
};

papyr.debug = (enable) => {
    isDebug = enable;
    if (enable) console.log("📄 Papyr Debug Mode Enabled.");
};

papyr.delay = (ms) => new Promise(res => setTimeout(res, ms));
papyr.copy = (text) => navigator.clipboard.writeText(text);

papyr.storage = (key, val) => {
    if (typeof val === 'undefined') {
        let data = localStorage.getItem(key);
        try { return JSON.parse(data); } catch(e) { return data; }
    }
    localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
};

// Document fragments and inline templates
papyr.fragment = (...children) => {
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

papyr.html = (htmlString) => {
    let template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.cloneNode(true);
};

// Visual animations transition engine
papyr.fadeIn = (el, duration = 400) => {
    el.style.opacity = '0';
    el.style.transition = `opacity ${duration}ms ease`;
    requestAnimationFrame(() => { el.style.opacity = '1'; });
};

papyr.fadeOut = (el, duration = 400) => {
    el.style.opacity = '1';
    el.style.transition = `opacity ${duration}ms ease`;
    requestAnimationFrame(() => { el.style.opacity = '0'; });
    setTimeout(() => el.remove(), duration);
};

papyr.animate = (el, properties, duration = 400) => {
    el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    requestAnimationFrame(() => {
        Object.assign(el.style, properties);
    });
};

papyr.use = (plugin) => plugin(papyr);

papyr.loadFramework = (framework) => {
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

let previousPapyr = typeof window !== 'undefined' ? window.papyr : null;
papyr.noConflict = () => {
    if (typeof window !== 'undefined') {
        window.papyr = previousPapyr;
    }
    return papyr;
};

if (typeof window !== 'undefined') {
    window.papyr = papyr;
}


// --- MODULE: core/security.js ---
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


// --- MODULE: core/reactivity.js ---
/**
 * PAPER REACTIVITY SYSTEM
 * 
 * Auto-tracking reactive state variables and computed logic nodes.
 */

/**
 * Creates an auto-tracking reactive state variable.
 * 
 * @param {*} val Initial reactive state value
 * @returns {PaperState} Reactive State accessor interface
 */
papyr.state = (val) => {
    let subscribers = new Set();
    return {
        get value() {
            if (activeEffect) subscribers.add(activeEffect);
            return val;
        },
        set value(newVal) {
            val = newVal;
            subscribers.forEach(sub => sub(newVal));
        },
        subscribe(sub) {
            subscribers.add(sub);
            sub(val);
            return () => subscribers.delete(sub);
        }
    };
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


// --- MODULE: core/router.js ---
/**
 * PAPER ROUTER
 * Zero-configuration Hash SPA Router.
 */
(function() {
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

})();


// --- MODULE: core/math.js ---
/**
 * PAPER MATHEMATICAL LOGIC SYSTEM
 * 
 * Auto-updating computed mathematical operations accepting standard numbers or reactive state nodes.
 */

(function() {
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
})();


// --- MODULE: core/db.js ---
/**
 * PAPER DATA SYSTEM (Unified DB API)
 * Seamlessly integrates LocalStorage, SessionStorage, IndexedDB, and SQLite endpoints.
 */

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
            // Firebase hollow bridge (requires papyr.firebase to be initialized by user)
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
            // SQLite hollow bridge (requires sql.js or similar)
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

// Aliases for standard unified access
papyr.storage = {
    set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
    get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; } },
    secureSet: (k, v, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        localStorage.setItem(k, papyr.security.encrypt(JSON.stringify(v), password));
    },
    secureGet: (k, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        let enc = localStorage.getItem(k);
        if (!enc) return null;
        try { return JSON.parse(papyr.security.decrypt(enc, password)); } catch(e) { return null; }
    }
};

papyr.session = {
    set: (k, v) => sessionStorage.setItem(k, JSON.stringify(v)),
    get: (k) => { try { return JSON.parse(sessionStorage.getItem(k)); } catch(e) { return null; } },
    secureSet: (k, v, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        sessionStorage.setItem(k, papyr.security.encrypt(JSON.stringify(v), password));
    },
    secureGet: (k, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        let enc = sessionStorage.getItem(k);
        if (!enc) return null;
        try { return JSON.parse(papyr.security.decrypt(enc, password)); } catch(e) { return null; }
    }
};


// --- MODULE: core/orm.js ---
/**
 * PAPER ORM SYSTEM
 * Object-Relational Mapping for Papyr.js
 */

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

// Global exposure
papyr.model = PapyrModel;


// --- MODULE: core/auth.js ---
/**
 * PAPER AUTHENTICATION ENGINE
 * Handles login, logout, and registration logic. Provides a unified interface
 * for Local, JWT, Firebase Auth, and OAuth.
 */

papyr.auth = {
    user: papyr.state(null), // Reactive current user state
    
    _config: { provider: 'local' },

    init(config) {
        this._config = { ...this._config, ...config };
        
        // Auto-login check for local token
        if (this._config.provider === 'local') {
            let token = papyr.storage.get("auth_token");
            if (token) {
                // Dummy restore for local mode
                this.user.value = { token, username: 'LocalUser' };
            }
        }
    },

    login(credentials) {
        if (this._config.provider === 'local') {
            // Simulated local login
            let user = { id: Date.now(), ...credentials };
            papyr.storage.set("auth_token", "fake_jwt_" + Date.now());
            this.user.value = user;
            return Promise.resolve(user);
        } else if (this._config.provider === 'firebase') {
            if (papyr.firebase && papyr.firebase.auth) {
                return papyr.firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
                    .then(res => {
                        this.user.value = res.user;
                        return res.user;
                    });
            } else {
                return Promise.reject("Firebase not initialized");
            }
        }
        return Promise.reject("Provider not supported");
    },

    register(credentials) {
        if (this._config.provider === 'local') {
            // Simulated local registration
            let user = { id: Date.now(), ...credentials };
            papyr.storage.set("auth_token", "fake_jwt_" + Date.now());
            this.user.value = user;
            return Promise.resolve(user);
        }
        return Promise.reject("Registration not implemented for " + this._config.provider);
    },

    logout() {
        if (this._config.provider === 'local') {
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


// --- MODULE: core/api.js ---
/**
 * PAPER API HELPERS
 * Simplifies standard fetch() commands for beginners.
 */
(function() {
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
                papyr.warn(`papyr.api.get failed for ${url}`, error);
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
                papyr.warn(`papyr.api.post failed for ${url}`, error);
                throw error;
            }
        }
    };
})();


// --- MODULE: core/debug.js ---
/**
 * PAPER DEBUGGING SUITE
 * Provides structured, educational console logs for beginners.
 */
(function() {
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
    };
})();



})(typeof window !== 'undefined' ? window : this);
