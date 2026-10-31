// CAD STL Generator for Beekshan Technology
// Generates watertight ASCII STL models for Three.js STLLoader and Blender export

function facet(v1: [number, number, number], v2: [number, number, number], v3: [number, number, number]): string {
  const ax = v2[0] - v1[0], ay = v2[1] - v1[1], az = v2[2] - v1[2];
  const bx = v3[0] - v1[0], by = v3[1] - v1[1], bz = v3[2] - v1[2];
  let nx = ay * bz - az * by;
  let ny = az * bx - ax * bz;
  let nz = ax * by - ay * bx;
  const len = Math.hypot(nx, ny, nz) || 1;
  nx /= len; ny /= len; nz /= len;
  return `  facet normal ${nx.toFixed(4)} ${ny.toFixed(4)} ${nz.toFixed(4)}\n    outer loop\n      vertex ${v1[0].toFixed(3)} ${v1[1].toFixed(3)} ${v1[2].toFixed(3)}\n      vertex ${v2[0].toFixed(3)} ${v2[1].toFixed(3)} ${v2[2].toFixed(3)}\n      vertex ${v3[0].toFixed(3)} ${v3[1].toFixed(3)} ${v3[2].toFixed(3)}\n    endloop\n  endfacet\n`;
}

function quad(v1: [number, number, number], v2: [number, number, number], v3: [number, number, number], v4: [number, number, number]): string {
  return facet(v1, v2, v3) + facet(v1, v3, v4);
}

function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): string {
  let s = '';
  // Bottom (y0)
  s += quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]);
  // Top (y1)
  s += quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]);
  // Front (z1)
  s += quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]);
  // Back (z0)
  s += quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]);
  // Left (x0)
  s += quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]);
  // Right (x1)
  s += quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]);
  return s;
}

// Generate C-Channel (ISMC 150)
export function generateChannelSTL(
  depth = 150,
  width = 75,
  webThick = 5.4,
  flangeThick = 9.0,
  length = 400
): string {
  let s = 'solid ismc_150_structural_channel\n';
  const hw = width / 2;
  const hd = depth / 2;
  const hl = length / 2;

  // Web
  s += box(-hw, -hw + webThick, -hd, hd, -hl, hl);
  // Bottom flange
  s += box(-hw + webThick, hw, -hd, -hd + flangeThick, -hl, hl);
  // Top flange
  s += box(-hw + webThick, hw, hd - flangeThick, hd, -hl, hl);

  // Stiffener gusset in middle
  s += box(-hw + webThick, hw * 0.7, -hd + flangeThick, hd - flangeThick, -3, 3);

  s += 'endsolid ismc_150_structural_channel\n';
  return s;
}

// Generate Equal Angle (ISA 75x75x10)
export function generateAngleSTL(
  legA = 75,
  legB = 75,
  thickness = 10,
  length = 350
): string {
  let s = 'solid isa_75_angle_profile\n';
  const ha = legA / 2;
  const hb = legB / 2;
  const hl = length / 2;

  // Vertical leg
  s += box(-ha, -ha + thickness, -hb, hb, -hl, hl);
  // Horizontal leg
  s += box(-ha + thickness, ha, -hb, -hb + thickness, -hl, hl);

  s += 'endsolid isa_75_angle_profile\n';
  return s;
}

// Generate Bearing Bracket Model
export function generateBracketSTL(): string {
  let s = 'solid bearing_support_bracket\n';

  // Base mounting plate (160 x 100 x 16 mm)
  s += box(-80, 80, 0, 16, -50, 50);

  // Central vertical upright (100 mm wide, 90 mm high, 24 mm thick)
  s += box(-50, 50, 16, 95, -12, 12);

  // Left & right triangular gussets
  s += box(-70, -50, 16, 65, -6, 6);
  s += box(50, 70, 16, 65, -6, 6);

  // Bearing housing cylinder block at top
  const cy = 95;
  const rOuter = 34;
  const rInner = 20;
  const z0 = -22;
  const z1 = 22;
  const segments = 24;

  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI * 2;
    const a2 = ((i + 1) / segments) * Math.PI * 2;
    const cos1 = Math.cos(a1), sin1 = Math.sin(a1);
    const cos2 = Math.cos(a2), sin2 = Math.sin(a2);

    const o1: [number, number, number] = [rOuter * cos1, cy + rOuter * sin1, z1];
    const o2: [number, number, number] = [rOuter * cos2, cy + rOuter * sin2, z1];
    const o3: [number, number, number] = [rOuter * cos2, cy + rOuter * sin2, z0];
    const o4: [number, number, number] = [rOuter * cos1, cy + rOuter * sin1, z0];

    // Outer wall
    s += quad(o1, o2, o3, o4);

    const in1: [number, number, number] = [rInner * cos1, cy + rInner * sin1, z1];
    const in2: [number, number, number] = [rInner * cos2, cy + rInner * sin2, z1];
    const in3: [number, number, number] = [rInner * cos2, cy + rInner * sin2, z0];
    const in4: [number, number, number] = [rInner * cos1, cy + rInner * sin1, z0];

    // Inner bore wall (reversed normal)
    s += quad(in4, in3, in2, in1);

    // Front cap (z1)
    s += quad(in1, in2, o2, o1);
    // Back cap (z0)
    s += quad(o4, o3, in3, in4);
  }

  s += 'endsolid bearing_support_bracket\n';
  return s;
}

export function getPartSTL(index = 0): string {
  switch (index) {
    case 1:
      return generateAngleSTL();
    case 2:
      return generateBracketSTL();
    default:
      return generateChannelSTL();
  }
}
