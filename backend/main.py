import database
import models

def process_ticket(ticket_json):
    sentiment, sentiment_confidence = models.query_sentiment(ticket_json)
    # CATEGORY
    # PRIORITY
    language, language_confidence = models.query_language(ticket_json)
    ticket_json['sentiment'] = sentiment
    ticket_json['language'] = language
    
    database.Ticket.create_or_update_from_json(ticket_json)

    return ticket_json

def main():
    pass

if __name__ == "__main__":
    main()