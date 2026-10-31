# Beekshan Technology - Complete Setup Guide

## Overview
Beekshan Technology is a full-stack application that converts engineering drawings into 3D CAD models using AI and CAD generation.

## Architecture
- **Frontend**: React + TypeScript + Three.js
- **Backend**: Python FastAPI + OpenCV + Tesseract OCR + CadQuery
- **Pipeline**: Upload → Segment → OCR → Extract Data → Generate CAD → Preview

## Prerequisites

### For Frontend
- Node.js 18+ and npm
- Modern web browser

### For Backend
- Python 3.8+
- Tesseract OCR (must be installed separately)

## Installation Steps

### 1. Install Tesseract OCR

**Windows:**
1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to: `C:\Program Files\Tesseract-OCR`
3. **IMPORTANT**: Uncomment line 38 in `backend/main.py` and set the path:
   ```python
   pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
   ```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

**Mac:**
```bash
brew install tesseract
```

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies

```bash
cd ..
npm install
```

## Running the Application

### Step 1: Start the Backend Server

Open a terminal in the project root:

```bash
cd backend
python main.py
```

The backend will start on `http://localhost:8000`

You should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Start the Frontend Development Server

Open a new terminal in the project root:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or the port shown in terminal)

## Testing the Pipeline

1. Open your browser to `http://localhost:5173`
2. Click "Begin a trial" button
3. Upload an engineering drawing image (PNG, JPG, etc.)
4. Click "Process Drawing"
5. Watch the processing steps:
   - Segmenting image into sections...
   - Extracting OCR data...
   - Generating 3D CAD model...
6. View the 3D CAD preview and extracted data

## API Endpoints

### `GET /`
Health check endpoint

### `GET /health`
Detailed health check

### `POST /api/process-drawing`
Main pipeline endpoint
- **Input**: multipart/form-data with `file` field
- **Output**: JSON with segments, OCR data, and CAD model
- **Returns**:
  ```json
  {
    "success": true,
    "segments": {
      "note": "path/to/note.png",
      "part_drawing": "path/to/part_drawing.png",
      "table": "path/to/table.png"
    },
    "ocr_data": {
      "raw_text": "...",
      "parsed_data": {
        "dimensions": [...],
        "angles": [...],
        "materials": [...],
        "profiles": [...],
        "features": [...]
      }
    },
    "cad_model": {
      "stl_path": "path/to/output.stl",
      "stl_base64": "base64_encoded_stl",
      "model_info": {...}
    }
  }
  ```

### `POST /api/segment-only`
Only segment image (for testing)
- **Input**: multipart/form-data with `file` field
- **Output**: JSON with base64-encoded segments

## Troubleshooting

### Backend Issues

**Tesseract not found:**
- Ensure Tesseract is installed
- Check the path in `backend/main.py` line 38
- Test with: `tesseract --version` in terminal

**CadQuery import error:**
- Ensure CadQuery is installed: `pip install cadquery`
- On Windows, you may need to install Visual C++ Redistributable

**Port already in use:**
- Change port in `backend/main.py` line 447:
  ```python
  uvicorn.run(app, host="0.0.0.0", port=8001)  # Change 8000 to 8001
  ```
- Update frontend URL in `src/App.tsx` line 415

### Frontend Issues

**STL loader error:**
- Ensure `three-stdlib` is installed: `npm install three-stdlib`
- Check that the import is correct in `src/CADPreview.tsx`

**CORS error:**
- Ensure backend is running
- Check CORS configuration in `backend/main.py` lines 13-18

**Image upload fails:**
- Check browser console for errors
- Ensure backend is running on port 8000
- Check file size (max 50MB)

## File Structure

```
Beekshan_Technology_2D_3D/
├── backend/
│   ├── main.py              # FastAPI server with full pipeline
│   ├── requirements.txt     # Python dependencies
│   ├── uploads/             # Temporary upload directory
│   ├── processed/           # Processed images
│   └── cad_output/          # Generated CAD files
├── src/
│   ├── App.tsx              # Main React component
│   ├── CADPreview.tsx       # 3D CAD viewer component
│   ├── HeroBuildingAnimation.tsx  # Hero animation
│   └── HeroStage.tsx        # 3D hero visualization
├── public/                  # Static assets
├── package.json             # Node dependencies
└── vite.config.ts           # Vite configuration
```

## Development Notes

### Image Segmentation
Currently uses simple vertical division (25%/50%/25%). For production, consider:
- Computer vision-based detection
- Machine learning segmentation
- Edge detection algorithms

### OCR Configuration
Tesseract is configured with `--psm 6` (single column block of text). For different drawing types, you may need to adjust:
- Page segmentation modes
- Character whitelist/blacklist
- Language data

### CAD Generation
Currently supports:
- ISMC channels
- ISA/Angle profiles
- Simple boxes as placeholders

To add more profile types, extend the `CADGenerator` class in `backend/main.py`.

## Production Deployment

### Backend
- Use Gunicorn or uWSGI instead of Uvicorn
- Add authentication
- Implement rate limiting
- Use a proper file storage (S3, etc.)
- Add database for job tracking

### Frontend
- Build with `npm run build`
- Serve with Nginx or similar
- Add environment variables for API URL
- Implement proper error handling
- Add loading states and progress indicators

## License
© 2026 Beekshan Technology. All rights reserved.
