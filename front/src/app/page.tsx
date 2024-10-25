import Navbar from "@/components/Navbar";
import { mockTickets } from "@/mocks";

export default function Home() {
  return (
    <div className="h-screen flex flex-col gap-4 px-4 pt-2">
      <Navbar />
      <div className="w-full h-full flex flex-col gap-2 border-2 border-b-0 p-4 rounded-t-md">
        <div className="w-full border text-right">Otro bar</div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md">
            <thead>
              <tr className="text-text bg-background uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Subject</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Sentiment</th>
                <th className="py-3 px-6 text-left">Created At</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light bg-foreground text-text">
              {mockTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-200 hover:opacity-70"
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
                    {ticket.sentiment.charAt(0).toUpperCase() +
                      ticket.sentiment.slice(1)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(ticket.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
