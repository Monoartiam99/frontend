const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Reverse replacements
content = content.replace(/bg-surface-raised(\/\d+)?/g, 'bg-white$1');
content = content.replace(/text-text-primary/g, 'text-slate-950'); // Mostly it was 950 and 900, 950 is close enough
content = content.replace(/text-text-tertiary\/70/g, 'text-slate-400');
content = content.replace(/text-text-tertiary/g, 'text-slate-600');
content = content.replace(/bg-text-secondary text-surface-base/g, 'bg-[#3d6cff] text-white');
content = content.replace(/text-text-secondary/g, 'text-[#3d6cff]');
content = content.replace(/border-surface-strong(\/\d+)?/g, 'border-slate-200$1');
content = content.replace(/bg-surface-base/g, 'bg-slate-950');
content = content.replace(/text-text-inverse/g, 'text-white');

// Case sensitivity back to original for brand
content = content.replace(/beekshan technology/gi, 'Beekshan Technology');

fs.writeFileSync('src/App.tsx', content);
