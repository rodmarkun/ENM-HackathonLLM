import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
  size: "icon" | "none" | "md";
  color: "accent" | "muted" | "none";
  className?: string;
};

export const Button = ({
  children,
  onClick,
  size,
  color,
  className,
}: Props) => {
  const classes = {
    common: "rounded-md font-bold hover:opacity-70 transition duration-300",
    sizes: {
      icon: "p-[7px] sm:p-[9px] md:p-[13px]",
      none: "px-0 py-0",
      md: "text-sm sm:text-base px-4 py-2",
    },
    colors: {
      accent: "bg-accent",
      muted: "bg-muted",
      none: "",
    },
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        classes.common,
        classes.sizes[size],
        classes.colors[color],
        className
      )}
    >
      {children}
    </button>
  );
};
