from fastapi import FastAPI, File, UploadFile, HTTPException
from contextlib import asynccontextmanager
import uvicorn
import tempfile
import json
import os
import time
import s3
from typing import List, Dict

import models
from database import Ticket, db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handles startup and shutdown events"""
    # Startup: connect to database
    if db.is_closed():
        db.connect()
    yield
    # Shutdown: close database connection
    if not db.is_closed():
        db.close()

app = FastAPI(lifespan=lifespan)

@app.post("/ticket")
async def create_ticket(ticket: dict):
    """Process a new ticket with ML models and store it"""
    try:
        # Process ticket with ML models
        processed_ticket = process_ticket(ticket)
        
        # Create ticket in database
        ticket_obj = Ticket.create_or_update_from_json(processed_ticket)
        
        return ticket_obj.to_dict()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/ticket/{ticket_id}")
async def update_ticket(ticket_id: int, ticket: dict):
    """Update an existing ticket"""
    try:
        # Update ticket in database
        ticket_obj = Ticket.create_or_update_from_json(ticket, ticket_id)
        
        return ticket_obj.to_dict()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ticket/{ticket_id}")
async def get_ticket(ticket_id: int):
    """Retrieve a specific ticket by ID"""
    try:
        ticket = Ticket.get_ticket_as_json(ticket_id)
        return ticket
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/tickets")
async def get_all_tickets():
    """Retrieve all tickets"""
    try:
        tickets = Ticket.get_all_tickets_as_json()
        return tickets
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file to S3, overwriting any existing file"""
    try:
        content = await file.read()
        s3.s3_client.put_object(
            Bucket=s3.constants.S3_BUCKET_NAME,
            Key="message.txt",
            Body=content
        )
        return {"message": "File uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/context")
async def get_current_context():
    """Get the content of the only file in S3"""
    content = s3.get_context()
    if not content:
        raise HTTPException(status_code=404, detail="No file found in S3")
    return {"content": content}

@app.post("/answer_ticket")
async def generate_answer_ticket(ticket: dict):
    """Process a new ticket with ML models and store it"""
    try:
        if ticket.get('strategy') == 'template':
            template = models.query_mistral_template(ticket)
            return template
        else:
            auto_answer = models.query_mistral_template(ticket)
            # Auto-Answer to sent channel logic here
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def process_ticket(ticket_json: Dict) -> Dict:
    """Process ticket with ML models and return enriched ticket data"""
    print("Processing Sentiment...")
    sentiment, sentiment_confidence = models.query_sentiment(ticket_json)
    print("Processing Category...")
    category, code = models.query_mistral_category(ticket_json)
    print("Processing Priority...")
    time.sleep(2) # For avoiding request limits
    priority, code = models.query_mistral_priority(ticket_json)
    print("Processing Language...")
    language, language_confidence = models.query_language(ticket_json)
    print("Finished ticket processing")
    
    ticket_json['sentiment'] = sentiment
    ticket_json['category'] = category
    ticket_json['priority'] = priority
    ticket_json['language'] = language
    ticket_json['strategy'] = "template" if priority in ["high", "mid"] else "autoAnswer"
    
    return ticket_json

if __name__ == "__main__":
    # Create tables if they don't exist
    db.connect()
    db.create_tables([Ticket], safe=True)
    db.close()
    
    # Run the FastAPI app
    uvicorn.run(app, host="0.0.0.0", port=8000)