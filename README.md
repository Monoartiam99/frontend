# Beekshan Technology Drawing Analysis

Engineering drawing upload and analysis application. The repository includes a React 19 + TypeScript + Vite frontend and a FastAPI backend. The browser uploads an image, polls a background job, displays traced OCR/detection output, and downloads the saved JSON, processed image, and CAD exports where a supported geometry is explicitly evidenced.

## Processing architecture

`src/App.tsx` owns the upload/result flow. `src/CADPreview.tsx` loads backend STL output in Three.js with orbit controls. `backend/main.py` exposes the job API, and `backend/pipeline.py` contains image processing, model loaders, OCR parsing, engineering schema construction, and CAD export.

```text
image upload -> image validation -> large/long heuristic -> YOLO regions if needed
              -> PP1 per image/crop -> PaddleOCR on PP1 output -> versioned JSON
              -> conservative CAD decision -> STEP/STL when explicitly supported
```

Every job is isolated under `backend/data/jobs/<job_id>/`: original, crops, PP1 images, engineering result, CAD, and metadata. Uploaded names are reduced to a basename; stored source names are generated. Unsupported image formats and oversized files are rejected. YOLO/PaddleOCR are initialized once per backend process and reused.

## Models and accuracy

The existing `best.pt` is configured by `MODEL_PATH` and is reused; the backend does not fetch replacement weights. For multi-region/long images, YOLO detections retain model class, class ID, confidence, and pixel bounding box. If weights or inference fail, the full image continues through PP1/OCR and the warning is included in the result. Single images bypass YOLO. No arbitrary grid regions are fabricated.

PP1 follows the existing notebook implementation in `untitled0.py`: grayscale, cubic upscaling (up to 3x, memory capped), FastNlMeansDenoising (`h=5`), CLAHE (`clipLimit=2.0`, `tileGridSize=12x12`), and mild unsharp weighting (1.35 / -0.35). The original is retained, and OCR runs only on the saved PP1 output.

OCR text, confidence, and bounding boxes are preserved. Automatic previews support clearly labeled rectangular blocks and recognized ISMC/SMC channel plus ISA angle section designations. The section preview exports an STL for the website's interactive viewer and Blender. Since a section view does not specify member length or fully resolve assembly placement, the default 500 mm length and placement assumptions are stored in the JSON and displayed beside the preview. Treat it as a visual concept, not a manufacturing-ready model. For the supplied bearing-support bracket drawing, `backend/generate_bracket_mesh.py` remains a separate drawing-specific generator with its own documented assumptions.

## Setup

Use 64-bit Python 3.10–3.12 and Node.js 20.19+ (Vite 8 requirement). On Windows, `start.bat` creates the backend environment outside OneDrive at `%LOCALAPPDATA%\Beekshan Technology\backend-venv`, installs CPU PaddlePaddle 2.6.2 and the backend requirements when needed, checks the PaddleOCR import, then starts both services. Keep the virtual environment outside the synced project folder so OneDrive does not lock Python package files during installation. For a GPU setup, choose the matching PaddlePaddle wheel from the [official Windows installation guide](https://www.paddlepaddle.org.cn/documentation/docs/en/install/pip/windows-pip_en.html) and verify it with `paddle.utils.run_check()`.

```powershell
cd "C:\Users\Admin\OneDrive - West Texmaco\Beekshan_Technology_2D_3D"
npm.cmd install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
.\start.bat
```

If `.env` already exists, keep it and check that `MODEL_PATH` points to the repository's `best.pt`. To install manually, use these commands once:

```powershell
$BackendPython = "$env:LOCALAPPDATA\Beekshan Technology\backend-venv\Scripts\python.exe"
& $BackendPython -m pip install paddlepaddle==2.6.2
& $BackendPython -m pip install -r backend\requirements.txt
```

Then run the backend in one terminal and the frontend in a second terminal:

```powershell
cd backend
& "$env:LOCALAPPDATA\Beekshan Technology\backend-venv\Scripts\python.exe" main.py
```

```powershell
npm.cmd run dev
```

Open `http://localhost:5173`. Check the backend at `http://localhost:8000/health` and API docs at `http://localhost:8000/docs`. The first OCR request may download PaddleOCR model files, so allow network access. Submit a new upload after fixing dependencies; an old job's saved JSON keeps its original failure.

## Configuration

See `.env.example` for `MODEL_PATH`, YOLO confidence/IoU, upload and pixel limits, long-image heuristic, PaddleOCR language, section preview length, API bind/port, frontend CORS origin, and Vite API URL. The backend reads environment variables at process start.

## API

- `GET /health` — service and configured model check
- `POST /api/upload` (also `/api/process-drawing`) — multipart `file`; returns a job ID and status/result URLs (`202`)
- `GET /api/jobs/{id}` — queued, processing, completed, or failed status and current stage
- `GET /api/jobs/{id}/results` — versioned engineering JSON
- `GET /api/jobs/{id}/files/{relative_path}` — job-scoped original, crop, PP1, or CAD file
- `GET /api/jobs/{id}/download/{json|ocr|original|cad|stl}` — downloads an available output

JSON schema version `1.0.0` contains document/image analysis, detections, OCR regions/items with confidence and provenance, engineering data (detected vs uncertain), geometry decision, CAD status/warnings, and validation confidence/missing information.

## Tests and troubleshooting

Run `python -m unittest discover -s tests` from `backend`. The unit tests cover structured dimension parsing, uncertainty handling, conservative CAD refusal, and safe job paths. Model-backed end-to-end processing requires OpenCV, PaddlePaddle/PaddleOCR, Ultralytics-compatible `best.pt`, and CadQuery for export. `GET /health` reports whether the configured weights exist, not whether inference dependencies are installed. A missing YOLO model does not block single-image OCR. If PaddleOCR or image dependencies are missing, the job reports `failed` with the underlying message; install the documented runtime and retry.

The general CAD interpreter does not yet reconstruct arbitrary orthographic projections. It only creates a section preview when OCR recognizes the channel and angle designations; arbitrary drawings still need a supported profile or a more complete geometry reconstruction workflow. The sample bracket generator is drawing-specific and its assumed dimensions are listed in the generated JSON and script. YOLO class names depend on the labels embedded in `best.pt`; verify that model's class map includes `Note`, `PartDrawing`, and `Table` before deployment.
