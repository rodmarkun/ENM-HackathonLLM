from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import logging
from datetime import datetime, timedelta
from database import Ticket, Answer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TicketCluster:
    def __init__(
        self,
        cluster_id: str,
        embedding_model: SentenceTransformer,
        similarity_threshold: float = 0.55,
        max_cluster_age_hours: int = 24
    ):
        self.cluster_id = cluster_id
        self.ticket_ids: List[int] = []
        self.creation_time = datetime.now()
        self.last_update = datetime.now()
        self.embedding_model = embedding_model
        self.similarity_threshold = similarity_threshold
        self.max_cluster_age = timedelta(hours=max_cluster_age_hours)
        self.centroid: Optional[np.ndarray] = None
        
    def get_tickets(self) -> List[Dict]:
        """Get all tickets in the cluster."""
        return [Ticket.get_ticket_as_json(tid) for tid in self.ticket_ids]
    
    def get_successful_answers(self) -> List[Dict]:
        """Get answers from tickets in this cluster that were successful."""
        answers = []
        for tid in self.ticket_ids:
            answer = Answer.get_answer(tid)
            if answer:
                answers.append(answer)
        return answers
    
    def add_ticket(self, ticket: Dict) -> bool:
        """Add a ticket to the cluster if similar enough."""
        # Only use description for similarity comparison
        content = ticket['description']  
        embedding = self.embedding_model.encode([content])[0]
        
        # Check if this is the first ticket
        if self.centroid is None:
            self.centroid = embedding
            self._add_ticket(ticket['id'], embedding)
            print(f"First ticket in cluster {self.cluster_id}: {content[:100]}...")
            return True
            
        # Compare with existing centroid
        similarity = cosine_similarity([embedding], [self.centroid])[0][0]
        print(f"\nSimilarity Details for cluster {self.cluster_id}:")
        print(f"New ticket: {content[:100]}...")
        tickets = self.get_tickets()
        print(f"Existing tickets in cluster: {len(tickets)}")
        print(f"Sample ticket from cluster: {tickets[0]['description'][:100]}..." if tickets else "No tickets")
        print(f"Similarity score: {similarity:.3f} (threshold: {self.similarity_threshold})")
        
        if similarity >= self.similarity_threshold:
            self._add_ticket(ticket['id'], embedding)
            self._update_centroid()
            print(f"Added to cluster {self.cluster_id}")
            return True
        return False
    
    def _add_ticket(self, ticket_id: int, embedding: np.ndarray) -> None:
        """Add ticket to cluster and update metadata."""
        if ticket_id not in self.ticket_ids:
            self.ticket_ids.append(ticket_id)
            self.last_update = datetime.now()
            logger.info(f"Added ticket {ticket_id} to cluster {self.cluster_id}")
    
    def _update_centroid(self) -> None:
        """Update cluster centroid based on all tickets."""
        tickets = self.get_tickets()
        contents = [f"{t['description']}" for t in tickets]
        embeddings = self.embedding_model.encode(contents)
        self.centroid = np.mean(embeddings, axis=0)
    
    def get_context_for_answer(self, max_context_tickets: int = 3) -> Dict:
        """
        Get relevant context for answering tickets in this cluster.
        Only uses closed tickets as reference and limits the number of context tickets.
        """
        tickets = self.get_tickets()
        answers = self.get_successful_answers()
        
        # Filter for closed tickets with answers
        closed_tickets_with_answers = [
            {
                'subject': t['subject'],
                'description': t['description'],
                'category': t['category'],
                'answer': next((a['answer'] for a in answers if a['ticket_id'] == t['id']), None)
            }
            for t in tickets
            if t['status'] == 'closed' and
            any(a['ticket_id'] == t['id'] for a in answers)
        ]
        
        # Sort by most recent and limit
        limited_tickets = closed_tickets_with_answers[:max_context_tickets]
        
        return {
            'similar_tickets': limited_tickets,
            'common_category': max(
                set(t['category'] for t in tickets),
                key=lambda x: sum(1 for t in tickets if t['category'] == x)
            ) if tickets else None,
            'total_similar_cases': len(closed_tickets_with_answers)
        }
    
    def should_archive(self) -> bool:
        """Check if cluster should be archived based on age."""
        age = datetime.now() - self.creation_time
        return age >= self.max_cluster_age

class ClusterManager:
    def __init__(
        self,
        embedding_model: SentenceTransformer,
        similarity_threshold: float = 0.85
    ):
        self.clusters: List[TicketCluster] = []
        self.embedding_model = embedding_model
        self.similarity_threshold = similarity_threshold
    
    def process_ticket(self, ticket: Dict) -> Dict:
        """
        Process a new ticket and return context for generating an answer.
        """
        matching_cluster = None
        
        # Try to add to existing cluster
        for cluster in self.clusters[:]:
            if not cluster.should_archive():
                if cluster.add_ticket(ticket):
                    matching_cluster = cluster
                    break
            else:
                self.clusters.remove(cluster)
        
        # Create new cluster if no match found
        if not matching_cluster:
            matching_cluster = TicketCluster(
                cluster_id=f"cluster_{len(self.clusters)}",
                embedding_model=self.embedding_model,
                similarity_threshold=self.similarity_threshold
            )
            matching_cluster.add_ticket(ticket)
            self.clusters.append(matching_cluster)
        
        # Return context for answering
        return {
            'cluster_id': matching_cluster.cluster_id,
            **matching_cluster.get_context_for_answer()
        }
    
    def get_cluster_summary(self) -> List[Dict]:
        """Get summary of all active clusters."""
        return [{
            "cluster_id": c.cluster_id,
            "ticket_count": len(c.ticket_ids),
            "age_hours": (datetime.now() - c.creation_time).total_seconds() / 3600,
            "tickets": c.get_tickets()
        } for c in self.clusters if not c.should_archive()]

def initialize_clustering():
    """
    Initialize the clustering system and process all existing closed tickets.
    Use a higher similarity threshold for better clustering.
    """
    model = SentenceTransformer('all-MiniLM-L6-v2')
    # Use higher similarity threshold for both manager and clusters
    similarity_threshold = 0.7
    manager = ClusterManager(embedding_model=model, similarity_threshold=similarity_threshold)
    
    try:
        # Get all closed tickets from database that have answers
        all_tickets = Ticket.get_all_tickets_as_json()
        closed_tickets_with_answers = [
            t for t in all_tickets 
            if t['status'] == 'closed' and Answer.get_answer(t['id'])
        ]
        
        print(f"\nProcessing {len(closed_tickets_with_answers)} existing closed tickets with answers...")
        
        # Sort tickets by category to help with initial clustering
        closed_tickets_with_answers.sort(key=lambda x: x['category'])
        
        # Process each closed ticket through the clustering system
        for ticket in closed_tickets_with_answers:
            context = manager.process_ticket(ticket)
            print(f"\nProcessed ticket {ticket['id']} (Category: {ticket['category']}):")
            print(f"Description: {ticket['description'][:100]}...")
            print(f"Assigned to cluster: {context['cluster_id']}")
            
        # Print detailed cluster summary
        print("\nInitial Cluster Summary:")
        for cluster in manager.clusters:
            tickets = cluster.get_tickets()
            print(f"\nCluster {cluster.cluster_id}:")
            print(f"Total tickets: {len(cluster.ticket_ids)}")
            print(f"Categories: {set(t['category'] for t in tickets)}")
            print(f"Sample descriptions:")
            for t in tickets[:2]:  # Show first 2 tickets as samples
                print(f"- {t['description'][:100]}...")
        
        return manager
        
    except Exception as e:
        print(f"Error during initialization: {str(e)}")
        raise e

def get_answer_context(manager: ClusterManager, ticket_id: int) -> Optional[Dict]:
    """Get context for generating an answer for a ticket."""
    try:
        ticket_data = Ticket.get_ticket_as_json(ticket_id)
        context = manager.process_ticket(ticket_data)
        return context
        
    except Exception as e:
        logger.error(f"Error processing ticket {ticket_id}: {str(e)}")
        return None
    
def test_clustering_system():
    """Example of how to test the clustering system."""
    try:
        print("\n=== Initializing Clustering System ===")
        manager = initialize_clustering()
        
        print("\n=== Testing New Ticket ===")
        new_ticket_data = {
            "name": "Bob Wilson",
            "email": "bob@example.com",
            "subject": "Credit Card Payment Issue",  # More specific subject
            "description": "Hello, the system does not seem to be accepting my credit card. How can we solve this?",
            "language": "en",
            "status": "open",
            "category": "billing",
            "sentiment": "negative",
            "strategy": "autoAnswer",
            "priority": "high"
        }
        
        new_ticket = Ticket.create_or_update_from_json(new_ticket_data)
        print(f"\nCreated new ticket {new_ticket.id}:")
        print(f"Subject: {new_ticket_data['subject']}")
        print(f"Description: {new_ticket_data['description']}")
        print(f"Category: {new_ticket_data['category']}")
        
        context = manager.process_ticket(new_ticket.to_dict())
        
        print("\n=== Results ===")
        if context['similar_tickets']:
            print(f"\nFound {len(context['similar_tickets'])} similar tickets in cluster {context['cluster_id']}:")
            for ticket in context['similar_tickets']:
                print(f"\nSimilar Ticket:")
                print(f"Description: {ticket['description']}")
                print(f"Category: {ticket['category']}")
                print(f"Answer: {ticket['answer']}")
        else:
            print("\nNo similar tickets found")
        
        print(f"\nCommon Category: {context['common_category']}")
        print(f"Total Similar Cases: {context['total_similar_cases']}")

    except Exception as e:
        print(f"Error during testing: {str(e)}")
        raise e

if __name__ == "__main__":
    test_clustering_system()