/**
 * PAPER STATIC SITE LIBRARY - Complete Showcase Bundle
 * v3.0 - Core Reactivity, SPA Routing, Reactive Math Logic, Persistent Local CRUD Database, Responsive Widgets
 * Released under MIT License.
 */

(function(window) {
    let activeEffect = null;
    let isDebug = false;

// --- MODULE: core/paper-core.js ---
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
    console.warn(`PaperWarning: Unknown tag "${tag}".${min < 3 ? ` Did you mean "${match}"?` : ''}`);
    
    let warningEvent = new CustomEvent('paper-warning', { detail: { tag, suggestion: min < 3 ? match : '' } });
    window.dispatchEvent(warningEvent);
}

/**
 * Creates a native HTML Element wrapped in Paper selectors, styles, attributes, and events.
 * 
 * @param {string} tag Native HTML element tag (e.g. 'div', 'span', 'button')
 * @param {...*} args Class lists, IDs, event listeners, states, attributes, or children elements
 * @returns {HTMLElement} Native HTML Element
 */
function paper(tag, ...args) {
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
            paper.computed(() => {
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

// Generate shortcuts for tags (e.g. paper.div(), paper.span())
tagList.forEach(tag => {
    paper[tag] = (...args) => paper(tag, ...args);
});

// Dynamic layout shortcuts for visual alignment
paper.flex = {
    row: (...args) => paper('div', '.flex-row', ...args),
    col: (...args) => paper('div', '.flex-col', ...args),
    center: (...args) => paper('div', '.flex-center', ...args),
    between: (...args) => paper('div', '.flex-between', ...args),
    around: (...args) => paper('div', '.flex-around', ...args),
    wrap: (...args) => paper('div', '.flex-wrap', ...args)
};

paper.grid = (...args) => paper('div', '.grid', ...args);
paper.container = (...args) => paper('div', '.container', ...args);
paper.row = (...args) => paper('div', '.row', ...args);
paper.col = (...args) => paper('div', '.col', ...args);

// OOP Class-based component support
class PaperComponent {
    constructor() {
        if (this.render === undefined) {
            throw new Error("PaperComponent must implement a render() method");
        }
    }
}
paper.component = PaperComponent;

// Security and validation
paper.validate = (schema) => {
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
paper.inspect = (component) => {
    let container = document.createElement('div');
    container.appendChild(component.cloneNode(true));
    return container.innerHTML;
};

paper.mount = (selector, component) => {
    let target = document.querySelector(selector);
    if (target) {
        target.innerHTML = '';
        target.appendChild(component);
    }
    return target;
};

paper.debug = (enable) => {
    isDebug = enable;
    if (enable) console.log("📄 Paper Debug Mode Enabled.");
};

paper.delay = (ms) => new Promise(res => setTimeout(res, ms));
paper.copy = (text) => navigator.clipboard.writeText(text);

paper.storage = (key, val) => {
    if (typeof val === 'undefined') {
        let data = localStorage.getItem(key);
        try { return JSON.parse(data); } catch(e) { return data; }
    }
    localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
};

// Document fragments and inline templates
paper.fragment = (...children) => {
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

paper.html = (htmlString) => {
    let template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.cloneNode(true);
};

// Visual animations transition engine
paper.fadeIn = (el, duration = 400) => {
    el.style.opacity = '0';
    el.style.transition = `opacity ${duration}ms ease`;
    requestAnimationFrame(() => { el.style.opacity = '1'; });
};

paper.fadeOut = (el, duration = 400) => {
    el.style.opacity = '1';
    el.style.transition = `opacity ${duration}ms ease`;
    requestAnimationFrame(() => { el.style.opacity = '0'; });
    setTimeout(() => el.remove(), duration);
};

paper.animate = (el, properties, duration = 400) => {
    el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    requestAnimationFrame(() => {
        Object.assign(el.style, properties);
    });
};

paper.use = (plugin) => plugin(paper);

paper.loadFramework = (framework) => {
    let id = `paper-fw-${framework}`;
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
        
        // Find custom stylesheet tags to insert Bootstrap before them, preserving specificity priority
        let customStyle = document.getElementById('paper-complete-styles') || document.querySelector('link[href*="styles.css"]') || document.querySelector('style');
        if (customStyle && customStyle.parentNode) {
            customStyle.parentNode.insertBefore(link, customStyle);
        } else {
            document.head.appendChild(link);
        }
        
        // Force Bootstrap 5 Dark Theme on HTML document root and body
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

window.paper = paper;


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
paper.state = (val) => {
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
paper.computed = (fn) => {
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
paper.if = (conditionState, trueVal, falseVal) => {
    let container = paper.div({ style: { display: 'contents' } });
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
paper.for = (arrayState, renderCallback) => {
    let container = paper.div({ style: { display: 'contents' } });
    
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
    let currentView = paper.state(null);
    let pathParams = paper.state({});

    /**
     * Define a hash route.
     * @param {string} path Route path (e.g., "#/about", "#/user/:id")
     * @param {function|class} componentFn Component or Class to render
     */
    paper.route = (path, componentFn) => {
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
    paper.navigate = (path) => {
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
                currentView.value = () => paper.div("404 - Route Not Found");
            }
        });
    }

    /**
     * Global accessor for route parameters
     */
    paper.useParams = () => pathParams;

    /**
     * Initializes the router and returns the reactive router container.
     */
    paper.router = () => {
        if (typeof window !== 'undefined' && routes.length > 0 && !currentView.value) {
            window.dispatchEvent(new Event('hashchange')); // Initial load
        }
        
        // Reactive component switcher
        return paper.if(
            currentView,
            () => {
                let Component = currentView.value;
                // OOP Check: if it's a class extending paper.component
                if (Component.prototype && Component.prototype instanceof paper.component) {
                    return new Component().render();
                }
                return Component();
            },
            () => paper.div()
        );
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

    paper.math = {
        /**
         * Calculates reactive sum of multiple states or numbers.
         */
        sum: (...args) => paper.computed(() => {
            return flatten(args).reduce((acc, cur) => acc + getVal(cur), 0);
        }),

        /**
         * Calculates reactive subtraction of two states or numbers.
         */
        sub: (a, b) => paper.computed(() => {
            return getVal(a) - getVal(b);
        }),

        /**
         * Calculates reactive product of multiple states or numbers.
         */
        mul: (...args) => paper.computed(() => {
            let flat = flatten(args);
            if (flat.length === 0) return 0;
            return flat.reduce((acc, cur) => acc * (cur && typeof cur.subscribe === 'function' ? cur.value : Number(cur || 1)), 1);
        }),

        /**
         * Calculates reactive division of two states or numbers.
         */
        div: (a, b) => paper.computed(() => {
            let denominator = getVal(b);
            if (denominator === 0) return 0;
            return getVal(a) / denominator;
        }),

        /**
         * Calculates reactive average of multiple states or numbers.
         */
        avg: (...args) => paper.computed(() => {
            let flat = flatten(args);
            if (flat.length === 0) return 0;
            let sumVal = flat.reduce((acc, cur) => acc + getVal(cur), 0);
            return sumVal / flat.length;
        }),

        /**
         * Calculates reactive percentage of a value inside a total.
         */
        percent: (val, total) => paper.computed(() => {
            let t = getVal(total);
            if (t === 0) return 0;
            return (getVal(val) / t) * 100;
        }),

        /**
         * Calculates reactive rounded values.
         */
        round: (val, decimals = 0) => paper.computed(() => {
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

paper.db = (collectionName, engine = 'local') => {
    
    // Engine Drivers
    const drivers = {
        'local': {
            get: () => {
                try { return JSON.parse(localStorage.getItem(`paper_db_${collectionName}`)) || []; } 
                catch(e) { return []; }
            },
            set: (data) => localStorage.setItem(`paper_db_${collectionName}`, JSON.stringify(data))
        },
        'session': {
            get: () => {
                try { return JSON.parse(sessionStorage.getItem(`paper_db_${collectionName}`)) || []; } 
                catch(e) { return []; }
            },
            set: (data) => sessionStorage.setItem(`paper_db_${collectionName}`, JSON.stringify(data))
        },
        'firebase': {
            // Firebase hollow bridge (requires paper.firebase to be initialized by user)
            get: () => [], // Handled async in real implementation
            set: (data) => {
                if (paper.firebase && paper.firebase.db) {
                    paper.firebase.db(collectionName).set(data);
                } else {
                    console.warn("PaperDB: Firebase engine selected but paper.firebase is not initialized.");
                }
            }
        },
        'sqlite': {
            // SQLite hollow bridge (requires sql.js or similar)
            get: () => [],
            set: (data) => {
                if (paper.sqlite) paper.sqlite.insert(collectionName, data);
            }
        }
    };

    let driver = drivers[engine] || drivers['local'];
    let state = paper.state(driver.get());

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
paper.storage = {
    set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
    get: (k) => JSON.parse(localStorage.getItem(k))
};

paper.session = {
    set: (k, v) => sessionStorage.setItem(k, JSON.stringify(v)),
    get: (k) => JSON.parse(sessionStorage.getItem(k))
};


// --- MODULE: core/orm.js ---
/**
 * PAPER ORM SYSTEM
 * Object-Relational Mapping for Paper.js
 */

class PaperModel {
    constructor(data = {}) {
        Object.assign(this, data);
    }

    // Instance method for saving to DB
    save() {
        const cname = this.constructor.name.toLowerCase() + 's';
        if (this.id) {
            paper.db(cname).update(this.id, this);
        } else {
            let record = paper.db(cname).insert(this);
            this.id = record.id;
        }
        return this;
    }

    // Instance method for deleting from DB
    delete() {
        const cname = this.constructor.name.toLowerCase() + 's';
        if (this.id) {
            paper.db(cname).delete(this.id);
        }
    }

    // Static CRUD methods
    static create(data) {
        const instance = new this(data);
        return instance.save();
    }

    static find(id) {
        const cname = this.name.toLowerCase() + 's';
        const data = paper.db(cname).find(id);
        return data ? new this(data) : null;
    }

    static all() {
        const cname = this.name.toLowerCase() + 's';
        return paper.db(cname).state.value.map(data => new this(data));
    }

    static watch(callback) {
        const cname = this.name.toLowerCase() + 's';
        return paper.db(cname).watch(dataList => {
            callback(dataList.map(data => new this(data)));
        });
    }
}

// Global exposure
paper.model = PaperModel;


// --- MODULE: core/auth.js ---
/**
 * PAPER AUTHENTICATION ENGINE
 * Handles login, logout, and registration logic. Provides a unified interface
 * for Local, JWT, Firebase Auth, and OAuth.
 */

paper.auth = {
    user: paper.state(null), // Reactive current user state
    
    _config: { provider: 'local' },

    init(config) {
        this._config = { ...this._config, ...config };
        
        // Auto-login check for local token
        if (this._config.provider === 'local') {
            let token = paper.storage.get("auth_token");
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
            paper.storage.set("auth_token", "fake_jwt_" + Date.now());
            this.user.value = user;
            return Promise.resolve(user);
        } else if (this._config.provider === 'firebase') {
            if (paper.firebase && paper.firebase.auth) {
                return paper.firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
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
            paper.storage.set("auth_token", "fake_jwt_" + Date.now());
            this.user.value = user;
            return Promise.resolve(user);
        }
        return Promise.reject("Registration not implemented for " + this._config.provider);
    },

    logout() {
        if (this._config.provider === 'local') {
            paper.storage.set("auth_token", null);
            this.user.value = null;
            return Promise.resolve();
        } else if (this._config.provider === 'firebase' && paper.firebase) {
            return paper.firebase.auth().signOut().then(() => {
                this.user.value = null;
            });
        }
    }
};



// --- MODULE: plugins/official.js ---
/**
 * PAPER OFFICIAL PLUGINS & WIDGETS
 * 
 * Auto-registered official plugins, widgets, layout components, and vector icons.
 */

(function() {
    // Check if paper exists
    if (typeof paper === 'undefined') {
        console.warn("Paper core not detected. Official plugins require paper core to run.");
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
    paper.icon = (name, options = {}) => {
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
    paper.autoComplete = (inputEl, apiUrl) => {
        let input;
        let isLocal = Array.isArray(inputEl);
        
        if (isLocal) {
            let placeholder = typeof apiUrl === 'string' ? apiUrl : 'Search...';
            input = paper.input('text', placeholder, { style: { width: '100%' } });
        } else {
            input = typeof inputEl === 'string' ? paper.input('text', inputEl, { style: { width: '100%' } }) : inputEl;
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
        
        let suggestions = paper.ul('.suggestions');
        let container = paper.div('.autocomplete', input, suggestions);
        let debounceTimer;
        
        if (isLocal) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.toLowerCase().trim();
                suggestions.innerHTML = '';
                if (!value) return;
                
                let matches = inputEl.filter(item => item.toLowerCase().includes(value));
                matches.slice(0, 5).forEach(item => {
                    let li = paper.li(item, {
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
                            let li = paper.li(text, {
                                on: {
                                    click: () => {
                                        input.value = text;
                                        suggestions.innerHTML = '';
                                        if(paper.onSuggestion) paper.onSuggestion(item);
                                        
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
    paper.form = (...args) => {
        if (args.length > 0 && Array.isArray(args[0])) {
            let [fields, onSubmit] = args;
            let form = paper('form', '.paper-form');
            let formElements = [];
            
            fields.forEach(field => {
                let wrapper = paper.div('.form-field');
                let label = paper.label(field.label, {for: field.name});
                let input;
                
                if(field.type === 'select') {
                    input = paper.select({name: field.name, id: field.name});
                    field.options.forEach(opt => {
                        input.appendChild(paper.option(opt, {value: opt, textContent: opt}));
                    });
                } else if(field.type === 'textarea') {
                    input = paper.textarea('', {name: field.name, id: field.name, rows: field.rows || 3, placeholder: field.placeholder || ''});
                } else {
                    input = paper.input('', {type: field.type || 'text', name: field.name, id: field.name, placeholder: field.placeholder || ''});
                }
                
                wrapper.appendChild(label);
                wrapper.appendChild(input);
                form.appendChild(wrapper);
                formElements.push(input);
            });
            
            let submitBtn = paper.button('Submit', {type: 'submit', class: 'btn-primary'});
            form.appendChild(submitBtn);
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let data = {};
                formElements.forEach(el => { data[el.name] = el.value; });
                if(onSubmit) onSubmit(data);
            });
            
            return form;
        } else {
            return paper('form', ...args);
        }
    };

    /**
     * Glassmorphism Content Card.
     */
    paper.card = (title, content, footer = null) => {
        let headerEl = typeof title === 'string' ? paper.h3(title, '.card-title') : title;
        let contentEl = typeof content === 'string' ? paper.div(content, '.card-content') : content;
        
        let children = [headerEl, contentEl];
        if (footer) {
            let footerEl = typeof footer === 'string' ? paper.div(footer, '.card-footer') : footer;
            children.push(footerEl);
        }
        
        return paper.div('.card', ...children);
    };

    /**
     * Dialog modal frames with .show() and .hide() routines.
     */
    paper.modal = (content, title = "Modal") => {
        let modal = paper.div('.modal', {style: {display: 'none'}},
            paper.div('.modal-content',
                paper.div('.modal-header',
                    paper.h3(title),
                    paper.button('×', {
                        class: 'close-btn',
                        on: {click: () => modal.hide()}
                    })
                ),
                paper.div(content, '.modal-body')
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
    paper.modal.alert = (message, title = "Alert") => {
        if (typeof window !== 'undefined') {
            // Check if HTML5 Dialog is preferred, otherwise use window.alert
            if (window.alert) {
                window.alert(`${title}\n\n${message}`);
            }
        }
    };

    paper.modal.confirm = (message, callback) => {
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
    paper.toast = (message, type = 'info', duration = 3000, useNative = false) => {
        if (useNative && typeof window !== 'undefined' && 'Notification' in window) {
            const fireNative = () => {
                try {
                    new Notification('Paper Notification', {
                        body: message,
                        icon: 'https://eldrex.landecs.org/logo/eldrex-paper-js.png'
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
            let toast = paper.div(message, `.toast.toast-${type}`);
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
    paper.tabs = (tabs) => {
        let tabHeaders = paper.div('.tab-headers');
        let tabContents = paper.div('.tab-contents');
        let container = paper.div('.tabs', tabHeaders, tabContents);
        
        tabs.forEach((tab, index) => {
            let header = paper.button(tab.title, {
                class: index === 0 ? 'tab-header tab-active' : 'tab-header',
                on: {click: () => {
                    container.querySelectorAll('.tab-header').forEach((h, idx) => {
                        h.classList.toggle('tab-active', idx === index);
                    });
                    tabContents.innerHTML = '';
                    let contentNode = typeof tab.content === 'string' ? paper.div(tab.content) : tab.content;
                    tabContents.appendChild(contentNode);
                }}
            });
            tabHeaders.appendChild(header);
            
            if(index === 0) {
                let contentNode = typeof tab.content === 'string' ? paper.div(tab.content) : tab.content;
                tabContents.appendChild(contentNode);
            }
        });
        
        return container;
    };

    /**
     * Highly responsive Table renderer.
     */
    paper.table = (...args) => {
        if (args.length > 0 && Array.isArray(args[0]) && typeof args[0][0] === 'string') {
            let [headers, data] = args;
            let table = paper('table', '.data-table');
            let thead = paper.thead();
            let trHead = paper.tr();
            headers.forEach(h => {
                let formattedHeader = h.charAt(0).toUpperCase() + h.slice(1);
                trHead.appendChild(paper.th(formattedHeader));
            });
            thead.appendChild(trHead);
            table.appendChild(thead);
            
            let tbody = paper.tbody();
            data.forEach(row => {
                let tr = paper.tr();
                headers.forEach(header => {
                    let cellVal = row[header] !== undefined ? row[header] : '';
                    let td = paper.td();
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
            return paper('table', ...args);
        }
    };

    /**
     * Async data spinner fetch utility.
     */
    paper.fetch = async (url, options = {}) => {
        let loading = paper.div('.loading', 
            paper.div('.spinner'),
            paper.span('Fetching data...')
        );
        let container = paper.div(loading);
        
        setTimeout(async () => {
            try {
                let response = await fetch(url, options);
                let data = await response.json();
                container.innerHTML = '';
                if(options.onSuccess) {
                    options.onSuccess(container, data);
                } else {
                    container.appendChild(paper.pre(JSON.stringify(data, null, 2)));
                }
            } catch(e) {
                container.innerHTML = '';
                container.appendChild(paper.div('.error', `⚠️ Error: ${e.message}`));
            }
        }, 400);
        
        return container;
    };

    // ==========================================
    // 3. Official Plugins (Form, Table, Charts)
    // ==========================================

    paper.input = (type, placeholder, options = {}) => {
        return paper('input', `.input-${type}`, {
            type: type, 
            placeholder: placeholder, 
            ...options
        });
    };

    paper.simpleTable = (data) => {
        let table = paper('table', '.paper-table');
        
        // Add headers
        if (data.headers) {
            let thead = paper('thead');
            let tr = paper('tr');
            data.headers.forEach(header => {
                tr.appendChild(paper('th', header));
            });
            thead.appendChild(tr);
            table.appendChild(thead);
        }
        
        // Add rows
        if (data.rows) {
            let tbody = paper('tbody');
            data.rows.forEach(row => {
                let tr = paper('tr');
                row.forEach(cell => {
                    tr.appendChild(paper('td', String(cell)));
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
    paper.chart = (type, data, options = {}) => {
        let canvas = paper('canvas', {
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
    paper.components = {
        navbar: (logo, links) => {
            let nav = paper.nav('.navbar');
            let navLinks = paper.div('.nav-links');
            
            links.forEach(link => {
                navLinks.appendChild(paper.a(link.text, {
                    href: link.href, 
                    class: 'nav-link',
                    onclick: link.onclick || null
                }));
            });
            
            let logoEl = typeof logo === 'string' ? paper.div(logo, '.logo') : logo;
            nav.appendChild(logoEl);
            nav.appendChild(navLinks);
            return nav;
        },
        
        hero: (title, subtitle, buttonText, buttonAction) => {
            return paper.section('.hero',
                paper.h1(title, '.hero-title'),
                paper.p(subtitle, '.hero-subtitle'),
                paper.button(buttonText, {
                    class: 'hero-btn', 
                    on: {click: buttonAction}
                })
            );
        },
        
        sidebar: (items) => {
            let sidebar = paper.aside('.sidebar');
            items.forEach(item => {
                let name = typeof item === 'string' ? item : (item.text || '');
                let sidebarItem;
                
                if (typeof item === 'object' && item.icon) {
                    sidebarItem = paper.div('.sidebar-item', 
                        paper.icon(item.icon, { size: 16, style: { marginRight: '8px' } }),
                        paper.span(name)
                    );
                } else {
                    sidebarItem = paper.div('.sidebar-item', 
                        paper.span(name)
                    );
                }
                
                if (item.active) sidebarItem.classList.add('active');
                
                sidebarItem.addEventListener('click', () => {
                    sidebar.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
                    sidebarItem.classList.add('active');
                    if (item.onclick) item.onclick(name);
                    else paper.toast(`Navigated to: ${name}`, 'info');
                });
                
                sidebar.appendChild(sidebarItem);
            });
            return sidebar;
        },
        
        footer: (text, links = []) => {
            let footer = paper.footer('.footer');
            let linkContainer = paper.div('.footer-links');
            links.forEach(link => {
                linkContainer.appendChild(paper.a(link.text, {href: link.href}));
            });
            footer.appendChild(linkContainer);
            footer.appendChild(paper.p(text, '.footer-text'));
            return footer;
        },
        
        carousel: (images) => {
            let current = 0;
            let img = paper.img('', {src: images[0], class: 'carousel-img'});
            let prevBtn = paper.button('◀', {class: 'carousel-btn prev-btn'});
            let nextBtn = paper.button('▶', {class: 'carousel-btn next-btn'});
            
            let dotsContainer = paper.div('.carousel-dots');
            images.forEach((_, idx) => {
                let dot = paper.span('.carousel-dot');
                if (idx === 0) dot.classList.add('active');
                dot.onclick = () => goTo(idx);
                dotsContainer.appendChild(dot);
            });
            
            let container = paper.div('.carousel', prevBtn, img, nextBtn, dotsContainer);
            
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
    };
})();


// --- MODULE: plugins/animate.js ---
/**
 * PAPER ANIMATE
 * Zero-dependency hardware-accelerated animation engine.
 */
(function() {
    // Styles are bundled natively via build.js into paper-complete-styles

    const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
    
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

    // Override paper-core.js to intercept 'animate' attribute
    const originalPaper = window.paper;
    if (originalPaper) {
        // We will monkey-patch the original paper function or use a plugin hook
        // Since paper is a function, we can wrap it, or we can use a MutationObserver to catch new elements with animate attr.
        // Actually, the easiest way is to add a hook in paper-core.js. 
        // But to keep it self-contained, we can observe the DOM for [data-animate] or [animate].
        // Alternatively, since paper-core sets properties, we can just intercept `el.setAttribute('animate', val)`.
        
        let mo = new MutationObserver(mutations => {
            if (prefersReducedMotion) return;
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node instanceof Element) {
                        let elements = [node, ...node.querySelectorAll('[animate]')];
                        elements.forEach(el => {
                            if (el.hasAttribute('animate') && observer) {
                                let animType = el.getAttribute('animate');
                                el.dataset.animate = animType;
                                el.removeAttribute('animate'); // Clean DOM
                                el.classList.add('paper-animate-base');
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
    }
})();


// --- MODULE: plugins/charts.js ---
/**
 * PAPER CHARTS
 * Zero-dependency HTML5 Canvas charting plugin.
 */
(function() {
    paper.chart = (config) => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        
        let container = paper.div('.paper-chart-container', canvas, Object.assign({
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



    // Auto-inject Themeable Stylesheets
    if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.id = 'paper-complete-styles';
        style.textContent = `
:root {
    --paper-primary: #6366f1;
    --paper-primary-hover: #4f46e5;
    --paper-primary-light: rgba(99, 102, 241, 0.15);
    --paper-bg: #0f172a;
    --paper-surface: #1e293b;
    --paper-border: #334155;
    --paper-text: #f8fafc;
    --paper-text-muted: #94a3b8;
    --paper-success: #10b981;
    --paper-error: #ef4444;
    --paper-info: #0ea5e9;
    --paper-radius: 12px;
    --paper-font: system-ui, -apple-system, sans-serif;
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
    background: var(--paper-surface); 
    border: 1px solid var(--paper-border);
    border-radius: var(--paper-radius); 
    padding: 1.5rem; 
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
}
.card-title { margin-top: 0; margin-bottom: 0.75rem; color: var(--paper-text); }
.card-content { color: var(--paper-text-muted); font-size: 0.95rem; }
.card-footer { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--paper-border); color: var(--paper-text-muted); font-size: 0.85rem; }

/* Buttons */
.btn-primary { 
    background: var(--paper-primary); 
    color: white; 
    border: none; 
    padding: 10px 20px; 
    border-radius: 8px; 
    font-weight: 600; 
    cursor: pointer; 
    transition: background 0.2s; 
}
.btn-primary:hover { background: var(--paper-primary-hover); }

/* Inputs */
input[type="text"], input[type="email"], input[type="password"], textarea, select {
    background: var(--paper-bg);
    border: 1px solid var(--paper-border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--paper-text);
    font-family: inherit;
    outline: none;
    width: 100%;
    transition: border-color 0.2s;
}
input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus, textarea:focus, select:focus {
    border-color: var(--paper-primary);
}

/* Forms */
.paper-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-field { display: flex; flex-direction: column; gap: 0.5rem; }
.form-field label { font-size: 0.85rem; font-weight: 600; color: var(--paper-text-muted); }

/* Table styling */
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th, .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--paper-border); }
.data-table th { background: var(--paper-surface); color: var(--paper-text); font-weight: 600; }
.data-table td { color: var(--paper-text-muted); }

/* Suggestions autocomplete */
.autocomplete { position: relative; width: 100%; }
.suggestions { 
    position: absolute; top: 100%; left: 0; right: 0; 
    background: var(--paper-surface); border: 1px solid var(--paper-border); 
    border-radius: 8px; list-style: none; padding: 0; margin: 4px 0 0 0; 
    z-index: 1000; max-height: 200px; overflow-y: auto;
}
.suggestions li { padding: 10px 14px; cursor: pointer; color: var(--paper-text-muted); }
.suggestions li:hover { background: var(--paper-bg); color: var(--paper-text); }

/* Modal styles */
.modal { 
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px);
    display: flex; justify-content: center; align-items: center; z-index: 2000;
    opacity: 0; transition: opacity 0.3s ease;
}
.modal-show { opacity: 1; }
.modal-content { 
    background: var(--paper-surface); border: 1px solid var(--paper-border);
    border-radius: var(--paper-radius); width: 90%; max-width: 500px; 
    transform: translateY(20px); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-show .modal-content { transform: translateY(0); }
.modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--paper-border); display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; color: var(--paper-text); }
.close-btn { background: none; border: none; font-size: 1.5rem; color: var(--paper-text-muted); cursor: pointer; }
.close-btn:hover { color: var(--paper-text); }
.modal-body { padding: 1.5rem; color: var(--paper-text-muted); }

/* Toasts notifications */
.toast {
    position: fixed; bottom: 20px; right: 20px; 
    background: var(--paper-surface); border: 1px solid var(--paper-border);
    border-radius: 8px; padding: 12px 20px; color: var(--paper-text); 
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); z-index: 3000;
    transform: translateY(100px); opacity: 0; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s;
}
.toast-show { transform: translateY(0); opacity: 1; }
.toast-hide { transform: translateY(-100px); opacity: 0; }
.toast-success { border-left: 4px solid var(--paper-success); }
.toast-error { border-left: 4px solid var(--paper-error); }
.toast-info { border-left: 4px solid var(--paper-info); }

/* Tab components */
.tabs { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
.tab-headers { display: flex; border-bottom: 1px solid var(--paper-border); gap: 4px; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
.tab-headers::-webkit-scrollbar { display: none; }
.tab-header { 
    background: none; border: none; border-bottom: 2px solid transparent; 
    padding: 10px 16px; color: var(--paper-text-muted); cursor: pointer; font-weight: 600;
    transition: all 0.2s;
}
.tab-header:hover { color: var(--paper-text); }
.tab-active { color: var(--paper-primary); border-bottom-color: var(--paper-primary); }
.tab-contents { color: var(--paper-text-muted); line-height: 1.5; }

/* Loader components */
.loading { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 2rem; color: var(--paper-text-muted); }
.spinner { 
    width: 32px; height: 32px; border: 3px solid var(--paper-primary-light); 
    border-top-color: var(--paper-primary); border-radius: 50%; animation: spin 0.8s linear infinite; 
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Sidebars catalog navigation */
.sidebar { display: flex; flex-direction: column; gap: 4px; }
.sidebar-item { 
    padding: 10px 14px; border-radius: 6px; cursor: pointer; 
    color: var(--paper-text-muted); transition: all 0.2s; 
}
.sidebar-item:hover { background: var(--paper-primary-light); color: var(--paper-text); }
.sidebar-item.active { background: var(--paper-primary); color: white; }

/* Image carousel */
.carousel { position: relative; width: 100%; overflow: hidden; border-radius: var(--paper-radius); border: 1px solid var(--paper-border); aspect-ratio: 16/9; }
.carousel-img { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.2s ease-in-out; }
.carousel-btn { 
    position: absolute; top: 50%; transform: translateY(-50%); 
    background: rgba(15, 23, 42, 0.6); border: 1px solid var(--paper-border); 
    color: white; width: 36px; height: 36px; border-radius: 50%; 
    cursor: pointer; display: flex; justify-content: center; align-items: center; z-index: 10;
    transition: background 0.2s;
}
.carousel-btn:hover { background: var(--paper-primary); }
.prev-btn { left: 10px; }
.next-btn { right: 10px; }
.carousel-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
.carousel-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); cursor: pointer; }
.carousel-dot.active { background: white; width: 18px; border-radius: 4px; }

/* ==========================================
   BOOTSTRAP SPECIFICITY OVERRIDES
   ========================================== */
:root, [data-bs-theme="dark"] {
    --bs-body-bg: var(--paper-bg, #0f172a) !important;
    --bs-body-color: var(--paper-text, #f8fafc) !important;
    --bs-tertiary-bg: var(--paper-surface, #1e293b) !important;
    --bs-card-bg: var(--paper-surface, #1e293b) !important;
    --bs-card-color: var(--paper-text, #f8fafc) !important;
    --bs-border-color: var(--paper-border, #334155) !important;
}

.card {
    background: var(--paper-surface, #1e293b) !important;
    border: 1px solid var(--paper-border, #334155) !important;
    border-radius: var(--paper-radius, 12px) !important;
}

/* PAPER ANIMATE CSS */
.paper-animate-base {
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
.animate-fade-in { animation-name: paper-fade-in; }
@keyframes paper-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

.animate-slide-up { animation-name: paper-slide-up; }
@keyframes paper-slide-up {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-slide-down { animation-name: paper-slide-down; }
@keyframes paper-slide-down {
    from { opacity: 0; transform: translateY(-40px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-zoom-in { animation-name: paper-zoom-in; }
@keyframes paper-zoom-in {
    from { opacity: 0; transform: scale(0.85); }
    to { opacity: 1; transform: scale(1); }
}

.animate-bounce { animation-name: paper-bounce; animation-timing-function: cubic-bezier(0.28, 0.84, 0.42, 1); }
@keyframes paper-bounce {
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
    .paper-animate-base, .hover-grow, .hover-lift {
        animation: none !important;
        transition: none !important;
        transform: none !important;
        opacity: 1 !important;
    }
}


/* Paper.js Responsive Grid System */
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
`;
        document.head.appendChild(style);
        console.log("📄 Paper Complete styling successfully injected.");
    }

})(typeof window !== 'undefined' ? window : this);
