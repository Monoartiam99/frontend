```python
# ============================================================
# YOLO26 → PP1 → PaddleOCR
# COMPLETE PIPELINE
# ============================================================
#
# INPUT:
#   Long document images
#
# PIPELINE:
#   Long Image
#       ↓
#   YOLO26 Detection
#       ↓
#   Crop detected classes
#       ↓
#   PP1 preprocessing
#       ↓
#   PaddleOCR
#       ↓
#   TXT + JSON OCR results
#
# CLASSES:
#   Note
#   PartDrawing
#   Table
#
# ============================================================


# ============================================================
# 1. INSTALLATION
# ============================================================

!pip install -q ultralytics paddleocr paddlepaddle \
    opencv-python-headless pillow


# ============================================================
# 2. IMPORTS
# ============================================================

import os
import cv2
import json
import shutil
import numpy as np

from PIL import Image
from ultralytics import YOLO
from paddleocr import PaddleOCR


# ============================================================
# 3. PATH CONFIGURATION
# ============================================================

# Your YOLO26 model
MODEL_PATH = "/content/best.pt"

# Folder containing LONG images
INPUT_DIR = "/content/document_dataset/images"

# Main output directory
OUTPUT_ROOT = "/content/document_dataset/yolo26_pp1_paddleocr"

# Create output directory
os.makedirs(OUTPUT_ROOT, exist_ok=True)


# ============================================================
# 4. LOAD YOLO26
# ============================================================

print("=" * 70)
print("LOADING YOLO26")
print("=" * 70)

model = YOLO(MODEL_PATH)

print("YOLO26 model loaded successfully.")


# ============================================================
# 5. LOAD PADDLEOCR
# ============================================================

print("=" * 70)
print("LOADING PADDLEOCR")
print("=" * 70)

paddle_ocr = PaddleOCR(
    lang="en"
)

print("PaddleOCR loaded successfully.")


# ============================================================
# 6. PP1 PREPROCESSING
# ============================================================

def preprocess_pp1(image):
    """
    PP1 preprocessing:

    1. Grayscale
    2. Non-local means denoising
    3. CLAHE local contrast enhancement
    4. Mild sharpening

    Returns:
        processed grayscale image
    """

    # --------------------------------------------------------
    # 1. Grayscale
    # --------------------------------------------------------

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )


    # --------------------------------------------------------
    # 2. Denoising
    # --------------------------------------------------------

    denoised = cv2.fastNlMeansDenoising(
        gray,
        None,
        h=10,
        templateWindowSize=7,
        searchWindowSize=21
    )


    # --------------------------------------------------------
    # 3. CLAHE contrast enhancement
    # --------------------------------------------------------

    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    enhanced = clahe.apply(
        denoised
    )


    # --------------------------------------------------------
    # 4. Mild sharpening
    # --------------------------------------------------------

    blurred = cv2.GaussianBlur(
        enhanced,
        (0, 0),
        1.0
    )

    sharpened = cv2.addWeighted(
        enhanced,
        1.5,
        blurred,
        -0.5,
        0
    )

    return sharpened


# ============================================================
# 7. RUN PADDLEOCR
# ============================================================

def run_paddleocr(image_path):

    """
    Run PaddleOCR on the PP1-preprocessed image.

    Returns a list containing:
        text
        confidence
        bounding box
    """

    results = paddle_ocr.predict(
        image_path
    )

    if not results:
        return []


    result = results[0]


    # --------------------------------------------------------
    # PaddleOCR recognition output
    # --------------------------------------------------------

    texts = result.get(
        "rec_texts",
        []
    )

    scores = result.get(
        "rec_scores",
        []
    )

    boxes = result.get(
        "rec_boxes",
        None
    )


    output = []


    for i, text in enumerate(texts):

        text = str(text).strip()

        if not text:
            continue


        # Confidence
        if i < len(scores):
            confidence = float(
                scores[i]
            )
        else:
            confidence = 0.0


        # Bounding box
        bbox = None

        if boxes is not None and i < len(boxes):

            bbox = np.asarray(
                boxes[i]
            ).tolist()


        output.append({

            "text": text,

            "confidence": confidence,

            "bbox": bbox

        })


    return output


# ============================================================
# 8. SAVE OCR RESULTS
# ============================================================

def save_ocr_results(
    output_dir,
    ocr_results
):

    os.makedirs(
        output_dir,
        exist_ok=True
    )


    # --------------------------------------------------------
    # JSON
    # --------------------------------------------------------

    json_path = os.path.join(
        output_dir,
        "paddle_ocr.json"
    )


    with open(
        json_path,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            ocr_results,
            f,
            indent=2,
            ensure_ascii=False
        )


    # --------------------------------------------------------
    # TXT
    # --------------------------------------------------------

    txt_path = os.path.join(
        output_dir,
        "paddle_ocr.txt"
    )


    with open(
        txt_path,
        "w",
        encoding="utf-8"
    ) as f:

        for item in ocr_results:

            f.write(
                item["text"] + "\n"
            )


    return json_path, txt_path


# ============================================================
# 9. IMAGE EXTENSIONS
# ============================================================

IMAGE_EXTENSIONS = (
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".tif",
    ".tiff"
)


# ============================================================
# 10. FIND LONG IMAGES
# ============================================================

image_files = []

for root, dirs, files in os.walk(
    INPUT_DIR
):

    for file in files:

        if file.lower().endswith(
            IMAGE_EXTENSIONS
        ):

            image_files.append(
                os.path.join(
                    root,
                    file
                )
            )


image_files.sort()


print("=" * 70)
print(
    "LONG IMAGES FOUND:",
    len(image_files)
)
print("=" * 70)


# ============================================================
# 11. YOLO26 → CROP → PP1 → PADDLEOCR
# ============================================================

total_images = 0
total_crops = 0
successful_crops = 0
failed_crops = 0


for image_index, image_path in enumerate(
    image_files
):

    total_images += 1


    print()
    print("=" * 70)

    print(
        f"IMAGE {image_index + 1}/{len(image_files)}"
    )

    print(
        os.path.basename(image_path)
    )

    print("=" * 70)


    # --------------------------------------------------------
    # Read image
    # --------------------------------------------------------

    image = cv2.imread(
        image_path
    )


    if image is None:

        print(
            "ERROR: Could not read image."
        )

        continue


    image_height, image_width = image.shape[:2]


    # --------------------------------------------------------
    # YOLO26 detection
    # --------------------------------------------------------

    results = model.predict(
        source=image,
        conf=0.25,
        iou=0.50,
        verbose=False
    )


    if not results:

        print(
            "No YOLO results."
        )

        continue


    result = results[0]


    if result.boxes is None:

        print(
            "No objects detected."
        )

        continue


    boxes = result.boxes


    print(
        "Objects detected:",
        len(boxes)
    )


    # --------------------------------------------------------
    # Process every detected object
    # --------------------------------------------------------

    for detection_index in range(
        len(boxes)
    ):

        total_crops += 1


        try:

            # ------------------------------------------------
            # Class ID
            # ------------------------------------------------

            class_id = int(
                boxes.cls[
                    detection_index
                ].item()
            )


            # ------------------------------------------------
            # Class name
            # ------------------------------------------------

            class_name = result.names[
                class_id
            ]


            # ------------------------------------------------
            # Confidence
            # ------------------------------------------------

            detection_confidence = float(
                boxes.conf[
                    detection_index
                ].item()
            )


            # ------------------------------------------------
            # Bounding box
            # ------------------------------------------------

            x1, y1, x2, y2 = boxes.xyxy[
                detection_index
            ].cpu().numpy()


            # ------------------------------------------------
            # Clip coordinates to image
            # ------------------------------------------------

            x1 = max(
                0,
                int(x1)
            )

            y1 = max(
                0,
                int(y1)
            )

            x2 = min(
                image_width,
                int(x2)
            )

            y2 = min(
                image_height,
                int(y2)
            )


            # ------------------------------------------------
            # Validate box
            # ------------------------------------------------

            if x2 <= x1 or y2 <= y1:

                print(
                    "Invalid bounding box."
                )

                failed_crops += 1

                continue


            # ------------------------------------------------
            # Crop detected region
            # ------------------------------------------------

            crop = image[
                y1:y2,
                x1:x2
            ]


            if crop.size == 0:

                print(
                    "Empty crop."
                )

                failed_crops += 1

                continue


            # ------------------------------------------------
            # Create unique crop name
            # ------------------------------------------------

            image_name = os.path.splitext(
                os.path.basename(image_path)
            )[0]


            crop_name = (
                f"{image_name}_"
                f"{class_name}_"
                f"{detection_index + 1:03d}_"
                f"conf_{detection_confidence:.3f}"
            )


            # ------------------------------------------------
            # Output directory
            # ------------------------------------------------

            crop_output_dir = os.path.join(

                OUTPUT_ROOT,

                class_name,

                crop_name

            )


            os.makedirs(
                crop_output_dir,
                exist_ok=True
            )


            # =================================================
            # SAVE ORIGINAL YOLO CROP
            # =================================================

            original_crop_path = os.path.join(

                crop_output_dir,

                "original_crop.png"

            )


            cv2.imwrite(
                original_crop_path,
                crop
            )


            # =================================================
            # PP1 PREPROCESSING
            # =================================================

            pp1_image = preprocess_pp1(
                crop
            )


            pp1_path = os.path.join(

                crop_output_dir,

                "pp1_preprocessed.png"

            )


            cv2.imwrite(
                pp1_path,
                pp1_image
            )


            # =================================================
            # PADDLEOCR
            # =================================================

            ocr_results = run_paddleocr(
                pp1_path
            )


            # =================================================
            # SAVE OCR RESULTS
            # =================================================

            json_path, txt_path = save_ocr_results(

                crop_output_dir,

                ocr_results

            )


            # =================================================
            # SAVE DETECTION METADATA
            # =================================================

            metadata = {

                "source_image":
                    image_path,

                "class":
                    class_name,

                "class_id":
                    class_id,

                "detection_confidence":
                    detection_confidence,

                "bbox":
                    [
                        x1,
                        y1,
                        x2,
                        y2
                    ],

                "crop_width":
                    int(crop.shape[1]),

                "crop_height":
                    int(crop.shape[0]),

                "preprocessing":
                    "PP1",

                "ocr":
                    "PaddleOCR",

                "ocr_regions":
                    len(ocr_results)

            }


            metadata_path = os.path.join(

                crop_output_dir,

                "metadata.json"

            )


            with open(

                metadata_path,

                "w",

                encoding="utf-8"

            ) as f:

                json.dump(

                    metadata,

                    f,

                    indent=2,

                    ensure_ascii=False

                )


            successful_crops += 1


            print(
                f"✓ {class_name} | "
                f"conf={detection_confidence:.3f} | "
                f"OCR regions={len(ocr_results)}"
            )


        except Exception as e:

            failed_crops += 1

            print(
                "❌ ERROR processing detection:"
            )

            print(e)


# ============================================================
# 12. FINAL SUMMARY
# ============================================================

print()
print("=" * 70)
print("YOLO26 → PP1 → PaddleOCR COMPLETE")
print("=" * 70)

print(
    "Images processed:",
    total_images
)

print(
    "Total YOLO crops:",
    total_crops
)

print(
    "Successful crops:",
    successful_crops
)

print(
    "Failed crops:",
    failed_crops
)

print()
print(
    "Output directory:"
)

print(
    OUTPUT_ROOT
)


# ============================================================
# 13. CREATE ZIP
# ============================================================

ZIP_BASE = "/content/yolo26_pp1_paddleocr"

if os.path.exists(
    ZIP_BASE + ".zip"
):

    os.remove(
        ZIP_BASE + ".zip"
    )


zip_path = shutil.make_archive(

    ZIP_BASE,

    "zip",

    OUTPUT_ROOT

)


print()
print("=" * 70)
print("ZIP CREATED")
print("=" * 70)

print(zip_path)


# ============================================================
# 14. OPTIONAL COLAB DOWNLOAD
# ============================================================

from google.colab import files

files.download(
    zip_path
)
```