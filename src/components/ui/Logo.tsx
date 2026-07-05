"use client";

import React from "react";

interface LogoProps {
  className?: string;
  height?: number;
}

export default function Logo({ className = "", height = 32 }: LogoProps) {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <img 
        src="/images/logo.jpeg" 
        alt="2all.ai Logo" 
        style={{ height: `${height}px`, width: "auto" }}
        className="object-contain"
      />
    </div>
  );
}
