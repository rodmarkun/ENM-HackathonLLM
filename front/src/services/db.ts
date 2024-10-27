import { Ticket } from "@/types";

export async function getAllTickets(): Promise<Ticket[]> {
  const res = await fetch("/api/database/get-all-tickets", {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tickets.");
  }

  const tickets = await res.json(); // Parse the JSON response
  return tickets; // Return tickets as an array directly
}

export async function getIndividualTicket(ticketId: number): Promise<Ticket> {
  const response = await fetch(`/api/database/get-ticket/${ticketId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return response.json();
}

export async function getAnswerById(ticketId: number) {
  const response = await fetch(`/api/database/get-answer/${ticketId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return response.json();
}
