const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="hero-stage">[\s\S]*?<div className="hero-shadow" \/>\s*<\/div>/;

const replacement = `<div className="relative w-full max-w-[650px] aspect-[4/3] flex items-center justify-center">
              <div className="hero-glow absolute inset-0 z-0" />
              <img src="/dashboard-mockup.png" alt="Beekshan Technology Dashboard" className="laptop-layer absolute z-10 w-[110%] h-auto drop-shadow-2xl translate-x-12 translate-y-8" />
              <div className="absolute inset-[-30%] z-20 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <HeroModel />
                </Canvas>
              </div>
              <div className="hero-shadow absolute -bottom-10 left-[10%] w-[80%] h-8 z-0" />
            </div>`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
