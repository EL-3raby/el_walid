import React from "react";

interface GooglePlayLogoProps {
  className?: string;
  variant?: "color" | "monochrome";
}

/**
 * أيقونة متجر Google Play الرسمية
 * تدعم النمط الملوّن الأصلي بألوان جوجل الأربعة أو النمط الموحّد بلون النص
 */
export function GooglePlayLogo({
  className = "w-5 h-5 shrink-0",
  variant = "color",
}: GooglePlayLogoProps) {
  if (variant === "monochrome") {
    return (
      <svg
        className={className}
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96 2.694-1.586Zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055l7.294-4.295ZM1 13.396V2.603L6.846 8 1 13.396ZM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27Z" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 466 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* الأزرق (اليسار) */}
      <path
        fill="#4285F4"
        d="M1.39 41.86C0 46.04 0 51.63 0 57.2v397.64c0 5.57 0 9.76 1.4 15.34l216.27-214.86L1.39 41.86z"
      />
      {/* الأخضر (الأعلى) */}
      <path
        fill="#34A853"
        d="M199.42 273.45 329.27 145.1 87.9 8.37C79.53 2.79 68.36 0 57.2 0 30.7 0 6.98 18.14 1.4 41.86l198.02 231.59z"
      />
      {/* الأحمر (الأسفل) */}
      <path
        fill="#EA4335"
        d="M199.9 237.8 1.4 470.17c7.22 24.57 30.16 41.81 55.8 41.81 11.16 0 20.93-2.79 29.3-8.37l244.16-139.46L199.9 237.8z"
      />
      {/* الأصفر (اليمين) */}
      <path
        fill="#FBBC04"
        d="m433.91 205.1-104.65-60-111.61 110.22 113.01 108.83 104.64-58.6c18.14-9.77 30.7-29.3 30.7-50.23-1.4-20.93-13.95-40.46-32.09-50.22z"
      />
    </svg>
  );
}
