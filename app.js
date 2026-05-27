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

return app;`,

        immersive: `// 🌌 Immersive 3D worlds with zero-dependency high-performance fallback!
let stateWorld = papyr.state('space');
let container = papyr.div('.relative.w-full.h-full', { style: { minHeight: '320px', borderRadius: '12px', overflow: 'hidden' } });

const rebuildScene = () => {
    container.innerHTML = '';
    
    // Mount the gorgeous immersive scene (detects THREE globally, or runs high-performance fallbacks)
    let scene = papyr['3d'].scene({
        environment: stateWorld.value,
        depth: true,
        overlay: papyr.div('.text-center.p-4', { style: { pointerEvents: 'auto', background: 'rgba(5, 5, 10, 0.65)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' } },
            papyr.h3("🌌 Cinematic Preset: " + stateWorld.value.toUpperCase(), { style: { color: 'white', margin: '0 0 4px 0' } }),
            papyr.p("Move pointer to tilt the camera in 3D parallax depth space.", { style: { color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 12px 0' } }),
            papyr.flex.row({ justify: 'center', gap: '8px' },
                papyr.button("Deep Space", { 
                    style: { padding: '6px 12px', fontSize: '0.75rem', background: stateWorld.value === 'space' ? '#6366f1' : 'rgba(255,255,255,0.08)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }, 
                    onclick: () => { stateWorld.value = 'space'; rebuildScene(); } 
                }),
                papyr.button("Cyberpunk", { 
                    style: { padding: '6px 12px', fontSize: '0.75rem', background: stateWorld.value === 'cyberpunk' ? '#ff007f' : 'rgba(255,255,255,0.08)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }, 
                    onclick: () => { stateWorld.value = 'cyberpunk'; rebuildScene(); } 
                }),
                papyr.button("Deep Sea", { 
                    style: { padding: '6px 12px', fontSize: '0.75rem', background: stateWorld.value === 'underwater' ? '#00f0ff' : 'rgba(255,255,255,0.08)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }, 
                    onclick: () => { stateWorld.value = 'underwater'; rebuildScene(); } 
                })
            )
        )
    });
    
    container.appendChild(scene);
};

rebuildScene();
return container;`,

        ssr: `// 🖧 High-performance Server-Side Rendering (SSR) & Express Templates!
let app = papyr.flex.col(
    papyr.h3("🖧 Papyr Server-Side Renderer (SSR)", { style: { color: 'white', margin: '0' } }),
    papyr.p("Renders living reactive DOM nodes directly into standard static HTML strings.", { style: { fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 10px 0' } }),
    papyr.div(".card", { style: { background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: '100%' } },
        papyr.h4("Compiled Static HTML Output:", { style: { color: '#38bdf8', fontSize: '0.9rem', margin: '0 0 8px 0' } }),
        papyr.pre({ style: { background: '#090d16', padding: '12px', borderRadius: '6px', overflowX: 'auto', border: '1px solid rgba(56, 189, 248, 0.2)' } },
            papyr.code(() => {
                // Let's create an element and serialize it to static HTML string
                let el = papyr.div('.user-profile', { id: 'usr-12', style: { color: '#818cf8', fontWeight: 'bold' } },
                    papyr.h4("Developer Profile"),
                    papyr.p("Zero configuration deployment setups.")
                );
                return papyr.ssr(el);
            }, { style: { color: '#a7f3d0', fontSize: '0.8rem', fontFamily: 'monospace' } })
        )
    )
);
return app;`,

        react: `// ⚛️ Seamless React & Next.js Ecosystem Wrapper
let app = papyr.flex.col(
    papyr.h3("⚛️ Next.js & React Integration", { style: { color: 'white', margin: '0' } }),
    papyr.p("Easily subscribe React functional components to fine-grained state updates or mount Papyr elements.", { style: { fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 15px 0' } }),
    papyr.div(".card", { style: { background: 'rgba(129, 140, 248, 0.05)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(129, 140, 248, 0.15)', width: '100%' } },
        papyr.h4("Integration Syntax Cheat-Sheet:", { style: { color: '#818cf8', fontSize: '0.9rem', margin: '0 0 10px 0' } }),
        papyr.pre({ style: { background: '#090d16', padding: '12px', borderRadius: '6px', overflowX: 'auto' } },
            papyr.code(\`// Next.js page component
import { useState, useEffect } from 'react';
import { papyr } from 'papyr';

export default function Dashboard() {
  // Subscribe to fine-grained Papyr states
  const count = papyr.react.useStore(myGlobalPapyrState);

  return (
    <div>
      <h3>React Counter: {count}</h3>
      {/* Mount raw Papyr elements natively */}
      <papyr.react.Component el={() => papyr.div('.card', 'Hello from Papyr!')} />
    </div>
  );
}\`, { style: { color: '#e2e8f0', fontSize: '0.75rem', fontFamily: 'monospace' } })
        )
    )
);
return app;`,

        ai: `// 🤖 AI-Friendly Flat Semantic JSON Formats
let app = papyr.flex.col(
    papyr.h3("🤖 AI-Readable Semantic JSON", { style: { color: 'white', margin: '0' } }),
    papyr.p("Flattens complex DOM nodes into semantic structures for LLMs to generate or modify easily.", { style: { fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 10px 0' } }),
    
    papyr.div(".card", { style: { background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', width: '100%' } },
        papyr.h4("AI-Generated Flat JSON:", { style: { color: '#34d399', fontSize: '0.9rem', margin: '0 0 8px 0' } }),
        papyr.pre({ style: { background: '#090d16', padding: '12px', borderRadius: '6px', overflowX: 'auto', border: '1px solid rgba(52, 211, 153, 0.2)' } },
            papyr.code(() => {
                let rawEl = papyr.div('.p-4.bg-indigo-900.rounded-xl', { id: 'ai-card' },
                    papyr.h3("Generated Headline"),
                    papyr.p("Created in seconds by AI Agents.")
                );
                let json = papyr.ai.toSemanticJSON(rawEl);
                return JSON.stringify(json, null, 2);
            }, { style: { color: '#a7f3d0', fontSize: '0.75rem', fontFamily: 'monospace' } })
        )
    )
);
return app;`,

        physics: `// ⚽ High-Performance 2D Rigid Verlet Physics Simulation!
let container = papyr.div('.relative.w-full', { style: { minHeight: '380px' } });

let controls = papyr.flex.row({ justify: 'between', align: 'center', style: { marginBottom: '10px' } },
    papyr.h4("⚽ Interactive Verlet Sandbox", { style: { color: '#fff', margin: '0' } }),
    papyr.button("Add Rigid Node", {
        class: 'btn-primary',
        style: { fontSize: '0.8rem', padding: '6px 12px' },
        onclick: () => {
            const world = container.querySelector('.papyr-physics-wrapper')._verletWorld;
            if (world) {
                const colors = ['#6366f1', '#14b8a6', '#ff007f', '#00f0ff', '#eab308'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const radius = Math.random() * 15 + 12;
                world.addBody(
                    Math.random() * (world.canvas.width - 50) + 25, 
                    40, 
                    radius, 
                    { vx: Math.random() * 6 - 3, vy: 0, color: color }
                );
                papyr.toast("Physical Node Spawned! ⚽", "success");
            }
        }
    })
);

// Spawn physics world (auto-upgrades to Matter.js if available, otherwise Verlet fallback)
let worldComponent = papyr.physics.world({ gravity: 0.4, friction: 0.99 });

container.appendChild(controls);
container.appendChild(worldComponent);

return container;`,

        science: `// 📈 Scientific Equation Grapher & Conversion Calculator
let equationText = papyr.state("Math.sin(x)");
let conversionValue = papyr.state(100);
let convertedValue = papyr.computed(() => papyr.science.convert(conversionValue.value, 'c', 'f').toFixed(2));

let graphContainer = papyr.div({ style: { flex: 1, minHeight: '260px' } });

const redrawGraph = () => {
    graphContainer.innerHTML = '';
    let graph = papyr.science.graph({
        equation: equationText.value,
        range: [-10, 10, -5, 5],
        color: '#10b981'
    });
    graphContainer.appendChild(graph);
};

let app = papyr.flex.col(
    papyr.h3("📊 STEM Equation Plotter & Converter", { style: { color: 'white', margin: '0 0 10px 0' } }),
    
    // Graph Area
    papyr.flex.row({ style: { gap: '12px', marginBottom: '16px' } },
        papyr.input("text", "Math.sin(x)", {
            style: { flex: 1 },
            oninput: (e) => {
                equationText.value = e.target.value;
                redrawGraph();
            }
        }),
        papyr.button("Plot Equation", {
            class: 'btn-primary',
            onclick: redrawGraph
        })
    ),
    graphContainer,
    
    // STEM Converter Area
    papyr.div('.card', { style: { background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px' } },
        papyr.h4("🌡️ STEM Conversion Solver", { style: { color: 'white', margin: '0 0 8px 0' } }),
        papyr.flex.row({ align: 'center', style: { gap: '10px' } },
            papyr.input("number", "100", {
                style: { width: '80px' },
                oninput: (e) => conversionValue.value = parseFloat(e.target.value) || 0
            }),
            papyr.span("°Celsius  ➡  ", { style: { color: '#cbd5e1' } }),
            papyr.span(() => convertedValue.value + " °Fahrenheit", { style: { color: '#14b8a6', fontWeight: 'bold' } })
        )
    )
);

// Initial plot rendering
setTimeout(redrawGraph, 100);

return app;`,

        system: `// 📁 OS Sandboxed File Access & System Interactions
let fileText = papyr.state("Type some content here, then save it to your local file system!");

let app = papyr.flex.col(
    papyr.h3("📁 Local File Sandbox & Copy/Paste", { style: { color: 'white', margin: '0' } }),
    papyr.p("Write sandboxed helper systems directly using native Web API wrappers safely.", { style: { fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 12px 0' } }),
    
    papyr.textarea({
        style: { width: '100%', height: '100px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '10px', fontSize: '0.85rem', fontFamily: 'monospace', marginBottom: '12px' },
        oninput: (e) => fileText.value = e.target.value,
        textContent: fileText.value
    }),
    
    papyr.flex.row({ style: { gap: '8px' } },
        papyr.button("Save to Disk 💾", {
            class: 'btn-primary',
            onclick: () => {
                papyr.fs.save(fileText.value, 'my-document.txt', 'text/plain')
                    .then(file => papyr.toast("Successfully Saved " + file + "! 🎉", "success"))
                    .catch(err => papyr.toast("Save failed: " + err.message, "error"));
            }
        }),
        papyr.button("Clipboard Copy 📋", {
            class: 'toolbar-btn',
            style: { color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' },
            onclick: () => {
                papyr.system.clipboard.copy(fileText.value)
                    .then(() => papyr.toast("Copied to System Clipboard! 📋", "success"))
                    .catch(err => papyr.toast("Clipboard copy failed: " + err.message, "error"));
            }
        }),
        papyr.button("Notify Me 🔔", {
            class: 'toolbar-btn',
            style: { color: '#a855f7', borderColor: 'rgba(168, 85, 247, 0.4)' },
            onclick: () => {
                papyr.system.notify("Papyr Workspace Notification 🔔", {
                    body: "We have built seven new premium plugin capability modules successfully!"
                }).then(success => {
                    if (success) papyr.toast("System notification fired! 🔔", "success");
                    else papyr.toast("Permission denied for push notifications.", "info");
                });
            }
        })
    )
);

return app;`,

        ai_chat: `// 💬 Premium AI Assistant & Unified Provider Chat
let provider = papyr.state('openai');
let apiKey = papyr.state('');
let queryText = papyr.state('');
let responseText = papyr.state('Enter your secure API key and prompt below to communicate with real AI models natively from your browser.');
let isLoading = papyr.state(false);

let app = papyr.flex.col(
    papyr.h3("💬 Multi-Provider AI Assistant", { style: { color: 'white', margin: '0 0 10px 0' } }),
    
    papyr.flex.row({ align: 'center', style: { gap: '10px', marginBottom: '12px' } },
        papyr.span("Select API Provider:", { style: { color: '#94a3b8', fontSize: '0.85rem' } }),
        papyr.button(() => provider.value === 'openai' ? 'OpenAI ⭐' : 'OpenAI', {
            style: { fontSize: '0.75rem', padding: '4px 10px', background: provider.value === 'openai' ? '#6366f1' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#fff' },
            onclick: () => provider.value = 'openai'
        }),
        papyr.button(() => provider.value === 'gemini' ? 'Gemini ⭐' : 'Gemini', {
            style: { fontSize: '0.75rem', padding: '4px 10px', background: provider.value === 'gemini' ? '#10b981' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#fff' },
            onclick: () => provider.value = 'gemini'
        }),
        papyr.button(() => provider.value === 'anthropic' ? 'Anthropic ⭐' : 'Anthropic', {
            style: { fontSize: '0.75rem', padding: '4px 10px', background: provider.value === 'anthropic' ? '#a855f7' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#fff' },
            onclick: () => provider.value = 'anthropic'
        })
    ),

    papyr.flex.row({ align: 'center', style: { gap: '10px', marginBottom: '12px' } },
        papyr.span("Enter Secure API Key:", { style: { color: '#94a3b8', fontSize: '0.85rem' } }),
        papyr.input("password", "sk-...", {
            style: { flex: 1, padding: '6px 10px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff' },
            oninput: (e) => apiKey.value = e.target.value
        })
    ),
    papyr.p("🔒 Security & Privacy: API keys are strictly in-memory client-side and never saved or shared with third parties.", { style: { fontSize: '0.72rem', color: '#64748b', margin: '-8px 0 16px 0' } }),
    
    papyr.flex.row({ style: { gap: '10px', marginBottom: '16px' } },
        papyr.input("text", "Ask the AI assistant something...", {
            style: { flex: 1 },
            oninput: (e) => queryText.value = e.target.value
        }),
        papyr.button(() => isLoading.value ? "Thinking..." : "Send Chat ⚡", {
            class: 'btn-primary',
            onclick: () => {
                if (!apiKey.value.trim()) return papyr.toast("Please enter your API Key first!", "error");
                if (!queryText.value.trim()) return papyr.toast("Please type a message!", "error");
                isLoading.value = true;
                responseText.value = "Sending request to " + provider.value + " endpoints...";
                
                papyr.ai.chat({
                    provider: provider.value,
                    apiKey: apiKey.value,
                    messages: [{ role: 'user', content: queryText.value }]
                }).then(res => {
                    responseText.value = res.text;
                    papyr.toast("AI response received! ⚡", "success");
                }).catch(err => {
                    responseText.value = "Error: " + err.message;
                    papyr.toast("AI call failed.", "error");
                }).finally(() => {
                    isLoading.value = false;
                });
            }
        })
    ),
    
    papyr.div('.card', { style: { background: '#090d16', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '120px' } },
        papyr.h4("🤖 Assistant Output:", { style: { color: '#6366f1', fontSize: '0.85rem', margin: '0 0 8px 0' } }),
        papyr.p(() => responseText.value, { style: { color: '#e2e8f0', fontSize: '0.9rem', margin: '0', whiteSpace: 'pre-wrap' } })
    )
);
return app;`,

        cheatsheet: `// 📑 Complete Interactive HTML, JS & CSS Cheat Sheet Showcase!
let activeSubTab = papyr.state('html');
let arrayState = papyr.state(['HTML', 'CSS', 'JavaScript']);
let stringVal = papyr.state('Book Haven Guides');
let mathNum = papyr.state(4.6);
let dateState = papyr.state(new Date().toString());
let errorMsg = papyr.state('');

// Premium MDN Core Curriculum Sandbox States & Helper Functions
let jsEvalCode = papyr.state("const fruits = ['Apple', 'Banana', 'Cherry'];\\nfruits.map(f => f.toUpperCase()).join(' - ');");
let jsEvalResult = papyr.state('');
let introspectInput = papyr.state("{ title: 'MDN JS Guide', level: 'Intermediate', rating: 4.8 }");
let introspectResult = papyr.state('[]');
let serializeInput = papyr.state("function processUser(id) {\\n  const active = true;\\n  return { id, active };\\n}");
let serializedOutput = papyr.state('');

let samenessVal1 = papyr.state('0');
let samenessVal2 = papyr.state('false');
let setInputValue = papyr.state('Classic');
let setElements = papyr.state(['Modern', 'Classic', 'Fantasy']);
let mapInputKey = papyr.state('discount');
let mapInputValue = papyr.state('15%');
let mapEntries = papyr.state([['theme', 'dark'], ['currency', 'USD']]);

let closureCounters = papyr.state([]);
let closureCountSeq = 0;

let asyncLogs = papyr.state([]);
let asyncProgress = papyr.state('idle');

let protoInputExpr = papyr.state('new Date()');
let protoChainList = papyr.state([]);
let gcSweepActive = papyr.state(false);
let gcNodes = papyr.state([
  { id: '1', name: 'Global Scope', type: 'root', reachable: true },
  { id: '2', name: 'Active Component State', type: 'child', reachable: true },
  { id: '3', name: 'Lexical Closure Cache', type: 'child', reachable: true },
  { id: '4', name: 'Detached DOM Reference', type: 'detached', reachable: false },
  { id: '5', name: 'Unused Event Callback', type: 'detached', reachable: false }
]);

// New Comprehensive MDN Core Curriculum additions
let primitiveValType = papyr.state('symbol');
let primitiveOutput = papyr.state("Click a primitive type below to run interactive proof cases!");
let regexPattern = papyr.state('\\\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}\\\\b');
let regexText = papyr.state('Contact us at support@mdn-guide.com or sales@example.org.');
let regexMatchResult = papyr.state('');
let classOutput = papyr.state('');
let operatorExpr = papyr.state('typeof [] === "object" && [] instanceof Array');
let operatorResult = papyr.state('');

const runPrimitiveExplorer = (type) => {
    primitiveValType.value = type;
    if (type === 'symbol') {
        primitiveOutput.value = "const sym1 = Symbol('id');\\nconst sym2 = Symbol('id');\\nconsole.log(sym1 === sym2); // false (guaranteed unique)\\n\\nResult: " + String(Symbol('id') === Symbol('id'));
        papyr.toast('Symbol uniqueness validated!', 'success');
    } else if (type === 'bigint') {
        let bigVal = 2n ** 53n + 1n;
        primitiveOutput.value = "const maxSafeInt = Number.MAX_SAFE_INTEGER; // 9007199254740991\\nconst big = 2n ** 53n + 1n; // 9007199254740993n\\n\\nResult: " + bigVal + "n (Handles arbitrary precision!)";
        papyr.toast('BigInt precision validated!', 'success');
    } else if (type === 'null_undef') {
        primitiveOutput.value = "console.log(typeof null); // 'object' (historic bug)\\nconsole.log(typeof undefined); // 'undefined'\\nconsole.log(null == undefined); // true (coerced)\\nconsole.log(null === undefined); // false (strict equality)";
        papyr.toast('Null & Undefined comparisons executed!', 'success');
    } else if (type === 'primitives_list') {
        primitiveOutput.value = "Primitive Types in JavaScript:\\n- Undefined (typeof undefined === 'undefined')\\n- Null (typeof null === 'object')\\n- Boolean (typeof true === 'boolean')\\n- Number (typeof 42 === 'number')\\n- BigInt (typeof 42n === 'bigint')\\n- String (typeof 'hello' === 'string')\\n- Symbol (typeof Symbol() === 'symbol')";
        papyr.toast('Primitives taxonomy printed!', 'info');
    }
};

const setEqualityPreset = (preset) => {
    if (preset === 'nan') {
        samenessVal1.value = 'NaN';
        samenessVal2.value = 'NaN';
        papyr.toast('Loaded NaN vs NaN case!', 'info');
    } else if (preset === 'coercion') {
        samenessVal1.value = '0';
        samenessVal2.value = 'false';
        papyr.toast('Loaded 0 vs false case!', 'info');
    } else if (preset === 'zero') {
        samenessVal1.value = '+0';
        samenessVal2.value = '-0';
        papyr.toast('Loaded +0 vs -0 case!', 'info');
    } else if (preset === 'array') {
        samenessVal1.value = '[]';
        samenessVal2.value = '![]';
        papyr.toast('Loaded [] vs ![] case!', 'info');
    }
};

const runClassDemo = () => {
    try {
        class Book {
            constructor(title, author) {
                this._title = title;
                this._author = author;
            }
            get info() { return this._title + ' by ' + this._author; }
            set author(newAuthor) { this._author = newAuthor; }
            static format(b) { return '[BOOK] ' + b.info; }
        }
        const myBook = new Book('Pride and Prejudice', 'Jane Austen');
        let initial = myBook.info;
        myBook.author = 'Austen';
        let updated = myBook.info;
        classOutput.value = [
            "1. Class Instantiated: new Book('Pride and Prejudice', 'Jane Austen')",
            "2. Getter (myBook.info): " + initial,
            "3. Setter Updated Author to 'Austen'",
            "4. Getter after Setter: " + updated,
            "5. Static Method (Book.format(myBook)): " + Book.format(myBook)
        ].join('\\n');
        papyr.toast('ES6 Class and accessors validated!', 'success');
    } catch(e) {
        classOutput.value = 'Error: ' + e.message;
        papyr.toast('Class Demo Error!', 'error');
    }
};

const testRegex = () => {
    try {
        let re = new RegExp(regexPattern.value, 'g');
        let matches = [];
        let match;
        while ((match = re.exec(regexText.value)) !== null) {
            matches.push(match[0]);
        }
        regexMatchResult.value = matches.length > 0 
            ? 'RegExp matches found: ' + JSON.stringify(matches) 
            : 'No matches found.';
        papyr.toast('Regex tested successfully!', 'success');
    } catch(e) {
        regexMatchResult.value = 'Regex Error: ' + e.message;
        papyr.toast('RegExp compilation error!', 'error');
    }
};

const runOperatorEvaluator = () => {
    try {
        let res = new Function('return (' + operatorExpr.value + ')')();
        operatorResult.value = 'Result of expression evaluation:\\n' + String(res);
        papyr.toast('Expression evaluated!', 'success');
    } catch(e) {
        operatorResult.value = 'Evaluation Error: ' + e.message;
        papyr.toast('Expression error!', 'error');
    }
};

const runAsyncAwaitDemo = async () => {
    if (asyncProgress.value !== 'idle' && asyncProgress.value !== 'complete') return;
    asyncLogs.value = [];
    const pushLog = (msg, queueType) => {
        let logs = [...asyncLogs.value];
        logs.push({ msg, queueType });
        asyncLogs.value = logs;
    };
    asyncProgress.value = 'stack1';
    pushLog('[Call Stack] Calling async function runAsyncAwaitDemo()...', 'stack');
    
    // Simulate Promise await microtask yields
    await new Promise(resolve => {
        setTimeout(() => {
            asyncProgress.value = 'webapi';
            pushLog('[Web API] Awaiting fetch request (simulated off-thread network delay)', 'webapi');
            resolve();
        }, 500);
    });
    
    await new Promise(resolve => {
        setTimeout(() => {
            asyncProgress.value = 'microtask';
            pushLog('[Microtask Queue] Processing resolved promise.then() microtask callback!', 'microtask');
            resolve();
        }, 500);
    });
    
    await new Promise(resolve => {
        setTimeout(() => {
            asyncProgress.value = 'complete';
            const mockUser = { id: 101, username: 'mdn_pioneer', status: 'active' };
            pushLog('[Call Stack] Async execution complete. Received user: ' + JSON.stringify(mockUser), 'stack');
            resolve();
        }, 500);
    });
    papyr.toast('Async/Await simulator run complete!', 'success');
};

const runIntrospection = () => {
    try {
        let obj = new Function('return (' + introspectInput.value + ')')();
        let props = Object.getOwnPropertyNames(obj);
        let list = props.map(p => {
            let val = obj[p];
            let t = typeof val;
            return p + ' (' + t + '): ' + (t === 'object' ? JSON.stringify(val) : String(val));
        });
        introspectResult.value = JSON.stringify(list, null, 2);
        papyr.toast('Introspected successfully!', 'success');
    } catch (e) {
        introspectResult.value = 'Error: ' + e.message;
        papyr.toast('Introspection error!', 'error');
    }
};

const runSerialization = () => {
    try {
        let fn = new Function('return (' + serializeInput.value + ')')();
        let details = [
            'Type: ' + typeof fn,
            'Name: ' + (fn.name || 'anonymous'),
            'Arity (parameters): ' + fn.length,
            'Source Code String (.toString()):',
            fn.toString()
        ];
        serializedOutput.value = details.join('\\n');
        papyr.toast('De-serialized successfully!', 'success');
    } catch (e) {
        serializedOutput.value = 'Error: ' + e.message;
        papyr.toast('De-serialization error!', 'error');
    }
};

const getEqualityResults = () => {
    try {
        let v1 = new Function('return (' + samenessVal1.value + ')')();
        let v2 = new Function('return (' + samenessVal2.value + ')')();
        return {
            loose: String(v1 == v2),
            strict: String(v1 === v2),
            sameValue: String(Object.is(v1, v2))
        };
    } catch(e) {
        return { loose: 'Error', strict: 'Error', sameValue: 'Error' };
    }
};

const addToSet = () => {
    let val = setInputValue.value.trim();
    if (!val) return;
    let list = [...setElements.value];
    if (list.includes(val)) {
        papyr.toast('Value already exists in Set!', 'warning');
    } else {
        list.push(val);
        setElements.value = list;
        setInputValue.value = '';
        papyr.toast('Added to Set!', 'success');
    }
};

const deleteFromSet = (item) => {
    setElements.value = setElements.value.filter(x => x !== item);
    papyr.toast('Removed from Set!', 'info');
};

const addToMap = () => {
    let k = mapInputKey.value.trim();
    let v = mapInputValue.value.trim();
    if (!k || !v) return;
    let list = [...mapEntries.value];
    let index = list.findIndex(entry => entry[0] === k);
    if (index > -1) {
        list[index] = [k, v];
        papyr.toast('Updated Map Key!', 'info');
    } else {
        list.push([k, v]);
        papyr.toast('Set Map Entry!', 'success');
    }
    mapEntries.value = list;
    mapInputKey.value = '';
    mapInputValue.value = '';
};

const deleteFromMap = (key) => {
    mapEntries.value = mapEntries.value.filter(entry => entry[0] !== key);
    papyr.toast('Removed from Map!', 'info');
};

const spawnClosureCounter = () => {
    closureCountSeq++;
    let myId = closureCountSeq;
    let privateVal = 0;
    let incrementFunc = () => {
        privateVal++;
        let list = [...closureCounters.value];
        let found = list.find(c => c.id === myId);
        if (found) {
            found.count = privateVal;
            closureCounters.value = list;
        }
    };
    let list = [...closureCounters.value];
    list.push({ id: myId, count: 0, inc: incrementFunc });
    closureCounters.value = list;
    papyr.toast('Lexical Closure counter #' + myId + ' spawned!', 'success');
};

const runAsyncSimulator = () => {
    if (asyncProgress.value !== 'idle' && asyncProgress.value !== 'complete') return;
    asyncLogs.value = [];
    const pushLog = (msg, queueType) => {
        let logs = [...asyncLogs.value];
        logs.push({ msg, queueType });
        asyncLogs.value = logs;
    };
    asyncProgress.value = 'stack1';
    pushLog('[Call Stack] Executing main thread script...', 'stack');
    setTimeout(() => {
        asyncProgress.value = 'webapi';
        pushLog('[Web API] setTimeout() callback registered in Web APIs', 'webapi');
        setTimeout(() => {
            asyncProgress.value = 'queue';
            pushLog('[Queue] Promise microtask (.then) registered in Microtask queue', 'queue');
            setTimeout(() => {
                asyncProgress.value = 'stack2';
                pushLog('[Call Stack] Main thread execution completed. Stack empty.', 'stack');
                setTimeout(() => {
                    asyncProgress.value = 'microtask';
                    pushLog('[Microtask Queue] Processing Promise.then() callback! (First Priority)', 'microtask');
                    setTimeout(() => {
                        asyncProgress.value = 'macrotask';
                        pushLog('[Macrotask Queue] Processing setTimeout() callback! (Second Priority)', 'macrotask');
                        setTimeout(() => {
                            asyncProgress.value = 'complete';
                            pushLog('[Event Loop] Cycle complete. Stack idle.', 'stack');
                        }, 400);
                    }, 400);
                }, 400);
            }, 400);
        }, 400);
    }, 400);
};

const tracePrototypes = () => {
    try {
        let obj = new Function('return (' + protoInputExpr.value + ')')();
        let chain = [];
        let temp = obj;
        if (temp === undefined || temp === null) {
            chain.push(String(temp));
        } else {
            while (temp !== null) {
                let name = temp.constructor ? temp.constructor.name : 'Object (no constructor)';
                chain.push(name);
                temp = Object.getPrototypeOf(temp);
            }
            chain.push('null');
        }
        protoChainList.value = chain;
        papyr.toast('Prototype chain traced!', 'success');
    } catch (e) {
        protoChainList.value = ['Error: ' + e.message];
        papyr.toast('Tracer expression error!', 'error');
    }
};

const toggleGcNode = (id) => {
    let nodes = [...gcNodes.value];
    let found = nodes.find(n => n.id === id);
    if (found && found.type !== 'root') {
        found.reachable = !found.reachable;
        gcNodes.value = nodes;
        papyr.toast('Toggled reference to ' + found.name, 'info');
    }
};

const runSweepGc = () => {
    if (gcSweepActive.value) return;
    gcSweepActive.value = true;
    papyr.toast('Mark Phase: Marking all reachable nodes from Global Root...', 'info');
    setTimeout(() => {
        papyr.toast('Sweep Phase: Reclaiming memory of unreachable nodes!', 'warning');
        setTimeout(() => {
            let nodes = [...gcNodes.value];
            gcNodes.value = nodes.map(n => {
                if (!n.reachable) {
                    return { ...n, swept: true };
                }
                return n;
            });
            gcSweepActive.value = false;
            papyr.toast('Garbage collection run complete!', 'success');
        }, 1000);
    }, 1000);
};

const resetGcNodes = () => {
    gcSweepActive.value = false;
    gcNodes.value = [
      { id: '1', name: 'Global Scope', type: 'root', reachable: true },
      { id: '2', name: 'Active Component State', type: 'child', reachable: true },
      { id: '3', name: 'Lexical Closure Cache', type: 'child', reachable: true },
      { id: '4', name: 'Detached DOM Reference', type: 'detached', reachable: false },
      { id: '5', name: 'Unused Event Callback', type: 'detached', reachable: false }
    ];
    papyr.toast('Garbage collector simulation reset!', 'info');
};


let app = papyr.flex.col({ style: { width: '100%', gap: '16px' } },
    papyr.h3("📑 Creative Computing Cheat Sheet Showcase", { style: { color: 'white', margin: '0' } }),
    papyr.p("An interactive, high-fidelity playground displaying full native support for all HTML5 elements, JavaScript features, and CSS visual rules.", { style: { fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 10px 0' } }),
    
    // Sub-navigation bar
    papyr.flex.row({ style: { gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', flexWrap: 'wrap' } },
        papyr.button("HTML Elements", {
            style: () => ({
                padding: '8px 16px', fontSize: '0.8rem', borderRadius: '6px', cursor: 'pointer', border: 'none',
                background: activeSubTab.value === 'html' ? '#14b8a6' : 'rgba(255,255,255,0.05)',
                color: 'white', fontWeight: 'bold', transition: 'background 0.2s'
            }),
            onclick: () => activeSubTab.value = 'html'
        }),
        papyr.button("JavaScript Actions", {
            style: () => ({
                padding: '8px 16px', fontSize: '0.8rem', borderRadius: '6px', cursor: 'pointer', border: 'none',
                background: activeSubTab.value === 'js' ? '#6366f1' : 'rgba(255,255,255,0.05)',
                color: 'white', fontWeight: 'bold', transition: 'background 0.2s'
            }),
            onclick: () => activeSubTab.value = 'js'
        }),
        papyr.button("CSS Visual Rules", {
            style: () => ({
                padding: '8px 16px', fontSize: '0.8rem', borderRadius: '6px', cursor: 'pointer', border: 'none',
                background: activeSubTab.value === 'css' ? '#a855f7' : 'rgba(255,255,255,0.05)',
                color: 'white', fontWeight: 'bold', transition: 'background 0.2s'
            }),
            onclick: () => activeSubTab.value = 'css'
        }),
        papyr.button("Performance & Philosophy", {
            style: () => ({
                padding: '8px 16px', fontSize: '0.8rem', borderRadius: '6px', cursor: 'pointer', border: 'none',
                background: activeSubTab.value === 'power' ? '#f43f5e' : 'rgba(255,255,255,0.05)',
                color: 'white', fontWeight: 'bold', transition: 'background 0.2s'
            }),
            onclick: () => activeSubTab.value = 'power'
        })
    ),
    
    // View container
    papyr.if(activeSubTab, (tab) => {
        if (tab === 'html') {
            return papyr.flex.col({ style: { gap: '16px' } },
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' } },
                    papyr.h4("Text & Formatting Elements", { style: { color: '#14b8a6', margin: '0 0 12px 0' } }),
                    papyr.pre("New Arrivals\\\\nSpecial Offers\\\\nBestsellers", { style: { background: '#090d16', padding: '10px', borderRadius: '6px', color: '#cbd5e1', fontSize: '0.8rem', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace' } }),
                    papyr.h1("Welcome to Book Haven", { style: { fontSize: '1.5rem', color: '#fff', margin: '12px 0 6px 0' } }),
                    papyr.p("Welcome to our online bookshop where you can find a wide selection of books.", { style: { margin: '0 0 10px 0', fontSize: '0.9rem', color: '#cbd5e1' } }),
                    papyr.flex.row({ style: { flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '10px' } },
                        papyr.strong("Exclusive Sale"),
                        papyr.em("Must-read Classics"),
                        papyr.tt("ISBN: 978-3-16-148410-0", { style: { fontFamily: 'monospace', color: '#fda4af' } }),
                        papyr.code("alert(\\"Welcome to our bookstore!\\");", { style: { background: '#090d16', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', color: '#a7f3d0' } }),
                        papyr.cite("by Jane Austen", { style: { fontStyle: 'italic', color: '#94a3b8' } })
                    ),
                    papyr.blockquote('"Reading is to the mind what exercise is to the body." - Joseph Addison', { style: { borderLeft: '4px solid #14b8a6', paddingLeft: '12px', color: '#94a3b8', fontStyle: 'italic', margin: '10px 0' } }),
                    papyr.address("123 Book St., Bibliopolis, BK 12345", { style: { fontSize: '0.8rem', color: '#64748b', fontStyle: 'normal' } })
                ),
                
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' } },
                    papyr.h4("Links, Lists & Graphics", { style: { color: '#14b8a6', margin: '0 0 12px 0' } }),
                    papyr.flex.row({ style: { gap: '16px', flexWrap: 'wrap', marginBottom: '14px' } },
                        papyr.a("Visit Our Store", { href: 'https://bookhaven.com', target: '_blank', style: { color: '#38bdf8', fontWeight: 'bold' } }),
                        papyr.a("Contact Us", { href: 'mailto:info@bookhaven.com', style: { color: '#38bdf8' } }),
                        papyr.a("Learn More (Anchor Link)", { href: '#section1', style: { color: '#a5b4fc' } })
                    ),
                    papyr.hr({ size: '3', width: '100%', style: { border: 'none', background: 'rgba(255,255,255,0.1)', height: '3px' } }),
                    
                    papyr.flex.row({ style: { gap: '20px', flexWrap: 'wrap', marginTop: '12px' } },
                        papyr.flex.col({ style: { flex: '1', minWidth: '150px' } },
                            papyr.span("Unordered List:", { style: { fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' } }),
                            papyr.ul(
                                papyr.li("Fiction"),
                                papyr.li("Non-Fiction"),
                                papyr.li("Children's Books")
                            )
                        ),
                        papyr.flex.col({ style: { flex: '1', minWidth: '150px' } },
                            papyr.span("Ordered List (starts at 2):", { style: { fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' } }),
                            papyr.ol({ start: 2 },
                                papyr.li("Second Item"),
                                papyr.li("Third Item")
                            )
                        ),
                        papyr.flex.col({ style: { flex: '1', minWidth: '150px' } },
                            papyr.span("Description List:", { style: { fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' } }),
                            papyr.dl(
                                papyr.dt("Author", { style: { fontWeight: 'bold', color: '#fff' } }),
                                papyr.dd("J.K. Rowling", { style: { color: '#cbd5e1', marginLeft: '12px' } })
                            )
                        )
                    )
                ),
                
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' } },
                    papyr.h4("Forms, Tables & Video Media", { style: { color: '#14b8a6', margin: '0 0 12px 0' } }),
                    papyr.form({ onsubmit: (e) => { e.preventDefault(); papyr.toast("Form Submitted!", "success"); } },
                        papyr.flex.col({ style: { gap: '10px' } },
                            papyr.flex.row({ style: { gap: '10px', flexWrap: 'wrap' } },
                                papyr.flex.col({ style: { flex: 1, minWidth: '140px' } },
                                    papyr.span("Single-line Text Input", { style: { fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' } }),
                                    papyr.input("text", "Jane Doe", { size: '20', style: { width: '100%' } })
                                ),
                                papyr.flex.col({ style: { flex: 1, minWidth: '140px' } },
                                    papyr.span("Dropdown List", { style: { fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' } }),
                                    papyr.select(
                                        papyr.option("Fiction"),
                                        papyr.option("History"),
                                        papyr.option("Science"),
                                        { name: 'genre' }
                                    )
                                ),
                                papyr.flex.col({ style: { flex: 1, minWidth: '140px' } },
                                    papyr.span("Dropdown (Multiple, size=3)", { style: { fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' } }),
                                    papyr.select(
                                        papyr.option("Drama"),
                                        papyr.option("Comedy"),
                                        papyr.option("Thriller"),
                                        { multiple: true, name: 'genres', size: 3 }
                                    )
                                )
                            ),
                            papyr.span("Multiline Textarea", { style: { fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' } }),
                            papyr.textarea({ name: 'review', cols: '30', rows: '3', style: { width: '100%', minHeight: '60px' }, placeholder: 'Write your book review here...' }),
                            papyr.flex.row({ style: { gap: '15px', alignItems: 'center', margin: '5px 0' } },
                                papyr.label(
                                    papyr.input("checkbox", "subscribe", { name: 'newsletter', checked: true, style: { marginRight: '6px' } }),
                                    papyr.span("Pre-checked Checkbox", { style: { fontSize: '0.8rem', color: '#cbd5e1' } })
                                ),
                                papyr.label(
                                    papyr.input("checkbox", "sms", { name: 'sms', style: { marginRight: '6px' } }),
                                    papyr.span("Standard Checkbox", { style: { fontSize: '0.8rem', color: '#cbd5e1' } })
                                )
                            ),
                            papyr.flex.row({ style: { gap: '8px' } },
                                papyr.input("submit", "Submit Review", { class: 'btn-primary', style: { fontSize: '0.8rem', padding: '6px 12px' } }),
                                papyr.input("reset", "", { style: { background: 'rgba(255,255,255,0.06)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' } })
                            )
                        )
                    ),
                    
                    papyr.span("Tables Showcase:", { style: { fontSize: '0.85rem', color: '#94a3b8', display: 'block', margin: '18px 0 6px 0', fontWeight: 'bold' } }),
                    papyr.table({ style: { width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', overflow: 'hidden' } },
                        papyr.tr({ style: { borderBottom: '1px solid rgba(255,255,255,0.08)' } },
                            papyr.th("Book Title", { style: { padding: '8px', textAlign: 'left', color: '#14b8a6' } }),
                            papyr.th("Author", { style: { padding: '8px', textAlign: 'left', color: '#14b8a6' } }),
                            papyr.th("Price", { style: { padding: '8px', textAlign: 'left', color: '#14b8a6' } })
                        ),
                        papyr.tr({ style: { borderBottom: '1px solid rgba(255,255,255,0.04)' } },
                            papyr.td("JavaScript Basics", { style: { padding: '8px', color: '#fff' } }),
                            papyr.td("Jane Doe", { style: { padding: '8px', color: '#cbd5e1' } }),
                            papyr.td("$19.99", { style: { padding: '8px', color: '#10b981' } })
                        ),
                        papyr.tr(
                            papyr.td("HTML5 Mastery", { style: { padding: '8px', color: '#fff' } }),
                            papyr.td("John Smith", { style: { padding: '8px', color: '#cbd5e1' } }),
                            papyr.td("$24.99", { style: { padding: '8px', color: '#10b981' } })
                        )
                    ),
                    
                    papyr.span("Video Elements & Graphics:", { style: { fontSize: '0.85rem', color: '#94a3b8', display: 'block', margin: '18px 0 8px 0', fontWeight: 'bold' } }),
                    papyr.flex.row({ style: { gap: '16px', flexWrap: 'wrap' } },
                        papyr.div({ style: { flex: '1', minWidth: '200px' } },
                            papyr.video({ controls: true, style: { width: '100%', maxHeight: '120px', background: '#000', borderRadius: '6px' } },
                                papyr.source({ src: 'promo.mp4', type: 'video/mp4' }),
                                papyr.track({ kind: 'subtitles', src: 'subtitles.vtt', srclang: 'en' })
                            )
                        ),
                        papyr.div({ style: { flex: '1', minWidth: '200px', display: 'flex', alignItems: 'center' } },
                            papyr.img({ src: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200', alt: 'Book Cover', width: '80', height: '110', border: '1', align: 'left', style: { borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', marginRight: '10px' } }),
                            papyr.p("Image attribute mapping renders height, width, border, and alternate text dynamically.", { style: { fontSize: '0.8rem', color: '#cbd5e1' } })
                        )
                    )
                )
            );
        } else if (tab === 'js') {
            return papyr.flex.col({ style: { gap: '16px' } },
                // Section 1: Beginner's Fundamentals & Dynamic Capabilities
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' } },
                    papyr.h4("⚙️ 1. Beginner's Dynamics & Introspection", { style: { color: '#6366f1', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 'bold' } }),
                    papyr.p("Explore JavaScript's dynamic nature: runtime code evaluation, object property descriptors crawler, function source serialization, and unique primitive types.", { style: { fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 16px 0' } }),
                    
                    papyr.grid({ style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' } },
                        // Live Eval
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '8px' } },
                            papyr.span("Live eval() Code Sandbox", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.textarea({
                                value: jsEvalCode.value,
                                style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '0.78rem', padding: '8px', borderRadius: '6px', minHeight: '80px', resize: 'vertical' },
                                oninput: (e) => jsEvalCode.value = e.target.value
                            }),
                            papyr.button("Execute Dynamic Script", {
                                style: { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: 'fit-content' },
                                onclick: () => {
                                    try {
                                        let res = new Function('return (' + jsEvalCode.value + ')')();
                                        jsEvalResult.value = typeof res === 'object' ? JSON.stringify(res) : String(res);
                                        papyr.toast('Script evaluated!', 'success');
                                    } catch(err) {
                                        jsEvalResult.value = 'Error: ' + err.message;
                                        papyr.toast('Eval error!', 'error');
                                    }
                                }
                            }),
                            papyr.div({ style: { background: '#090d16', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', minHeight: '34px' } },
                                papyr.span("Result: ", { style: { color: '#64748b' } }),
                                papyr.span(() => jsEvalResult.value || 'None', { style: { color: '#e2e8f0', fontFamily: 'monospace' } })
                            )
                        ),
                        
                        // Object Introspector
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '8px' } },
                            papyr.span("Object Property Introspector", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.input("text", introspectInput.value, {
                                style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fda4af', fontFamily: 'monospace', fontSize: '0.78rem', padding: '8px', borderRadius: '6px' },
                                oninput: (e) => introspectInput.value = e.target.value
                            }),
                            papyr.button("Analyze Object Keys", {
                                style: { background: '#14b8a6', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: 'fit-content' },
                                onclick: runIntrospection
                            }),
                            papyr.pre(() => introspectResult.value, {
                                style: { background: '#090d16', padding: '8px', borderRadius: '6px', fontSize: '0.7rem', color: '#e2e8f0', fontFamily: 'monospace', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', margin: '0', maxHeight: '100px' }
                            })
                        ),
                        
                        // Function Source Recovery
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '8px' } },
                            papyr.span("Function Serialization (.toString())", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.textarea({
                                value: serializeInput.value,
                                style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#a5b4fc', fontFamily: 'monospace', fontSize: '0.78rem', padding: '8px', borderRadius: '6px', minHeight: '60px', resize: 'vertical' },
                                oninput: (e) => serializeInput.value = e.target.value
                            }),
                            papyr.button("De-serialize Function", {
                                style: { background: '#a855f7', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', width: 'fit-content' },
                                onclick: runSerialization
                            }),
                            papyr.pre(() => serializedOutput.value || "Click 'De-serialize Function' to view source metadata analysis.", {
                                style: { background: '#090d16', padding: '8px', borderRadius: '6px', fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', margin: '0', maxHeight: '100px', whiteSpace: 'pre-wrap' }
                            })
                        ),

                        // Primitives Explorer
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '8px' } },
                            papyr.span("Primitives & Symbol & BigInt Explorer", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.flex.row({ style: { gap: '6px', flexWrap: 'wrap' } },
                                papyr.button("Symbol", {
                                    style: () => ({ background: primitiveValType.value === 'symbol' ? '#6366f1' : 'rgba(255,255,255,0.06)', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }),
                                    onclick: () => runPrimitiveExplorer('symbol')
                                }),
                                papyr.button("BigInt", {
                                    style: () => ({ background: primitiveValType.value === 'bigint' ? '#6366f1' : 'rgba(255,255,255,0.06)', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }),
                                    onclick: () => runPrimitiveExplorer('bigint')
                                }),
                                papyr.button("Null/Undef", {
                                    style: () => ({ background: primitiveValType.value === 'null_undef' ? '#6366f1' : 'rgba(255,255,255,0.06)', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }),
                                    onclick: () => runPrimitiveExplorer('null_undef')
                                }),
                                papyr.button("Taxonomy", {
                                    style: () => ({ background: primitiveValType.value === 'primitives_list' ? '#6366f1' : 'rgba(255,255,255,0.06)', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }),
                                    onclick: () => runPrimitiveExplorer('primitives_list')
                                })
                            ),
                            papyr.pre(() => primitiveOutput.value, {
                                style: { background: '#090d16', padding: '8px', borderRadius: '6px', fontSize: '0.7rem', color: '#34d399', fontFamily: 'monospace', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', margin: '0', maxHeight: '100px', whiteSpace: 'pre-wrap' }
                            })
                        )
                    )
                ),
                
                // Section 2: Structural Data, sameness, sets/maps
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' } },
                    papyr.h4("📊 2. Equality Comparisons & Standard Data Structures", { style: { color: '#6366f1', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 'bold' } }),
                    papyr.p("Validate equality behaviors (loose ==, strict ===, and Same-Value Object.is()) side-by-side, and explore core structural collections.", { style: { fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 16px 0' } }),
                    
                    papyr.grid({ style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' } },
                        // Equality Matrix
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '10px' } },
                            papyr.span("Equality Sameness Checker", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.flex.row({ style: { gap: '8px', alignItems: 'center' } },
                                papyr.input("text", samenessVal1.value, {
                                    style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.78rem', padding: '6px', borderRadius: '4px', width: '90px', textAlign: 'center', fontFamily: 'monospace' },
                                    oninput: (e) => samenessVal1.value = e.target.value
                                }),
                                papyr.span("vs", { style: { color: '#64748b', fontSize: '0.8rem' } }),
                                papyr.input("text", samenessVal2.value, {
                                    style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.78rem', padding: '6px', borderRadius: '4px', width: '90px', textAlign: 'center', fontFamily: 'monospace' },
                                    oninput: (e) => samenessVal2.value = e.target.value
                                })
                            ),
                            papyr.flex.col({ style: { gap: '6px', fontSize: '0.78rem' } },
                                papyr.flex.row({ justify: 'space-between', style: { background: 'rgba(0,0,0,0.15)', padding: '6px 10px', borderRadius: '4px' } },
                                    papyr.span("Loose Equality ( == ):"),
                                    papyr.span(() => getEqualityResults().loose, {
                                        style: () => ({ color: getEqualityResults().loose === 'true' ? '#10b981' : '#f43f5e', fontWeight: 'bold' })
                                    })
                                ),
                                papyr.flex.row({ justify: 'space-between', style: { background: 'rgba(0,0,0,0.15)', padding: '6px 10px', borderRadius: '4px' } },
                                    papyr.span("Strict Equality ( === ):"),
                                    papyr.span(() => getEqualityResults().strict, {
                                        style: () => ({ color: getEqualityResults().strict === 'true' ? '#10b981' : '#f43f5e', fontWeight: 'bold' })
                                    })
                                ),
                                papyr.flex.row({ justify: 'space-between', style: { background: 'rgba(0,0,0,0.15)', padding: '6px 10px', borderRadius: '4px' } },
                                    papyr.span("Same-Value ( Object.is ):"),
                                    papyr.span(() => getEqualityResults().sameValue, {
                                        style: () => ({ color: getEqualityResults().sameValue === 'true' ? '#10b981' : '#f43f5e', fontWeight: 'bold' })
                                    })
                                )
                            ),
                            papyr.flex.row({ style: { gap: '4px', flexWrap: 'wrap' } },
                                papyr.button("NaN Case", {
                                    style: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.65rem' },
                                    onclick: () => setEqualityPreset('nan')
                                }),
                                papyr.button("0 vs false", {
                                    style: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.65rem' },
                                    onclick: () => setEqualityPreset('coercion')
                                }),
                                papyr.button("+0 vs -0", {
                                    style: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.65rem' },
                                    onclick: () => setEqualityPreset('zero')
                                }),
                                papyr.button("[] vs ![]", {
                                    style: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '3px 6px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.65rem' },
                                    onclick: () => setEqualityPreset('array')
                                })
                            )
                        ),
                        
                        // Set Explorer
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '8px' } },
                            papyr.span("Set Explorer (Unique Values)", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.flex.row({ style: { gap: '6px' } },
                                papyr.input("text", setInputValue.value, {
                                    placeholder: "New item...",
                                    style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.78rem', padding: '6px', borderRadius: '4px', flex: 1 },
                                    oninput: (e) => setInputValue.value = e.target.value
                                }),
                                papyr.button("Add", {
                                    style: { background: '#10b981', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' },
                                    onclick: addToSet
                                })
                            ),
                            papyr.span("Set Elements (Click to delete):", { style: { fontSize: '0.72rem', color: '#64748b', marginTop: '4px' } }),
                            papyr.flex.row({ style: { gap: '6px', flexWrap: 'wrap', minHeight: '34px', background: '#090d16', padding: '6px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' } },
                                () => setElements.value.map(item => 
                                    papyr.span(item, {
                                        style: { background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' },
                                        onclick: () => deleteFromSet(item)
                                    })
                                )
                            )
                        ),
                        
                        // Map Explorer
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '8px' } },
                            papyr.span("Map Explorer (Key-Value Pairs)", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.flex.row({ style: { gap: '6px' } },
                                papyr.input("text", mapInputKey.value, {
                                    placeholder: "Key",
                                    style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.78rem', padding: '6px', borderRadius: '4px', flex: 1 },
                                    oninput: (e) => mapInputKey.value = e.target.value
                                }),
                                papyr.input("text", mapInputValue.value, {
                                    placeholder: "Value",
                                    style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.78rem', padding: '6px', borderRadius: '4px', flex: 1 },
                                    oninput: (e) => mapInputValue.value = e.target.value
                                }),
                                papyr.button("Set", {
                                    style: { background: '#38bdf8', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' },
                                    onclick: addToMap
                                })
                            ),
                            papyr.span("Map Entries (Click to delete):", { style: { fontSize: '0.72rem', color: '#64748b', marginTop: '4px' } }),
                            papyr.flex.col({ style: { gap: '4px', minHeight: '34px', background: '#090d16', padding: '6px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.72rem' } },
                                () => mapEntries.value.map(entry => 
                                    papyr.flex.row({ justify: 'space-between', style: { background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.2)', cursor: 'pointer' }, onclick: () => deleteFromMap(entry[0]) },
                                        papyr.span(entry[0], { style: { color: '#38bdf8', fontWeight: 'bold', fontFamily: 'monospace' } }),
                                        papyr.span(entry[1], { style: { color: '#e2e8f0', fontFamily: 'monospace' } })
                                    )
                                )
                            )
                        )
                    ),
                    papyr.div({ style: { background: 'rgba(234,179,8,0.06)', border: '1px dashed rgba(234,179,8,0.2)', borderRadius: '8px', padding: '12px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' } },
                        papyr.span("💡 Memory Tip: WeakMap & WeakSet", { style: { fontSize: '0.8rem', color: '#eab308', fontWeight: 'bold' } }),
                        papyr.p("Unlike Map and Set, WeakMap and WeakSet hold *weak* references to object keys/values. If there are no other references to an object in the WeakMap key or WeakSet, the JS engine's Garbage Collector (GC) can automatically reclaim the memory, preventing memory leaks in complex runtime graphs.", { style: { fontSize: '0.75rem', color: '#cbd5e1', margin: '0' } })
                    )
                ),
                
                // Section 3: Lexical Closures & Scopes Spawner
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' } },
                    papyr.h4("🔐 3. Scopes & Lexical Closures Spawner", { style: { color: '#6366f1', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 'bold' } }),
                    papyr.p("Closures lock in references to their surrounding scope. Click below to dynamically spawn isolated lexical closure instances and increment their private variables.", { style: { fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 16px 0' } }),
                    
                    papyr.button("Spawn Isolated Closure Counter", {
                        style: { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '14px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', transition: 'transform 0.1s' },
                        onclick: spawnClosureCounter
                    }),
                    
                    papyr.flex.row({ style: { gap: '12px', flexWrap: 'wrap', minHeight: '60px' } },
                        () => closureCounters.value.length === 0 ? 
                            papyr.span("No active closure instances spawned yet. Click above to create one!", { style: { fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' } }) :
                            closureCounters.value.map(item => 
                                papyr.div({ style: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '8px' } },
                                    papyr.span("Closure Counter #" + item.id, { style: { fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 'bold' } }),
                                    papyr.flex.row({ style: { alignItems: 'baseline', gap: '6px' } },
                                        papyr.span("Private Value: ", { style: { fontSize: '0.72rem', color: '#94a3b8' } }),
                                        papyr.span(item.count, { style: { fontSize: '1.1rem', color: '#10b981', fontWeight: '800', fontFamily: 'monospace' } })
                                    ),
                                    papyr.button("Increment", {
                                        style: { background: 'rgba(255,255,255,0.06)', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' },
                                        onclick: item.inc
                                    })
                                )
                            )
                    )
                ),
                
                // Section 4: Asynchronous JS & Event Loop simulator
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' } },
                    papyr.h4("⏳ 4. Asynchronous JS & Event Loop Simulator", { style: { color: '#6366f1', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 'bold' } }),
                    papyr.p("Watch the event loop orchestrate tasks chronologically, and run the live async/await simulated fetch adapter.", { style: { fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 16px 0' } }),
                    
                    papyr.grid({ style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' } },
                        // Column 1: Traditional Event Loop
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '12px' } },
                            papyr.span("Event Loop Queue Orchestrator", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.flex.row({ style: { gap: '12px', alignItems: 'center' } },
                                papyr.button("Run Loop Cycle", {
                                    style: () => ({
                                        background: asyncProgress.value === 'idle' || asyncProgress.value === 'complete' ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' : 'rgba(255,255,255,0.05)',
                                        color: asyncProgress.value === 'idle' || asyncProgress.value === 'complete' ? 'white' : '#64748b',
                                        border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold'
                                    }),
                                    onclick: runAsyncSimulator
                                }),
                                papyr.span(() => "Status: " + asyncProgress.value.toUpperCase(), {
                                    style: () => ({
                                        fontSize: '0.75rem',
                                        color: asyncProgress.value === 'idle' ? '#64748b' : (asyncProgress.value === 'complete' ? '#10b981' : '#f43f5e'),
                                        fontWeight: 'bold', fontFamily: 'monospace'
                                    })
                                })
                            ),
                            papyr.flex.col({ style: { gap: '6px' } },
                                papyr.div({
                                    style: () => ({
                                        background: 'rgba(0,0,0,0.25)', padding: '8px', borderRadius: '6px', border: '1px solid',
                                        borderColor: asyncProgress.value === 'stack1' || asyncProgress.value === 'stack2' ? '#6366f1' : 'rgba(255,255,255,0.03)',
                                        transition: 'all 0.2s'
                                    })
                                },
                                    papyr.span("1. Call Stack (Synchronous)", { style: { fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 'bold', display: 'block' } })
                                ),
                                papyr.div({
                                    style: () => ({
                                        background: 'rgba(0,0,0,0.25)', padding: '8px', borderRadius: '6px', border: '1px solid',
                                        borderColor: asyncProgress.value === 'webapi' ? '#eab308' : 'rgba(255,255,255,0.03)',
                                        transition: 'all 0.2s'
                                    })
                                },
                                    papyr.span("2. Web APIs (Timer Threads)", { style: { fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 'bold', display: 'block' } })
                                ),
                                papyr.div({
                                    style: () => ({
                                        background: 'rgba(0,0,0,0.25)', padding: '8px', borderRadius: '6px', border: '1px solid',
                                        borderColor: asyncProgress.value === 'microtask' || asyncProgress.value === 'queue' ? '#10b981' : 'rgba(255,255,255,0.03)',
                                        transition: 'all 0.2s'
                                    })
                                },
                                    papyr.span("3. Microtasks (Promise.then)", { style: { fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 'bold', display: 'block' } })
                                ),
                                papyr.div({
                                    style: () => ({
                                        background: 'rgba(0,0,0,0.25)', padding: '8px', borderRadius: '6px', border: '1px solid',
                                        borderColor: asyncProgress.value === 'macrotask' ? '#f43f5e' : 'rgba(255,255,255,0.03)',
                                        transition: 'all 0.2s'
                                    })
                                },
                                    papyr.span("4. Macrotasks (setTimeout)", { style: { fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 'bold', display: 'block' } })
                                )
                            )
                        ),
                        
                        // Column 2: New Live Async/Await fetch simulator
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '12px' } },
                            papyr.span("Live Async / Await Fetch Simulator", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.flex.row({ style: { gap: '12px', alignItems: 'center' } },
                                papyr.button("Execute Async/Await", {
                                    style: () => ({
                                        background: asyncProgress.value === 'idle' || asyncProgress.value === 'complete' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.05)',
                                        color: asyncProgress.value === 'idle' || asyncProgress.value === 'complete' ? 'white' : '#64748b',
                                        border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold'
                                    }),
                                    onclick: runAsyncAwaitDemo
                                }),
                                papyr.span("Status: Promise-awaited", { style: { fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' } })
                            ),
                            papyr.div({ style: { background: '#090d16', padding: '8px', borderRadius: '6px', fontSize: '0.7rem', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '4px' } },
                                papyr.span("Awaited Execution Blueprint:", { style: { fontWeight: 'bold', color: '#eab308' } }),
                                papyr.span("async function fetchUser() {", { style: { fontFamily: 'monospace' } }),
                                papyr.span("  const response = await fetch('/api/user');", { style: { fontFamily: 'monospace', color: '#cbd5e1' } }),
                                papyr.span("  const data = await response.json();", { style: { fontFamily: 'monospace', color: '#cbd5e1' } }),
                                papyr.span("  return data;", { style: { fontFamily: 'monospace' } }),
                                papyr.span("}", { style: { fontFamily: 'monospace' } })
                            )
                        )
                    ),
                    
                    papyr.flex.col({ style: { background: '#090d16', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', gap: '6px', fontSize: '0.75rem', minHeight: '100px', marginTop: '14px' } },
                        papyr.span("Chronological Simulator Thread Log:", { style: { color: '#64748b', fontWeight: 'bold' } }),
                        () => asyncLogs.value.length === 0 ? 
                            papyr.span("Ready to execute asynchronous cycle. Click one of the runs above.", { style: { color: '#64748b', fontStyle: 'italic' } }) :
                            asyncLogs.value.map(log => 
                                papyr.flex.row({ style: { gap: '8px', color: log.queueType === 'stack' ? '#818cf8' : (log.queueType === 'webapi' ? '#fbbf24' : (log.queueType === 'microtask' ? '#34d399' : '#f87171')), fontFamily: 'monospace' } },
                                    papyr.span("•", { style: { fontWeight: 'bold' } }),
                                    papyr.span(log.msg)
                                )
                            )
                    )
                ),
                
                // Section 5: Advanced Architecture: Prototypes, Classes & GC
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' } },
                    papyr.h4("🧬 5. Advanced Architecture: Prototypes, ES6 Classes & Garbage Collector", { style: { color: '#6366f1', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 'bold' } }),
                    papyr.p("Deep-dive into prototype chains, ES6 OOP classes with getters/setters/statics, and mark-and-sweep GC sweep reachability cycles.", { style: { fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 16px 0' } }),
                    
                    papyr.grid({ style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' } },
                        // Prototype chain crawler
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '8px' } },
                            papyr.span("Prototype chain crawler (__proto__)", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.flex.row({ style: { gap: '6px' } },
                                papyr.input("text", protoInputExpr.value, {
                                    placeholder: "e.g., new Date(), []",
                                    style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.78rem', padding: '6px', borderRadius: '4px', flex: 1, fontFamily: 'monospace' },
                                    oninput: (e) => protoInputExpr.value = e.target.value
                                }),
                                papyr.button("Crawl Chain", {
                                    style: { background: '#6366f1', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' },
                                    onclick: tracePrototypes
                                })
                            ),
                            papyr.flex.row({ style: { gap: '6px', flexWrap: 'wrap', alignItems: 'center', background: '#090d16', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '38px', fontSize: '0.75rem', fontFamily: 'monospace' } },
                                () => protoChainList.value.length === 0 ?
                                    papyr.span("Enter object expression above and crawl.", { style: { color: '#64748b', fontStyle: 'italic' } }) :
                                    protoChainList.value.map((proto, idx) => 
                                        papyr.flex.row({ style: { alignItems: 'center', gap: '6px' } },
                                            papyr.span(proto, { style: { color: proto === 'null' ? '#f43f5e' : '#fda4af', fontWeight: 'bold' } }),
                                            idx < protoChainList.value.length - 1 ? papyr.span("→", { style: { color: '#64748b' } }) : ''
                                        )
                                    )
                                )
                            )
                        ),
                        
                        // ES6 Class Builder
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '8px' } },
                            papyr.span("ES6 OOP Classes & Accessors Builder", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.button("Build & Instantiate Book Class", {
                                style: { background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', width: 'fit-content' },
                                onclick: runClassDemo
                            }),
                            papyr.pre(() => classOutput.value || "Click 'Build & Instantiate' to construct standard ES6 class with getters, setters and static methods dynamically.", {
                                style: { background: '#090d16', padding: '8px', borderRadius: '6px', fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', margin: '0', maxHeight: '120px', whiteSpace: 'pre-wrap' }
                            })
                        ),
                        
                        // Mark & Sweep GC simulator
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '8px' } },
                            papyr.span("Interactive Mark-and-Sweep Memory Simulator", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.flex.row({ style: { gap: '6px', marginBottom: '4px' } },
                                papyr.button("Run Sweep Phase 🧹", {
                                    style: { background: '#f43f5e', border: 'none', color: 'white', padding: '6px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' },
                                    onclick: runSweepGc
                                }),
                                papyr.button("Reset Heap Nodes", {
                                    style: { background: 'rgba(255,255,255,0.06)', border: 'none', color: 'white', padding: '6px 10px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' },
                                    onclick: resetGcNodes
                                })
                            ),
                            papyr.flex.col({ style: { gap: '6px', background: '#090d16', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '120px' } },
                                () => gcNodes.value.map(node => 
                                    papyr.flex.row({
                                        justify: 'space-between',
                                        style: () => ({
                                            background: node.swept ? 'rgba(0,0,0,0.4)' : (node.reachable ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)'),
                                            border: '1px solid',
                                            borderColor: node.swept ? 'rgba(255,255,255,0.02)' : (node.reachable ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'),
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', alignItems: 'center',
                                            opacity: node.swept ? '0.35' : '1.0',
                                            textDecoration: node.swept ? 'line-through' : 'none',
                                            transition: 'all 0.5s'
                                        })
                                    },
                                        papyr.flex.row({ style: { gap: '6px', alignItems: 'center' } },
                                            papyr.span("●", { style: () => ({ color: node.swept ? '#64748b' : (node.reachable ? '#10b981' : '#f43f5e') }) }),
                                            papyr.span(node.name, { style: { color: '#fff', fontWeight: 'bold' } })
                                        ),
                                        node.type === 'root' ? 
                                            papyr.span("[Global GC Root]", { style: { color: '#64748b', fontSize: '0.65rem' } }) :
                                            (node.swept ? 
                                                papyr.span("[RECLAIMED]", { style: { color: '#64748b', fontSize: '0.65rem' } }) :
                                                papyr.button(node.reachable ? "Disconnect" : "Connect Root", {
                                                    style: { background: 'rgba(255,255,255,0.06)', border: 'none', color: '#cbd5e1', padding: '2px 6px', borderRadius: '3px', fontSize: '0.65rem', cursor: 'pointer' },
                                                    onclick: () => toggleGcNode(node.id)
                                                })
                                            )
                                    )
                                )
                            )
                        )
                    )
                ),
                
                // Section 6: Built-in Objects, RegExp and Operator Precedence
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' } },
                    papyr.h4("🔢 6. Built-in Objects, RegExp & Operators Evaluator", { style: { color: '#6366f1', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 'bold' } }),
                    papyr.p("Use built-in Math/Number operations, match text patterns with live RegExp compiles, and evaluate expressions to observe operator precedence.", { style: { fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 16px 0' } }),
                    
                    papyr.grid({ style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' } },
                        // Math and numbers
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '8px' } },
                            papyr.span("Math & Numbers Engine", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.flex.row({ style: { gap: '10px', alignItems: 'center', marginBottom: '4px' } },
                                papyr.span("Value:", { style: { fontSize: '0.78rem', color: '#94a3b8' } }),
                                papyr.input("number", "4.6", {
                                    style: { width: '80px', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.78rem', padding: '4px 8px', borderRadius: '4px' },
                                    oninput: (e) => mathNum.value = parseFloat(e.target.value) || 0
                                })
                            ),
                            papyr.grid({ style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem' } },
                                papyr.div({ style: { background: 'rgba(0,0,0,0.15)', padding: '6px', borderRadius: '4px' } },
                                    papyr.span("Math.PI: "),
                                    papyr.span(() => Math.PI.toFixed(4), { style: { color: '#818cf8', fontWeight: 'bold' } })
                                ),
                                papyr.div({ style: { background: 'rgba(0,0,0,0.15)', padding: '6px', borderRadius: '4px' } },
                                    papyr.span("Math.round: "),
                                    papyr.span(() => Math.round(mathNum.value), { style: { color: '#818cf8', fontWeight: 'bold' } })
                                ),
                                papyr.div({ style: { background: 'rgba(0,0,0,0.15)', padding: '6px', borderRadius: '4px' } },
                                    papyr.span("Math.sqrt: "),
                                    papyr.span(() => Math.sqrt(Math.abs(mathNum.value)).toFixed(2), { style: { color: '#818cf8', fontWeight: 'bold' } })
                                ),
                                papyr.div({ style: { background: 'rgba(0,0,0,0.15)', padding: '6px', borderRadius: '4px' } },
                                    papyr.span("Math.floor: "),
                                    papyr.span(() => Math.floor(mathNum.value), { style: { color: '#818cf8', fontWeight: 'bold' } })
                                )
                            )
                        ),
                        
                        // Live RegExp
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '8px' } },
                            papyr.span("Live RegExp Pattern Tester", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.input("text", regexPattern.value, {
                                placeholder: "RegExp pattern (e.g. \\d+)",
                                style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '0.78rem', padding: '6px', borderRadius: '4px' },
                                oninput: (e) => regexPattern.value = e.target.value
                            }),
                            papyr.input("text", regexText.value, {
                                placeholder: "Search text...",
                                style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.78rem', padding: '6px', borderRadius: '4px' },
                                oninput: (e) => regexText.value = e.target.value
                            }),
                            papyr.button("Execute RegExp Test", {
                                style: { background: '#10b981', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', width: 'fit-content' },
                                onclick: testRegex
                            }),
                            papyr.pre(() => regexMatchResult.value || "Matches output...", {
                                style: { background: '#090d16', padding: '6px', borderRadius: '4px', fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', margin: '0', maxHeight: '60px', whiteSpace: 'pre-wrap' }
                            })
                        ),
                        
                        // Operator Precedence
                        papyr.flex.col({ style: { background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', gap: '8px' } },
                            papyr.span("Expressions & Operators Evaluator", { style: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' } }),
                            papyr.input("text", operatorExpr.value, {
                                placeholder: "Expression...",
                                style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fda4af', fontFamily: 'monospace', fontSize: '0.78rem', padding: '6px', borderRadius: '4px' },
                                oninput: (e) => operatorExpr.value = e.target.value
                            }),
                            papyr.button("Evaluate Operators", {
                                style: { background: '#a855f7', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', width: 'fit-content' },
                                onclick: runOperatorEvaluator
                            }),
                            papyr.pre(() => operatorResult.value || "Precedence output...", {
                                style: { background: '#090d16', padding: '6px', borderRadius: '4px', fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', margin: '0', maxHeight: '60px', whiteSpace: 'pre-wrap' }
                            })
                        )
                    )
                ),
                
                // Section 7: Array Interactive Sandbox (enhanced visual)
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' } },
                    papyr.h4("📦 7. Arrays Mutability & High-Order Transformations", { style: { color: '#6366f1', margin: '0 0 12px 0' } }),
                    papyr.p(() => "Current Array: [ " + arrayState.value.map(x => "'" + x + "'").join(', ') + " ]", { style: { fontSize: '0.9rem', color: '#a7f3d0', fontWeight: 'bold', margin: '0 0 10px 0', fontFamily: 'monospace' } }),
                    
                    papyr.flex.col({ style: { gap: '10px' } },
                        papyr.span("Mutating Operations (Changes original reference):", { style: { fontSize: '0.78rem', color: '#94a3b8', fontWeight: 'bold' } }),
                        papyr.flex.row({ style: { gap: '6px', flexWrap: 'wrap' } },
                            papyr.button("Push 'React'", {
                                style: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' },
                                onclick: () => {
                                    let arr = [...arrayState.value];
                                    arr.push('React');
                                    arrayState.value = arr;
                                    papyr.toast("Pushed 'React'!", "info");
                                }
                            }),
                            papyr.button("Pop Last", {
                                style: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' },
                                onclick: () => {
                                    if (arrayState.value.length === 0) return papyr.toast("Array is empty!", "error");
                                    let arr = [...arrayState.value];
                                    arr.pop();
                                    arrayState.value = arr;
                                    papyr.toast("Popped element!", "info");
                                }
                            }),
                            papyr.button("Shift First", {
                                style: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' },
                                onclick: () => {
                                    if (arrayState.value.length === 0) return papyr.toast("Array is empty!", "error");
                                    let arr = [...arrayState.value];
                                    arr.shift();
                                    arrayState.value = arr;
                                    papyr.toast("Shifted element!", "info");
                                }
                            }),
                            papyr.button("Unshift 'Node.js'", {
                                style: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' },
                                onclick: () => {
                                    let arr = [...arrayState.value];
                                    arr.unshift('Node.js');
                                    arrayState.value = arr;
                                    papyr.toast("Unshifted 'Node.js'!", "info");
                                }
                            }),
                            papyr.button("Reverse Array", {
                                style: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' },
                                onclick: () => {
                                    let arr = [...arrayState.value];
                                    arr.reverse();
                                    arrayState.value = arr;
                                    papyr.toast("Reversed Array!", "info");
                                }
                            }),
                            papyr.button("Sort Alphabetically", {
                                style: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' },
                                onclick: () => {
                                    let arr = [...arrayState.value];
                                    arr.sort();
                                    arrayState.value = arr;
                                    papyr.toast("Sorted Array!", "info");
                                }
                            })
                        ),
                        
                        papyr.span("High-Order Transformations (Functional, returns copy):", { style: { fontSize: '0.78rem', color: '#94a3b8', fontWeight: 'bold', marginTop: '6px' } }),
                        papyr.flex.row({ style: { gap: '6px', flexWrap: 'wrap' } },
                            papyr.button("Map: UpperCase", {
                                style: { background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' },
                                onclick: () => {
                                    let mapped = arrayState.value.map(x => x.toUpperCase());
                                    papyr.toast("Map Complete: " + JSON.stringify(mapped), "success");
                                }
                            }),
                            papyr.button("Filter: Length > 3", {
                                style: { background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' },
                                onclick: () => {
                                    let filtered = arrayState.value.filter(x => x.length > 3);
                                    papyr.toast("Filter Complete: " + JSON.stringify(filtered), "success");
                                }
                            }),
                            papyr.button("Reduce: Concat Lengths", {
                                style: { background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' },
                                onclick: () => {
                                    let sum = arrayState.value.reduce((acc, x) => acc + x.length, 0);
                                    papyr.toast("Reduce (Sum of string lengths) Complete: " + sum, "success");
                                }
                            })
                        )
                    )
                ),
                
                // Section 8: Strings, Dates & Errors Handler (enhanced visual)
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' } },
                    papyr.h4("💬 8. Strings, Dates & Exception handling (try-catch)", { style: { color: '#6366f1', margin: '0 0 12px 0' } }),
                    papyr.flex.row({ style: { gap: '16px', flexWrap: 'wrap' } },
                        papyr.flex.col({ style: { flex: 1, minWidth: '220px', gap: '8px' } },
                            papyr.span("String Operations:", { style: { fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' } }),
                            papyr.input("text", stringVal.value, {
                                style: { background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.8rem', padding: '6px', borderRadius: '4px' },
                                oninput: (e) => stringVal.value = e.target.value
                            }),
                            papyr.flex.col({ style: { gap: '4px', fontSize: '0.78rem', color: '#cbd5e1' } },
                                papyr.span(() => "Length: " + stringVal.value.length),
                                papyr.span(() => "First Character (charAt 0): " + stringVal.value.charAt(0)),
                                papyr.span(() => "Split array: " + JSON.stringify(stringVal.value.split(' ')))
                            )
                        ),
                        papyr.flex.col({ style: { flex: 1, minWidth: '220px', gap: '8px' } },
                            papyr.span("Dates Engine:", { style: { fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' } }),
                            papyr.p(() => "Date Time: " + dateState.value, { style: { fontSize: '0.8rem', color: '#cbd5e1', margin: '0' } }),
                            papyr.button("Refresh Timestamp", {
                                style: { background: 'rgba(255,255,255,0.06)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', width: 'fit-content' },
                                onclick: () => {
                                    let now = new Date();
                                    dateState.value = now.toString();
                                    papyr.toast("Timestamp Refreshed!", "success");
                                }
                            })
                        )
                    ),
                    
                    papyr.span("Error Boundary Validator (Exception Handling):", { style: { fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold', display: 'block', margin: '14px 0 6px 0' } }),
                    papyr.flex.row({ style: { gap: '10px' } },
                        papyr.button("Trigger Expected Error 💥", {
                            style: { background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' },
                            onclick: () => {
                                try {
                                    throw new Error("Book not found!");
                                } catch (e) {
                                    errorMsg.value = e.name + ": " + e.message;
                                    papyr.toast("Caught custom error successfully!", "error");
                                }
                            }
                        }),
                        papyr.span(() => errorMsg.value ? "Caught Log: " + errorMsg.value : "Status: Purely safe. Zero errors thrown.", {
                            style: () => ({
                                fontSize: '0.78rem',
                                color: errorMsg.value ? '#fda4af' : '#64748b',
                                display: 'flex',
                                alignItems: 'center'
                            })
                        })
                    )
                )
            );
        } else if (tab === 'css') {
            return papyr.flex.col({ style: { gap: '16px' } },
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' } },
                    papyr.h4("Display & Positioning Layout Rules", { style: { color: '#a855f7', margin: '0 0 12px 0' } }),
                    papyr.p("Demonstrating complex CSS positions, display types, floats and box model layers dynamically.", { style: { fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 14px 0' } }),
                    
                    papyr.div({ style: { position: 'relative', width: '100%', height: '140px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' } },
                        papyr.div("z-index: 1 (Relative)", { style: { position: 'relative', top: '10px', left: '10px', zIndex: '1', width: '150px', background: '#a855f7', color: 'white', padding: '6px', borderRadius: '4px', fontSize: '0.75rem' } }),
                        papyr.div("z-index: 2 (Absolute)", { style: { position: 'absolute', top: '25px', left: '40px', zIndex: '2', width: '150px', background: '#14b8a6', color: 'white', padding: '6px', borderRadius: '4px', fontSize: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' } }),
                        papyr.div({ style: { float: 'right', width: '80px', height: '60px', background: '#38bdf8', margin: '10px', padding: '6px', borderRadius: '4px', fontSize: '0.75rem', color: 'black', fontWeight: 'bold' } }, "Floated Element"),
                        papyr.div("Clear element wraps beneath floats.", { style: { clear: 'both', padding: '10px 0 0 10px', fontSize: '0.75rem', color: '#cbd5e1' } })
                    )
                ),
                
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' } },
                    papyr.h4("Box Sizing Demonstration", { style: { color: '#a855f7', margin: '0 0 12px 0' } }),
                    papyr.flex.row({ style: { gap: '16px', flexWrap: 'wrap' } },
                        papyr.div({ style: { flex: 1, minWidth: '180px', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '6px' } },
                            papyr.span("border-box layout:", { style: { fontSize: '0.8rem', color: '#fff', fontWeight: 'bold', display: 'block', marginBottom: '6px' } }),
                            papyr.div({ style: { boxSizing: 'border-box', width: '100%', padding: '15px', border: '5px solid #a855f7', background: 'rgba(255,255,255,0.03)', fontSize: '0.7rem', color: '#94a3b8' } },
                                "Width includes 15px padding and 5px border inside."
                            )
                        ),
                        papyr.div({ style: { flex: 1, minWidth: '180px', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '6px' } },
                            papyr.span("content-box layout:", { style: { fontSize: '0.8rem', color: '#fff', fontWeight: 'bold', display: 'block', marginBottom: '6px' } }),
                            papyr.div({ style: { boxSizing: 'content-box', width: '80%', padding: '15px', border: '5px solid #6366f1', background: 'rgba(255,255,255,0.03)', fontSize: '0.7rem', color: '#94a3b8' } },
                                "Width excludes padding/border. Renders wider."
                            )
                        )
                    )
                ),
                
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' } },
                    papyr.h4("Colors & Typography Preview", { style: { color: '#a855f7', margin: '0 0 12px 0' } }),
                    papyr.flex.col({ style: { gap: '12px' } },
                        papyr.flex.row({ style: { gap: '10px', flexWrap: 'wrap' } },
                            papyr.div({ style: { width: '60px', height: '30px', background: 'hsl(280, 100%, 50%)', borderRadius: '4px' } }),
                            papyr.div({ style: { width: '60px', height: '30px', background: 'rgba(20, 184, 166, 0.5)', borderRadius: '4px' } }),
                            papyr.div({ style: { width: '60px', height: '30px', background: '#eab308', borderRadius: '4px' } }),
                            papyr.div({ style: { width: '60px', height: '30px', background: 'rgb(244, 63, 94)', borderRadius: '4px' } })
                        ),
                        papyr.p("Typography hierarchy displaying line-height and font fallback logic.", { style: { fontStyle: 'italic', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', fontFamily: "'Outfit', 'Roboto', sans-serif" } }),
                        papyr.span("Fallback typography applies elegantly.", { style: { fontSize: '0.8rem', color: '#64748b', fontWeight: '700' } })
                    )
                )
            );
        } else if (tab === 'power') {
            return papyr.flex.col({ style: { gap: '16px' } },
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' } },
                    papyr.h4("🔋 Real-time Power & Battery Diagnostics", { style: { color: '#f43f5e', margin: '0 0 10px 0' } }),
                    papyr.p("This dynamic panel displays reactive states updated in real-time by the Energy-Aware Power Engine plugin.", { style: { fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 16px 0' } }),
                    papyr.grid({ style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' } },
                        papyr.div({ style: { background: 'rgba(0,0,0,0.25)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' } },
                            papyr.span("Power Engine State", { style: { fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '6px' } }),
                            papyr.span(() => papyr.power ? papyr.power.state.value.toUpperCase() : 'INACTIVE', {
                                style: () => ({
                                    fontSize: '1.25rem',
                                    fontWeight: '800',
                                    color: papyr.power && papyr.power.state.value === 'active' ? '#10b981' : (papyr.power && papyr.power.state.value === 'idle' ? '#eab308' : '#6366f1'),
                                    textShadow: '0 0 10px currentColor'
                                })
                            })
                        ),
                        papyr.div({ style: { background: 'rgba(0,0,0,0.25)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' } },
                            papyr.span("Cooperative Target FPS", { style: { fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '6px' } }),
                            papyr.span(() => (papyr.power ? papyr.power.fps.value : 60) + " FPS", {
                                style: () => ({
                                    fontSize: '1.25rem',
                                    fontWeight: '800',
                                    color: papyr.power && papyr.power.fps.value >= 60 ? '#10b981' : (papyr.power && papyr.power.fps.value > 0 ? '#eab308' : '#ef4444'),
                                    textShadow: '0 0 10px currentColor'
                                })
                            })
                        )
                    )
                ),
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' } },
                    papyr.h4("🎬 Cinematic Intent-First Hero Showcase", { style: { color: '#f43f5e', margin: '0 0 12px 0' } }),
                    papyr.layout.hero({
                        title: "cinematic computing",
                        subtitle: "A modern, beautiful, and highly responsive user-experience powered entirely by tiny runtime engines.",
                        theme: 'teal',
                        glass: true,
                        padding: '40px 20px',
                        actions: [
                            { text: "Primary Action", primary: true, attrs: { onclick: () => papyr.toast("Primary Action clicked!", "success") } },
                            { text: "Secondary Link", primary: false, attrs: { onclick: () => papyr.toast("Secondary Action clicked!", "info") } }
                        ]
                    })
                ),
                papyr.div('.card', { style: { background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' } },
                    papyr.h4("☄️ Tactile Spring Dynamics Physics Animations", { style: { color: '#f43f5e', margin: '0 0 12px 0' } }),
                    papyr.p("Click and hover below to trigger zero-dependency spring physical rebounds natively.", { style: { fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 16px 0' } }),
                    papyr.flex.row({ justify: 'center', gap: '15px' },
                        papyr.button("Tactile Spring Bounce 🚀", {
                            style: {
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)'
                            },
                            onmousedown: (e) => {
                                papyr.animate.spring(e.target, { scale: 0.9 });
                            },
                            onmouseup: (e) => {
                                papyr.animate.spring(e.target, { scale: 1.15 });
                                setTimeout(() => {
                                    papyr.animate.spring(e.target, { scale: 1.0 });
                                }, 150);
                                papyr.toast("Spring rebound simulated!", "success");
                            },
                            onmouseenter: (e) => {
                                papyr.animate.spring(e.target, { scale: 1.08 });
                            },
                            onmouseleave: (e) => {
                                papyr.animate.spring(e.target, { scale: 1.0 });
                            }
                        })
                    )
                )
            );
        } else {
            return papyr.div("No tab selected");
        }
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
                            papyr.button(".toolbar-btn:Tailwind CSS", { onclick: (e) => loadTemplate('tailwind', e) }),
                            papyr.button(".toolbar-btn:3D World", { onclick: (e) => loadTemplate('immersive', e) }),
                            papyr.button(".toolbar-btn:Express SSR", { onclick: (e) => loadTemplate('ssr', e) }),
                            papyr.button(".toolbar-btn:React / Next", { onclick: (e) => loadTemplate('react', e) }),
                            papyr.button(".toolbar-btn:AI Semantic", { onclick: (e) => loadTemplate('ai', e) }),
                            papyr.button(".toolbar-btn:Physics Sandbox", { onclick: (e) => loadTemplate('physics', e) }),
                            papyr.button(".toolbar-btn:STEM Science", { onclick: (e) => loadTemplate('science', e) }),
                            papyr.button(".toolbar-btn:System File", { onclick: (e) => loadTemplate('system', e) }),
                            papyr.button(".toolbar-btn:AI Assistant", { onclick: (e) => loadTemplate('ai_chat', e) }),
                            papyr.button(".toolbar-btn:Cheat Sheet Showcase", { onclick: (e) => loadTemplate('cheatsheet', e) })
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

    const KernelDiagnostics = () => {
        let refreshTick = papyr.state(0);
        let intervalId = setInterval(() => {
            refreshTick.value++;
        }, 1000);

        let performanceAlerts = papyr.state([]);
        
        if (papyr.diagnostics && typeof papyr.diagnostics.on === 'function') {
            papyr.diagnostics.on('performance', (alert) => {
                performanceAlerts.value = [...performanceAlerts.value, alert];
            });
        }

        const safeStringify = (obj, space = 2) => {
            const cache = new Set();
            return JSON.stringify(obj, (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (cache.has(value)) {
                        return '[Circular]';
                    }
                    cache.add(value);
                    if (value instanceof Element) {
                        return `<${value.tagName.toLowerCase()}${value.id ? `#${value.id}` : ''}>`;
                    }
                }
                return value;
            }, space);
        };

        const rawEl = (tag, className, text, style = {}) => {
            const el = document.createElement(tag);
            if (className) {
                if (className.startsWith('.')) className = className.slice(1);
                el.className = className;
            }
            if (text) el.textContent = text;
            Object.assign(el.style, style);
            return el;
        };

        return papyr.div("#kernel-diagnostics.container", { 
            style: { paddingTop: '6rem' },
            onremove() {
                clearInterval(intervalId);
            }
        },
            papyr.h2(".section-title", { style: { display: 'inline-flex', alignItems: 'center', gap: '8px' } },
                papyr.icon('settings', { size: 24, color: 'var(--teal)' }),
                "Intelligent Kernel Diagnostics"
            ),
            papyr.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "Monitor your decentralized runtime kernel in real-time. Inspect state maps, spellchecking warnings, loaded plugins, and structural component graphs directly."
            ),
            
            papyr.div(".grid", { style: { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' } },
                papyr.div(".glass-panel", { style: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' } },
                    papyr.h3("Loaded Core Plugins", { style: { color: '#fff', margin: '0' } }),
                    papyr.ul({ style: { paddingLeft: '20px', margin: '0' } },
                        () => {
                            refreshTick.value;
                            const plugins = papyr.plugins.list();
                            if (plugins.length === 0) {
                                return rawEl('li', '', "No active plugins loaded.", { color: 'var(--text-muted)' });
                            }
                            const items = [];
                            plugins.forEach(p => {
                                const li = rawEl('li', '', "", { color: 'var(--text-main)', marginBottom: '8px' });
                                const strong = rawEl('strong', '', p.name, { color: 'var(--teal)' });
                                li.appendChild(strong);
                                li.appendChild(document.createTextNode(` (v${p.version || '1.0.0'})`));
                                items.push(li);
                            });
                            return items;
                        }
                    ),

                    papyr.h3("Component Registries Graph", { style: { color: '#fff', margin: '0', paddingTop: '1rem' } }),
                    papyr.p({ style: { color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0' } },
                        "Dynamic listing of active rendered elements currently tracked in the kernel:"
                    ),
                    papyr.div({ style: { maxHeight: '180px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' } },
                        papyr.ul({ style: { paddingLeft: '20px', margin: '0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' } },
                            () => {
                                refreshTick.value;
                                const comps = papyr.components.list();
                                if (comps.length === 0) {
                                    return rawEl('li', '', "No elements tracked yet.", { color: 'var(--text-muted)' });
                                }
                                const items = [];
                                comps.slice(0, 10).forEach(c => {
                                    const li = rawEl('li', '', `<${c.tag}${c.id ? ` id="${c.id}"` : ''}${c.classes ? ` class="${c.classes.split(' ').join('.')}"` : ''}>`, { color: '#cbd5e1' });
                                    items.push(li);
                                });
                                return items;
                            }
                        )
                    )
                ),

                papyr.div(".glass-panel", { style: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' } },
                    papyr.h3("Live Warning Logs & Alerts", { style: { color: '#fff', margin: '0' } }),
                    
                    papyr.div({ style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
                        () => {
                            refreshTick.value;
                            const errors = papyr.diagnostics.errors;
                            const alerts = performanceAlerts.value;
                            
                            const items = [];
                            
                            if (alerts.length > 0) {
                                alerts.forEach(a => {
                                    const div = rawEl('div', '', `🚨 Performance: ${a.message}`, {
                                        background: 'rgba(239, 68, 68, 0.15)', borderLeft: '3px solid #ef4444', padding: '8px 12px', borderRadius: '4px', fontSize: '0.85rem', color: '#fca5a5', marginBottom: '10px'
                                    });
                                    items.push(div);
                                });
                            }
                            
                            if (errors.length > 0) {
                                errors.forEach(err => {
                                    const isSelfHeal = err.type === 'self-heal-suggestion';
                                    const div = rawEl('div', '', `${isSelfHeal ? '💡 Spellcheck' : '⚠️ Warning'}: ${err.message}`, {
                                        background: isSelfHeal ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
                                        borderLeft: `3px solid ${isSelfHeal ? '#10b981' : '#f59e0b'}`, 
                                        padding: '8px 12px', 
                                        borderRadius: '4px', 
                                        fontSize: '0.85rem', 
                                        color: isSelfHeal ? '#a7f3d0' : '#fde047',
                                        marginBottom: '10px'
                                    });
                                    items.push(div);
                                });
                            }
                            
                            if (items.length === 0) {
                                return rawEl('div', '', "Zero warnings or performance anomalies detected.", { color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' });
                            }
                            return items;
                        }
                    ),

                    papyr.h3("Reactive Context Export Dump", { style: { color: '#fff', margin: '0', paddingTop: '1rem' } }),
                    papyr.pre({ style: { margin: '0', maxHeight: '200px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)' } },
                        papyr.code({ style: { fontFamily: 'var(--font-mono)', color: '#a5b4fc', fontSize: '0.78rem', whiteSpace: 'pre-wrap' } },
                            () => {
                                refreshTick.value;
                                return safeStringify(papyr.exportContext(), 2);
                            }
                        )
                    )
                )
            )
        );
    };

const MainApp = () => {
        return papyr.fragment(
            Hero(),
            SandboxStudio(),
            KernelDiagnostics(),
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
