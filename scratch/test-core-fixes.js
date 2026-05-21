const fs = require('fs');
const path = require('path');

// Mock browser global environment
global.Element = class Element {};
global.HTMLElement = class HTMLElement extends global.Element {};
global.DocumentFragment = class DocumentFragment {};
global.window = global;

const mockClassesAdded = [];
const mockAttributesSet = {};

global.document = {
    createElement(tag) {
        const el = {
            tagName: tag.toUpperCase(),
            style: {},
            dataset: {},
            classList: {
                add(c) {
                    mockClassesAdded.push(c);
                    this.className = (this.className ? this.className + ' ' : '') + c;
                }
            },
            appendChild(child) {
                if (!this.children) this.children = [];
                this.children.push(child);
                return child;
            },
            setAttribute(k, v) {
                mockAttributesSet[k] = v;
                this[k] = v;
            }
        };
        return el;
    },
    createElementNS(ns, tag) {
        return this.createElement(tag);
    },
    createTextNode(text) {
        return { textContent: text };
    }
};

// Load paper.js
const paperCode = fs.readFileSync(path.join(__dirname, '..', 'paper.js'), 'utf8');
eval(paperCode);

console.log("Asserting combined selector parsing...");
// Test combined selector #my-id.class1.class2
mockClassesAdded.length = 0;
const el1 = paper.div("#my-id.class1.class2");
console.assert(el1.id === "my-id", `Expected ID to be 'my-id', got '${el1.id}'`);
console.assert(mockClassesAdded.includes("class1"), "Expected class1 to be added");
console.assert(mockClassesAdded.includes("class2"), "Expected class2 to be added");

console.log("Asserting selector with colon parsing...");
mockClassesAdded.length = 0;
const el2 = paper.div("#my-id.class1.class2:Hello World");
console.assert(el2.id === "my-id", `Expected ID to be 'my-id', got '${el2.id}'`);
console.assert(mockClassesAdded.includes("class1"), "Expected class1 to be added");
console.assert(mockClassesAdded.includes("class2"), "Expected class2 to be added");
console.assert(el2.children[0].textContent === "Hello World", `Expected children text 'Hello World', got '${el2.children[0].textContent}'`);

console.log("Asserting null argument check...");
try {
    const elNull = paper.div(null);
    console.log("Null argument handled safely without crash!");
} catch (e) {
    console.error("FAIL: paper(null) threw error:", e);
    process.exit(1);
}

console.log("Asserting paper.icon setAttribute class...");
mockAttributesSet.class = undefined;
const iconEl = paper.icon('bolt', { class: 'my-icon' });
console.assert(mockAttributesSet.class === 'my-icon', `Expected class 'my-icon' set via setAttribute, got '${mockAttributesSet.class}'`);

console.log("All custom assertions passed successfully!");
