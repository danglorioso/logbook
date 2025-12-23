"use client";

import { useState, useRef, useEffect } from "react";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedPlaneProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AnimatedPlane({ className, size = "md" }: AnimatedPlaneProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  useEffect(() => {
    const handleMouseEnter = () => {
      if (!isAnimating) {
        setIsAnimating(true);
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        // Remove the animation class after animation completes (1s)
        timeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
        }, 1000);
      }
    };

    // Find the parent group element
    const parentGroup = planeRef.current?.closest('.group');
    if (parentGroup) {
      parentGroup.addEventListener('mouseenter', handleMouseEnter);
      return () => {
        parentGroup.removeEventListener('mouseenter', handleMouseEnter);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [isAnimating]);

  return (
    <div ref={planeRef} className="relative inline-block">
      <Plane className={cn(sizeClasses[size], "plane-fly-animation", isAnimating && "plane-animating", className)} />
    </div>
  );
}

