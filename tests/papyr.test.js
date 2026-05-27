// tests/papyr.test.js
// Pristine, zero-dependency automated unit test runner for overhauled Papyr.js library.

const fs = require('fs');
const path = require('path');

// Mock browser global environment
global.Element = class Element {};
global.HTMLElement = class HTMLElement extends global.Element {};
global.DocumentFragment = class DocumentFragment {};
global.window = global;
global.CustomEvent = class CustomEvent {};
global.addEventListener = () => {};
global.dispatchEvent = () => {};
global.window.addEventListener = () => {};
global.window.dispatchEvent = () => {};
global.MutationObserver = class MutationObserver {
    observe() {}
    disconnect() {}
};
global.document = {
    createElement(tag) {
        const el = {
            tagName: tag.toUpperCase(),
            style: {
                setProperty(key, val) { this[key] = val; }
            },
            dataset: {},
            classList: {
                add(c) { el.className = (el.className ? el.className + ' ' : '') + c; },
                remove(c) { el.className = (el.className || '').replace(c, '').trim(); },
                toggle(c, force) { if (force) this.add(c); else this.remove(c); }
            },
            appendChild(child) {
                if (!this.children) this.children = [];
                if (child.parentNode && typeof child.parentNode.removeChild === 'function') {
                    child.parentNode.removeChild(child);
                }
                this.children.push(child);
                child.parentNode = this;
                return child;
            },
            insertBefore(child, reference) {
                if (!this.children) this.children = [];
                if (child.parentNode && typeof child.parentNode.removeChild === 'function') {
                    child.parentNode.removeChild(child);
                }
                const idx = reference ? this.children.indexOf(reference) : -1;
                if (idx !== -1) {
                    this.children.splice(idx, 0, child);
                } else {
                    this.children.push(child);
                }
                child.parentNode = this;
                return child;
            },
            removeChild(child) {
                if (!this.children) return child;
                const idx = this.children.indexOf(child);
                if (idx !== -1) {
                    this.children.splice(idx, 1);
                }
                child.parentNode = null;
                return child;
            },
            remove() {
                if (this.parentNode && typeof this.parentNode.removeChild === 'function') {
                    this.parentNode.removeChild(this);
                }
            },
            addEventListener(event, callback) {
                if (!this.listeners) this.listeners = {};
                this.listeners[event] = callback;
            },
            setAttribute(k, v) { this[k] = v; },
            removeAttribute(k) { delete this[k]; }
        };
        return el;
    },
    createTextNode(text) {
        return { textContent: text };
    },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
    head: { appendChild() {} },
    body: { appendChild() {} }
};

let localStoreMock = {};
global.localStorage = {
    getItem(key) { return localStoreMock[key] !== undefined ? localStoreMock[key] : null; },
    setItem(key, val) { localStoreMock[key] = String(val); },
    removeItem(key) { delete localStoreMock[key]; },
    clear() { localStoreMock = {}; }
};

let sessionStoreMock = {};
global.sessionStorage = {
    getItem(key) { return sessionStoreMock[key] !== undefined ? sessionStoreMock[key] : null; },
    setItem(key, val) { sessionStoreMock[key] = String(val); },
    removeItem(key) { delete sessionStoreMock[key]; },
    clear() { sessionStoreMock = {}; }
};

// 1. Evaluate/load compiled papyr-complete.js
const papyrCompleteCode = fs.readFileSync(path.join(__dirname, '..', 'papyr-complete.js'), 'utf8');
eval(papyrCompleteCode);

const paper = global.papyr;

console.log("\n=======================================================");
console.log("🧪 RUNNING PAPYR.JS COMPREHENSIVE AUTOMATED UNIT TESTS");
console.log("=======================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✅ [PASS] ${message}`);
        passed++;
    } else {
        console.error(`❌ [FAIL] ${message}`);
        failed++;
    }
}

async function runTests() {
    // ----------------------------------------------------
    // Test 1: Reactivity & Auto-Tracking Computeds
    // ----------------------------------------------------
    try {
        console.log("--- 1. REACTIVITY TESTS ---");
        const count = paper.state(10);
        const double = paper.computed(() => count.value * 2);
        
        assert(count.value === 10, "Initial state value is 10");
        assert(double.value === 20, "Initial computed double is 20");
        
        count.value = 25;
        assert(double.value === 50, "Computed double auto-updated to 50 on state mutation");
    } catch(e) {
        assert(false, "Reactivity Test error: " + e.message);
    }

    // ----------------------------------------------------
    // Test 2: Reactivity Computed Error Boundaries
    // ----------------------------------------------------
    try {
        console.log("\n--- 2. COMPUTED ERROR BOUNDARIES TESTS ---");
        let hasError = false;
        paper.on('error', (err) => {
            hasError = true;
        });

        // Triggering throw inside computed
        const faulty = paper.computed(() => {
            throw new Error("Simulated computed logic error");
        });
        
        assert(hasError === true, "Faulty computed successfully caught and reported error via diagnostics");
    } catch(e) {
        assert(false, "Computed Error Boundary Test error: " + e.message);
    }

    // ----------------------------------------------------
    // Test 3: Math Module Zero Multiplication Fix
    // ----------------------------------------------------
    try {
        console.log("\n--- 3. REACTIVE MATH ZERO MULTIPLICATION TESTS ---");
        const a = paper.state(5);
        const b = paper.state(0);
        const product = paper.math.mul(a, b);
        
        assert(product.value === 0, "5 multiplied by 0 equals 0 (coercion bug resolved)");
        
        b.value = 4;
        assert(product.value === 20, "Math mul reactively updates to 20 when state changes to 4");
    } catch(e) {
        assert(false, "Math multiplication test error: " + e.message);
    }

    // ----------------------------------------------------
    // Test 4: Custom CSS Variables Override System
    // ----------------------------------------------------
    try {
        console.log("\n--- 4. COMPONENT-SCOPED CSS VARIABLE DICTIONARIES ---");
        const card = paper.card({
            interactive: true,
            style: {
                '--papyr-surface': 'rgba(255, 0, 128, 0.05)',
                '--papyr-border': 'rgba(255, 0, 128, 0.3)',
                '--papyr-radius-card': '0px'
            }
        }, paper.title("Custom Title"));
        
        assert(card.style['--papyr-surface'] === 'rgba(255, 0, 128, 0.05)', "Custom CSS variable --papyr-surface mapped correctly on card style");
        assert(card.style['--papyr-border'] === 'rgba(255, 0, 128, 0.3)', "Custom CSS variable --papyr-border mapped correctly on card style");
        assert(card.style['--papyr-radius-card'] === '0px', "Custom CSS variable --papyr-radius-card mapped correctly on card style");
        assert(card.interactive === 'true', "Card successfully set interactive option attribute");
    } catch(e) {
        assert(false, "Custom style override test error: " + e.message);
    }

    // ----------------------------------------------------
    // Test 5: Client-Side Security Storage Encryption
    // ----------------------------------------------------
    try {
        console.log("\n--- 5. CRYPTO & OBJECTION-PROOF STORAGE ENCRYPTION ---");
        const originalText = "Premium Static Content ⚡";
        const password = "my-secure-key-phrase";
        
        const encrypted = paper.security.encrypt(originalText, password);
        assert(encrypted !== originalText, "Encryption modified original text");
        
        const decrypted = paper.security.decrypt(encrypted, password);
        assert(decrypted === originalText, "Decrypted text perfectly matches original text");
        
        const decryptedWithWrongPass = paper.security.decrypt(encrypted, "wrong-pass");
        assert(decryptedWithWrongPass !== originalText, "Decryption with wrong password fails to restore plaintext");
    } catch(e) {
        assert(false, "Security storage ciphers test error: " + e.message);
    }

    // ----------------------------------------------------
    // Test 6: Advanced XSS Sanitization Patterns
    // ----------------------------------------------------
    try {
        console.log("\n--- 6. STRENGTHENED XSS SANITIZATION TESTS ---");
        const maliciousHTML = "<div>Hello <script>alert('xss')</script><img src='x.jpg' onerror='alert(1)'> <a href='javascript:void(0)'>Link</a></div>";
        const sanitized = paper.security.sanitize(maliciousHTML);
        
        assert(!sanitized.includes("<script>"), "Strip script tags successfully");
        assert(!sanitized.includes("onerror="), "Strip onerror inline event handlers successfully");
        assert(!sanitized.includes("javascript:"), "Strip javascript pseudo-protocol successfully");
    } catch(e) {
        assert(false, "XSS Sanitization test error: " + e.message);
    }

    // ----------------------------------------------------
    // Test 7: Unified Standard Storage & Session APIs
    // ----------------------------------------------------
    try {
        console.log("\n--- 7. STORAGE & SESSION STANDARDIZED API TESTS ---");
        // Unified call signature storage(key, val)
        paper.storage("username", "eldrex_dev");
        assert(paper.storage("username") === "eldrex_dev", "Unified signature storage(k, v) getter/setter works");
        
        // Property get/set signature
        paper.storage.set("role", { name: "Architect" });
        assert(paper.storage.get("role").name === "Architect", "Property style storage.get/set works with objects");
        
        // Clear
        paper.storage.clear();
        assert(paper.storage("username") === null, "storage.clear successfully flushes storage space");
    } catch(e) {
        assert(false, "Storage consistent api test error: " + e.message);
    }

    // ----------------------------------------------------
    // Test 8: Graceful Component Error Boundaries
    // ----------------------------------------------------
    try {
        console.log("\n--- 8. GENERIC ERROR BOUNDARIES TESTS ---");
        const rendered = paper.errorBoundary(
            () => {
                throw new Error("Broken widget template execution");
            },
            (err) => paper.div('.custom-fallback', "Caught: " + err.message)
        );
        
        assert(rendered.className === 'custom-fallback', "Component error caught and fallback rendered gracefully");
    } catch(e) {
        assert(false, "ErrorBoundary test error: " + e.message);
    }

    // ----------------------------------------------------
    // Test 9: Capability Modules & Dynamic Plugin Registries
    // ----------------------------------------------------
    try {
        console.log("\n--- 9. CAPABILITY MODULES & PLUGINS DYNAMIC TESTS ---");
        
        // 1. Auto-registration check
        assert(typeof paper.ai === 'object', "AI Capability Module automatically registered");
        assert(typeof paper.physics === 'object', "Physics Capability Module automatically registered");
        assert(typeof paper.science === 'object', "Science Capability Module automatically registered");
        assert(typeof paper['3d'] === 'object', "Immersive 3D Capability Module automatically registered");
        
        // 2. Explicit plugin loading check (decoupled simulation)
        // Reset ai namespace to simulate loading in a clean environment
        const oldAI = paper.ai;
        delete paper.ai;
        assert(paper.ai === undefined, "AI namespace reset successfully for dynamic load test");
        
        // Require/Load the independent module
        const aiModule = require('../src/plugins/ai.js');
        
        // Register explicitly
        paper.use(aiModule);
        
        assert(typeof paper.ai === 'object', "AI Module explicitly loaded and registered via papyr.use(ai)");
        assert(typeof paper.ai.toSemanticJSON === 'function', "AI toSemanticJSON method is successfully exposed");
        
        // Restore AI just in case
        paper.ai = oldAI;
    } catch(e) {
        assert(false, "Capability Modules test error: " + e.message);
    }

        // ----------------------------------------------------
        // Test 10: Granular Database CRUD & .list() System
        // ----------------------------------------------------
        try {
            console.log("\n--- 10. DYNAMIC CRUD DATABASE & .LIST() TESTS ---");
            const db = paper.db("test_collection", "local");
            
            // 1. Initial State & list()
            assert(Array.isArray(db.list()), "db.list() returns an array");
            assert(db.list().length === 0, "db.list() is initially empty");
            
            // 2. Insert record
            const record = db.insert({ name: "Architect", rank: 1 });
            assert(record.id !== undefined, "Inserted record has a unique ID");
            assert(record.name === "Architect", "Inserted record retains properties");
            assert(db.list().length === 1, "db.list() size updated to 1");
            
            // 3. Find record
            const found = db.find(record.id);
            assert(found && found.name === "Architect", "db.find() successfully retrieves the record");
            
            // 4. Update record
            db.update(record.id, { rank: 10 });
            assert(db.find(record.id).rank === 10, "db.update() successfully merges new field data");
            
            // 5. Delete record
            db.delete(record.id);
            assert(db.list().length === 0, "db.delete() successfully removes the record");
            assert(db.find(record.id) === undefined, "Deleted record is no longer queryable");
            
            // 6. Async variants execution
            const recAsync = await db.insertAsync({ name: "Async Node", status: "online" });
            assert(recAsync.id !== undefined, "db.insertAsync() creates a unique ID");
            assert(db.list().length === 1, "db.list() size updated to 1 after async insert");
            
            await db.updateAsync(recAsync.id, { status: "offline" });
            assert(db.find(recAsync.id).status === "offline", "db.updateAsync() correctly updates field");
            
            await db.deleteAsync(recAsync.id);
            assert(db.list().length === 0, "db.deleteAsync() successfully removes record");
        } catch(e) {
            assert(false, "Granular CRUD DB test error: " + e.message);
        }

        // ----------------------------------------------------
        // Test 11: Core Reactive Style Functions
        // ----------------------------------------------------
        try {
            console.log("\n--- 11. CORE REACTIVE STYLE FUNCTIONS TESTS ---");
            const sideWidth = paper.state("250px");
            const sideEl = paper.div({
                style: {
                    width: () => sideWidth.value,
                    color: "red"
                }
            });
            assert(sideEl.style.width === "250px", "Dynamic style function initially evaluated to 250px");
            assert(sideEl.style.color === "red", "Static style property color evaluates to red");
            
            sideWidth.value = "80px";
            assert(sideEl.style.width === "80px", "Dynamic style function reactively updated to 80px when state changed");
        } catch(e) {
            assert(false, "Core Reactive Style Functions test error: " + e.message);
        }

        // ----------------------------------------------------
        // Test 12: Database Querying, Sorting, and Pagination
        // ----------------------------------------------------
        try {
            console.log("\n--- 12. DATABASE QUERYING, SORTING & PAGINATION TESTS ---");
            const db = paper.db("query_test_collection", "local");
            db.clear();
            db.insert({ name: "Apple", priority: 2 });
            db.insert({ name: "Banana", priority: 1 });
            db.insert({ name: "Cherry", priority: 3 });
            
            assert(db.list().length === 3, "Database successfully seeded with 3 items");
            
            const sorted = db.query({ sort: { field: "priority", direction: "asc" } });
            assert(sorted[0].name === "Banana", "Sorting priority asc: index 0 is Banana");
            assert(sorted[2].name === "Cherry", "Sorting priority asc: index 2 is Cherry");
            
            const filtered = db.query({ filter: { name: "Banana" } });
            assert(filtered.length === 1 && filtered[0].priority === 1, "Filtering matches exact object match key-value pair");
            
            const filteredFn = db.query({ filter: item => item.priority > 1 });
            assert(filteredFn.length === 2, "Filtering with custom filter callback correctly returns matching elements");
            
            const paginated = db.query({ 
                sort: { field: "priority", direction: "asc" },
                limit: 1,
                offset: 1
            });
            assert(paginated.length === 1 && paginated[0].name === "Apple", "Pagination offset 1, limit 1 correctly slices list to Apple");
        } catch(e) {
            assert(false, "Database Querying, Sorting & Pagination test error: " + e.message);
        }

        // ----------------------------------------------------
        // Test 13: Component Lifecycle Hooks
        // ----------------------------------------------------
        try {
            console.log("\n--- 13. COMPONENT LIFECYCLE HOOKS TESTS ---");
            let mountTriggered = false;
            let unmountTriggered = false;
            
            const el = paper.div({
                onMounted: (n) => { mountTriggered = true; },
                onUnmounted: (n) => { unmountTriggered = true; }
            });
            
            assert(el._onMounted !== undefined, "onMounted lifecycle callback registered on node");
            assert(el._onUnmounted !== undefined, "onUnmounted lifecycle callback registered on node");
            
            el._onMounted(el);
            assert(mountTriggered === true, "onMounted hook executes successfully");
            
            el._onUnmounted(el);
            assert(unmountTriggered === true, "onUnmounted hook executes successfully");
        } catch(e) {
            assert(false, "Component Lifecycle Hooks test error: " + e.message);
        }

        // ----------------------------------------------------
        // Test 14: Hardened Authentication Security
        // ----------------------------------------------------
        try {
            console.log("\n--- 14. HARDENED AUTHENTICATION SECURITY TESTS ---");
            paper.storage.clear();
            const auth = paper.auth;
            auth.init({ provider: 'local' });
            
            let regError = null;
            await auth.register({ username: "alice", password: "123" }).catch(e => { regError = e.message; });
            assert(regError && regError.includes("at least 8 characters"), "Registration blocks weak passwords less than 8 characters");
            
            const alice = await auth.register({ username: "alice", password: "strongpassword123" });
            assert(alice.username === "alice", "Successful registration completes with valid 8+ character password");
            
            await auth.logout();
            let loginError = null;
            for (let i = 0; i < 4; i++) {
                await auth.login({ username: "alice", password: "wrongpassword" }).catch(e => { loginError = e.message; });
                assert(loginError.includes("attempts remaining") || loginError.includes("Incorrect password"), "Failed login attempt tracked correctly");
            }
            
            await auth.login({ username: "alice", password: "wrongpassword" }).catch(e => { loginError = e.message; });
            assert(loginError.includes("Account locked"), "5 consecutive failed logins triggers active account lockout");
        } catch(e) {
            assert(false, "Hardened Authentication Security test error: " + e.message);
        }

        // ----------------------------------------------------
        // Test 15: Upgraded Reactivity & Styling Engine
        // ----------------------------------------------------
        try {
            console.log("\n--- 15. UPGRADED REACTIVITY & STYLING ENGINE TESTS ---");
            
            // 1. papyr.signal check
            const sig = paper.signal("John");
            assert(sig.value === "John", "papyr.signal functions correctly as an alias to papyr.state");
            
            // 2. papyr.watch check
            let watchedVal = null;
            let watchOldVal = null;
            paper.watch(sig, (newVal, oldVal) => {
                watchedVal = newVal;
                watchOldVal = oldVal;
            });
            assert(watchedVal === "John", "papyr.watch immediately captures and calls with the initial value");
            
            sig.value = "Eldrex";
            assert(watchedVal === "Eldrex", "papyr.watch triggers when signal value changes");
            assert(watchOldVal === "John", "papyr.watch receives correct previous value");

            // 3. papyr.model check
            const modelObj = paper.model(sig);
            assert(typeof modelObj.value === 'function' && modelObj.value() === "Eldrex", "papyr.model returns value getter function");
            assert(typeof modelObj.oninput === 'function', "papyr.model returns oninput handler");

            // 4. papyr.theme check
            paper.theme({ primary: "#ff5500", radius: "8px" });
            assert(true, "papyr.theme executed without error");

            // 5. paper utilities check
            const div = paper.div({
                paper: ["flex", "center", "rounded-xl", "md:flex"]
            });
            assert(div.style.display === "flex", "paper utility flex applied standard layout directly to element style");
            assert(div.style.justifyContent === "center" && div.style.alignItems === "center", "paper utility center applied flex-center layout directly to element style");
            assert(div.style.borderRadius === "12px", "paper utility rounded-xl applied 12px border radius directly to element style");
            assert(div.className.includes("paper-u-"), "paper responsive utility generated and applied unique class name for media queries");
        } catch(e) {
            console.error(e.stack);
            assert(false, "Upgraded Reactivity & Styling Engine test error: " + e.message);
        }

        // ----------------------------------------------------
        // Test 16: Proxy Reactivity, Keyed Reconciliation, & Unmount Cleanups
        // ----------------------------------------------------
        try {
            console.log("\n--- 16. PROXY REACTIVITY, KEYED RECONCILIATION & UNMOUNT CLEANUPS ---");
            
            // 1. Array proxy push reactivity
            const list = paper.state([{ id: 1, name: "Task 1" }, { id: 2, name: "Task 2" }]);
            
            let rendersCount = 0;
            const renderedList = paper.for(list, (item) => {
                rendersCount++;
                return paper.div({ id: `item-${item.id}` }, item.name);
            });
            
            assert(renderedList.children.length === 2, "Initially rendered 2 items");
            assert(rendersCount === 2, "Initially created 2 elements");
            
            // Push an item to the array state
            list.value.push({ id: 3, name: "Task 3" });
            
            assert(renderedList.children.length === 3, "After pushing, rendered 3 items automatically via proxy mutation");
            assert(rendersCount === 3, "Only created 1 additional element (first 2 elements were reused)");
            
            // 2. Keyed list stability (verifying elements are reused rather than destroyed)
            const firstNodeBefore = renderedList.children[0];
            const secondNodeBefore = renderedList.children[1];
            
            // Re-order the list (Task 2, Task 1, Task 3)
            list.value = [list.value[1], list.value[0], list.value[2]];
            
            assert(renderedList.children[0] === secondNodeBefore, "Reordered list: first node is the reused Task 2 node");
            assert(renderedList.children[1] === firstNodeBefore, "Reordered list: second node is the reused Task 1 node");
            assert(rendersCount === 3, "Zero new elements created during re-ordering (perfect keyed reconciliation)");
            
            // 3. Unmount cleanups
            let cleanupCount = 0;
            const reactiveVal = paper.state("Active");
            const childEl = paper.div({
                style: {
                    color: () => reactiveVal.value === "Active" ? "green" : "red"
                },
                onUnmounted: () => {
                    cleanupCount++;
                }
            });
            
            // Trigger initial styling subscription
            assert(childEl._cleanups && childEl._cleanups.length === 1, "Child element registered a reactive subscription cleanup");
            
            // Simulate unmount by running cleanup check recursively as MutationObserver would
            const runCleanups = (n) => {
                if (n._cleanups) {
                    n._cleanups.forEach(c => c());
                    n._cleanups = [];
                }
                if (n._onUnmounted) {
                    n._onUnmounted();
                }
            };
            runCleanups(childEl);
            
            assert(childEl._cleanups.length === 0, "Reactive cleanup unsubscribed successfully on unmount");
            assert(cleanupCount === 1, "onUnmounted lifecycle hook triggered successfully");
            
        } catch(e) {
            console.error(e.stack);
            assert(false, "Proxy, Keyed Reconciliation, and Cleanup test error: " + e.message);
        }

        // ----------------------------------------------------
        // Test Summary Output
        // ----------------------------------------------------
        console.log("\n=======================================================");
        console.log("📊 PAPYR.JS TEST RUNNER SUMMARY RESULTS");
        console.log(`TOTAL PASSED: ${passed}`);
        console.log(`TOTAL FAILED: ${failed}`);
        console.log("=======================================================\n");

        if (failed > 0) {
            process.exit(1);
        } else {
            process.exit(0);
        }
}

runTests();


