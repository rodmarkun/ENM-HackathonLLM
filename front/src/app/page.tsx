import Navbar from "@/components/Navbar";
import TicketCard from "@/components/Ticket";
import { Ticket } from "@/types";

export default function Home() {
  const mockTickets: Ticket[] = [
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
  return (
    <div className="h-screen flex flex-col gap-4">
      <Navbar />
      <div className="w-full h-full flex flex-col gap-2 border p-4 rounded-t-md">
        <div className="w-full border">Otro bar</div>
        <div className="w-full h-full flex flex-col gap-2 border">
          {mockTickets.map((x, i) => (
            <TicketCard key={i} data={x} />
          ))}
        </div>
      </div>
    </div>
  );
}
