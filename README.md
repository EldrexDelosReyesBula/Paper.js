<img width="2100" height="1103" alt="Paper.js banner" src="https://github.com/user-attachments/assets/712b968d-4f1e-4a59-946e-c70cca126c0a" />


# Paper.js - HTML made stupid simple 
> **Write HTML like you're writing a text message.**

Paper.js is an ultra-lightweight JavaScript library that compiles direct reactive UI trees without any bundlers, Virtual DOM reflow overhead, or terminal setups.

With a core library under 50 lines of code, Paper turns verbose, complex nesting structures:
```html
<div class="card">
  <h1>Hello</h1>
  <p>World</p>
</div>
```

Into a single, clean function call:
```javascript
paper.div(".card", "h1:Hello", "p:World")
```

---

## ⚡ Core Philosophy
1. **One function. One rule. Zero complexity.**
2. **Safer by Default:** Replaces vulnerable `innerHTML` calls with secure, XSS-immune `textContent` automatic parsing.
3. **No NPM/Webpack Needed:** Fully runs in native browsers. Zero npm installs. Zero build steps. Just copy-paste or load the CDN script!
4. **Tailwind & Bootstrap Auto-CDNs:** Dynamic loader modules automatically inject stylesheets on demand.

---

## 🚀 Zero-Download CDN Setup

You can get started instantly without downloading or installing anything. Simply import `paper-complete.js` from our Vercel CDN:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Paper App</title>
    <!-- Include Paper.js Complete CDN -->
    <script src="https://eldrex-paper-js.vercel.app/paper-complete.js"></script>
</head>
<body>
    <div id="app"></div>

    <script>
        // Mount a beautiful header instantly
        let app = paper.div(".card",
            paper.h1("Hello from Paper! ⚡"),
            paper.p("Everything works out-of-the-box!")
        );
        paper.mount("#app", app);
    </script>
</body>
</html>
```

---

## 🔋 Automatic Reactivity & Computed System

Paper.js includes a Vue/SolidJS-style dependency-tracking reactivity engine. When state values mutate, subscribing DOM text nodes and element properties update automatically:

```javascript
// 1. Create a reactive state
let count = paper.state(0);

// 2. Create an auto-tracking computed property
let double = paper.computed(() => count.value * 2);

// 3. Bind properties dynamically by passing callbacks
let counterWidget = paper.flex.col(
    paper.h3("🔋 Reactive Counter"),
    paper.p(() => "Count Value: " + count.value),
    paper.p(() => "Computed Double: " + double.value),
    
    paper.button("Increment Count", {
        onclick: () => count.value++
    })
);

paper.mount("#app", counterWidget);
```

---

## 🔌 High-Level UI Components & Layouts

Paper.js comes preloaded with powerful visual layout structures and modular interactive components inside the `paper` namespace:

### 1. Flexbox Layouts
```javascript
paper.flex.row(child1, child2);     // flex-direction: row
paper.flex.col(child1, child2);     // flex-direction: column
paper.flex.center(child);           // items & content center aligned
paper.flex.between(child1, child2); // space-between alignment
```

### 2. Autocomplete Suggestions
```javascript
let input = paper.autoComplete(
    ['United States', 'Canada', 'Mexico', 'United Kingdom'],
    'Search Countries...'
);
input.addEventListener('change', (e) => console.log('Selected:', e.detail));
```

### 3. Gorgeous Dialog Modals
```javascript
let modal = paper.modal(
    paper.div(
        paper.p("Dynamic popup message inside native DOM!"),
        paper.button("Close", { onclick: () => modal.hide() })
    ),
    "System Alert"
);
document.body.appendChild(modal);
modal.show(); // Display modal with smooth background masks
```

### 4. Interactive Toast Alerts
```javascript
paper.toast("Action successful!", "success"); // Teal green slider notification
paper.toast("Something went wrong.", "error");   // Rose red compile error indicator
paper.toast("Log notification...", "info");     // Cyan blue build logger
```

### 5. Multi-Tab Containers
```javascript
let customTabs = paper.tabs([
    { title: 'Home', content: paper.p("Welcome page text.") },
    { title: 'Profile', content: paper.p("Manage user configurations.") }
]);
```

### 6. Seamless API Fetch Loading Clients
```javascript
paper.fetch('https://jsonplaceholder.typicode.com/users', {
    onSuccess: (cardBody, data) => {
        // Automatically manages loading spinners and errors
        data.slice(0, 3).forEach(user => cardBody.appendChild(paper.p(user.name)));
    }
});
```

---

## 🐍 Gen Z Python Companion CLI Tool (`paper.py`)

A zero-dependency CLI developer companion for blazing-fast development workflows:

### 1. Scaffold a project instantly
```bash
python paper.py init [app-name]
```
This generates a gorgeous, pre-configured reactive starting template inside a new directory in **less than 5 milliseconds**!
Scaffold includes:
* `index.html` linked directly to our Vercel CDN.
* `app.js` with count/computed starter reactivity code.
* `styles.css` with dark-mode glassmorphic aesthetics.

### 2. Launch high-speed development server
```bash
python paper.py dev [port]
```
Spins up a lightweight web server (default port `8000`), overrides standard Windows registry issues, and correctly serves Javascript `.js` files as `application/javascript` to bypass browser MIME blocks.

---

## 🛠️ Spellcheck tag spell-check debugger warnings

Paper.js protects beginners from spelling tag typos through a Levenshtein distance matching engine. If a tag is typed incorrectly (e.g. `paper.buton`), an event warning is dispatched automatically detailing spelling suggestions:

```javascript
// Deliberate spelling warning trigger:
let myBtn = paper.buton("Click me"); 
// Console output warning: "PaperError: Unknown tag 'buton'. Did you mean 'button'?"
```

---

## 🤝 Contribution & Collaboration

Paper.js is fully open-source and customizable. We encourage you to fork, submit issues, add custom canvas plugins, and help make frontend development simpler!

* **GitHub Repository:** [https://github.com/EldrexDelosReyesBula/Paper.js/](https://github.com/EldrexDelosReyesBula/Paper.js/)
* **CDN Link:** `https://eldrex-paper-js.vercel.app/paper-complete.js`

*Released under the MIT License. Crafted with absolute zero dependencies.*
