// app.js
// Entire visual landing page and playground built dynamically using Papyr.js components!
// Living proof of Papyr's production-grade speed, reactivity, and aesthetic elegance.

(function() {
    // 1. Live Sandbox templates covering reactive state, conditional rendering, forms, Bootstrap, and Tailwind CSS.
    const TEMPLATES = {
        reactive: `// 🔋 Vue/SolidJS-style Automatic Dependency-Tracking Reactivity System!
let count = papyr.state(0);
let double = papyr.computed(() => count.value * 2);

let app = papyr.flex.col(
    papyr.h3("🔋 Automatic Reactive Counter", { style: { margin: '0', color: '#fff' } }),
    papyr.p(() => "Reactive Count: " + count.value, { style: { fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' } }),
    papyr.p(() => "Computed Double: " + double.value, { style: { fontSize: '0.95rem', color: '#a5b4fc' } }),
    papyr.flex.row(
        papyr.button("Increment Count", {
            class: 'btn-primary',
            onclick: () => count.value++
        }),
        papyr.button("Decrement Count", {
            style: { background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fda4af', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
            onclick: () => count.value--
        })
    )
);

return app;`,

        conditional: `// 🔒 Conditional rendering with papyr.if() swapper!
let loggedIn = papyr.state(false);

let app = papyr.flex.col(
    papyr.h3("🔒 Conditional Rendering", { style: { margin: '0', color: '#fff' } }),
    papyr.p("Toggle the user auth state to view conditional rendering templates natively."),
    papyr.if(
        loggedIn,
        () => papyr.div(
            ".card",
            papyr.h4("Welcome Back, Developer! 🔓", { style: { margin: '0 0 10px 0', color: '#10b981' } }),
            papyr.p("You are currently authenticated in this reactive conditional view.", { style: { margin: '0' } }),
            { style: { background: 'rgba(16, 185, 129, 0.05)', borderColor: '#10b981', margin: '0' } }
        ),
        () => papyr.div(
            ".card",
            papyr.h4("Access Restricted 🔒", { style: { margin: '0 0 10px 0', color: '#rose' } }),
            papyr.p("Please log in to explore developer state variables.", { style: { margin: '0' } }),
            { style: { background: 'rgba(244, 63, 94, 0.05)', borderColor: '#f43f5e', margin: '0' } }
        )
    ),
    papyr.button(() => loggedIn.value ? "Log Out Account" : "Authorize Dev Account ⚡", {
        class: 'btn-primary',
        onclick: () => {
            loggedIn.value = !loggedIn.value;
            papyr.toast(loggedIn.value ? "Logged In! Welcome" : "Logged Out safely", loggedIn.value ? "success" : "info");
        }
    })
);

return app;`,

        todo: `// 📝 Write HTML like you're texting!
let app = papyr.flex.col(
    papyr.h3("📝 My Papyr Todos", { style: { margin: '0', color: '#fff' } }),
    papyr.flex.row(
        papyr.input("text", "What needs doing?", { id: 'new-todo', style: { flex: 1 } }),
        papyr.button("Add Task", {
            class: 'btn-primary',
            onclick: () => {
                let input = document.getElementById('new-todo');
                if (!input.value.trim()) return papyr.toast("Please type a task!", "error");
                
                let list = document.querySelector('.todo-list');
                let item = papyr.li(
                    ".todo-item",
                    papyr.flex.between(
                        papyr.span(input.value),
                        papyr.button("×", {
                            style: { background: 'none', border: 'none', color: '#f43f5e', fontSize: '1.2rem', cursor: 'pointer', padding: '0' },
                            onclick: (e) => e.target.closest('.todo-item').remove()
                        })
                    ),
                    { style: { padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', margin: '4px 0' } }
                );
                list.appendChild(item);
                input.value = '';
                papyr.toast("Task added! 🚀", "success");
            }
        })
    ),
    papyr.ul(".todo-list", { style: { listStyle: 'none', padding: '0', margin: '0' } })
);

return app;`,

        bootstrap: `// 🌟 Dynamic Bootstrap CDN Injection & Styling Integration!
papyr.loadFramework('bootstrap');

let app = papyr.div(".container.py-3",
    papyr.div(".alert.alert-primary", 
        papyr.h4(".alert-heading:Bootstrap Integration! 🌟"),
        papyr.p("This element is styled completely with Bootstrap classes dynamically loaded from a CDN at runtime!"),
        papyr.hr(),
        papyr.p(".mb-0:Papyr maps class dot selectors directly to class names instantly.")
    ),
    papyr.flex.row(
        papyr.button(".btn.btn-outline-primary:Primary Action", {
            onclick: () => papyr.toast("Bootstrap Primary Clicked!", "success")
        }),
        papyr.button(".btn.btn-danger:Delete Row", {
            onclick: () => papyr.toast("Danger Triggered!", "error")
        })
    )
);

return app;`,

        tailwind: `// ⚡ Ultra-fast Tailwind Play CDN Integration!
papyr.loadFramework('tailwind');

let toggleState = papyr.state(false);

let app = papyr.div(".bg-slate-900.p-6.rounded-2xl.shadow-xl.border.border-slate-800.text-slate-100.max-w-md.mx-auto",
    papyr.h3(".text-2xl.font-extrabold.text-transparent.bg-clip-text.bg-gradient-to-r.from-cyan-400.to-indigo-400.mb-2:Tailwind CSS Mode"),
    papyr.p(".text-slate-400.text-sm.mb-4:Write reactive utility-first styles directly in Papyr dot syntax. No compilation required!"),
    
    papyr.if(
        toggleState,
        papyr.div(".bg-cyan-500/10.border.border-cyan-500/30.p-4.rounded-xl.mb-4",
            papyr.h4(".text-cyan-400.font-semibold:⚡ Active State Widget"),
            papyr.p(".text-xs.text-cyan-300:Reactive properties render on-the-fly inside Tailwind layouts seamlessly.")
        )
    ),
    
    papyr.button(".w-full.bg-gradient-to-r.from-cyan-500.to-indigo-500.hover:from-cyan-600.hover:to-indigo-600.text-white.font-bold.py-2.px-4.rounded-xl.shadow-lg.shadow-indigo-500/20.transition-all:Toggle Reactive Widget", {
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
    let ringPercent = papyr.state(68);

    // ==========================================
    // MODULE COMPONENT GENERATORS
    // ==========================================

    const getSvgLogo = (size = 90) => {
        return papyr.html(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" style="display: block; margin: 0 auto 2rem auto; filter: drop-shadow(0 0 25px rgba(99, 102, 241, 0.45)); cursor: pointer; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);" onmouseover="this.style.transform='scale(1.15) rotate(5deg)'" onmouseout="this.style.transform='scale(1) rotate(0deg)'">
                <defs>
                    <linearGradient id="logo-hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#6366f1" />
                        <stop offset="100%" stop-color="#4f46e5" />
                    </linearGradient>
                    <linearGradient id="logo-p-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#14b8a6" />
                        <stop offset="100%" stop-color="#06b6d4" />
                    </linearGradient>
                    <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <!-- Hexagon Frame -->
                <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="rgba(10, 15, 30, 0.65)" stroke="url(#logo-hex-grad)" stroke-width="6" stroke-linejoin="round" />
                
                <!-- Glow hexagon underneath -->
                <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="none" stroke="#6366f1" stroke-width="12" stroke-linejoin="round" opacity="0.25" filter="url(#logo-glow)" />

                <!-- Folded Letter 'P' -->
                <path d="M35,28 L35,72" stroke="url(#logo-hex-grad)" stroke-width="10" stroke-linecap="round" />
                <path d="M35,28 C55,28 68,36 68,46 C68,56 55,60 35,60" fill="none" stroke="url(#logo-p-grad)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
                
                <!-- Origami Fold Diagonal Accent -->
                <path d="M35,46 L52,46 L35,60" fill="rgba(20, 184, 166, 0.15)" stroke="none" />
            </svg>
        `);
    };

    // 1. Radiant Hero
    const Hero = () => {
        return papyr.div(".hero-wrapper.container",
            getSvgLogo(90),
            papyr.span(".hero-tag", 
                papyr.icon('bolt', { size: 14, style: { marginRight: '4px' } }),
                "v3.0 - Agile Architecture & Mathematical CRUD"
            ),
            papyr.h1(".hero-title.glow-text", 
                "Write HTML Like You're", papyr.br(), "Writing a Text Message."
            ),
            papyr.p(".hero-subtitle",
                "Meet ", papyr.strong("Papyr"), ", the dead-simple JavaScript library that compiles direct reactive UI trees without any bundlers, virtual DOM reflows, or terminal setups."
            ),
            papyr.flex.center(
                papyr.a({ href: '#playground', class: 'gradient-btn' },
                    papyr.span("Launch Sandbox Studio"),
                    papyr.icon('arrowRight', { size: 16 })
                ),
                papyr.a({ href: 'docs.html#/docs.html', class: 'toolbar-btn', style: { padding: '12px 24px', borderRadius: 'var(--radius-md)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' } },
                    papyr.icon('book', { size: 16 }),
                    "Library Documentation"
                )
            ),
            papyr.div(".hero-stats",
                papyr.div(".stat-item",
                    papyr.icon('lock', { size: 28, color: 'var(--teal)', style: { marginBottom: '8px' } }),
                    papyr.span(".stat-val:Safer DOM"),
                    papyr.span(".stat-lbl:XSS textContent Injection")
                ),
                papyr.div(".stat-item",
                    papyr.icon('bolt', { size: 28, color: 'var(--primary)', style: { marginBottom: '8px' } }),
                    papyr.span(".stat-val:Automatic"),
                    papyr.span(".stat-lbl:Reactive States & Computeds")
                ),
                papyr.div(".stat-item",
                    papyr.icon('package', { size: 28, color: '#38bdf8', style: { marginBottom: '8px' } }),
                    papyr.span(".stat-val:0 NPM"),
                    papyr.span(".stat-lbl:Copy-Paste Standalone JS")
                )
            )
        );
    };

    // 2. Sandbox Studio Workspace
    const SandboxStudio = () => {
        // Overlay compiler status reactive state
        let consoleMsg = papyr.state("✓ Compilation successful. Zero parser warnings.");
        let isConsoleError = papyr.state(false);

        // Render compilation sandbox logic
        const runSandbox = () => {
            const editor = document.getElementById('sandbox-editor');
            if (!editor) {
                setTimeout(runSandbox, 50);
                return;
            }
            const code = editor.value;
            const preview = document.getElementById('sandbox-preview');
            const errorBox = document.getElementById('sandbox-error');
            const htmlInspect = document.getElementById('sandbox-html-inspect');

            if (!code.includes('papyr.buton')) {
                consoleMsg.value = "✓ Compilation successful. Zero parser warnings.";
                isConsoleError.value = false;
            }

            try {
                errorBox.style.display = 'none';
                preview.innerHTML = '';

                // Capture local mount hooks inside sandbox context
                const originalMount = window.papyr.mount;
                window.papyr.mount = (selector, component) => {
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

                const runFn = new Function('papyr', code);
                const result = runFn(window.papyr);

                if (result instanceof HTMLElement || result instanceof DocumentFragment) {
                    preview.innerHTML = '';
                    preview.appendChild(result);
                    
                    // Render HTML inspect visualizer
                    htmlInspect.textContent = window.papyr.inspect(result);
                    
                    let observer = new MutationObserver(() => {
                        htmlInspect.textContent = window.papyr.inspect(result);
                    });
                    observer.observe(preview, { childList: true, subtree: true, characterData: true });
                }
                window.papyr.mount = originalMount;
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
let typoEl = papyr.buton("Click me"); // Deliberate spelling error "buton"
return typoEl;`;
            runSandbox();
        };

        // Listen for Levenshtein warnings
        window.addEventListener('papyr-warning', (e) => {
            isConsoleError.value = true;
            consoleMsg.value = `⚠️ PapyrError: Unknown tag "${e.detail.tag}".${e.detail.suggestion ? ` Did you mean "${e.detail.suggestion}"?` : ''}`;
        });

        // Trigger compilation on startup
        setTimeout(runSandbox, 50);

        return papyr.div("#playground.container", { style: { paddingTop: '3rem' } },
            papyr.h2(".section-title:Studio Workspace"),
            papyr.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '2rem', maxWidth: '600px' } },
                "Experiment with Paper's automatic reactivity, conditional rendering, and dynamic Tailwind & Bootstrap integrations. Modify the source code and watch it compile instantly."
            ),
            
            papyr.div(".studio-grid",
                // Left Panel: Code editor
                papyr.div(".studio-panel.glass-panel",
                    papyr.div(".panel-header",
                        papyr.span(".panel-title",
                            papyr.span(".dot-status"),
                            papyr.span("papyr-editor.js")
                        ),
                        papyr.div(".editor-toolbar",
                            papyr.button(".toolbar-btn.active:Reactive State", { onclick: (e) => loadTemplate('reactive', e) }),
                            papyr.button(".toolbar-btn:Conditional Render", { onclick: (e) => loadTemplate('conditional', e) }),
                            papyr.button(".toolbar-btn:Todo List", { onclick: (e) => loadTemplate('todo', e) }),
                            papyr.button(".toolbar-btn:Bootstrap", { onclick: (e) => loadTemplate('bootstrap', e) }),
                            papyr.button(".toolbar-btn:Tailwind CSS", { onclick: (e) => loadTemplate('tailwind', e) })
                        )
                    ),
                    papyr.div(".editor-body",
                        papyr.textarea("#sandbox-editor.code-textarea", {
                            spellcheck: false,
                            oninput: runSandbox,
                            textContent: TEMPLATES.reactive
                        })
                    ),
                    // Console panel
                    papyr.div("#sandbox-console-log", {
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
                        papyr.flex.row({ style: { gap: '6px', alignItems: 'center' } },
                            () => isConsoleError.value ? papyr.icon('alert', { size: 14, color: '#f43f5e' }) : papyr.icon('check', { size: 14, color: '#10b981' }),
                            papyr.span(() => consoleMsg.value)
                        ),
                        papyr.button(".toolbar-btn:Trigger Typo Test", {
                            style: { fontSize: '0.75rem', padding: '2px 6px' },
                            onclick: triggerTypoTest
                        })
                    )
                ),
                
                // Right Panel: Preview & HTML visualizer
                papyr.div(".studio-panel.glass-panel", { style: { height: 'auto', minHeight: '600px' } },
                    papyr.div(".panel-header",
                        papyr.span(".panel-title",
                            papyr.span(".dot-status", { style: { background: 'var(--rose)', boxShadow: '0 0 8px var(--rose)' } }),
                            papyr.span("sandbox-preview.html")
                        ),
                        papyr.button({
                            class: 'toolbar-btn',
                            style: { background: 'rgba(99,102,241,0.1)', borderColor: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                            onclick: runSandbox
                        }, papyr.icon('refresh', { size: 14 }), "Force Reload")
                    ),
                    
                    papyr.div("#sandbox-preview.preview-body", { style: { minHeight: '300px', flex: '1' } }),
                    papyr.div("#sandbox-error.preview-alert"),
                    
                    // HTML visual node inspector panel
                    papyr.div({ style: { background: '#090c15', borderTop: '1px solid var(--border-glow)', padding: '1.5rem', position: 'relative' } },
                        papyr.span(".catalog-meta", { style: { top: '0.75rem', left: '1rem', fontSize: '0.75rem', color: 'var(--teal)', display: 'inline-flex', alignItems: 'center', gap: '6px' } },
                            papyr.icon('search', { size: 12, color: 'var(--teal)' }),
                            "EDUCATIONAL DOM INSPECTOR"
                        ),
                        papyr.pre({ style: { margin: '1rem 0 0 0', maxHeight: '140px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' } },
                            papyr.code("#sandbox-html-inspect", { style: { fontFamily: 'var(--font-mono)', color: '#cbd5e1', fontSize: '0.82rem', whiteSpace: 'pre-wrap' } })
                        )
                    )
                )
            )
        );
    };

    // 3. SPA Routing Demo Panel
    const RouterDemo = () => {
        let activeTab = papyr.state('home');

        const updateRouterTab = (key, path) => {
            activeTab.value = key;
            papyr.navigate(path);
        };

        // Initialize Hash Router routes
        papyr.route('/', () => {
            return papyr.div(
                papyr.h4("SPA Dashboard View", { style: { color: '#fff', margin: '0 0 10px 0' } }),
                papyr.p("Welcome to your single-page-app index view! Toggling paths updates the hash parameters natively, causing a reactive swap inside papyr.router() automatically.")
            );
        });

        papyr.route('/docs-route', () => {
            return papyr.div(
                papyr.h4("Papyr API Documentation View", { style: { color: '#fff', margin: '0 0 10px 0' } }),
                papyr.p("Browse core functions, plugin systems, computed triggers, or reactive structures completely offline with high performance.")
            );
        });

        papyr.route('/profile-route', () => {
            return papyr.div(
                papyr.h4("User Preferences Settings", { style: { color: '#fff', margin: '0 0 10px 0' } }),
                papyr.p("Manage credentials, dark mode configs, animation timing variables, or inspect session storage states easily.")
            );
        });

        return papyr.div(".container", { style: { paddingTop: '2rem', marginBottom: '5rem' } },
            papyr.div(".glass-panel", { style: { padding: '2rem' } },
                papyr.h3(".flex-between", { style: { marginTop: '0', color: '#fff' } },
                    papyr.flex.row({ style: { alignItems: 'center', gap: '8px' } },
                        papyr.icon('palette', { size: 24, color: 'var(--primary)' }),
                        papyr.span("Native Tiny Hash SPA Router Demo")
                    ),
                    papyr.span(".api-badge:Built-in papyr.route()", { style: { background: 'rgba(99,102,241,0.15)', borderColor: 'var(--primary)', color: '#a5b4fc' } })
                ),
                papyr.p({ style: { color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' } },
                    "Click the routes below to swap view components dynamically without any page loads, listening directly to hash updates inside the built-in router."
                ),
                papyr.flex.row({ style: { marginBottom: '1.5rem', gap: '8px', flexWrap: 'wrap' } },
                    papyr.button({
                        class: () => activeTab.value === 'home' ? 'toolbar-btn active' : 'toolbar-btn',
                        style: { display: 'inline-flex', alignItems: 'center', gap: '6px' },
                        onclick: () => updateRouterTab('home', '/')
                    }, papyr.icon('home', { size: 14 }), "Home Route"),
                    papyr.button({
                        class: () => activeTab.value === 'docs' ? 'toolbar-btn active' : 'toolbar-btn',
                        style: { display: 'inline-flex', alignItems: 'center', gap: '6px' },
                        onclick: () => updateRouterTab('docs', '/docs-route')
                    }, papyr.icon('book', { size: 14 }), "Docs Route"),
                    papyr.button({
                        class: () => activeTab.value === 'profile' ? 'toolbar-btn active' : 'toolbar-btn',
                        style: { display: 'inline-flex', alignItems: 'center', gap: '6px' },
                        onclick: () => updateRouterTab('profile', '/profile-route')
                    }, papyr.icon('settings', { size: 14 }), "Profile Route")
                ),
                // Dynamic SPA router mounting element
                papyr.div("#router-app-mount", {
                    style: { padding: '1.5rem', background: 'rgba(9,12,23,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)', minHeight: '100px' }
                },
                    papyr.router()
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
                blueprint: `papyr.tabs([
    { title: 'Overview', content: "Tab 1: Paper's core is exceptionally light." },
    { title: 'Performance', content: "Tab 2: Speeds clock in 10x faster." },
    { title: 'Syntax', content: "Tab 3: Clean, parameter mapping." }
])`,
                creator: () => {
                    return papyr.tabs([
                        { title: 'Overview', content: "Papyr is a modern JavaScript framework that requires zero virtual DOM overhead, making it exceptionally lightweight and reactive." },
                        { title: 'Performance', content: "Because it writes directly to standard native elements, loading and paint cycles are blazing fast compared to virtual DOM heavy structures like React or Vue." },
                        { title: 'Syntax', content: "Elements can be created dynamically in just one simple line using readable tag syntax and parameter mapping lists." }
                    ]);
                }
            },
            'autocomplete': {
                title: 'Smart Autocomplete',
                icon: 'search',
                blueprint: `papyr.autoComplete([
    'United States', 'Canada', 'Mexico', 
    'Brazil', 'United Kingdom', 'Germany'
], 'Search Countries...')`,
                creator: () => {
                    let ac = papyr.autoComplete([
                        'United States', 'Canada', 'Mexico', 'Brazil', 
                        'United Kingdom', 'Germany', 'France', 'Japan', 
                        'China', 'India', 'Australia'
                    ], 'Search Countries...');
                    ac.addEventListener('change', (e) => {
                        papyr.toast(`Selected Country: ${e.detail}`, 'success');
                    });
                    return ac;
                }
            },
            'modal': {
                title: 'Popup Modals',
                icon: 'alert',
                blueprint: `// 1. Launch a fully themeable custom styled modal
let modal = papyr.modal(
    papyr.div(
        papyr.p("Custom styled dialog contents..."),
        papyr.button("Dismiss", { onclick: () => modal.hide() })
    ),
    "Papyr Dialog"
);
modal.show();

// 2. Or trigger Windows/Browser built-in native alert / confirm
papyr.modal.alert("Operation completed!", "System Alert");
papyr.modal.confirm("Are you sure you want to proceed?", (confirmed) => {
    console.log("Confirmed: " + confirmed);
});`,
                creator: () => {
                    let m = null;
                    return papyr.flex.col({ style: { width: '100%', gap: '1.5rem' } },
                        papyr.flex.row({ style: { gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' } },
                            papyr.button('Launch Custom Modal', {
                                class: 'btn-primary',
                                style: { padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
                                onclick: () => {
                                    m = papyr.modal(
                                        papyr.flex.col(
                                             papyr.p("This dialog is generated on the fly inside the DOM. Seamless background masking and click-backdrop dismissal are handled entirely natively!"),
                                             papyr.button("Dismiss Dialog", {
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
                            papyr.button('Built-in OS Alert', {
                                class: 'toolbar-btn',
                                style: { borderColor: '#a5b4fc', color: '#a5b4fc' },
                                onclick: () => papyr.modal.alert("This is a standard OS native alert notification from the browser! 💻", "Windows Alert")
                            }),
                            papyr.button('Built-in OS Confirm', {
                                class: 'toolbar-btn',
                                style: { borderColor: '#a5b4fc', color: '#a5b4fc' },
                                onclick: () => {
                                    papyr.modal.confirm("Do you agree that Papyr.js is incredibly elegant? 🚀", (accepted) => {
                                        papyr.toast(accepted ? "Thank you! Agreed! 🎉" : "Aww, let us know how to improve! 📬", accepted ? "success" : "info");
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
                blueprint: `papyr.components.carousel([
    'https://picsum.photos/id/10/500/300',
    'https://picsum.photos/id/20/500/300',
    'https://picsum.photos/id/30/500/300'
])`,
                creator: () => {
                    return papyr.components.carousel([
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
papyr.toast("Operation completed successfully! 🎉", "success");

// 2. Or fire a native OS / browser push notification (with fallback to custom)
papyr.toast("This is a real Windows system notification! 💻", "info", 3000, true);`,
                creator: () => {
                    return papyr.flex.col({ style: { width: '100%', gap: '1.5rem' } },
                        papyr.flex.row({ style: { gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' } },
                            papyr.button({
                                class: 'toolbar-btn',
                                style: { borderColor: '#10b981', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                                onclick: () => papyr.toast('Operation completed successfully! 🎉', 'success')
                            }, papyr.icon('check', { size: 14, color: '#10b981' }), "Custom Success"),
                            papyr.button({
                                class: 'toolbar-btn',
                                style: { borderColor: '#38bdf8', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                                onclick: () => papyr.toast('Check your console for build logs.', 'info')
                            }, papyr.icon('info', { size: 14, color: '#38bdf8' }), "Custom Info"),
                            papyr.button({
                                class: 'toolbar-btn',
                                style: { borderColor: '#f43f5e', color: '#f43f5e', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                                onclick: () => papyr.toast('Critical compile warning generated.', 'error')
                            }, papyr.icon('alert', { size: 14, color: '#f43f5e' }), "Custom Error")
                        ),
                        papyr.flex.row({ style: { justifyContent: 'center' } },
                            papyr.button({
                                class: 'btn-primary',
                                style: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)' },
                                onclick: () => {
                                    papyr.toast('You triggered a Windows native push notification! Check your OS tray. 💻🎉', 'info', 4000, true);
                                }
                            }, papyr.icon('bell', { size: 14, color: '#fff' }), "Launch Windows Native OS Toast")
                        )
                    );
                }
        },
        'charts': {
            title: 'Native Canvas Charts',
            icon: 'bar-chart',
            blueprint: `papyr.chart({\n    type: 'circle',\n    value: papyr.state(75),\n    max: 100,\n    colors: ['#38bdf8']\n});`,
            creator: () => {
                let progress = papyr.state(0);
                let interval = setInterval(() => { progress.value = (progress.value + 5) % 105; }, 500);
                
                let container = papyr.div(
                    papyr.h4('Reactive Canvas Chart Renderers'),
                    papyr.div('.row', { style: { marginTop: '20px' } },
                        papyr.div('.col-md-6', papyr.chart({ type: 'circle', value: progress, colors: ['#6366f1'] })),
                        papyr.div('.col-md-6', papyr.chart({ type: 'bar', data: [20, 50, 30, 80, 40] }))
                    )
                );
                // cleanup interval when destroyed if necessary, but this is a simple demo
                return container;
            }
        },
        'animations': {
            title: 'Papyr Animate',
            icon: 'zap',
            blueprint: `papyr.div({ animate: 'slide-up' },\n    'I will animate natively on scroll!'\n);`,
            creator: () => {
                return papyr.div({ style: { padding: '40px', textAlign: 'center' } },
                    papyr.h2('Zero-Dependency Animations', { animate: 'fade-in' }),
                    papyr.p('Tag an element with `animate: "slide-up"` and it automatically animates!', { animate: 'slide-up' }),
                    papyr.button('Hover me!', { animate: 'zoom-in', class: 'hover-grow', style: { marginTop: '20px', background: 'var(--primary)', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' } })
                );
            }
        },
        'reactivity_list': {
            title: 'Reactive Loop Lists',
            icon: 'list',
            blueprint: `let list = papyr.state([1, 2, 3]);\npapyr.for(list, (item) => papyr.li(item));`,
            creator: () => {
                let list = papyr.state(['Build Router', 'Write Animations', 'Render Charts']);
                return papyr.div(
                    papyr.h3('Auto-Syncing DOM Lists'),
                    papyr.ul({ style: { marginBottom: '20px' } },
                        papyr.for(list, (item, i) => papyr.li(item, { style: { padding: '8px', background: 'rgba(255,255,255,0.05)', margin: '4px 0', borderRadius: '4px' } }))
                    ),
                    papyr.button('Add Random Task', {
                        onclick: () => {
                            let newArr = [...list.value];
                            newArr.push('Task ' + Math.floor(Math.random() * 100));
                            list.value = newArr;
                        },
                        style: { background: 'var(--teal)', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }
                    })
                );
            }
        },
        'oop_components': {
            title: 'OOP Class Components',
            icon: 'box',
            blueprint: `class UserCard extends papyr.component {
    render() {
        return papyr.div(".card", 
            papyr.h3("ES6 Class Binding"),
            papyr.p("Rendered from an OOP instance!")
        );
    }
}

papyr.mount('#app', new UserCard().render());`,
            creator: () => {
                class DemoCard extends papyr.component {
                    render() {
                        return papyr.div({ style: { padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-glow)' } },
                            papyr.h3('OOP Class Component', { style: { marginTop: 0 } }),
                            papyr.p('This UI was generated by extending the new `papyr.component` base class.'),
                            papyr.button('Encapsulated Click', { 
                                onclick: () => alert('Handled by class method!'),
                                class: 'btn-primary'
                            })
                        );
                    }
                }
                return papyr.div(
                    papyr.h2('Object-Oriented UI', { animate: 'fade-in' }),
                    new DemoCard().render()
                );
            }
        },
        'orm_database': {
            title: 'Unified DB & ORM',
            icon: 'database',
            blueprint: `class User extends papyr.model {}

// Save directly to LocalStorage / IndexedDB
let u = User.create({ name: 'John Doe', role: 'Admin' });

// Reactively watch database changes
User.watch(users => console.log("DB Updated:", users));`,
            creator: () => {
                // Ensure db is empty for demo
                papyr.db('demo_users').state.value = [];
                
                class DemoUser extends papyr.model {}
                // overriding name so it maps to 'demo_users'
                Object.defineProperty(DemoUser, 'name', { value: 'demo_user' });

                return papyr.div(
                    papyr.h2('Papyr ORM + Unified DB', { animate: 'fade-in' }),
                    papyr.p('papyr.db and papyr.model provide instant data persistence.'),
                    
                    // Input to create user
                    papyr.div({ style: { display: 'flex', gap: '10px', marginBottom: '20px' } },
                        papyr.input({ id: 'demo-db-input', placeholder: 'Enter username...', class: 'papyr-input', style: { padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' } }),
                        papyr.button('Insert Record', {
                            class: 'btn-primary',
                            onclick: () => {
                                let val = document.getElementById('demo-db-input').value;
                                if(val) DemoUser.create({ name: val, timestamp: new Date().toLocaleTimeString() });
                            }
                        })
                    ),

                    // Reactive output matching DB
                    papyr.div(".db-output", { style: { background: '#0a0f1c', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-glow)' } },
                        papyr.h4('Reactive Storage Output:'),
                        papyr.div(() => {
                            let records = DemoUser.all();
                            if (records.length === 0) return papyr.p('Database is empty.', { style: { color: 'var(--text-muted)' } });
                            return papyr.ul(
                                ...records.map(r => papyr.li(`ID: ${r.id} | Name: ${r.name} | Time: ${r.timestamp}`))
                            );
                        })
                    )
                );
            }
        },
        'native_apis': {
            title: 'Native Browser APIs',
            icon: 'smartphone',
            blueprint: `// 1-liner Clipboard Copy
await papyr.clipboard.copy("Hello Papyr!");

// 1-liner Geolocation
let pos = await papyr.location.request("We need your location to show local events.");
console.log(pos.coords.latitude);

// Camera Access
await papyr.camera.request('We need camera access to capture your profile picture.', 'my-video-el');`,
            creator: () => {
                let locationState = papyr.state("Location not fetched.");
                let isCameraOn = papyr.state(false);

                return papyr.div(
                    papyr.h2('Hardware & Browser APIs', { animate: 'fade-in' }),
                    papyr.p('Papyr provides unified, one-line promises to access device hardware.'),
                    
                    papyr.div({ style: { display: 'grid', gap: '15px' } },
                        // Clipboard
                        papyr.div(".glass-panel", { style: { padding: '15px' } },
                            papyr.h4("Clipboard API", { style: { margin: '0 0 10px 0' } }),
                            papyr.button('Copy Demo Text', {
                                class: 'btn-primary',
                                onclick: () => papyr.clipboard.copy("Papyr.js native APIs are awesome!")
                            })
                        ),

                        // Geolocation
                        papyr.div(".glass-panel", { style: { padding: '15px' } },
                            papyr.h4("Location API", { style: { margin: '0 0 10px 0' } }),
                            papyr.button('Get Coordinates', {
                                class: 'btn-primary',
                                style: { marginBottom: '10px' },
                                onclick: async () => {
                                    try {
                                        locationState.value = "Fetching...";
                                        let pos = await papyr.location.request("Papyr.js Sandbox wants to test the Location API to prove the WATT transparency module works.");
                                        locationState.value = "Lat: " + pos.coords.latitude.toFixed(4) + ", Lng: " + pos.coords.longitude.toFixed(4);
                                    } catch (e) {
                                        locationState.value = "Error: " + e.message;
                                    }
                                }
                            }),
                            papyr.p(() => locationState.value, { style: { fontFamily: 'monospace', margin: 0, color: 'var(--text-muted)' } })
                        ),

                        // Camera
                        papyr.div(".glass-panel", { style: { padding: '15px' } },
                            papyr.h4("Camera API", { style: { margin: '0 0 10px 0' } }),
                            papyr.button(() => isCameraOn.value ? 'Stop Camera' : 'Start Camera', {
                                class: 'btn-primary',
                                style: { marginBottom: '10px', background: papyr.computed(() => isCameraOn.value ? '#ef4444' : '') },
                                onclick: async () => {
                                    if (isCameraOn.value) {
                                        papyr.camera.stop();
                                        isCameraOn.value = false;
                                    } else {
                                        try {
                                            await papyr.camera.request("Papyr.js Sandbox wants to access your camera to render the hardware streaming demo.", 'demo-camera-preview');
                                            isCameraOn.value = true;
                                        } catch (e) {
                                            if (papyr.toast) papyr.toast("Camera access denied.", "error");
                                        }
                                    }
                                }
                            }),
                            papyr.video({
                                id: 'demo-camera-preview',
                                autoplay: true,
                                playsinline: true,
                                style: { 
                                    width: '100%', 
                                    borderRadius: '8px', 
                                    background: '#000',
                                    display: papyr.computed(() => isCameraOn.value ? 'block' : 'none'),
                                    minHeight: '200px'
                                }
                            })
                        )
                    )
                );
            }
        },
        'cinematic_ui': {
            title: 'Cinematic UI & Particles',
            icon: 'layers',
            blueprint: `// 1. Zero-dependency snow particles
let bg = papyr.particles({ type: 'snow', count: 150 });

// 2. Glassmorphism Card
let card = papyr.glass(
    papyr.h2("Winter Magic"),
    papyr.button("Show Toast", { 
        onclick: () => papyr.toast("❄️ It is cold!") 
    })
);

papyr.mount('#app', papyr.center(bg, card));`,
            creator: () => {
                let container = papyr.div({
                    style: {
                        position: 'relative',
                        width: '100%',
                        height: '400px',
                        background: '#020617', // Dark slate bg
                        borderRadius: '16px',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                });

                // Add the particles as a background layer
                container.appendChild(papyr.particles({ type: 'snow', count: 100, speed: 1.5 }));

                // Add the Glassmorphism UI layer on top
                let glassUI = papyr.glass({
                    style: {
                        padding: '2rem',
                        zIndex: 1, // Stay above particles
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }
                },
                    papyr.h2('Cinematic Engine', { style: { margin: 0, color: '#fff', fontSize: '1.8rem' } }),
                    papyr.p('Zero-dependency Canvas particles + Glassmorphism!', { style: { margin: 0, color: '#cbd5e1' } }),
                    papyr.button('Trigger Toast', {
                        class: 'btn-primary',
                        onclick: () => papyr.toast('❄️ Snow particles are rendering smoothly at 60FPS!', 'success')
                    })
                );

                container.appendChild(glassUI);
                return container;
            }
        },
        'layout_engine': {
            title: 'Layout Engine & Dashboards',
            icon: 'layout',
            blueprint: `// 1. One-line Flexbox & Grid
let topRow = papyr.layout.flex({ justify: 'space-between' }, 
    papyr.h2("Dashboard"), 
    papyr.button("Settings")
);

let statsGrid = papyr.layout.grid({ cols: 'repeat(3, 1fr)', gap: '15px' },
    papyr.div("Users: 1,200"),
    papyr.div("Sales: $40k"),
    papyr.div("Bounce: 3%")
);

// 2. Persistent App Shell Generator
let appShell = papyr.layout.dashboard({
    header: papyr.h3("My App Header"),
    sidebar: papyr.div("Nav Links..."),
    main: papyr.div(topRow, statsGrid)
});

papyr.mount('#app', appShell);`,
            creator: () => {
                // A mini interactive demo of the layout engine
                let shell = papyr.layout.dashboard({
                    header: papyr.layout.flex({ justify: 'space-between', align: 'center', padding: '0 20px' },
                        papyr.h3("Admin Portal", { style: { margin: 0, color: 'var(--primary)' } }),
                        papyr.button("Logout", { class: 'btn-secondary', style: { padding: '4px 12px', fontSize: '0.8rem' } })
                    ),
                    sidebar: papyr.layout.flex({ direction: 'column', gap: '10px', padding: '15px' },
                        papyr.a({ href: '#', style: { color: 'var(--text-muted)', textDecoration: 'none' } }, "🏠 Home"),
                        papyr.a({ href: '#', style: { color: 'var(--text-muted)', textDecoration: 'none' } }, "📊 Analytics"),
                        papyr.a({ href: '#', style: { color: 'var(--text-muted)', textDecoration: 'none' } }, "⚙️ Settings")
                    ),
                    main: papyr.layout.flex({ direction: 'column', gap: '20px' },
                        papyr.h2("Welcome Back", { style: { margin: 0 } }),
                        papyr.layout.grid({ cols: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' },
                            papyr.glass({ style: { padding: '20px', textAlign: 'center' } }, "Traffic", papyr.h2("12k")),
                            papyr.glass({ style: { padding: '20px', textAlign: 'center' } }, "Revenue", papyr.h2("$8k")),
                            papyr.glass({ style: { padding: '20px', textAlign: 'center' } }, "Growth", papyr.h2("+15%"))
                        )
                    )
                });
                
                // Override the CSS variables for the sandbox container scale
                shell.style.setProperty('--papyr-sidebar-width', '120px');
                shell.style.setProperty('--papyr-header-height', '50px');
                shell.style.border = '1px solid var(--border-color)';
                shell.style.borderRadius = '12px';
                shell.style.overflow = 'hidden';
                shell.style.minHeight = '300px';

                return shell;
            }
        },
        'secure_vault': {
            title: 'Enterprise Security Vault',
            icon: 'lock',
            blueprint: `// 1. Encrypt and store data in localStorage
papyr.storage.secureSet(
    "auth_token", 
    { user: "admin", role: "super" }, 
    "my-secret-key"
);

// 2. Data in browser devtools is completely obfuscated!

// 3. Retrieve and decrypt natively
let token = papyr.storage.secureGet("auth_token", "my-secret-key");
console.log(token.user); // "admin"`,
            creator: () => {
                let savedData = papyr.state("No data saved yet.");
                let rawLocalStorage = papyr.state("");

                return papyr.div(
                    papyr.h2('Secure Private Vault', { animate: 'fade-in' }),
                    papyr.p('Papyr.js features a lightweight Security Kernel. Data written to LocalStorage via .secureSet is automatically encrypted.'),
                    
                    papyr.div(".glass-panel", { style: { padding: '20px', marginTop: '20px' } },
                        papyr.h4("Write Secure Data", { style: { margin: '0 0 15px 0' } }),
                        papyr.layout.flex({ gap: '10px', align: 'center' },
                            papyr.input('password', 'Encryption Key...', { id: 'vault-key', style: { flex: 1 } }),
                            papyr.input('text', 'Secret Message...', { id: 'vault-msg', style: { flex: 2 } }),
                            papyr.button("Encrypt & Save", {
                                class: 'btn-primary',
                                onclick: () => {
                                    let k = document.getElementById('vault-key').value;
                                    let m = document.getElementById('vault-msg').value;
                                    if (!k || !m) return papyr.toast("Key and Message required", "error");
                                    
                                    papyr.storage.secureSet("papyr_vault_demo", m, k);
                                    savedData.value = m;
                                    rawLocalStorage.value = localStorage.getItem("papyr_vault_demo");
                                    papyr.toast("Encrypted and stored successfully!", "success");
                                }
                            })
                        ),
                        
                        papyr.h4("What Hackers See (LocalStorage):", { style: { margin: '20px 0 5px 0', color: '#f87171' } }),
                        papyr.pre(() => rawLocalStorage.value || "...", { 
                            style: { background: '#0f172a', padding: '10px', borderRadius: '6px', color: '#f87171', wordBreak: 'break-all', whiteSpace: 'pre-wrap' } 
                        }),

                        papyr.h4("What You See (Decrypted):", { style: { margin: '15px 0 5px 0', color: '#10b981' } }),
                        papyr.pre(() => savedData.value, { 
                            style: { background: '#0f172a', padding: '10px', borderRadius: '6px', color: '#10b981' } 
                        }),

                        papyr.button("Test Decrypt", {
                            style: { marginTop: '15px', background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '8px 16px', borderRadius: '6px' },
                            onclick: () => {
                                let k = document.getElementById('vault-key').value;
                                let decrypted = papyr.storage.secureGet("papyr_vault_demo", k);
                                if (decrypted) {
                                    papyr.toast("Decrypted successfully: " + decrypted, "success");
                                } else {
                                    papyr.toast("Decryption failed! Wrong key?", "error");
                                }
                            }
                        })
                    )
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
                papyr.toast("Blueprint copied to clipboard!", "success");
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

        return papyr.div("#docs.catalog-section.container", { style: { borderTop: '1px solid var(--border-solid)', paddingTop: '5rem' } },
            papyr.h2(".section-title:Interactive Component Catalog"),
            papyr.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "Papyr Complete comes pre-packed with layouts, widgets, navigation, tables, and popups. Select a component below to see it in action and review the copy-pasteable syntax."
            ),
            
            papyr.div(".catalog-grid",
                papyr.div("#catalog-sidebar-container.glass-panel", { style: { padding: '1rem', height: 'fit-content' } },
                    papyr.components.sidebar(listItems)
                ),
                
                papyr.flex.col({ style: { gap: '2rem' } },
                    papyr.div(".catalog-preview-area.glass-panel",
                        papyr.span(".catalog-meta", { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } },
                            papyr.icon('terminal', { size: 12, color: 'var(--teal)' }),
                            "LIVE COMPONENT INSTANCE"
                        ),
                        papyr.div("#catalog-rendered-component.demo-component-container")
                    ),
                    papyr.div(".glass-panel", { style: { padding: '1.5rem', background: '#090c15', position: 'relative' } },
                        papyr.span(".catalog-meta", { style: { top: '1rem', left: '1rem', fontSize: '0.75rem' } }),
                        papyr.button({
                            class: 'toolbar-btn',
                            style: { position: 'absolute', right: '1rem', top: '0.8rem', fontSize: '0.8rem', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                            onclick: copyBlueprint
                        }, papyr.icon('copy', { size: 14 }), "Copy Code"),
                        papyr.pre({ style: { margin: '2rem 0 0 0', overflowX: 'auto' } },
                            papyr.code("#catalog-code-view", { style: { fontFamily: 'var(--font-mono)', color: '#a5b4fc', fontSize: '0.9rem' } })
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
                    cardBody.appendChild(papyr.p(`"${text}"`, '.display-quote'));
                    cardBody.appendChild(papyr.p('— Programming Endpoint', '.display-author'));
                },
                fallback: (cardBody) => {
                    let randomIdx = Math.floor(Math.random() * BACKUP_QUOTES.length);
                    let quote = BACKUP_QUOTES[randomIdx];
                    cardBody.appendChild(papyr.p(`"${quote.text}"`, '.display-quote'));
                    cardBody.appendChild(papyr.p(`— ${quote.author}`, '.display-author'));
                }
            },
            {
                title: 'User Directory',
                desc: 'Load placeholder accounts from JSONPlaceholder.',
                url: 'https://jsonplaceholder.typicode.com/users',
                onSuccess: (cardBody, data) => {
                    let list = papyr.ul({ style: { padding: '0', margin: '0', listStyle: 'none', width: '100%' } });
                    data.slice(0, 3).forEach(user => {
                        list.appendChild(papyr.li(
                            papyr.flex.between(
                                papyr.span(user.name, { style: { fontWeight: '600', color: '#fff' } }),
                                papyr.span(user.email, { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } })
                            ),
                            { style: { padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' } }
                        ));
                    });
                    cardBody.appendChild(list);
                },
                fallback: (cardBody) => {
                    let list = papyr.ul({ style: { padding: '0', margin: '0', listStyle: 'none', width: '100%' } });
                    [
                        { name: "John Doe", email: "john@example.com" },
                        { name: "Jane Smith", email: "jane@example.com" }
                    ].forEach(user => {
                        list.appendChild(papyr.li(
                            papyr.flex.between(
                                papyr.span(user.name, { style: { fontWeight: '600', color: '#fff' } }),
                                papyr.span(user.email, { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } })
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
                let fetchedEl = await papyr.fetch(api.url, {
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

            return papyr.div(".api-card.glass-panel", { style: { padding: '1.5rem' } },
                papyr.div(".api-header",
                    papyr.h3(api.title, { style: { margin: '0', color: '#fff' } }),
                    papyr.span(".api-badge:active")
                ),
                papyr.p(api.desc, { style: { color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1rem 0' } }),
                papyr.div(`#${containerId}.api-content`),
                papyr.button("Trigger API Request", {
                    class: 'btn-primary',
                    onclick: () => triggerFetch(api, containerId)
                })
            );
        });

        return papyr.div(".container", { style: { paddingTop: '6rem' } },
            papyr.h2(".section-title", { style: { display: 'inline-flex', alignItems: 'center', gap: '8px' } },
                papyr.icon('bolt', { size: 24, color: 'var(--teal)' }),
                "Full Live API Integrations"
            ),
            papyr.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "Standard components natively loaded using `papyr.fetch` to query high-uptime developer endpoints. Everything executes with full loading states, micro-transitions, and custom error boundaries."
            ),
            papyr.div(".api-grid",
                ...apiCards,
                
                // Ring metric Canvas plugin workshop card
                papyr.div(".api-card.glass-panel", { style: { padding: '1.5rem' } },
                    papyr.div(".api-header",
                        papyr.h3("Extensible Charts", { style: { margin: '0', color: '#fff' } }),
                        papyr.span(".api-badge:canvas plugin", { style: { borderColor: '#10b981', color: '#10b981', background: 'rgba(16,185,129,0.1)' } })
                    ),
                    papyr.p("Render stunning circular graphs using our registered charts canvas plugin dynamically.", { style: { color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1rem 0' } }),
                    
                    papyr.div("#canvas-plugin-mount", { style: { flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                        // Reactive canvas binding
                        () => papyr.chart({ type: 'circle', value: ringPercent, colors: ['#10b981'] })
                    ),
                    
                    papyr.button("Randomize Progress Arc", {
                        class: 'btn-primary',
                        onclick: () => ringPercent.value = Math.floor(Math.random() * 80) + 20
                    })
                )
            )
        );
    };

    // 6. Project Quickstart & Framework Setup Guides (Requested)
    const FrameworkGuides = () => {
        let selectedTab = papyr.state('vanilla');

        const GUIDES = {
            vanilla: {
                title: "Vanilla HTML Setup Guide",
                sub: "Zero bundle config. Simply load papyr-complete.js and start writing.",
                code: `<!-- 1. Include CSS Variables & Library Complete -->
<link rel="stylesheet" href="styles.css">
<script src="https://eldrex-papyr-js.vercel.app/papyr-complete.js"></script>

<!-- 2. Mount root element -->
<div id="app"></div>

<!-- 3. Start coding! -->
<script>
    let title = papyr.h1(".text-center", "Hello Papyr!");
    papyr.mount("#app", title);
</script>`
            },
            bootstrap: {
                title: "Bootstrap Integration Setup Guide",
                sub: "Run Bootstrap elements instantly with zero styling links setups in index.html.",
                code: `<script src="https://eldrex-papyr-js.vercel.app/papyr-complete.js"></script>

<div id="app"></div>

<script>
    // 1. Injects Bootstrap CDN link dynamically
    papyr.loadFramework('bootstrap');

    // 2. Compose grid forms and buttons in papyr dot syntax
    let card = papyr.div(".card.bg-light.m-3",
        papyr.div(".card-body",
            papyr.h5(".card-title:Bootstrap Form"),
            papyr.input("text", "Enter name", { class: 'form-control mb-3' }),
            papyr.button(".btn.btn-primary:Submit")
        )
    );
    papyr.mount("#app", card);
</script>`
            },
            tailwind: {
                title: "Tailwind CSS Integration Guide",
                sub: "Utilize fully responsive Tailwind classes instantly at absolute zero config.",
                code: `<script src="https://eldrex-papyr-js.vercel.app/papyr-complete.js"></script>

<div id="app"></div>

<script>
    // 1. Injects Tailwind play script CDNs automatically
    papyr.loadFramework('tailwind');

    // 2. Write utility styling elements instantly
    let hero = papyr.section(".bg-slate-900.py-20.px-4.text-center.rounded-3xl.shadow-2xl",
        papyr.h1(".text-5xl.font-extrabold.text-white.mb-4:Tailwind Magic"),
        papyr.p(".text-slate-400.text-lg.mb-6:Instant tailwind utilities parsing!"),
        papyr.button(".bg-sky-500.hover:bg-sky-600.text-white.font-bold.py-3.px-6.rounded-full:Get Started")
    );
    papyr.mount("#app", hero);
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

        return papyr.div(".container", { style: { paddingTop: '4rem' } },
            papyr.div(".glass-panel", { style: { padding: '3rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(13,17,34,0.4) 100%)' } },
                papyr.h2(".section-title", { style: { marginTop: '0', display: 'inline-flex', alignItems: 'center', gap: '8px' } }, 
                    papyr.icon('star', { size: 24, color: 'var(--amber)' }), 
                    "Instant Framework Integrations"
                ),
                papyr.p({ style: { color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '700px' } },
                    "Link Papyr.js and begin building instantly! Choose your preferred styling stack below to view copy-pasteable startup guides. Papyr handles CDNs and DOM parsing dynamically."
                ),
                
                papyr.div(".guides-grid",
                    papyr.flex.col({ style: { justifyContent: 'center', gap: '12px' } },
                        papyr.button({
                            class: () => selectedTab.value === 'vanilla' ? 'gradient-btn' : 'toolbar-btn',
                            style: { width: '100%', justifyContent: 'flex-start', padding: '12px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' },
                            onclick: () => renderGuideCode('vanilla')
                        }, papyr.icon('palette', { size: 16 }), "Vanilla CSS Setup"),
                        papyr.button({
                            class: () => selectedTab.value === 'bootstrap' ? 'gradient-btn' : 'toolbar-btn',
                            style: { width: '100%', justifyContent: 'flex-start', padding: '12px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' },
                            onclick: () => renderGuideCode('bootstrap')
                        }, papyr.icon('star', { size: 16 }), "Bootstrap Framework"),
                        papyr.button({
                            class: () => selectedTab.value === 'tailwind' ? 'gradient-btn' : 'toolbar-btn',
                            style: { width: '100%', justifyContent: 'flex-start', padding: '12px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' },
                            onclick: () => renderGuideCode('tailwind')
                        }, papyr.icon('bolt', { size: 16 }), "Tailwind CSS Stack")
                    ),
                    
                    papyr.div({ style: { background: 'rgba(9, 12, 23, 0.6)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)' } },
                        papyr.h4(() => GUIDES[selectedTab.value].title, { style: { color: '#fff', margin: '0 0 4px 0' } }),
                        papyr.p(() => GUIDES[selectedTab.value].sub, { style: { color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1rem 0' } }),
                        papyr.pre({ style: { margin: '0', overflowX: 'auto' } },
                            papyr.code("#guide-code-mount", { style: { fontFamily: 'var(--font-mono)', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' } })
                        )
                    )
                )
            )
        );
    };

    // 7. Comparative frameworks grid
    const ComparisonSection = () => {
        return papyr.div(".container.comparison-section",
            papyr.h2(".section-title:Traditional Framework Comparison"),
            papyr.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "See why students and static-site developers prefer Papyr over heavy setup dependencies like Python Flask templates or verbose native Web APIs."
            ),
            
            papyr.div(".comparison-table-wrapper.glass-panel",
                papyr.table(".comparison-table", [
                    papyr.thead(
                        papyr.tr(
                            papyr.th("Development Task"),
                            papyr.th("Standard Web API (Native JS)"),
                            papyr.th("Python (Flask / Jinja)"),
                            papyr.th("Papyr JS Syntax", { style: { color: 'var(--primary)' } })
                        )
                    ),
                    papyr.tbody(
                        papyr.tr(
                            papyr.td(papyr.strong("CSS Styled Button")),
                            papyr.td("let b = document.createElement('button'); b.className = 'btn-blue'; b.innerText = 'Click';"),
                            papyr.td("Requires separate routing, templates mapping, and server renders."),
                            papyr.td(papyr.code("papyr.button('.btn-blue', 'Click')", { style: { color: '#38bdf8' } }))
                        ),
                        papyr.tr(
                            papyr.td(papyr.strong("Add Custom Data Fields")),
                            papyr.td("let d = document.createElement('div'); d.setAttribute('data-id', 123);"),
                            papyr.td("Requires template serialization syntax tags inside HTML."),
                            papyr.td(papyr.code("papyr.div({dataId: 123})", { style: { color: '#38bdf8' } }))
                        ),
                        papyr.tr(
                            papyr.td(papyr.strong("Render Dynamic Lists")),
                            papyr.td("Verbose for loops appending and nesting DOM tree branches recursively."),
                            papyr.td("Requires looping tags inside templates: {% for i in items %}."),
                            papyr.td(papyr.code("items.map(i => papyr.li(i))", { style: { color: '#38bdf8' } }))
                        )
                    )
                ])
            )
        );
    };

    // 8. Visual Footer
    const Footer = () => {
        return papyr.footer(".main-footer",
            papyr.div(".container",
                papyr.div(".social-links",
                    papyr.a({ href: 'https://github.com/EldrexDelosReyesBula/Papyr.js/', target: '_blank', style: { display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' } },
                        papyr.icon('github', { size: 16 }), "GitHub Repository"
                    ),
                    papyr.a({ href: 'docs.html#/docs.html', style: { display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' } },
                        papyr.icon('book', { size: 16 }), "Documentation"
                    ),
                    papyr.a({ href: '#playground', style: { display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' } },
                        papyr.icon('settings', { size: 16 }), "Plugin Registry"
                    ),
                    papyr.a({ href: 'https://eldrex-papyr-js.vercel.app/papyr-complete.js', target: '_blank', style: { display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' } },
                        papyr.icon('package', { size: 16 }), "CDN Package"
                    )
                ),
                papyr.p("Papyr and official plugins are open-source and released under the MIT License."),
                papyr.p("Crafted with absolute zero dependencies. Built entirely with Papyr.js.", { style: { fontSize: '0.75rem', marginTop: '10px', color: 'var(--text-muted)' } })
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
        let mathA = papyr.state(12);
        let mathB = papyr.state(8);
        let mathC = papyr.state(25);

        return papyr.div("#math-studio.container", { style: { paddingTop: '6rem' } },
            papyr.h2(".section-title", { style: { display: 'inline-flex', alignItems: 'center', gap: '8px' } },
                papyr.icon('bolt', { size: 24, color: 'var(--primary)' }),
                "Reactive Mathematical Studio"
            ),
            papyr.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "Unleash real-time formulas with our `papyr.math` computed module. Adjust inputs and see calculations refresh instantly in the DOM with zero delay."
            ),
            
            papyr.div(".grid", { style: { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' } },
                // Controls Column
                papyr.div(".glass-panel", { style: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' } },
                    papyr.h3("Aesthetic Sliders Studio", { style: { color: '#fff', margin: '0' } }),
                    
                    papyr.flex.col(
                        papyr.flex.between(
                            papyr.label("Variable A", { style: { fontWeight: '600', color: 'var(--text-muted)' } }),
                            papyr.span(() => mathA.value, { style: { color: 'var(--primary)', fontWeight: 'bold' } })
                        ),
                        papyr('input', {
                            type: 'range', min: '1', max: '100', value: '12',
                            style: { width: '100%', accentColor: 'var(--primary)' },
                            oninput: (e) => mathA.value = Number(e.target.value)
                        })
                    ),
                    
                    papyr.flex.col(
                        papyr.flex.between(
                            papyr.label("Variable B", { style: { fontWeight: '600', color: 'var(--text-muted)' } }),
                            papyr.span(() => mathB.value, { style: { color: 'var(--teal)', fontWeight: 'bold' } })
                        ),
                        papyr('input', {
                            type: 'range', min: '1', max: '100', value: '8',
                            style: { width: '100%', accentColor: 'var(--teal)' },
                            oninput: (e) => mathB.value = Number(e.target.value)
                        })
                    ),
                    
                    papyr.flex.col(
                        papyr.flex.between(
                            papyr.label("Variable C", { style: { fontWeight: '600', color: 'var(--text-muted)' } }),
                            papyr.span(() => mathC.value, { style: { color: '#ec4899', fontWeight: 'bold' } })
                        ),
                        papyr('input', {
                            type: 'range', min: '1', max: '100', value: '25',
                            style: { width: '100%', accentColor: '#ec4899' },
                            oninput: (e) => mathC.value = Number(e.target.value)
                        })
                    )
                ),
                
                // Formulate Computations Column
                papyr.div(".glass-panel", { style: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' } },
                    papyr.h3("Calculated Reactive Results", { style: { color: '#fff', margin: '0' } }),
                    
                    papyr.div(".responsive-split-grid",
                        papyr.div(".card", { style: { padding: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' } },
                            papyr.p("Sum (A + B + C)", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0' } }),
                            papyr.h2(papyr.math.sum(mathA, mathB, mathC), { style: { color: '#fff', margin: '8px 0 0 0' } })
                        ),
                        
                        papyr.div(".card", { style: { padding: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' } },
                            papyr.p("Average", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0' } }),
                            papyr.h2(papyr.math.round(papyr.math.avg(mathA, mathB, mathC), 1), { style: { color: 'var(--teal)', margin: '8px 0 0 0' } })
                        ),
                        
                        papyr.div(".card", { style: { padding: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' } },
                            papyr.p("Product (A * B)", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0' } }),
                            papyr.h2(papyr.math.mul(mathA, mathB), { style: { color: '#ec4899', margin: '8px 0 0 0' } })
                        ),
                        
                        papyr.div(".card", { style: { padding: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' } },
                            papyr.p("Ratio (C / B)", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0' } }),
                            papyr.h2(papyr.math.round(papyr.math.div(mathC, mathB), 2), { style: { color: 'var(--primary)', margin: '8px 0 0 0' } })
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
        let store = papyr.db('papyr-viral-contacts');
        if (store.state.value.length === 0) {
            store.insert({ name: "Eldrex Reyes", role: "Library Author", status: "Active" });
            store.insert({ name: "Satoshi Nakamoto", role: "Agile Architect", status: "Busy" });
            store.insert({ name: "Ada Lovelace", role: "Reactivity Expert", status: "Away" });
        }

        let searchQuery = papyr.state('');
        let newStatus = papyr.state('Active');

        let filteredContacts = papyr.computed(() => {
            let query = searchQuery.value.toLowerCase().trim();
            let all = store.state.value;
            if (!query) return all;
            return all.filter(item => 
                (item.name || '').toLowerCase().includes(query) || 
                (item.role || '').toLowerCase().includes(query)
            );
        });

        let listContainer = papyr.div(".contacts-grid", { 
            style: { 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                gap: '1.25rem',
                marginTop: '1.5rem'
            } 
        });

        // Computed reflow effect for database changes
        papyr.computed(() => {
            listContainer.innerHTML = '';
            let contacts = filteredContacts.value;
            if (contacts.length === 0) {
                listContainer.appendChild(papyr.div({ 
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
                let card = papyr.div(".contact-card.glass-panel", { 
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
                    papyr.flex.between(
                        papyr.flex.center(
                            papyr.div(user.name.charAt(0).toUpperCase(), { 
                                style: { 
                                    width: '36px', height: '36px', borderRadius: '50%', 
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--teal) 100%)', 
                                    color: '#fff', display: 'flex', alignItems: 'center', 
                                    justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' 
                                } 
                            }),
                            papyr.flex.col(
                                papyr.span(user.name, { style: { fontWeight: 'bold', color: '#fff', fontSize: '0.95rem' } }),
                                papyr.span(user.role, { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } })
                            ),
                            { style: { gap: '10px' } }
                        ),
                        papyr.flex.row(
                            papyr.button({
                                class: 'icon-btn',
                                style: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
                                onclick: () => {
                                    let nameInput = papyr.input('text', 'Name', { value: user.name });
                                    let roleInput = papyr.input('text', 'Role', { value: user.role });
                                    let statusSelect = papyr.select({ style: { width: '100%' } },
                                        papyr.option('Active', { value: 'Active' }),
                                        papyr.option('Busy', { value: 'Busy' }),
                                        papyr.option('Away', { value: 'Away' })
                                    );
                                    statusSelect.value = user.status;
                                    
                                    let editModal = papyr.modal(
                                        papyr.flex.col(
                                            papyr.flex.col(papyr.label("Name"), nameInput),
                                            papyr.flex.col(papyr.label("Role"), roleInput),
                                            papyr.flex.col(papyr.label("Status"), statusSelect),
                                            papyr.button("Update Record ⚡", {
                                                class: 'btn-primary',
                                                onclick: () => {
                                                    if (!nameInput.value.trim()) return papyr.toast("Name cannot be empty!", "error");
                                                    store.update(user.id, {
                                                        name: nameInput.value,
                                                        role: roleInput.value,
                                                        status: statusSelect.value
                                                    });
                                                    editModal.hide();
                                                    papyr.toast("Record updated successfully!", "success");
                                                }
                                            })
                                        ),
                                        "Edit Catalog Record"
                                    );
                                    document.body.appendChild(editModal);
                                    editModal.show();
                                }
                            }, papyr.icon('edit', { size: 14, color: 'var(--teal)' })),
                            papyr.button({
                                class: 'icon-btn',
                                style: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
                                onclick: () => {
                                    store.delete(user.id);
                                    papyr.toast("Contact safely removed.", "error");
                                }
                            }, papyr.icon('trash', { size: 14, color: '#f43f5e' })),
                            { style: { gap: '6px' } }
                        ),
                        { style: { alignItems: 'center' } }
                    ),
                    papyr.flex.between(
                        papyr.span(user.status, { 
                            style: { 
                                fontSize: '0.75rem', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                background: user.status === 'Active' ? 'rgba(16,185,129,0.1)' : user.status === 'Busy' ? 'rgba(234,179,8,0.1)' : 'rgba(244,63,94,0.1)',
                                color: user.status === 'Active' ? '#10b981' : user.status === 'Busy' ? '#eab308' : '#f43f5e',
                                border: '1px solid ' + (user.status === 'Active' ? 'rgba(16,185,129,0.2)' : user.status === 'Busy' ? 'rgba(234,179,8,0.2)' : 'rgba(244,63,94,0.2)')
                            }
                        }),
                        papyr.span(new Date(user.createdAt || Date.now()).toLocaleDateString(), { style: { fontSize: '0.75rem', color: 'var(--text-muted)' } }),
                        { style: { alignItems: 'center' } }
                    )
                );
                listContainer.appendChild(card);
            });
        });

                            return papyr.div("#crud-studio.container", { style: { paddingTop: '6rem' } },
            papyr.h2(".section-title", { style: { display: 'inline-flex', alignItems: 'center', gap: '8px' } },
                papyr.icon('database', { size: 24, color: 'var(--teal)' }),
                "Persistent Local CRUD Store"
            ),
            papyr.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "Store, filter, and modify records in a database backed completely by `papyr.db`. Refresh the page - all changes are persistent natively in your local browser storage!"
            ),
            
            papyr.div(".crud-grid",
                // Create Sidebar Form
                papyr.div(".glass-panel", { style: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' } },
                    papyr.h3("Add Safe Record", { style: { color: '#fff', margin: '0' } }),
                    
                    papyr.flex.col(
                        papyr.label("Developer Name", { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } }),
                        papyr('input', {
                            type: 'text', placeholder: 'Name...',
                            style: { width: '100%' }
                        })
                    ),
                    
                    papyr.flex.col(
                        papyr.label("System Role", { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } }),
                        papyr('input', {
                            type: 'text', placeholder: 'e.g., Lead Engineer',
                            style: { width: '100%' }
                        })
                    ),
                    
                    papyr.flex.col(
                        papyr.label("Initial Status", { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } }),
                        papyr.select({
                            style: { width: '100%' },
                            onchange: (e) => newStatus.value = e.target.value
                        },
                            papyr.option('Active', { value: 'Active' }),
                            papyr.option('Busy', { value: 'Busy' }),
                            papyr.option('Away', { value: 'Away' })
                        )
                    ),
                    
                    papyr.button("Save to Database 💾", {
                        class: 'btn-primary',
                        style: { width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '8px' },
                        onclick: (e) => {
                            let inputName = document.querySelector("#crud-studio input[placeholder='Name...']");
                            let inputRole = document.querySelector("#crud-studio input[placeholder='e.g., Lead Engineer']");
                            
                            let nameVal = inputName ? inputName.value.trim() : '';
                            let roleVal = inputRole ? inputRole.value.trim() : '';
                            
                            if(!nameVal) return papyr.toast("Please specify a developer name!", "error");
                            
                            store.insert({
                                name: nameVal,
                                role: roleVal || 'Contributor',
                                status: newStatus.value
                            });
                            
                            if (inputName) inputName.value = '';
                            if (inputRole) inputRole.value = '';
                            
                            papyr.toast("Record persistent created! 🎉", "success");
                        }
                    })
                ),
                
                // Live View catalog list area
                papyr.div(".catalog-preview-area.glass-panel", { style: { padding: '1.5rem', display: 'flex', flexDirection: 'column' } },
                    papyr.flex.between(
                        papyr.div(
                            papyr.span(() => `Safe Cache: ${store.state.value.length} Developers`, { 
                                style: { 
                                    fontWeight: 'bold', color: '#fff', fontSize: '1rem',
                                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                                } 
                            })
                        ),
                        papyr.button({
                            class: 'toolbar-btn',
                            style: { borderColor: '#f43f5e', color: '#f43f5e', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                            onclick: () => {
                                store.clear();
                                papyr.toast("Database catalog purged.", "error");
                            }
                        }, papyr.icon('trash', { size: 14, color: '#f43f5e' }), "Reset Store")
                    ),
                    
                    papyr.div({ style: { marginTop: '1rem' } },
                        papyr('input', {
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
        return papyr.fragment(
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

    // Mount entire dynamic Papyr page to the app mount root
    papyr.mount("#app", MainApp());

})();
