def test_placeholder():
    from backend.models.summarizer_model import Summarizer
    s = Summarizer()
    out = s.summarize("one two three four five six seven eight nine ten", min_words=5, max_words=8)
    assert isinstance(out, str)
