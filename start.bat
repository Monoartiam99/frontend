@echo off
echo Starting Beekshan Technology drawing analysis...
echo.
set "BACKEND_VENV=%LOCALAPPDATA%\Beekshan Technology\backend-venv"
if not exist "%BACKEND_VENV%\Scripts\python.exe" (
  if not exist "%LOCALAPPDATA%\Beekshan Technology" mkdir "%LOCALAPPDATA%\Beekshan Technology"
  python -m venv "%BACKEND_VENV%"
  if errorlevel 1 (
    echo Could not create the backend Python environment. Install 64-bit Python 3.10-3.12 and retry.
    pause
    exit /b 1
  )
)
"%BACKEND_VENV%\Scripts\python.exe" -c "import paddle" >nul 2>&1
if errorlevel 1 (
  echo Installing CPU PaddlePaddle for the clean Windows setup...
  "%BACKEND_VENV%\Scripts\python.exe" -m pip install paddlepaddle==2.6.2
  if errorlevel 1 (
    echo PaddlePaddle installation failed. Check the network and Python version, then retry.
    pause
    exit /b 1
  )
)
"%BACKEND_VENV%\Scripts\python.exe" -c "from paddleocr import PaddleOCR; import skimage, imgaug" >nul 2>&1
if errorlevel 1 (
  echo Installing backend requirements into %BACKEND_VENV%...
  "%BACKEND_VENV%\Scripts\python.exe" -m pip install -r "%~dp0backend\requirements.txt"
  if errorlevel 1 (
    echo Backend dependency installation failed. Review the pip error above.
    pause
    exit /b 1
  )
)
"%BACKEND_VENV%\Scripts\python.exe" -c "from paddleocr import PaddleOCR; import skimage, imgaug" >nul 2>&1
if errorlevel 1 (
  echo PaddleOCR still cannot start in %BACKEND_VENV%. Check the Python/PaddlePaddle installation error.
  pause
  exit /b 1
)
start "Beekshan Technology Backend" powershell -NoExit -Command "Set-Location '%~dp0backend'; & '%BACKEND_VENV%\Scripts\python.exe' main.py"
start "Beekshan Technology Frontend" powershell -NoExit -Command "Set-Location '%~dp0'; npm.cmd run dev"
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API docs: http://localhost:8000/docs
