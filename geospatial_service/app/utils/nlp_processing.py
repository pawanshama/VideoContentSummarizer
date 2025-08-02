import spacy
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
import requests
import os
import re
from typing import List, Dict, Optional, Tuple
from uuid import uuid4
from datetime import datetime

from dotenv import load_dotenv

# Path to .env:
# os.path.dirname(__file__) is 'geospatial_service/app/utils'
# '..' goes up to 'geospatial_service/app'
# '..' goes up again to 'geospatial_service/'
# '.env' then correctly points to 'geospatial_service/.env'
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))


# --- Setup NLP and Geocoding ---
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("SpaCy model 'en_core_web_sm' not found. Running 'python -m spacy download en_core_web_sm'")
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

geolocator = Nominatim(user_agent="geospatial_command_service_app")

Maps_API_KEY = os.environ.get("Maps_API_KEY")

# --- Helper Functions (Core Logic) ---

def geocode_location(location_name: str) -> Optional[Dict[str, float]]:
    """Geocodes a location name to lat/lng using Nominatim."""
    try:
        location = geolocator.geocode(location_name, timeout=5)
        if location:
            print(f"Geocoded '{location_name}' to {location.latitude}, {location.longitude}")
            return {"latitude": location.latitude, "longitude": location.longitude}
        print(f"Could not geocode '{location_name}'")
        return None
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        print(f"Geocoding service error for '{location_name}': {e}")
        return None

def extract_locations_with_timestamps(transcribed_text: str) -> List[Dict]:
    """
    Extracts locations and their approximate timestamps from transcribed text.
    Assumes timestamps are in format [S] or [MM:SS] in the text.
    """
    doc = nlp(transcribed_text)
    locations = []
    
    # Regex to find timestamps and associated text segments
    time_text_pairs = re.findall(r"\[(\d{1,2}:\d{2}|\d+)\]\s*(.*?)(?=\[\d|$)", transcribed_text, re.DOTALL)

    for time_str, text_segment in time_text_pairs:
        # Convert timestamp to seconds
        if ':' in time_str:
            parts = time_str.split(':')
            seconds_offset = int(parts[0]) * 60 + int(parts[1])
        else:
            seconds_offset = int(time_str)
        
        segment_doc = nlp(text_segment)
        for ent in segment_doc.ents:
            # Broad set of entity labels that might indicate a place or landmark
            if ent.label_ in ["GPE", "LOC", "ORG", "FAC", "NORP", "PRODUCT"]: # 'FACILITY' changed to 'FAC' based on spacy 3.x common labels
                # Basic filtering: Ignore very short names or pure numbers
                if len(ent.text) > 2 and not ent.text.strip().isdigit():
                    loc_data = geocode_location(ent.text)
                    if loc_data:
                        locations.append({
                            "name": ent.text,
                            "latitude": loc_data["latitude"],
                            "longitude": loc_data["longitude"],
                            "time_offset_seconds": seconds_offset
                        })
    
    # Deduplicate locations and sort by time offset
    seen_locations = set()
    unique_locations = []
    for loc in locations:
        loc_key = (loc["name"], loc["latitude"], loc["longitude"]) # Use tuple for uniqueness check
        if loc_key not in seen_locations:
            unique_locations.append(loc)
            seen_locations.add(loc_key)

    unique_locations.sort(key=lambda x: x["time_offset_seconds"])
    return unique_locations


def get_google_directions_data(
    start_lat: float, start_lng: float,
    end_lat: float, end_lng: float,
    travel_mode: str = "driving"
) -> Optional[Dict]:
    """
    Calls Google Directions API to get path polyline, duration, and distance.
    """
    if not Maps_API_KEY:
        print("Maps_API_KEY is not set in environment variables.")
        return None

    base_url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": f"{start_lat},{start_lng}",
        "destination": f"{end_lat},{end_lng}",
        "mode": travel_mode.lower(),
        "key": Maps_API_KEY,
        "overview_polyline": "encode"
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status() # Raises HTTPError for bad responses (4xx or 5xx)
        data = response.json()

        if data["status"] == "OK" and data["routes"]:
            encoded_polyline = data["routes"][0]["overview_polyline"]["points"]
            
            duration_seconds = None
            if data["routes"][0]["legs"]: # A route can have multiple legs
                duration_seconds = data["routes"][0]["legs"][0]["duration"]["value"]

            return {
                "path_polyline": encoded_polyline,
                "duration_seconds": duration_seconds,
            }
        elif data["status"] == "ZERO_RESULTS":
            print(f"No route found for {start_lat},{start_lng} to {end_lat},{end_lng}.")
            return None
        else:
            print(f"Directions API Error (Status: {data['status']}): {data.get('error_message', 'Unknown error')}")
            return None

    except requests.exceptions.RequestException as e:
        print(f"HTTP Request to Google Directions API failed: {e}")
        return None

# Corrected relative import:
from ..schemas import GeospatialCommandResponse, GeospatialCommandData 

def generate_geospatial_commands(video_id: str, locations: List[Dict], video_duration: float) -> List[GeospatialCommandResponse]:
    """
    Generates a list of geospatial command objects (Pydantic models) from extracted locations.
    Infers 'move' commands between sequential locations and 'place_marker' at each stop.
    """
    commands: List[GeospatialCommandResponse] = []
    
    # Add initial marker for the first mentioned location if available
    if locations:
        first_loc = locations[0]
        commands.append(
            GeospatialCommandResponse(
                command_id=str(uuid4()),
                video_id=video_id,
                command_type="place_marker",
                start_time_offset_seconds=float(first_loc["time_offset_seconds"]),
                command_data_json=GeospatialCommandData(
                    latitude=first_loc["latitude"],
                    longitude=first_loc["longitude"],
                    marker_id=f"{first_loc['name'].lower().replace(' ', '_')}_start",
                    label=f"{first_loc['name']} (Start)"
                ),
                generated_at=datetime.utcnow() # Set current time
            )
        )

    # Infer 'move' commands and subsequent 'place_marker' commands
    for i in range(len(locations) - 1):
        start_loc = locations[i]
        end_loc = locations[i+1]

        # Get directions for the move segment
        directions_data = get_google_directions_data(
            start_loc["latitude"], start_loc["longitude"],
            end_loc["latitude"], end_loc["longitude"],
            travel_mode="driving" # Defaulting to driving for road trip
        )

        if directions_data and directions_data["path_polyline"]:
            # Determine animation start and end times within the video
            # Start the move animation a short while after the previous location is mentioned
            # End when the next location is mentioned or just before
            
            move_start_time_video = float(start_loc["time_offset_seconds"]) + 10 # Start 10s after previous mention
            move_end_time_video = float(end_loc["time_offset_seconds"])

            # Ensure animation duration on map is proportional to video segment
            # If the video segment (move_end_time_video - move_start_time_video) is too short
            # compared to actual map duration, the animation will be very fast.
            # You might want to cap `move_end_time_video` at `video_duration`
            # or cap the animation duration for very long actual travel times.

            # Basic sanity check: Ensure animation starts before it ends in video timeline
            if move_start_time_video >= move_end_time_video:
                move_start_time_video = float(start_loc["time_offset_seconds"]) # Reset to mention time
                move_end_time_video = min(video_duration, move_start_time_video + 30) # At least 30s animation or video end


            commands.append(
                GeospatialCommandResponse(
                    command_id=str(uuid4()),
                    video_id=video_id,
                    command_type="move",
                    start_time_offset_seconds=move_start_time_video,
                    end_time_offset_seconds=move_end_time_video,
                    command_data_json=GeospatialCommandData(
                        entity_id="traveler_marker", # Consistent ID for the moving entity
                        start_location={"latitude": start_loc["latitude"], "longitude": start_loc["longitude"]},
                        end_location={"latitude": end_loc["latitude"], "longitude": end_loc["longitude"]},
                        duration_seconds_on_map=float(directions_data["duration_seconds"]), # Actual travel time on map
                        animation_style="road_path",
                        travel_mode="driving",
                        path_polyline=directions_data["path_polyline"]
                    ),
                    generated_at=datetime.utcnow()
                )
            )
            
            # Create a 'place_marker' command for the destination of this leg, at its mention time
            commands.append(
                GeospatialCommandResponse(
                    command_id=str(uuid4()),
                    video_id=video_id,
                    command_type="place_marker",
                    start_time_offset_seconds=float(end_loc["time_offset_seconds"]),
                    end_time_offset_seconds=None, # Stays on map
                    command_data_json=GeospatialCommandData(
                        latitude=end_loc["latitude"],
                        longitude=end_loc["longitude"],
                        marker_id=f"{end_loc['name'].lower().replace(' ', '_')}_arrival",
                        label=f"{end_loc['name']} (Arrival)"
                    ),
                    generated_at=datetime.utcnow()
                )
            )
    
    # Sort all generated commands by their start time offset
    commands.sort(key=lambda x: x.start_time_offset_seconds)
    return commands

# import spacy
# from geopy.geocoders import Nominatim
# from geopy.exc import GeocoderTimedOut, GeocoderServiceError
# import requests
# import os
# import re
# from typing import List, Dict, Optional, Tuple
# from uuid import uuid4
# from datetime import datetime # Make sure datetime is imported

# from dotenv import load_dotenv
# # Load .env from the root of geospatial_service/
# load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../.env'))

# # --- Setup NLP and Geocoding ---
# try:
#     nlp = spacy.load("en_core_web_sm")
# except OSError:
#     print("SpaCy model 'en_core_web_sm' not found. Running 'python -m spacy download en_core_web_sm'")
#     os.system("python -m spacy download en_core_web_sm")
#     nlp = spacy.load("en_core_web_sm")

# geolocator = Nominatim(user_agent="geospatial_command_service_app")

# Maps_API_KEY = os.environ.get("Maps_API_KEY")

# # --- Helper Functions (Core Logic) ---

# def geocode_location(location_name: str) -> Optional[Dict[str, float]]:
#     """Geocodes a location name to lat/lng using Nominatim."""
#     try:
#         location = geolocator.geocode(location_name, timeout=5)
#         if location:
#             print(f"Geocoded '{location_name}' to {location.latitude}, {location.longitude}")
#             return {"latitude": location.latitude, "longitude": location.longitude}
#         print(f"Could not geocode '{location_name}'")
#         return None
#     except (GeocoderTimedOut, GeocoderServiceError) as e:
#         print(f"Geocoding service error for '{location_name}': {e}")
#         return None

# def extract_locations_with_timestamps(transcribed_text: str) -> List[Dict]:
#     """
#     Extracts locations and their approximate timestamps from transcribed text.
#     Assumes timestamps are in format [S] or [MM:SS] in the text.
#     """
#     doc = nlp(transcribed_text)
#     locations = []
    
#     # Regex to find timestamps and associated text segments
#     time_text_pairs = re.findall(r"\[(\d{1,2}:\d{2}|\d+)\]\s*(.*?)(?=\[\d|$)", transcribed_text, re.DOTALL)

#     for time_str, text_segment in time_text_pairs:
#         # Convert timestamp to seconds
#         if ':' in time_str:
#             parts = time_str.split(':')
#             seconds_offset = int(parts[0]) * 60 + int(parts[1])
#         else:
#             seconds_offset = int(time_str)
        
#         segment_doc = nlp(text_segment)
#         for ent in segment_doc.ents:
#             # Broad set of entity labels that might indicate a place or landmark
#             if ent.label_ in ["GPE", "LOC", "ORG", "FACILITY", "NORP", "PRODUCT"]:
#                 # Basic filtering: Ignore very short names or pure numbers
#                 if len(ent.text) > 2 and not ent.text.strip().isdigit():
#                     loc_data = geocode_location(ent.text)
#                     if loc_data:
#                         locations.append({
#                             "name": ent.text,
#                             "latitude": loc_data["latitude"],
#                             "longitude": loc_data["longitude"],
#                             "time_offset_seconds": seconds_offset
#                         })
    
#     # Deduplicate locations and sort by time offset
#     seen_locations = set()
#     unique_locations = []
#     for loc in locations:
#         loc_key = (loc["name"], loc["latitude"], loc["longitude"]) # Use tuple for uniqueness check
#         if loc_key not in seen_locations:
#             unique_locations.append(loc)
#             seen_locations.add(loc_key)

#     unique_locations.sort(key=lambda x: x["time_offset_seconds"])
#     return unique_locations


# def get_google_directions_data(
#     start_lat: float, start_lng: float,
#     end_lat: float, end_lng: float,
#     travel_mode: str = "driving"
# ) -> Optional[Dict]:
#     """
#     Calls Google Directions API to get path polyline, duration, and distance.
#     """
#     if not Maps_API_KEY:
#         print("Maps_API_KEY is not set in environment variables.")
#         return None

#     base_url = "https://maps.googleapis.com/maps/api/directions/json"
#     params = {
#         "origin": f"{start_lat},{start_lng}",
#         "destination": f"{end_lat},{end_lng}",
#         "mode": travel_mode.lower(),
#         "key": Maps_API_KEY,
#         "overview_polyline": "encode"
#     }

#     try:
#         response = requests.get(base_url, params=params)
#         response.raise_for_status() # Raises HTTPError for bad responses (4xx or 5xx)
#         data = response.json()

#         if data["status"] == "OK" and data["routes"]:
#             encoded_polyline = data["routes"][0]["overview_polyline"]["points"]
            
#             duration_seconds = None
#             if data["routes"][0]["legs"]: # A route can have multiple legs
#                 duration_seconds = data["routes"][0]["legs"][0]["duration"]["value"]

#             return {
#                 "path_polyline": encoded_polyline,
#                 "duration_seconds": duration_seconds,
#             }
#         elif data["status"] == "ZERO_RESULTS":
#             print(f"No route found for {start_lat},{start_lng} to {end_lat},{end_lng}.")
#             return None
#         else:
#             print(f"Directions API Error (Status: {data['status']}): {data.get('error_message', 'Unknown error')}")
#             return None

#     except requests.exceptions.RequestException as e:
#         print(f"HTTP Request to Google Directions API failed: {e}")
#         return None

# # Import Pydantic models for proper type hinting of the return type
# from geospatial_service.app.schemas import GeospatialCommandResponse, GeospatialCommandData 

# def generate_geospatial_commands(video_id: str, locations: List[Dict], video_duration: float) -> List[GeospatialCommandResponse]:
#     """
#     Generates a list of geospatial command objects (Pydantic models) from extracted locations.
#     Infers 'move' commands between sequential locations and 'place_marker' at each stop.
#     """
#     commands: List[GeospatialCommandResponse] = []
    
#     # Add initial marker for the first mentioned location if available
#     if locations:
#         first_loc = locations[0]
#         commands.append(
#             GeospatialCommandResponse(
#                 command_id=str(uuid4()),
#                 video_id=video_id,
#                 command_type="place_marker",
#                 start_time_offset_seconds=float(first_loc["time_offset_seconds"]),
#                 command_data_json=GeospatialCommandData(
#                     latitude=first_loc["latitude"],
#                     longitude=first_loc["longitude"],
#                     marker_id=f"{first_loc['name'].lower().replace(' ', '_')}_start",
#                     label=f"{first_loc['name']} (Start)"
#                 ),
#                 generated_at=datetime.utcnow() # Set current time
#             )
#         )

#     # Infer 'move' commands and subsequent 'place_marker' commands
#     for i in range(len(locations) - 1):
#         start_loc = locations[i]
#         end_loc = locations[i+1]

#         # Get directions for the move segment
#         directions_data = get_google_directions_data(
#             start_loc["latitude"], start_loc["longitude"],
#             end_loc["latitude"], end_loc["longitude"],
#             travel_mode="driving" # Defaulting to driving for road trip
#         )

#         if directions_data and directions_data["path_polyline"]:
#             # Determine animation start and end times within the video
#             # Start the move animation a short while after the previous location is mentioned
#             # End when the next location is mentioned or just before
            
#             move_start_time_video = float(start_loc["time_offset_seconds"]) + 10 # Start 10s after previous mention
#             move_end_time_video = float(end_loc["time_offset_seconds"])

#             # Ensure animation duration on map is proportional to video segment
#             # If the video segment (move_end_time_video - move_start_time_video) is too short
#             # compared to actual map duration, the animation will be very fast.
#             # You might want to cap `move_end_time_video` at `video_duration`
#             # or cap the animation duration for very long actual travel times.

#             # Basic sanity check: Ensure animation starts before it ends in video timeline
#             if move_start_time_video >= move_end_time_video:
#                 move_start_time_video = float(start_loc["time_offset_seconds"]) # Reset to mention time
#                 move_end_time_video = min(video_duration, move_start_time_video + 30) # At least 30s animation or video end


#             commands.append(
#                 GeospatialCommandResponse(
#                     command_id=str(uuid4()),
#                     video_id=video_id,
#                     command_type="move",
#                     start_time_offset_seconds=move_start_time_video,
#                     end_time_offset_seconds=move_end_time_video,
#                     command_data_json=GeospatialCommandData(
#                         entity_id="traveler_marker", # Consistent ID for the moving entity
#                         start_location={"latitude": start_loc["latitude"], "longitude": start_loc["longitude"]},
#                         end_location={"latitude": end_loc["latitude"], "longitude": end_loc["longitude"]},
#                         duration_seconds_on_map=float(directions_data["duration_seconds"]), # Actual travel time on map
#                         animation_style="road_path",
#                         travel_mode="driving",
#                         path_polyline=directions_data["path_polyline"]
#                     ),
#                     generated_at=datetime.utcnow()
#                 )
#             )
            
#             # Create a 'place_marker' command for the destination of this leg, at its mention time
#             commands.append(
#                 GeospatialCommandResponse(
#                     command_id=str(uuid4()),
#                     video_id=video_id,
#                     command_type="place_marker",
#                     start_time_offset_seconds=float(end_loc["time_offset_seconds"]),
#                     end_time_offset_seconds=None, # Stays on map
#                     command_data_json=GeospatialCommandData(
#                         latitude=end_loc["latitude"],
#                         longitude=end_loc["longitude"],
#                         marker_id=f"{end_loc['name'].lower().replace(' ', '_')}_arrival",
#                         label=f"{end_loc['name']} (Arrival)"
#                     ),
#                     generated_at=datetime.utcnow()
#                 )
#             )
    
#     # Sort all generated commands by their start time offset
#     commands.sort(key=lambda x: x.start_time_offset_seconds)
#     return commands