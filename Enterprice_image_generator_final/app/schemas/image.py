from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ImageGenerationRequest(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = "blurry, low quality, distorted"
    num_inference_steps: Optional[int] = 30

class ImageResponse(BaseModel):
    id: int
    user_id: int
    prompt: str
    negative_prompt: Optional[str]
    image_path: str
    model_name: Optional[str] = None
    image_url: Optional[str]
    width: Optional[int] = 1024
    height: Optional[int] = 1024
    steps: int
    created_at: datetime

    class Config:
        from_attributes = True

class ImageUpdateRequest(BaseModel):
    prompt: Optional[str] = None
    negative_prompt: Optional[str] = None
