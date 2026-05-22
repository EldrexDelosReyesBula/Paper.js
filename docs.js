/**
 * PAPER.JS DOCUMENTATION PLATFORM
 * Built natively with Papyr.js Router.
 */

// Define Documentation Components

const Overview = () => {
    return papyr.div(
        papyr.div('.hero-banner', { animate: 'slide-up' },
            papyr.h1("Papyr.js Documentation"),
            papyr.p("The zero-dependency, ultra-lightweight frontend library that brings the joy back to web development. Write cleaner code, ship faster, and never configure a bundler again.", { style: { fontSize: '1.2rem', maxWidth: '600px' } }),
            papyr.a("Back to Sandbox", { href: 'app.html', class: 'btn-primary', style: { display: 'inline-block', marginTop: '1rem', padding: '10px 20px', background: 'var(--primary)', color: 'white', borderRadius: '6px' } })
        ),
        
        papyr.h2("Why Papyr.js?"),
        papyr.p("Modern frameworks like React and Vue are powerful, but they require complex build steps, hundreds of megabytes of node_modules, and steep learning curves. Papyr.js eliminates all of that."),
        
        papyr.div('.grid.grid-cols-2', { style: { gap: '2rem', marginTop: '2rem' } },
            papyr.div(
                papyr.h3("🚀 Zero Build Tools"),
                papyr.p("No Webpack. No Vite. No NPM. Just drop in a single `<script>` tag and start coding instantly.")
            ),
            papyr.div(
                papyr.h3("⚡ Native Performance"),
                papyr.p("By skipping the Virtual DOM overhead and directly compiling to native DOM nodes, Papyr achieves blistering runtime speeds.")
            ),
            papyr.div(
                papyr.h3("🧩 Full Ecosystem"),
                papyr.p("Comes pre-packaged with Reactivity, HTML5 SPA Routing, Component architecture, and native Canvas Charts.")
            ),
            papyr.div(
                papyr.h3("👶 Beginner Friendly"),
                papyr.p("If you know standard HTML tags and JavaScript objects, you already know how to write Papyr.js.")
            )
        )
    );
};

const GettingStarted = () => {
    return papyr.div({ animate: 'fade-in' },
        papyr.h1("Getting Started"),
        papyr.p("Papyr.js is designed to be plug-and-play. Let's get your first app running in 60 seconds."),
        
        papyr.h2("1. Installation"),
        papyr.p("Simply include the CDN link at the top of your HTML file:"),
        papyr.pre(papyr.code(`<script src="https://papyrus-js.vercel.app/papyr-complete.js"></script>`)),
        
        papyr.h2("2. Create an Entry Point"),
        papyr.p("Add a container `<div>` to your HTML body where your app will live:"),
        papyr.pre(papyr.code(`<body>\n    <div id="app"></div>\n</body>`)),
        
        papyr.h2("3. Write your App"),
        papyr.p("Create a `script` block at the bottom of your body and use `papyr.mount()`:"),
        papyr.pre(papyr.code(`<script>\n    // Define a reactive variable\n    let count = papyr.state(0);\n\n    // Create a component\n    let App = papyr.div(\n        papyr.h1("Hello Papyr!"),\n        papyr.button(\n            // Bind reactive state directly as text\n            () => \`Clicked \${count.value} times\`, \n            { onclick: () => count.value++ }\n        )\n    );\n\n    // Mount to DOM\n    papyr.mount('#app', App);\n</script>`))
    );
};

const Comparison = () => {
    return papyr.div({ animate: 'slide-up' },
        papyr.h1("Vanilla JS vs Papyr.js"),
        papyr.p("See how Papyr.js dramatically reduces boilerplate and improves readability compared to raw Vanilla JavaScript."),
        
        papyr.h2("Vanilla JavaScript Approach"),
        papyr.p("Creating a simple div with a class and a click event:"),
        papyr.pre(papyr.code(`const container = document.createElement('div');
container.className = 'card';

const title = document.createElement('h2');
title.textContent = 'Welcome';

const button = document.createElement('button');
button.textContent = 'Click Me';
button.onclick = function() {
    alert('Hello!');
};

container.appendChild(title);
container.appendChild(button);
document.body.appendChild(container);`)),

        papyr.h2("The Papyr.js Approach"),
        papyr.p("Achieve the exact same native DOM structure in one readable expression:"),
        papyr.pre(papyr.code(`let app = papyr.div('.card',
    papyr.h2('Welcome'),
    papyr.button('Click Me', { onclick: () => alert('Hello!') })
);

papyr.mount('body', app);`)),

        papyr.div('.hero-banner', { style: { marginTop: '2rem', background: 'rgba(20, 184, 166, 0.1)', borderColor: 'rgba(20, 184, 166, 0.3)' } },
            papyr.h3("The Result", { style: { margin: 0, color: '#14b8a6' } }),
            papyr.p("Papyr reduces boilerplate by 80% while retaining 100% of the raw execution speed.")
        )
    );
};

const CommonErrors = () => {
    return papyr.div({ animate: 'fade-in' },
        papyr.h1("Troubleshooting & Common Errors"),
        papyr.p("A guide to resolving the most frequent mistakes made when learning Papyr.js."),
        
        papyr.h2("1. `[object HTMLCanvasElement]` rendered as text"),
        papyr.p("If you return a DOM node dynamically inside a function, but you forgot to return it properly, or you are using an older version of the engine, it might stringify."),
        papyr.pre(papyr.code(`// BAD:\npapyr.div(() => papyr.chart(...))\n\n// GOOD (Make sure you are using papyr-complete.js v3.1+):\npapyr.div(() => papyr.chart({ type: 'circle' }))`)),
        
        papyr.h2("2. `papyr.someTag is not a function`"),
        papyr.p("If you misspell a tag, the engine will warn you in the console: `PapyrWarning: Unknown tag 'buttonn'. Did you mean 'button'?`"),
        
        papyr.h2("3. Reactivity Not Updating"),
        papyr.p("Ensure you are updating the `.value` property of the state variable, not re-assigning the object."),
        papyr.pre(papyr.code(`let count = papyr.state(0);\n\n// BAD:\ncount = 1;\n\n// GOOD:\ncount.value = 1;`))
    );
};

// Routing setup
papyr.route('#/docs.html', Overview);
papyr.route('#/docs/getting-started', GettingStarted);
papyr.route('#/docs/comparison', Comparison);
papyr.route('#/docs/troubleshooting', CommonErrors);

// Sidebar Navigation and Reactive Collapsible State
let isMenuOpen = papyr.state(false);
let currentPath = papyr.state(window.location.hash || '#/docs.html');

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash;
    isMenuOpen.value = false; // Auto-close menu on navigation
});

const getSvgLogo = (size = 32, animated = false) => {
    const hoverStyle = animated ? `cursor: pointer; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);` : '';
    const hoverEvents = animated ? `onmouseover="this.style.transform='scale(1.15) rotate(5deg)'" onmouseout="this.style.transform='scale(1) rotate(0deg)'"` : '';
    return papyr.html(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" style="display: block; filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.35)); ${hoverStyle}" ${hoverEvents}>
            <defs>
                <linearGradient id="logo-hex-grad-docs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6366f1" />
                    <stop offset="100%" stop-color="#4f46e5" />
                </linearGradient>
                <linearGradient id="logo-p-grad-docs" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#14b8a6" />
                    <stop offset="100%" stop-color="#06b6d4" />
                </linearGradient>
            </defs>
            <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="rgba(10, 15, 30, 0.65)" stroke="url(#logo-hex-grad-docs)" stroke-width="6" stroke-linejoin="round" />
            <path d="M35,28 L35,72" stroke="url(#logo-hex-grad-docs)" stroke-width="10" stroke-linecap="round" />
            <path d="M35,28 C55,28 68,36 68,46 C68,56 55,60 35,60" fill="none" stroke="url(#logo-p-grad-docs)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M35,46 L52,46 L35,60" fill="rgba(20, 184, 166, 0.15)" stroke="none" />
        </svg>
    `);
};

// 1. Mobile Top Sticky Header
const MobileHeader = () => {
    return papyr.div('.mobile-header',
        papyr.a('.mobile-logo', { href: '#' },
            getSvgLogo(28),
            papyr.span("Papyr Docs")
        ),
        papyr.button('.menu-toggle',
            { 
                onclick: () => isMenuOpen.value = !isMenuOpen.value 
            },
            () => isMenuOpen.value ? '✕' : '☰'
        )
    );
};

// 2. Sidebar Backdrop Overlay
const SidebarOverlay = () => {
    return papyr.div({
        class: papyr.computed(() => isMenuOpen.value ? 'sidebar-overlay active' : 'sidebar-overlay'),
        onclick: () => isMenuOpen.value = false
    });
};

const Sidebar = () => {
    const Link = (path, label) => {
        return papyr.a(label, {
            href: path,
            class: papyr.computed(() => currentPath.value === path ? 'sidebar-link active' : 'sidebar-link'),
            onclick: () => isMenuOpen.value = false
        });
    };

    return papyr.div({
        class: papyr.computed(() => isMenuOpen.value ? 'sidebar open' : 'sidebar')
    },
        papyr.div({ style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', padding: '0 1rem' } },
            getSvgLogo(32, true),
            papyr.h2("Papyr.js", { style: { margin: 0, fontSize: '1.2rem', border: 'none', color: '#fff' } })
        ),
        
        papyr.div('.nav-section', { style: { marginBottom: '1.5rem' } },
            papyr.div("INTRODUCTION", { style: { fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', margin: '0 0 0.5rem 1rem' } }),
            Link('#/docs.html', 'Overview'),
            Link('#/docs/getting-started', 'Getting Started'),
            Link('#/docs/comparison', 'Vanilla vs Paper')
        ),
        
        papyr.div('.nav-section',
            papyr.div("GUIDES", { style: { fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', margin: '0 0 0.5rem 1rem' } }),
            Link('#/docs/troubleshooting', 'Common Errors')
        )
    );
};

// App Layout Structure
const DocsLayout = papyr.div(
    MobileHeader(),
    SidebarOverlay(),
    Sidebar(),
    papyr.div('.content-area',
        papyr.router()
    )
);

// Mount
papyr.mount('#docs-app', DocsLayout);
