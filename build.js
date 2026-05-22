const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const coreFiles = [
    'core/papyr-core.js',
    'core/security.js',
    'core/reactivity.js',
    'core/router.js',
    'core/math.js',
    'core/db.js',
    'core/orm.js',
    'core/auth.js',
    'core/api.js',
    'core/debug.js'
];
const pluginFiles = [
    'plugins/official.js',
    'plugins/animate.js',
    'plugins/charts.js',
    'plugins/browser-api.js',
    'plugins/pwa.js',
    'plugins/design.js',
    'plugins/particles.js',
    'plugins/ui-components.js',
    'plugins/watt.js',
    'plugins/layout.js'
];
const stylesFile = 'styles/complete.css';

console.log("🚀 Starting Papyr.js compiler...");

const hrstart = process.hrtime();

try {
    // 1. Load core files contents
    const coreContents = coreFiles.map(file => {
        const filePath = path.join(srcDir, file);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Core source file not found: ${filePath}`);
        }
        return `// --- MODULE: ${file} ---\n` + fs.readFileSync(filePath, 'utf8') + '\n';
    }).join('\n');

    // 2. Build papyr.js (Core Bundle)
    const paperCode = `/**
 * PAPER STATIC SITE LIBRARY - Core Bundle
 * v3.0 - Agile Modular Architecture (Reactivity, Hash SPA Router, Math Logic, Persistent CRUD Store)
 * Released under MIT License.
 */

(function(window) {
    let activeEffect = null;
    let isDebug = false;

${coreContents}

})(typeof window !== 'undefined' ? window : this);
`;

    fs.writeFileSync(path.join(__dirname, 'papyr.js'), paperCode, 'utf8');
    console.log("✨ compiled papyr.js successfully!");

    // 3. Load official plugins & widgets
    const pluginsContent = pluginFiles.map(file => {
        const filePath = path.join(srcDir, file);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Plugins source file not found: ${filePath}`);
        }
        return `// --- MODULE: ${file} ---\n` + fs.readFileSync(filePath, 'utf8') + '\n';
    }).join('\n');

    // 4. Load styled CSS variable rules
    const stylesPath = path.join(srcDir, stylesFile);
    if (!fs.existsSync(stylesPath)) {
        throw new Error(`CSS source file not found: ${stylesPath}`);
    }
    const stylesContent = fs.readFileSync(stylesPath, 'utf8').trim();

    // 5. Build papyr-complete.js (Complete Showcase Bundle)
    const paperCompleteCode = `/**
 * PAPER STATIC SITE LIBRARY - Complete Showcase Bundle
 * v3.0 - Core Reactivity, SPA Routing, Reactive Math Logic, Persistent Local CRUD Database, Responsive Widgets
 * Released under MIT License.
 */

(function(window) {
    let activeEffect = null;
    let isDebug = false;

${coreContents}

${pluginsContent}

    // Auto-inject Themeable Stylesheets
    if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.id = 'papyr-complete-styles';
        style.textContent = \`
${stylesContent.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}
\`;
        document.head.appendChild(style);
        console.log("📄 Papyr Complete styling successfully injected.");
    }

})(typeof window !== 'undefined' ? window : this);
`;

    fs.writeFileSync(path.join(__dirname, 'papyr-complete.js'), paperCompleteCode, 'utf8');
    console.log("✨ compiled papyr-complete.js successfully!");

    const hrend = process.hrtime(hrstart);
    const ms = (hrend[0] * 1000 + hrend[1] / 1000000).toFixed(2);
    console.log(`\n🎉 Compilation finished successfully in ${ms}ms!`);

} catch (err) {
    console.error("❌ Build compilation failed!", err);
    process.exit(1);
}
