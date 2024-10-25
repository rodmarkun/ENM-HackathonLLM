import Link from "next/link";

export default function Navbar() {
  return (
    <div className="border-2 mt-2 mr-2 rounded-lg  w-full flex items-center justify-between py-4 md:py-6 px-4 sm:px-9">
      <div className="font-bold text-accent text-lg md:text-xl">
        <Link href="/">NERDEVS</Link>
      </div>
    </div>
  );
}
