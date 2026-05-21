/**
 * PAPER STATIC SITE LIBRARY - Core Bundle
 * v3.0 - Agile Modular Architecture (Reactivity, Hash SPA Router, Math Logic, Persistent CRUD Store)
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
                  'input','textarea','select','option','ul','ol','li','table','thead','tbody','tr','td',
                  'th','form','label','section','article','header','footer','nav','aside','main','pre','code','hr','br',
                  'strong','em','canvas','iframe'];

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
                node.textContent = String(v);
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
                
                if (k.startsWith('on')) {
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


// --- MODULE: core/router.js ---
/**
 * PAPER ROUTER SYSTEM
 * 
 * Client-side single page app hash routing.
 */

let routes = {};
let routerContainer = null;

/**
 * Map a new hash SPA routing path to a component builder callback.
 * 
 * @param {string} path Anchor hash path (e.g. '/' or '/about')
 * @param {function} componentFn Callback rendering path components
 */
paper.route = (path, componentFn) => {
    routes[path] = componentFn;
};

/**
 * Initialize and mount the hash router container. Updates routing states on hashchanges.
 * 
 * @returns {HTMLDivElement} Dynamic router mount element
 */
paper.router = () => {
    routerContainer = paper.div({ style: { display: 'contents' } });
    let navigate = () => {
        let path = window.location.hash.slice(1) || '/';
        let routeFn = routes[path] || routes['*'] || (() => paper.div("404 - Not Found"));
        routerContainer.innerHTML = '';
        routerContainer.appendChild(routeFn());
    };
    window.addEventListener('hashchange', navigate);
    setTimeout(navigate, 0);
    return routerContainer;
};

/**
 * Navigate programmatically to any registered hash SPA route.
 * 
 * @param {string} path Routing target hash path
 */
paper.navigate = (path) => {
    window.location.hash = path;
};


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


// --- MODULE: core/crud.js ---
/**
 * PAPER CRUD STORAGE ENGINE
 * 
 * Auto-synchronizing reactive database store mapped directly to persistent LocalStorage.
 */

paper.crud = (name, initialData = []) => {
    let getStored = () => {
        try {
            return paper.storage(name) || initialData;
        } catch(e) {
            return initialData;
        }
    };

    let items = paper.state(getStored());

    let sync = () => {
        try {
            paper.storage(name, items.value);
        } catch(e) {
            console.warn("PaperStorageWarning: LocalStorage sync failed.", e);
        }
    };

    return {
        /**
         * Reactive state containing all database records.
         */
        items,

        /**
         * Appends a new item to the store and generates a unique Base36 string ID.
         * 
         * @param {Record<string, *>} item Payload fields dictionary
         * @returns {Record<string, *>} Newly registered record with id attached
         */
        create(item) {
            let newItem = { 
                id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5), 
                createdAt: new Date().toISOString(),
                ...item 
            };
            items.value = [...items.value, newItem];
            sync();
            return newItem;
        },

        /**
         * Finds a record by its unique ID.
         * 
         * @param {string} id Unique record ID
         * @returns {Record<string, *>|undefined} Target record or undefined if not found
         */
        read(id) {
            return items.value.find(item => item.id === id);
        },

        /**
         * Merges updates reactively into an existing record.
         * 
         * @param {string} id Unique record ID
         * @param {Record<string, *>} updates Target fields updates mapping
         */
        update(id, updates) {
            items.value = items.value.map(item => 
                item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
            );
            sync();
        },

        /**
         * Deletes a record from the database store reactively.
         * 
         * @param {string} id Unique record ID
         */
        delete(id) {
            items.value = items.value.filter(item => item.id !== id);
            sync();
        },

        /**
         * Completely resets the persistent local store database.
         */
        clear() {
            items.value = [];
            sync();
        }
    };
};



})(typeof window !== 'undefined' ? window : this);
