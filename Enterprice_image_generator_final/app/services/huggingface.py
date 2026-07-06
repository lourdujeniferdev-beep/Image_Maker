import os
import io
import logging
from dotenv import load_dotenv
from fastapi import HTTPException
from huggingface_hub import InferenceClient
from huggingface_hub.utils import HfHubHTTPError

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL = os.getenv("HF_MODEL", "black-forest-labs/FLUX.1-schnell")

def get_inference_client():
    """
    Dynamically creates and returns the Hugging Face InferenceClient.
    """
    if not HF_TOKEN:
        logger.error("HF_TOKEN environment variable is missing.")
        raise ValueError("HF_TOKEN environment variable is missing.")
    return InferenceClient(api_key=HF_TOKEN)

def mask_token(token: str) -> str:
    if not token:
        return "None"
    if len(token) <= 4:
        return "****"
    return "*" * (len(token) - 4) + token[-4:]

def generate_image(
    prompt: str,
    negative_prompt: str = "blurry, low quality, distorted",
    num_inference_steps: int = 30
) -> bytes:
    logger.info(f"Step 1: Prompt received - '{prompt}'")
    logger.info(f"Step 2: Model configured - {HF_MODEL}")
    logger.info(f"Step 2b: Token loaded - {mask_token(HF_TOKEN)}")
    
    try:
        client = get_inference_client()
        
        logger.info(f"Step 3: Sending text-to-image request via SDK to model {HF_MODEL}")
        
        # Validate that the model is supported by InferenceClient's text-to-image
        # The text_to_image method automatically handles proper payload formatting and API routing.
        image = client.text_to_image(
            prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=num_inference_steps,
            model=HF_MODEL
        )
        
        # Convert the generated PIL Image to raw PNG bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        
        logger.info("Step 4: Image successfully generated and received via SDK.")
        return img_byte_arr
        
    except HfHubHTTPError as e:
        status_code = e.response.status_code
        error_msg = e.response.text
        logger.error(f"Step 4 Error: Hugging Face SDK API error {status_code}: {error_msg}")
        
        if status_code == 401:
            detail = "Unauthorized: The Hugging Face token is invalid or missing."
        elif status_code == 403:
            detail = "Forbidden: Access to this model is denied."
        elif status_code == 404:
            detail = f"Not Found: The model '{HF_MODEL}' does not exist or is not available."
        elif status_code == 410:
            detail = f"Gone: The model '{HF_MODEL}' is deprecated and no longer supported by the Hugging Face API."
        elif status_code == 429:
            detail = "Too Many Requests: Rate limit exceeded for Hugging Face API."
        elif status_code in (500, 503):
            detail = f"Hugging Face Service Unavailable: {error_msg}"
        else:
            detail = f"Hugging Face API error: {error_msg}"
            
        raise HTTPException(
            status_code=status_code if status_code >= 400 else 500,
            detail=detail
        )
    except Exception as e:
        logger.error(f"Step 4 Unexpected Exception: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during image generation: {str(e)}"
        )
