/**
 * PAPER.JS DOCUMENTATION PLATFORM
 * Built natively with Paper.js Router.
 */

// Define Documentation Components

const Overview = () => {
    return paper.div(
        paper.div('.hero-banner', { animate: 'slide-up' },
            paper.h1("Paper.js Documentation"),
            paper.p("The zero-dependency, ultra-lightweight frontend library that brings the joy back to web development. Write cleaner code, ship faster, and never configure a bundler again.", { style: { fontSize: '1.2rem', maxWidth: '600px' } }),
            paper.a("Back to Sandbox", { href: 'app.html', class: 'btn-primary', style: { display: 'inline-block', marginTop: '1rem', padding: '10px 20px', background: 'var(--primary)', color: 'white', borderRadius: '6px' } })
        ),
        
        paper.h2("Why Paper.js?"),
        paper.p("Modern frameworks like React and Vue are powerful, but they require complex build steps, hundreds of megabytes of node_modules, and steep learning curves. Paper.js eliminates all of that."),
        
        paper.div('.grid.grid-cols-2', { style: { gap: '2rem', marginTop: '2rem' } },
            paper.div(
                paper.h3("🚀 Zero Build Tools"),
                paper.p("No Webpack. No Vite. No NPM. Just drop in a single `<script>` tag and start coding instantly.")
            ),
            paper.div(
                paper.h3("⚡ Native Performance"),
                paper.p("By skipping the Virtual DOM overhead and directly compiling to native DOM nodes, Paper achieves blistering runtime speeds.")
            ),
            paper.div(
                paper.h3("🧩 Full Ecosystem"),
                paper.p("Comes pre-packaged with Reactivity, HTML5 SPA Routing, Component architecture, and native Canvas Charts.")
            ),
            paper.div(
                paper.h3("👶 Beginner Friendly"),
                paper.p("If you know standard HTML tags and JavaScript objects, you already know how to write Paper.js.")
            )
        )
    );
};

const GettingStarted = () => {
    return paper.div({ animate: 'fade-in' },
        paper.h1("Getting Started"),
        paper.p("Paper.js is designed to be plug-and-play. Let's get your first app running in 60 seconds."),
        
        paper.h2("1. Installation"),
        paper.p("Simply include the CDN link at the top of your HTML file:"),
        paper.pre(paper.code(`<script src="https://eldrex-paper-js.vercel.app/paper-complete.js"></script>`)),
        
        paper.h2("2. Create an Entry Point"),
        paper.p("Add a container `<div>` to your HTML body where your app will live:"),
        paper.pre(paper.code(`<body>\n    <div id="app"></div>\n</body>`)),
        
        paper.h2("3. Write your App"),
        paper.p("Create a `script` block at the bottom of your body and use `paper.mount()`:"),
        paper.pre(paper.code(`<script>\n    // Define a reactive variable\n    let count = paper.state(0);\n\n    // Create a component\n    let App = paper.div(\n        paper.h1("Hello Paper!"),\n        paper.button(\n            // Bind reactive state directly as text\n            () => \`Clicked \${count.value} times\`, \n            { onclick: () => count.value++ }\n        )\n    );\n\n    // Mount to DOM\n    paper.mount('#app', App);\n</script>`))
    );
};

const Comparison = () => {
    return paper.div({ animate: 'slide-up' },
        paper.h1("Vanilla JS vs Paper.js"),
        paper.p("See how Paper.js dramatically reduces boilerplate and improves readability compared to raw Vanilla JavaScript."),
        
        paper.h2("Vanilla JavaScript Approach"),
        paper.p("Creating a simple div with a class and a click event:"),
        paper.pre(paper.code(`const container = document.createElement('div');
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

        paper.h2("The Paper.js Approach"),
        paper.p("Achieve the exact same native DOM structure in one readable expression:"),
        paper.pre(paper.code(`let app = paper.div('.card',
    paper.h2('Welcome'),
    paper.button('Click Me', { onclick: () => alert('Hello!') })
);

paper.mount('body', app);`)),

        paper.div('.hero-banner', { style: { marginTop: '2rem', background: 'rgba(20, 184, 166, 0.1)', borderColor: 'rgba(20, 184, 166, 0.3)' } },
            paper.h3("The Result", { style: { margin: 0, color: '#14b8a6' } }),
            paper.p("Paper reduces boilerplate by 80% while retaining 100% of the raw execution speed.")
        )
    );
};

const CommonErrors = () => {
    return paper.div({ animate: 'fade-in' },
        paper.h1("Troubleshooting & Common Errors"),
        paper.p("A guide to resolving the most frequent mistakes made when learning Paper.js."),
        
        paper.h2("1. `[object HTMLCanvasElement]` rendered as text"),
        paper.p("If you return a DOM node dynamically inside a function, but you forgot to return it properly, or you are using an older version of the engine, it might stringify."),
        paper.pre(paper.code(`// BAD:\npaper.div(() => paper.chart(...))\n\n// GOOD (Make sure you are using paper-complete.js v3.1+):\npaper.div(() => paper.chart({ type: 'circle' }))`)),
        
        paper.h2("2. `paper.someTag is not a function`"),
        paper.p("If you misspell a tag, the engine will warn you in the console: `PaperWarning: Unknown tag 'buttonn'. Did you mean 'button'?`"),
        
        paper.h2("3. Reactivity Not Updating"),
        paper.p("Ensure you are updating the `.value` property of the state variable, not re-assigning the object."),
        paper.pre(paper.code(`let count = paper.state(0);\n\n// BAD:\ncount = 1;\n\n// GOOD:\ncount.value = 1;`))
    );
};

// Routing setup
paper.route('/docs.html', Overview);
paper.route('/docs/getting-started', GettingStarted);
paper.route('/docs/comparison', Comparison);
paper.route('/docs/troubleshooting', CommonErrors);

// Sidebar Navigation
const Sidebar = () => {
    // Current path tracking for active styles
    let currentPath = paper.state(window.location.pathname);
    window.addEventListener('popstate', () => currentPath.value = window.location.pathname);
    
    const Link = (path, label) => {
        return paper.a(label, {
            href: path,
            class: paper.computed(() => currentPath.value === path ? 'sidebar-link active' : 'sidebar-link')
        });
    };

    return paper.div('.sidebar',
        paper.div({ style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', padding: '0 1rem' } },
            paper.img({ src: 'https://eldrex.landecs.org/logo/eldrex-paper-js.png', width: 32, height: 32 }),
            paper.h2("Paper.js", { style: { margin: 0, fontSize: '1.2rem', border: 'none' } })
        ),
        
        paper.div('.nav-section', { style: { marginBottom: '1.5rem' } },
            paper.div("INTRODUCTION", { style: { fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', margin: '0 0 0.5rem 1rem' } }),
            Link('/docs.html', 'Overview'),
            Link('/docs/getting-started', 'Getting Started'),
            Link('/docs/comparison', 'Vanilla vs Paper')
        ),
        
        paper.div('.nav-section',
            paper.div("GUIDES", { style: { fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', margin: '0 0 0.5rem 1rem' } }),
            Link('/docs/troubleshooting', 'Common Errors')
        )
    );
};

// App Layout Structure
const DocsLayout = paper.div(
    Sidebar(),
    paper.div('.content-area',
        paper.router()
    )
);

// Mount
paper.mount('#docs-app', DocsLayout);
