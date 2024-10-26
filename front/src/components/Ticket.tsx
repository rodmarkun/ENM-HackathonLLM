"use client";

import { cn, shortendDescription } from "@/lib/utils";
import { Ticket } from "@/types";
import { useRouter } from "next/navigation";

type TicketProps = {
  ticket: Ticket;
};

export default function TicketCard({ ticket }: TicketProps) {
  const router = useRouter();

  return (
    <tr
      key={ticket.id}
      onClick={() => router.push(`/template/${ticket.id}`)}
      className="border-b border-text hover:opacity-70 hover:cursor-pointer"
    >
      <td className="py-3 px-6 text-left font-medium">{ticket.subject}</td>
      <td className="py-3 px-6 text-left">{ticket.name}</td>
      <td className="py-3 px-6 text-left">
        {shortendDescription(ticket.description, 15)}
      </td>
      <td className="py-3 px-6 text-left">{ticket.category}</td>
      <td className="py-3 px-6 text-left">
        <span
          className={cn(
            "px-2 py-1 rounded whitespace-nowrap",
            ticket.status === "inProgress" && "bg-yellow-200 text-yellow-800",
            ticket.status === "open" && "bg-green-200 text-green-800",
            ticket.status === "closed" && "bg-red-200 text-red-800"
          )}
        >
          {ticket.status}
        </span>
      </td>
      <td className="py-3 px-6 text-left">
        {ticket.sentiment.charAt(0).toUpperCase() + ticket.sentiment.slice(1)}
      </td>
      <td className="py-3 px-6 text-left">
        {new Date(ticket.created_at).toLocaleString()}
      </td>
    </tr>
  );
}
