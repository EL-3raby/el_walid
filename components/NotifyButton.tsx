"use client";

import React from "react";
import { launchConfig } from "@/config/launch";

interface NotifyButtonProps {
  buttonText: string;
  whatsappUrl: string;
}

export function NotifyButton({ buttonText, whatsappUrl }: NotifyButtonProps) {
  return (
    <div className="w-full max-w-xs mx-auto my-4 flex flex-col items-center">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-[#023A22] bg-[#F0E295] shadow-[0_4px_16px_-2px_rgba(240,226,149,0.3)] transition-all duration-300 hover:bg-[#fff5a8] hover:shadow-[0_8px_24px_-2px_rgba(240,226,149,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
      >
        {/* أيقونة WhatsApp */}
        <svg
          className="w-5 h-5 fill-current shrink-0 transition-transform group-hover:scale-110 duration-200"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1 1.6-.1 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.18-.06-.1-.23-.16-.48-.28z" />
        </svg>

        <span>{buttonText}</span>
      </a>

      <span className="text-[11px] text-[#ABC8A3]/70 mt-2 select-none text-center">
        {launchConfig.notification.subText}
      </span>
    </div>
  );
}
