"use client"

import Navbar from "@/components/Navbar";
import TemplateInput from "@/components/Template/TemplateInput";
import { mockTickets } from "@/mocks";

type Props = {
  params: {
    slug: number;
  };
};

export default function Template({ params }: Props) {
  const idx = params.slug;
  const ticket = mockTickets[idx - 1];

  // Define a placeholder onClose function
  const handleClose = () => {
    console.log("Close button clicked");
  };

  return (
    <div className="h-screen flex flex-col gap-4 px-4 pt-2">
      <Navbar />
      <TemplateInput ticket={ticket} onClose={handleClose} />
    </div>
  );
}