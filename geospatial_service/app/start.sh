#!/bin/bash
cd /path/to/your/geospatial_service # Adjust this path if running from elsewhere
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 5001 --reload