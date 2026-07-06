import os
import urllib.parse
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.generated_image import GeneratedImage
from app.schemas.image import ImageGenerationRequest, ImageResponse, ImageUpdateRequest
from app.services.huggingface import generate_image

router = APIRouter(
    prefix="/generate",
    tags=["Generate"]
)

GENERATED_DIR = os.path.join("app", "uploads")
os.makedirs(GENERATED_DIR, exist_ok=True)

from fastapi.responses import FileResponse

@router.post("/", response_model=ImageResponse)
def create_image(
    request: ImageGenerationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Generate image bytes via Hugging Face service
        image_bytes = generate_image(
            prompt=request.prompt,
            negative_prompt=request.negative_prompt or "blurry, low quality, distorted",
            num_inference_steps=request.num_inference_steps or 30
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    timestamp = int(datetime.utcnow().timestamp())
    filename = f"gen_{current_user.id}_{timestamp}.png"
    filepath = os.path.join(GENERATED_DIR, filename)

    try:
        with open(filepath, "wb") as f:
            f.write(image_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not save generated image to disk: {str(e)}"
        )

    db_image = GeneratedImage(
        user_id=current_user.id,
        prompt=request.prompt,
        negative_prompt=request.negative_prompt,
        image_path=filepath,
        image_url=f"/uploads/{filename}",
        width=1024,
        height=1024,
        steps=request.num_inference_steps,
        model_name=os.getenv("HF_MODEL", "black-forest-labs/FLUX.1-schnell")
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)

    return db_image

@router.get("/{image_id}/preview")
def preview_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image = db.query(GeneratedImage).filter(
        GeneratedImage.id == image_id,
        GeneratedImage.user_id == current_user.id
    ).first()

    if not image or not os.path.exists(image.image_path):
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(image.image_path, media_type="image/png")

@router.get("/", response_model=List[ImageResponse])
def get_images(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    images = db.query(GeneratedImage).filter(
        GeneratedImage.user_id == current_user.id
    ).order_by(GeneratedImage.created_at.desc()).all()
    return images

@router.get("/{image_id}", response_model=ImageResponse)
def get_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image = db.query(GeneratedImage).filter(
        GeneratedImage.id == image_id,
        GeneratedImage.user_id == current_user.id
    ).first()

    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return image

@router.put("/{image_id}", response_model=ImageResponse)
def update_image(
    image_id: int,
    request: ImageUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image = db.query(GeneratedImage).filter(
        GeneratedImage.id == image_id,
        GeneratedImage.user_id == current_user.id
    ).first()

    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    if request.prompt is not None:
        image.prompt = request.prompt
    if request.negative_prompt is not None:
        image.negative_prompt = request.negative_prompt

    db.commit()
    db.refresh(image)
    return image

@router.delete("/{image_id}")
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image = db.query(GeneratedImage).filter(
        GeneratedImage.id == image_id,
        GeneratedImage.user_id == current_user.id
    ).first()

    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Attempt to delete file
    try:
        if os.path.exists(image.image_path):
            os.remove(image.image_path)
    except Exception as e:
        # Non-fatal error, file might already be deleted
        pass

    db.delete(image)
    db.commit()

    return {"message": "Image deleted successfully"}