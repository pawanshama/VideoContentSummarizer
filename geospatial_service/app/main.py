from fastapi import FastAPI, HTTPException
# Corrected relative imports:
from .schemas import ( # Changed from geospatial_service.app.schemas
    GeospatialProcessingRequest,
    GeospatialProcessingResponse,
    GeospatialCommandResponse
)
from .utils.nlp_processing import ( # Changed from geospatial_service.app.utils.nlp_processing
    extract_locations_with_timestamps,
    generate_geospatial_commands
)
import os

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Geospatial Command Generation Service",
    description="Processes transcribed text to extract locations and generate map commands.",
    version="0.1.0"
)

# --- FastAPI Endpoints ---

@app.get("/")
async def root():
    return {"message": "Geospatial Command Generation Service is running!"}

@app.post("/process-geospatial/", response_model=GeospatialProcessingResponse)
async def process_geospatial_endpoint(request: GeospatialProcessingRequest):
    """
    Processes transcribed text to extract locations and generate geospatial commands.
    """
    print(f"Received geospatial processing request for video: {request.video_id}")
    try:
        extracted_locations = extract_locations_with_timestamps(request.transcribed_text)
        
        geospatial_commands = generate_geospatial_commands(
            request.video_id, 
            extracted_locations,
            request.duration_seconds
        )
        
        return GeospatialProcessingResponse(
            video_id=request.video_id,
            geospatial_commands=geospatial_commands,
            message="Geospatial commands generated successfully."
        )
    except Exception as e:
        print(f"Error in geospatial processing for {request.video_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Geospatial processing failed: {str(e)}")

# from fastapi import FastAPI, HTTPException
# from geospatial_service.app.schemas import (
#     GeospatialProcessingRequest,
#     GeospatialProcessingResponse,
#     GeospatialCommandResponse # Also import for direct use
# )
# from geospatial_service.app.utils.nlp_processing import (
#     extract_locations_with_timestamps,
#     generate_geospatial_commands
# )
# import os

# # --- FastAPI App Initialization ---
# app = FastAPI(
#     title="Geospatial Command Generation Service",
#     description="Processes transcribed text to extract locations and generate map commands.",
#     version="0.1.0"
# )

# # --- FastAPI Endpoints ---

# @app.get("/")
# async def root():
#     return {"message": "Geospatial Command Generation Service is running!"}

# @app.post("/process-geospatial/", response_model=GeospatialProcessingResponse)
# async def process_geospatial_endpoint(request: GeospatialProcessingRequest):
#     """
#     Processes transcribed text to extract locations and generate geospatial commands.
#     """
#     print(f"Received geospatial processing request for video: {request.video_id}")
#     try:
#         extracted_locations = extract_locations_with_timestamps(request.transcribed_text)
        
#         geospatial_commands = generate_geospatial_commands(
#             request.video_id, 
#             extracted_locations,
#             request.duration_seconds
#         )
        
#         return GeospatialProcessingResponse(
#             video_id=request.video_id,
#             geospatial_commands=geospatial_commands,
#             message="Geospatial commands generated successfully."
#         )
#     except Exception as e:
#         print(f"Error in geospatial processing for {request.video_id}: {e}")
#         raise HTTPException(status_code=500, detail=f"Geospatial processing failed: {str(e)}")

# # To run this Python microservice:
# # cd geospatial_service
# # uvicorn app.main:app --host 0.0.0.0 --port 5002 --reload
# # (Note: Using port 5002 to avoid conflict with your Whisper service on 5001)