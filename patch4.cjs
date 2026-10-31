const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/function BlueprintSvg\(\) \{[\s\S]*?\}\s*\n/g, '');

fs.writeFileSync('src/App.tsx', content);
