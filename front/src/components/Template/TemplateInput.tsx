import React from "react";
import type { Ticket } from "@/types";
import { cn, getStatusClasses } from "@/lib/utils";

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
}

// Maps`status` y `priority`
const statusClasses: { [key: string]: string } = {
  open: "bg-green-300",
  in_progress: "bg-yellow-300",
  closed: "bg-gray-300",
};

const priorityClasses: { [key: string]: string } = {
  low: "bg-yellow-300",
  mid: "bg-orange-300",
  high: "bg-red-300",
};

const TicketDetailView: React.FC<TicketDetailProps> = ({ ticket }) => {
  return (
    <div className="w-full border-2 h-full mb-4 mt-4 bg-foreground rounded-lg shadow-lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  "px-2 py-1 text-xs rounded-full font-semibold text-brown",
                  getStatusClasses(ticket.status)
                )}
              >
                {ticket?.status}
              </span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  priorityClasses[ticket.priority] || "bg-gray-300"
                }`}
              >
                {ticket?.priority} priority
              </span>
              <span className="text-sm text">
                {new Date(ticket?.created_at).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-xl font-semibold">{ticket?.subject}</h2>
          </div>
        </div>
        {/* Content */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <p className="text-sm pb-2 text">
              From: {ticket?.name} ({ticket?.email})
            </p>
          </div>
          <div className="whitespace-pre-wrap text">{ticket.subject}</div>

          <div className="border-b pb-2"></div>
          <div className="whitespace-pre-wrap text">
            <p>
              En una pequeña ciudad costera, rodeada por montañas verdes y
              bañada por el sol del mar, los habitantes vivían una vida
              tranquila y sencilla. La ciudad, conocida por sus calles
              empedradas y casas de colores, había sido hogar de generaciones de
              familias que llevaban consigo historias de tiempos remotos,
              leyendas sobre tesoros escondidos en las montañas y secretos
              transmitidos en susurros de generación en generación. Entre los
              habitantes se encontraba un anciano pescador llamado Manuel,
              conocido por todos como el "guardián del puerto". Manuel, con su
              sombrero de paja y su piel curtida por el sol, pasaba los días
              arreglando redes, enseñando a los más jóvenes a navegar y contando
              historias sobre criaturas marinas y misterios del océano."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailView;
