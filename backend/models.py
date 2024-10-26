import requests
import constants
import ticket_cluster

cluster_manager = ticket_cluster.initialize_clustering()

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
    
def query_mistral(ticket_payload, context = None, strategy = 'autoAnswer'):
    previous_solutions = cluster_manager.process_ticket(ticket_payload.to_dict())
    
    # Build context string with similar tickets if available
    context_str = f"COMPANY CONTEXT: {context} " if context else ""
    if previous_solutions['similar_tickets']:
        context_str += "\nSIMILAR CASES:\n"
        for i, ticket in enumerate(previous_solutions['similar_tickets'], 1):
            context_str += f"""
Case {i}:
Problem: {ticket['description']}
Solution: {ticket['answer']}
---"""
    
    # Build the final prompt
    prompt = f"{context_str}\nTICKET DESCRIPTION: {ticket_payload['description']}\nGENERATE A {'TEMPLATED' if strategy == 'template' else 'AUTOMATED'} RESPONSE NOW:"
    print("FINAL PROMPT: ", prompt)
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