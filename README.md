<img width="2100" height="1103" alt="Paper.js banner" src="https://github.com/user-attachments/assets/712b968d-4f1e-4a59-946e-c70cca126c0a" />


# Paper.js - HTML made stupid simple 
> **Write HTML like you're writing a text message.**

Paper.js is an ultra-lightweight JavaScript ecosystem designed to build reactive web applications instantly. With no complex bundlers, terminal setups, or virtual DOM overhead, Paper compiles high-performance DOM trees directly inside native browsers.

Paper.js v3.0 introduces a state-of-the-art **Agile Modular Architecture**, featuring reactive mathematical logic computations (`paper.math`), persistent browser database engines (`paper.crud`), and responsive design system widgets—all integrated seamlessly in under 5 milliseconds!

---

## ⚡ Core Philosophy
1. **One function. One rule. Zero complexity:** If you know HTML tags, you already know Paper.js.
2. **XSS-Immune Secure Engines:** Replaces vulnerable `innerHTML` with automatically sanitized `textContent` text nodes.
3. **No NPM or Terminal Overhead Required:** Simply link our CDN script, and your application is ready to run.
4. **Tailwind & Bootstrap Auto-Loaders:** Dynamic styler engines automatically inject stylesheets on demand.

---

## 🚀 Zero-Download CDN Setup

Get started instantly without installing anything. Link `paper-complete.js` from our Vercel CDN in your `index.html`:

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

## 🧮 Reactive Mathematical Studio (`paper.math`)

Paper.js v3.0 includes an automatic mathematical engine that tracks reactive variables and computes equations reactively in real time. Ideal for live calculator panels, finance trackers, and dashboard statistics.

```javascript
// 1. Initialize reactive numerical state values
let price = paper.state(100);
let discount = paper.state(15);
let tax = paper.state(8);

// 2. Formulate equations using paper.math (auto-tracks prices and percentages!)
let discountAmount = paper.math.mul(price, paper.math.div(discount, 100));
let discountedPrice = paper.math.sub(price, discountAmount);
let taxAmount = paper.math.mul(discountedPrice, paper.math.div(tax, 100));
let finalTotal = paper.math.round(paper.math.sum(discountedPrice, taxAmount), 2);

// 3. Bind equations to DOM elements reactively
let checkoutCard = paper.div(".glass-panel",
    paper.h3("🛒 Checkout Summary"),
    paper.p(() => "Base Price: $" + price.value),
    paper.p(() => "Discounted Subtotal: $" + discountedPrice.value),
    paper.h2(() => "Grand Total: $" + finalTotal.value)
);
```

### Available Mathematical Functions
* `paper.math.sum(...args)`: Calculates the sum of standard numbers or reactive state nodes.
* `paper.math.sub(a, b)`: Computes the difference of two reactive states or numbers.
* `paper.math.mul(...args)`: Computes the reactive product of multiple states or numbers.
* `paper.math.div(a, b)`: Performs reactive division (with safe check returning `0` if dividing by `0`).
* `paper.math.avg(...args)`: Returns the reactive mathematical average of all variables.
* `paper.math.percent(val, total)`: Calculates the reactive percentage of `val` inside `total`.
* `paper.math.round(val, decimals)`: Dynamic precision rounder for float calculations.

---

## 💾 LocalStorage Persistent Database (`paper.crud`)

Say goodbye to complex backend SQL setups or asynchronous fetch calls for simple applications. `paper.crud` sets up a persistent, zero-config local database catalog that auto-synchronizes with `localStorage` reactively.

```javascript
// 1. Create a persistent store backed by local caching
let contactStore = paper.crud("dev-directory", [
    { name: "Eldrex Reyes", role: "Library Author" }
]);

// 2. Perform CRUD operations reactively!
// - Create:
let newContact = contactStore.create({ name: "Satoshi Nakamoto", role: "Protocol Engineer" });

// - Read:
let satoshi = contactStore.read(newContact.id);

// - Update:
contactStore.update(satoshi.id, { role: "Bitcoin Inventor" });

// - Delete:
contactStore.delete(satoshi.id);

// - Clear:
contactStore.clear();
```

### Live Filtering Example
```javascript
let searchQuery = paper.state('');

// Computed list reactively filters when search input changes
let filteredContacts = paper.computed(() => {
    let query = searchQuery.value.toLowerCase().trim();
    let items = contactStore.items.value; // Reactive database state node
    return items.filter(x => x.name.toLowerCase().includes(query));
});
```

---

## 🔋 Automatic Reactivity & Computed System

Paper.js includes a lightweight Vue/SolidJS-style dependency-tracking reactivity engine. When state values mutate, subscribing DOM text nodes and element properties update automatically:

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

## 🔌 Premium UI Components & Visual Layouts

Paper.js comes preloaded with beautiful layout primitives and visual components inside the `paper` namespace:

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
paper.toast("Action successful!", "success"); // Teal green notification
paper.toast("Something went wrong.", "error");   // Rose red compile error indicator
paper.toast("Log notification...", "info");     // Cyan blue info toast
```

---

## 🐍 Gen Z Python Companion CLI Tool (`paper.py`)

A zero-dependency CLI developer companion for blazing-fast development workflows:

### 1. Scaffold a project instantly
```bash
python paper.py init [app-name]
```
Generates a gorgeous, pre-configured reactive starting template in **less than 5 milliseconds**!

### 2. Launch high-speed development server
```bash
python paper.py dev [port]
```
Spins up a lightweight web server (default port `8000`), overrides standard Windows registry issues, and serves JavaScript files correctly as `application/javascript` to bypass browser MIME blocks.

---

## 🛠️ Spellcheck debugger warnings

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
* **Agile Architectural Contribution Guide:** [CONTRIBUTING.md](file:///c:/Users/Eldrex/Downloads/paper/CONTRIBUTING.md)

*Released under the MIT License. Crafted with absolute zero dependencies.*
