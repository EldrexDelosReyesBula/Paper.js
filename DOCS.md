# Papyr.js Documentation

> A zero-dependency frontend library for building reactive, secure, and high-performance web applications with native DOM rendering.

---

# Table of Contents

1. [Introduction](#1-introduction)
2. [Philosophy](#2-philosophy)
3. [Installation](#3-installation)
4. [Quick Start](#4-quick-start)
5. [Core Concepts](#5-core-concepts)
6. [Element System](#6-element-system)
7. [State Management](#7-state-management)
8. [Layout Engine](#8-layout-engine)
9. [Animation Engine](#9-animation-engine)
10. [Routing](#10-routing)
11. [Components](#11-components)
12. [Events](#12-events)
13. [Styling System](#13-styling-system)
14. [Security Kernel](#14-security-kernel)
15. [WATT Privacy System](#15-watt-privacy-system)
16. [Storage APIs](#16-storage-apis)
17. [Plugin System](#17-plugin-system)
18. [AI Integration](#18-ai-integration)
19. [Backend Integration](#19-backend-integration)
20. [Performance](#20-performance)
21. [Accessibility](#21-accessibility)
22. [Browser APIs](#22-browser-apis)
23. [Error Diagnostics](#23-error-diagnostics)
24. [Ecosystem Packages](#24-ecosystem-packages)
25. [Deployment](#25-deployment)
26. [Contributing](#26-contributing)
27. [Roadmap](#27-roadmap)
28. [License](#28-license)

---

# 1. Introduction

Papyr.js is a lightweight, zero-dependency frontend library built for creating reactive user interfaces directly with native browser APIs.

Unlike traditional frameworks that rely on virtual DOM diffing, build pipelines, or heavy abstractions, Papyr works directly with real DOM elements while maintaining a simple reactive system.

Papyr is designed for:

* Dashboards
* Progressive Web Apps (PWAs)
* Embedded widgets
* Documentation sites
* Lightweight SaaS interfaces
* Static deployments
* Internal tooling

## Key Features

* Zero dependencies
* Native DOM rendering
* Fine-grained reactivity
* Built-in routing
* Security sanitization
* Lightweight storage APIs
* Animation utilities
* Browser API wrappers
* Plugin architecture
* No bundler required

---

# 2. Philosophy

Papyr.js is built around three core principles.

## Simplicity

If you understand HTML and JavaScript objects, you already understand Papyr.

```js
papyr.div(
  papyr.h1('Hello'),
  papyr.button('Click')
);
```

## Performance

Papyr avoids expensive render cycles by updating only the reactive parts of the DOM.

Benefits include:

* No virtual DOM diffing
* Minimal runtime overhead
* Small bundle size
* Native browser rendering

## Security

Papyr includes built-in sanitization and encrypted storage helpers to reduce common frontend security risks.

---

# 3. Installation

## CDN Installation

```html
<script src="https://papyrus-js.vercel.app/papyr-complete.js"></script>
```

## Local Installation

You may also use local source bundles:

```txt
papyr.js
papyr-plugins.js
papyr-complete.js
```

## Recommended Bundle

| Bundle              | Description                     |
| ------------------- | ------------------------------- |
| `papyr.js`          | Core runtime only               |
| `papyr-plugins.js`  | Official plugins                |
| `papyr-complete.js` | Full runtime + plugins + styles |

---

# 4. Quick Start

## Basic Application

```html
<div id="app"></div>

<script>
  const app = papyr.div('.card',
    papyr.h1('Hello from Papyr!'),
    papyr.button('Click', {
      onclick: () => alert('Clicked!')
    })
  );

  papyr.mount('#app', app);
</script>
```

---

## Reactive Counter Example

```js
const count = papyr.state(0);

const display = papyr.p(
  () => `Clicks: ${count.value}`
);

const button = papyr.button('Increment', {
  onclick: () => count.value++
});

const app = papyr.div(
  display,
  button
);

papyr.mount('#app', app);
```

---

# 5. Core Concepts

Papyr is composed of several core systems.

| API                | Description               |
| ------------------ | ------------------------- |
| `papyr()`          | Element creation          |
| `papyr.state()`    | Reactive state            |
| `papyr.computed()` | Derived state             |
| `papyr.if()`       | Conditional rendering     |
| `papyr.for()`      | Reactive lists            |
| `papyr.mount()`    | DOM mounting              |
| `papyr.route()`    | SPA routing               |
| `papyr.security`   | Sanitization + encryption |
| `papyr.api`        | HTTP helpers              |

---

# 6. Element System

Papyr elements are created using function-based DOM builders.

## Example

```js
const card = papyr.div('.card',
  papyr.h2('Profile'),
  papyr.p('Native DOM rendering.'),
  papyr.button('Save', {
    onclick: () => console.log('saved')
  })
);
```

---

## Common Element Helpers

### Layout Elements

```js
papyr.div(...)
papyr.span(...)
papyr.fragment(...)
```

### Typography

```js
papyr.h1(...)
papyr.h2(...)
papyr.h3(...)
papyr.p(...)
```

### Interactive Elements

```js
papyr.button(...)
papyr.a(...)
papyr.img(...)
```

---

## Supported Children Types

Papyr accepts:

* Strings
* DOM nodes
* Arrays
* Reactive functions
* Fragments
* Nested components

---

# 7. State Management

Papyr ships with fine-grained reactive state management.

---

## Create Reactive State

```js
const count = papyr.state(0);
```

---

## Update State

```js
count.value = 10;
```

---

## Computed State

```js
const double = papyr.computed(
  () => count.value * 2
);
```

---

## Subscriptions

```js
count.subscribe(value => {
  console.log(value);
});
```

---

## Conditional Rendering

```js
const show = papyr.state(true);

const node = papyr.if(
  show,
  () => papyr.p('Visible'),
  () => papyr.p('Hidden')
);
```

---

## Reactive Lists

```js
const items = papyr.state([
  'apple',
  'banana'
]);

const list = papyr.for(
  items,
  item => papyr.li(item)
);
```

---

# 8. Layout Engine

Papyr includes built-in layout utilities for responsive interfaces.

---

## Flex Helpers

```js
papyr.flex.row(...)
papyr.flex.col(...)
papyr.flex.center(...)
papyr.flex.between(...)
```

---

## Responsive Layouts

Papyr’s bundled styles include:

* Responsive containers
* Grid helpers
* Card layouts
* Dashboard spacing
* Mobile breakpoints

---

# 9. Animation Engine

Papyr supports hardware-accelerated animations with reduced-motion accessibility support.

---

## Attribute-Based Animations

```html
<div animate="slide-up">
  Animated Content
</div>
```

---

## Built-in Animations

| Animation    | Description       |
| ------------ | ----------------- |
| `fade`       | Fade transition   |
| `slide`      | Slide movement    |
| `zoom`       | Zoom scaling      |
| `blur`       | Blur transition   |
| `rotate`     | Rotation          |
| `bounce`     | Bounce effect     |
| `elastic`    | Elastic movement  |
| `glass-pop`  | Glassmorphism pop |
| `fade-in`    | Entrance fade     |
| `slide-up`   | Upward entrance   |
| `slide-down` | Downward entrance |
| `zoom-in`    | Zoom entrance     |
| `blur-in`    | Blur entrance     |

---

## Programmatic Effects

```js
papyr.parallax(selector, speed);

papyr.physics({
  gravity: 0.5
});
```

---

# 10. Routing

Papyr includes a lightweight hash-based SPA router.

---

## Define Routes

```js
papyr.route('#/home', HomePage);

papyr.route(
  '#/profile/:id',
  ProfilePage
);
```

---

## Navigate Programmatically

```js
papyr.navigate('/profile/42');
```

---

## Access Route Parameters

```js
const params = papyr.useParams();

console.log(params.value.id);
```

---

## Mount Router

```js
papyr.mount(
  '#app',
  papyr.router()
);
```

---

# 11. Components

Papyr supports both functional and class-based components.

---

## Functional Components

```js
const Card = (title) =>
  papyr.div(
    '.card',
    papyr.h3(title)
  );
```

---

## Class Components

```js
class MyCard extends papyr.component {
  render() {
    return papyr.div(
      '.card',
      papyr.h3('Hello')
    );
  }
}
```

---

# 12. Events

Papyr uses standard DOM event bindings.

---

## Event Example

```js
papyr.button('Click Me', {
  onclick: () => console.log('clicked'),
  onmouseover: () => console.log('hover')
});
```

---

## Reactive Event-Driven Content

```js
papyr.p(() => {
  return `Count: ${count.value}`;
});
```

---

# 13. Styling System

Papyr includes a built-in premium CSS system with optional framework interoperability.

---

## Class-Based Styling

```js
papyr.div(
  '.glass-panel',
  {
    style: {
      padding: '20px'
    }
  },
  'Content'
);
```

---

## Built-in Theme Features

The bundled CSS includes:

* Glassmorphism panels
* Gradient backgrounds
* Responsive spacing
* Typography tokens
* Shadow presets
* UI utility classes

---

## Framework Loading

Papyr can dynamically load CSS frameworks.

```js
papyr.loadFramework('tailwind');

papyr.loadFramework('bootstrap');
```

---

# 14. Security Kernel

Papyr includes a built-in security layer.

---

## HTML Sanitization

```js
const safeHtml =
  papyr.security.sanitize(
    dangerousHtml
  );
```

---

## Encryption

```js
const encrypted =
  papyr.security.encrypt(
    text,
    password
  );

const decrypted =
  papyr.security.decrypt(
    encrypted,
    password
  );
```

---

## Security Features

The kernel removes:

* `<script>` tags
* Inline event handlers
* `javascript:` URLs

---

# 15. WATT Privacy System

WATT (Web App Tracking Transparency) adds user-facing permission layers before browser permission prompts appear.

---

## Camera Access

```js
papyr.camera.request(
  'Used for profile photos',
  'video'
);
```

---

## Geolocation Access

```js
papyr.location.request(
  'Needed for maps'
);
```

---

## Features

* Transparent permission prompts
* Graceful rejection handling
* Hardware access wrappers

> Requires the browser API plugin.

---

# 16. Storage APIs

Papyr includes local, session, and encrypted storage systems.

---

## Local Storage

```js
papyr.storage.set('key', {
  a: 1
});

const data =
  papyr.storage.get('key');
```

---

## Session Storage

```js
papyr.session.set('key', value);

const data =
  papyr.session.get('key');
```

---

## Secure Storage

```js
papyr.storage.secureSet(
  'secret',
  { token: 'abc' },
  'password'
);

const result =
  papyr.storage.secureGet(
    'secret',
    'password'
  );
```

---

## Unified Database API

```js
const users = papyr.db('users');

users.insert({
  name: 'Jane'
});

users.update(id, {
  active: true
});

users.delete(id);

users.watch(data => {
  console.log(data);
});
```

---

## Supported Engines

* `local`
* `session`
* `firebase`
* `sqlite`

---

# 17. Plugin System

Papyr supports modular plugins through `papyr.use()`.

---

## Install Plugin

```js
papyr.use(myPlugin);
```

---

## Official Plugins

| Plugin           | Purpose                 |
| ---------------- | ----------------------- |
| Animations       | Motion utilities        |
| Charts           | Data visualization      |
| Browser APIs     | Device wrappers         |
| PWA              | Service worker support  |
| Design Utilities | UI helpers              |
| Particle Effects | Visual effects          |
| UI Components    | Prebuilt elements       |
| WATT             | Permission transparency |
| Layout Helpers   | Responsive layouts      |

---

# 18. AI Integration

Papyr does not include a built-in AI engine.

Instead, AI services should be integrated externally through APIs.

---

## Example

```js
const response =
  await papyr.api.post(
    '/api/ai',
    {
      prompt: 'Write a summary'
    }
  );
```

---

# 19. Backend Integration

Papyr is backend-agnostic.

---

## HTTP Helpers

```js
papyr.api.get(url, headers);

papyr.api.post(
  url,
  data,
  headers
);
```

---

## Authentication

```js
papyr.auth.init(config);

papyr.auth.login(credentials);

papyr.auth.register(credentials);

papyr.auth.logout();
```

---

## State Synchronization

Use:

* `papyr.db()`
* `papyr.storage`
* `papyr.api`

to synchronize local and remote application state.

---

# 20. Performance

Papyr is optimized for minimal runtime cost.

---

## Performance Advantages

* Native DOM rendering
* Fine-grained reactivity
* Lightweight router
* `IntersectionObserver` animation handling
* Small payload sizes
* Low memory overhead

---

# 21. Accessibility

Papyr uses standard HTML elements, making accessibility straightforward.

---

## Best Practices

* Use semantic HTML
* Add `aria-*` attributes when necessary
* Preserve keyboard navigation
* Use visible focus styles
* Respect reduced motion settings

---

# 22. Browser APIs

Papyr wraps several native browser APIs.

---

## Clipboard

```js
papyr.clipboard.copy(text);

papyr.clipboard.read();
```

---

## Geolocation

```js
papyr.location.get();
```

---

## Camera

```js
papyr.camera.open('video');

papyr.camera.stop();
```

---

## Vibration

```js
papyr.vibrate([100, 50, 100]);
```

---

## PWA

```js
papyr.pwa.init('/sw.js');
```

---

# 23. Error Diagnostics

Papyr includes runtime diagnostics and debug tools.

---

## Diagnostics Features

* Unknown tag warnings
* Invalid animation suggestions
* Security warnings
* Failed API request logs

---

## Enable Debug Mode

```js
papyr.debug(true);
```

---

# 24. Ecosystem Packages

| Package             | Description         |
| ------------------- | ------------------- |
| `papyr.js`          | Core runtime        |
| `papyr-plugins.js`  | Official plugins    |
| `papyr-complete.js` | Full bundle         |
| `src/core/*`        | Internal subsystems |
| `src/plugins/*`     | Plugin modules      |

---

# 25. Deployment

Papyr applications can be deployed as static websites.

---

## Recommended Platforms

* GitHub Pages
* Vercel
* Netlify
* Cloudflare Pages

---

## Recommended Structure

```txt
index.html
app.js
styles.css
```

---

## PWA Support

```js
papyr.pwa.init('/sw.js');
```

---

# 26. Contributing

Contributions are welcome.

---

## Suggested Workflow

1. Fork the repository
2. Create a feature branch
3. Add tests or examples
4. Submit a pull request

---

## Development Guidelines

* Preserve zero-dependency architecture
* Keep APIs minimal
* Maintain security guarantees
* Use reactive primitives consistently
* Follow existing naming conventions

---

# 27. Roadmap

Planned improvements include:

* AI helper integrations
* Better accessibility tooling
* Expanded plugin ecosystem
* IndexedDB support
* Server-side rendering
* Interactive documentation site
* Enhanced dashboard components

---

# 28. License

Papyr.js is released under the **MIT License**.

See the `LICENSE` file for complete license information.
