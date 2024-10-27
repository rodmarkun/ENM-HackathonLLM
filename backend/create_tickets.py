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
            "id": 7,
            "name": "Carlos Rodriguez",
            "email": "carlos.r@example.com",
            "subject": "No llego el enlace para restablecer contraseña",
            "description": "Solicite restablecer mi contraseña hace 15 minutos pero aun no he recibido ningún correo. Ya revise la carpeta de spam."
        },
        {
            "id": 8,
            "name": "Maria Gonzalez",
            "email": "maria.g@example.com",
            "subject": "Correo de restablecimiento de contrasena no recibido",
            "description": "Esperando el correo para restablecer mi contrasena. Han pasado 20 minutos y no aparece en mi bandeja de entrada."
        },
        {
            "id": 9,
            "name": "Emma Davis",
            "email": "emma.d@example.com",
            "subject": "Payment Processing Failed",
            "description": "Trying to make a payment but my credit card keeps getting declined with an error."
        },
        {
            "id": 10,
            "name": "Tom Anderson",
            "email": "tom.a@example.com",
            "subject": "Mobile App Crash Issue",
            "description": "App crashes immediately when trying to upload my profile picture. Using latest version."
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