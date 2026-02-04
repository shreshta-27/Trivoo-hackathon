
const fs = require('fs');
const path = require('path');

const targetDirs = [
    path.join(__dirname, 'backend'),
    path.join(__dirname, 'frontend', 'src')
];

const skipDirs = ['node_modules', '.git', 'dist', 'build', 'coverage'];

function removeComments(content) {
    // 1. Remove block comments /* */
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');

    // 2. Remove line comments //, ensuring we don't break URLs (http://)
    // Detailed regex: 
    // Match (not :) then // then rest of line
    // Capture group 1 is the char before //
    // But this is risky for strings.

    // Safer Approach: Process line by line?
    const lines = content.split('\n');
    const cleanLines = lines.map(line => {
        const timmed = line.trim();
        // If line is ONLY a comment, remove it
        if (timmed.startsWith('//')) return null;

        // If line has a comment at the end...
        // Check for // but skip http:// https://
        // Simple heuristic: if // exists, check previous char
        const idx = line.indexOf('//');
        if (idx !== -1) {
            if (idx > 0 && line[idx - 1] === ':') return line; // http:// case
            // Further checks needed for string quotes... expensive.
            // For safety, we ONLY remove full-line comments or block comments.
            // Removing inline comments blindly often breaks code.
            return line; // Keep inline comments to be safe
        }
        return line;
    });

    // Filter nulls (removed lines)
    return cleanLines.filter(l => l !== null).join('\n');
}

// Improved function that handles code/strings better if needed?
// Let's stick to Block Comments + Full Line Comments for maximum safety.
// User said "remove comments", usually means clutter/TODOs.

function walk(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!skipDirs.includes(item)) {
                walk(fullPath);
            }
        } else if (stat.isFile()) {
            if (item.endsWith('.js') || item.endsWith('.jsx') || item.endsWith('.ts') || item.endsWith('.tsx')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                const clean = removeComments(content);
                // Remove multiple empty lines
                const final = clean.replace(/\n\s*\n\s*\n/g, '\n\n');
                fs.writeFileSync(fullPath, final, 'utf8');
                console.log(`Cleaned: ${fullPath}`);
            }
        }
    });
}

console.log("Starting comment cleanup...");
targetDirs.forEach(d => {
    if (fs.existsSync(d)) walk(d);
});
console.log("Cleanup complete.");
