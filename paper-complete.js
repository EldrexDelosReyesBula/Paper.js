// PAPER COMPLETE - Full static site library
// v2.1 - Everything included, zero dependencies
// Custom-designed with sleek modern dark mode and premium variables, now equipped with automatic reactivity system!

window.paper = (function() {
    let activeEffect = null;
    let isDebug = false;

    // Levenshtein Spellcheck tag suggestions list
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
     * Compute Levenshtein distance.
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
     * Runtime tag checking.
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

    // Dynamic shortcuts for native tags
    tagList.forEach(tag => {
        paper[tag] = (...args) => paper(tag, ...args);
    });

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
     * Append a Paper tree component into a target DOM query host without wiping original contents.
     * 
     * @param {string} selector Identifier query mapping
     * @param {HTMLElement|DocumentFragment} component Rendered element tree
     * @returns {Element|null} Target host
     */
    paper.append = (selector, component) => {
        let target = document.querySelector(selector);
        if (target && component) {
            target.appendChild(component);
        }
        return target;
    };
    
    // Flexbox helpers
    paper.flex = {
        row: (...children) => paper.div('.flex-row', ...children),
        col: (...children) => paper.div('.flex-col', ...children),
        center: (...children) => paper.div('.flex-center', ...children),
        between: (...children) => paper.div('.flex-between', ...children),
        around: (...children) => paper.div('.flex-around', ...children),
        wrap: (...children) => paper.div('.flex-wrap', ...children)
    };
    
    /**
     * Generates a fully responsive multi-columns grid container.
     * 
     * @param {number} cols Number of columns (1-12)
     * @param {...*} children DOM child components
     * @returns {HTMLDivElement} Native grid container
     */
    paper.grid = (cols, ...children) => {
        let grid = paper.div('.grid', ...children);
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        return grid;
    };
    
    /**
     * Smart autocomplete input tag displaying recommendations on matching values.
     * 
     * @param {string[]} options Search index keywords lists
     * @param {string} [placeholder="Search..."] Text placeholders
     * @returns {HTMLDivElement} Autocomplete wrapper
     */
    paper.autoComplete = (options, placeholder = "Search...") => {
        let input = paper.input('', {type: 'text', placeholder: placeholder, id: 'ac-input'});
        let suggestions = paper.ul('.suggestions');
        let container = paper.div('.autocomplete', input, suggestions);
        
        input.addEventListener('input', (e) => {
            let value = e.target.value.toLowerCase();
            suggestions.innerHTML = '';
            
            if(!value) return;
            
            let matches = options.filter(opt => opt.toLowerCase().includes(value));
            matches.slice(0, 5).forEach(match => {
                let li = paper.li(match, {
                    on: {click: () => {
                        input.value = match;
                        suggestions.innerHTML = '';
                        let ev = new CustomEvent('change', { detail: match });
                        input.dispatchEvent(ev);
                    }}
                });
                suggestions.appendChild(li);
            });
        });
        
        document.addEventListener('click', (e) => {
            if(!container.contains(e.target)) suggestions.innerHTML = '';
        });
        
        return container;
    };
    
    /**
     * Query asynchronous search queries directly against online APIs.
     * 
     * @param {string} apiUrl Endpoint endpoint path
     * @param {string} [placeholder="Type to search..."] Text placeholders
     * @returns {HTMLDivElement} Dynamic autocomplete suggest wrapper
     */
    paper.autoSuggest = async (apiUrl, placeholder = "Type to search...") => {
        let input = paper.input('', {type: 'text', placeholder: placeholder});
        let suggestions = paper.ul('.suggestions');
        let container = paper.div('.autocomplete', input, suggestions);
        let debounceTimer;
        
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
                            on: {click: () => {
                                input.value = text;
                                suggestions.innerHTML = '';
                                if(paper.onSuggestion) paper.onSuggestion(item);
                                
                                let ev = new CustomEvent('select', { detail: item });
                                container.dispatchEvent(ev);
                            }}
                        });
                        suggestions.appendChild(li);
                    });
                } catch(e) { console.error(e); }
            }, 300);
        });
        
        document.addEventListener('click', (e) => {
            if(!container.contains(e.target)) suggestions.innerHTML = '';
        });
        
        return container;
    };
    
    /**
     * Automatic rapid form builder creating input labels and submission listeners.
     * 
     * @param {Array} fields Scope config fields mapping labels and names
     * @param {function} onSubmit Success submission callback payload
     * @returns {HTMLFormElement} Complete styled form
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
     * Styled Card wrapper.
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
     * Create interactive popups dialog modal.
     * 
     * @param {HTMLElement|string} content Dialog layout contents
     * @param {string} [title="Modal"] Dialog header title
     * @returns {HTMLDivElement} Modal instance with .show() and .hide() APIs
     */
    paper.modal = (content, title = "Modal") => {
        let modal = paper.div('.modal', {style: {display: 'none'}},
            paper.div('.modal-content',
                paper.div('.modal-header',
                    paper.h3(title),
                    paper.button('×', {
                        class: 'close-btn',
                        on: {click: () => modal.style.display = 'none'}
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
    
    /**
     * Triggers dynamic hover toasts notifications on screen borders.
     * 
     * @param {string} message Alert description
     * @param {('info'|'success'|'error')} [type='info'] Notification context type
     * @param {number} [duration=3000] Milliseconds showing alert
     */
    paper.toast = (message, type = 'info', duration = 3000) => {
        let toast = paper.div(message, `.toast.toast-${type}`);
        document.body.appendChild(toast);
        
        toast.offsetHeight; // trigger reflow
        toast.classList.add('toast-show');
        
        setTimeout(() => {
            toast.classList.remove('toast-show');
            toast.classList.add('toast-hide');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    };
    
    /**
     * Multi-tab visual container.
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
     * Creates gorgeous high-fidelity data tables.
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
                    if (cellVal instanceof HTMLElement) {
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
     * Async loader fetching API requests completely equipped with load spinners.
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
    
    // Pre-built components library
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

    // SPA routing system
    let routes = {};
    let routerContainer = null;
    
    /**
     * Map a new hash SPA routing path to a component builder callback.
     */
    paper.route = (path, componentFn) => {
        routes[path] = componentFn;
    };
    
    /**
     * Initialize and mount the hash router container.
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
     */
    paper.navigate = (path) => {
        window.location.hash = path;
    };

    /**
     * Inject dynamic CSS rule scopes directly into the Document Head style blocks.
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
     */
    paper.component = (name, renderFn) => {
        paper[name] = (...args) => renderFn(...args);
    };

    /**
     * Wraps child trees in highly efficient native DocumentFragments to avoid paint layout reflows.
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
     */
    paper.html = (htmlString) => {
        let template = document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content.cloneNode(true);
    };

    /**
     * Enable/Disable spelling checker rules and trace diagnostics console metrics.
     */
    paper.debug = (enable) => {
        isDebug = enable;
        if (enable) console.log("📄 Paper Debug Mode Enabled.");
    };

    /**
     * Inspect components output, returning raw clean HTML layout formats.
     */
    paper.inspect = (component) => {
        let container = document.createElement('div');
        container.appendChild(component.cloneNode(true));
        return container.innerHTML;
    };

    /**
     * CSS-based opacity fadeIn transactions.
     */
    paper.fadeIn = (el, duration = 400) => {
        el.style.opacity = '0';
        el.style.transition = `opacity ${duration}ms ease`;
        requestAnimationFrame(() => { el.style.opacity = '1'; });
    };
    
    /**
     * Triggers fadeIn slide-out transitions, automatically removing the target node.
     */
    paper.fadeOut = (el, duration = 400) => {
        el.style.opacity = '1';
        el.style.transition = `opacity ${duration}ms ease`;
        requestAnimationFrame(() => { el.style.opacity = '0'; });
        setTimeout(() => el.remove(), duration);
    };
    
    /**
     * Triggers fully responsive micro-transitions for specified target layout scopes.
     */
    paper.animate = (el, properties, duration = 400) => {
        el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        requestAnimationFrame(() => {
            Object.assign(el.style, properties);
        });
    };

    /**
     * Read or store key-value values automatically to LocalStorage.
     */
    paper.storage = (key, val) => {
        if (typeof val === 'undefined') {
            let data = localStorage.getItem(key);
            try { return JSON.parse(data); } catch(e) { return data; }
        }
        localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
    };
    paper.copy = (text) => navigator.clipboard.writeText(text);
    paper.delay = (ms) => new Promise(res => setTimeout(res, ms));

    /**
     * Plugin system
     */
    paper.plugins = {};
    paper.use = (name, plugin) => {
        if (typeof name === 'function') {
            name(paper);
        } else {
            paper.plugins[name] = plugin(paper);
        }
        return paper;
    };

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
    
    return paper;
})();

// Auto-inject Themeable CSS
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
    .tab-headers { display: flex; border-bottom: 1px solid var(--paper-border); gap: 4px; }
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
`;
document.head.appendChild(style);
