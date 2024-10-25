import { Ticket } from "./types";

export const mockTickets: Ticket[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    subject: "Cannot access dashboard",
    description: "Updated description",
    created_at: "2024-10-25T21:42:23.802299",
    updated_at: "2024-10-25T21:52:30.108823",
    language: "en",
    status: "in_progress",
    category: "technical",
    sentiment: "neutral",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    subject: "Billing issue",
    description: "Charged twice this month.",
    created_at: "2024-10-24T15:30:12.987654",
    updated_at: "2024-10-25T10:45:23.456789",
    language: "en",
    status: "open",
    category: "billing",
    sentiment: "negative",
  },
];
