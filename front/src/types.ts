export type Ticket = {
  id: number;
  name: string;
  email: string;
  subject: string;
  description: string;
  created_at: string;
  updated_at: string;
  language: string;
  status: "in_progress" | "open" | "closed";
  category: "technical" | "billing" | "support";
  sentiment: "positive" | "neutral" | "negative";
};
