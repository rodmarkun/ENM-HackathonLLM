import peewee
import constants
from datetime import datetime
from typing import Dict, Optional

db = peewee.SqliteDatabase("backend/data/hackathon.db")

class BaseModel(peewee.Model):
    class Meta:
        database = db

class Ticket(BaseModel):
    id = peewee.AutoField()
    name = peewee.CharField(max_length=100) 
    email = peewee.CharField(max_length=255)  # Standard email length limit
    subject = peewee.CharField(max_length=300)  # Reasonable subject line length
    description = peewee.TextField()  # Use of TextField for longer content
    created_at = peewee.DateTimeField(default=datetime.now)
    updated_at = peewee.DateTimeField(default=datetime.now)
    language = peewee.CharField(max_length=35) 
    status = peewee.CharField(
        max_length=20,
        default=constants.DEFAULT_TICKET_STATUS,
        choices=constants.TICKET_STATUSES
    )
    category = peewee.CharField(
        max_length=50,
        choices=constants.TICKET_CATEGORIES
    )
    sentiment = peewee.CharField(
        max_length=20,
        default=constants.DEFAULT_TICKET_SENTIMENT,
        choices=constants.TICKET_SENTIMENTS
    )
    strategy = peewee.CharField(
        max_length=50,
        choices=constants.TICKET_STRATEGIES
    )
    priority = peewee.CharField(
        max_length=20,
        default=constants.DEFAULT_TICKET_PRIORITY,
        choices=constants.TICKET_PRIORITIES
    )

    @classmethod
    def get_ticket_as_json(cls, ticket_id: int) -> Dict:
        """
        Get a ticket by ID and return it as a JSON-compatible dictionary.
        
        Args:
            ticket_id (int): The ID of the ticket to retrieve
            
        Returns:
            Dict: Ticket data as a dictionary
            
        Raises:
            ValueError: If ticket with given ID is not found
        """
        try:
            ticket = cls.get_by_id(ticket_id)
            return ticket.to_dict()
        except peewee.DoesNotExist:
            raise ValueError(f"Ticket with id {ticket_id} not found")
    
    @classmethod
    def get_all_tickets_as_json(cls) -> list[Dict]:
        """
        Get all tickets and return them as a list of JSON-compatible dictionaries.
        
        Returns:
            list[Dict]: List of ticket data dictionaries
        """
        tickets = cls.select()
        return [ticket.to_dict() for ticket in tickets]

    @classmethod
    def create_or_update_from_json(cls, ticket_data: Dict, ticket_id: Optional[int] = None) -> 'Ticket':
        """
        Create or update a ticket from JSON data.
        
        Args:
            ticket_data (Dict): JSON data containing ticket information
            ticket_id (Optional[int]): If provided, updates existing ticket; if None, creates new ticket
            
        Returns:
            Ticket: Created or updated ticket instance
            
        Raises:
            peewee.DoesNotExist: If ticket_id is provided but ticket not found
            peewee.IntegrityError: If required fields are missing or validation fails
        """
        try:
            # Validate required fields for new tickets
            if not ticket_id:
                required_fields = constants.TICKET_REQUIRED_FIELDS
                missing_fields = [field for field in required_fields if field not in ticket_data]
                if missing_fields:
                    raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

            # Clean and prepare the data
            ticket_dict = {
                'updated_at': datetime.now()
            }

            # Map JSON fields to model fields
            field_mapping = {
                'name': str,
                'email': str,
                'subject': str,
                'description': str,
                'language': str,
                'status': str,
                'category': str,
                'sentiment': str,
                'strategy': str,
                'priority': str
            }

            # Process each field in the JSON data
            for field, field_type in field_mapping.items():
                if field in ticket_data:
                    value = ticket_data[field]
                    # Type conversion and validation
                    ticket_dict[field] = field_type(value)

                    # Validate choices for fields with choices
                    if field == 'status' and value not in constants.TICKET_STATUSES:
                        raise ValueError(f"Invalid status: {value}")
                    elif field == 'category' and value not in constants.TICKET_CATEGORIES:
                        raise ValueError(f"Invalid category: {value}")
                    elif field == 'sentiment' and value not in constants.TICKET_SENTIMENTS:
                        raise ValueError(f"Invalid sentiment: {value}")
                    elif field == 'strategy' and value not in constants.TICKET_STRATEGIES:
                        raise ValueError(f"Invalid strategy: {value}")
                    elif field == 'priority' and value not in constants.TICKET_PRIORITIES:
                        raise ValueError(f"Invalid priority: {value}")

            with db.atomic():
                if ticket_id:
                    # Update existing ticket
                    query = cls.update(**ticket_dict).where(cls.id == ticket_id)
                    query.execute()
                    ticket = cls.get_by_id(ticket_id)
                else:
                    # Create new ticket
                    ticket_dict['created_at'] = datetime.now()
                    ticket = cls.create(**ticket_dict)

            return ticket

        except peewee.DoesNotExist:
            raise ValueError(f"Ticket with id {ticket_id} not found")
        except peewee.IntegrityError as e:
            raise ValueError(f"Database integrity error: {str(e)}")

    def to_dict(self) -> Dict:
        """Convert ticket instance to dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'language': self.language,
            'status': self.status,
            'category': self.category,
            'sentiment': self.sentiment,
            'strategy': self.strategy,
            'priority': self.priority
        }
    

if __name__ == '__main__':
    """Initialize the database and create tables."""
    try:
        # Connect to the database
        db.connect()
        
        # Create tables
        db.create_tables([Ticket], safe=True)
        
        print(f"Database initialized successfully.")
        print("Created tables: tickets")
            
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
    finally:
        # Close the connection
        if not db.is_closed():
            db.close()