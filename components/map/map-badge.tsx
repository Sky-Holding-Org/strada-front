"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MapBadgeProps {
  name: string;
  type: "area" | "compound" | "property";
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function MapBadge({
  name,
  type,
  count,
  onClick,
  className,
}: MapBadgeProps) {
  const displayText = count && count > 0 ? `${name} +${count}` : name;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "bg-white/95 backdrop-blur-sm border border-gray-200/80",
        "shadow-sm hover:shadow-md transition-all duration-200",
        "text-gray-900 font-semibold text-xs",
        "px-3 py-1.5",
        onClick && "cursor-pointer hover:scale-105 hover:bg-white",
        type === "area" && "border-blue-200/60",
        type === "compound" && "border-gray-200",
        type === "property" && "border-green-200/60",
        className
      )}
      onClick={onClick}
    >
      {displayText}
    </Badge>
  );
}
