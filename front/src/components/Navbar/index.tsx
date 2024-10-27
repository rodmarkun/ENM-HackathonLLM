import Link from "next/link";
import Image from "next/image";
import TypingEffect from "@/components/ui/Typing";
import { Button } from "../ui/Button";

export default function Navbar() {
  return (
    <div className="border-2 mt-2 mr-2 rounded-lg  w-full flex items-center justify-between py-4 md:py-4 px-4 sm:px-9">
      <div className="flex items-center font-bold text-accent text-lg md:text-xl">
        <Image src={"/icon.png"} alt="Icon" width={40} height={24} className="mr-2" /> 
        <Link href="/"> NERDEVS: <TypingEffect text="ai customer support" speed={150} /></Link>
      </div>
    <div>      
      <Button onClick={() => {}} size="md" color="accent" className="flex items-center px-4 py-2 bg-accent rounded-full hover:bg-accent-600">
        <Image src={"/userIcon.png"} width={40} height={24} alt="userIconAlt" className="w-5 h-5 text-gray-600" />
      </Button>
    </div>
    </div>
  );
}