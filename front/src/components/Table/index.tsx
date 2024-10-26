import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { SortConfig, Ticket } from "@/types";
import TicketCard from "../Ticket";
import { useRules } from "@/context/RulesContext";
import { generateAnswer } from "@/services/generateAnswer";
import { getAllTickets } from "@/services/db";
import { headers } from "@/consts";

type Props = {
  activeView: "tickets" | "answered";
};

export default function Table({ activeView }: Props) {
  const { rules } = useRules();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Keep track of previously processed ticket IDs
  const processedTicketIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    async function fetchTickets() {
      const _tickets = await getAllTickets();
      // console.log("Tickets: ", _tickets);
      setTickets(_tickets);
    }

    fetchTickets();
  }, []);

  const updatedTickets = tickets.map((ticket) => {
    const matchingRule = rules.find(
      (rule) => ticket[rule.property] === rule.value
    );
    return matchingRule
      ? { ...ticket, strategy: matchingRule.strategy }
      : ticket;
  });

  const sortedTickets = [...updatedTickets].sort((a, b) => {
    if (sortConfig.key) {
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
    }
    return 0;
  });

  function handleSort(key: keyof Ticket) {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }

  const templateStratTickets = sortedTickets.filter(
    (ticket) => ticket.strategy === "template"
  );
  const autoAnswerStratTickets = sortedTickets.filter(
    (ticket) => ticket.strategy === "autoAnswer"
  );

  // Process new autoAnswer tickets whenever rules or tickets change
  useEffect(() => {
    async function processNewAutoAnswerTickets() {
      try {
        const newAutoAnswerTickets = autoAnswerStratTickets.filter(
          (ticket) => !processedTicketIds.current.has(ticket.created_at)
        );

        if (newAutoAnswerTickets.length > 0) {
          await Promise.all(
            newAutoAnswerTickets.map((ticket) => generateAnswer(ticket)) 
          );

          // Add newly processed tickets to the set
          newAutoAnswerTickets.forEach((ticket) => {
            processedTicketIds.current.add(ticket.created_at);
          });
        }
      } catch (error) {
        console.error("Error in generating answers for tickets:", error);
      }
    }

    processNewAutoAnswerTickets();
  }, [rules]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-background text-text text-sm uppercase leading-normal">
            {headers.map((header) => (
              <th
                key={header.label}
                className={cn(
                  "py-3 px-6 text-left",
                  header.sortKey && "cursor-pointer"
                )}
                onClick={() => header.sortKey && handleSort(header.sortKey)}
              >
                <span className="flex items-center">
                  {header.label}
                  {header.sortKey && (
                    <span
                      className={cn(
                        "ml-1 transition-transform duration-200",
                        sortConfig.key === header.sortKey &&
                          sortConfig.direction === "asc" &&
                          "rotate-180"
                      )}
                    >
                      {"\u25B2"}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-foreground text-text text-sm font-light">
          {activeView === "tickets"
            ? templateStratTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            : autoAnswerStratTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
        </tbody>
      </table>
    </div>
  );
}
