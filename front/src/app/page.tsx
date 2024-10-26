import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import Topbar from "@/components/Topbar";
import { RulesProvider } from "../context/RulesContext";

export default function Home() {
  return (
    <RulesProvider>
      <div className="h-screen flex flex-col gap-4 px-4 pt-2">
        <Navbar />
        <div className="w-full h-full flex flex-col gap-2 border-2 border-b-0 p-4 rounded-t-md">
          <Topbar />
          <Table />
        </div>
      </div>
    </RulesProvider>
  );
}
