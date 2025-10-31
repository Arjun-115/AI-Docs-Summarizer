# image_analyzer.py
import requests
import base64
from typing import Optional
import os

def analyze_image_with_openai(image_path: str, api_key: Optional[str] = None) -> str:
    """
    Analyze image using OpenAI's GPT-4 Vision API to describe scenery or content.
    Requires OPENAI_API_KEY environment variable or api_key parameter.
    """
    try:
        # Get API key from environment or parameter
        api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not api_key or api_key == "your_openai_api_key_here":
            return "OpenAI API key not configured. Please set a valid OPENAI_API_KEY environment variable in the .env file."

        # Read and encode image
        with open(image_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')

        # Prepare API request
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        payload = {
            "model": "gpt-4-vision-preview",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Describe this image briefly. If it's a scenery, describe the landscape, colors, mood, and any notable features. If it's a document or text, extract and summarize the content. Provide a concise description."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 300  # Reduced from 500 for faster response
        }

        # Make API call
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            description = result['choices'][0]['message']['content']
            return description.strip()
        else:
            return f"Error analyzing image: {response.status_code} - {response.text}"

    except Exception as e:
        return f"Error processing image: {str(e)}"

def analyze_image_with_huggingface(image_path: str) -> str:
    """
    Fallback method using Hugging Face's image captioning model.
    """
    try:
        # This would require additional setup with Hugging Face API
        # For now, return a placeholder
        return "Image analysis requires OpenAI API key. Please configure OPENAI_API_KEY for image description functionality."

    except Exception as e:
        return f"Error in image analysis: {str(e)}"
