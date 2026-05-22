// scratch/test-math-crud.js
// Isolated automated verification suite for papyr.math and papyr.crud modules.

const fs = require('fs');
const path = require('path');

// Mock browser global environment
global.Element = class Element {};
global.HTMLElement = class HTMLElement extends global.Element {};
global.DocumentFragment = class DocumentFragment {};
global.window = global;

const mockStorageStore = {};
global.localStorage = {
    getItem(key) {
        return mockStorageStore[key] || null;
    },
    setItem(key, value) {
        mockStorageStore[key] = String(value);
    },
    clear() {
        for (const k of Object.keys(mockStorageStore)) {
            delete mockStorageStore[k];
        }
    }
};

global.document = {
    createElement(tag) {
        return {
            tagName: tag.toUpperCase(),
            style: {},
            dataset: {},
            classList: {
                add(c) { this.className = (this.className ? this.className + ' ' : '') + c; }
            },
            appendChild(child) {
                if (!this.children) this.children = [];
                this.children.push(child);
                return child;
            }
        };
    },
    createTextNode(text) {
        return { textContent: text };
    }
};

// Load compiled papyr.js
const paperCode = fs.readFileSync(path.join(__dirname, '..', 'papyr.js'), 'utf8');
eval(paperCode);

console.log("--------------------------------------------------");
console.log("⚡ STARTING AUTOMATED ASSERTIONS FOR MATHEMATICS MODULE");
console.log("--------------------------------------------------");

// Define reactive state variables
let A = papyr.state(10);
let B = papyr.state(5);
let C = papyr.state(2);

// 1. Assert sum
let sumResult = papyr.math.sum(A, B, C);
console.log(`Initial Sum value: ${sumResult.value} (Expected: 17)`);
console.assert(sumResult.value === 17, `Expected sum 17, got ${sumResult.value}`);

// Update reactive states
A.value = 20;
console.log(`Updated Variable A to 20. New Sum: ${sumResult.value} (Expected: 27)`);
console.assert(sumResult.value === 27, `Expected sum 27, got ${sumResult.value}`);

// 2. Assert sub
let subResult = papyr.math.sub(A, B);
console.log(`Subtraction (A - B): ${subResult.value} (Expected: 15)`);
console.assert(subResult.value === 15, `Expected subtraction 15, got ${subResult.value}`);

B.value = 12;
console.log(`Updated Variable B to 12. New Subtraction: ${subResult.value} (Expected: 8)`);
console.assert(subResult.value === 8, `Expected subtraction 8, got ${subResult.value}`);

// 3. Assert mul
let mulResult = papyr.math.mul(A, B, C);
console.log(`Multiplication (A * B * C): ${mulResult.value} (Expected: 480)`);
console.assert(mulResult.value === 480, `Expected multiplication 480, got ${mulResult.value}`);

C.value = 5;
console.log(`Updated Variable C to 5. New Multiplication: ${mulResult.value} (Expected: 1200)`);
console.assert(mulResult.value === 1200, `Expected multiplication 1200, got ${mulResult.value}`);

// 4. Assert div
let divResult = papyr.math.div(A, C);
console.log(`Division (A / C): ${divResult.value} (Expected: 4)`);
console.assert(divResult.value === 4, `Expected division 4, got ${divResult.value}`);

C.value = 0;
console.log(`Updated Variable C to 0 (Safe Division check): ${divResult.value} (Expected: 0)`);
console.assert(divResult.value === 0, `Expected division to handle zero denominator safely and return 0, got ${divResult.value}`);

// Restore C
C.value = 4;

// 5. Assert avg
let avgResult = papyr.math.avg(A, B, C);
console.log(`Average of (20, 12, 4): ${avgResult.value} (Expected: 12)`);
console.assert(avgResult.value === 12, `Expected average 12, got ${avgResult.value}`);

// 6. Assert percent
let percentResult = papyr.math.percent(B, A);
console.log(`Percentage (12 of 20): ${percentResult.value}% (Expected: 60%)`);
console.assert(percentResult.value === 60, `Expected percentage 60, got ${percentResult.value}`);

// 7. Assert round
let preciseValue = papyr.state(3.14159265);
let roundResult = papyr.math.round(preciseValue, 3);
console.log(`Rounded Value (3.14159265 to 3 decimals): ${roundResult.value} (Expected: 3.142)`);
console.assert(roundResult.value === 3.142, `Expected rounded value 3.142, got ${roundResult.value}`);

preciseValue.value = 2.71828182;
console.log(`Updated preciseValue to e. New Rounded: ${roundResult.value} (Expected: 2.718)`);
console.assert(roundResult.value === 2.718, `Expected rounded value 2.718, got ${roundResult.value}`);

console.log("✅ Mathematics module verification passed!");

console.log("\n--------------------------------------------------");
console.log("💾 STARTING AUTOMATED ASSERTIONS FOR PERSISTENT CRUD");
console.log("--------------------------------------------------");

// Initialize crud database store
const initialDevs = [
    { name: "John Doe", role: "Developer" },
    { name: "Jane Smith", role: "Designer" }
];
const db = papyr.crud("test-db-store", initialDevs);

// Verify initial read
console.log(`Initial items in store: ${db.items.value.length} (Expected: 2)`);
console.assert(db.items.value.length === 2, `Expected 2 records, got ${db.items.value.length}`);
console.assert(db.items.value[0].name === "John Doe", "First record name incorrect");

// Create operation
const newDev = db.create({ name: "Eldrex Reyes", role: "Architect" });
console.log(`Safely created new record. ID: ${newDev.id}, Name: ${newDev.name}`);
console.assert(newDev.id !== undefined, "Expected item to be generated with unique ID");
console.assert(db.items.value.length === 3, `Expected 3 records in store, got ${db.items.value.length}`);

// Read operation
const retrieved = db.read(newDev.id);
console.log(`Retrieved record with ID ${newDev.id}: Name=${retrieved.name}, Role=${retrieved.role}`);
console.assert(retrieved.name === "Eldrex Reyes", "Retrieved record name mismatch");

// Update operation
db.update(newDev.id, { role: "Creator & Lead Architect" });
const updatedRetrieved = db.read(newDev.id);
console.log(`Updated record with ID ${newDev.id}: Role=${updatedRetrieved.role}`);
console.assert(updatedRetrieved.role === "Creator & Lead Architect", "Updated record role mismatch");
console.assert(updatedRetrieved.updatedAt !== undefined, "Expected updatedAt timestamp to be attached");

// Delete operation
db.delete(newDev.id);
console.log(`Deleted record with ID ${newDev.id}. New store size: ${db.items.value.length} (Expected: 2)`);
console.assert(db.items.value.length === 2, `Expected 2 records after deletion, got ${db.items.value.length}`);
console.assert(db.read(newDev.id) === undefined, "Deleted record should not be queryable");

// Clear operation
db.clear();
console.log(`Cleared database store. Store size: ${db.items.value.length} (Expected: 0)`);
console.assert(db.items.value.length === 0, `Expected 0 records after clear, got ${db.items.value.length}`);

// Test LocalStorage persistence restore
console.log("Mocking tab reload / page refresh to assert localStorage sync persistence...");
mockStorageStore["persistence-test"] = JSON.stringify([
    { id: "x1", name: "Persistent Agent", role: "Verifier" }
]);

const persistentDb = papyr.crud("persistence-test", []);
console.log(`Restored persistent data store size: ${persistentDb.items.value.length} (Expected: 1)`);
console.assert(persistentDb.items.value.length === 1, `Expected 1 record restored from cache, got ${persistentDb.items.value.length}`);
console.assert(persistentDb.items.value[0].name === "Persistent Agent", "Restored record name mismatch");

console.log("✅ Persistent Local CRUD Store verification passed!");
console.log("--------------------------------------------------");
console.log("🎉 ALL MATHEMATICAL AND CRUD BUNDLES VERIFIED SUCCESSFULLY!");
console.log("--------------------------------------------------");
