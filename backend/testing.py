import requests
import json
from typing import Dict, Tuple
import time

def test_answer_ticket(base_url: str = "http://localhost:8000") -> None:
    """Test the answer ticket endpoint with different scenarios."""
    
    def send_ticket(ticket_data: Dict) -> Tuple[Dict, int]:
        """Helper function to send ticket and get response"""
        endpoint = f"{base_url}/answer_ticket"
        response = requests.post(endpoint, json=ticket_data)
        return response.json(), response.status_code
    
    # Test cases
    test_tickets = [
        {
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
            "name": "Jane Smith",
            "email": "jane@example.com",
            "subject": "Template Request",
            "description": "Need help setting up my account. The verification email hasn't arrived.",
            "language": "en",
            "category": "technical",
            "sentiment": "neutral",
            "strategy": "template",
            "priority": "medium"
        }
    ]
    
    print("\n=== Testing Answer Ticket Endpoint ===\n")
    
    for i, ticket in enumerate(test_tickets, 1):
        try:
            print(f"\nTest Case {i}:")
            print(f"Strategy: {ticket['strategy']}")
            print(f"Category: {ticket['category']}")
            print(f"Description: {ticket['description']}")
            
            # Send request
            print("\nSending request...")
            start_time = time.time()
            response, status_code = send_ticket(ticket)
            duration = time.time() - start_time
            
            print(f"\nResponse (took {duration:.2f}s):")
            print(f"Status Code: {status_code}")
            print(f"Response: {json.dumps(response, indent=2)}")
            
            if status_code == 200:
                print("✅ Test passed")
            else:
                print("❌ Test failed")
                
            # Add delay between requests
            time.sleep(1)
            
        except Exception as e:
            print(f"❌ Error during test: {str(e)}")
            
        print("\n" + "="*50)

if __name__ == "__main__":
    # Configuration
    BASE_URL = "http://localhost:8000"  # Change this to match your server
    
    print(f"Testing against server: {BASE_URL}")
    test_answer_ticket(BASE_URL)