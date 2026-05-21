// app.js
// Entire visual landing page and playground built dynamically using Paper.js components!
// Living proof of Paper's production-grade speed, reactivity, and aesthetic elegance.

(function() {
    // 1. Live Sandbox templates covering reactive state, conditional rendering, forms, Bootstrap, and Tailwind CSS.
    const TEMPLATES = {
        reactive: `// 🔋 Vue/SolidJS-style Automatic Dependency-Tracking Reactivity System!
let count = paper.state(0);
let double = paper.computed(() => count.value * 2);

let app = paper.flex.col(
    paper.h3("🔋 Automatic Reactive Counter", { style: { margin: '0', color: '#fff' } }),
    paper.p(() => "Reactive Count: " + count.value, { style: { fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' } }),
    paper.p(() => "Computed Double: " + double.value, { style: { fontSize: '0.95rem', color: '#a5b4fc' } }),
    paper.flex.row(
        paper.button("Increment Count", {
            class: 'btn-primary',
            onclick: () => count.value++
        }),
        paper.button("Decrement Count", {
            style: { background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fda4af', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
            onclick: () => count.value--
        })
    )
);

return app;`,

        conditional: `// 🔒 Conditional rendering with paper.if() swapper!
let loggedIn = paper.state(false);

let app = paper.flex.col(
    paper.h3("🔒 Conditional Rendering", { style: { margin: '0', color: '#fff' } }),
    paper.p("Toggle the user auth state to view conditional rendering templates natively."),
    paper.if(
        loggedIn,
        () => paper.div(
            ".card",
            paper.h4("Welcome Back, Developer! 🔓", { style: { margin: '0 0 10px 0', color: '#10b981' } }),
            paper.p("You are currently authenticated in this reactive conditional view.", { style: { margin: '0' } }),
            { style: { background: 'rgba(16, 185, 129, 0.05)', borderColor: '#10b981', margin: '0' } }
        ),
        () => paper.div(
            ".card",
            paper.h4("Access Restricted 🔒", { style: { margin: '0 0 10px 0', color: '#rose' } }),
            paper.p("Please log in to explore developer state variables.", { style: { margin: '0' } }),
            { style: { background: 'rgba(244, 63, 94, 0.05)', borderColor: '#f43f5e', margin: '0' } }
        )
    ),
    paper.button(() => loggedIn.value ? "Log Out Account" : "Authorize Dev Account ⚡", {
        class: 'btn-primary',
        onclick: () => {
            loggedIn.value = !loggedIn.value;
            paper.toast(loggedIn.value ? "Logged In! Welcome" : "Logged Out safely", loggedIn.value ? "success" : "info");
        }
    })
);

return app;`,

        todo: `// 📝 Write HTML like you're texting!
let app = paper.flex.col(
    paper.h3("📝 My Paper Todos", { style: { margin: '0', color: '#fff' } }),
    paper.flex.row(
        paper.input("text", "What needs doing?", { id: 'new-todo', style: { flex: 1 } }),
        paper.button("Add Task", {
            class: 'btn-primary',
            onclick: () => {
                let input = document.getElementById('new-todo');
                if (!input.value.trim()) return paper.toast("Please type a task!", "error");
                
                let list = document.querySelector('.todo-list');
                let item = paper.li(
                    ".todo-item",
                    paper.flex.between(
                        paper.span(input.value),
                        paper.button("×", {
                            style: { background: 'none', border: 'none', color: '#f43f5e', fontSize: '1.2rem', cursor: 'pointer', padding: '0' },
                            onclick: (e) => e.target.closest('.todo-item').remove()
                        })
                    ),
                    { style: { padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', margin: '4px 0' } }
                );
                list.appendChild(item);
                input.value = '';
                paper.toast("Task added! 🚀", "success");
            }
        })
    ),
    paper.ul(".todo-list", { style: { listStyle: 'none', padding: '0', margin: '0' } })
);

return app;`,

        bootstrap: `// 🌟 Dynamic Bootstrap CDN Injection & Styling Integration!
paper.loadFramework('bootstrap');

let app = paper.div(".container.py-3",
    paper.div(".alert.alert-primary", 
        paper.h4(".alert-heading:Bootstrap Integration! 🌟"),
        paper.p("This element is styled completely with Bootstrap classes dynamically loaded from a CDN at runtime!"),
        paper.hr(),
        paper.p(".mb-0:Paper maps class dot selectors directly to class names instantly.")
    ),
    paper.flex.row(
        paper.button(".btn.btn-outline-primary:Primary Action", {
            onclick: () => paper.toast("Bootstrap Primary Clicked!", "success")
        }),
        paper.button(".btn.btn-danger:Delete Row", {
            onclick: () => paper.toast("Danger Triggered!", "error")
        })
    )
);

return app;`,

        tailwind: `// ⚡ Ultra-fast Tailwind Play CDN Integration!
paper.loadFramework('tailwind');

let toggleState = paper.state(false);

let app = paper.div(".bg-slate-900.p-6.rounded-2xl.shadow-xl.border.border-slate-800.text-slate-100.max-w-md.mx-auto",
    paper.h3(".text-2xl.font-extrabold.text-transparent.bg-clip-text.bg-gradient-to-r.from-cyan-400.to-indigo-400.mb-2:Tailwind CSS Mode"),
    paper.p(".text-slate-400.text-sm.mb-4:Write reactive utility-first styles directly in Paper dot syntax. No compilation required!"),
    
    paper.if(
        toggleState,
        paper.div(".bg-cyan-500/10.border.border-cyan-500/30.p-4.rounded-xl.mb-4",
            paper.h4(".text-cyan-400.font-semibold:⚡ Active State Widget"),
            paper.p(".text-xs.text-cyan-300:Reactive properties render on-the-fly inside Tailwind layouts seamlessly.")
        )
    ),
    
    paper.button(".w-full.bg-gradient-to-r.from-cyan-500.to-indigo-500.hover:from-cyan-600.hover:to-indigo-600.text-white.font-bold.py-2.px-4.rounded-xl.shadow-lg.shadow-indigo-500/20.transition-all:Toggle Reactive Widget", {
        onclick: () => toggleState.value = !toggleState.value
    })
);

return app;`
    };

    // Backup endpoints data
    const BACKUP_QUOTES = [
        { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
        { text: "Make it simple, but significant.", author: "Don Draper" },
        { text: "Complexity is your enemy. Any fool can make something complicated.", author: "Richard Branson" }
    ];
    const BACKUP_PRODUCTS = [
        { title: "Premium Leather Backpack", price: 89.99 },
        { title: "Minimalist Wrist Watch", price: 149.50 }
    ];

    // Selected state metrics
    let selectedCatalogKey = 'tabs';
    let ringPercent = paper.state(68);

    // ==========================================
    // MODULE COMPONENT GENERATORS
    // ==========================================

    // 1. Radiant Hero
    const Hero = () => {
        return paper.div(".hero-wrapper.container",
            paper.img({ 
                src: 'https://eldrex.landecs.org/logo/eldrex-paper-js.png', 
                alt: 'Paper.js Logo',
                style: { 
                    maxHeight: '90px', 
                    marginBottom: '2rem', 
                    display: 'block', 
                    marginLeft: 'auto', 
                    marginRight: 'auto',
                    filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.4))'
                } 
            }),
            paper.span(".hero-tag", 
                paper.icon('bolt', { size: 14, style: { marginRight: '4px' } }),
                "v3.0 - Agile Architecture & Mathematical CRUD"
            ),
            paper.h1(".hero-title.glow-text", 
                "Write HTML Like You're", paper.br(), "Writing a Text Message."
            ),
            paper.p(".hero-subtitle",
                "Meet ", paper.strong("Paper"), ", the dead-simple JavaScript library that compiles direct reactive UI trees without any bundlers, virtual DOM reflows, or terminal setups."
            ),
            paper.flex.center(
                paper.a({ href: '#playground', class: 'gradient-btn' },
                    paper.span("Launch Sandbox Studio"),
                    paper.icon('arrowRight', { size: 16 })
                ),
                paper.a({ href: 'docs.html', class: 'toolbar-btn', style: { padding: '12px 24px', borderRadius: 'var(--radius-md)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' } },
                    paper.icon('book', { size: 16 }),
                    "Library Documentation"
                )
            ),
            paper.div(".hero-stats",
                paper.div(".stat-item",
                    paper.icon('lock', { size: 28, color: 'var(--teal)', style: { marginBottom: '8px' } }),
                    paper.span(".stat-val:Safer DOM"),
                    paper.span(".stat-lbl:XSS textContent Injection")
                ),
                paper.div(".stat-item",
                    paper.icon('bolt', { size: 28, color: 'var(--primary)', style: { marginBottom: '8px' } }),
                    paper.span(".stat-val:Automatic"),
                    paper.span(".stat-lbl:Reactive States & Computeds")
                ),
                paper.div(".stat-item",
                    paper.icon('package', { size: 28, color: '#38bdf8', style: { marginBottom: '8px' } }),
                    paper.span(".stat-val:0 NPM"),
                    paper.span(".stat-lbl:Copy-Paste Standalone JS")
                )
            )
        );
    };

    // 2. Sandbox Studio Workspace
    const SandboxStudio = () => {
        // Overlay compiler status reactive state
        let consoleMsg = paper.state("✓ Compilation successful. Zero parser warnings.");
        let isConsoleError = paper.state(false);

        // Render compilation sandbox logic
        const runSandbox = () => {
            const code = document.getElementById('sandbox-editor').value;
            const preview = document.getElementById('sandbox-preview');
            const errorBox = document.getElementById('sandbox-error');
            const htmlInspect = document.getElementById('sandbox-html-inspect');

            if (!code.includes('paper.buton')) {
                consoleMsg.value = "✓ Compilation successful. Zero parser warnings.";
                isConsoleError.value = false;
            }

            try {
                errorBox.style.display = 'none';
                preview.innerHTML = '';

                // Capture local mount hooks inside sandbox context
                const originalMount = window.paper.mount;
                window.paper.mount = (selector, component) => {
                    if (selector === '#sandbox-preview' || selector === '.preview-container') {
                        preview.innerHTML = '';
                        preview.appendChild(component);
                    } else {
                        let target = preview.querySelector(selector) || document.querySelector(selector);
                        if (target) {
                            target.innerHTML = '';
                            target.appendChild(component);
                        }
                    }
                };

                const runFn = new Function('paper', code);
                const result = runFn(window.paper);

                if (result instanceof HTMLElement || result instanceof DocumentFragment) {
                    preview.innerHTML = '';
                    preview.appendChild(result);
                    
                    // Render HTML inspect visualizer
                    htmlInspect.textContent = window.paper.inspect(result);
                    
                    let observer = new MutationObserver(() => {
                        htmlInspect.textContent = window.paper.inspect(result);
                    });
                    observer.observe(preview, { childList: true, subtree: true, characterData: true });
                }
                window.paper.mount = originalMount;
            } catch (err) {
                errorBox.textContent = `⚠️ Compiler Error: ${err.message}`;
                errorBox.style.display = 'block';
            }
        };

        const loadTemplate = (key, event) => {
            document.querySelectorAll('.editor-toolbar .toolbar-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            document.getElementById('sandbox-editor').value = TEMPLATES[key];
            runSandbox();
        };

        // Typo test callback
        const triggerTypoTest = () => {
            consoleMsg.value = "✓ Compilation successful. Zero parser warnings.";
            isConsoleError.value = false;
            document.getElementById('sandbox-editor').value = `// Testing Levenshtein spell-check tag warnings!
let typoEl = paper.buton("Click me"); // Deliberate spelling error "buton"
return typoEl;`;
            runSandbox();
        };

        // Listen for Levenshtein warnings
        window.addEventListener('paper-warning', (e) => {
            isConsoleError.value = true;
            consoleMsg.value = `⚠️ PaperError: Unknown tag "${e.detail.tag}".${e.detail.suggestion ? ` Did you mean "${e.detail.suggestion}"?` : ''}`;
        });

        // Trigger compilation on startup
        setTimeout(runSandbox, 50);

        return paper.div("#playground.container", { style: { paddingTop: '3rem' } },
            paper.h2(".section-title:Studio Workspace"),
            paper.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '2rem', maxWidth: '600px' } },
                "Experiment with Paper's automatic reactivity, conditional rendering, and dynamic Tailwind & Bootstrap integrations. Modify the source code and watch it compile instantly."
            ),
            
            paper.div(".studio-grid",
                // Left Panel: Code editor
                paper.div(".studio-panel.glass-panel",
                    paper.div(".panel-header",
                        paper.span(".panel-title",
                            paper.span(".dot-status"),
                            paper.span("paper-editor.js")
                        ),
                        paper.div(".editor-toolbar",
                            paper.button(".toolbar-btn.active:Reactive State", { onclick: (e) => loadTemplate('reactive', e) }),
                            paper.button(".toolbar-btn:Conditional Render", { onclick: (e) => loadTemplate('conditional', e) }),
                            paper.button(".toolbar-btn:Todo List", { onclick: (e) => loadTemplate('todo', e) }),
                            paper.button(".toolbar-btn:Bootstrap", { onclick: (e) => loadTemplate('bootstrap', e) }),
                            paper.button(".toolbar-btn:Tailwind CSS", { onclick: (e) => loadTemplate('tailwind', e) })
                        )
                    ),
                    paper.div(".editor-body",
                        paper.textarea("#sandbox-editor.code-textarea", {
                            spellcheck: false,
                            oninput: runSandbox,
                            textContent: TEMPLATES.reactive
                        })
                    ),
                    // Console panel
                    paper.div("#sandbox-console-log", {
                        style: () => ({
                            background: isConsoleError.value ? 'rgba(244, 63, 94, 0.15)' : 'rgba(10, 14, 27, 0.95)',
                            borderTop: '1px solid var(--border-glow)',
                            padding: '10px 16px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            color: isConsoleError.value ? '#fda4af' : '#14b8a6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'background 0.3s'
                        })
                    },
                        paper.flex.row({ style: { gap: '6px', alignItems: 'center' } },
                            () => isConsoleError.value ? paper.icon('alert', { size: 14, color: '#f43f5e' }) : paper.icon('check', { size: 14, color: '#10b981' }),
                            paper.span(() => consoleMsg.value)
                        ),
                        paper.button(".toolbar-btn:Trigger Typo Test", {
                            style: { fontSize: '0.75rem', padding: '2px 6px' },
                            onclick: triggerTypoTest
                        })
                    )
                ),
                
                // Right Panel: Preview & HTML visualizer
                paper.div(".studio-panel.glass-panel", { style: { height: 'auto', minHeight: '600px' } },
                    paper.div(".panel-header",
                        paper.span(".panel-title",
                            paper.span(".dot-status", { style: { background: 'var(--rose)', boxShadow: '0 0 8px var(--rose)' } }),
                            paper.span("sandbox-preview.html")
                        ),
                        paper.button({
                            class: 'toolbar-btn',
                            style: { background: 'rgba(99,102,241,0.1)', borderColor: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                            onclick: runSandbox
                        }, paper.icon('refresh', { size: 14 }), "Force Reload")
                    ),
                    
                    paper.div("#sandbox-preview.preview-body", { style: { minHeight: '300px', flex: '1' } }),
                    paper.div("#sandbox-error.preview-alert"),
                    
                    // HTML visual node inspector panel
                    paper.div({ style: { background: '#090c15', borderTop: '1px solid var(--border-glow)', padding: '1.5rem', position: 'relative' } },
                        paper.span(".catalog-meta", { style: { top: '0.75rem', left: '1rem', fontSize: '0.75rem', color: 'var(--teal)', display: 'inline-flex', alignItems: 'center', gap: '6px' } },
                            paper.icon('search', { size: 12, color: 'var(--teal)' }),
                            "EDUCATIONAL DOM INSPECTOR"
                        ),
                        paper.pre({ style: { margin: '1rem 0 0 0', maxHeight: '140px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' } },
                            paper.code("#sandbox-html-inspect", { style: { fontFamily: 'var(--font-mono)', color: '#cbd5e1', fontSize: '0.82rem', whiteSpace: 'pre-wrap' } })
                        )
                    )
                )
            )
        );
    };

    // 3. SPA Routing Demo Panel
    const RouterDemo = () => {
        let activeTab = paper.state('home');

        const updateRouterTab = (key, path) => {
            activeTab.value = key;
            paper.navigate(path);
        };

        // Initialize Hash Router routes
        paper.route('/', () => {
            return paper.div(
                paper.h4("SPA Dashboard View", { style: { color: '#fff', margin: '0 0 10px 0' } }),
                paper.p("Welcome to your single-page-app index view! Toggling paths updates the hash parameters natively, causing a reactive swap inside paper.router() automatically.")
            );
        });

        paper.route('/docs-route', () => {
            return paper.div(
                paper.h4("Paper API Documentation View", { style: { color: '#fff', margin: '0 0 10px 0' } }),
                paper.p("Browse core functions, plugin systems, computed triggers, or reactive structures completely offline with high performance.")
            );
        });

        paper.route('/profile-route', () => {
            return paper.div(
                paper.h4("User Preferences Settings", { style: { color: '#fff', margin: '0 0 10px 0' } }),
                paper.p("Manage credentials, dark mode configs, animation timing variables, or inspect session storage states easily.")
            );
        });

        return paper.div(".container", { style: { paddingTop: '2rem', marginBottom: '5rem' } },
            paper.div(".glass-panel", { style: { padding: '2rem' } },
                paper.h3(".flex-between", { style: { marginTop: '0', color: '#fff' } },
                    paper.flex.row({ style: { alignItems: 'center', gap: '8px' } },
                        paper.icon('palette', { size: 24, color: 'var(--primary)' }),
                        paper.span("Native Tiny Hash SPA Router Demo")
                    ),
                    paper.span(".api-badge:Built-in paper.route()", { style: { background: 'rgba(99,102,241,0.15)', borderColor: 'var(--primary)', color: '#a5b4fc' } })
                ),
                paper.p({ style: { color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' } },
                    "Click the routes below to swap view components dynamically without any page loads, listening directly to hash updates inside the built-in router."
                ),
                paper.flex.row({ style: { marginBottom: '1.5rem', gap: '8px', flexWrap: 'wrap' } },
                    paper.button({
                        class: () => activeTab.value === 'home' ? 'toolbar-btn active' : 'toolbar-btn',
                        style: { display: 'inline-flex', alignItems: 'center', gap: '6px' },
                        onclick: () => updateRouterTab('home', '/')
                    }, paper.icon('home', { size: 14 }), "Home Route"),
                    paper.button({
                        class: () => activeTab.value === 'docs' ? 'toolbar-btn active' : 'toolbar-btn',
                        style: { display: 'inline-flex', alignItems: 'center', gap: '6px' },
                        onclick: () => updateRouterTab('docs', '/docs-route')
                    }, paper.icon('book', { size: 14 }), "Docs Route"),
                    paper.button({
                        class: () => activeTab.value === 'profile' ? 'toolbar-btn active' : 'toolbar-btn',
                        style: { display: 'inline-flex', alignItems: 'center', gap: '6px' },
                        onclick: () => updateRouterTab('profile', '/profile-route')
                    }, paper.icon('settings', { size: 14 }), "Profile Route")
                ),
                // Dynamic SPA router mounting element
                paper.div("#router-app-mount", {
                    style: { padding: '1.5rem', background: 'rgba(9,12,23,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)', minHeight: '100px' }
                },
                    paper.router()
                )
            )
        );
    };

    // 4. Component Catalog Section
    const ComponentCatalog = () => {
        const CATALOG_ITEMS = {
            'tabs': {
                title: 'Card Tabs System',
                icon: 'folder',
                blueprint: `paper.tabs([
    { title: 'Overview', content: "Tab 1: Paper's core is exceptionally light." },
    { title: 'Performance', content: "Tab 2: Speeds clock in 10x faster." },
    { title: 'Syntax', content: "Tab 3: Clean, parameter mapping." }
])`,
                creator: () => {
                    return paper.tabs([
                        { title: 'Overview', content: "Paper is a modern JavaScript framework that requires zero virtual DOM overhead, making it exceptionally lightweight and reactive." },
                        { title: 'Performance', content: "Because it writes directly to standard native elements, loading and paint cycles are blazing fast compared to virtual DOM heavy structures like React or Vue." },
                        { title: 'Syntax', content: "Elements can be created dynamically in just one simple line using readable tag syntax and parameter mapping lists." }
                    ]);
                }
            },
            'autocomplete': {
                title: 'Smart Autocomplete',
                icon: 'search',
                blueprint: `paper.autoComplete([
    'United States', 'Canada', 'Mexico', 
    'Brazil', 'United Kingdom', 'Germany'
], 'Search Countries...')`,
                creator: () => {
                    let ac = paper.autoComplete([
                        'United States', 'Canada', 'Mexico', 'Brazil', 
                        'United Kingdom', 'Germany', 'France', 'Japan', 
                        'China', 'India', 'Australia'
                    ], 'Search Countries...');
                    ac.addEventListener('change', (e) => {
                        paper.toast(`Selected Country: ${e.detail}`, 'success');
                    });
                    return ac;
                }
            },
            'modal': {
                title: 'Popup Modals',
                icon: 'alert',
                blueprint: `// 1. Launch a fully themeable custom styled modal
let modal = paper.modal(
    paper.div(
        paper.p("Custom styled dialog contents..."),
        paper.button("Dismiss", { onclick: () => modal.hide() })
    ),
    "Paper Dialog"
);
modal.show();

// 2. Or trigger Windows/Browser built-in native alert / confirm
paper.modal.alert("Operation completed!", "System Alert");
paper.modal.confirm("Are you sure you want to proceed?", (confirmed) => {
    console.log("Confirmed: " + confirmed);
});`,
                creator: () => {
                    let m = null;
                    return paper.flex.col({ style: { width: '100%', gap: '1.5rem' } },
                        paper.flex.row({ style: { gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' } },
                            paper.button('Launch Custom Modal', {
                                class: 'btn-primary',
                                style: { padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
                                onclick: () => {
                                    m = paper.modal(
                                        paper.flex.col(
                                             paper.p("This dialog is generated on the fly inside the DOM. Seamless background masking and click-backdrop dismissal are handled entirely natively!"),
                                             paper.button("Dismiss Dialog", {
                                                class: 'btn-primary',
                                                style: { width: '100%' },
                                                onclick: () => m.hide()
                                             })
                                        ),
                                        "Dynamic Modal Box"
                                    );
                                    document.body.appendChild(m);
                                    m.show();
                                }
                            }),
                            paper.button('Built-in OS Alert', {
                                class: 'toolbar-btn',
                                style: { borderColor: '#a5b4fc', color: '#a5b4fc' },
                                onclick: () => paper.modal.alert("This is a standard OS native alert notification from the browser! 💻", "Windows Alert")
                            }),
                            paper.button('Built-in OS Confirm', {
                                class: 'toolbar-btn',
                                style: { borderColor: '#a5b4fc', color: '#a5b4fc' },
                                onclick: () => {
                                    paper.modal.confirm("Do you agree that Paper.js is incredibly elegant? 🚀", (accepted) => {
                                        paper.toast(accepted ? "Thank you! Agreed! 🎉" : "Aww, let us know how to improve! 📬", accepted ? "success" : "info");
                                    });
                                }
                            })
                        )
                    );
                }
            },
            'carousel': {
                title: 'Responsive Carousel',
                icon: 'image',
                blueprint: `paper.components.carousel([
    'https://picsum.photos/id/10/500/300',
    'https://picsum.photos/id/20/500/300',
    'https://picsum.photos/id/30/500/300'
])`,
                creator: () => {
                    return paper.components.carousel([
                        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&h=300&q=80',
                        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&h=300&q=80',
                        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=500&h=300&q=80'
                    ]);
                }
            },
            'toasts': {
                title: 'Toast Notifications',
                icon: 'bell',
                blueprint: `// 1. Fire a custom glassmorphic toast notification
paper.toast("Operation completed successfully! 🎉", "success");

// 2. Or fire a native OS / browser push notification (with fallback to custom)
paper.toast("This is a real Windows system notification! 💻", "info", 3000, true);`,
                creator: () => {
                    return paper.flex.col({ style: { width: '100%', gap: '1.5rem' } },
                        paper.flex.row({ style: { gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' } },
                            paper.button({
                                class: 'toolbar-btn',
                                style: { borderColor: '#10b981', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                                onclick: () => paper.toast('Operation completed successfully! 🎉', 'success')
                            }, paper.icon('check', { size: 14, color: '#10b981' }), "Custom Success"),
                            paper.button({
                                class: 'toolbar-btn',
                                style: { borderColor: '#38bdf8', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                                onclick: () => paper.toast('Check your console for build logs.', 'info')
                            }, paper.icon('info', { size: 14, color: '#38bdf8' }), "Custom Info"),
                            paper.button({
                                class: 'toolbar-btn',
                                style: { borderColor: '#f43f5e', color: '#f43f5e', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                                onclick: () => paper.toast('Critical compile warning generated.', 'error')
                            }, paper.icon('alert', { size: 14, color: '#f43f5e' }), "Custom Error")
                        ),
                        paper.flex.row({ style: { justifyContent: 'center' } },
                            paper.button({
                                class: 'btn-primary',
                                style: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)' },
                                onclick: () => {
                                    paper.toast('You triggered a Windows native push notification! Check your OS tray. 💻🎉', 'info', 4000, true);
                                }
                            }, paper.icon('bell', { size: 14, color: '#fff' }), "Launch Windows Native OS Toast")
                        )
                    );
                }
        },
        'charts': {
            title: 'Native Canvas Charts',
            icon: 'bar-chart',
            blueprint: `paper.chart({\n    type: 'circle',\n    value: paper.state(75),\n    max: 100,\n    colors: ['#38bdf8']\n});`,
            creator: () => {
                let progress = paper.state(0);
                let interval = setInterval(() => { progress.value = (progress.value + 5) % 105; }, 500);
                
                let container = paper.div(
                    paper.h4('Reactive Canvas Chart Renderers'),
                    paper.div('.row', { style: { marginTop: '20px' } },
                        paper.div('.col-md-6', paper.chart({ type: 'circle', value: progress, colors: ['#6366f1'] })),
                        paper.div('.col-md-6', paper.chart({ type: 'bar', data: [20, 50, 30, 80, 40] }))
                    )
                );
                // cleanup interval when destroyed if necessary, but this is a simple demo
                return container;
            }
        },
        'animations': {
            title: 'Paper Animate',
            icon: 'zap',
            blueprint: `paper.div({ animate: 'slide-up' },\n    'I will animate natively on scroll!'\n);`,
            creator: () => {
                return paper.div({ style: { padding: '40px', textAlign: 'center' } },
                    paper.h2('Zero-Dependency Animations', { animate: 'fade-in' }),
                    paper.p('Tag an element with `animate: "slide-up"` and it automatically animates!', { animate: 'slide-up' }),
                    paper.button('Hover me!', { animate: 'zoom-in', class: 'hover-grow', style: { marginTop: '20px', background: 'var(--primary)', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' } })
                );
            }
        },
        'reactivity_list': {
            title: 'Reactive Loop Lists',
            icon: 'list',
            blueprint: `let list = paper.state([1, 2, 3]);\npaper.for(list, (item) => paper.li(item));`,
            creator: () => {
                let list = paper.state(['Build Router', 'Write Animations', 'Render Charts']);
                return paper.div(
                    paper.h3('Auto-Syncing DOM Lists'),
                    paper.ul({ style: { marginBottom: '20px' } },
                        paper.for(list, (item, i) => paper.li(item, { style: { padding: '8px', background: 'rgba(255,255,255,0.05)', margin: '4px 0', borderRadius: '4px' } }))
                    ),
                    paper.button('Add Random Task', {
                        onclick: () => {
                            let newArr = [...list.value];
                            newArr.push('Task ' + Math.floor(Math.random() * 100));
                            list.value = newArr;
                        },
                        style: { background: 'var(--teal)', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }
                    })
                );
            }
        }
    };

        const updateCatalog = (key) => {
            selectedCatalogKey = key;
            const container = document.getElementById('catalog-rendered-component');
            const code = document.getElementById('catalog-code-view');
            if (container && code) {
                container.innerHTML = '';
                container.appendChild(CATALOG_ITEMS[key].creator());
                code.textContent = CATALOG_ITEMS[key].blueprint;
            }
        };

        const copyBlueprint = () => {
            const text = CATALOG_ITEMS[selectedCatalogKey].blueprint;
            navigator.clipboard.writeText(text).then(() => {
                paper.toast("Blueprint copied to clipboard!", "success");
            });
        };

        // Render sidebar items array
        const listItems = Object.keys(CATALOG_ITEMS).map(k => {
            return {
                text: CATALOG_ITEMS[k].title,
                icon: CATALOG_ITEMS[k].icon,
                active: k === selectedCatalogKey,
                onclick: () => {
                    updateCatalog(k);
                }
            };
        });

        // Trigger initial component render
        setTimeout(() => updateCatalog(selectedCatalogKey), 60);

        return paper.div("#docs.catalog-section.container", { style: { borderTop: '1px solid var(--border-solid)', paddingTop: '5rem' } },
            paper.h2(".section-title:Interactive Component Catalog"),
            paper.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "Paper Complete comes pre-packed with layouts, widgets, navigation, tables, and popups. Select a component below to see it in action and review the copy-pasteable syntax."
            ),
            
            paper.div(".catalog-grid",
                paper.div("#catalog-sidebar-container.glass-panel", { style: { padding: '1rem', height: 'fit-content' } },
                    paper.components.sidebar(listItems)
                ),
                
                paper.flex.col({ style: { gap: '2rem' } },
                    paper.div(".catalog-preview-area.glass-panel",
                        paper.span(".catalog-meta", { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } },
                            paper.icon('terminal', { size: 12, color: 'var(--teal)' }),
                            "LIVE COMPONENT INSTANCE"
                        ),
                        paper.div("#catalog-rendered-component.demo-component-container")
                    ),
                    paper.div(".glass-panel", { style: { padding: '1.5rem', background: '#090c15', position: 'relative' } },
                        paper.span(".catalog-meta", { style: { top: '1rem', left: '1rem', fontSize: '0.75rem' } }),
                        paper.button({
                            class: 'toolbar-btn',
                            style: { position: 'absolute', right: '1rem', top: '0.8rem', fontSize: '0.8rem', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                            onclick: copyBlueprint
                        }, paper.icon('copy', { size: 14 }), "Copy Code"),
                        paper.pre({ style: { margin: '2rem 0 0 0', overflowX: 'auto' } },
                            paper.code("#catalog-code-view", { style: { fontFamily: 'var(--font-mono)', color: '#a5b4fc', fontSize: '0.9rem' } })
                        )
                    )
                )
            )
        );
    };

    // 5. Dynamic API fetch grid cards
    const ApiPlayground = () => {
        const APIS = [
            {
                title: 'Quotes API',
                desc: 'Fetch inspirational developer quotes.',
                url: 'https://v2.jokeapi.dev/joke/Programming?type=single',
                onSuccess: (cardBody, data) => {
                    let text = data.joke || "Simplicity is the soul of efficiency.";
                    cardBody.appendChild(paper.p(`"${text}"`, '.display-quote'));
                    cardBody.appendChild(paper.p('— Programming Endpoint', '.display-author'));
                },
                fallback: (cardBody) => {
                    let randomIdx = Math.floor(Math.random() * BACKUP_QUOTES.length);
                    let quote = BACKUP_QUOTES[randomIdx];
                    cardBody.appendChild(paper.p(`"${quote.text}"`, '.display-quote'));
                    cardBody.appendChild(paper.p(`— ${quote.author}`, '.display-author'));
                }
            },
            {
                title: 'User Directory',
                desc: 'Load placeholder accounts from JSONPlaceholder.',
                url: 'https://jsonplaceholder.typicode.com/users',
                onSuccess: (cardBody, data) => {
                    let list = paper.ul({ style: { padding: '0', margin: '0', listStyle: 'none', width: '100%' } });
                    data.slice(0, 3).forEach(user => {
                        list.appendChild(paper.li(
                            paper.flex.between(
                                paper.span(user.name, { style: { fontWeight: '600', color: '#fff' } }),
                                paper.span(user.email, { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } })
                            ),
                            { style: { padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' } }
                        ));
                    });
                    cardBody.appendChild(list);
                },
                fallback: (cardBody) => {
                    let list = paper.ul({ style: { padding: '0', margin: '0', listStyle: 'none', width: '100%' } });
                    [
                        { name: "John Doe", email: "john@example.com" },
                        { name: "Jane Smith", email: "jane@example.com" }
                    ].forEach(user => {
                        list.appendChild(paper.li(
                            paper.flex.between(
                                paper.span(user.name, { style: { fontWeight: '600', color: '#fff' } }),
                                paper.span(user.email, { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } })
                            ),
                            { style: { padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' } }
                        ));
                    });
                    cardBody.appendChild(list);
                }
            }
        ];

        const triggerFetch = async (api, containerId) => {
            const mount = document.getElementById(containerId);
            if (!mount) return;
            mount.innerHTML = '';
            
            try {
                let fetchedEl = await paper.fetch(api.url, {
                    onSuccess: (body, data) => api.onSuccess(body, data)
                });
                mount.appendChild(fetchedEl);
            } catch (e) {
                api.fallback(mount);
            }
        };

        // Render card structures
        const apiCards = APIS.map((api, idx) => {
            let containerId = `api-mount-${idx}`;
            
            // Trigger fetch on load
            setTimeout(() => triggerFetch(api, containerId), 100);

            return paper.div(".api-card.glass-panel", { style: { padding: '1.5rem' } },
                paper.div(".api-header",
                    paper.h3(api.title, { style: { margin: '0', color: '#fff' } }),
                    paper.span(".api-badge:active")
                ),
                paper.p(api.desc, { style: { color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1rem 0' } }),
                paper.div(`#${containerId}.api-content`),
                paper.button("Trigger API Request", {
                    class: 'btn-primary',
                    onclick: () => triggerFetch(api, containerId)
                })
            );
        });

        return paper.div(".container", { style: { paddingTop: '6rem' } },
            paper.h2(".section-title", { style: { display: 'inline-flex', alignItems: 'center', gap: '8px' } },
                paper.icon('bolt', { size: 24, color: 'var(--teal)' }),
                "Full Live API Integrations"
            ),
            paper.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "Standard components natively loaded using `paper.fetch` to query high-uptime developer endpoints. Everything executes with full loading states, micro-transitions, and custom error boundaries."
            ),
            paper.div(".api-grid",
                ...apiCards,
                
                // Ring metric Canvas plugin workshop card
                paper.div(".api-card.glass-panel", { style: { padding: '1.5rem' } },
                    paper.div(".api-header",
                        paper.h3("Extensible Charts", { style: { margin: '0', color: '#fff' } }),
                        paper.span(".api-badge:canvas plugin", { style: { borderColor: '#10b981', color: '#10b981', background: 'rgba(16,185,129,0.1)' } })
                    ),
                    paper.p("Render stunning circular graphs using our registered charts canvas plugin dynamically.", { style: { color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1rem 0' } }),
                    
                    paper.div("#canvas-plugin-mount", { style: { flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                        // Reactive canvas binding
                        () => paper.chart({ type: 'circle', value: ringPercent, colors: ['#10b981'] })
                    ),
                    
                    paper.button("Randomize Progress Arc", {
                        class: 'btn-primary',
                        onclick: () => ringPercent.value = Math.floor(Math.random() * 80) + 20
                    })
                )
            )
        );
    };

    // 6. Project Quickstart & Framework Setup Guides (Requested)
    const FrameworkGuides = () => {
        let selectedTab = paper.state('vanilla');

        const GUIDES = {
            vanilla: {
                title: "Vanilla HTML Setup Guide",
                sub: "Zero bundle config. Simply load paper-complete.js and start writing.",
                code: `<!-- 1. Include CSS Variables & Library Complete -->
<link rel="stylesheet" href="styles.css">
<script src="https://eldrex-paper-js.vercel.app/paper-complete.js"></script>

<!-- 2. Mount root element -->
<div id="app"></div>

<!-- 3. Start coding! -->
<script>
    let title = paper.h1(".text-center", "Hello Paper!");
    paper.mount("#app", title);
</script>`
            },
            bootstrap: {
                title: "Bootstrap Integration Setup Guide",
                sub: "Run Bootstrap elements instantly with zero styling links setups in index.html.",
                code: `<script src="https://eldrex-paper-js.vercel.app/paper-complete.js"></script>

<div id="app"></div>

<script>
    // 1. Injects Bootstrap CDN link dynamically
    paper.loadFramework('bootstrap');

    // 2. Compose grid forms and buttons in paper dot syntax
    let card = paper.div(".card.bg-light.m-3",
        paper.div(".card-body",
            paper.h5(".card-title:Bootstrap Form"),
            paper.input("text", "Enter name", { class: 'form-control mb-3' }),
            paper.button(".btn.btn-primary:Submit")
        )
    );
    paper.mount("#app", card);
</script>`
            },
            tailwind: {
                title: "Tailwind CSS Integration Guide",
                sub: "Utilize fully responsive Tailwind classes instantly at absolute zero config.",
                code: `<script src="https://eldrex-paper-js.vercel.app/paper-complete.js"></script>

<div id="app"></div>

<script>
    // 1. Injects Tailwind play script CDNs automatically
    paper.loadFramework('tailwind');

    // 2. Write utility styling elements instantly
    let hero = paper.section(".bg-slate-900.py-20.px-4.text-center.rounded-3xl.shadow-2xl",
        paper.h1(".text-5xl.font-extrabold.text-white.mb-4:Tailwind Magic"),
        paper.p(".text-slate-400.text-lg.mb-6:Instant tailwind utilities parsing!"),
        paper.button(".bg-sky-500.hover:bg-sky-600.text-white.font-bold.py-3.px-6.rounded-full:Get Started")
    );
    paper.mount("#app", hero);
</script>`
            }
        };

        const renderGuideCode = (key) => {
            selectedTab.value = key;
            const container = document.getElementById('guide-code-mount');
            if (container) {
                container.textContent = GUIDES[key].code;
            }
        };

        // Initialize code mount on load
        setTimeout(() => renderGuideCode('vanilla'), 100);

        return paper.div(".container", { style: { paddingTop: '4rem' } },
            paper.div(".glass-panel", { style: { padding: '3rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(13,17,34,0.4) 100%)' } },
                paper.h2(".section-title", { style: { marginTop: '0', display: 'inline-flex', alignItems: 'center', gap: '8px' } }, 
                    paper.icon('star', { size: 24, color: 'var(--amber)' }), 
                    "Instant Framework Integrations"
                ),
                paper.p({ style: { color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '700px' } },
                    "Link Paper.js and begin building instantly! Choose your preferred styling stack below to view copy-pasteable startup guides. Paper handles CDNs and DOM parsing dynamically."
                ),
                
                paper.div(".guides-grid",
                    paper.flex.col({ style: { justifyContent: 'center', gap: '12px' } },
                        paper.button({
                            class: () => selectedTab.value === 'vanilla' ? 'gradient-btn' : 'toolbar-btn',
                            style: { width: '100%', justifyContent: 'flex-start', padding: '12px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' },
                            onclick: () => renderGuideCode('vanilla')
                        }, paper.icon('palette', { size: 16 }), "Vanilla CSS Setup"),
                        paper.button({
                            class: () => selectedTab.value === 'bootstrap' ? 'gradient-btn' : 'toolbar-btn',
                            style: { width: '100%', justifyContent: 'flex-start', padding: '12px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' },
                            onclick: () => renderGuideCode('bootstrap')
                        }, paper.icon('star', { size: 16 }), "Bootstrap Framework"),
                        paper.button({
                            class: () => selectedTab.value === 'tailwind' ? 'gradient-btn' : 'toolbar-btn',
                            style: { width: '100%', justifyContent: 'flex-start', padding: '12px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' },
                            onclick: () => renderGuideCode('tailwind')
                        }, paper.icon('bolt', { size: 16 }), "Tailwind CSS Stack")
                    ),
                    
                    paper.div({ style: { background: 'rgba(9, 12, 23, 0.6)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)' } },
                        paper.h4(() => GUIDES[selectedTab.value].title, { style: { color: '#fff', margin: '0 0 4px 0' } }),
                        paper.p(() => GUIDES[selectedTab.value].sub, { style: { color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1rem 0' } }),
                        paper.pre({ style: { margin: '0', overflowX: 'auto' } },
                            paper.code("#guide-code-mount", { style: { fontFamily: 'var(--font-mono)', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' } })
                        )
                    )
                )
            )
        );
    };

    // 7. Comparative frameworks grid
    const ComparisonSection = () => {
        return paper.div(".container.comparison-section",
            paper.h2(".section-title:Traditional Framework Comparison"),
            paper.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "See why students and static-site developers prefer Paper over heavy setup dependencies like Python Flask templates or verbose native Web APIs."
            ),
            
            paper.div(".comparison-table-wrapper.glass-panel",
                paper.table(".comparison-table", [
                    paper.thead(
                        paper.tr(
                            paper.th("Development Task"),
                            paper.th("Standard Web API (Native JS)"),
                            paper.th("Python (Flask / Jinja)"),
                            paper.th("Paper JS Syntax", { style: { color: 'var(--primary)' } })
                        )
                    ),
                    paper.tbody(
                        paper.tr(
                            paper.td(paper.strong("CSS Styled Button")),
                            paper.td("let b = document.createElement('button'); b.className = 'btn-blue'; b.innerText = 'Click';"),
                            paper.td("Requires separate routing, templates mapping, and server renders."),
                            paper.td(paper.code("paper.button('.btn-blue', 'Click')", { style: { color: '#38bdf8' } }))
                        ),
                        paper.tr(
                            paper.td(paper.strong("Add Custom Data Fields")),
                            paper.td("let d = document.createElement('div'); d.setAttribute('data-id', 123);"),
                            paper.td("Requires template serialization syntax tags inside HTML."),
                            paper.td(paper.code("paper.div({dataId: 123})", { style: { color: '#38bdf8' } }))
                        ),
                        paper.tr(
                            paper.td(paper.strong("Render Dynamic Lists")),
                            paper.td("Verbose for loops appending and nesting DOM tree branches recursively."),
                            paper.td("Requires looping tags inside templates: {% for i in items %}."),
                            paper.td(paper.code("items.map(i => paper.li(i))", { style: { color: '#38bdf8' } }))
                        )
                    )
                ])
            )
        );
    };

    // 8. Visual Footer
    const Footer = () => {
        return paper.footer(".main-footer",
            paper.div(".container",
                paper.div(".social-links",
                    paper.a({ href: 'https://github.com/EldrexDelosReyesBula/Paper.js/', target: '_blank', style: { display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' } },
                        paper.icon('github', { size: 16 }), "GitHub Repository"
                    ),
                    paper.a({ href: 'docs.html', style: { display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' } },
                        paper.icon('book', { size: 16 }), "Documentation"
                    ),
                    paper.a({ href: '#playground', style: { display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' } },
                        paper.icon('settings', { size: 16 }), "Plugin Registry"
                    ),
                    paper.a({ href: 'https://eldrex-paper-js.vercel.app/paper-complete.js', target: '_blank', style: { display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' } },
                        paper.icon('package', { size: 16 }), "CDN Package"
                    )
                ),
                paper.p("Paper and official plugins are open-source and released under the MIT License."),
                paper.p("Crafted with absolute zero dependencies. Built entirely with Paper.js.", { style: { fontSize: '0.75rem', marginTop: '10px', color: 'var(--text-muted)' } })
            )
        );
    };

    // ==========================================
    // MAIN APP LAYOUT composition
    // ==========================================
    
    // ==========================================
    // NEW: Reactive Math Calculations Studio
    // ==========================================
    const ReactiveMathStudio = () => {
        let mathA = paper.state(12);
        let mathB = paper.state(8);
        let mathC = paper.state(25);

        return paper.div("#math-studio.container", { style: { paddingTop: '6rem' } },
            paper.h2(".section-title", { style: { display: 'inline-flex', alignItems: 'center', gap: '8px' } },
                paper.icon('bolt', { size: 24, color: 'var(--primary)' }),
                "Reactive Mathematical Studio"
            ),
            paper.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "Unleash real-time formulas with our `paper.math` computed module. Adjust inputs and see calculations refresh instantly in the DOM with zero delay."
            ),
            
            paper.div(".grid", { style: { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' } },
                // Controls Column
                paper.div(".glass-panel", { style: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' } },
                    paper.h3("Aesthetic Sliders Studio", { style: { color: '#fff', margin: '0' } }),
                    
                    paper.flex.col(
                        paper.flex.between(
                            paper.label("Variable A", { style: { fontWeight: '600', color: 'var(--text-muted)' } }),
                            paper.span(() => mathA.value, { style: { color: 'var(--primary)', fontWeight: 'bold' } })
                        ),
                        paper('input', {
                            type: 'range', min: '1', max: '100', value: '12',
                            style: { width: '100%', accentColor: 'var(--primary)' },
                            oninput: (e) => mathA.value = Number(e.target.value)
                        })
                    ),
                    
                    paper.flex.col(
                        paper.flex.between(
                            paper.label("Variable B", { style: { fontWeight: '600', color: 'var(--text-muted)' } }),
                            paper.span(() => mathB.value, { style: { color: 'var(--teal)', fontWeight: 'bold' } })
                        ),
                        paper('input', {
                            type: 'range', min: '1', max: '100', value: '8',
                            style: { width: '100%', accentColor: 'var(--teal)' },
                            oninput: (e) => mathB.value = Number(e.target.value)
                        })
                    ),
                    
                    paper.flex.col(
                        paper.flex.between(
                            paper.label("Variable C", { style: { fontWeight: '600', color: 'var(--text-muted)' } }),
                            paper.span(() => mathC.value, { style: { color: '#ec4899', fontWeight: 'bold' } })
                        ),
                        paper('input', {
                            type: 'range', min: '1', max: '100', value: '25',
                            style: { width: '100%', accentColor: '#ec4899' },
                            oninput: (e) => mathC.value = Number(e.target.value)
                        })
                    )
                ),
                
                // Formulate Computations Column
                paper.div(".glass-panel", { style: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' } },
                    paper.h3("Calculated Reactive Results", { style: { color: '#fff', margin: '0' } }),
                    
                    paper.div({ style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' } },
                        paper.div(".card", { style: { padding: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' } },
                            paper.p("Sum (A + B + C)", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0' } }),
                            paper.h2(paper.math.sum(mathA, mathB, mathC), { style: { color: '#fff', margin: '8px 0 0 0' } })
                        ),
                        
                        paper.div(".card", { style: { padding: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' } },
                            paper.p("Average", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0' } }),
                            paper.h2(paper.math.round(paper.math.avg(mathA, mathB, mathC), 1), { style: { color: 'var(--teal)', margin: '8px 0 0 0' } })
                        ),
                        
                        paper.div(".card", { style: { padding: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' } },
                            paper.p("Product (A * B)", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0' } }),
                            paper.h2(paper.math.mul(mathA, mathB), { style: { color: '#ec4899', margin: '8px 0 0 0' } })
                        ),
                        
                        paper.div(".card", { style: { padding: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' } },
                            paper.p("Ratio (C / B)", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0' } }),
                            paper.h2(paper.math.round(paper.math.div(mathC, mathB), 2), { style: { color: 'var(--primary)', margin: '8px 0 0 0' } })
                        )
                    )
                )
            )
        );
    };

    // ==========================================
    // NEW: Persistent Local CRUD Database Showcase
    // ==========================================
    const CRUDDatabaseShowcase = () => {
        let store = paper.crud('paper-viral-contacts', [
            { name: "Eldrex Reyes", role: "Library Author", status: "Active" },
            { name: "Satoshi Nakamoto", role: "Agile Architect", status: "Busy" },
            { name: "Ada Lovelace", role: "Reactivity Expert", status: "Away" }
        ]);

        let searchQuery = paper.state('');
        let newStatus = paper.state('Active');

        let filteredContacts = paper.computed(() => {
            let query = searchQuery.value.toLowerCase().trim();
            let all = store.items.value;
            if (!query) return all;
            return all.filter(item => 
                (item.name || '').toLowerCase().includes(query) || 
                (item.role || '').toLowerCase().includes(query)
            );
        });

        let listContainer = paper.div(".contacts-grid", { 
            style: { 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                gap: '1.25rem',
                marginTop: '1.5rem'
            } 
        });

        // Computed reflow effect for database changes
        paper.computed(() => {
            listContainer.innerHTML = '';
            let contacts = filteredContacts.value;
            if (contacts.length === 0) {
                listContainer.appendChild(paper.div({ 
                    style: { 
                        gridColumn: '1 / -1', 
                        textAlign: 'center', 
                        padding: '3rem', 
                        color: 'var(--text-muted)',
                        border: '1px dashed var(--border)',
                        borderRadius: 'var(--radius)',
                        background: 'rgba(255,255,255,0.01)'
                    } 
                }, "No directory items found. Try adding a new record or reset search."));
                return;
            }
            
            contacts.forEach(user => {
                let card = paper.div(".contact-card.glass-panel", { 
                    style: { 
                        padding: '1.25rem', 
                        background: 'var(--surface)', 
                        border: '1px solid var(--border)', 
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        position: 'relative'
                    } 
                },
                    paper.flex.between(
                        paper.flex.center(
                            paper.div(user.name.charAt(0).toUpperCase(), { 
                                style: { 
                                    width: '36px', height: '36px', borderRadius: '50%', 
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--teal) 100%)', 
                                    color: '#fff', display: 'flex', alignItems: 'center', 
                                    justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' 
                                } 
                            }),
                            paper.flex.col(
                                paper.span(user.name, { style: { fontWeight: 'bold', color: '#fff', fontSize: '0.95rem' } }),
                                paper.span(user.role, { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } })
                            ),
                            { style: { gap: '10px' } }
                        ),
                        paper.flex.row(
                            paper.button({
                                class: 'icon-btn',
                                style: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
                                onclick: () => {
                                    let nameInput = paper.input('text', 'Name', { value: user.name });
                                    let roleInput = paper.input('text', 'Role', { value: user.role });
                                    let statusSelect = paper.select({ style: { width: '100%' } },
                                        paper.option('Active', { value: 'Active' }),
                                        paper.option('Busy', { value: 'Busy' }),
                                        paper.option('Away', { value: 'Away' })
                                    );
                                    statusSelect.value = user.status;
                                    
                                    let editModal = paper.modal(
                                        paper.flex.col(
                                            paper.flex.col(paper.label("Name"), nameInput),
                                            paper.flex.col(paper.label("Role"), roleInput),
                                            paper.flex.col(paper.label("Status"), statusSelect),
                                            paper.button("Update Record ⚡", {
                                                class: 'btn-primary',
                                                onclick: () => {
                                                    if (!nameInput.value.trim()) return paper.toast("Name cannot be empty!", "error");
                                                    store.update(user.id, {
                                                        name: nameInput.value,
                                                        role: roleInput.value,
                                                        status: statusSelect.value
                                                    });
                                                    editModal.hide();
                                                    paper.toast("Record updated successfully!", "success");
                                                }
                                            })
                                        ),
                                        "Edit Catalog Record"
                                    );
                                    document.body.appendChild(editModal);
                                    editModal.show();
                                }
                            }, paper.icon('edit', { size: 14, color: 'var(--teal)' })),
                            paper.button({
                                class: 'icon-btn',
                                style: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
                                onclick: () => {
                                    store.delete(user.id);
                                    paper.toast("Contact safely removed.", "error");
                                }
                            }, paper.icon('trash', { size: 14, color: '#f43f5e' })),
                            { style: { gap: '6px' } }
                        ),
                        { style: { alignItems: 'center' } }
                    ),
                    paper.flex.between(
                        paper.span(user.status, { 
                            style: { 
                                fontSize: '0.75rem', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                background: user.status === 'Active' ? 'rgba(16,185,129,0.1)' : user.status === 'Busy' ? 'rgba(234,179,8,0.1)' : 'rgba(244,63,94,0.1)',
                                color: user.status === 'Active' ? '#10b981' : user.status === 'Busy' ? '#eab308' : '#f43f5e',
                                border: '1px solid ' + (user.status === 'Active' ? 'rgba(16,185,129,0.2)' : user.status === 'Busy' ? 'rgba(234,179,8,0.2)' : 'rgba(244,63,94,0.2)')
                            }
                        }),
                        paper.span(new Date(user.createdAt || Date.now()).toLocaleDateString(), { style: { fontSize: '0.75rem', color: 'var(--text-muted)' } }),
                        { style: { alignItems: 'center' } }
                    )
                );
                listContainer.appendChild(card);
            });
        });

        return paper.div("#crud-studio.container", { style: { paddingTop: '6rem' } },
            paper.h2(".section-title", { style: { display: 'inline-flex', alignItems: 'center', gap: '8px' } },
                paper.icon('database', { size: 24, color: 'var(--teal)' }),
                "Persistent Local CRUD Store"
            ),
            paper.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "Store, filter, and modify records in a database backed completely by `paper.crud`. Refresh the page - all changes are persistent natively in your local browser storage!"
            ),
            
            paper.div(".grid", { style: { gridTemplateColumns: '300px 1fr', gap: '2rem' } },
                // Create Sidebar Form
                paper.div(".glass-panel", { style: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' } },
                    paper.h3("Add Safe Record", { style: { color: '#fff', margin: '0' } }),
                    
                    paper.flex.col(
                        paper.label("Developer Name", { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } }),
                        paper('input', {
                            type: 'text', placeholder: 'Name...',
                            style: { width: '100%' }
                        })
                    ),
                    
                    paper.flex.col(
                        paper.label("System Role", { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } }),
                        paper('input', {
                            type: 'text', placeholder: 'e.g., Lead Engineer',
                            style: { width: '100%' }
                        })
                    ),
                    
                    paper.flex.col(
                        paper.label("Initial Status", { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } }),
                        paper.select({
                            style: { width: '100%' },
                            onchange: (e) => newStatus.value = e.target.value
                        },
                            paper.option('Active', { value: 'Active' }),
                            paper.option('Busy', { value: 'Busy' }),
                            paper.option('Away', { value: 'Away' })
                        )
                    ),
                    
                    paper.button("Save to Database 💾", {
                        class: 'btn-primary',
                        style: { width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '8px' },
                        onclick: (e) => {
                            let inputName = document.querySelector("#crud-studio input[placeholder='Name...']");
                            let inputRole = document.querySelector("#crud-studio input[placeholder='e.g., Lead Engineer']");
                            
                            let nameVal = inputName ? inputName.value.trim() : '';
                            let roleVal = inputRole ? inputRole.value.trim() : '';
                            
                            if(!nameVal) return paper.toast("Please specify a developer name!", "error");
                            
                            store.create({
                                name: nameVal,
                                role: roleVal || 'Contributor',
                                status: newStatus.value
                            });
                            
                            if (inputName) inputName.value = '';
                            if (inputRole) inputRole.value = '';
                            
                            paper.toast("Record persistent created! 🎉", "success");
                        }
                    })
                ),
                
                // Live View catalog list area
                paper.div(".catalog-preview-area.glass-panel", { style: { padding: '1.5rem', display: 'flex', flexDirection: 'column' } },
                    paper.flex.between(
                        paper.div(
                            paper.span(() => `Safe Cache: ${store.items.value.length} Developers`, { 
                                style: { 
                                    fontWeight: 'bold', color: '#fff', fontSize: '1rem',
                                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                                } 
                            })
                        ),
                        paper.button({
                            class: 'toolbar-btn',
                            style: { borderColor: '#f43f5e', color: '#f43f5e', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                            onclick: () => {
                                store.clear();
                                paper.toast("Database catalog purged.", "error");
                            }
                        }, paper.icon('trash', { size: 14, color: '#f43f5e' }), "Reset Store")
                    ),
                    
                    paper.div({ style: { marginTop: '1rem' } },
                        paper('input', {
                            type: 'text', placeholder: '🔍 Reactively Search Contacts...',
                            style: { width: '100%' },
                            oninput: (e) => searchQuery.value = e.target.value
                        })
                    ),
                    
                    listContainer
                )
            )
        );
    };

const MainApp = () => {
        return paper.fragment(
            Hero(),
            SandboxStudio(),
            RouterDemo(),
            ComponentCatalog(),
            ReactiveMathStudio(),
            CRUDDatabaseShowcase(),
            ApiPlayground(),
            FrameworkGuides(),
            ComparisonSection(),
            Footer()
        );
    };

    // Mount entire dynamic Paper page to the app mount root
    paper.mount("#app", MainApp());

})();
