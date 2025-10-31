def test_routes_importable():
    try:
        from backend.routes import summarize_route
    except Exception:
        assert False, "Import failed"
