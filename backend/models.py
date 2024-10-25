import requests
import constants
import runpod

def query_sentiment(ticket_payload):
    description = ticket_payload.get("description", None)
    if description:
        payload = {"inputs": description}
        response = requests.post(constants.SENTIMENT_ANALYSIS_MODEL, headers=constants.HF_HEADERS, json=payload)
        most_probable = max(response.json()[0], key=lambda x: x['score'])
        return most_probable['label'], most_probable['score']
    else:
        print("WARNING - Could not get field -description- from Ticket")
        return None, None
    
def query_language(ticket_payload):
    description = ticket_payload.get("description", None)
    if description:
        payload = {"inputs": description}
        response = requests.post(constants.LANGUAGE_IDENTIFICATION_MODEL, headers=constants.HF_HEADERS, json=payload)
        most_probable = max(response.json()[0], key=lambda x: x['score'])
        return most_probable['label'], most_probable['score']
    else:
        print("WARNING - Could not get field -description- from Ticket")
        return None, None
    
def query_mistral(prompt):
    return runpod.run(f"<s>[INST] {prompt}[/INST]")