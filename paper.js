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
                      'th','form','label','section','article','header','footer','nav','aside','main','pre','code','hr','br',
                      'strong','em','canvas','iframe'];

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
                let hasColon = str.includes(':') && !str.startsWith('http://') && !str.startsWith('https://');
                
                if (str.startsWith('.')) {
                    if (hasColon) {
                        let colonIdx = str.indexOf(':');
                        let selector = str.substring(0, colonIdx);
                        let text = str.substring(colonIdx + 1);
                        el.className = (el.className ? el.className + ' ' : '') + selector.slice(1).split('.').join(' ');
                        el.appendChild(document.createTextNode(text));
                    } else {
                        el.className = (el.className ? el.className + ' ' : '') + str.slice(1).split('.').join(' ');
                    }
                }
                else if (str.startsWith('#')) {
                    if (hasColon) {
                        let colonIdx = str.indexOf(':');
                        let selector = str.substring(0, colonIdx);
                        let text = str.substring(colonIdx + 1);
                        el.id = selector.slice(1);
                        el.appendChild(document.createTextNode(text));
                    } else {
                        el.id = str.slice(1);
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
        star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    };

    /**
     * Generates a modern inline vector SVG element for the preloaded system icons.
     * 
     * @param {string} name Preloaded icon keyword key
     * @param {Record<string, *>} [options] Custom configurations like size, color, strokeWidth
     * @returns {SVGElement} Instantiated vector SVG node
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
        if (options.class) svg.className = options.class;
        
        let inner = icons[name] || '';
        if (strokeWidth !== 2) {
            inner = inner.replace(/stroke-width="2"/g, `stroke-width="${strokeWidth}"`);
        }
        svg.innerHTML = inner;
        return svg;
    };

    // Dynamic shortcuts for native tags
    tagList.forEach(tag => {
        paper[tag] = (...args) => paper(tag, ...args);
    });

    window.paper = paper;
})(typeof window !== 'undefined' ? window : this);
