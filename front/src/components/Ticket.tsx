"use client"

import { Ticket } from "@/types";
import { useRouter } from 'next/navigation'


type TicketProps = {
  ticket: Ticket;
};

export default function TicketCard({ ticket }: TicketProps) {
  const router = useRouter()
  // Handler for when a ticket card is clicked
  const handleClick = (id: number) => {
    router.push('/template')
    console.log('Click on ticket with ID:', id);
  };

  return (
    <tr
      key={ticket.id}
      onClick={() => handleClick(ticket.id)}
      className="border-b border-gray-200 hover:opacity-70 hover:cursor-pointer"
    >
      <td className="py-3 px-6 text-left font-medium">
        {ticket.subject}
      </td>
      <td className="py-3 px-6 text-left">{ticket.name}</td>
      <td className="py-3 px-6 text-left">{ticket.description}</td>
      <td className="py-3 px-6 text-left">{ticket.category}</td>
      <td className="py-3 px-6 text-left">
        <span
          className={`px-2 py-1 rounded ${
            ticket.status === "in_progress"
              ? "bg-yellow-200 text-yellow-800"
              : ticket.status === "open"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {ticket.status.replace("_", " ")}
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