const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Color replacements
content = content.replace(/bg-white(\/\d+)?/g, 'bg-surface-raised$1');
content = content.replace(/text-slate-9[05]0/g, 'text-text-primary');
content = content.replace(/text-slate-[678]00/g, 'text-text-tertiary');
content = content.replace(/text-slate-[45]00/g, 'text-text-tertiary/70');
content = content.replace(/bg-\[#3d6cff\]/g, 'bg-text-secondary text-surface-base');
content = content.replace(/text-\[#3d6cff\]/g, 'text-text-secondary');
content = content.replace(/border-slate-200(\/\d+)?/g, 'border-surface-strong$1');
content = content.replace(/bg-slate-950/g, 'bg-surface-base');
content = content.replace(/text-white/g, 'text-text-inverse');

// Fix any redundant classes like "text-surface-base text-text-inverse" if they appear
content = content.replace(/text-surface-base\s+text-text-inverse/g, 'text-surface-base');

fs.writeFileSync('src/App.tsx', content);
