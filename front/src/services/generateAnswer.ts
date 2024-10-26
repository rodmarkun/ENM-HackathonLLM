import { Ticket } from "@/types";

export async function generateAnswer(ticket: Ticket) {
  try {
    await fetch("/api/generate-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ticket: ticket }),
    });
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
