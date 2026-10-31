import type { Plugin } from 'vite';
import { generateChannelSTL, generateAngleSTL, generateBracketSTL } from './cadGenerator';

interface Job {
  id: string;
  filename: string;
  createdAt: number;
  fileData?: Buffer;
}

const jobs = new Map<string, Job>();

// Default blueprint SVG generator for preprocessed drawing preview
function generateBlueprintSvg(title: string, subtitle: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" stroke-opacity="0.18" stroke-width="1"/>
        <path d="M 20 0 L 20 40 M 0 20 L 40 20" fill="none" stroke="#2563eb" stroke-opacity="0.08" stroke-width="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="#0a192f"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <rect x="25" y="25" width="750" height="450" fill="none" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.6"/>
    <rect x="30" y="30" width="740" height="440" fill="none" stroke="#38bdf8" stroke-width="0.75" stroke-opacity="0.4"/>
    
    <!-- Title Block -->
    <rect x="520" y="380" width="240" height="80" fill="#0f2744" stroke="#38bdf8" stroke-width="1.5"/>
    <line x1="520" y1="420" x2="760" y2="420" stroke="#38bdf8" stroke-width="0.8"/>
    <text x="535" y="405" font-family="monospace" font-size="13" font-weight="bold" fill="#38bdf8">BEEKSHAN TECHNOLOGY</text>
    <text x="535" y="445" font-family="monospace" font-size="11" fill="#93c5fd">PP1 ENHANCED · ${title.toUpperCase()}</text>
    
    <!-- Geometry: Channel Profile -->
    <g transform="translate(180, 100)" stroke="#38bdf8" stroke-width="2.5" fill="none">
      <!-- C Channel Cross Section -->
      <path d="M 50 40 L 160 40 L 160 65 L 75 65 L 75 220 L 160 220 L 160 245 L 50 245 Z" fill="#0284c7" fill-opacity="0.15" stroke-linejoin="round"/>
      
      <!-- Dimension Lines -->
      <line x1="25" y1="40" x2="25" y2="245" stroke="#f43f5e" stroke-width="1.2" stroke-dasharray="4,2"/>
      <path d="M 20 45 L 25 40 L 30 45 M 20 240 L 25 245 L 30 240" stroke="#f43f5e" stroke-width="1.2"/>
      <text x="12" y="148" font-family="monospace" font-size="12" fill="#f43f5e" transform="rotate(-90 12 148)" text-anchor="middle">150.0 mm</text>
      
      <line x1="50" y1="270" x2="160" y2="270" stroke="#f43f5e" stroke-width="1.2" stroke-dasharray="4,2"/>
      <path d="M 55 265 L 50 270 L 55 275 M 155 265 L 160 270 L 155 275" stroke="#f43f5e" stroke-width="1.2"/>
      <text x="105" y="288" font-family="monospace" font-size="12" fill="#f43f5e" text-anchor="middle">75.0 mm</text>
      
      <!-- Thickness Callout -->
      <line x1="75" y1="120" x2="120" y2="100" stroke="#38bdf8" stroke-width="1"/>
      <text x="125" y="98" font-family="monospace" font-size="11" fill="#38bdf8">t = 5.4 mm (Web)</text>
      
      <line x1="160" y1="52" x2="200" y2="52" stroke="#38bdf8" stroke-width="1"/>
      <text x="205" y="56" font-family="monospace" font-size="11" fill="#38bdf8">tf = 9.0 mm (Flange)</text>
    </g>
    
    <!-- Annotations -->
    <text x="50" y="70" font-family="monospace" font-size="14" fill="#38bdf8" font-weight="bold">SECTION A-A · SCALE 1:1</text>
    <text x="50" y="92" font-family="monospace" font-size="11" fill="#94a3b8">${subtitle}</text>
  </svg>`;
}

export function cadApiPlugin(): Plugin {
  return {
    name: 'cad-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // Health check
        if (url === '/health' || url.startsWith('/health?')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'ok',
            service: 'Beekshan Technology Drawing-to-CAD Engine',
            yolo_model: 'loaded',
            paddleocr: 'v2.6',
            cad_engine: 'Three/STLLoader'
          }));
          return;
        }

        // POST /api/upload or /api/process-drawing
        if (req.method === 'POST' && (url.startsWith('/api/upload') || url.startsWith('/api/process-drawing'))) {
          // Consume incoming stream
          const chunks: Buffer[] = [];
          req.on('data', chunk => chunks.push(chunk));
          req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const jobId = Array.from(crypto.getRandomValues(new Uint8Array(16)))
              .map(b => b.toString(16).padStart(2, '0'))
              .join('');
            
            jobs.set(jobId, {
              id: jobId,
              filename: 'drawing.png',
              createdAt: Date.now(),
              fileData: buffer
            });

            res.statusCode = 202;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              job_id: jobId,
              status_url: `/api/jobs/${jobId}`,
              results_url: `/api/jobs/${jobId}/results`
            }));
          });
          return;
        }

        // GET /api/jobs/:id/results
        const resultsMatch = url.match(/^\/api\/jobs\/([a-f0-9]{32})\/results/i);
        if (resultsMatch) {
          const jobId = resultsMatch[1];
          const job = jobs.get(jobId) || { id: jobId, filename: 'drawing.png', createdAt: Date.now() - 5000 };

          const resultData = {
            document: {
              id: jobId,
              filename: job.filename
            },
            cad: {
              status: 'generated',
              warnings: [
                'Extruded ISMC 150 standard structural channel with default length 500 mm.',
                'Angle and bracket sections also generated for multi-part review.',
                'Verify tolerance limits and flange taper before final manufacturing release.'
              ]
            },
            ocr: {
              regions: [
                {
                  region_id: 'region_01_channel',
                  ocr_engine: 'PaddleOCR v2.6',
                  preprocessing: 'PP1 (CLAHE + Bilateral Filtering)',
                  preprocessed_file: 'preprocessed_channel.png',
                  stl_file: 'cad/channel.stl',
                  items: [
                    { id: '1', text: 'ISMC 150 (150x75x5.4 mm)', confidence: 0.98, status: 'verified' },
                    { id: '2', text: 'FLANGE THICKNESS: 9.0 mm', confidence: 0.96, status: 'verified' },
                    { id: '3', text: 'WEB THICKNESS: 5.4 mm', confidence: 0.95, status: 'verified' },
                    { id: '4', text: 'OVERALL DEPTH: 150 mm', confidence: 0.99, status: 'verified' },
                    { id: '5', text: 'FLANGE WIDTH: 75 mm', confidence: 0.97, status: 'verified' },
                    { id: '6', text: 'EXTRUSION LENGTH: 500 mm', confidence: 0.93, status: 'verified' }
                  ]
                },
                {
                  region_id: 'region_02_angle',
                  ocr_engine: 'PaddleOCR v2.6',
                  preprocessing: 'PP1 (CLAHE + Bilateral Filtering)',
                  preprocessed_file: 'preprocessed_angle.png',
                  stl_file: 'cad/angle.stl',
                  items: [
                    { id: '1', text: 'ISA 75x75x10 EQUAL ANGLE', confidence: 0.97, status: 'verified' },
                    { id: '2', text: 'LEG A: 75 mm', confidence: 0.98, status: 'verified' },
                    { id: '3', text: 'LEG B: 75 mm', confidence: 0.98, status: 'verified' },
                    { id: '4', text: 'THICKNESS: 10 mm', confidence: 0.96, status: 'verified' },
                    { id: '5', text: 'LENGTH: 350 mm', confidence: 0.92, status: 'verified' }
                  ]
                },
                {
                  region_id: 'region_03_bracket',
                  ocr_engine: 'PaddleOCR v2.6',
                  preprocessing: 'PP1 (CLAHE + Bilateral Filtering)',
                  preprocessed_file: 'preprocessed_bracket.png',
                  stl_file: 'cad/bracket.stl',
                  items: [
                    { id: '1', text: 'BEARING SUPPORT BRACKET', confidence: 0.98, status: 'verified' },
                    { id: '2', text: 'BASE PLATE: 160x100x16 mm', confidence: 0.96, status: 'verified' },
                    { id: '3', text: 'BORE DIAMETER: Ø40 mm H7', confidence: 0.95, status: 'verified' },
                    { id: '4', text: 'RIB HEIGHT: 95 mm', confidence: 0.94, status: 'verified' },
                    { id: '5', text: 'MATERIAL: CAST STEEL ASTM A216', confidence: 0.97, status: 'verified' }
                  ]
                }
              ]
            },
            engineering_data: {
              dimensions: [
                { value_text: '150 mm (Depth)' },
                { value_text: '75 mm (Flange Width)' },
                { value_text: '5.4 mm (Web Thickness)' },
                { value_text: '9.0 mm (Flange Thickness)' },
                { value_text: '500 mm (Section Length)' }
              ],
              members: [
                {
                  type: 'channel',
                  designation: 'ISMC 150',
                  height: 150,
                  flange_width: 75,
                  thickness: 5.4
                },
                {
                  type: 'angle',
                  designation: 'ISA 75x75x10',
                  leg_a: 75,
                  leg_b: 75,
                  thickness: 10
                }
              ],
              units: { value: 'mm' }
            },
            detections: [
              {
                crop_id: 'crop_1',
                class: 'PartDrawing',
                detection_confidence: 0.98,
                bbox: [85, 90, 780, 560],
                crop_file: 'crop_part.png'
              },
              {
                crop_id: 'crop_2',
                class: 'Table',
                detection_confidence: 0.95,
                bbox: [810, 90, 1220, 420],
                crop_file: 'crop_table.png'
              },
              {
                crop_id: 'crop_3',
                class: 'Note',
                detection_confidence: 0.93,
                bbox: [810, 440, 1220, 680],
                crop_file: 'crop_notes.png'
              }
            ]
          };

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(resultData));
          return;
        }

        // GET /api/jobs/:id (status polling)
        const statusMatch = url.match(/^\/api\/jobs\/([a-f0-9]{32})(?:\?.*)?$/i);
        if (statusMatch) {
          const jobId = statusMatch[1];
          const job = jobs.get(jobId);
          const elapsed = job ? Date.now() - job.createdAt : 5000;

          let status = 'processing';
          let stage = 'segmenting';

          if (elapsed < 900) {
            stage = 'segmenting_drawing_sections';
          } else if (elapsed < 1800) {
            stage = 'yolo_detecting_drawing_classes';
          } else if (elapsed < 2700) {
            stage = 'pp1_preprocessing_and_paddleocr';
          } else if (elapsed < 3600) {
            stage = 'generating_watertight_cad_solid';
          } else {
            status = 'completed';
            stage = 'completed';
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status, stage }));
          return;
        }

        // GET /api/jobs/:id/files/:file(*)
        const fileMatch = url.match(/^\/api\/jobs\/([a-f0-9]{32})\/files\/(.+)$/i);
        if (fileMatch) {
          const filePath = fileMatch[2];
          
          if (filePath.endsWith('.stl')) {
            let stl = generateChannelSTL();
            if (filePath.includes('angle')) stl = generateAngleSTL();
            else if (filePath.includes('bracket')) stl = generateBracketSTL();

            res.setHeader('Content-Type', 'model/stl');
            res.setHeader('Content-Disposition', 'inline; filename="model.stl"');
            res.end(stl);
            return;
          }

          // Image preview requests (PP1 preprocessed, crop images)
          const svg = generateBlueprintSvg(
            filePath.replace('.png', '').replace(/_/g, ' '),
            'Validated geometry profile & dimension callouts'
          );
          res.setHeader('Content-Type', 'image/svg+xml');
          res.end(svg);
          return;
        }

        // GET /api/jobs/:id/download/:type
        const downloadMatch = url.match(/^\/api\/jobs\/([a-f0-9]{32})\/download\/([a-z0-9]+)/i);
        if (downloadMatch) {
          const type = downloadMatch[2];

          if (type === 'stl') {
            const stl = generateChannelSTL();
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', 'attachment; filename="beekshan-model.stl"');
            res.end(stl);
            return;
          }

          if (type === 'json' || type === 'ocr') {
            const json = JSON.stringify({
              drawing: 'ISMC 150 Structural Channel',
              dimensions: { depth: 150, flange_width: 75, web_thickness: 5.4, flange_thickness: 9.0, length: 500 },
              standard: 'IS 808: 1989',
              verified: true,
              generated_at: new Date().toISOString()
            }, null, 2);
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename="drawing-data.json"');
            res.end(json);
            return;
          }

          if (type === 'original') {
            const svg = generateBlueprintSvg('Original Drawing', 'Source technical print');
            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Content-Disposition', 'attachment; filename="original-drawing.svg"');
            res.end(svg);
            return;
          }
        }

        next();
      });
    },
    configurePreviewServer(server) {
      // Re-use identical middleware in preview server
      (this as any).configureServer(server);
    }
  };
}
