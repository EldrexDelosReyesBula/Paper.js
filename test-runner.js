// test-runner.js
// A lightweight mocked browser context runner to inspect runtime errors in papyr-complete.js and app.js

const fs = require('fs');
const path = require('path');

// Mock browser global environment
global.Element = class Element {};
global.HTMLElement = class HTMLElement extends global.Element {};
global.DocumentFragment = class DocumentFragment {};
global.window = global;
global.document = {
    createElement(tag) {
        return {
            tagName: tag.toUpperCase(),
            style: {},
            dataset: {},
            getContext() {
                return {
                    clearRect() {},
                    beginPath() {},
                    fill() {},
                    rect() {},
                    fillText() {},
                    arc() {},
                    stroke() {},
                    createLinearGradient() {
                        return { addColorStop() {} };
                    }
                };
            },
            classList: {
                add(c) { this.className = (this.className ? this.className + ' ' : '') + c; },
                remove(c) { this.className = (this.className || '').replace(c, '').trim(); },
                toggle(c, force) { if (force) this.add(c); else this.remove(c); }
            },
            appendChild(child) {
                if (!this.children) this.children = [];
                this.children.push(child);
                child.parentNode = this;
                return child;
            },
            insertBefore(child, reference) {
                if (!this.children) this.children = [];
                this.children.push(child);
                child.parentNode = this;
                return child;
            },
            replaceChild(newChild, oldChild) {
                return newChild;
            },
            addEventListener(event, callback) {
                if (!this.listeners) this.listeners = {};
                this.listeners[event] = callback;
            },
            dispatchEvent(event) {},
            setAttribute(k, v) { this[k] = v; },
            removeAttribute(k) { delete this[k]; },
            cloneNode() { return { ...this }; },
            remove() {
                if (this.parentNode && this.parentNode.children) {
                    this.parentNode.children = this.parentNode.children.filter(c => c !== this);
                }
            }
        };
    },
    createElementNS(ns, tag) {
        return this.createElement(tag);
    },
    createDocumentFragment() {
        return {
            appendChild(child) {
                if (!this.children) this.children = [];
                this.children.push(child);
                child.parentNode = this;
                return child;
            }
        };
    },
    createTextNode(text) {
        return { textContent: text };
    },
    querySelector(sel) {
        if (sel === '#app' || sel === '#router-app-mount' || sel === '#sandbox-preview' || sel === '.preview-container' || sel === '.todo-list') {
            return {
                innerHTML: '',
                appendChild(c) {
                    if (!this.children) this.children = [];
                    this.children.push(c);
                },
                querySelector(s) {
                    return null;
                },
                querySelectorAll() {
                    return [];
                }
            };
        }
        return null;
    },
    querySelectorAll() {
        return [];
    },
    getElementById(id) {
        return {
            value: '',
            style: {},
            appendChild(c) {}
        };
    },
    addEventListener() {},
    head: {
        appendChild(child) {}
    },
    body: {
        appendChild(child) {}
    }
};

global.navigator = {
    clipboard: {
        writeText() { return Promise.resolve(); }
    }
};

global.localStorage = {
    getItem() { return null; },
    setItem() {}
};

global.location = {
    hash: ''
};

global.CustomEvent = class CustomEvent {};
global.addEventListener = () => {};
global.requestAnimationFrame = (cb) => cb();
global.MutationObserver = class MutationObserver {
    observe() {}
    disconnect() {}
};

console.log("Loading papyr-complete.js...");
try {
    const paperCompleteCode = fs.readFileSync(path.join(__dirname, 'papyr-complete.js'), 'utf8');
    eval(paperCompleteCode);
    console.log("papyr-complete.js loaded successfully!");
} catch (e) {
    console.error("Error loading papyr-complete.js:", e);
    process.exit(1);
}

console.log("Loading papyr-plugins.js...");
try {
    const paperPluginsCode = fs.readFileSync(path.join(__dirname, 'papyr-plugins.js'), 'utf8');
    eval(paperPluginsCode);
    console.log("papyr-plugins.js loaded successfully!");
} catch (e) {
    console.error("Error loading papyr-plugins.js:", e);
    process.exit(1);
}

console.log("Loading app.js...");
try {
    const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
    eval(appCode);
    console.log("app.js executed successfully with zero runtime errors!");
} catch (e) {
    console.error("CRITICAL RUNTIME ERROR in app.js:", e);
    process.exit(1);
}
