import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Render as a more specific element when it carries meaning. */
  as?: "div" | "article" | "section" | "aside";
}

/** Generic bordered wrapper reused by product, cart, form, category and order UI. */
export default function Card({ children, className, as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
