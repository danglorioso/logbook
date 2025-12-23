"use client";

import { useRef, useEffect } from "react";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedPlaneProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AnimatedPlane({ className, size = "md" }: AnimatedPlaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeWrapperRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  useEffect(() => {
    const handleMouseEnter = () => {
      const planeWrapper = planeWrapperRef.current;
      if (!planeWrapper) return;

      // Remove animation class to reset
      planeWrapper.classList.remove('plane-animating');
      
      // Force reflow to ensure the class removal is processed
      void planeWrapper.offsetWidth;
      
      // Add animation class back to restart animation
      planeWrapper.classList.add('plane-animating');
    };

    // Find the parent group element
    const parentGroup = containerRef.current?.closest('.group');
    if (parentGroup) {
      parentGroup.addEventListener('mouseenter', handleMouseEnter);
      return () => {
        parentGroup.removeEventListener('mouseenter', handleMouseEnter);
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block">
      <div ref={planeWrapperRef} className={cn("plane-fly-animation", className)}>
        <Plane className={sizeClasses[size]} />
      </div>
    </div>
  );
}

