import Navbar from "@/components/Navbar";
import Ticket from "@/components/Ticket";
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
              < Ticket key={ ticket.id } ticket={ ticket } /> 
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
