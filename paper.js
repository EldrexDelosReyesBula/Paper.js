/**
 * PAPER - HTML Made Stupid Simple
 * Core Library v2.1
 * 
 * Write clean, reactive, and safer HTML templates using pure JavaScript.
 */

(function(window) {
    let activeEffect = null;
    let isDebug = false;

    // Levenshtein Spellcheck tag suggestions list
    const tagList = ['div','span','p','h1','h2','h3','h4','h5','h6','button','a','img',
                      'input','textarea','select','option','ul','ol','li','table','thead','tbody','tr','td',
                      'th','form','label','section','article','header','footer','nav','aside','main','pre','code','hr','br'];

    /**
     * Parse classes from arrays or dictionaries into a clean space-separated classname list.
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
     * Run runtime spelling validations on tag creators.
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
     * @param {string} tag Native HTML element tag (e.g. 'div', 'span', 'button', 'input')
     * @param {...*} args Class list starting with '.', ID starting with '#', JSDict mappings, functions, states or recursive children elements
     * @returns {HTMLElement} Native, styled HTML Element
     */
    function paper(tag, ...args) {
        checkTag(tag);
        let el = document.createElement(tag);
        let content = '';

        let appendChild = (child) => {
            if (child === null || child === undefined) return;
            
            // Check if it's a reactive state object (subscribe method)
            if (typeof child === 'object' && typeof child.subscribe === 'function') {
                let node = document.createTextNode('');
                el.appendChild(node);
                child.subscribe(v => {
                    if (v instanceof HTMLElement || v instanceof DocumentFragment) {
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
            else if (child instanceof HTMLElement || child instanceof DocumentFragment) {
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
                if (str.startsWith('.')) {
                    el.className = (el.className ? el.className + ' ' : '') + str.slice(1).split('.').join(' ');
                }
                else if (str.startsWith('#')) {
                    el.id = str.slice(1);
                }
                else if (str.includes(':') && !str.startsWith('http://') && !str.startsWith('https://')) {
                    let colonIdx = str.indexOf(':');
                    let t = str.substring(0, colonIdx);
                    let [_, ...rest] = str.split(':');
                    let c = rest.join(':');
                    let childEl = document.createElement(t);
                    childEl.textContent = c; // textContent instead of innerHTML for XSS protection
                    el.appendChild(childEl);
                }
                else {
                    content += str;
                }
            }
        };

        args.forEach(arg => {
            if (typeof arg === 'object' && !(arg instanceof HTMLElement) && !(arg instanceof DocumentFragment) && !Array.isArray(arg) && typeof arg.subscribe !== 'function') {
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

        if (content) el.textContent = content; // XSS protection
        return el;
    }

    /**
     * Creates an auto-tracking reactive state variable.
     * 
     * @example
     * let count = paper.state(0);
     * paper.button(() => `Count: ${count.value}`, { onclick: () => count.value++ })
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
     * @example
     * let count = paper.state(5);
     * let doubled = paper.computed(() => count.value * 2);
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
     * @example
     * paper.if(loggedIn, paper.h1("Welcome!"), paper.button("Log In"))
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

    // Routing System
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

    /**
     * Inject dynamic CSS rule scopes directly into the Document Head style blocks.
     * 
     * @param {string} selector CSS identifier query (e.g. '.btn-primary' or '#card')
     * @param {Record<string, string>} styles Dictionary containing property key-value assignments
     */
    paper.css = (selector, styles) => {
        let styleEl = document.getElementById('paper-global-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'paper-global-styles';
            document.head.appendChild(styleEl);
        }
        let cssText = `${selector} {\n`;
        Object.entries(styles).forEach(([k, v]) => {
            let cssKey = k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
            cssText += `  ${cssKey}: ${v};\n`;
        });
        cssText += '}\n';
        styleEl.appendChild(document.createTextNode(cssText));
    };

    /**
     * Create component template tags under paper namespace.
     * 
     * @param {string} name Namespace keyword identifier
     * @param {function} renderFn Rendering callback
     */
    paper.component = (name, renderFn) => {
        paper[name] = (...args) => renderFn(...args);
    };

    /**
     * Wraps child trees in highly efficient native DocumentFragments to avoid paint layout reflows.
     * 
     * @param {...*} children DOM components or standard content strings
     * @returns {DocumentFragment} Lightweight parent fragment
     */
    paper.fragment = (...children) => {
        let frag = document.createDocumentFragment();
        children.forEach(child => {
            if (Array.isArray(child)) {
                child.forEach(c => {
                    if (c instanceof HTMLElement) frag.appendChild(c);
                    else frag.appendChild(document.createTextNode(String(c)));
                });
            } else if (child instanceof HTMLElement || child instanceof DocumentFragment) {
                frag.appendChild(child);
            } else if (child !== null && child !== undefined) {
                frag.appendChild(document.createTextNode(String(child)));
            }
        });
        return frag;
    };

    /**
     * Safely parse raw string blocks into full native DocumentFragments.
     * 
     * @param {string} htmlString Layout template strings
     * @returns {DocumentFragment} Compiled layout fragment
     */
    paper.html = (htmlString) => {
        let template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content.cloneNode(true);
    };

    /**
     * Enable/Disable spelling checker rules and trace diagnostics console metrics.
     * 
     * @param {boolean} enable Active toggle flag
     */
    paper.debug = (enable) => {
        isDebug = enable;
        if (enable) console.log("📄 Paper Debug Mode Enabled.");
    };

    /**
     * Inspect components output, returning raw clean HTML layout formats. Excellent for educational debugging.
     * 
     * @param {HTMLElement} component Target DOM node to inspect
     * @returns {string} Stringified visual HTML markup
     */
    paper.inspect = (component) => {
        let container = document.createElement('div');
        container.appendChild(component.cloneNode(true));
        return container.innerHTML;
    };

    /**
     * Smoothly triggers CSS-based opacity fadeIn transactions.
     * 
     * @param {HTMLElement} el Target DOM node
     * @param {number} [duration=400] Milliseconds transition timer
     */
    paper.fadeIn = (el, duration = 400) => {
        el.style.opacity = '0';
        el.style.transition = `opacity ${duration}ms ease`;
        requestAnimationFrame(() => { el.style.opacity = '1'; });
    };

    /**
     * Triggers fadeIn slide-out transitions, automatically removing the target node.
     * 
     * @param {HTMLElement} el Target DOM node
     * @param {number} [duration=400] Milliseconds transition timer
     */
    paper.fadeOut = (el, duration = 400) => {
        el.style.opacity = '1';
        el.style.transition = `opacity ${duration}ms ease`;
        requestAnimationFrame(() => { el.style.opacity = '0'; });
        setTimeout(() => el.remove(), duration);
    };

    /**
     * Triggers fully responsive micro-transitions for specified target layout scopes.
     * 
     * @param {HTMLElement} el Target DOM node
     * @param {Record<string, string>} properties Selector target styling values
     * @param {number} [duration=400] Milliseconds transition timer
     */
    paper.animate = (el, properties, duration = 400) => {
        el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        requestAnimationFrame(() => {
            Object.assign(el.style, properties);
        });
    };

    /**
     * Read or store key-value values automatically to LocalStorage.
     * 
     * @param {string} key Store registry lookup key
     * @param {*} [val] Store value payload (serializes Objects automatically)
     */
    paper.storage = (key, val) => {
        if (typeof val === 'undefined') {
            let data = localStorage.getItem(key);
            try { return JSON.parse(data); } catch(e) { return data; }
        }
        localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
    };

    /**
     * Copy any content text directly to user clipboards.
     * 
     * @param {string} text Text content payload
     * @returns {Promise<void>} Clipboard promise
     */
    paper.copy = (text) => navigator.clipboard.writeText(text);

    /**
     * Promises-wrapped async timer delays. Great for fetch mockups and loaders.
     * 
     * @param {number} ms Millisecond delay values
     * @returns {Promise<void>} Timer promise
     */
    paper.delay = (ms) => new Promise(res => setTimeout(res, ms));

    /**
     * Mount any Paper tree component into a target DOM query root.
     * 
     * @param {string} selector Identifier query mapping selector (e.g. '#app')
     * @param {HTMLElement|DocumentFragment} component Rendered element tree
     * @returns {Element|null} Target mounted host element
     */
    paper.mount = (selector, component) => {
        let target = document.querySelector(selector);
        if (target) {
            target.innerHTML = '';
            target.appendChild(component);
        }
        return target;
    };

    /**
     * Register external plugins into the core Paper prototype bindings.
     * 
     * @param {function} plugin Plugin definition registry callback
     */
    paper.use = (plugin) => plugin(paper);

    /**
     * Dynamically inject CSS and UI frameworks (Tailwind or Bootstrap) into page contexts.
     * Makes static sites extremely fast and zero-config upon linking paper.js.
     * 
     * @param {('tailwind'|'bootstrap')} framework Styling framework target name
     */
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
            document.head.appendChild(link);
        }
    };

    // Dynamic shortcuts for native tags
    tagList.forEach(tag => {
        paper[tag] = (...args) => paper(tag, ...args);
    });

    window.paper = paper;
})(typeof window !== 'undefined' ? window : this);
