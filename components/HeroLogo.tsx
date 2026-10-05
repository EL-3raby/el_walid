"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface HeroLogoProps {
  appName: string;
  isLaunched?: boolean;
}

export function HeroLogo({ appName, isLaunched = false }: HeroLogoProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // خصائص الفقاعات العشوائية الصاعدة من عنق الدورق الكيميائي
  const bubbles = [
    { id: 1, size: 6, left: "49%", delay: "0s", duration: "3.8s", drift: "-6px", color: "#ABC8A3" },
    { id: 2, size: 8, left: "51%", delay: "0.8s", duration: "4.4s", drift: "8px", color: "#F0E295" },
    { id: 3, size: 5, left: "48%", delay: "1.6s", duration: "3.5s", drift: "-10px", color: "#28729F" },
    { id: 4, size: 7, left: "52%", delay: "2.3s", duration: "4.8s", drift: "6px", color: "#ABC8A3" },
    { id: 5, size: 4, left: "50%", delay: "3.1s", duration: "3.9s", drift: "-4px", color: "#F0E295" },
    { id: 6, size: 9, left: "49.5%", delay: "1.2s", duration: "4.2s", drift: "11px", color: "#ABC8A3" },
  ];

  // درجة البلور المخففة الأنيقة
  const blurAmount = isLaunched
    ? "blur(0px)"
    : isHovered
    ? "blur(4px)"
    : "blur(9px)";

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[380px] md:max-w-[420px] mx-auto flex flex-col items-center select-none">
      {/* توهج محيطي عريض خافت خلف اللوح الزجاجي */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 sm:-inset-6 rounded-3xl opacity-35 blur-3xl pointer-events-none -z-10"
      >
        <Image
          src="/logo.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 300px, 420px"
          className="object-contain scale-110"
        />
      </div>

      {/* اللوح الزجاجي المصنفر الحاضن للشعار */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className="relative w-full p-4 sm:p-7 rounded-2xl sm:rounded-3xl glass-panel overflow-hidden transition-all duration-500 cursor-pointer group hover:border-[#ABC8A3]/50 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)]"
      >
        {/* علامات زوايا معملية دقيقة متناسقة مع كارت العداد تحتها */}
        <div aria-hidden="true" className="absolute top-2.5 left-2.5 text-[#ABC8A3]/40 text-[11px] font-mono select-none">⌜</div>
        <div aria-hidden="true" className="absolute top-2.5 right-2.5 text-[#ABC8A3]/40 text-[11px] font-mono select-none">⌝</div>
        <div aria-hidden="true" className="absolute bottom-2.5 left-2.5 text-[#ABC8A3]/40 text-[11px] font-mono select-none">⌞</div>
        <div aria-hidden="true" className="absolute bottom-2.5 right-2.5 text-[#ABC8A3]/40 text-[11px] font-mono select-none">⌟</div>

        {/* خط إطار داخلي رفيع جداً بلون الساج الفاخر */}
        <div aria-hidden="true" className="absolute inset-1.5 sm:inset-2 rounded-xl sm:rounded-2xl border border-[#ABC8A3]/15 pointer-events-none" />

        {/* شارة تشويقية أنيقة في أعلى اللوح */}
        {!isLaunched && (
          <div className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 px-4 sm:px-5 py-1 rounded-full bg-[#023A22]/95 border border-[#F0E295]/60 text-xs sm:text-sm text-[#F0E295] font-bold tracking-wider shadow-lg flex items-center gap-2 z-30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#F0E295] animate-ping" />
            <span>قريبًا</span>
          </div>
        )}

        {/* هالة داخلية خافتة */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,rgba(240,226,149,0.12)_0%,transparent_75%)]"
        />

        {/* فقاعات الدورق الكيميائي المتصاعدة */}
        {!shouldReduceMotion && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none overflow-visible z-20"
          >
            {bubbles.map((b) => (
              <span
                key={b.id}
                className="absolute rounded-full animate-bubble"
                style={
                  {
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                    left: b.left,
                    top: "34%",
                    backgroundColor: b.color,
                    "--bubble-duration": b.duration,
                    "--bubble-delay": b.delay,
                    "--drift-x": b.drift,
                    boxShadow: `0 0 6px ${b.color}88`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}

        {/* صورة الشعار مع البلور القوي المباشر على الصورة */}
        <div className="relative w-full aspect-square max-h-[300px] sm:max-h-[340px] flex items-center justify-center pt-2">
          <picture className="w-full h-full flex items-center justify-center">
            <source srcSet="/logo.webp" type="image/webp" />
            <img
              src="/logo.png"
              alt={`شعار ${appName}`}
              width={400}
              height={400}
              style={{
                filter: blurAmount,
                transition: "filter 0.5s ease, transform 0.5s ease",
                transform: isHovered && !isLaunched ? "scale(1.02)" : "scale(1)",
              }}
              className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
              loading="eager"
              decoding="async"
            />
          </picture>

          {/* طبقة حماية إضافية للغموض خفيفة وأنيقة */}
          {!isLaunched && (
            <div
              aria-hidden="true"
              style={{
                backdropFilter: isHovered ? "blur(2px)" : "blur(4px)",
                WebkitBackdropFilter: isHovered ? "blur(2px)" : "blur(4px)",
                transition: "backdrop-filter 0.5s ease, -webkit-backdrop-filter 0.5s ease",
              }}
              className="absolute inset-4 rounded-2xl pointer-events-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}
