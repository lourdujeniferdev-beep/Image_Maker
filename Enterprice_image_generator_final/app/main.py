from fastapi import FastAPI

from app.core.database import (
    Base,
    engine
)

from app.routers.auth import router as auth_router
from app.routers.generate import router as generate_router

import os

# Drop tables conditionally to apply schema updates
if os.getenv("RECREATE_DB", "false").lower() == "true":
    Base.metadata.drop_all(bind=engine)

Base.metadata.create_all(
    bind=engine
)

from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import HTMLResponse

app = FastAPI(
    title="Enterprise Branded Image Generator",
    docs_url=None
)

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    response = get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI"
    )
    
    # Custom JavaScript to inject an image tag when a response contains image_url
    custom_js = """
    <script>
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const responseBlocks = node.querySelectorAll('.response-col_description__inner');
                        responseBlocks.forEach(block => {
                            if (block.dataset.imageInjected) return;
                            
                            try {
                                // Swagger UI uses different classes like microlight or just pre > code
                                const codeBlock = block.querySelector('.microlight') || block.querySelector('code');
                                if (codeBlock) {
                                    const jsonText = codeBlock.innerText || codeBlock.textContent;
                                    const data = JSON.parse(jsonText);
                                    if (data && data.image_url) {
                                        block.dataset.imageInjected = 'true';
                                        const img = document.createElement('img');
                                        img.src = data.image_url;
                                        img.style.maxWidth = '100%';
                                        img.style.marginTop = '10px';
                                        img.style.marginBottom = '15px';
                                        img.style.borderRadius = '8px';
                                        img.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                        
                                        // Insert it above the highlight-code div if possible
                                        const highlightDiv = block.querySelector('.highlight-code');
                                        if (highlightDiv) {
                                            block.insertBefore(img, highlightDiv);
                                        } else {
                                            block.insertBefore(img, block.firstChild);
                                        }
                                    }
                                }
                            } catch (e) { }
                        });
                    }
                });
            }
        });
    });
    
    document.addEventListener("DOMContentLoaded", () => {
        observer.observe(document.body, { childList: true, subtree: true });
    });
    </script>
    """
    
    html_content = response.body.decode("utf-8")
    html_content = html_content.replace("</body>", f"{custom_js}</body>")
    return HTMLResponse(html_content)

from fastapi.staticfiles import StaticFiles

app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")
app.include_router(auth_router)
app.include_router(generate_router)