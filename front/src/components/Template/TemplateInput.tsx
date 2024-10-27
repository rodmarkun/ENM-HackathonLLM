import React, { useEffect, useState } from "react";
import type { Answer, Ticket } from "@/types";
import { cn, getPriorityClasses, getStatusClasses } from "@/lib/utils";

interface Props {
  ticket: Ticket;
  answer: string;
  onClose: () => void;
  onSendAnswer: (message: string) => void;
}

export default function TemplateInput({
  ticket,
  answer,
  onClose,
  onSendAnswer,
}: Props) {
  const [response, setResponse] = useState(answer);

  return (
    <div className="flex h-full w-full rounded-t-md border-2 border-b-0 bg-foreground text-text shadow-lg">
      <div className="flex flex-1 flex-col gap-6 p-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-semibold",
                  getStatusClasses(ticket.status)
                )}
              >
                {ticket.status}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-semibold",
                  getPriorityClasses(ticket.priority)
                )}
              >
                {ticket.priority} priority
              </span>
              <span className="text-sm text-muted">
                {new Date(ticket.created_at).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-xl font-semibold">{ticket.subject}</h2>
            <p className="text-sm text-muted">
              From: {ticket.name} ({ticket.email})
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-muted pt-4">
          <h3 className="text-lg font-semibold">Ticket Description</h3>
          <p className="whitespace-pre-wrap text-sm">{ticket.description}</p>
        </div>

        <div className="flex flex-col gap-4 border-t border-muted pt-4">
          <h3 className="text-lg font-semibold">Template Edit</h3>
        </div>

        <div className="flex flex-col gap-4 border-t border-muted pt-4">
          <textarea
            className="w-full rounded-lg border border-muted bg-background p-4 text-text"
            placeholder="Write your response here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={6}
          />
        </div>
      </div>

      <div className="flex flex-col w-1/4 gap-6 rounded-tr-md border-l border-muted bg-background p-6">
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-sm font-semibold">Sentiment Display</h3>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-6 w-6 rounded-full",
                ticket.sentiment === "positive" ? "bg-green-500" : "bg-muted"
              )}
            />
            <div
              className={cn(
                "h-6 w-6 rounded-full",
                ticket.sentiment === "neutral" ? "bg-yellow-500" : "bg-muted"
              )}
            />
            <div
              className={cn(
                "h-6 w-6 rounded-full",
                ticket.sentiment === "negative" ? "bg-red-500" : "bg-muted"
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <button
            className="w-full rounded-lg bg-accent py-2 px-4 font-medium text-text hover:bg-blue-600 transition-colors"
            onClick={() => onSendAnswer(response)}
          >
            Send Answer
          </button>
          <button
            className="w-full rounded-lg bg-red-500 py-2 px-4 font-medium text-text hover:bg-red-600 transition-colors"
            onClick={onClose}
          >
            Close Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
