import Navbar from "@/components/Navbar";
import { mockTickets } from "@/mocks";

type Props = {
  params: {
    slug: number;
  };
};

export default function Template({ params }: Props) {
  const idx = params.slug;

  return (
    <div className="h-screen flex flex-col gap-4 px-4 pt-2">
      <Navbar />
      <div>{mockTickets[idx - 1].name}</div>
    </div>
  );
}
