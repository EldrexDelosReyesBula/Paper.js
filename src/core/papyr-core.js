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
