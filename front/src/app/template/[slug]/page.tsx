"use client";

import { useEffect, useState, useTransition } from "react";
import { notFound, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import TemplateInput from "@/components/Template/TemplateInput";
import { getAnswerById, getIndividualTicket } from "@/services/db";
import { Answer, Ticket } from "@/types";
import { generateAnswer } from "@/services/generateAnswer";

export default function Template() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [answerTicket, setAnswerTicket] = useState<Answer | undefined>();
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const ticketId = parseInt(pathname.replace("/template/", ""));

  useEffect(() => {
    if (!ticketId) {
      notFound();
    }

    // Reset states when ticketId changes
    setTicket(null);
    setAnswerTicket(undefined);
    setError(null);

    async function fetchTicketData() {
      try {
        // Start the transition for fetching data
        startTransition(async () => {
          // Fetch both ticket and answer in parallel
          const _ticket = await getIndividualTicket(ticketId);
          setTicket(_ticket);

          if (_ticket.strategy === "template") {
            console.log("GENERA PARA LOS TEMPLATE");
            await generateAnswer(_ticket);
          } else {
            console.log("NO GENERA PARA LOS AUTOANSWERED");
          }

          const _answer = await getAnswerById(ticketId);
          console.log("SETEA EL ANSWER", _answer);
          setAnswerTicket(_answer);
        });
      } catch (err) {
        console.error("Failed to fetch ticket data:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch ticket data")
        );
        notFound();
      }
    }

    fetchTicketData();
  }, [ticketId]);

  const handleClose = () => {
    console.log("Close button clicked");
  };

  // Show loading state while transition is pending
  if (isPending) {
    return (
      <div className="h-screen flex flex-col gap-8 px-4 pt-2">
        <Navbar />
        <div className="flex items-center justify-center flex-grow">
          <div className="animate-pulse text-lg">Loading ticket data...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-screen flex flex-col gap-8 px-4 pt-2">
        <Navbar />
        <div className="flex items-center justify-center flex-grow text-red-500">
          {error.message}
        </div>
      </div>
    );
  }

  // Show loading state if data isn't ready
  if (!ticket || !answerTicket) {
    return (
      <div className="h-screen flex flex-col gap-8 px-4 pt-2">
        <Navbar />
        <div className="flex items-center justify-center flex-grow">
          <div className="animate-pulse text-lg">Initializing...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col gap-8 px-4 pt-2">
      <Navbar />
      <TemplateInput
        ticket={ticket}
        onClose={handleClose}
        answer={answerTicket.answer}
        onSendAnswer={() => {}}
      />
    </div>
  );
}
