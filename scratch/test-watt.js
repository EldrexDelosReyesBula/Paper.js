const fs = require('fs');
const path = require('path');

console.log("=========================================");
console.log("🧪 Papyr WATT Privacy Guard Test Suite");
console.log("=========================================");

// Assertion helper
const assert = (condition, message) => {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        process.exit(1);
    }
    console.log(`✅ PASS: ${message}`);
};

// Mock environment
global.Element = class Element {};
global.HTMLElement = class HTMLElement extends global.Element {};
global.DocumentFragment = class DocumentFragment {};
global.window = global;
global.CustomEvent = class CustomEvent {};
global.addEventListener = () => {};
global.dispatchEvent = () => {};
global.requestAnimationFrame = (cb) => cb();
global.MutationObserver = class MutationObserver {
    observe() {}
    disconnect() {}
};

let localStoreMock = {};
global.localStorage = {
    getItem(key) { return localStoreMock[key] !== undefined ? localStoreMock[key] : null; },
    setItem(key, val) { localStoreMock[key] = String(val); },
    removeItem(key) { delete localStoreMock[key]; },
    key(i) { return Object.keys(localStoreMock)[i] || null; },
    get length() { return Object.keys(localStoreMock).length; },
    clear() { localStoreMock = {}; }
};

let scriptElementsCreated = [];
const originalCreateElement = (tag) => {
    const el = {
        tagName: tag.toUpperCase(),
        style: {},
        dataset: {},
        attributes: {},
        setAttribute(k, v) { 
            this.attributes[k] = v;
            let desc = Object.getOwnPropertyDescriptor(this, k);
            if (!desc || !desc.set) {
                this[k] = v;
            }
        },
        getAttribute(k) {
            return this.attributes[k] || null;
        },
        removeAttribute(k) { 
            delete this.attributes[k];
            delete this[k];
        },
        classList: {
            add() {},
            remove() {}
        },
        appendChild(child) {
            if (!this.children) this.children = [];
            this.children.push(child);
            return child;
        },
        remove() {
            if (this.parentNode && this.parentNode.children) {
                this.parentNode.children = this.parentNode.children.filter(c => c !== this);
            }
        }
    };
    if (tag.toLowerCase() === 'script') {
        scriptElementsCreated.push(el);
    }
    return el;
};

global.document = {
    createElement: originalCreateElement,
    createTextNode(text) {
        return { textContent: text };
    },
    body: {
        appendChild(child) {
            child.parentNode = this;
            if (!this.children) this.children = [];
            this.children.push(child);
            return child;
        },
        children: []
    },
    head: {
        appendChild(child) {}
    }
};

// Mock browser confirm to test fallbacks
global.confirm = () => true;

// Load papyr-complete
const papyrCompleteCode = fs.readFileSync(path.resolve(__dirname, '../papyr-complete.js'), 'utf8');
eval(papyrCompleteCode);

// Verification tests

// 1. Verify WATT API and Security core are loaded
assert(typeof papyr.security !== 'undefined', "papyr.security namespace exists");
assert(typeof papyr.watt !== 'undefined', "papyr.watt plugin namespace exists");
assert(papyr.watt.getTier() === 'default', "Initial privacy tier is 'default'");
assert(papyr.watt.hasConsent() === false, "Initial consent is false");

// 2. Storage Sandboxing Tests
console.log("\n--- Testing Storage Sandboxing ---");

// Test normal storage key writes under default/no-consent
localStorage.setItem('user_theme', 'dark');
assert(localStorage.getItem('user_theme') === 'dark', "Standard key 'user_theme' is persisted directly to localStorage");
assert(localStoreMock['user_theme'] === 'dark', "Standard key is in real localStorage object");

// Test tracking key sandboxing under default/no-consent
localStorage.setItem('_ga_tracking_id', 'GA12345');
assert(localStorage.getItem('_ga_tracking_id') === 'GA12345', "Tracking key '_ga_tracking_id' is accessible via sandboxed storage");
assert(localStoreMock['_ga_tracking_id'] === undefined, "Tracking key is NOT stored in real localStorage (sandboxed!)");

// Allow consent and verify that sandboxed storage is flushed to real storage
papyr.watt.setTier('default');
papyr.security.setConsent(true);
assert(papyr.watt.hasConsent() === true, "Consent is now true");
assert(localStoreMock['_ga_tracking_id'] === 'GA12345', "Sandboxed tracking key flushed successfully to real localStorage");

// Opt out of consent and verify tracking key is removed from real localStorage
papyr.security.setConsent(false);
assert(papyr.watt.hasConsent() === false, "Consent is back to false");
assert(localStoreMock['_ga_tracking_id'] === undefined, "Tracking key cleared from real localStorage upon opting out");

// Clear localStoreMock for next tier testing
localStorage.clear();

// Test 'high' tier sandboxing (all storage keys are sandboxed!)
papyr.watt.setTier('high');
assert(papyr.watt.getTier() === 'high', "Tier successfully changed to 'high'");
localStorage.setItem('any_key', 'some_val');
assert(localStorage.getItem('any_key') === 'some_val', "Sandboxed key is retrieved correctly in high tier");
assert(localStoreMock['any_key'] === undefined, "In 'high' tier, every key is sandboxed from real localStorage");

// Test 'none' tier (sandboxing bypassed)
papyr.watt.setTier('none');
localStorage.setItem('tracking_id', '123456');
assert(localStoreMock['tracking_id'] === '123456', "In 'none' tier, tracking keys bypass sandbox and write directly to real localStorage");

// 3. Script Interception Tests
console.log("\n--- Testing Script Interception ---");

// Reset script tracking and change tier back to high
scriptElementsCreated = [];
papyr.watt.setTier('high');

// Try creating standard script via document.createElement
let standardScript = document.createElement('script');
standardScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
assert(standardScript.src === 'https://code.jquery.com/jquery-3.6.0.min.js', "Standard script src set successfully in 'high' tier");

// Try creating tracking script via document.createElement
let trackingScript = document.createElement('script');
trackingScript.src = 'https://www.google-analytics.com/analytics.js';
assert(trackingScript.src === null || trackingScript.src === undefined, "Tracking script src is BLOCKED in 'high' tier");

// Try creating tracking script using setAttribute
let trackingScript2 = document.createElement('script');
trackingScript2.setAttribute('src', 'https://connect.facebook.net/en_US/fbevents.js');
assert(trackingScript2.getAttribute('src') === null || trackingScript2.getAttribute('src') === undefined, "Tracking script setAttribute is BLOCKED in 'high' tier");

// Try creating script via Papyr compiler
let papyrTrackingScript = papyr('script', { src: 'https://doubleclick.net/tracker.js' });
assert(papyrTrackingScript.src === null || papyrTrackingScript.src === undefined, "Compiler blocked tracking script creation");

let papyrSafeScript = papyr('script', { src: 'https://example.com/app.js' });
assert(papyrSafeScript.src === 'https://example.com/app.js', "Compiler allowed safe script creation");

// Test 'none' tier allows trackers
papyr.watt.setTier('none');
let trackerUnderNone = document.createElement('script');
trackerUnderNone.src = 'https://google-analytics.com/analytics.js';
assert(trackerUnderNone.src === 'https://google-analytics.com/analytics.js', "In 'none' tier, tracking scripts are allowed");

console.log("\n🎉 WATT Privacy Guard tests completed successfully! 100% PASS.");
process.exit(0);
