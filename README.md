<img width="1650" height="866" alt="Papyr.js banner" src="https://github.com/user-attachments/assets/b72e2615-0db3-4885-a424-a3ef1d094548" />

# 📄 Papyrus (papyr.js) — HTML Made Stupid Simple
> **Write HTML like you're writing a text message. Built with zero-dependency reactive magic, enterprise security, and premium responsive aesthetics.**

[![MIT License](https://img.shields.io/badge/License-MIT-teal.svg)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-indigo.svg)](#)
[![Bundle Size](https://img.shields.io/badge/Minified--Gzipped-~12KB-blue.svg)](#)

Papyrus is an ultra-lightweight, blazing-fast JavaScript library designed to build modern interactive HTML interfaces with absolute zero complexity and zero terminal setups. By bypassing the Virtual DOM entirely and compiling directly to native browser elements, Papyrus delivers stellar runtime speeds while keeping developer cognitive load to a minimum.

Papyrus v3.0 introduces a state-of-the-art **Agile Modular Architecture**, featuring automatic dependency-tracking reactivity, built-in enterprise vault encryption, HTML5 SPA routing, reactive mathematical formula solvers, persistent local databases, and a fluid responsive design system.

---

## ⚡ Core Philosophy
1. **One function. One rule. Zero complexity:** If you know standard HTML tags and JavaScript objects, you already know Papyrus.
2. **XSS-Immune Secure Engine:** Transparently sanitizes strings, removing dangerous script vectors and pseudo-protocols dynamically.
3. **No NPM or Terminal Overhead Required:** Just include a single CDN link inside a bare HTML file and hit refresh.
4. **CSS Spotlight Design System:** Loaded with premium dark grids, radial glows, glassmorphism panel states, and fluid scroll animations out of the box.

---

## 🚀 Zero-Download CDN Setup

Get started instantly without installing anything. Link `papyr-complete.js` from our Vercel CDN in your `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Papyrus App</title>
    <!-- Include Papyrus Complete CDN Bundle -->
    <script src="https://papyrus-js.vercel.app/papyr-complete.js"></script>
</head>
<body>
    <div id="app"></div>

    <script>
        // Mount a beautiful responsive card instantly
        let app = papyr.div(".card",
            papyr.h1("Hello from Papyrus! ⚡"),
            papyr.p("Everything works out-of-the-box!")
        );
        papyr.mount("#app", app);
    </script>
</body>
</html>
```

---

## 🔋 Automatic Reactivity & Computed System

Papyrus includes a lightweight, fine-grained dependency-tracking reactivity engine. When state values mutate, subscribing DOM text nodes and element attributes update automatically in real time:

```javascript
// 1. Create a reactive state
let count = papyr.state(0);

// 2. Create an auto-tracking computed property
let double = papyr.computed(() => count.value * 2);

// 3. Bind elements dynamically by passing callbacks or state values
let counterWidget = papyr.flex.col(
    papyr.h3("🔋 Reactive Counter"),
    papyr.p(() => "Count Value: " + count.value),
    papyr.p(() => "Computed Double: " + double.value),
    
    papyr.button("Increment Count", {
        class: "btn-primary",
        onclick: () => count.value++
    })
);

papyr.mount("#app", counterWidget);
```

---

## 🔒 Enterprise Security Vault (`papyr.security`)

LocalStorage is highly vulnerable to scraping by malicious browser extensions. Papyrus includes an **Enterprise Security Vault** that encrypts state data transparently using a native XOR+Base64 cipher before committing it to storage, ensuring only authorized clients can read it.

```javascript
const myPassword = "developer-key-2026";
const sensitiveUser = { name: "Eldrex Reyes", key: "super-secret-token-xyz" };

// Encrypt and commit safely to browser memory
papyr.storage.secureSet("user-session", sensitiveUser, myPassword);
// raw LocalStorage stores: "Q0ZGVVZDVVVSRVJDRkVVVlVTRVJD" (scrambled cipher text)

// Decrypt transparently back into a native JavaScript object
const decryptedUser = papyr.storage.secureGet("user-session", myPassword);
console.log(decryptedUser.name); // "Eldrex Reyes"
```

---

## 📱 Advanced Fluid Mobile Responsiveness

The Papyrus layout engine features native, mobile-aware breakpoints and structure systems. High-end split layouts and dashboards break gracefully and stack vertically on screens under 768px.

### Key Responsive Helpers
* **`.crud-grid` & `.responsive-split-grid`**: CSS layout classes that stack responsive multi-column configurations into 1-column layouts on smartphones.
* **`.mobile-header` & `.menu-toggle`**: Built-in sticky header rules for mobile collapsible sidebars, allowing developers to create highly interactive navigation sliders seamlessly.
* **Reactive Menu Synchronization**: Synchronize mobile sidebar slide-ins with `papyr.state()` to keep documentation clean and uncluttered.

---

## 🧮 Reactive Mathematical Studio (`papyr.math`)

Formulate complex reactive equation trees instantly. Perfect for financial models, interactive shopping carts, and dynamic dashboards that update computed fields reactively whenever variables change.

```javascript
let price = papyr.state(100);
let discount = papyr.state(15);
let tax = papyr.state(8);

// Automatically tracks prices and updates totals reactively!
let discountAmount = papyr.math.mul(price, papyr.math.div(discount, 100));
let discountedPrice = papyr.math.sub(price, discountAmount);
let taxAmount = papyr.math.mul(discountedPrice, papyr.math.div(tax, 100));
let finalTotal = papyr.math.round(papyr.math.sum(discountedPrice, taxAmount), 2);

let checkoutCard = papyr.div(".glass-panel",
    papyr.h3("🛒 Checkout Summary"),
    papyr.p(() => "Base Price: $" + price.value),
    papyr.p(() => "Discounted Subtotal: $" + discountedPrice.value),
    papyr.h2(() => "Grand Total: $" + finalTotal.value)
);
```

### Available Mathematical Functions
* `papyr.math.sum(...args)`: Calculates the reactive sum of numerical elements.
* `papyr.math.sub(a, b)`: Computes the difference of two reactive states.
* `papyr.math.mul(...args)`: Computes the product of states or numbers.
* `papyr.math.div(a, b)`: Performs division (safely returns `0` if dividing by `0`).
* `papyr.math.avg(...args)`: Returns the average of all numbers.
* `papyr.math.percent(val, total)`: Calculates the percentage of `val` in `total`.
* `papyr.math.round(val, decimals)`: Precision decimal rounder.

---

## 💾 Persistent CRUD Databases (`papyr.crud`)

Create lightweight, fully persistent CRUD databases in standard client architectures with zero API configuration. CRUD changes instantly persist to LocalStorage and reflect reactively in the UI.

```javascript
// 1. Initialize persistent catalog
let store = papyr.crud("task-manager", [
    { title: "Review Papyrus specifications", done: true }
]);

// 2. Perform CRUD operations reactively
let task = store.create({ title: "Build responsive layout", done: false });
store.update(task.id, { done: true });
store.delete(task.id);
store.clear(); // Clear all catalog entries
```

---

## 🔌 Premium UI Primitives & Visual Widgets

Papyrus comes pre-packaged with beautiful layout primitives and interactive visual widgets:

### 1. Flexbox Layout Primitives
```javascript
papyr.flex.row(child1, child2);     // Flex-row direction layout
papyr.flex.col(child1, child2);     // Vertical flex-column layout
papyr.flex.center(child);           // Center items horizontally & vertically
papyr.flex.between(child1, child2); // Spacer-between layout alignment
```

### 2. Dialog Modals & Interactive Alerts
```javascript
// Dialog Popups
let modal = papyr.modal(
    papyr.div(
        papyr.p("Popup dialog message in native DOM!"),
        papyr.button("Close Modal", { onclick: () => modal.hide() })
    ),
    "System Alert"
);
modal.show();

// Toast Notifications
papyr.toast("Vault successfully updated!", "success"); // Teal green
papyr.toast("Unauthorized action.", "error");          // Rose pink
papyr.toast("Loading resources...", "info");           // Indigo/blue
```

---

## 🛡️ Spellcheck Debugger Warnings

Papyrus protects beginners from spelling tag typos through a Levenshtein distance matching engine. If a tag is typed incorrectly (e.g. `papyr.buton`), an event warning is dispatched automatically detailing spelling suggestions:

```javascript
// Deliberate spelling warning trigger:
let myBtn = papyr.buton("Click me"); 
// Console output warning: "PapyrWarning: Unknown tag 'buton'. Did you mean 'button'?"
```

---

## 🔌 Open-Source Namespace Harmony (`papyr.noConflict`)

Need to drop Papyrus into a legacy application that already uses the global variable `window.papyr`? The library includes a built-in safety switch to restore the original global namespace.

```javascript
// Release control of the global variable
const myPapyr = papyr.noConflict();

// window.papyr is restored to its original value.
// You can now safely use myPapyr as your handle!
myPapyr.mount("#app", myPapyr.div("Safe Namespace Element!"));
```

---

## 🐍 Dev Companion Scaffolder CLI (`paper.py`)

A zero-dependency CLI developer companion for fast, automated development workflows:

### 1. Scaffold a project instantly
```bash
python paper.py init [app-name]
```
Generates a gorgeous, pre-configured reactive starting template in **less than 5 milliseconds**!

### 2. Launch high-speed development server
```bash
python paper.py dev [port]
```
Spins up a lightweight web server (default port `8000`), overrides standard Windows registry issues, and serves Javascript files correctly as `application/javascript` to bypass browser MIME blocks.

---

## 🤝 Contribution & Collaboration

Papyrus is fully open-source and customizable. We encourage you to fork, submit issues, add custom canvas plugins, and help make frontend development simpler!

* **GitHub Repository:** [https://github.com/EldrexDelosReyesBula/Papyrus/](https://github.com/EldrexDelosReyesBula/Papyrus/)
* **CDN Link:** `https://papyrus-js.vercel.app/papyr-complete.js`
* **Agile Architectural Contribution Guide:** [CONTRIBUTING.md](file:///c:/Users/Eldrex/Downloads/paper/CONTRIBUTING.md)

*Released under the MIT License. Crafted with absolute zero dependencies.*

