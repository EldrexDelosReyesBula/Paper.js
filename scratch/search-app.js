const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');
const lines = content.split('\n');

console.log("Searching for CATALOG_ITEMS in app.js...");
let found = -1;
lines.forEach((line, idx) => {
    if (line.includes('const CATALOG_ITEMS =')) {
        found = idx;
    }
});

if (found !== -1) {
    console.log(`Found CATALOG_ITEMS at line ${found + 1}. Printing next 50 lines:`);
    for (let i = found; i < Math.min(found + 150, lines.length); i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }
} else {
    console.log("CATALOG_ITEMS not found!");
}
