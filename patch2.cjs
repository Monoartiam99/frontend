const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove BlueprintSvg function
content = content.replace(/function BlueprintSvg\(\) \{[\s\S]*?<\/svg>\s*\n\s*\}/g, '');

// Remove CadModelSvg function
content = content.replace(/function CadModelSvg\(\{ dark = false \}: \{ dark\?: boolean \}\) \{[\s\S]*?<\/svg>\s*\n\s*\}/g, '');

// Remove PenTool, ShieldCheck, Cpu from lucide-react if they are unused
// (Wait, I'll just let TypeScript tell me if there are more errors, but this will fix BlueprintSvg and CadModelSvg)

fs.writeFileSync('src/App.tsx', content);
