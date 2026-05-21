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
        let input = typeof inputEl === 'string' ? paper.input('', {type: 'text', placeholder: inputEl}) : inputEl;
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

    /**
     * Micro-toast notification alerts.
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
