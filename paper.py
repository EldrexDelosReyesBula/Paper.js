# papyr.py
# High-speed dev companion scaffolder and local dev server for Papyr.js
# Designed with a Gen Z aesthetic, clean diagnostics, and lightning speeds.
import os
import sys
import http.server
import socketserver
import webbrowser

# Force UTF-8 stdout/stderr encoding for Windows compatibility with high-Unicode emojis
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# Terminal colors using ANSI codes
TEAL = "\033[36m"
INDIGO = "\033[38;5;99m"
AMBER = "\033[33m"
GREEN = "\033[32m"
RED = "\033[31m"
BOLD = "\033[1m"
RESET = "\033[0m"

# Custom Request Handler to force JavaScript MIME type correctly on Windows
class PaperRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for quick CDN mockings if needed
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def guess_type(self, path):
        # Prevent Windows Registry from forcing text/plain on .js or .css files
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        if path.endswith('.svg'):
            return 'image/svg+xml'
        return super().guess_type(path)

def serve_dev(port=8000):
    handler = PaperRequestHandler
    print(f"\n{INDIGO}{BOLD}* Paper.js Dev Server *{RESET}")
    print(f"{TEAL}============================={RESET}")
    print(f"📁 Servicing: {BOLD}{os.getcwd()}{RESET}")
    print(f"🚀 URL:       {GREEN}{BOLD}http://localhost:{port}{RESET}")
    print(f"{TEAL}============================={RESET}")
    print(f"Press {RED}Ctrl+C{RESET} to terminate the server.\n")

    # Automatically launch default browser
    try:
        webbrowser.open(f"http://localhost:{port}")
    except Exception:
        pass

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n{AMBER}👋 Dev server stopped. See ya!{RESET}")

def scaffold_init(app_name):
    print(f"\n{INDIGO}{BOLD}* Scaffolding new Paper.js project: {BOLD}{app_name}{RESET}")
    print(f"{TEAL}========================================={RESET}")

    if app_name.lower().endswith('.html') or app_name.lower().endswith('.htm'):
        if os.path.exists(app_name):
            print(f"{RED}❌ Error: File '{app_name}' already exists. Please choose a different name.{RESET}\n")
            sys.exit(1)
            
        html_self_contained = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Paper App</title>
    <link rel="icon" type="image/png" href="https://eldrex.landecs.org/logo/eldrex-paper-js.png">
    <!-- Paper Complete CDN link - Zero download dependencies -->
    <script src="https://papyrus-js.vercel.app/paper-complete.js"></script>
    <style>
        :root {
            --bg: #070913;
            --bg-card: rgba(16, 22, 42, 0.65);
            --border-glow: rgba(99, 102, 241, 0.2);
            --text-head: #ffffff;
            --text-main: #cbd5e1;
            --text-muted: #64748b;
            --primary: #6366f1;
            --primary-hover: #4f46e5;
            --teal: #14b8a6;
        }

        body {
            margin: 0;
            padding: 0;
            background-color: var(--bg);
            color: var(--text-main);
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Background Radial Glow */
        body::before {
            content: '';
            position: fixed;
            top: -20%;
            left: -10%;
            width: 60%;
            height: 60%;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(0,0,0,0) 70%);
            z-index: -1;
            pointer-events: none;
        }

        .card {
            background: var(--bg-card);
            border: 1px solid var(--border-glow);
            border-radius: 16px;
            padding: 2.5rem;
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
            text-align: center;
            max-width: 420px;
            width: 100%;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            transition: transform 0.3s ease;
        }

        .card:hover {
            transform: translateY(-2px);
        }

        .btn {
            background: linear-gradient(135deg, var(--primary) 0%, #4338ca 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.25s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 1rem;
            box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.3);
        }

        .btn:hover {
            box-shadow: 0 6px 20px 0 rgba(99, 102, 241, 0.5);
            background: linear-gradient(135deg, var(--primary-hover) 0%, #3730a3 100%);
        }
    </style>
</head>
<body>
    
    <!-- Mount Root Element -->
    <div id="app"></div>

    <script>
        // Custom starting code with Paper.js state and computing
        let count = paper.state(0);
        let double = paper.computed(() => count.value * 2);

        let app = paper.div(".card",
            paper.h2("⚡ Welcome to Paper!", { style: { margin: '0 0 0.5rem 0', color: '#fff' } }),
            paper.p("Edit this HTML file directly to build high-performance, reactive pages without any bundlers or npm installs.", { style: { fontSize: '0.9rem', color: 'var(--text-muted)' } }),
            
            paper.div({ style: { margin: '1.5rem 0', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' } },
                paper.p(() => "Clicks Count: " + count.value, { style: { fontSize: '1.2rem', fontWeight: 'bold', color: '#14b8a6', margin: '0' } }),
                paper.p(() => "Double Count: " + double.value, { style: { fontSize: '0.9rem', color: '#a5b4fc', margin: '5px 0 0 0' } })
            ),
            
            paper.button(".btn:Increment Reactive Value", {
                onclick: () => {
                    count.value++;
                    paper.toast("Value incremented!", "success");
                }
            })
        );

        // Mount dynamic element to standard root container
        paper.mount("#app", app);
    </script>
</body>
</html>
"""
        with open(app_name, "w", encoding="utf-8") as f:
            f.write(html_self_contained)
            
        print(f"{GREEN}[OK] Successfully created self-contained page '{app_name}'!{RESET}")
        print(f"\n{BOLD}To start your development dev server, run:{RESET}")
        print(f"{TEAL}  python paper.py dev{RESET}")
        print(f"\n{INDIGO}Happy hacking with Paper!{RESET}\n")
        return

    if os.path.exists(app_name):
        print(f"{RED}❌ Error: Folder '{app_name}' already exists. Please choose a different name.{RESET}\n")
        sys.exit(1)

    os.makedirs(app_name)

    # 1. Create index.html
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Paper App</title>
    <link rel="icon" type="image/png" href="https://eldrex.landecs.org/logo/eldrex-paper-js.png">
    <!-- Paper Complete CDN link - Zero download dependencies -->
    <script src="https://papyrus-js.vercel.app/paper-complete.js"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    
    <!-- Mount Root Element -->
    <div id="app"></div>

    <script src="app.js"></script>
</body>
</html>
"""
    with open(os.path.join(app_name, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_content)

    # 2. Create styles.css
    css_content = """/* Custom starter stylesheet for Paper.js */
:root {
    --bg: #070913;
    --bg-card: rgba(16, 22, 42, 0.65);
    --border-glow: rgba(99, 102, 241, 0.2);
    --text-head: #ffffff;
    --text-main: #cbd5e1;
    --text-muted: #64748b;
    --primary: #6366f1;
    --primary-hover: #4f46e5;
    --teal: #14b8a6;
}

body {
    margin: 0;
    padding: 0;
    background-color: var(--bg);
    color: var(--text-main);
    font-family: system-ui, -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow-x: hidden;
}

/* Background Radial Glow */
body::before {
    content: '';
    position: fixed;
    top: -20%;
    left: -10%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(0,0,0,0) 70%);
    z-index: -1;
    pointer-events: none;
}

.card {
    background: var(--bg-card);
    border: 1px solid var(--border-glow);
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
    text-align: center;
    max-width: 420px;
    width: 100%;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-2px);
}

.btn {
    background: linear-gradient(135deg, var(--primary) 0%, #4338ca 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 1rem;
    box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.3);
}

.btn:hover {
    box-shadow: 0 6px 20px 0 rgba(99, 102, 241, 0.5);
    background: linear-gradient(135deg, var(--primary-hover) 0%, #3730a3 100%);
}
"""
    with open(os.path.join(app_name, "styles.css"), "w", encoding="utf-8") as f:
        f.write(css_content)

    # 3. Create app.js
    js_content = """// Custom starting code with Paper.js state and computing
let count = paper.state(0);
let double = paper.computed(() => count.value * 2);

let app = paper.div(".card",
    paper.h2("⚡ Welcome to Paper!", { style: { margin: '0 0 0.5rem 0', color: '#fff' } }),
    paper.p("Edit app.js to build high-performance, reactive pages without compilation step or bundles.", { style: { fontSize: '0.9rem', color: 'var(--text-muted)' } }),
    
    paper.div({ style: { margin: '1.5rem 0', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' } },
        paper.p(() => "Clicks Count: " + count.value, { style: { fontSize: '1.2rem', fontWeight: 'bold', color: '#14b8a6', margin: '0' } }),
        paper.p(() => "Double Count: " + double.value, { style: { fontSize: '0.9rem', color: '#a5b4fc', margin: '5px 0 0 0' } })
    ),
    
    paper.button(".btn:Increment Reactive Value", {
        onclick: () => {
            count.value++;
            paper.toast("Value incremented!", "success");
        }
    })
);

// Mount dynamic element to standard root container
paper.mount("#app", app);
"""
    with open(os.path.join(app_name, "app.js"), "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"{GREEN}[OK] Successfully created project structure in '{app_name}'!{RESET}")
    print(f"\n{BOLD}To start your development dev server, run:{RESET}")
    print(f"{TEAL}  cd {app_name}{RESET}")
    print(f"{TEAL}  python ../paper.py dev{RESET}")
    print(f"\n{INDIGO}Happy hacking with Paper!{RESET}\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"\n{BOLD}{RED}Paper CLI Helper{RESET}")
        print(f"{TEAL}=================={RESET}")
        print(f"Usage:")
        print(f"  python paper.py dev [port]       -> Runs a fast development HTTP server (default port 8000)")
        print(f"  python paper.py init [name]      -> Instantly scaffolds a starting reactive template")
        print(f"==================\n")
        sys.exit(1)

    cmd = sys.argv[1].lower()
    if cmd == 'dev':
        port = int(sys.argv[2]) if len(sys.argv) > 2 else 8000
        serve_dev(port)
    elif cmd == 'init':
        name = sys.argv[2] if len(sys.argv) > 2 else "paper-app"
        scaffold_init(name)
    else:
        print(f"{RED}[ERROR] Unknown command: '{cmd}'. Use 'dev' or 'init'.{RESET}")
        sys.exit(1)
