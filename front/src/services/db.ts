import { Ticket } from "@/types";

export async function getAllTickets(): Promise<Ticket[]> {
  const res = await fetch("/api/database/get-all-tickets", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tickets.");
  }

  const tickets = await res.json(); // Parse the JSON response
  console.log("CLIENT TICKETS: ", tickets);
  return tickets; // Return tickets as an array directly
}
