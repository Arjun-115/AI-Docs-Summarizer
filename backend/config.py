import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Directories for uploaded files and summaries
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
SUMMARY_DIR = os.path.join(os.path.dirname(__file__), "summaries")

# Create directories if they don't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(SUMMARY_DIR, exist_ok=True)

# OpenAI API configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
