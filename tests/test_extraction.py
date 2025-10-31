def test_pdf_extract_importable():
    try:
        from backend.models import pdf_extractor
    except Exception:
        assert False, "Import failed"
