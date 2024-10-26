import requests
import json
from datetime import datetime
import time

def create_tickets():
    # API endpoint
    url = "http://localhost:8000/ticket"
    
    # List of tickets
    tickets = [
        {
            "id": 9,
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Payment Issue",
            "description": "I can't process my payment with my credit card. It keeps showing an error.",
            "language": "en",
            "category": "billing",
            "sentiment": "negative",
            "strategy": "autoAnswer",
            "priority": "high"
        },
        {
            "id": 10,
            "name": "Jane Smith",
            "email": "jane@example.com",
            "subject": "Template Request",
            "description": "Need help setting up my account. The verification email hasn't arrived.",
            "language": "en",
            "category": "technical",
            "sentiment": "neutral",
            "strategy": "template",
            "priority": "mid"
        }
    ]
    
    # Headers for JSON content
    headers = {
        "Content-Type": "application/json"
    }
    
    # Store responses
    responses = []
    
    for ticket in tickets:
        try:
            # Send POST request for each ticket
            response = requests.post(url, json=ticket, headers=headers)
            time.sleep(10)
            
            # Check if request was successful
            response.raise_for_status()
            
            # Print success message
            print(f"Ticket {ticket['id']} created successfully!")
            responses.append(response.json())
            
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred for ticket {ticket['id']}: {http_err}")
            print("Error details:", response.text)
        except requests.exceptions.ConnectionError as conn_err:
            print(f"Error connecting to server for ticket {ticket['id']}: {conn_err}")
        except Exception as err:
            print(f"An error occurred for ticket {ticket['id']}: {err}")
    
    return responses

if __name__ == "__main__":
    print("Starting to create tickets...")
    created_tickets = create_tickets()
    print(f"\nCreated {len(created_tickets)} tickets successfully!")