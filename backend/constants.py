import os

"""
///////////////
/// TICKETS ///
///////////////
"""
# Required fields for creating a new Ticket
TICKET_REQUIRED_FIELDS = ['name', 'email', 'subject', 'description', 'language', 'category', 'strategy'] 

DEFAULT_TICKET_STATUS = 'open'
TICKET_STATUSES = ['open', 'in_progress', 'closed']

TICKET_CATEGORIES = ['technical', 'account', 'billing']

DEFAULT_TICKET_SENTIMENT = 'unknown'
TICKET_SENTIMENTS = ['happy', 'angry', 'frustrated', 'confused', 'neutral']

TICKET_STRATEGIES = ['template', 'auto-answer']

DEFAULT_TICKET_PRIORITY = 'low'
TICKET_PRIORITIES = ['low', 'mid', 'high']

"""
//////////////
/// MODELS ///
//////////////
"""
SENTIMENT_ANALYSIS_MODEL = "https://api-inference.huggingface.co/models/lxyuan/distilbert-base-multilingual-cased-sentiments-student"
LANGUAGE_IDENTIFICATION_MODEL = "https://api-inference.huggingface.co/models/facebook/fasttext-language-identification"

HF_HEADERS = {"Authorization": f"Bearer "}

RUNPOD_ENDPOINT = "odglf23hk4zsox"
RUNPOD_URL = f"https://api.runpod.ai/v2/{RUNPOD_ENDPOINT}/run"
RUNPOD_API_KEY = ""