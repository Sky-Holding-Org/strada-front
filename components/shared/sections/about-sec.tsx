"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AboutSecProps {
  title: string;
  content: string;
  expandable?: boolean;
  maxLines?: number;
}

export function AboutSec({
  title,
  content,
  expandable = true,
  maxLines = 3,
}: AboutSecProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = expandable && content.split("\n").length > maxLines;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[#05596B]">{title}</h3>
      <div
        className={`text-muted-foreground leading-relaxed text-justify ${
          !isExpanded && shouldTruncate ? "line-clamp-3" : ""
        }`}
      >
        {content}
      </div>
      {shouldTruncate && (
        <Button
          variant="link"
          className="text-primary p-0 h-auto"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "See Less" : "See More"}
        </Button>
      )}
    </div>
  );
}
