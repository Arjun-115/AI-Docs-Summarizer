# pdf_extractor.py
# Simple PDF extractor using PyMuPDF (fitz) if available, fallback to pdfminer.
def extract_text_from_pdf(path: str) -> str:
    try:
        import fitz
        doc = fitz.open(path)
        text = []
        for page in doc:
            page_text = page.get_text()
            if page_text.strip():  # Only add non-empty text
                text.append(page_text)
            # Limit to first 10 pages for faster processing
            if len(text) >= 10:
                break
        extracted_text = "\n".join(text)
        if not extracted_text.strip():
            # If no text extracted, try OCR on first page
            try:
                from .ocr_extractor import extract_text_from_image
                # Convert first page to image and OCR
                page = doc[0]
                pix = page.get_pixmap()
                img_path = path.replace('.pdf', '_page0.png')
                pix.save(img_path)
                ocr_text = extract_text_from_image(img_path)
                # Clean up temp file
                import os
                if os.path.exists(img_path):
                    os.remove(img_path)
                return ocr_text
            except Exception as ocr_error:
                print(f"OCR failed: {ocr_error}")
                return "Unable to extract text from this PDF. It may be image-based and requires OCR setup."
        return extracted_text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""
