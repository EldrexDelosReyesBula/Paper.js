const fs = require('fs');
const path = require('path');

const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

// Find all string literals in app.js
// We can use a regex to find strings
const strings = [];
const doubleQuotes = appCode.match(/"[^"\\]*(?:\\.[^"\\]*)*"/g) || [];
const singleQuotes = appCode.match(/'[^'\\]*(?:\\.[^'\\]*)*'/g) || [];
const backticks = appCode.match(/`[^`\\]*(?:\\.[^`\\]*)*`/g) || [];

allStrings = [...doubleQuotes, ...singleQuotes, ...backticks].map(s => s.slice(1, -1));

console.log("Analyzing strings with colons in app.js:");
allStrings.forEach(str => {
    if (str.includes(':') && !str.startsWith('http://') && !str.startsWith('https://')) {
        let startsWithDot = str.startsWith('.');
        let startsWithHash = str.startsWith('#');
        let colonIdx = str.indexOf(':');
        let t = str.substring(0, colonIdx);
        let c = str.substring(colonIdx + 1);
        console.log(`String: "${str}" | startsWithDot: ${startsWithDot} | startsWithHash: ${startsWithHash} | tag: "${t}" | content: "${c}"`);
    }
});
