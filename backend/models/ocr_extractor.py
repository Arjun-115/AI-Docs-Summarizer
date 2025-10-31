# ocr_extractor.py
# Uses pytesseract to extract text from images.
try:
    import pytesseract
    from PIL import Image
except Exception:
    pytesseract = None

def extract_text_from_image(path: str) -> str:
    if pytesseract is None:
        return ""
    im = Image.open(path)
    return pytesseract.image_to_string(im)
