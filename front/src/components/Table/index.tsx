"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { mockTickets } from "@/mocks";
import type { Ticket } from "@/types";
import TicketCard from "../Ticket";
import { useRules } from "@/context/RulesContext";

interface SortConfig {
  key: keyof Ticket | null;
  direction: "asc" | "desc";
}

interface TableHeader {
  label: string;
  sortKey: keyof Ticket | null;
}

const headers: TableHeader[] = [
  { label: "Subject", sortKey: null },
  { label: "Name", sortKey: null },
  { label: "Description", sortKey: null },
  { label: "Category", sortKey: null },
  { label: "Status", sortKey: null },
  { label: "Sentiment", sortKey: "sentiment" },
  { label: "Created At", sortKey: "created_at" },
];

export default function Table() {
  const { rules } = useRules();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const updatedTickets = mockTickets.map((ticket) => {
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

  const handleSort = (key: keyof Ticket) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-background text-text text-sm uppercase leading-normal">
            {headers.map((header) => (
              <th
                key={header.label}
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => header.sortKey && handleSort(header.sortKey)}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-foreground text-text text-sm font-light">
          {sortedTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
