"use client";

import React from "react";

interface FooterProps {
  clientName: string;
}

export function Footer({ clientName }: FooterProps) {
  return (
    <footer className="w-full mt-auto pt-10 pb-8 text-center px-4 relative z-10">
      <div className="w-12 h-px bg-[#ABC8A3]/20 mx-auto mb-5" />
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-[#ABC8A3]/70">
        <span>{clientName}</span>
        <span className="hidden sm:inline opacity-30">•</span>
        <span>كل الحقوق محفوظة © {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
