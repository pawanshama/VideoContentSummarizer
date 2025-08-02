from flask import Flask, request, jsonify
from transformers import pipeline
import torch
import os
import requests
import tempfile
import pydub
import logging
from datetime import datetime # Added for logging timestamps

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

# Load Whisper model
# Choose a model size: 'tiny', 'base', 'small', 'medium', 'large-v2', 'large-v3'
# 'base' is a good starting point for speed vs accuracy. 'small' or 'medium' are often better.
# 'large-v2' or 'large-v3' are best quality but require more VRAM/RAM.
# Set device to 'cuda' if you have a GPU, otherwise 'cpu'
device = "cuda:0" if torch.cuda.is_available() else "cpu"
logging.info(f"Using device: {device}")

try:
    # Specify language if known for better performance (e.g., "en" for English)
    # If you don't specify, it will try to detect.
    whisper_pipeline = pipeline(
        "automatic-speech-recognition",
        model="openai/whisper-base", # You can change this (e.g., "openai/whisper-small")
        chunk_length_s=30, # Process audio in 30-second chunks
        device=device,
        torch_dtype=torch.float16 if device == "cuda:0" else torch.float32 # Use float16 for GPU for efficiency
    )
    logging.info("Whisper model loaded successfully.")
except Exception as e:
    logging.error(f"Failed to load Whisper model: {e}")
    whisper_pipeline = None # Ensure pipeline is None if loading fails

@app.route('/transcribe_video', methods=['POST'])
def transcribe_video():
    if whisper_pipeline is None:
        return jsonify({"error": "Whisper model not loaded. Check server logs."}), 500

    data = request.get_json()
    video_url = data.get('video_url')
    video_id = data.get('video_id') # Added to match Node.js request

    if not video_url:
        return jsonify({"error": "No video_url provided"}), 400

    temp_dir = tempfile.mkdtemp() # Create a temporary directory
    temp_video_path = None
    temp_audio_path = None
    
    try:
        # 1. Download video from URL
        logging.info(f"[{datetime.now().strftime('%H:%M:%S')}] Downloading video from {video_url} (ID: {video_id})...")
        temp_video_path = os.path.join(temp_dir, "input_video.mp4") # Assume .mp4 for simplicity, adjust if needed
        response = requests.get(video_url, stream=True)
        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
        with open(temp_video_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        logging.info(f"[{datetime.now().strftime('%H:%M:%S')}] Video downloaded for ID: {video_id}.")

        # 2. Extract audio using pydub (which uses ffmpeg underneath)
        logging.info(f"[{datetime.now().strftime('%H:%M:%S')}] Extracting audio from video for ID: {video_id}...")
        video_clip = pydub.AudioSegment.from_file(temp_video_path)
        temp_audio_path = os.path.join(temp_dir, "extracted_audio.mp3")
        video_clip.export(temp_audio_path, format="mp3")
        logging.info(f"[{datetime.now().strftime('%H:%M:%S')}] Audio extracted for ID: {video_id}.")

        # 3. Transcribe audio with Whisper
        logging.info(f"[{datetime.now().strftime('%H:%M:%S')}] Starting Whisper transcription for ID: {video_id}...")
        result = whisper_pipeline(temp_audio_path)
        transcript_text = result["text"]
        logging.info(f"[{datetime.now().strftime('%H:%M:%S')}] Transcription complete for ID: {video_id}.")

        return jsonify({"transcript": transcript_text}), 200

    except requests.exceptions.RequestException as e:
        logging.error(f"Error downloading video for ID {video_id}: {e}")
        return jsonify({"error": f"Failed to download video: {e}"}), 500
    except pydub.exceptions.CouldntDecodeError as e:
        logging.error(f"Error extracting audio for ID {video_id} (FFmpeg issue?): {e}")
        return jsonify({"error": f"Failed to extract audio. Ensure FFmpeg is installed and in PATH. Details: {e}"}), 500
    except Exception as e:
        logging.error(f"An unexpected error occurred during transcription for ID {video_id}: {e}")
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500
    finally:
        # Clean up temporary files and directory
        if temp_video_path and os.path.exists(temp_video_path):
            os.remove(temp_video_path)
        if temp_audio_path and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
        # rmdir only deletes empty directories, so ensure all files are gone before trying
        try:
            if os.path.exists(temp_dir):
                os.rmdir(temp_dir) 
        except OSError as e:
            logging.warning(f"Could not remove temporary directory {temp_dir}: {e}")
        logging.info(f"[{datetime.now().strftime('%H:%M:%S')}] Temporary files cleaned up for ID: {video_id}.")


if __name__ == '__main__':
    # Run the Flask app
    # It will run on http://127.0.0.1:5001/ by default
    # Set threaded=False for better debugging in some cases, or True for concurrent requests
    app.run(host='127.0.0.1', port=5001, debug=False) # Set debug=False for production



# # local_whisper_server.py
# from flask import Flask, request, jsonify
# from transformers import pipeline
# import torch
# import os
# import requests
# import tempfile
# import pydub
# import logging

# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# app = Flask(__name__)

# # Load Whisper model
# # Choose a model size: 'tiny', 'base', 'small', 'medium', 'large-v2', 'large-v3'
# # 'base' is a good starting point for speed vs accuracy. 'small' or 'medium' are often better.
# # 'large-v2' or 'large-v3' are best quality but require more VRAM/RAM.
# # Set device to 'cuda' if you have a GPU, otherwise 'cpu'
# device = "cuda:0" if torch.cuda.is_available() else "cpu"
# logging.info(f"Using device: {device}")

# try:
#     # Specify language if known for better performance (e.g., "en" for English)
#     # If you don't specify, it will try to detect.
#     whisper_pipeline = pipeline(
#         "automatic-speech-recognition",
#         model="openai/whisper-base", # You can change this (e.g., "openai/whisper-small")
#         chunk_length_s=30, # Process audio in 30-second chunks
#         device=device,
#         torch_dtype=torch.float16 if device == "cuda:0" else torch.float32 # Use float16 for GPU for efficiency
#     )
#     logging.info("Whisper model loaded successfully.")
# except Exception as e:
#     logging.error(f"Failed to load Whisper model: {e}")
#     whisper_pipeline = None # Ensure pipeline is None if loading fails

# @app.route('/transcribe_video', methods=['POST'])
# def transcribe_video():
#     if whisper_pipeline is None:
#         return jsonify({"error": "Whisper model not loaded. Check server logs."}), 500

#     data = request.get_json()
#     video_url = data.get('video_url')
#     if not video_url:
#         return jsonify({"error": "No video_url provided"}), 400

#     temp_dir = tempfile.mkdtemp() # Create a temporary directory
#     temp_video_path = None
#     temp_audio_path = None
    
#     try:
#         # 1. Download video from URL
#         logging.info(f"Downloading video from {video_url}...")
#         temp_video_path = os.path.join(temp_dir, "input_video.mp4") # Assume .mp4 for simplicity, adjust if needed
#         response = requests.get(video_url, stream=True)
#         response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
#         with open(temp_video_path, 'wb') as f:
#             for chunk in response.iter_content(chunk_size=8192):
#                 f.write(chunk)
#         logging.info("Video downloaded.")

#         # 2. Extract audio using pydub (which uses ffmpeg underneath)
#         logging.info("Extracting audio from video...")
#         video_clip = pydub.AudioSegment.from_file(temp_video_path)
#         temp_audio_path = os.path.join(temp_dir, "extracted_audio.mp3")
#         video_clip.export(temp_audio_path, format="mp3")
#         logging.info("Audio extracted.")

#         # 3. Transcribe audio with Whisper
#         logging.info("Starting Whisper transcription...")
#         result = whisper_pipeline(temp_audio_path)
#         transcript_text = result["text"]
#         logging.info("Transcription complete.")

#         return jsonify({"transcript": transcript_text}), 200

#     except requests.exceptions.RequestException as e:
#         logging.error(f"Error downloading video: {e}")
#         return jsonify({"error": f"Failed to download video: {e}"}), 500
#     except pydub.exceptions.CouldntDecodeError as e:
#         logging.error(f"Error extracting audio (FFmpeg issue?): {e}")
#         return jsonify({"error": f"Failed to extract audio. Ensure FFmpeg is installed and in PATH. Details: {e}"}), 500
#     except Exception as e:
#         logging.error(f"An unexpected error occurred during transcription: {e}")
#         return jsonify({"error": f"An unexpected error occurred: {e}"}), 500
#     finally:
#         # Clean up temporary files and directory
#         if temp_video_path and os.path.exists(temp_video_path):
#             os.remove(temp_video_path)
#         if temp_audio_path and os.path.exists(temp_audio_path):
#             os.remove(temp_audio_path)
#         if os.path.exists(temp_dir):
#             os.rmdir(temp_dir) # rmdir only deletes empty directories
#         logging.info("Temporary files cleaned up.")


# if __name__ == '__main__':
#     # Run the Flask app
#     # It will run on http://127.0.0.1:5000/ by default
#     # Set threaded=False for better debugging in some cases, or True for concurrent requests
#     app.run(host='127.0.0.1', port=5001, debug=False) # Set debug=False for production