"use client";

import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedPlaneProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AnimatedPlane({ className, size = "md" }: AnimatedPlaneProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <div className="relative inline-block">
      <Plane className={cn(sizeClasses[size], "plane-fly-animation", className)} />
    </div>
  );
}

