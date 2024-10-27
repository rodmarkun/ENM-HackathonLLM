"use client";

import Navbar from "@/components/Navbar";
import TemplateInput from "@/components/Template/TemplateInput";
import { getAnswerById, getIndividualTicket } from "@/services/db";
import { Answer, Ticket } from "@/types";
import { notFound, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Template() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [answerTicket, setAnswerTicket] = useState<Answer>();
  const pathname = usePathname();
  const ticketId = parseInt(pathname.replace("/template/", ""));

  useEffect(() => {
    if (!ticketId) {
      notFound();
    }

    const fetchTicket = async () => {
      try {
        const fetchedTicket = await getIndividualTicket(ticketId);
        setTicket(fetchedTicket);
        const fetchedAnswer = await getAnswerById(ticketId);
        setAnswerTicket(fetchedAnswer);
        console.log("Fetched ticket:", fetchedAnswer.answer);
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
        notFound();
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleClose = () => {
    console.log("Close button clicked");
  };

  // Loading state
  if (!ticket || !answerTicket) {
    return <div>Loading...</div>;
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
