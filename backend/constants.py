import os

"""
///////////////
/// TICKETS ///
///////////////
"""
# Required fields for creating a new Ticket
TICKET_REQUIRED_FIELDS = ['name', 'email', 'subject', 'description', 'language', 'category', 'strategy'] 

DEFAULT_TICKET_STATUS = 'open'
TICKET_STATUSES = ['open', 'inProgress', 'closed']

TICKET_CATEGORIES = ['technical', 'support', 'billing']

DEFAULT_TICKET_SENTIMENT = 'neutral'
TICKET_SENTIMENTS = ['positive', 'negative', 'neutral']

TICKET_STRATEGIES = ['template', 'autoAnswer']

DEFAULT_TICKET_PRIORITY = 'low'
TICKET_PRIORITIES = ['low', 'mid', 'high']

"""
//////////////
/// MODELS ///
//////////////
"""
SENTIMENT_ANALYSIS_MODEL = "https://api-inference.huggingface.co/models/lxyuan/distilbert-base-multilingual-cased-sentiments-student"
LANGUAGE_IDENTIFICATION_MODEL = "https://api-inference.huggingface.co/models/facebook/fasttext-language-identification"

MISTRAL_API_ENDPOINT = "https://api.mistral.ai/v1/agents/completions"
MISTRAL_TEMPLATE_AGENT_ID = "ag:fc4e91ab:20241026:hackathonllm:07fc6cf1"
MISTRAL_CATEGORIZER_AGENT_ID = "ag:fc4e91ab:20241026:ticketcategorizer:245e9828"
MISTRAL_PRIORITY_AGENT_ID = "ag:fc4e91ab:20241026:untitled-agent:592cd06d"

"""
//////////
/// S3 ///
//////////
"""
S3_BUCKET_NAME = "hackathon-enm"

"""
////////////////
/// API KEYS ///
////////////////
"""
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
HF_HEADERS = {"Authorization": f"Bearer {os.getenv('HF_TOKEN')}"}