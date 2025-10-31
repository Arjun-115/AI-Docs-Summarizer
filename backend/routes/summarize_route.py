from fastapi import APIRouter, UploadFile, File, HTTPException
import os, shutil
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
import nltk
import re
from ..models.pdf_extractor import extract_text_from_pdf
from ..models.text_cleaner import clean_text
from ..models.image_analyzer import analyze_image_with_openai

router = APIRouter()

# Make sure punkt is downloaded
try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt")

try:
    nltk.data.find("tokenizers/punkt_tab")
except LookupError:
    nltk.download("punkt_tab")

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def correct_grammar(text: str) -> str:
    """Basic grammar correction using regex patterns."""
    # Capitalize first letter of sentences
    text = re.sub(r'(^|[.!?]\s*)(\w)', lambda m: m.group(1) + m.group(2).upper(), text)

    # Fix common spacing issues
    text = re.sub(r'\s+', ' ', text).strip()

    # Fix double punctuation
    text = re.sub(r'([.!?])\s*\1+', r'\1', text)

    return text

def humanize_text(text: str) -> str:
    """Make text more human-like by varying sentence structure."""
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())

    humanized_sentences = []
    for i, sentence in enumerate(sentences):
        sentence = sentence.strip()
        if sentence:
            # Add some variety in sentence starters occasionally
            if i > 0 and i % 3 == 0 and not sentence.startswith(('However', 'Therefore', 'Moreover')):
                sentence = f"Additionally, {sentence.lower()}"
            humanized_sentences.append(sentence)

    return ' '.join(humanized_sentences)

@router.post("/api/summarize")
async def summarize_file(file: UploadFile = File(...), grammar_correction: bool = False, humanize: bool = False):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Check file extension to determine processing method
        file_extension = os.path.splitext(file.filename)[1].lower()

        if file_extension in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']:
            # Process as image
            summary = analyze_image_with_openai(file_path)

            # Apply grammar correction if requested
            if grammar_correction:
                summary = correct_grammar(summary)

            # Apply humanization if requested
            if humanize:
                summary = humanize_text(summary)

        elif file_extension == '.pdf':
            # Process as PDF document
            text = extract_text_from_pdf(file_path)
            text = clean_text(text)

            if not text.strip() or text.startswith("Unable to extract"):
                # If PDF is image-based and OCR failed, treat as image
                summary = analyze_image_with_openai(file_path)

                # Apply grammar correction if requested
                if grammar_correction:
                    summary = correct_grammar(summary)

                # Apply humanization if requested
                if humanize:
                    summary = humanize_text(summary)
            else:
                # Limit text length for faster processing
                text = text[:10000]  # Process only first 10,000 characters
                parser = PlaintextParser.from_string(text, Tokenizer("english"))
                summarizer = LsaSummarizer()
                summary_sentences = summarizer(parser.document, sentences_count=3)  # Reduced from 5 to 3 for speed
                summary = ". ".join(str(sentence) for sentence in summary_sentences) + "."

                # Apply grammar correction if requested
                if grammar_correction:
                    summary = correct_grammar(summary)

                # Apply humanization if requested
                if humanize:
                    summary = humanize_text(summary)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a PDF or image file.")

        return {"filename": file.filename, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
