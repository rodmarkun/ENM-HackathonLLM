import { Ticket } from "@/types";

type TicketProps = {
  data: Ticket;
};

export default function TicketCard({ data }: TicketProps) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-foreground text-text rounded-md shadow-md">
      <div className="col-span-1 flex flex-col space-y-2">
        <p className="text-lg font-bold">{data.subject}</p>
        <p className="">By: {data.name}</p>
      </div>

      <div className="col-span-1 flex flex-col space-y-2">
        <p className="">{data.description}</p>
        <p className="text-sm ">Category: {data.category}</p>
      </div>

      <div className="col-span-1 flex flex-col space-y-2 items-start">
        <p
          className={`px-2 py-1 text-sm rounded ${
            data.status === "in_progress"
              ? "bg-yellow-200 text-yellow-800"
              : data.status === "open"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {data.status.replace("_", " ")}
        </p>
        <p className="text-sm text-gray-500">
          Sentiment:{" "}
          {data.sentiment.charAt(0).toUpperCase() + data.sentiment.slice(1)}
        </p>
        <p className="text-sm text-gray-500">
          Created: {new Date(data.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
