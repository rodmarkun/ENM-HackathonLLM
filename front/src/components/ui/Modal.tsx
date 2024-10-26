import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode, MouseEvent } from "react";

type Props = {
  children: ReactNode;
  onClose: () => void;
  className?: string;
};

export const Modal = ({ children, onClose, className }: Props) => {
  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed z-10 top-0 left-0 h-screen w-full bg-background bg-opacity-60 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      <div
        className={cn(
          "relative p-6 rounded-lg bg-background opacity-100",
          className
        )}
      >
        <Image
          src={"/Quit.svg"}
          alt={"Quit"}
          width={12}
          height={12}
          className="absolute top-4 right-4"
          onClick={onClose}
        />
        {children}
      </div>
    </div>
  );
};
