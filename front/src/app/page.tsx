"use client";

import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import Topbar from "@/components/Topbar";
import { RulesProvider } from "../context/RulesContext";
import { useState } from "react";

export default function Home() {
  const [activeView, setActiveView] = useState<"tickets" | "answered">(
    "tickets"
  );

  return (
    <RulesProvider>
      <div className="h-screen flex flex-col gap-8 px-4 pt-2">
        <Navbar />
        <div className="w-full h-full flex flex-col gap-2 border-2 border-b-0 p-4 rounded-t-md">
          <Topbar activeView={activeView} onViewChange={setActiveView} />
          <Table activeView={activeView} />
        </div>
      </div>
    </RulesProvider>
  );
}
