const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace any double asterisks with single asterisk
content = content.replace(/<span className="text-red-500">\*<\/span>\s*<span className="text-red-500">\*<\/span>/g, '<span className="text-red-500">*</span>');

// Replace instances where we might have text-red-500 * inside label twice somehow
content = content.replace(/(<span className="text-red-500">\*<\/span>)\s*(<span className="text-red-500">\*<\/span>)/g, '$1');

fs.writeFileSync('src/App.tsx', content);
