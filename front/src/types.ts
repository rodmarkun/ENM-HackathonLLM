export type Ticket = {
  id: number;
  name: string;
  email: string;
  subject: string;
  description: string;
  created_at: string;
  updated_at: string;
  language: string;
  status: "open" | "inProgress" | "closed";
  category: "technical" | "billing" | "support";
  sentiment: "positive" | "neutral" | "negative";
  strategy: "template" | "autoAnswer";
  priority: "low" | "mid" | "high";
};

export type Answer = {
  id: number;
  ticket_id: number;
  created_at: string;
  updated_at: string;
  answer: string;
};

export interface SortConfig {
  key: keyof Ticket | null;
  direction: "asc" | "desc";
}

export interface TableHeader {
  label: string;
  sortKey: keyof Ticket | null;
}
