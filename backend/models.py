import requests
import constants

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
    
def query_mistral_template(ticket_payload, context):
    context_str = f"COMPANY CONTEXT: {context} " if context else ""
    prompt = f"{context_str}TICKET DESCRIPTION: {ticket_payload['description']} GENERATE A RESPONSE NOW:"
    payload, headers = generate_mistral_payload(prompt, constants.MISTRAL_TEMPLATE_AGENT_ID)
    try:
        response = requests.post(constants.MISTRAL_API_ENDPOINT, headers=headers, json=payload)
        if response.status_code != 200:
            raise Exception(f"Response {response} gave status code {response.status_code}")
        response_json = response.json()
        template = response_json['choices'][0]['message']['content']
        return template, response.status_code
    except requests.RequestException as e:
        print(f"Error making request: {e}")
        raise

def query_mistral_category(ticket_payload):
    prompt = f"TICKET DESCRIPTION: {ticket_payload['description']} AVAILABLE CATEGORIES: {constants.TICKET_CATEGORIES} SELECT EXACTLY ONE CATEGORY GIVEN THE DESCRIPTION:"
    payload, headers = generate_mistral_payload(prompt, constants.MISTRAL_CATEGORIZER_AGENT_ID)
    try:
        response = requests.post(constants.MISTRAL_API_ENDPOINT, headers=headers, json=payload)
        if response.status_code != 200:
            raise Exception(f"Response {response} gave status code {response.status_code}")
        response_json = response.json()
        category = response_json['choices'][0]['message']['content']
        return category, response.status_code
    except requests.RequestException as e:
        print(f"Error making request: {e}")
        raise

def query_mistral_priority(ticket_payload):
    prompt = f"TICKET DESCRIPTION: {ticket_payload['description']} AVAILABLE PRIORITIES: {constants.TICKET_PRIORITIES} SELECT EXACTLY ONE PRIORITY GIVEN THE DESCRIPTION:"
    payload, headers = generate_mistral_payload(prompt, constants.MISTRAL_PRIORITY_AGENT_ID)
    try:
        response = requests.post(constants.MISTRAL_API_ENDPOINT, headers=headers, json=payload)
        if response.status_code != 200:
            raise Exception(f"Response {response} gave status code {response.status_code} | {response.text}")
        response_json = response.json()
        category = response_json['choices'][0]['message']['content']
        return category, response.status_code
    except requests.RequestException as e:
        print(f"Error making request: {e}")
        raise

def generate_mistral_payload(prompt, agent_id):
    return {
    "max_tokens": 1800,
    "stream": False,
    "stop": "string",
    "random_seed": 0,
    "messages": [
        {
        "role": "user",
        "content": f"{prompt}"
        }
    ],
    "tools": [
        {
        "type": "function",
        "function": {
            "name": "string",
            "description": "",
            "parameters": {}
        }
        }
    ],
    "tool_choice": "auto",
    "agent_id": f"{agent_id}"
    }, {
        "Authorization": f"Bearer {constants.MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }