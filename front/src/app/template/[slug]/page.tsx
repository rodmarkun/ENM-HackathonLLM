import Navbar from "@/components/Navbar";

type Props = {
  params: {
    slug: string;
  };
};

export default function Template({ params }: Props) {
  return (
    <div className="h-screen flex flex-col gap-4 px-4 pt-2">
      <Navbar />
      <div>{params.slug}</div>
    </div>
  );
}
