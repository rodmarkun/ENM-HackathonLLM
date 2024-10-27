import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { SortConfig, Ticket } from "@/types";
import TicketCard from "../TicketCard";
import { useRules } from "@/context/RulesContext";
import { generateAnswer } from "@/services/generateAnswer";
import { getAllTickets, getAnswerById } from "@/services/db";
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
  const processedTicketIds = useRef<Set<number>>(new Set());

  // Fetch tickets and process initial auto-answer tickets
  useEffect(() => {
    async function fetchAndProcessTickets() {
      try {
        const _tickets = await getAllTickets();
        setTickets(_tickets);

        // Process tickets that already have autoAnswer strategy
        const initialAutoAnswerTickets = _tickets.filter(
          (ticket) =>
            ticket.strategy === "autoAnswer" &&
            !processedTicketIds.current.has(ticket.id)
        );

        if (initialAutoAnswerTickets.length > 0) {
          console.log(
            `Processing ${initialAutoAnswerTickets.length} initial auto-answer tickets`
          );

          await Promise.all(
            initialAutoAnswerTickets.map(async (ticket) => {
              try {
                const existingAnswer = await getAnswerById(ticket.id);
                if (!existingAnswer) {
                  await generateAnswer(ticket);
                  console.log(`Generated new answer for ticket ${ticket.id}`);
                } else {
                  console.log(`Answer already exists for ticket ${ticket.id}`);
                }
                processedTicketIds.current.add(ticket.id);
              } catch (error) {
                console.error(`Error processing ticket ${ticket.id}:`, error);
              }
            })
          );
        }
      } catch (error) {
        console.error(
          "Error in fetching and processing initial tickets:",
          error
        );
      }
    }

    fetchAndProcessTickets();
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

  // Filter tickets based on their strategy
  const templateStratTickets = sortedTickets.filter(
    (ticket) => ticket.strategy === "template"
  );
  const autoAnswerStratTickets = sortedTickets.filter(
    (ticket) => ticket.strategy === "autoAnswer"
  );

  // Process new auto-answer tickets from rules changes
  useEffect(() => {
    async function processRuleBasedAutoAnswerTickets() {
      try {
        // Only process tickets that got autoAnswer strategy from rules
        const newAutoAnswerTickets = autoAnswerStratTickets.filter((ticket) => {
          const hadAutoAnswerInitially =
            tickets.find((t) => t.id === ticket.id)?.strategy === "autoAnswer";

          return (
            !hadAutoAnswerInitially &&
            !processedTicketIds.current.has(ticket.id)
          );
        });

        if (newAutoAnswerTickets.length > 0) {
          console.log(
            `Processing ${newAutoAnswerTickets.length} new rule-based auto-answer tickets`
          );

          await Promise.all(
            newAutoAnswerTickets.map(async (ticket) => {
              await generateAnswer(ticket);
              processedTicketIds.current.add(ticket.id);
            })
          );
        }
      } catch (error) {
        console.error(
          "Error in generating answers for rule-based tickets:",
          error
        );
      }
    }

    processRuleBasedAutoAnswerTickets();
  }, [autoAnswerStratTickets, tickets, rules]);

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
