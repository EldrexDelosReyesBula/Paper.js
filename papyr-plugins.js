// PAPER OFFICIAL PLUGINS BUNDLE
// Registers the official forms, tables, and micro-charts plugins

(function(window) {
    // Check if papyr exists
    if (!window.papyr) {
        console.warn("Papyr library not found. Please load papyr.js before loading papyr-plugins.js.");
    }
    
    // In-lined Plugin Implementations for single script distribution
    
    // 1. Forms Plugin
    function formPlugin(paper) {
        papyr.input = (type, placeholder, options = {}) => {
            return papyr('input', `.input-${type}`, {
                type: type, 
                placeholder: placeholder, 
                ...options
            });
        };
        
        papyr.form = (...fields) => {
            let form = papyr('form', '.form');
            fields.forEach(f => {
                if (f.text && f.placeholder) {
                    form.appendChild(papyr.input(f.text, f.placeholder));
                } else if (f instanceof HTMLElement) {
                    form.appendChild(f);
                }
            });
            form.appendChild(papyr('button', 'Submit', { type: 'submit' }));
            return form;
        };
    }
    
    // 2. Tables Plugin
    function tablePlugin(paper) {
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
    }
    
    // 3. Charts Plugin (Canvas Based)
    function chartsPlugin(paper) {
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
    }
    
    // Register official plugins automatically if papyr is present
    if (window.papyr) {
        window.papyr.use(formPlugin);
        window.papyr.use(tablePlugin);
        window.papyr.use(chartsPlugin);
        console.log("📄 Papyr plugins loaded and registered successfully!");
    }
    
    // Attach to global window
    window.papyrPlugins = {
        forms: formPlugin,
        tables: tablePlugin,
        charts: chartsPlugin
    };

})(typeof window !== 'undefined' ? window : this);
